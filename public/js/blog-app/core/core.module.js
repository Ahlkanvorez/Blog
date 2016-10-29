(function () {
	'use strict';

	/** Define the 'core' module.
	* - core.articleIndex
	* - core.category
	*/
	angular.module('core', [
		'core.articleIndex',
        'core.category'
	]);
})();