/*
 * @module jquery.extractCoordinateFromMouseEvent.js
 * This extension adds global helper function to jQuery which extracts the coordinate from mouse event in efficient way.
 * The code below does probably look like black magic, but is very straight-forward:
 * we creating here kind of polymorph function, which implementation depends on the device it
 * is running on. After first call function replaces its implementation with optimized one for the device it's running on.
 * By this complexity we want to reduce as much as possible the lag between mouse events and animation update,
 * that mostly targeted on speeding up the mousemove events processing.
 */
(function( $ ){
    /* Android case */
    function androidExtractCoordinateFromMouseEvent (oEvent, sAxis) {
        var oOriginalEvent = oEvent.originalEvent;
        if (oOriginalEvent.changedTouches.length > 0) {
            return oOriginalEvent.changedTouches[0]['screen' + sAxis];
        } else {
            return 0;
        }
    }

    /* desktop case */
    function desktopExtractCoordinateFromMouseEvent (oEvent, sAxis) {
        return oEvent.originalEvent['page' + sAxis];
    }

    /* iOS case */
    function iOSExtractCoordinateFromMouseEvent (oEvent, sAxis) {
        return oEvent.originalEvent['screen' + sAxis];
    }

    /* some other unknown case */
    function extractCoordinateFromMouseEvent () {
        return 0;
    }

    $.extractCoordinateFromMouseEvent = function(oEvent, sAxis) {
        var oOriginalEvent = oEvent.originalEvent;
        if (typeof oOriginalEvent.changedTouches !== 'undefined') {
            /* Android case */
            $.extractCoordinateFromMouseEvent = androidExtractCoordinateFromMouseEvent;
        } else if (typeof oOriginalEvent['page' + sAxis] !== 'undefined') {
            /* desktop case */
            $.extractCoordinateFromMouseEvent = desktopExtractCoordinateFromMouseEvent;
        } else if (typeof oOriginalEvent['screen' + sAxis] !== 'undefined') {
            /* iOS case */
            $.extractCoordinateFromMouseEvent = iOSExtractCoordinateFromMouseEvent;
        } else {
            /* some other unknown case */
            $.extractCoordinateFromMouseEvent = extractCoordinateFromMouseEvent;
        }
        return $.extractCoordinateFromMouseEvent(oEvent, sAxis);
    };
})(jQuery);