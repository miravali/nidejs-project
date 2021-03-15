define(['angular',
    'views/MathjaxUtils',
    'components/core/common/lqd.media.utilities',
    'views/editor.readcards.utils',
    'swiffy',
    'views/stage/responsive/ResponsiveUtils',
    'views/stage/responsive/Utils',
    'components/general/character/character.utils',
    'library/js/lodash.min',
    'jqImage',
    'jquery-single'

],
    function (angular, mathJax, commonmedia, readCardUtils, swiffy, responsiveUtils, utils, charUtils, loadash) {

        'use strict'

        var controller = {};


        controller.init = function () {


            angular.module("liquidapp")
                .controller('previewController', previewController);
        }


        previewController.$inject = ['$rootScope', '$scope', '$compile', 'PageService', 'editorFactory', 'cardService', '$timeout', 'charActionService', '$q', 'APP'];

        function previewController($rootScope, $scope, $compile, PageService, editorFactory, cardService, $timeout, charActionService, $q, APP) {

            'use strict'

            var vm = this;
            vm.currentPage = {};
            vm.stage = {};
            vm.sideCard = {};
            vm.sideCardbyId = {};

            vm.interactiveGroups = [];
            vm.layoutType = "Normal";
            //set default for Compatibility
            vm.stage.bounds = {};
            vm.stage.bounds.width = "820";
            vm.stage.bounds.height = "1160";

            vm.pageEvents = {};
            vm.cardLoadEvents = [];
            vm.pageLoadEvents = [];
            var args = {};
            var rightAudioPath = $rootScope.LQD_QUESTION_ASSETS.RIGHT_AUDIO;
            var wrongAudioPath = $rootScope.LQD_QUESTION_ASSETS.WRONG_AUDIO;

            var isPhantomBrowser = (/PhantomJS/gi).test(window.navigator.userAgent);
            var iGroupOrder = [];
            var pageCards = [];
            //for Character Variables
            var loopCnt = 0,
                repeat,
                promises = [],
                charDic = {};

            function updateStage(layout) {
                $timeout(function () {
                    var ele = $(".pageContainer");

                    if (!layout) {
                        $(ele).css({
                            width: vm.stage.bounds.width,
                            minHeight: vm.stage.bounds.height,
                            height: vm.stage.bounds.height
                        });

                    } else {
                        $(ele).css({
                            width: '100%',
                            height: 'auto',
                            minHeight: '',
                        });
                    }

                    // if (vm.stage.bounds.dir) {
                    //     $(".editorDiv").css({
                    //         "direction": vm.stage.bounds.dir
                    //     });
                    // }

                }, 0);

            }

            $scope.playRightAudio = function () {
                var ele = $('#textInlineConfiguratorDiv')[0];
                commonmedia.playMedia(ele, rightAudioPath, "Audio");
            }

            $scope.playwrongAudio = function () {
                var ele = $('#textInlineConfiguratorDiv')[0];
                commonmedia.playMedia(ele, wrongAudioPath, "Audio");
            }

            //For Mobile Safari -- Audio Load Issue Fix
            $scope.triggerCharAudio = function (mediaAudio, pos, charIndex, actIndex) {
                var dynHtml = '<div class="chartriggerEle' + charIndex + '" style="position:absolute;width:50px;height:50px;left:' + pos.left + 'px;top:' + pos.top + 'px;z-index:99999" ng-click="clickCharPlayAudio(' + charIndex + ',' + actIndex + ')" layout="row" layout-align="center center">' +
                    '<span class="icon-CirclePlay" style="color:#2b3d51;font-size:50px"></span>' +
                    '</div>'
                $('.pageContainer').append($compile(dynHtml)($scope));

            }

            $scope.clickCharPlayAudio = function (charIndex, actIndex) {
                charUtils.playAudio(charIndex);
                var mediaAudio = angular.element('.charAudioContainersDiv').find('.' + charIndex + actIndex)[0];
                mediaAudio.play();
                $('.chartriggerEle' + charIndex).remove();
            }
            //For Mobile Safari -- Audio Load Issue Fix end


            //Group Related Listners
            function searchInteractiveGrop(idx) {
                var arr = vm.interactiveGroups;
                var index = 0;
                for (var i = 0; i < arr.length; i++) {
                    if (idx == arr[i].id) {
                        index = i + 1;
                        return index;
                    }

                }

                return index;
            }

            $scope.isGroupOnStageValid = function (ele) {
                var id = $(ele).data().id;
                //pass element id;
                //check interactiveGroups array for index 
                //add next (form array index) group on to the stage
                // var idx = searchInteractiveGrop(id);
                var container = $(".pageContainer");
                if (vm.layoutType == 'Responsive') {
                    //if the page is responsive
                    var pCard = {};
                    // responsiveUtils.getRespIntGroups()[0].cardObj
                    var restOfGroups = responsiveUtils.getRespIntGroups();
                    var restGrpIds = _.map(_.map(restOfGroups, 'cardObj'), 'id');
                    if (restOfGroups.length) {
                        angular.forEach(restOfGroups, function (groupObj, itr) {
                            var refIndex = _.indexOf(restGrpIds, iGroupOrder[0].id);
                            var refCardId = restOfGroups[refIndex].cardObj.id
                            if (restOfGroups[itr].cardObj.id == iGroupOrder[0].id) {
                                pCard = restOfGroups[itr];
                            }
                        });
                        responsiveUtils.renderIntGroupItem(pCard, args);
                    }
                } else if (vm.interactiveGroups.length > 0) {
                    // && idx < vm.interactiveGroups.length
                    // decide which group to render
                    var pCard = {};
                    if (iGroupOrder.length > 0) {
                        angular.forEach(vm.interactiveGroups, function (groupObj, itr) {

                            var refIndex = _.indexOf(_.map(vm.interactiveGroups, 'id'), iGroupOrder[0].id);
                            var refCardId = vm.interactiveGroups[refIndex].id
                            if (vm.interactiveGroups[itr].id == iGroupOrder[0].id) {
                                pCard = vm.interactiveGroups[itr];
                            }

                        });
                    } else {
                        return;
                    }
                    readCardUtils.readCard(pCard, cardService, container, $compile, $scope);
                    var groupCard = $('[data-id=' + pCard.id + ']');
                    var groupCardScope = $(groupCard).children('.iCard').scope();
                    groupCardScope.card.element = $(groupCard);
                    groupCardScope.card.isAnimate = true;
                    // get the place to append
                    reArrangeEle();
                    iGroupOrder.shift();
                }
            }


            function reArrangeEle() {
                var prevCard, index = 0;
                angular.forEach(angular.fromJson(pageCards), function (cardObj, itr) {
                    var thisCard = $('[data-id=' + cardObj.id + ']');
                    if ($(thisCard).length) {
                        if (index == 0) {
                            $(thisCard).insertBefore($('.pageContainer').children('.card').first());
                        } else {
                            $(thisCard).insertAfter($(prevCard));
                        }
                        index++;
                        prevCard = thisCard;
                    }
                });
            }

            // get the 'insertAfter' position
            function getInsertAfterEle(groupObj, groupCard) {
                angular.forEach(angular.fromJson(pageCards), function (card, itr) {
                    if (groupObj.id == card.id) {
                        if (itr == 0) {
                            $(groupCard).insertBefore($('.pageContainer').children('.card').first());
                        } else {
                            if ($('[data-id=' + angular.fromJson(pageCards)[itr - 1].id + ']').length)
                                $(groupCard).insertAfter($('.pageContainer').find('[data-id=' + angular.fromJson(pageCards)[itr - 1].id + ']'));
                        }
                        return;
                    }
                });
            }


            $scope.$on('grpIsValid', function (event, ele) {

                $timeout(function () {
                    var nextEle = $(ele).next('lqd-i-grp');
                    console.log(nextEle);
                    $(nextEle).show();
                    var scope = angular.element(nextEle).find('.iCard').scope();
                    if (scope)
                        scope.checkIfGrooupIsValid();
                }, 200);
                // alert('This is Stage Controller');
            })


            function getSideCards() {
                var def = $q.defer();

                if (vm.sideCard.length > 0)
                    def.resolve("OK");

                //Handle Exception Here..
                editorFactory.getCards().then(function (data) {
                    vm.cards = data;
                    var index = 0;
                    angular.forEach(data, function (group) {
                        angular.forEach(group.cards, function (card) {
                            card.id = index;

                            if (typeof card.enable == "undefined")
                                card.enable = true;

                            vm.sideCard[card.type] = card;
                            vm.sideCardbyId[index++] = card;
                        })
                        def.resolve("OK");
                    })
                });
                return def.promise;
            }
            //Get Side Cards
            //  var count = 0;
            getSideCards().then(function () {
                var pageId = $.urlParam('pageId');
                //var pageId = "70e079e7-02ac-4e7d-a380-990e6fc0477b";
                var auth_token = $.urlParam('auth');
                vm.getPages(pageId, auth_token);
                // var pageId = ["70e079e7-02ac-4e7d-a380-990e6fc0477b",
                //     "0ff5f102-eb47-4e9b-b012-08d35bc57550",
                //     "70a27b03-1358-4a7d-a85e-4ffe92f5bd2a",
                //     "31072069-1862-4656-acf7-231a58898826",
                //     "e432e7ce-8e38-49f6-b989-0f12ae7b9f89",
                //     "4b01770a-2aaf-4446-870d-a5b9c336c4a2",
                //     "850ac058-ceea-4588-a02d-06192ea36509",
                //     "1ffe06bc-33a9-4c35-abd6-28a1c5bae20f",
                //     "15af5584-a6ad-49b3-8cc6-7af8fd2aa299",
                //     "83b3cb9c-9244-47d7-a8f5-a518c18de055"];

                // setInterval(function () {
                //     vm.getPages(pageId[count]);
                //     count = count + 1;
                // }, 3000);
            });

            vm.getPages = function (pageId, auth_token) {
                PageService.setGraphQLToken(auth_token);
                PageService.readPage(pageId).then(function (data) {
                    // updateBackground(response.data.pageBgStyle);
                    resetDOM();
                    $(".loader").hide();
                    //   if (response.status == "200") {
                    var pageJson = data;

                    vm.currentPage = readCardUtils.evalPageJson(pageJson);//Replace Special Characters

                    var pageChildren = vm.currentPage.pageChildren;

                    if (typeof pageChildren == "string")
                        pageChildren = angular.fromJson(pageChildren)

                    if (typeof vm.currentPage.pageStyle == "string")
                        vm.currentPage.pageStyle = angular.fromJson(vm.currentPage.pageStyle);

                    if (typeof vm.currentPage.pageBgStyle == "string")
                        vm.currentPage.pageBgStyle = angular.fromJson(vm.currentPage.pageBgStyle);

                    if (vm.currentPage.pageStyle["width"] != null && !(pageChildren.layout)) {

                        var bounds = angular.fromJson(vm.currentPage.pageStyle); //Need to modify later

                        if (bounds["width"] != null) {
                            vm.stage.bounds = bounds;
                            // $timeout(updateStage, 0);
                        }
                    }
                    // //store pageStyle
                    utils.setPageStyle(vm.currentPage.pageStyle);

                    updateStage(pageChildren.layout);

                    // pageCards = response.data.pageChildren;

                    // readPageJson(response.data.pageChildren);

                    readPageJson(pageChildren);

                    setPageBgStyle(angular.fromJson(vm.currentPage.pageBgStyle), vm.layoutType);

                    if (data.events) {
                        var pageEvts = data.events;
                        if (typeof pageEvts == 'string') {
                            pageEvts = angular.fromJson(pageEvts);
                        }
                        reloadOldEvents(pageEvts);
                    }
                    if (data.extra && data.extra != "null")
                        vm.reloadTimelineCharacters(data.extra);


                    readpageEvents();



                    // if (response.data.character)
                    //     readPageCharacters(response.data.character);




                    //reg events ..
                    //angular.element(".pageContainer > .card .iCard").scope().initEvents();

                    var evtCards = angular.element(".pageContainer > .card .iCard,  .pageContainer .shadow > .card .iCard");

                    angular.forEach(evtCards, function (evtCard) {
                        var scope = angular.element(evtCard).scope();
                        if (typeof scope.initEvents == 'function')
                            scope.initEvents();
                    });
                    //Broadcast pageLoad...
                    //$scope.$broadcast(vm.pageLoadEvent);
                    angular.forEach(vm.cardLoadEvents, function (evt) {
                        $scope.$broadcast(evt);
                    });
                    angular.forEach(vm.pageLoadEvents, function (obj) {
                        if (obj.audioUrl) {
                            // var audio = new Audio();
                            // audio.src = obj.audioUrl;
                            // audio.play();
                            var ele = $('#textInlineConfiguratorDiv')[0];
                            commonmedia.playMedia(ele, obj.audioUrl, "Audio");
                        }
                    });


                    // }

                }, function () { });

            }
            vm.resetDOMFromExternal = function () {
                resetDOM();
            }
            function resetDOM() {
                var items = angular.element(".pageContainer .card");
                for (var i = 0; i < items.length; i++) {
                    var elem = items[i];
                    elem.parentNode.removeChild(elem);
                }
            }
            function setPageBgStyle(pageBgStyle, pageType) {
                if (pageBgStyle.type == 'image') {
                    $('.pageContainer').css({
                        'background-repeat': 'no-repeat',
                        'background-size': '100% 100%',
                        'background-image': 'url(' + pageBgStyle.url + ')',
                        'background-position': 'top center'
                    });

                    if (pageBgStyle.aspectRatio) {
                        // var temp = angular.fromJson(vm.currentPage.pageStyle).width + "px auto";
                        $('.pageContainer').css('background-size', '100%');
                    }
                } else if (pageBgStyle.type == 'color') {
                    $('.pageContainer').css({
                        'background': pageBgStyle.bgcolor
                    });
                } else if (!isPhantomBrowser && pageBgStyle.type == 'video') {
                    $('.pageBgVideo').addClass('bgVideoActive');
                    $('.pageBgVideo').get(0).load();
                    $('.pageBgVideo').attr('src', pageBgStyle.url);

                    if (pageType == "Normal") {
                        if (pageBgStyle.aspectRatio) {
                            $('.bgVideoActive').height('auto');
                        } else {
                            $('.bgVideoActive').width('auto');
                            $('.bgVideoActive').height('100%');
                        }
                    } else if (pageType == "Responsive") {
                        if (pageBgStyle.aspectRatio) {
                            $('.bgVideoActive').height('auto');
                        } else {
                            $('.bgVideoActive').height('100%');
                        }
                    }
                    $('.pageBgVideo').get(0).play();
                    $('.pageContainer').css('overflow', 'hidden'); // **** Chance of bug of page may not display completely. Raised in ZIRA

                } else {
                    $('.pageContainer').css({
                        'background-color': 'white'
                    });
                }
            }

            vm.reloadTimelineCharacters = function (extraStrng) {

                var extraObj = angular.fromJson(extraStrng);

                if (typeof extraObj == "string")
                    extraObj = angular.fromJson(extraObj);

                var isCharEvt = false;

                if (extraObj.charactersTimeline != undefined) {

                    if (extraObj.charactersTimeline != "") {

                        // vm.charactersTimeline = angular.fromJson(extraObj.charactersTimeline);
                        var charTimelineObject = angular.fromJson(extraObj.charactersTimeline);
                        if (charTimelineObject.charactersTimeline) {
                            vm.charactersTimeline = charTimelineObject.charactersTimeline;
                            vm.characterStory_isLoop = charTimelineObject.isLoop;
                        } else {
                            vm.charactersTimeline = angular.fromJson(extraObj.charactersTimeline);
                            vm.characterStory_isLoop = false;
                        }


                        var charArgs = {};
                        charArgs.scope = $scope;
                        charArgs.$q = $q;
                        charArgs.charActionService = charActionService;
                        charArgs.charactersTimeline = vm.charactersTimeline;


                        if (vm.charactersTimeline.length > 0) {

                            angular.forEach(vm.charactersTimeline, function (characterTimeline, charKey) {

                                vm.charVal = charKey + 1;
                                var dynHtml = '<lqd-character-card class="card animated charTlCard charCard' + vm.charVal + '"   data-type="CHARACTER"></lqd-character-card>';

                                $('.pageContainer').append($compile(dynHtml)($scope));



                            });
                            charUtils.init(charArgs);



                            if (Object.keys(vm.pageEvents).length == 0)
                                charUtils.playCharacter();
                            else {
                                _.forEach(Object.keys(vm.pageEvents), function (key) {
                                    var eventObj = vm.pageEvents[key];
                                    _.forEach(eventObj.reg, function (regObject) {
                                        var obj = _.find(regObject.targets, function (target) {
                                            return (target.target_Id == 'charSvgI');
                                        });
                                        if (obj) isCharEvt = true;
                                    });

                                });
                                if (!isCharEvt) charUtils.playCharacter();
                            }



                        }

                    }
                }

            };

            function readPageJson(pageChildren) {
                //console.log(pageChildren);
                pageChildren = angular.fromJson(pageChildren);

                if (typeof pageChildren == "string")
                    pageChildren = angular.fromJson(pageChildren)

                var layoutType = vm.layoutType = "Normal";

                // get all the ids of 'Interactive Groups' in the order of their least 
                var pageCards, iGrpTop = {},
                    calcDim;

                if (pageChildren.layout) {
                    pageCards = pageChildren.children;
                } else {
                    pageCards = pageChildren;
                }
                angular.forEach(pageCards, function (cardObj, index) {
                    if (cardObj.type == 'IGROUP' && cardObj.groupType == 1) {
                        var cardPos = (cardObj.position).split(";");
                        for (var idx = 0; idx < cardPos.length; idx++) {
                            if (cardPos[idx].length != "") {
                                calcDim = (cardPos[idx]).split(":");
                                if (_.trim(calcDim[0]) == 'top') {
                                    iGrpTop = {
                                        'id': cardObj.id,
                                        'top': Math.ceil((calcDim[1].trim().replace('px', '')))
                                    }
                                    iGroupOrder.push(iGrpTop);
                                }
                            }
                        };
                    }
                });
                // sort with asc order of top position
                iGroupOrder = _.sortBy(iGroupOrder, ['top']);

                if (pageChildren.layout)
                    vm.layoutType = layoutType = "Responsive";

                var container = $(".pageContainer");
                //cardService
                if (pageChildren.layout) {
                    $('.pageContainer').css({
                        'overflow': 'hidden'
                    });
                    //Remove Min height
                    $(container).css("minHeight", "");


                    args.compile = $compile;
                    args.scope = $scope;
                    args.cardService = cardService;
                    args.layoutType = "Responsive";
                    responsiveUtils.setRespGroupOrder(iGroupOrder);
                    // already has x,y,w,h, i values no need re calculate positions
                    responsiveUtils.renderRespsiveGridItems(pageChildren, args);
                } else {
                    //check whether pCard is gruop or not 
                    //add first group on to the stage
                    //store all other groups in an array on stage
                    var index = 0;
                    angular.forEach(pageChildren, function (pCard) {
                        if (pCard.groupType == undefined) pCard.groupType = 1;
                        if (pCard && pCard.type == 'IGROUP' &&
                            pCard.groupType == 1) {
                            if (pCard.id == iGroupOrder[0].id) {
                                readCardUtils.readCard(pCard, cardService, container, $compile, $scope);
                            } else {
                                vm.interactiveGroups.push(pCard);
                                return;
                            }
                        } else {
                            readCardUtils.readCard(pCard, cardService, container, $compile, $scope);
                        }
                    });

                    iGroupOrder.shift();
                }

                $timeout(function () {
                    MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
                }, 0);
            }


            function getEventObj(oldEventObj, trigId) {
                var eventObj = {};
                var disp = {};
                var evtArr = [];
                var reg = [];
                var evtObj = {};
                disp.evt = evtArr;

                reg.push(oldEventObj.reg);

                disp.trigger_Id = trigId;
                disp.audioUrl = oldEventObj.disp.audioUrl;


                evtObj.id = oldEventObj.disp.evt;
                evtObj.name = oldEventObj.disp.action.name;
                evtArr.push(evtObj);

                eventObj.disp = disp;
                eventObj.reg = reg;
                return eventObj;
            }
            function isArray(a) {
                return (!!a) && (a.constructor === Array);
            };
            function isObject(a) {
                return (!!a) && (a.constructor === Object);
            };
            function reloadOldEvents(pageEvts) {
                if (isArray(pageEvts)) {
                    if (vm.neweventsList == undefined) {
                        vm.neweventsList = {};
                        angular.forEach(pageEvts, function (value, tKey) {
                            angular.forEach(value.reg.targets, function (targetObj) {
                                if (targetObj.actions == undefined) //For OLD EVENTS
                                {
                                    var infiAnim = false;
                                    targetObj.actions = [];
                                    if (targetObj.action.detail.Fx.repeat == undefined)
                                        targetObj.action.detail.Fx.repeat = 1;
                                    if (targetObj.audioUrl == undefined)
                                        targetObj.audioUrl = "";

                                    if (targetObj.action.detail.Fx.repeat == "infinite")
                                        infiAnim = false;
                                    else
                                        infiAnim = true;

                                    var actionObj = {
                                        "name": targetObj.action.name,
                                        "delay": 0,
                                        "audioUrl": targetObj.audioUrl,
                                        "Animation": {
                                            "name": targetObj.action.detail.Fx.animate,
                                            "repeat": targetObj.action.detail.Fx.repeat,
                                            "isAnimation": infiAnim
                                        }
                                    }
                                    if (targetObj.audioUrl && targetObj.audioUrl.length > 0)
                                        actionObj.audioUrl = targetObj.audioUrl;

                                    targetObj.actions.push(actionObj);
                                    delete targetObj.action;
                                }

                            });
                            // var triggerId = value.disp.trigger_Id.split("_")[1];

                            var triggerId;
                            if (value.disp.trigger_Id.toString().indexOf("_") >= 0) {
                                triggerId = value.disp.trigger_Id.split("_")[1];
                            } else {
                                triggerId = value.disp.trigger_Id;
                            }

                            var temp = vm.neweventsList[triggerId];
                            if (temp == null) {
                                vm.neweventsList[triggerId] = getEventObj(value, triggerId);
                            } else {
                                var evtObj = {}
                                evtObj.id = value.disp.evt;
                                evtObj.name = value.disp.action.name;
                                vm.neweventsList[triggerId].disp.evt.push(evtObj);
                                vm.neweventsList[triggerId].reg.push(value.reg);
                            }
                        });
                    }
                    vm.pageEvents = vm.neweventsList;
                } else {
                    vm.pageEvents = pageEvts;
                }
            }
            function readpageEvents() {

                var triggerId;

                var keys = Object.keys(vm.pageEvents);

                angular.forEach(keys, function (key) {

                    var eventObj = vm.pageEvents[key];
                    var triggerId = eventObj.disp.trigger_Id;
                    var pageloadEvt = "";
                    angular.forEach(eventObj.disp.evt, function (evtObj) {
                        var obj = {};
                        obj.evt = evtObj.id;
                        obj.name = evtObj.name;
                        obj.Value = evtObj.Value;

                        if (eventObj.disp.audioUrl && eventObj.disp.audioUrl.length > 0)
                            obj.audioUrl = eventObj.disp.audioUrl;

                        if (triggerId == 'charSvgO') {
                            var scope = angular.element(".pageContainer > .card[data-type=CHARACTER] .iCard").scope();
                            scope.dispEvents.push(obj);
                        }
                        else if (triggerId == "pageSvgO") {
                            pageloadEvt = obj.evt;
                            vm.cardLoadEvents.push(obj.evt);
                        }
                        else {
                            var scope = angular.element(".pageContainer > .card[data-id='" + triggerId + "'] .iCard").scope();
                            if (scope)
                                scope.dispEvents.push(obj);
                        }
                    });



                    angular.forEach(eventObj.reg, function (regObj) {
                        angular.forEach(regObj.targets, function (targetObj) {
                            if (targetObj.target_Id == 'charSvgI') {
                                var scope = angular.element(".pageContainer > .card[data-type=CHARACTER] .iCard").scope();
                            }
                            else if (targetObj.target_Id == 'pageSvgI') {
                                vm.pageLoadEvents.push(targetObj.actions[0]);
                            }
                            else
                                var scope = angular.element(".pageContainer > .card[data-id='" + targetObj.target_Id + "'] .iCard").scope();
                            if (scope) {
                                var obj = {};
                                obj.evt = regObj.evt;
                                obj.target_Id = targetObj.target_Id;
                                obj.actions = targetObj.actions;
                                if (vm.cardLoadEvents.length > 0 && obj.evt == pageloadEvt) obj.loadEvt = true; //&& vm.cardLoadEvents[0] == eventObj.disp.evt[0].id check madhulika
                                if (scope.card.type == 'TIMER') scope.card.loadEvt = true; //handling Timer Card load/widthout load event

                                scope.regEvents.push(obj);

                            }
                        });
                    });



                });
            }
        }
        return controller;

    });