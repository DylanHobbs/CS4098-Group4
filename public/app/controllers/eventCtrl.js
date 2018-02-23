angular.module('eventController', ['eventServices'])
.controller('eventCtrl', function(Event, $scope){

	var app = this;
    console.log('hello from event controller');

//     function getEvent(){
//         Event.getEvent().then(function(data){
//             if(data.data.success){
//                 if(data.data.permission === 'admin'){
//                     app.users = data.data.users;
//                     app.loading = false;
//                     app.accessDenied = false;
//                 } else {
//                     app.failMsg = "No permissions to access this feature";
//                     app.loading = false;
//                 }
//             } else {
//                 app.failMsg = data.data.message;
//                 app.loading = false;
//             }
//         });
//     }

//     getEvent();
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

.controller('viewEventCtrl', function(Event, $routeParams){
    var app = this;
    // next line is broken maybe

    Event.getEvent($routeParams.id)
    .then(function(data){
        // app.successMsg = placeholderID.message;
        if(data.data.success){
            app.invitedUsers = data.data.invitedUsers;
        } else {
            app.failMsg = data.data.message;
            app.loading = false;
        }
            
    });
    console.log('hello from micky mouse');
});


