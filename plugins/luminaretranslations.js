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
var novelStatus_1 = require("@libs/novelStatus");
var LuminareTranslationsPlugin = /** @class */ (function () {
    function LuminareTranslationsPlugin() {
        this.id = 'luminaretranslations';
        this.name = 'Luminare Translations';
        this.icon = 'src/en/luminaretranslations/icon.png';
        this.site = 'https://luminaretranslations.com';
        this.version = '1.0.0';
        this.headers = {
            Accept: 'application/json',
            Referer: 'https://luminaretranslations.com/',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
        };
        this.filters = {
            sort: {
                type: filterInputs_1.FilterTypes.Picker,
                label: 'Sort',
                value: 'popular',
                options: [
                    { label: 'Popular', value: 'popular' },
                    { label: 'Latest', value: 'latest' },
                    { label: 'Rating', value: 'rating' },
                ],
            },
            type: {
                type: filterInputs_1.FilterTypes.Picker,
                label: 'Type',
                value: '',
                options: [
                    { label: 'All', value: '' },
                    { label: 'Light Novel', value: 'light-novel' },
                    { label: 'Light Novel (alt)', value: 'light_novel' },
                    { label: 'Manga', value: 'manga' },
                ],
            },
            genres: {
                type: filterInputs_1.FilterTypes.CheckboxGroup,
                label: 'Genres',
                value: [],
                options: [
                    { label: 'Action', value: 'action' },
                    { label: 'Adaptation', value: 'adaptation' },
                    { label: 'Adventure', value: 'adventure' },
                    { label: 'Comedy', value: 'comedy' },
                    { label: 'Drama', value: 'drama' },
                    { label: 'Ecchi', value: 'ecchi' },
                    { label: 'Fantasy', value: 'fantasy' },
                    { label: 'Harem', value: 'harem' },
                    { label: 'Mature', value: 'mature' },
                    { label: 'Mystery', value: 'mystery' },
                    { label: 'Psychological', value: 'psychological' },
                    { label: 'Romance', value: 'romance' },
                    { label: 'School Life', value: 'school-life' },
                    { label: 'Seinen', value: 'seinen' },
                    { label: 'Shounen', value: 'shounen' },
                    { label: 'Slice of Life', value: 'slice-of-life' },
                    { label: 'Supernatural', value: 'supernatural' },
                    { label: 'Tragedy', value: 'tragedy' },
                ],
            },
        };
    }
    LuminareTranslationsPlugin.prototype.api = function (path) {
        return __awaiter(this, void 0, void 0, function () {
            var url, r;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = path.startsWith('http')
                            ? path
                            : this.site + '/wp-json/' + path.replace(/^\//, '');
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(url, { headers: this.headers })];
                    case 1:
                        r = _a.sent();
                        if (!r.ok) {
                            throw new Error('Could not reach site (' + r.status + ') try to open in webview.');
                        }
                        return [4 /*yield*/, r.json()];
                    case 2: return [2 /*return*/, (_a.sent())];
                }
            });
        });
    };
    LuminareTranslationsPlugin.prototype.stripHtml = function (html) {
        return (0, cheerio_1.load)('<div>' + html + '</div>')('div')
            .text()
            .trim();
    };
    LuminareTranslationsPlugin.prototype.decodeEntities = function (text) {
        return (0, cheerio_1.load)('<textarea>' + text + '</textarea>')('textarea').text();
    };
    LuminareTranslationsPlugin.prototype.toItem = function (s) {
        var cover = ('cover_image' in s && s.cover_image) ||
            ('cover_url' in s && s.cover_url) ||
            defaultCover_1.defaultCover;
        return {
            name: this.decodeEntities(s.title),
            path: 'series/' + s.slug,
            cover: cover || defaultCover_1.defaultCover,
        };
    };
    LuminareTranslationsPlugin.prototype.mapStatus = function (raw, classList) {
        var _a;
        var fromClass = (_a = (classList || [])
            .find(function (c) { return c.startsWith('series_status-'); })) === null || _a === void 0 ? void 0 : _a.replace('series_status-', '');
        var value = (raw || fromClass || '').toLowerCase();
        if (value.includes('complete') || value === 'end' || value === 'finished') {
            return novelStatus_1.NovelStatus.Completed;
        }
        if (value.includes('ongoing') || value.includes('on-going')) {
            return novelStatus_1.NovelStatus.Ongoing;
        }
        if (value.includes('hiatus') || value.includes('hold')) {
            return novelStatus_1.NovelStatus.OnHiatus;
        }
        if (value.includes('cancel') || value.includes('drop')) {
            return novelStatus_1.NovelStatus.Cancelled;
        }
        return novelStatus_1.NovelStatus.Unknown;
    };
    LuminareTranslationsPlugin.prototype.popularNovels = function (pageNo_1, _a) {
        return __awaiter(this, arguments, void 0, function (pageNo, _b) {
            var params, _i, _c, g, page;
            var _this = this;
            var _d, _e, _f;
            var showLatestNovels = _b.showLatestNovels, filters = _b.filters;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0:
                        params = new URLSearchParams();
                        params.set('page', String(pageNo));
                        params.set('per_page', '20');
                        params.set('sort', showLatestNovels ? 'latest' : ((_d = filters === null || filters === void 0 ? void 0 : filters.sort) === null || _d === void 0 ? void 0 : _d.value) || 'popular');
                        if ((_e = filters === null || filters === void 0 ? void 0 : filters.type) === null || _e === void 0 ? void 0 : _e.value)
                            params.set('type', filters.type.value);
                        for (_i = 0, _c = ((_f = filters === null || filters === void 0 ? void 0 : filters.genres) === null || _f === void 0 ? void 0 : _f.value) || []; _i < _c.length; _i++) {
                            g = _c[_i];
                            params.append('genres', g);
                        }
                        return [4 /*yield*/, this.api('yarnovel/v1/series?' + params.toString())];
                    case 1:
                        page = _g.sent();
                        return [2 /*return*/, (page.data || []).map(function (s) { return _this.toItem(s); })];
                }
            });
        });
    };
    LuminareTranslationsPlugin.prototype.searchNovels = function (searchTerm, pageNo) {
        return __awaiter(this, void 0, void 0, function () {
            var params, hits;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = new URLSearchParams();
                        params.set('q', searchTerm.trim());
                        params.set('page', String(pageNo));
                        return [4 /*yield*/, this.api('yarnovel/v1/search?' + params.toString())];
                    case 1:
                        hits = _a.sent();
                        return [2 /*return*/, (hits || []).map(function (s) { return _this.toItem(s); })];
                }
            });
        });
    };
    LuminareTranslationsPlugin.prototype.findSeriesListItem = function (slug, titleHint) {
        return __awaiter(this, void 0, void 0, function () {
            var queries, _i, queries_1, q, params, page, match, pageNo, page, match;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        queries = [
                            titleHint,
                            slug.split('-').slice(0, 4).join(' '),
                            slug.split('-').find(function (p) { return p.length > 5; }),
                        ].filter(function (q) { return !!q && q.trim().length > 2; });
                        _i = 0, queries_1 = queries;
                        _a.label = 1;
                    case 1:
                        if (!(_i < queries_1.length)) return [3 /*break*/, 4];
                        q = queries_1[_i];
                        params = new URLSearchParams();
                        params.set('search', q);
                        params.set('per_page', '50');
                        params.set('page', '1');
                        return [4 /*yield*/, this.api('yarnovel/v1/series?' + params.toString())];
                    case 2:
                        page = _a.sent();
                        match = (page.data || []).find(function (s) { return s.slug === slug; });
                        if (match)
                            return [2 /*return*/, match];
                        _a.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4:
                        pageNo = 1;
                        _a.label = 5;
                    case 5:
                        if (!(pageNo <= 10)) return [3 /*break*/, 8];
                        return [4 /*yield*/, this.api('yarnovel/v1/series?page=' + pageNo + '&per_page=50&sort=latest')];
                    case 6:
                        page = _a.sent();
                        match = (page.data || []).find(function (s) { return s.slug === slug; });
                        if (match)
                            return [2 /*return*/, match];
                        if (!page.meta || pageNo >= page.meta.total_pages)
                            return [3 /*break*/, 8];
                        _a.label = 7;
                    case 7:
                        pageNo++;
                        return [3 /*break*/, 5];
                    case 8: return [2 /*return*/, null];
                }
            });
        });
    };
    LuminareTranslationsPlugin.prototype.parseNovel = function (novelPath) {
        return __awaiter(this, void 0, void 0, function () {
            var slug, wp, series, title, summary, cover, media, _a, listItem, genres, chapters, chapterId, grouped, n, _i, _b, group, groupName, _c, _d, ch, rawTitle, name_1;
            var _e, _f, _g, _h, _j, _k, _l;
            return __generator(this, function (_m) {
                switch (_m.label) {
                    case 0:
                        slug = novelPath.replace(/^\/?series\//, '').replace(/\/$/, '');
                        return [4 /*yield*/, this.api('wp/v2/series?slug=' + encodeURIComponent(slug))];
                    case 1:
                        wp = _m.sent();
                        if (!(wp === null || wp === void 0 ? void 0 : wp.length)) {
                            throw new Error('Novel not found.');
                        }
                        series = wp[0];
                        title = this.stripHtml(((_e = series.title) === null || _e === void 0 ? void 0 : _e.rendered) || slug);
                        summary = this.stripHtml(((_f = series.content) === null || _f === void 0 ? void 0 : _f.rendered) || '') ||
                            this.stripHtml(((_g = series.excerpt) === null || _g === void 0 ? void 0 : _g.rendered) || '') ||
                            undefined;
                        cover = defaultCover_1.defaultCover;
                        if (!series.featured_media) return [3 /*break*/, 5];
                        _m.label = 2;
                    case 2:
                        _m.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, this.api('wp/v2/media/' + series.featured_media)];
                    case 3:
                        media = _m.sent();
                        if (media === null || media === void 0 ? void 0 : media.source_url)
                            cover = media.source_url;
                        return [3 /*break*/, 5];
                    case 4:
                        _a = _m.sent();
                        return [3 /*break*/, 5];
                    case 5: return [4 /*yield*/, this.findSeriesListItem(slug, title)];
                    case 6:
                        listItem = _m.sent();
                        if (listItem === null || listItem === void 0 ? void 0 : listItem.cover_image)
                            cover = listItem.cover_image;
                        genres = ((listItem === null || listItem === void 0 ? void 0 : listItem.genres) || [])
                            .map(function (g) { return g; })
                            .filter(Boolean)
                            .join(', ');
                        chapters = [];
                        chapterId = (_h = listItem === null || listItem === void 0 ? void 0 : listItem.latest_chapter) === null || _h === void 0 ? void 0 : _h.id;
                        if (!chapterId) return [3 /*break*/, 8];
                        return [4 /*yield*/, this.api('yarnovel/v1/chapters/' + chapterId + '/grouped-chapters')];
                    case 7:
                        grouped = _m.sent();
                        n = 0;
                        for (_i = 0, _b = grouped.groups || []; _i < _b.length; _i++) {
                            group = _b[_i];
                            groupName = group.slug && group.slug !== '__ungrouped__' ? group.name : '';
                            for (_c = 0, _d = group.chapters || []; _c < _d.length; _c++) {
                                ch = _d[_c];
                                n += 1;
                                rawTitle = ch.title
                                    ? this.decodeEntities(ch.title)
                                    : 'Chapter ' + ((_j = ch.number) !== null && _j !== void 0 ? _j : n);
                                name_1 = groupName ? groupName + ': ' + rawTitle : rawTitle;
                                chapters.push({
                                    name: name_1,
                                    path: 'chapter/' + ch.id,
                                    releaseTime: ch.published_at || ch.date || undefined,
                                    chapterNumber: typeof ch.number === 'number' ? ch.number : n,
                                });
                            }
                        }
                        _m.label = 8;
                    case 8: return [2 /*return*/, {
                            path: 'series/' + slug,
                            name: title,
                            cover: cover,
                            author: ((_k = series.meta) === null || _k === void 0 ? void 0 : _k.author) || (listItem === null || listItem === void 0 ? void 0 : listItem.author) || undefined,
                            artist: ((_l = series.meta) === null || _l === void 0 ? void 0 : _l.artist) || (listItem === null || listItem === void 0 ? void 0 : listItem.artist) || undefined,
                            summary: summary,
                            genres: genres || undefined,
                            status: this.mapStatus(listItem === null || listItem === void 0 ? void 0 : listItem.status, series.class_list),
                            rating: (listItem === null || listItem === void 0 ? void 0 : listItem.rating) || undefined,
                            chapters: chapters,
                        }];
                }
            });
        });
    };
    LuminareTranslationsPlugin.prototype.parseChapter = function (chapterPath) {
        return __awaiter(this, void 0, void 0, function () {
            var id, res, chapter, html, pages, hasImg, $;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        id = chapterPath.replace(/^\/?chapter\//, '').replace(/\/$/, '');
                        return [4 /*yield*/, this.api('yarnovel/v1/chapters/' + id)];
                    case 1:
                        res = _a.sent();
                        chapter = res.data;
                        html = chapter.content || '';
                        pages = chapter.pages || [];
                        if (pages.length) {
                            hasImg = /<img[\s>]/i.test(html);
                            if (!hasImg) {
                                html += pages.map(function (src) { return '<img src="' + src + '" />'; }).join('') || '';
                            }
                        }
                        if (!html.trim()) {
                            return [2 /*return*/, '<p>This chapter is empty or locked.</p>'];
                        }
                        $ = (0, cheerio_1.load)(html);
                        $('script, style, noscript').remove();
                        $('img').each(function (_, el) {
                            var img = $(el);
                            var src = img.attr('src') || img.attr('data-src') || '';
                            if (src.startsWith('/'))
                                img.attr('src', _this.site + src);
                            else if (src)
                                img.attr('src', src);
                        });
                        return [2 /*return*/, $.root().html() || html];
                }
            });
        });
    };
    LuminareTranslationsPlugin.prototype.resolveUrl = function (path, isNovel) {
        var clean = path.replace(/^\//, '');
        if (clean.startsWith('chapter/')) {
            var id = clean.replace(/^chapter\//, '').replace(/\/$/, '');
            return this.site + '/?p=' + id;
        }
        if (clean.startsWith('series/')) {
            return this.site + '/' + clean.replace(/\/$/, '');
        }
        return this.site + (isNovel ? '/series/' : '/') + clean;
    };
    return LuminareTranslationsPlugin;
}());
exports.default = new LuminareTranslationsPlugin();
