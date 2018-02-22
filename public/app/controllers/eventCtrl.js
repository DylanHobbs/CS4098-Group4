angular.module('eventController', ['eventServices'])
.controller('eventCtrl', function(){
	app = this;
    console.log('hello from event controller');
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

.controller('viewEventCtrl', function(){
    app = this;
    // need to pass event id in here replacing the placeholder
    // from where though  

    // Event.viewEvent(placeholderID)
    // .then(function(data){
    //         // app.successMsg = placeholderID.message;
    //         if(data.data.success){
    //             if(data.data.permission === 'admin'){
    //                 console.log(data.data.email)
    //             } else {
    //                 app.failMsg = "No permissions to access this feature";
    //                 app.loading = false;
    //             }
    //         } else {
    //             app.failMsg = data.data.message;
    //             app.loading = false;
    //         }
            
    //     });
    console.log('hello from micky mouse');
});


