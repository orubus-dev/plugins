"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var fetch_1 = require("@libs/fetch");
var filterInputs_1 = require("@libs/filterInputs");
var cheerio_1 = require("cheerio");
var defaultCover_1 = require("@libs/defaultCover");
/**
 * Notes on the site (onlinereadfreenovel.com):
 * - Listing: `/allbooks/` and `/gr/<genre>/` list books as `article.box`
 *   items (`h2.title a` + preview image); further pages are `/p/<n>/`.
 * - Search: `/search_by_author_title_series/q/<term>` lists `ul.books li a`.
 *   Its links are cut to a fixed length, sometimes inside the slug, so
 *   `bookPath` rebuilds them.
 * - Book: `/<author>/<id>-<slug>_read.html` is page 1 of the text. The text
 *   is split across numbered pages, `/<author>/p,<n>,<id>-<slug>_read.html`.
 *   Each page is a plugin "chapter". The site has no chapter list, so the
 *   pages are walked until the last one (a page with text but no next link).
 * - Some pages are served as an empty 200 response, in runs of up to six seen
 *   so far, with text continuing after them. Those pages are skipped rather
 *   than listed as empty chapters, and do not end the walk.
 */
// Cloudflare on this site challenges requests from datacenter networks (seen
// from GitHub's runners) that send a browser User-Agent or a generic one such
// as node or curl, but lets a client that names itself through.
var HEADERS = { 'User-Agent': 'Mozilla/5.0 (compatible; LNReader)' };
// Upper bound on text pages walked per book, so a single book cannot issue an
// unbounded number of requests. Books longer than this are truncated, and
// parsePages logs a warning when it hits the cap.
var MAX_PAGES = 400;
// Pages fetched at once while walking a book. Fetching them one at a time
// took about 90 seconds for a 240-page book.
var PAGE_BATCH = 6;
// Retries of a chapter-list page after a rate limit, server error or network
// error, waiting 1s, 2s, 4s between them.
var PAGE_RETRIES = 3;
// Empty pages in a row after a page that links to a next one before the walk
// gives up. It only ends the walk when the book's real last page is empty.
var MAX_EMPTY_RUN = 12;
// A paragraph that opens a chapter, e.g. "Chapter 1 The Boy Who Lived",
// "Chapter One", "Prologue". Sentences (with end punctuation) are excluded.
var HEADING = /^(?:chapter\s+[\w-]+|prologue|epilogue)\b[^.!?]{0,60}$/i;
// Text pages hold at most a few chapter openings (two seen so far); a page
// with more is a table of contents (18 and 21 seen) and is not named after
// its first entry.
var MAX_HEADINGS = 4;
var OnlineReadFreeNovelPlugin = /** @class */ (function () {
    function OnlineReadFreeNovelPlugin() {
        var _this = this;
        this.id = 'onlinereadfreenovel';
        this.name = 'Online Read Free Novel';
        this.icon = 'src/en/onlinereadfreenovel/icon.png';
        this.site = 'https://onlinereadfreenovel.com';
        this.version = '1.0.0';
        this.filters = {
            genre: {
                label: 'Genre',
                value: 'all',
                options: [
                    { label: 'All', value: 'all' },
                    { label: 'Action & Adventure', value: 'actions_adventure' },
                    { label: 'Fantasy', value: 'fantasy' },
                    { label: 'History & Fiction', value: 'historical_fiction' },
                    { label: 'Horror', value: 'horror' },
                    { label: 'Humor', value: 'humor' },
                    { label: 'Mystery & Detective', value: 'mystery_detective' },
                    { label: 'Romance & Love', value: 'romance_love' },
                    { label: 'Science Fiction', value: 'science_fiction' },
                    { label: 'Thrillers & Crime', value: 'thrillers_crime' },
                    { label: 'Western', value: 'western' },
                    { label: 'Young Adult', value: 'young_adult' },
                ],
                type: filterInputs_1.FilterTypes.Picker,
            },
        };
        this.resolveUrl = function (path) { return _this.site + path; };
    }
    OnlineReadFreeNovelPlugin.prototype.popularNovels = function (pageNo_1, _a) {
        return __awaiter(this, arguments, void 0, function (pageNo, _b) {
            var genre, base, path, $;
            var _c;
            var filters = _b.filters;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        genre = ((_c = filters === null || filters === void 0 ? void 0 : filters.genre) === null || _c === void 0 ? void 0 : _c.value) || 'all';
                        base = genre === 'all' ? '/allbooks/' : '/gr/' + genre + '/';
                        path = pageNo > 1 ? base + 'p/' + pageNo + '/' : base;
                        return [4 /*yield*/, this.fetchDom(path)];
                    case 1:
                        $ = _d.sent();
                        return [2 /*return*/, this.parseBookList($)];
                }
            });
        });
    };
    OnlineReadFreeNovelPlugin.prototype.parseNovel = function (novelPath) {
        return __awaiter(this, void 0, void 0, function () {
            var $, name, novel, cover, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.fetchDom(novelPath)];
                    case 1:
                        $ = _b.sent();
                        name = $('h1').first().text().trim();
                        if (!name)
                            throw new Error("No book found at ".concat(novelPath));
                        novel = {
                            path: novelPath,
                            name: name,
                            author: $('.box_in > b > a').first().text().trim(),
                        };
                        cover = $('#textToRead img').first().attr('src');
                        novel.cover = cover ? this.toAbsolute(cover) : defaultCover_1.defaultCover;
                        _a = novel;
                        return [4 /*yield*/, this.parsePages(novelPath, $)];
                    case 2:
                        _a.chapters = _b.sent();
                        return [2 /*return*/, novel];
                }
            });
        });
    };
    OnlineReadFreeNovelPlugin.prototype.parseChapter = function (chapterPath) {
        return __awaiter(this, void 0, void 0, function () {
            var paragraphs, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this.paragraphs;
                        return [4 /*yield*/, this.fetchDom(chapterPath)];
                    case 1:
                        paragraphs = _a.apply(this, [_b.sent()]);
                        if (paragraphs.length === 0) {
                            throw new Error("The site returned no text for ".concat(chapterPath));
                        }
                        return [2 /*return*/, paragraphs.map(function (part) { return '<p>' + part + '</p>'; }).join('')];
                }
            });
        });
    };
    OnlineReadFreeNovelPlugin.prototype.searchNovels = function (searchTerm, pageNo) {
        return __awaiter(this, void 0, void 0, function () {
            var base, path, $;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        base = '/search_by_author_title_series/q/' + encodeURIComponent(searchTerm);
                        path = pageNo > 1 ? base + '/p/' + pageNo : base;
                        return [4 /*yield*/, this.fetchDom(path)];
                    case 1:
                        $ = _a.sent();
                        return [2 /*return*/, $('ul.books li a')
                                .toArray()
                                .flatMap(function (el) {
                                var _a;
                                var item = $(el);
                                var href = item.attr('href');
                                if (!href)
                                    return [];
                                var style = item.find('.i1').attr('style') || '';
                                var cover = (_a = style.match(/url\(["']?([^"')]+)["']?\)/)) === null || _a === void 0 ? void 0 : _a[1];
                                var path = _this.bookPath(href, cover);
                                if (!path)
                                    return [];
                                return [
                                    {
                                        name: item.find('.h2').attr('title') || item.text().trim(),
                                        path: path,
                                        cover: cover ? _this.toAbsolute(cover) : defaultCover_1.defaultCover,
                                    },
                                ];
                            })];
                }
            });
        });
    };
    OnlineReadFreeNovelPlugin.prototype.parseBookList = function ($) {
        var _this = this;
        return $('article.box')
            .toArray()
            .flatMap(function (el) {
            var link = $(el).find('h2.title a').first();
            var href = link.attr('href');
            if (!href)
                return [];
            var src = $(el).find('div.text img').first().attr('src');
            return [
                {
                    name: link.text().trim(),
                    path: _this.toPath(href),
                    cover: src ? _this.toAbsolute(src) : defaultCover_1.defaultCover,
                },
            ];
        });
    };
    /**
     * Returns the book's `_read.html` path for a search link. Search links
     * point at `/<author>/<id>-<slug>.html` but are cut to a fixed length, e.g.
     * `.../1301-harry_potter_and_the_philosophers_stone.ht` or
     * `.../458266-the_sociology_of_harry_potter_22_enchanting_`. Book pages need
     * the exact slug, so when the cut falls inside it, the slug is taken from
     * the cover file name (`[<id>_]<slug>_preview.jpg`). Returns undefined when
     * the slug cannot be recovered.
     */
    OnlineReadFreeNovelPlugin.prototype.bookPath = function (href, cover) {
        var _a;
        var path = this.toPath(href);
        if (/\/\d+-[^/]+_read\.html$/.test(path))
            return path;
        var match = path.match(/^(\/[^/]+\/\d+-)([^/]*)$/);
        if (!match)
            return undefined;
        var prefix = match[1], tail = match[2];
        var dot = tail.indexOf('.');
        if (dot > 0)
            return prefix + tail.slice(0, dot) + '_read.html';
        var file = (_a = cover === null || cover === void 0 ? void 0 : cover.match(/\/([^/]+)_preview\.\w+$/)) === null || _a === void 0 ? void 0 : _a[1];
        if (!file)
            return undefined;
        var slug = [file, file.replace(/^\d+_/, '')].find(function (name) {
            return name.startsWith(tail);
        });
        return slug ? prefix + slug + '_read.html' : undefined;
    };
    /**
     * Walks the text pages of a book. Page 1 is the novel path itself; page `n`
     * is `p,<n>,` inserted before the id. Pages are fetched PAGE_BATCH at a time
     * and handled in order. The walk ends at the first page with text and no
     * next link, or after MAX_EMPTY_RUN empty pages in a row. A page answered
     * with no text or a 404 counts as empty and is skipped. Any other failure
     * throws after retries, so a rate limit never shortens the list silently.
     */
    OnlineReadFreeNovelPlugin.prototype.parsePages = function (novelPath, firstPage) {
        return __awaiter(this, void 0, void 0, function () {
            var chapters, lastPage, emptyRun, hasNext, start, pages, page, doms, i, $, paragraphs, headings, heading;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        chapters = [];
                        lastPage = this.pagePath(novelPath, 2) === novelPath ? 1 : MAX_PAGES;
                        emptyRun = 0;
                        hasNext = false;
                        start = 1;
                        _a.label = 1;
                    case 1:
                        if (!(start <= lastPage)) return [3 /*break*/, 4];
                        pages = [];
                        for (page = start; page < start + PAGE_BATCH; page++) {
                            if (page <= lastPage)
                                pages.push(page);
                        }
                        return [4 /*yield*/, Promise.all(pages.map(function (page) {
                                return page === 1
                                    ? firstPage
                                    : _this.fetchPageDom(_this.pagePath(novelPath, page)).catch(function (error) { return error; });
                            }))];
                    case 2:
                        doms = _a.sent();
                        for (i = 0; i < pages.length; i++) {
                            $ = doms[i];
                            if ($ instanceof Error)
                                throw $;
                            paragraphs = $ ? this.paragraphs($) : [];
                            if (!$ || paragraphs.length === 0) {
                                hasNext = false;
                                if (++emptyRun >= MAX_EMPTY_RUN)
                                    return [2 /*return*/, chapters];
                                continue;
                            }
                            emptyRun = 0;
                            headings = paragraphs
                                .map(function (part) { return part.replace(/<[^>]*>/g, '').trim(); })
                                .filter(function (text) { return HEADING.test(text); });
                            heading = headings.length <= MAX_HEADINGS ? headings[0] : undefined;
                            chapters.push({
                                name: 'Page ' + pages[i] + (heading ? ': ' + heading : ''),
                                path: this.pagePath(novelPath, pages[i]),
                                chapterNumber: chapters.length + 1,
                            });
                            hasNext = $('.page_next a').length > 0;
                            if (!hasNext)
                                return [2 /*return*/, chapters];
                        }
                        _a.label = 3;
                    case 3:
                        start += PAGE_BATCH;
                        return [3 /*break*/, 1];
                    case 4:
                        if (lastPage === MAX_PAGES && hasNext) {
                            console.warn("onlinereadfreenovel: stopped at MAX_PAGES (".concat(MAX_PAGES, ") for ").concat(novelPath, "; remaining pages were not listed"));
                        }
                        return [2 /*return*/, chapters];
                }
            });
        });
    };
    /**
     * The text of a page as paragraph HTML. The text is one block of
     * `<br>`-separated lines; a run of two or more line breaks marks a
     * paragraph boundary. Images, scripts, comments, empty paragraphs and a
     * stray `-->` paragraph left by the site's markup are dropped.
     */
    OnlineReadFreeNovelPlugin.prototype.paragraphs = function ($) {
        var text = $('#textToRead');
        text.find('img, a.highslide, script, style').remove();
        var html = (text.html() || '').replace(/<\/?p[^>]*>/gi, '');
        return html
            .split(/(?:<br\s*\/*>\s*){2,}/i)
            .map(function (part) {
            return part
                .replace(/<!--[\s\S]*?-->/g, '')
                .replace(/^(?:<br\s*\/*>|&nbsp;|\u00a0|\s)+/i, '')
                .replace(/(?:<br\s*\/*>|&nbsp;|\u00a0|\s)+$/i, '');
        })
            .filter(function (part) { return part.length > 0 && part !== '--&gt;'; });
    };
    OnlineReadFreeNovelPlugin.prototype.pagePath = function (novelPath, page) {
        if (page <= 1)
            return novelPath;
        return novelPath.replace(/\/(\d+-[^/]+_read\.html)$/, '/p,' + page + ',$1');
    };
    OnlineReadFreeNovelPlugin.prototype.fetchDom = function (path) {
        return __awaiter(this, void 0, void 0, function () {
            var res, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, (0, fetch_1.fetchApi)(this.site + path, { headers: HEADERS })];
                    case 1:
                        res = _b.sent();
                        if (!res.ok) {
                            throw Object.assign(new Error("HTTP error for ".concat(path)), {
                                status: res.status,
                            });
                        }
                        _a = cheerio_1.load;
                        return [4 /*yield*/, res.text()];
                    case 2: return [2 /*return*/, _a.apply(void 0, [_b.sent()])];
                }
            });
        });
    };
    OnlineReadFreeNovelPlugin.prototype.fetchPageDom = function (path) {
        return __awaiter(this, void 0, void 0, function () {
            var _loop_1, this_1, attempt, state_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _loop_1 = function (attempt) {
                            var res, _b, _c, error_1;
                            return __generator(this, function (_d) {
                                switch (_d.label) {
                                    case 0:
                                        _d.trys.push([0, 3, , 5]);
                                        return [4 /*yield*/, (0, fetch_1.fetchApi)(this_1.site + path, { headers: HEADERS })];
                                    case 1:
                                        res = _d.sent();
                                        if (res.status === 404)
                                            return [2 /*return*/, { value: null }];
                                        if (!res.ok) {
                                            throw Object.assign(new Error("HTTP error for ".concat(path)), {
                                                status: res.status,
                                            });
                                        }
                                        _b = {};
                                        _c = cheerio_1.load;
                                        return [4 /*yield*/, res.text()];
                                    case 2: return [2 /*return*/, (_b.value = _c.apply(void 0, [_d.sent()]), _b)];
                                    case 3:
                                        error_1 = _d.sent();
                                        if (attempt >= PAGE_RETRIES)
                                            throw error_1;
                                        return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 1000 * Math.pow(2, attempt)); })];
                                    case 4:
                                        _d.sent();
                                        return [3 /*break*/, 5];
                                    case 5: return [2 /*return*/];
                                }
                            });
                        };
                        this_1 = this;
                        attempt = 0;
                        _a.label = 1;
                    case 1: return [5 /*yield**/, _loop_1(attempt)];
                    case 2:
                        state_1 = _a.sent();
                        if (typeof state_1 === "object")
                            return [2 /*return*/, state_1.value];
                        _a.label = 3;
                    case 3:
                        attempt++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    OnlineReadFreeNovelPlugin.prototype.toPath = function (href) {
        return new URL(href, this.site).pathname;
    };
    OnlineReadFreeNovelPlugin.prototype.toAbsolute = function (src) {
        return new URL(src, this.site).href;
    };
    return OnlineReadFreeNovelPlugin;
}());
exports.default = new OnlineReadFreeNovelPlugin();
