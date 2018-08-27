'use strict';


//inject angular file upload directives and services.
var app = angular.module('fileUpload', ['ngFileUpload']);

app.controller('MyCtrl', ['$scope', 'Upload', '$timeout', function ($scope, Upload, $timeout) {
    $scope.uploadPic = function(file) {
        file.upload = Upload.upload({
            url:'/v1/upload',
            method: 'POST',
            data: {
                    title: $scope.title,
                    purpose: $scope.purpose,
                    description: $scope.description,
                    medcenter: $scope.medcenter,
                    team: $scope.team,
                    picture: file,
            },
        });


    }
}]);
