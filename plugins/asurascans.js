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
var storage_1 = require("@libs/storage");
var defaultCover_1 = require("@libs/defaultCover");
var novelStatus_1 = require("@libs/novelStatus");
var PAGE_SIZE = 20;
var AsuraScansPlugin = /** @class */ (function () {
    function AsuraScansPlugin() {
        var _this = this;
        this.id = 'asurascans';
        this.name = 'Asura Scans';
        this.icon = 'src/en/asurascans/icon.png';
        this.site = 'https://asurascans.com';
        this.apiUrl = 'https://api.asurascans.com/api';
        this.version = '1.0.0';
        this.pluginSettings = {
            hideLocked: {
                value: '',
                label: 'Hide locked chapters',
                type: 'Switch',
            },
        };
        this.resolveUrl = function (path) {
            return /^https?:\/\//i.test(path)
                ? path
                : "".concat(_this.site, "/").concat(path.replace(/^\/+/, ''));
        };
        this.filters = {
            sort: {
                type: filterInputs_1.FilterTypes.Picker,
                label: 'Sort by',
                value: 'popular',
                options: [
                    { label: 'Popular', value: 'popular' },
                    { label: 'Latest Update', value: 'update' },
                    { label: 'Rating', value: 'rating' },
                    { label: 'Newest', value: 'newest' },
                    { label: 'Name', value: 'name' },
                ],
            },
            status: {
                type: filterInputs_1.FilterTypes.Picker,
                label: 'Status',
                value: '',
                options: [
                    { label: 'All', value: '' },
                    { label: 'Ongoing', value: 'ongoing' },
                    { label: 'Completed', value: 'complete' },
                    { label: 'Hiatus', value: 'hiatus' },
                ],
            },
            genres: {
                type: filterInputs_1.FilterTypes.CheckboxGroup,
                label: 'Genres (all selected must match)',
                value: [],
                options: [
                    { label: 'Action', value: 'action' },
                    { label: 'Adventure', value: 'adventure' },
                    { label: 'Comedy', value: 'comedy' },
                    { label: 'Dark Fantasy', value: 'dark-fantasy' },
                    { label: 'Demon', value: 'demon' },
                    { label: 'Drama', value: 'drama' },
                    { label: 'Dungeons', value: 'dungeons' },
                    { label: 'Fantasy', value: 'fantasy' },
                    { label: 'Game', value: 'game' },
                    { label: 'Genius MC', value: 'genius-mc' },
                    { label: 'Isekai', value: 'isekai' },
                    { label: 'Magic', value: 'magic' },
                    { label: 'Martial Arts', value: 'martial-arts' },
                    { label: 'Murim', value: 'murim' },
                    { label: 'Mystery', value: 'mystery' },
                    { label: 'Overpowered', value: 'overpowered' },
                    { label: 'Psychological', value: 'psychological' },
                    { label: 'Regression', value: 'regression' },
                    { label: 'Reincarnation', value: 'reincarnation' },
                    { label: 'Revenge', value: 'revenge' },
                    { label: 'Romance', value: 'romance' },
                    { label: 'School Life', value: 'school-life' },
                    { label: 'Sci-fi', value: 'sci-fi' },
                    { label: 'Shounen', value: 'shounen' },
                    { label: 'Supernatural', value: 'supernatural' },
                    { label: 'System', value: 'system' },
                    { label: 'Tragedy', value: 'tragedy' },
                    { label: 'Transmigration', value: 'transmigration' },
                    { label: 'Villain', value: 'villain' },
                ],
            },
        };
    }
    AsuraScansPlugin.prototype.fetchJSON = function (url) {
        return __awaiter(this, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, fetch_1.fetchApi)(url)];
                    case 1:
                        res = _a.sent();
                        if (!res.ok) {
                            throw new Error("Asura Scans request failed: HTTP ".concat(res.status));
                        }
                        return [2 /*return*/, res.json()];
                }
            });
        });
    };
    AsuraScansPlugin.prototype.browse = function (page, params) {
        return __awaiter(this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params.set('limit', PAGE_SIZE.toString());
                        params.set('offset', ((page - 1) * PAGE_SIZE).toString());
                        return [4 /*yield*/, this.fetchJSON("".concat(this.apiUrl, "/novel-series?").concat(params.toString()))];
                    case 1:
                        data = _a.sent();
                        return [2 /*return*/, (data.data || []).map(function (series) { return ({
                                name: series.title,
                                cover: series.cover_url || defaultCover_1.defaultCover,
                                path: "novels/".concat(series.slug),
                            }); })];
                }
            });
        });
    };
    AsuraScansPlugin.prototype.popularNovels = function (page_1, _a) {
        return __awaiter(this, arguments, void 0, function (page, _b) {
            var params;
            var showLatestNovels = _b.showLatestNovels, filters = _b.filters;
            return __generator(this, function (_c) {
                params = new URLSearchParams({
                    sort: showLatestNovels ? 'update' : filters.sort.value,
                });
                if (filters.status.value)
                    params.set('status', filters.status.value);
                if (filters.genres.value.length) {
                    params.set('genres', filters.genres.value.join(','));
                }
                return [2 /*return*/, this.browse(page, params)];
            });
        });
    };
    AsuraScansPlugin.prototype.searchNovels = function (searchTerm, page) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.browse(page, new URLSearchParams({ search: searchTerm }))];
            });
        });
    };
    AsuraScansPlugin.prototype.parseNovel = function (novelPath) {
        return __awaiter(this, void 0, void 0, function () {
            var slug, _a, series, _b, chapters, statusMap, novel, $_1, hideLocked;
            var _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        slug = novelPath.split('/').pop() || '';
                        return [4 /*yield*/, this.fetchJSON("".concat(this.apiUrl, "/novel-series/").concat(encodeURIComponent(slug)))];
                    case 1:
                        _a = _d.sent(), series = _a.series, _b = _a.chapters, chapters = _b === void 0 ? [] : _b;
                        statusMap = {
                            ongoing: novelStatus_1.NovelStatus.Ongoing,
                            complete: novelStatus_1.NovelStatus.Completed,
                            completed: novelStatus_1.NovelStatus.Completed,
                            hiatus: novelStatus_1.NovelStatus.OnHiatus,
                            dropped: novelStatus_1.NovelStatus.Cancelled,
                        };
                        novel = {
                            path: novelPath,
                            name: series.title || 'Untitled',
                            cover: series.cover_url || defaultCover_1.defaultCover,
                            author: series.author || undefined,
                            genres: (series.genres || []).join(','),
                            status: (_c = statusMap[(series.status || '').toLowerCase()]) !== null && _c !== void 0 ? _c : novelStatus_1.NovelStatus.Unknown,
                            chapters: [],
                        };
                        if (series.description) {
                            $_1 = (0, cheerio_1.load)(series.description);
                            novel.summary = $_1('p')
                                .map(function (_, el) { return $_1(el).text().trim(); })
                                .toArray()
                                .filter(function (text) { return text; })
                                .join('\n\n');
                            if (!novel.summary)
                                novel.summary = $_1.root().text().trim();
                        }
                        hideLocked = storage_1.storage.get('hideLocked');
                        novel.chapters = chapters
                            .filter(function (chapter) { return !(chapter.is_locked && hideLocked); })
                            .map(function (chapter) {
                            var _a;
                            var title = (_a = chapter.title) === null || _a === void 0 ? void 0 : _a.trim();
                            var name = "Chapter ".concat(chapter.number).concat(title ? ": ".concat(title) : '');
                            return {
                                name: chapter.is_locked ? "\uD83D\uDD12 ".concat(name) : name,
                                path: "novels/".concat(slug, "/chapter/").concat(chapter.number),
                                releaseTime: chapter.published_at || null,
                                chapterNumber: chapter.number,
                            };
                        });
                        return [2 /*return*/, novel];
                }
            });
        });
    };
    AsuraScansPlugin.prototype.parseChapter = function (chapterPath) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, slug, number, chapter;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = chapterPath.split('/'), slug = _a[1], number = _a[3];
                        return [4 /*yield*/, this.fetchJSON("".concat(this.apiUrl, "/novel-series/").concat(encodeURIComponent(slug), "/chapter/").concat(number))];
                    case 1:
                        chapter = _b.sent();
                        if (!chapter.content_html) {
                            throw new Error(chapter.is_locked
                                ? 'This chapter is locked. Unlock it on Asura Scans to read it.'
                                : 'This chapter has no content.');
                        }
                        return [2 /*return*/, this.cleanChapter(chapter.content_html)];
                }
            });
        });
    };
    AsuraScansPlugin.prototype.cleanChapter = function (html) {
        var $ = (0, cheerio_1.load)(html);
        // Some chapters end with a paragraph of leaked site navigation and report
        // dialog text. Only trailing paragraphs carrying both markers are dropped.
        var last = $('p').last();
        while (last.length &&
            last.text().includes('Back to homepage') &&
            last.text().includes('Reporting chapter:')) {
            last.remove();
            last = $('p').last();
        }
        $('script, style, iframe').remove();
        return $('body').html() || '';
    };
    return AsuraScansPlugin;
}());
exports.default = new AsuraScansPlugin();
