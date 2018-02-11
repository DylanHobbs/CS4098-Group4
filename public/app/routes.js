// ****************************************************************************
// *                              Frontend Routes                             *
// ****************************************************************************
var app = angular.module('appRoutes', ['ngRoute'])

.config(function($routeProvider, $locationProvider){
	$routeProvider

	.when('/', {
		templateUrl: 'app/views/pages/home.html'
	})

	.when('/about', {
		templateUrl: 'app/views/pages/about.html'
	})

	.when('/register', {
		templateUrl: 'app/views/pages/users/register.html',
		controller: 'regCtrl',
		controllerAs: 'register',

		// Prevent logged in users from getting here
		authenticated: false
	})

	.when('/login', {
		templateUrl: 'app/views/pages/users/login.html',

		// Prevent logged in users from getting here
		authenticated: false
	})

	.when('/logout', {
		templateUrl: 'app/views/pages/users/logout.html',

		// Prevent logged in users from getting here
		authenticated: true
	})

	.when('/profile', {
		templateUrl: 'app/views/pages/users/profile.html',

		// Prevent logged in users from getting here
		authenticated: true
	})

	.when('/activate/:token', {
		templateUrl: 'app/views/pages/users/activation/activate.html',
		controller: 'emailCtrl',
		controllerAs: 'email',
		// Prevent logged in users from getting here
		authenticated: false
	})

	.otherwise({redirectTo: '/'});

	// gets rid of hashes in urls
	$locationProvider.html5Mode({
		enabled: true,
		requireBase: false
	});

});

// Meat and potatos of route restriction
app.run(['$rootScope', 'Auth', '$location', function($rootScope, Auth, $location){
	$rootScope.$on('$routeChangeStart', function(event, next, current){
		// Grabs next route and checks if it requires auth
		if(next.$$route.authenticated == true){
			if(!Auth.isLoggedIn()){
				// They're not logged in, don't let em come here
				event.preventDefault();
				// Bring them back whence they came! (or home works)
				$location.path('/')
			}
		} else if(next.$$route.authenticated == false){
			if(Auth.isLoggedIn()){
				// They ARE logged in. BEGONE! Man these double negs confuse me
				event.preventDefault();
				$location.path('/profile')
			}
		} 
	});
}]);
