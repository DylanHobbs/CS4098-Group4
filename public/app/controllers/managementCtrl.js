angular.module('managementController', [])
.controller('managmentCtrl', function(User, $scope){
    var app = this;

    app.loading = true;
    app.accessDenied = true;
    app.failMsg = false;
    app.limit = 10;

    function getUsers(){
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
    }
});
