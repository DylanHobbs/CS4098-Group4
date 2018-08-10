angular.module('mailListServices', [])
.factory('MailList', function($http){
    mailListFactory = {};

    mailListFactory.create = function(listData){
        return $http.post('/api/createList', listData);
    }

    mailListFactory.getMailLists = function(){
        return $http.get('/api/mailLists');
    }

    /*mailListFactory.addUser = function(id, email, check){
        return $http.put('/api/createList/' + id +'/'+ email + '/' + check);
    }*/


    return mailListFactory;
});
