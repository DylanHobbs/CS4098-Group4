angular.module('managementController', ['userServices'])
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
})

.controller('guestRegCtrl', function($http, $location, $timeout, User, $scope, Event){
    var app = this;
    $('.ui.dropdown').dropdown();
    $scope.tests = ['Dinner','Lunch','Brunch'];
    app.limit = 10;
    function getAllEvents(){
            Event.getEvents().then(function(data){
                console.log(data.data);
                if(data.data.success){
                    if(data.data.permission === 'admin'){
                        console.log(data.data.events);
                        app.events = data.data.events;
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
    getAllEvents();
    
	


	app.events = [];
	Event.getEvents().then(function(data){
		app.events = data.data.events;
	});	


	this.guestReg = function(regData){
		app.disabled = true;
		var selectedEvent = app.regData.eventId;
		if(app.regData.email != ""){
            app.regData.to = app.regData.email;
            app.regData.subject = "Moldova Events"
            app.regData.body = "Congratulations, you're registered!"
            Event.emailAttendees(app.regData).then(function(data){
                if(data.data.success){
                    console.log(data.data);
                }
                else{
                    app.failMsg = data.data.message;
                    app.disabled = false;
                }
            });
        }
        User.createGuest(app.regData).then(function(data){
                if(data.data.success){
                    app.loading = false;
                } else {
                    app.loading = false;
                    app.disabled = false;
                    app.failMsg = data.data.message;
                }
            });
            Event.addInfo(app.regData).then(function(data){
                if(data.data.success){
                    app.loading = false;
                } else {
                    app.loading = false;
                    app.disabled = false;
                    app.failMsg = data.data.message;
                }
            });
            Event.addGuest(app.regData.eventId,app.regData.number).then(function(data){
                if(data.data.success){
                    app.loading = false;
                    app.successMsg = data.data.message + "... Redirecting you to events...";
                    $timeout(function(){
                        $location.path('/events');
                    }, 2000);
                } else {
                    app.loading = false;
                    app.disabled = false;
                    app.failMsg = data.data.message;
                }
            });
    
        
	};

    

	/*this.guestReg = function(regData){
		app.disabled = true;
		app.loading = true;
        app.failMsg = false;
        
        /*
        User.createAuthd(app.regData)
        .then(function(data){
			if(data.data.success){
				app.loading = false;
				//app.successMsg = data.data.message + '... Redirecting you back to management';
			} else {
				app.loading = false;
				app.disabled = false;
				app.failMsg = data.data.message;
			}
        });*/
        
        // add to temp guests
        
        //console.log(app.regData);
        /*Event.addInfo(app.regData).then(

        Event.addUser(app.regData.eventId, app.regData.email, '1').then(function(data){
            if(data.data.success){
				app.loading = false;
                app.successMsg = data.data.message + '... Redirecting you back to management';
                $timeout(function(){
            
                    app.successMsg = false;
                    $location.path('/management');
                }, 2000);
			} else {
				app.loading = false;
				app.disabled = false;
				app.failMsg = data.data.message;
			}
        })

    );*/

        
        
//};

    
    
})

.controller('donationStatCtrl', function(User) {  
	var app = this;
    var donateData = {}
    var users = [];
    app.successMsg = false;
    app.totalRaised = 0;
    app.totalDonations = 0;
    app.biggestDonors = [];
    app.frequentDonors = [];

    function compareNum(a,b) {
        if (a.numberOfDonations < b.numberOfDonations)
          return 1;
        if (a.numberOfDonations > b.numberOfDonations)
          return -1;
        return 0;
      }

      function compareTotal(a,b) {
        if (a.totalDonated < b.totalDonated)
          return 1;
        if (a.totalDonated > b.totalDonated)
          return -1;
        return 0;
      }
    
    User.donationStats().then(function(data){
        if(data.data.success){
            app.loading = false;
            users = data.data.users;


            
            users.forEach(function(element){
                if(element.totalDonated){
                    
                    app.totalRaised += element.totalDonated;
                    app.totalDonations += element.numberOfDonations;
                    
                    smallest = -1;
                    if(app.biggestDonors.length < 5){
                        app.biggestDonors.push(element);
                    }else {
                        smallest = element;
                        app.biggestDonors.forEach(function(donor){
                            if(smallest.totalDonated > donor.totalDonated){
                                smallest = donor;
                            }
                        });
        
                        if(smallest != element){
                            index = app.biggestDonors.indexOf(smallest);
                            app.biggestDonors.splice(index,1);
                            app.biggestDonors.push(element);
                        }
                    }
                    
                        
                
                    smallest = -1;
                    if(app.frequentDonors.length < 5){
                        app.frequentDonors.push(element);
                    }else{
                        smallest = element;
                        app.frequentDonors.forEach(function(donor){
                            if(smallest.numberOfDonations > donor.numberOfDonations){
                                smallest = donor;
                            }
                        });
        
                        if(smallest != element){
                            index = app.frequentDonors.indexOf(smallest);
                            app.frequentDonors.splice(index,1);
                            app.frequentDonors.push(element);
                        }
                    }

                    
                }
                
            })


            app.frequentDonors.sort(compareNum);
            app.biggestDonors.sort(compareTotal);

            

            
              
              

            console.log(app.totalRaised);
            
        } else {
            app.loading = false;
            app.disabled = false;
            app.failMsg = data.data.message;
        }

    })

    
	
	
});
