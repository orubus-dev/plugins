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
// BoonNovel — https://reader.boondollars.com
// A self-hosted English library of AI-translated novels (occasionally
// human-edited), served over a clean public JSON API with no login:
//   GET /api/public/books                     full catalog (105 books)
//   GET /api/public/books/<id>                book detail
//   GET /api/public/books/<id>/chapters       chapter list
//   GET /api/public/books/<id>/chapters/<n>   chapter paragraphs
// The catalog call returns everything and ignores paging parameters,
// so popular/latest/search all work off that one list. Chapter bodies
// arrive as plain-text paragraphs, wrapped into <p> HTML (escaped —
// the paragraphs are raw text, not HTML).
var SITE = 'https://reader.boondollars.com';
/**
 * Upper bound on a response this plugin will parse. The biggest
 * payload is a ~1,900-chapter list (a few hundred KB); anything far
 * above legitimate responses is a broken or hostile payload, and
 * parsing it would bill the reader's phone.
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
function isRecord(v) {
    return typeof v === 'object' && v !== null && !Array.isArray(v);
}
function asNumber(v, what) {
    if (typeof v !== 'number' || isNaN(v) || !isFinite(v)) {
        throw new Error('Boonnovels response is missing a valid ' + what);
    }
    return v;
}
function asString(v, what) {
    if (typeof v !== 'string') {
        throw new Error('Boonnovels response is missing a valid ' + what);
    }
    return v;
}
function asStringArray(v, what) {
    if (!Array.isArray(v)) {
        throw new Error('Boonnovels response is missing a valid ' + what);
    }
    var out = [];
    for (var _i = 0, v_1 = v; _i < v_1.length; _i++) {
        var item = v_1[_i];
        if (typeof item === 'string')
            out.push(item);
    }
    return out;
}
// Prefer the medium cover (the grid shows covers at about that size),
// then the full cover, then the thumbnail. All three are null for a
// few books, in which case there is no cover to return.
function pickCover(rec) {
    var medium = rec['cover_medium_url'];
    if (typeof medium === 'string' && medium)
        return medium;
    var full = rec['cover_url'];
    if (typeof full === 'string' && full)
        return full;
    var thumb = rec['cover_thumb_url'];
    if (typeof thumb === 'string' && thumb)
        return thumb;
    return undefined;
}
function parseBookSummary(rec) {
    if (!isRecord(rec)) {
        throw new Error('Boonnovels book entry is not an object');
    }
    return {
        id: asNumber(rec['id'], 'book id'),
        title: asString(rec['title'], 'book title'),
        author: typeof rec['author'] === 'string' ? rec['author'] : '',
        cover: pickCover(rec),
        status: asString(rec['status'], 'book status'),
        tags: asStringArray(rec['tags'], 'book tags'),
        recentViews: typeof rec['recent_views'] === 'number' ? rec['recent_views'] : 0,
        lastChapterDate: typeof rec['last_chapter_date'] === 'string'
            ? rec['last_chapter_date']
            : '',
    };
}
function parseBooksList(data) {
    var res = data;
    if (!Array.isArray(res.books)) {
        throw new Error('Boonnovels book list is missing its books array');
    }
    var books = [];
    for (var _i = 0, _a = res.books; _i < _a.length; _i++) {
        var entry = _a[_i];
        books.push(parseBookSummary(entry));
    }
    return books;
}
function parseBookDetail(data) {
    if (!isRecord(data)) {
        throw new Error('Boonnovels book detail is not an object');
    }
    return {
        id: asNumber(data['id'], 'book id'),
        title: asString(data['title'], 'book title'),
        author: typeof data['author'] === 'string' ? data['author'] : '',
        description: typeof data['description'] === 'string' ? data['description'] : '',
        cover: pickCover(data),
        status: asString(data['status'], 'book status'),
        tags: asStringArray(data['tags'], 'book tags'),
    };
}
function parseChaptersList(data) {
    var res = data;
    if (!Array.isArray(res.chapters)) {
        throw new Error('Boonnovels chapter list is missing its chapters array');
    }
    var chapters = [];
    for (var _i = 0, _a = res.chapters; _i < _a.length; _i++) {
        var item = _a[_i];
        if (!isRecord(item)) {
            throw new Error('Boonnovels chapter entry is not an object');
        }
        // The number is load-bearing (dedupe, ordering, chapter paths),
        // so a bad one throws. A missing title only falls back to the
        // plain "Chapter N" name.
        chapters.push({
            number: asNumber(item['chapter'], 'chapter number'),
            title: typeof item['title'] === 'string' ? item['title'] : '',
        });
    }
    return chapters;
}
function escapeHtml(s) {
    return s
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}
// Chapter bodies arrive as an array of paragraphs (empty strings mark
// paragraph breaks). Empty paragraphs are skipped; if nothing readable
// remains, the chapter is a stub, not an empty chapter.
function parseChapterBody(data) {
    var res = data;
    if (!Array.isArray(res.content)) {
        throw new Error('Boonnovels chapter is missing its content array');
    }
    var parts = [];
    for (var _i = 0, _a = res.content; _i < _a.length; _i++) {
        var para = _a[_i];
        if (typeof para !== 'string') {
            throw new Error('Boonnovels chapter paragraph is not a string');
        }
        if (para.replace(/^\s+|\s+$/g, '') !== '') {
            parts.push('<p>' + escapeHtml(para) + '</p>');
        }
    }
    if (parts.length === 0) {
        throw new Error('Boonnovels chapter has no readable content');
    }
    return parts.join('\n');
}
// Site statuses: ongoing, ongoing-trial, completed, dropped, hiatus.
// Anything else maps to Unknown, never to a guessed status.
function mapStatus(siteStatus) {
    if (siteStatus === 'ongoing' || siteStatus === 'ongoing-trial') {
        return novelStatus_1.NovelStatus.Ongoing;
    }
    if (siteStatus === 'completed')
        return novelStatus_1.NovelStatus.Completed;
    if (siteStatus === 'dropped')
        return novelStatus_1.NovelStatus.Cancelled;
    if (siteStatus === 'hiatus')
        return novelStatus_1.NovelStatus.OnHiatus;
    return novelStatus_1.NovelStatus.Unknown;
}
// The catalog endpoint returns the whole catalog in one call and
// ignores paging parameters, so popular/latest are sorts over that
// list and every page past 1 is empty.
function sortPopular(books) {
    var sorted = books.slice();
    sorted.sort(function (a, b) { return b.recentViews - a.recentViews; });
    return sorted;
}
function sortLatest(books) {
    var sorted = books.slice();
    sorted.sort(function (a, b) {
        var da = Date.parse(a.lastChapterDate);
        var db = Date.parse(b.lastChapterDate);
        var ta = isNaN(da) ? 0 : da;
        var tb = isNaN(db) ? 0 : db;
        return tb - ta;
    });
    return sorted;
}
function searchBooks(books, term) {
    var needle = term.replace(/^\s+|\s+$/g, '').toLowerCase();
    if (needle === '')
        return [];
    var out = [];
    for (var _i = 0, books_1 = books; _i < books_1.length; _i++) {
        var b = books_1[_i];
        if (b.title.toLowerCase().indexOf(needle) !== -1 ||
            b.author.toLowerCase().indexOf(needle) !== -1) {
            out.push(b);
        }
    }
    return out;
}
// Paths are virtual (the site's reader URLs are /read/<id>/<chapter>,
// but the plugin's own paths keep the book id and chapter number
// unambiguous): novel /book/<id>, chapter /book/<id>/chapter/<n>.
function buildNovelPath(bookId) {
    return '/book/' + bookId;
}
function buildChapterPath(bookId, chapter) {
    return '/book/' + bookId + '/chapter/' + chapter;
}
function stripQuery(path) {
    var q = path.indexOf('?');
    return q === -1 ? path : path.slice(0, q);
}
function parseIdSegment(seg, what) {
    if (!/^\d+$/.test(seg)) {
        throw new Error('Invalid Boonnovels ' + what + ' in path');
    }
    var n = parseInt(seg, 10);
    if (isNaN(n) || !isFinite(n)) {
        throw new Error('Invalid Boonnovels ' + what + ' in path');
    }
    return n;
}
function parseNovelPath(novelPath) {
    var parts = stripQuery(novelPath).split('/');
    if (parts.length !== 3 || parts[1] !== 'book') {
        throw new Error('Invalid Boonnovels novel path: ' + novelPath);
    }
    return parseIdSegment(parts[2], 'book id');
}
function parseChapterPath(chapterPath) {
    var parts = stripQuery(chapterPath).split('/');
    if (parts.length !== 5 || parts[1] !== 'book' || parts[3] !== 'chapter') {
        throw new Error('Invalid Boonnovels chapter path: ' + chapterPath);
    }
    return {
        bookId: parseIdSegment(parts[2], 'book id'),
        chapter: parseIdSegment(parts[4], 'chapter number'),
    };
}
function chapterName(ref) {
    if (ref.title !== '')
        return 'Chapter ' + ref.number + ': ' + ref.title;
    return 'Chapter ' + ref.number;
}
function buildChapters(refs, bookId) {
    var sorted = refs.slice();
    sorted.sort(function (a, b) { return a.number - b.number; });
    var seen = {};
    var chapters = [];
    for (var _i = 0, sorted_1 = sorted; _i < sorted_1.length; _i++) {
        var ref = sorted_1[_i];
        if (seen[ref.number])
            continue;
        seen[ref.number] = true;
        chapters.push({
            name: chapterName(ref),
            path: buildChapterPath(bookId, ref.number),
            chapterNumber: ref.number,
        });
    }
    return chapters;
}
function toNovelItem(b) {
    var item = {
        name: b.title,
        path: buildNovelPath(b.id),
    };
    if (b.cover !== undefined)
        item.cover = b.cover;
    return item;
}
var BoonNovel = /** @class */ (function () {
    function BoonNovel() {
        var _this = this;
        this.id = 'boonnovel';
        this.name = 'BoonNovel';
        this.icon = 'src/en/boonnovel/icon.png';
        this.site = 'https://reader.boondollars.com';
        this.version = '1.0.0';
        // resolveUrl MUST pass absolute URLs through unchanged: the app
        // also passes the novel's cover URL through here (EPUB export does
        // this), and prefixing the site onto an absolute cover breaks it.
        // Virtual plugin paths map onto the site's real routes: a novel
        // opens at /library/book/<id>, a chapter reads at /read/<id>/<n>.
        this.resolveUrl = function (path) {
            if (/^https?:\/\//i.test(path))
                return path;
            if (path.indexOf('//') === 0)
                return 'https:' + path;
            try {
                var parsed = parseChapterPath(path);
                return "".concat(SITE, "/read/").concat(parsed.bookId, "/").concat(parsed.chapter);
            }
            catch (_a) {
                // not a chapter path, try the novel path below
            }
            try {
                var bookId = parseNovelPath(path);
                return "".concat(SITE, "/library/book/").concat(bookId);
            }
            catch (_b) {
                // not a plugin path either, fall through to the plain prefix
            }
            return _this.site + path;
        };
    }
    BoonNovel.prototype.popularNovels = function (pageNo, options) {
        return __awaiter(this, void 0, void 0, function () {
            var data, books, sorted;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (pageNo !== 1)
                            return [2 /*return*/, []];
                        return [4 /*yield*/, fetchJson("".concat(SITE, "/api/public/books"), 'Failed to load popular novels')];
                    case 1:
                        data = _a.sent();
                        books = parseBooksList(data);
                        sorted = options && options.showLatestNovels
                            ? sortLatest(books)
                            : sortPopular(books);
                        return [2 /*return*/, sorted.map(function (b) { return toNovelItem(b); })];
                }
            });
        });
    };
    BoonNovel.prototype.parseNovel = function (novelPath) {
        return __awaiter(this, void 0, void 0, function () {
            var bookId, detail, _a, refs, _b, novel;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        bookId = parseNovelPath(novelPath);
                        _a = parseBookDetail;
                        return [4 /*yield*/, fetchJson("".concat(SITE, "/api/public/books/").concat(bookId), 'Failed to load novel')];
                    case 1:
                        detail = _a.apply(void 0, [_c.sent()]);
                        _b = parseChaptersList;
                        return [4 /*yield*/, fetchJson("".concat(SITE, "/api/public/books/").concat(bookId, "/chapters"), 'Failed to load chapter list')];
                    case 2:
                        refs = _b.apply(void 0, [_c.sent()]);
                        novel = {
                            path: novelPath,
                            name: detail.title,
                            author: detail.author ? detail.author : undefined,
                            summary: detail.description ? detail.description : undefined,
                            status: mapStatus(detail.status),
                            genres: detail.tags.length ? detail.tags.join(', ') : undefined,
                            chapters: buildChapters(refs, bookId),
                        };
                        if (detail.cover !== undefined)
                            novel.cover = detail.cover;
                        return [2 /*return*/, novel];
                }
            });
        });
    };
    // The app opens a novel already saved in its database but with no
    // stored chapters through parsePage, not parseNovel — and it throws
    // when the plugin has none. This plugin has no server-side chapter
    // paging (the app pages the full list itself), so every page is the
    // whole list.
    BoonNovel.prototype.parsePage = function (novelPath, page) {
        return __awaiter(this, void 0, void 0, function () {
            var novel;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        void page;
                        return [4 /*yield*/, this.parseNovel(novelPath)];
                    case 1:
                        novel = _a.sent();
                        return [2 /*return*/, { chapters: novel.chapters || [] }];
                }
            });
        });
    };
    BoonNovel.prototype.parseChapter = function (chapterPath) {
        return __awaiter(this, void 0, void 0, function () {
            var parsed, content, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        parsed = parseChapterPath(chapterPath);
                        _a = parseChapterBody;
                        return [4 /*yield*/, fetchJson("".concat(SITE, "/api/public/books/").concat(parsed.bookId, "/chapters/").concat(parsed.chapter), 'Failed to load chapter')];
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
    BoonNovel.prototype.searchNovels = function (searchTerm, pageNo) {
        return __awaiter(this, void 0, void 0, function () {
            var data, books;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (pageNo !== 1)
                            return [2 /*return*/, []];
                        return [4 /*yield*/, fetchJson("".concat(SITE, "/api/public/books"), 'Failed to search novels')];
                    case 1:
                        data = _a.sent();
                        books = parseBooksList(data);
                        return [2 /*return*/, searchBooks(books, searchTerm).map(function (b) { return toNovelItem(b); })];
                }
            });
        });
    };
    return BoonNovel;
}());
exports.default = new BoonNovel();
