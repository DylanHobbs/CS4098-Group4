angular.module('editController', ['userServices', 'authServices'])

// TODO: Long term, combine these into one DRY

// Handles resetting password
.controller('editPwdCtrl', function(User) {  
	var app = this;
	app.successMsg = false;
	app.changePassword = function(pwdData){
		app.disabled = true;
		app.successMsg = false;
		app.failMsg = false;
		User.changePassword(app.pwdData).then(function(data){
			console.log(data);
			if(data.data.success){
				app.disabled = true;
				app.successMsg = data.data.message;
				// TODO: send them back to profile
				// TODO: Handle no old password being submitted
				// TODO: Handle validation in from
			} else {
				app.disabled = false;
				app.failMsg = data.data.message;
			}
		});
	};
})

.controller('editUsrCtrl', function(User, Auth) {  
	var app = this;
	app.successMsg = false;
	app.changeUsername = function(usrData){
		app.disabled = true;
		app.successMsg = false;
		app.failMsg = false;
		User.changeUsername(app.usrData).then(function(data){
			console.log(data);
			if(data.data.success){
				app.disabled = true;
				app.successMsg = data.data.message;
				// TODO: Get user and set default to usernmae
				// TODO: send them back to profile
				// TODO: Handle no old password being submitted
				// TODO: Handle validation in from
			} else {
				app.disabled = false;
				app.failMsg = data.data.message;
			}
		});
	};
});