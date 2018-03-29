angular.module('mailListController', ['mailListServices', 'authServices'])
.controller('mailListCtrl', function(MailList, $scope, $routeParams){

	var app = this;
    app.limit = 10;

    //console.log('I showed you my angular answer me');

    function getMailLists(){
        MailList.getMailLists().then(function(data){
            //console.log('I showed you my angular answer me');
            if(data.data.success){
                //if(data.data.permission === 'admin'){
                    //console.log(data.data.events);
                    app.mailLists = data.data.mailLists;
                    app.loading = false;
                    app.accessDenied = false;
                /*} else {
                    app.failMsg = "No permissions to access this feature";
                    app.loading = false;
                }*/
            } else {
                app.failMsg = data.data.message;
                app.loading = false;
            }
        });
    }

    getMailLists();

})

.controller('createMailListCtrl', function($location, User, $http, $timeout, MailList){
	app = this;
	app.loading = true;
    app.accessDenied = true;
    app.failMsg = false;
    app.limit = 10;

    //console.log("ok we are in");

    /*app.addMember = function(email, check){
        Event.addUser($routeParams.id,email,check).then(function(data){
            if(data.data.success){
                console.log(data.data);
                window.location.reload(true);
            } else {
                app.failMsg = data.data.message;
                console.log(data.data.message);
            }
        });
    }*/
    

    this.createList = function(listData){
		 // Disable inputs when submitted
        app.disabled = true;
        // show to loading spinner
        app.loading = true;
        // Set any existing errors to false
        app.failMsg = false;


        MailList.create(app.listData)
        .then(function(data){
            console.log("okey dokey");
            if(data.data.success){
                console.log(data);
                app.loading = false;
                app.successMsg = data.data.message + '.. Redirecting you back to Mail Lists';
                $timeout(function(){
					app.successMsg = false;
					$location.path('/mailLists');
				}, 2000);
            } else {
                app.loading = false;
                app.disabled = false;
                app.failMsg = data.data.message;
            }
        
        });
	};


});