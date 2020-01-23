/*!
 * jScrollPane - v2.2.1 - 2018-09-27
 * http://jscrollpane.kelvinluck.com/
 *
 * Copyright (c) 2014 Kelvin Luck
 * Copyright (c) 2017-2018 Tuukka Pasanen
 * Dual licensed under the MIT or GPL licenses.
 */

// Script: jScrollPane - cross browser customisable scrollbars
//
// *Version: 2.2.1, Last updated: 2018-09-27*
//
// Project Home - http://jscrollpane.kelvinluck.com/
// GitHub       - http://github.com/vitch/jScrollPane
// CND          - https://cdnjs.com/libraries/jScrollPane
// Source       - https://cdnjs.cloudflare.com/ajax/libs/jScrollPane/2.2.1/script/jquery.jscrollpane.min.js
// (Minified)   - https://cdnjs.cloudflare.com/ajax/libs/jScrollPane/2.2.1/script/jquery.jscrollpane.js
// CSS          - https://cdnjs.cloudflare.com/ajax/libs/jScrollPane/2.2.1/style/jquery.jscrollpane.css
// (Minified)   - https://cdnjs.cloudflare.com/ajax/libs/jScrollPane/2.2.1/style/jquery.jscrollpane.min.css
//
// About: License
//
// Copyright (c) 2017 Kelvin Luck
// Copyright (c) 2017-2018 Tuukka Pasanen
// Dual licensed under the MIT or GPL Version 2 licenses.
// http://jscrollpane.kelvinluck.com/MIT-LICENSE.txt
// http://jscrollpane.kelvinluck.com/GPL-LICENSE.txt
//
// About: Examples
//
// All examples and demos are available through the jScrollPane example site at:
// http://jscrollpane.kelvinluck.com/
//
// About: Support and Testing
//
// This plugin is tested on the browsers below and has been found to work reliably on them. If you run
// into a problem on one of the supported browsers then please visit the support section on the jScrollPane
// website (http://jscrollpane.kelvinluck.com/) for more information on getting support. You are also
// welcome to fork the project on GitHub if you can contribute a fix for a given issue.
//
// jQuery Versions - jQuery 3.x. Although script should work from jQuery 1.1 and up but no promises are made.
// Browsers Tested - See jQuery browser support page: https://jquery.com/browser-support/. Only modern
//                   browsers are supported.
//
// About: Release History
//
// 2.2.1       - (2018-09-27) No changed applied to release so same as RC1/2
// 2.2.1-rc.2  - (2018-06-14) Sucked NPM release have to make new Release.. this is 2018!
// 2.2.1-rc.1  - (2018-06-14) Fixed CSSLint warnings which can lead CSS problems in
//                            production! Please report a issue if this breaks something!
//                            * Merged:
//                            - #360 Register to globally available version of jQuery
// 2.2.0       - (2018-05-16) No changes to RC1
// 2.2.0-rc.1  - (2018-04-28) Merged resize sensor to find out size changes of screen and
//                            again little bit tuned this to support more npm goodies.
//                            * Merged:
//                            - #361 Event based reinitialising - Resize Sensor
//                            - #359 Use npm scripts and local dev dependencies to build the project
// 2.1.3       - (2018-04-04) No changes from Release Candidate 2 so making release
// 2.1.3-rc.2  - (2018-03-13) Now using 'script/jquery.jscrollpane.min.js' main
//                            in package.json rather than 'Gruntfile.js'
// 2.1.3-rc.1  - (2018-03-05) Moving Gruntfile.js to root and example HTML
//                            to subdirectory examples
// 2.1.2       - (2018-02-16) Just on console.log remove and Release!
//                            This version should play nicely with NPM
// 2.1.2-rc.2  - (2018-02-03) Update package.json main-tag
// 2.1.2-rc.1  - (2018-01-18) Release on NPM.
// 2.1.1       - (2018-01-12) As everyone stays silent then we just release! No changes from RC.1
// 2.1.1-rc.1  - (2017-12-23) Started to slowly merge stuff (HO HO HO Merry Christmas!)
//             * Merged
//             - #349 - ScrollPane reinitialization should adapt to changed container size
//             - #335 Set drag bar width/height with .css instead of .width/.height
//             - #297 added two settings: always show HScroll and VScroll
//             * Bugs
//             - #8 Make it possible to tell a scrollbar to be "always on"
// 2.1.0  - (2017-12-16) Update jQuery to version 3.x

(function (factory) {
  if ( typeof define === 'function' && define.amd ) {
      // AMD. Register as an anonymous module.
      define(['jquery'], factory);
  } else if (typeof exports === 'object') {
      // Node/CommonJS style for Browserify
      module.exports = factory(jQuery || require('jquery'));
  } else {
      // Browser globals
      factory(jQuery);
  }
}(function($){

	$.fn.jScrollPane = function(settings)
	{
		// JScrollPane "class" - public methods are available through $('selector').data('jsp')
		function JScrollPane(elem, s)
		{
			var settings, jsp = this, pane, paneWidth, paneHeight, container, contentWidth, contentHeight,
				percentInViewH, percentInViewV, isScrollableV, isScrollableH, verticalDrag, dragMaxY,
				verticalDragPosition, horizontalDrag, dragMaxX, horizontalDragPosition,
				verticalBar, verticalTrack, scrollbarWidth, verticalTrackHeight, verticalDragHeight, arrowUp, arrowDown,
				horizontalBar, horizontalTrack, horizontalTrackWidth, horizontalDragWidth, arrowLeft, arrowRight,
				reinitialiseInterval, originalPadding, originalPaddingTotalWidth, previousContentWidth,
				wasAtTop = true, wasAtLeft = true, wasAtBottom = false, wasAtRight = false,
				originalElement = elem.clone(false, false).empty(), resizeEventsAdded = false,
				mwEvent = $.fn.mwheelIntent ? 'mwheelIntent.jsp' : 'mousewheel.jsp';

			var reinitialiseFn = function() {
				// if size has changed then reinitialise
				if (settings.resizeSensorDelay > 0) {
					setTimeout(function() {
						initialise(settings);
					}, settings.resizeSensorDelay);
				}
				else {
					initialise(settings);
				}
			};

			if (elem.css('box-sizing') === 'border-box') {
				originalPadding = 0;
				originalPaddingTotalWidth = 0;
			} else {
				originalPadding = elem.css('paddingTop') + ' ' +
									elem.css('paddingRight') + ' ' +
									elem.css('paddingBottom') + ' ' +
									elem.css('paddingLeft');
				originalPaddingTotalWidth = (parseInt(elem.css('paddingLeft'), 10) || 0) +
											(parseInt(elem.css('paddingRight'), 10) || 0);
			}

			function initialise(s)
			{

				var /*firstChild, lastChild, */isMaintainingPositon, lastContentX, lastContentY,
						hasContainingSpaceChanged, originalScrollTop, originalScrollLeft,
						newPaneWidth, newPaneHeight, maintainAtBottom = false, maintainAtRight = false;

				settings = s;

				if (pane === undefined) {
					originalScrollTop = elem.scrollTop();
					originalScrollLeft = elem.scrollLeft();

					elem.css(
						{
							overflow: 'hidden',
							padding: 0
						}
					);
					// TODO: Deal with where width/ height is 0 as it probably means the element is hidden and we should
					// come back to it later and check once it is unhidden...
					paneWidth = elem.innerWidth() + originalPaddingTotalWidth;
					paneHeight = elem.innerHeight();

					elem.width(paneWidth);

					pane = $('<div class="jspPane" />').css('padding', originalPadding).append(elem.children());
					container = $('<div class="jspContainer" />')
						.css({
							'width': paneWidth + 'px',
							'height': paneHeight + 'px'
						}
					).append(pane).appendTo(elem);

					/*
					// Move any margins from the first and last children up to the container so they can still
					// collapse with neighbouring elements as they would before jScrollPane
					firstChild = pane.find(':first-child');
					lastChild = pane.find(':last-child');
					elem.css(
						{
							'margin-top': firstChild.css('margin-top'),
							'margin-bottom': lastChild.css('margin-bottom')
						}
					);
					firstChild.css('margin-top', 0);
					lastChild.css('margin-bottom', 0);
					*/
				} else {
					elem.css('width', '');

					// To measure the required dimensions accurately, temporarily override the CSS positioning
					// of the container and pane.
					container.css({width: 'auto', height: 'auto'});
					pane.css('position', 'static');

					newPaneWidth = elem.innerWidth() + originalPaddingTotalWidth;
					newPaneHeight = elem.innerHeight();
					pane.css('position', 'absolute');

					maintainAtBottom = settings.stickToBottom && isCloseToBottom();
					maintainAtRight  = settings.stickToRight  && isCloseToRight();

					hasContainingSpaceChanged = newPaneWidth !== paneWidth || newPaneHeight !== paneHeight;

					paneWidth = newPaneWidth;
					paneHeight = newPaneHeight;
					container.css({width: paneWidth, height: paneHeight});

					// If nothing changed since last check...
					if (!hasContainingSpaceChanged && previousContentWidth == contentWidth && pane.outerHeight() == contentHeight) {
						elem.width(paneWidth);
						return;
					}
					previousContentWidth = contentWidth;

					pane.css('width', '');
					elem.width(paneWidth);

					container.find('>.jspVerticalBar,>.jspHorizontalBar').remove().end();
				}

				pane.css('overflow', 'auto');
				if (s.contentWidth) {
					contentWidth = s.contentWidth;
				} else {
					contentWidth = pane[0].scrollWidth;
				}
				contentHeight = pane[0].scrollHeight;
				pane.css('overflow', '');

				percentInViewH = contentWidth / paneWidth;
				percentInViewV = contentHeight / paneHeight;
				isScrollableV = percentInViewV > 1 || settings.alwaysShowVScroll;
				isScrollableH = percentInViewH > 1 || settings.alwaysShowHScroll;

				if (!(isScrollableH || isScrollableV)) {
					elem.removeClass('jspScrollable');
					pane.css({
            top: 0,
            left: 0,
						width: container.width() - originalPaddingTotalWidth
					});
					removeMousewheel();
					removeFocusHandler();
					removeKeyboardNav();
					removeClickOnTrack();
				} else {
					elem.addClass('jspScrollable');

					isMaintainingPositon = settings.maintainPosition && (verticalDragPosition || horizontalDragPosition);
					if (isMaintainingPositon) {
						lastContentX = contentPositionX();
						lastContentY = contentPositionY();
					}

					initialiseVerticalScroll();
					initialiseHorizontalScroll();
					resizeScrollbars();

					if (isMaintainingPositon) {
						scrollToX(maintainAtRight  ? (contentWidth  - paneWidth ) : lastContentX, false);
						scrollToY(maintainAtBottom ? (contentHeight - paneHeight) : lastContentY, false);
					}

					initFocusHandler();
					initMousewheel();
					initTouch();

					if (settings.enableKeyboardNavigation) {
						initKeyboardNav();
					}
					if (settings.clickOnTrack) {
						initClickOnTrack();
					}

					observeHash();
					if (settings.hijackInternalLinks) {
						hijackInternalLinks();
					}
				}

				if (!settings.resizeSensor && settings.autoReinitialise && !reinitialiseInterval) {
					reinitialiseInterval = setInterval(
						function()
						{
							initialise(settings);
						},
						settings.autoReinitialiseDelay
					);
				} else if (!settings.resizeSensor && !settings.autoReinitialise && reinitialiseInterval) {
					clearInterval(reinitialiseInterval);
				}

				if(settings.resizeSensor && !resizeEventsAdded) {
		
					// detect size change in content
					detectSizeChanges(pane, reinitialiseFn);
			
					// detect size changes of scroll element
					detectSizeChanges(elem, reinitialiseFn);
			
					// detect size changes of container
					detectSizeChanges(elem.parent(), reinitialiseFn);

					// add a reinit on window resize also for safety
					window.addEventListener('resize', reinitialiseFn);
			
					resizeEventsAdded = true;
				}

        if(originalScrollTop && elem.scrollTop(0)) {
          scrollToY(originalScrollTop, false);
        }

				if(originalScrollLeft && elem.scrollLeft(0)) {
          scrollToX(originalScrollLeft, false);
        }

				elem.trigger('jsp-initialised', [isScrollableH || isScrollableV]);
			}

			function detectSizeChanges(element, callback) {
 
				// create resize event elements - based on resize sensor: https://github.com/flowkey/resize-sensor/
				var resizeWidth, resizeHeight;
				var resizeElement = document.createElement('div');
				var resizeGrowElement = document.createElement('div');
				var resizeGrowChildElement = document.createElement('div');
				var resizeShrinkElement = document.createElement('div');
				var resizeShrinkChildElement = document.createElement('div');
		
				// add necessary styling
				resizeElement.style.cssText = 'position: absolute; left: 0; top: 0; right: 0; bottom: 0; overflow: scroll; z-index: -1; visibility: hidden;';
				resizeGrowElement.style.cssText = 'position: absolute; left: 0; top: 0; right: 0; bottom: 0; overflow: scroll; z-index: -1; visibility: hidden;';
				resizeShrinkElement.style.cssText = 'position: absolute; left: 0; top: 0; right: 0; bottom: 0; overflow: scroll; z-index: -1; visibility: hidden;';
		
				resizeGrowChildElement.style.cssText = 'position: absolute; left: 0; top: 0;';
				resizeShrinkChildElement.style.cssText = 'position: absolute; left: 0; top: 0; width: 200%; height: 200%;';
		
				// Create a function to programmatically update sizes
				var updateSizes = function() {
		
					resizeGrowChildElement.style.width = resizeGrowElement.offsetWidth + 10 + 'px';
					resizeGrowChildElement.style.height = resizeGrowElement.offsetHeight + 10 + 'px';
		
					resizeGrowElement.scrollLeft = resizeGrowElement.scrollWidth;
					resizeGrowElement.scrollTop = resizeGrowElement.scrollHeight;
		
					resizeShrinkElement.scrollLeft = resizeShrinkElement.scrollWidth;
					resizeShrinkElement.scrollTop = resizeShrinkElement.scrollHeight;
		
					resizeWidth = element.width();
					resizeHeight = element.height();
				};
		
				// create functions to call when content grows
				var onGrow = function() {
		
					// check to see if the content has change size
					if (element.width() > resizeWidth || element.height() > resizeHeight) {
			
						// if size has changed then reinitialise
						callback.apply(this, []);
					}
					// after reinitialising update sizes
					updateSizes();
				};
		
				// create functions to call when content shrinks
				var onShrink = function() {
		
					// check to see if the content has change size
					if (element.width() < resizeWidth || element.height() < resizeHeight) {
			
						// if size has changed then reinitialise
						callback.apply(this, []);
					}
					// after reinitialising update sizes
					updateSizes();
				};
		
				// bind to scroll events
				resizeGrowElement.addEventListener('scroll', onGrow.bind(this));
				resizeShrinkElement.addEventListener('scroll', onShrink.bind(this));
		
				// nest elements before adding to pane
				resizeGrowElement.appendChild(resizeGrowChildElement);
				resizeShrinkElement.appendChild(resizeShrinkChildElement);
		
				resizeElement.appendChild(resizeGrowElement);
				resizeElement.appendChild(resizeShrinkElement);
		
				element.append(resizeElement);

				// ensure parent element is not statically positioned
				if(window.getComputedStyle(element[0], null).getPropertyValue('position') === 'static') {
					element[0].style.position = 'relative';
				}
		
				// update sizes initially
				updateSizes();
			}

			function initialiseVerticalScroll()
			{
				if (isScrollableV) {

					container.append(
						$('<div class="jspVerticalBar" />').append(
							$('<div class="jspCap jspCapTop" />'),
							$('<div class="jspTrack" />').append(
								$('<div class="jspDrag" />').append(
									$('<div class="jspDragTop" />'),
									$('<div class="jspDragBottom" />')
								)
							),
							$('<div class="jspCap jspCapBottom" />')
						)
					);

					verticalBar = container.find('>.jspVerticalBar');
					verticalTrack = verticalBar.find('>.jspTrack');
					verticalDrag = verticalTrack.find('>.jspDrag');

					if (settings.showArrows) {
						arrowUp = $('<a class="jspArrow jspArrowUp" />').on(
							'mousedown.jsp', getArrowScroll(0, -1)
						).on('click.jsp', nil);
						arrowDown = $('<a class="jspArrow jspArrowDown" />').on(
							'mousedown.jsp', getArrowScroll(0, 1)
						).on('click.jsp', nil);
						if (settings.arrowScrollOnHover) {
							arrowUp.on('mouseover.jsp', getArrowScroll(0, -1, arrowUp));
							arrowDown.on('mouseover.jsp', getArrowScroll(0, 1, arrowDown));
						}

						appendArrows(verticalTrack, settings.verticalArrowPositions, arrowUp, arrowDown);
					}

					verticalTrackHeight = paneHeight;
					container.find('>.jspVerticalBar>.jspCap:visible,>.jspVerticalBar>.jspArrow').each(
						function()
						{
							verticalTrackHeight -= $(this).outerHeight();
						}
					);


					verticalDrag.on(
                                                "mouseenter",
						function()
						{
							verticalDrag.addClass('jspHover');
						}
                                        ).on(
                                                "mouseleave",
						function()
						{
							verticalDrag.removeClass('jspHover');
						}
					).on(
						'mousedown.jsp',
						function(e)
						{
							// Stop IE from allowing text selection
							$('html').on('dragstart.jsp selectstart.jsp', nil);

							verticalDrag.addClass('jspActive');

							var startY = e.pageY - verticalDrag.position().top;

							$('html').on(
								'mousemove.jsp',
								function(e)
								{
									positionDragY(e.pageY - startY, false);
								}
							).on('mouseup.jsp mouseleave.jsp', cancelDrag);
							return false;
						}
					);
					sizeVerticalScrollbar();
				}
			}

			function sizeVerticalScrollbar()
			{
				verticalTrack.height(verticalTrackHeight + 'px');
				verticalDragPosition = 0;
				scrollbarWidth = settings.verticalGutter + verticalTrack.outerWidth();

				// Make the pane thinner to allow for the vertical scrollbar
				pane.width(paneWidth - scrollbarWidth - originalPaddingTotalWidth);

				// Add margin to the left of the pane if scrollbars are on that side (to position
				// the scrollbar on the left or right set it's left or right property in CSS)
				try {
					if (verticalBar.position().left === 0) {
						pane.css('margin-left', scrollbarWidth + 'px');
					}
				} catch (err) {
				}
			}

			function initialiseHorizontalScroll()
			{
				if (isScrollableH) {

					container.append(
						$('<div class="jspHorizontalBar" />').append(
							$('<div class="jspCap jspCapLeft" />'),
							$('<div class="jspTrack" />').append(
								$('<div class="jspDrag" />').append(
									$('<div class="jspDragLeft" />'),
									$('<div class="jspDragRight" />')
								)
							),
							$('<div class="jspCap jspCapRight" />')
						)
					);

					horizontalBar = container.find('>.jspHorizontalBar');
					horizontalTrack = horizontalBar.find('>.jspTrack');
					horizontalDrag = horizontalTrack.find('>.jspDrag');

					if (settings.showArrows) {
						arrowLeft = $('<a class="jspArrow jspArrowLeft" />').on(
							'mousedown.jsp', getArrowScroll(-1, 0)
						).on('click.jsp', nil);
						arrowRight = $('<a class="jspArrow jspArrowRight" />').on(
							'mousedown.jsp', getArrowScroll(1, 0)
						).on('click.jsp', nil);
						if (settings.arrowScrollOnHover) {
							arrowLeft.on('mouseover.jsp', getArrowScroll(-1, 0, arrowLeft));
							arrowRight.on('mouseover.jsp', getArrowScroll(1, 0, arrowRight));
						}
						appendArrows(horizontalTrack, settings.horizontalArrowPositions, arrowLeft, arrowRight);
					}

					horizontalDrag.on(
                                                "mouseenter",
						function()
						{
							horizontalDrag.addClass('jspHover');
						}
                                        ).on(
                                                "mouseleave",
						function()
						{
							horizontalDrag.removeClass('jspHover');
						}
					).on(
						'mousedown.jsp',
						function(e)
						{
							// Stop IE from allowing text selection
							$('html').on('dragstart.jsp selectstart.jsp', nil);

							horizontalDrag.addClass('jspActive');

							var startX = e.pageX - horizontalDrag.position().left;

							$('html').on(
								'mousemove.jsp',
								function(e)
								{
									positionDragX(e.pageX - startX, false);
								}
							).on('mouseup.jsp mouseleave.jsp', cancelDrag);
							return false;
						}
					);
					horizontalTrackWidth = container.innerWidth();
					sizeHorizontalScrollbar();
				}
			}

			function sizeHorizontalScrollbar()
			{
				container.find('>.jspHorizontalBar>.jspCap:visible,>.jspHorizontalBar>.jspArrow').each(
					function()
					{
						horizontalTrackWidth -= $(this).outerWidth();
					}
				);

				horizontalTrack.width(horizontalTrackWidth + 'px');
				horizontalDragPosition = 0;
			}

			function resizeScrollbars()
			{
				if (isScrollableH && isScrollableV) {
					var horizontalTrackHeight = horizontalTrack.outerHeight(),
						verticalTrackWidth = verticalTrack.outerWidth();
					verticalTrackHeight -= horizontalTrackHeight;
					$(horizontalBar).find('>.jspCap:visible,>.jspArrow').each(
						function()
						{
							horizontalTrackWidth += $(this).outerWidth();
						}
					);
					horizontalTrackWidth -= verticalTrackWidth;
					paneHeight -= verticalTrackWidth;
					paneWidth -= horizontalTrackHeight;
					horizontalTrack.parent().append(
						$('<div class="jspCorner" />').css('width', horizontalTrackHeight + 'px')
					);
					sizeVerticalScrollbar();
					sizeHorizontalScrollbar();
				}
				// reflow content
				if (isScrollableH) {
					pane.width((container.outerWidth() - originalPaddingTotalWidth) + 'px');
				}
				contentHeight = pane.outerHeight();
				percentInViewV = contentHeight / paneHeight;

				if (isScrollableH) {
					horizontalDragWidth = Math.ceil(1 / percentInViewH * horizontalTrackWidth);
					if (horizontalDragWidth > settings.horizontalDragMaxWidth) {
						horizontalDragWidth = settings.horizontalDragMaxWidth;
					} else if (horizontalDragWidth < settings.horizontalDragMinWidth) {
						horizontalDragWidth = settings.horizontalDragMinWidth;
					}
					horizontalDrag.css('width', horizontalDragWidth + 'px');
					dragMaxX = horizontalTrackWidth - horizontalDragWidth;
					_positionDragX(horizontalDragPosition); // To update the state for the arrow buttons
				}
				if (isScrollableV) {
					verticalDragHeight = Math.ceil(1 / percentInViewV * verticalTrackHeight);
					if (verticalDragHeight > settings.verticalDragMaxHeight) {
						verticalDragHeight = settings.verticalDragMaxHeight;
					} else if (verticalDragHeight < settings.verticalDragMinHeight) {
						verticalDragHeight = settings.verticalDragMinHeight;
					}
					verticalDrag.css('height', verticalDragHeight + 'px');
					dragMaxY = verticalTrackHeight - verticalDragHeight;
					_positionDragY(verticalDragPosition); // To update the state for the arrow buttons
				}
			}

			function appendArrows(ele, p, a1, a2)
			{
				var p1 = "before", p2 = "after", aTemp;

				// Sniff for mac... Is there a better way to determine whether the arrows would naturally appear
				// at the top or the bottom of the bar?
				if (p == "os") {
					p = /Mac/.test(navigator.platform) ? "after" : "split";
				}
				if (p == p1) {
					p2 = p;
				} else if (p == p2) {
					p1 = p;
					aTemp = a1;
					a1 = a2;
					a2 = aTemp;
				}

				ele[p1](a1)[p2](a2);
			}

			function getArrowScroll(dirX, dirY, ele)
			{
				return function()
				{
					arrowScroll(dirX, dirY, this, ele);
					this.blur();
					return false;
				};
			}

			function arrowScroll(dirX, dirY, arrow, ele)
			{
				arrow = $(arrow).addClass('jspActive');

				var eve,
					scrollTimeout,
					isFirst = true,
					doScroll = function()
					{
						if (dirX !== 0) {
							jsp.scrollByX(dirX * settings.arrowButtonSpeed);
						}
						if (dirY !== 0) {
							jsp.scrollByY(dirY * settings.arrowButtonSpeed);
						}
						scrollTimeout = setTimeout(doScroll, isFirst ? settings.initialDelay : settings.arrowRepeatFreq);
						isFirst = false;
					};

				doScroll();

				eve = ele ? 'mouseout.jsp' : 'mouseup.jsp';
				ele = ele || $('html');
				ele.on(
					eve,
					function()
					{
						arrow.removeClass('jspActive');
						if(scrollTimeout) {
              clearTimeout(scrollTimeout);
            }
						scrollTimeout = null;
						ele.off(eve);
					}
				);
			}

			function initClickOnTrack()
			{
				removeClickOnTrack();
				if (isScrollableV) {
					verticalTrack.on(
						'mousedown.jsp',
						function(e)
						{
							if (e.originalTarget === undefined || e.originalTarget == e.currentTarget) {
								var clickedTrack = $(this),
									offset = clickedTrack.offset(),
									direction = e.pageY - offset.top - verticalDragPosition,
									scrollTimeout,
									isFirst = true,
									doScroll = function()
									{
										var offset = clickedTrack.offset(),
											pos = e.pageY - offset.top - verticalDragHeight / 2,
											contentDragY = paneHeight * settings.scrollPagePercent,
											dragY = dragMaxY * contentDragY / (contentHeight - paneHeight);
										if (direction < 0) {
											if (verticalDragPosition - dragY > pos) {
												jsp.scrollByY(-contentDragY);
											} else {
												positionDragY(pos);
											}
										} else if (direction > 0) {
											if (verticalDragPosition + dragY < pos) {
												jsp.scrollByY(contentDragY);
											} else {
												positionDragY(pos);
											}
										} else {
											cancelClick();
											return;
										}
										scrollTimeout = setTimeout(doScroll, isFirst ? settings.initialDelay : settings.trackClickRepeatFreq);
										isFirst = false;
									},
									cancelClick = function()
									{
										if(scrollTimeout) {
                      clearTimeout(scrollTimeout);
                    }
										scrollTimeout = null;
										$(document).off('mouseup.jsp', cancelClick);
									};
								doScroll();
								$(document).on('mouseup.jsp', cancelClick);
								return false;
							}
						}
					);
				}

				if (isScrollableH) {
					horizontalTrack.on(
						'mousedown.jsp',
						function(e)
						{
							if (e.originalTarget === undefined || e.originalTarget == e.currentTarget) {
								var clickedTrack = $(this),
									offset = clickedTrack.offset(),
									direction = e.pageX - offset.left - horizontalDragPosition,
									scrollTimeout,
									isFirst = true,
									doScroll = function()
									{
										var offset = clickedTrack.offset(),
											pos = e.pageX - offset.left - horizontalDragWidth / 2,
											contentDragX = paneWidth * settings.scrollPagePercent,
											dragX = dragMaxX * contentDragX / (contentWidth - paneWidth);
										if (direction < 0) {
											if (horizontalDragPosition - dragX > pos) {
												jsp.scrollByX(-contentDragX);
											} else {
												positionDragX(pos);
											}
										} else if (direction > 0) {
											if (horizontalDragPosition + dragX < pos) {
												jsp.scrollByX(contentDragX);
											} else {
												positionDragX(pos);
											}
										} else {
											cancelClick();
											return;
										}
										scrollTimeout = setTimeout(doScroll, isFirst ? settings.initialDelay : settings.trackClickRepeatFreq);
										isFirst = false;
									},
									cancelClick = function()
									{
										if(scrollTimeout) {
                      clearTimeout(scrollTimeout);
                    }
										scrollTimeout = null;
										$(document).off('mouseup.jsp', cancelClick);
									};
								doScroll();
								$(document).on('mouseup.jsp', cancelClick);
								return false;
							}
						}
					);
				}
			}

			function removeClickOnTrack()
			{
				if (horizontalTrack) {
					horizontalTrack.off('mousedown.jsp');
				}
				if (verticalTrack) {
					verticalTrack.off('mousedown.jsp');
				}
			}

			function cancelDrag()
			{
				$('html').off('dragstart.jsp selectstart.jsp mousemove.jsp mouseup.jsp mouseleave.jsp');

				if (verticalDrag) {
					verticalDrag.removeClass('jspActive');
				}
				if (horizontalDrag) {
					horizontalDrag.removeClass('jspActive');
				}
			}

			function positionDragY(destY, animate)
			{
				if (!isScrollableV) {
					return;
				}
				if (destY < 0) {
					destY = 0;
				} else if (destY > dragMaxY) {
					destY = dragMaxY;
				}

				// allow for devs to prevent the JSP from being scrolled
				var willScrollYEvent = new $.Event("jsp-will-scroll-y");
				elem.trigger(willScrollYEvent, [destY]);

				if (willScrollYEvent.isDefaultPrevented()) {
					return;
				}

				var tmpVerticalDragPosition = destY || 0;

				var isAtTop = tmpVerticalDragPosition === 0,
					isAtBottom = tmpVerticalDragPosition == dragMaxY,
					percentScrolled = destY/ dragMaxY,
					destTop = -percentScrolled * (contentHeight - paneHeight);

				// can't just check if(animate) because false is a valid value that could be passed in...
				if (animate === undefined) {
					animate = settings.animateScroll;
				}
				if (animate) {
					jsp.animate(verticalDrag, 'top', destY,	_positionDragY, function() {
						elem.trigger('jsp-user-scroll-y', [-destTop, isAtTop, isAtBottom]);
					});
				} else {
					verticalDrag.css('top', destY);
					_positionDragY(destY);
					elem.trigger('jsp-user-scroll-y', [-destTop, isAtTop, isAtBottom]);
				}

			}

			function _positionDragY(destY)
			{
				if (destY === undefined) {
					destY = verticalDrag.position().top;
				}

				container.scrollTop(0);
				verticalDragPosition = destY || 0;

				var isAtTop = verticalDragPosition === 0,
					isAtBottom = verticalDragPosition == dragMaxY,
					percentScrolled = destY/ dragMaxY,
					destTop = -percentScrolled * (contentHeight - paneHeight);

				if (wasAtTop != isAtTop || wasAtBottom != isAtBottom) {
					wasAtTop = isAtTop;
					wasAtBottom = isAtBottom;
					elem.trigger('jsp-arrow-change', [wasAtTop, wasAtBottom, wasAtLeft, wasAtRight]);
				}

				updateVerticalArrows(isAtTop, isAtBottom);
				pane.css('top', destTop);
				elem.trigger('jsp-scroll-y', [-destTop, isAtTop, isAtBottom]).trigger('scroll');
			}

			function positionDragX(destX, animate)
			{
				if (!isScrollableH) {
					return;
				}
				if (destX < 0) {
					destX = 0;
				} else if (destX > dragMaxX) {
					destX = dragMaxX;
				}


				// allow for devs to prevent the JSP from being scrolled
				var willScrollXEvent = new $.Event("jsp-will-scroll-x");
				elem.trigger(willScrollXEvent, [destX]);

				if (willScrollXEvent.isDefaultPrevented()) {
					return;
				}

				var tmpHorizontalDragPosition = destX ||0;

				var isAtLeft = tmpHorizontalDragPosition === 0,
					isAtRight = tmpHorizontalDragPosition == dragMaxX,
					percentScrolled = destX / dragMaxX,
					destLeft = -percentScrolled * (contentWidth - paneWidth);

				if (animate === undefined) {
					animate = settings.animateScroll;
				}
				if (animate) {
					jsp.animate(horizontalDrag, 'left', destX,	_positionDragX, function() {
						elem.trigger('jsp-user-scroll-x', [-destLeft, isAtLeft, isAtRight]);
					});
				} else {
					horizontalDrag.css('left', destX);
					_positionDragX(destX);
					elem.trigger('jsp-user-scroll-x', [-destLeft, isAtLeft, isAtRight]);
				}
			}

			function _positionDragX(destX)
			{
				if (destX === undefined) {
					destX = horizontalDrag.position().left;
				}

				container.scrollTop(0);
				horizontalDragPosition = destX ||0;

				var isAtLeft = horizontalDragPosition === 0,
					isAtRight = horizontalDragPosition == dragMaxX,
					percentScrolled = destX / dragMaxX,
					destLeft = -percentScrolled * (contentWidth - paneWidth);

				if (wasAtLeft != isAtLeft || wasAtRight != isAtRight) {
					wasAtLeft = isAtLeft;
					wasAtRight = isAtRight;
					elem.trigger('jsp-arrow-change', [wasAtTop, wasAtBottom, wasAtLeft, wasAtRight]);
				}

				updateHorizontalArrows(isAtLeft, isAtRight);
				pane.css('left', destLeft);
				elem.trigger('jsp-scroll-x', [-destLeft, isAtLeft, isAtRight]).trigger('scroll');
			}

			function updateVerticalArrows(isAtTop, isAtBottom)
			{
				if (settings.showArrows) {
					arrowUp[isAtTop ? 'addClass' : 'removeClass']('jspDisabled');
					arrowDown[isAtBottom ? 'addClass' : 'removeClass']('jspDisabled');
				}
			}

			function updateHorizontalArrows(isAtLeft, isAtRight)
			{
				if (settings.showArrows) {
					arrowLeft[isAtLeft ? 'addClass' : 'removeClass']('jspDisabled');
					arrowRight[isAtRight ? 'addClass' : 'removeClass']('jspDisabled');
				}
			}

			function scrollToY(destY, animate)
			{
				var percentScrolled = destY / (contentHeight - paneHeight);
				positionDragY(percentScrolled * dragMaxY, animate);
			}

			function scrollToX(destX, animate)
			{
				var percentScrolled = destX / (contentWidth - paneWidth);
				positionDragX(percentScrolled * dragMaxX, animate);
			}

			function scrollToElement(ele, stickToTop, animate)
			{
				var e, eleHeight, eleWidth, eleTop = 0, eleLeft = 0, viewportTop, viewportLeft, maxVisibleEleTop, maxVisibleEleLeft, destY, destX;

				// Legal hash values aren't necessarily legal jQuery selectors so we need to catch any
				// errors from the lookup...
				try {
					e = $(ele);
				} catch (err) {
					return;
				}
				eleHeight = e.outerHeight();
				eleWidth= e.outerWidth();

				container.scrollTop(0);
				container.scrollLeft(0);

				// loop through parents adding the offset top of any elements that are relatively positioned between
				// the focused element and the jspPane so we can get the true distance from the top
				// of the focused element to the top of the scrollpane...
				while (!e.is('.jspPane')) {
					eleTop += e.position().top;
					eleLeft += e.position().left;
					e = e.offsetParent();
					if (/^body|html$/i.test(e[0].nodeName)) {
						// we ended up too high in the document structure. Quit!
						return;
					}
				}

				viewportTop = contentPositionY();
				maxVisibleEleTop = viewportTop + paneHeight;
				if (eleTop < viewportTop || stickToTop) { // element is above viewport
					destY = eleTop - settings.horizontalGutter;
				} else if (eleTop + eleHeight > maxVisibleEleTop) { // element is below viewport
					destY = eleTop - paneHeight + eleHeight + settings.horizontalGutter;
				}
				if (!isNaN(destY)) {
					scrollToY(destY, animate);
				}

				viewportLeft = contentPositionX();
	            maxVisibleEleLeft = viewportLeft + paneWidth;
	            if (eleLeft < viewportLeft || stickToTop) { // element is to the left of viewport
	                destX = eleLeft - settings.horizontalGutter;
	            } else if (eleLeft + eleWidth > maxVisibleEleLeft) { // element is to the right viewport
	                destX = eleLeft - paneWidth + eleWidth + settings.horizontalGutter;
	            }
	            if (!isNaN(destX)) {
	                scrollToX(destX, animate);
	            }

			}

			function contentPositionX()
			{
				return -pane.position().left;
			}

			function contentPositionY()
			{
				return -pane.position().top;
			}

			function isCloseToBottom()
			{
				var scrollableHeight = contentHeight - paneHeight;
				return (scrollableHeight > 20) && (scrollableHeight - contentPositionY() < 10);
			}

			function isCloseToRight()
			{
				var scrollableWidth = contentWidth - paneWidth;
				return (scrollableWidth > 20) && (scrollableWidth - contentPositionX() < 10);
			}

			function initMousewheel()
			{
				container.off(mwEvent).on(
					mwEvent,
					function (event, delta, deltaX, deltaY) {

                        if (!horizontalDragPosition) horizontalDragPosition = 0;
                        if (!verticalDragPosition) verticalDragPosition = 0;

						var dX = horizontalDragPosition, dY = verticalDragPosition, factor = event.deltaFactor || settings.mouseWheelSpeed;
						jsp.scrollBy(deltaX * factor, -deltaY * factor, false);
						// return true if there was no movement so rest of screen can scroll
						return dX == horizontalDragPosition && dY == verticalDragPosition;
					}
				);
			}

			function removeMousewheel()
			{
				container.off(mwEvent);
			}

			function nil()
			{
				return false;
			}

			function initFocusHandler()
			{
				pane.find(':input,a').off('focus.jsp').on(
					'focus.jsp',
					function(e)
					{
						scrollToElement(e.target, false);
					}
				);
			}

			function removeFocusHandler()
			{
				pane.find(':input,a').off('focus.jsp');
			}

			function initKeyboardNav()
			{
				var keyDown, elementHasScrolled, validParents = [];
				if(isScrollableH) {
          validParents.push(horizontalBar[0]);
        }

				if(isScrollableV) {
          validParents.push(verticalBar[0]);
        }

				// IE also focuses elements that don't have tabindex set.
				pane.on(
					'focus.jsp',
					function()
					{
						elem.focus();
					}
				);

				elem.attr('tabindex', 0)
					.off('keydown.jsp keypress.jsp')
					.on(
						'keydown.jsp',
						function(e)
						{
							if (e.target !== this && !(validParents.length && $(e.target).closest(validParents).length)){
								return;
							}
							var dX = horizontalDragPosition, dY = verticalDragPosition;
							switch(e.keyCode) {
								case 40: // down
								case 38: // up
								case 34: // page down
								case 32: // space
								case 33: // page up
								case 39: // right
								case 37: // left
									keyDown = e.keyCode;
									keyDownHandler();
									break;
								case 35: // end
									scrollToY(contentHeight - paneHeight);
									keyDown = null;
									break;
								case 36: // home
									scrollToY(0);
									keyDown = null;
									break;
							}

							elementHasScrolled = e.keyCode == keyDown && dX != horizontalDragPosition || dY != verticalDragPosition;
							return !elementHasScrolled;
						}
					).on(
						'keypress.jsp', // For FF/ OSX so that we can cancel the repeat key presses if the JSP scrolls...
						function(e)
						{
							if (e.keyCode == keyDown) {
								keyDownHandler();
							}
							// If the keypress is not related to the area, ignore it. Fixes problem with inputs inside scrolled area. Copied from line 955.
							if (e.target !== this && !(validParents.length && $(e.target).closest(validParents).length)){
								return;
							}
							return !elementHasScrolled;
						}
					);

				if (settings.hideFocus) {
					elem.css('outline', 'none');
					if ('hideFocus' in container[0]){
						elem.attr('hideFocus', true);
					}
				} else {
					elem.css('outline', '');
					if ('hideFocus' in container[0]){
						elem.attr('hideFocus', false);
					}
				}

				function keyDownHandler()
				{
					var dX = horizontalDragPosition, dY = verticalDragPosition;
					switch(keyDown) {
						case 40: // down
							jsp.scrollByY(settings.keyboardSpeed, false);
							break;
						case 38: // up
							jsp.scrollByY(-settings.keyboardSpeed, false);
							break;
						case 34: // page down
						case 32: // space
							jsp.scrollByY(paneHeight * settings.scrollPagePercent, false);
							break;
						case 33: // page up
							jsp.scrollByY(-paneHeight * settings.scrollPagePercent, false);
							break;
						case 39: // right
							jsp.scrollByX(settings.keyboardSpeed, false);
							break;
						case 37: // left
							jsp.scrollByX(-settings.keyboardSpeed, false);
							break;
					}

					elementHasScrolled = dX != horizontalDragPosition || dY != verticalDragPosition;
					return elementHasScrolled;
				}
			}

			function removeKeyboardNav()
			{
				elem.attr('tabindex', '-1')
					.removeAttr('tabindex')
					.off('keydown.jsp keypress.jsp');

				pane.off('.jsp');
			}

			function observeHash()
			{
				if (location.hash && location.hash.length > 1) {
					var e,
						retryInt,
						hash = escape(location.hash.substr(1)) // hash must be escaped to prevent XSS
						;
					try {
						e = $('#' + hash + ', a[name="' + hash + '"]');
					} catch (err) {
						return;
					}

					if (e.length && pane.find(hash)) {
						// nasty workaround but it appears to take a little while before the hash has done its thing
						// to the rendered page so we just wait until the container's scrollTop has been messed up.
						if (container.scrollTop() === 0) {
							retryInt = setInterval(
								function()
								{
									if (container.scrollTop() > 0) {
										scrollToElement(e, true);
										$(document).scrollTop(container.position().top);
										clearInterval(retryInt);
									}
								},
								50
							);
						} else {
							scrollToElement(e, true);
							$(document).scrollTop(container.position().top);
						}
					}
				}
			}

			function hijackInternalLinks()
			{
				// only register the link handler once
				if ($(document.body).data('jspHijack')) {
					return;
				}

				// remember that the handler was bound
				$(document.body).data('jspHijack', true);

				// use live handler to also capture newly created links
				$(document.body).delegate('a[href*="#"]', 'click', function(event) {
					// does the link point to the same page?
					// this also takes care of cases with a <base>-Tag or Links not starting with the hash #
					// e.g. <a href="index.html#test"> when the current url already is index.html
					var href = this.href.substr(0, this.href.indexOf('#')),
						locationHref = location.href,
						hash,
						element,
						container,
						jsp,
						scrollTop,
						elementTop;
					if (location.href.indexOf('#') !== -1) {
						locationHref = location.href.substr(0, location.href.indexOf('#'));
					}
					if (href !== locationHref) {
						// the link points to another page
						return;
					}

					// check if jScrollPane should handle this click event
					hash = escape(this.href.substr(this.href.indexOf('#') + 1));

					// find the element on the page
					try {
						element = $('#' + hash + ', a[name="' + hash + '"]');
					} catch (e) {
						// hash is not a valid jQuery identifier
						return;
					}

					if (!element.length) {
						// this link does not point to an element on this page
						return;
					}

					container = element.closest('.jspScrollable');
					jsp = container.data('jsp');

					// jsp might be another jsp instance than the one, that bound this event
					// remember: this event is only bound once for all instances.
					jsp.scrollToElement(element, true);

					if (container[0].scrollIntoView) {
						// also scroll to the top of the container (if it is not visible)
						scrollTop = $(window).scrollTop();
						elementTop = element.offset().top;
						if (elementTop < scrollTop || elementTop > scrollTop + $(window).height()) {
							container[0].scrollIntoView();
						}
					}

					// jsp handled this event, prevent the browser default (scrolling :P)
					event.preventDefault();
				});
			}

			// Init touch on iPad, iPhone, iPod, Android
			function initTouch()
			{
				var startX,
					startY,
					touchStartX,
					touchStartY,
					moved,
					moving = false;

				container.off('touchstart.jsp touchmove.jsp touchend.jsp click.jsp-touchclick').on(
					'touchstart.jsp',
					function(e)
					{
						var touch = e.originalEvent.touches[0];
						startX = contentPositionX();
						startY = contentPositionY();
						touchStartX = touch.pageX;
						touchStartY = touch.pageY;
						moved = false;
						moving = true;
					}
				).on(
					'touchmove.jsp',
					function(ev)
					{
						if(!moving) {
							return;
						}

						var touchPos = ev.originalEvent.touches[0],
							dX = horizontalDragPosition, dY = verticalDragPosition;

						jsp.scrollTo(startX + touchStartX - touchPos.pageX, startY + touchStartY - touchPos.pageY);

						moved = moved || Math.abs(touchStartX - touchPos.pageX) > 5 || Math.abs(touchStartY - touchPos.pageY) > 5;

						// return true if there was no movement so rest of screen can scroll
						return dX == horizontalDragPosition && dY == verticalDragPosition;
					}
				).on(
					'touchend.jsp',
					function(e)
					{
						moving = false;
						/*if(moved) {
							return false;
						}*/
					}
				).on(
					'click.jsp-touchclick',
					function(e)
					{
						if(moved) {
							moved = false;
							return false;
						}
					}
				);
			}

			function destroy(){
				var currentY = contentPositionY(),
					currentX = contentPositionX();
				elem.removeClass('jspScrollable').off('.jsp');
				pane.off('.jsp');
				elem.replaceWith(originalElement.append(pane.children()));
				originalElement.scrollTop(currentY);
				originalElement.scrollLeft(currentX);

				// clear reinitialize timer if active
				if (reinitialiseInterval) {
					clearInterval(reinitialiseInterval);
				}
			}

			// Public API
			$.extend(
				jsp,
				{
					// Reinitialises the scroll pane (if it's internal dimensions have changed since the last time it
					// was initialised). The settings object which is passed in will override any settings from the
					// previous time it was initialised - if you don't pass any settings then the ones from the previous
					// initialisation will be used.
					reinitialise: function(s)
					{
						s = $.extend({}, settings, s);
						initialise(s);
					},
					// Scrolls the specified element (a jQuery object, DOM node or jQuery selector string) into view so
					// that it can be seen within the viewport. If stickToTop is true then the element will appear at
					// the top of the viewport, if it is false then the viewport will scroll as little as possible to
					// show the element. You can also specify if you want animation to occur. If you don't provide this
					// argument then the animateScroll value from the settings object is used instead.
					scrollToElement: function(ele, stickToTop, animate)
					{
						scrollToElement(ele, stickToTop, animate);
					},
					// Scrolls the pane so that the specified co-ordinates within the content are at the top left
					// of the viewport. animate is optional and if not passed then the value of animateScroll from
					// the settings object this jScrollPane was initialised with is used.
					scrollTo: function(destX, destY, animate)
					{
						scrollToX(destX, animate);
						scrollToY(destY, animate);
					},
					// Scrolls the pane so that the specified co-ordinate within the content is at the left of the
					// viewport. animate is optional and if not passed then the value of animateScroll from the settings
					// object this jScrollPane was initialised with is used.
					scrollToX: function(destX, animate)
					{
						scrollToX(destX, animate);
					},
					// Scrolls the pane so that the specified co-ordinate within the content is at the top of the
					// viewport. animate is optional and if not passed then the value of animateScroll from the settings
					// object this jScrollPane was initialised with is used.
					scrollToY: function(destY, animate)
					{
						scrollToY(destY, animate);
					},
					// Scrolls the pane to the specified percentage of its maximum horizontal scroll position. animate
					// is optional and if not passed then the value of animateScroll from the settings object this
					// jScrollPane was initialised with is used.
					scrollToPercentX: function(destPercentX, animate)
					{
						scrollToX(destPercentX * (contentWidth - paneWidth), animate);
					},
					// Scrolls the pane to the specified percentage of its maximum vertical scroll position. animate
					// is optional and if not passed then the value of animateScroll from the settings object this
					// jScrollPane was initialised with is used.
					scrollToPercentY: function(destPercentY, animate)
					{
						scrollToY(destPercentY * (contentHeight - paneHeight), animate);
					},
					// Scrolls the pane by the specified amount of pixels. animate is optional and if not passed then
					// the value of animateScroll from the settings object this jScrollPane was initialised with is used.
					scrollBy: function(deltaX, deltaY, animate)
					{
						jsp.scrollByX(deltaX, animate);
						jsp.scrollByY(deltaY, animate);
					},
					// Scrolls the pane by the specified amount of pixels. animate is optional and if not passed then
					// the value of animateScroll from the settings object this jScrollPane was initialised with is used.
					scrollByX: function(deltaX, animate)
					{
						var destX = contentPositionX() + Math[deltaX<0 ? 'floor' : 'ceil'](deltaX),
							percentScrolled = destX / (contentWidth - paneWidth);
						positionDragX(percentScrolled * dragMaxX, animate);
					},
					// Scrolls the pane by the specified amount of pixels. animate is optional and if not passed then
					// the value of animateScroll from the settings object this jScrollPane was initialised with is used.
					scrollByY: function(deltaY, animate)
					{
						var destY = contentPositionY() + Math[deltaY<0 ? 'floor' : 'ceil'](deltaY),
							percentScrolled = destY / (contentHeight - paneHeight);
						positionDragY(percentScrolled * dragMaxY, animate);
					},
					// Positions the horizontal drag at the specified x position (and updates the viewport to reflect
					// this). animate is optional and if not passed then the value of animateScroll from the settings
					// object this jScrollPane was initialised with is used.
					positionDragX: function(x, animate)
					{
						positionDragX(x, animate);
					},
					// Positions the vertical drag at the specified y position (and updates the viewport to reflect
					// this). animate is optional and if not passed then the value of animateScroll from the settings
					// object this jScrollPane was initialised with is used.
					positionDragY: function(y, animate)
					{
						positionDragY(y, animate);
					},
					// This method is called when jScrollPane is trying to animate to a new position. You can override
					// it if you want to provide advanced animation functionality. It is passed the following arguments:
					//  * ele          - the element whose position is being animated
					//  * prop         - the property that is being animated
					//  * value        - the value it's being animated to
					//  * stepCallback - a function that you must execute each time you update the value of the property
					//  * completeCallback - a function that will be executed after the animation had finished
					// You can use the default implementation (below) as a starting point for your own implementation.
					animate: function(ele, prop, value, stepCallback, completeCallback)
					{
						var params = {};
						params[prop] = value;
						ele.animate(
							params,
							{
								'duration'	: settings.animateDuration,
								'easing'	: settings.animateEase,
								'queue'		: false,
								'step'		: stepCallback,
								'complete'	: completeCallback
							}
						);
					},
					// Returns the current x position of the viewport with regards to the content pane.
					getContentPositionX: function()
					{
						return contentPositionX();
					},
					// Returns the current y position of the viewport with regards to the content pane.
					getContentPositionY: function()
					{
						return contentPositionY();
					},
					// Returns the width of the content within the scroll pane.
					getContentWidth: function()
					{
						return contentWidth;
					},
					// Returns the height of the content within the scroll pane.
					getContentHeight: function()
					{
						return contentHeight;
					},
					// Returns the horizontal position of the viewport within the pane content.
					getPercentScrolledX: function()
					{
						return contentPositionX() / (contentWidth - paneWidth);
					},
					// Returns the vertical position of the viewport within the pane content.
					getPercentScrolledY: function()
					{
						return contentPositionY() / (contentHeight - paneHeight);
					},
					// Returns whether or not this scrollpane has a horizontal scrollbar.
					getIsScrollableH: function()
					{
						return isScrollableH;
					},
					// Returns whether or not this scrollpane has a vertical scrollbar.
					getIsScrollableV: function()
					{
						return isScrollableV;
					},
					// Gets a reference to the content pane. It is important that you use this method if you want to
					// edit the content of your jScrollPane as if you access the element directly then you may have some
					// problems (as your original element has had additional elements for the scrollbars etc added into
					// it).
					getContentPane: function()
					{
						return pane;
					},
					// Scrolls this jScrollPane down as far as it can currently scroll. If animate isn't passed then the
					// animateScroll value from settings is used instead.
					scrollToBottom: function(animate)
					{
						positionDragY(dragMaxY, animate);
					},
					// Hijacks the links on the page which link to content inside the scrollpane. If you have changed
					// the content of your page (e.g. via AJAX) and want to make sure any new anchor links to the
					// contents of your scroll pane will work then call this function.
					hijackInternalLinks: $.noop,
					// Removes the jScrollPane and returns the page to the state it was in before jScrollPane was
					// initialised.
					destroy: function()
					{
							destroy();
					}
				}
			);

			initialise(s);
		}

		// Pluginifying code...
		settings = $.extend({}, $.fn.jScrollPane.defaults, settings);

		// Apply default speed
		$.each(['arrowButtonSpeed', 'trackClickSpeed', 'keyboardSpeed'], function() {
			settings[this] = settings[this] || settings.speed;
		});

		return this.each(
			function()
			{
				var elem = $(this), jspApi = elem.data('jsp');
				if (jspApi) {
					jspApi.reinitialise(settings);
				} else {
					$("script",elem).filter('[type="text/javascript"],:not([type])').remove();
					jspApi = new JScrollPane(elem, settings);
					elem.data('jsp', jspApi);
				}
			}
		);
	};

	$.fn.jScrollPane.defaults = {
		showArrows					: false,
		maintainPosition			: true,
		stickToBottom				: false,
		stickToRight				: false,
		clickOnTrack				: true,
		autoReinitialise			: false,
		autoReinitialiseDelay		: 500,
		verticalDragMinHeight		: 0,
		verticalDragMaxHeight		: 99999,
		horizontalDragMinWidth		: 0,
		horizontalDragMaxWidth		: 99999,
		contentWidth				: undefined,
		animateScroll				: false,
		animateDuration				: 300,
		animateEase					: 'linear',
		hijackInternalLinks			: false,
		verticalGutter				: 4,
		horizontalGutter			: 4,
		mouseWheelSpeed				: 3,
		arrowButtonSpeed			: 0,
		arrowRepeatFreq				: 50,
		arrowScrollOnHover			: false,
		trackClickSpeed				: 0,
		trackClickRepeatFreq		: 70,
		verticalArrowPositions		: 'split',
		horizontalArrowPositions	: 'split',
		enableKeyboardNavigation	: true,
		hideFocus					: false,
		keyboardSpeed				: 0,
		initialDelay                : 300,        // Delay before starting repeating
		speed						: 30,		// Default speed when others falsey
		scrollPagePercent			: 0.8,		// Percent of visible area scrolled when pageUp/Down or track area pressed
		alwaysShowVScroll			: false,
		alwaysShowHScroll			: false,
		resizeSensor				: false,
		resizeSensorDelay			: 0,
	};

}));

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJqcXVlcnkuanNjcm9sbHBhbmUuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLyohXHJcbiAqIGpTY3JvbGxQYW5lIC0gdjIuMi4xIC0gMjAxOC0wOS0yN1xyXG4gKiBodHRwOi8vanNjcm9sbHBhbmUua2VsdmlubHVjay5jb20vXHJcbiAqXHJcbiAqIENvcHlyaWdodCAoYykgMjAxNCBLZWx2aW4gTHVja1xyXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTctMjAxOCBUdXVra2EgUGFzYW5lblxyXG4gKiBEdWFsIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgb3IgR1BMIGxpY2Vuc2VzLlxyXG4gKi9cclxuXHJcbi8vIFNjcmlwdDogalNjcm9sbFBhbmUgLSBjcm9zcyBicm93c2VyIGN1c3RvbWlzYWJsZSBzY3JvbGxiYXJzXHJcbi8vXHJcbi8vICpWZXJzaW9uOiAyLjIuMSwgTGFzdCB1cGRhdGVkOiAyMDE4LTA5LTI3KlxyXG4vL1xyXG4vLyBQcm9qZWN0IEhvbWUgLSBodHRwOi8vanNjcm9sbHBhbmUua2VsdmlubHVjay5jb20vXHJcbi8vIEdpdEh1YiAgICAgICAtIGh0dHA6Ly9naXRodWIuY29tL3ZpdGNoL2pTY3JvbGxQYW5lXHJcbi8vIENORCAgICAgICAgICAtIGh0dHBzOi8vY2RuanMuY29tL2xpYnJhcmllcy9qU2Nyb2xsUGFuZVxyXG4vLyBTb3VyY2UgICAgICAgLSBodHRwczovL2NkbmpzLmNsb3VkZmxhcmUuY29tL2FqYXgvbGlicy9qU2Nyb2xsUGFuZS8yLjIuMS9zY3JpcHQvanF1ZXJ5LmpzY3JvbGxwYW5lLm1pbi5qc1xyXG4vLyAoTWluaWZpZWQpICAgLSBodHRwczovL2NkbmpzLmNsb3VkZmxhcmUuY29tL2FqYXgvbGlicy9qU2Nyb2xsUGFuZS8yLjIuMS9zY3JpcHQvanF1ZXJ5LmpzY3JvbGxwYW5lLmpzXHJcbi8vIENTUyAgICAgICAgICAtIGh0dHBzOi8vY2RuanMuY2xvdWRmbGFyZS5jb20vYWpheC9saWJzL2pTY3JvbGxQYW5lLzIuMi4xL3N0eWxlL2pxdWVyeS5qc2Nyb2xscGFuZS5jc3NcclxuLy8gKE1pbmlmaWVkKSAgIC0gaHR0cHM6Ly9jZG5qcy5jbG91ZGZsYXJlLmNvbS9hamF4L2xpYnMvalNjcm9sbFBhbmUvMi4yLjEvc3R5bGUvanF1ZXJ5LmpzY3JvbGxwYW5lLm1pbi5jc3NcclxuLy9cclxuLy8gQWJvdXQ6IExpY2Vuc2VcclxuLy9cclxuLy8gQ29weXJpZ2h0IChjKSAyMDE3IEtlbHZpbiBMdWNrXHJcbi8vIENvcHlyaWdodCAoYykgMjAxNy0yMDE4IFR1dWtrYSBQYXNhbmVuXHJcbi8vIER1YWwgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBvciBHUEwgVmVyc2lvbiAyIGxpY2Vuc2VzLlxyXG4vLyBodHRwOi8vanNjcm9sbHBhbmUua2VsdmlubHVjay5jb20vTUlULUxJQ0VOU0UudHh0XHJcbi8vIGh0dHA6Ly9qc2Nyb2xscGFuZS5rZWx2aW5sdWNrLmNvbS9HUEwtTElDRU5TRS50eHRcclxuLy9cclxuLy8gQWJvdXQ6IEV4YW1wbGVzXHJcbi8vXHJcbi8vIEFsbCBleGFtcGxlcyBhbmQgZGVtb3MgYXJlIGF2YWlsYWJsZSB0aHJvdWdoIHRoZSBqU2Nyb2xsUGFuZSBleGFtcGxlIHNpdGUgYXQ6XHJcbi8vIGh0dHA6Ly9qc2Nyb2xscGFuZS5rZWx2aW5sdWNrLmNvbS9cclxuLy9cclxuLy8gQWJvdXQ6IFN1cHBvcnQgYW5kIFRlc3RpbmdcclxuLy9cclxuLy8gVGhpcyBwbHVnaW4gaXMgdGVzdGVkIG9uIHRoZSBicm93c2VycyBiZWxvdyBhbmQgaGFzIGJlZW4gZm91bmQgdG8gd29yayByZWxpYWJseSBvbiB0aGVtLiBJZiB5b3UgcnVuXHJcbi8vIGludG8gYSBwcm9ibGVtIG9uIG9uZSBvZiB0aGUgc3VwcG9ydGVkIGJyb3dzZXJzIHRoZW4gcGxlYXNlIHZpc2l0IHRoZSBzdXBwb3J0IHNlY3Rpb24gb24gdGhlIGpTY3JvbGxQYW5lXHJcbi8vIHdlYnNpdGUgKGh0dHA6Ly9qc2Nyb2xscGFuZS5rZWx2aW5sdWNrLmNvbS8pIGZvciBtb3JlIGluZm9ybWF0aW9uIG9uIGdldHRpbmcgc3VwcG9ydC4gWW91IGFyZSBhbHNvXHJcbi8vIHdlbGNvbWUgdG8gZm9yayB0aGUgcHJvamVjdCBvbiBHaXRIdWIgaWYgeW91IGNhbiBjb250cmlidXRlIGEgZml4IGZvciBhIGdpdmVuIGlzc3VlLlxyXG4vL1xyXG4vLyBqUXVlcnkgVmVyc2lvbnMgLSBqUXVlcnkgMy54LiBBbHRob3VnaCBzY3JpcHQgc2hvdWxkIHdvcmsgZnJvbSBqUXVlcnkgMS4xIGFuZCB1cCBidXQgbm8gcHJvbWlzZXMgYXJlIG1hZGUuXHJcbi8vIEJyb3dzZXJzIFRlc3RlZCAtIFNlZSBqUXVlcnkgYnJvd3NlciBzdXBwb3J0IHBhZ2U6IGh0dHBzOi8vanF1ZXJ5LmNvbS9icm93c2VyLXN1cHBvcnQvLiBPbmx5IG1vZGVyblxyXG4vLyAgICAgICAgICAgICAgICAgICBicm93c2VycyBhcmUgc3VwcG9ydGVkLlxyXG4vL1xyXG4vLyBBYm91dDogUmVsZWFzZSBIaXN0b3J5XHJcbi8vXHJcbi8vIDIuMi4xICAgICAgIC0gKDIwMTgtMDktMjcpIE5vIGNoYW5nZWQgYXBwbGllZCB0byByZWxlYXNlIHNvIHNhbWUgYXMgUkMxLzJcclxuLy8gMi4yLjEtcmMuMiAgLSAoMjAxOC0wNi0xNCkgU3Vja2VkIE5QTSByZWxlYXNlIGhhdmUgdG8gbWFrZSBuZXcgUmVsZWFzZS4uIHRoaXMgaXMgMjAxOCFcclxuLy8gMi4yLjEtcmMuMSAgLSAoMjAxOC0wNi0xNCkgRml4ZWQgQ1NTTGludCB3YXJuaW5ncyB3aGljaCBjYW4gbGVhZCBDU1MgcHJvYmxlbXMgaW5cclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvZHVjdGlvbiEgUGxlYXNlIHJlcG9ydCBhIGlzc3VlIGlmIHRoaXMgYnJlYWtzIHNvbWV0aGluZyFcclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgKiBNZXJnZWQ6XHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgIC0gIzM2MCBSZWdpc3RlciB0byBnbG9iYWxseSBhdmFpbGFibGUgdmVyc2lvbiBvZiBqUXVlcnlcclxuLy8gMi4yLjAgICAgICAgLSAoMjAxOC0wNS0xNikgTm8gY2hhbmdlcyB0byBSQzFcclxuLy8gMi4yLjAtcmMuMSAgLSAoMjAxOC0wNC0yOCkgTWVyZ2VkIHJlc2l6ZSBzZW5zb3IgdG8gZmluZCBvdXQgc2l6ZSBjaGFuZ2VzIG9mIHNjcmVlbiBhbmRcclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWdhaW4gbGl0dGxlIGJpdCB0dW5lZCB0aGlzIHRvIHN1cHBvcnQgbW9yZSBucG0gZ29vZGllcy5cclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgKiBNZXJnZWQ6XHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgIC0gIzM2MSBFdmVudCBiYXNlZCByZWluaXRpYWxpc2luZyAtIFJlc2l6ZSBTZW5zb3JcclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgLSAjMzU5IFVzZSBucG0gc2NyaXB0cyBhbmQgbG9jYWwgZGV2IGRlcGVuZGVuY2llcyB0byBidWlsZCB0aGUgcHJvamVjdFxyXG4vLyAyLjEuMyAgICAgICAtICgyMDE4LTA0LTA0KSBObyBjaGFuZ2VzIGZyb20gUmVsZWFzZSBDYW5kaWRhdGUgMiBzbyBtYWtpbmcgcmVsZWFzZVxyXG4vLyAyLjEuMy1yYy4yICAtICgyMDE4LTAzLTEzKSBOb3cgdXNpbmcgJ3NjcmlwdC9qcXVlcnkuanNjcm9sbHBhbmUubWluLmpzJyBtYWluXHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluIHBhY2thZ2UuanNvbiByYXRoZXIgdGhhbiAnR3J1bnRmaWxlLmpzJ1xyXG4vLyAyLjEuMy1yYy4xICAtICgyMDE4LTAzLTA1KSBNb3ZpbmcgR3J1bnRmaWxlLmpzIHRvIHJvb3QgYW5kIGV4YW1wbGUgSFRNTFxyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICB0byBzdWJkaXJlY3RvcnkgZXhhbXBsZXNcclxuLy8gMi4xLjIgICAgICAgLSAoMjAxOC0wMi0xNikgSnVzdCBvbiBjb25zb2xlLmxvZyByZW1vdmUgYW5kIFJlbGVhc2UhXHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgIFRoaXMgdmVyc2lvbiBzaG91bGQgcGxheSBuaWNlbHkgd2l0aCBOUE1cclxuLy8gMi4xLjItcmMuMiAgLSAoMjAxOC0wMi0wMykgVXBkYXRlIHBhY2thZ2UuanNvbiBtYWluLXRhZ1xyXG4vLyAyLjEuMi1yYy4xICAtICgyMDE4LTAxLTE4KSBSZWxlYXNlIG9uIE5QTS5cclxuLy8gMi4xLjEgICAgICAgLSAoMjAxOC0wMS0xMikgQXMgZXZlcnlvbmUgc3RheXMgc2lsZW50IHRoZW4gd2UganVzdCByZWxlYXNlISBObyBjaGFuZ2VzIGZyb20gUkMuMVxyXG4vLyAyLjEuMS1yYy4xICAtICgyMDE3LTEyLTIzKSBTdGFydGVkIHRvIHNsb3dseSBtZXJnZSBzdHVmZiAoSE8gSE8gSE8gTWVycnkgQ2hyaXN0bWFzISlcclxuLy8gICAgICAgICAgICAgKiBNZXJnZWRcclxuLy8gICAgICAgICAgICAgLSAjMzQ5IC0gU2Nyb2xsUGFuZSByZWluaXRpYWxpemF0aW9uIHNob3VsZCBhZGFwdCB0byBjaGFuZ2VkIGNvbnRhaW5lciBzaXplXHJcbi8vICAgICAgICAgICAgIC0gIzMzNSBTZXQgZHJhZyBiYXIgd2lkdGgvaGVpZ2h0IHdpdGggLmNzcyBpbnN0ZWFkIG9mIC53aWR0aC8uaGVpZ2h0XHJcbi8vICAgICAgICAgICAgIC0gIzI5NyBhZGRlZCB0d28gc2V0dGluZ3M6IGFsd2F5cyBzaG93IEhTY3JvbGwgYW5kIFZTY3JvbGxcclxuLy8gICAgICAgICAgICAgKiBCdWdzXHJcbi8vICAgICAgICAgICAgIC0gIzggTWFrZSBpdCBwb3NzaWJsZSB0byB0ZWxsIGEgc2Nyb2xsYmFyIHRvIGJlIFwiYWx3YXlzIG9uXCJcclxuLy8gMi4xLjAgIC0gKDIwMTctMTItMTYpIFVwZGF0ZSBqUXVlcnkgdG8gdmVyc2lvbiAzLnhcclxuXHJcbihmdW5jdGlvbiAoZmFjdG9yeSkge1xyXG4gIGlmICggdHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kICkge1xyXG4gICAgICAvLyBBTUQuIFJlZ2lzdGVyIGFzIGFuIGFub255bW91cyBtb2R1bGUuXHJcbiAgICAgIGRlZmluZShbJ2pxdWVyeSddLCBmYWN0b3J5KTtcclxuICB9IGVsc2UgaWYgKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jykge1xyXG4gICAgICAvLyBOb2RlL0NvbW1vbkpTIHN0eWxlIGZvciBCcm93c2VyaWZ5XHJcbiAgICAgIG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeShqUXVlcnkgfHwgcmVxdWlyZSgnanF1ZXJ5JykpO1xyXG4gIH0gZWxzZSB7XHJcbiAgICAgIC8vIEJyb3dzZXIgZ2xvYmFsc1xyXG4gICAgICBmYWN0b3J5KGpRdWVyeSk7XHJcbiAgfVxyXG59KGZ1bmN0aW9uKCQpe1xyXG5cclxuXHQkLmZuLmpTY3JvbGxQYW5lID0gZnVuY3Rpb24oc2V0dGluZ3MpXHJcblx0e1xyXG5cdFx0Ly8gSlNjcm9sbFBhbmUgXCJjbGFzc1wiIC0gcHVibGljIG1ldGhvZHMgYXJlIGF2YWlsYWJsZSB0aHJvdWdoICQoJ3NlbGVjdG9yJykuZGF0YSgnanNwJylcclxuXHRcdGZ1bmN0aW9uIEpTY3JvbGxQYW5lKGVsZW0sIHMpXHJcblx0XHR7XHJcblx0XHRcdHZhciBzZXR0aW5ncywganNwID0gdGhpcywgcGFuZSwgcGFuZVdpZHRoLCBwYW5lSGVpZ2h0LCBjb250YWluZXIsIGNvbnRlbnRXaWR0aCwgY29udGVudEhlaWdodCxcclxuXHRcdFx0XHRwZXJjZW50SW5WaWV3SCwgcGVyY2VudEluVmlld1YsIGlzU2Nyb2xsYWJsZVYsIGlzU2Nyb2xsYWJsZUgsIHZlcnRpY2FsRHJhZywgZHJhZ01heFksXHJcblx0XHRcdFx0dmVydGljYWxEcmFnUG9zaXRpb24sIGhvcml6b250YWxEcmFnLCBkcmFnTWF4WCwgaG9yaXpvbnRhbERyYWdQb3NpdGlvbixcclxuXHRcdFx0XHR2ZXJ0aWNhbEJhciwgdmVydGljYWxUcmFjaywgc2Nyb2xsYmFyV2lkdGgsIHZlcnRpY2FsVHJhY2tIZWlnaHQsIHZlcnRpY2FsRHJhZ0hlaWdodCwgYXJyb3dVcCwgYXJyb3dEb3duLFxyXG5cdFx0XHRcdGhvcml6b250YWxCYXIsIGhvcml6b250YWxUcmFjaywgaG9yaXpvbnRhbFRyYWNrV2lkdGgsIGhvcml6b250YWxEcmFnV2lkdGgsIGFycm93TGVmdCwgYXJyb3dSaWdodCxcclxuXHRcdFx0XHRyZWluaXRpYWxpc2VJbnRlcnZhbCwgb3JpZ2luYWxQYWRkaW5nLCBvcmlnaW5hbFBhZGRpbmdUb3RhbFdpZHRoLCBwcmV2aW91c0NvbnRlbnRXaWR0aCxcclxuXHRcdFx0XHR3YXNBdFRvcCA9IHRydWUsIHdhc0F0TGVmdCA9IHRydWUsIHdhc0F0Qm90dG9tID0gZmFsc2UsIHdhc0F0UmlnaHQgPSBmYWxzZSxcclxuXHRcdFx0XHRvcmlnaW5hbEVsZW1lbnQgPSBlbGVtLmNsb25lKGZhbHNlLCBmYWxzZSkuZW1wdHkoKSwgcmVzaXplRXZlbnRzQWRkZWQgPSBmYWxzZSxcclxuXHRcdFx0XHRtd0V2ZW50ID0gJC5mbi5td2hlZWxJbnRlbnQgPyAnbXdoZWVsSW50ZW50LmpzcCcgOiAnbW91c2V3aGVlbC5qc3AnO1xyXG5cclxuXHRcdFx0dmFyIHJlaW5pdGlhbGlzZUZuID0gZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0Ly8gaWYgc2l6ZSBoYXMgY2hhbmdlZCB0aGVuIHJlaW5pdGlhbGlzZVxyXG5cdFx0XHRcdGlmIChzZXR0aW5ncy5yZXNpemVTZW5zb3JEZWxheSA+IDApIHtcclxuXHRcdFx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0XHRcdGluaXRpYWxpc2Uoc2V0dGluZ3MpO1xyXG5cdFx0XHRcdFx0fSwgc2V0dGluZ3MucmVzaXplU2Vuc29yRGVsYXkpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRcdGluaXRpYWxpc2Uoc2V0dGluZ3MpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fTtcclxuXHJcblx0XHRcdGlmIChlbGVtLmNzcygnYm94LXNpemluZycpID09PSAnYm9yZGVyLWJveCcpIHtcclxuXHRcdFx0XHRvcmlnaW5hbFBhZGRpbmcgPSAwO1xyXG5cdFx0XHRcdG9yaWdpbmFsUGFkZGluZ1RvdGFsV2lkdGggPSAwO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdG9yaWdpbmFsUGFkZGluZyA9IGVsZW0uY3NzKCdwYWRkaW5nVG9wJykgKyAnICcgK1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRlbGVtLmNzcygncGFkZGluZ1JpZ2h0JykgKyAnICcgK1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRlbGVtLmNzcygncGFkZGluZ0JvdHRvbScpICsgJyAnICtcclxuXHRcdFx0XHRcdFx0XHRcdFx0ZWxlbS5jc3MoJ3BhZGRpbmdMZWZ0Jyk7XHJcblx0XHRcdFx0b3JpZ2luYWxQYWRkaW5nVG90YWxXaWR0aCA9IChwYXJzZUludChlbGVtLmNzcygncGFkZGluZ0xlZnQnKSwgMTApIHx8IDApICtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdChwYXJzZUludChlbGVtLmNzcygncGFkZGluZ1JpZ2h0JyksIDEwKSB8fCAwKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0ZnVuY3Rpb24gaW5pdGlhbGlzZShzKVxyXG5cdFx0XHR7XHJcblxyXG5cdFx0XHRcdHZhciAvKmZpcnN0Q2hpbGQsIGxhc3RDaGlsZCwgKi9pc01haW50YWluaW5nUG9zaXRvbiwgbGFzdENvbnRlbnRYLCBsYXN0Q29udGVudFksXHJcblx0XHRcdFx0XHRcdGhhc0NvbnRhaW5pbmdTcGFjZUNoYW5nZWQsIG9yaWdpbmFsU2Nyb2xsVG9wLCBvcmlnaW5hbFNjcm9sbExlZnQsXHJcblx0XHRcdFx0XHRcdG5ld1BhbmVXaWR0aCwgbmV3UGFuZUhlaWdodCwgbWFpbnRhaW5BdEJvdHRvbSA9IGZhbHNlLCBtYWludGFpbkF0UmlnaHQgPSBmYWxzZTtcclxuXHJcblx0XHRcdFx0c2V0dGluZ3MgPSBzO1xyXG5cclxuXHRcdFx0XHRpZiAocGFuZSA9PT0gdW5kZWZpbmVkKSB7XHJcblx0XHRcdFx0XHRvcmlnaW5hbFNjcm9sbFRvcCA9IGVsZW0uc2Nyb2xsVG9wKCk7XHJcblx0XHRcdFx0XHRvcmlnaW5hbFNjcm9sbExlZnQgPSBlbGVtLnNjcm9sbExlZnQoKTtcclxuXHJcblx0XHRcdFx0XHRlbGVtLmNzcyhcclxuXHRcdFx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0XHRcdG92ZXJmbG93OiAnaGlkZGVuJyxcclxuXHRcdFx0XHRcdFx0XHRwYWRkaW5nOiAwXHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdCk7XHJcblx0XHRcdFx0XHQvLyBUT0RPOiBEZWFsIHdpdGggd2hlcmUgd2lkdGgvIGhlaWdodCBpcyAwIGFzIGl0IHByb2JhYmx5IG1lYW5zIHRoZSBlbGVtZW50IGlzIGhpZGRlbiBhbmQgd2Ugc2hvdWxkXHJcblx0XHRcdFx0XHQvLyBjb21lIGJhY2sgdG8gaXQgbGF0ZXIgYW5kIGNoZWNrIG9uY2UgaXQgaXMgdW5oaWRkZW4uLi5cclxuXHRcdFx0XHRcdHBhbmVXaWR0aCA9IGVsZW0uaW5uZXJXaWR0aCgpICsgb3JpZ2luYWxQYWRkaW5nVG90YWxXaWR0aDtcclxuXHRcdFx0XHRcdHBhbmVIZWlnaHQgPSBlbGVtLmlubmVySGVpZ2h0KCk7XHJcblxyXG5cdFx0XHRcdFx0ZWxlbS53aWR0aChwYW5lV2lkdGgpO1xyXG5cclxuXHRcdFx0XHRcdHBhbmUgPSAkKCc8ZGl2IGNsYXNzPVwianNwUGFuZVwiIC8+JykuY3NzKCdwYWRkaW5nJywgb3JpZ2luYWxQYWRkaW5nKS5hcHBlbmQoZWxlbS5jaGlsZHJlbigpKTtcclxuXHRcdFx0XHRcdGNvbnRhaW5lciA9ICQoJzxkaXYgY2xhc3M9XCJqc3BDb250YWluZXJcIiAvPicpXHJcblx0XHRcdFx0XHRcdC5jc3Moe1xyXG5cdFx0XHRcdFx0XHRcdCd3aWR0aCc6IHBhbmVXaWR0aCArICdweCcsXHJcblx0XHRcdFx0XHRcdFx0J2hlaWdodCc6IHBhbmVIZWlnaHQgKyAncHgnXHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdCkuYXBwZW5kKHBhbmUpLmFwcGVuZFRvKGVsZW0pO1xyXG5cclxuXHRcdFx0XHRcdC8qXHJcblx0XHRcdFx0XHQvLyBNb3ZlIGFueSBtYXJnaW5zIGZyb20gdGhlIGZpcnN0IGFuZCBsYXN0IGNoaWxkcmVuIHVwIHRvIHRoZSBjb250YWluZXIgc28gdGhleSBjYW4gc3RpbGxcclxuXHRcdFx0XHRcdC8vIGNvbGxhcHNlIHdpdGggbmVpZ2hib3VyaW5nIGVsZW1lbnRzIGFzIHRoZXkgd291bGQgYmVmb3JlIGpTY3JvbGxQYW5lXHJcblx0XHRcdFx0XHRmaXJzdENoaWxkID0gcGFuZS5maW5kKCc6Zmlyc3QtY2hpbGQnKTtcclxuXHRcdFx0XHRcdGxhc3RDaGlsZCA9IHBhbmUuZmluZCgnOmxhc3QtY2hpbGQnKTtcclxuXHRcdFx0XHRcdGVsZW0uY3NzKFxyXG5cdFx0XHRcdFx0XHR7XHJcblx0XHRcdFx0XHRcdFx0J21hcmdpbi10b3AnOiBmaXJzdENoaWxkLmNzcygnbWFyZ2luLXRvcCcpLFxyXG5cdFx0XHRcdFx0XHRcdCdtYXJnaW4tYm90dG9tJzogbGFzdENoaWxkLmNzcygnbWFyZ2luLWJvdHRvbScpXHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdCk7XHJcblx0XHRcdFx0XHRmaXJzdENoaWxkLmNzcygnbWFyZ2luLXRvcCcsIDApO1xyXG5cdFx0XHRcdFx0bGFzdENoaWxkLmNzcygnbWFyZ2luLWJvdHRvbScsIDApO1xyXG5cdFx0XHRcdFx0Ki9cclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0ZWxlbS5jc3MoJ3dpZHRoJywgJycpO1xyXG5cclxuXHRcdFx0XHRcdC8vIFRvIG1lYXN1cmUgdGhlIHJlcXVpcmVkIGRpbWVuc2lvbnMgYWNjdXJhdGVseSwgdGVtcG9yYXJpbHkgb3ZlcnJpZGUgdGhlIENTUyBwb3NpdGlvbmluZ1xyXG5cdFx0XHRcdFx0Ly8gb2YgdGhlIGNvbnRhaW5lciBhbmQgcGFuZS5cclxuXHRcdFx0XHRcdGNvbnRhaW5lci5jc3Moe3dpZHRoOiAnYXV0bycsIGhlaWdodDogJ2F1dG8nfSk7XHJcblx0XHRcdFx0XHRwYW5lLmNzcygncG9zaXRpb24nLCAnc3RhdGljJyk7XHJcblxyXG5cdFx0XHRcdFx0bmV3UGFuZVdpZHRoID0gZWxlbS5pbm5lcldpZHRoKCkgKyBvcmlnaW5hbFBhZGRpbmdUb3RhbFdpZHRoO1xyXG5cdFx0XHRcdFx0bmV3UGFuZUhlaWdodCA9IGVsZW0uaW5uZXJIZWlnaHQoKTtcclxuXHRcdFx0XHRcdHBhbmUuY3NzKCdwb3NpdGlvbicsICdhYnNvbHV0ZScpO1xyXG5cclxuXHRcdFx0XHRcdG1haW50YWluQXRCb3R0b20gPSBzZXR0aW5ncy5zdGlja1RvQm90dG9tICYmIGlzQ2xvc2VUb0JvdHRvbSgpO1xyXG5cdFx0XHRcdFx0bWFpbnRhaW5BdFJpZ2h0ICA9IHNldHRpbmdzLnN0aWNrVG9SaWdodCAgJiYgaXNDbG9zZVRvUmlnaHQoKTtcclxuXHJcblx0XHRcdFx0XHRoYXNDb250YWluaW5nU3BhY2VDaGFuZ2VkID0gbmV3UGFuZVdpZHRoICE9PSBwYW5lV2lkdGggfHwgbmV3UGFuZUhlaWdodCAhPT0gcGFuZUhlaWdodDtcclxuXHJcblx0XHRcdFx0XHRwYW5lV2lkdGggPSBuZXdQYW5lV2lkdGg7XHJcblx0XHRcdFx0XHRwYW5lSGVpZ2h0ID0gbmV3UGFuZUhlaWdodDtcclxuXHRcdFx0XHRcdGNvbnRhaW5lci5jc3Moe3dpZHRoOiBwYW5lV2lkdGgsIGhlaWdodDogcGFuZUhlaWdodH0pO1xyXG5cclxuXHRcdFx0XHRcdC8vIElmIG5vdGhpbmcgY2hhbmdlZCBzaW5jZSBsYXN0IGNoZWNrLi4uXHJcblx0XHRcdFx0XHRpZiAoIWhhc0NvbnRhaW5pbmdTcGFjZUNoYW5nZWQgJiYgcHJldmlvdXNDb250ZW50V2lkdGggPT0gY29udGVudFdpZHRoICYmIHBhbmUub3V0ZXJIZWlnaHQoKSA9PSBjb250ZW50SGVpZ2h0KSB7XHJcblx0XHRcdFx0XHRcdGVsZW0ud2lkdGgocGFuZVdpZHRoKTtcclxuXHRcdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0cHJldmlvdXNDb250ZW50V2lkdGggPSBjb250ZW50V2lkdGg7XHJcblxyXG5cdFx0XHRcdFx0cGFuZS5jc3MoJ3dpZHRoJywgJycpO1xyXG5cdFx0XHRcdFx0ZWxlbS53aWR0aChwYW5lV2lkdGgpO1xyXG5cclxuXHRcdFx0XHRcdGNvbnRhaW5lci5maW5kKCc+LmpzcFZlcnRpY2FsQmFyLD4uanNwSG9yaXpvbnRhbEJhcicpLnJlbW92ZSgpLmVuZCgpO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0cGFuZS5jc3MoJ292ZXJmbG93JywgJ2F1dG8nKTtcclxuXHRcdFx0XHRpZiAocy5jb250ZW50V2lkdGgpIHtcclxuXHRcdFx0XHRcdGNvbnRlbnRXaWR0aCA9IHMuY29udGVudFdpZHRoO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRjb250ZW50V2lkdGggPSBwYW5lWzBdLnNjcm9sbFdpZHRoO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRjb250ZW50SGVpZ2h0ID0gcGFuZVswXS5zY3JvbGxIZWlnaHQ7XHJcblx0XHRcdFx0cGFuZS5jc3MoJ292ZXJmbG93JywgJycpO1xyXG5cclxuXHRcdFx0XHRwZXJjZW50SW5WaWV3SCA9IGNvbnRlbnRXaWR0aCAvIHBhbmVXaWR0aDtcclxuXHRcdFx0XHRwZXJjZW50SW5WaWV3ViA9IGNvbnRlbnRIZWlnaHQgLyBwYW5lSGVpZ2h0O1xyXG5cdFx0XHRcdGlzU2Nyb2xsYWJsZVYgPSBwZXJjZW50SW5WaWV3ViA+IDEgfHwgc2V0dGluZ3MuYWx3YXlzU2hvd1ZTY3JvbGw7XHJcblx0XHRcdFx0aXNTY3JvbGxhYmxlSCA9IHBlcmNlbnRJblZpZXdIID4gMSB8fCBzZXR0aW5ncy5hbHdheXNTaG93SFNjcm9sbDtcclxuXHJcblx0XHRcdFx0aWYgKCEoaXNTY3JvbGxhYmxlSCB8fCBpc1Njcm9sbGFibGVWKSkge1xyXG5cdFx0XHRcdFx0ZWxlbS5yZW1vdmVDbGFzcygnanNwU2Nyb2xsYWJsZScpO1xyXG5cdFx0XHRcdFx0cGFuZS5jc3Moe1xyXG4gICAgICAgICAgICB0b3A6IDAsXHJcbiAgICAgICAgICAgIGxlZnQ6IDAsXHJcblx0XHRcdFx0XHRcdHdpZHRoOiBjb250YWluZXIud2lkdGgoKSAtIG9yaWdpbmFsUGFkZGluZ1RvdGFsV2lkdGhcclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0cmVtb3ZlTW91c2V3aGVlbCgpO1xyXG5cdFx0XHRcdFx0cmVtb3ZlRm9jdXNIYW5kbGVyKCk7XHJcblx0XHRcdFx0XHRyZW1vdmVLZXlib2FyZE5hdigpO1xyXG5cdFx0XHRcdFx0cmVtb3ZlQ2xpY2tPblRyYWNrKCk7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdGVsZW0uYWRkQ2xhc3MoJ2pzcFNjcm9sbGFibGUnKTtcclxuXHJcblx0XHRcdFx0XHRpc01haW50YWluaW5nUG9zaXRvbiA9IHNldHRpbmdzLm1haW50YWluUG9zaXRpb24gJiYgKHZlcnRpY2FsRHJhZ1Bvc2l0aW9uIHx8IGhvcml6b250YWxEcmFnUG9zaXRpb24pO1xyXG5cdFx0XHRcdFx0aWYgKGlzTWFpbnRhaW5pbmdQb3NpdG9uKSB7XHJcblx0XHRcdFx0XHRcdGxhc3RDb250ZW50WCA9IGNvbnRlbnRQb3NpdGlvblgoKTtcclxuXHRcdFx0XHRcdFx0bGFzdENvbnRlbnRZID0gY29udGVudFBvc2l0aW9uWSgpO1xyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdGluaXRpYWxpc2VWZXJ0aWNhbFNjcm9sbCgpO1xyXG5cdFx0XHRcdFx0aW5pdGlhbGlzZUhvcml6b250YWxTY3JvbGwoKTtcclxuXHRcdFx0XHRcdHJlc2l6ZVNjcm9sbGJhcnMoKTtcclxuXHJcblx0XHRcdFx0XHRpZiAoaXNNYWludGFpbmluZ1Bvc2l0b24pIHtcclxuXHRcdFx0XHRcdFx0c2Nyb2xsVG9YKG1haW50YWluQXRSaWdodCAgPyAoY29udGVudFdpZHRoICAtIHBhbmVXaWR0aCApIDogbGFzdENvbnRlbnRYLCBmYWxzZSk7XHJcblx0XHRcdFx0XHRcdHNjcm9sbFRvWShtYWludGFpbkF0Qm90dG9tID8gKGNvbnRlbnRIZWlnaHQgLSBwYW5lSGVpZ2h0KSA6IGxhc3RDb250ZW50WSwgZmFsc2UpO1xyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdGluaXRGb2N1c0hhbmRsZXIoKTtcclxuXHRcdFx0XHRcdGluaXRNb3VzZXdoZWVsKCk7XHJcblx0XHRcdFx0XHRpbml0VG91Y2goKTtcclxuXHJcblx0XHRcdFx0XHRpZiAoc2V0dGluZ3MuZW5hYmxlS2V5Ym9hcmROYXZpZ2F0aW9uKSB7XHJcblx0XHRcdFx0XHRcdGluaXRLZXlib2FyZE5hdigpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0aWYgKHNldHRpbmdzLmNsaWNrT25UcmFjaykge1xyXG5cdFx0XHRcdFx0XHRpbml0Q2xpY2tPblRyYWNrKCk7XHJcblx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0b2JzZXJ2ZUhhc2goKTtcclxuXHRcdFx0XHRcdGlmIChzZXR0aW5ncy5oaWphY2tJbnRlcm5hbExpbmtzKSB7XHJcblx0XHRcdFx0XHRcdGhpamFja0ludGVybmFsTGlua3MoKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGlmICghc2V0dGluZ3MucmVzaXplU2Vuc29yICYmIHNldHRpbmdzLmF1dG9SZWluaXRpYWxpc2UgJiYgIXJlaW5pdGlhbGlzZUludGVydmFsKSB7XHJcblx0XHRcdFx0XHRyZWluaXRpYWxpc2VJbnRlcnZhbCA9IHNldEludGVydmFsKFxyXG5cdFx0XHRcdFx0XHRmdW5jdGlvbigpXHJcblx0XHRcdFx0XHRcdHtcclxuXHRcdFx0XHRcdFx0XHRpbml0aWFsaXNlKHNldHRpbmdzKTtcclxuXHRcdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdFx0c2V0dGluZ3MuYXV0b1JlaW5pdGlhbGlzZURlbGF5XHJcblx0XHRcdFx0XHQpO1xyXG5cdFx0XHRcdH0gZWxzZSBpZiAoIXNldHRpbmdzLnJlc2l6ZVNlbnNvciAmJiAhc2V0dGluZ3MuYXV0b1JlaW5pdGlhbGlzZSAmJiByZWluaXRpYWxpc2VJbnRlcnZhbCkge1xyXG5cdFx0XHRcdFx0Y2xlYXJJbnRlcnZhbChyZWluaXRpYWxpc2VJbnRlcnZhbCk7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRpZihzZXR0aW5ncy5yZXNpemVTZW5zb3IgJiYgIXJlc2l6ZUV2ZW50c0FkZGVkKSB7XHJcblx0XHRcclxuXHRcdFx0XHRcdC8vIGRldGVjdCBzaXplIGNoYW5nZSBpbiBjb250ZW50XHJcblx0XHRcdFx0XHRkZXRlY3RTaXplQ2hhbmdlcyhwYW5lLCByZWluaXRpYWxpc2VGbik7XHJcblx0XHRcdFxyXG5cdFx0XHRcdFx0Ly8gZGV0ZWN0IHNpemUgY2hhbmdlcyBvZiBzY3JvbGwgZWxlbWVudFxyXG5cdFx0XHRcdFx0ZGV0ZWN0U2l6ZUNoYW5nZXMoZWxlbSwgcmVpbml0aWFsaXNlRm4pO1xyXG5cdFx0XHRcclxuXHRcdFx0XHRcdC8vIGRldGVjdCBzaXplIGNoYW5nZXMgb2YgY29udGFpbmVyXHJcblx0XHRcdFx0XHRkZXRlY3RTaXplQ2hhbmdlcyhlbGVtLnBhcmVudCgpLCByZWluaXRpYWxpc2VGbik7XHJcblxyXG5cdFx0XHRcdFx0Ly8gYWRkIGEgcmVpbml0IG9uIHdpbmRvdyByZXNpemUgYWxzbyBmb3Igc2FmZXR5XHJcblx0XHRcdFx0XHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgcmVpbml0aWFsaXNlRm4pO1xyXG5cdFx0XHRcclxuXHRcdFx0XHRcdHJlc2l6ZUV2ZW50c0FkZGVkID0gdHJ1ZTtcclxuXHRcdFx0XHR9XHJcblxyXG4gICAgICAgIGlmKG9yaWdpbmFsU2Nyb2xsVG9wICYmIGVsZW0uc2Nyb2xsVG9wKDApKSB7XHJcbiAgICAgICAgICBzY3JvbGxUb1kob3JpZ2luYWxTY3JvbGxUb3AsIGZhbHNlKTtcclxuICAgICAgICB9XHJcblxyXG5cdFx0XHRcdGlmKG9yaWdpbmFsU2Nyb2xsTGVmdCAmJiBlbGVtLnNjcm9sbExlZnQoMCkpIHtcclxuICAgICAgICAgIHNjcm9sbFRvWChvcmlnaW5hbFNjcm9sbExlZnQsIGZhbHNlKTtcclxuICAgICAgICB9XHJcblxyXG5cdFx0XHRcdGVsZW0udHJpZ2dlcignanNwLWluaXRpYWxpc2VkJywgW2lzU2Nyb2xsYWJsZUggfHwgaXNTY3JvbGxhYmxlVl0pO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRmdW5jdGlvbiBkZXRlY3RTaXplQ2hhbmdlcyhlbGVtZW50LCBjYWxsYmFjaykge1xyXG4gXHJcblx0XHRcdFx0Ly8gY3JlYXRlIHJlc2l6ZSBldmVudCBlbGVtZW50cyAtIGJhc2VkIG9uIHJlc2l6ZSBzZW5zb3I6IGh0dHBzOi8vZ2l0aHViLmNvbS9mbG93a2V5L3Jlc2l6ZS1zZW5zb3IvXHJcblx0XHRcdFx0dmFyIHJlc2l6ZVdpZHRoLCByZXNpemVIZWlnaHQ7XHJcblx0XHRcdFx0dmFyIHJlc2l6ZUVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuXHRcdFx0XHR2YXIgcmVzaXplR3Jvd0VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuXHRcdFx0XHR2YXIgcmVzaXplR3Jvd0NoaWxkRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG5cdFx0XHRcdHZhciByZXNpemVTaHJpbmtFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcblx0XHRcdFx0dmFyIHJlc2l6ZVNocmlua0NoaWxkRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG5cdFx0XHJcblx0XHRcdFx0Ly8gYWRkIG5lY2Vzc2FyeSBzdHlsaW5nXHJcblx0XHRcdFx0cmVzaXplRWxlbWVudC5zdHlsZS5jc3NUZXh0ID0gJ3Bvc2l0aW9uOiBhYnNvbHV0ZTsgbGVmdDogMDsgdG9wOiAwOyByaWdodDogMDsgYm90dG9tOiAwOyBvdmVyZmxvdzogc2Nyb2xsOyB6LWluZGV4OiAtMTsgdmlzaWJpbGl0eTogaGlkZGVuOyc7XHJcblx0XHRcdFx0cmVzaXplR3Jvd0VsZW1lbnQuc3R5bGUuY3NzVGV4dCA9ICdwb3NpdGlvbjogYWJzb2x1dGU7IGxlZnQ6IDA7IHRvcDogMDsgcmlnaHQ6IDA7IGJvdHRvbTogMDsgb3ZlcmZsb3c6IHNjcm9sbDsgei1pbmRleDogLTE7IHZpc2liaWxpdHk6IGhpZGRlbjsnO1xyXG5cdFx0XHRcdHJlc2l6ZVNocmlua0VsZW1lbnQuc3R5bGUuY3NzVGV4dCA9ICdwb3NpdGlvbjogYWJzb2x1dGU7IGxlZnQ6IDA7IHRvcDogMDsgcmlnaHQ6IDA7IGJvdHRvbTogMDsgb3ZlcmZsb3c6IHNjcm9sbDsgei1pbmRleDogLTE7IHZpc2liaWxpdHk6IGhpZGRlbjsnO1xyXG5cdFx0XHJcblx0XHRcdFx0cmVzaXplR3Jvd0NoaWxkRWxlbWVudC5zdHlsZS5jc3NUZXh0ID0gJ3Bvc2l0aW9uOiBhYnNvbHV0ZTsgbGVmdDogMDsgdG9wOiAwOyc7XHJcblx0XHRcdFx0cmVzaXplU2hyaW5rQ2hpbGRFbGVtZW50LnN0eWxlLmNzc1RleHQgPSAncG9zaXRpb246IGFic29sdXRlOyBsZWZ0OiAwOyB0b3A6IDA7IHdpZHRoOiAyMDAlOyBoZWlnaHQ6IDIwMCU7JztcclxuXHRcdFxyXG5cdFx0XHRcdC8vIENyZWF0ZSBhIGZ1bmN0aW9uIHRvIHByb2dyYW1tYXRpY2FsbHkgdXBkYXRlIHNpemVzXHJcblx0XHRcdFx0dmFyIHVwZGF0ZVNpemVzID0gZnVuY3Rpb24oKSB7XHJcblx0XHRcclxuXHRcdFx0XHRcdHJlc2l6ZUdyb3dDaGlsZEVsZW1lbnQuc3R5bGUud2lkdGggPSByZXNpemVHcm93RWxlbWVudC5vZmZzZXRXaWR0aCArIDEwICsgJ3B4JztcclxuXHRcdFx0XHRcdHJlc2l6ZUdyb3dDaGlsZEVsZW1lbnQuc3R5bGUuaGVpZ2h0ID0gcmVzaXplR3Jvd0VsZW1lbnQub2Zmc2V0SGVpZ2h0ICsgMTAgKyAncHgnO1xyXG5cdFx0XHJcblx0XHRcdFx0XHRyZXNpemVHcm93RWxlbWVudC5zY3JvbGxMZWZ0ID0gcmVzaXplR3Jvd0VsZW1lbnQuc2Nyb2xsV2lkdGg7XHJcblx0XHRcdFx0XHRyZXNpemVHcm93RWxlbWVudC5zY3JvbGxUb3AgPSByZXNpemVHcm93RWxlbWVudC5zY3JvbGxIZWlnaHQ7XHJcblx0XHRcclxuXHRcdFx0XHRcdHJlc2l6ZVNocmlua0VsZW1lbnQuc2Nyb2xsTGVmdCA9IHJlc2l6ZVNocmlua0VsZW1lbnQuc2Nyb2xsV2lkdGg7XHJcblx0XHRcdFx0XHRyZXNpemVTaHJpbmtFbGVtZW50LnNjcm9sbFRvcCA9IHJlc2l6ZVNocmlua0VsZW1lbnQuc2Nyb2xsSGVpZ2h0O1xyXG5cdFx0XHJcblx0XHRcdFx0XHRyZXNpemVXaWR0aCA9IGVsZW1lbnQud2lkdGgoKTtcclxuXHRcdFx0XHRcdHJlc2l6ZUhlaWdodCA9IGVsZW1lbnQuaGVpZ2h0KCk7XHJcblx0XHRcdFx0fTtcclxuXHRcdFxyXG5cdFx0XHRcdC8vIGNyZWF0ZSBmdW5jdGlvbnMgdG8gY2FsbCB3aGVuIGNvbnRlbnQgZ3Jvd3NcclxuXHRcdFx0XHR2YXIgb25Hcm93ID0gZnVuY3Rpb24oKSB7XHJcblx0XHRcclxuXHRcdFx0XHRcdC8vIGNoZWNrIHRvIHNlZSBpZiB0aGUgY29udGVudCBoYXMgY2hhbmdlIHNpemVcclxuXHRcdFx0XHRcdGlmIChlbGVtZW50LndpZHRoKCkgPiByZXNpemVXaWR0aCB8fCBlbGVtZW50LmhlaWdodCgpID4gcmVzaXplSGVpZ2h0KSB7XHJcblx0XHRcdFxyXG5cdFx0XHRcdFx0XHQvLyBpZiBzaXplIGhhcyBjaGFuZ2VkIHRoZW4gcmVpbml0aWFsaXNlXHJcblx0XHRcdFx0XHRcdGNhbGxiYWNrLmFwcGx5KHRoaXMsIFtdKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdC8vIGFmdGVyIHJlaW5pdGlhbGlzaW5nIHVwZGF0ZSBzaXplc1xyXG5cdFx0XHRcdFx0dXBkYXRlU2l6ZXMoKTtcclxuXHRcdFx0XHR9O1xyXG5cdFx0XHJcblx0XHRcdFx0Ly8gY3JlYXRlIGZ1bmN0aW9ucyB0byBjYWxsIHdoZW4gY29udGVudCBzaHJpbmtzXHJcblx0XHRcdFx0dmFyIG9uU2hyaW5rID0gZnVuY3Rpb24oKSB7XHJcblx0XHRcclxuXHRcdFx0XHRcdC8vIGNoZWNrIHRvIHNlZSBpZiB0aGUgY29udGVudCBoYXMgY2hhbmdlIHNpemVcclxuXHRcdFx0XHRcdGlmIChlbGVtZW50LndpZHRoKCkgPCByZXNpemVXaWR0aCB8fCBlbGVtZW50LmhlaWdodCgpIDwgcmVzaXplSGVpZ2h0KSB7XHJcblx0XHRcdFxyXG5cdFx0XHRcdFx0XHQvLyBpZiBzaXplIGhhcyBjaGFuZ2VkIHRoZW4gcmVpbml0aWFsaXNlXHJcblx0XHRcdFx0XHRcdGNhbGxiYWNrLmFwcGx5KHRoaXMsIFtdKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdC8vIGFmdGVyIHJlaW5pdGlhbGlzaW5nIHVwZGF0ZSBzaXplc1xyXG5cdFx0XHRcdFx0dXBkYXRlU2l6ZXMoKTtcclxuXHRcdFx0XHR9O1xyXG5cdFx0XHJcblx0XHRcdFx0Ly8gYmluZCB0byBzY3JvbGwgZXZlbnRzXHJcblx0XHRcdFx0cmVzaXplR3Jvd0VsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgb25Hcm93LmJpbmQodGhpcykpO1xyXG5cdFx0XHRcdHJlc2l6ZVNocmlua0VsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgb25TaHJpbmsuYmluZCh0aGlzKSk7XHJcblx0XHRcclxuXHRcdFx0XHQvLyBuZXN0IGVsZW1lbnRzIGJlZm9yZSBhZGRpbmcgdG8gcGFuZVxyXG5cdFx0XHRcdHJlc2l6ZUdyb3dFbGVtZW50LmFwcGVuZENoaWxkKHJlc2l6ZUdyb3dDaGlsZEVsZW1lbnQpO1xyXG5cdFx0XHRcdHJlc2l6ZVNocmlua0VsZW1lbnQuYXBwZW5kQ2hpbGQocmVzaXplU2hyaW5rQ2hpbGRFbGVtZW50KTtcclxuXHRcdFxyXG5cdFx0XHRcdHJlc2l6ZUVsZW1lbnQuYXBwZW5kQ2hpbGQocmVzaXplR3Jvd0VsZW1lbnQpO1xyXG5cdFx0XHRcdHJlc2l6ZUVsZW1lbnQuYXBwZW5kQ2hpbGQocmVzaXplU2hyaW5rRWxlbWVudCk7XHJcblx0XHRcclxuXHRcdFx0XHRlbGVtZW50LmFwcGVuZChyZXNpemVFbGVtZW50KTtcclxuXHJcblx0XHRcdFx0Ly8gZW5zdXJlIHBhcmVudCBlbGVtZW50IGlzIG5vdCBzdGF0aWNhbGx5IHBvc2l0aW9uZWRcclxuXHRcdFx0XHRpZih3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShlbGVtZW50WzBdLCBudWxsKS5nZXRQcm9wZXJ0eVZhbHVlKCdwb3NpdGlvbicpID09PSAnc3RhdGljJykge1xyXG5cdFx0XHRcdFx0ZWxlbWVudFswXS5zdHlsZS5wb3NpdGlvbiA9ICdyZWxhdGl2ZSc7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHJcblx0XHRcdFx0Ly8gdXBkYXRlIHNpemVzIGluaXRpYWxseVxyXG5cdFx0XHRcdHVwZGF0ZVNpemVzKCk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGZ1bmN0aW9uIGluaXRpYWxpc2VWZXJ0aWNhbFNjcm9sbCgpXHJcblx0XHRcdHtcclxuXHRcdFx0XHRpZiAoaXNTY3JvbGxhYmxlVikge1xyXG5cclxuXHRcdFx0XHRcdGNvbnRhaW5lci5hcHBlbmQoXHJcblx0XHRcdFx0XHRcdCQoJzxkaXYgY2xhc3M9XCJqc3BWZXJ0aWNhbEJhclwiIC8+JykuYXBwZW5kKFxyXG5cdFx0XHRcdFx0XHRcdCQoJzxkaXYgY2xhc3M9XCJqc3BDYXAganNwQ2FwVG9wXCIgLz4nKSxcclxuXHRcdFx0XHRcdFx0XHQkKCc8ZGl2IGNsYXNzPVwianNwVHJhY2tcIiAvPicpLmFwcGVuZChcclxuXHRcdFx0XHRcdFx0XHRcdCQoJzxkaXYgY2xhc3M9XCJqc3BEcmFnXCIgLz4nKS5hcHBlbmQoXHJcblx0XHRcdFx0XHRcdFx0XHRcdCQoJzxkaXYgY2xhc3M9XCJqc3BEcmFnVG9wXCIgLz4nKSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0JCgnPGRpdiBjbGFzcz1cImpzcERyYWdCb3R0b21cIiAvPicpXHJcblx0XHRcdFx0XHRcdFx0XHQpXHJcblx0XHRcdFx0XHRcdFx0KSxcclxuXHRcdFx0XHRcdFx0XHQkKCc8ZGl2IGNsYXNzPVwianNwQ2FwIGpzcENhcEJvdHRvbVwiIC8+JylcclxuXHRcdFx0XHRcdFx0KVxyXG5cdFx0XHRcdFx0KTtcclxuXHJcblx0XHRcdFx0XHR2ZXJ0aWNhbEJhciA9IGNvbnRhaW5lci5maW5kKCc+LmpzcFZlcnRpY2FsQmFyJyk7XHJcblx0XHRcdFx0XHR2ZXJ0aWNhbFRyYWNrID0gdmVydGljYWxCYXIuZmluZCgnPi5qc3BUcmFjaycpO1xyXG5cdFx0XHRcdFx0dmVydGljYWxEcmFnID0gdmVydGljYWxUcmFjay5maW5kKCc+LmpzcERyYWcnKTtcclxuXHJcblx0XHRcdFx0XHRpZiAoc2V0dGluZ3Muc2hvd0Fycm93cykge1xyXG5cdFx0XHRcdFx0XHRhcnJvd1VwID0gJCgnPGEgY2xhc3M9XCJqc3BBcnJvdyBqc3BBcnJvd1VwXCIgLz4nKS5vbihcclxuXHRcdFx0XHRcdFx0XHQnbW91c2Vkb3duLmpzcCcsIGdldEFycm93U2Nyb2xsKDAsIC0xKVxyXG5cdFx0XHRcdFx0XHQpLm9uKCdjbGljay5qc3AnLCBuaWwpO1xyXG5cdFx0XHRcdFx0XHRhcnJvd0Rvd24gPSAkKCc8YSBjbGFzcz1cImpzcEFycm93IGpzcEFycm93RG93blwiIC8+Jykub24oXHJcblx0XHRcdFx0XHRcdFx0J21vdXNlZG93bi5qc3AnLCBnZXRBcnJvd1Njcm9sbCgwLCAxKVxyXG5cdFx0XHRcdFx0XHQpLm9uKCdjbGljay5qc3AnLCBuaWwpO1xyXG5cdFx0XHRcdFx0XHRpZiAoc2V0dGluZ3MuYXJyb3dTY3JvbGxPbkhvdmVyKSB7XHJcblx0XHRcdFx0XHRcdFx0YXJyb3dVcC5vbignbW91c2VvdmVyLmpzcCcsIGdldEFycm93U2Nyb2xsKDAsIC0xLCBhcnJvd1VwKSk7XHJcblx0XHRcdFx0XHRcdFx0YXJyb3dEb3duLm9uKCdtb3VzZW92ZXIuanNwJywgZ2V0QXJyb3dTY3JvbGwoMCwgMSwgYXJyb3dEb3duKSk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRcdGFwcGVuZEFycm93cyh2ZXJ0aWNhbFRyYWNrLCBzZXR0aW5ncy52ZXJ0aWNhbEFycm93UG9zaXRpb25zLCBhcnJvd1VwLCBhcnJvd0Rvd24pO1xyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdHZlcnRpY2FsVHJhY2tIZWlnaHQgPSBwYW5lSGVpZ2h0O1xyXG5cdFx0XHRcdFx0Y29udGFpbmVyLmZpbmQoJz4uanNwVmVydGljYWxCYXI+LmpzcENhcDp2aXNpYmxlLD4uanNwVmVydGljYWxCYXI+LmpzcEFycm93JykuZWFjaChcclxuXHRcdFx0XHRcdFx0ZnVuY3Rpb24oKVxyXG5cdFx0XHRcdFx0XHR7XHJcblx0XHRcdFx0XHRcdFx0dmVydGljYWxUcmFja0hlaWdodCAtPSAkKHRoaXMpLm91dGVySGVpZ2h0KCk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdCk7XHJcblxyXG5cclxuXHRcdFx0XHRcdHZlcnRpY2FsRHJhZy5vbihcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJtb3VzZWVudGVyXCIsXHJcblx0XHRcdFx0XHRcdGZ1bmN0aW9uKClcclxuXHRcdFx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0XHRcdHZlcnRpY2FsRHJhZy5hZGRDbGFzcygnanNwSG92ZXInKTtcclxuXHRcdFx0XHRcdFx0fVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKS5vbihcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJtb3VzZWxlYXZlXCIsXHJcblx0XHRcdFx0XHRcdGZ1bmN0aW9uKClcclxuXHRcdFx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0XHRcdHZlcnRpY2FsRHJhZy5yZW1vdmVDbGFzcygnanNwSG92ZXInKTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0KS5vbihcclxuXHRcdFx0XHRcdFx0J21vdXNlZG93bi5qc3AnLFxyXG5cdFx0XHRcdFx0XHRmdW5jdGlvbihlKVxyXG5cdFx0XHRcdFx0XHR7XHJcblx0XHRcdFx0XHRcdFx0Ly8gU3RvcCBJRSBmcm9tIGFsbG93aW5nIHRleHQgc2VsZWN0aW9uXHJcblx0XHRcdFx0XHRcdFx0JCgnaHRtbCcpLm9uKCdkcmFnc3RhcnQuanNwIHNlbGVjdHN0YXJ0LmpzcCcsIG5pbCk7XHJcblxyXG5cdFx0XHRcdFx0XHRcdHZlcnRpY2FsRHJhZy5hZGRDbGFzcygnanNwQWN0aXZlJyk7XHJcblxyXG5cdFx0XHRcdFx0XHRcdHZhciBzdGFydFkgPSBlLnBhZ2VZIC0gdmVydGljYWxEcmFnLnBvc2l0aW9uKCkudG9wO1xyXG5cclxuXHRcdFx0XHRcdFx0XHQkKCdodG1sJykub24oXHJcblx0XHRcdFx0XHRcdFx0XHQnbW91c2Vtb3ZlLmpzcCcsXHJcblx0XHRcdFx0XHRcdFx0XHRmdW5jdGlvbihlKVxyXG5cdFx0XHRcdFx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRwb3NpdGlvbkRyYWdZKGUucGFnZVkgLSBzdGFydFksIGZhbHNlKTtcclxuXHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHQpLm9uKCdtb3VzZXVwLmpzcCBtb3VzZWxlYXZlLmpzcCcsIGNhbmNlbERyYWcpO1xyXG5cdFx0XHRcdFx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0KTtcclxuXHRcdFx0XHRcdHNpemVWZXJ0aWNhbFNjcm9sbGJhcigpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0ZnVuY3Rpb24gc2l6ZVZlcnRpY2FsU2Nyb2xsYmFyKClcclxuXHRcdFx0e1xyXG5cdFx0XHRcdHZlcnRpY2FsVHJhY2suaGVpZ2h0KHZlcnRpY2FsVHJhY2tIZWlnaHQgKyAncHgnKTtcclxuXHRcdFx0XHR2ZXJ0aWNhbERyYWdQb3NpdGlvbiA9IDA7XHJcblx0XHRcdFx0c2Nyb2xsYmFyV2lkdGggPSBzZXR0aW5ncy52ZXJ0aWNhbEd1dHRlciArIHZlcnRpY2FsVHJhY2sub3V0ZXJXaWR0aCgpO1xyXG5cclxuXHRcdFx0XHQvLyBNYWtlIHRoZSBwYW5lIHRoaW5uZXIgdG8gYWxsb3cgZm9yIHRoZSB2ZXJ0aWNhbCBzY3JvbGxiYXJcclxuXHRcdFx0XHRwYW5lLndpZHRoKHBhbmVXaWR0aCAtIHNjcm9sbGJhcldpZHRoIC0gb3JpZ2luYWxQYWRkaW5nVG90YWxXaWR0aCk7XHJcblxyXG5cdFx0XHRcdC8vIEFkZCBtYXJnaW4gdG8gdGhlIGxlZnQgb2YgdGhlIHBhbmUgaWYgc2Nyb2xsYmFycyBhcmUgb24gdGhhdCBzaWRlICh0byBwb3NpdGlvblxyXG5cdFx0XHRcdC8vIHRoZSBzY3JvbGxiYXIgb24gdGhlIGxlZnQgb3IgcmlnaHQgc2V0IGl0J3MgbGVmdCBvciByaWdodCBwcm9wZXJ0eSBpbiBDU1MpXHJcblx0XHRcdFx0dHJ5IHtcclxuXHRcdFx0XHRcdGlmICh2ZXJ0aWNhbEJhci5wb3NpdGlvbigpLmxlZnQgPT09IDApIHtcclxuXHRcdFx0XHRcdFx0cGFuZS5jc3MoJ21hcmdpbi1sZWZ0Jywgc2Nyb2xsYmFyV2lkdGggKyAncHgnKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9IGNhdGNoIChlcnIpIHtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGZ1bmN0aW9uIGluaXRpYWxpc2VIb3Jpem9udGFsU2Nyb2xsKClcclxuXHRcdFx0e1xyXG5cdFx0XHRcdGlmIChpc1Njcm9sbGFibGVIKSB7XHJcblxyXG5cdFx0XHRcdFx0Y29udGFpbmVyLmFwcGVuZChcclxuXHRcdFx0XHRcdFx0JCgnPGRpdiBjbGFzcz1cImpzcEhvcml6b250YWxCYXJcIiAvPicpLmFwcGVuZChcclxuXHRcdFx0XHRcdFx0XHQkKCc8ZGl2IGNsYXNzPVwianNwQ2FwIGpzcENhcExlZnRcIiAvPicpLFxyXG5cdFx0XHRcdFx0XHRcdCQoJzxkaXYgY2xhc3M9XCJqc3BUcmFja1wiIC8+JykuYXBwZW5kKFxyXG5cdFx0XHRcdFx0XHRcdFx0JCgnPGRpdiBjbGFzcz1cImpzcERyYWdcIiAvPicpLmFwcGVuZChcclxuXHRcdFx0XHRcdFx0XHRcdFx0JCgnPGRpdiBjbGFzcz1cImpzcERyYWdMZWZ0XCIgLz4nKSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0JCgnPGRpdiBjbGFzcz1cImpzcERyYWdSaWdodFwiIC8+JylcclxuXHRcdFx0XHRcdFx0XHRcdClcclxuXHRcdFx0XHRcdFx0XHQpLFxyXG5cdFx0XHRcdFx0XHRcdCQoJzxkaXYgY2xhc3M9XCJqc3BDYXAganNwQ2FwUmlnaHRcIiAvPicpXHJcblx0XHRcdFx0XHRcdClcclxuXHRcdFx0XHRcdCk7XHJcblxyXG5cdFx0XHRcdFx0aG9yaXpvbnRhbEJhciA9IGNvbnRhaW5lci5maW5kKCc+LmpzcEhvcml6b250YWxCYXInKTtcclxuXHRcdFx0XHRcdGhvcml6b250YWxUcmFjayA9IGhvcml6b250YWxCYXIuZmluZCgnPi5qc3BUcmFjaycpO1xyXG5cdFx0XHRcdFx0aG9yaXpvbnRhbERyYWcgPSBob3Jpem9udGFsVHJhY2suZmluZCgnPi5qc3BEcmFnJyk7XHJcblxyXG5cdFx0XHRcdFx0aWYgKHNldHRpbmdzLnNob3dBcnJvd3MpIHtcclxuXHRcdFx0XHRcdFx0YXJyb3dMZWZ0ID0gJCgnPGEgY2xhc3M9XCJqc3BBcnJvdyBqc3BBcnJvd0xlZnRcIiAvPicpLm9uKFxyXG5cdFx0XHRcdFx0XHRcdCdtb3VzZWRvd24uanNwJywgZ2V0QXJyb3dTY3JvbGwoLTEsIDApXHJcblx0XHRcdFx0XHRcdCkub24oJ2NsaWNrLmpzcCcsIG5pbCk7XHJcblx0XHRcdFx0XHRcdGFycm93UmlnaHQgPSAkKCc8YSBjbGFzcz1cImpzcEFycm93IGpzcEFycm93UmlnaHRcIiAvPicpLm9uKFxyXG5cdFx0XHRcdFx0XHRcdCdtb3VzZWRvd24uanNwJywgZ2V0QXJyb3dTY3JvbGwoMSwgMClcclxuXHRcdFx0XHRcdFx0KS5vbignY2xpY2suanNwJywgbmlsKTtcclxuXHRcdFx0XHRcdFx0aWYgKHNldHRpbmdzLmFycm93U2Nyb2xsT25Ib3Zlcikge1xyXG5cdFx0XHRcdFx0XHRcdGFycm93TGVmdC5vbignbW91c2VvdmVyLmpzcCcsIGdldEFycm93U2Nyb2xsKC0xLCAwLCBhcnJvd0xlZnQpKTtcclxuXHRcdFx0XHRcdFx0XHRhcnJvd1JpZ2h0Lm9uKCdtb3VzZW92ZXIuanNwJywgZ2V0QXJyb3dTY3JvbGwoMSwgMCwgYXJyb3dSaWdodCkpO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdGFwcGVuZEFycm93cyhob3Jpem9udGFsVHJhY2ssIHNldHRpbmdzLmhvcml6b250YWxBcnJvd1Bvc2l0aW9ucywgYXJyb3dMZWZ0LCBhcnJvd1JpZ2h0KTtcclxuXHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRob3Jpem9udGFsRHJhZy5vbihcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJtb3VzZWVudGVyXCIsXHJcblx0XHRcdFx0XHRcdGZ1bmN0aW9uKClcclxuXHRcdFx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0XHRcdGhvcml6b250YWxEcmFnLmFkZENsYXNzKCdqc3BIb3ZlcicpO1xyXG5cdFx0XHRcdFx0XHR9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApLm9uKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIm1vdXNlbGVhdmVcIixcclxuXHRcdFx0XHRcdFx0ZnVuY3Rpb24oKVxyXG5cdFx0XHRcdFx0XHR7XHJcblx0XHRcdFx0XHRcdFx0aG9yaXpvbnRhbERyYWcucmVtb3ZlQ2xhc3MoJ2pzcEhvdmVyJyk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdCkub24oXHJcblx0XHRcdFx0XHRcdCdtb3VzZWRvd24uanNwJyxcclxuXHRcdFx0XHRcdFx0ZnVuY3Rpb24oZSlcclxuXHRcdFx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0XHRcdC8vIFN0b3AgSUUgZnJvbSBhbGxvd2luZyB0ZXh0IHNlbGVjdGlvblxyXG5cdFx0XHRcdFx0XHRcdCQoJ2h0bWwnKS5vbignZHJhZ3N0YXJ0LmpzcCBzZWxlY3RzdGFydC5qc3AnLCBuaWwpO1xyXG5cclxuXHRcdFx0XHRcdFx0XHRob3Jpem9udGFsRHJhZy5hZGRDbGFzcygnanNwQWN0aXZlJyk7XHJcblxyXG5cdFx0XHRcdFx0XHRcdHZhciBzdGFydFggPSBlLnBhZ2VYIC0gaG9yaXpvbnRhbERyYWcucG9zaXRpb24oKS5sZWZ0O1xyXG5cclxuXHRcdFx0XHRcdFx0XHQkKCdodG1sJykub24oXHJcblx0XHRcdFx0XHRcdFx0XHQnbW91c2Vtb3ZlLmpzcCcsXHJcblx0XHRcdFx0XHRcdFx0XHRmdW5jdGlvbihlKVxyXG5cdFx0XHRcdFx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRwb3NpdGlvbkRyYWdYKGUucGFnZVggLSBzdGFydFgsIGZhbHNlKTtcclxuXHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHQpLm9uKCdtb3VzZXVwLmpzcCBtb3VzZWxlYXZlLmpzcCcsIGNhbmNlbERyYWcpO1xyXG5cdFx0XHRcdFx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0KTtcclxuXHRcdFx0XHRcdGhvcml6b250YWxUcmFja1dpZHRoID0gY29udGFpbmVyLmlubmVyV2lkdGgoKTtcclxuXHRcdFx0XHRcdHNpemVIb3Jpem9udGFsU2Nyb2xsYmFyKCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRmdW5jdGlvbiBzaXplSG9yaXpvbnRhbFNjcm9sbGJhcigpXHJcblx0XHRcdHtcclxuXHRcdFx0XHRjb250YWluZXIuZmluZCgnPi5qc3BIb3Jpem9udGFsQmFyPi5qc3BDYXA6dmlzaWJsZSw+LmpzcEhvcml6b250YWxCYXI+LmpzcEFycm93JykuZWFjaChcclxuXHRcdFx0XHRcdGZ1bmN0aW9uKClcclxuXHRcdFx0XHRcdHtcclxuXHRcdFx0XHRcdFx0aG9yaXpvbnRhbFRyYWNrV2lkdGggLT0gJCh0aGlzKS5vdXRlcldpZHRoKCk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0KTtcclxuXHJcblx0XHRcdFx0aG9yaXpvbnRhbFRyYWNrLndpZHRoKGhvcml6b250YWxUcmFja1dpZHRoICsgJ3B4Jyk7XHJcblx0XHRcdFx0aG9yaXpvbnRhbERyYWdQb3NpdGlvbiA9IDA7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGZ1bmN0aW9uIHJlc2l6ZVNjcm9sbGJhcnMoKVxyXG5cdFx0XHR7XHJcblx0XHRcdFx0aWYgKGlzU2Nyb2xsYWJsZUggJiYgaXNTY3JvbGxhYmxlVikge1xyXG5cdFx0XHRcdFx0dmFyIGhvcml6b250YWxUcmFja0hlaWdodCA9IGhvcml6b250YWxUcmFjay5vdXRlckhlaWdodCgpLFxyXG5cdFx0XHRcdFx0XHR2ZXJ0aWNhbFRyYWNrV2lkdGggPSB2ZXJ0aWNhbFRyYWNrLm91dGVyV2lkdGgoKTtcclxuXHRcdFx0XHRcdHZlcnRpY2FsVHJhY2tIZWlnaHQgLT0gaG9yaXpvbnRhbFRyYWNrSGVpZ2h0O1xyXG5cdFx0XHRcdFx0JChob3Jpem9udGFsQmFyKS5maW5kKCc+LmpzcENhcDp2aXNpYmxlLD4uanNwQXJyb3cnKS5lYWNoKFxyXG5cdFx0XHRcdFx0XHRmdW5jdGlvbigpXHJcblx0XHRcdFx0XHRcdHtcclxuXHRcdFx0XHRcdFx0XHRob3Jpem9udGFsVHJhY2tXaWR0aCArPSAkKHRoaXMpLm91dGVyV2lkdGgoKTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0KTtcclxuXHRcdFx0XHRcdGhvcml6b250YWxUcmFja1dpZHRoIC09IHZlcnRpY2FsVHJhY2tXaWR0aDtcclxuXHRcdFx0XHRcdHBhbmVIZWlnaHQgLT0gdmVydGljYWxUcmFja1dpZHRoO1xyXG5cdFx0XHRcdFx0cGFuZVdpZHRoIC09IGhvcml6b250YWxUcmFja0hlaWdodDtcclxuXHRcdFx0XHRcdGhvcml6b250YWxUcmFjay5wYXJlbnQoKS5hcHBlbmQoXHJcblx0XHRcdFx0XHRcdCQoJzxkaXYgY2xhc3M9XCJqc3BDb3JuZXJcIiAvPicpLmNzcygnd2lkdGgnLCBob3Jpem9udGFsVHJhY2tIZWlnaHQgKyAncHgnKVxyXG5cdFx0XHRcdFx0KTtcclxuXHRcdFx0XHRcdHNpemVWZXJ0aWNhbFNjcm9sbGJhcigpO1xyXG5cdFx0XHRcdFx0c2l6ZUhvcml6b250YWxTY3JvbGxiYXIoKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0Ly8gcmVmbG93IGNvbnRlbnRcclxuXHRcdFx0XHRpZiAoaXNTY3JvbGxhYmxlSCkge1xyXG5cdFx0XHRcdFx0cGFuZS53aWR0aCgoY29udGFpbmVyLm91dGVyV2lkdGgoKSAtIG9yaWdpbmFsUGFkZGluZ1RvdGFsV2lkdGgpICsgJ3B4Jyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGNvbnRlbnRIZWlnaHQgPSBwYW5lLm91dGVySGVpZ2h0KCk7XHJcblx0XHRcdFx0cGVyY2VudEluVmlld1YgPSBjb250ZW50SGVpZ2h0IC8gcGFuZUhlaWdodDtcclxuXHJcblx0XHRcdFx0aWYgKGlzU2Nyb2xsYWJsZUgpIHtcclxuXHRcdFx0XHRcdGhvcml6b250YWxEcmFnV2lkdGggPSBNYXRoLmNlaWwoMSAvIHBlcmNlbnRJblZpZXdIICogaG9yaXpvbnRhbFRyYWNrV2lkdGgpO1xyXG5cdFx0XHRcdFx0aWYgKGhvcml6b250YWxEcmFnV2lkdGggPiBzZXR0aW5ncy5ob3Jpem9udGFsRHJhZ01heFdpZHRoKSB7XHJcblx0XHRcdFx0XHRcdGhvcml6b250YWxEcmFnV2lkdGggPSBzZXR0aW5ncy5ob3Jpem9udGFsRHJhZ01heFdpZHRoO1xyXG5cdFx0XHRcdFx0fSBlbHNlIGlmIChob3Jpem9udGFsRHJhZ1dpZHRoIDwgc2V0dGluZ3MuaG9yaXpvbnRhbERyYWdNaW5XaWR0aCkge1xyXG5cdFx0XHRcdFx0XHRob3Jpem9udGFsRHJhZ1dpZHRoID0gc2V0dGluZ3MuaG9yaXpvbnRhbERyYWdNaW5XaWR0aDtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGhvcml6b250YWxEcmFnLmNzcygnd2lkdGgnLCBob3Jpem9udGFsRHJhZ1dpZHRoICsgJ3B4Jyk7XHJcblx0XHRcdFx0XHRkcmFnTWF4WCA9IGhvcml6b250YWxUcmFja1dpZHRoIC0gaG9yaXpvbnRhbERyYWdXaWR0aDtcclxuXHRcdFx0XHRcdF9wb3NpdGlvbkRyYWdYKGhvcml6b250YWxEcmFnUG9zaXRpb24pOyAvLyBUbyB1cGRhdGUgdGhlIHN0YXRlIGZvciB0aGUgYXJyb3cgYnV0dG9uc1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZiAoaXNTY3JvbGxhYmxlVikge1xyXG5cdFx0XHRcdFx0dmVydGljYWxEcmFnSGVpZ2h0ID0gTWF0aC5jZWlsKDEgLyBwZXJjZW50SW5WaWV3ViAqIHZlcnRpY2FsVHJhY2tIZWlnaHQpO1xyXG5cdFx0XHRcdFx0aWYgKHZlcnRpY2FsRHJhZ0hlaWdodCA+IHNldHRpbmdzLnZlcnRpY2FsRHJhZ01heEhlaWdodCkge1xyXG5cdFx0XHRcdFx0XHR2ZXJ0aWNhbERyYWdIZWlnaHQgPSBzZXR0aW5ncy52ZXJ0aWNhbERyYWdNYXhIZWlnaHQ7XHJcblx0XHRcdFx0XHR9IGVsc2UgaWYgKHZlcnRpY2FsRHJhZ0hlaWdodCA8IHNldHRpbmdzLnZlcnRpY2FsRHJhZ01pbkhlaWdodCkge1xyXG5cdFx0XHRcdFx0XHR2ZXJ0aWNhbERyYWdIZWlnaHQgPSBzZXR0aW5ncy52ZXJ0aWNhbERyYWdNaW5IZWlnaHQ7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR2ZXJ0aWNhbERyYWcuY3NzKCdoZWlnaHQnLCB2ZXJ0aWNhbERyYWdIZWlnaHQgKyAncHgnKTtcclxuXHRcdFx0XHRcdGRyYWdNYXhZID0gdmVydGljYWxUcmFja0hlaWdodCAtIHZlcnRpY2FsRHJhZ0hlaWdodDtcclxuXHRcdFx0XHRcdF9wb3NpdGlvbkRyYWdZKHZlcnRpY2FsRHJhZ1Bvc2l0aW9uKTsgLy8gVG8gdXBkYXRlIHRoZSBzdGF0ZSBmb3IgdGhlIGFycm93IGJ1dHRvbnNcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGZ1bmN0aW9uIGFwcGVuZEFycm93cyhlbGUsIHAsIGExLCBhMilcclxuXHRcdFx0e1xyXG5cdFx0XHRcdHZhciBwMSA9IFwiYmVmb3JlXCIsIHAyID0gXCJhZnRlclwiLCBhVGVtcDtcclxuXHJcblx0XHRcdFx0Ly8gU25pZmYgZm9yIG1hYy4uLiBJcyB0aGVyZSBhIGJldHRlciB3YXkgdG8gZGV0ZXJtaW5lIHdoZXRoZXIgdGhlIGFycm93cyB3b3VsZCBuYXR1cmFsbHkgYXBwZWFyXHJcblx0XHRcdFx0Ly8gYXQgdGhlIHRvcCBvciB0aGUgYm90dG9tIG9mIHRoZSBiYXI/XHJcblx0XHRcdFx0aWYgKHAgPT0gXCJvc1wiKSB7XHJcblx0XHRcdFx0XHRwID0gL01hYy8udGVzdChuYXZpZ2F0b3IucGxhdGZvcm0pID8gXCJhZnRlclwiIDogXCJzcGxpdFwiO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZiAocCA9PSBwMSkge1xyXG5cdFx0XHRcdFx0cDIgPSBwO1xyXG5cdFx0XHRcdH0gZWxzZSBpZiAocCA9PSBwMikge1xyXG5cdFx0XHRcdFx0cDEgPSBwO1xyXG5cdFx0XHRcdFx0YVRlbXAgPSBhMTtcclxuXHRcdFx0XHRcdGExID0gYTI7XHJcblx0XHRcdFx0XHRhMiA9IGFUZW1wO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0ZWxlW3AxXShhMSlbcDJdKGEyKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0ZnVuY3Rpb24gZ2V0QXJyb3dTY3JvbGwoZGlyWCwgZGlyWSwgZWxlKVxyXG5cdFx0XHR7XHJcblx0XHRcdFx0cmV0dXJuIGZ1bmN0aW9uKClcclxuXHRcdFx0XHR7XHJcblx0XHRcdFx0XHRhcnJvd1Njcm9sbChkaXJYLCBkaXJZLCB0aGlzLCBlbGUpO1xyXG5cdFx0XHRcdFx0dGhpcy5ibHVyKCk7XHJcblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHRcdFx0fTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0ZnVuY3Rpb24gYXJyb3dTY3JvbGwoZGlyWCwgZGlyWSwgYXJyb3csIGVsZSlcclxuXHRcdFx0e1xyXG5cdFx0XHRcdGFycm93ID0gJChhcnJvdykuYWRkQ2xhc3MoJ2pzcEFjdGl2ZScpO1xyXG5cclxuXHRcdFx0XHR2YXIgZXZlLFxyXG5cdFx0XHRcdFx0c2Nyb2xsVGltZW91dCxcclxuXHRcdFx0XHRcdGlzRmlyc3QgPSB0cnVlLFxyXG5cdFx0XHRcdFx0ZG9TY3JvbGwgPSBmdW5jdGlvbigpXHJcblx0XHRcdFx0XHR7XHJcblx0XHRcdFx0XHRcdGlmIChkaXJYICE9PSAwKSB7XHJcblx0XHRcdFx0XHRcdFx0anNwLnNjcm9sbEJ5WChkaXJYICogc2V0dGluZ3MuYXJyb3dCdXR0b25TcGVlZCk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0aWYgKGRpclkgIT09IDApIHtcclxuXHRcdFx0XHRcdFx0XHRqc3Auc2Nyb2xsQnlZKGRpclkgKiBzZXR0aW5ncy5hcnJvd0J1dHRvblNwZWVkKTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRzY3JvbGxUaW1lb3V0ID0gc2V0VGltZW91dChkb1Njcm9sbCwgaXNGaXJzdCA/IHNldHRpbmdzLmluaXRpYWxEZWxheSA6IHNldHRpbmdzLmFycm93UmVwZWF0RnJlcSk7XHJcblx0XHRcdFx0XHRcdGlzRmlyc3QgPSBmYWxzZTtcclxuXHRcdFx0XHRcdH07XHJcblxyXG5cdFx0XHRcdGRvU2Nyb2xsKCk7XHJcblxyXG5cdFx0XHRcdGV2ZSA9IGVsZSA/ICdtb3VzZW91dC5qc3AnIDogJ21vdXNldXAuanNwJztcclxuXHRcdFx0XHRlbGUgPSBlbGUgfHwgJCgnaHRtbCcpO1xyXG5cdFx0XHRcdGVsZS5vbihcclxuXHRcdFx0XHRcdGV2ZSxcclxuXHRcdFx0XHRcdGZ1bmN0aW9uKClcclxuXHRcdFx0XHRcdHtcclxuXHRcdFx0XHRcdFx0YXJyb3cucmVtb3ZlQ2xhc3MoJ2pzcEFjdGl2ZScpO1xyXG5cdFx0XHRcdFx0XHRpZihzY3JvbGxUaW1lb3V0KSB7XHJcbiAgICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHNjcm9sbFRpbWVvdXQpO1xyXG4gICAgICAgICAgICB9XHJcblx0XHRcdFx0XHRcdHNjcm9sbFRpbWVvdXQgPSBudWxsO1xyXG5cdFx0XHRcdFx0XHRlbGUub2ZmKGV2ZSk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0KTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0ZnVuY3Rpb24gaW5pdENsaWNrT25UcmFjaygpXHJcblx0XHRcdHtcclxuXHRcdFx0XHRyZW1vdmVDbGlja09uVHJhY2soKTtcclxuXHRcdFx0XHRpZiAoaXNTY3JvbGxhYmxlVikge1xyXG5cdFx0XHRcdFx0dmVydGljYWxUcmFjay5vbihcclxuXHRcdFx0XHRcdFx0J21vdXNlZG93bi5qc3AnLFxyXG5cdFx0XHRcdFx0XHRmdW5jdGlvbihlKVxyXG5cdFx0XHRcdFx0XHR7XHJcblx0XHRcdFx0XHRcdFx0aWYgKGUub3JpZ2luYWxUYXJnZXQgPT09IHVuZGVmaW5lZCB8fCBlLm9yaWdpbmFsVGFyZ2V0ID09IGUuY3VycmVudFRhcmdldCkge1xyXG5cdFx0XHRcdFx0XHRcdFx0dmFyIGNsaWNrZWRUcmFjayA9ICQodGhpcyksXHJcblx0XHRcdFx0XHRcdFx0XHRcdG9mZnNldCA9IGNsaWNrZWRUcmFjay5vZmZzZXQoKSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0ZGlyZWN0aW9uID0gZS5wYWdlWSAtIG9mZnNldC50b3AgLSB2ZXJ0aWNhbERyYWdQb3NpdGlvbixcclxuXHRcdFx0XHRcdFx0XHRcdFx0c2Nyb2xsVGltZW91dCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0aXNGaXJzdCA9IHRydWUsXHJcblx0XHRcdFx0XHRcdFx0XHRcdGRvU2Nyb2xsID0gZnVuY3Rpb24oKVxyXG5cdFx0XHRcdFx0XHRcdFx0XHR7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0dmFyIG9mZnNldCA9IGNsaWNrZWRUcmFjay5vZmZzZXQoKSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdHBvcyA9IGUucGFnZVkgLSBvZmZzZXQudG9wIC0gdmVydGljYWxEcmFnSGVpZ2h0IC8gMixcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGNvbnRlbnREcmFnWSA9IHBhbmVIZWlnaHQgKiBzZXR0aW5ncy5zY3JvbGxQYWdlUGVyY2VudCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGRyYWdZID0gZHJhZ01heFkgKiBjb250ZW50RHJhZ1kgLyAoY29udGVudEhlaWdodCAtIHBhbmVIZWlnaHQpO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlmIChkaXJlY3Rpb24gPCAwKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZiAodmVydGljYWxEcmFnUG9zaXRpb24gLSBkcmFnWSA+IHBvcykge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRqc3Auc2Nyb2xsQnlZKC1jb250ZW50RHJhZ1kpO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0cG9zaXRpb25EcmFnWShwb3MpO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdH0gZWxzZSBpZiAoZGlyZWN0aW9uID4gMCkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgKHZlcnRpY2FsRHJhZ1Bvc2l0aW9uICsgZHJhZ1kgPCBwb3MpIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0anNwLnNjcm9sbEJ5WShjb250ZW50RHJhZ1kpO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0cG9zaXRpb25EcmFnWShwb3MpO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRjYW5jZWxDbGljaygpO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRzY3JvbGxUaW1lb3V0ID0gc2V0VGltZW91dChkb1Njcm9sbCwgaXNGaXJzdCA/IHNldHRpbmdzLmluaXRpYWxEZWxheSA6IHNldHRpbmdzLnRyYWNrQ2xpY2tSZXBlYXRGcmVxKTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpc0ZpcnN0ID0gZmFsc2U7XHJcblx0XHRcdFx0XHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHRcdFx0XHRcdGNhbmNlbENsaWNrID0gZnVuY3Rpb24oKVxyXG5cdFx0XHRcdFx0XHRcdFx0XHR7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWYoc2Nyb2xsVGltZW91dCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHNjcm9sbFRpbWVvdXQpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRzY3JvbGxUaW1lb3V0ID0gbnVsbDtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHQkKGRvY3VtZW50KS5vZmYoJ21vdXNldXAuanNwJywgY2FuY2VsQ2xpY2spO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHR9O1xyXG5cdFx0XHRcdFx0XHRcdFx0ZG9TY3JvbGwoKTtcclxuXHRcdFx0XHRcdFx0XHRcdCQoZG9jdW1lbnQpLm9uKCdtb3VzZXVwLmpzcCcsIGNhbmNlbENsaWNrKTtcclxuXHRcdFx0XHRcdFx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdCk7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRpZiAoaXNTY3JvbGxhYmxlSCkge1xyXG5cdFx0XHRcdFx0aG9yaXpvbnRhbFRyYWNrLm9uKFxyXG5cdFx0XHRcdFx0XHQnbW91c2Vkb3duLmpzcCcsXHJcblx0XHRcdFx0XHRcdGZ1bmN0aW9uKGUpXHJcblx0XHRcdFx0XHRcdHtcclxuXHRcdFx0XHRcdFx0XHRpZiAoZS5vcmlnaW5hbFRhcmdldCA9PT0gdW5kZWZpbmVkIHx8IGUub3JpZ2luYWxUYXJnZXQgPT0gZS5jdXJyZW50VGFyZ2V0KSB7XHJcblx0XHRcdFx0XHRcdFx0XHR2YXIgY2xpY2tlZFRyYWNrID0gJCh0aGlzKSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0b2Zmc2V0ID0gY2xpY2tlZFRyYWNrLm9mZnNldCgpLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRkaXJlY3Rpb24gPSBlLnBhZ2VYIC0gb2Zmc2V0LmxlZnQgLSBob3Jpem9udGFsRHJhZ1Bvc2l0aW9uLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRzY3JvbGxUaW1lb3V0LFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRpc0ZpcnN0ID0gdHJ1ZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0ZG9TY3JvbGwgPSBmdW5jdGlvbigpXHJcblx0XHRcdFx0XHRcdFx0XHRcdHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHR2YXIgb2Zmc2V0ID0gY2xpY2tlZFRyYWNrLm9mZnNldCgpLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0cG9zID0gZS5wYWdlWCAtIG9mZnNldC5sZWZ0IC0gaG9yaXpvbnRhbERyYWdXaWR0aCAvIDIsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRjb250ZW50RHJhZ1ggPSBwYW5lV2lkdGggKiBzZXR0aW5ncy5zY3JvbGxQYWdlUGVyY2VudCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGRyYWdYID0gZHJhZ01heFggKiBjb250ZW50RHJhZ1ggLyAoY29udGVudFdpZHRoIC0gcGFuZVdpZHRoKTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZiAoZGlyZWN0aW9uIDwgMCkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgKGhvcml6b250YWxEcmFnUG9zaXRpb24gLSBkcmFnWCA+IHBvcykge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRqc3Auc2Nyb2xsQnlYKC1jb250ZW50RHJhZ1gpO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0cG9zaXRpb25EcmFnWChwb3MpO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdH0gZWxzZSBpZiAoZGlyZWN0aW9uID4gMCkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgKGhvcml6b250YWxEcmFnUG9zaXRpb24gKyBkcmFnWCA8IHBvcykge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRqc3Auc2Nyb2xsQnlYKGNvbnRlbnREcmFnWCk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRwb3NpdGlvbkRyYWdYKHBvcyk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGNhbmNlbENsaWNrKCk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHNjcm9sbFRpbWVvdXQgPSBzZXRUaW1lb3V0KGRvU2Nyb2xsLCBpc0ZpcnN0ID8gc2V0dGluZ3MuaW5pdGlhbERlbGF5IDogc2V0dGluZ3MudHJhY2tDbGlja1JlcGVhdEZyZXEpO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlzRmlyc3QgPSBmYWxzZTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0Y2FuY2VsQ2xpY2sgPSBmdW5jdGlvbigpXHJcblx0XHRcdFx0XHRcdFx0XHRcdHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZihzY3JvbGxUaW1lb3V0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICBjbGVhclRpbWVvdXQoc2Nyb2xsVGltZW91dCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHNjcm9sbFRpbWVvdXQgPSBudWxsO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdCQoZG9jdW1lbnQpLm9mZignbW91c2V1cC5qc3AnLCBjYW5jZWxDbGljayk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdH07XHJcblx0XHRcdFx0XHRcdFx0XHRkb1Njcm9sbCgpO1xyXG5cdFx0XHRcdFx0XHRcdFx0JChkb2N1bWVudCkub24oJ21vdXNldXAuanNwJywgY2FuY2VsQ2xpY2spO1xyXG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGZ1bmN0aW9uIHJlbW92ZUNsaWNrT25UcmFjaygpXHJcblx0XHRcdHtcclxuXHRcdFx0XHRpZiAoaG9yaXpvbnRhbFRyYWNrKSB7XHJcblx0XHRcdFx0XHRob3Jpem9udGFsVHJhY2sub2ZmKCdtb3VzZWRvd24uanNwJyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmICh2ZXJ0aWNhbFRyYWNrKSB7XHJcblx0XHRcdFx0XHR2ZXJ0aWNhbFRyYWNrLm9mZignbW91c2Vkb3duLmpzcCcpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0ZnVuY3Rpb24gY2FuY2VsRHJhZygpXHJcblx0XHRcdHtcclxuXHRcdFx0XHQkKCdodG1sJykub2ZmKCdkcmFnc3RhcnQuanNwIHNlbGVjdHN0YXJ0LmpzcCBtb3VzZW1vdmUuanNwIG1vdXNldXAuanNwIG1vdXNlbGVhdmUuanNwJyk7XHJcblxyXG5cdFx0XHRcdGlmICh2ZXJ0aWNhbERyYWcpIHtcclxuXHRcdFx0XHRcdHZlcnRpY2FsRHJhZy5yZW1vdmVDbGFzcygnanNwQWN0aXZlJyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmIChob3Jpem9udGFsRHJhZykge1xyXG5cdFx0XHRcdFx0aG9yaXpvbnRhbERyYWcucmVtb3ZlQ2xhc3MoJ2pzcEFjdGl2ZScpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0ZnVuY3Rpb24gcG9zaXRpb25EcmFnWShkZXN0WSwgYW5pbWF0ZSlcclxuXHRcdFx0e1xyXG5cdFx0XHRcdGlmICghaXNTY3JvbGxhYmxlVikge1xyXG5cdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZiAoZGVzdFkgPCAwKSB7XHJcblx0XHRcdFx0XHRkZXN0WSA9IDA7XHJcblx0XHRcdFx0fSBlbHNlIGlmIChkZXN0WSA+IGRyYWdNYXhZKSB7XHJcblx0XHRcdFx0XHRkZXN0WSA9IGRyYWdNYXhZO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0Ly8gYWxsb3cgZm9yIGRldnMgdG8gcHJldmVudCB0aGUgSlNQIGZyb20gYmVpbmcgc2Nyb2xsZWRcclxuXHRcdFx0XHR2YXIgd2lsbFNjcm9sbFlFdmVudCA9IG5ldyAkLkV2ZW50KFwianNwLXdpbGwtc2Nyb2xsLXlcIik7XHJcblx0XHRcdFx0ZWxlbS50cmlnZ2VyKHdpbGxTY3JvbGxZRXZlbnQsIFtkZXN0WV0pO1xyXG5cclxuXHRcdFx0XHRpZiAod2lsbFNjcm9sbFlFdmVudC5pc0RlZmF1bHRQcmV2ZW50ZWQoKSkge1xyXG5cdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0dmFyIHRtcFZlcnRpY2FsRHJhZ1Bvc2l0aW9uID0gZGVzdFkgfHwgMDtcclxuXHJcblx0XHRcdFx0dmFyIGlzQXRUb3AgPSB0bXBWZXJ0aWNhbERyYWdQb3NpdGlvbiA9PT0gMCxcclxuXHRcdFx0XHRcdGlzQXRCb3R0b20gPSB0bXBWZXJ0aWNhbERyYWdQb3NpdGlvbiA9PSBkcmFnTWF4WSxcclxuXHRcdFx0XHRcdHBlcmNlbnRTY3JvbGxlZCA9IGRlc3RZLyBkcmFnTWF4WSxcclxuXHRcdFx0XHRcdGRlc3RUb3AgPSAtcGVyY2VudFNjcm9sbGVkICogKGNvbnRlbnRIZWlnaHQgLSBwYW5lSGVpZ2h0KTtcclxuXHJcblx0XHRcdFx0Ly8gY2FuJ3QganVzdCBjaGVjayBpZihhbmltYXRlKSBiZWNhdXNlIGZhbHNlIGlzIGEgdmFsaWQgdmFsdWUgdGhhdCBjb3VsZCBiZSBwYXNzZWQgaW4uLi5cclxuXHRcdFx0XHRpZiAoYW5pbWF0ZSA9PT0gdW5kZWZpbmVkKSB7XHJcblx0XHRcdFx0XHRhbmltYXRlID0gc2V0dGluZ3MuYW5pbWF0ZVNjcm9sbDtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYgKGFuaW1hdGUpIHtcclxuXHRcdFx0XHRcdGpzcC5hbmltYXRlKHZlcnRpY2FsRHJhZywgJ3RvcCcsIGRlc3RZLFx0X3Bvc2l0aW9uRHJhZ1ksIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0XHRlbGVtLnRyaWdnZXIoJ2pzcC11c2VyLXNjcm9sbC15JywgWy1kZXN0VG9wLCBpc0F0VG9wLCBpc0F0Qm90dG9tXSk7XHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0dmVydGljYWxEcmFnLmNzcygndG9wJywgZGVzdFkpO1xyXG5cdFx0XHRcdFx0X3Bvc2l0aW9uRHJhZ1koZGVzdFkpO1xyXG5cdFx0XHRcdFx0ZWxlbS50cmlnZ2VyKCdqc3AtdXNlci1zY3JvbGwteScsIFstZGVzdFRvcCwgaXNBdFRvcCwgaXNBdEJvdHRvbV0pO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGZ1bmN0aW9uIF9wb3NpdGlvbkRyYWdZKGRlc3RZKVxyXG5cdFx0XHR7XHJcblx0XHRcdFx0aWYgKGRlc3RZID09PSB1bmRlZmluZWQpIHtcclxuXHRcdFx0XHRcdGRlc3RZID0gdmVydGljYWxEcmFnLnBvc2l0aW9uKCkudG9wO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0Y29udGFpbmVyLnNjcm9sbFRvcCgwKTtcclxuXHRcdFx0XHR2ZXJ0aWNhbERyYWdQb3NpdGlvbiA9IGRlc3RZIHx8IDA7XHJcblxyXG5cdFx0XHRcdHZhciBpc0F0VG9wID0gdmVydGljYWxEcmFnUG9zaXRpb24gPT09IDAsXHJcblx0XHRcdFx0XHRpc0F0Qm90dG9tID0gdmVydGljYWxEcmFnUG9zaXRpb24gPT0gZHJhZ01heFksXHJcblx0XHRcdFx0XHRwZXJjZW50U2Nyb2xsZWQgPSBkZXN0WS8gZHJhZ01heFksXHJcblx0XHRcdFx0XHRkZXN0VG9wID0gLXBlcmNlbnRTY3JvbGxlZCAqIChjb250ZW50SGVpZ2h0IC0gcGFuZUhlaWdodCk7XHJcblxyXG5cdFx0XHRcdGlmICh3YXNBdFRvcCAhPSBpc0F0VG9wIHx8IHdhc0F0Qm90dG9tICE9IGlzQXRCb3R0b20pIHtcclxuXHRcdFx0XHRcdHdhc0F0VG9wID0gaXNBdFRvcDtcclxuXHRcdFx0XHRcdHdhc0F0Qm90dG9tID0gaXNBdEJvdHRvbTtcclxuXHRcdFx0XHRcdGVsZW0udHJpZ2dlcignanNwLWFycm93LWNoYW5nZScsIFt3YXNBdFRvcCwgd2FzQXRCb3R0b20sIHdhc0F0TGVmdCwgd2FzQXRSaWdodF0pO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0dXBkYXRlVmVydGljYWxBcnJvd3MoaXNBdFRvcCwgaXNBdEJvdHRvbSk7XHJcblx0XHRcdFx0cGFuZS5jc3MoJ3RvcCcsIGRlc3RUb3ApO1xyXG5cdFx0XHRcdGVsZW0udHJpZ2dlcignanNwLXNjcm9sbC15JywgWy1kZXN0VG9wLCBpc0F0VG9wLCBpc0F0Qm90dG9tXSkudHJpZ2dlcignc2Nyb2xsJyk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGZ1bmN0aW9uIHBvc2l0aW9uRHJhZ1goZGVzdFgsIGFuaW1hdGUpXHJcblx0XHRcdHtcclxuXHRcdFx0XHRpZiAoIWlzU2Nyb2xsYWJsZUgpIHtcclxuXHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYgKGRlc3RYIDwgMCkge1xyXG5cdFx0XHRcdFx0ZGVzdFggPSAwO1xyXG5cdFx0XHRcdH0gZWxzZSBpZiAoZGVzdFggPiBkcmFnTWF4WCkge1xyXG5cdFx0XHRcdFx0ZGVzdFggPSBkcmFnTWF4WDtcclxuXHRcdFx0XHR9XHJcblxyXG5cclxuXHRcdFx0XHQvLyBhbGxvdyBmb3IgZGV2cyB0byBwcmV2ZW50IHRoZSBKU1AgZnJvbSBiZWluZyBzY3JvbGxlZFxyXG5cdFx0XHRcdHZhciB3aWxsU2Nyb2xsWEV2ZW50ID0gbmV3ICQuRXZlbnQoXCJqc3Atd2lsbC1zY3JvbGwteFwiKTtcclxuXHRcdFx0XHRlbGVtLnRyaWdnZXIod2lsbFNjcm9sbFhFdmVudCwgW2Rlc3RYXSk7XHJcblxyXG5cdFx0XHRcdGlmICh3aWxsU2Nyb2xsWEV2ZW50LmlzRGVmYXVsdFByZXZlbnRlZCgpKSB7XHJcblx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHR2YXIgdG1wSG9yaXpvbnRhbERyYWdQb3NpdGlvbiA9IGRlc3RYIHx8MDtcclxuXHJcblx0XHRcdFx0dmFyIGlzQXRMZWZ0ID0gdG1wSG9yaXpvbnRhbERyYWdQb3NpdGlvbiA9PT0gMCxcclxuXHRcdFx0XHRcdGlzQXRSaWdodCA9IHRtcEhvcml6b250YWxEcmFnUG9zaXRpb24gPT0gZHJhZ01heFgsXHJcblx0XHRcdFx0XHRwZXJjZW50U2Nyb2xsZWQgPSBkZXN0WCAvIGRyYWdNYXhYLFxyXG5cdFx0XHRcdFx0ZGVzdExlZnQgPSAtcGVyY2VudFNjcm9sbGVkICogKGNvbnRlbnRXaWR0aCAtIHBhbmVXaWR0aCk7XHJcblxyXG5cdFx0XHRcdGlmIChhbmltYXRlID09PSB1bmRlZmluZWQpIHtcclxuXHRcdFx0XHRcdGFuaW1hdGUgPSBzZXR0aW5ncy5hbmltYXRlU2Nyb2xsO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZiAoYW5pbWF0ZSkge1xyXG5cdFx0XHRcdFx0anNwLmFuaW1hdGUoaG9yaXpvbnRhbERyYWcsICdsZWZ0JywgZGVzdFgsXHRfcG9zaXRpb25EcmFnWCwgZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0XHRcdGVsZW0udHJpZ2dlcignanNwLXVzZXItc2Nyb2xsLXgnLCBbLWRlc3RMZWZ0LCBpc0F0TGVmdCwgaXNBdFJpZ2h0XSk7XHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0aG9yaXpvbnRhbERyYWcuY3NzKCdsZWZ0JywgZGVzdFgpO1xyXG5cdFx0XHRcdFx0X3Bvc2l0aW9uRHJhZ1goZGVzdFgpO1xyXG5cdFx0XHRcdFx0ZWxlbS50cmlnZ2VyKCdqc3AtdXNlci1zY3JvbGwteCcsIFstZGVzdExlZnQsIGlzQXRMZWZ0LCBpc0F0UmlnaHRdKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGZ1bmN0aW9uIF9wb3NpdGlvbkRyYWdYKGRlc3RYKVxyXG5cdFx0XHR7XHJcblx0XHRcdFx0aWYgKGRlc3RYID09PSB1bmRlZmluZWQpIHtcclxuXHRcdFx0XHRcdGRlc3RYID0gaG9yaXpvbnRhbERyYWcucG9zaXRpb24oKS5sZWZ0O1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0Y29udGFpbmVyLnNjcm9sbFRvcCgwKTtcclxuXHRcdFx0XHRob3Jpem9udGFsRHJhZ1Bvc2l0aW9uID0gZGVzdFggfHwwO1xyXG5cclxuXHRcdFx0XHR2YXIgaXNBdExlZnQgPSBob3Jpem9udGFsRHJhZ1Bvc2l0aW9uID09PSAwLFxyXG5cdFx0XHRcdFx0aXNBdFJpZ2h0ID0gaG9yaXpvbnRhbERyYWdQb3NpdGlvbiA9PSBkcmFnTWF4WCxcclxuXHRcdFx0XHRcdHBlcmNlbnRTY3JvbGxlZCA9IGRlc3RYIC8gZHJhZ01heFgsXHJcblx0XHRcdFx0XHRkZXN0TGVmdCA9IC1wZXJjZW50U2Nyb2xsZWQgKiAoY29udGVudFdpZHRoIC0gcGFuZVdpZHRoKTtcclxuXHJcblx0XHRcdFx0aWYgKHdhc0F0TGVmdCAhPSBpc0F0TGVmdCB8fCB3YXNBdFJpZ2h0ICE9IGlzQXRSaWdodCkge1xyXG5cdFx0XHRcdFx0d2FzQXRMZWZ0ID0gaXNBdExlZnQ7XHJcblx0XHRcdFx0XHR3YXNBdFJpZ2h0ID0gaXNBdFJpZ2h0O1xyXG5cdFx0XHRcdFx0ZWxlbS50cmlnZ2VyKCdqc3AtYXJyb3ctY2hhbmdlJywgW3dhc0F0VG9wLCB3YXNBdEJvdHRvbSwgd2FzQXRMZWZ0LCB3YXNBdFJpZ2h0XSk7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHR1cGRhdGVIb3Jpem9udGFsQXJyb3dzKGlzQXRMZWZ0LCBpc0F0UmlnaHQpO1xyXG5cdFx0XHRcdHBhbmUuY3NzKCdsZWZ0JywgZGVzdExlZnQpO1xyXG5cdFx0XHRcdGVsZW0udHJpZ2dlcignanNwLXNjcm9sbC14JywgWy1kZXN0TGVmdCwgaXNBdExlZnQsIGlzQXRSaWdodF0pLnRyaWdnZXIoJ3Njcm9sbCcpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRmdW5jdGlvbiB1cGRhdGVWZXJ0aWNhbEFycm93cyhpc0F0VG9wLCBpc0F0Qm90dG9tKVxyXG5cdFx0XHR7XHJcblx0XHRcdFx0aWYgKHNldHRpbmdzLnNob3dBcnJvd3MpIHtcclxuXHRcdFx0XHRcdGFycm93VXBbaXNBdFRvcCA/ICdhZGRDbGFzcycgOiAncmVtb3ZlQ2xhc3MnXSgnanNwRGlzYWJsZWQnKTtcclxuXHRcdFx0XHRcdGFycm93RG93bltpc0F0Qm90dG9tID8gJ2FkZENsYXNzJyA6ICdyZW1vdmVDbGFzcyddKCdqc3BEaXNhYmxlZCcpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0ZnVuY3Rpb24gdXBkYXRlSG9yaXpvbnRhbEFycm93cyhpc0F0TGVmdCwgaXNBdFJpZ2h0KVxyXG5cdFx0XHR7XHJcblx0XHRcdFx0aWYgKHNldHRpbmdzLnNob3dBcnJvd3MpIHtcclxuXHRcdFx0XHRcdGFycm93TGVmdFtpc0F0TGVmdCA/ICdhZGRDbGFzcycgOiAncmVtb3ZlQ2xhc3MnXSgnanNwRGlzYWJsZWQnKTtcclxuXHRcdFx0XHRcdGFycm93UmlnaHRbaXNBdFJpZ2h0ID8gJ2FkZENsYXNzJyA6ICdyZW1vdmVDbGFzcyddKCdqc3BEaXNhYmxlZCcpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0ZnVuY3Rpb24gc2Nyb2xsVG9ZKGRlc3RZLCBhbmltYXRlKVxyXG5cdFx0XHR7XHJcblx0XHRcdFx0dmFyIHBlcmNlbnRTY3JvbGxlZCA9IGRlc3RZIC8gKGNvbnRlbnRIZWlnaHQgLSBwYW5lSGVpZ2h0KTtcclxuXHRcdFx0XHRwb3NpdGlvbkRyYWdZKHBlcmNlbnRTY3JvbGxlZCAqIGRyYWdNYXhZLCBhbmltYXRlKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0ZnVuY3Rpb24gc2Nyb2xsVG9YKGRlc3RYLCBhbmltYXRlKVxyXG5cdFx0XHR7XHJcblx0XHRcdFx0dmFyIHBlcmNlbnRTY3JvbGxlZCA9IGRlc3RYIC8gKGNvbnRlbnRXaWR0aCAtIHBhbmVXaWR0aCk7XHJcblx0XHRcdFx0cG9zaXRpb25EcmFnWChwZXJjZW50U2Nyb2xsZWQgKiBkcmFnTWF4WCwgYW5pbWF0ZSk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGZ1bmN0aW9uIHNjcm9sbFRvRWxlbWVudChlbGUsIHN0aWNrVG9Ub3AsIGFuaW1hdGUpXHJcblx0XHRcdHtcclxuXHRcdFx0XHR2YXIgZSwgZWxlSGVpZ2h0LCBlbGVXaWR0aCwgZWxlVG9wID0gMCwgZWxlTGVmdCA9IDAsIHZpZXdwb3J0VG9wLCB2aWV3cG9ydExlZnQsIG1heFZpc2libGVFbGVUb3AsIG1heFZpc2libGVFbGVMZWZ0LCBkZXN0WSwgZGVzdFg7XHJcblxyXG5cdFx0XHRcdC8vIExlZ2FsIGhhc2ggdmFsdWVzIGFyZW4ndCBuZWNlc3NhcmlseSBsZWdhbCBqUXVlcnkgc2VsZWN0b3JzIHNvIHdlIG5lZWQgdG8gY2F0Y2ggYW55XHJcblx0XHRcdFx0Ly8gZXJyb3JzIGZyb20gdGhlIGxvb2t1cC4uLlxyXG5cdFx0XHRcdHRyeSB7XHJcblx0XHRcdFx0XHRlID0gJChlbGUpO1xyXG5cdFx0XHRcdH0gY2F0Y2ggKGVycikge1xyXG5cdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRlbGVIZWlnaHQgPSBlLm91dGVySGVpZ2h0KCk7XHJcblx0XHRcdFx0ZWxlV2lkdGg9IGUub3V0ZXJXaWR0aCgpO1xyXG5cclxuXHRcdFx0XHRjb250YWluZXIuc2Nyb2xsVG9wKDApO1xyXG5cdFx0XHRcdGNvbnRhaW5lci5zY3JvbGxMZWZ0KDApO1xyXG5cclxuXHRcdFx0XHQvLyBsb29wIHRocm91Z2ggcGFyZW50cyBhZGRpbmcgdGhlIG9mZnNldCB0b3Agb2YgYW55IGVsZW1lbnRzIHRoYXQgYXJlIHJlbGF0aXZlbHkgcG9zaXRpb25lZCBiZXR3ZWVuXHJcblx0XHRcdFx0Ly8gdGhlIGZvY3VzZWQgZWxlbWVudCBhbmQgdGhlIGpzcFBhbmUgc28gd2UgY2FuIGdldCB0aGUgdHJ1ZSBkaXN0YW5jZSBmcm9tIHRoZSB0b3BcclxuXHRcdFx0XHQvLyBvZiB0aGUgZm9jdXNlZCBlbGVtZW50IHRvIHRoZSB0b3Agb2YgdGhlIHNjcm9sbHBhbmUuLi5cclxuXHRcdFx0XHR3aGlsZSAoIWUuaXMoJy5qc3BQYW5lJykpIHtcclxuXHRcdFx0XHRcdGVsZVRvcCArPSBlLnBvc2l0aW9uKCkudG9wO1xyXG5cdFx0XHRcdFx0ZWxlTGVmdCArPSBlLnBvc2l0aW9uKCkubGVmdDtcclxuXHRcdFx0XHRcdGUgPSBlLm9mZnNldFBhcmVudCgpO1xyXG5cdFx0XHRcdFx0aWYgKC9eYm9keXxodG1sJC9pLnRlc3QoZVswXS5ub2RlTmFtZSkpIHtcclxuXHRcdFx0XHRcdFx0Ly8gd2UgZW5kZWQgdXAgdG9vIGhpZ2ggaW4gdGhlIGRvY3VtZW50IHN0cnVjdHVyZS4gUXVpdCFcclxuXHRcdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0dmlld3BvcnRUb3AgPSBjb250ZW50UG9zaXRpb25ZKCk7XHJcblx0XHRcdFx0bWF4VmlzaWJsZUVsZVRvcCA9IHZpZXdwb3J0VG9wICsgcGFuZUhlaWdodDtcclxuXHRcdFx0XHRpZiAoZWxlVG9wIDwgdmlld3BvcnRUb3AgfHwgc3RpY2tUb1RvcCkgeyAvLyBlbGVtZW50IGlzIGFib3ZlIHZpZXdwb3J0XHJcblx0XHRcdFx0XHRkZXN0WSA9IGVsZVRvcCAtIHNldHRpbmdzLmhvcml6b250YWxHdXR0ZXI7XHJcblx0XHRcdFx0fSBlbHNlIGlmIChlbGVUb3AgKyBlbGVIZWlnaHQgPiBtYXhWaXNpYmxlRWxlVG9wKSB7IC8vIGVsZW1lbnQgaXMgYmVsb3cgdmlld3BvcnRcclxuXHRcdFx0XHRcdGRlc3RZID0gZWxlVG9wIC0gcGFuZUhlaWdodCArIGVsZUhlaWdodCArIHNldHRpbmdzLmhvcml6b250YWxHdXR0ZXI7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmICghaXNOYU4oZGVzdFkpKSB7XHJcblx0XHRcdFx0XHRzY3JvbGxUb1koZGVzdFksIGFuaW1hdGUpO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0dmlld3BvcnRMZWZ0ID0gY29udGVudFBvc2l0aW9uWCgpO1xyXG5cdCAgICAgICAgICAgIG1heFZpc2libGVFbGVMZWZ0ID0gdmlld3BvcnRMZWZ0ICsgcGFuZVdpZHRoO1xyXG5cdCAgICAgICAgICAgIGlmIChlbGVMZWZ0IDwgdmlld3BvcnRMZWZ0IHx8IHN0aWNrVG9Ub3ApIHsgLy8gZWxlbWVudCBpcyB0byB0aGUgbGVmdCBvZiB2aWV3cG9ydFxyXG5cdCAgICAgICAgICAgICAgICBkZXN0WCA9IGVsZUxlZnQgLSBzZXR0aW5ncy5ob3Jpem9udGFsR3V0dGVyO1xyXG5cdCAgICAgICAgICAgIH0gZWxzZSBpZiAoZWxlTGVmdCArIGVsZVdpZHRoID4gbWF4VmlzaWJsZUVsZUxlZnQpIHsgLy8gZWxlbWVudCBpcyB0byB0aGUgcmlnaHQgdmlld3BvcnRcclxuXHQgICAgICAgICAgICAgICAgZGVzdFggPSBlbGVMZWZ0IC0gcGFuZVdpZHRoICsgZWxlV2lkdGggKyBzZXR0aW5ncy5ob3Jpem9udGFsR3V0dGVyO1xyXG5cdCAgICAgICAgICAgIH1cclxuXHQgICAgICAgICAgICBpZiAoIWlzTmFOKGRlc3RYKSkge1xyXG5cdCAgICAgICAgICAgICAgICBzY3JvbGxUb1goZGVzdFgsIGFuaW1hdGUpO1xyXG5cdCAgICAgICAgICAgIH1cclxuXHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGZ1bmN0aW9uIGNvbnRlbnRQb3NpdGlvblgoKVxyXG5cdFx0XHR7XHJcblx0XHRcdFx0cmV0dXJuIC1wYW5lLnBvc2l0aW9uKCkubGVmdDtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0ZnVuY3Rpb24gY29udGVudFBvc2l0aW9uWSgpXHJcblx0XHRcdHtcclxuXHRcdFx0XHRyZXR1cm4gLXBhbmUucG9zaXRpb24oKS50b3A7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGZ1bmN0aW9uIGlzQ2xvc2VUb0JvdHRvbSgpXHJcblx0XHRcdHtcclxuXHRcdFx0XHR2YXIgc2Nyb2xsYWJsZUhlaWdodCA9IGNvbnRlbnRIZWlnaHQgLSBwYW5lSGVpZ2h0O1xyXG5cdFx0XHRcdHJldHVybiAoc2Nyb2xsYWJsZUhlaWdodCA+IDIwKSAmJiAoc2Nyb2xsYWJsZUhlaWdodCAtIGNvbnRlbnRQb3NpdGlvblkoKSA8IDEwKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0ZnVuY3Rpb24gaXNDbG9zZVRvUmlnaHQoKVxyXG5cdFx0XHR7XHJcblx0XHRcdFx0dmFyIHNjcm9sbGFibGVXaWR0aCA9IGNvbnRlbnRXaWR0aCAtIHBhbmVXaWR0aDtcclxuXHRcdFx0XHRyZXR1cm4gKHNjcm9sbGFibGVXaWR0aCA+IDIwKSAmJiAoc2Nyb2xsYWJsZVdpZHRoIC0gY29udGVudFBvc2l0aW9uWCgpIDwgMTApO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRmdW5jdGlvbiBpbml0TW91c2V3aGVlbCgpXHJcblx0XHRcdHtcclxuXHRcdFx0XHRjb250YWluZXIub2ZmKG13RXZlbnQpLm9uKFxyXG5cdFx0XHRcdFx0bXdFdmVudCxcclxuXHRcdFx0XHRcdGZ1bmN0aW9uIChldmVudCwgZGVsdGEsIGRlbHRhWCwgZGVsdGFZKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWhvcml6b250YWxEcmFnUG9zaXRpb24pIGhvcml6b250YWxEcmFnUG9zaXRpb24gPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXZlcnRpY2FsRHJhZ1Bvc2l0aW9uKSB2ZXJ0aWNhbERyYWdQb3NpdGlvbiA9IDA7XHJcblxyXG5cdFx0XHRcdFx0XHR2YXIgZFggPSBob3Jpem9udGFsRHJhZ1Bvc2l0aW9uLCBkWSA9IHZlcnRpY2FsRHJhZ1Bvc2l0aW9uLCBmYWN0b3IgPSBldmVudC5kZWx0YUZhY3RvciB8fCBzZXR0aW5ncy5tb3VzZVdoZWVsU3BlZWQ7XHJcblx0XHRcdFx0XHRcdGpzcC5zY3JvbGxCeShkZWx0YVggKiBmYWN0b3IsIC1kZWx0YVkgKiBmYWN0b3IsIGZhbHNlKTtcclxuXHRcdFx0XHRcdFx0Ly8gcmV0dXJuIHRydWUgaWYgdGhlcmUgd2FzIG5vIG1vdmVtZW50IHNvIHJlc3Qgb2Ygc2NyZWVuIGNhbiBzY3JvbGxcclxuXHRcdFx0XHRcdFx0cmV0dXJuIGRYID09IGhvcml6b250YWxEcmFnUG9zaXRpb24gJiYgZFkgPT0gdmVydGljYWxEcmFnUG9zaXRpb247XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0KTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0ZnVuY3Rpb24gcmVtb3ZlTW91c2V3aGVlbCgpXHJcblx0XHRcdHtcclxuXHRcdFx0XHRjb250YWluZXIub2ZmKG13RXZlbnQpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRmdW5jdGlvbiBuaWwoKVxyXG5cdFx0XHR7XHJcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRmdW5jdGlvbiBpbml0Rm9jdXNIYW5kbGVyKClcclxuXHRcdFx0e1xyXG5cdFx0XHRcdHBhbmUuZmluZCgnOmlucHV0LGEnKS5vZmYoJ2ZvY3VzLmpzcCcpLm9uKFxyXG5cdFx0XHRcdFx0J2ZvY3VzLmpzcCcsXHJcblx0XHRcdFx0XHRmdW5jdGlvbihlKVxyXG5cdFx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0XHRzY3JvbGxUb0VsZW1lbnQoZS50YXJnZXQsIGZhbHNlKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHQpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRmdW5jdGlvbiByZW1vdmVGb2N1c0hhbmRsZXIoKVxyXG5cdFx0XHR7XHJcblx0XHRcdFx0cGFuZS5maW5kKCc6aW5wdXQsYScpLm9mZignZm9jdXMuanNwJyk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGZ1bmN0aW9uIGluaXRLZXlib2FyZE5hdigpXHJcblx0XHRcdHtcclxuXHRcdFx0XHR2YXIga2V5RG93biwgZWxlbWVudEhhc1Njcm9sbGVkLCB2YWxpZFBhcmVudHMgPSBbXTtcclxuXHRcdFx0XHRpZihpc1Njcm9sbGFibGVIKSB7XHJcbiAgICAgICAgICB2YWxpZFBhcmVudHMucHVzaChob3Jpem9udGFsQmFyWzBdKTtcclxuICAgICAgICB9XHJcblxyXG5cdFx0XHRcdGlmKGlzU2Nyb2xsYWJsZVYpIHtcclxuICAgICAgICAgIHZhbGlkUGFyZW50cy5wdXNoKHZlcnRpY2FsQmFyWzBdKTtcclxuICAgICAgICB9XHJcblxyXG5cdFx0XHRcdC8vIElFIGFsc28gZm9jdXNlcyBlbGVtZW50cyB0aGF0IGRvbid0IGhhdmUgdGFiaW5kZXggc2V0LlxyXG5cdFx0XHRcdHBhbmUub24oXHJcblx0XHRcdFx0XHQnZm9jdXMuanNwJyxcclxuXHRcdFx0XHRcdGZ1bmN0aW9uKClcclxuXHRcdFx0XHRcdHtcclxuXHRcdFx0XHRcdFx0ZWxlbS5mb2N1cygpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdCk7XHJcblxyXG5cdFx0XHRcdGVsZW0uYXR0cigndGFiaW5kZXgnLCAwKVxyXG5cdFx0XHRcdFx0Lm9mZigna2V5ZG93bi5qc3Aga2V5cHJlc3MuanNwJylcclxuXHRcdFx0XHRcdC5vbihcclxuXHRcdFx0XHRcdFx0J2tleWRvd24uanNwJyxcclxuXHRcdFx0XHRcdFx0ZnVuY3Rpb24oZSlcclxuXHRcdFx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0XHRcdGlmIChlLnRhcmdldCAhPT0gdGhpcyAmJiAhKHZhbGlkUGFyZW50cy5sZW5ndGggJiYgJChlLnRhcmdldCkuY2xvc2VzdCh2YWxpZFBhcmVudHMpLmxlbmd0aCkpe1xyXG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHR2YXIgZFggPSBob3Jpem9udGFsRHJhZ1Bvc2l0aW9uLCBkWSA9IHZlcnRpY2FsRHJhZ1Bvc2l0aW9uO1xyXG5cdFx0XHRcdFx0XHRcdHN3aXRjaChlLmtleUNvZGUpIHtcclxuXHRcdFx0XHRcdFx0XHRcdGNhc2UgNDA6IC8vIGRvd25cclxuXHRcdFx0XHRcdFx0XHRcdGNhc2UgMzg6IC8vIHVwXHJcblx0XHRcdFx0XHRcdFx0XHRjYXNlIDM0OiAvLyBwYWdlIGRvd25cclxuXHRcdFx0XHRcdFx0XHRcdGNhc2UgMzI6IC8vIHNwYWNlXHJcblx0XHRcdFx0XHRcdFx0XHRjYXNlIDMzOiAvLyBwYWdlIHVwXHJcblx0XHRcdFx0XHRcdFx0XHRjYXNlIDM5OiAvLyByaWdodFxyXG5cdFx0XHRcdFx0XHRcdFx0Y2FzZSAzNzogLy8gbGVmdFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRrZXlEb3duID0gZS5rZXlDb2RlO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRrZXlEb3duSGFuZGxlcigpO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdFx0XHRcdGNhc2UgMzU6IC8vIGVuZFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRzY3JvbGxUb1koY29udGVudEhlaWdodCAtIHBhbmVIZWlnaHQpO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRrZXlEb3duID0gbnVsbDtcclxuXHRcdFx0XHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHRcdFx0XHRjYXNlIDM2OiAvLyBob21lXHJcblx0XHRcdFx0XHRcdFx0XHRcdHNjcm9sbFRvWSgwKTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0a2V5RG93biA9IG51bGw7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRcdFx0ZWxlbWVudEhhc1Njcm9sbGVkID0gZS5rZXlDb2RlID09IGtleURvd24gJiYgZFggIT0gaG9yaXpvbnRhbERyYWdQb3NpdGlvbiB8fCBkWSAhPSB2ZXJ0aWNhbERyYWdQb3NpdGlvbjtcclxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gIWVsZW1lbnRIYXNTY3JvbGxlZDtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0KS5vbihcclxuXHRcdFx0XHRcdFx0J2tleXByZXNzLmpzcCcsIC8vIEZvciBGRi8gT1NYIHNvIHRoYXQgd2UgY2FuIGNhbmNlbCB0aGUgcmVwZWF0IGtleSBwcmVzc2VzIGlmIHRoZSBKU1Agc2Nyb2xscy4uLlxyXG5cdFx0XHRcdFx0XHRmdW5jdGlvbihlKVxyXG5cdFx0XHRcdFx0XHR7XHJcblx0XHRcdFx0XHRcdFx0aWYgKGUua2V5Q29kZSA9PSBrZXlEb3duKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRrZXlEb3duSGFuZGxlcigpO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHQvLyBJZiB0aGUga2V5cHJlc3MgaXMgbm90IHJlbGF0ZWQgdG8gdGhlIGFyZWEsIGlnbm9yZSBpdC4gRml4ZXMgcHJvYmxlbSB3aXRoIGlucHV0cyBpbnNpZGUgc2Nyb2xsZWQgYXJlYS4gQ29waWVkIGZyb20gbGluZSA5NTUuXHJcblx0XHRcdFx0XHRcdFx0aWYgKGUudGFyZ2V0ICE9PSB0aGlzICYmICEodmFsaWRQYXJlbnRzLmxlbmd0aCAmJiAkKGUudGFyZ2V0KS5jbG9zZXN0KHZhbGlkUGFyZW50cykubGVuZ3RoKSl7XHJcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdHJldHVybiAhZWxlbWVudEhhc1Njcm9sbGVkO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHQpO1xyXG5cclxuXHRcdFx0XHRpZiAoc2V0dGluZ3MuaGlkZUZvY3VzKSB7XHJcblx0XHRcdFx0XHRlbGVtLmNzcygnb3V0bGluZScsICdub25lJyk7XHJcblx0XHRcdFx0XHRpZiAoJ2hpZGVGb2N1cycgaW4gY29udGFpbmVyWzBdKXtcclxuXHRcdFx0XHRcdFx0ZWxlbS5hdHRyKCdoaWRlRm9jdXMnLCB0cnVlKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0ZWxlbS5jc3MoJ291dGxpbmUnLCAnJyk7XHJcblx0XHRcdFx0XHRpZiAoJ2hpZGVGb2N1cycgaW4gY29udGFpbmVyWzBdKXtcclxuXHRcdFx0XHRcdFx0ZWxlbS5hdHRyKCdoaWRlRm9jdXMnLCBmYWxzZSk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRmdW5jdGlvbiBrZXlEb3duSGFuZGxlcigpXHJcblx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0dmFyIGRYID0gaG9yaXpvbnRhbERyYWdQb3NpdGlvbiwgZFkgPSB2ZXJ0aWNhbERyYWdQb3NpdGlvbjtcclxuXHRcdFx0XHRcdHN3aXRjaChrZXlEb3duKSB7XHJcblx0XHRcdFx0XHRcdGNhc2UgNDA6IC8vIGRvd25cclxuXHRcdFx0XHRcdFx0XHRqc3Auc2Nyb2xsQnlZKHNldHRpbmdzLmtleWJvYXJkU3BlZWQsIGZhbHNlKTtcclxuXHRcdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdFx0Y2FzZSAzODogLy8gdXBcclxuXHRcdFx0XHRcdFx0XHRqc3Auc2Nyb2xsQnlZKC1zZXR0aW5ncy5rZXlib2FyZFNwZWVkLCBmYWxzZSk7XHJcblx0XHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHRcdGNhc2UgMzQ6IC8vIHBhZ2UgZG93blxyXG5cdFx0XHRcdFx0XHRjYXNlIDMyOiAvLyBzcGFjZVxyXG5cdFx0XHRcdFx0XHRcdGpzcC5zY3JvbGxCeVkocGFuZUhlaWdodCAqIHNldHRpbmdzLnNjcm9sbFBhZ2VQZXJjZW50LCBmYWxzZSk7XHJcblx0XHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHRcdGNhc2UgMzM6IC8vIHBhZ2UgdXBcclxuXHRcdFx0XHRcdFx0XHRqc3Auc2Nyb2xsQnlZKC1wYW5lSGVpZ2h0ICogc2V0dGluZ3Muc2Nyb2xsUGFnZVBlcmNlbnQsIGZhbHNlKTtcclxuXHRcdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdFx0Y2FzZSAzOTogLy8gcmlnaHRcclxuXHRcdFx0XHRcdFx0XHRqc3Auc2Nyb2xsQnlYKHNldHRpbmdzLmtleWJvYXJkU3BlZWQsIGZhbHNlKTtcclxuXHRcdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdFx0Y2FzZSAzNzogLy8gbGVmdFxyXG5cdFx0XHRcdFx0XHRcdGpzcC5zY3JvbGxCeVgoLXNldHRpbmdzLmtleWJvYXJkU3BlZWQsIGZhbHNlKTtcclxuXHRcdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRlbGVtZW50SGFzU2Nyb2xsZWQgPSBkWCAhPSBob3Jpem9udGFsRHJhZ1Bvc2l0aW9uIHx8IGRZICE9IHZlcnRpY2FsRHJhZ1Bvc2l0aW9uO1xyXG5cdFx0XHRcdFx0cmV0dXJuIGVsZW1lbnRIYXNTY3JvbGxlZDtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGZ1bmN0aW9uIHJlbW92ZUtleWJvYXJkTmF2KClcclxuXHRcdFx0e1xyXG5cdFx0XHRcdGVsZW0uYXR0cigndGFiaW5kZXgnLCAnLTEnKVxyXG5cdFx0XHRcdFx0LnJlbW92ZUF0dHIoJ3RhYmluZGV4JylcclxuXHRcdFx0XHRcdC5vZmYoJ2tleWRvd24uanNwIGtleXByZXNzLmpzcCcpO1xyXG5cclxuXHRcdFx0XHRwYW5lLm9mZignLmpzcCcpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRmdW5jdGlvbiBvYnNlcnZlSGFzaCgpXHJcblx0XHRcdHtcclxuXHRcdFx0XHRpZiAobG9jYXRpb24uaGFzaCAmJiBsb2NhdGlvbi5oYXNoLmxlbmd0aCA+IDEpIHtcclxuXHRcdFx0XHRcdHZhciBlLFxyXG5cdFx0XHRcdFx0XHRyZXRyeUludCxcclxuXHRcdFx0XHRcdFx0aGFzaCA9IGVzY2FwZShsb2NhdGlvbi5oYXNoLnN1YnN0cigxKSkgLy8gaGFzaCBtdXN0IGJlIGVzY2FwZWQgdG8gcHJldmVudCBYU1NcclxuXHRcdFx0XHRcdFx0O1xyXG5cdFx0XHRcdFx0dHJ5IHtcclxuXHRcdFx0XHRcdFx0ZSA9ICQoJyMnICsgaGFzaCArICcsIGFbbmFtZT1cIicgKyBoYXNoICsgJ1wiXScpO1xyXG5cdFx0XHRcdFx0fSBjYXRjaCAoZXJyKSB7XHJcblx0XHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRpZiAoZS5sZW5ndGggJiYgcGFuZS5maW5kKGhhc2gpKSB7XHJcblx0XHRcdFx0XHRcdC8vIG5hc3R5IHdvcmthcm91bmQgYnV0IGl0IGFwcGVhcnMgdG8gdGFrZSBhIGxpdHRsZSB3aGlsZSBiZWZvcmUgdGhlIGhhc2ggaGFzIGRvbmUgaXRzIHRoaW5nXHJcblx0XHRcdFx0XHRcdC8vIHRvIHRoZSByZW5kZXJlZCBwYWdlIHNvIHdlIGp1c3Qgd2FpdCB1bnRpbCB0aGUgY29udGFpbmVyJ3Mgc2Nyb2xsVG9wIGhhcyBiZWVuIG1lc3NlZCB1cC5cclxuXHRcdFx0XHRcdFx0aWYgKGNvbnRhaW5lci5zY3JvbGxUb3AoKSA9PT0gMCkge1xyXG5cdFx0XHRcdFx0XHRcdHJldHJ5SW50ID0gc2V0SW50ZXJ2YWwoXHJcblx0XHRcdFx0XHRcdFx0XHRmdW5jdGlvbigpXHJcblx0XHRcdFx0XHRcdFx0XHR7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGlmIChjb250YWluZXIuc2Nyb2xsVG9wKCkgPiAwKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0c2Nyb2xsVG9FbGVtZW50KGUsIHRydWUpO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdCQoZG9jdW1lbnQpLnNjcm9sbFRvcChjb250YWluZXIucG9zaXRpb24oKS50b3ApO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGNsZWFySW50ZXJ2YWwocmV0cnlJbnQpO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0XHRcdFx0NTBcclxuXHRcdFx0XHRcdFx0XHQpO1xyXG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdHNjcm9sbFRvRWxlbWVudChlLCB0cnVlKTtcclxuXHRcdFx0XHRcdFx0XHQkKGRvY3VtZW50KS5zY3JvbGxUb3AoY29udGFpbmVyLnBvc2l0aW9uKCkudG9wKTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0ZnVuY3Rpb24gaGlqYWNrSW50ZXJuYWxMaW5rcygpXHJcblx0XHRcdHtcclxuXHRcdFx0XHQvLyBvbmx5IHJlZ2lzdGVyIHRoZSBsaW5rIGhhbmRsZXIgb25jZVxyXG5cdFx0XHRcdGlmICgkKGRvY3VtZW50LmJvZHkpLmRhdGEoJ2pzcEhpamFjaycpKSB7XHJcblx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHQvLyByZW1lbWJlciB0aGF0IHRoZSBoYW5kbGVyIHdhcyBib3VuZFxyXG5cdFx0XHRcdCQoZG9jdW1lbnQuYm9keSkuZGF0YSgnanNwSGlqYWNrJywgdHJ1ZSk7XHJcblxyXG5cdFx0XHRcdC8vIHVzZSBsaXZlIGhhbmRsZXIgdG8gYWxzbyBjYXB0dXJlIG5ld2x5IGNyZWF0ZWQgbGlua3NcclxuXHRcdFx0XHQkKGRvY3VtZW50LmJvZHkpLmRlbGVnYXRlKCdhW2hyZWYqPVwiI1wiXScsICdjbGljaycsIGZ1bmN0aW9uKGV2ZW50KSB7XHJcblx0XHRcdFx0XHQvLyBkb2VzIHRoZSBsaW5rIHBvaW50IHRvIHRoZSBzYW1lIHBhZ2U/XHJcblx0XHRcdFx0XHQvLyB0aGlzIGFsc28gdGFrZXMgY2FyZSBvZiBjYXNlcyB3aXRoIGEgPGJhc2U+LVRhZyBvciBMaW5rcyBub3Qgc3RhcnRpbmcgd2l0aCB0aGUgaGFzaCAjXHJcblx0XHRcdFx0XHQvLyBlLmcuIDxhIGhyZWY9XCJpbmRleC5odG1sI3Rlc3RcIj4gd2hlbiB0aGUgY3VycmVudCB1cmwgYWxyZWFkeSBpcyBpbmRleC5odG1sXHJcblx0XHRcdFx0XHR2YXIgaHJlZiA9IHRoaXMuaHJlZi5zdWJzdHIoMCwgdGhpcy5ocmVmLmluZGV4T2YoJyMnKSksXHJcblx0XHRcdFx0XHRcdGxvY2F0aW9uSHJlZiA9IGxvY2F0aW9uLmhyZWYsXHJcblx0XHRcdFx0XHRcdGhhc2gsXHJcblx0XHRcdFx0XHRcdGVsZW1lbnQsXHJcblx0XHRcdFx0XHRcdGNvbnRhaW5lcixcclxuXHRcdFx0XHRcdFx0anNwLFxyXG5cdFx0XHRcdFx0XHRzY3JvbGxUb3AsXHJcblx0XHRcdFx0XHRcdGVsZW1lbnRUb3A7XHJcblx0XHRcdFx0XHRpZiAobG9jYXRpb24uaHJlZi5pbmRleE9mKCcjJykgIT09IC0xKSB7XHJcblx0XHRcdFx0XHRcdGxvY2F0aW9uSHJlZiA9IGxvY2F0aW9uLmhyZWYuc3Vic3RyKDAsIGxvY2F0aW9uLmhyZWYuaW5kZXhPZignIycpKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGlmIChocmVmICE9PSBsb2NhdGlvbkhyZWYpIHtcclxuXHRcdFx0XHRcdFx0Ly8gdGhlIGxpbmsgcG9pbnRzIHRvIGFub3RoZXIgcGFnZVxyXG5cdFx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0Ly8gY2hlY2sgaWYgalNjcm9sbFBhbmUgc2hvdWxkIGhhbmRsZSB0aGlzIGNsaWNrIGV2ZW50XHJcblx0XHRcdFx0XHRoYXNoID0gZXNjYXBlKHRoaXMuaHJlZi5zdWJzdHIodGhpcy5ocmVmLmluZGV4T2YoJyMnKSArIDEpKTtcclxuXHJcblx0XHRcdFx0XHQvLyBmaW5kIHRoZSBlbGVtZW50IG9uIHRoZSBwYWdlXHJcblx0XHRcdFx0XHR0cnkge1xyXG5cdFx0XHRcdFx0XHRlbGVtZW50ID0gJCgnIycgKyBoYXNoICsgJywgYVtuYW1lPVwiJyArIGhhc2ggKyAnXCJdJyk7XHJcblx0XHRcdFx0XHR9IGNhdGNoIChlKSB7XHJcblx0XHRcdFx0XHRcdC8vIGhhc2ggaXMgbm90IGEgdmFsaWQgalF1ZXJ5IGlkZW50aWZpZXJcclxuXHRcdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdGlmICghZWxlbWVudC5sZW5ndGgpIHtcclxuXHRcdFx0XHRcdFx0Ly8gdGhpcyBsaW5rIGRvZXMgbm90IHBvaW50IHRvIGFuIGVsZW1lbnQgb24gdGhpcyBwYWdlXHJcblx0XHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRjb250YWluZXIgPSBlbGVtZW50LmNsb3Nlc3QoJy5qc3BTY3JvbGxhYmxlJyk7XHJcblx0XHRcdFx0XHRqc3AgPSBjb250YWluZXIuZGF0YSgnanNwJyk7XHJcblxyXG5cdFx0XHRcdFx0Ly8ganNwIG1pZ2h0IGJlIGFub3RoZXIganNwIGluc3RhbmNlIHRoYW4gdGhlIG9uZSwgdGhhdCBib3VuZCB0aGlzIGV2ZW50XHJcblx0XHRcdFx0XHQvLyByZW1lbWJlcjogdGhpcyBldmVudCBpcyBvbmx5IGJvdW5kIG9uY2UgZm9yIGFsbCBpbnN0YW5jZXMuXHJcblx0XHRcdFx0XHRqc3Auc2Nyb2xsVG9FbGVtZW50KGVsZW1lbnQsIHRydWUpO1xyXG5cclxuXHRcdFx0XHRcdGlmIChjb250YWluZXJbMF0uc2Nyb2xsSW50b1ZpZXcpIHtcclxuXHRcdFx0XHRcdFx0Ly8gYWxzbyBzY3JvbGwgdG8gdGhlIHRvcCBvZiB0aGUgY29udGFpbmVyIChpZiBpdCBpcyBub3QgdmlzaWJsZSlcclxuXHRcdFx0XHRcdFx0c2Nyb2xsVG9wID0gJCh3aW5kb3cpLnNjcm9sbFRvcCgpO1xyXG5cdFx0XHRcdFx0XHRlbGVtZW50VG9wID0gZWxlbWVudC5vZmZzZXQoKS50b3A7XHJcblx0XHRcdFx0XHRcdGlmIChlbGVtZW50VG9wIDwgc2Nyb2xsVG9wIHx8IGVsZW1lbnRUb3AgPiBzY3JvbGxUb3AgKyAkKHdpbmRvdykuaGVpZ2h0KCkpIHtcclxuXHRcdFx0XHRcdFx0XHRjb250YWluZXJbMF0uc2Nyb2xsSW50b1ZpZXcoKTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdC8vIGpzcCBoYW5kbGVkIHRoaXMgZXZlbnQsIHByZXZlbnQgdGhlIGJyb3dzZXIgZGVmYXVsdCAoc2Nyb2xsaW5nIDpQKVxyXG5cdFx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Ly8gSW5pdCB0b3VjaCBvbiBpUGFkLCBpUGhvbmUsIGlQb2QsIEFuZHJvaWRcclxuXHRcdFx0ZnVuY3Rpb24gaW5pdFRvdWNoKClcclxuXHRcdFx0e1xyXG5cdFx0XHRcdHZhciBzdGFydFgsXHJcblx0XHRcdFx0XHRzdGFydFksXHJcblx0XHRcdFx0XHR0b3VjaFN0YXJ0WCxcclxuXHRcdFx0XHRcdHRvdWNoU3RhcnRZLFxyXG5cdFx0XHRcdFx0bW92ZWQsXHJcblx0XHRcdFx0XHRtb3ZpbmcgPSBmYWxzZTtcclxuXHJcblx0XHRcdFx0Y29udGFpbmVyLm9mZigndG91Y2hzdGFydC5qc3AgdG91Y2htb3ZlLmpzcCB0b3VjaGVuZC5qc3AgY2xpY2suanNwLXRvdWNoY2xpY2snKS5vbihcclxuXHRcdFx0XHRcdCd0b3VjaHN0YXJ0LmpzcCcsXHJcblx0XHRcdFx0XHRmdW5jdGlvbihlKVxyXG5cdFx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0XHR2YXIgdG91Y2ggPSBlLm9yaWdpbmFsRXZlbnQudG91Y2hlc1swXTtcclxuXHRcdFx0XHRcdFx0c3RhcnRYID0gY29udGVudFBvc2l0aW9uWCgpO1xyXG5cdFx0XHRcdFx0XHRzdGFydFkgPSBjb250ZW50UG9zaXRpb25ZKCk7XHJcblx0XHRcdFx0XHRcdHRvdWNoU3RhcnRYID0gdG91Y2gucGFnZVg7XHJcblx0XHRcdFx0XHRcdHRvdWNoU3RhcnRZID0gdG91Y2gucGFnZVk7XHJcblx0XHRcdFx0XHRcdG1vdmVkID0gZmFsc2U7XHJcblx0XHRcdFx0XHRcdG1vdmluZyA9IHRydWU7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0KS5vbihcclxuXHRcdFx0XHRcdCd0b3VjaG1vdmUuanNwJyxcclxuXHRcdFx0XHRcdGZ1bmN0aW9uKGV2KVxyXG5cdFx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0XHRpZighbW92aW5nKSB7XHJcblx0XHRcdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0XHR2YXIgdG91Y2hQb3MgPSBldi5vcmlnaW5hbEV2ZW50LnRvdWNoZXNbMF0sXHJcblx0XHRcdFx0XHRcdFx0ZFggPSBob3Jpem9udGFsRHJhZ1Bvc2l0aW9uLCBkWSA9IHZlcnRpY2FsRHJhZ1Bvc2l0aW9uO1xyXG5cclxuXHRcdFx0XHRcdFx0anNwLnNjcm9sbFRvKHN0YXJ0WCArIHRvdWNoU3RhcnRYIC0gdG91Y2hQb3MucGFnZVgsIHN0YXJ0WSArIHRvdWNoU3RhcnRZIC0gdG91Y2hQb3MucGFnZVkpO1xyXG5cclxuXHRcdFx0XHRcdFx0bW92ZWQgPSBtb3ZlZCB8fCBNYXRoLmFicyh0b3VjaFN0YXJ0WCAtIHRvdWNoUG9zLnBhZ2VYKSA+IDUgfHwgTWF0aC5hYnModG91Y2hTdGFydFkgLSB0b3VjaFBvcy5wYWdlWSkgPiA1O1xyXG5cclxuXHRcdFx0XHRcdFx0Ly8gcmV0dXJuIHRydWUgaWYgdGhlcmUgd2FzIG5vIG1vdmVtZW50IHNvIHJlc3Qgb2Ygc2NyZWVuIGNhbiBzY3JvbGxcclxuXHRcdFx0XHRcdFx0cmV0dXJuIGRYID09IGhvcml6b250YWxEcmFnUG9zaXRpb24gJiYgZFkgPT0gdmVydGljYWxEcmFnUG9zaXRpb247XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0KS5vbihcclxuXHRcdFx0XHRcdCd0b3VjaGVuZC5qc3AnLFxyXG5cdFx0XHRcdFx0ZnVuY3Rpb24oZSlcclxuXHRcdFx0XHRcdHtcclxuXHRcdFx0XHRcdFx0bW92aW5nID0gZmFsc2U7XHJcblx0XHRcdFx0XHRcdC8qaWYobW92ZWQpIHtcclxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHRcdFx0XHRcdH0qL1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdCkub24oXHJcblx0XHRcdFx0XHQnY2xpY2suanNwLXRvdWNoY2xpY2snLFxyXG5cdFx0XHRcdFx0ZnVuY3Rpb24oZSlcclxuXHRcdFx0XHRcdHtcclxuXHRcdFx0XHRcdFx0aWYobW92ZWQpIHtcclxuXHRcdFx0XHRcdFx0XHRtb3ZlZCA9IGZhbHNlO1xyXG5cdFx0XHRcdFx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdCk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGZ1bmN0aW9uIGRlc3Ryb3koKXtcclxuXHRcdFx0XHR2YXIgY3VycmVudFkgPSBjb250ZW50UG9zaXRpb25ZKCksXHJcblx0XHRcdFx0XHRjdXJyZW50WCA9IGNvbnRlbnRQb3NpdGlvblgoKTtcclxuXHRcdFx0XHRlbGVtLnJlbW92ZUNsYXNzKCdqc3BTY3JvbGxhYmxlJykub2ZmKCcuanNwJyk7XHJcblx0XHRcdFx0cGFuZS5vZmYoJy5qc3AnKTtcclxuXHRcdFx0XHRlbGVtLnJlcGxhY2VXaXRoKG9yaWdpbmFsRWxlbWVudC5hcHBlbmQocGFuZS5jaGlsZHJlbigpKSk7XHJcblx0XHRcdFx0b3JpZ2luYWxFbGVtZW50LnNjcm9sbFRvcChjdXJyZW50WSk7XHJcblx0XHRcdFx0b3JpZ2luYWxFbGVtZW50LnNjcm9sbExlZnQoY3VycmVudFgpO1xyXG5cclxuXHRcdFx0XHQvLyBjbGVhciByZWluaXRpYWxpemUgdGltZXIgaWYgYWN0aXZlXHJcblx0XHRcdFx0aWYgKHJlaW5pdGlhbGlzZUludGVydmFsKSB7XHJcblx0XHRcdFx0XHRjbGVhckludGVydmFsKHJlaW5pdGlhbGlzZUludGVydmFsKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdC8vIFB1YmxpYyBBUElcclxuXHRcdFx0JC5leHRlbmQoXHJcblx0XHRcdFx0anNwLFxyXG5cdFx0XHRcdHtcclxuXHRcdFx0XHRcdC8vIFJlaW5pdGlhbGlzZXMgdGhlIHNjcm9sbCBwYW5lIChpZiBpdCdzIGludGVybmFsIGRpbWVuc2lvbnMgaGF2ZSBjaGFuZ2VkIHNpbmNlIHRoZSBsYXN0IHRpbWUgaXRcclxuXHRcdFx0XHRcdC8vIHdhcyBpbml0aWFsaXNlZCkuIFRoZSBzZXR0aW5ncyBvYmplY3Qgd2hpY2ggaXMgcGFzc2VkIGluIHdpbGwgb3ZlcnJpZGUgYW55IHNldHRpbmdzIGZyb20gdGhlXHJcblx0XHRcdFx0XHQvLyBwcmV2aW91cyB0aW1lIGl0IHdhcyBpbml0aWFsaXNlZCAtIGlmIHlvdSBkb24ndCBwYXNzIGFueSBzZXR0aW5ncyB0aGVuIHRoZSBvbmVzIGZyb20gdGhlIHByZXZpb3VzXHJcblx0XHRcdFx0XHQvLyBpbml0aWFsaXNhdGlvbiB3aWxsIGJlIHVzZWQuXHJcblx0XHRcdFx0XHRyZWluaXRpYWxpc2U6IGZ1bmN0aW9uKHMpXHJcblx0XHRcdFx0XHR7XHJcblx0XHRcdFx0XHRcdHMgPSAkLmV4dGVuZCh7fSwgc2V0dGluZ3MsIHMpO1xyXG5cdFx0XHRcdFx0XHRpbml0aWFsaXNlKHMpO1xyXG5cdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdC8vIFNjcm9sbHMgdGhlIHNwZWNpZmllZCBlbGVtZW50IChhIGpRdWVyeSBvYmplY3QsIERPTSBub2RlIG9yIGpRdWVyeSBzZWxlY3RvciBzdHJpbmcpIGludG8gdmlldyBzb1xyXG5cdFx0XHRcdFx0Ly8gdGhhdCBpdCBjYW4gYmUgc2VlbiB3aXRoaW4gdGhlIHZpZXdwb3J0LiBJZiBzdGlja1RvVG9wIGlzIHRydWUgdGhlbiB0aGUgZWxlbWVudCB3aWxsIGFwcGVhciBhdFxyXG5cdFx0XHRcdFx0Ly8gdGhlIHRvcCBvZiB0aGUgdmlld3BvcnQsIGlmIGl0IGlzIGZhbHNlIHRoZW4gdGhlIHZpZXdwb3J0IHdpbGwgc2Nyb2xsIGFzIGxpdHRsZSBhcyBwb3NzaWJsZSB0b1xyXG5cdFx0XHRcdFx0Ly8gc2hvdyB0aGUgZWxlbWVudC4gWW91IGNhbiBhbHNvIHNwZWNpZnkgaWYgeW91IHdhbnQgYW5pbWF0aW9uIHRvIG9jY3VyLiBJZiB5b3UgZG9uJ3QgcHJvdmlkZSB0aGlzXHJcblx0XHRcdFx0XHQvLyBhcmd1bWVudCB0aGVuIHRoZSBhbmltYXRlU2Nyb2xsIHZhbHVlIGZyb20gdGhlIHNldHRpbmdzIG9iamVjdCBpcyB1c2VkIGluc3RlYWQuXHJcblx0XHRcdFx0XHRzY3JvbGxUb0VsZW1lbnQ6IGZ1bmN0aW9uKGVsZSwgc3RpY2tUb1RvcCwgYW5pbWF0ZSlcclxuXHRcdFx0XHRcdHtcclxuXHRcdFx0XHRcdFx0c2Nyb2xsVG9FbGVtZW50KGVsZSwgc3RpY2tUb1RvcCwgYW5pbWF0ZSk7XHJcblx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0Ly8gU2Nyb2xscyB0aGUgcGFuZSBzbyB0aGF0IHRoZSBzcGVjaWZpZWQgY28tb3JkaW5hdGVzIHdpdGhpbiB0aGUgY29udGVudCBhcmUgYXQgdGhlIHRvcCBsZWZ0XHJcblx0XHRcdFx0XHQvLyBvZiB0aGUgdmlld3BvcnQuIGFuaW1hdGUgaXMgb3B0aW9uYWwgYW5kIGlmIG5vdCBwYXNzZWQgdGhlbiB0aGUgdmFsdWUgb2YgYW5pbWF0ZVNjcm9sbCBmcm9tXHJcblx0XHRcdFx0XHQvLyB0aGUgc2V0dGluZ3Mgb2JqZWN0IHRoaXMgalNjcm9sbFBhbmUgd2FzIGluaXRpYWxpc2VkIHdpdGggaXMgdXNlZC5cclxuXHRcdFx0XHRcdHNjcm9sbFRvOiBmdW5jdGlvbihkZXN0WCwgZGVzdFksIGFuaW1hdGUpXHJcblx0XHRcdFx0XHR7XHJcblx0XHRcdFx0XHRcdHNjcm9sbFRvWChkZXN0WCwgYW5pbWF0ZSk7XHJcblx0XHRcdFx0XHRcdHNjcm9sbFRvWShkZXN0WSwgYW5pbWF0ZSk7XHJcblx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0Ly8gU2Nyb2xscyB0aGUgcGFuZSBzbyB0aGF0IHRoZSBzcGVjaWZpZWQgY28tb3JkaW5hdGUgd2l0aGluIHRoZSBjb250ZW50IGlzIGF0IHRoZSBsZWZ0IG9mIHRoZVxyXG5cdFx0XHRcdFx0Ly8gdmlld3BvcnQuIGFuaW1hdGUgaXMgb3B0aW9uYWwgYW5kIGlmIG5vdCBwYXNzZWQgdGhlbiB0aGUgdmFsdWUgb2YgYW5pbWF0ZVNjcm9sbCBmcm9tIHRoZSBzZXR0aW5nc1xyXG5cdFx0XHRcdFx0Ly8gb2JqZWN0IHRoaXMgalNjcm9sbFBhbmUgd2FzIGluaXRpYWxpc2VkIHdpdGggaXMgdXNlZC5cclxuXHRcdFx0XHRcdHNjcm9sbFRvWDogZnVuY3Rpb24oZGVzdFgsIGFuaW1hdGUpXHJcblx0XHRcdFx0XHR7XHJcblx0XHRcdFx0XHRcdHNjcm9sbFRvWChkZXN0WCwgYW5pbWF0ZSk7XHJcblx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0Ly8gU2Nyb2xscyB0aGUgcGFuZSBzbyB0aGF0IHRoZSBzcGVjaWZpZWQgY28tb3JkaW5hdGUgd2l0aGluIHRoZSBjb250ZW50IGlzIGF0IHRoZSB0b3Agb2YgdGhlXHJcblx0XHRcdFx0XHQvLyB2aWV3cG9ydC4gYW5pbWF0ZSBpcyBvcHRpb25hbCBhbmQgaWYgbm90IHBhc3NlZCB0aGVuIHRoZSB2YWx1ZSBvZiBhbmltYXRlU2Nyb2xsIGZyb20gdGhlIHNldHRpbmdzXHJcblx0XHRcdFx0XHQvLyBvYmplY3QgdGhpcyBqU2Nyb2xsUGFuZSB3YXMgaW5pdGlhbGlzZWQgd2l0aCBpcyB1c2VkLlxyXG5cdFx0XHRcdFx0c2Nyb2xsVG9ZOiBmdW5jdGlvbihkZXN0WSwgYW5pbWF0ZSlcclxuXHRcdFx0XHRcdHtcclxuXHRcdFx0XHRcdFx0c2Nyb2xsVG9ZKGRlc3RZLCBhbmltYXRlKTtcclxuXHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHQvLyBTY3JvbGxzIHRoZSBwYW5lIHRvIHRoZSBzcGVjaWZpZWQgcGVyY2VudGFnZSBvZiBpdHMgbWF4aW11bSBob3Jpem9udGFsIHNjcm9sbCBwb3NpdGlvbi4gYW5pbWF0ZVxyXG5cdFx0XHRcdFx0Ly8gaXMgb3B0aW9uYWwgYW5kIGlmIG5vdCBwYXNzZWQgdGhlbiB0aGUgdmFsdWUgb2YgYW5pbWF0ZVNjcm9sbCBmcm9tIHRoZSBzZXR0aW5ncyBvYmplY3QgdGhpc1xyXG5cdFx0XHRcdFx0Ly8galNjcm9sbFBhbmUgd2FzIGluaXRpYWxpc2VkIHdpdGggaXMgdXNlZC5cclxuXHRcdFx0XHRcdHNjcm9sbFRvUGVyY2VudFg6IGZ1bmN0aW9uKGRlc3RQZXJjZW50WCwgYW5pbWF0ZSlcclxuXHRcdFx0XHRcdHtcclxuXHRcdFx0XHRcdFx0c2Nyb2xsVG9YKGRlc3RQZXJjZW50WCAqIChjb250ZW50V2lkdGggLSBwYW5lV2lkdGgpLCBhbmltYXRlKTtcclxuXHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHQvLyBTY3JvbGxzIHRoZSBwYW5lIHRvIHRoZSBzcGVjaWZpZWQgcGVyY2VudGFnZSBvZiBpdHMgbWF4aW11bSB2ZXJ0aWNhbCBzY3JvbGwgcG9zaXRpb24uIGFuaW1hdGVcclxuXHRcdFx0XHRcdC8vIGlzIG9wdGlvbmFsIGFuZCBpZiBub3QgcGFzc2VkIHRoZW4gdGhlIHZhbHVlIG9mIGFuaW1hdGVTY3JvbGwgZnJvbSB0aGUgc2V0dGluZ3Mgb2JqZWN0IHRoaXNcclxuXHRcdFx0XHRcdC8vIGpTY3JvbGxQYW5lIHdhcyBpbml0aWFsaXNlZCB3aXRoIGlzIHVzZWQuXHJcblx0XHRcdFx0XHRzY3JvbGxUb1BlcmNlbnRZOiBmdW5jdGlvbihkZXN0UGVyY2VudFksIGFuaW1hdGUpXHJcblx0XHRcdFx0XHR7XHJcblx0XHRcdFx0XHRcdHNjcm9sbFRvWShkZXN0UGVyY2VudFkgKiAoY29udGVudEhlaWdodCAtIHBhbmVIZWlnaHQpLCBhbmltYXRlKTtcclxuXHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHQvLyBTY3JvbGxzIHRoZSBwYW5lIGJ5IHRoZSBzcGVjaWZpZWQgYW1vdW50IG9mIHBpeGVscy4gYW5pbWF0ZSBpcyBvcHRpb25hbCBhbmQgaWYgbm90IHBhc3NlZCB0aGVuXHJcblx0XHRcdFx0XHQvLyB0aGUgdmFsdWUgb2YgYW5pbWF0ZVNjcm9sbCBmcm9tIHRoZSBzZXR0aW5ncyBvYmplY3QgdGhpcyBqU2Nyb2xsUGFuZSB3YXMgaW5pdGlhbGlzZWQgd2l0aCBpcyB1c2VkLlxyXG5cdFx0XHRcdFx0c2Nyb2xsQnk6IGZ1bmN0aW9uKGRlbHRhWCwgZGVsdGFZLCBhbmltYXRlKVxyXG5cdFx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0XHRqc3Auc2Nyb2xsQnlYKGRlbHRhWCwgYW5pbWF0ZSk7XHJcblx0XHRcdFx0XHRcdGpzcC5zY3JvbGxCeVkoZGVsdGFZLCBhbmltYXRlKTtcclxuXHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHQvLyBTY3JvbGxzIHRoZSBwYW5lIGJ5IHRoZSBzcGVjaWZpZWQgYW1vdW50IG9mIHBpeGVscy4gYW5pbWF0ZSBpcyBvcHRpb25hbCBhbmQgaWYgbm90IHBhc3NlZCB0aGVuXHJcblx0XHRcdFx0XHQvLyB0aGUgdmFsdWUgb2YgYW5pbWF0ZVNjcm9sbCBmcm9tIHRoZSBzZXR0aW5ncyBvYmplY3QgdGhpcyBqU2Nyb2xsUGFuZSB3YXMgaW5pdGlhbGlzZWQgd2l0aCBpcyB1c2VkLlxyXG5cdFx0XHRcdFx0c2Nyb2xsQnlYOiBmdW5jdGlvbihkZWx0YVgsIGFuaW1hdGUpXHJcblx0XHRcdFx0XHR7XHJcblx0XHRcdFx0XHRcdHZhciBkZXN0WCA9IGNvbnRlbnRQb3NpdGlvblgoKSArIE1hdGhbZGVsdGFYPDAgPyAnZmxvb3InIDogJ2NlaWwnXShkZWx0YVgpLFxyXG5cdFx0XHRcdFx0XHRcdHBlcmNlbnRTY3JvbGxlZCA9IGRlc3RYIC8gKGNvbnRlbnRXaWR0aCAtIHBhbmVXaWR0aCk7XHJcblx0XHRcdFx0XHRcdHBvc2l0aW9uRHJhZ1gocGVyY2VudFNjcm9sbGVkICogZHJhZ01heFgsIGFuaW1hdGUpO1xyXG5cdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdC8vIFNjcm9sbHMgdGhlIHBhbmUgYnkgdGhlIHNwZWNpZmllZCBhbW91bnQgb2YgcGl4ZWxzLiBhbmltYXRlIGlzIG9wdGlvbmFsIGFuZCBpZiBub3QgcGFzc2VkIHRoZW5cclxuXHRcdFx0XHRcdC8vIHRoZSB2YWx1ZSBvZiBhbmltYXRlU2Nyb2xsIGZyb20gdGhlIHNldHRpbmdzIG9iamVjdCB0aGlzIGpTY3JvbGxQYW5lIHdhcyBpbml0aWFsaXNlZCB3aXRoIGlzIHVzZWQuXHJcblx0XHRcdFx0XHRzY3JvbGxCeVk6IGZ1bmN0aW9uKGRlbHRhWSwgYW5pbWF0ZSlcclxuXHRcdFx0XHRcdHtcclxuXHRcdFx0XHRcdFx0dmFyIGRlc3RZID0gY29udGVudFBvc2l0aW9uWSgpICsgTWF0aFtkZWx0YVk8MCA/ICdmbG9vcicgOiAnY2VpbCddKGRlbHRhWSksXHJcblx0XHRcdFx0XHRcdFx0cGVyY2VudFNjcm9sbGVkID0gZGVzdFkgLyAoY29udGVudEhlaWdodCAtIHBhbmVIZWlnaHQpO1xyXG5cdFx0XHRcdFx0XHRwb3NpdGlvbkRyYWdZKHBlcmNlbnRTY3JvbGxlZCAqIGRyYWdNYXhZLCBhbmltYXRlKTtcclxuXHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHQvLyBQb3NpdGlvbnMgdGhlIGhvcml6b250YWwgZHJhZyBhdCB0aGUgc3BlY2lmaWVkIHggcG9zaXRpb24gKGFuZCB1cGRhdGVzIHRoZSB2aWV3cG9ydCB0byByZWZsZWN0XHJcblx0XHRcdFx0XHQvLyB0aGlzKS4gYW5pbWF0ZSBpcyBvcHRpb25hbCBhbmQgaWYgbm90IHBhc3NlZCB0aGVuIHRoZSB2YWx1ZSBvZiBhbmltYXRlU2Nyb2xsIGZyb20gdGhlIHNldHRpbmdzXHJcblx0XHRcdFx0XHQvLyBvYmplY3QgdGhpcyBqU2Nyb2xsUGFuZSB3YXMgaW5pdGlhbGlzZWQgd2l0aCBpcyB1c2VkLlxyXG5cdFx0XHRcdFx0cG9zaXRpb25EcmFnWDogZnVuY3Rpb24oeCwgYW5pbWF0ZSlcclxuXHRcdFx0XHRcdHtcclxuXHRcdFx0XHRcdFx0cG9zaXRpb25EcmFnWCh4LCBhbmltYXRlKTtcclxuXHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHQvLyBQb3NpdGlvbnMgdGhlIHZlcnRpY2FsIGRyYWcgYXQgdGhlIHNwZWNpZmllZCB5IHBvc2l0aW9uIChhbmQgdXBkYXRlcyB0aGUgdmlld3BvcnQgdG8gcmVmbGVjdFxyXG5cdFx0XHRcdFx0Ly8gdGhpcykuIGFuaW1hdGUgaXMgb3B0aW9uYWwgYW5kIGlmIG5vdCBwYXNzZWQgdGhlbiB0aGUgdmFsdWUgb2YgYW5pbWF0ZVNjcm9sbCBmcm9tIHRoZSBzZXR0aW5nc1xyXG5cdFx0XHRcdFx0Ly8gb2JqZWN0IHRoaXMgalNjcm9sbFBhbmUgd2FzIGluaXRpYWxpc2VkIHdpdGggaXMgdXNlZC5cclxuXHRcdFx0XHRcdHBvc2l0aW9uRHJhZ1k6IGZ1bmN0aW9uKHksIGFuaW1hdGUpXHJcblx0XHRcdFx0XHR7XHJcblx0XHRcdFx0XHRcdHBvc2l0aW9uRHJhZ1koeSwgYW5pbWF0ZSk7XHJcblx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0Ly8gVGhpcyBtZXRob2QgaXMgY2FsbGVkIHdoZW4galNjcm9sbFBhbmUgaXMgdHJ5aW5nIHRvIGFuaW1hdGUgdG8gYSBuZXcgcG9zaXRpb24uIFlvdSBjYW4gb3ZlcnJpZGVcclxuXHRcdFx0XHRcdC8vIGl0IGlmIHlvdSB3YW50IHRvIHByb3ZpZGUgYWR2YW5jZWQgYW5pbWF0aW9uIGZ1bmN0aW9uYWxpdHkuIEl0IGlzIHBhc3NlZCB0aGUgZm9sbG93aW5nIGFyZ3VtZW50czpcclxuXHRcdFx0XHRcdC8vICAqIGVsZSAgICAgICAgICAtIHRoZSBlbGVtZW50IHdob3NlIHBvc2l0aW9uIGlzIGJlaW5nIGFuaW1hdGVkXHJcblx0XHRcdFx0XHQvLyAgKiBwcm9wICAgICAgICAgLSB0aGUgcHJvcGVydHkgdGhhdCBpcyBiZWluZyBhbmltYXRlZFxyXG5cdFx0XHRcdFx0Ly8gICogdmFsdWUgICAgICAgIC0gdGhlIHZhbHVlIGl0J3MgYmVpbmcgYW5pbWF0ZWQgdG9cclxuXHRcdFx0XHRcdC8vICAqIHN0ZXBDYWxsYmFjayAtIGEgZnVuY3Rpb24gdGhhdCB5b3UgbXVzdCBleGVjdXRlIGVhY2ggdGltZSB5b3UgdXBkYXRlIHRoZSB2YWx1ZSBvZiB0aGUgcHJvcGVydHlcclxuXHRcdFx0XHRcdC8vICAqIGNvbXBsZXRlQ2FsbGJhY2sgLSBhIGZ1bmN0aW9uIHRoYXQgd2lsbCBiZSBleGVjdXRlZCBhZnRlciB0aGUgYW5pbWF0aW9uIGhhZCBmaW5pc2hlZFxyXG5cdFx0XHRcdFx0Ly8gWW91IGNhbiB1c2UgdGhlIGRlZmF1bHQgaW1wbGVtZW50YXRpb24gKGJlbG93KSBhcyBhIHN0YXJ0aW5nIHBvaW50IGZvciB5b3VyIG93biBpbXBsZW1lbnRhdGlvbi5cclxuXHRcdFx0XHRcdGFuaW1hdGU6IGZ1bmN0aW9uKGVsZSwgcHJvcCwgdmFsdWUsIHN0ZXBDYWxsYmFjaywgY29tcGxldGVDYWxsYmFjaylcclxuXHRcdFx0XHRcdHtcclxuXHRcdFx0XHRcdFx0dmFyIHBhcmFtcyA9IHt9O1xyXG5cdFx0XHRcdFx0XHRwYXJhbXNbcHJvcF0gPSB2YWx1ZTtcclxuXHRcdFx0XHRcdFx0ZWxlLmFuaW1hdGUoXHJcblx0XHRcdFx0XHRcdFx0cGFyYW1zLFxyXG5cdFx0XHRcdFx0XHRcdHtcclxuXHRcdFx0XHRcdFx0XHRcdCdkdXJhdGlvbidcdDogc2V0dGluZ3MuYW5pbWF0ZUR1cmF0aW9uLFxyXG5cdFx0XHRcdFx0XHRcdFx0J2Vhc2luZydcdDogc2V0dGluZ3MuYW5pbWF0ZUVhc2UsXHJcblx0XHRcdFx0XHRcdFx0XHQncXVldWUnXHRcdDogZmFsc2UsXHJcblx0XHRcdFx0XHRcdFx0XHQnc3RlcCdcdFx0OiBzdGVwQ2FsbGJhY2ssXHJcblx0XHRcdFx0XHRcdFx0XHQnY29tcGxldGUnXHQ6IGNvbXBsZXRlQ2FsbGJhY2tcclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdCk7XHJcblx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0Ly8gUmV0dXJucyB0aGUgY3VycmVudCB4IHBvc2l0aW9uIG9mIHRoZSB2aWV3cG9ydCB3aXRoIHJlZ2FyZHMgdG8gdGhlIGNvbnRlbnQgcGFuZS5cclxuXHRcdFx0XHRcdGdldENvbnRlbnRQb3NpdGlvblg6IGZ1bmN0aW9uKClcclxuXHRcdFx0XHRcdHtcclxuXHRcdFx0XHRcdFx0cmV0dXJuIGNvbnRlbnRQb3NpdGlvblgoKTtcclxuXHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHQvLyBSZXR1cm5zIHRoZSBjdXJyZW50IHkgcG9zaXRpb24gb2YgdGhlIHZpZXdwb3J0IHdpdGggcmVnYXJkcyB0byB0aGUgY29udGVudCBwYW5lLlxyXG5cdFx0XHRcdFx0Z2V0Q29udGVudFBvc2l0aW9uWTogZnVuY3Rpb24oKVxyXG5cdFx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0XHRyZXR1cm4gY29udGVudFBvc2l0aW9uWSgpO1xyXG5cdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdC8vIFJldHVybnMgdGhlIHdpZHRoIG9mIHRoZSBjb250ZW50IHdpdGhpbiB0aGUgc2Nyb2xsIHBhbmUuXHJcblx0XHRcdFx0XHRnZXRDb250ZW50V2lkdGg6IGZ1bmN0aW9uKClcclxuXHRcdFx0XHRcdHtcclxuXHRcdFx0XHRcdFx0cmV0dXJuIGNvbnRlbnRXaWR0aDtcclxuXHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHQvLyBSZXR1cm5zIHRoZSBoZWlnaHQgb2YgdGhlIGNvbnRlbnQgd2l0aGluIHRoZSBzY3JvbGwgcGFuZS5cclxuXHRcdFx0XHRcdGdldENvbnRlbnRIZWlnaHQ6IGZ1bmN0aW9uKClcclxuXHRcdFx0XHRcdHtcclxuXHRcdFx0XHRcdFx0cmV0dXJuIGNvbnRlbnRIZWlnaHQ7XHJcblx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0Ly8gUmV0dXJucyB0aGUgaG9yaXpvbnRhbCBwb3NpdGlvbiBvZiB0aGUgdmlld3BvcnQgd2l0aGluIHRoZSBwYW5lIGNvbnRlbnQuXHJcblx0XHRcdFx0XHRnZXRQZXJjZW50U2Nyb2xsZWRYOiBmdW5jdGlvbigpXHJcblx0XHRcdFx0XHR7XHJcblx0XHRcdFx0XHRcdHJldHVybiBjb250ZW50UG9zaXRpb25YKCkgLyAoY29udGVudFdpZHRoIC0gcGFuZVdpZHRoKTtcclxuXHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHQvLyBSZXR1cm5zIHRoZSB2ZXJ0aWNhbCBwb3NpdGlvbiBvZiB0aGUgdmlld3BvcnQgd2l0aGluIHRoZSBwYW5lIGNvbnRlbnQuXHJcblx0XHRcdFx0XHRnZXRQZXJjZW50U2Nyb2xsZWRZOiBmdW5jdGlvbigpXHJcblx0XHRcdFx0XHR7XHJcblx0XHRcdFx0XHRcdHJldHVybiBjb250ZW50UG9zaXRpb25ZKCkgLyAoY29udGVudEhlaWdodCAtIHBhbmVIZWlnaHQpO1xyXG5cdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdC8vIFJldHVybnMgd2hldGhlciBvciBub3QgdGhpcyBzY3JvbGxwYW5lIGhhcyBhIGhvcml6b250YWwgc2Nyb2xsYmFyLlxyXG5cdFx0XHRcdFx0Z2V0SXNTY3JvbGxhYmxlSDogZnVuY3Rpb24oKVxyXG5cdFx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0XHRyZXR1cm4gaXNTY3JvbGxhYmxlSDtcclxuXHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHQvLyBSZXR1cm5zIHdoZXRoZXIgb3Igbm90IHRoaXMgc2Nyb2xscGFuZSBoYXMgYSB2ZXJ0aWNhbCBzY3JvbGxiYXIuXHJcblx0XHRcdFx0XHRnZXRJc1Njcm9sbGFibGVWOiBmdW5jdGlvbigpXHJcblx0XHRcdFx0XHR7XHJcblx0XHRcdFx0XHRcdHJldHVybiBpc1Njcm9sbGFibGVWO1xyXG5cdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdC8vIEdldHMgYSByZWZlcmVuY2UgdG8gdGhlIGNvbnRlbnQgcGFuZS4gSXQgaXMgaW1wb3J0YW50IHRoYXQgeW91IHVzZSB0aGlzIG1ldGhvZCBpZiB5b3Ugd2FudCB0b1xyXG5cdFx0XHRcdFx0Ly8gZWRpdCB0aGUgY29udGVudCBvZiB5b3VyIGpTY3JvbGxQYW5lIGFzIGlmIHlvdSBhY2Nlc3MgdGhlIGVsZW1lbnQgZGlyZWN0bHkgdGhlbiB5b3UgbWF5IGhhdmUgc29tZVxyXG5cdFx0XHRcdFx0Ly8gcHJvYmxlbXMgKGFzIHlvdXIgb3JpZ2luYWwgZWxlbWVudCBoYXMgaGFkIGFkZGl0aW9uYWwgZWxlbWVudHMgZm9yIHRoZSBzY3JvbGxiYXJzIGV0YyBhZGRlZCBpbnRvXHJcblx0XHRcdFx0XHQvLyBpdCkuXHJcblx0XHRcdFx0XHRnZXRDb250ZW50UGFuZTogZnVuY3Rpb24oKVxyXG5cdFx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0XHRyZXR1cm4gcGFuZTtcclxuXHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHQvLyBTY3JvbGxzIHRoaXMgalNjcm9sbFBhbmUgZG93biBhcyBmYXIgYXMgaXQgY2FuIGN1cnJlbnRseSBzY3JvbGwuIElmIGFuaW1hdGUgaXNuJ3QgcGFzc2VkIHRoZW4gdGhlXHJcblx0XHRcdFx0XHQvLyBhbmltYXRlU2Nyb2xsIHZhbHVlIGZyb20gc2V0dGluZ3MgaXMgdXNlZCBpbnN0ZWFkLlxyXG5cdFx0XHRcdFx0c2Nyb2xsVG9Cb3R0b206IGZ1bmN0aW9uKGFuaW1hdGUpXHJcblx0XHRcdFx0XHR7XHJcblx0XHRcdFx0XHRcdHBvc2l0aW9uRHJhZ1koZHJhZ01heFksIGFuaW1hdGUpO1xyXG5cdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdC8vIEhpamFja3MgdGhlIGxpbmtzIG9uIHRoZSBwYWdlIHdoaWNoIGxpbmsgdG8gY29udGVudCBpbnNpZGUgdGhlIHNjcm9sbHBhbmUuIElmIHlvdSBoYXZlIGNoYW5nZWRcclxuXHRcdFx0XHRcdC8vIHRoZSBjb250ZW50IG9mIHlvdXIgcGFnZSAoZS5nLiB2aWEgQUpBWCkgYW5kIHdhbnQgdG8gbWFrZSBzdXJlIGFueSBuZXcgYW5jaG9yIGxpbmtzIHRvIHRoZVxyXG5cdFx0XHRcdFx0Ly8gY29udGVudHMgb2YgeW91ciBzY3JvbGwgcGFuZSB3aWxsIHdvcmsgdGhlbiBjYWxsIHRoaXMgZnVuY3Rpb24uXHJcblx0XHRcdFx0XHRoaWphY2tJbnRlcm5hbExpbmtzOiAkLm5vb3AsXHJcblx0XHRcdFx0XHQvLyBSZW1vdmVzIHRoZSBqU2Nyb2xsUGFuZSBhbmQgcmV0dXJucyB0aGUgcGFnZSB0byB0aGUgc3RhdGUgaXQgd2FzIGluIGJlZm9yZSBqU2Nyb2xsUGFuZSB3YXNcclxuXHRcdFx0XHRcdC8vIGluaXRpYWxpc2VkLlxyXG5cdFx0XHRcdFx0ZGVzdHJveTogZnVuY3Rpb24oKVxyXG5cdFx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0XHRcdGRlc3Ryb3koKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdCk7XHJcblxyXG5cdFx0XHRpbml0aWFsaXNlKHMpO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIFBsdWdpbmlmeWluZyBjb2RlLi4uXHJcblx0XHRzZXR0aW5ncyA9ICQuZXh0ZW5kKHt9LCAkLmZuLmpTY3JvbGxQYW5lLmRlZmF1bHRzLCBzZXR0aW5ncyk7XHJcblxyXG5cdFx0Ly8gQXBwbHkgZGVmYXVsdCBzcGVlZFxyXG5cdFx0JC5lYWNoKFsnYXJyb3dCdXR0b25TcGVlZCcsICd0cmFja0NsaWNrU3BlZWQnLCAna2V5Ym9hcmRTcGVlZCddLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0c2V0dGluZ3NbdGhpc10gPSBzZXR0aW5nc1t0aGlzXSB8fCBzZXR0aW5ncy5zcGVlZDtcclxuXHRcdH0pO1xyXG5cclxuXHRcdHJldHVybiB0aGlzLmVhY2goXHJcblx0XHRcdGZ1bmN0aW9uKClcclxuXHRcdFx0e1xyXG5cdFx0XHRcdHZhciBlbGVtID0gJCh0aGlzKSwganNwQXBpID0gZWxlbS5kYXRhKCdqc3AnKTtcclxuXHRcdFx0XHRpZiAoanNwQXBpKSB7XHJcblx0XHRcdFx0XHRqc3BBcGkucmVpbml0aWFsaXNlKHNldHRpbmdzKTtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0JChcInNjcmlwdFwiLGVsZW0pLmZpbHRlcignW3R5cGU9XCJ0ZXh0L2phdmFzY3JpcHRcIl0sOm5vdChbdHlwZV0pJykucmVtb3ZlKCk7XHJcblx0XHRcdFx0XHRqc3BBcGkgPSBuZXcgSlNjcm9sbFBhbmUoZWxlbSwgc2V0dGluZ3MpO1xyXG5cdFx0XHRcdFx0ZWxlbS5kYXRhKCdqc3AnLCBqc3BBcGkpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0KTtcclxuXHR9O1xyXG5cclxuXHQkLmZuLmpTY3JvbGxQYW5lLmRlZmF1bHRzID0ge1xyXG5cdFx0c2hvd0Fycm93c1x0XHRcdFx0XHQ6IGZhbHNlLFxyXG5cdFx0bWFpbnRhaW5Qb3NpdGlvblx0XHRcdDogdHJ1ZSxcclxuXHRcdHN0aWNrVG9Cb3R0b21cdFx0XHRcdDogZmFsc2UsXHJcblx0XHRzdGlja1RvUmlnaHRcdFx0XHRcdDogZmFsc2UsXHJcblx0XHRjbGlja09uVHJhY2tcdFx0XHRcdDogdHJ1ZSxcclxuXHRcdGF1dG9SZWluaXRpYWxpc2VcdFx0XHQ6IGZhbHNlLFxyXG5cdFx0YXV0b1JlaW5pdGlhbGlzZURlbGF5XHRcdDogNTAwLFxyXG5cdFx0dmVydGljYWxEcmFnTWluSGVpZ2h0XHRcdDogMCxcclxuXHRcdHZlcnRpY2FsRHJhZ01heEhlaWdodFx0XHQ6IDk5OTk5LFxyXG5cdFx0aG9yaXpvbnRhbERyYWdNaW5XaWR0aFx0XHQ6IDAsXHJcblx0XHRob3Jpem9udGFsRHJhZ01heFdpZHRoXHRcdDogOTk5OTksXHJcblx0XHRjb250ZW50V2lkdGhcdFx0XHRcdDogdW5kZWZpbmVkLFxyXG5cdFx0YW5pbWF0ZVNjcm9sbFx0XHRcdFx0OiBmYWxzZSxcclxuXHRcdGFuaW1hdGVEdXJhdGlvblx0XHRcdFx0OiAzMDAsXHJcblx0XHRhbmltYXRlRWFzZVx0XHRcdFx0XHQ6ICdsaW5lYXInLFxyXG5cdFx0aGlqYWNrSW50ZXJuYWxMaW5rc1x0XHRcdDogZmFsc2UsXHJcblx0XHR2ZXJ0aWNhbEd1dHRlclx0XHRcdFx0OiA0LFxyXG5cdFx0aG9yaXpvbnRhbEd1dHRlclx0XHRcdDogNCxcclxuXHRcdG1vdXNlV2hlZWxTcGVlZFx0XHRcdFx0OiAzLFxyXG5cdFx0YXJyb3dCdXR0b25TcGVlZFx0XHRcdDogMCxcclxuXHRcdGFycm93UmVwZWF0RnJlcVx0XHRcdFx0OiA1MCxcclxuXHRcdGFycm93U2Nyb2xsT25Ib3Zlclx0XHRcdDogZmFsc2UsXHJcblx0XHR0cmFja0NsaWNrU3BlZWRcdFx0XHRcdDogMCxcclxuXHRcdHRyYWNrQ2xpY2tSZXBlYXRGcmVxXHRcdDogNzAsXHJcblx0XHR2ZXJ0aWNhbEFycm93UG9zaXRpb25zXHRcdDogJ3NwbGl0JyxcclxuXHRcdGhvcml6b250YWxBcnJvd1Bvc2l0aW9uc1x0OiAnc3BsaXQnLFxyXG5cdFx0ZW5hYmxlS2V5Ym9hcmROYXZpZ2F0aW9uXHQ6IHRydWUsXHJcblx0XHRoaWRlRm9jdXNcdFx0XHRcdFx0OiBmYWxzZSxcclxuXHRcdGtleWJvYXJkU3BlZWRcdFx0XHRcdDogMCxcclxuXHRcdGluaXRpYWxEZWxheSAgICAgICAgICAgICAgICA6IDMwMCwgICAgICAgIC8vIERlbGF5IGJlZm9yZSBzdGFydGluZyByZXBlYXRpbmdcclxuXHRcdHNwZWVkXHRcdFx0XHRcdFx0OiAzMCxcdFx0Ly8gRGVmYXVsdCBzcGVlZCB3aGVuIG90aGVycyBmYWxzZXlcclxuXHRcdHNjcm9sbFBhZ2VQZXJjZW50XHRcdFx0OiAwLjgsXHRcdC8vIFBlcmNlbnQgb2YgdmlzaWJsZSBhcmVhIHNjcm9sbGVkIHdoZW4gcGFnZVVwL0Rvd24gb3IgdHJhY2sgYXJlYSBwcmVzc2VkXHJcblx0XHRhbHdheXNTaG93VlNjcm9sbFx0XHRcdDogZmFsc2UsXHJcblx0XHRhbHdheXNTaG93SFNjcm9sbFx0XHRcdDogZmFsc2UsXHJcblx0XHRyZXNpemVTZW5zb3JcdFx0XHRcdDogZmFsc2UsXHJcblx0XHRyZXNpemVTZW5zb3JEZWxheVx0XHRcdDogMCxcclxuXHR9O1xyXG5cclxufSkpO1xyXG4iXSwiZmlsZSI6ImpxdWVyeS5qc2Nyb2xscGFuZS5qcyJ9
