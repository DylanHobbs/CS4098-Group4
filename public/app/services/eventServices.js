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

    eventFactory.getEvent = function(id){
        return $http.get('/api/viewEvent/'+ id);
    }

    eventFactory.getEvents = function(){
        return $http.get('/api/events');
    }

    eventFactory.removeUser = function(id, email){
        return $http.delete('/api/viewEvent/' + id +'/'+ email);
    }

    eventFactory.addUser = function(id, email, check){
        return $http.put('/api/viewEvent/' + id +'/'+ email + '/' + check);
    }


    eventFactory.viewEvent = function(id) {
        return $http.get('/api/editEvent/'+ id);
    };

    eventFactory.editEvent = function(id) {
        return $http.put('/api/editEvent', id);
    };

    eventFactory.changeName = function(nameData){
		return $http.post('/api/changeEventName', nameData);
    }
    
    eventFactory.changeVenue = function(venueData){
		return $http.post('/api/changeVenueName', venueData);
    }
    
    eventFactory.changeDate = function(dateData){
		return $http.post('/api/changeEventDate', dateData);
	}

	return eventFactory;
});