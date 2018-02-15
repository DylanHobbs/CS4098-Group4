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
		controllerAs: 'email'
	})

	.when('/resend', {
		templateUrl: 'app/views/pages/users/activation/resend.html',
		controller: 'resendCtrl',
		controllerAs: 'resend'
	})

	.when('/resetUsername', {
		templateUrl: 'app/views/pages/users/reset/username.html',
		controller: 'usernameCtrl',
		controllerAs: 'username',
		authenticated: 'false'
	})

	// .when('/resetPassword', {
	// 	templateUrl: 'app/views/pages/users/reset/password.html',
	// 	controller: 'passwordCtrl',
	// 	controllerAs: 'password',
	// })

	.when('/editPassword', {
		templateUrl: 'app/views/pages/users/editDetails/editPassword.html',
		controller: 'editPwdCtrl',
		controllerAs: 'editPwd',
		authenticated: 'true'
	})

	.when('/editUsername', {
		templateUrl: 'app/views/pages/users/editDetails/editUsername.html',
		controller: 'editUsrCtrl',
		controllerAs: 'editUsr'
	})

	.when('/management', {
		templateUrl: 'app/views/pages/managment/management.html',
		controller: 'managmentCtrl',
		controllerAs: 'manage',
		authenticated: true,
		permission: ['admin']
	})

	.when('/edit/:id', {
		templateUrl: 'app/views/pages/managment/edit.html',
		controller: 'editCtrl',
		controllerAs: 'edit',
		authenticated: true,
		permission: ['admin']
	})

	.otherwise({redirectTo: '/'});

	// gets rid of hashes in urls
	$locationProvider.html5Mode({
		enabled: true,
		requireBase: false
	});

});

// Meat and potatos of route restriction
// Run a check on each route to see if user is logged in or not (depending on if it is specified in the individual route)
app.run(['$rootScope', 'Auth', '$location', 'User', function($rootScope, Auth, $location, User) {

    // Check each time route changes    
    $rootScope.$on('$routeChangeStart', function(event, next, current) {
        // Check if authentication is required on route
        if (next.$$route.authenticated == true) {
            // If authentication is required, make sure user is logged in
            if (!Auth.isLoggedIn()) {
                event.preventDefault(); // If not logged in, prevent accessing route
                $location.path('/'); // Redirect to home instead
            } else if (next.$$route.permission) {
				// Function: Get current user's permission to see if authorized on route
				User.getPermission().then(function(data) {
					// Check if user's permission matches at least one in the array
					if (next.$$route.permission[0] !== data.data.permission) {
						event.preventDefault(); // If at least one role does not match, prevent accessing route
						$location.path('/'); // Redirect to home instead
					}
				});
			}
        } else if (next.$$route.authenticated == false) {
            // If authentication is not required, make sure is not logged in
            if (Auth.isLoggedIn()) {
                event.preventDefault(); // If user is logged in, prevent accessing route
                $location.path('/profile'); // Redirect to profile instead
            }
        }
    });
}]);
