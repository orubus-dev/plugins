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
var cheerio_1 = require("cheerio");
var fetch_1 = require("@libs/fetch");
var defaultCover_1 = require("@libs/defaultCover");
/**
 * DaoTekno (daotekno.com) LNReader plugin
 *
 * daotekno.com serves the DaoTranslate.com catalog — pages are titled
 * "DaoTranslate.com - Web Novel Reader" and chapter footers link to
 * DaoTranslate (the connection mentioned in the plugin request). It is a
 * custom PHP reader, not WordPress/Madara:
 *
 * - Catalog:      `/?page=N` — 50 `a.novel-card.novel-item` rows per page,
 *                 title in `.novel-title`, page marker `N / M`.
 * - Search:       `/?q=<term>` — filtered server-side, same card markup,
 *                 single page (page parameters are ignored).
 * - Novel page:   `/series/<slug>/` — `<h1>` title, chapter tiles in
 *                 `#allChaptersGrid` (`.chapter-box`, newest first) split
 *                 across `?page=N`, 200 per page.
 * - Chapter page: `/series/<slug>/<chapter>/` — text inside `#novel-content`.
 *
 * The site gates chapter pages on User-Agent: desktop UAs receive a
 * "Mobile Only Content" interstitial instead of the chapter.
 *
 * The site also refuses app readers on purpose: any User-Agent carrying the
 * Android WebView `; wv` token (LNReader's own UA and its WebView) gets an
 * HTTP 403 "Access Denied" page asking readers to open the site in Google
 * Chrome. The plugin sends the app's own User-Agent and reports that
 * refusal instead of disguising the app as a browser.
 */
var DaoTekno = /** @class */ (function () {
    function DaoTekno() {
        var _this = this;
        this.id = 'daotekno';
        this.name = 'DaoTekno';
        this.version = '1.0.3';
        this.icon = 'src/en/daotekno/icon.png';
        this.site = 'https://daotekno.com/';
        // Cloudflare rate-limits the site to about four requests per ten seconds
        // (HTTP 429, error 1015, with a Retry-After of a few seconds). A novel
        // with more than 800 chapters needs five or more chapter-list pages, so
        // wait out each 429 instead of failing the whole novel.
        this.maxRateLimitRetries = 4;
        this.maxRetryAfterSeconds = 30;
        this.resolveUrl = function (path) { return _this.site + path; };
    }
    DaoTekno.prototype.retryAfterMs = function (res) {
        var _a;
        var seconds = parseInt((_a = res.headers.get('retry-after')) !== null && _a !== void 0 ? _a : '', 10);
        if (!Number.isFinite(seconds) || seconds < 0)
            return 10000;
        if (seconds > this.maxRetryAfterSeconds)
            return null;
        return (seconds + 1) * 1000;
    };
    // Throw (carrying the HTTP status) on a refused response so a
    // runner-side block is reported INCONCLUSIVE per docs/testing.md
    // instead of being parsed into a false empty-result FAIL.
    DaoTekno.prototype.fetchHtml = function (url) {
        return __awaiter(this, void 0, void 0, function () {
            var res, _loop_1, this_1, retry, state_1, message, _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, (0, fetch_1.fetchApi)(url)];
                    case 1:
                        res = _d.sent();
                        _loop_1 = function (retry) {
                            var waitMs;
                            return __generator(this, function (_e) {
                                switch (_e.label) {
                                    case 0:
                                        waitMs = this_1.retryAfterMs(res);
                                        if (waitMs === null)
                                            return [2 /*return*/, "break"];
                                        return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, waitMs); })];
                                    case 1:
                                        _e.sent();
                                        return [4 /*yield*/, (0, fetch_1.fetchApi)(url)];
                                    case 2:
                                        res = _e.sent();
                                        return [2 /*return*/];
                                }
                            });
                        };
                        this_1 = this;
                        retry = 0;
                        _d.label = 2;
                    case 2:
                        if (!(res.status === 429 && retry < this.maxRateLimitRetries)) return [3 /*break*/, 5];
                        return [5 /*yield**/, _loop_1(retry)];
                    case 3:
                        state_1 = _d.sent();
                        if (state_1 === "break")
                            return [3 /*break*/, 5];
                        _d.label = 4;
                    case 4:
                        retry++;
                        return [3 /*break*/, 2];
                    case 5:
                        if (!!res.ok) return [3 /*break*/, 11];
                        message = 'Request failed: ' + res.status;
                        if (!(res.status === 429)) return [3 /*break*/, 6];
                        message =
                            'daotekno.com is rate-limiting requests (HTTP 429). ' +
                                'Wait a few seconds, then retry.';
                        return [3 /*break*/, 10];
                    case 6:
                        if (!(res.headers.get('cf-mitigated') === 'challenge')) return [3 /*break*/, 7];
                        message =
                            'Cloudflare challenge (HTTP ' +
                                res.status +
                                '). Open daotekno.com in WebView to pass it, then retry.';
                        return [3 /*break*/, 10];
                    case 7:
                        _a = res.status === 403;
                        if (!_a) return [3 /*break*/, 9];
                        _c = (_b = /in-app browser is not allowed/i).test;
                        return [4 /*yield*/, res.text()];
                    case 8:
                        _a = _c.apply(_b, [_d.sent()]);
                        _d.label = 9;
                    case 9:
                        if (_a) {
                            message =
                                'daotekno.com blocks reading in apps and in-app browsers ' +
                                    '(HTTP 403 "Access Denied") and asks readers to open the site ' +
                                    'in Google Chrome instead.';
                        }
                        _d.label = 10;
                    case 10: throw Object.assign(new Error(message), { status: res.status });
                    case 11: return [2 /*return*/, res.text()];
                }
            });
        });
    };
    DaoTekno.prototype.parseNovelCards = function (html) {
        var $ = (0, cheerio_1.load)(html);
        var novels = [];
        $('a.novel-card.novel-item').each(function (_, el) {
            var href = $(el).attr('href');
            var name = $(el).find('.novel-title').text().trim() ||
                $(el)
                    .text()
                    .replace(/Index\s*»/g, '')
                    .trim();
            if (!href || !name)
                return;
            novels.push({
                name: name,
                path: href.replace(/^\//, ''),
                // The listing exposes no covers at all.
                cover: defaultCover_1.defaultCover,
            });
        });
        return novels;
    };
    DaoTekno.prototype.collectChapters = function ($) {
        var chapters = [];
        $('#allChaptersGrid > a.chapter-box').each(function (_, el) {
            var href = $(el).attr('href');
            var name = $(el).text().replace(/\s+/g, ' ').trim();
            if (!href || !name)
                return;
            chapters.push({ name: name, path: href.replace(/^\//, '') });
        });
        return chapters;
    };
    DaoTekno.prototype.nextChapterPage = function ($) {
        var next = $('a.btn-page')
            .filter(function (_, el) { return $(el).text().includes('Next'); })
            .attr('href');
        return next !== null && next !== void 0 ? next : null;
    };
    DaoTekno.prototype.popularNovels = function (pageNo) {
        return __awaiter(this, void 0, void 0, function () {
            var html, marker, totalPages;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.fetchHtml("".concat(this.site, "?page=").concat(pageNo))];
                    case 1:
                        html = _b.sent();
                        marker = (0, cheerio_1.load)(html)('span.btn-pagi.active').text();
                        totalPages = parseInt((_a = marker.split('/')[1]) !== null && _a !== void 0 ? _a : '', 10);
                        if (Number.isFinite(totalPages) && pageNo > totalPages) {
                            return [2 /*return*/, []];
                        }
                        return [2 /*return*/, this.parseNovelCards(html)];
                }
            });
        });
    };
    DaoTekno.prototype.parseNovel = function (novelPath) {
        return __awaiter(this, void 0, void 0, function () {
            var firstHtml, $first, novel, chapters, nextHref, pagesFetched, maxChapterPages, html, $;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.fetchHtml(this.site + novelPath)];
                    case 1:
                        firstHtml = _a.sent();
                        $first = (0, cheerio_1.load)(firstHtml);
                        novel = {
                            path: novelPath,
                            name: $first('h1').first().text().trim() || 'Untitled',
                            // The novel page carries no cover, summary, author or status.
                            cover: defaultCover_1.defaultCover,
                            chapters: [],
                        };
                        chapters = this.collectChapters($first);
                        nextHref = this.nextChapterPage($first);
                        pagesFetched = 1;
                        maxChapterPages = 100;
                        _a.label = 2;
                    case 2:
                        if (!(nextHref && pagesFetched < maxChapterPages)) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.fetchHtml(this.site + novelPath + nextHref)];
                    case 3:
                        html = _a.sent();
                        $ = (0, cheerio_1.load)(html);
                        chapters.push.apply(chapters, this.collectChapters($));
                        nextHref = this.nextChapterPage($);
                        pagesFetched++;
                        return [3 /*break*/, 2];
                    case 4:
                        // Every page lists the newest chapter first, and the pages themselves
                        // are served newest first, so the concatenation is fully descending.
                        novel.chapters = chapters.reverse();
                        return [2 /*return*/, novel];
                }
            });
        });
    };
    DaoTekno.prototype.parseChapter = function (chapterPath) {
        return __awaiter(this, void 0, void 0, function () {
            var html, $, content;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.fetchHtml(this.site + chapterPath)];
                    case 1:
                        html = _b.sent();
                        $ = (0, cheerio_1.load)(html);
                        content = $('#novel-content');
                        if (content.length === 0) {
                            // The site serves a "Mobile Only Content" interstitial (HTTP 200)
                            // to desktop UAs instead of the chapter body; treat a page without
                            // the content container as a real failure, not empty content.
                            throw new Error('Chapter content not found (site served a placeholder)');
                        }
                        content.find('script, style, .promo').remove();
                        return [2 /*return*/, (_a = content.html()) !== null && _a !== void 0 ? _a : ''];
                }
            });
        });
    };
    DaoTekno.prototype.searchNovels = function (searchTerm, pageNo) {
        return __awaiter(this, void 0, void 0, function () {
            var html;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // Search is filtered server-side and served as a single page; the
                        // site ignores page parameters on `?q=` requests.
                        if (pageNo > 1) {
                            return [2 /*return*/, []];
                        }
                        return [4 /*yield*/, this.fetchHtml("".concat(this.site, "?q=").concat(encodeURIComponent(searchTerm)))];
                    case 1:
                        html = _a.sent();
                        return [2 /*return*/, this.parseNovelCards(html)];
                }
            });
        });
    };
    return DaoTekno;
}());
exports.default = new DaoTekno();
