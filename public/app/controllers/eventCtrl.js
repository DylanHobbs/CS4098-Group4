angular.module('eventController', ['eventServices'])
.controller('eventCtrl', function(){
	app = this;
    console.log('hello from event controller');
})

.controller('createEventCtrl', function(){
	app = this;
    console.log('hello from creat event controller');
});


