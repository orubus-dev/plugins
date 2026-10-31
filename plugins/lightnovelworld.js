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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LightNovelWorldPlugin = void 0;
var fetch_1 = require("@libs/fetch");
var cheerio_1 = require("cheerio");
var novelStatus_1 = require("@libs/novelStatus");
var filterInputs_1 = require("@libs/filterInputs");
var STATUS_MAP = {
    'ongoing': novelStatus_1.NovelStatus.Ongoing,
    'completed': novelStatus_1.NovelStatus.Completed,
    'complete': novelStatus_1.NovelStatus.Completed,
    'hiatus': novelStatus_1.NovelStatus.OnHiatus,
    'paused': novelStatus_1.NovelStatus.OnHiatus,
};
var LightNovelWorldPlugin = /** @class */ (function () {
    function LightNovelWorldPlugin() {
        this.id = "lightnovelworld";
        this.name = "LightNovelWorld";
        this.icon = "src/en/lightnovelworld/icon.png";
        this.site = "https://lightnovelworld.org/";
        this.version = "1.0.2";
        this.filters = {
            sort: {
                label: 'Sort By',
                value: 'rank',
                options: [
                    { label: 'Rank', value: 'rank' },
                    { label: 'Popular', value: 'popular' },
                    { label: 'Rating', value: 'rating' },
                    { label: 'Bookmarks', value: 'bookmarks' },
                    { label: 'Views', value: 'views' },
                    { label: 'Chapters', value: 'chapters' },
                    { label: 'New', value: 'new' },
                ],
                type: filterInputs_1.FilterTypes.Picker,
            },
            order: {
                label: 'Order',
                value: 'desc',
                options: [
                    { label: 'Descending', value: 'desc' },
                    { label: 'Ascending', value: 'asc' },
                ],
                type: filterInputs_1.FilterTypes.Picker,
            },
            status: {
                label: 'Status',
                value: [],
                options: [
                    { label: 'Ongoing', value: 'ongoing' },
                    { label: 'Completed', value: 'completed' },
                    { label: 'Hiatus', value: 'hiatus' },
                ],
                type: filterInputs_1.FilterTypes.CheckboxGroup,
            },
            genre_logic: {
                label: 'Genre Logic',
                value: 'AND',
                options: [
                    { label: 'AND', value: 'AND' },
                    { label: 'OR', value: 'OR' },
                ],
                type: filterInputs_1.FilterTypes.Picker,
            },
            genres: {
                label: 'Genres',
                value: { include: [], exclude: [] },
                options: [
                    { label: 'Action', value: 'Action' },
                    { label: 'Adult', value: 'Adult' },
                    { label: 'Adventure', value: 'Adventure' },
                    { label: 'Comedy', value: 'Comedy' },
                    { label: 'Drama', value: 'Drama' },
                    { label: 'Eastern', value: 'Eastern' },
                    { label: 'Ecchi', value: 'Ecchi' },
                    { label: 'Fan-Fiction', value: 'Fan-Fiction' },
                    { label: 'Fantasy', value: 'Fantasy' },
                    { label: 'Game', value: 'Game' },
                    { label: 'Gender-Bender', value: 'Gender-Bender' },
                    { label: 'Harem', value: 'Harem' },
                    { label: 'Historical', value: 'Historical' },
                    { label: 'Horror', value: 'Horror' },
                    { label: 'Isekai', value: 'Isekai' },
                    { label: 'Josei', value: 'Josei' },
                    { label: 'LGBT+', value: 'LGBT+' },
                    { label: 'Magic', value: 'Magic' },
                    { label: 'Magical Realism', value: 'Magical-Realism' },
                    { label: 'Martial Arts', value: 'Martial-Arts' },
                    { label: 'Mature', value: 'Mature' },
                    { label: 'Mecha', value: 'Mecha' },
                    { label: 'Mystery', value: 'Mystery' },
                    { label: 'Psychological', value: 'Psychological' },
                    { label: 'Romance', value: 'Romance' },
                    { label: 'School-Life', value: 'School-Life' },
                    { label: 'Sci-Fi', value: 'Sci-Fi' },
                    { label: 'Seinen', value: 'Seinen' },
                    { label: 'Shoujo', value: 'Shoujo' },
                    { label: 'Shounen', value: 'Shounen' },
                    { label: 'Slice of Life', value: 'Slice-of-Life' },
                    { label: 'Sports', value: 'Sports' },
                    { label: 'Supernatural', value: 'Supernatural' },
                    { label: 'Thriller', value: 'Thriller' },
                    { label: 'Tragedy', value: 'Tragedy' },
                    { label: 'Wuxia', value: 'Wuxia' },
                    { label: 'Xianxia', value: 'Xianxia' },
                    { label: 'Xuanhuan', value: 'Xuanhuan' },
                    { label: 'Yaoi', value: 'Yaoi' },
                    { label: 'Yuri', value: 'Yuri' },
                ],
                type: filterInputs_1.FilterTypes.ExcludableCheckboxGroup,
            },
            tags_include: {
                label: 'Include Tags',
                value: '',
                type: filterInputs_1.FilterTypes.TextInput,
            },
            tags_exclude: {
                label: 'Exclude Tags',
                value: '',
                type: filterInputs_1.FilterTypes.TextInput,
            },
            chapter_range: {
                label: 'Chapter Count',
                value: 'all',
                options: [
                    { label: 'All', value: 'all' },
                    { label: '<50', value: '<50' },
                    { label: '50-100', value: '50-100' },
                    { label: '100-500', value: '100-500' },
                    { label: '500-1000', value: '500-1000' },
                    { label: '>1000', value: '>1000' },
                ],
                type: filterInputs_1.FilterTypes.Picker,
            },
        };
    }
    LightNovelWorldPlugin.prototype.popularNovels = function (pageNo_1, _a) {
        return __awaiter(this, arguments, void 0, function (pageNo, _b) {
            var params, _i, _c, genre, _d, _e, genre, _f, _g, s, url, html;
            var _h, _j;
            var showLatestNovels = _b.showLatestNovels, filters = _b.filters;
            return __generator(this, function (_k) {
                switch (_k.label) {
                    case 0:
                        params = new URLSearchParams();
                        for (_i = 0, _c = (_h = filters.genres.value.include) !== null && _h !== void 0 ? _h : []; _i < _c.length; _i++) {
                            genre = _c[_i];
                            params.append('genres_include', genre);
                        }
                        for (_d = 0, _e = (_j = filters.genres.value.exclude) !== null && _j !== void 0 ? _j : []; _d < _e.length; _d++) {
                            genre = _e[_d];
                            params.append('genres_exclude', genre);
                        }
                        if (filters.genre_logic.value !== 'AND') {
                            params.set('genre_logic', filters.genre_logic.value);
                        }
                        if (filters.tags_include.value) {
                            params.set('tags_include', filters.tags_include.value);
                        }
                        if (filters.tags_exclude.value) {
                            params.set('tags_exclude', filters.tags_exclude.value);
                        }
                        if (filters.chapter_range.value !== 'all') {
                            params.set('chapter_range', filters.chapter_range.value);
                        }
                        for (_f = 0, _g = filters.status.value; _f < _g.length; _f++) {
                            s = _g[_f];
                            params.append('status', s);
                        }
                        if (showLatestNovels) {
                            params.set('sort', 'new');
                        }
                        else if (filters.sort.value !== 'rank') {
                            params.set('sort', filters.sort.value);
                        }
                        if (filters.order.value !== 'asc') {
                            params.set('order', filters.order.value);
                        }
                        if (pageNo > 1) {
                            params.set('page', pageNo.toString());
                        }
                        url = "".concat(this.site, "advanced-search/?").concat(params.toString());
                        return [4 /*yield*/, (0, fetch_1.fetchText)(url)];
                    case 1:
                        html = _k.sent();
                        return [2 /*return*/, this.parseNovelList(html)];
                }
            });
        });
    };
    LightNovelWorldPlugin.prototype.fetchAllChapters = function (slug) {
        return __awaiter(this, void 0, void 0, function () {
            var LIMIT, apiBase, firstRes, firstJson, total, offsets, offset, remainingResults, rawChapters;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        LIMIT = 500;
                        apiBase = "".concat(this.site, "api/novel/").concat(slug, "/chapters/?limit=").concat(LIMIT);
                        return [4 /*yield*/, (0, fetch_1.fetchApi)("".concat(apiBase, "&offset=0"))];
                    case 1:
                        firstRes = _a.sent();
                        if (!firstRes.ok) {
                            throw new Error("Failed to fetch chapters (HTTP ".concat(firstRes.status, ")"));
                        }
                        return [4 /*yield*/, firstRes.json()];
                    case 2:
                        firstJson = (_a.sent());
                        total = firstJson.total_chapters;
                        offsets = [];
                        for (offset = LIMIT; offset < total; offset += LIMIT) {
                            offsets.push(offset);
                        }
                        return [4 /*yield*/, Promise.all(offsets.map(function (offset) { return __awaiter(_this, void 0, void 0, function () {
                                var res, json;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, (0, fetch_1.fetchApi)("".concat(apiBase, "&offset=").concat(offset))];
                                        case 1:
                                            res = _a.sent();
                                            if (!res.ok) {
                                                throw new Error("Failed to fetch chapters page ".concat(offset, " (HTTP ").concat(res.status, ")"));
                                            }
                                            return [4 /*yield*/, res.json()];
                                        case 2:
                                            json = (_a.sent());
                                            return [2 /*return*/, json.chapters || []];
                                    }
                                });
                            }); }))];
                    case 3:
                        remainingResults = _a.sent();
                        rawChapters = __spreadArray(__spreadArray([], (firstJson.chapters || []), true), remainingResults.flat(), true);
                        return [2 /*return*/, rawChapters
                                .map(function (ch) { return ({
                                name: (ch.title || "Chapter ".concat(ch.number)).trim(),
                                path: "novel/".concat(slug, "/chapter/").concat(ch.number, "/"),
                                chapterNumber: ch.number,
                            }); })
                                .sort(function (a, b) { return (a.chapterNumber || 0) - (b.chapterNumber || 0); })];
                }
            });
        });
    };
    LightNovelWorldPlugin.prototype.parseNovel = function (novelPath) {
        return __awaiter(this, void 0, void 0, function () {
            var html, $, title, $cover, rawCover, cover, summary, author, rawStatus, status, genres, slug, chapters;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, fetch_1.fetchText)("".concat(this.site).concat(novelPath))];
                    case 1:
                        html = _a.sent();
                        $ = (0, cheerio_1.load)(html);
                        title = $('.novel-title').text().trim() || 'Untitled Novel';
                        $cover = $('.novel-cover');
                        rawCover = $cover.attr('src') || '';
                        cover = rawCover ? "".concat(this.site).concat(rawCover.replace(/^\//, '')) : '';
                        summary = $('.summary-content').text().trim();
                        author = $('.author-link').text().trim() || 'Unknown Author';
                        rawStatus = $('.status-badge').text().trim().toLowerCase();
                        status = STATUS_MAP[rawStatus] || novelStatus_1.NovelStatus.Unknown;
                        genres = $('.genre-tag').map(function (_, el) { return $(el).text().trim(); }).get().join(', ');
                        slug = novelPath.replace(/^\/?novel\/|\/$/g, '');
                        chapters = [];
                        if (!slug) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.fetchAllChapters(slug)];
                    case 2:
                        chapters = _a.sent();
                        _a.label = 3;
                    case 3: return [2 /*return*/, {
                            path: novelPath,
                            name: title,
                            cover: cover,
                            summary: summary,
                            author: author,
                            status: status,
                            genres: genres,
                            chapters: chapters,
                        }];
                }
            });
        });
    };
    LightNovelWorldPlugin.prototype.parseChapter = function (chapterPath) {
        return __awaiter(this, void 0, void 0, function () {
            var url, res, html, $, container, content;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        url = "".concat(this.site).concat(chapterPath);
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(url)];
                    case 1:
                        res = _b.sent();
                        if (!res.ok) {
                            throw new Error("Could not load chapter (HTTP ".concat(res.status, ")"));
                        }
                        return [4 /*yield*/, res.text()];
                    case 2:
                        html = _b.sent();
                        $ = (0, cheerio_1.load)(html);
                        container = $('#chapterText');
                        if (!container.length) {
                            throw new Error('Could not load chapter');
                        }
                        container
                            .find('script, style, ins, iframe, .ads, .ad-container, .watermark')
                            .remove();
                        container.find('[style]').removeAttr('style');
                        content = ((_a = container.html()) === null || _a === void 0 ? void 0 : _a.trim()) || '';
                        if (!content) {
                            throw new Error('Could not load chapter');
                        }
                        return [2 /*return*/, content];
                }
            });
        });
    };
    LightNovelWorldPlugin.prototype.searchNovels = function (searchTerm, pageNo) {
        return __awaiter(this, void 0, void 0, function () {
            var url, res, json, _a;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!(searchTerm === null || searchTerm === void 0 ? void 0 : searchTerm.trim()) || pageNo > 1)
                            return [2 /*return*/, []];
                        url = "".concat(this.site, "api/search/?q=").concat(encodeURIComponent(searchTerm), "&search_type=title");
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(url)];
                    case 2:
                        res = _b.sent();
                        return [4 /*yield*/, res.json()];
                    case 3:
                        json = (_b.sent());
                        if (!(json === null || json === void 0 ? void 0 : json.novels) || !Array.isArray(json.novels)) {
                            return [2 /*return*/, []];
                        }
                        return [2 /*return*/, json.novels
                                .filter(function (item) { return !!item.slug && !!item.title; })
                                .map(function (item) {
                                var rawCover = item.cover_path || '';
                                var cover = rawCover ? "".concat(_this.site).concat(rawCover.replace(/^\//, '')) : '';
                                return {
                                    name: item.title,
                                    cover: cover,
                                    path: "novel/".concat(item.slug, "/"),
                                };
                            })];
                    case 4:
                        _a = _b.sent();
                        return [2 /*return*/, []];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    LightNovelWorldPlugin.prototype.parseNovelList = function (html) {
        var _this = this;
        var $ = (0, cheerio_1.load)(html);
        var novels = [];
        var seen = new Set();
        $('.card-cover-link').each(function (_, el) {
            var _a;
            var item = $(el);
            var rawPath = item.attr('href') || '';
            if (!rawPath)
                return;
            var rawCover = item.find('img');
            var name = ((_a = rawCover.attr('alt')) === null || _a === void 0 ? void 0 : _a.trim()) || '';
            var imgEl = rawCover.attr('src') || '';
            if (name && rawPath) {
                var cleanPath = rawPath.replace(/^\//, '');
                if (!cleanPath.endsWith('/'))
                    cleanPath += '/';
                if (seen.has(cleanPath))
                    return;
                seen.add(cleanPath);
                var cover = imgEl ? "".concat(_this.site).concat(imgEl.replace(/^\//, '')) : '';
                novels.push({ name: name, cover: cover, path: cleanPath });
            }
        });
        return novels;
    };
    return LightNovelWorldPlugin;
}());
exports.LightNovelWorldPlugin = LightNovelWorldPlugin;
exports.default = new LightNovelWorldPlugin();
