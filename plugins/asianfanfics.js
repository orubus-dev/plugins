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
var AsianFanfics = /** @class */ (function () {
    function AsianFanfics() {
        var _this = this;
        this.id = 'asianfanfics';
        this.name = 'Asianfanfics';
        this.version = '1.0.0';
        this.icon = 'src/en/asianfanfics/icon.png';
        this.site = 'https://www.asianfanfics.com/';
        this.resolveUrl = function (path) { return _this.site + path; };
        this.filters = {
            sort: {
                label: 'Sort',
                value: 'trending',
                options: [
                    { label: 'Trending', value: 'trending' },
                    { label: 'Latest', value: 'latest' },
                    { label: 'Newest', value: 'newest' },
                    { label: 'Completed', value: 'completed' },
                    { label: 'One Shots', value: 'one-shots' },
                    { label: 'Featured', value: 'featured' },
                    { label: 'Views', value: 'views' },
                    { label: 'Subscriptions', value: 'favorited' },
                    { label: 'Commented', value: 'commented' },
                ],
                type: filterInputs_1.FilterTypes.Picker,
            },
            language: {
                label: 'Language',
                value: '',
                options: [
                    { label: 'All languages', value: '' },
                    { label: 'Arabic', value: 'ar' },
                    { label: 'Chinese', value: 'zh' },
                    { label: 'English', value: 'en' },
                    { label: 'French', value: 'fr' },
                    { label: 'German', value: 'de' },
                    { label: 'Indonesian', value: 'id' },
                    { label: 'Japanese', value: 'ja' },
                    { label: 'Korean', value: 'ko' },
                    { label: 'Malay', value: 'ms' },
                    { label: 'Portuguese', value: 'pt' },
                    { label: 'Russian', value: 'ru' },
                    { label: 'Spanish', value: 'es' },
                    { label: 'Tagalog / Filipino', value: 'tl' },
                    { label: 'Thai', value: 'th' },
                    { label: 'Vietnamese', value: 'vi' },
                ],
                type: filterInputs_1.FilterTypes.Picker,
            },
        };
    }
    // Listings, story details and chapter text are HTMX fragments that the
    // pages load after render; fetch those fragments directly.
    AsianFanfics.prototype.fetchHtml = function (url, referer) {
        return __awaiter(this, void 0, void 0, function () {
            var res, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, (0, fetch_1.fetchApi)(url, {
                            headers: referer ? { Referer: referer } : undefined,
                        })];
                    case 1:
                        res = _b.sent();
                        if (!res.ok) {
                            // Keep the status and response on the error so an anti-bot block is
                            // reported as such rather than as a parsing failure.
                            throw Object.assign(new Error("Could not reach ".concat(url, " (").concat(res.status, ")")), {
                                status: res.status,
                                response: res,
                            });
                        }
                        _a = cheerio_1.load;
                        return [4 /*yield*/, res.text()];
                    case 2: return [2 /*return*/, _a.apply(void 0, [_b.sent()])];
                }
            });
        });
    };
    AsianFanfics.prototype.parseNovels = function ($) {
        var novels = [];
        $('article').each(function (_, ele) {
            var link = $(ele).find('h3 a[href*="/story/view/"]').first();
            var href = link.attr('href');
            if (!href)
                return;
            novels.push({
                name: link.text().trim(),
                path: href.replace(/^\//, ''),
                cover: $(ele).find('img').first().attr('src') || defaultCover_1.defaultCover,
            });
        });
        return novels;
    };
    AsianFanfics.prototype.popularNovels = function (page_1, _a) {
        return __awaiter(this, arguments, void 0, function (page, _b) {
            var sort, params, $;
            var showLatestNovels = _b.showLatestNovels, filters = _b.filters;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        sort = showLatestNovels ? 'latest' : filters.sort.value;
                        params = new URLSearchParams({ page: page.toString() });
                        if (filters.language.value) {
                            params.set('language', filters.language.value);
                        }
                        return [4 /*yield*/, this.fetchHtml("".concat(this.site, "htmx/browse/en/").concat(sort, "?").concat(params.toString()))];
                    case 1:
                        $ = _c.sent();
                        return [2 /*return*/, this.parseNovels($)];
                }
            });
        });
    };
    AsianFanfics.prototype.parseNovel = function (novelPath) {
        return __awaiter(this, void 0, void 0, function () {
            var url, $, header, novel, descriptionPath, description, chapters, seen;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = this.site + novelPath;
                        return [4 /*yield*/, this.fetchHtml(url)];
                    case 1:
                        $ = _a.sent();
                        header = $('main header').first();
                        header.find('h1 span').remove();
                        novel = {
                            path: novelPath,
                            name: header.find('h1').text().trim() || 'Untitled',
                            cover: header.find('img').first().attr('src') || defaultCover_1.defaultCover,
                            author: header.find('a[href^="/profile/"]').first().text().trim(),
                            genres: header
                                .find('a[href^="/browse/tag/"]')
                                .map(function (_, ele) { return $(ele).text().trim(); })
                                .get()
                                .join(', '),
                            status: header
                                .find('span')
                                .toArray()
                                .some(function (ele) { return $(ele).text().trim().toLowerCase() === 'completed'; })
                                ? novelStatus_1.NovelStatus.Completed
                                : novelStatus_1.NovelStatus.Ongoing,
                        };
                        descriptionPath = $('#bodyText [hx-get^="/htmx/story/"]').attr('hx-get');
                        if (!descriptionPath) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.fetchHtml(this.site + descriptionPath.replace(/^\//, ''), url)];
                    case 2:
                        description = _a.sent();
                        novel.summary = description('#story-description').text().trim();
                        _a.label = 3;
                    case 3:
                        chapters = [];
                        seen = new Set();
                        $('a[data-toc-chapter]:not([data-toc-chapter="0"])').each(function (_, ele) {
                            var href = $(ele).attr('href');
                            if (!href || seen.has(href))
                                return;
                            seen.add(href);
                            chapters.push({
                                name: $(ele).find('span.truncate').text().trim(),
                                path: href.replace(/^\//, ''),
                                chapterNumber: parseInt($(ele).find('span').first().text().trim(), 10) ||
                                    chapters.length + 1,
                            });
                        });
                        novel.chapters = chapters;
                        return [2 /*return*/, novel];
                }
            });
        });
    };
    AsianFanfics.prototype.parseChapter = function (chapterPath) {
        return __awaiter(this, void 0, void 0, function () {
            var url, $, body, contentPath, chapter, notice, message, html, teaserPath, teaser, teaserHtml;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = this.site + chapterPath;
                        return [4 /*yield*/, this.fetchHtml(url)];
                    case 1:
                        $ = _a.sent();
                        body = $('#bodyText');
                        contentPath = body
                            .find('[hx-get^="/htmx/chapter/"]')
                            .first()
                            .attr('hx-get');
                        if (!contentPath) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.fetchHtml(this.site + contentPath.replace(/^\//, ''), url)];
                    case 2:
                        chapter = _a.sent();
                        return [2 /*return*/, this.cleanHtml(chapter)];
                    case 3:
                        notice = body.find('div.border-dashed:not(#content-load-error)').first().text() ||
                            'This chapter is not publicly available.';
                        message = (0, cheerio_1.load)('<p><strong></strong></p>');
                        message('strong').text("".concat(notice.trim(), " This chapter requires an Asianfanfics account and cannot be read in this plugin."));
                        html = message('body').html() || '';
                        teaserPath = body
                            .find('[hx-get^="/htmx/teaser/"]')
                            .first()
                            .attr('hx-get');
                        if (!teaserPath) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.fetchHtml(this.site + teaserPath.replace(/^\//, ''), url)];
                    case 4:
                        teaser = _a.sent();
                        teaserHtml = this.cleanHtml(teaser);
                        if (teaserHtml.trim()) {
                            html += "<p><em>Teaser:</em></p>".concat(teaserHtml);
                        }
                        _a.label = 5;
                    case 5: return [2 /*return*/, html];
                }
            });
        });
    };
    // Returns the fragment's chapter body without scripts, stylesheets, inline
    // styles, event handlers or javascript: URLs. The body is author-written, so
    // inline styles could otherwise lay content over the reader.
    AsianFanfics.prototype.cleanHtml = function ($) {
        var content = $('#user-submitted-body');
        content
            .find('script, style, link, meta, iframe, object, embed, form')
            .remove();
        content.find('[style]').removeAttr('style');
        content.find('*').each(function (_, ele) {
            if (ele.type !== 'tag')
                return;
            for (var _i = 0, _a = Object.keys(ele.attribs); _i < _a.length; _i++) {
                var name_1 = _a[_i];
                var value = ele.attribs[name_1].trim().toLowerCase();
                if (name_1.toLowerCase().startsWith('on') ||
                    value.startsWith('javascript:')) {
                    $(ele).removeAttr(name_1);
                }
            }
        });
        return content.html() || '';
    };
    AsianFanfics.prototype.searchNovels = function (searchTerm, page) {
        return __awaiter(this, void 0, void 0, function () {
            var params, $;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = new URLSearchParams({
                            q: searchTerm,
                            page: page.toString(),
                        });
                        return [4 /*yield*/, this.fetchHtml("".concat(this.site, "htmx/browse/search?").concat(params.toString()), "".concat(this.site, "browse/search?").concat(params.toString()))];
                    case 1:
                        $ = _a.sent();
                        return [2 /*return*/, this.parseNovels($)];
                }
            });
        });
    };
    return AsianFanfics;
}());
exports.default = new AsianFanfics();
