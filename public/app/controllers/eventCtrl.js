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
                // if(data.data.permission === 'admin'){
                //     //console.log(data.data.events);
                    app.events = data.data.events;
                    app.loading = false;
                    app.accessDenied = false;
                // } else {
                //     app.failMsg = "No permissions to access this feature";
                //     app.loading = false;
                // }
            } else {
                app.failMsg = data.data.message;
                app.loading = false;
            }
        });
    }

    getEvents();


})

.controller('createEventCtrl', function($location, $timeout, $http, Event){
    app = this;
    app.loading = false;
    app.disabled = false;

    this.createEvent = function(eventData){
        // Disable inputs when submitted
        app.disabled = true;
        // show to loading spinner
        app.loading = true;
        // Set any existing errors to false
        app.failMsg = false;
        Event.create(app.eventData)
        .then(function(data){
            if(data.data.success){
                console.log(data);
                app.loading = false;
                app.successMsg = data.data.message + '.. Redirecting you back to events';
                $timeout(function(){
					app.successMsg = false;
					$location.path('/events');
				}, 2000);
            } else {
                app.loading = false;
                app.disabled = false;
                app.failMsg = data.data.message;
            }
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
            var thisEvent = data.data.event;
            app.name = thisEvent.name;
            app.id = thisEvent._id;
            app.seats = thisEvent.seatsPer;
            app.tables = thisEvent.tables;
            app.date = thisEvent.date;
            app.description = thisEvent.description;
            app.venue = thisEvent.venue;
            app.menu = thisEvent.menu;
            app.dietary = thisEvent.dietary;
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
                console.log(data.data);
                window.location.reload(true);
            } else {
                app.failMsg = data.data.message;
                console.log(data.data.message);
            }
        });
    }

    app.moveUser = function(email, check){
        console.log('ye')
        Event.moveUser($routeParams.id,email,check).then(function(data){
            if(data.data.success){
                console.log(data.data.message);
                window.location.reload(true);
            } else {
                app.failMsg = data.data.message;
                console.log(data.data.message);
            }
        });
    }
})

.controller('viewEventUserCtrl', function(Event, $scope, $routeParams){
    var app = this;

    $scope.checkInvited = 1;
    $scope.checkAttending = 0;
    console.log("viewEventUserCtrl here!!!")
    console.log("used this id to search" + $routeParams.id);
    Event.getEvent($routeParams.id)
    .then(function(data){
        console.log(data.data.event)
        if(data.data.success){
            var thisEvent = data.data.event;
            app.name = thisEvent.name;
            app.id = thisEvent._id;
            app.seats = thisEvent.seatsPer;
            app.tables = thisEvent.tables;
            //console.log("thisEvent.tables" + thisEvent.tables);
            app.date = thisEvent.date;
            app.description = thisEvent.description;
            app.venue = thisEvent.venue;
            app.menu = thisEvent.menu;
            app.dietary = thisEvent.dietary;
            app.invitedUsers = data.data.invitedUsers;
            app.rsvpUsers = data.data.rsvpUsers;
            app.eventId = $routeParams.id;
        } else {
            console.log("no event???");
            app.failMsg = data.data.message;
            app.loading = false;
        }
            
    });

})
.controller('purchaseTicketCtrl', function(Event, $scope, $routeParams){
    var app = this;

    console.log("purchaseTicketCtrl here!!!")
    Event.getEvent($routeParams.id)
    .then(function(data){
        console.log(data.data.event)
        if(data.data.success){
            var thisEvent = data.data.event;
            app.name = thisEvent.name;
            app.id = thisEvent._id;
            app.seats = thisEvent.seatsPer;
            app.tables = thisEvent.tables;
            //console.log("thisEvent.tables" + thisEvent.tables);
            app.date = thisEvent.date;
            app.description = thisEvent.description;
            app.venue = thisEvent.venue;
            $scope.seatsLeft = 10;
            $scope.tablesLeft = 2;
            $scope.getNumber = function(num){
                return new Array(num);
            }
        } else {
            console.log("no event???");
            app.failMsg = data.data.message;
            app.loading = false;
        }      
    });
    //
    app.submitTicket = function(ticketData){
        // var seat = $scope.document.getElementById("seatSel");
        // var table = $scope.document.getElementById("tableSel");

        // seatValue = seat.options[seat.selectedIndex].text;
        // tableValue = table.options[table.selectedIndex].text;

        // console.log("Seat VALUE ==" + seatValue);
        // console.log("table VALUE ==" + tableValue);
        
        console.log("OHH hey there submitTicket")
        console.log("seat :"+ app.ticketData.seat);
        console.log("table :" + app.ticketData.table);
        // console.log(ticketData.seat)
        // console.log(ticketData.table)
        // var ticketData;
        // ticketData.
         // Event.buyTicket(ticketData)
         Event.buyTicket(app.ticketData)
         .then(function(data){

             if(data.data.success){

             } else{
                
             }
        
        });
    }

});



