define([
    'views/stage/responsive/Utils',
    'views/editor.readcards.utils',
    'views/stage/responsive/GridEvents',
    'views/stage/responsive/GridItem'
], function (utils, readCardUtils, gridEvent, GridItem) {
    'use strict';

    var GridLayout = function (item) {
        this.props = {
            style: item.style ? item.style : '',
            width: item.width ? item.width : '',
            autoSize: (item.autoSize != null) ? item.autoSize : true,
            cols: item.cols ? item.cols : 12,
            className: item.className ? item.className : '',
            rowHeight: item.rowHeight ? item.rowHeight : 1,
            maxRows: item.maxRows ? item.maxRows : Infinity, // infinite vertical growth
            layout: [],
            margin: item.margin ? item.margin : [1, 1],
            containerPadding: item.containerPadding ? item.containerPadding : [1, 1],
            useCSSTransforms: item.useCSSTransforms ? item.useCSSTransforms : false,
            verticalCompact: item.verticalCompact ? item.verticalCompact : false,
            isDraggable: item.isDraggable ? item.isDraggable : false,
            isResizable: item.isResizable ? item.isResizable : false
        }

        this.container = $("<div class='GridLayout'></div>");
        this.children = [];
        this.initEvents();
        this.state = {};
        this.deviceLayout = [];

    }

    //updating layout cols here
    GridLayout.prototype.updateCols = function (cols) {
        this.props.cols = cols;
        console.log(" GridLayout.props.cols :  " + this.props.cols);
    }
    GridLayout.prototype.updateLayoutWidth = function (val) {
        this.props.width = val;
    }

    GridLayout.prototype.initEvents = function () {
        gridEvent.init(this);
    }

    GridLayout.prototype.updateDeviceLayout = function (val) {

        this.deviceLayout.lg = val;
        this.deviceLayout.md = val;
        this.deviceLayout.tl = val;
        this.deviceLayout.sm = val;
        this.deviceLayout.xs = val;

        this.props.layout = angular.copy(val);

    }

    GridLayout.prototype.containerHeight = function containerHeight() {
        if (!this.props.autoSize) return;
        var nbRow = utils.bottom(this.props.layout);
        // var containerPaddingY = this.props.containerPadding ? this.props.containerPadding[1] : this.props.margin[1];
        var containerPaddingY = 5;
        var containerHgt = nbRow * this.props.rowHeight + (nbRow - 1) * this.props.margin[1] + containerPaddingY;
        return containerHgt;
    };

    GridLayout.prototype.gridChildren = function () {
        var children = $(".GridLayout").children();
        return children;
    }

    GridLayout.prototype.addGridItem = function (gridItem, args) {
        var gl = this;
        console.log('add Grid item....!')
        this.children.push(gridItem);
        this.container.append(gridItem.props.children);
        // this.updateGridItemBounds(gridItem);
        //Synchronise GridItem With Grid Layout

        // var cardType = args.cardObj.type;
        // if (cardType == "TEXT" || cardType == "TITLE" || cardType == "IMAGE" || cardType == "GALLERY") {
        //     gridItem.props.autoSize = true;
        // } else {
        //     gridItem.props.autoSize = false;
        // }

        this.props.layout = utils.synchronizeLayoutWithChildren(this.props.layout, this.gridChildren(), this.props.cols, gridItem.props, this.props.verticalCompact);
        this.state["layout"] = this.props.layout;

        if (args) {
            var container = $(gridItem.props.children).find('.shadow');

            // $(container).append(args.card);
            if (args.cardObj.type == "TEXT" ||
                args.cardObj.type == "TITLE" ||
                args.cardObj.type == "IMAGE" ||
                args.cardObj.type == "IGROUP" ||
                args.cardObj.type == "TABLE" ||
                args.cardObj.type == "LIST" ||
                args.cardObj.type == "PYRAMID" ||
                args.cardObj.type == "BUTTON" ||
                args.cardObj.type == "CHARTS" ||
                args.cardObj.type == "TIMER" ||
                args.cardObj.type == "QUESTION" ||
                args.cardObj.type == "ACCORDION") {
                gridItem.props.autoSize = true
            } else {
                gridItem.props.autoSize = false;
            }
            // args.cardObj.position = ''; //resetiing card position here
            readCardUtils.readCard(args.cardObj, args.cardService, container, args.compile, args.scope, args.layoutType);
            var cardType = args.cardObj.type;
            // if (cardType == 'IGROUP') {
            //     var editorDoc = $(".stage").get(0).contentWindow.document;
            //     // $(editorDoc).find('[data-id=' + args.cardObj.id + ']').closest('.GridItem').addClass('GroupLayout');
            //     $(editorDoc).find('[data-id=' + args.cardObj.id + ']').find('.grpContainer').css({
            //         'position': 'absolute',
            //         'height': 'auto'
            //     });
            // }

            if (args.cardObj.type == 'IGROUP') {
                var groupCard = $('[data-id=' + args.cardObj.id + ']');
                $(groupCard).hide();

                var groupCardScope = $(groupCard).children('.iCard').scope();
                groupCardScope.card.element = $(groupCard);
                groupCardScope.card.isAnimate = true;
                $(groupCard).find('.grpContainer').css({
                    'position': 'absolute',
                    'height': 'auto'
                });
            }
        }
        // this.render();
        this.render();
        setTimeout(function () {
            $(groupCard).show();
            $(groupCard).find('.grpContainer').css({
                'position': 'absolute',
                'height': 'auto'
            });
            gridEvent.avoidOverlapOfCards();
        }, 300);
    }

    GridLayout.prototype.placeholder = function placeholder() {
        var activeDrag = this.state.activeDrag;

        if (!activeDrag) return null;
        var _props = this.props,
            width = _props.width,
            cols = _props.cols,
            margin = _props.margin,
            containerPadding = _props.containerPadding,
            rowHeight = _props.rowHeight,
            maxRows = _props.maxRows,
            useCSSTransforms = _props.useCSSTransforms;

        // {...this.state.activeDrag} is pretty slow, actually


        var gridItemProps = {
            w: activeDrag.w,
            h: activeDrag.h,
            x: activeDrag.x,
            y: activeDrag.y,
            i: activeDrag.i,
            className: 'grid-placeholder',
            containerWidth: width,
            cols: cols,
            margin: margin,
            containerPadding: containerPadding || margin,
            maxRows: maxRows,
            rowHeight: rowHeight,
            isDraggable: false,
            isResizable: false,
            useCSSTransforms: useCSSTransforms
        }
        //Reset Previous

        this.placeholder.props = gridItemProps;
        gridItem.render();

    };

    GridLayout.prototype.addPlaceHolder = function (id) {

        $(".GridLayout .grid-placeholder").remove();
        var gridItem = new GridItem({
            i: id,
            className: 'grid-placeholder'
        });
        this.addGridItem(gridItem);

        this.activeDrag = gridItem;
    }

    GridLayout.prototype.removePlaceHolder = function () {

        var placeHolder = this.activeDrag;
        _.remove(this.children, function (item) {
            return (item.props.className && item.props.className == "grid-placeholder");
        });

        $(".GridLayout .grid-placeholder").remove();

    }

    GridLayout.prototype.ItemMoved = function () {
        // Layout From State
        var layout = this.state.layout;
        this.props.layout = layout;
        this.reRender();
    }

    GridLayout.prototype.updateGridItemBounds = function (gridItem) {
        var _props2 = gridItem.props;
        var bounds = utils.updateforAutoSize(gridItem, _props2.w, this.props.rowHeight, this.props.margin);

        var gridW = _props2.w;
        var gridH = _props2.h;

        if (bounds.w > 0 && bounds.h > 2) {
            if (gridW != bounds.w || gridH != bounds.h) {
                gridItem.isPropsChange = true;
            }
            _props2.w = bounds.w;
            _props2.h = bounds.h;
        }
    }

    GridLayout.prototype.processGridItem = function (gridItem) {

        var l = utils.getLayoutItem(this.props.layout, gridItem.props.i);

        gridItem.props["containerWidth"] = this.props.width;
        gridItem.props["cols"] = this.props.cols;
        gridItem.props["rowHeight"] = this.props.rowHeight;
        gridItem.props["maxRows"] = this.props.maxRows;
        gridItem.props["margin"] = this.props.margin;
        gridItem.props["containerPadding"] = this.props.containerPadding || this.props.margin;
        gridItem.props["useCSSTransforms"] = this.props.useCSSTransforms;
        gridItem.props["w"] = l.w;
        gridItem.props["h"] = l.h;
        gridItem.props["x"] = l.x;
        gridItem.props["y"] = l.y;

        if (gridItem.props.autoSize)
            this.updateGridItemBounds(gridItem);

        if (gridItem.isPropsChange) {
            Object.keys(l).map(function (key, index) {
                l[key] = gridItem.props[key];
            });

            l.isPropsChange = gridItem.isPropsChange;

        }

        return gridItem.isPropsChange;
    }

    GridLayout.prototype.gridItem = function (id) {

        var gridItem;
        for (var i = 0; i < this.children.length; i++) {
            if (this.children[i].props.i == id) {
                gridItem = this.children[i];
                break;
            }
        }

        return gridItem;

    }

    GridLayout.prototype.reRender = function () {
        this.props.layout = utils.synchronizeLayoutWithChildren(this.props.layout, this.gridChildren(), this.props.cols, null, this.props.verticalCompact);
        this.state["layout"] = this.props.layout;
        this.render();
    }

    GridLayout.prototype.render = function () {
        var height = this.containerHeight() + 5 + 'px';
        var _this = this;
        $(this.container).css({
            height: height
        });
        this.isPropsChange = false;
        //Get Children

        // Sorting the grid items in the order of their id.
        var gridItems = this.children;
        gridItems.sort(function (a, b) {
            // a and b will here be two objects from the array
            // thus a[1] and b[1] will equal the names

            // if they are equal, return 0 (no sorting)
            if (parseInt(a.props.y) == parseInt(b.props.y)) {

                if (parseInt(a.props.x) > parseInt(b.props.x)) {
                    return 1;
                } else {
                    return -1;
                }
                // return 0;
            }
            if (parseInt(a.props.y) > parseInt(b.props.y)) {
                // if a should come after b, return 1
                return 1;
            } else {
                // if b should come after a, return -1
                return -1;
            }
        });

        _.forEach(gridItems, function (value) {
            console.log('Before Sort: ' + value.props.i);
        });



        // gridItems.sort(function(a, b) {
        //     // a and b will here be two objects from the array
        //     // thus a[1] and b[1] will equal the names

        //     // if they are equal, return 0 (no sorting)
        //     // if (parseInt(a.props.i) == parseInt(b.props.i)) {
        //     //     return 0;
        //     // }
        //     // if (parseInt(a.props.i) > parseInt(b.props.i)) {
        //     //     // if a should come after b, return 1
        //     //     return 1;
        //     // } else {
        //     //     // if b should come after a, return -1
        //     //     return -1;
        //     // }


        //     // sorting the elements based on their y and x positions. 
        //     // If y position is same then compare x position.


        //     if (parseInt(a.props.y) == parseInt(b.props.y)) {
        //         // if (parseInt(a.props.x) == parseInt(b.props.x)) {
        //         //     return 0;
        //         // }

        //         // if (parseInt(a.props.x) > parseInt(b.props.x)) {
        //         //     return 1;
        //         // } else {
        //         //     return -1;
        //         // }


        //         return 0;
        //     } else if (parseInt(a.props.y) > parseInt(b.props.y)) {
        //         // if a should come after b, return 1
        //         return 1;
        //     } else {
        //         // if b should come after a, return -1
        //         return -1;
        //     }
        // });

        $.each(gridItems, function (index, value) {
            var gridItem = value;
            gridItem.isPropsChange = false;

            // console.log("Before process" + JSON.stringify(gridItem));

            var isChanged = _this.processGridItem(gridItem);
            // console.log("After process" + JSON.stringify(gridItem));


            gridItem.render();

            if (!_this.isPropsChange) _this.isPropsChange = isChanged;
            // gridItem.isPropsChange = false;

        });

        // this.props.autoSize = false;
        if (this.props.autoSize && _this.isPropsChange) {
            setTimeout(function () {
                _this.reRender();
            }, 200);

        } else {
            _this.placeholder();
        }

    }

    return GridLayout;

});