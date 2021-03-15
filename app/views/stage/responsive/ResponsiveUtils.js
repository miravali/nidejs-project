define([
    'jquery',
    'views/stage/responsive/GridItem',
    'views/stage/responsive/GridLayout',
    'views/stage/responsive/Utils'
], function($, GridItem, GridLayout, GridUtils) {
    'use strict';
    var gridLayout = {};

    var deviceLayout = {};
    deviceLayout.lg = [];
    deviceLayout.md = [];
    deviceLayout.tl = [];
    deviceLayout.sm = [];
    deviceLayout.xs = [];
    var respInteractiveGroups = [];
    var iGroupOrder = [];
    var windowWidth = $(window).width();
    var _rowHeight = 1,
        _margin = [1, 1],
        cols = windowWidth;

    // Based on the window width, render the corresponding layout 

    if (windowWidth > 1024) {
        cols = windowWidth;
    } else if (windowWidth > 768 && windowWidth <= 1024) {
        cols = 1024;
    } else if (windowWidth > 736 && windowWidth <= 768) {
        cols = 768;
    } else if (windowWidth > 414 && windowWidth <= 736) {
        cols = 736;
    } else if (windowWidth >= 320 && windowWidth <= 414) {
        cols = 320;
    }

    function createGridLayout() {
        gridLayout = {};

        // $(".pageContainer").empty();

        $('.pageContainer').contents().filter(function() {
            return this.id != "video";
        }).remove();


        $('.GridLayout').remove();
        var layoutProps = {
            className: "layout",
            rowHeight: _rowHeight,
            width: $(".pageContainer").width(),
            autoSize: true,
            useCSSTransforms: true,
            verticalCompact: false,
            margin: _margin,
            cols: cols // layout types
        };
        gridLayout = new GridLayout(layoutProps);
        gridLayout.deviceLayout = deviceLayout;

        $(".pageContainer").append(gridLayout.container);

        gridLayout.render();
    }

    function resetAllLayouts() {
        deviceLayout.lg = [];
        deviceLayout.md = [];
        deviceLayout.tl = [];
        deviceLayout.sm = [];
        deviceLayout.xs = [];

        gridLayout.deviceLayout = deviceLayout;
    }

    function setAllLayouts(val) {
        deviceLayout.lg = val;
        deviceLayout.md = val;
        deviceLayout.tl = val;
        deviceLayout.sm = val;
        deviceLayout.xs = val;

        gridLayout.deviceLayout = deviceLayout;
    }

    // rendering layout from properties here
    function renderRespsiveGridItems(pageChildren, args) {
        // Based on the window size
        GridUtils.setInitialLayout(pageChildren.layout.deviceLayout);

        var cards = pageChildren.children;

        console.log('renderRespsiveGridItems initailaized !!!');
        //initailaizing layout 
        createGridLayout();
        //resetting layouts values
        resetAllLayouts();

        // var propsArr = pageChildren.layout.deviceLayout.lg;

        var windowWidth = $(window).width();

        if (windowWidth >= GridUtils.getPageStyle()) {
            var propsArr = pageChildren.layout.deviceLayout.lg;
            gridLayout.updateCols(GridUtils.getPageStyle());
        } else if (windowWidth >= 1024 && windowWidth < GridUtils.getPageStyle()) {
            var propsArr = pageChildren.layout.deviceLayout.tl;
            gridLayout.updateCols(1024);
        } else if (windowWidth >= 768 && windowWidth < 1024) {
            var propsArr = pageChildren.layout.deviceLayout.md;
            gridLayout.updateCols(768);
        } else if (windowWidth >= 736 && windowWidth < 768) {
            var propsArr = pageChildren.layout.deviceLayout.sm;
            gridLayout.updateCols(736);
        } else if (windowWidth < 736) {
            var propsArr = pageChildren.layout.deviceLayout.xs;
            gridLayout.updateCols(320);
        }
        var layoutState = pageChildren.layout.layoutRatio ? 1 : 0;
        GridUtils.layoutState = layoutState;
        // backwards compatibility for previously saved pages with 12, 10, 8, 6, 4 cols
        // if (!layoutState) { // checking whether old or new page
        //     // calculate equivalent values with respect to the present no.of columns
        //     var refCols = gridLayout.props.width;
        //     var tempLayout = [];
        //     for (var itr = 0; itr < propsArr.length; itr++) {
        //         var tempObj = {};
        //         tempObj.w = (propsArr[itr].w * refCols) / 12; // 12 cols - if the layout is desktop; should modify according to layout.
        //         tempObj.h = (propsArr[itr].h);
        //         tempObj.x = Math.round(((gridLayout.props.width / 12)) * propsArr[itr].x);
        //         tempObj.y = propsArr[itr].y;
        //         tempObj.i = propsArr[itr].i;
        //         tempLayout.push(tempObj);
        //     }
        //     propsArr = tempLayout;
        // }


        var itr = 0;

        // for (var index = 0; index < cards.length; index++) {
        angular.forEach(cards, function(card, index) {
            var element = card;
            var props = propsArr[index];
            args.cardObj = element;
            var gridItem = new GridItem(props);
            //Add GridItem to Layout
            if (args.cardObj.type == 'IGROUP' && args.cardObj.groupType == undefined) pCard.groupType = 1;
            if (args.cardObj.type == 'IGROUP' && args.cardObj.groupType == 1) {
                

                if (args.cardObj.id == iGroupOrder[0].id) {
                    gridLayout.addGridItem(gridItem, args);
                } else {
                    var groupInfoObj = {
                        'cardObj': element,
                        'props': props
                    }
                    respInteractiveGroups.push(groupInfoObj);
                    return;
                }
            } else {
                gridLayout.addGridItem(gridItem, args);
            }
        });
        iGroupOrder.shift();

        //Setting all layout values 
        setAllLayouts(propsArr);

        // calling layout render function here
        setTimeout(function() {
            gridLayout.render();
        }, 500);

    }


    //get deviceLayout
    function getdeviceLayout() {
        return gridLayout.deviceLayout;
    }

    //Create Grid layout
    //Create Grid Items
    //Apped each card to respective grid layout
    //Generate layout

    function createRespsiveGridItems(cards, args) {

        //initailaizing layout 
        createGridLayout();
        //Create grid Items
        createGridItems(cards, args);

        //Render again ...
        setTimeout(function() {
            gridLayout.render();
            // Moving the last element to avoid overlapping of cards
        }, 300);
    }

    function renderIntGroupItem(obj, args) {
        // obj.shift();
        iGroupOrder.shift();
        var refObj = obj;
        var element = refObj.cardObj;
        var props = refObj.props;
        args.cardObj = element;
        var gridItem = new GridItem(props);

        gridLayout.addGridItem(gridItem, args);
    }

    function getRespIntGroups() {
        return respInteractiveGroups;
    }

    function setRespGroupOrder(groupOrder) {
        iGroupOrder = groupOrder
    }

    function getRespGroupOrder() {
        return iGroupOrder;
    }

    return {
        renderRespsiveGridItems: renderRespsiveGridItems,
        getdeviceLayout: getdeviceLayout,
        updateDeviceLayout: setAllLayouts,
        getRespIntGroups: getRespIntGroups,
        renderIntGroupItem: renderIntGroupItem,
        setRespGroupOrder: setRespGroupOrder,
        getRespGroupOrder: getRespGroupOrder
    }
});