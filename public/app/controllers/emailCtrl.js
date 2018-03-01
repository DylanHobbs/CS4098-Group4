angular.module('emailController', ['userServices', 'eventServices'])

// Handles sending confirmation emails
.controller('emailCtrl', function($routeParams, User, $timeout, $location) {  
	var app = this;

	User.activateAccount($routeParams.token)
	.then(function(data){
		app.successMsg = false;
		app.errorMsg = false;
		if(data.data.success){
			app.successMsg = data.data.message + '... Redirecting';
			$timeout(function(){
					$location.path('/login');
				}, 2000);
		} else {
			app.failMsg = data.data.message + '... Redirecting';
			$timeout(function(){
					$location.path('/login');
				}, 2000);
		}
	});
})

.controller('resendCtrl', function(User) {  
	app = this;
	app.successMsg = false;

	app.checkCredentials = function(loginData){
		app.disabled = true;
		app.successMsg = false;
		app.failMsg = false;
		User.checkCredentials(app.loginData).then(function(data){
			if(data.data.success){
				// User is good, resend the link
				User.resendLink(app.loginData).then(function(data){
					if(data.data.success){
						app.successMsg = data.data.message;
					}
				})
			} else {
				app.disabled = false;
				app.failMsg = data.data.message;
			}
		});
	};
})

.controller('usernameCtrl', function(User){
	app = this;

	app.sendUsername = function(userData){
		User.sendUsername(app.userData.email).then(function(data){
			console.log(data);
		});
	};
})

.controller('createEmailCtrl', function(User, Event){
	app = this;
	console.log("Hello beautiful");
	var currentSelect = 'invited';
	var invitedLists = [];
	var rsvpLists = [];
	var mailingLists = [];

	app.events = [];
	Event.getEvents().then(function(data){
		invitedLists = data.data.events;
		rsvpLists = data.data.events;
		app.events = data.data.events;
	});	


	this.sendEmail = function(emailData){
		app.disabled = true;
		console.log('ye i\'ll totally send that to: ' + currentSelect);
		console.log(app.emailData);
	};

	app.setSelect = function(toggle){
		if(toggle === 'rsvp'){
			currentSelect = 'rsvp';
			app.events = rsvpLists;
			console.log('rsvp');
		} else if(toggle === 'lists'){
			currentSelect = 'lists';
			app.events = mailingLists;
			console.log('list');
		} else if(toggle === 'invited'){
			currentSelect = 'invited';
			app.events = invitedLists;
			console.log('invited');
		}
	};
});