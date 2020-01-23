/*!
 * jQuery Mousewheel 3.1.12
 *
 * Copyright 2014 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

(function (factory) {
    if ( typeof define === 'function' && define.amd ) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        // Node/CommonJS style for Browserify
        module.exports = factory;
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function ($) {

    var toFix  = ['wheel', 'mousewheel', 'DOMMouseScroll', 'MozMousePixelScroll'],
        toBind = ( 'onwheel' in document || document.documentMode >= 9 ) ?
                    ['wheel'] : ['mousewheel', 'DomMouseScroll', 'MozMousePixelScroll'],
        slice  = Array.prototype.slice,
        nullLowestDeltaTimeout, lowestDelta;

    if ( $.event.fixHooks ) {
        for ( var i = toFix.length; i; ) {
            $.event.fixHooks[ toFix[--i] ] = $.event.mouseHooks;
        }
    }

    var special = $.event.special.mousewheel = {
        version: '3.1.12',

        setup: function() {
            if ( this.addEventListener ) {
                for ( var i = toBind.length; i; ) {
                    this.addEventListener( toBind[--i], handler, false );
                }
            } else {
                this.onmousewheel = handler;
            }
            // Store the line height and page height for this particular element
            $.data(this, 'mousewheel-line-height', special.getLineHeight(this));
            $.data(this, 'mousewheel-page-height', special.getPageHeight(this));
        },

        teardown: function() {
            if ( this.removeEventListener ) {
                for ( var i = toBind.length; i; ) {
                    this.removeEventListener( toBind[--i], handler, false );
                }
            } else {
                this.onmousewheel = null;
            }
            // Clean up the data we added to the element
            $.removeData(this, 'mousewheel-line-height');
            $.removeData(this, 'mousewheel-page-height');
        },

        getLineHeight: function(elem) {
            var $elem = $(elem),
                $parent = $elem['offsetParent' in $.fn ? 'offsetParent' : 'parent']();
            if (!$parent.length) {
                $parent = $('body');
            }
            return parseInt($parent.css('fontSize'), 10) || parseInt($elem.css('fontSize'), 10) || 16;
        },

        getPageHeight: function(elem) {
            return $(elem).height();
        },

        settings: {
            adjustOldDeltas: true, // see shouldAdjustOldDeltas() below
            normalizeOffset: true  // calls getBoundingClientRect for each event
        }
    };

    $.fn.extend({
        mousewheel: function(fn) {
            return fn ? this.bind('mousewheel', fn) : this.trigger('mousewheel');
        },

        unmousewheel: function(fn) {
            return this.unbind('mousewheel', fn);
        }
    });


    function handler(event) {
        var orgEvent   = event || window.event,
            args       = slice.call(arguments, 1),
            delta      = 0,
            deltaX     = 0,
            deltaY     = 0,
            absDelta   = 0,
            offsetX    = 0,
            offsetY    = 0;
        event = $.event.fix(orgEvent);
        event.type = 'mousewheel';

        // Old school scrollwheel delta
        if ( 'detail'      in orgEvent ) { deltaY = orgEvent.detail * -1;      }
        if ( 'wheelDelta'  in orgEvent ) { deltaY = orgEvent.wheelDelta;       }
        if ( 'wheelDeltaY' in orgEvent ) { deltaY = orgEvent.wheelDeltaY;      }
        if ( 'wheelDeltaX' in orgEvent ) { deltaX = orgEvent.wheelDeltaX * -1; }

        // Firefox < 17 horizontal scrolling related to DOMMouseScroll event
        if ( 'axis' in orgEvent && orgEvent.axis === orgEvent.HORIZONTAL_AXIS ) {
            deltaX = deltaY * -1;
            deltaY = 0;
        }

        // Set delta to be deltaY or deltaX if deltaY is 0 for backwards compatabilitiy
        delta = deltaY === 0 ? deltaX : deltaY;

        // New school wheel delta (wheel event)
        if ( 'deltaY' in orgEvent ) {
            deltaY = orgEvent.deltaY * -1;
            delta  = deltaY;
        }
        if ( 'deltaX' in orgEvent ) {
            deltaX = orgEvent.deltaX;
            if ( deltaY === 0 ) { delta  = deltaX * -1; }
        }

        // No change actually happened, no reason to go any further
        if ( deltaY === 0 && deltaX === 0 ) { return; }

        // Need to convert lines and pages to pixels if we aren't already in pixels
        // There are three delta modes:
        //   * deltaMode 0 is by pixels, nothing to do
        //   * deltaMode 1 is by lines
        //   * deltaMode 2 is by pages
        if ( orgEvent.deltaMode === 1 ) {
            var lineHeight = $.data(this, 'mousewheel-line-height');
            delta  *= lineHeight;
            deltaY *= lineHeight;
            deltaX *= lineHeight;
        } else if ( orgEvent.deltaMode === 2 ) {
            var pageHeight = $.data(this, 'mousewheel-page-height');
            delta  *= pageHeight;
            deltaY *= pageHeight;
            deltaX *= pageHeight;
        }

        // Store lowest absolute delta to normalize the delta values
        absDelta = Math.max( Math.abs(deltaY), Math.abs(deltaX) );

        if ( !lowestDelta || absDelta < lowestDelta ) {
            lowestDelta = absDelta;

            // Adjust older deltas if necessary
            if ( shouldAdjustOldDeltas(orgEvent, absDelta) ) {
                lowestDelta /= 40;
            }
        }

        // Adjust older deltas if necessary
        if ( shouldAdjustOldDeltas(orgEvent, absDelta) ) {
            // Divide all the things by 40!
            delta  /= 40;
            deltaX /= 40;
            deltaY /= 40;
        }

        // Get a whole, normalized value for the deltas
        delta  = Math[ delta  >= 1 ? 'floor' : 'ceil' ](delta  / lowestDelta);
        deltaX = Math[ deltaX >= 1 ? 'floor' : 'ceil' ](deltaX / lowestDelta);
        deltaY = Math[ deltaY >= 1 ? 'floor' : 'ceil' ](deltaY / lowestDelta);

        // Normalise offsetX and offsetY properties
        if ( special.settings.normalizeOffset && this.getBoundingClientRect ) {
            var boundingRect = this.getBoundingClientRect();
            offsetX = event.clientX - boundingRect.left;
            offsetY = event.clientY - boundingRect.top;
        }

        // Add information to the event object
        event.deltaX = deltaX;
        event.deltaY = deltaY;
        event.deltaFactor = lowestDelta;
        event.offsetX = offsetX;
        event.offsetY = offsetY;
        // Go ahead and set deltaMode to 0 since we converted to pixels
        // Although this is a little odd since we overwrite the deltaX/Y
        // properties with normalized deltas.
        event.deltaMode = 0;

        // Add event and delta to the front of the arguments
        args.unshift(event, delta, deltaX, deltaY);

        // Clearout lowestDelta after sometime to better
        // handle multiple device types that give different
        // a different lowestDelta
        // Ex: trackpad = 3 and mouse wheel = 120
        if (nullLowestDeltaTimeout) { clearTimeout(nullLowestDeltaTimeout); }
        nullLowestDeltaTimeout = setTimeout(nullLowestDelta, 200);

        return ($.event.dispatch || $.event.handle).apply(this, args);
    }

    function nullLowestDelta() {
        lowestDelta = null;
    }

    function shouldAdjustOldDeltas(orgEvent, absDelta) {
        // If this is an older event and the delta is divisable by 120,
        // then we are assuming that the browser is treating this as an
        // older mouse wheel event and that we should divide the deltas
        // by 40 to try and get a more usable deltaFactor.
        // Side note, this actually impacts the reported scroll distance
        // in older browsers and can cause scrolling to be slower than native.
        // Turn this off by setting $.event.special.mousewheel.settings.adjustOldDeltas to false.
        return special.settings.adjustOldDeltas && orgEvent.type === 'mousewheel' && absDelta % 120 === 0;
    }

}));

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJqcXVlcnkubW91c2V3aGVlbC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKiFcclxuICogalF1ZXJ5IE1vdXNld2hlZWwgMy4xLjEyXHJcbiAqXHJcbiAqIENvcHlyaWdodCAyMDE0IGpRdWVyeSBGb3VuZGF0aW9uIGFuZCBvdGhlciBjb250cmlidXRvcnNcclxuICogUmVsZWFzZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlLlxyXG4gKiBodHRwOi8vanF1ZXJ5Lm9yZy9saWNlbnNlXHJcbiAqL1xyXG5cclxuKGZ1bmN0aW9uIChmYWN0b3J5KSB7XHJcbiAgICBpZiAoIHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCApIHtcclxuICAgICAgICAvLyBBTUQuIFJlZ2lzdGVyIGFzIGFuIGFub255bW91cyBtb2R1bGUuXHJcbiAgICAgICAgZGVmaW5lKFsnanF1ZXJ5J10sIGZhY3RvcnkpO1xyXG4gICAgfSBlbHNlIGlmICh0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpIHtcclxuICAgICAgICAvLyBOb2RlL0NvbW1vbkpTIHN0eWxlIGZvciBCcm93c2VyaWZ5XHJcbiAgICAgICAgbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5O1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICAvLyBCcm93c2VyIGdsb2JhbHNcclxuICAgICAgICBmYWN0b3J5KGpRdWVyeSk7XHJcbiAgICB9XHJcbn0oZnVuY3Rpb24gKCQpIHtcclxuXHJcbiAgICB2YXIgdG9GaXggID0gWyd3aGVlbCcsICdtb3VzZXdoZWVsJywgJ0RPTU1vdXNlU2Nyb2xsJywgJ01vek1vdXNlUGl4ZWxTY3JvbGwnXSxcclxuICAgICAgICB0b0JpbmQgPSAoICdvbndoZWVsJyBpbiBkb2N1bWVudCB8fCBkb2N1bWVudC5kb2N1bWVudE1vZGUgPj0gOSApID9cclxuICAgICAgICAgICAgICAgICAgICBbJ3doZWVsJ10gOiBbJ21vdXNld2hlZWwnLCAnRG9tTW91c2VTY3JvbGwnLCAnTW96TW91c2VQaXhlbFNjcm9sbCddLFxyXG4gICAgICAgIHNsaWNlICA9IEFycmF5LnByb3RvdHlwZS5zbGljZSxcclxuICAgICAgICBudWxsTG93ZXN0RGVsdGFUaW1lb3V0LCBsb3dlc3REZWx0YTtcclxuXHJcbiAgICBpZiAoICQuZXZlbnQuZml4SG9va3MgKSB7XHJcbiAgICAgICAgZm9yICggdmFyIGkgPSB0b0ZpeC5sZW5ndGg7IGk7ICkge1xyXG4gICAgICAgICAgICAkLmV2ZW50LmZpeEhvb2tzWyB0b0ZpeFstLWldIF0gPSAkLmV2ZW50Lm1vdXNlSG9va3M7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHZhciBzcGVjaWFsID0gJC5ldmVudC5zcGVjaWFsLm1vdXNld2hlZWwgPSB7XHJcbiAgICAgICAgdmVyc2lvbjogJzMuMS4xMicsXHJcblxyXG4gICAgICAgIHNldHVwOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgaWYgKCB0aGlzLmFkZEV2ZW50TGlzdGVuZXIgKSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKCB2YXIgaSA9IHRvQmluZC5sZW5ndGg7IGk7ICkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lciggdG9CaW5kWy0taV0sIGhhbmRsZXIsIGZhbHNlICk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm9ubW91c2V3aGVlbCA9IGhhbmRsZXI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy8gU3RvcmUgdGhlIGxpbmUgaGVpZ2h0IGFuZCBwYWdlIGhlaWdodCBmb3IgdGhpcyBwYXJ0aWN1bGFyIGVsZW1lbnRcclxuICAgICAgICAgICAgJC5kYXRhKHRoaXMsICdtb3VzZXdoZWVsLWxpbmUtaGVpZ2h0Jywgc3BlY2lhbC5nZXRMaW5lSGVpZ2h0KHRoaXMpKTtcclxuICAgICAgICAgICAgJC5kYXRhKHRoaXMsICdtb3VzZXdoZWVsLXBhZ2UtaGVpZ2h0Jywgc3BlY2lhbC5nZXRQYWdlSGVpZ2h0KHRoaXMpKTtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICB0ZWFyZG93bjogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGlmICggdGhpcy5yZW1vdmVFdmVudExpc3RlbmVyICkge1xyXG4gICAgICAgICAgICAgICAgZm9yICggdmFyIGkgPSB0b0JpbmQubGVuZ3RoOyBpOyApIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnJlbW92ZUV2ZW50TGlzdGVuZXIoIHRvQmluZFstLWldLCBoYW5kbGVyLCBmYWxzZSApO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5vbm1vdXNld2hlZWwgPSBudWxsO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vIENsZWFuIHVwIHRoZSBkYXRhIHdlIGFkZGVkIHRvIHRoZSBlbGVtZW50XHJcbiAgICAgICAgICAgICQucmVtb3ZlRGF0YSh0aGlzLCAnbW91c2V3aGVlbC1saW5lLWhlaWdodCcpO1xyXG4gICAgICAgICAgICAkLnJlbW92ZURhdGEodGhpcywgJ21vdXNld2hlZWwtcGFnZS1oZWlnaHQnKTtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBnZXRMaW5lSGVpZ2h0OiBmdW5jdGlvbihlbGVtKSB7XHJcbiAgICAgICAgICAgIHZhciAkZWxlbSA9ICQoZWxlbSksXHJcbiAgICAgICAgICAgICAgICAkcGFyZW50ID0gJGVsZW1bJ29mZnNldFBhcmVudCcgaW4gJC5mbiA/ICdvZmZzZXRQYXJlbnQnIDogJ3BhcmVudCddKCk7XHJcbiAgICAgICAgICAgIGlmICghJHBhcmVudC5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgICRwYXJlbnQgPSAkKCdib2R5Jyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHBhcnNlSW50KCRwYXJlbnQuY3NzKCdmb250U2l6ZScpLCAxMCkgfHwgcGFyc2VJbnQoJGVsZW0uY3NzKCdmb250U2l6ZScpLCAxMCkgfHwgMTY7XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgZ2V0UGFnZUhlaWdodDogZnVuY3Rpb24oZWxlbSkge1xyXG4gICAgICAgICAgICByZXR1cm4gJChlbGVtKS5oZWlnaHQoKTtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBzZXR0aW5nczoge1xyXG4gICAgICAgICAgICBhZGp1c3RPbGREZWx0YXM6IHRydWUsIC8vIHNlZSBzaG91bGRBZGp1c3RPbGREZWx0YXMoKSBiZWxvd1xyXG4gICAgICAgICAgICBub3JtYWxpemVPZmZzZXQ6IHRydWUgIC8vIGNhbGxzIGdldEJvdW5kaW5nQ2xpZW50UmVjdCBmb3IgZWFjaCBldmVudFxyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgJC5mbi5leHRlbmQoe1xyXG4gICAgICAgIG1vdXNld2hlZWw6IGZ1bmN0aW9uKGZuKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmbiA/IHRoaXMuYmluZCgnbW91c2V3aGVlbCcsIGZuKSA6IHRoaXMudHJpZ2dlcignbW91c2V3aGVlbCcpO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIHVubW91c2V3aGVlbDogZnVuY3Rpb24oZm4pIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMudW5iaW5kKCdtb3VzZXdoZWVsJywgZm4pO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuXHJcbiAgICBmdW5jdGlvbiBoYW5kbGVyKGV2ZW50KSB7XHJcbiAgICAgICAgdmFyIG9yZ0V2ZW50ICAgPSBldmVudCB8fCB3aW5kb3cuZXZlbnQsXHJcbiAgICAgICAgICAgIGFyZ3MgICAgICAgPSBzbGljZS5jYWxsKGFyZ3VtZW50cywgMSksXHJcbiAgICAgICAgICAgIGRlbHRhICAgICAgPSAwLFxyXG4gICAgICAgICAgICBkZWx0YVggICAgID0gMCxcclxuICAgICAgICAgICAgZGVsdGFZICAgICA9IDAsXHJcbiAgICAgICAgICAgIGFic0RlbHRhICAgPSAwLFxyXG4gICAgICAgICAgICBvZmZzZXRYICAgID0gMCxcclxuICAgICAgICAgICAgb2Zmc2V0WSAgICA9IDA7XHJcbiAgICAgICAgZXZlbnQgPSAkLmV2ZW50LmZpeChvcmdFdmVudCk7XHJcbiAgICAgICAgZXZlbnQudHlwZSA9ICdtb3VzZXdoZWVsJztcclxuXHJcbiAgICAgICAgLy8gT2xkIHNjaG9vbCBzY3JvbGx3aGVlbCBkZWx0YVxyXG4gICAgICAgIGlmICggJ2RldGFpbCcgICAgICBpbiBvcmdFdmVudCApIHsgZGVsdGFZID0gb3JnRXZlbnQuZGV0YWlsICogLTE7ICAgICAgfVxyXG4gICAgICAgIGlmICggJ3doZWVsRGVsdGEnICBpbiBvcmdFdmVudCApIHsgZGVsdGFZID0gb3JnRXZlbnQud2hlZWxEZWx0YTsgICAgICAgfVxyXG4gICAgICAgIGlmICggJ3doZWVsRGVsdGFZJyBpbiBvcmdFdmVudCApIHsgZGVsdGFZID0gb3JnRXZlbnQud2hlZWxEZWx0YVk7ICAgICAgfVxyXG4gICAgICAgIGlmICggJ3doZWVsRGVsdGFYJyBpbiBvcmdFdmVudCApIHsgZGVsdGFYID0gb3JnRXZlbnQud2hlZWxEZWx0YVggKiAtMTsgfVxyXG5cclxuICAgICAgICAvLyBGaXJlZm94IDwgMTcgaG9yaXpvbnRhbCBzY3JvbGxpbmcgcmVsYXRlZCB0byBET01Nb3VzZVNjcm9sbCBldmVudFxyXG4gICAgICAgIGlmICggJ2F4aXMnIGluIG9yZ0V2ZW50ICYmIG9yZ0V2ZW50LmF4aXMgPT09IG9yZ0V2ZW50LkhPUklaT05UQUxfQVhJUyApIHtcclxuICAgICAgICAgICAgZGVsdGFYID0gZGVsdGFZICogLTE7XHJcbiAgICAgICAgICAgIGRlbHRhWSA9IDA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBTZXQgZGVsdGEgdG8gYmUgZGVsdGFZIG9yIGRlbHRhWCBpZiBkZWx0YVkgaXMgMCBmb3IgYmFja3dhcmRzIGNvbXBhdGFiaWxpdGl5XHJcbiAgICAgICAgZGVsdGEgPSBkZWx0YVkgPT09IDAgPyBkZWx0YVggOiBkZWx0YVk7XHJcblxyXG4gICAgICAgIC8vIE5ldyBzY2hvb2wgd2hlZWwgZGVsdGEgKHdoZWVsIGV2ZW50KVxyXG4gICAgICAgIGlmICggJ2RlbHRhWScgaW4gb3JnRXZlbnQgKSB7XHJcbiAgICAgICAgICAgIGRlbHRhWSA9IG9yZ0V2ZW50LmRlbHRhWSAqIC0xO1xyXG4gICAgICAgICAgICBkZWx0YSAgPSBkZWx0YVk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICggJ2RlbHRhWCcgaW4gb3JnRXZlbnQgKSB7XHJcbiAgICAgICAgICAgIGRlbHRhWCA9IG9yZ0V2ZW50LmRlbHRhWDtcclxuICAgICAgICAgICAgaWYgKCBkZWx0YVkgPT09IDAgKSB7IGRlbHRhICA9IGRlbHRhWCAqIC0xOyB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBObyBjaGFuZ2UgYWN0dWFsbHkgaGFwcGVuZWQsIG5vIHJlYXNvbiB0byBnbyBhbnkgZnVydGhlclxyXG4gICAgICAgIGlmICggZGVsdGFZID09PSAwICYmIGRlbHRhWCA9PT0gMCApIHsgcmV0dXJuOyB9XHJcblxyXG4gICAgICAgIC8vIE5lZWQgdG8gY29udmVydCBsaW5lcyBhbmQgcGFnZXMgdG8gcGl4ZWxzIGlmIHdlIGFyZW4ndCBhbHJlYWR5IGluIHBpeGVsc1xyXG4gICAgICAgIC8vIFRoZXJlIGFyZSB0aHJlZSBkZWx0YSBtb2RlczpcclxuICAgICAgICAvLyAgICogZGVsdGFNb2RlIDAgaXMgYnkgcGl4ZWxzLCBub3RoaW5nIHRvIGRvXHJcbiAgICAgICAgLy8gICAqIGRlbHRhTW9kZSAxIGlzIGJ5IGxpbmVzXHJcbiAgICAgICAgLy8gICAqIGRlbHRhTW9kZSAyIGlzIGJ5IHBhZ2VzXHJcbiAgICAgICAgaWYgKCBvcmdFdmVudC5kZWx0YU1vZGUgPT09IDEgKSB7XHJcbiAgICAgICAgICAgIHZhciBsaW5lSGVpZ2h0ID0gJC5kYXRhKHRoaXMsICdtb3VzZXdoZWVsLWxpbmUtaGVpZ2h0Jyk7XHJcbiAgICAgICAgICAgIGRlbHRhICAqPSBsaW5lSGVpZ2h0O1xyXG4gICAgICAgICAgICBkZWx0YVkgKj0gbGluZUhlaWdodDtcclxuICAgICAgICAgICAgZGVsdGFYICo9IGxpbmVIZWlnaHQ7XHJcbiAgICAgICAgfSBlbHNlIGlmICggb3JnRXZlbnQuZGVsdGFNb2RlID09PSAyICkge1xyXG4gICAgICAgICAgICB2YXIgcGFnZUhlaWdodCA9ICQuZGF0YSh0aGlzLCAnbW91c2V3aGVlbC1wYWdlLWhlaWdodCcpO1xyXG4gICAgICAgICAgICBkZWx0YSAgKj0gcGFnZUhlaWdodDtcclxuICAgICAgICAgICAgZGVsdGFZICo9IHBhZ2VIZWlnaHQ7XHJcbiAgICAgICAgICAgIGRlbHRhWCAqPSBwYWdlSGVpZ2h0O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gU3RvcmUgbG93ZXN0IGFic29sdXRlIGRlbHRhIHRvIG5vcm1hbGl6ZSB0aGUgZGVsdGEgdmFsdWVzXHJcbiAgICAgICAgYWJzRGVsdGEgPSBNYXRoLm1heCggTWF0aC5hYnMoZGVsdGFZKSwgTWF0aC5hYnMoZGVsdGFYKSApO1xyXG5cclxuICAgICAgICBpZiAoICFsb3dlc3REZWx0YSB8fCBhYnNEZWx0YSA8IGxvd2VzdERlbHRhICkge1xyXG4gICAgICAgICAgICBsb3dlc3REZWx0YSA9IGFic0RlbHRhO1xyXG5cclxuICAgICAgICAgICAgLy8gQWRqdXN0IG9sZGVyIGRlbHRhcyBpZiBuZWNlc3NhcnlcclxuICAgICAgICAgICAgaWYgKCBzaG91bGRBZGp1c3RPbGREZWx0YXMob3JnRXZlbnQsIGFic0RlbHRhKSApIHtcclxuICAgICAgICAgICAgICAgIGxvd2VzdERlbHRhIC89IDQwO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBBZGp1c3Qgb2xkZXIgZGVsdGFzIGlmIG5lY2Vzc2FyeVxyXG4gICAgICAgIGlmICggc2hvdWxkQWRqdXN0T2xkRGVsdGFzKG9yZ0V2ZW50LCBhYnNEZWx0YSkgKSB7XHJcbiAgICAgICAgICAgIC8vIERpdmlkZSBhbGwgdGhlIHRoaW5ncyBieSA0MCFcclxuICAgICAgICAgICAgZGVsdGEgIC89IDQwO1xyXG4gICAgICAgICAgICBkZWx0YVggLz0gNDA7XHJcbiAgICAgICAgICAgIGRlbHRhWSAvPSA0MDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIEdldCBhIHdob2xlLCBub3JtYWxpemVkIHZhbHVlIGZvciB0aGUgZGVsdGFzXHJcbiAgICAgICAgZGVsdGEgID0gTWF0aFsgZGVsdGEgID49IDEgPyAnZmxvb3InIDogJ2NlaWwnIF0oZGVsdGEgIC8gbG93ZXN0RGVsdGEpO1xyXG4gICAgICAgIGRlbHRhWCA9IE1hdGhbIGRlbHRhWCA+PSAxID8gJ2Zsb29yJyA6ICdjZWlsJyBdKGRlbHRhWCAvIGxvd2VzdERlbHRhKTtcclxuICAgICAgICBkZWx0YVkgPSBNYXRoWyBkZWx0YVkgPj0gMSA/ICdmbG9vcicgOiAnY2VpbCcgXShkZWx0YVkgLyBsb3dlc3REZWx0YSk7XHJcblxyXG4gICAgICAgIC8vIE5vcm1hbGlzZSBvZmZzZXRYIGFuZCBvZmZzZXRZIHByb3BlcnRpZXNcclxuICAgICAgICBpZiAoIHNwZWNpYWwuc2V0dGluZ3Mubm9ybWFsaXplT2Zmc2V0ICYmIHRoaXMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0ICkge1xyXG4gICAgICAgICAgICB2YXIgYm91bmRpbmdSZWN0ID0gdGhpcy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuICAgICAgICAgICAgb2Zmc2V0WCA9IGV2ZW50LmNsaWVudFggLSBib3VuZGluZ1JlY3QubGVmdDtcclxuICAgICAgICAgICAgb2Zmc2V0WSA9IGV2ZW50LmNsaWVudFkgLSBib3VuZGluZ1JlY3QudG9wO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gQWRkIGluZm9ybWF0aW9uIHRvIHRoZSBldmVudCBvYmplY3RcclxuICAgICAgICBldmVudC5kZWx0YVggPSBkZWx0YVg7XHJcbiAgICAgICAgZXZlbnQuZGVsdGFZID0gZGVsdGFZO1xyXG4gICAgICAgIGV2ZW50LmRlbHRhRmFjdG9yID0gbG93ZXN0RGVsdGE7XHJcbiAgICAgICAgZXZlbnQub2Zmc2V0WCA9IG9mZnNldFg7XHJcbiAgICAgICAgZXZlbnQub2Zmc2V0WSA9IG9mZnNldFk7XHJcbiAgICAgICAgLy8gR28gYWhlYWQgYW5kIHNldCBkZWx0YU1vZGUgdG8gMCBzaW5jZSB3ZSBjb252ZXJ0ZWQgdG8gcGl4ZWxzXHJcbiAgICAgICAgLy8gQWx0aG91Z2ggdGhpcyBpcyBhIGxpdHRsZSBvZGQgc2luY2Ugd2Ugb3ZlcndyaXRlIHRoZSBkZWx0YVgvWVxyXG4gICAgICAgIC8vIHByb3BlcnRpZXMgd2l0aCBub3JtYWxpemVkIGRlbHRhcy5cclxuICAgICAgICBldmVudC5kZWx0YU1vZGUgPSAwO1xyXG5cclxuICAgICAgICAvLyBBZGQgZXZlbnQgYW5kIGRlbHRhIHRvIHRoZSBmcm9udCBvZiB0aGUgYXJndW1lbnRzXHJcbiAgICAgICAgYXJncy51bnNoaWZ0KGV2ZW50LCBkZWx0YSwgZGVsdGFYLCBkZWx0YVkpO1xyXG5cclxuICAgICAgICAvLyBDbGVhcm91dCBsb3dlc3REZWx0YSBhZnRlciBzb21ldGltZSB0byBiZXR0ZXJcclxuICAgICAgICAvLyBoYW5kbGUgbXVsdGlwbGUgZGV2aWNlIHR5cGVzIHRoYXQgZ2l2ZSBkaWZmZXJlbnRcclxuICAgICAgICAvLyBhIGRpZmZlcmVudCBsb3dlc3REZWx0YVxyXG4gICAgICAgIC8vIEV4OiB0cmFja3BhZCA9IDMgYW5kIG1vdXNlIHdoZWVsID0gMTIwXHJcbiAgICAgICAgaWYgKG51bGxMb3dlc3REZWx0YVRpbWVvdXQpIHsgY2xlYXJUaW1lb3V0KG51bGxMb3dlc3REZWx0YVRpbWVvdXQpOyB9XHJcbiAgICAgICAgbnVsbExvd2VzdERlbHRhVGltZW91dCA9IHNldFRpbWVvdXQobnVsbExvd2VzdERlbHRhLCAyMDApO1xyXG5cclxuICAgICAgICByZXR1cm4gKCQuZXZlbnQuZGlzcGF0Y2ggfHwgJC5ldmVudC5oYW5kbGUpLmFwcGx5KHRoaXMsIGFyZ3MpO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIG51bGxMb3dlc3REZWx0YSgpIHtcclxuICAgICAgICBsb3dlc3REZWx0YSA9IG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gc2hvdWxkQWRqdXN0T2xkRGVsdGFzKG9yZ0V2ZW50LCBhYnNEZWx0YSkge1xyXG4gICAgICAgIC8vIElmIHRoaXMgaXMgYW4gb2xkZXIgZXZlbnQgYW5kIHRoZSBkZWx0YSBpcyBkaXZpc2FibGUgYnkgMTIwLFxyXG4gICAgICAgIC8vIHRoZW4gd2UgYXJlIGFzc3VtaW5nIHRoYXQgdGhlIGJyb3dzZXIgaXMgdHJlYXRpbmcgdGhpcyBhcyBhblxyXG4gICAgICAgIC8vIG9sZGVyIG1vdXNlIHdoZWVsIGV2ZW50IGFuZCB0aGF0IHdlIHNob3VsZCBkaXZpZGUgdGhlIGRlbHRhc1xyXG4gICAgICAgIC8vIGJ5IDQwIHRvIHRyeSBhbmQgZ2V0IGEgbW9yZSB1c2FibGUgZGVsdGFGYWN0b3IuXHJcbiAgICAgICAgLy8gU2lkZSBub3RlLCB0aGlzIGFjdHVhbGx5IGltcGFjdHMgdGhlIHJlcG9ydGVkIHNjcm9sbCBkaXN0YW5jZVxyXG4gICAgICAgIC8vIGluIG9sZGVyIGJyb3dzZXJzIGFuZCBjYW4gY2F1c2Ugc2Nyb2xsaW5nIHRvIGJlIHNsb3dlciB0aGFuIG5hdGl2ZS5cclxuICAgICAgICAvLyBUdXJuIHRoaXMgb2ZmIGJ5IHNldHRpbmcgJC5ldmVudC5zcGVjaWFsLm1vdXNld2hlZWwuc2V0dGluZ3MuYWRqdXN0T2xkRGVsdGFzIHRvIGZhbHNlLlxyXG4gICAgICAgIHJldHVybiBzcGVjaWFsLnNldHRpbmdzLmFkanVzdE9sZERlbHRhcyAmJiBvcmdFdmVudC50eXBlID09PSAnbW91c2V3aGVlbCcgJiYgYWJzRGVsdGEgJSAxMjAgPT09IDA7XHJcbiAgICB9XHJcblxyXG59KSk7XHJcbiJdLCJmaWxlIjoianF1ZXJ5Lm1vdXNld2hlZWwuanMifQ==
