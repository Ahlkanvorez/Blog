(function () {
	'use strict';

	angular.module('blogAdminApp').
		constant('ServerConfig', {
			baseUrl : 'http://localhost:3000'
		}).constant('ViewModes', {
			view : 'view',
			edit : 'edit',
			delete : 'delete',
			save : 'save'
		});
})();