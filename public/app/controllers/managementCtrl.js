angular.module('managementController', [])
.controller('managementCtrl', function(User, $scope){
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
})

.controller('editCtrl', function($scope, User, $routeParams, $timeout){
    var app = this;

    app.failMsg = false;

    User.getUser($routeParams.id).then(function(data){
        if(data.data.success){
            $scope.newName = data.data.user.name;
            $scope.newEmail = data.data.user.email;
            $scope.newUsername = data.data.user.username;
            $scope.newPermission = data.data.user.permission;
            app.currentUserID = data.data.user._id;
            app.currentPermission = data.data.user.permission;
        } else {
            app.failMsg = data.data.message;
        }
    });

    app.namePhase = function(){

    };

    app.usernamePhase = function(){
        
    };

    app.emailPhase = function(){
        
    };

    app.PermissionPhase = function(){
        
    };


    app.updateName = function(newName){
        var userObject = {};
        app.disabled = true;
        app.failMsg = false;

        userObject.name = $scope.newName;
        userObject._id = app.currentUserID;
        User.editUser(userObject).then(function(data){
            if(data.data.success){
                app.successMsg = data.data.message;
                $timeout(function(){
                    $scope.newName = newName;
                    app.successMsg = false;
                    app.disabled = false;
                }, 2000)
            } else {
                app.failMsg = data.data.message;
                app.disabled = false;
            }
        });
    };

    app.updateUsername = function(newUsername){
        var userObject = {};
        app.disabled = true;
        app.failMsg = false;

        userObject.username = $scope.newUsername;
        userObject._id = app.currentUserID;
        User.editUser(userObject).then(function(data){
            if(data.data.success){
                app.successMsg = data.data.message;
                $timeout(function(){
                    $scope.newUsername = newUsername;
                    app.successMsg = false;
                    app.disabled = false;
                }, 2000)
            } else {
                app.failMsg = data.data.message;
                app.disabled = false;
            }
        });
    };

    app.updateEmail = function(newEmail){
        var userObject = {};
        app.disabled = true;
        app.failMsg = false;

        userObject.email = $scope.newEmail;
        userObject._id = app.currentUserID;
        User.editUser(userObject).then(function(data){
            if(data.data.success){
                app.successMsg = data.data.message;
                $timeout(function(){
                    $scope.newEmail = newEmail;
                    app.successMsg = false;
                    app.disabled = false;
                }, 2000)
            } else {
                app.failMsg = data.data.message;
                app.disabled = false;
            }
        });
    };

    app.updatePermission = function(newPermission){
        var userObject = {};
        app.disabled = true;
        app.failMsg = false;

        userObject.permission = newPermission;
        userObject._id = app.currentUserID;
        User.editUser(userObject).then(function(data){
            if(data.data.success){
                app.successMsg = data.data.message;
                $timeout(function(){
                    $scope.newPermission = newPermission;
                    app.successMsg = false;
                    app.disabled = false;
                }, 2000)
            } else {
                app.failMsg = data.data.message;
                app.disabled = false;
            }
        });
    };
});
