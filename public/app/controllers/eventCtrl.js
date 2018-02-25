angular.module('eventController', ['eventServices'])
.controller('eventCtrl', function(Event, $scope, $routeParams){

    // TODO: 
    // these may or may not be needed
    // $scope.searchWord = "admin";
    // $scope.searchKey = "host";
    // 
    // 
	var app = this;
    // console.log('hello from event controller');

    // Trying to display the test event from the database

    // Event.getEvent($routeParams.id)
    // .then(function(data){
    //     if(data.data.success){
    //         app.venue = data.data.venue;
    //         app.date = data.data.date;
    //         app.name = data.data.description;
    //     } else {
    //         app.failMsg = data.data.message;
    //         app.loading = false;
    //     }
            
    // });


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
                window.location.reload(true);
            } else {
                app.failMsg = data.data.message;
                console.log(data.data.message);
            }
        });
    }
});


