define(['jquery', 'angular'], function ($, angular) {

    var sideCard;
    var libVar = "library/";

    var patterns = [{
        exp: new RegExp("%20", "g"),
        val: " "
    }, {
        exp: new RegExp(libVar + "assets/", 'gi'),
        val: "data/assets/"
    }];


    function readCard(pCard, cardService, parentContainer, $compile, $scope, layoutType) {



        if (!sideCard)
            sideCard = $(".pageContainer").controller().sideCard;

        cardService.set(pCard.id, pCard);

        var card = "";
        if (pCard.type == "IGROUP") {
            var cardhtml = "<lqd-i-grp></lqd-i-grp>";
            card = $(cardhtml);
        } else {
            var configCard = sideCard[pCard.type];
            var card = $(configCard.html);
            if (pCard.type == 'QUESTION') {
                card = $(configCard.qType[pCard.question]);
            } else if (pCard.type == 'GALLERY') {
                card = $(configCard.gallaryStyle[pCard.gallery]);
            }
        }

        if (pCard.class.length > 0)
            pCard.class = pCard.class;
        else
            pCard.class = "";


        pCard.state = pCard.state ? pCard.state : "reload";

        $(card).attr({
            "data-id": pCard.id,
            state: pCard.state,
            class: "card animated " + pCard.class,
            style: pCard.position,
            "data-type": pCard.type
        });

        angular.element(parentContainer).append($compile(card)($scope));

        if (layoutType == 'Responsive') {
            setTimeout(function () {
                $(card).css({
                    'left': '',
                    'top': '',
                    'width': '100%',
                    'height': '100%'
                });

                if (pCard.type == 'TEXT' ||
                    pCard.type == 'TITLE') {
                    $(card).css({
                        'height': 'auto',
                        'width': 'calc(100% - 10px)'
                    });
                    $(card).css({
                        'padding': '5px'
                    });
                    $(card).find('.sNote')[0].style.padding = '5px';
                }

                if (pCard.type == 'BUTTON') {
                    $(card).css({
                        'height': 'auto',
                        'width': '100%'
                    });
                    $(card).children('iCard').css({
                        'padding': '5px'
                    });
                }

                if (pCard.type == 'IMAGE') {
                    $(card).css({
                        'width': 'calc(100% - 10px)',
                        'height': 'calc(100% - 10px)',
                        'padding': '5px'
                    });
                }
                if (pCard.type == 'TIMER') {
                    $(card).css({
                        'height': 'auto',
                        'width': 'auto'
                    });
                }
                $(card)[0].style.display = '';
                $(card).css('z-index', '');
            }, 500);
        } else {
            $(card).resize();
            $(card).children('.resize-handle').hide();
            if (pCard.type == "BUTTON") {
                $(card).find('.iCard')[0].style.padding = '5px';
            }
            if (pCard.type == 'TITLE') {
                $(card).find('.sNote')[0].style.padding = '5px';
            }
            $(card).css('z-index', '');

            if (pCard.type == 'TITLE' ||
                pCard.type == 'TEXT' ||
                pCard.type == 'QUESTION' ||
                pCard.type == 'QUIZ' ||
                pCard.type == 'TABLE' ||
                pCard.type == 'TABLE' ||
                pCard.type == 'BUTTON' ||
                pCard.type == 'TIMER') {
                $(card).css('display', 'inline-table');
            }
        }
    }

    function evalPageJson(card) {
        //Convert obj to string 
        var cardStr = (typeof card == "object") ? angular.toJson(card) : card;
        for (var i = 0; i < patterns.length; i++) {
            cardStr = cardStr.replace(patterns[i].exp, patterns[i].val);
        }
        // console.log("Result :" + cardStr);
        return angular.fromJson(cardStr);

    }

    return {
        readCard: readCard,
        evalPageJson: evalPageJson
    }
});