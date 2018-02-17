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
    console.log('hello from event controller');
});


