/*
 @module jquery.mediaQueryBreakDetector.js
 jQuery plugin, designed to detect CSS media-query breakpoint changes and notify other JS modules about this event.
 Module depends on CSS breakpoint names defined for html and body tags. All this magic helps synchronizing the CSS styles
 and JS behavior.
 */
(function( $ ){
    var PLUGIN_NAME = "mediaQueryBreakDetector";

    var methods = {
        init : function() {
            return this.each(function(){
                var $this = $(this);

                var oData = $this.data(PLUGIN_NAME);

                if ( !oData ) {
                    oData = {
                        /* data */
                        sBreakpointName : '',
                        sPreviousBreakpointName : ''
                    };
                    $this.data(PLUGIN_NAME, oData);

                    /** "asynchronous" event dispatch */
                    oData.dispatchEvent = function ( oEventData ) {
                        oEventData.type = PLUGIN_NAME + '.' + oEventData.type;
                        setTimeout(
                            function () {
                                $this.trigger(oEventData);
                            },
                            0
                        );
                    };

                    oData.processNewBreakpointName = function (sBreakpointName) {
                        if (oData.sBreakpointName === sBreakpointName) {
                            return;
                        }
                        oData.sPreviousBreakpointName = oData.sBreakpointName;
                        oData.sBreakpointName = sBreakpointName;
                        /* suppress first event dispatch */
                        if (oData.sPreviousBreakpointName.length > 0) {
                            oData.dispatchEvent({
                                type: 'breakpointChange',
                                breakpointName: oData.sBreakpointName,
                                previousBreakpointName: oData.sPreviousBreakpointName
                            });
                        }
                    };

                    oData.checkCurrentScreenWidth = function () {
                        var sBreakpointName;
                        if (window.getComputedStyle) {
                            sBreakpointName = window.getComputedStyle($this[0], ':after').getPropertyValue('content');
                            oData.processNewBreakpointName(sBreakpointName);
                        } else {
                            sBreakpointName = $('html').css('font-family');
                        }
                        sBreakpointName = sBreakpointName.replace(/"/gi,'');
                        oData.processNewBreakpointName(sBreakpointName);
                    };

                    $(window).on('resize', oData.checkCurrentScreenWidth);
                    oData.checkCurrentScreenWidth();
                }
            });
        },
        getBreakpointData : function () {
            var $this = this.eq(0);
            var oData = $this.data(PLUGIN_NAME);

            return {
                breakpointName: oData.sBreakpointName,
                previousBreakpointName: oData.sPreviousBreakpointName
            };
        }
    };

    $.fn.mediaQueryBreakDetector = function( method ) {
        if ( methods[method] ) {
            return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
            return methods.init.apply( this, arguments );
        } else {
            $.error( 'Method ' +  method + ' does not exist on jQuery.' + PLUGIN_NAME );
        }
        return false;
    };
})( jQuery );