(function () {
	'use strict';

    /** Defines some constants used throughout the whole app, such as the base URL of the website. */
	angular.module('blogApp').
		constant('ServerConfig', {
			baseUrl : 'https://www.hrodebert.me' // TODO: Change to url of server before official release.
		});
})();