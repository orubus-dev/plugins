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
var novelStatus_1 = require("@libs/novelStatus");
var defaultCover_1 = require("@libs/defaultCover");
var SITE = 'https://wntl.net';
var API = "".concat(SITE, "/api");
var endpoints = {
    novels: function () { return "".concat(API, "/novels"); },
    views: function (ids) { return "".concat(API, "/views?novelIds=").concat(ids.join(',')); },
    chapters: function (id) { return "".concat(API, "/chapters/").concat(id); },
    chapter: function (id, file) { return "".concat(API, "/chapter-content/").concat(id, "/").concat(file); },
};
var absolute = function (url) {
    if (!url)
        return defaultCover_1.defaultCover;
    return url.startsWith('http') ? url : "".concat(SITE, "/").concat(url.replace(/^\/+/, ''));
};
var escapeHtml = function (s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
};
var inline = function (s) {
    return escapeHtml(s)
        .replace(/\*\*(.+?)\*\*/g, '<b>$1</b>')
        .replace(/\*([^*]+)\*/g, '<i>$1</i>');
};
function markdownToHtml(md) {
    return md
        .replace(/\r\n/g, '\n')
        .split('\n')
        .map(function (l) { return l.trim(); })
        .filter(Boolean)
        .map(function (line) {
        var h = line.match(/^(#{1,6})\s+(.*)$/);
        if (h)
            return "<h".concat(h[1].length, ">").concat(inline(h[2]), "</h").concat(h[1].length, ">");
        if (/^(-{3,}|\*{3,}|_{3,})$/.test(line))
            return '<hr>';
        return "<p>".concat(inline(line), "</p>");
    })
        .join('\n');
}
function parseViews(json) {
    var _a, _b, _c, _d;
    var out = {};
    var src = (_b = (_a = json === null || json === void 0 ? void 0 : json.views) !== null && _a !== void 0 ? _a : json === null || json === void 0 ? void 0 : json.data) !== null && _b !== void 0 ? _b : json;
    var countOf = function (e) { var _a, _b; return Number((_b = (_a = e === null || e === void 0 ? void 0 : e.viewCount) !== null && _a !== void 0 ? _a : e === null || e === void 0 ? void 0 : e.views) !== null && _b !== void 0 ? _b : e === null || e === void 0 ? void 0 : e.count) || 0; };
    if (Array.isArray(src)) {
        for (var _i = 0, src_1 = src; _i < src_1.length; _i++) {
            var e = src_1[_i];
            var id = (_d = (_c = e === null || e === void 0 ? void 0 : e.novelId) !== null && _c !== void 0 ? _c : e === null || e === void 0 ? void 0 : e.id) !== null && _d !== void 0 ? _d : e === null || e === void 0 ? void 0 : e.novel_id;
            if (id != null)
                out[String(id)] = countOf(e);
        }
    }
    else if (src && typeof src === 'object') {
        for (var _e = 0, _f = Object.entries(src); _e < _f.length; _e++) {
            var _g = _f[_e], k = _g[0], v = _g[1];
            out[k] =
                v !== null && typeof v === 'object' ? countOf(v) : Number(v) || 0;
        }
    }
    return out;
}
function lastUpdated(n) {
    var now = Date.now();
    var newest = 0;
    for (var _i = 0, _a = __spreadArray([n.latestChapter], (n.recentChapters || []), true); _i < _a.length; _i++) {
        var c = _a[_i];
        if (!c || (c.status && c.status !== 'published'))
            continue;
        var t = Date.parse(c.publishedAt || '');
        if (!isNaN(t) && t <= now && t > newest)
            newest = t;
    }
    return newest;
}
function mapStatus(status) {
    var s = (status || []).join(' ').toLowerCase();
    if (s.includes('ongoing'))
        return novelStatus_1.NovelStatus.Ongoing;
    if (s.includes('complete'))
        return novelStatus_1.NovelStatus.Completed;
    if (s.includes('hiatus'))
        return novelStatus_1.NovelStatus.OnHiatus;
    return novelStatus_1.NovelStatus.Unknown;
}
var WNTLPlugin = /** @class */ (function () {
    function WNTLPlugin() {
        this.id = 'WebNovelTraslation';
        this.name = 'Web Novel Translation';
        this.icon = 'src/en/webnoveltraslation/icon.png';
        this.site = 'https://wntl.net/';
        this.version = '2.3.0';
        this.cache = null;
        this.viewsCache = null;
    }
    WNTLPlugin.prototype.getJson = function (url) {
        return __awaiter(this, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, fetch_1.fetchApi)(url)];
                    case 1:
                        res = _a.sent();
                        if (!res.ok) {
                            throw new Error("Could not reach site (".concat(res.status, "). Try WebView."));
                        }
                        return [2 /*return*/, res.json()];
                }
            });
        });
    };
    // The whole catalogue comes back in one request, so cache it briefly.
    WNTLPlugin.prototype.getAll = function () {
        return __awaiter(this, void 0, void 0, function () {
            var json, novels;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.cache && Date.now() - this.cache.time < 60000) {
                            return [2 /*return*/, this.cache.novels];
                        }
                        return [4 /*yield*/, this.getJson(endpoints.novels())];
                    case 1:
                        json = _a.sent();
                        novels = json.novels || [];
                        this.cache = { time: Date.now(), novels: novels };
                        return [2 /*return*/, novels];
                }
            });
        });
    };
    WNTLPlugin.prototype.toItem = function (n) {
        return { name: n.title, path: n.id, cover: absolute(n.cover) };
    };
    // we fetch views to later use it to sort for popularity.
    WNTLPlugin.prototype.getViews = function (ids) {
        return __awaiter(this, void 0, void 0, function () {
            var views, batches, i, results, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (this.viewsCache && Date.now() - this.viewsCache.time < 5 * 60000) {
                            return [2 /*return*/, this.viewsCache.views];
                        }
                        views = {};
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        batches = [];
                        for (i = 0; i < ids.length; i += 20)
                            batches.push(ids.slice(i, i + 20));
                        return [4 /*yield*/, Promise.all(batches.map(function (b) {
                                return (0, fetch_1.fetchApi)(endpoints.views(b)).then(function (r) { return (r.ok ? r.json() : {}); });
                            }))];
                    case 2:
                        results = _b.sent();
                        results.forEach(function (r) { return Object.assign(views, parseViews(r)); });
                        return [3 /*break*/, 4];
                    case 3:
                        _a = _b.sent();
                        return [3 /*break*/, 4];
                    case 4:
                        if (Object.keys(views).length) {
                            this.viewsCache = { time: Date.now(), views: views };
                        }
                        return [2 /*return*/, views];
                }
            });
        });
    };
    WNTLPlugin.prototype.popularNovels = function (pageNo_1) {
        return __awaiter(this, arguments, void 0, function (pageNo, _a) {
            var all, views_1, score_1, start;
            var _this = this;
            var _b = _a === void 0 ? {} : _a, showLatestNovels = _b.showLatestNovels;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, this.getAll()];
                    case 1:
                        all = (_c.sent()).filter(function (n) { return n.id && n.title; });
                        if (!showLatestNovels) return [3 /*break*/, 2];
                        all = __spreadArray([], all, true).sort(function (a, b) { return lastUpdated(b) - lastUpdated(a); });
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, this.getViews(all.map(function (n) { return n.id; }))];
                    case 3:
                        views_1 = _c.sent();
                        score_1 = function (n) { var _a; return (_a = views_1[n.id]) !== null && _a !== void 0 ? _a : (Number(n.views) || 0); };
                        // Array.sort is stable, so ties keep the API order.
                        all = __spreadArray([], all, true).sort(function (a, b) { return score_1(b) - score_1(a); });
                        _c.label = 4;
                    case 4:
                        start = (pageNo - 1) * WNTLPlugin.PAGE_SIZE;
                        return [2 /*return*/, all
                                .slice(start, start + WNTLPlugin.PAGE_SIZE)
                                .map(function (n) { return _this.toItem(n); })];
                }
            });
        });
    };
    WNTLPlugin.prototype.searchNovels = function (searchTerm, pageNo) {
        return __awaiter(this, void 0, void 0, function () {
            var q, all;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (pageNo > 1)
                            return [2 /*return*/, []];
                        q = searchTerm.toLowerCase();
                        return [4 /*yield*/, this.getAll()];
                    case 1:
                        all = _a.sent();
                        return [2 /*return*/, all
                                .filter(function (n) {
                                return n.id &&
                                    n.title &&
                                    (n.title.toLowerCase().includes(q) ||
                                        (n['alternate-title'] || []).some(function (t) {
                                            return t.toLowerCase().includes(q);
                                        }));
                            })
                                .map(function (n) { return _this.toItem(n); })];
                }
            });
        });
    };
    WNTLPlugin.prototype.parseNovel = function (novelPath) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, all, chapterRes, n, alt, summary, novel;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, Promise.all([
                            this.getAll(),
                            this.getJson(endpoints.chapters(novelPath)),
                        ])];
                    case 1:
                        _a = _b.sent(), all = _a[0], chapterRes = _a[1];
                        n = all.find(function (x) { return x.id === novelPath; });
                        if (!n) {
                            throw new Error('Novel not found. It may have been removed.');
                        }
                        alt = (n['alternate-title'] || []).filter(Boolean);
                        summary = (n.description || '').trim() +
                            (alt.length ? "\n\nAlternative titles: ".concat(alt.join(', ')) : '');
                        novel = {
                            path: novelPath,
                            name: n.title,
                            cover: absolute(n.cover),
                            author: n.author || '',
                            summary: summary,
                            genres: (n.genre || []).join(', '),
                            status: mapStatus(n.status),
                        };
                        novel.chapters = (chapterRes.chapters || [])
                            .filter(function (c) { return c.status === 'published'; })
                            .map(function (c) { return ({
                            name: c.title,
                            path: "".concat(novelPath, "/").concat(c.file),
                            releaseTime: c.publishedAt,
                            chapterNumber: c.number,
                        }); })
                            .sort(function (a, b) { return a.chapterNumber - b.chapterNumber; });
                        return [2 /*return*/, novel];
                }
            });
        });
    };
    WNTLPlugin.prototype.parseChapter = function (chapterPath) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, id, file, res, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = chapterPath.split('/'), id = _a[0], file = _a[1];
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(endpoints.chapter(id, file))];
                    case 1:
                        res = _c.sent();
                        if (!res.ok)
                            throw new Error("Chapter fetch failed (".concat(res.status, ")"));
                        _b = markdownToHtml;
                        return [4 /*yield*/, res.text()];
                    case 2: return [2 /*return*/, _b.apply(void 0, [_c.sent()])];
                }
            });
        });
    };
    WNTLPlugin.prototype.resolveUrl = function (path, isNovel) {
        var _a = path.split('/'), id = _a[0], file = _a[1];
        if (isNovel || !file)
            return "".concat(SITE, "/series/").concat(id);
        return "".concat(SITE, "/read/").concat(id, "/").concat(file.replace(/\.md$/, ''));
    };
    WNTLPlugin.PAGE_SIZE = 20;
    return WNTLPlugin;
}());
exports.default = new WNTLPlugin();
