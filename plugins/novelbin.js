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
var searchPageSize = 50;
var NovelBinPlugin = /** @class */ (function () {
    function NovelBinPlugin() {
        var _this = this;
        this.id = 'novelbin';
        this.name = 'Novel Bin';
        this.icon = 'src/en/novelbin/icon.png';
        this.site = 'https://novelbin.xyz/';
        this.version = '3.0.0';
        // The site's JSON lives on a CDN that refuses requests from other origins;
        // the site's own /api/cdn/ route serves the same files.
        this.apiBase = this.site + 'api/cdn/';
        this.searchIndex = null;
        this.novelIds = {};
        this.filters = {
            genre: {
                type: filterInputs_1.FilterTypes.Picker,
                label: 'Genre',
                value: '',
                options: [
                    { label: 'All', value: '' },
                    { label: 'Action', value: 'action' },
                    { label: 'Adventure', value: 'adventure' },
                    { label: 'Comedy', value: 'comedy' },
                    { label: 'Drama', value: 'drama' },
                    { label: 'Eastern', value: 'eastern' },
                    { label: 'Fan Fiction', value: 'fan-fiction' },
                    { label: 'Fantasy', value: 'fantasy' },
                    { label: 'Game', value: 'game' },
                    { label: 'Harem', value: 'harem' },
                    { label: 'Historical', value: 'historical' },
                    { label: 'Horror', value: 'horror' },
                    { label: 'Isekai', value: 'isekai' },
                    { label: 'Josei', value: 'josei' },
                    { label: 'Litrpg', value: 'litrpg' },
                    { label: 'Magic', value: 'magic' },
                    { label: 'Magical Realism', value: 'magical-realism' },
                    { label: 'Martial Arts', value: 'martial-arts' },
                    { label: 'Mature', value: 'mature' },
                    { label: 'Mecha', value: 'mecha' },
                    { label: 'Military', value: 'military' },
                    { label: 'Modern Life', value: 'modern-life' },
                    { label: 'Mystery', value: 'mystery' },
                    { label: 'Other', value: 'other' },
                    { label: 'Psychological', value: 'psychological' },
                    { label: 'Reincarnation', value: 'reincarnation' },
                    { label: 'Romance', value: 'romance' },
                    { label: 'School Life', value: 'school-life' },
                    { label: 'Sci Fi', value: 'sci-fi' },
                    { label: 'Seinen', value: 'seinen' },
                    { label: 'Shoujo', value: 'shoujo' },
                    { label: 'Shoujo Ai', value: 'shoujo-ai' },
                    { label: 'Shounen', value: 'shounen' },
                    { label: 'Shounen Ai', value: 'shounen-ai' },
                    { label: 'Slice Of Life', value: 'slice-of-life' },
                    { label: 'Sports', value: 'sports' },
                    { label: 'Supernatural', value: 'supernatural' },
                    { label: 'System', value: 'system' },
                    { label: 'Thriller', value: 'thriller' },
                    { label: 'Tragedy', value: 'tragedy' },
                    { label: 'Urban', value: 'urban' },
                    { label: 'War', value: 'war' },
                    { label: 'Wuxia', value: 'wuxia' },
                    { label: 'Xianxia', value: 'xianxia' },
                    { label: 'Xuanhuan', value: 'xuanhuan' },
                    { label: 'Yaoi', value: 'yaoi' },
                    { label: 'Yuri', value: 'yuri' },
                ],
            },
            status: {
                type: filterInputs_1.FilterTypes.Picker,
                label: 'Status (ignored when a genre is selected)',
                value: '',
                options: [
                    { label: 'All', value: '' },
                    { label: 'Ongoing', value: 'ongoing' },
                    { label: 'Completed', value: 'completed' },
                ],
            },
        };
        this.resolveUrl = function (path) {
            // Covers (and defaultCover) are already absolute.
            if (/^https?:\/\//i.test(path))
                return path;
            // Old novelbin.com paths have no page on this site; open the novel instead.
            if (path.startsWith('b/')) {
                return _this.site + 'novel/' + _this.getSlug(path);
            }
            return _this.site + path;
        };
    }
    NovelBinPlugin.prototype.fetchJson = function (file) {
        return __awaiter(this, void 0, void 0, function () {
            var response, contentType;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, fetch_1.fetchApi)(this.apiBase + file)];
                    case 1:
                        response = _a.sent();
                        contentType = response.headers.get('content-type') || '';
                        if (response.headers.get('cf-mitigated') === 'challenge' ||
                            (response.status === 403 && !contentType.includes('json'))) {
                            throw new Error('Site is showing a security check, please open it in WebView and complete it.');
                        }
                        // Missing files (unknown slugs, pages past the end) come back as 403/404.
                        if (response.status === 403 || response.status === 404)
                            return [2 /*return*/, null];
                        if (!response.ok) {
                            throw new Error("Could not reach site (".concat(response.status, ": ").concat(response.statusText, ") try to open in webview."));
                        }
                        return [4 /*yield*/, response.json()];
                    case 2: return [2 /*return*/, (_a.sent())];
                }
            });
        });
    };
    // The site reads `web_` lists first and falls back to the plain ones.
    NovelBinPlugin.prototype.fetchList = function (name) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.fetchJson("lists/web_".concat(name, ".json"))];
                    case 1: return [2 /*return*/, ((_a.sent()) ||
                            this.fetchJson("lists/".concat(name, ".json")))];
                }
            });
        });
    };
    NovelBinPlugin.prototype.toNovelItem = function (novel) {
        return {
            name: novel.title,
            path: 'novel/' + novel.slug,
            cover: novel.cover || defaultCover_1.defaultCover,
        };
    };
    NovelBinPlugin.prototype.popularNovels = function (pageNo_1, _a) {
        return __awaiter(this, arguments, void 0, function (pageNo, _b) {
            var listName, popular, page;
            var _this = this;
            var showLatestNovels = _b.showLatestNovels, filters = _b.filters;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        listName = '';
                        if (filters === null || filters === void 0 ? void 0 : filters.genre.value) {
                            listName = "genre_".concat(filters.genre.value, "_").concat(pageNo);
                        }
                        else if (filters === null || filters === void 0 ? void 0 : filters.status.value) {
                            listName = "status_".concat(filters.status.value, "_").concat(pageNo);
                        }
                        else if (showLatestNovels) {
                            listName = "latest_".concat(pageNo);
                        }
                        if (!!listName) return [3 /*break*/, 2];
                        // The popular list is a single, unpaged list.
                        if (pageNo > 1)
                            return [2 /*return*/, []];
                        return [4 /*yield*/, this.fetchList('popular')];
                    case 1:
                        popular = _c.sent();
                        return [2 /*return*/, (popular || []).map(function (novel) { return _this.toNovelItem(novel); })];
                    case 2: return [4 /*yield*/, this.fetchList(listName)];
                    case 3:
                        page = _c.sent();
                        return [2 /*return*/, ((page === null || page === void 0 ? void 0 : page.data) || []).map(function (novel) { return _this.toNovelItem(novel); })];
                }
            });
        });
    };
    // Accepts current paths (novel/<slug>, read/<slug>/chapter-<n>) and paths
    // saved by the previous novelbin.com plugin (b/<slug>, b/<slug>/<chapter>).
    NovelBinPlugin.prototype.getSlug = function (path) {
        return path.replace(/^\//, '').split('/')[1];
    };
    NovelBinPlugin.prototype.getNovel = function (slug) {
        return __awaiter(this, void 0, void 0, function () {
            var novel;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.fetchJson("novel/".concat(slug, ".json"))];
                    case 1:
                        novel = _a.sent();
                        if (!novel) {
                            throw new Error('Novel not found, it may have been removed from this source.');
                        }
                        this.novelIds[slug] = novel.id;
                        return [2 /*return*/, novel];
                }
            });
        });
    };
    NovelBinPlugin.prototype.getChapterList = function (novelId) {
        return __awaiter(this, void 0, void 0, function () {
            var chapters;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.fetchJson("chapters/".concat(novelId, ".json"))];
                    case 1:
                        chapters = _a.sent();
                        return [2 /*return*/, chapters || []];
                }
            });
        });
    };
    NovelBinPlugin.prototype.parseNovel = function (novelPath) {
        return __awaiter(this, void 0, void 0, function () {
            var slug, detail, novel, chapters;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        slug = this.getSlug(novelPath);
                        return [4 /*yield*/, this.getNovel(slug)];
                    case 1:
                        detail = _a.sent();
                        novel = {
                            path: novelPath,
                            name: detail.title,
                            cover: detail.cover || defaultCover_1.defaultCover,
                            author: detail.author,
                            summary: detail.description,
                            genres: (detail.genres || []).join(', '),
                        };
                        if (detail.status === 'Ongoing')
                            novel.status = novelStatus_1.NovelStatus.Ongoing;
                        else if (detail.status === 'Completed') {
                            novel.status = novelStatus_1.NovelStatus.Completed;
                        }
                        return [4 /*yield*/, this.getChapterList(detail.id)];
                    case 2:
                        chapters = _a.sent();
                        novel.chapters = chapters
                            .sort(function (a, b) { return a.index - b.index; })
                            .map(function (chapter) { return ({
                            name: chapter.title,
                            path: "read/".concat(slug, "/chapter-").concat(chapter.index + 1),
                            chapterNumber: chapter.index + 1,
                        }); });
                        return [2 /*return*/, novel];
                }
            });
        });
    };
    // Old novelbin.com chapter paths end in a slug of the chapter title,
    // e.g. "chapter-10-first-man-down"; find that chapter's index here.
    NovelBinPlugin.prototype.findLegacyChapterIndex = function (novelId, chapterSlug) {
        return __awaiter(this, void 0, void 0, function () {
            var toSlug, chapters, bySlug, chapterNumber, byNumber;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        toSlug = function (title) {
                            return title
                                .toLowerCase()
                                .replace(/[^a-z0-9]+/g, '-')
                                .replace(/^-+|-+$/g, '');
                        };
                        return [4 /*yield*/, this.getChapterList(novelId)];
                    case 1:
                        chapters = _b.sent();
                        bySlug = chapters.find(function (chapter) { return toSlug(chapter.title) === chapterSlug; });
                        if (bySlug)
                            return [2 /*return*/, bySlug.index];
                        chapterNumber = (_a = chapterSlug.match(/^chapter-(\d+)/)) === null || _a === void 0 ? void 0 : _a[1];
                        byNumber = chapterNumber
                            ? chapters.find(function (chapter) {
                                var _a;
                                return ((_a = toSlug(chapter.title).match(/^chapter-(\d+)/)) === null || _a === void 0 ? void 0 : _a[1]) ===
                                    chapterNumber;
                            })
                            : undefined;
                        if (byNumber)
                            return [2 /*return*/, byNumber.index];
                        throw new Error('Chapter not found, refresh the novel to load its current chapter list.');
                }
            });
        });
    };
    NovelBinPlugin.prototype.parseChapter = function (chapterPath) {
        return __awaiter(this, void 0, void 0, function () {
            var slug, chapterSlug, novelId, _a, index, _b, chapter;
            var _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        slug = this.getSlug(chapterPath);
                        chapterSlug = chapterPath.split('/').pop() || '';
                        if (!((_c = this.novelIds[slug]) !== null && _c !== void 0)) return [3 /*break*/, 1];
                        _a = _c;
                        return [3 /*break*/, 3];
                    case 1: return [4 /*yield*/, this.getNovel(slug)];
                    case 2:
                        _a = (_d.sent()).id;
                        _d.label = 3;
                    case 3:
                        novelId = _a;
                        if (!chapterPath.startsWith('read/')) return [3 /*break*/, 4];
                        _b = Number(chapterSlug.replace('chapter-', '')) - 1;
                        return [3 /*break*/, 6];
                    case 4: return [4 /*yield*/, this.findLegacyChapterIndex(novelId, chapterSlug)];
                    case 5:
                        _b = _d.sent();
                        _d.label = 6;
                    case 6:
                        index = _b;
                        return [4 /*yield*/, this.fetchJson("read/".concat(novelId, "/").concat(index, ".json"))];
                    case 7:
                        chapter = _d.sent();
                        if (!(chapter === null || chapter === void 0 ? void 0 : chapter.content)) {
                            throw new Error('Chapter not found, it may have been removed from this source.');
                        }
                        return [2 /*return*/, chapter.content];
                }
            });
        });
    };
    NovelBinPlugin.prototype.searchNovels = function (searchTerm, pageNo) {
        return __awaiter(this, void 0, void 0, function () {
            var searchIndex, term;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // The site searches one ~7.5 MB index on the client; load it once, and
                        // share the pending download between overlapping searches.
                        if (!this.searchIndex) {
                            this.searchIndex = this.fetchList('search').then(function (index) {
                                if (!index)
                                    throw new Error('Could not load the search index.');
                                return index;
                            });
                            // Let a later search retry after a failed download.
                            this.searchIndex.catch(function () {
                                _this.searchIndex = null;
                            });
                        }
                        return [4 /*yield*/, this.searchIndex];
                    case 1:
                        searchIndex = _a.sent();
                        term = searchTerm.toLowerCase().trim();
                        return [2 /*return*/, searchIndex
                                .filter(function (novel) {
                                return novel.title.toLowerCase().includes(term) ||
                                    (novel.alternative_titles || '').toLowerCase().includes(term);
                            })
                                .slice((pageNo - 1) * searchPageSize, pageNo * searchPageSize)
                                .map(function (novel) { return _this.toNovelItem(novel); })];
                }
            });
        });
    };
    return NovelBinPlugin;
}());
exports.default = new NovelBinPlugin();
