define(['angular',
    'components/core/common/lqd.common.module',
    'components/core/Animation/lqd.library.animation',
    'components/general/shapes/main',
    'components/general/title/main',
    'components/general/text/main',
    'components/general/image/main',
    'components/general/imgCollection/main',
    'components/general/button/main',
    'components/general/audio/main',
    'components/general/videoYT/main',
    'components/general/video/main',
    'components/general/videogallery/main',
    'components/general/question/main',
    'components/general/interactivegrp/main',
    'components/general/interactiveVideo/main',
    'components/general/quiz/preview/Preview.module',
    'components/general/quiz/main',
    'components/core/dataLink/main',
    'components/core/dataLink_new/main',
    'components/general/accordion/main',
    'components/general/slider/main',
    'components/general/slider/preview/slider.preview.module',
    'components/general/table/main',
    'components/general/list/main',
    'components/general/character/main',
    'components/general/timer/main',
    'components/general/date/main',
    'components/general/input/main',


    'components/interactive/charts/main',
    'components/interactive/pyramid/main',
    'components/interactive/timeline/main',
    'components/general/swf/main'



], function (angular) {
    'use strict';

    var lqdCards = angular.module("lqdCardMdl", [
        'lqdCommonMdl',
        'lqdFX',
        'lqdCanvasMdl',
        'lqdTitleMdl',
        'lqdTextMdl',
        'lqdImageMdl',
        'lqdImgCollecMdl',
        'lqdButtonMdl',
        'lqdAudioMdl',
        'lqdVideoYTMdl',
        'lqdVideoMdl',
        'lqdVideoGalleryMdl',
        'lqdQuestionMdl',
        'lqdQuizMdl',
        'lqdQuizPreMdl',
        'lqdDataLinkMdl',
        'lqdDataLinkNewMdl',
        'lqdAccordionMdl',
        'lqdInteractiveGrpMdl',
        'lqdInteractiveVideoMdl',
        'lqdSliderMdl',
        'SliderPreMdl',
        'lqdTableMdl',
        'lqdListMdl',
        'lqdCharacterCardMdl',
        'lqdTimerMdl',
        'lqdDateMdl',
        'lqdInputMdl',
        'lqdChartsMdl',
        'lqdPyramidMdl',
        'lqdTimelineMdl',
        'lqdSwfMdl'
    ]);

    return lqdCards;

});