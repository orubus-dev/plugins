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
var novelStatus_1 = require("@libs/novelStatus");
// Atsumaru — https://atsu.moe
// A manga/novel platform; this plugin covers its novel catalog
// (2,669 titles). The catalog/search runs on a public Typesense
// collection; series details, chapter lists and chapter text come
// from the site's JSON API:
//   GET /collections/manga/documents/search?...&filter_by=medium:=Novel
//   GET /api/manga/page?id=<id>              details + scanlation groups
//   GET /api/manga/allChapters?mangaId=<id>  chapters across all groups
//   GET /api/read/novelChapter?mangaId=<id>&chapterId=<id>  text
// A novel can be carried by several scanlation groups; parseNovel
// reads one group's set (the largest, so the book is most complete).
var SITE = 'https://atsu.moe';
var CDN = 'https://cdn.atsu.moe/static/';
var QUERY_BY = 'title,englishTitle,otherNames,authors,acronyms';
var FILTER = 'medium:=Novel && hidden:!=true';
var PER_PAGE = 24;
/**
 * Upper bound on a response this plugin will parse. The chapter-list
 * payload is the big one (a 6,400-chapter novel across two groups is
 * ~1.2 MB); anything far above legitimate responses is a broken or
 * hostile payload, and parsing it would bill the reader's phone.
 */
var MAX_RESPONSE_CHARS = 8000000;
/**
 * Error with the HTTP status attached. Tooling (e.g. the repo's live
 * check) reads `error.status` to tell a site block or outage (403/503)
 * apart from a plugin bug, so always throw fetch failures this way.
 */
function httpError(message, status) {
    var err = new Error(message);
    err.status = status;
    return err;
}
function fetchJson(url, what) {
    return __awaiter(this, void 0, void 0, function () {
        var res, text, data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, fetch_1.fetchApi)(url)];
                case 1:
                    res = _a.sent();
                    if (!res.ok) {
                        throw httpError("".concat(what, ": HTTP ").concat(res.status), res.status);
                    }
                    return [4 /*yield*/, res.text()];
                case 2:
                    text = _a.sent();
                    if (text.length > MAX_RESPONSE_CHARS) {
                        throw new Error("".concat(what, ": response too large (").concat(text.length, " chars)"));
                    }
                    try {
                        data = JSON.parse(text);
                    }
                    catch (_b) {
                        throw new Error("".concat(what, ": response was not valid JSON"));
                    }
                    if (!data || typeof data !== 'object') {
                        throw new Error("".concat(what, ": response had an unexpected shape"));
                    }
                    return [2 /*return*/, data];
            }
        });
    });
}
function searchUrl(query, sortBy, pageNo) {
    return ("".concat(SITE, "/collections/manga/documents/search") +
        "?q=".concat(encodeURIComponent(query)) +
        "&query_by=".concat(encodeURIComponent(QUERY_BY)) +
        "&page=".concat(pageNo, "&per_page=").concat(PER_PAGE) +
        "&filter_by=".concat(encodeURIComponent(FILTER)) +
        "&sort_by=".concat(encodeURIComponent(sortBy)));
}
/** One Typesense search response (catalog listing or search results). */
function parseNovelCards(data) {
    var res = data;
    if (!Array.isArray(res.hits)) {
        // An error payload or a changed shape must surface as a failure,
        // not as an empty catalog page.
        throw new Error('Novel list response had an unexpected shape');
    }
    var cards = [];
    for (var _i = 0, _a = res.hits; _i < _a.length; _i++) {
        var hit = _a[_i];
        var doc = (hit && hit.document) || {};
        if (typeof doc.id !== 'string' || !doc.id)
            continue;
        cards.push({
            name: String(doc.title || doc.englishTitle || doc.id),
            path: doc.id,
            cover: typeof doc.poster === 'string' && doc.poster
                ? 'https://cdn.atsu.moe' + doc.poster
                : undefined,
        });
    }
    return cards;
}
/** GET /api/manga/page — series details. */
function parseNovelDetails(data) {
    var page = data.mangaPage;
    if (!page || typeof page !== 'object') {
        throw new Error('Novel response had an unexpected shape');
    }
    var genres = [];
    if (Array.isArray(page.genres)) {
        for (var _i = 0, _a = page.genres; _i < _a.length; _i++) {
            var g = _a[_i];
            if (g && typeof g.name === 'string' && g.name)
                genres.push(g.name);
        }
    }
    var scanlatorIds = [];
    if (Array.isArray(page.scanlators)) {
        for (var _b = 0, _c = page.scanlators; _b < _c.length; _b++) {
            var s = _c[_b];
            if (s && typeof s.id === 'string' && s.id)
                scanlatorIds.push(s.id);
        }
    }
    var poster = page.poster || {};
    return {
        name: String(page.title || page.englishTitle || ''),
        cover: typeof poster.image === 'string' && poster.image
            ? CDN + poster.image
            : undefined,
        summary: typeof page.synopsis === 'string' && page.synopsis
            ? page.synopsis
            : undefined,
        genres: genres,
        statusRaw: typeof page.status === 'string' ? page.status : '',
        scanlatorIds: scanlatorIds,
    };
}
/** GET /api/manga/allChapters — raw entries across all groups. */
function parseAllChapters(data) {
    var res = data;
    if (!Array.isArray(res.chapters)) {
        throw new Error('Chapter list response had an unexpected shape');
    }
    var entries = [];
    for (var _i = 0, _a = res.chapters; _i < _a.length; _i++) {
        var c = _a[_i];
        if (!c || typeof c.id !== 'string' || !c.id)
            continue;
        var num = typeof c.number === 'number' ? c.number : parseFloat(String(c.number));
        if (!isFinite(num))
            continue;
        entries.push({
            id: c.id,
            scanId: typeof c.scanlationMangaId === 'string' ? c.scanlationMangaId : '',
            number: num,
            title: String(c.title || 'Chapter ' + num),
        });
    }
    return entries;
}
/**
 * Reduce the all-groups chapter dump to ONE group's set: the group with
 * the most chapters (ties broken by the site's own group order), sorted
 * ascending by chapter number, duplicates by number dropped.
 */
function chooseChapterSet(entries, preferredOrder) {
    var byGroup = new Map();
    for (var _i = 0, entries_1 = entries; _i < entries_1.length; _i++) {
        var e = entries_1[_i];
        var list = byGroup.get(e.scanId);
        if (list)
            list.push(e);
        else
            byGroup.set(e.scanId, [e]);
    }
    var best = [];
    var bestRank = Infinity;
    byGroup.forEach(function (list, scanId) {
        var idx = preferredOrder.indexOf(scanId);
        var rank = idx < 0 ? preferredOrder.length : idx;
        if (list.length > best.length ||
            (list.length === best.length && rank < bestRank)) {
            best = list;
            bestRank = rank;
        }
    });
    var sorted = best.slice().sort(function (a, b) { return a.number - b.number; });
    var seen = new Set();
    var out = [];
    for (var _a = 0, sorted_1 = sorted; _a < sorted_1.length; _a++) {
        var e = sorted_1[_a];
        if (seen.has(e.number))
            continue;
        seen.add(e.number);
        out.push(e);
    }
    return out;
}
function escapeHtml(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
/**
 * Chapter body from GET /api/read/novelChapter: the text arrives as an
 * array of plain-text paragraphs, wrapped into <p> HTML (escaped — the
 * paragraphs are raw text, not HTML).
 */
function parseChapterBody(data) {
    var res = data;
    var rc = res.readNovelChapter;
    if (!rc || !Array.isArray(rc.paragraphs)) {
        throw new Error('Chapter response had an unexpected shape');
    }
    var parts = [];
    for (var _i = 0, _a = rc.paragraphs; _i < _a.length; _i++) {
        var p = _a[_i];
        if (typeof p !== 'string')
            continue;
        var trimmed = p.trim();
        if (trimmed)
            parts.push('<p>' + escapeHtml(trimmed) + '</p>');
    }
    return parts.join('\n');
}
var Atsumaru = /** @class */ (function () {
    function Atsumaru() {
        var _this = this;
        this.id = 'atsumaru';
        this.name = 'Atsumaru';
        this.icon = 'src/en/atsumaru/icon.png';
        this.site = 'https://atsu.moe';
        this.version = '1.0.1';
        this.resolveUrl = function (path) {
            if (/^https?:\/\//i.test(path))
                return path;
            if (path.indexOf('//') === 0)
                return 'https:' + path;
            return "".concat(_this.site, "/title/").concat(path);
        };
    }
    Atsumaru.prototype.popularNovels = function (pageNo, options) {
        return __awaiter(this, void 0, void 0, function () {
            var sortBy, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sortBy = options && options.showLatestNovels ? 'dateAdded:desc' : 'views:desc';
                        return [4 /*yield*/, fetchJson(searchUrl('*', sortBy, pageNo), 'Failed to load popular novels')];
                    case 1:
                        data = _a.sent();
                        return [2 /*return*/, parseNovelCards(data)];
                }
            });
        });
    };
    Atsumaru.prototype.parseNovel = function (novelPath) {
        return __awaiter(this, void 0, void 0, function () {
            var id, details, _a, all, _b, set, chapters, raw, status;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        id = novelPath.replace(/^\/+|\/+$/g, '');
                        _a = parseNovelDetails;
                        return [4 /*yield*/, fetchJson("".concat(SITE, "/api/manga/page?id=").concat(encodeURIComponent(id)), 'Failed to load novel')];
                    case 1:
                        details = _a.apply(void 0, [_c.sent()]);
                        if (!details.name) {
                            throw new Error('Could not load the novel ' + novelPath);
                        }
                        _b = parseAllChapters;
                        return [4 /*yield*/, fetchJson("".concat(SITE, "/api/manga/allChapters?mangaId=").concat(encodeURIComponent(id)), 'Failed to load chapter list')];
                    case 2:
                        all = _b.apply(void 0, [_c.sent()]);
                        set = chooseChapterSet(all, details.scanlatorIds);
                        chapters = set.map(function (e) { return ({
                            name: e.title,
                            path: "".concat(id, "/").concat(e.id),
                            chapterNumber: e.number,
                        }); });
                        raw = details.statusRaw.toLowerCase();
                        status = details.statusRaw === 'Completed'
                            ? novelStatus_1.NovelStatus.Completed
                            : details.statusRaw === 'Ongoing'
                                ? novelStatus_1.NovelStatus.Ongoing
                                : raw.indexOf('hiatus') >= 0
                                    ? novelStatus_1.NovelStatus.OnHiatus
                                    : raw.indexOf('cancel') >= 0
                                        ? novelStatus_1.NovelStatus.Cancelled
                                        : novelStatus_1.NovelStatus.Unknown;
                        return [2 /*return*/, {
                                path: novelPath,
                                name: details.name,
                                cover: details.cover,
                                summary: details.summary,
                                genres: details.genres.length ? details.genres.join(', ') : undefined,
                                status: status,
                                chapters: chapters,
                            }];
                }
            });
        });
    };
    Atsumaru.prototype.parseChapter = function (chapterPath) {
        return __awaiter(this, void 0, void 0, function () {
            var parts, url, content, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        parts = chapterPath.replace(/^\/+|\/+$/g, '').split('/');
                        if (parts.length !== 2) {
                            throw new Error('Unexpected chapter path: ' + chapterPath);
                        }
                        url = "".concat(SITE, "/api/read/novelChapter?mangaId=").concat(encodeURIComponent(parts[0])) +
                            "&chapterId=".concat(encodeURIComponent(parts[1]));
                        _a = parseChapterBody;
                        return [4 /*yield*/, fetchJson(url, 'Failed to load chapter')];
                    case 1:
                        content = _a.apply(void 0, [_b.sent()]);
                        if (!content) {
                            throw new Error('Chapter content not found');
                        }
                        return [2 /*return*/, content];
                }
            });
        });
    };
    Atsumaru.prototype.searchNovels = function (searchTerm, pageNo) {
        return __awaiter(this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fetchJson(searchUrl(searchTerm, 'views:desc', pageNo), 'Failed to search novels')];
                    case 1:
                        data = _a.sent();
                        return [2 /*return*/, parseNovelCards(data)];
                }
            });
        });
    };
    return Atsumaru;
}());
exports.default = new Atsumaru();
