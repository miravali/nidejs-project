define(['jquery', 'angular', 'components/core/common/lqd.media.utilities'], function ($, angular, commonmedia) {

    'use strict'

    var Card = function (scope, q) {
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

    Card.prototype.data = function (src) {
        for (var key in src) {
            this[key] = src[key];
        }

        this.isAnimate = true;

        
    }


    Card.prototype.applyHideAnimation = function (obj, $timeout) {
        var _card = this;
        setTimeout(function () {
            $(_card.element).css('display', 'block');
            $(_card.element).one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
                $(_card.element).removeClass(obj.name);
                $(_card.element).css('display', 'none');
            });
        }, 0);
    }
    Card.prototype.applyShowAnimation = function (obj, $timeout) {
        var _card = this;

        setTimeout(function () {
            $(_card.element).css('display', 'block');
            $(_card.element).one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
                $(_card.element).removeClass(obj.name);

            });
        }, 0);
    }


    Card.prototype.timer = function () {

        console.log("Timer ....");
    }

    Card.prototype.load = function (evt_data, $timeout) {

        var def = this.$q.defer();
          
        var card = this;
       

        
            card.isAnimate = true;
            def.resolve();
        

        return def.promise;
        //console.log("Load ....");
    }
    Card.prototype.start = function (evt_data, $timeout) {
        var def = this.$q.defer();
        var card = this;
        var scope = this.scope;
            card.isAnimate = true;
             if (typeof scope.applyEvents == 'function')
	                scope.applyEvents(evt_data);
            // if (card.type == 'TIMER') {
            //     card.isAnimate = scope.card.props.displayTimer;
            //     scope.startTimer();
            // } else if (card.type == 'CHARACTER')
            //     scope.triggerChar();
            def.resolve();
       

        return def.promise;

    }
    Card.prototype.end = function (evt_data, $timeout) {
        var def = this.$q.defer();
        var card = this;
        var scope = this.scope;
       
        // if (card.type == 'CHARACTER') {
        //     scope.resetAudio();
        //     scope.resetCharStage();
        // }
         if (typeof scope.applyEvents == 'function')
	                scope.applyEvents(evt_data);
        def.resolve();
        return def.promise;

    }
    //Timer and characterTimeline event when pageLoad
    Card.prototype.none = function (evt_data, $timeout) {

        var def = this.$q.defer();
        var card = this;
        def.resolve();
        
        return def.promise;

    }

    Card.prototype.click = function () {

        console.log("Click ....");
    }

    Card.prototype.show = function (evt_data, $timeout, $animate) {

        var def = this.$q.defer();
        var card = this;
        var scope = this.scope;
        
        //For Reset All Media Components
        if (typeof scope.resetMedia == 'function')
            if(evt_data.audioUrl!= undefined && evt_data.audioUrl.length>0)
            scope.resetMedia();
       
            card.isAnimate = true;
            $(card.element).css('display', 'block');
            if (typeof scope.applyEvents == 'function') {
                if (evt_data.audioUrl && evt_data.audioUrl.length > 0) scope.applyEvents(evt_data);
            }
            

        if (evt_data.Animation) {
            if (evt_data.Animation.name == 'Random') { //choose Random animation
                    var animations = ['bounceIn', 'wobble', 'pulse', 'rubberBand', 'swing', 'rotateIn', 'zoomIn'];
                evt_data.Animation.name = animations[Math.floor(Math.random() * animations.length)];
            }
            if (evt_data.Animation.name != '' && evt_data.Animation.name != 'None') {
                card.resetAnimation(card.element);
                $(card.element).removeClass(evt_data.Animation.name);
                $animate.addClass(card.element, evt_data.Animation.name);
                $(card.element)[0].style.animationIterationCount = evt_data.Animation.repeat;
                $(card.element)[0].style.WebkitAnimationIterationCount = evt_data.Animation.repeat;
            }

            }


            def.resolve();
       


        return def.promise;
    };
    Card.prototype.resetAnimation =function()
    {
        var card = this;
       

        var classes = $(card.element).attr('class'); 
        var animation =_.last(classes.split(" "));
        var isExist =card.inAnimations.indexOf(animation);
        if(isExist>=0)
        $(card.element).removeClass(animation);
        else{
            isExist =card.outAnimations.indexOf(animation);
            if(isExist>=0)
            $(card.element).removeClass(animation);
        }
        $(card.element)[0].style.animationIterationCount = 0;
        $(card.element)[0].style.WebkitAnimationIterationCount = 0;
        
    }
    Card.prototype.hide = function (evt_data, $timeout, $animate) {
      
        var def = this.$q.defer();
        var card = this;
        var scope = this.scope;
        
        //For Reset All Media Components
        if (typeof scope.resetMedia == 'function')
            scope.resetMedia();
        if (typeof scope.applyEvents == 'function') {
                if (evt_data.audioUrl && evt_data.audioUrl.length > 0) scope.applyEvents(evt_data);
            }
        if (evt_data.Animation.name) {
            if (evt_data.Animation.name == 'Random') { //choose Random animation
                var animations = ['bounceIn', 'wobble', 'pulse', 'rubberBand', 'swing', 'rotateIn', 'zoomIn'];
                evt_data.Animation.name = animations[Math.floor(Math.random() * animations.length)];
            }
            if (evt_data.Animation.name != '' && evt_data.Animation.name != 'None') {
                card.isAnimate = true;
                card.resetAnimation(card.element);
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
    Card.prototype.play = function (evt_data, $timeout, $animate) {
        var def = this.$q.defer();
            
        var card = this;
        var scope = this.scope;
        
            if (typeof scope.applyEvents == 'function')
                scope.applyEvents(evt_data);

            def.resolve();
        
        return def.promise;
    };
    Card.prototype.stop = function (evt_data, $timeout, $animate) {
	        var def = this.$q.defer();
	        var card = this;
	        var scope = this.scope;
       
        
            if (typeof scope.applyEvents == 'function')
                scope.applyEvents(evt_data);
        
	    def.resolve();
      

        return def.promise;
    };
    Card.prototype.showplay = function (evt_data, $timeout, $animate) {
        var def = this.$q.defer();
        var card = this;
        var scope = this.scope;
        
        
            card.isAnimate = true;
            $(card.element).css('display', 'block');
            if (typeof scope.applyEvents == 'function')
                scope.applyEvents(evt_data);

            def.resolve();
        

        return def.promise;
    };
    Card.prototype.hideplay = function (evt_data, $timeout, $animate) {
        var def = this.$q.defer();
        var card = this;
        var scope = this.scope;
        
     
            card.isAnimate = false;
            $(card.element).css('display', 'none');
            if (typeof scope.applyEvents == 'function')
                scope.applyEvents(evt_data);
            def.resolve();
        

        return def.promise;
    };



    Card.prototype.scroll = function () {

        console.log("Scroll ....");
    }
    Card.prototype.validator = function () {

        console.log("Validator ....");
    }
    Card.prototype.seek = function () {

        console.log("Seek ....");
    }
    Card.prototype.change = function (action, $timeout, $animate, key) {
        
        var def = this.$q.defer();
        var card = this;
        var scope = this.scope;
        //  if (typeof scope.resetMedia == 'function')
        //     scope.resetMedia();
        console.log("change func:"+new Date().toLocaleTimeString());
      
         //resetAnimation(card.element);
        
         
        if (typeof scope.applyEvents == 'function')
                scope.applyEvents(action);
        def.resolve();
       
       return def.promise;
    }

    Card.prototype.initEvents = function (disEvts, regEvts, clickEvts, dblClickEvts, $scope, $rootScope, $timeout, $animate) {
        var card = this;
        var audio = new Audio();
        var scope = this.scope;
        angular.forEach(disEvts, function (data) {
            //Handle Click Event
            if (data.name.toLowerCase() == "click") {
                clickEvts.push(data);
            }
            //Handle Click Event
            if (data.name.toLowerCase() == "dblclick") {
                dblClickEvts.push(data);
            }

        });
         angular.forEach(regEvts, function (data) {
            
            card.scope.$on(data.evt, function (evt) {
                
                var totalDelay =0;
                for (let line=0; line<data.actions.length; line++) {
                    var actionObj =data.actions[line];
                    totalDelay += actionObj.delay;
                    actionObj.name = actionObj.name.toLowerCase();
                    if(!actionObj.delay) actionObj.delay =0;
                    setTimeout(function () {
                        var actionObj =data.actions[line];
                        card[actionObj.name](actionObj, $timeout, $animate).then(function () {
                            if (actionObj.Animation != '' && actionObj.Animation.name != 'None') {
                                if (actionObj.name == 'show') card.applyShowAnimation(actionObj.Animation, $timeout);
                                if (actionObj.name == 'hide') card.applyHideAnimation(actionObj.Animation, $timeout);
                            }
                        });
                    }, totalDelay* 1000);
                }

            });

        });

        $(card.element).on('singleclick', function (e) {
            if (clickEvts.length > 0) {
                var data = clickEvts[0];

                // if (data.audioUrl != undefined && data.audioUrl.length > 0) {
                //     if (audio) {
                //         audio.pause();
                //         audio.currentTime = 0;
                //     }
                //     audio.src = data.audioUrl;
                //     audio.play();
                // }
                     
                $rootScope.$broadcast(data.evt);
            }
        });
        $(card.element).on('dblclick', function (e) {
            if (dblClickEvts.length > 0) {
                var data = dblClickEvts[0];

                // if (data.audioUrl != undefined && data.audioUrl.length > 0) {
                //     if (audio) {
                //         audio.pause();
                //         audio.currentTime = 0;
                //     }
                //     audio.src = data.audioUrl;
                //     audio.play();
                // }
                $rootScope.$broadcast(data.evt);
            }
        });
    }



    return Card;

});