angular.module('editController', ['userServices'])

// Handles sending confirmation emails
.controller('editCtrl', function(User) {  
	var app = this;
	app.successMsg = false;
	app.changePassword = function(pwdData){
		app.disabled = true;
		app.successMsg = false;
		app.failMsg = false;
		User.changePassword(app.pwdData).then(function(data){
			console.log(data);
		});
	};
});