define(['angular', 'components/core/utils/lqd.contentParser', 'graphql'],
    function (angular, parser) {
        'use strict';

        var interceptor = {};

        interceptor.init = function () {

            angular.module("liquidapp")
                .service("PageService", PageService)
                .factory("editorFactory", editorpageFactory)
                .service("cardService", cardService)
                .service("charCardSService", charCardSService)
                .factory("charActionService", charActionService);

            PageService.$inject = ['$http', 'APP', '$q'];
            editorpageFactory.$inject = ['$http', '$q'];
            cardService.$inject = ['$http', 'APP'];
            charCardSService.$inject = ['$http', 'APP'];
            charActionService.$inject = ['$http', '$q'];


            function PageService($http, APP, $q) {
                function graphQLWRAP() {
                    // var user = {
                    //     "name": "Saketha Kethireddy",
                    //     "picture": "https://lh5.googleusercontent.com/-gajpFPBhiHo/AAAAAAAAAAI/AAAAAAAAAAA/ACHi3rfJzbWoc455_hB7akXL_Z0qCbX7Jg/s96-c/photo.jpg", "email": "saketha.kethireddy.test@nooor.in", "idToken": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJodHRwczovL2lkZW50aXR5dG9vbGtpdC5nb29nbGVhcGlzLmNvbS9nb29nbGUuaWRlbnRpdHkuaWRlbnRpdHl0b29sa2l0LnYxLklkZW50aXR5VG9vbGtpdCIsImlhdCI6MTU2NjI4MjU5NywiZXhwIjoxNTY2Mjg2MTk3LCJpc3MiOiJmaXJlYmFzZS1hZG1pbnNkay1rMnR5ZUBub29vcnYyLmlhbS5nc2VydmljZWFjY291bnQuY29tIiwic3ViIjoiZmlyZWJhc2UtYWRtaW5zZGstazJ0eWVAbm9vb3J2Mi5pYW0uZ3NlcnZpY2VhY2NvdW50LmNvbSIsInVpZCI6ImNqcDNsMzN0ZDlzc2wwYTI2ZGFld2o5ZnYiLCJjbGFpbXMiOnsidXNlcklkIjoiY2pwM2wzM3RkOXNzbDBhMjZkYWV3ajlmdiIsIm9yZ2FuaXphdGlvbklkIjoiY2prZHhjNmQwMDAxdDBiMTd1enQ1aWo3eSIsIm5hbWUiOiJTYWtldGhhIEtldGhpcmVkZHkiLCJyb2xlIjpbIlRFQUNIRVIiXX19.b-Qr9YujEHtGaYQG_-5Y5vSDaAU2pSywLgXhBTEMr8EKfyqTcT6gqtsKuq2OPdKRPttNRbC7W2FKQATWEGW3qetTsQODKzvqHzEgQJKjMKlPxTq7_tBp2RI5FU47iDtvFinHBpUM6g5zubcmYoiggzh7puTbCUwsJahzvYi9uUhwQ-yvHWYFl6ZZoDs3hAib8MWPT3hRpsNH49BIY65xcXOhRePvkjfPDJvKB0lJ-2Ppay71FPUfwYX3zRk8VCqYMI7lU-JV8QwGVWCd7yByNp9i-oMSSQwCwIHJSwaowKrbtf38iRkwzm5knYH0ktB2jnrqpORkm9tcg4k11RXS6w", "id": "cjp3l33td9ssl0a26daewj9fv", "organizationId": "cjkdxc6d0001t0b17uzt5ij7y",
                    //     "role": "TEACHER",
                    //     "gToken": "ya29.GlxqB1ZDgAJ0vOir5dsIp-QjXWU8dEh6MLzF_4RMSRfVqjelJZ-BQemzGc4mMc2bAB-pNrKJzLwzXy0oBcoJDGF2-w3fwUQ6_InUZ_qsMCxEzgvO5Zq7wiq60HLTuw",
                    //     "organizationName": "School organization"
                    // }

                    var user = localStorage.getItem('USER');
                    user = JSON.parse(user);
                    var auth_token = $.urlParam('auth');
                    if (user == null && auth_token == null) {
                        alert("Not Authorized");
                        return;
                    }
                    if (user == null) {
                        if (auth_token) {
                            user = {};
                            user.idToken = auth_token;
                        }
                    }
                    var graph = graphql(APP.URI.GRAPHQL, {
                        method: "POST",
                        headers: {
                            "Authorization": "Bearer " + user.idToken
                        },
                        asJSON: true
                    })
                    return graph;
                }
                var service = this,
                    url = window.location.href,
                    pageApi = "api/page/getPage",
                    templateApi = "api/publish/getTemplateByTemplateId",
                    pageUrl = "";

                url = APP.URI.ENDPOINT;
                service.setGraphQLToken = function (auth_token) {
                    var graph = graphql(APP.URI.GRAPHQL, {
                        method: "POST",
                        headers: {
                            "Authorization": "Bearer " + auth_token
                        },
                        asJSON: true
                    })
                    return graph;
                }
                service.readPage = function (pageId) {
                    //Testing;
                    // pageId = "0b5bd2eb-b74a-4257-bfad-fbf815b2e7cb";

                    // if( pageId == null && templateId != null)
                    // {
                    //      pageUrl = url + templateApi;
                    //     return $http.get(pageUrl + "?templateId=" + templateId);
                    // }else{
                    //     pageUrl = url + pageApi;
                    //     return $http.get(pageUrl + "?pageId=" + pageId);
                    // }

                    var defer = $q.defer();
                    var graph = graphQLWRAP();
                    graph.query('page($id:ID!) {\
                        page(where:{id:$id})\
                        {\
                            _id\
                            name\
                            thumbnail\
                            tags\
                            pageStyle\
                            pageBgStyle\
                            pageChildren\
                            pageAssets\
                            pageLinks\
                            extra\
                            events\
                            character\
                             createdAt\
                            modifiedAt\
                        }\
                      }', {
                            id: pageId
                        })

                        .then(function (response) {

                            defer.resolve(response.page);
                            console.log(response)
                        }).catch(function (error) {
                            // response is originally response.errors of query result
                            console.log(error)
                        })


                    return defer.promise;



                }
            }

            function editorpageFactory($http, $q) {

                var service = {};



                function getCards() {
                    var def = $q.defer();

                    var ver = new Date().getTime();
                    $http.get('data/cards.json?' + ver)
                        .success(function (data) {
                            def.resolve(data);
                        })
                        .error(function () {
                            def.reject("Failed to get albums");
                        });
                    return def.promise;
                }

                service.getCards = getCards;

                return service;

            }

            $.urlParam = function (name) {
                var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);

                if (results == null) {
                    return null;
                } else {
                    return results[1] || 0;
                }
            };

            function cardService($http, APP) {

                var service = this;
                service.data = {};

                service.set = function (key, value) {
                    // service.data[key] = value;
                    service.data[key] = parser.parseCardObject(value);
                }

                service.get = function (key) {
                    return service.data[key];
                }

                service.reset = function () {
                    service.data = {};
                }

            }

            function charCardSService() {
                var service = this;
                service.data = {};

                service.set = function (key, value) {
                    service.data[key] = value;
                }

                service.get = function (key) {
                    return service.data[key];
                }

                function reset() {
                    service.data = {};
                }
            }


            function charActionService($http, $q) {
                var service = this;

                service.data = {};

                service.getActionData = function (path) {

                    var def = $q.defer();
                    $http.get(path)
                        .success(function (data) {
                            service.data = data;
                            def.resolve(data);

                        })
                        .error(function () {
                            def.reject("Failed to get Data");
                        });
                    return def.promise;
                }
                return service;
            }
        }
        return interceptor;
    });