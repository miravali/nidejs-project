define([], function () {
    'use strict';

    function updateCard(actionobject, card, $element) {
        if (actionobject.Position) {
            $($element).css('transform', '');
            $($element).css({
                WebkitTransition: 0.5 + 's ease-out',
                MozTransition: 0.5 + 's ease-out',
                MsTransition: 0.5 + 's ease-out',
                OTransition: 0.5 + 's ease-out',
                transition: 0.5 + 's ease-out'
                //'-webkit-transform':'rotate(360deg)'
            });
            if (actionobject.Position.x) {
                if (actionobject.Position.isRelative) {
                    var left = parseInt($($element).css('left'));
                    if (isNaN(left))
                        left = 0;
                    left += parseInt(actionobject.Position.x);
                    $($element).css('left', left + "px");

                } else
                    $($element).css('left', actionobject.Position.x + "px");
            }

            if (actionobject.Position.y) {
                if (actionobject.Position.isRelative) {
                    var top = parseInt($($element).css('top'));
                    if (isNaN(top))
                        top = 0;
                    top += parseInt(actionobject.Position.y);
                    $($element).css('top', top + "px");

                } else {
                    $($element).css('top', actionobject.Position.y + "px");
                }
            }


        }
        if (actionobject.Style) {
            if (actionobject.Style.borderClass)
                card.borderRadiusClass = actionobject.Style.borderClass;
            //else card.borderRadiusClass = '';
            if (actionobject.Style.shadowClass || actionobject.Style.shadowClass == '')
                card.shadowClass = actionobject.Style.shadowClass;

            //else card.shadowClass = '';
        }
        //***************** Background color and image *************** */
        if (actionobject.Style.backgroundImage) {
            card.bgImage = true;
            card.backgroundColor = '';
            if (actionobject.Style.backgroundImage.includes("linear-gradient")) card.bgImage = false;
            card.backgroundImage = actionobject.Style.backgroundImage;
        } else if (actionobject.Style.backgroundColor) {
            card.backgroundImage = '';
            card.bgImage = true;
            card.backgroundColor = actionobject.Style.backgroundColor;
        }

        //******************* Filp And Rotate ***************** */
        if (actionobject.Style.flip) {
            if (card.flip == undefined) card.flip = {};
            card.flip.transform = actionobject.Style.flip.transform;
            card.flip.transition = actionobject.Style.flip.transition;
            card.flip.transformstyle = actionobject.Style.flip.transformstyle;
        }
        //***************** Height and Width ***************** */
        if (actionobject.Content) {
            $element.css({
                'height': actionobject.Content.height,
                'width': actionobject.Content.width,
                'transform': '',
                WebkitTransition: 0.5 + 's ease-out',
                MozTransition: 0.5 + 's ease-out',
                MsTransition: 0.5 + 's ease-out',
                OTransition: 0.5 + 's ease-out',
                transition: 0.5 + 's ease-out'
            });
        }


    }

    function getPlainText(text) {
        var text = text ? String(text).replace(/<[^>]+>/gm, '') : '';
        //var text  = text? String(text).replace(/((&lt)|(<)(?:.|\n)*?(&gt)|(>))/gm, '') : '' ;

        text = text.replace(/&nbsp;/g, '');
        text = text.replace(/&lt;/g, '<');
        text = text.replace(/&gt;/g, '>');
        text = text.replace(/\n/g, '');
        text = text.replace(/\s/g, '');
        text = text.replace(/&amp;/g, '&');
        return text.trim();

    }

    function resetCard(cardObj, card, $element) {

        //********** Reset the background image from card ******** */
        if (cardObj.backgroundImage) {
            card.bgImage = true;
            if (cardObj.backgroundImage.includes("linear-gradient")) card.bgImage = false;
            card.backgroundImage = cardObj.backgroundImage
        } else card.backgroundImage = '';

        //********** Reset the background colour from card ******** */
        if (cardObj.backgroundColor) {
            card.backgroundColor = cardObj.backgroundColor;
            card.bgImage = true;
        } else card.backgroundColor = '';

        //********** Reset the flip and rotate from card ******** */
        if (cardObj.flip) {
            card.flip.transform = cardObj.flip.transform;
            card.flip.transition = cardObj.flip.transition;
            card.flip.transformstyle = cardObj.flip.transformstyle;
        } else card.flip = {};

        //********** Reset the border radius from card ******** */
        if (cardObj.borderRadiusClass) card.borderRadiusClass = cardObj.borderRadiusClass;
        else card.borderRadiusClass = '';

        //********** Reset the Shadow from card ******** */
        if (cardObj.shadowClass) card.shadowClass = cardObj.shadowClass;
        else card.shadowClass = '';

        if (cardObj.isAnimate || cardObj.isAnimate == undefined) card.isAnimate = true;
        else card.isAnimate = false;
    }

    function convertDurationFormat(duration) {
        var totalSeconds = Math.floor(duration);
        if (totalSeconds >= 60) {
            if (totalSeconds >= 3600) {
                var Totaltime_hrs = Math.floor(totalSeconds / 3600);
                var Totaltime_min = Math.floor((totalSeconds - (Totaltime_hrs * 3600)) / 60);
                var Totaltime_sec = totalSeconds - (Totaltime_hrs * 3600) - (Totaltime_min * 60);
            } else {
                var Totaltime_hrs = "00";
                var Totaltime_min = Math.floor(totalSeconds / 60);
                var Totaltime_sec = totalSeconds - (Totaltime_min * 60);
            }
            if (Totaltime_min < 10)
                Totaltime_min = "0" + Totaltime_min;
            if (Totaltime_sec < 10)
                Totaltime_sec = "0" + Totaltime_sec;
            var time = Totaltime_hrs + ":" + Totaltime_min + ":" + Totaltime_sec;
            return time;
        } else {
            if (totalSeconds < 10)
                totalSeconds = "0" + totalSeconds;
            var time = "00:00:" + totalSeconds;
            return time;
        }

    }

    function bringFront(ele) {
        $(ele).insertAfter($(ele).parent().children('.card').last());
    }

    function sendBack(ele) {
        $(ele).insertBefore($(ele).parent().children('.card').first());
    }

    function lock(ele) {
        $(ele).css('cursor', 'url(library/assets/images/lock.png), auto');
    }

    function unlock(ele) {
        $(ele).css('cursor', 'default');
    }
    return {
        updateCard: updateCard,
        resetCard: resetCard,
        convertDurationFormat: convertDurationFormat,
        getPlainText: getPlainText,
        bringFront: bringFront,
        sendBack: sendBack,
        lock: lock,
        unlock: unlock
    }
});