/**
* jQuery Simple Slideshow
* @name jquery.slideshow.js
* @author Mattia - http://www.matriz.it
* @version 1.1.0
* @date May 24, 2013
* @category jQuery plugin
* @copyright (c) 2013 Mattia at Matriz.it (info@matriz.it)
* @license MIT - http://opensource.org/licenses/mit-license.php
* @example Visit http://www.matriz.it/projects/jquery-simple-slideshow/ for more informations about this jQuery plugin
*/
(function($) {
	var slideshow = {
		'init': function(el, opts) {
			var t = $(el),
				children = this.getChildren(el, opts),
				active = null;
			if (children.length > 1) {
				active = this.getActive(el, opts);
				if (t.css('position') == 'static') {
					t.css('position', 'relative');
				}
				children.css({
					'position': 'absolute',
					'top': 0,
					'left': 0,
					'opacity': 0
				});
				if (active.length > 0) {
					active.css('opacity', 1);
				}
			}
		},
		'next': function(el, opts) {
			var t = $(el),
				children = this.getChildren(el, opts),
				active = null, next = null;
			if (children.length > 1) {
				active = this.getActive(el, opts);
				next = active.next();
				if (next.length == 0) {
					next = t.find(opts.children_tag + ':first-child');
				}
				if ($.isFunction(opts.beforeChange)) {
					opts.beforeChange.call(active, next);
				}
				active.addClass(opts.last_active_class);
				next.css('opacity', 0).addClass(opts.active_class).animate({
					'opacity': 1
				}, opts.duration, function() {
					active.removeClass(opts.active_class).removeClass(opts.last_active_class);
					if ($.isFunction(opts.afterChange)) {
						opts.afterChange.call(next, active);
					}
				});
				active.animate({
					'opacity': 0
				}, opts.duration);
			}
		},
		'getChildren': function(el, opts) {
			return $(el).find(opts.children_tag);
		},
		'getActive': function(el, opts) {
			var t = $(el),
				active = t.find(opts.children_tag + '.' + opts.active_class);
			if (active.length == 0) {
				active = t.find(opts.children_tag + ':first-child');
				if (active.length > 0) {
					active.addClass(opts.active_class);
				}
			}
			return active;
		}
	};

	$.fn.slideshow = function(options) {
		var opts = $.extend({
			'duration': 1000,
			'pause': 5000,
			'children_tag': 'img',
			'active_class': 'active',
			'last_active_class': 'last-active',
			'beforeChange': null,
			'afterChange': null
		}, options);
		
		return this.each(function() {
			var t = this;
			slideshow.init(t, opts);
			setInterval(function() {
				slideshow.next(t, opts);
			}, opts.pause);
		});
	};
})(jQuery);