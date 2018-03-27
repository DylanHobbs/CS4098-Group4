angular.module('eventServices', [])
.factory('Event', function($http){
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

    eventFactory.moveUser = function(id, email, check){
        return $http.put('/api/viewEvent/moveUser/' + id +'/'+ email + '/' + check);
    }

    eventFactory.addGuest = function(id, number){
        return $http.put('/api/addGuest/' + id +'/'+ number);
    }

    eventFactory.viewEvent = function(id) {
        return $http.get('/api/editEvent/'+ id);
    };

    eventFactory.editEvent = function(id) {
        return $http.put('/api/editEvent', id);
    };

    eventFactory.addInfo = function(data) {
		return $http.put('/api/regGuest', data);
	}

    eventFactory.changeName = function(nameData){
		return $http.post('/api/changeEventName', nameData);
    }
    
    eventFactory.changeVenue = function(venueData){
		return $http.post('/api/changeVenueName', venueData);
    }
    
    eventFactory.changeDate = function(dateData){
		return $http.post('/api/changeEventDate', dateData);
	}

    eventFactory.emailAttendees = function(emailData){
        return $http.post('api/eventSend', emailData);
    }

    // add ticketData to this
    eventFactory.buyTicket = function(ticketData){
        return $http.post('api/buyTicket', ticketData);
    }

    eventFactory.decryptHash = function(decryptData){
        return $http.get('/api/decryptHash/' + decryptData);
    }

	return eventFactory;
});