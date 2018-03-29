angular.module('mailListController', ['mailListServices', 'authServices'])
.controller('mailListCtrl', function(MailList, $scope, $routeParams){

	var app = this;
    app.limit = 10;

    console.log('I showed you my angular answer me');

    function getMailLists(){
        MailList.getMailLists().then(function(data){
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


    /* function getUsers(){
        User.getUsers().then(function(data){
            if(data.data.success){
                if(data.data.permission === 'admin'){
                    app.users = data.data.users;
                    app.loading = false;
                    app.accessDenied = false;
                } else {
                    app.failMsg = "No permissions to access this feature";
                    app.loading = false;
                }
            } else {
                app.failMsg = data.data.message;
                app.loading = false;
            }
        });
    }

    getUsers();

    app.showMore = function(number){
        if(number > 0){
            app.limit = number;
        } else {
            app.failMsg = "Please enter a valid number"
        }
    };

    app.showAll = function(){
        app.limit = undefined;
        app.failMsg = false;
        $scope.number = undefined;
    };

    app.deleteUser = function(username){
        User.deleteUser(username).then(function(data){
            if(data.data.success){
                getUsers();
            } else {
                app.failMsg = data.data.message;
            }
        });
    } */

    this.createMailList = function(mailListData){
		 // Disable inputs when submitted
        app.disabled = true;
        // show to loading spinner
        app.loading = true;
        // Set any existing errors to false
        app.failMsg = false;


        MailList.create(app.mailListData)
        .then(function(data){
            if(data.data.success){
                console.log(data);
                app.loading = false;
                app.successMsg = data.data.message + '.. Redirecting you back home';
                $timeout(function(){
					app.successMsg = false;
					$location.path('/home');
				}, 2000);
            } else {
                app.loading = false;
                app.disabled = false;
                app.failMsg = data.data.message;
            }
        });
	};


});