(function () {
    'use strict';

    /** Registers the 'snippet' filter, which returns the first sentence of a
     * blog of text.
     *
     * - snippet(text) will return a substring of the given string up until, and
     *   including, the first punctuation mark contained in the following list
     *   of punctuation: . ! ? 。(note the last is a period in Chinese) Moreover,
     *   if the text begins with either a <p> or a <blockquote> HTML tag, the
     *   appropriate closing tag is appended to the end of the returned text, so
     *   that the returned snippet is ready to be used in HTML.
     */
    angular.module('core.articleIndex').filter('snippet', function () {
        return function snippet (text) {
            const snip = new RegExp('^([^.!?。]+.)').exec(text)[0];
            // If the first sentence is contained in an html tag, complete that
            // tag in the snippet for valid syntax.
            return snip + (snip.indexOf('<p>') === 0 ? '</p>' : '')
                + (snip.indexOf('<blockquote>') === 0 ? '</blockquote>' : '');
        };
    });
})();
