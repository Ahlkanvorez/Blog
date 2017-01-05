(function () {
    'use strict';

    const request = require('request');
    const http = require('http');

    const base_url = "https://www.hrodebert.me/blog";

    describe('Blog Server, Blog route', function () {
        describe('GET /', function () {
            it('returns status code 404', function (done) {
                request(base_url, function (err, res, data) {
                    expect(res.statusCode).toBe(404);
                    done();
                });
            });
        });

        describe('GET /article-list', function () {
            it('returns status code 200', function (done) {
                request(base_url + '/article-list', function (err, res, data) {
                    expect(res.statusCode).toBe(200);
                    done();
                });
            });

            it('returns an array as a JSON string', function (done) {
                request(base_url + '/article-list', function (err, res, data) {
                    expect(Array.isArray(JSON.parse(data))).toBe(true);
                    done();
                });
            });

            it('returns an array of public Articles as a JSON string', function (done) {
                request(base_url + '/article-list', function (err, res, data) {
                    const articles = JSON.parse(data);
                    articles.forEach(function (article) {
                        expect(article.title).not.toBe(undefined);
                        expect(article.author).not.toBe(undefined);
                        expect(article.author.name).not.toBe(undefined);
                        expect(article.date).not.toBe(undefined);
                        expect(article.category).not.toBe(undefined);
                        expect(article.content).not.toBe(undefined);
                        expect(article.sticky).not.toBe(undefined);
                        expect(article.private).toBe(false);
                    });

                    done();
                });
            });
        });

        describe('GET /all-article-list', function () {
            it('returns status code 200', function (done) {
                request(base_url + '/all-article-list', function (err, res, data) {
                    expect(res.statusCode).toBe(200);
                    done();
                });
            });

            it('returns an array as a JSON string', function (done) {
                request(base_url + '/all-article-list', function (err, res, data) {
                    expect(Array.isArray(JSON.parse(data))).toBe(true);
                    done();
                });
            });

            it('returns an array of Articles as a JSON string', function (done) {
                request(base_url + '/all-article-list', function (err, res, data) {
                    const articles = JSON.parse(data);
                    articles.forEach(function (article) {
                        expect(article.title).not.toBe(undefined);
                        expect(article.author).not.toBe(undefined);
                        expect(article.author.name).not.toBe(undefined);
                        expect(article.date).not.toBe(undefined);
                        expect(article.category).not.toBe(undefined);
                        expect(article.content).not.toBe(undefined);
                        expect(article.sticky).not.toBe(undefined);
                    });

                    done();
                });
            });
        });

        describe('GET /article-list/:category', function () {
            const category = 'Technology';

            it('returns status code 200', function (done) {
                request(base_url + '/article-list/' + category, function (err, res, data) {
                    expect(res.statusCode).toBe(200);
                    done();
                });
            });

            it('returns an array as a JSON string', function (done) {
                request(base_url + '/article-list/' + category, function (err, res, data) {
                    expect(Array.isArray(JSON.parse(data))).toBe(true);
                    done();
                });
            });

            it('returns an array of articles containing the "The Making of my Blog" article as a JSON string', function (done) {
                request(base_url + '/all-article-list/' + category, function (err, res, data) {
                    expect(JSON.parse(data).filter(function (article) {
                        return article.title === "The Making of my Blog"
                            && article.author.name === 'Robert Mitchell'
                            && article.category === category
                            && article.content.indexOf('<p>\nDeveloping your own blog is an interesting experience') === 0
                            && !article.private;
                    }).length).toBe(1);
                    done();
                });
            });
        });

        describe('GET /all-article-list/:category', function () {
            const category = 'LoremIpsum';

            it('returns status code 200', function (done) {
                request(base_url + '/all-article-list/' + category, function (err, res, data) {
                    expect(res.statusCode).toBe(200);
                    done();
                });
            });

            it('returns an array as a JSON string', function (done) {
                request(base_url + '/all-article-list/' + category, function (err, res, data) {
                    expect(Array.isArray(JSON.parse(data))).toBe(true);
                    done();
                });
            });

            it('returns an array of five articles as a JSON string', function (done) {
                request(base_url + '/all-article-list/' + category, function (err, res, data) {
                    expect(JSON.parse(data).length).toBe(5);
                    done();
                });
            });
        });

        describe('GET /article-list/:category/:author', function () {
            const category = 'Technology';
            const author = 'Robert Mitchell';

            it('returns status code 200', function (done) {
                request(base_url + '/all-article-list/' + category + '/' + author, function (err, res, data) {
                    expect(res.statusCode).toBe(200);
                    done();
                });
            });

            it('returns an array as a JSON string', function (done) {
                request(base_url + '/all-article-list/' + category + '/' + author, function (err, res, data) {
                    expect(Array.isArray(JSON.parse(data))).toBe(true);
                    done();
                });
            });

            it('returns at least one article for author "Robert Mitchell" in an array as a JSON string', function (done) {
                request(base_url + '/all-article-list/' + category + '/' + author, function (err, res, data) {
                    expect(JSON.parse(data).length >= 1).toBe(true);
                    done();
                });
            });

            it('returns the "The Making of my Blog" article for author "Robert Mitchell" in an array as a JSON string', function (done) {
                request(base_url + '/all-article-list/' + category + '/' + author, function (err, res, data) {
                    const article = JSON.parse(data).filter(function (article) {
                        return article.title === 'The Making of my Blog';
                    })[0];
                    expect(article.title).toBe('The Making of my Blog');
                    expect(article.author).not.toBe(undefined);
                    expect(article.author.name).toBe(author);
                    expect(article.author.email).toBe('robert.mitchell36@gmail.com');
                    expect(article.date).toBe('2016-08-30T21:57:37.000Z');
                    expect(article.category).toBe(category);
                    expect(article.content.indexOf('<p>\nDeveloping your own blog is an interesting experience')).toBe(0);
                    expect(article.sticky).toBe(true);
                    expect(article.private).toBe(false);

                    done();
                });
            });
        });

        describe('GET /all-article-list/:category/:author', function () {
            const category = 'LoremIpsum';
            const authors = ['Somebody', 'Someone else'];

            authors.forEach(function (author) {
                it('returns status code 200', function (done) {
                    request(base_url + '/all-article-list/' + category + '/' + author, function (err, res, data) {
                        expect(res.statusCode).toBe(200);
                        done();
                    });
                });

                it('returns an array as a JSON string', function (done) {
                    request(base_url + '/all-article-list/' + category + '/' + author, function (err, res, data) {
                        expect(Array.isArray(JSON.parse(data))).toBe(true);
                        done();
                    });
                });
            });

            it('returns two articles for author "Someone else" as a JSON string', function (done) {
                request(base_url + '/all-article-list/' + category + '/Somebody', function (err, res, data) {
                    expect(JSON.parse(data).length).toBe(3);
                    done();
                });
            });

            it('returns three articles for author "Somebody" as a JSON string', function (done) {
                request(base_url + '/all-article-list/' + category + '/Someone else', function (err, res, data) {
                    expect(JSON.parse(data).length).toBe(2);
                    done();
                });
            });
        });

        describe('GET /article-list/:category/:startDate/:endDate', function () {
            const category = 'Technology';
            const start = 1470027600000;
            const end = 1472706000000;

            it('returns status code 200', function (done) {
                request(base_url + '/article-list/' + category + '/' + start + '/' + end, function (err, res, data) {
                    expect(res.statusCode).toBe(200);
                    done();
                });
            });

            it('returns an array as a JSON string', function (done) {
                request(base_url + '/article-list/' + category + '/' + start + '/' + end, function (err, res, data) {
                    expect(Array.isArray(JSON.parse(data))).toBe(true);
                    done();
                });
            });

            it('returns one public article (The Making of my Blog) for dates between (1470027600000, 1472706000000) as a JSON string', function (done) {
                request(base_url + '/article-list/' + category + '/' + start + '/' + end, function (err, res, data) {
                    const articles = JSON.parse(data);
                    expect(articles.length).toBe(1);
                    const article = articles[0];
                    expect(article.title).toBe('The Making of my Blog');
                    expect(article.author).not.toBe(undefined);
                    expect(article.author.name).toBe('Robert Mitchell');
                    expect(article.author.email).toBe('robert.mitchell36@gmail.com');
                    expect(article.date).toBe('2016-08-30T21:57:37.000Z');
                    expect(article.category).toBe(category);
                    expect(article.content.indexOf('<p>\nDeveloping your own blog is an interesting experience')).toBe(0);
                    expect(article.sticky).toBe(true);
                    expect(article.private).toBe(false);

                    done();
                });
            });
        });

        describe('GET /all-article-list/:category/:startDate/:endDate', function () {
            const category = 'LoremIpsum';
            const startDates = [1467349200000, 1470027600000];
            const endDates = [1470027600000, 1472706000000];

            for (var i = 0; i < 1; ++i) {
                const start = startDates[i];
                const end = endDates[i];

                it('returns status code 200', function (done) {
                    request(base_url + '/all-article-list/' + category + '/' + start + '/' + end, function (err, res, data) {
                        expect(res.statusCode).toBe(200);
                        done();
                    });
                });

                it('returns an array as a JSON string', function (done) {
                    request(base_url + '/all-article-list/' + category + '/' + start + '/' + end, function (err, res, data) {
                        expect(Array.isArray(JSON.parse(data))).toBe(true);
                        done();
                    });
                });
            }

            it('returns one article for dates between (1467349200000, 1470027600000) as a JSON string', function (done) {
                request(base_url + '/all-article-list/' + category + '/' + startDates[0] + '/' + endDates[0], function (err, res, data) {
                    expect(JSON.parse(data).length).toBe(1);
                    done();
                });
            });

            it('returns four articles for dates between (1470027600000, 1472706000000) as a JSON string', function (done) {
                request(base_url + '/all-article-list/' + category + '/' + startDates[1] + '/' + endDates[1], function (err, res, data) {
                    expect(JSON.parse(data).length).toBe(4);
                    done();
                });
            });
        });

        describe('GET /get-article/:id', function () {
            it('returns status code 200', function (done) {
                request(base_url + '/get-article/' + '57c6015189339c33682da923', function (err, res, data) {
                    expect(res.statusCode).toBe(200);
                    done();
                });
            });

            it("returns the 'The Making of my Blog' article for id '57c6015189339c33682da923' in JSON form", function (done) {
                request(base_url + '/get-article/' + '57c6015189339c33682da923', function (err, res, data) {
                    const article = JSON.parse(data);

                    expect(article.title).toBe('The Making of my Blog');
                    expect(article.author).not.toBe(undefined);
                    expect(article.author.name).toBe('Robert Mitchell');
                    expect(article.author.email).toBe('robert.mitchell36@gmail.com');
                    expect(article.date).toBe('2016-08-30T21:57:37.000Z');
                    expect(article.category).toBe('Technology');
                    expect(article.content.indexOf('<p>\nDeveloping your own blog is an interesting experience')).toBe(0);
                    expect(article.sticky).toBe(true);
                    expect(article.private).toBe(false);

                    done();
                });
            });
        });

        describe('GET /get-private-article/:id', function () {
            it('returns status code 200', function (done) {
                request(base_url + '/get-private-article/' + '57e5daf45cd9d6a520d712e7', function (err, res, data) {
                    expect(res.statusCode).toBe(200);
                    done();
                });
            });

            it('returns the "Lorem Ipsum" article in JSON form', function (done) {
                request(base_url + '/get-private-article/' + '57e5daf45cd9d6a520d712e7', function (err, res, data) {
                    const article = JSON.parse(data);

                    expect(article.title).toBe('Lorem Ipsum');
                    expect(article.author).not.toBe(undefined);
                    expect(article.author.name).toBe('Somebody');
                    expect(article.author.email).toBe('someone@awebsite.com');
                    expect(article.date).toBe('2016-07-03T21:30:20.947Z');
                    expect(article.category).toBe('LoremIpsum');
                    expect(article.content).toBe('<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean dictum sollicitudin rhoncus. Fusce vitae scelerisque est. Aliquam venenatis turpis vitae interdum hendrerit. Sed quis sapien sit amet erat pulvinar feugiat nec in est. Vestibulum non euismod turpis. Maecenas molestie sodales vestibulum. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Duis aliquam lacinia elit vel efficitur. Sed mollis rutrum mollis. Etiam vel condimentum nisi. Aliquam eget ipsum a ex pharetra cursus. Cras ac tempus dui, at porta mi. Nulla eleifend fringilla lectus sed vehicula. Phasellus consectetur euismod eros, in euismod arcu laoreet sit amet. Cras hendrerit elementum urna, vitae viverra nisi volutpat in. In et imperdiet nulla. Nulla pretium, sem eu bibendum ultrices, lectus tellus tincidunt odio, suscipit porta metus erat et sem. Etiam rhoncus sapien nisi, ac aliquam sem congue vel. Quisque fringilla ipsum eu nisi mattis vulputate. Vivamus eros magna, fermentum ultricies congue eget, finibus vel arcu. Quisque sapien dui, sagittis nec malesuada a, consequat ut turpis. Integer in efficitur orci, accumsan blandit orci. Phasellus interdum ante a vestibulum sollicitudin.</p>');
                    expect(article.sticky).toBe(false);
                    expect(article.private).toBe(true);
                    done();
                });
            });

            it('returns status code 200', function (done) {
                request(base_url + '/get-private-article/' + '57a039ed88d10494508ad570', function (err, res, data) {
                    expect(res.statusCode).toBe(200);
                    done();
                });
            });

            it('returns the "Duis leo ligula" article in JSON form', function (done) {
                request(base_url + '/get-private-article/' + '57a039ed88d10494508ad570', function (err, res, data) {
                    const article = JSON.parse(data);

                    expect(article.title).toBe('Duis leo ligula');
                    expect(article.author).not.toBe(undefined);
                    expect(article.author.name).toBe('Someone else');
                    expect(article.date).toBe('2016-08-04T03:03:21.280Z');
                    expect(article.category).toBe('LoremIpsum');
                    expect(article.content).toBe('<p>Duis leo ligula, elementum quis elementum sit amet, faucibus quis sem. Quisque commodo lorem sed massa laoreet tristique. Nulla tristique turpis vitae justo semper hendrerit. Suspendisse tincidunt est eu mauris tristique lobortis. Duis posuere lobortis lacinia. Ut eget tincidunt turpis. In commodo fermentum ligula. Donec dui nisi, tincidunt eu commodo id, eleifend eget lacus. In vel lectus sed ante rhoncus faucibus vel a dui. Duis id ligula sit amet erat varius dapibus bibendum vitae mauris. Nulla tristique egestas risus quis cursus. Suspendisse scelerisque, erat in fringilla sollicitudin, purus diam sodales nulla, in malesuada tellus ante ac nibh. Morbi ut interdum arcu, eu sollicitudin nulla. Vestibulum rutrum lacus consectetur, aliquet arcu vel, pretium libero. In non pharetra nunc. Integer tortor ipsum, vehicula vitae massa non, facilisis consequat urna. Sed sit amet hendrerit metus. Curabitur tristique dui sed orci scelerisque imperdiet. Pellentesque vel faucibus augue, at imperdiet nulla. Morbi suscipit augue quis egestas porta. Vivamus sollicitudin pellentesque ultricies. Donec varius, arcu id pharetra facilisis, libero ipsum consequat felis, non ultricies felis odio eu nunc. Nulla non lorem sed magna pulvinar eleifend. In varius libero erat, non sollicitudin ligula rutrum in. Maecenas tempus ligula sit amet arcu venenatis, id vehicula tortor dictum. Proin felis arcu, volutpat at sagittis ut, dapibus eget mi. Morbi congue quam lacinia accumsan facilisis.</p>');
                    expect(article.sticky).toBe(false);
                    expect(article.private).toBe(true);
                    done();
                });
            });
        });

        describe('POST /post-article', function () {
            it('returns status code 403 when not already logged in.', function (done) {
                request.post(base_url + '/post-article', {
                    json: {
                        title: 'This should NOT be posted.',
                        category: 'Illegal Documents',
                        author: 'Unauthorized user',
                        date: new Date(),
                        content: 'This should not get through security, and should definitely not get into the database.'
                    }
                }, function (err, res) {
                    expect(res.statusCode).toBe(403);
                    done();
                });
            });
        });

        describe('PUT /update-article/:id', function () {
            it('returns status code 403 when not already logged in.', function (done) {
                /* Attempts to alter the LoremIpsum article. */
                request.put(base_url + '/update-article/57e5daf45cd9d6a520d712e7', {
                    json: {
                        title: 'This better not be posted',
                        category: 'Illegal documents',
                        author: 'Illegal user',
                        date: new Date(),
                        content: 'Illegal content. Too horrendous to render in your editor.'
                    }
                }, function (err, res) {
                    expect(res.statusCode).toBe(403);
                    done();
                });
            });
        });

        describe('DELETE /remove-article/:id', function () {
            it('returns status code 403 when not already logged in.', function (done) {
                /* Attempts to delete the LoremIpsum article. */
                request.delete(base_url + '/remove-article/57e5daf45cd9d6a520d712e7', {}, function (err, res) {
                    expect(res.statusCode).toBe(403);
                    done();
                });
            })
        });

        describe('GET /category-list', function () {
            it('returns status code 200', function (done) {
                request(base_url + '/category-list', function (err, res, data) {
                    expect(res.statusCode).toBe(200);
                    done();
                });
            });

            it('returns an array as a JSON string', function (done) {
                request(base_url + '/category-list', function (err, res, data) {
                    expect(Array.isArray(JSON.parse(data))).toBe(true);
                    done();
                });
            });

            it('returns an array of public Categories as a JSON string', function (done) {
                request(base_url + '/category-list', function (err, res, data) {
                    const categories = JSON.parse(data);
                    categories.forEach(function (category) {
                        expect(category.name).not.toBe(undefined);
                        expect(category.description).not.toBe(undefined);
                        expect(category.aboutAuthor).not.toBe(undefined);
                        expect(category.private).toBe(false);
                    });

                    done();
                });
            });
        });

        describe('GET /all-category-list', function () {
            it('returns status code 200', function (done) {
                request(base_url + '/all-category-list', function (err, res, data) {
                    expect(res.statusCode).toBe(200);
                    done();
                });
            });

            it('returns an array as a JSON string', function (done) {
                request(base_url + '/all-category-list', function (err, res, data) {
                    expect(Array.isArray(JSON.parse(data))).toBe(true);
                    done();
                });
            });

            it('returns an array of Categories as a JSON string', function (done) {
                request(base_url + '/all-category-list', function (err, res, data) {
                    const categories = JSON.parse(data);
                    categories.forEach(function (category) {
                        expect(category.name).not.toBe(undefined);
                        expect(category.description).not.toBe(undefined);
                        expect(category.aboutAuthor).not.toBe(undefined);
                    });

                    done();
                });
            });
        });

        describe('GET /get-category/:name', function () {
            const name = 'Technology';

            it('returns status code 200', function (done) {
                request(base_url + '/get-category/' + name, function (err, res, data) {
                    expect(res.statusCode).toBe(200);
                    done();
                });
            });

            it('returns an array as a JSON string', function (done) {
                request(base_url + '/get-category/' + name, function (err, res, data) {
                    expect(Array.isArray(JSON.parse(data))).toBe(true);
                    done();
                });
            });

            it('returns an array of a single public category as a JSON string', function (done) {
                request(base_url + '/get-category/' + name, function (err, res, data) {
                    const category = JSON.parse(data)[0];
                    expect(category.name).toBe('Technology');
                    expect(category.description.indexOf('"... adding one thing to another')).toBe(0);
                    expect(category.aboutAuthor.indexOf('Robert Mitchell views each program')).toBe(0);
                    expect(category.private).toBe(false);
                    done();
                });
            });
        });

        describe('GET /get-private-category/:name', function () {
            const name = 'LoremIpsum';

            it('returns status code 200', function (done) {
                request(base_url + '/get-private-category/' + name, function (err, res, data) {
                    expect(res.statusCode).toBe(200);
                    done();
                });
            });

            it('returns an array as a JSON string', function (done) {
                request(base_url + '/get-private-category/' + name, function (err, res, data) {
                    expect(Array.isArray(JSON.parse(data))).toBe(true);
                    done();
                });
            });

            it('returns an array of a single category as a JSON string', function (done) {
                request(base_url + '/get-private-category/' + name, function (err, res, data) {
                    var category = JSON.parse(data)[0];
                    expect(category.name).toBe('LoremIpsum');
                    expect(category.description).toBe('Test category; should be private.');
                    expect(category.aboutAuthor).toBe('This exists solely for testing purposes');
                    expect(category.private).toBe(true);
                    done();
                });
            });
        });

        describe('POST /post-category', function () {
            it('returns status code 403 when not already logged in.', function (done) {
                request.post(base_url + '/post-category', {
                    json: {
                        name: 'Illegal category',
                        description: 'Bad bad stuff.',
                        aboutAuthor: 'Really this should not exist'
                    }
                }, function (err, res) {
                    expect(res.statusCode).toBe(403);
                    done();
                });
            });
        });

        describe('PUT /update-category/:id', function () {
            it('returns status code 403 when not already logged in.', function (done) {
                /* Attempts to update the Everything category. */
                request.put(base_url + '/update-category/57b5423cf22c6b7d4055fef4', {
                    json: {
                        name: 'Illegal category',
                        description: 'I hope this does not go through',
                        aboutAuthor: 'about who?'
                    }
                }, function (err, res) {
                    expect(res.statusCode).toBe(403);
                    done();
                });
            });
        });

        describe('DELETE /remove-category/:id', function () {
            it('returns status code 403 when not already logged in.', function (done) {
                /* Attempts to remove the Everything category. */
                request.delete(base_url + '/remove-category/57b5423cf22c6b7d4055fef4', {}, function (err, res) {
                    expect(res.statusCode).toBe(403);
                    done();
                });
            });
        });
    });
})();
