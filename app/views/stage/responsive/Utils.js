define([
    'angular'
], function(angular) {
    'use strict';

    var utils = {};
    var layoutState;

    var actualLayout = [];
    var actualArgs = {};
    var pageStyle = {}

    var placeHolder;


    function bottom(layout) {

        var max = 0,
            bottomY;
        for (var i = 0, len = layout.length; i < len; i++) {
            bottomY = layout[i].y + layout[i].h;
            if (bottomY > max) max = bottomY;
        }
        return max;
    }





    function setInitialLayout(layout) {
        console.log("setInitialLayout ")
        actualLayout = angular.copy(layout);
    }

    function getInitialLayout(layout) {
        return actualLayout;
    }

    function setPageStyle(style) {
        pageStyle = angular.fromJson(style);
    }

    function getPageStyle() {
        return pageStyle.width;
    }

    function setTopLeft(pos) {
        return {
            top: pos.top + 'px',
            left: pos.left + 'px',
            width: pos.width + 'px',
            height: pos.height + 'px',
            position: 'absolute'
        };
    }


    function setTransform(pos) {
        // Replace unitless items with px
        var translate = 'translate(' + pos.left + 'px,' + pos.top + 'px)';
        return {
            transform: translate,
            WebkitTransform: translate,
            MozTransform: translate,
            msTransform: translate,
            OTransform: translate,
            width: pos.width + 'px',
            height: pos.height + 'px',
            position: 'absolute'
        };
    }

    function getLayoutItem(layout, id) {
        for (var i = 0, len = layout.length; i < len; i++) {
            if (layout[i].i === id) return layout[i];
        }
    }

    function cloneLayoutItem(layoutItem) {
        return {
            w: layoutItem.w,
            h: layoutItem.h,
            x: layoutItem.x,
            y: layoutItem.y,
            i: layoutItem.i,
            minW: layoutItem.minW,
            maxW: layoutItem.maxW,
            minH: layoutItem.minH,
            maxH: layoutItem.maxH,
            // moved: Boolean(layoutItem.moved),
            static: Boolean(layoutItem.static),
            // These can be null
            isDraggable: layoutItem.isDraggable,
            isResizable: layoutItem.isResizable
        };
    }

    /**
     * Get all static elements.
     */
    function getStatics(layout) {
        return _.filter(layout, function(l) {
            return l.static;
        });
    }


    /**
     * Move an element. Responsible for doing cascading movements of other elements.
     * @param  {Array}      layout Full layout to modify.
     * @param  {LayoutItem} l      element to move.
     * @param  {Number}     [x]    X position in grid units.
     * @param  {Number}     [y]    Y position in grid units.
     * @param  {Boolean}    [isUserAction] If true, designates that the item we're moving is
     *                                     being dragged/resized by the user.
     * */

    function moveElement(layout, l, x, y, isUserAction) {
        if (l.static) return layout;

        console.log("moveElement");

        // Short-circuit if nothing to do.
        if (l.y === y && l.x === x) return layout;

        var movingUp = y && l.y > y;
        // This is quite a bit faster than extending the object
        if (typeof x === 'number') l.x = x;
        if (typeof y === 'number') l.y = y;
        l.moved = true;

        // If this collides with anything, move it.
        // When doing this comparison, we have to sort the items we compare with
        // to ensure, in the case of multiple collisions, that we're getting the
        // nearest collision.
        var sorted = sortLayoutItemsByRowCol(layout);



        if (movingUp) sorted = layout.reverse();
        var collisions = getAllCollisions(sorted, l);

        console.log("Collisions ....." + collisions.length);

        // Move each item that collides away from this element.
        for (var i = 0, len = collisions.length; i < len; i++) {

            var collision = collisions[i];
            // console.log('resolving collision between', l.i, 'at', l.y, 'and', collision.i, 'at', collision.y);

            // Short circuit so we can't infinite loop
            if (collision.moved) continue;

            // This makes it feel a bit more precise by waiting to swap for just a bit when moving up.
            if (l.y > collision.y && l.y - collision.y > collision.h / 4) continue;

            // Don't move static items - we have to move *this* element away
            if (collision.static) {
                layout = moveElementAwayFromCollision(layout, collision, l, isUserAction);
            } else {
                layout = moveElementAwayFromCollision(layout, l, collision, isUserAction);
            }
        }

        return layout;
    }

    /**
     * Given a collision, move an element away from the collision.
     * We attempt to move it up if there's room, otherwise it goes below.
     *
     * @param  {Array} layout            Full layout to modify.
     * @param  {LayoutItem} collidesWith Layout item we're colliding with.
     * @param  {LayoutItem} itemToMove   Layout item we're moving.
     * @param  {Boolean} [isUserAction]  If true, designates that the item we're moving is being dragged/resized
     *                                   by the user.
     */

    function moveElementAwayFromCollision(layout, collidesWith, itemToMove, isUserAction) {

        // If there is enough space above the collision to put this element, move it there.
        // We only do this on the main collision as this can get funky in cascades and cause
        // unwanted swapping behavior.
        if (isUserAction) {
            // Make a mock item so we don't modify the item here, only modify in moveElement.
            var fakeItem = {
                x: itemToMove.x,
                y: itemToMove.y,
                w: itemToMove.w,
                h: itemToMove.h,
                i: '-1'
            };
            fakeItem.y = Math.max(collidesWith.y - itemToMove.h, 0);
            if (!getFirstCollision(layout, fakeItem)) {
                return moveElement(layout, itemToMove, undefined, fakeItem.y);
            }
        }

        // Previously this was optimized to move below the collision directly, but this can cause problems
        // with cascading moves, as an item may actually leapfrog a collision and cause a reversal in order.
        return moveElement(layout, itemToMove, undefined, itemToMove.y + 1);
    }


    /**
     * Helper to convert a number to a percentage string.
     *
     * @param  {Number} num Any number
     * @return {String}     That number as a percentage.
     */
    function perc(num) {
        return num * 100 + '%';
    }

    //l1: LayoutItem, l2: LayoutItem
    function collides(l1, l2) {
        if (l1 === l2) return false; // same element
        if (l1.x + l1.w <= l2.x) return false; // l1 is left of l2
        if (l1.x >= l2.x + l2.w) return false; // l1 is right of l2
        if (l1.y + l1.h <= l2.y) return false; // l1 is above l2
        if (l1.y >= l2.y + l2.h) return false; // l1 is below l2
        return true; // boxes overlap
    }

    //layout: Layout, layoutItem: LayoutItem
    function getFirstCollision(layout, layoutItem) {
        for (var i = 0, len = layout.length; i < len; i++) {
            if (collides(layout[i], layoutItem)) return layout[i];
        }
    }

    // layout: Layout, layoutItem: LayoutItem
    function getAllCollisions(layout, layoutItem) {
        // return layout.filter((l) => collides(l, layoutItem));
        return _.filter(layout, function(item) {

            return collides(layoutItem, item);
        })
    }


    function correctBounds(layout, bounds) {
        // console.log("correctBounds ");
        var collidesWith = getStatics(layout);
        for (var i = 0, len = layout.length; i < len; i++) {
            var l = layout[i];
            // Overflows right
            if (l.x + l.w > bounds.cols) l.x = bounds.cols - l.w;
            // Overflows left
            if (l.x < 0) {
                l.x = 0;
                l.w = bounds.cols;
            }
            if (!l.static) collidesWith.push(l);
            else {
                // If this is static and collides with other statics, we must move it down.
                // We have to do something nicer than just letting them overlap.
                while (getFirstCollision(collidesWith, l)) {
                    // console.log("Collsion  Detects " + l.y);
                    l.y++;
                    // l.x++; // newly added
                }

            }
        }
        return layout;
    }

    //compareWith: Layout, l: LayoutItem, verticalCompact: boolean
    function compactItem(compareWith, l, verticalCompact) {
        if (verticalCompact) {

            // Bottom 'y' possible is the bottom of the layout.
            // This allows you to do nice stuff like specify {y: Infinity}
            // This is here because the layout must be sorted in order to get the correct bottom `y`.
            l.y = Math.min(bottom(compareWith), l.y);

            // Move the element up as far as it can go without colliding.
            while (l.y > 0 && !getFirstCollision(compareWith, l)) {
                l.y--;
            }
        }

        // Move it down, and keep moving it down if it's colliding.


        var collides = getFirstCollision(compareWith, l);

        if (collides) {
            l.y = collides.y + collides.h;
        }

        return l;
    }

    /**
     * Get layout items sorted from top left to right and down.
     *
     * @return {Array} Array of layout objects.
     * @return {Array}        Layout, sorted static items first.
     */
    function sortLayoutItemsByRowCol(layout) {
        return [].concat(layout).sort(function(a, b) {
            if (a.y > b.y || (a.y === b.y && a.x > b.x)) {
                return 1;
            } else if (a.y === b.y && a.x === b.x) {
                // Without this, we can get different sort results in IE vs. Chrome/FF
                return 0;
            }
            return -1;
        });
    }

    function compact(layout, verticalCompact) {
        // Statics go in the compareWith array right away so items flow around them.
        var compareWith = getStatics(layout);



        // We go through the items by row and column.
        var sorted = sortLayoutItemsByRowCol(layout);





        // Holding for new items.
        var out = Array(sorted.length);

        for (var i = 0, len = sorted.length; i < len; i++) {
            var l = cloneLayoutItem(sorted[i]);

            // Don't move static elements
            if (!l.static) {
                l = compactItem(compareWith, l, verticalCompact);

                // Add to comparison array. We only collide with items before this one.
                // Statics are already in this array.
                compareWith.push(l);
            }

            // Add to output array to make sure they still come out in the right order.
            out[layout.indexOf(sorted[i])] = l;

            // Clear moved flag, if it exists.
            l.moved = false;
        }

        return out;
    }



    function synchronizeLayoutWithChildren(initialLayout, children, cols, item, verticalCompact) {
        initialLayout = initialLayout || [];

        var layout = [];

        $.each(children, function(i, value) {

            var key = $(value).attr("key");
            var exists = getLayoutItem(initialLayout, key);

            if (exists) {
                layout[i] = cloneLayoutItem(exists);
            } else {

                if (item) {
                    layout[i] = cloneLayoutItem(item);

                } else {
                    layout[i] = cloneLayoutItem({
                        w: 1,
                        h: 1,
                        x: 0,
                        y: bottom(layout),
                        i: key || "1"
                    });

                }


            }

        });

        //Correct bounds
        layout = correctBounds(layout, {
            cols: cols
        });
        //Comact Layout W.r.t VerticalCompact
        layout = compact(layout, verticalCompact); // false - vamshi


        return layout;
    }

    function updateforAutoSize(gridItem, w, rowHt, margin) {
        var _props2 = gridItem.props;
        // var colWidth = gridItem.calcColWidth();
        var colWidth = 1;
        var widthPx = colWidth * _props2.w;


        var cardType = $(".GridLayout .GridItem[key='" + _props2.i + "'] .card").attr('data-type');
        if (cardType == 'IMAGE' || cardType == "GALLERY")
            var heightPx = $(".GridLayout .GridItem[key='" + _props2.i + "']").innerHeight();
        else if (cardType == 'ACCORDION' || cardType == 'TABLE' || cardType == 'LIST')
            var heightPx = $(".GridLayout .GridItem[key='" + _props2.i + "'] > .shadow > .card > .iCard").innerHeight();
        else if (cardType == 'QUESTION' || cardType == 'PYRAMID' || cardType == 'CHARTS') {
            var heightPx = $(".GridLayout .GridItem[key='" + _props2.i + "'] > .shadow > .iCard").height();
        } else if (cardType == 'QUIZ') {
            var heightPx = $(".GridLayout .GridItem[key='" + _props2.i + "'] > .shadow > .card> .iCard").outerHeight();
        } else if (cardType == 'IGROUP') {
            var heightPx = $(".GridLayout .GridItem[key='" + _props2.i + "'] .grpContainer").height();
        } else if (cardType == 'TIMER') {
            var heightPx = $(".GridLayout .GridItem[key='" + _props2.i + "'] > .shadow > .card").height();
        } else
            var heightPx = $(".GridLayout .GridItem[key='" + _props2.i + "'] > .shadow > .card").innerHeight();


        // var heightPx = $(".GridLayout .GridItem[key='" + _props2.i + "'] .card").innerHeight();
        console.log("Inner Height.." + heightPx);
        return gridItem.calculateWH(widthPx, heightPx, colWidth, rowHt, margin);

    }


    utils = {};
    utils.bottom = bottom;
    utils.cloneLayoutItem = cloneLayoutItem;
    utils.setTransform = setTransform;
    utils.setTopLeft = setTopLeft;
    utils.getLayoutItem = getLayoutItem;
    utils.compact = compact;
    utils.getAllCollisions = getAllCollisions;
    utils.moveElement = moveElement;
    utils.synchronizeLayoutWithChildren = synchronizeLayoutWithChildren;
    utils.placeHolder = placeHolder;
    utils.updateforAutoSize = updateforAutoSize;
    utils.setInitialLayout = setInitialLayout;
    utils.getInitialLayout = getInitialLayout;

    utils.setPageStyle = setPageStyle;
    utils.getPageStyle = getPageStyle;

    utils.layoutState = layoutState;
    return utils;
});