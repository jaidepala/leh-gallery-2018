// Copyright IBM Corp. 2015,2016. All Rights Reserved.
// Node module: loopback-example-angular
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

angular
    .module('app', [
        'lbServices',
        'ui.router',
        'ngCookies'
    ])
    .config(['$stateProvider', '$urlRouterProvider', 
    function($stateProvider, $urlRouterProvider) {
        $stateProvider
            // .state('todo', {
            //     url: '',
            //     templateUrl: 'views/todo.html',
            //     controller: 'TodoController'
            // })
            .state('home', {
                url: '/home/:user',
                templateUrl: 'views/home.html',
                controller: 'HomeController'
            })
            .state('signup', {
                url: '/signup',
                templateUrl: 'views/signup.html',
                controller: 'SignUpController'
            })
            .state('login', {
                url: '/login',
                templateUrl: 'views/login.html',
                controller: 'LoginController'
            });

        $urlRouterProvider.otherwise('home');
    }]);
