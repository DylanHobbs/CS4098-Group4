angular.module('userServices', [])

// Angular Factory
// Custom functions eg register
.factory('User', function($http){
	userFactory = {};

	//User.create(regData) -> From DB
	userFactory.create = function(regData){
		return $http.post('/api/users', regData)
	}

	//User.activateAccount(token)
	userFactory.activateAccount = function(token){
		return $http.put('/api/activate/' + token)
	}

	return userFactory;
});
