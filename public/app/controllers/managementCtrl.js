angular.module('managementController', [])
.controller('managmentCtrl', function(User){
    var app = this;

    app.loading = true;
    app.accessDenied = true;
    app.failMsg = false;

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
});
