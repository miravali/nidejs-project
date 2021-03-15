var nestablePage = "";
define([
    'config',
    'angular',
    'appFonts',
    'angular-route',
    'scripts/appService',
    'views/Preview.controller',
    'text!views/Preview.html',
    'scripts/component',
    'dragdropPolyfill'
], function (LiquidConfig, angular, appFonts, angularRoute, appService, pCtrl, prevTmpl) {

    'use strict';


    var isMobileSafari = (/(ipad|iPhone|ipod)/gi).test(navigator.userAgent);
    var isPhantomBrowser = (/PhantomJS/gi).test(window.navigator.userAgent);

    $(document).on("click", function (evt) {

        if (window.parent) {
            var domParent = window.parent.document;
            if (domParent.closeMenu) domParent.closeMenu();
        }
    })

    function initAppConstants($rootScope) {
        $rootScope.LQD_QUESTION_ASSETS = {
            "WRONG_AUDIO": 'library/assets/media/beep.mp3',
            "RIGHT_AUDIO": "library/assets/media/twinkle.mp3",
            "DEFAULT_IMAGE": "library/assets/media/image.png",
            "DEFAULT_CLICK": "library/assets/media/tabClickAudio.mp3"
        };


    }

    var app = angular.module("liquidapp", ['ngRoute'])
        .constant('APP', LiquidConfig.Dev)
        .constant('APPVER', LiquidConfig.Dev.Ver)
        .config(function ($routeProvider) {
            $routeProvider
                .when('/', {
                    template: prevTmpl,
                    controller: 'previewController',
                    controllerAs: 'prevCtrl'
                });
        })
        .controller('MainCtrl', function ($rootScope, $location, APP, APPVER, $mdToast, QuizPreService) {

            var main = this;

            this.version = APPVER.version;
            this.releaseDate = APPVER.ReleaseDate;
            this.relaseInfo = APPVER.Description;

            console.log(JSON.stringify(APPVER));

            initAppConstants($rootScope);

            QuizPreService.defaults();


        }).service('dataLinkService', function () { })
        .service('groupDataService', function () { })
        .service('QuizPreService', function () { });

    app.init = function () {

        // Set the User details whenever url contains auth token
        var loc = window.location.href;
        if (loc.lastIndexOf('&auth') > 0) {
            var authToken = loc.substr(loc.lastIndexOf('&auth'), loc.length);
            if (authToken.length) {
                authToken = authToken.replace(/&auth=/g, '');
                var data = {
                    "idToken": authToken
                };
                window.localStorage.setItem("USER", JSON.stringify(data));
            }
        }

        pCtrl.init();
        appService.init();


        angular.bootstrap(document, [
            'liquidapp',
            'lqdCardMdl'
        ]);

        $(".appLoader").hide();

    }


    return app;

});