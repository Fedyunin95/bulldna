/*
 *	jQuery dotdotdot 3.2.2
 *	@requires jQuery 1.7.0 or later
 *
 *	dotdotdot.frebsite.nl
 *
 *	Copyright (c) Fred Heusschen
 *	www.frebsite.nl
 *
 *	License: CC-BY-NC-4.0
 *	http://creativecommons.org/licenses/by-nc/4.0/
 */

(function( $ ) {
	'use strict';
	
	var _PLUGIN_    = 'dotdotdot';
	var _VERSION_   = '3.2.2';

	if ( $[ _PLUGIN_ ] && $[ _PLUGIN_ ].version > _VERSION_ )
	{
		return;
	}



	/*
		The class
	*/
	$[ _PLUGIN_ ] = function( $container, opts )
	{
		this.$dot 	= $container;
		this.api	= [ 'getInstance', 'truncate', 'restore', 'destroy', 'watch', 'unwatch' ];
		this.opts	= opts;

		var oldAPI = this.$dot.data( _PLUGIN_ );
		if ( oldAPI )
		{
			oldAPI.destroy();
		}

		this.init();
		this.truncate();

		if ( this.opts.watch )
		{
			this.watch();
		}

		return this;
	};

	$[ _PLUGIN_ ].version 	= _VERSION_;
	$[ _PLUGIN_ ].uniqueId 	= 0;

	$[ _PLUGIN_ ].defaults  = {
		ellipsis		: '\u2026 ',
		callback		: function( isTruncated ) {},
		truncate 		: 'word',
		tolerance		: 0,
		keep			: null,
		watch			: 'window',
		height 			: null
	};


	$[ _PLUGIN_ ].prototype = {

		init: function()
		{
			this.watchTimeout		= null;
			this.watchInterval		= null;
			this.uniqueId 			= $[ _PLUGIN_ ].uniqueId++;
			this.originalStyle		= this.$dot.attr( 'style' ) || '';
			this.originalContent 	= this._getOriginalContent();
			
			if ( this.$dot.css( 'word-wrap' ) !== 'break-word' )
			{
				this.$dot.css( 'word-wrap', 'break-word' );
			}
			if ( this.$dot.css( 'white-space' ) === 'nowrap' )
			{
				this.$dot.css( 'white-space', 'normal' );
			}

			if ( this.opts.height === null )
			{
				this.opts.height = this._getMaxHeight();
			}

			if ( typeof this.opts.ellipsis == 'string' )
			{
				this.opts.ellipsis = document.createTextNode( this.opts.ellipsis );
			}
		},

		getInstance: function()
		{
			return this;
		},

		truncate: function()
		{
			var that = this;


			//	Add inner node for measuring the height
			this.$inner = this.$dot
				.wrapInner( '<div />' )
				.children()
				.css({
					'display'	: 'block',
					'height'	: 'auto',
					'width'		: 'auto',
					'border'	: 'none',
					'padding'	: 0,
					'margin'	: 0
				});


			//	Set original content
			this.$inner
				.empty()
				.append( this.originalContent.clone( true ) );


			//	Get max height
			this.maxHeight = this._getMaxHeight();


			//	Truncate the text
			var isTruncated = false;
			if ( !this._fits() )
			{
				isTruncated = true;
				this._truncateToNode( this.$inner[ 0 ] );
			}

			this.$dot[ isTruncated ? 'addClass' : 'removeClass' ]( _c.truncated );


			//	Remove inner node
			this.$inner.replaceWith( this.$inner.contents() );
			this.$inner = null;


			//	 Callback
			this.opts.callback.call( this.$dot[ 0 ], isTruncated );

			return isTruncated;
		},

		restore: function()
		{
			this.unwatch();

			this.$dot
				.empty()
				.append( this.originalContent )
				.attr( 'style', this.originalStyle )
				.removeClass( _c.truncated );
		},

		destroy: function()
		{
			this.restore();
			this.$dot.data( _PLUGIN_, null );
		},

		watch: function()
		{
			var that = this;

			this.unwatch();

			var oldSizes = {};

			if ( this.opts.watch == 'window' )
			{
				$wndw.on(
					_e.resize + that.uniqueId,
					function( e )
					{
						if ( that.watchTimeout )
						{
							clearTimeout( that.watchTimeout );
						}
						that.watchTimeout = setTimeout(
							function() {

								oldSizes = that._watchSizes( oldSizes, $wndw, 'width', 'height' );

							}, 100
						);
					}
				);

			}
			else
			{
				this.watchInterval = setInterval(
					function()
					{
						oldSizes = that._watchSizes( oldSizes, that.$dot, 'innerWidth', 'innerHeight' );

					}, 500
				);
			}
		},

		unwatch: function()
		{
			$wndw.off( _e.resize + this.uniqueId );

			if ( this.watchInterval )
			{
				clearInterval( this.watchInterval );
			}

			if ( this.watchTimeout )
			{
				clearTimeout( this.watchTimeout );
			}
		},

		_api: function()
		{
			var that = this,
				api = {};

			$.each( this.api,
				function( i )
				{
					var fn = this;
					api[ fn ] = function()
					{
						var re = that[ fn ].apply( that, arguments );
						return ( typeof re == 'undefined' ) ? api : re;
					};
				}
			);
			return api;
		},

		_truncateToNode: function( _elem )
		{

			var that = this;

			var _coms = [],
				_elms = [];

			//	Empty the node 
			//		-> replace all contents with comments
			$(_elem)
				.contents()
				.each(
					function()
					{
						var $e = $(this);
						if ( !$e.hasClass( _c.keep ) )
						{
							var c = document.createComment( '' );
							$e.replaceWith( c );

							_elms.push( this );
							_coms.push( c );
						}
					}
				);

			if ( !_elms.length )
			{
				return;
			}

			//	Re-fill the node 
			//		-> replace comments with contents until it doesn't fit anymore
			for ( var e = 0; e < _elms.length; e++ )
			{

				$(_coms[ e ]).replaceWith( _elms[ e ] );

				$(_elms[ e ]).append( this.opts.ellipsis );
				var fits = this._fits();
				$(this.opts.ellipsis, _elms[ e ]).remove();

				if ( !fits )
				{
					if ( this.opts.truncate == 'node' && e > 1 )
					{
						$(_elms[ e - 2 ]).remove();
						return;
					}
					break;
				}
			}

			//	Remove left over comments
			for ( var c = e; c < _coms.length; c++ )
			{
				$(_coms[ c ]).remove();
			}

			//	Get last node 
			//		-> the node that overflows

			var _last = _elms[ Math.max( 0, Math.min( e, _elms.length - 1 ) ) ];

			//	Border case
			//		-> the last node with only an ellipsis in it...
			if ( _last.nodeType == 1 )
			{

				var $e = $('<' + _last.nodeName + ' />');
				$e.append( this.opts.ellipsis );

				$(_last).replaceWith( $e );

				//	... fits
				//		-> Restore the full last node
				if ( this._fits() )
				{
					$e.replaceWith( _last );
				}

				//	... doesn't fit
				//		-> remove it and go back one node
				else
				{
					$e.remove();
					_last = _elms[ Math.max( 0, e - 1 ) ];
				}
			}

			//	Proceed inside last node
			if ( _last.nodeType == 1 )
			{
				this._truncateToNode( _last );
			}
			else
			{
				this._truncateToWord( _last );
			}
		},

		_truncateToWord: function( _elem )
		{

			var e = _elem;

			var that = this;

			var txt = this.__getTextContent( e ),
				sep = ( txt.indexOf( ' ' ) !== -1 ) ? ' ' : '\u3000',
				arr = txt.split( sep ),
				str = '';

			for ( var a = arr.length; a >= 0; a-- )
			{
				str = arr.slice( 0, a ).join( sep );

				that.__setTextContent( e, that._addEllipsis( str ) );

				if ( that._fits() )
				{
					if ( that.opts.truncate == 'letter' )
					{
						that.__setTextContent( e, arr.slice( 0, a + 1 ).join( sep ) );
						that._truncateToLetter( e );
					}
					break;
				}
			}
		},

		_truncateToLetter: function( e )
		{
			var that = this;

			var txt = this.__getTextContent( e ),
				arr = txt.split( '' ),
				str = '';

			for ( var a = arr.length; a >= 0; a-- )
			{
				str = arr.slice( 0, a ).join( '' );

				if ( !str.length )
				{
					continue;
				}

				that.__setTextContent( e, that._addEllipsis( str ) );

				if ( that._fits() )
				{
					break;
				}
			}
		},

		_fits: function()
		{
			return ( this.$inner.innerHeight() <= this.maxHeight + this.opts.tolerance );
		},

		_addEllipsis: function( txt )
		{
			var remove = [' ', '\u3000', ',', ';', '.', '!', '?'];

			while ( $.inArray( txt.slice( -1 ), remove ) > -1 )
			{
				txt = txt.slice( 0, -1 );
			}
			txt += this.__getTextContent( this.opts.ellipsis );

			return txt;
		},

		_getOriginalContent: function()
		{
			var that = this;

			//	Add "keep" class to nodes to keep
			this.$dot
				.find( 'script, style' )
				.addClass( _c.keep );

			if ( this.opts.keep )
			{
				this.$dot
					.find( this.opts.keep )
					.addClass( _c.keep );
			}

			//	Filter out unneeded whitespace
			this.$dot
				.find( '*' )
				.not( '.' + _c.keep )
				.add( this.$dot )
				.contents()
				.each(
					function()
					{

						var e = this,
							$e = $(this);

						//	Text nodes
						if ( e.nodeType == 3 )
						{

							//	Remove whitespace where it does not take up space in the DOM
							if ( $.trim( that.__getTextContent( e ) ) == '' )
							{
								if ( $e.parent().is( 'table, thead, tbody, tfoot, tr, dl, ul, ol, video' ) )
								{
									$e.remove();
									return;
								}
								if ( $e.prev().is( 'div, p, table, td, td, dt, dd, li' ) )
								{
									$e.remove();
									return;
								}
								if ( $e.next().is( 'div, p, table, td, td, dt, dd, li' ) )
								{
									$e.remove();
									return;
								}
								if ( !$e.prev().length )
								{
									$e.remove();
									return;
								}
								if ( !$e.next().length )
								{
									$e.remove();
									return;
								}
							}
						}

						//	Comment nodes
						else if ( e.nodeType == 8 )
						{
							$e.remove();
						}

					}
				);

			return this.$dot.contents();
		},

		_getMaxHeight: function()
		{
			if ( typeof this.opts.height == 'number' )
			{
				return this.opts.height;
			}

			//	Find smallest CSS height
			var arr = [ 'maxHeight', 'height' ],
				hgh = 0;
 
			for ( var a = 0; a < arr.length; a++ )
			{
				hgh = window.getComputedStyle( this.$dot[ 0 ] )[ arr[ a ] ];
				if ( hgh.slice( -2 ) == 'px' )
				{
					hgh = parseFloat( hgh );
					break;
				}
			}

			//	Remove padding-top/bottom when needed.
			var arr = [];
			switch ( this.$dot.css( 'boxSizing' ) )
			{
				case 'border-box':
					arr.push( 'borderTopWidth' );
					arr.push( 'borderBottomWidth' );
					//	no break -> padding needs to be added too

				case 'padding-box':
					arr.push( 'paddingTop' );
					arr.push( 'paddingBottom' );
					break;
			}
			for ( var a = 0; a < arr.length; a++ )
			{
				var p = window.getComputedStyle( this.$dot[ 0 ] )[ arr[ a ] ];
				if ( p.slice( -2 ) == 'px' )
				{
					hgh -= parseFloat( p );
				}
			}

			//	Sanitize
			return Math.max( hgh, 0 );
		},

		_watchSizes: function( oldSizes, $elem, width, height )
		{
			if ( this.$dot.is( ':visible' ) )
			{
				var newSizes = {
					'width'		: $elem[ width  ](),
					'height'	: $elem[ height ]()
				};

				if ( oldSizes.width != newSizes.width || oldSizes.height != newSizes.height )
				{
					this.truncate();
				}

				return newSizes;
			}
			return oldSizes;
		},

		__getTextContent: function( elem )
		{
			var arr = [ 'nodeValue', 'textContent', 'innerText' ];
			for ( var a = 0; a < arr.length; a++ )
			{
				if ( typeof elem[ arr[ a ] ] == 'string' )
				{
					return elem[ arr[ a ] ];
				}
			}
			return '';
		},
		__setTextContent: function( elem, content )
		{
			var arr = [ 'nodeValue', 'textContent', 'innerText' ];
			for ( var a = 0; a < arr.length; a++ )
			{
				elem[ arr[ a ] ] = content;
			}
		}
	};



	/*
		The jQuery plugin
	*/
	$.fn[ _PLUGIN_ ] = function( opts )
	{
		initPlugin();

		opts = $.extend( true, {}, $[ _PLUGIN_ ].defaults, opts );

		return this.each(
			function()
			{
				$(this).data( _PLUGIN_, new $[ _PLUGIN_ ]( $(this), opts )._api() );
			}
		);
	};



	/*
		Global variables
	*/
	var _c, _d, _e, $wndw;

	function initPlugin()
	{
		$wndw = $(window);

		//	Classnames, Datanames, Eventnames
		_c = {};
		_d = {};
		_e = {};

		$.each( [ _c, _d, _e ],
			function( i, o )
			{
				o.add = function( a )
				{
					a = a.split( ' ' );
					for ( var b = 0, l = a.length; b < l; b++ )
					{
						o[ a[ b ] ] = o.ddd( a[ b ] );
					}
				};
			}
		);

		//	Classnames
		_c.ddd = function( c ) { return 'ddd-' + c; };
		_c.add( 'truncated keep' );

		//	Datanames
		_d.ddd = function( d ) { return 'ddd-' + d; };

		//	Eventnames
		_e.ddd = function( e ) { return e + '.ddd'; };
		_e.add( 'resize' );


		//	Only once
		initPlugin = function() {};

	}


})( jQuery );

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJqcXVlcnkuZG90ZG90ZG90LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qXHJcbiAqXHRqUXVlcnkgZG90ZG90ZG90IDMuMi4yXHJcbiAqXHRAcmVxdWlyZXMgalF1ZXJ5IDEuNy4wIG9yIGxhdGVyXHJcbiAqXHJcbiAqXHRkb3Rkb3Rkb3QuZnJlYnNpdGUubmxcclxuICpcclxuICpcdENvcHlyaWdodCAoYykgRnJlZCBIZXVzc2NoZW5cclxuICpcdHd3dy5mcmVic2l0ZS5ubFxyXG4gKlxyXG4gKlx0TGljZW5zZTogQ0MtQlktTkMtNC4wXHJcbiAqXHRodHRwOi8vY3JlYXRpdmVjb21tb25zLm9yZy9saWNlbnNlcy9ieS1uYy80LjAvXHJcbiAqL1xyXG5cclxuKGZ1bmN0aW9uKCAkICkge1xyXG5cdCd1c2Ugc3RyaWN0JztcclxuXHRcclxuXHR2YXIgX1BMVUdJTl8gICAgPSAnZG90ZG90ZG90JztcclxuXHR2YXIgX1ZFUlNJT05fICAgPSAnMy4yLjInO1xyXG5cclxuXHRpZiAoICRbIF9QTFVHSU5fIF0gJiYgJFsgX1BMVUdJTl8gXS52ZXJzaW9uID4gX1ZFUlNJT05fIClcclxuXHR7XHJcblx0XHRyZXR1cm47XHJcblx0fVxyXG5cclxuXHJcblxyXG5cdC8qXHJcblx0XHRUaGUgY2xhc3NcclxuXHQqL1xyXG5cdCRbIF9QTFVHSU5fIF0gPSBmdW5jdGlvbiggJGNvbnRhaW5lciwgb3B0cyApXHJcblx0e1xyXG5cdFx0dGhpcy4kZG90IFx0PSAkY29udGFpbmVyO1xyXG5cdFx0dGhpcy5hcGlcdD0gWyAnZ2V0SW5zdGFuY2UnLCAndHJ1bmNhdGUnLCAncmVzdG9yZScsICdkZXN0cm95JywgJ3dhdGNoJywgJ3Vud2F0Y2gnIF07XHJcblx0XHR0aGlzLm9wdHNcdD0gb3B0cztcclxuXHJcblx0XHR2YXIgb2xkQVBJID0gdGhpcy4kZG90LmRhdGEoIF9QTFVHSU5fICk7XHJcblx0XHRpZiAoIG9sZEFQSSApXHJcblx0XHR7XHJcblx0XHRcdG9sZEFQSS5kZXN0cm95KCk7XHJcblx0XHR9XHJcblxyXG5cdFx0dGhpcy5pbml0KCk7XHJcblx0XHR0aGlzLnRydW5jYXRlKCk7XHJcblxyXG5cdFx0aWYgKCB0aGlzLm9wdHMud2F0Y2ggKVxyXG5cdFx0e1xyXG5cdFx0XHR0aGlzLndhdGNoKCk7XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIHRoaXM7XHJcblx0fTtcclxuXHJcblx0JFsgX1BMVUdJTl8gXS52ZXJzaW9uIFx0PSBfVkVSU0lPTl87XHJcblx0JFsgX1BMVUdJTl8gXS51bmlxdWVJZCBcdD0gMDtcclxuXHJcblx0JFsgX1BMVUdJTl8gXS5kZWZhdWx0cyAgPSB7XHJcblx0XHRlbGxpcHNpc1x0XHQ6ICdcXHUyMDI2ICcsXHJcblx0XHRjYWxsYmFja1x0XHQ6IGZ1bmN0aW9uKCBpc1RydW5jYXRlZCApIHt9LFxyXG5cdFx0dHJ1bmNhdGUgXHRcdDogJ3dvcmQnLFxyXG5cdFx0dG9sZXJhbmNlXHRcdDogMCxcclxuXHRcdGtlZXBcdFx0XHQ6IG51bGwsXHJcblx0XHR3YXRjaFx0XHRcdDogJ3dpbmRvdycsXHJcblx0XHRoZWlnaHQgXHRcdFx0OiBudWxsXHJcblx0fTtcclxuXHJcblxyXG5cdCRbIF9QTFVHSU5fIF0ucHJvdG90eXBlID0ge1xyXG5cclxuXHRcdGluaXQ6IGZ1bmN0aW9uKClcclxuXHRcdHtcclxuXHRcdFx0dGhpcy53YXRjaFRpbWVvdXRcdFx0PSBudWxsO1xyXG5cdFx0XHR0aGlzLndhdGNoSW50ZXJ2YWxcdFx0PSBudWxsO1xyXG5cdFx0XHR0aGlzLnVuaXF1ZUlkIFx0XHRcdD0gJFsgX1BMVUdJTl8gXS51bmlxdWVJZCsrO1xyXG5cdFx0XHR0aGlzLm9yaWdpbmFsU3R5bGVcdFx0PSB0aGlzLiRkb3QuYXR0ciggJ3N0eWxlJyApIHx8ICcnO1xyXG5cdFx0XHR0aGlzLm9yaWdpbmFsQ29udGVudCBcdD0gdGhpcy5fZ2V0T3JpZ2luYWxDb250ZW50KCk7XHJcblx0XHRcdFxyXG5cdFx0XHRpZiAoIHRoaXMuJGRvdC5jc3MoICd3b3JkLXdyYXAnICkgIT09ICdicmVhay13b3JkJyApXHJcblx0XHRcdHtcclxuXHRcdFx0XHR0aGlzLiRkb3QuY3NzKCAnd29yZC13cmFwJywgJ2JyZWFrLXdvcmQnICk7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYgKCB0aGlzLiRkb3QuY3NzKCAnd2hpdGUtc3BhY2UnICkgPT09ICdub3dyYXAnIClcclxuXHRcdFx0e1xyXG5cdFx0XHRcdHRoaXMuJGRvdC5jc3MoICd3aGl0ZS1zcGFjZScsICdub3JtYWwnICk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmICggdGhpcy5vcHRzLmhlaWdodCA9PT0gbnVsbCApXHJcblx0XHRcdHtcclxuXHRcdFx0XHR0aGlzLm9wdHMuaGVpZ2h0ID0gdGhpcy5fZ2V0TWF4SGVpZ2h0KCk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmICggdHlwZW9mIHRoaXMub3B0cy5lbGxpcHNpcyA9PSAnc3RyaW5nJyApXHJcblx0XHRcdHtcclxuXHRcdFx0XHR0aGlzLm9wdHMuZWxsaXBzaXMgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSggdGhpcy5vcHRzLmVsbGlwc2lzICk7XHJcblx0XHRcdH1cclxuXHRcdH0sXHJcblxyXG5cdFx0Z2V0SW5zdGFuY2U6IGZ1bmN0aW9uKClcclxuXHRcdHtcclxuXHRcdFx0cmV0dXJuIHRoaXM7XHJcblx0XHR9LFxyXG5cclxuXHRcdHRydW5jYXRlOiBmdW5jdGlvbigpXHJcblx0XHR7XHJcblx0XHRcdHZhciB0aGF0ID0gdGhpcztcclxuXHJcblxyXG5cdFx0XHQvL1x0QWRkIGlubmVyIG5vZGUgZm9yIG1lYXN1cmluZyB0aGUgaGVpZ2h0XHJcblx0XHRcdHRoaXMuJGlubmVyID0gdGhpcy4kZG90XHJcblx0XHRcdFx0LndyYXBJbm5lciggJzxkaXYgLz4nIClcclxuXHRcdFx0XHQuY2hpbGRyZW4oKVxyXG5cdFx0XHRcdC5jc3Moe1xyXG5cdFx0XHRcdFx0J2Rpc3BsYXknXHQ6ICdibG9jaycsXHJcblx0XHRcdFx0XHQnaGVpZ2h0J1x0OiAnYXV0bycsXHJcblx0XHRcdFx0XHQnd2lkdGgnXHRcdDogJ2F1dG8nLFxyXG5cdFx0XHRcdFx0J2JvcmRlcidcdDogJ25vbmUnLFxyXG5cdFx0XHRcdFx0J3BhZGRpbmcnXHQ6IDAsXHJcblx0XHRcdFx0XHQnbWFyZ2luJ1x0OiAwXHJcblx0XHRcdFx0fSk7XHJcblxyXG5cclxuXHRcdFx0Ly9cdFNldCBvcmlnaW5hbCBjb250ZW50XHJcblx0XHRcdHRoaXMuJGlubmVyXHJcblx0XHRcdFx0LmVtcHR5KClcclxuXHRcdFx0XHQuYXBwZW5kKCB0aGlzLm9yaWdpbmFsQ29udGVudC5jbG9uZSggdHJ1ZSApICk7XHJcblxyXG5cclxuXHRcdFx0Ly9cdEdldCBtYXggaGVpZ2h0XHJcblx0XHRcdHRoaXMubWF4SGVpZ2h0ID0gdGhpcy5fZ2V0TWF4SGVpZ2h0KCk7XHJcblxyXG5cclxuXHRcdFx0Ly9cdFRydW5jYXRlIHRoZSB0ZXh0XHJcblx0XHRcdHZhciBpc1RydW5jYXRlZCA9IGZhbHNlO1xyXG5cdFx0XHRpZiAoICF0aGlzLl9maXRzKCkgKVxyXG5cdFx0XHR7XHJcblx0XHRcdFx0aXNUcnVuY2F0ZWQgPSB0cnVlO1xyXG5cdFx0XHRcdHRoaXMuX3RydW5jYXRlVG9Ob2RlKCB0aGlzLiRpbm5lclsgMCBdICk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHRoaXMuJGRvdFsgaXNUcnVuY2F0ZWQgPyAnYWRkQ2xhc3MnIDogJ3JlbW92ZUNsYXNzJyBdKCBfYy50cnVuY2F0ZWQgKTtcclxuXHJcblxyXG5cdFx0XHQvL1x0UmVtb3ZlIGlubmVyIG5vZGVcclxuXHRcdFx0dGhpcy4kaW5uZXIucmVwbGFjZVdpdGgoIHRoaXMuJGlubmVyLmNvbnRlbnRzKCkgKTtcclxuXHRcdFx0dGhpcy4kaW5uZXIgPSBudWxsO1xyXG5cclxuXHJcblx0XHRcdC8vXHQgQ2FsbGJhY2tcclxuXHRcdFx0dGhpcy5vcHRzLmNhbGxiYWNrLmNhbGwoIHRoaXMuJGRvdFsgMCBdLCBpc1RydW5jYXRlZCApO1xyXG5cclxuXHRcdFx0cmV0dXJuIGlzVHJ1bmNhdGVkO1xyXG5cdFx0fSxcclxuXHJcblx0XHRyZXN0b3JlOiBmdW5jdGlvbigpXHJcblx0XHR7XHJcblx0XHRcdHRoaXMudW53YXRjaCgpO1xyXG5cclxuXHRcdFx0dGhpcy4kZG90XHJcblx0XHRcdFx0LmVtcHR5KClcclxuXHRcdFx0XHQuYXBwZW5kKCB0aGlzLm9yaWdpbmFsQ29udGVudCApXHJcblx0XHRcdFx0LmF0dHIoICdzdHlsZScsIHRoaXMub3JpZ2luYWxTdHlsZSApXHJcblx0XHRcdFx0LnJlbW92ZUNsYXNzKCBfYy50cnVuY2F0ZWQgKTtcclxuXHRcdH0sXHJcblxyXG5cdFx0ZGVzdHJveTogZnVuY3Rpb24oKVxyXG5cdFx0e1xyXG5cdFx0XHR0aGlzLnJlc3RvcmUoKTtcclxuXHRcdFx0dGhpcy4kZG90LmRhdGEoIF9QTFVHSU5fLCBudWxsICk7XHJcblx0XHR9LFxyXG5cclxuXHRcdHdhdGNoOiBmdW5jdGlvbigpXHJcblx0XHR7XHJcblx0XHRcdHZhciB0aGF0ID0gdGhpcztcclxuXHJcblx0XHRcdHRoaXMudW53YXRjaCgpO1xyXG5cclxuXHRcdFx0dmFyIG9sZFNpemVzID0ge307XHJcblxyXG5cdFx0XHRpZiAoIHRoaXMub3B0cy53YXRjaCA9PSAnd2luZG93JyApXHJcblx0XHRcdHtcclxuXHRcdFx0XHQkd25kdy5vbihcclxuXHRcdFx0XHRcdF9lLnJlc2l6ZSArIHRoYXQudW5pcXVlSWQsXHJcblx0XHRcdFx0XHRmdW5jdGlvbiggZSApXHJcblx0XHRcdFx0XHR7XHJcblx0XHRcdFx0XHRcdGlmICggdGhhdC53YXRjaFRpbWVvdXQgKVxyXG5cdFx0XHRcdFx0XHR7XHJcblx0XHRcdFx0XHRcdFx0Y2xlYXJUaW1lb3V0KCB0aGF0LndhdGNoVGltZW91dCApO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdHRoYXQud2F0Y2hUaW1lb3V0ID0gc2V0VGltZW91dChcclxuXHRcdFx0XHRcdFx0XHRmdW5jdGlvbigpIHtcclxuXHJcblx0XHRcdFx0XHRcdFx0XHRvbGRTaXplcyA9IHRoYXQuX3dhdGNoU2l6ZXMoIG9sZFNpemVzLCAkd25kdywgJ3dpZHRoJywgJ2hlaWdodCcgKTtcclxuXHJcblx0XHRcdFx0XHRcdFx0fSwgMTAwXHJcblx0XHRcdFx0XHRcdCk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0KTtcclxuXHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHR7XHJcblx0XHRcdFx0dGhpcy53YXRjaEludGVydmFsID0gc2V0SW50ZXJ2YWwoXHJcblx0XHRcdFx0XHRmdW5jdGlvbigpXHJcblx0XHRcdFx0XHR7XHJcblx0XHRcdFx0XHRcdG9sZFNpemVzID0gdGhhdC5fd2F0Y2hTaXplcyggb2xkU2l6ZXMsIHRoYXQuJGRvdCwgJ2lubmVyV2lkdGgnLCAnaW5uZXJIZWlnaHQnICk7XHJcblxyXG5cdFx0XHRcdFx0fSwgNTAwXHJcblx0XHRcdFx0KTtcclxuXHRcdFx0fVxyXG5cdFx0fSxcclxuXHJcblx0XHR1bndhdGNoOiBmdW5jdGlvbigpXHJcblx0XHR7XHJcblx0XHRcdCR3bmR3Lm9mZiggX2UucmVzaXplICsgdGhpcy51bmlxdWVJZCApO1xyXG5cclxuXHRcdFx0aWYgKCB0aGlzLndhdGNoSW50ZXJ2YWwgKVxyXG5cdFx0XHR7XHJcblx0XHRcdFx0Y2xlYXJJbnRlcnZhbCggdGhpcy53YXRjaEludGVydmFsICk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmICggdGhpcy53YXRjaFRpbWVvdXQgKVxyXG5cdFx0XHR7XHJcblx0XHRcdFx0Y2xlYXJUaW1lb3V0KCB0aGlzLndhdGNoVGltZW91dCApO1xyXG5cdFx0XHR9XHJcblx0XHR9LFxyXG5cclxuXHRcdF9hcGk6IGZ1bmN0aW9uKClcclxuXHRcdHtcclxuXHRcdFx0dmFyIHRoYXQgPSB0aGlzLFxyXG5cdFx0XHRcdGFwaSA9IHt9O1xyXG5cclxuXHRcdFx0JC5lYWNoKCB0aGlzLmFwaSxcclxuXHRcdFx0XHRmdW5jdGlvbiggaSApXHJcblx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0dmFyIGZuID0gdGhpcztcclxuXHRcdFx0XHRcdGFwaVsgZm4gXSA9IGZ1bmN0aW9uKClcclxuXHRcdFx0XHRcdHtcclxuXHRcdFx0XHRcdFx0dmFyIHJlID0gdGhhdFsgZm4gXS5hcHBseSggdGhhdCwgYXJndW1lbnRzICk7XHJcblx0XHRcdFx0XHRcdHJldHVybiAoIHR5cGVvZiByZSA9PSAndW5kZWZpbmVkJyApID8gYXBpIDogcmU7XHJcblx0XHRcdFx0XHR9O1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0KTtcclxuXHRcdFx0cmV0dXJuIGFwaTtcclxuXHRcdH0sXHJcblxyXG5cdFx0X3RydW5jYXRlVG9Ob2RlOiBmdW5jdGlvbiggX2VsZW0gKVxyXG5cdFx0e1xyXG5cclxuXHRcdFx0dmFyIHRoYXQgPSB0aGlzO1xyXG5cclxuXHRcdFx0dmFyIF9jb21zID0gW10sXHJcblx0XHRcdFx0X2VsbXMgPSBbXTtcclxuXHJcblx0XHRcdC8vXHRFbXB0eSB0aGUgbm9kZSBcclxuXHRcdFx0Ly9cdFx0LT4gcmVwbGFjZSBhbGwgY29udGVudHMgd2l0aCBjb21tZW50c1xyXG5cdFx0XHQkKF9lbGVtKVxyXG5cdFx0XHRcdC5jb250ZW50cygpXHJcblx0XHRcdFx0LmVhY2goXHJcblx0XHRcdFx0XHRmdW5jdGlvbigpXHJcblx0XHRcdFx0XHR7XHJcblx0XHRcdFx0XHRcdHZhciAkZSA9ICQodGhpcyk7XHJcblx0XHRcdFx0XHRcdGlmICggISRlLmhhc0NsYXNzKCBfYy5rZWVwICkgKVxyXG5cdFx0XHRcdFx0XHR7XHJcblx0XHRcdFx0XHRcdFx0dmFyIGMgPSBkb2N1bWVudC5jcmVhdGVDb21tZW50KCAnJyApO1xyXG5cdFx0XHRcdFx0XHRcdCRlLnJlcGxhY2VXaXRoKCBjICk7XHJcblxyXG5cdFx0XHRcdFx0XHRcdF9lbG1zLnB1c2goIHRoaXMgKTtcclxuXHRcdFx0XHRcdFx0XHRfY29tcy5wdXNoKCBjICk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHQpO1xyXG5cclxuXHRcdFx0aWYgKCAhX2VsbXMubGVuZ3RoIClcclxuXHRcdFx0e1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Ly9cdFJlLWZpbGwgdGhlIG5vZGUgXHJcblx0XHRcdC8vXHRcdC0+IHJlcGxhY2UgY29tbWVudHMgd2l0aCBjb250ZW50cyB1bnRpbCBpdCBkb2Vzbid0IGZpdCBhbnltb3JlXHJcblx0XHRcdGZvciAoIHZhciBlID0gMDsgZSA8IF9lbG1zLmxlbmd0aDsgZSsrIClcclxuXHRcdFx0e1xyXG5cclxuXHRcdFx0XHQkKF9jb21zWyBlIF0pLnJlcGxhY2VXaXRoKCBfZWxtc1sgZSBdICk7XHJcblxyXG5cdFx0XHRcdCQoX2VsbXNbIGUgXSkuYXBwZW5kKCB0aGlzLm9wdHMuZWxsaXBzaXMgKTtcclxuXHRcdFx0XHR2YXIgZml0cyA9IHRoaXMuX2ZpdHMoKTtcclxuXHRcdFx0XHQkKHRoaXMub3B0cy5lbGxpcHNpcywgX2VsbXNbIGUgXSkucmVtb3ZlKCk7XHJcblxyXG5cdFx0XHRcdGlmICggIWZpdHMgKVxyXG5cdFx0XHRcdHtcclxuXHRcdFx0XHRcdGlmICggdGhpcy5vcHRzLnRydW5jYXRlID09ICdub2RlJyAmJiBlID4gMSApXHJcblx0XHRcdFx0XHR7XHJcblx0XHRcdFx0XHRcdCQoX2VsbXNbIGUgLSAyIF0pLnJlbW92ZSgpO1xyXG5cdFx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdC8vXHRSZW1vdmUgbGVmdCBvdmVyIGNvbW1lbnRzXHJcblx0XHRcdGZvciAoIHZhciBjID0gZTsgYyA8IF9jb21zLmxlbmd0aDsgYysrIClcclxuXHRcdFx0e1xyXG5cdFx0XHRcdCQoX2NvbXNbIGMgXSkucmVtb3ZlKCk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdC8vXHRHZXQgbGFzdCBub2RlIFxyXG5cdFx0XHQvL1x0XHQtPiB0aGUgbm9kZSB0aGF0IG92ZXJmbG93c1xyXG5cclxuXHRcdFx0dmFyIF9sYXN0ID0gX2VsbXNbIE1hdGgubWF4KCAwLCBNYXRoLm1pbiggZSwgX2VsbXMubGVuZ3RoIC0gMSApICkgXTtcclxuXHJcblx0XHRcdC8vXHRCb3JkZXIgY2FzZVxyXG5cdFx0XHQvL1x0XHQtPiB0aGUgbGFzdCBub2RlIHdpdGggb25seSBhbiBlbGxpcHNpcyBpbiBpdC4uLlxyXG5cdFx0XHRpZiAoIF9sYXN0Lm5vZGVUeXBlID09IDEgKVxyXG5cdFx0XHR7XHJcblxyXG5cdFx0XHRcdHZhciAkZSA9ICQoJzwnICsgX2xhc3Qubm9kZU5hbWUgKyAnIC8+Jyk7XHJcblx0XHRcdFx0JGUuYXBwZW5kKCB0aGlzLm9wdHMuZWxsaXBzaXMgKTtcclxuXHJcblx0XHRcdFx0JChfbGFzdCkucmVwbGFjZVdpdGgoICRlICk7XHJcblxyXG5cdFx0XHRcdC8vXHQuLi4gZml0c1xyXG5cdFx0XHRcdC8vXHRcdC0+IFJlc3RvcmUgdGhlIGZ1bGwgbGFzdCBub2RlXHJcblx0XHRcdFx0aWYgKCB0aGlzLl9maXRzKCkgKVxyXG5cdFx0XHRcdHtcclxuXHRcdFx0XHRcdCRlLnJlcGxhY2VXaXRoKCBfbGFzdCApO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0Ly9cdC4uLiBkb2Vzbid0IGZpdFxyXG5cdFx0XHRcdC8vXHRcdC0+IHJlbW92ZSBpdCBhbmQgZ28gYmFjayBvbmUgbm9kZVxyXG5cdFx0XHRcdGVsc2VcclxuXHRcdFx0XHR7XHJcblx0XHRcdFx0XHQkZS5yZW1vdmUoKTtcclxuXHRcdFx0XHRcdF9sYXN0ID0gX2VsbXNbIE1hdGgubWF4KCAwLCBlIC0gMSApIF07XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHQvL1x0UHJvY2VlZCBpbnNpZGUgbGFzdCBub2RlXHJcblx0XHRcdGlmICggX2xhc3Qubm9kZVR5cGUgPT0gMSApXHJcblx0XHRcdHtcclxuXHRcdFx0XHR0aGlzLl90cnVuY2F0ZVRvTm9kZSggX2xhc3QgKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlXHJcblx0XHRcdHtcclxuXHRcdFx0XHR0aGlzLl90cnVuY2F0ZVRvV29yZCggX2xhc3QgKTtcclxuXHRcdFx0fVxyXG5cdFx0fSxcclxuXHJcblx0XHRfdHJ1bmNhdGVUb1dvcmQ6IGZ1bmN0aW9uKCBfZWxlbSApXHJcblx0XHR7XHJcblxyXG5cdFx0XHR2YXIgZSA9IF9lbGVtO1xyXG5cclxuXHRcdFx0dmFyIHRoYXQgPSB0aGlzO1xyXG5cclxuXHRcdFx0dmFyIHR4dCA9IHRoaXMuX19nZXRUZXh0Q29udGVudCggZSApLFxyXG5cdFx0XHRcdHNlcCA9ICggdHh0LmluZGV4T2YoICcgJyApICE9PSAtMSApID8gJyAnIDogJ1xcdTMwMDAnLFxyXG5cdFx0XHRcdGFyciA9IHR4dC5zcGxpdCggc2VwICksXHJcblx0XHRcdFx0c3RyID0gJyc7XHJcblxyXG5cdFx0XHRmb3IgKCB2YXIgYSA9IGFyci5sZW5ndGg7IGEgPj0gMDsgYS0tIClcclxuXHRcdFx0e1xyXG5cdFx0XHRcdHN0ciA9IGFyci5zbGljZSggMCwgYSApLmpvaW4oIHNlcCApO1xyXG5cclxuXHRcdFx0XHR0aGF0Ll9fc2V0VGV4dENvbnRlbnQoIGUsIHRoYXQuX2FkZEVsbGlwc2lzKCBzdHIgKSApO1xyXG5cclxuXHRcdFx0XHRpZiAoIHRoYXQuX2ZpdHMoKSApXHJcblx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0aWYgKCB0aGF0Lm9wdHMudHJ1bmNhdGUgPT0gJ2xldHRlcicgKVxyXG5cdFx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0XHR0aGF0Ll9fc2V0VGV4dENvbnRlbnQoIGUsIGFyci5zbGljZSggMCwgYSArIDEgKS5qb2luKCBzZXAgKSApO1xyXG5cdFx0XHRcdFx0XHR0aGF0Ll90cnVuY2F0ZVRvTGV0dGVyKCBlICk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH0sXHJcblxyXG5cdFx0X3RydW5jYXRlVG9MZXR0ZXI6IGZ1bmN0aW9uKCBlIClcclxuXHRcdHtcclxuXHRcdFx0dmFyIHRoYXQgPSB0aGlzO1xyXG5cclxuXHRcdFx0dmFyIHR4dCA9IHRoaXMuX19nZXRUZXh0Q29udGVudCggZSApLFxyXG5cdFx0XHRcdGFyciA9IHR4dC5zcGxpdCggJycgKSxcclxuXHRcdFx0XHRzdHIgPSAnJztcclxuXHJcblx0XHRcdGZvciAoIHZhciBhID0gYXJyLmxlbmd0aDsgYSA+PSAwOyBhLS0gKVxyXG5cdFx0XHR7XHJcblx0XHRcdFx0c3RyID0gYXJyLnNsaWNlKCAwLCBhICkuam9pbiggJycgKTtcclxuXHJcblx0XHRcdFx0aWYgKCAhc3RyLmxlbmd0aCApXHJcblx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0Y29udGludWU7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHR0aGF0Ll9fc2V0VGV4dENvbnRlbnQoIGUsIHRoYXQuX2FkZEVsbGlwc2lzKCBzdHIgKSApO1xyXG5cclxuXHRcdFx0XHRpZiAoIHRoYXQuX2ZpdHMoKSApXHJcblx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9LFxyXG5cclxuXHRcdF9maXRzOiBmdW5jdGlvbigpXHJcblx0XHR7XHJcblx0XHRcdHJldHVybiAoIHRoaXMuJGlubmVyLmlubmVySGVpZ2h0KCkgPD0gdGhpcy5tYXhIZWlnaHQgKyB0aGlzLm9wdHMudG9sZXJhbmNlICk7XHJcblx0XHR9LFxyXG5cclxuXHRcdF9hZGRFbGxpcHNpczogZnVuY3Rpb24oIHR4dCApXHJcblx0XHR7XHJcblx0XHRcdHZhciByZW1vdmUgPSBbJyAnLCAnXFx1MzAwMCcsICcsJywgJzsnLCAnLicsICchJywgJz8nXTtcclxuXHJcblx0XHRcdHdoaWxlICggJC5pbkFycmF5KCB0eHQuc2xpY2UoIC0xICksIHJlbW92ZSApID4gLTEgKVxyXG5cdFx0XHR7XHJcblx0XHRcdFx0dHh0ID0gdHh0LnNsaWNlKCAwLCAtMSApO1xyXG5cdFx0XHR9XHJcblx0XHRcdHR4dCArPSB0aGlzLl9fZ2V0VGV4dENvbnRlbnQoIHRoaXMub3B0cy5lbGxpcHNpcyApO1xyXG5cclxuXHRcdFx0cmV0dXJuIHR4dDtcclxuXHRcdH0sXHJcblxyXG5cdFx0X2dldE9yaWdpbmFsQ29udGVudDogZnVuY3Rpb24oKVxyXG5cdFx0e1xyXG5cdFx0XHR2YXIgdGhhdCA9IHRoaXM7XHJcblxyXG5cdFx0XHQvL1x0QWRkIFwia2VlcFwiIGNsYXNzIHRvIG5vZGVzIHRvIGtlZXBcclxuXHRcdFx0dGhpcy4kZG90XHJcblx0XHRcdFx0LmZpbmQoICdzY3JpcHQsIHN0eWxlJyApXHJcblx0XHRcdFx0LmFkZENsYXNzKCBfYy5rZWVwICk7XHJcblxyXG5cdFx0XHRpZiAoIHRoaXMub3B0cy5rZWVwIClcclxuXHRcdFx0e1xyXG5cdFx0XHRcdHRoaXMuJGRvdFxyXG5cdFx0XHRcdFx0LmZpbmQoIHRoaXMub3B0cy5rZWVwIClcclxuXHRcdFx0XHRcdC5hZGRDbGFzcyggX2Mua2VlcCApO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHQvL1x0RmlsdGVyIG91dCB1bm5lZWRlZCB3aGl0ZXNwYWNlXHJcblx0XHRcdHRoaXMuJGRvdFxyXG5cdFx0XHRcdC5maW5kKCAnKicgKVxyXG5cdFx0XHRcdC5ub3QoICcuJyArIF9jLmtlZXAgKVxyXG5cdFx0XHRcdC5hZGQoIHRoaXMuJGRvdCApXHJcblx0XHRcdFx0LmNvbnRlbnRzKClcclxuXHRcdFx0XHQuZWFjaChcclxuXHRcdFx0XHRcdGZ1bmN0aW9uKClcclxuXHRcdFx0XHRcdHtcclxuXHJcblx0XHRcdFx0XHRcdHZhciBlID0gdGhpcyxcclxuXHRcdFx0XHRcdFx0XHQkZSA9ICQodGhpcyk7XHJcblxyXG5cdFx0XHRcdFx0XHQvL1x0VGV4dCBub2Rlc1xyXG5cdFx0XHRcdFx0XHRpZiAoIGUubm9kZVR5cGUgPT0gMyApXHJcblx0XHRcdFx0XHRcdHtcclxuXHJcblx0XHRcdFx0XHRcdFx0Ly9cdFJlbW92ZSB3aGl0ZXNwYWNlIHdoZXJlIGl0IGRvZXMgbm90IHRha2UgdXAgc3BhY2UgaW4gdGhlIERPTVxyXG5cdFx0XHRcdFx0XHRcdGlmICggJC50cmltKCB0aGF0Ll9fZ2V0VGV4dENvbnRlbnQoIGUgKSApID09ICcnIClcclxuXHRcdFx0XHRcdFx0XHR7XHJcblx0XHRcdFx0XHRcdFx0XHRpZiAoICRlLnBhcmVudCgpLmlzKCAndGFibGUsIHRoZWFkLCB0Ym9keSwgdGZvb3QsIHRyLCBkbCwgdWwsIG9sLCB2aWRlbycgKSApXHJcblx0XHRcdFx0XHRcdFx0XHR7XHJcblx0XHRcdFx0XHRcdFx0XHRcdCRlLnJlbW92ZSgpO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHRpZiAoICRlLnByZXYoKS5pcyggJ2RpdiwgcCwgdGFibGUsIHRkLCB0ZCwgZHQsIGRkLCBsaScgKSApXHJcblx0XHRcdFx0XHRcdFx0XHR7XHJcblx0XHRcdFx0XHRcdFx0XHRcdCRlLnJlbW92ZSgpO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHRpZiAoICRlLm5leHQoKS5pcyggJ2RpdiwgcCwgdGFibGUsIHRkLCB0ZCwgZHQsIGRkLCBsaScgKSApXHJcblx0XHRcdFx0XHRcdFx0XHR7XHJcblx0XHRcdFx0XHRcdFx0XHRcdCRlLnJlbW92ZSgpO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHRpZiAoICEkZS5wcmV2KCkubGVuZ3RoIClcclxuXHRcdFx0XHRcdFx0XHRcdHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0JGUucmVtb3ZlKCk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdGlmICggISRlLm5leHQoKS5sZW5ndGggKVxyXG5cdFx0XHRcdFx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0XHRcdFx0XHQkZS5yZW1vdmUoKTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdFx0Ly9cdENvbW1lbnQgbm9kZXNcclxuXHRcdFx0XHRcdFx0ZWxzZSBpZiAoIGUubm9kZVR5cGUgPT0gOCApXHJcblx0XHRcdFx0XHRcdHtcclxuXHRcdFx0XHRcdFx0XHQkZS5yZW1vdmUoKTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHQpO1xyXG5cclxuXHRcdFx0cmV0dXJuIHRoaXMuJGRvdC5jb250ZW50cygpO1xyXG5cdFx0fSxcclxuXHJcblx0XHRfZ2V0TWF4SGVpZ2h0OiBmdW5jdGlvbigpXHJcblx0XHR7XHJcblx0XHRcdGlmICggdHlwZW9mIHRoaXMub3B0cy5oZWlnaHQgPT0gJ251bWJlcicgKVxyXG5cdFx0XHR7XHJcblx0XHRcdFx0cmV0dXJuIHRoaXMub3B0cy5oZWlnaHQ7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdC8vXHRGaW5kIHNtYWxsZXN0IENTUyBoZWlnaHRcclxuXHRcdFx0dmFyIGFyciA9IFsgJ21heEhlaWdodCcsICdoZWlnaHQnIF0sXHJcblx0XHRcdFx0aGdoID0gMDtcclxuIFxyXG5cdFx0XHRmb3IgKCB2YXIgYSA9IDA7IGEgPCBhcnIubGVuZ3RoOyBhKysgKVxyXG5cdFx0XHR7XHJcblx0XHRcdFx0aGdoID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUoIHRoaXMuJGRvdFsgMCBdIClbIGFyclsgYSBdIF07XHJcblx0XHRcdFx0aWYgKCBoZ2guc2xpY2UoIC0yICkgPT0gJ3B4JyApXHJcblx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0aGdoID0gcGFyc2VGbG9hdCggaGdoICk7XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdC8vXHRSZW1vdmUgcGFkZGluZy10b3AvYm90dG9tIHdoZW4gbmVlZGVkLlxyXG5cdFx0XHR2YXIgYXJyID0gW107XHJcblx0XHRcdHN3aXRjaCAoIHRoaXMuJGRvdC5jc3MoICdib3hTaXppbmcnICkgKVxyXG5cdFx0XHR7XHJcblx0XHRcdFx0Y2FzZSAnYm9yZGVyLWJveCc6XHJcblx0XHRcdFx0XHRhcnIucHVzaCggJ2JvcmRlclRvcFdpZHRoJyApO1xyXG5cdFx0XHRcdFx0YXJyLnB1c2goICdib3JkZXJCb3R0b21XaWR0aCcgKTtcclxuXHRcdFx0XHRcdC8vXHRubyBicmVhayAtPiBwYWRkaW5nIG5lZWRzIHRvIGJlIGFkZGVkIHRvb1xyXG5cclxuXHRcdFx0XHRjYXNlICdwYWRkaW5nLWJveCc6XHJcblx0XHRcdFx0XHRhcnIucHVzaCggJ3BhZGRpbmdUb3AnICk7XHJcblx0XHRcdFx0XHRhcnIucHVzaCggJ3BhZGRpbmdCb3R0b20nICk7XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0fVxyXG5cdFx0XHRmb3IgKCB2YXIgYSA9IDA7IGEgPCBhcnIubGVuZ3RoOyBhKysgKVxyXG5cdFx0XHR7XHJcblx0XHRcdFx0dmFyIHAgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSggdGhpcy4kZG90WyAwIF0gKVsgYXJyWyBhIF0gXTtcclxuXHRcdFx0XHRpZiAoIHAuc2xpY2UoIC0yICkgPT0gJ3B4JyApXHJcblx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0aGdoIC09IHBhcnNlRmxvYXQoIHAgKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdC8vXHRTYW5pdGl6ZVxyXG5cdFx0XHRyZXR1cm4gTWF0aC5tYXgoIGhnaCwgMCApO1xyXG5cdFx0fSxcclxuXHJcblx0XHRfd2F0Y2hTaXplczogZnVuY3Rpb24oIG9sZFNpemVzLCAkZWxlbSwgd2lkdGgsIGhlaWdodCApXHJcblx0XHR7XHJcblx0XHRcdGlmICggdGhpcy4kZG90LmlzKCAnOnZpc2libGUnICkgKVxyXG5cdFx0XHR7XHJcblx0XHRcdFx0dmFyIG5ld1NpemVzID0ge1xyXG5cdFx0XHRcdFx0J3dpZHRoJ1x0XHQ6ICRlbGVtWyB3aWR0aCAgXSgpLFxyXG5cdFx0XHRcdFx0J2hlaWdodCdcdDogJGVsZW1bIGhlaWdodCBdKClcclxuXHRcdFx0XHR9O1xyXG5cclxuXHRcdFx0XHRpZiAoIG9sZFNpemVzLndpZHRoICE9IG5ld1NpemVzLndpZHRoIHx8IG9sZFNpemVzLmhlaWdodCAhPSBuZXdTaXplcy5oZWlnaHQgKVxyXG5cdFx0XHRcdHtcclxuXHRcdFx0XHRcdHRoaXMudHJ1bmNhdGUoKTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdHJldHVybiBuZXdTaXplcztcclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4gb2xkU2l6ZXM7XHJcblx0XHR9LFxyXG5cclxuXHRcdF9fZ2V0VGV4dENvbnRlbnQ6IGZ1bmN0aW9uKCBlbGVtIClcclxuXHRcdHtcclxuXHRcdFx0dmFyIGFyciA9IFsgJ25vZGVWYWx1ZScsICd0ZXh0Q29udGVudCcsICdpbm5lclRleHQnIF07XHJcblx0XHRcdGZvciAoIHZhciBhID0gMDsgYSA8IGFyci5sZW5ndGg7IGErKyApXHJcblx0XHRcdHtcclxuXHRcdFx0XHRpZiAoIHR5cGVvZiBlbGVtWyBhcnJbIGEgXSBdID09ICdzdHJpbmcnIClcclxuXHRcdFx0XHR7XHJcblx0XHRcdFx0XHRyZXR1cm4gZWxlbVsgYXJyWyBhIF0gXTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuICcnO1xyXG5cdFx0fSxcclxuXHRcdF9fc2V0VGV4dENvbnRlbnQ6IGZ1bmN0aW9uKCBlbGVtLCBjb250ZW50IClcclxuXHRcdHtcclxuXHRcdFx0dmFyIGFyciA9IFsgJ25vZGVWYWx1ZScsICd0ZXh0Q29udGVudCcsICdpbm5lclRleHQnIF07XHJcblx0XHRcdGZvciAoIHZhciBhID0gMDsgYSA8IGFyci5sZW5ndGg7IGErKyApXHJcblx0XHRcdHtcclxuXHRcdFx0XHRlbGVtWyBhcnJbIGEgXSBdID0gY29udGVudDtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH07XHJcblxyXG5cclxuXHJcblx0LypcclxuXHRcdFRoZSBqUXVlcnkgcGx1Z2luXHJcblx0Ki9cclxuXHQkLmZuWyBfUExVR0lOXyBdID0gZnVuY3Rpb24oIG9wdHMgKVxyXG5cdHtcclxuXHRcdGluaXRQbHVnaW4oKTtcclxuXHJcblx0XHRvcHRzID0gJC5leHRlbmQoIHRydWUsIHt9LCAkWyBfUExVR0lOXyBdLmRlZmF1bHRzLCBvcHRzICk7XHJcblxyXG5cdFx0cmV0dXJuIHRoaXMuZWFjaChcclxuXHRcdFx0ZnVuY3Rpb24oKVxyXG5cdFx0XHR7XHJcblx0XHRcdFx0JCh0aGlzKS5kYXRhKCBfUExVR0lOXywgbmV3ICRbIF9QTFVHSU5fIF0oICQodGhpcyksIG9wdHMgKS5fYXBpKCkgKTtcclxuXHRcdFx0fVxyXG5cdFx0KTtcclxuXHR9O1xyXG5cclxuXHJcblxyXG5cdC8qXHJcblx0XHRHbG9iYWwgdmFyaWFibGVzXHJcblx0Ki9cclxuXHR2YXIgX2MsIF9kLCBfZSwgJHduZHc7XHJcblxyXG5cdGZ1bmN0aW9uIGluaXRQbHVnaW4oKVxyXG5cdHtcclxuXHRcdCR3bmR3ID0gJCh3aW5kb3cpO1xyXG5cclxuXHRcdC8vXHRDbGFzc25hbWVzLCBEYXRhbmFtZXMsIEV2ZW50bmFtZXNcclxuXHRcdF9jID0ge307XHJcblx0XHRfZCA9IHt9O1xyXG5cdFx0X2UgPSB7fTtcclxuXHJcblx0XHQkLmVhY2goIFsgX2MsIF9kLCBfZSBdLFxyXG5cdFx0XHRmdW5jdGlvbiggaSwgbyApXHJcblx0XHRcdHtcclxuXHRcdFx0XHRvLmFkZCA9IGZ1bmN0aW9uKCBhIClcclxuXHRcdFx0XHR7XHJcblx0XHRcdFx0XHRhID0gYS5zcGxpdCggJyAnICk7XHJcblx0XHRcdFx0XHRmb3IgKCB2YXIgYiA9IDAsIGwgPSBhLmxlbmd0aDsgYiA8IGw7IGIrKyApXHJcblx0XHRcdFx0XHR7XHJcblx0XHRcdFx0XHRcdG9bIGFbIGIgXSBdID0gby5kZGQoIGFbIGIgXSApO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH07XHJcblx0XHRcdH1cclxuXHRcdCk7XHJcblxyXG5cdFx0Ly9cdENsYXNzbmFtZXNcclxuXHRcdF9jLmRkZCA9IGZ1bmN0aW9uKCBjICkgeyByZXR1cm4gJ2RkZC0nICsgYzsgfTtcclxuXHRcdF9jLmFkZCggJ3RydW5jYXRlZCBrZWVwJyApO1xyXG5cclxuXHRcdC8vXHREYXRhbmFtZXNcclxuXHRcdF9kLmRkZCA9IGZ1bmN0aW9uKCBkICkgeyByZXR1cm4gJ2RkZC0nICsgZDsgfTtcclxuXHJcblx0XHQvL1x0RXZlbnRuYW1lc1xyXG5cdFx0X2UuZGRkID0gZnVuY3Rpb24oIGUgKSB7IHJldHVybiBlICsgJy5kZGQnOyB9O1xyXG5cdFx0X2UuYWRkKCAncmVzaXplJyApO1xyXG5cclxuXHJcblx0XHQvL1x0T25seSBvbmNlXHJcblx0XHRpbml0UGx1Z2luID0gZnVuY3Rpb24oKSB7fTtcclxuXHJcblx0fVxyXG5cclxuXHJcbn0pKCBqUXVlcnkgKTtcclxuIl0sImZpbGUiOiJqcXVlcnkuZG90ZG90ZG90LmpzIn0=
