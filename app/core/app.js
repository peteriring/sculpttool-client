angular

.module('sculptClient', [
	'ngAnimate',
	'ngCookies',
	'ngResource',
	'ngRoute',
	'ngSanitize',
	'ngTouch',

    'ui.router', 
    'ui.bootstrap',
    'btford.socket-io',
    'config'
])

.config(function ($stateProvider) {

	$stateProvider

	.state('app', {
        abstract: true,
        templateUrl: 'core/header.html'
    })

	.state('app.landing', {
		url: '/landing',
	    templateUrl: 'landing/view.html',
	    controller: 'LandingController',
        data: {
            title: 'LandingPage'
        }
	})

	.state('app.login', {
		url: '/landing',
	    templateUrl: 'landing/view.html',
	    controller: 'LandingController',
        data: {
            title: 'LandingPage'
        }
	})

	.state('app.canvas', {
		url: '/canvas',
	    templateUrl: 'canvas/view.html',
	    controller: 'CanvasController',
        data: {
            title: 'Canvas'
        }
	});
})

.run(function ($rootScope, $state) {

	$rootScope.state = $state;
	$state.go('app.canvas');
});