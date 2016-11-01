(function () {
    'use strict';

    /** Defines some constants used throughout the whole app, such as the base URL of the website.
     * ViewModes are constants to change the display according to the activity the admin is doing.
     *
     * TODO: Make sure each ViewMode is needed.
     */
    angular.module('blogAdminApp').constant('ServerConfig', {
        baseUrl: 'http://localhost:3000'
    }).constant('ViewModes', {
        view: 'view',
        edit: 'edit',
        delete: 'delete',
        save: 'save'
    });
})();