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
var novelStatus_1 = require("@libs/novelStatus");
var defaultCover_1 = require("@libs/defaultCover");
/**
 * Novel Archive (novelarchive.cc)
 *
 * The site renders client-side and its pages only ever contain a
 * "Fetching Novel Data..." placeholder, but it exposes a complete JSON API that
 * needs no authentication:
 *
 *   /api/novels?page=&per_page=&search=&sort=&status=
 *   /api/novels/<id>
 *   /api/novels/<id>/chapters/<n>
 *
 * so nothing here parses markup. A scraper aimed at the rendered HTML would
 * have nothing to select against.
 */
var NovelArchive = /** @class */ (function () {
    function NovelArchive() {
        this.id = 'novelarchive';
        this.name = 'Novel Archive';
        this.version = '1.0.0';
        this.icon = 'src/en/novelarchive/icon.png';
        this.site = 'https://novelarchive.cc';
        this.filters = {
            sort: {
                value: 'popular',
                label: 'Sort by',
                options: [
                    { label: 'Popular', value: 'popular' },
                    { label: 'Recent', value: 'recent' },
                    { label: 'Most viewed', value: 'views' },
                ],
                type: filterInputs_1.FilterTypes.Picker,
            },
            status: {
                value: 'all',
                label: 'Status',
                options: [
                    { label: 'All', value: 'all' },
                    { label: 'Completed', value: 'completed' },
                    { label: 'Ongoing', value: 'ongoing' },
                ],
                type: filterInputs_1.FilterTypes.Picker,
            },
        };
    }
    NovelArchive.prototype.api = function (path) {
        return "".concat(this.site, "/api").concat(path);
    };
    NovelArchive.prototype.toItem = function (novel) {
        return {
            name: novel.title,
            path: "/novel?id=".concat(novel.id),
            cover: novel.cover_url || novel.novel_image || defaultCover_1.defaultCover,
        };
    };
    NovelArchive.prototype.statusOf = function (raw) {
        var value = (raw || '').trim().toLowerCase();
        if (value === 'completed' || value === 'finished') {
            return novelStatus_1.NovelStatus.Completed;
        }
        // Hiatus is its own status, not a flavour of "ongoing". Folding it into
        // Ongoing (or letting it fall through to Unknown) tells a reader a novel
        // that stopped updating is still being written.
        if (value === 'hiatus' || value === 'paused' || value === 'on hiatus') {
            return novelStatus_1.NovelStatus.OnHiatus;
        }
        if (value === 'ongoing' || value === 'releasing') {
            return novelStatus_1.NovelStatus.Ongoing;
        }
        return novelStatus_1.NovelStatus.Unknown;
    };
    NovelArchive.prototype.list = function (query) {
        return __awaiter(this, void 0, void 0, function () {
            var response, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, fetch_1.fetchApi)(this.api("/novels?".concat(query)))];
                    case 1:
                        response = _a.sent();
                        if (!response.ok)
                            return [2 /*return*/, []];
                        return [4 /*yield*/, response.json()];
                    case 2:
                        data = (_a.sent());
                        return [2 /*return*/, Array.isArray(data.novels) ? data.novels : []];
                }
            });
        });
    };
    NovelArchive.prototype.popularNovels = function (pageNo_1, _a) {
        return __awaiter(this, arguments, void 0, function (pageNo, _b) {
            var sort, status, novels;
            var _this = this;
            var showLatestNovels = _b.showLatestNovels, filters = _b.filters;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        sort = showLatestNovels ? 'recent' : (filters === null || filters === void 0 ? void 0 : filters.sort.value) || 'popular';
                        status = (filters === null || filters === void 0 ? void 0 : filters.status.value) || 'all';
                        return [4 /*yield*/, this.list("page=".concat(pageNo, "&per_page=24&sort=").concat(sort, "&status=").concat(status))];
                    case 1:
                        novels = _c.sent();
                        return [2 /*return*/, novels.map(function (novel) { return _this.toItem(novel); })];
                }
            });
        });
    };
    NovelArchive.prototype.searchNovels = function (searchTerm, pageNo) {
        return __awaiter(this, void 0, void 0, function () {
            var novels;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.list("page=".concat(pageNo, "&per_page=24&search=").concat(encodeURIComponent(searchTerm)))];
                    case 1:
                        novels = _a.sent();
                        return [2 /*return*/, novels.map(function (novel) { return _this.toItem(novel); })];
                }
            });
        });
    };
    NovelArchive.prototype.parseNovel = function (novelPath) {
        return __awaiter(this, void 0, void 0, function () {
            var id, response, data, novel, names, total, chapters;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        id = novelPath.split('id=')[1] || novelPath;
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(this.api("/novels/".concat(id)))];
                    case 1:
                        response = _a.sent();
                        if (!response.ok)
                            throw new Error("Novel Archive: ".concat(response.status));
                        return [4 /*yield*/, response.json()];
                    case 2:
                        data = (_a.sent());
                        novel = data.novel;
                        if (!novel)
                            throw new Error('Novel Archive: no such novel');
                        names = Array.isArray(novel.chapter_names) ? novel.chapter_names : [];
                        total = Number(novel.total_chapters) || names.length;
                        chapters = Array.from({ length: total }, function (_, index) {
                            var number = index + 1;
                            var name = (names[index] || '').trim();
                            return {
                                // A numbered fallback keeps the row readable where the site has no
                                // title; an empty name renders as a blank entry.
                                name: name || "Chapter ".concat(number),
                                chapterNumber: number,
                                path: "/reader?novel=".concat(id, "&chapter=").concat(number),
                            };
                        });
                        return [2 /*return*/, {
                                path: novelPath,
                                name: novel.title,
                                author: novel.author,
                                cover: novel.cover_url || novel.novel_image || defaultCover_1.defaultCover,
                                genres: novel.genres,
                                status: this.statusOf(novel.release_status || novel.ongoing),
                                summary: (novel.description || '').trim(),
                                // The site rates out of 10; the app's scale is 5.
                                rating: Number.isFinite(novel.rating) ? novel.rating / 2 : 0,
                                chapters: chapters,
                            }];
                }
            });
        });
    };
    NovelArchive.prototype.parseChapter = function (chapterPath) {
        return __awaiter(this, void 0, void 0, function () {
            var query, params, novelId, number, response, data, content;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        query = chapterPath.includes('?')
                            ? chapterPath.slice(chapterPath.indexOf('?') + 1)
                            : chapterPath;
                        params = new URLSearchParams(query);
                        novelId = params.get('novel') || '';
                        number = Number(params.get('chapter')) || 1;
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(this.api("/novels/".concat(novelId, "/chapters/").concat(number)))];
                    case 1:
                        response = _b.sent();
                        if (!response.ok)
                            throw new Error("Novel Archive: ".concat(response.status));
                        return [4 /*yield*/, response.json()];
                    case 2:
                        data = (_b.sent());
                        content = (_a = data.chapter) === null || _a === void 0 ? void 0 : _a.content;
                        if (!content)
                            throw new Error('Novel Archive: empty chapter');
                        // The API returns plain text with blank-line paragraph breaks, not markup,
                        // so it is escaped before being wrapped in <p> - otherwise a stray `<` in
                        // the prose would be read as a tag by the reader.
                        return [2 /*return*/, content
                                .split(/\n{2,}/)
                                .map(function (para) { return para.trim(); })
                                .filter(Boolean)
                                .map(function (para) { return "<p>".concat(escapeHtml(para).replace(/\n/g, '<br/>'), "</p>"); })
                                .join('')];
                }
            });
        });
    };
    return NovelArchive;
}());
function escapeHtml(value) {
    return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}
exports.default = new NovelArchive();
