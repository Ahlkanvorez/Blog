(function () {
	'use strict';

	// Register the 'snippet' filter, which returns the first sentence of a blog of text.
	angular.
		module('core.article').
		filter('snippet', function() {
			return function snippet(text) {
				var snip = new RegExp("^([^.!?。]+.)").exec(text)[0];
				// If the first sentence is contained in an html tag,
				//  complete that tag in the snippet for valid syntax.
				return snip + (snip.indexOf('<p>') === 0 ? '</p>' : '');
			}
		});
})();