angular.module('authServices', [])

// For authenticating user
.factory('Auth', function($http, AuthToken){
	var authFactory = {};
	
	// Preforms login action
	authFactory.login = function(loginData){
		return $http.post('/api/authenticate', loginData)
		.then(function(data){
			AuthToken.setToken(data.data.token);
			return data;
		});
	};

	// Auth.isLoggedIn();
	// Checks user logged in by token presence
	authFactory.isLoggedIn = function(){
		if(AuthToken.getToken()){
			return true;
		} else {
			return false;
		}
	};

	authFactory.logout = function(){
		AuthToken.removeToken();
	};

	authFactory.getUser = function(){
		if(AuthToken.getToken()){
			return $http.post('/api/me');
		} else {
			$q.reject({ message: 'User has no token' });
		}
	}

	return authFactory;
})

.factory('AuthToken', function($window){
	var authTokenFactory = {};
	// Sets token into cookie
	// AuthToken.setToken(token);
	authTokenFactory.setToken = function(token){
		// If token is provided - set it
		$window.localStorage.setItem('token', token);
	};

	authTokenFactory.removeToken = function(){
		// remove the token
		$window.localStorage.removeItem('token');
	};

	// AuthToken.getToken();
	// Gets the token from the cookie
	authTokenFactory.getToken = function(){
		return $window.localStorage.getItem('token');
	};

	return authTokenFactory;
})

// Injecting token into every request
.factory('AuthIntercept', function(AuthToken){
	var authInterceptFactory = {};

	authInterceptFactory.request = function(config){
		// Get token
		var token = AuthToken.getToken();
		if(token){
			config.headers['x-access-token'] = token;
		}
		return config;
	};

	return authInterceptFactory
});