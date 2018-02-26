angular.module('eventController', ['eventServices'])
.controller('eventCtrl', function(Event, $scope, $routeParams){

    // TODO: 
    // these may or may not be needed
    // $scope.searchWord = "admin";
    // $scope.searchKey = "host";
    // 
    // 
    var app = this;
    app.limit = 10;
    // console.log('hello from event controller');

    // Trying to display the test event from the database

    function getEvents(){
        Event.getEvents().then(function(data){
            
            if(data.data.success){
                if(data.data.permission === 'admin'){
                    //console.log(data.data.events);
                    app.events = data.data.events;
                    app.loading = false;
                    app.accessDenied = false;
                } else {
                    app.failMsg = "No permissions to access this feature";
                    app.loading = false;
                }
            } else {
                app.failMsg = data.data.message;
                app.loading = false;
            }
        });
    }

    getEvents();


})

.controller('createEventCtrl', function(Event){
    app = this;
    app.loading = false;
    console.log('hello from creat event controller');

    app.createEvent = function(eventUser){
        console.log("I'm in the func")
        Event.createEvent(eventData)
        .then(function(){
            app.successMsg = eventData.message;
            // window.location.reload(true);
        });
    };
})

.controller('editEventCtrl', function($scope, Event, $routeParams, $timeout){
    var app = this;
    
    app.failMsg = false;
    Event.viewEvent($routeParams.id).then(function(data){
        if(data.data.success){
            
            $scope.newName = data.data.event.name;
            $scope.newVenue = data.data.event.venue;
            $scope.newDate = data.data.event.date;
            $scope.newSeats = data.data.event.seatsPer;
            $scope.newTables = data.data.event.tables;
            app.currentEventID = data.data.event._id;
        } else {
            app.failMsg = data.data.message;
        }
    });

    app.updateDetails = function(newName,newVenue, newDate, newTables, newSeats){
        var eventObject = {};
        app.disabled = true;
        app.failMsg = false;

        eventObject.name = $scope.newName;
        eventObject.venue = $scope.newVenue;
        eventObject.date = $scope.newDate;
        eventObject.seatsPer = $scope.newSeats;
        eventObject.tables = $scope.newTables;
        eventObject._id = app.currentEventID;
        Event.editEvent(eventObject).then(function(data){
            
            if(data.data.success){
                app.successMsg = data.data.message;
                $timeout(function(){
                    $scope.newName = newName;
                    $scope.newVenue = newVenue;
                    $scope.newDate = newDate;
                    $scope.newSeats = newSeats;
                    $scope.newTables = newTables;
                    app.successMsg = false;
                    app.disabled = false;
                }, 2000)
            } else {
                app.failMsg = data.data.message;
                app.disabled = false;
            }
        });
    };

    app.updateEventName = function(newName){
        var eventObject = {};
        app.disabled = true;
        app.failMsg = false;

        eventObject.name = $scope.newName;
        eventObject._id = app.currentEventID;
        Event.editEvent(eventObject).then(function(data){
            if(data.data.success){
                app.successMsg = data.data.message;
                $timeout(function(){
                    $scope.newName = newName;
                    app.successMsg = false;
                    app.disabled = false;
                }, 2000)
            } else {
                app.failMsg = data.data.message;
                app.disabled = false;
            }
        });
    };

    app.updateVenue = function(newVenue){
        var eventObject = {};
        app.disabled = true;
        app.failMsg = false;

        eventObject.venue = $scope.newVenue;
        eventObject._id = app.currentEventID;
        Event.editEvent(eventObject).then(function(data){
            if(data.data.success){
                app.successMsg = data.data.message;
                $timeout(function(){
                    $scope.newVenue = newVenue;
                    app.successMsg = false;
                    app.disabled = false;
                }, 2000)
            } else {
                app.failMsg = data.data.message;
                app.disabled = false;
            }
        });
    };

    app.updateDate = function(newDate){
        var eventObject = {};
        app.disabled = true;
        app.failMsg = false;

        eventObject.date = $scope.newDate;
        eventObject._id = app.currentEventID;
        Event.editEvent(eventObject).then(function(data){
            if(data.data.success){
                app.successMsg = data.data.message;
                $timeout(function(){
                    $scope.newDate = newDate;
                    app.successMsg = false;
                    app.disabled = false;
                }, 2000)
            } else {
                app.failMsg = data.data.message;
                app.disabled = false;
            }
        });
    };

    app.updateTables = function(newTables){
        var eventObject = {};
        app.disabled = true;
        app.failMsg = false;

        eventObject.tables = $scope.newTables;
        eventObject._id = app.currentEventID;
        Event.editEvent(eventObject).then(function(data){
            if(data.data.success){
                app.successMsg = data.data.message;
                $timeout(function(){
                    $scope.newTables = newTables;
                    app.successMsg = false;
                    app.disabled = false;
                }, 2000)
            } else {
                app.failMsg = data.data.message;
                app.disabled = false;
            }
        });
    };

    app.updateSeats = function(newSeats){
        var eventObject = {};
        app.disabled = true;
        app.failMsg = false;

        eventObject.seats = $scope.newSeats;
        eventObject._id = app.currentEventID;
        Event.editEvent(eventObject).then(function(data){
            if(data.data.success){
                app.successMsg = data.data.message;
                $timeout(function(){
                    $scope.newSeats = newSeats;
                    app.successMsg = false;
                    app.disabled = false;
                }, 2000)
            } else {
                app.failMsg = data.data.message;
                app.disabled = false;
            }
        });
    };

})


.controller('viewEventCtrl', function(Event, $scope, $routeParams){
    var app = this;
		
    $scope.checkInvited = 1;
    $scope.checkAttending = 0;

    Event.getEvent($routeParams.id)
    .then(function(data){
        
        if(data.data.success){
            app.invitedUsers = data.data.invitedUsers;
            app.rsvpUsers = data.data.rsvpUsers;
        } else {
            app.failMsg = data.data.message;
            app.loading = false;
        }
            
    });

    app.removeUser = function(email){
        Event.removeUser($routeParams.id,email).then(function(data){
            if(data.data.success){
                console.log(data.data.message);
                window.location.reload(true);
            } else {
                app.failMsg = data.data.message;
                console.log(data.data.message);
            }
        });
    }

    app.addUser = function(email, check){
        Event.addUser($routeParams.id,email,check).then(function(data){
            if(data.data.success){
                console.log(data.data.message);
                window.location.reload(true);
            } else {
                app.failMsg = data.data.message;
                console.log(data.data.message);
            }
        });
    }
});


