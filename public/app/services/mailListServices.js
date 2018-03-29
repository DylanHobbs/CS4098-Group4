angular.module('mailListServices', [])
.factory('MailList', function($http){
    mailListFactory = {};

    mailListFactory.create = function(mailListData){
        return $http.post('/api/createList', mailListData);
    }

    mailListFactory.getMailLists = function(id){
        return $http.get('/api/mailLists');
    }

    mailListFactory.addUser = function(id, email, check){
        return $http.put('/api/createList/' + id +'/'+ email + '/' + check);
    }


    return mailListFactory;
});
