// ****************************************************************************
// *                            All angular files.                            *
// *                Import controllers and everything in here.                *
// *                       Main config file for angular                       *
// ****************************************************************************
angular.module('userApp', ['appRoutes', 'userControllers', 'eventServices', 'userServices', 'mailListServices', 'mainController', 'eventController', 'authServices', 'emailController', 'editController', 'managementController', 'mailListController'])


// Configuration. Used to assist in injecting tokens in headers
.config(function($httpProvider){
	$httpProvider.interceptors.push('AuthIntercept');
});