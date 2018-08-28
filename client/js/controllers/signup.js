// Copyright IBM Corp. 2015. All Rights Reserved.
// Node module: loopback-example-angular
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

angular
	.module('app')
	.controller('SignUpController', ['$scope', '$state', 'User', '$location', '$cookies',
	function($scope, $state, User, $location, $cookies) {

		var email = $cookies.get('user');

		if( email && email != null )
		{
			var id = $cookies.get('id');

        	var emailUrl = email + ' ' + id;

        	$location.path('/home/' + emailUrl.replace(/\s+/g, '-').toLowerCase());
			return false;
		}

		$scope.user = {

			userName: '',
			password: ''
		};

		$scope.addUser = function() {
	      User
	        .create({
	        	email: $scope.user.userName,
	        	password: $scope.user.password
	        })
	        .$promise
	        .then(function( res ) {

	        	$cookies.put('user', res.email);

	        	$location.path('/login');
	        })
	        .catch(function( err ) {
	        	console.log( err );
	        });
	    };

	}])
	.controller('HomeController', ['$scope', '$state', 'User', 'Media', '$location', '$cookies',
	function($scope, $state, User, Media, $location, $cookies) {
		
		var email = $cookies.get('user');

		if( !email || email == null )
		{
        	$location.path('/login');
			return false;
		}

		$scope.user = {

			details: null,
			userName: email,
			list: [],
			img: {

				source: '-1',
				caption: '',
				link: ''
			}
		};

		User
		.findById(
		{
			id: $cookies.get('id')
		})
		.$promise
		.then(function(results) {
			$scope.user.details = results;
		})
		.catch(function( err ) {

			$cookies.remove('user');
			$cookies.remove('id');
			$cookies.remove('token');
			
        	$location.path('/login');
			console.log(err);
		});

		$scope.addPhoto = function() {
			
			Media
			.create({
				img: $scope.user.img.link,	
				clickedBy: $cookies.get('id'),
				caption: $scope.user.img.caption,
				source: $scope.user.img.source
			})
			.$promise
			.then(function() {
				console.log('created successfully...');

				$scope.user.img.link = '';
				$scope.user.img.caption = '';
				$scope.user.img.source = '';

				$scope.getPhoto();
			})
			.catch(function( err ) {

	        	$location.path('/login');
				console.log(err);
			});
		};

		$scope.getPhoto = function() {
			
			Media
			.find({
				clickedBy: $cookies.get('id')
			})
			.$promise
			.then(function( mediaRes ) {
					
				$scope.user.list = mediaRes;

				console.log(mediaRes);
			})
			.catch(function( mediaErr ) {
						
			});

		};

		$scope.getPhoto();

	}])
	.controller('LoginController', ['$scope', '$state', 'User', 'Media', '$location', '$cookies',
	function($scope, $state, User, Media, $location, $cookies) {
		
		var email = $cookies.get('user');

		if( email && email != null )
		{
			var id = $cookies.get('id');

			if( id && id != null )
			{
	        	var emailUrl = email + ' ' + id;

	        	$location.path('/home/' + emailUrl.replace(/\s+/g, '-').toLowerCase());
				return false;
			}
		}

		$scope.user = {

			details: null,
			userName: email,
			password: null
		};

		$scope.login = function() {

			User
				.login({
					email: $scope.user.userName,
					password: $scope.user.password
				})
				.$promise
				.then(function( loginRes ) {

		        	$cookies.put('id', loginRes.userId);
		        	$cookies.put('user', loginRes.user.email);
		        	$cookies.put('token', loginRes.id);

		        	var emailUrl = loginRes.user.email + ' ' + loginRes.userId;
							
		        	$scope.user.userName = '';
		        	$scope.user.password = '';

		        	console.log(emailUrl);

		        	$location.path('/home/' + emailUrl.replace(/\s+/g, '-').toLowerCase());
				})
				.catch(function( loginErr ) {

					$cookies.remove('user');
					$cookies.remove('id');
					$cookies.remove('token');
					
					console.log( loginErr );		
				});
		};

	}]);
