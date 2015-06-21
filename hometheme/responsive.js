
var responsiveDesign = {
    isResponsive: false,
    isDesktop: false,
    isTablet: false,
    isPhone: false,
    windowWidth: 0,
    responsive: (function ($) {
        "use strict";
        return function () {
            var html = $("html");
            this.windowWidth = $(window).width();
            var triggerEvent = false;

            var isRespVisible = $("#ayb-resp").is(":visible");
            if (isRespVisible && !this.isResponsive) {
                html.addClass("responsive").removeClass("desktop");
                this.isResponsive = true;
                this.isDesktop = false;
                triggerEvent = true;
            } else if (!isRespVisible && !this.isDesktop) {
                html.addClass("desktop").removeClass("responsive responsive-tablet responsive-phone");
                this.isResponsive = this.isTablet = this.isPhone = false;
                this.isDesktop = true;
                triggerEvent = true;
            }

            if (this.isResponsive) {
                if ($("#ayb-resp-t").is(":visible") && !this.isTablet) {
                    html.addClass("responsive-tablet").removeClass("responsive-phone");
                    this.isTablet = true;
                    this.isPhone = false;
                    triggerEvent = true;
                } else if ($("#ayb-resp-m").is(":visible") && !this.isPhone) {
                    html.addClass("responsive-phone").removeClass("responsive-tablet");
                    this.isTablet = false;
                    this.isPhone = true;
                    triggerEvent = true;
                }
            }

            if (triggerEvent) {
                $(window).trigger("responsive", this);
            }

            $(window).trigger("responsiveResize", this);
        };
    })(jQuery),
    initialize: (function ($) {
        "use strict";
        return function () {
            $("<div id=\"ayb-resp\"><div id=\"ayb-resp-m\"></div><div id=\"ayb-resp-t\"></div></div>").appendTo("body");
            var resizeTimeout;
            $(window).resize(function () {
                clearTimeout(resizeTimeout);
                resizeTimeout = setTimeout(function () { responsiveDesign.responsive(); }, 25);
            });
            $(window).trigger("resize");
        };
    })(jQuery)
};

function responsiveAbsBg(responsiveDesign, el, bg) {
    "use strict";
    if (bg.length === 0)
        return;

    var desktopBgTop = bg.attr("data-bg-top");
    var desktopBgHeight = bg.attr("data-bg-height");

    if (responsiveDesign.isResponsive) {
        if (typeof desktopBgTop === "undefined" || desktopBgTop === false) {
            bg.attr("data-bg-top", bg.css("top"));
            bg.attr("data-bg-height", bg.css("height"));
        }

        var elTop = el.offset().top;
        var elHeight = el.outerHeight();
        bg.css("top", elTop + "px");
        bg.css("height", elHeight + "px");
    } else if (typeof desktopBgTop !== "undefined" && desktopBgTop !== false) {
        bg.css("top", desktopBgTop);
        bg.css("height", desktopBgHeight);
        bg.removeAttr("data-bg-top");
        bg.removeAttr("data-bg-height");
    }
}

var responsiveImages = (function ($) {
    "use strict";
    return function (responsiveDesign) {
        $("img[width]").each(function () {
            var img = $(this), newWidth = "", newMaxWidth = "", newHeight = "";
            if (responsiveDesign.isResponsive) {
                newWidth = "auto";
                newHeight = "auto";
                newMaxWidth = "100%";

                var widthAttr = img.attr("width");
                if (widthAttr !== null && typeof (widthAttr) === "string" && widthAttr.indexOf("%") === -1) {
                    newWidth = "100%";
                    newMaxWidth = parseInt($.trim(widthAttr), 10) + "px";
                }
            }
            img.css("width", newWidth).css("max-width", newMaxWidth).css("height", newHeight);
        });
    };
})(jQuery);

var responsiveVideos = (function ($) {
    "use strict";
    return function (responsiveDesign) {
        $("iframe,object,embed").each(function () {
            var obj = $(this);
            var container = obj.parent(".ayb-responsive-embed");
            if (responsiveDesign.isResponsive) {
                if (container.length !== 0)
                    return;
                container = $("<div class=\"ayb-responsive-embed\">").insertBefore(obj);
                obj.appendTo(container);
            } else if (container.length > 0) {
                obj.insertBefore(container);
                container.remove();
            }
        });
    };
})(jQuery);

var responsiveTextblocks = (function ($) {
    "use strict";
    return function (slider, responsiveDesign) {
        slider.find(".ayb-textblock").each(function () {
            if (parseInt(slider.attr("data-width"), 10) === 0) {
                return true;
            }
            var tb = $(this);
            var c = slider.width() / slider.attr("data-width");
            tb.css({
                "height": "",
                "width": "",
                "top": "",
                "margin-left": ""
            });
            if (responsiveDesign.isResponsive) {
                var tbHeight = parseInt(tb.css("height"), 10);
                var tbWidth = parseInt(tb.css("width"), 10);
                var tbTop = parseInt(tb.css("top"), 10);
                var tbMargin = parseInt(tb.css("margin-left"), 10);
                tb.add(tb.children()).css({
                    "height": tbHeight * c,
                    "width": tbWidth * c
                });
                tb.css("top", tbTop * c);
                tb.attr("style", function (i, s) { return s + "margin-left: " + (tbMargin * c) + "px !important"; });
            }
        });
    };
})(jQuery);

var responsiveSlider = (function ($) {
    "use strict";
    return function (responsiveDesign) {
        $(".ayb-slider").each(function () {
            var s = $(this);

            responsiveTextblocks(s, responsiveDesign);

            if (!responsiveDesign.isResponsive) {
                s.removeAttr("style");
                return;
            }

            // set size
            var initialWidth = s.attr("data-width");
            var initialHeight = s.attr("data-height");
            var c = s.width() / initialWidth;
            var h = c * initialHeight;
            s.css("height", h + "px");

            // set slider
            var obj = s.data("slider");
            if (obj && obj.settings.helper) {
                var inner = s.find(".ayb-slider-inner");
                obj.settings.helper.updateSize(inner, { width: initialWidth, height: initialHeight });
            }
        });
    };
})(jQuery);

var responsiveCollages = (function ($) {
    "use strict";
    return function (responsiveDesign) {
        $(".ayb-collage").each(function () {
            var collage = $(this);
            var parent = collage.closest(":not(.image-caption-wrapper, .ayb-collage)");
            var parentWidth = parent.width();
            var collageWidth = collage.width();
            var sliderOriginalWidth = collage.children(".ayb-slider").attr("data-width");
            if (responsiveDesign.isResponsive && collageWidth > parentWidth) {
                collage
                    .add(collage.find(".ayb-slider"))
                    .add(collage.closest(".image-caption-wrapper"))
                    .css("width", "100%");
            } else if (!responsiveDesign.isResponsive || collageWidth > sliderOriginalWidth) {
                collage
                    .add(collage.find(".ayb-slider"))
                    .add(collage.closest(".image-caption-wrapper"))
                    .css("width", "");
            }
        });
    };
})(jQuery);

var responsiveNavigator = (function ($) {
    "use strict";
    return function (responsiveDesign) {
        $(".ayb-slider").each(function () {
            var slider = $(this);
            var sliderWidth = slider.width();
            var nav = slider.siblings(".ayb-slidenavigator");
            if (nav.length) {
                if (responsiveDesign.isResponsive) {
                    // left offset
                    var left = nav.attr("data-left");
                    // (margin = containerWidth - (objectPosition + objectWidth)) < 0
                    var margin = sliderWidth - sliderWidth * parseFloat(left) / 100 - nav.outerWidth(false);
                    if (margin < 0) {
                        nav.css("margin-left", margin);
                    }
                    // top
                    var sliderHeight = slider.css("height");
                    // reset top to original value
                    nav.css("top", "");
                    // newTop = oldTop - (sliderOrinalHeight - sliderCurrentHeight)
                    var offset = parseInt(nav.attr("data-offset") || 0, 10);
                    nav.css("top", parseInt(nav.css("top"), 10) - (slider.attr("data-height") - parseInt(sliderHeight, 10)) + offset);
                } else {
                    nav.removeAttr("data-offset");
                    nav.removeAttr("style");
                }
            }
        });
    };
})(jQuery);

jQuery(window).bind("responsive", (function ($) {
    "use strict";
    return function (event, responsiveDesign) {
        responsiveImages(responsiveDesign);
        responsiveVideos(responsiveDesign);
    
        if ($.browser.msie && $.browser.version <= 8) return;
    
        if (responsiveDesign.isResponsive) {
            $(window).on("responsiveResize.slider", function () {
                responsiveSlideshow(responsiveDesign);
            });
        } else {
            $(window).trigger("responsiveResize.slider");
            $(window).off("responsiveResize.slider");
        }
    };
})(jQuery));

function responsiveSlideshow(responsiveDesign) {
    "use strict";
    responsiveCollages(responsiveDesign); // must be first
    responsiveSlider(responsiveDesign);
    responsiveNavigator(responsiveDesign);
}






var responsiveNavFit = (function ($) {
    "use strict";
    return function (responsiveDesign) {
        var nav = $(".ayb-nav:not(#ayb-hmenu-bg)");
        var isDesktopNav = true;
        var isResponsiveNav = false;
        if (responsiveDesign.isResponsive) {
            if (!nav.hasClass("responsive-nav")) {
                var itemsWidth = 0;
                var menu = nav.find(".ayb-hmenu");
                menu.children("li").each(function() {
                    itemsWidth += $(this).outerWidth(true);
                });
            
                if (menu.width() < itemsWidth || responsiveDesign.isPhone) {
                    nav.attr("data-restore-width", responsiveDesign.windowWidth).addClass("responsive-nav").removeClass("desktop-nav");
                    isResponsiveNav = true;
                    isDesktopNav = false;
                }
            } else {
                var desktopRestoreWidth = parseInt(nav.attr("data-restore-width"), 10) || 0;
                if (desktopRestoreWidth !== 0 && responsiveDesign.windowWidth <= desktopRestoreWidth) {
                    isResponsiveNav = true;
                    isDesktopNav = false;
                }
            }
        } 

        if (isDesktopNav) {
            nav.removeClass("responsive-nav").addClass("desktop-nav").removeAttr("data-restore-width");
        }

        $(window).trigger("responsiveNav", {isDesktopNav: isDesktopNav, isResponsiveNav: isResponsiveNav});
    };
})(jQuery);

jQuery(window).bind("responsiveResize", (function ($) {
    "use strict";
    return function (event, responsiveDesign) {
        responsiveAbsBg(responsiveDesign, $(".ayb-nav:not(#ayb-hmenu-bg)"), $("#ayb-hmenu-bg"));
        responsiveNavFit(responsiveDesign);
    };
})(jQuery));





var responsiveLayoutCell = (function ($) {
    "use strict";
    return function (responsiveDesign) {
        $(".ayb-content .ayb-content-layout-row,.ayb-footer .ayb-content-layout-row").each(function () {
            var row = $(this);
            var rowChildren = row.children(".ayb-layout-cell");
            if (rowChildren.length > 1) {
                if (responsiveDesign.isTablet) {
                    rowChildren.addClass("responsive-tablet-layout-cell").each(function (i) {
                        if ((i + 1) % 2 === 0) {
                            $(this).after("<div class=\"cleared responsive-cleared\">");
                        }
                    });
                } else {
                    rowChildren.removeClass("responsive-tablet-layout-cell");
                    row.children(".responsive-cleared").remove();
                }
            }
        });
    };
})(jQuery);

jQuery(window).bind("responsive", function (event, responsiveDesign) {
    "use strict";
    responsiveLayoutCell(responsiveDesign);
});




jQuery(responsiveDesign.initialize);
