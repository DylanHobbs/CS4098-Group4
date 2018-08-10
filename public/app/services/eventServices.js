angular.module('eventServices', [])
.factory('Event', function($http){
    eventFactory = {};
   
    eventFactory.create = function(eventData){
        return $http.post('/api/createEvent', eventData);
    }

    eventFactory.getEvent = function(id){
        return $http.get('/api/viewEvent/'+ id);
    }

    eventFactory.viewEventWithDb = function(id){
        return $http.get('/api/viewEventWithDb/'+ id);
    }
    

    eventFactory.getEvents = function(){
        return $http.get('/api/events');
    }

    eventFactory.deleteEvent = function(id){
        return $http.delete('/api/deleteEvent/' + id);
    }

    eventFactory.removeUser = function(id, email){
        return $http.delete('/api/viewEvent/' + id +'/'+ email);
    }

    eventFactory.removeGuest = function(id, phone){
        return $http.delete('/api/viewEventGuest/' + id +'/'+ phone);
    }

    eventFactory.addUser = function(id, email, check){
        return $http.put('/api/viewEvent/' + id +'/'+ email + '/' + check);
    }

    eventFactory.moveUser = function(id, email, check){
        return $http.put('/api/viewEvent/moveUser/' + id +'/'+ email + '/' + check);
    }

    eventFactory.RSVP = function(id){
        return $http.put('/api/RSVP/' +  id);
    }

    eventFactory.unRSVP = function(id){
        return $http.delete('/api/unRSVP/' +  id);
    }

    eventFactory.checkAttending = function(id){
        return $http.get('/api/viewEventUser/' +  id);
    }


    eventFactory.addGuest = function(id, number){
        return $http.put('/api/addGuest/' + id +'/'+ number);
    }

    eventFactory.viewEvent = function(id) {
        return $http.get('/api/editEvent/'+ id);
    };

    eventFactory.viewEventUser = function(id) {
        return $http.get('/api/viewEventUser/'+ id);
    };

    eventFactory.editEvent = function(id) {
        return $http.put('/api/editEvent', id);
    };

    eventFactory.addInfo = function(data) {
		return $http.put('/api/regGuest', data);
	}

    eventFactory.changeName = function(nameData){
		return $http.post('/api/changeName', nameData);
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