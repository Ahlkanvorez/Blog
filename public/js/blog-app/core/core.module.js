(function () {
	'use strict';

	/** Define the 'core' module.
	* - core.articleIndex provides a service which handles all interaction with the server for Article objects.
	* - core.category provides a service which handles all interaction with the server for Category objects.
	*/
	angular.module('core', [
		'core.articleIndex',
        'core.category'
	]);
})();