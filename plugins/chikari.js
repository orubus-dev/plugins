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
var defaultCover_1 = require("@libs/defaultCover");
var novelStatus_1 = require("@libs/novelStatus");
var ChikariPlugin = /** @class */ (function () {
    function ChikariPlugin() {
        var _this = this;
        this.id = 'chikari';
        this.name = 'Chikari';
        this.icon = 'src/en/chikari/icon.png';
        this.site = 'https://chikari.moe';
        this.version = '1.0.1';
        this.imageRequestInit = undefined;
        // Define the filters for the app's filter menu
        this.filters = {
            sort: {
                type: filterInputs_1.FilterTypes.Picker,
                label: 'Sort By',
                value: 'popular',
                options: [
                    { label: 'Popular', value: 'popular' },
                    { label: 'Trending', value: 'trending' },
                    { label: 'Top Rated', value: 'top_rated' },
                    { label: 'Recently Updated', value: 'updated' },
                    { label: 'Recently Added', value: 'added' },
                    { label: 'Most Bookmarked', value: 'most_bookmarked' },
                ],
            },
            genres: {
                type: filterInputs_1.FilterTypes.ExcludableCheckboxGroup,
                label: 'Genres',
                value: {
                    include: [],
                    exclude: [],
                },
                options: [
                    { label: 'Action', value: 'action' },
                    { label: 'Adventure', value: 'adventure' },
                    { label: 'Comedy', value: 'comedy' },
                    { label: 'Drama', value: 'drama' },
                    { label: 'Ecchi', value: 'ecchi' },
                    { label: 'Fantasy', value: 'fantasy' },
                    { label: 'Gender Bender', value: 'gender_bender' },
                    { label: 'Harem', value: 'harem' },
                    { label: 'Historical', value: 'historical' },
                    { label: 'Horror', value: 'horror' },
                    { label: 'Josei', value: 'josei' },
                    { label: 'Martial Arts', value: 'martial_arts' },
                    { label: 'Mature', value: 'mature' },
                    { label: 'Mecha', value: 'mecha' },
                    { label: 'Mystery', value: 'mystery' },
                    { label: 'Psychological', value: 'psychological' },
                    { label: 'Romance', value: 'romance' },
                    { label: 'School Life', value: 'school_life' },
                    { label: 'Sci-Fi', value: 'sci-fi' },
                    { label: 'Seinen', value: 'seinen' },
                    { label: 'Shoujo', value: 'shoujo' },
                    { label: 'Shoujo Ai', value: 'shoujo_ai' },
                    { label: 'Shounen', value: 'shounen' },
                    { label: 'Shounen Ai', value: 'shounen_ai' },
                    { label: 'Slice of Life', value: 'slice_of_life' },
                    { label: 'Sports', value: 'sports' },
                    { label: 'Supernatural', value: 'supernatural' },
                    { label: 'Tragedy', value: 'tragedy' },
                    { label: 'Yaoi', value: 'yaoi' },
                    { label: 'Yuri', value: 'yuri' },
                ],
            },
        };
        this.resolveUrl = function (path, isNovel) {
            if (isNovel)
                return "".concat(_this.site, "/novels/").concat(path);
            return "".concat(_this.site, "/").concat(path);
        };
    }
    ChikariPlugin.prototype.popularNovels = function (pageNo_1, _a) {
        return __awaiter(this, arguments, void 0, function (pageNo, _b) {
            var limit, offset, sort, genreQuery, genresFilter, genreValues, url, response, json, novels;
            var showLatestNovels = _b.showLatestNovels, filters = _b.filters;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        limit = 60;
                        offset = (pageNo - 1) * limit;
                        sort = 'popular';
                        genreQuery = '';
                        if (showLatestNovels) {
                            sort = 'updated';
                        }
                        else if (filters && filters.sort) {
                            // Safely extract string value if wrapped in an object ({ type, value })
                            sort = typeof filters.sort === 'object' ? filters.sort.value : filters.sort;
                        }
                        genresFilter = filters === null || filters === void 0 ? void 0 : filters.genres;
                        genreValues = typeof genresFilter === 'object' && 'value' in genresFilter
                            ? genresFilter.value
                            : genresFilter;
                        if (genreValues) {
                            // 1. If passed as an Array
                            if (Array.isArray(genreValues)) {
                                genreValues.forEach(function (genre) {
                                    if (genre.startsWith('-')) {
                                        genreQuery += "&genre_exclude=".concat(genre.substring(1));
                                    }
                                    else {
                                        genreQuery += "&genre=".concat(genre);
                                    }
                                });
                            }
                            // 2. If passed as an Object ({ include: [], exclude: [] })
                            else if (typeof genreValues === 'object') {
                                if (Array.isArray(genreValues.include)) {
                                    genreValues.include.forEach(function (genre) {
                                        genreQuery += "&genre=".concat(genre);
                                    });
                                }
                                if (Array.isArray(genreValues.exclude)) {
                                    genreValues.exclude.forEach(function (genre) {
                                        genreQuery += "&genre_exclude=".concat(genre);
                                    });
                                }
                            }
                        }
                        url = "".concat(this.site, "/api/novels?sort=").concat(sort).concat(genreQuery, "&limit=").concat(limit, "&offset=").concat(offset);
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(url)];
                    case 1:
                        response = _c.sent();
                        return [4 /*yield*/, response.json()];
                    case 2:
                        json = _c.sent();
                        novels = (json.items || []).map(function (item) { return ({
                            name: item.title,
                            path: item.slug,
                            cover: item.cover_url || defaultCover_1.defaultCover,
                        }); });
                        return [2 /*return*/, novels];
                }
            });
        });
    };
    ChikariPlugin.prototype.searchNovels = function (searchTerm, pageNo) {
        return __awaiter(this, void 0, void 0, function () {
            var limit, offset, url, response, json, novels;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        limit = 36;
                        offset = (pageNo - 1) * limit;
                        url = "".concat(this.site, "/api/novels?sort=popular&q=").concat(encodeURIComponent(searchTerm), "&limit=").concat(limit, "&offset=").concat(offset);
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(url)];
                    case 1:
                        response = _a.sent();
                        return [4 /*yield*/, response.json()];
                    case 2:
                        json = _a.sent();
                        novels = (json.items || []).map(function (item) { return ({
                            name: item.title,
                            path: item.slug,
                            cover: item.cover_url || defaultCover_1.defaultCover,
                        }); });
                        return [2 /*return*/, novels];
                }
            });
        });
    };
    ChikariPlugin.prototype.parseNovel = function (novelPath) {
        return __awaiter(this, void 0, void 0, function () {
            var detailUrl, detailResponse, detailJson, authorName, genres, novel, chapters, offset, limit, hasMoreChapters, chaptersUrl, chaptersResponse, chaptersJson, fetchedChapters;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        detailUrl = "".concat(this.site, "/api/novels/").concat(novelPath);
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(detailUrl)];
                    case 1:
                        detailResponse = _a.sent();
                        return [4 /*yield*/, detailResponse.json()];
                    case 2:
                        detailJson = _a.sent();
                        authorName = detailJson.authors && detailJson.authors.length > 0
                            ? detailJson.authors.map(function (a) { return a.name; }).join(', ')
                            : 'Unknown';
                        genres = detailJson.genres && detailJson.genres.length > 0
                            ? detailJson.genres.map(function (g) { return g.name; }).join(', ')
                            : '';
                        novel = {
                            path: novelPath,
                            name: detailJson.title || 'Untitled',
                            cover: detailJson.cover_url || defaultCover_1.defaultCover,
                            author: authorName,
                            summary: detailJson.description || '',
                            genres: genres, // Handled here!
                            status: detailJson.status === 'releasing' ? novelStatus_1.NovelStatus.Ongoing : novelStatus_1.NovelStatus.Completed,
                        };
                        chapters = [];
                        offset = 0;
                        limit = 500;
                        hasMoreChapters = true;
                        _a.label = 3;
                    case 3:
                        if (!hasMoreChapters) return [3 /*break*/, 6];
                        chaptersUrl = "".concat(this.site, "/api/novels/").concat(novelPath, "/chapters?order=asc&limit=").concat(limit, "&offset=").concat(offset);
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(chaptersUrl)];
                    case 4:
                        chaptersResponse = _a.sent();
                        return [4 /*yield*/, chaptersResponse.json()];
                    case 5:
                        chaptersJson = _a.sent();
                        fetchedChapters = chaptersJson.items;
                        if (!fetchedChapters || fetchedChapters.length === 0) {
                            hasMoreChapters = false;
                            return [3 /*break*/, 6];
                        }
                        fetchedChapters.forEach(function (ch) {
                            chapters.push({
                                name: ch.title || "Chapter ".concat(ch.number),
                                path: "api/novels/".concat(novelPath, "/chapters/").concat(ch.number, "/read"),
                                releaseTime: ch.created_at || '',
                                chapterNumber: ch.number,
                            });
                        });
                        if (fetchedChapters.length === limit) {
                            offset += limit;
                        }
                        else {
                            hasMoreChapters = false;
                        }
                        return [3 /*break*/, 3];
                    case 6:
                        novel.chapters = chapters;
                        return [2 /*return*/, novel];
                }
            });
        });
    };
    ChikariPlugin.prototype.parseChapter = function (chapterPath) {
        return __awaiter(this, void 0, void 0, function () {
            var url, response, json, rawText, chapterHtml;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = "".concat(this.site, "/").concat(chapterPath);
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(url)];
                    case 1:
                        response = _a.sent();
                        return [4 /*yield*/, response.json()];
                    case 2:
                        json = _a.sent();
                        rawText = json.body || '';
                        chapterHtml = rawText
                            .split('\n')
                            .map(function (paragraph) { return "<p>".concat(paragraph.trim(), "</p>"); })
                            .filter(function (paragraph) { return paragraph !== '<p></p>'; })
                            .join('');
                        return [2 /*return*/, chapterHtml];
                }
            });
        });
    };
    return ChikariPlugin;
}());
exports.default = new ChikariPlugin();
