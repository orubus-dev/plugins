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
var filterInputs_1 = require("@libs/filterInputs");
var defaultCover_1 = require("@libs/defaultCover");
var novelStatus_1 = require("@libs/novelStatus");
/**
 * Empire Novel (empirenovel.com) LNReader plugin
 *
 * A custom Laravel site behind a Cloudflare managed challenge:
 *
 * - Catalog:      `/novels-list?category=&status=&page=N` — 30
 *                 `.novellist_item` cards per page, sorted by name (the
 *                 site offers no popularity ranking and ignores sort
 *                 parameters on GET).
 * - Latest:       `/?page=N` — "Latest Releases" `.col_home` blocks.
 * - Search:       `/search-live?q=<term>` — JSON array of every matching
 *                 novel, unpaginated.
 * - Novel page:   `/novel/<slug>` — metadata plus the newest 30 chapters;
 *                 the rest are split across `?page=N`.
 * - Chapter list: `/select-partial/<slug>/<chapter>` — the reader's
 *                 chapter `<select>`, listing every chapter newest first
 *                 in a single request (the chapter must exist).
 * - Chapter page: `/novel/<slug>/<chapter>` — text inside `#read-novel`.
 */
var EmpireNovel = /** @class */ (function () {
    function EmpireNovel() {
        var _this = this;
        this.id = 'empirenovel';
        this.name = 'Empire Novel';
        this.version = '1.0.0';
        this.icon = 'src/en/empirenovel/icon.png';
        this.site = 'https://www.empirenovel.com/';
        this.resolveUrl = function (path) { return _this.site + path; };
        this.filters = {
            category: {
                label: 'Category',
                value: '',
                options: [
                    { label: 'All', value: '' },
                    { label: 'Action', value: 'action' },
                    { label: 'Adult', value: 'adult' },
                    { label: 'Adventure', value: 'adventure' },
                    { label: 'Animals', value: 'animals' },
                    { label: 'Arts', value: 'arts' },
                    { label: 'Bender', value: 'bender' },
                    { label: 'Biographies', value: 'biographies' },
                    { label: 'Business', value: 'business' },
                    { label: 'Chinese', value: 'chinese' },
                    { label: 'Comedy', value: 'comedy' },
                    { label: 'Drama', value: 'drama' },
                    { label: 'Eastern', value: 'eastern' },
                    { label: 'Ecchi', value: 'ecchi' },
                    { label: 'Education', value: 'education' },
                    { label: 'Entertainment', value: 'entertainment' },
                    { label: 'Fanfiction', value: 'fanfiction' },
                    { label: 'Fantasy', value: 'fantasy' },
                    { label: 'Fiction', value: 'fiction' },
                    { label: 'Game', value: 'game' },
                    { label: 'Gender', value: 'gender' },
                    { label: 'Gender Bender', value: 'gender-bender' },
                    { label: 'H', value: 'h' },
                    { label: 'Harem', value: 'harem' },
                    { label: 'Historical', value: 'historical' },
                    { label: 'History', value: 'history' },
                    { label: 'Home', value: 'home' },
                    { label: 'Horror', value: 'horror' },
                    { label: 'Humor', value: 'humor' },
                    { label: 'Isekai', value: 'isekai' },
                    { label: 'Josei', value: 'josei' },
                    { label: 'Korean', value: 'korean' },
                    { label: 'Martial Arts', value: 'martial-arts' },
                    { label: 'Mature', value: 'mature' },
                    { label: 'Mecha', value: 'mecha' },
                    { label: 'Memoirs', value: 'memoirs' },
                    { label: 'Modern Life', value: 'modern-life' },
                    { label: 'Mystery', value: 'mystery' },
                    { label: 'Original', value: 'original' },
                    { label: 'Other Books', value: 'other-books' },
                    { label: 'Philosophy', value: 'philosophy' },
                    { label: 'Photography', value: 'photography' },
                    { label: 'Politics', value: 'politics' },
                    { label: 'Professional', value: 'professional' },
                    { label: 'Psychological', value: 'psychological' },
                    { label: 'Reincarnation', value: 'reincarnation' },
                    { label: 'Religion', value: 'religion' },
                    { label: 'Romance', value: 'romance' },
                    { label: 'School Life', value: 'school-life' },
                    { label: 'School Stories', value: 'school-stories' },
                    { label: 'Sci-Fi', value: 'sci-fi' },
                    { label: 'Seinen', value: 'seinen' },
                    { label: 'Short Stories', value: 'short-stories' },
                    { label: 'Shoujo', value: 'shoujo' },
                    { label: 'Shoujo Ai', value: 'shoujo-ai' },
                    { label: 'Shounen', value: 'shounen' },
                    { label: 'Shounen Ai', value: 'shounen-ai' },
                    { label: 'Slice Of Life', value: 'slice-of-life' },
                    { label: 'Smut', value: 'smut' },
                    { label: 'Social Science', value: 'social-science' },
                    { label: 'Spirituality', value: 'spirituality' },
                    { label: 'Sports', value: 'sports' },
                    { label: 'Supernatural', value: 'supernatural' },
                    { label: 'System', value: 'system' },
                    { label: 'Technical', value: 'technical' },
                    { label: 'Technology', value: 'technology' },
                    { label: 'Thriller', value: 'thriller' },
                    { label: 'Tragedy', value: 'tragedy' },
                    { label: 'Transmigration', value: 'transmigration' },
                    { label: 'Urban', value: 'urban' },
                    { label: 'Virtual Reality', value: 'virtual-reality' },
                    { label: 'Wuxia', value: 'wuxia' },
                    { label: 'Xianxia', value: 'xianxia' },
                    { label: 'Xuanhuan', value: 'xuanhuan' },
                    { label: 'Yaoi', value: 'yaoi' },
                    { label: 'Yuri', value: 'yuri' },
                ],
                type: filterInputs_1.FilterTypes.Picker,
            },
            status: {
                label: 'Status',
                value: '',
                options: [
                    { label: 'All', value: '' },
                    { label: 'Ongoing', value: '1' },
                    { label: 'Completed', value: '2' },
                    { label: 'Abandoned', value: '3' },
                ],
                type: filterInputs_1.FilterTypes.Picker,
            },
        };
    }
    // Throw (carrying the HTTP status) on a refused response so a
    // Cloudflare challenge is reported instead of being parsed into a
    // false empty result. The whole site sits behind a managed challenge,
    // which answers 403/503 until it is solved in WebView.
    EmpireNovel.prototype.fetchSite = function (url) {
        return __awaiter(this, void 0, void 0, function () {
            var res, message;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, fetch_1.fetchApi)(url)];
                    case 1:
                        res = _a.sent();
                        if (!res.ok) {
                            message = res.status === 403 || res.status === 503
                                ? 'Cloudflare protection detected (HTTP error). Please try opening the plugin in WebView first to solve the challenge.'
                                : 'Request failed: ' + res.status;
                            throw Object.assign(new Error(message), { status: res.status });
                        }
                        return [2 /*return*/, res];
                }
            });
        });
    };
    EmpireNovel.prototype.coverUrl = function (src) {
        var path = src === null || src === void 0 ? void 0 : src.trim();
        return path ? new URL(path, this.site).href : defaultCover_1.defaultCover;
    };
    EmpireNovel.prototype.popularNovels = function (pageNo_1, _a) {
        return __awaiter(this, arguments, void 0, function (pageNo, _b) {
            var novels, $_1, _c, params, $, _d;
            var _this = this;
            var showLatestNovels = _b.showLatestNovels, filters = _b.filters;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        novels = [];
                        if (!showLatestNovels) return [3 /*break*/, 2];
                        _c = cheerio_1.load;
                        return [4 /*yield*/, this.fetchSite("".concat(this.site, "?page=").concat(pageNo)).then(function (r) { return r.text(); })];
                    case 1:
                        $_1 = _c.apply(void 0, [_e.sent()]);
                        $_1('.home_release .col_home').each(function (_, el) {
                            var link = $_1(el).find('h4 a');
                            var href = link.attr('href');
                            var name = link.text().trim();
                            if (!href || !name)
                                return;
                            novels.push({
                                name: name,
                                path: href.replace(/^\//, ''),
                                cover: _this.coverUrl($_1(el).find('img').attr('data-src')),
                            });
                        });
                        return [2 /*return*/, novels];
                    case 2:
                        params = new URLSearchParams();
                        if (filters === null || filters === void 0 ? void 0 : filters.category.value) {
                            params.append('category', filters.category.value);
                        }
                        if (filters === null || filters === void 0 ? void 0 : filters.status.value)
                            params.append('status', filters.status.value);
                        params.append('page', pageNo.toString());
                        _d = cheerio_1.load;
                        return [4 /*yield*/, this.fetchSite("".concat(this.site, "novels-list?").concat(params.toString())).then(function (r) { return r.text(); })];
                    case 3:
                        $ = _d.apply(void 0, [_e.sent()]);
                        $('.novellist_item').each(function (_, el) {
                            var link = $(el).find('a:has(h2)');
                            var href = link.attr('href');
                            var name = link.find('h2').text().trim();
                            if (!href || !name)
                                return;
                            novels.push({
                                name: name,
                                path: href.replace(/^\//, ''),
                                cover: _this.coverUrl($(el).find('img').attr('data-src')),
                            });
                        });
                        return [2 /*return*/, novels];
                }
            });
        });
    };
    EmpireNovel.prototype.parseNovel = function (novelPath) {
        return __awaiter(this, void 0, void 0, function () {
            var $, _a, novel, summary, status, chapterHref, chapterSlug, novelSlug, chapters, $list_1, _b;
            var _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _a = cheerio_1.load;
                        return [4 /*yield*/, this.fetchSite(this.site + novelPath).then(function (r) { return r.text(); })];
                    case 1:
                        $ = _a.apply(void 0, [_d.sent()]);
                        novel = {
                            path: novelPath,
                            name: $('h1[itemprop]').first().text().trim() || 'Untitled',
                            cover: this.coverUrl($('img.show_image').attr('data-src')),
                            author: $('[itemprop="author"]').text().trim() || undefined,
                            genres: $('[itemprop="genre"]')
                                .map(function (_, el) { return $(el).text().trim(); })
                                .get()
                                .join(', '),
                        };
                        summary = $('[itemprop="description"]');
                        summary.find('#read_more').remove();
                        novel.summary = (0, cheerio_1.load)(((_c = summary.html()) !== null && _c !== void 0 ? _c : '').replace(/ ?<span id="dots">[\s\S]*?<\/span><span id="more">/, ''))
                            .text()
                            .trim();
                        status = $('.show_details > div')
                            .filter(function (_, el) { return $(el).text().trim().startsWith('Status'); })
                            .find('span')
                            .text()
                            .trim();
                        if (status === 'Ongoing')
                            novel.status = novelStatus_1.NovelStatus.Ongoing;
                        else if (status === 'Completed')
                            novel.status = novelStatus_1.NovelStatus.Completed;
                        else if (status === 'Abandoned')
                            novel.status = novelStatus_1.NovelStatus.Cancelled;
                        else
                            novel.status = novelStatus_1.NovelStatus.Unknown;
                        chapterHref = $('a.chapter_link').first().attr('href');
                        chapterSlug = chapterHref === null || chapterHref === void 0 ? void 0 : chapterHref.split('/').pop();
                        novelSlug = novelPath.split('/').pop();
                        chapters = [];
                        if (!(chapterSlug && novelSlug)) return [3 /*break*/, 3];
                        _b = cheerio_1.load;
                        return [4 /*yield*/, this.fetchSite("".concat(this.site, "select-partial/").concat(novelSlug, "/").concat(chapterSlug)).then(function (r) { return r.text(); })];
                    case 2:
                        $list_1 = _b.apply(void 0, [_d.sent()]);
                        $list_1('option').each(function (_, el) {
                            var href = $list_1(el).attr('value');
                            var name = $list_1(el).text().trim();
                            if (!href || !name)
                                return;
                            var chapterNumber = Number(href.split('/').pop());
                            chapters.push({
                                name: name,
                                path: href.replace(/^\//, ''),
                                chapterNumber: Number.isFinite(chapterNumber)
                                    ? chapterNumber
                                    : undefined,
                            });
                        });
                        _d.label = 3;
                    case 3:
                        // The selector lists the newest chapter first.
                        novel.chapters = chapters.reverse();
                        return [2 /*return*/, novel];
                }
            });
        });
    };
    EmpireNovel.prototype.parseChapter = function (chapterPath) {
        return __awaiter(this, void 0, void 0, function () {
            var $, _a, content;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = cheerio_1.load;
                        return [4 /*yield*/, this.fetchSite(this.site + chapterPath).then(function (r) { return r.text(); })];
                    case 1:
                        $ = _a.apply(void 0, [_c.sent()]);
                        content = $('#read-novel');
                        if (content.length === 0) {
                            throw new Error('Chapter content not found');
                        }
                        // The reader renders this HTML unsanitized, so drop anything that could
                        // run code: active elements, event handlers and javascript: URLs.
                        content
                            .find('script, style, iframe, object, embed, form, noscript, ins')
                            .remove();
                        content.find('*').each(function (_, el) {
                            if (el.type !== 'tag')
                                return;
                            for (var _i = 0, _a = Object.entries(el.attribs); _i < _a.length; _i++) {
                                var _b = _a[_i], attr = _b[0], value = _b[1];
                                if (/^on/i.test(attr) ||
                                    /javascript:/i.test(value.replace(/\s+/g, ''))) {
                                    $(el).removeAttr(attr);
                                }
                            }
                        });
                        return [2 /*return*/, (_b = content.html()) !== null && _b !== void 0 ? _b : ''];
                }
            });
        });
    };
    EmpireNovel.prototype.searchNovels = function (searchTerm, pageNo) {
        return __awaiter(this, void 0, void 0, function () {
            var results;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // search-live returns every match at once.
                        if (pageNo > 1)
                            return [2 /*return*/, []];
                        return [4 /*yield*/, this.fetchSite("".concat(this.site, "search-live?q=").concat(encodeURIComponent(searchTerm))).then(function (r) { return r.json(); })];
                    case 1:
                        results = _a.sent();
                        return [2 /*return*/, results.map(function (novel) { return ({
                                name: novel.name,
                                path: "novel/".concat(novel.slug),
                                cover: novel.cover
                                    ? "".concat(_this.site, "uploads/novel/").concat(novel.slug, "/cover/cover_thumb.jpg")
                                    : defaultCover_1.defaultCover,
                            }); })];
                }
            });
        });
    };
    return EmpireNovel;
}());
exports.default = new EmpireNovel();
