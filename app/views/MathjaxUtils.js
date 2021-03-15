define(['jquery'], function ($) {
    "use strict";

    var target = null;

    $.fn.extend({
        renderMathJax:renderMathJax
    });

    function renderMathJax(){
        MathJax.Hub.Queue(["Typeset", MathJax.Hub, $(this)[0]]);
    }

    return undefined;
});