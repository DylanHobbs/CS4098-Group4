angular.module('mailListServices', [])
.factory('MailList', function($http){
    mailListFactory = {};

    mailListFactory.create = function(mailListData){
        return $http.post('/api/createList', mailListData);
    }

    mailListFactory.getMailLists = function(id){
        return $http.get('/api/mailLists');
    }


    return mailListFactory;
});
