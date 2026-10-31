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
var novelStatus_1 = require("@libs/novelStatus");
var defaultCover_1 = require("@libs/defaultCover");
var IndraTranslations = /** @class */ (function () {
    function IndraTranslations() {
        this.id = 'indratranslations';
        this.name = 'Indra Translations';
        this.site = 'https://indratranslations.com';
        this.version = '1.3.0';
        this.icon = 'src/en/indratranslations/icon.png';
        // Browser-like headers (important for Cloudflare-y sites)
        this.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36',
            Referer: this.site,
            Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.9',
            'Cache-Control': 'no-cache',
            Pragma: 'no-cache',
        };
        this.filters = {
            orderby: {
                label: 'Sort',
                value: 'new',
                options: [
                    { label: 'Newest', value: 'new' },
                    { label: 'Recently Updated', value: 'update' },
                    { label: 'Most Viewed', value: 'views' },
                    { label: 'Highest Rated', value: 'rating' },
                    { label: 'Most Chapters', value: 'chapters' },
                    { label: 'Most Nominated', value: 'nominate' },
                ],
                type: filterInputs_1.FilterTypes.Picker,
            },
            genre: {
                label: 'Genre',
                value: '',
                options: [
                    { label: 'All', value: '' },
                    { label: 'Action', value: '51' },
                    { label: 'Adventure', value: '52' },
                    { label: 'Fantasy', value: '10' },
                    { label: 'Harem', value: '53' },
                    { label: 'Horror', value: '16' },
                    { label: 'Mature', value: '33' },
                    { label: 'Martial Arts', value: '63' },
                    { label: 'Mystery', value: '35' },
                    { label: 'Psychological', value: '54' },
                    { label: 'Romance', value: '74' },
                    { label: 'School Life', value: '29' },
                    { label: 'Sci-fi', value: '36' },
                    { label: 'Shounen', value: '70' },
                    { label: 'Slice of Life', value: '30' },
                    { label: 'Supernatural', value: '55' },
                ],
                type: filterInputs_1.FilterTypes.Picker,
            },
            status: {
                label: 'Status',
                value: '',
                options: [
                    { label: 'All', value: '' },
                    { label: 'Completed', value: 'completed' },
                    { label: 'Dropped', value: 'dropped' },
                    { label: 'Ongoing', value: 'ongoing' },
                ],
                type: filterInputs_1.FilterTypes.Picker,
            },
            type: {
                label: 'Type',
                value: '',
                options: [
                    { label: 'All', value: '' },
                    { label: 'Short Story', value: 'short' },
                    { label: 'Long Story', value: 'long' },
                ],
                type: filterInputs_1.FilterTypes.Picker,
            },
        };
    }
    IndraTranslations.prototype.fetchHtml = function (url) {
        return __awaiter(this, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, fetch_1.fetchApi)(url, { headers: this.headers })];
                    case 1:
                        res = _a.sent();
                        return [4 /*yield*/, res.text()];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    IndraTranslations.prototype.absolute = function (url) {
        if (!url)
            return undefined;
        var u = String(url).trim();
        if (!u)
            return undefined;
        if (u.startsWith('http'))
            return u;
        if (u.startsWith('//'))
            return 'https:' + u;
        if (u.startsWith('/'))
            return this.site + u;
        return this.site + '/' + u;
    };
    IndraTranslations.prototype.relative = function (url) {
        return url.replace(/^https?:\/\/(www\.)?indratranslations\.com(?=[/?#]|$)/, '');
    };
    IndraTranslations.prototype.clean = function (text) {
        return String(text !== null && text !== void 0 ? text : '')
            .replace(/\s+/g, ' ')
            .trim();
    };
    IndraTranslations.prototype.chapterNum = function (name) {
        var m = String(name).match(/(\d+(\.\d+)?)/);
        return m ? Number(m[1]) : 0;
    };
    /**
     * The series listing renders each novel as a clickable div
     * (`onclick="location.href='…'"`) rather than an anchor.
     */
    IndraTranslations.prototype.parseNovelCards = function ($) {
        var _this = this;
        var novels = [];
        $('.series-grid .series-card').each(function (_, el) {
            var _a;
            var card = $(el);
            var href = ((_a = (card.attr('onclick') || '').match(/location\.href\s*=\s*'([^']+)'/)) === null || _a === void 0 ? void 0 : _a[1]) || card.find('a[href]').first().attr('href');
            if (!href)
                return;
            var name = _this.clean(card.find('.series-card-title').attr('title')) ||
                _this.clean(card.find('.series-card-title').text()) ||
                _this.clean(card.find('img').attr('alt'));
            if (!name)
                return;
            var img = card.find('.series-card-cover img');
            var cover = _this.absolute(img.attr('data-src') || img.attr('data-lazy-src') || img.attr('src'));
            novels.push({
                name: name,
                path: _this.relative(href),
                cover: cover || defaultCover_1.defaultCover,
            });
        });
        return novels;
    };
    IndraTranslations.prototype.seriesUrl = function (pageNo, params) {
        var query = Object.keys(params)
            .filter(function (key) { return params[key]; })
            .map(function (key) { return "".concat(key, "=").concat(encodeURIComponent(params[key])); })
            .join('&');
        var base = pageNo > 1
            ? "".concat(this.site, "/series/page/").concat(pageNo, "/")
            : "".concat(this.site, "/series/");
        return query ? "".concat(base, "?").concat(query) : base;
    };
    IndraTranslations.prototype.popularNovels = function (pageNo_1, _a) {
        return __awaiter(this, arguments, void 0, function (pageNo, _b) {
            var url, $, _c;
            var showLatestNovels = _b.showLatestNovels, filters = _b.filters;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        url = this.seriesUrl(pageNo, {
                            orderby: showLatestNovels ? 'update' : filters.orderby.value,
                            genre: filters.genre.value,
                            status: filters.status.value,
                            type: filters.type.value,
                        });
                        _c = cheerio_1.load;
                        return [4 /*yield*/, this.fetchHtml(url)];
                    case 1:
                        $ = _c.apply(void 0, [_d.sent()]);
                        return [2 /*return*/, this.parseNovelCards($)];
                }
            });
        });
    };
    IndraTranslations.prototype.searchNovels = function (searchTerm, pageNo) {
        return __awaiter(this, void 0, void 0, function () {
            var url, $, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        url = this.seriesUrl(pageNo, { keyword: searchTerm });
                        _a = cheerio_1.load;
                        return [4 /*yield*/, this.fetchHtml(url)];
                    case 1:
                        $ = _a.apply(void 0, [_b.sent()]);
                        return [2 /*return*/, this.parseNovelCards($)];
                }
            });
        });
    };
    IndraTranslations.prototype.parseNovel = function (novelPath) {
        return __awaiter(this, void 0, void 0, function () {
            var sitePath, url, html, $, name, img, cover, summary, genres, statusText, status;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sitePath = this.relative(novelPath).replace(/^\/series\/([^/?#]+)\/?(?:[?#].*)?$/, '/$1/');
                        url = sitePath.startsWith('http') ? sitePath : this.site + sitePath;
                        return [4 /*yield*/, this.fetchHtml(url)];
                    case 1:
                        html = _a.sent();
                        $ = (0, cheerio_1.load)(html);
                        name = this.clean($('h1.story-main-title').text()) ||
                            this.clean($('h1').first().text()) ||
                            'Untitled';
                        img = $('.story-cover-card img').first();
                        cover = this.absolute(img.attr('data-src') || img.attr('data-lazy-src') || img.attr('src')) || defaultCover_1.defaultCover;
                        summary = $('#story-synopsis p')
                            .map(function (_, el) { return _this.clean($(el).text()); })
                            .get()
                            .filter(Boolean)
                            .join('\n\n');
                        genres = $('.story-meta-list a[href*="/series-genre/"]')
                            .map(function (_, el) { return _this.clean($(el).text()); })
                            .get()
                            .join(', ');
                        statusText = this.clean($('.story-meta-list a[href*="/trang-thai/"]').first().text()).toLowerCase();
                        status = novelStatus_1.NovelStatus.Unknown;
                        if (statusText.includes('complete'))
                            status = novelStatus_1.NovelStatus.Completed;
                        else if (statusText.includes('ongoing'))
                            status = novelStatus_1.NovelStatus.Ongoing;
                        else if (statusText.includes('drop'))
                            status = novelStatus_1.NovelStatus.Cancelled;
                        else if (statusText.includes('hiatus'))
                            status = novelStatus_1.NovelStatus.OnHiatus;
                        return [2 /*return*/, {
                                name: name,
                                path: novelPath.endsWith('/') || /[?#]/.test(novelPath)
                                    ? novelPath
                                    : novelPath + '/',
                                cover: cover,
                                summary: summary || this.clean($('#story-synopsis').text()) || undefined,
                                genres: genres || undefined,
                                status: status,
                                chapters: this.parseChapterList($, html),
                            }];
                }
            });
        });
    };
    /**
     * The page only renders the newest 100 chapters; the complete list
     * (oldest first) is embedded as the `TD_Story_Chapters` JSON array.
     */
    IndraTranslations.prototype.parseChapterList = function ($, html) {
        var _this = this;
        var _a;
        var json = (_a = html.match(/TD_Story_Chapters\s*=\s*(\[.*\]);/)) === null || _a === void 0 ? void 0 : _a[1];
        if (json) {
            try {
                var list = JSON.parse(json);
                return list
                    .filter(function (chap) { return chap.link; })
                    .map(function (chap) {
                    var title = _this.clean(chap.title);
                    return {
                        name: (Number(chap.vip) === 1 ? '🔒 ' : '') + title,
                        path: _this.relative(String(chap.link)),
                        releaseTime: chap.date || undefined,
                        chapterNumber: Number(chap.num) || _this.chapterNum(title),
                    };
                });
            }
            catch (_b) {
                // fall back to the rendered list below
            }
        }
        var chapters = [];
        $('#chapter-list-container .chapter-item-wrapper a[href]').each(function (_, el) {
            var name = _this.clean($(el).find('.text-truncate').first().text());
            chapters.push({
                name: ($(el).find('.chap-price-badge').length ? '🔒 ' : '') + name,
                path: _this.relative($(el).attr('href') || ''),
                chapterNumber: _this.chapterNum(name),
            });
        });
        return chapters.reverse();
    };
    IndraTranslations.prototype.parseChapter = function (chapterPath) {
        return __awaiter(this, void 0, void 0, function () {
            var url, $, _a, content, flow, paragraphs;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        url = chapterPath.startsWith('http')
                            ? chapterPath
                            : this.site + chapterPath;
                        _a = cheerio_1.load;
                        return [4 /*yield*/, this.fetchHtml(url)];
                    case 1:
                        $ = _a.apply(void 0, [_c.sent()]);
                        content = $('#chapter-content-text').first().length
                            ? $('#chapter-content-text').first()
                            : $('.chapter-content').first();
                        if (!content.length) {
                            return [2 /*return*/, "\nUnable to load chapter content.\n\n"];
                        }
                        // Anti-scraping decoys that the site only hides with CSS.
                        content
                            .find('script, style, ins, iframe, noscript, .td-copy-honeypot, .td-ad-container, ' +
                            '.td-s-noise, .td-s-para-noise, .td-hidden-watermark, .td-canary-trap')
                            .remove();
                        flow = content.find('.td-reading-flow').first();
                        if (flow.length) {
                            paragraphs = flow
                                .children()
                                .toArray()
                                .map(function (el, index) { return ({
                                el: el,
                                index: index,
                                order: parseFloat($(el).attr('data-order') || '') || 0,
                            }); })
                                .sort(function (a, b) { return a.order - b.order || a.index - b.index; });
                            return [2 /*return*/, paragraphs
                                    .map(function (_a) {
                                    var el = _a.el;
                                    $(el).removeAttr('style').removeAttr('data-order');
                                    return $.html(el);
                                })
                                    .join('\n')];
                        }
                        return [2 /*return*/, (_b = content.html()) !== null && _b !== void 0 ? _b : ''];
                }
            });
        });
    };
    return IndraTranslations;
}());
exports.default = new IndraTranslations();
