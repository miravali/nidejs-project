define(['jquery', 'angular', 'views/events/lqd.events.utils'], function($, angular, eventUtils) {

    'use strict'

    var Card = function(scope, q) {
        this.scope = scope;
        this.$q = q;

        return this;
    };

    Card.prototype.inAnimations = ['None', 'bounce', 'flash', 'pulse', 'rubberBand', 'shake', 'headShake', 'jello', 'jackInTheBox', 'swing', 'tada', 'wobble', 'hinge',
        'bounceIn', 'bounceInDown', 'bounceInLeft', 'bounceInRight', 'bounceInUp',
        'fadeIn', 'fadeInDown', 'fadeInDownBig', 'fadeInLeft', 'fadeInLeftBig', 'fadeInRight', 'fadeInRightBig', 'fadeInUp', 'fadeInUpBig',
        'flip', 'flipInX', 'flipInY',
        'lightSpeedIn',
        'rotateIn', 'rotateInDownLeft', 'rotateInDownRight', 'rotateInUpLeft', 'rotateInUpRight',
        'slideInUp', 'slideInDown', 'slideInLeft', 'slideInRight',
        'zoomIn', 'zoomInDown', 'zoomInLeft', 'zoomInRight', 'zoomInUp',
        'rollIn', 'Random'
    ];
    Card.prototype.outAnimations = ['None', 'bounceOut', 'bounceOutDown', 'bounceOutLeft', 'bounceOutRight', 'bounceOutUp',
        'fadeOut', 'fadeOutDown', 'fadeOutDownBig', 'fadeOutLeft', 'fadeOutLeftBig', 'fadeOutRight', 'fadeOutRightBig', 'fadeOutUp', 'fadeOutUpBig',
        'flipOutX', 'flipOutY', 'lightSpeedOut',
        'rotateOut', 'rotateOutDownLeft', 'rotateOutDownRight', 'rotateOutUpLeft', 'rotateOutUpRight',
        'slideOutUp', 'slideOutDown', 'slideOutLeft', 'slideOutRight',
        'zoomOut', 'zoomOutDown', 'zoomOutLeft', 'zoomOutRight', 'zoomOutUp',
        'rollOut', 'Random'
    ];
    Card.prototype.element = undefined;

    Card.prototype.data = function(src) {
        for (var key in src) {
            this[key] = src[key];
        }

        this.isAnimate = true;
    }


    Card.prototype.applyHideAnimation = function(obj, $timeout) {
        var _card = this;
        setTimeout(function() {
            $(_card.element).css('display', 'block');
            $(_card.element).one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
                $(_card.element).removeClass(obj.name);
                $(_card.element).css('display', 'none');
            });
        }, 0);
    }
    Card.prototype.applyShowAnimation = function(obj, $timeout) {
        var _card = this;
        setTimeout(function() {
            $(_card.element).one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
                $(_card.element).removeClass(obj.name);

            });
        }, 0);
    }

    Card.prototype.reset = function(evt_data, $timeout, $animate) {
        var def = this.$q.defer();
        var card = this;
        var scope = this.scope;
        card.resetAnimation('in');
        card.resetAnimation('out');
        if (typeof scope.applyEvents == 'function') {
            scope.applyEvents(evt_data);
        }

        applyActions(card, card.loadActions, $timeout, $animate); //apply Card Page Load Events


        def.resolve();

        return def.promise;
    }
    Card.prototype.lock = function(evt_data, $timeout) {
        var def = this.$q.defer();
        var card = this;
        var scope = this.scope;

        card.isAnimate = true;
        card.isLock = true;
        scope.card.isLock = true;
        // if (typeof scope.applyEvents == 'function')
        //     scope.applyEvents(evt_data);
        eventUtils.lock(card.element);

        def.resolve();

        return def.promise;
    }
    Card.prototype.unlock = function(evt_data, $timeout) {
        var def = this.$q.defer();
        var card = this;
        var scope = this.scope;

        card.isAnimate = true;
        card.isLock = false;
        scope.card.isLock = false;
        // if (typeof scope.applyEvents == 'function')
        //     scope.applyEvents(evt_data);
        eventUtils.unlock(card.element);

        def.resolve();

        return def.promise;
    }
    Card.prototype.start = function(evt_data, $timeout) {
        var def = this.$q.defer();
        var card = this;
        var scope = this.scope;
        if (typeof scope.applyEvents == 'function')
            scope.applyEvents(evt_data);

        def.resolve();
        return def.promise;
    }

    Card.prototype.end = function(evt_data, $timeout) {
            var def = this.$q.defer();
            var card = this;
            var scope = this.scope;
            if (typeof scope.applyEvents == 'function')
                scope.applyEvents(evt_data);
            def.resolve();
            return def.promise;

        }
        //Timer and characterTimeline event when pageLoad
    Card.prototype.none = function(evt_data, $timeout) {

        var def = this.$q.defer();
        var card = this;
        def.resolve();

        return def.promise;

    }



    Card.prototype.show = function(evt_data, $timeout, $animate) {

        var def = this.$q.defer();
        var card = this;
        var scope = this.scope;
       
       
        card.isAnimate = true;
        $(card.element).css('display', 'block');
        if (typeof scope.applyEvents == 'function') scope.applyEvents(evt_data);


        if (evt_data.Animation) {
            if (evt_data.Animation.name == 'Random') { //choose Random animation
                var animations = ['bounceIn', 'wobble', 'pulse', 'rubberBand', 'swing', 'rotateIn', 'zoomIn'];
                evt_data.Animation.name = animations[Math.floor(Math.random() * animations.length)];
            }
            if (evt_data.Animation.name != '' && evt_data.Animation.name != 'None') {
                card.resetAnimation('in');
                $(card.element).removeClass(evt_data.Animation.name);
                $animate.addClass(card.element, evt_data.Animation.name);
                $(card.element)[0].style.animationIterationCount = evt_data.Animation.repeat;
                $(card.element)[0].style.WebkitAnimationIterationCount = evt_data.Animation.repeat;
            }

        }
        def.resolve();
        return def.promise;
    };
    Card.prototype.showcharbychar = function(action, $timeout, $animate, key) {

        var def = this.$q.defer();
        var card = this;
        var scope = this.scope;

        if (typeof scope.applyEvents == 'function')
            scope.applyEvents(action);
        def.resolve();

        return def.promise;
    }
    Card.prototype.sendtoback = function(action, $timeout, $animate, key) {
        var def = this.$q.defer();
        var card = this;
        var scope = this.scope;
        // if (typeof scope.applyEvents == 'function')
        //     scope.applyEvents(action);
        eventUtils.sendBack(card.element);
        def.resolve();
        return def.promise;
    }
    Card.prototype.bringtofront = function(action, $timeout, $animate, key) {
        var def = this.$q.defer();
        var card = this;
        var scope = this.scope;
        // if (typeof scope.applyEvents == 'function')
        //     scope.applyEvents(action);

        eventUtils.bringFront(card.element);
        def.resolve();
        return def.promise;
    }
    Card.prototype.hide = function(evt_data, $timeout, $animate) {

        var def = this.$q.defer();
        var card = this;
        var scope = this.scope;
        card.isAnimate = false;
        //For Reset All Media Components

        if (typeof scope.applyEvents == 'function') scope.applyEvents(evt_data);

        if (evt_data.Animation.name) {
            if (evt_data.Animation.name == 'Random') { //choose Random animation
                var animations = ['bounceIn', 'wobble', 'pulse', 'rubberBand', 'swing', 'rotateIn', 'zoomIn'];
                evt_data.Animation.name = animations[Math.floor(Math.random() * animations.length)];
            }
            if (evt_data.Animation.name != '' && evt_data.Animation.name != 'None') {
                card.isAnimate = true;
                card.resetAnimation('out');
                $(card.element).removeClass(evt_data.Animation.name);
                $animate.addClass(card.element, evt_data.Animation.name);
                $(card.element)[0].style.animationIterationCount = evt_data.Animation.repeat;
                $(card.element)[0].style.WebkitAnimationIterationCount = evt_data.Animation.repeat;
            } else {
                card.isAnimate = false;
                $(card.element).css('display', 'none');

            }
        }


        def.resolve();
        return def.promise;
    };
    Card.prototype.resetAnimation = function(animType) {
        var card = this;
        var classes = $(card.element).attr('class');
        var classNames = classes.split(" ");

        for (var i = 0; i < classNames.length; i++) {
            if (animType == 'in')
                for (var j = 0; j < card.inAnimations.length; j++) {
                    var isExist = classNames[i].indexOf(card.inAnimations[j]);
                    if (isExist >= 0)
                        $(card.element).removeClass(classNames[i]);
                }
            if (animType == 'out')
                for (var j = 0; j < card.outAnimations.length; j++) {
                    var isExist = classNames[i].indexOf(card.outAnimations[j]);
                    if (isExist >= 0)
                        $(card.element).removeClass(classNames[i]);
                }


        }
        $(card.element)[0].style.animationIterationCount = 0;
        $(card.element)[0].style.WebkitAnimationIterationCount = 0;

    }

    Card.prototype.play = function(evt_data, $timeout, $animate) {
        var def = this.$q.defer();

        var card = this;
        var scope = this.scope;

        if (typeof scope.applyEvents == 'function')
            scope.applyEvents(evt_data);

        def.resolve();

        return def.promise;
    };
    Card.prototype.pause = function(evt_data, $timeout, $animate) {
        var def = this.$q.defer();

        var card = this;
        var scope = this.scope;

        if (typeof scope.applyEvents == 'function')
            scope.applyEvents(evt_data);

        def.resolve();

        return def.promise;
    };
    Card.prototype.seek = function(evt_data, $timeout, $animate) {
        var def = this.$q.defer();

        var card = this;
        var scope = this.scope;

        if (typeof scope.applyEvents == 'function')
            scope.applyEvents(evt_data);

        def.resolve();

        return def.promise;
    };
    Card.prototype.goto = function(evt_data, $timeout, $animate) {
        var def = this.$q.defer();

        var card = this;
        var scope = this.scope;

        if (typeof scope.applyEvents == 'function')
            scope.applyEvents(evt_data);

        def.resolve();

        return def.promise;
    };
    Card.prototype.stop = function(evt_data, $timeout, $animate) {
        var def = this.$q.defer();
        var card = this;
        var scope = this.scope;
        if (typeof scope.applyEvents == 'function')
            scope.applyEvents(evt_data);

        def.resolve();


        return def.promise;
    };

    Card.prototype.change = function(action, $timeout, $animate, key) {

        var def = this.$q.defer();
        var card = this;
        var scope = this.scope;

        if (typeof scope.applyEvents == 'function')
            scope.applyEvents(action);
        def.resolve();

        return def.promise;
    }

    Card.prototype.initEvents = function(disEvts, regEvts, clickEvts, dblClickEvts, $scope, $rootScope, $timeout, $animate, showEvts, hideEvts, valueEvts) {
        var card = this;
        var audio = new Audio();
        var scope = this.scope;
        angular.forEach(disEvts, function(data) {
            //Handle Click Event
            if (data.name.toLowerCase() == "click") {
                clickEvts.push(data);
            }
            //Handle Click Event
            if (data.name.toLowerCase() == "dblclick") {
                dblClickEvts.push(data);
            }
            //Handle show Events
            if (data.name.toLowerCase() == "show") {
                showEvts.push(data);
            }
            //Handle hide Events
            if (data.name.toLowerCase() == "hide") {
                hideEvts.push(data);
            }
            if (data.name.toLowerCase() == "value") {
                valueEvts.push(data);
            }

        });
        angular.forEach(regEvts, function(data) {

            card.scope.$on(data.evt, function(evt) {

                //For Handling PageLoad EVENTS
                if (data.loadEvt != undefined && data.loadEvt) {
                    //to avoid  blink effect in hide
                    if (scope.card.type != 'TIMER') {
                        if (data.actions[0].name.toLowerCase() != 'hide') //Page load first action other than hide card should show first
                        {
                            card.isAnimate = true;
                        } else card.isAnimate = false; //For Hadling Load Evts(once click Events Tab in Host)
                    }
                    card.cardLoadEvt = data.evt;
                    card.loadActions = data.actions;
                }

                applyActions(card, data.actions, $timeout, $animate);

            });

        });

        $(card.element).on('singleclick', function(e) {
            if (card.clickCount == undefined)
                card.clickCount = 0;
            else
                card.clickCount += 1;
            if (card.clickCount > (clickEvts.length - 1))
                card.clickCount = 0;
            var data = clickEvts[card.clickCount];
            if (data)
                if (!card.isLock) //for checking whether clicked card is locked or not (it will fire any event on card)Ex: if button locked self event on button should not fire
                    $rootScope.$broadcast(data.evt);
        });

        $(card.element).on('dblclick', function(e) {

            if (card.dbclickCount == undefined)
                card.dbclickCount = 0;
            else
                card.dbclickCount += 1;
            if (card.dbclickCount > (dblClickEvts.length - 1))
                card.dbclickCount = 0;
            var data = dblClickEvts[card.dbclickCount];
            if (data)
                if (!card.isLock) //for checking whether clicked card is locked or not (it will fire any event on card)Ex: if button locked self event on button should not fire
                    $rootScope.$broadcast(data.evt);

        });
    }

    function applyActions(card, actions, $timeout, $animate) {
        var totalDelay = 0,
            data = {};
        data.actions = actions;
        for (var _line = 0; _line < data.actions.length; _line++) {
            (function() {
                var m_line = _line;
                var actionObj = data.actions[m_line];
                totalDelay += actionObj.delay;
                actionObj.name = actionObj.name.toLowerCase();
                if (!actionObj.delay) actionObj.delay = 0;
                setTimeout(function() {
                    var actionObj = data.actions[m_line];
                    if (actionObj.name == 'unlock' || !card.isLock) { // After lock next actions will not work
                        card[actionObj.name](actionObj, $timeout, $animate).then(function() {
                            if (actionObj.Animation && actionObj.Animation.name != 'None') {
                                if (actionObj.name == 'show') card.applyShowAnimation(actionObj.Animation, $timeout);
                                if (actionObj.name == 'hide') card.applyHideAnimation(actionObj.Animation, $timeout);
                            }
                        });
                    }

                }, totalDelay * 1000);
            })();

        }
    }



    return Card;

});