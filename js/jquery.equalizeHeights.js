/*
 * @module jquery.equalizeHeights.js
 * This simple extension forces all blocks with the class 'equalize-heights', which has the common parent, to be the equal height.
 * Optional 'bDisable' argument removes the height correction.
 */
(function( $ ){
    var S_PLUGIN_NAME = 'equalizeHeights';

    $.fn.equalizeHeights = function( sGroupPrefix, bForceGroupRebuild ) {
        return this.each(function(){
            var $container = $(this);
            var oGlobalData = $container.data(S_PLUGIN_NAME);

            if (!oGlobalData) {
                oGlobalData = {
                    oGroups              : {},
                    $allEqualized        : $([]),
                    sActivePrefix        : '',
                    buildGroups          : null,
                    addToGroup           : null,
                    equalizeGroups       : null,
                    $window              : $(window),
                    iPreviousScreenWidth : 0
                };
                $container.data(S_PLUGIN_NAME, oGlobalData);

                oGlobalData.addToGroup = function (sKey, $object) {
                    if (typeof oGlobalData.oGroups[sKey] === 'undefined') {
                        oGlobalData.oGroups[sKey] = $([]);
                    }
                    oGlobalData.oGroups[sKey] = oGlobalData.oGroups[sKey].add($object);
                    oGlobalData.$allEqualized = oGlobalData.$allEqualized.add($object);
                };

                oGlobalData.buildGroups = function ($container) {
                    $container.find('.equalize-heights').parents('.equalize-heights-parent').each(function () {
                        var $parent = $(this);
                        var sUniqueSuffix = '-' + (new Date()).getTime() + Math.floor(Math.random() * 1000);

                        $parent.find('.equalize-heights').each(function () {
                            var $this = $(this);
                            var sGroups = $this.attr('data-equalize-heights-groups');
                            if (typeof sGroups !== 'undefined') {
                                var aGroups = $this.attr('data-equalize-heights-groups').split(' ');
                                for (var iGroupKey in aGroups) {
                                    oGlobalData.addToGroup(aGroups[iGroupKey] + sUniqueSuffix, $this);
                                }
                            } else {
                                oGlobalData.addToGroup('default' + sUniqueSuffix, $this);
                            }
                        });
                    });
                };

                oGlobalData.equalizeGroup = function ($group) {
                    var iMaxHeight = 0;
                    $group.css('height','auto').each(function () {
                        var currentHeight = $(this).outerHeight();
                        if (currentHeight > iMaxHeight) {
                            iMaxHeight = currentHeight;
                        }
                    });

                    $group.css('height', iMaxHeight);
                };

                oGlobalData.equalizeGroups = function (sGroupPrefix) {
                    for (var sGroupKey in oGlobalData.oGroups) {
                        if (sGroupKey.search(sGroupPrefix) === 0) {
                            oGlobalData.equalizeGroup(oGlobalData.oGroups[sGroupKey]);
                        }
                    }
                };

                oGlobalData.removeHeightFix = function () {
                    oGlobalData.$allEqualized.css('height','');
                };

                oGlobalData.fixHeights = function (oEvent) {
                    if ((typeof oEvent !== 'undefined') && (oGlobalData.$window.width() === oGlobalData.iPreviousScreenWidth)) {
                        return;
                    }
                    oGlobalData.iPreviousScreenWidth = oGlobalData.$window.width();

                    oGlobalData.removeHeightFix();

                    oGlobalData.equalizeGroups(oGlobalData.sActivePrefix);
                    oGlobalData.equalizeGroups('default');
                };

                bForceGroupRebuild = true;

            }

            if (bForceGroupRebuild) {
                oGlobalData.buildGroups($container);
            }

            oGlobalData.sActivePrefix = sGroupPrefix;

            $(window).off('resize', oGlobalData.fixHeights);
            if (typeof sGroupPrefix !== 'undefined' && sGroupPrefix.length > 0) {
                oGlobalData.fixHeights();
                $(window).on('resize', oGlobalData.fixHeights);
            } else {
                oGlobalData.removeHeightFix();
            }
        });
    };
})( jQuery );
