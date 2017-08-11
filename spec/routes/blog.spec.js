(function () {
    'use strict';

    const request = require('request');
    const http = require('http');

    const base_url = "https://www.hrodebert.com/blog";

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

            it('returns an array of public Articles as a JSON string',
                function (done) {
                    request(base_url + '/article-list',
                        function (err, res, data) {
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
                        }
                    );
                }
            );
        });

        describe('GET /all-article-list', function () {
            it('returns status code 403', function (done) {
                request(base_url + '/all-article-list',
                    function (err, res, data) {
                        expect(res.statusCode).toBe(403);
                        done();
                    }
                );
            });
        });

        describe('GET /article-list/:category', function () {
            const category = 'Technology';

            it('returns status code 200', function (done) {
                request(base_url + '/article-list/' + category,
                    function (err, res, data) {
                        expect(res.statusCode).toBe(200);
                        done();
                    }
                );
            });

            it('returns an array as a JSON string', function (done) {
                request(base_url + '/article-list/' + category,
                    function (err, res, data) {
                        expect(Array.isArray(JSON.parse(data))).toBe(true);
                        done();
                    }
                );
            });

            it('returns an array of articles containing the '
                    +'"The Making of my Blog" article as a JSON string',
                function (done) {
                    request(base_url + '/article-list/' + category,
                        function (err, res, data) {
                            expect(JSON.parse(data).filter(function (article) {
                                return article.title === "The Making of my Blog"
                                    && article.author.name === 'Robert Mitchell'
                                    && article.category === category
                                    && !article.private;
                            }).length).toBe(1);
                            done();
                        }
                    );
                }
            );
        });

        describe('GET /all-article-list/:category', function () {
            it('returns status code 403', function (done) {
                request(base_url + '/all-article-list/Technology',
                    function (err, res, data) {
                        expect(res.statusCode).toBe(403);
                        done();
                    }
                );
            });
        });

        describe('GET /article-list/:category/:author', function () {
            const category = 'Technology';
            const author = 'Robert Mitchell';

            it('returns status code 200', function (done) {
                request(base_url + '/article-list/' + category + '/' + author,
                    function (err, res, data) {
                        expect(res.statusCode).toBe(200);
                        done();
                    }
                );
            });

            it('returns an array as a JSON string', function (done) {
                request(base_url + '/article-list/' + category + '/' + author,
                    function (err, res, data) {
                        expect(Array.isArray(JSON.parse(data))).toBe(true);
                        done();
                    }
                );
            });

            it('returns at least one article for author "Robert Mitchell" in an'
                    +' array as a JSON string', function (done) {
                request(base_url + '/article-list/' + category + '/' + author,
                    function (err, res, data) {
                        expect(JSON.parse(data).length >= 1).toBe(true);
                        done();
                    }
                );
            });

            it('returns the "The Making of my Blog" article for author '
                    +'"Robert Mitchell" in an array as a JSON string',
                function (done) {
                    request(base_url + '/article-list/'
                                + category + '/' + author,
                        function (err, res, data) {
                            const article = JSON.parse(data).filter(article =>
                                article.title === 'The Making of my Blog')[0];

                            expect(article.title)
                                .toBe('The Making of my Blog');
                            expect(article.author).not
                                .toBe(undefined);
                            expect(article.author.name)
                                .toBe(author);
                            expect(article.author.email)
                                .toBe('robert.mitchell36@gmail.com');
                            expect(article.date)
                                .toBe('2016-08-30T21:57:37.000Z');
                            expect(article.category)
                                .toBe(category);
                            expect(article.private)
                                .toBe(false);

                            done();
                        }
                    );
                }
            );
        });

        describe('GET /all-article-list/:category/:author', function () {
            it('returns status code 403', function (done) {
                request(base_url + '/all-article-list',
                    function (err, res, data) {
                        expect(res.statusCode).toBe(403);
                        done();
                    }
                );
            });
        });

        describe('GET /article-list/:category/:startDate/:endDate',
            function () {
                const category = 'Technology';
                const start = 1470027600000;
                const end = 1472706000000;

                it('returns status code 200', function (done) {
                    request(base_url + '/article-list/' + category + '/'
                            + start + '/' + end, function (err, res, data) {
                        expect(res.statusCode).toBe(200);
                        done();
                    });
                });

                it('returns an array as a JSON string', function (done) {
                    request(base_url + '/article-list/' + category + '/'
                            + start + '/' + end, function (err, res, data) {
                        expect(Array.isArray(JSON.parse(data))).toBe(true);
                        done();
                    });
                });

                it('returns one public article (The Making of my Blog) for '
                        +'dates between (1470027600000, 1472706000000) as a '
                        + 'JSON string', function (done) {
                    request(base_url + '/article-list/' + category + '/'
                            + start + '/' + end, function (err, res, data) {
                        const articles = JSON.parse(data);
                        expect(articles.length).toBe(1);
                        const article = articles[0];

                        expect(article.title)
                            .toBe('The Making of my Blog');
                        expect(article.author)
                            .not.toBe(undefined);
                        expect(article.author.name)
                            .toBe('Robert Mitchell');
                        expect(article.author.email)
                            .toBe('robert.mitchell36@gmail.com');
                        expect(article.date)
                            .toBe('2016-08-30T21:57:37.000Z');
                        expect(article.category)
                            .toBe(category);
                        expect(article.private)
                            .toBe(false);

                        done();
                    });
                });
            }
        );

        describe('GET /all-article-list/:category/:startDate/:endDate',
            function () {
                it('returns status code 403', function (done) {
                    request(base_url + '/all-article-list/',
                        function (err, res, data) {
                            expect(res.statusCode).toBe(403);
                            done();
                        }
                    );
                });
            }
        );

        describe('GET /get-article/id/:id', function () {
            it('returns status code 200', function (done) {
                request(base_url + '/get-article/id/57c6015189339c33682da923',
                    function (err, res, data) {
                        expect(res.statusCode).toBe(200);
                        done();
                    }
                );
            });

            it("returns the 'The Making of my Blog' in JSON form",
                function (done) {
                    request(base_url
                            + '/get-article/id/57c6015189339c33682da923',
                        function (err, res, data) {
                            const article = JSON.parse(data);

                            expect(article.title)
                                .toBe('The Making of my Blog');
                            expect(article.author)
                                .not.toBe(undefined);
                            expect(article.author.name)
                                .toBe('Robert Mitchell');
                            expect(article.author.email)
                                .toBe('robert.mitchell36@gmail.com');
                            expect(article.date)
                                .toBe('2016-08-30T21:57:37.000Z');
                            expect(article.category)
                                .toBe('Technology');
                            expect(article.sticky)
                                .toBe(false);
                            expect(article.private)
                                .toBe(false);

                            done();
                        }
                    );
                }
            );
        });

        describe('GET /get-private-article/:id', function () {
            it('returns status code 403', function (done) {
                request(base_url
                        + '/get-private-article/57e5daf45cd9d6a520d712e7',
                    function (err, res, data) {
                        expect(res.statusCode).toBe(403);
                        done();
                    }
                );
            });
        });

        describe('POST /post-article', function () {
            it('returns status code 403 when not already logged in.',
                function (done) {
                    request.post(base_url + '/post-article', {
                        json: {
                            title: 'This should NOT be posted.',
                            category: 'Illegal Documents',
                            author: 'Unauthorized user',
                            date: new Date(),
                            content: 'This should not get through security, '
                                + 'and should definitely not get into the '
                                + 'database.'
                        }
                    }, function (err, res) {
                        expect(res.statusCode).toBe(403);
                        done();
                    });
                }
            );
        });

        describe('PUT /update-article/:id', function () {
            it('returns status code 403 when not already logged in.',
                function (done) {
                    /* Attempts to alter the LoremIpsum article. */
                    request.put(base_url
                            + '/update-article/57e5daf45cd9d6a520d712e7', {
                        json: {
                            title: 'This better not be posted',
                            category: 'Illegal documents',
                            author: 'Illegal user',
                            date: new Date(),
                            content: 'Illegal content. Too horrendous to '
                                + 'render in your editor.'
                        }
                    }, function (err, res) {
                        expect(res.statusCode).toBe(403);
                        done();
                    });
                }
            );
        });

        describe('DELETE /remove-article/:id', function () {
            it('returns status code 403 when not already logged in.',
                function (done) {
                    /* Attempts to delete the LoremIpsum article. */
                    request.delete(base_url
                            + '/remove-article/57e5daf45cd9d6a520d712e7', {},
                        function (err, res) {
                            expect(res.statusCode).toBe(403);
                            done();
                        }
                    );
                }
            );
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

            it('returns an array of public Categories as a JSON string',
                function (done) {
                    request(base_url + '/category-list',
                        function (err, res, data) {
                            const categories = JSON.parse(data);
                            categories.forEach(function (category) {
                                expect(category.name)
                                    .not.toBe(undefined);
                                expect(category.description)
                                    .not.toBe(undefined);
                                expect(category.aboutAuthor)
                                    .not.toBe(undefined);
                                expect(category.private)
                                    .toBe(false);
                            });

                            done();
                        }
                    );
                }
            );
        });

        describe('GET /all-category-list', function () {
            it('returns status code 403', function (done) {
                request(base_url + '/all-category-list',
                    function (err, res, data) {
                        expect(res.statusCode).toBe(403);
                        done();
                    }
                );
            });
        });

        describe('GET /get-category/:name', function () {
            const name = 'Technology';

            it('returns status code 200', function (done) {
                request(base_url + '/get-category/' + name,
                    function (err, res, data) {
                        expect(res.statusCode).toBe(200);
                        done();
                    }
                );
            });

            it('returns an array as a JSON string', function (done) {
                request(base_url + '/get-category/' + name,
                    function (err, res, data) {
                        expect(Array.isArray(JSON.parse(data))).toBe(true);
                        done();
                    }
                );
            });

            it('returns an array of a single public category as a JSON string',
                function (done) {
                    request(base_url + '/get-category/' + name,
                        function (err, res, data) {
                            const category = JSON.parse(data)[0];
                            expect(category.name)
                                .toBe('Technology');
                            expect(category.description
                                .indexOf('"... adding one thing to another'))
                                .toBe(0);
                            expect(category.private)
                                .toBe(false);
                            done();
                        }
                    );
                }
            );
        });

        describe('GET /get-private-category/:name', function () {
            const name = 'LoremIpsum';

            it('returns status code 403', function (done) {
                request(base_url + '/get-private-category/' + name,
                    function (err, res, data) {
                        expect(res.statusCode).toBe(403);
                        done();
                    }
                );
            });
        });

        describe('POST /post-category', function () {
            it('returns status code 403 when not already logged in.',
                function (done) {
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
                }
            );
        });

        describe('PUT /update-category/:id', function () {
            it('returns status code 403 when not already logged in.',
                function (done) {
                    /* Attempts to update the Everything category. */
                    request.put(base_url
                            + '/update-category/57b5423cf22c6b7d4055fef4', {
                        json: {
                            name: 'Illegal category',
                            description: 'I hope this does not go through',
                            aboutAuthor: 'about who?'
                        }
                    }, function (err, res) {
                        expect(res.statusCode).toBe(403);
                        done();
                    });
                }
            );
        });

        describe('DELETE /remove-category/:id', function () {
            it('returns status code 403 when not already logged in.',
                function (done) {
                    /* Attempts to remove the Everything category. */
                    request.delete(base_url
                            + '/remove-category/57b5423cf22c6b7d4055fef4', {},
                        function (err, res) {
                            expect(res.statusCode).toBe(403);
                            done();
                        }
                    );
                }
            );
        });
    });
})();
