// Copyright IBM Corp. 2015. All Rights Reserved.
// Node module: loopback-example-angular
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

angular
	.module('app')
	.controller('SignUpController', ['$scope', '$state', 'User', '$location', '$cookies',
	function($scope, $state, User, $location, $cookies) {

		var email = $cookies.user;

		if( email && email != null )
		{
			var id = $cookies.id;

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

	        	$cookies.user = res.email;

	        	$location.path('/login');
	        })
	        .catch(function( err ) {
	        	console.log( err );
	        });
	    };

	}])
	.controller('HomeController', ['$scope', '$state', 'User', 'Media', '$location', '$cookies',
	function($scope, $state, User, Media, $location, $cookies) {
		
		var email = $cookies.user;

		if( !email || email == null )
		{
			var id = $cookies.id;

			if( !id || id == null )
			{
				$location.path('/login');
				return false;
			}
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
			id: $cookies.id
		})
		.$promise
		.then(function(results) {
			$scope.user.details = results;

			$scope.getPhoto();
		})
		.catch(function( err ) {

			delete $cookies.user;
			delete $cookies.id;
			delete $cookies.token;
			
        	$location.path('/login');
			console.log(err);
		});

		$scope.redirectToSignup = function() {

			delete $cookies.user;
			delete $cookies.id;
			delete $cookies.token;
			
        	$location.path('/login');
		};

		$scope.addPhoto = function() {
			
			Media
			.create({
				img: $scope.user.img.link,	
				clickedBy: $cookies.id,
				caption: $scope.user.img.caption,
				source: $scope.user.img.source
			})
			.$promise
			.then(function() {
				
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
				clickedBy: $cookies.id
			})
			.$promise
			.then(function( mediaRes ) {
					
				$scope.user.list = mediaRes;
			})
			.catch(function( mediaErr ) {
						
			});
		};

	}])
	.controller('LoginController', ['$scope', '$state', 'User', 'Media', '$location', '$cookies',
	function($scope, $state, User, Media, $location, $cookies) {
		
		var email = $cookies.user;

		if( email && email != null )
		{
			var id = $cookies.id;

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

		        	$cookies.id = loginRes.userId;
		        	$cookies.user = loginRes.user.email;
		        	$cookies.token = loginRes.id;

		        	var emailUrl = loginRes.user.email + ' ' + loginRes.userId;
							
		        	$scope.user.userName = '';
		        	$scope.user.password = '';

		        	$location.path('/home/' + emailUrl.replace(/\s+/g, '-').toLowerCase());
				})
				.catch(function( loginErr ) {

					delete $cookies.user;
					delete $cookies.id;
					delete $cookies.token;
					
					console.log( loginErr );		
				});
		};

	}]);
