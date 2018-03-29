angular.module('userControllers', ['userServices'])

.controller('regCtrl', function($http, $location, $timeout, User){
	var app = this;
	this.regUser = function(regData){
		app.disabled = true;
		app.loading = true;
		app.failMsg = false;
		//http://localhost:8080/api/users
		User.create(app.regData)
		.then(function(data){
			if(data.data.success){
				app.loading = false;
				app.successMsg = data.data.message + '... Redirecting you home';
				$timeout(function(){
					app.successMsg = false;
					$location.path('/');
				}, 2000);
			} else {
				app.loading = false;
				app.disabled = false;
				app.failMsg = data.data.message;
			}
		});
	};
})

.controller('donateCtrl', function(User, $routeParams) {  
	var app = this;
	var donateData = {}
	app.successMsg = false;
	
    app.addDonation = function(donation){
    	console.log("help pls")
		donateData.donation = donation;
		if($routeParams.id){
			donateData.event = $routeParams.id;
		}
    	console.log(donation)
        User.donate(donateData).then(function(data){
            if(data.data.success){
                console.log(data.data);
                app.successMsg = true;
            } else {
                app.failMsg = true;
                console.log(data.data.message);
            }
        });
    }
	
});