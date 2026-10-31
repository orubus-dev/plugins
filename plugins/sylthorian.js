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
 * The Sylthorian (thesylthorian.com) — English LNReader plugin.
 *
 * thesylthorian.com is the author's own Squarespace storefront. The free web
 * chapters are readable in full; some of the same books are also sold as
 * e-books/paperbacks under `/published-books-portofolio/`, which this plugin
 * intentionally ignores.
 *
 * The site is a hand-built Squarespace 7.1 site, so each section is authored
 * HTML rather than a CMS collection. The shape the plugin relies on:
 *
 * - Listing:      `/web-novels` — one `<h3>` title immediately followed by a
 *                 "Read it!" button linking to `/web-novels-1/<slug>`. All 10
 *                 web novels fit on this single page; no covers are exposed.
 * - Novel page:   `/web-novels-1/<slug>` — title in the first `<h2>`, cover in
 *                 `og:image`, a "Synopsis:" text block, and the full chapter
 *                 list as `/latest-chapters/<slug>-N` links (ascending, no
 *                 pagination — up to ~189 chapters for the largest novel).
 * - Chapter page: `/latest-chapters/<slug>-N` — body HTML inside
 *                 `.blog-item-content.e-content .sqs-html-content`.
 * - Search:       the site's own `/search?q=` page is JS-driven and mostly
 *                 returns chapter hits, burying novel pages behind them, so
 *                 the plugin filters the small `/web-novels` catalogue by
 *                 title instead — deterministic and complete for 10 novels.
 */
var Sylthorian = /** @class */ (function () {
    function Sylthorian() {
        var _this = this;
        this.id = 'sylthorian';
        this.name = 'The Sylthorian';
        this.version = '1.0.0';
        this.icon = 'src/en/sylthorian/icon.png';
        this.site = 'https://thesylthorian.com';
        this.resolveUrl = function (path) { return _this.site + path; };
    }
    // Throw (carrying the HTTP status) on a refused response so a runner-side
    // block is reported INCONCLUSIVE per docs/testing.md instead of being
    // parsed into a false empty-result FAIL.
    Sylthorian.prototype.fetchSite = function (url, init) {
        return __awaiter(this, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, fetch_1.fetchApi)(url, init)];
                    case 1:
                        res = _a.sent();
                        if (!res.ok) {
                            throw Object.assign(new Error('Request failed: ' + res.status), {
                                status: res.status,
                            });
                        }
                        return [2 /*return*/, res];
                }
            });
        });
    };
    Sylthorian.prototype.fetchSiteText = function (url) {
        return this.fetchSite(url).then(function (res) { return res.text(); });
    };
    /** Squarespace serves `og:image` over cleartext `http://`; upgrade it. */
    Sylthorian.prototype.toHttps = function (url) {
        return url ? url.replace(/^http:\/\//, 'https://') : url;
    };
    /**
     * The `/web-novels` page pairs each novel's `<h3>` title with the "Read it!"
     * button that follows it, so walk the two in document order.
     */
    Sylthorian.prototype.parseNovelList = function (html) {
        var $ = (0, cheerio_1.load)(html);
        var novels = [];
        var seen = new Set();
        var lastTitle = '';
        $('h3, a[href^="/web-novels-1/"]').each(function (_, el) {
            var node = $(el);
            if (node.is('h3')) {
                lastTitle = node.text().replace(/\s+/g, ' ').trim();
                return;
            }
            var path = node.attr('href');
            if (!path || seen.has(path))
                return;
            seen.add(path);
            novels.push({
                name: lastTitle || path.split('/').pop() || path,
                path: path,
                cover: defaultCover_1.defaultCover,
            });
            lastTitle = '';
        });
        return novels;
    };
    Sylthorian.prototype.parseSummary = function ($) {
        var summary;
        $('.sqs-html-content').each(function (_, el) {
            var text = $(el).text().replace(/\s+/g, ' ').trim();
            if (/^synopsis\b/i.test(text)) {
                summary = text.replace(/^synopsis\s*:?\s*/i, '').trim();
            }
        });
        return summary;
    };
    Sylthorian.prototype.parseChapters = function ($, novelPath) {
        var _a;
        // Chapter slugs reuse the novel slug (`/web-novels-1/<slug>` ->
        // `/latest-chapters/<slug>-N`), so match on that prefix to avoid picking
        // up unrelated chapter links from the page navigation.
        var slug = (_a = novelPath.split('/').filter(Boolean).pop()) !== null && _a !== void 0 ? _a : '';
        var prefix = "/latest-chapters/".concat(slug, "-");
        var chapters = [];
        var seen = new Set();
        $("a[href^=\"".concat(prefix, "\"]")).each(function (_, el) {
            var node = $(el);
            var path = node.attr('href');
            var name = node.text().replace(/\s+/g, ' ').trim();
            var number = path === null || path === void 0 ? void 0 : path.slice(prefix.length).match(/^(\d+)$/);
            if (!path || !name || !number || seen.has(path))
                return;
            seen.add(path);
            chapters.push({ name: name, path: path, chapterNumber: parseInt(number[1], 10) });
        });
        return chapters;
    };
    Sylthorian.prototype.popularNovels = function (pageNo) {
        return __awaiter(this, void 0, void 0, function () {
            var html;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // All web novels are listed on one page.
                        if (pageNo > 1)
                            return [2 /*return*/, []];
                        return [4 /*yield*/, this.fetchSiteText(this.site + '/web-novels')];
                    case 1:
                        html = _a.sent();
                        return [2 /*return*/, this.parseNovelList(html)];
                }
            });
        });
    };
    Sylthorian.prototype.parseNovel = function (novelPath) {
        return __awaiter(this, void 0, void 0, function () {
            var html, $, novel;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.fetchSiteText(this.site + novelPath)];
                    case 1:
                        html = _a.sent();
                        $ = (0, cheerio_1.load)(html);
                        novel = {
                            path: novelPath,
                            name: $('h2').first().text().replace(/\s+/g, ' ').trim() || 'Untitled',
                            cover: this.toHttps($('meta[property="og:image"]').attr('content')),
                            summary: this.parseSummary($),
                            chapters: this.parseChapters($, novelPath),
                        };
                        return [2 /*return*/, novel];
                }
            });
        });
    };
    Sylthorian.prototype.parseChapter = function (chapterPath) {
        return __awaiter(this, void 0, void 0, function () {
            var html, $, node;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.fetchSiteText(this.site + chapterPath)];
                    case 1:
                        html = _b.sent();
                        $ = (0, cheerio_1.load)(html);
                        node = $('.blog-item-content.e-content .sqs-html-content').first();
                        if (!node.length) {
                            // A page without the post body is a real failure, not empty content.
                            throw new Error('Chapter content not found');
                        }
                        node.find('script, style').remove();
                        return [2 /*return*/, (_a = node.html()) !== null && _a !== void 0 ? _a : ''];
                }
            });
        });
    };
    Sylthorian.prototype.searchNovels = function (searchTerm, pageNo) {
        return __awaiter(this, void 0, void 0, function () {
            var novels, _a, term;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (pageNo > 1)
                            return [2 /*return*/, []];
                        _a = this.parseNovelList;
                        return [4 /*yield*/, this.fetchSiteText(this.site + '/web-novels')];
                    case 1:
                        novels = _a.apply(this, [_b.sent()]);
                        term = searchTerm.trim().toLowerCase();
                        if (!term)
                            return [2 /*return*/, novels];
                        return [2 /*return*/, novels.filter(function (novel) { return novel.name.toLowerCase().includes(term); })];
                }
            });
        });
    };
    return Sylthorian;
}());
exports.default = new Sylthorian();
