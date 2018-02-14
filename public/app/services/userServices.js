angular.module('userServices', [])

// Angular Factory
// Custom functions eg register
.factory('User', function($http){
	userFactory = {};

	//User.create(regData) -> From DB
	userFactory.create = function(regData){
		return $http.post('/api/users', regData);
	}

	//User.activateAccount(token)
	userFactory.activateAccount = function(token){
		return $http.put('/api/activate/' + token);
	}

	// User.checkCredentials(loginData)
	userFactory.checkCredentials = function(loginData){
		return $http.post('/api/resend', loginData);
	}

	// User.resendLink(userName)
	userFactory.resendLink = function(username){
		return $http.put('/api/resend', username);
	}

	// User.sendUsername(userData)
	userFactory.sendUsername = function(userData){
		return $http.get('/api/resetUsername/', userData);
	}

	// User.changePassword(userData)
	// Resue check credentials
	userFactory.changePassword = function(pwdData){
		return $http.post('/api/changePassword', pwdData);
	}

	userFactory.changeUsername = function(usrData){
		return $http.post('/api/changeUsername', usrData);
	}


	userFactory.getPermission = function(){
		return $http.get('/api/permission/');
	}

	userFactory.getUsers = function(){
		return $http.get('/api/management/');
	}

	userFactory.deleteUser = function(username){
		return $http.delete('/api/management/' + username)
	}

	return userFactory;
});
