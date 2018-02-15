angular.module('mainController', ['authServices', 'userServices'])

.controller('mainCtrl', function(Auth, $timeout, $location, $rootScope, User){
	var app = this;

	// To prevent angular shtuff showing up after html loads
	// (if you refresh a bunch you'll see it)
	// Set it all to false to see some old skool
	app.loadme = false;

	// Everytime a route change, this function runs
	// Checking for username so it doesnt show after logout and stuff
	$rootScope.$on('$routeChangeStart', function(){
		// Check user is logged in?
		if(Auth.isLoggedIn()){
			app.isLoggedIn = true;
			Auth.getUser().then(function(data){
				// Allow it to be accessed from front end
				app.username = data.data.username;
				console.log(app.username);
				app.useremail = data.data.email;
				app.fullname = data.data.name;
				User.getPermission().then(function(data){
					if(data.data.permission == 'admin'){
						app.admin = true;
						app.loadme = true;
					} else if(data.data.permission == 'host'){
						app.host = true;
						app.loadme = true;
					} else {
						app.loadme = true;
					}
				});
			});
		} else {
			app.isLoggedIn = false;
			app.username = '';

			// Load shtuff now anyway
			app.loadme = true;
		}
	});

	this.doLogin = function(loginData){
		app.linkFail = false;
		app.loading = true;
		app.failMsg = false;
		app.disabled = false;
		//http://localhost:8080/api/authenticate
		Auth.login(app.loginData)
		.then(function(data){
			if(data.data.success){
				app.loading = false;
				app.successMsg = data.data.message + '... Redirecting';
				$timeout(function(){
					app.successMsg = false;
					app.loginData = '';
					$location.path('/about');
				}, 2000);
			} else if(data.data.linkFail){
				app.loading = false;
				app.linkFail = true;
				app.disabled = true;
				app.failMsg = data.data.message;
			} else {
				app.loading = false;
				app.failMsg = data.data.message;
			}
		});
	};

	this.logout = function(){
		Auth.logout();
		// Redirect to logout page
		$location.path('/logout');
		$timeout(function() {
			$location.path('/');
		}, 2000);
	};
});



