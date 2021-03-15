define(['views/stage/responsive/Utils'], function(utils) {
    'use strict';
    var gridEvent = {};

    var grid_layout, ele, stagePos, event_state = {};

    var rtime;

    function init(gridLayout) {
        grid_layout = gridLayout;

        $(document).on("imageLoaded", onImageLoad);

        $(window).on('resize', function() {

            clearTimeout(rtime);
            rtime = setTimeout(function() {
                console.log("window resize end !");
                var actuallayout = utils.getInitialLayout();
                var windowWidth = grid_layout.props.width = $(window).width();
                var state = false;
                var desktopWidth = utils.getPageStyle();
                // Based on the window width, render the corresponding layout 
                if (windowWidth >= desktopWidth) {
                    gridLayout.updateCols(utils.getPageStyle());
                    gridLayout.updateDeviceLayout(actuallayout.lg);

                } else if (windowWidth <= 1024 && windowWidth > 768) {

                    gridLayout.updateCols(1024);
                    gridLayout.updateDeviceLayout(actuallayout.tl);
                } else if (windowWidth <= 768 && windowWidth > 736) {

                    gridLayout.updateCols(768);
                    gridLayout.updateDeviceLayout(actuallayout.md);
                } else if (windowWidth <= 736 && windowWidth > 414) {

                    gridLayout.updateCols(736);
                    gridLayout.updateDeviceLayout(actuallayout.sm);
                } else if (windowWidth <= 414) {

                    gridLayout.updateCols(320);
                    gridLayout.updateDeviceLayout(actuallayout.xs);
                }
                gridLayout.updateLayoutWidth(windowWidth);

                /* Making some of the cards as 'auto-size' in order to 
                maintain auto responsiveness while switching between layouts */
                makeAutoSizeOfCards();
                // grid_layout.render();
                setTimeout(function() {
                    grid_layout.render();
                }, 50);
                setTimeout(function() {
                    avoidOverlapOfCards();
                }, 1000);
            }, 300);
        });
    }

    //This is Required for Dynamic Image Height
    function onImageLoad() {
        grid_layout.render();
    }



    function avoidOverlapOfCards() {
        // $('.pageContainer').height($('.GridLayout').height());

        var editorDoc = $('.pageContainer');
        var refElements = $(editorDoc).find('.GridItem'); // referring element

        // sort the elements in their x and y position

        // refElements.sort(function(item1, item2) {
        //     var a = parseInt($(item1)[0].getBoundingClientRect().top);
        //     var b = parseInt($(item2)[0].getBoundingClientRect().top);
        //     if (a == b) {
        //         a = parseInt($(item1)[0].getBoundingClientRect().left);
        //         b = parseInt($(item2)[0].getBoundingClientRect().left);
        //     }
        //     return a - b;
        // });
        for (var itr = 0; itr < refElements.length; itr++) {
            var refEle = refElements[itr];
            // if ($(refElements[itr]).find('.canvasShape').scope() && $(refElements[itr]).find('.canvasShape').find('canvas').length) {
            //     var iCardHeight = $(refElements[itr]).find('.shadow > .card').innerHeight();
            //     var iCardWidth = $(refElements[itr]).find('.shadow > .card').innerWidth();
            //     $(refElements[itr]).find('.canvasShape').scope().shapeType($(refElements[itr]), $(refElements[itr]).find('.iCard').scope().card.shape.type, $(refElements[itr]).find('.iCard').scope().card);
            // }
            var layout = grid_layout.state["layout"];
            var id = $(refEle).attr("key");
            var l = utils.getLayoutItem(layout, id);
            if (l == undefined) return;
            grid_layout.state.oldDragItem = utils.cloneLayoutItem(l);
            grid_layout.state.oldLayout = layout;

            var layout = grid_layout.state.layout;
            var id = $(refEle).attr("key");
            // var l = utils.getLayoutItem(layout, id);
            if (!l) return;
            //Get Grid Item .......................
            var gridItem = grid_layout.gridItem(id);
            gridItem.props.state = 'DragEnd';
            var refEleBounds = refEle.getBoundingClientRect();
            layout = utils.moveElement(layout, l, l.x, l.y, false /* isUserAction */ );
            grid_layout.state.layout = utils.compact(layout, grid_layout.props.verticalCompact);

            var props = gridItem.props;
            var newLayout = utils.compact(layout, grid_layout.props.verticalCompact);
            grid_layout.state.layout = newLayout;
        }

        grid_layout.ItemMoved();
    }

    function makeAutoSizeOfCards() {
        var gridItems = grid_layout.children;
        for (var itr = 0; itr < gridItems.length; itr++) {
            var giType = $('[data-id=' + gridItems[itr].props.i + ']').attr('data-type');
            if (giType == 'QUIZ' || giType == 'QUESTION') {
                gridItems[itr].props.autoSize = true;
            }
        }
    }

    // function stopMoving(e) {
    //     e.preventDefault();

    //     var left = e.pageX - (event_state.mouse_x - event_state.container_left),
    //         top = e.pageY - (event_state.mouse_y - event_state.container_top);

    //     left -= stagePos.left;
    //     top -= stagePos.top;

    //     var oldDragItem = grid_layout.state.oldDragItem,
    //         layout = grid_layout.state.layout,
    //         id = $(ele).attr("key"),
    //         l = utils.getLayoutItem(layout, id);

    //     if (!l) return;

    //     //Get Grid Item ...............................
    //     var gridItem = grid_layout.gridItem(id);
    //     //  newPosition = 
    //     var pos = gridItem.calcXY(top, left);

    //     //Update Drraged Item props
    //     var placeHolder = grid_layout.activeDrag;

    //     var props = gridItem.props;

    //     props.w = placeHolder.w;
    //     props.h = placeHolder.h;
    //     props.x = placeHolder.x;
    //     props.y = placeHolder.y;
    //     props.state = "DragEnd";

    //     grid_layout.removePlaceHolder();

    //     layout = utils.moveElement(layout, l, pos.x, pos.y, true /* isUserAction */ );

    //     var newLayout = utils.compact(layout, grid_layout.props.verticalCompact);
    //     //  var oldLayout = grid_layout.state.oldLayout;

    //     grid_layout.state.activeDrag = null;
    //     grid_layout.state.layout = newLayout;
    //     grid_layout.state.oldDragItem = null;
    //     grid_layout.state.activeDrag = null;

    //     grid_layout.ItemMoved();
    //     // grid_layout.reRender();



    //     //Save Layout State
    //     $(document).off('mouseup', stopMoving);
    //     $(document).off('mousemove', moving);
    //     $(ele).removeClass("dragging");

    //     //Update Layout 
    //     grid_layout.updateDeviceLayout(grid_layout.props.layout);
    // }

    // function startResize(event) {

    //     event.preventDefault();
    //     event.stopPropagation();

    //     ele = event.currentTarget.offsetParent;

    //     saveEventState(event);

    //     var layout = grid_layout.state["layout"];
    //     var id = $(ele).attr("key");
    //     var l = utils.getLayoutItem(layout, id);

    //     grid_layout.state.oldResizeItem = utils.cloneLayoutItem(l);
    //     grid_layout.state.oldLayout = layout;

    //     //Save Layout State

    //     grid_layout.addPlaceHolder(id);

    //     // var gridItem = new GridItem({i:id,className: 'grid-placeholder'});
    //     // grid_layout.addGridItem(gridItem);

    //     // utils.placeholder = gridItem;

    //     $(document).on('mousemove touchmove', resizing);
    //     $(document).on('mouseup touchend', stopResizing);

    // }

    // function resizing(e) {

    //     //Get w and H in pixels 
    //     var mouse = {},
    //         width, height, left, top,
    //         pOffset = $(".GridLayout").offset();


    //     mouse.x = (e.clientX || e.pageX || e.originalEvent.touches[0].clientX) + $(window).scrollLeft();
    //     mouse.y = (e.clientY || e.pageY || e.originalEvent.touches[0].clientY) + $(window).scrollTop();

    //     //Constrain Top And Left
    //     if (mouse.x <= pOffset.left) mouse.x = pOffset.left;
    //     if (mouse.y <= pOffset.top) mouse.y = pOffset.top;

    //     if ($(event_state.evnt.target).hasClass('resize-handle-se')) {
    //         width = mouse.x - event_state.container_left;
    //         height = mouse.y - event_state.container_top;
    //         left = event_state.container_left;
    //         top = event_state.container_top;

    //     } else if ($(event_state.evnt.target).hasClass('resize-handle-sw')) {
    //         width = event_state.container_width - (mouse.x - event_state.container_left);
    //         height = mouse.y - event_state.container_top;
    //         left = mouse.x;
    //         top = event_state.container_top;

    //     } else if ($(event_state.evnt.target).hasClass('resize-handle-nw')) {
    //         width = event_state.container_width - (mouse.x - event_state.container_left);
    //         height = event_state.container_height - (mouse.y - event_state.container_top);
    //         left = mouse.x;
    //         top = mouse.y
    //     } else if ($(event_state.evnt.target).hasClass('resize-handle-ne')) {
    //         width = mouse.x - event_state.container_left;
    //         height = event_state.container_height - (mouse.y - event_state.container_top);
    //         left = event_state.container_left;
    //         top = mouse.y;
    //     } else if ($(event_state.evnt.target).hasClass('resize-handle-n')) {
    //         height = event_state.container_height - (mouse.y - event_state.container_top);
    //         top = mouse.y;
    //     } else if ($(event_state.evnt.target).hasClass('resize-handle-s')) {
    //         height = mouse.y - event_state.container_top;
    //         top = event_state.container_top;
    //     } else if ($(event_state.evnt.target).hasClass('resize-handle-w')) {
    //         width = event_state.container_width - (mouse.x - event_state.container_left);
    //         left = mouse.x;

    //     } else if ($(event_state.evnt.target).hasClass('resize-handle-e')) {
    //         width = mouse.x - event_state.container_left;
    //         left = event_state.container_left;
    //     }

    //     // Without this Firefox will not re-calculate the the image dimensions until drag end
    //     $(ele).offset({
    //         'left': left,
    //         'top': top,

    //     });

    //     $(ele).width(width);
    //     $(ele).height(height);


    //     if (!$(ele).hasClass("resizing"))
    //         $(ele).addClass("resizing");

    //     var oldResizeItem = grid_layout.state.oldResizeItem;
    //     var layout = grid_layout.state.layout;
    //     var id = $(ele).attr("key");
    //     var l = utils.getLayoutItem(layout, id);
    //     if (!l) return;

    //     //Get Grid Item ...............................
    //     var gridItem = grid_layout.gridItem(id);
    //     //Convert Px to units 
    //     var bounds = gridItem.calcWH({
    //         width: width,
    //         height: height
    //     });

    //     l.w = bounds.w;
    //     l.h = bounds.h;

    //     // bounds = utils.updateforAutoSize(gridItem, l.w, grid_layout.props.rowHeight, grid_layout.props.margin)

    //     //Validate for mIn and Max

    //     l.w = bounds.w;
    //     l.h = bounds.h;

    //     var placeholder = {
    //         w: l.w,
    //         h: l.h,
    //         x: l.x,
    //         y: l.y,
    //         placeholder: true,
    //         i: id
    //     };

    //     gridItem.state.resizing = {
    //         width: width,
    //         height: height
    //     };

    //     left -= pOffset.left;
    //     top -= pOffset.top;

    //     var pos = gridItem.calcXY(top, left);
    //     layout = utils.moveElement(layout, l, pos.x, pos.y, true /* isUserAction */ );
    //     grid_layout.state.layout = utils.compact(layout, grid_layout.props.verticalCompact);

    //     if ($(ele).find('.canvasShape').scope() && $(ele).find('.canvasShape').find('canvas').length) {
    //         $(ele).find('.canvasShape').scope().reRenderingShape($(ele), height, width);
    //     }

    //     grid_layout.activeDrag = placeholder;
    //     grid_layout.ItemMoved();

    // }

    // function stopResizing(event) {
    //     event.preventDefault();
    //     event.stopPropagation();

    //     // grid_layout.removePlaceHolder();
    //     // grid_layout.render();

    //     var oldDragItem = grid_layout.state.oldDragItem,
    //         layout = grid_layout.state.layout,
    //         id = $(ele).attr("key"),
    //         l = utils.getLayoutItem(layout, id);

    //     if (!l) return;

    //     //Get Grid Item ...............................
    //     var gridItem = grid_layout.gridItem(id);

    //     var placeHolder = grid_layout.activeDrag;

    //     var props = gridItem.props;

    //     props.w = l.w = placeHolder.w;
    //     props.h = l.h = placeHolder.h;
    //     props.x = l.x = placeHolder.x;
    //     props.y = l.y = placeHolder.y;
    //     props.state = "ResizeEnd";

    //     delete gridItem.state["resizing"];

    //     grid_layout.removePlaceHolder();
    //     var newLayout = utils.compact(layout, grid_layout.props.verticalCompact);

    //     grid_layout.state.activeDrag = null;
    //     grid_layout.state.layout = newLayout;
    //     grid_layout.state.oldDragItem = null;
    //     grid_layout.state.activeDrag = null;


    //     grid_layout.ItemMoved();



    //     $(document).off('mouseup touchend', stopResizing);
    //     $(document).off('mousemove touchmove', resizing);
    //     $(ele).removeClass("resizing");

    //     //Update Layout
    //     grid_layout.updateDeviceLayout(grid_layout.props.layout);

    // }


    gridEvent = {};
    gridEvent.init = init;
    gridEvent.avoidOverlapOfCards = avoidOverlapOfCards;

    return gridEvent;

});