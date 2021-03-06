angular.module('eventController', ['eventServices', 'userServices'])
.controller('eventCtrl', function(Event, $scope, $routeParams, $route){

    // TODO: 
    // these may or may not be needed
    // $scope.searchWord = "admin";
    // $scope.searchKey = "host";
    // 
    // 
    var app = this;
    app.limit = 10;
    app.failMsg = false;
    app.successMsg = false;
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

    app.deleteEvent = function(id){
        console.log("delete")
        Event.deleteEvent(id).then(function(data){
            if(data.data.success){
                app.successMsg = data.data.message;
                app.failMsg = false;
                $route.reload();
            } else {
                app.failMsg = "Could not delete event"
            }
        })
    }

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

.controller('editEventCtrl', function($location,$scope, Event, $routeParams, $timeout){
    var app = this;
    
    app.failMsg = false;
    Event.viewEvent($routeParams.id).then(function(data){
        if(data.data.success){
            
            $scope.newName = data.data.event.name;
            $scope.newVenue = data.data.event.venue;
            $scope.newDate = data.data.event.date;
            $scope.newSeats = data.data.event.seatsPer;
            $scope.newTables = data.data.event.tables;
            $scope.newDescription = data.data.event.description;
            $scope.newMenu = data.data.event.menu;
            app.currentEventID = data.data.event._id;
        } else {
            app.failMsg = data.data.message;
        }
    });

    app.updateDetails = function(newName,newVenue, newDate, newTables, newSeats, newDescription, newMenu){
        var eventObject = {};
        app.disabled = true;
        app.failMsg = false;

        eventObject.name = $scope.newName;
        eventObject.venue = $scope.newVenue;
        eventObject.date = $scope.newDate;
        eventObject.seatsPer = $scope.newSeats;
        eventObject.tables = $scope.newTables;
        eventObject.description = $scope.newDescription;
        eventObject.menu = $scope.newMenu;
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
                    $scope.newDescription =newDescription;
                    $scope.newMenu = newMenu;

                    app.successMsg = false;
                    app.disabled = false;
                    $location.path('/events');
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
            app.guestrsvp = data.data.rsvpGuests;
            console.log(app.guestrsvp)
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

    app.removeGuest = function(phone){
        console.log("hi there from remove guest");
        Event.removeGuest($routeParams.id,phone).then(function(data){
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

.controller('viewEventUserCtrl', function(User, Event, $scope, $routeParams, $timeout){
    var app = this;
    app.disabled = true;
    $scope.checkInvited = 1;
    $scope.checkAttending = 0;
    // console.log("viewEventUserCtrl here!!!")
    // console.log("used this id to search" + $routeParams.id);

    Event.viewEventUser($routeParams.id).then(function(data){
        if(data.data.success){
            console.log(data.data);
            app.attending = data.data.attending;

            var thisEvent = data.data.event;
            
            app.name = thisEvent.name;
            app.id = thisEvent._id;
            app.seats = thisEvent.seatsPer;
            app.tables = thisEvent.tables;
            app.eventId = thisEvent.eventId;
            //console.log("thisEvent.tables" + thisEvent.tables);
            app.date = thisEvent.date;
            app.description = thisEvent.description;
            app.venue = thisEvent.venue;
            app.menu = thisEvent.menu;
            app.dietary = thisEvent.dietary;
            app.invitedUsers = data.data.invitedUsers;
            app.rsvpUsers = data.data.rsvpUsers;
            app.eventId = $routeParams.id;
        }
        app.disabled = false;
    });

    app.RSVP = function(email){
        Event.RSVP($routeParams.id).then(function(data){
            if(data.data.success){
                console.log(data.data.message);
                window.location.reload(true);
                $timeout(function(){
                    app.successMsg = false;
                    app.disabled = false;
                }, 2000)
            } else {
                app.failMsg = data.data.message;
                console.log(data.data.message);
            }
        });
    }

    app.unRSVP = function(email){
        Event.unRSVP($routeParams.id).then(function(data){
            if(data.data.success){
                console.log(data.data.message);
                window.location.reload(true);
                $timeout(function(){
                    app.successMsg = false;
                    app.disabled = false;
                }, 2000)
            } else {
                app.failMsg = data.data.message;
                console.log(data.data.message);
            }
        });
    }
})

.controller('purchaseTicketCtrl', function($location, Event, $scope, $routeParams){
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
            app.eventId = thisEvent.eventId;
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
        app.ticketData.eventId = app.eventId;
        console.log("eventId :" + app.ticketData.eventId);


         // Gotta make sure that the user is logged in.. or this will be a pain

        Event.buyTicket(app.ticketData)
         .then(function(data){
            // TODO 
             if(data.data.success){
                window.alert("Your ticket has been emailed to you, you will now be redirected");
                $location.path('/');
              } else{
                
             }
        
        });
    }

})
.controller('registerForEventCtrl', function($location,Event, User, $scope, $routeParams){
    var app = this;

    // var decrypted = decrypt($routeParams.Id)
    // Console.log("decrypted : " +decrypted)

    // var split = decrypted.split('+');
    // var userName = split[0];
    // var eventId = split[1];
    // console.log("eventId = "+ eventId);
    // console.log("userName = " + userName);
    // console.log("registerForEventCtrl here!!!")


    var eventid = "";
    var userid = "";
    Event.decryptHash($routeParams.Id)
    .then(function(data){
        if(data.data.success){
            if(data.data.message == "You have not paid yet unfortunately"){
                console.log("please purchase a ticket before trying to rsvp");
                window.alert("You have not paid for your ticket yet, you are being redirected");
                //$timeout(function() { $scope.displayErrorMsg = false;}, 2000);
                console.log(eventid)
                $location.path('/purchaseTicket/'+ data.data.eventid)

            } 
            console.log("eventid = " +data.data.eventid);
            console.log("userid = " + data.data.userid);
            eventid = data.data.eventid;
            userid = data.data.userid;
            app.eventid = eventid
            console.log("eventid == " +eventid);
    console.log("username == " + userid)
    Event.getEvent(eventid)
    .then(function(data){
        console.log(data.data.event)
        console.log(data.data.message)
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
            // $scope.getNumber = function(num){
            //     return new Array(num);
            // }
        } else {
            console.log("no event???");
            app.failMsg = data.data.message;
            app.loading = false;
        }      
    });

    User.getUser(userid)
    .then(function(data){
        console.log(data.data.user)
        if(data.data.success){
            app.user = data.data.user;
        } else{
            console.log("No user??")
            app.failMsg = data.data.message;
            app.loading = false;
        }

    });

    
        }
        else{
            console.log("error with decryption");
        }
    });
    /// Problems with check.. how to avoid..Might just assume they are in the invited column
    // make check ==1??
    // app.moveUser = function(email, check){
    app.moveUser = function(){
        console.log('ye IUFHSWIFUBSFIUB')
        Event.moveUser(app.eventid,app.user.email,1).then(function(data){
            if(data.data.success){
                console.log(data.data.message);
                $location.path('/');
                //window.location.reload(true);
            } else {
                app.failMsg = data.data.message;
                console.log(data.data.message);
            }
        });
    }
    

})

.controller('eventLiveTrackerCtrl', function(Event, $routeParams, $scope, $interval){
    var app = this;
    Event.getEvent($routeParams.id).then(function(data){
        if(data.data.success){
            //goal
            app.goal = data.data.event.goal;
            console.log(data.data.event.goal);
            // $ raised
            app.raised = data.data.event.raised;
            //% funded
            app.percent = (data.data.event.raised / data.data.event.goal) * 100
            // number of donations
            app.donators = data.data.event.numDonate;
            app.name = data.data.event.name;
        }
    });

    $scope.refreshScore = function() {
        Event.getEvent($routeParams.id).then(function(data){
            if(data.data.success){
                console.log("This is an interval");
                //goal
                app.goal = data.data.event.goal;
                console.log(data.data.event.goal);
                // $ raised
                app.raised = data.data.event.raised;
                //% funded
                app.percent = (data.data.event.raised / data.data.event.goal) * 100
                // number of donations
                app.donators = data.data.event.numDonate;
            }
        });
     }
     var promise = $interval($scope.refreshScore, 10000);
     $scope.$on('$destroy',function(){
         if(promise)
             $interval.cancel(promise);   
             console.log("interval stopped")
     });
})

.controller('tablesCtrl', function(Event, $routeParams, $scope){
    var app = this;
    var tables = [];
    app.currentTable = {};

    Event.viewEventWithDb($routeParams.id).then(function(data){
        if(data.data.success){
            console.log(data.data)
            var currentEvent = data.data.event;
            app.rsvp = data.data.rsvpUsers;
            app.guests = data.data.rsvpGuests;
            app.tables = currentEvent.tables;
            app.seats = currentEvent.seatsPer;

            // create table numbers
            var tabArr = [];
            for (var i = 1; i <= currentEvent.tables; i++) {
                console.log(i)
                var tab = {}
                tab.number = i;
                tab.seatsRemaining = currentEvent.seatsPer;
        
                //creat seat array
                var seats = []
                for (var i = 1; i <= currentEvent.seatsPer; i++) {
                    seats[i] = "Please enter a guest"
                }

                tab.seats = seats;

                tabArr.push(tab);
            }
            app.tableObj = tabArr;
        }
    });

    app.setCurrentTable = function(number){
        app.currentTable = tables[number];
        console.log("new table num")
    }
});


