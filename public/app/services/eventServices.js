angular.module('eventServices', [])
.factory('Event', function($http){
    // //User.create(regData) -> From DB
	// userFactory.create = function(regData){
	// 	return $http.post('/api/users', regData);
    // }
    eventFactory = {};
   
    eventFactory.create = function(eventData){
        return $http.post('/api/createEvent', eventData);
    }


	return userFactory;
});