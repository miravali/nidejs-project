define(['views/stage/responsive/Utils'], function(utils) {
    'use strict';



    var GridItem = function(item) {

        this.props = {
            x: isNaN(item.x) ? 1 : item.x,
            y: isNaN(item.y) ? 1 : item.y,
            w: isNaN(item.w) ? 1 : item.w,
            h: isNaN(item.h) ? 1 : item.h,
            i: isNaN(item.i) ? 1 : item.i

        };

        if (item.className) {
            if (item.className.indexOf("placeholder") >= 0) {
                this.props.children = $("<div class='GridItem grid-placeholder'></div>");
                this.props.className = item.className;
            }

        } else {
            var ele = $("<div class='GridItem' key='" + (isNaN(item.i) ? 1 : item.i) + "'><div class='shadow'></div></div>");
            this.props.children = item.children ? item.children : ele;

            $(ele).find(".shadow")
                .before('<span class="resize-handle resize-handle-nw"> </span>')
                .before('<span class="resize-handle resize-handle-ne"></span>')
                .after('<span class="resize-handle resize-handle-se"></span>')
                .after('<span class="resize-handle resize-handle-sw"></span>');
        }

        this.state = {};
        this.isPropsChange = false;
    }


    // Helper for generating column width
    GridItem.prototype.calcColWidth = function calcColWidth() {
        var _props = this.props;
        var margin = _props.margin;
        var containerPadding = _props.containerPadding;
        var containerWidth = _props.containerWidth;
        var cols = _props.cols;


        if (_props.w > containerWidth) {
            _props.w = containerWidth;
        }
        if (_props.h > containerWidth) {
            _props.h = containerWidth;
        }

        return (containerWidth - margin[0] * (cols - 1) - containerPadding[0] * 2) / cols;
    };

    GridItem.prototype.calcWH = function calcWH(_ref) {
        var height = _ref.height,
            width = _ref.width;
        var _props4 = this.props,
            margin = _props4.margin,
            maxRows = _props4.maxRows,
            cols = _props4.cols,
            rowHeight = _props4.rowHeight,
            x = _props4.x,
            y = _props4.y;

        var colWidth = this.calcColWidth();

        // width = colWidth * w - (margin * (w - 1))
        // ...
        // w = (width + margin) / (colWidth + margin)
        var w = Math.round((width + margin[0]) / (colWidth + margin[0]));
        var h = Math.round((height + margin[1]) / (rowHeight + margin[1]));

        // Capping
        w = Math.max(Math.min(w, cols - x), 0);
        h = Math.max(Math.min(h, maxRows - y), 0);
        return {
            w: w,
            h: h
        };
    };

    GridItem.prototype.calculateWH = function(widthPx, heightPx, colWidth, rowHeight, margin) {
        var w = Math.ceil((widthPx) / (colWidth));
        // var w = Math.ceil((widthPx - margin[0]) / (colWidth + margin[0]));
        var h = Math.ceil((heightPx - margin[1]) / (rowHeight + margin[1]));
        return {
            w: w,
            h: h
        };
    };


    GridItem.prototype.calcPosition = function calcPosition(x, y, w, h, state) {
        var _props2 = this.props;
        var margin = _props2.margin;
        var containerPadding = _props2.containerPadding;
        var rowHeight = _props2.rowHeight;

        var colWidth = this.calcColWidth();

        var out = {
            left: Math.round((colWidth + margin[0]) * x + containerPadding[0]),
            top: Math.round((rowHeight + margin[1]) * y + containerPadding[0]),

            // 0 * Infinity === NaN, which causes problems with resize constriants;
            // Fix this if it occurs.
            // Note we do it here rather than later because Math.round(Infinity) causes deopt
            width: w === Infinity ? w : Math.ceil(colWidth * w + Math.max(0, w) * margin[1]),
            height: h === Infinity ? h : Math.ceil(rowHeight * h + Math.max(0, h) * margin[1])
        };

        if (state && state.resizing) {
            out.width = Math.ceil(state.resizing.width);
            out.height = Math.ceil(state.resizing.height);
        }

        if (state && state.dragging) {
            out.top = Math.round(state.dragging.top);
            out.left = Math.round(state.dragging.left);
        }

        return out;
    };

    GridItem.prototype.createStyle = function createStyle(pos) {
        var _props5 = this.props,
            usePercentages = _props5.usePercentages,
            containerWidth = _props5.containerWidth,
            useCSSTransforms = _props5.useCSSTransforms;


        var style = "";
        // CSS Transforms support (default)
        if (useCSSTransforms) {
            style = utils.setTransform(pos);
        }
        // top,left (slow)
        else {
            style = utils.setTopLeft(pos);

            // This is used for server rendering.
            if (usePercentages) {
                style.left = (0, _utils.perc)(pos.left / containerWidth);
                style.width = (0, _utils.perc)(pos.width / containerWidth);
            }
        }

        return style;
    };

    /**
     * Translate x and y coordinates from pixels to grid units.
     * @param  {Number} top  Top position (relative to parent) in pixels.
     * @param  {Number} left Left position (relative to parent) in pixels.
     * @return {Object} x and y in grid units.
     */
    GridItem.prototype.calcXY = function calcXY(top, left) {
        var _props3 = this.props,
            margin = _props3.margin,
            cols = _props3.cols,
            rowHeight = _props3.rowHeight,
            w = _props3.w,
            h = _props3.h,
            maxRows = _props3.maxRows;

        var colWidth = this.calcColWidth();

        var x = Math.round((left - margin[0]) / (colWidth + margin[0]));
        var y = Math.round((top - margin[1]) / (rowHeight + margin[1]));

        // Capping
        x = Math.max(Math.min(x, cols - w), 0);
        y = Math.max(Math.min(y, maxRows - h), 0);

        return {
            x: x,
            y: y
        };
    };



    GridItem.prototype.render = function render() {
        var _props8 = this.props,
            x = _props8.x,
            y = _props8.y,
            w = _props8.w,
            h = _props8.h,
            isDraggable = _props8.isDraggable,
            isResizable = _props8.isResizable;
        // useCSSTransforms = _props8.useCSSTransforms;

        var pos = this.calcPosition(x, y, w, h, this.state);


        var ele = this.props.children;

        //Check For Resizable
        $(ele).css(this.createStyle(pos));
        if (_props8.state && (_props8.state == "DragEnd" || _props8.state == "ResizeEnd")) {
            $(ele).css({
                top: "",
                left: ""
            });
            delete _props8["state"];
        }

        // update of imge url 
        if ($(ele).find('.shadow > .card').attr('data-type') == 'IMAGE') {
            var src = $(ele).find('img').attr('src');
            if (!src) return;
            var n = src.indexOf("?");
            var s = src.substring(0, n != -1 ? n : src.length);
            var w = $(ele).width() - 10;
            $(ele).find('img').attr("src", s.concat("?w=" + w + "&h=100%&carve=true"));
            $(ele).find('img').attr("ng-src", s.concat("?w=" + w + "&h=100%&carve=true"));
        }


        if ($(ele).find('.canvasShape').scope() && $(ele).find('.canvasShape').find('canvas').length) {
            var iCardHeight = $(ele).find('.shadow > .card').innerHeight();
            var iCardWidth = $(ele).find('.shadow > .card').innerWidth();
            $(ele).find('.canvasShape').scope().shapeType($(ele), $(ele).find('.iCard').scope().card.shape.type, $(ele).find('.iCard').scope().card);
        }
    };
    return GridItem;

});