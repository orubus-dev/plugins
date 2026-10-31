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
var fetch_1 = require("@libs/fetch");
var filterInputs_1 = require("@libs/filterInputs");
var defaultCover_1 = require("@libs/defaultCover");
var novelStatus_1 = require("@libs/novelStatus");
var CoteReader = /** @class */ (function () {
    function CoteReader() {
        this.id = 'cotereader';
        this.name = 'COTE Reader';
        this.site = 'https://cote-reader.me';
        this.icon = 'src/en/cotereader/icon.png';
        this.version = '1.0.7';
        this.canonicalIds = new Set([
            'cote',
            'lotm',
            'rezero',
            'bunny-girl',
            'mushoku-tensei',
            'orv',
            'world',
            'reverend-insanity',
            'apothecary-diaries',
            'tensura',
            'tbate',
            'eightysix',
            'monogatari',
        ]);
        this.aliasMap = {
            '4557': 'cote',
            '3336': 'mushoku-tensei',
            '3486': 'bunny-girl',
            '1014': 'monogatari',
            '3343': 'rezero',
            '6547': 'eightysix',
            '3580': 'tensura',
            '3768': 'apothecary-diaries',
            '10839': 'lotm',
            '200298': '2958',
        };
        this.filters = {
            tag: {
                value: '',
                label: 'Genre / Tag',
                options: [
                    { label: 'All', value: '' },
                    { label: 'Action', value: 'Action' },
                    { label: 'Adventure', value: 'Adventure' },
                    { label: 'Comedy', value: 'Comedy' },
                    { label: 'Dark Fantasy', value: 'Dark Fantasy' },
                    { label: 'Drama', value: 'Drama' },
                    { label: 'Fantasy', value: 'Fantasy' },
                    { label: 'Historical', value: 'Historical' },
                    { label: 'Isekai', value: 'Isekai' },
                    { label: 'Mystery', value: 'Mystery' },
                    { label: 'Psychological', value: 'Psychological' },
                    { label: 'Romance', value: 'Romance' },
                    { label: 'School', value: 'School' },
                    { label: 'Sci-Fi', value: 'Sci-Fi' },
                    { label: 'Slice of Life', value: 'Slice of Life' },
                    { label: 'Supernatural', value: 'Supernatural' },
                ],
                type: filterInputs_1.FilterTypes.Picker,
            },
        };
    }
    CoteReader.prototype.formatCover = function (cover) {
        if (!cover)
            return defaultCover_1.defaultCover;
        if (cover.startsWith('http://') || cover.startsWith('https://'))
            return cover;
        if (cover.startsWith('//'))
            return "https:".concat(cover);
        if (cover.startsWith('/'))
            return "".concat(this.site).concat(cover);
        return "".concat(this.site, "/").concat(cover);
    };
    // The app passes cover URLs through resolveUrl (EPUB export does
    // this), so absolute and protocol-relative URLs must pass through
    // unchanged — prefixing the site onto them breaks the cover.
    CoteReader.prototype.resolveUrl = function (path) {
        if (/^https?:\/\//i.test(path))
            return path;
        if (path.indexOf('//') === 0)
            return 'https:' + path;
        return "".concat(this.site, "/").concat(path.replace(/^\/+/, ''));
    };
    CoteReader.prototype.cleanId = function (novelPath) {
        return novelPath
            .replace(/^\/?novel\//i, '')
            .replace(/^\//, '')
            .split('/')[0]
            .trim();
    };
    CoteReader.prototype.safeJson = function (res) {
        return __awaiter(this, void 0, void 0, function () {
            var text;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, res.text()];
                    case 1:
                        text = _a.sent();
                        if (!text || !text.trim()) {
                            throw new Error('Received empty response from server. Please retry in a moment.');
                        }
                        try {
                            return [2 /*return*/, JSON.parse(text)];
                        }
                        catch (e) {
                            if (text.includes('<!DOCTYPE') || text.includes('<html')) {
                                throw new Error('Server returned an error page instead of novel content. Please retry.');
                            }
                            throw new Error('Stream interrupted by server (unexpected end of input). Retrying...');
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Error with the HTTP status attached. Tooling (e.g. the repo's live
     * check) reads `error.status` to tell a site block or outage (403/503)
     * apart from a plugin bug, so always throw fetch failures this way.
     */
    CoteReader.prototype.httpError = function (message, status) {
        var err = new Error(message);
        err.status = status;
        return err;
    };
    CoteReader.prototype.popularNovels = function (pageNo_1, _a) {
        return __awaiter(this, arguments, void 0, function (pageNo, _b) {
            var url, res, data, items, seenPaths, seenTitles, result, _i, items_1, novel, targetId, path, normTitle;
            var _c;
            var filters = _b.filters;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        url = "".concat(this.site, "/api/novels?page=").concat(pageNo, "&limit=20");
                        if ((_c = filters === null || filters === void 0 ? void 0 : filters.tag) === null || _c === void 0 ? void 0 : _c.value) {
                            url += "&tag=".concat(encodeURIComponent(filters.tag.value));
                        }
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(url)];
                    case 1:
                        res = _d.sent();
                        if (!res.ok) {
                            throw this.httpError("Failed to load popular novels: HTTP ".concat(res.status), res.status);
                        }
                        return [4 /*yield*/, this.safeJson(res)];
                    case 2:
                        data = _d.sent();
                        items = data.items || [];
                        seenPaths = new Set();
                        seenTitles = new Set();
                        result = [];
                        for (_i = 0, items_1 = items; _i < items_1.length; _i++) {
                            novel = items_1[_i];
                            targetId = this.aliasMap[novel.id] || novel.id;
                            path = "/novel/".concat(targetId);
                            normTitle = novel.title.toLowerCase().replace(/[^a-z0-9]/g, '');
                            if (seenPaths.has(path) || seenTitles.has(normTitle)) {
                                continue;
                            }
                            seenPaths.add(path);
                            seenTitles.add(normTitle);
                            result.push({
                                name: novel.title,
                                path: path,
                                cover: this.formatCover(novel.cover),
                            });
                        }
                        return [2 /*return*/, result];
                }
            });
        });
    };
    CoteReader.prototype.searchNovels = function (searchTerm, pageNo) {
        return __awaiter(this, void 0, void 0, function () {
            var url, res, data, items, seenPaths, seenTitles, result, _i, items_2, novel, targetId, path, normTitle;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = "".concat(this.site, "/api/novels?q=").concat(encodeURIComponent(searchTerm), "&page=").concat(pageNo, "&limit=20");
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(url)];
                    case 1:
                        res = _a.sent();
                        if (!res.ok) {
                            throw this.httpError("Failed to search novels: HTTP ".concat(res.status), res.status);
                        }
                        return [4 /*yield*/, this.safeJson(res)];
                    case 2:
                        data = _a.sent();
                        items = data.items || [];
                        seenPaths = new Set();
                        seenTitles = new Set();
                        result = [];
                        for (_i = 0, items_2 = items; _i < items_2.length; _i++) {
                            novel = items_2[_i];
                            targetId = this.aliasMap[novel.id] || novel.id;
                            path = "/novel/".concat(targetId);
                            normTitle = novel.title.toLowerCase().replace(/[^a-z0-9]/g, '');
                            if (seenPaths.has(path) || seenTitles.has(normTitle)) {
                                continue;
                            }
                            seenPaths.add(path);
                            seenTitles.add(normTitle);
                            result.push({
                                name: novel.title,
                                path: path,
                                cover: this.formatCover(novel.cover),
                            });
                        }
                        return [2 /*return*/, result];
                }
            });
        });
    };
    CoteReader.prototype.parseNovel = function (novelPath) {
        return __awaiter(this, void 0, void 0, function () {
            var rawId, id, metaUrl, res, data, genres, sumUrl, sumRes, summary, allChs, chapters_1, e_1, volumes, isCanonical, chapters;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        rawId = this.cleanId(novelPath);
                        id = this.aliasMap[rawId] || rawId;
                        metaUrl = "".concat(this.site, "/api/novels/").concat(id);
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(metaUrl)];
                    case 1:
                        res = _a.sent();
                        if (!res.ok) {
                            throw this.httpError("Failed to load novel metadata: HTTP ".concat(res.status), res.status);
                        }
                        return [4 /*yield*/, this.safeJson(res)];
                    case 2:
                        data = _a.sent();
                        genres = Array.isArray(data.tags)
                            ? data.tags.join(', ')
                            : Array.isArray(data.genres)
                                ? data.genres.join(', ')
                                : undefined;
                        if (!(id === 'orv' || id === 'world')) return [3 /*break*/, 8];
                        _a.label = 3;
                    case 3:
                        _a.trys.push([3, 7, , 8]);
                        sumUrl = "".concat(this.site, "/assets/").concat(id, "/summary.json");
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(sumUrl)];
                    case 4:
                        sumRes = _a.sent();
                        if (!sumRes.ok) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.safeJson(sumRes)];
                    case 5:
                        summary = _a.sent();
                        allChs = __spreadArray(__spreadArray(__spreadArray([], (summary.mainChapters || []), true), (summary.contChapters || []), true), (summary.sideChapters || []), true);
                        if (allChs.length > 0) {
                            chapters_1 = allChs.map(function (ch, idx) { return ({
                                name: ch.title,
                                path: "/webnovel/".concat(id, "/").concat(ch.id),
                                chapterNumber: idx + 1,
                            }); });
                            return [2 /*return*/, {
                                    path: novelPath,
                                    name: data.title,
                                    cover: this.formatCover(data.cover),
                                    summary: data.description,
                                    author: data.author,
                                    genres: genres,
                                    status: novelStatus_1.NovelStatus.Ongoing,
                                    chapters: chapters_1,
                                }];
                        }
                        _a.label = 6;
                    case 6: return [3 /*break*/, 8];
                    case 7:
                        e_1 = _a.sent();
                        return [3 /*break*/, 8];
                    case 8:
                        volumes = data.volumes || [];
                        isCanonical = this.canonicalIds.has(id.toLowerCase());
                        chapters = volumes.map(function (volume, index) {
                            var position = index + 1;
                            var numStr = String(position).padStart(2, '0');
                            var rawTitle = volume.title || "Volume ".concat(position);
                            var name = "Vol. ".concat(numStr, ": ").concat(rawTitle);
                            var path = isCanonical
                                ? "/canonical/".concat(id, "/").concat(volume.id)
                                : "/api/novels/".concat(id, "/volume/").concat(volume.id);
                            return {
                                name: name,
                                path: path,
                                chapterNumber: position,
                            };
                        });
                        return [2 /*return*/, {
                                path: novelPath,
                                name: data.title,
                                cover: this.formatCover(data.cover),
                                summary: data.description,
                                author: data.author,
                                genres: genres,
                                status: novelStatus_1.NovelStatus.Ongoing,
                                chapters: chapters,
                            }];
                }
            });
        });
    };
    CoteReader.prototype.parseChapter = function (chapterPath) {
        return __awaiter(this, void 0, void 0, function () {
            var rawHtml, parts, id, chapterId, chUrl, res, chData, parts, id, volumeId, chapterKey, cacheUrl, res, json_1, keys, parts, id, volumeId, chapterIndex, volUrl, lastErr, volData, _loop_1, this_1, attempt, state_1, chaptersObj_1, toc, keys, res;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        rawHtml = '';
                        if (!chapterPath.startsWith('/webnovel/')) return [3 /*break*/, 3];
                        parts = chapterPath.replace(/^\/webnovel\//, '').split('/');
                        id = parts[0];
                        chapterId = parts[1];
                        chUrl = "".concat(this.site, "/assets/").concat(id, "/chapters/").concat(chapterId, ".json");
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(chUrl)];
                    case 1:
                        res = _c.sent();
                        if (!res.ok) {
                            throw this.httpError("Failed to fetch chapter: HTTP ".concat(res.status), res.status);
                        }
                        return [4 /*yield*/, this.safeJson(res)];
                    case 2:
                        chData = _c.sent();
                        rawHtml = chData.contentHtml || chData.content || '';
                        return [3 /*break*/, 14];
                    case 3:
                        if (!chapterPath.startsWith('/canonical/')) return [3 /*break*/, 6];
                        parts = chapterPath.replace(/^\/canonical\//, '').split('/');
                        id = parts[0];
                        volumeId = parts[1];
                        chapterKey = parts[2];
                        cacheUrl = "".concat(this.site, "/assets/cache/").concat(id, "/").concat(volumeId, ".json");
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(cacheUrl)];
                    case 4:
                        res = _c.sent();
                        if (!res.ok) {
                            if (res.status === 404) {
                                throw this.httpError('This volume is not yet available on COTE Reader (HTTP 404).', 404);
                            }
                            throw this.httpError("Failed to fetch volume: HTTP ".concat(res.status), res.status);
                        }
                        return [4 /*yield*/, this.safeJson(res)];
                    case 5:
                        json_1 = _c.sent();
                        if (chapterKey && json_1[chapterKey]) {
                            rawHtml = json_1[chapterKey].content || '';
                        }
                        else {
                            keys = Object.keys(json_1).sort(function (a, b) { return Number(a) - Number(b); });
                            rawHtml = keys
                                .map(function (k) {
                                var item = json_1[k];
                                var title = item.title || "Chapter ".concat(k);
                                return "<section class=\"volume-chapter\"><h2 class=\"volume-chapter-title\">".concat(title, "</h2>").concat(item.content || '', "</section>");
                            })
                                .join('\n<hr class="volume-divider" />\n');
                        }
                        return [3 /*break*/, 14];
                    case 6:
                        if (!chapterPath.startsWith('/api/novels/')) return [3 /*break*/, 11];
                        parts = chapterPath.replace(/^\/api\/novels\//, '').split('/');
                        id = parts[0];
                        volumeId = parts[2];
                        chapterIndex = parts[3];
                        volUrl = "".concat(this.site, "/api/novels/").concat(id, "/volume/").concat(volumeId);
                        lastErr = null;
                        volData = null;
                        _loop_1 = function (attempt) {
                            var res, e_2;
                            return __generator(this, function (_d) {
                                switch (_d.label) {
                                    case 0:
                                        _d.trys.push([0, 5, , 8]);
                                        return [4 /*yield*/, (0, fetch_1.fetchApi)(volUrl)];
                                    case 1:
                                        res = _d.sent();
                                        if (!(res.status === 503)) return [3 /*break*/, 3];
                                        lastErr = this_1.httpError('Remote server is busy (HTTP 503: Cloudflare Worker limit). Please retry in a moment.', 503);
                                        return [4 /*yield*/, new Promise(function (resolve) {
                                                return setTimeout(resolve, 1000 * (attempt + 1));
                                            })];
                                    case 2:
                                        _d.sent();
                                        return [2 /*return*/, "continue"];
                                    case 3:
                                        if (!res.ok) {
                                            throw this_1.httpError("Failed to fetch volume: HTTP ".concat(res.status), res.status);
                                        }
                                        return [4 /*yield*/, this_1.safeJson(res)];
                                    case 4:
                                        volData = _d.sent();
                                        return [2 /*return*/, "break"];
                                    case 5:
                                        e_2 = _d.sent();
                                        lastErr = e_2 instanceof Error ? e_2 : new Error(String(e_2));
                                        if (!(attempt < 2)) return [3 /*break*/, 7];
                                        return [4 /*yield*/, new Promise(function (resolve) {
                                                return setTimeout(resolve, 1000 * (attempt + 1));
                                            })];
                                    case 6:
                                        _d.sent();
                                        _d.label = 7;
                                    case 7: return [3 /*break*/, 8];
                                    case 8: return [2 /*return*/];
                                }
                            });
                        };
                        this_1 = this;
                        attempt = 0;
                        _c.label = 7;
                    case 7:
                        if (!(attempt < 3)) return [3 /*break*/, 10];
                        return [5 /*yield**/, _loop_1(attempt)];
                    case 8:
                        state_1 = _c.sent();
                        if (state_1 === "break")
                            return [3 /*break*/, 10];
                        _c.label = 9;
                    case 9:
                        attempt++;
                        return [3 /*break*/, 7];
                    case 10:
                        if (!volData) {
                            if ((_a = lastErr === null || lastErr === void 0 ? void 0 : lastErr.message) === null || _a === void 0 ? void 0 : _a.includes('503')) {
                                throw lastErr;
                            }
                            throw (lastErr ||
                                new Error('Failed to load volume: Connection was interrupted. Please retry in a moment.'));
                        }
                        if (chapterIndex && ((_b = volData.chapters) === null || _b === void 0 ? void 0 : _b[chapterIndex])) {
                            rawHtml = volData.chapters[chapterIndex].content || '';
                        }
                        else {
                            chaptersObj_1 = volData.chapters || {};
                            toc = volData.toc || [];
                            if (toc.length > 0) {
                                rawHtml = toc
                                    .map(function (item) {
                                    var ch = chaptersObj_1[item.chapterIndex];
                                    return "<section class=\"volume-chapter\"><h2 class=\"volume-chapter-title\">".concat(item.title, "</h2>").concat((ch === null || ch === void 0 ? void 0 : ch.content) || '', "</section>");
                                })
                                    .join('\n<hr class="volume-divider" />\n');
                            }
                            else {
                                keys = Object.keys(chaptersObj_1).sort(function (a, b) { return Number(a) - Number(b); });
                                rawHtml = keys
                                    .map(function (k) { var _a; return "<section class=\"volume-chapter\">".concat(((_a = chaptersObj_1[k]) === null || _a === void 0 ? void 0 : _a.content) || '', "</section>"); })
                                    .join('\n<hr class="volume-divider" />\n');
                            }
                        }
                        return [3 /*break*/, 14];
                    case 11: return [4 /*yield*/, (0, fetch_1.fetchApi)(chapterPath.startsWith('http')
                            ? chapterPath
                            : "".concat(this.site).concat(chapterPath))];
                    case 12:
                        res = _c.sent();
                        if (!res.ok) return [3 /*break*/, 14];
                        return [4 /*yield*/, res.text()];
                    case 13:
                        rawHtml = _c.sent();
                        _c.label = 14;
                    case 14: return [2 /*return*/, this.sanitizeChapterHtml(rawHtml)];
                }
            });
        });
    };
    CoteReader.prototype.sanitizeChapterHtml = function (html) {
        if (!html)
            return '';
        var cleaned = html.replace(/(<img[^>]+src=["'])(\/assets\/[^"']+)(["'])/gi, "$1".concat(this.site, "$2$3"));
        cleaned = cleaned.replace(/<picture>[\s\S]*?<img([^>]+src=["']https?:\/\/[^"']+["'][^>]*)>[\s\S]*?<\/picture>/gi, '<img$1>');
        return cleaned;
    };
    return CoteReader;
}());
exports.default = new CoteReader();
