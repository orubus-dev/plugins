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
var SITE = 'https://www.rechapters.com';
var PAGE_SIZE = 20;
// Chapter-list buckets fetched concurrently per round.
var BUCKET_BATCH = 5;
/** JSON-LD `author` may be an array, a single Person object, or a string. */
function ldAuthorNames(author) {
    var list = Array.isArray(author) ? author : author ? [author] : [];
    return list
        .map(function (a) {
        if (typeof a === 'string')
            return a.trim();
        if (a && typeof a === 'object' && typeof a.name === 'string') {
            return a.name.trim();
        }
        return '';
    })
        .filter(Boolean);
}
/**
 * The search API pages with an opaque cursor that is base64 of
 * `{"offset":N}`; building it directly lets any page be requested without
 * walking the previous ones. The payload is ASCII, so this minimal encoder
 * is enough (btoa is not guaranteed in the app runtime).
 */
function offsetCursor(offset) {
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    var input = '{"offset":' + offset + '}';
    var out = '';
    for (var i = 0; i < input.length; i += 3) {
        var a = input.charCodeAt(i);
        var b = i + 1 < input.length ? input.charCodeAt(i + 1) : NaN;
        var c = i + 2 < input.length ? input.charCodeAt(i + 2) : NaN;
        var n = (a << 16) | ((b || 0) << 8) | (c || 0);
        out += chars[(n >> 18) & 63] + chars[(n >> 12) & 63];
        out += isNaN(b) ? '=' : chars[(n >> 6) & 63];
        out += isNaN(c) ? '=' : chars[n & 63];
    }
    return out;
}
function escapeHtml(text) {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}
/** Book paths end in `-<12-char nanoId>`, e.g. `book/shadow-slave-r2k2ivbd6ez4`. */
function bookNanoId(novelPath) {
    var m = /-([23456789a-z]{12})\/?$/.exec(novelPath);
    if (!m)
        throw new Error('Invalid ReChapters novel path: ' + novelPath);
    return m[1];
}
function getApi(path) {
    return __awaiter(this, void 0, void 0, function () {
        var res, json;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, fetch_1.fetchApi)(SITE + path)];
                case 1:
                    res = _a.sent();
                    if (!res.ok)
                        throw new Error('ReChapters API error ' + res.status);
                    return [4 /*yield*/, res.json()];
                case 2:
                    json = (_a.sent());
                    if (!json || !json.success) {
                        throw new Error((json && json.message) || 'ReChapters API error');
                    }
                    return [2 /*return*/, json.data];
            }
        });
    });
}
var ReChapters = /** @class */ (function () {
    function ReChapters() {
        this.id = 'rechapters';
        this.name = 'ReChapters';
        this.icon = 'src/en/rechapters/icon.png';
        this.site = SITE;
        this.version = '1.0.0';
        this.filters = {
            sort: {
                type: filterInputs_1.FilterTypes.Picker,
                label: 'Sort by',
                value: 'popularity_score',
                options: [
                    { label: 'Popularity', value: 'popularity_score' },
                    { label: 'Latest update', value: 'last_chapter_at_ts' },
                    { label: 'Rating', value: 'rating_average' },
                    { label: 'Rating count', value: 'rating_count' },
                    { label: 'Chapter count', value: 'chapter_count' },
                    { label: 'Word count', value: 'word_count' },
                ],
            },
            writing: {
                type: filterInputs_1.FilterTypes.Picker,
                label: 'Status',
                value: '',
                options: [
                    { label: 'All', value: '' },
                    { label: 'Ongoing', value: '1' },
                    { label: 'Completed', value: '2' },
                ],
            },
        };
        this.resolveUrl = function (path) { return SITE + '/' + path; };
    }
    ReChapters.prototype.search = function (params, pageNo) {
        return __awaiter(this, void 0, void 0, function () {
            var query, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = params + '&pageSize=' + PAGE_SIZE;
                        if (pageNo > 1) {
                            query += '&cursor=' + offsetCursor((pageNo - 1) * PAGE_SIZE);
                        }
                        return [4 /*yield*/, getApi('/api/search?' + query)];
                    case 1:
                        data = _a.sent();
                        return [2 /*return*/, data.items.map(function (item) { return ({
                                name: item.title,
                                path: 'book/' + item.slug + '-' + item.nanoId,
                                cover: item.hasCover && item.coverUrl ? item.coverUrl : defaultCover_1.defaultCover,
                            }); })];
                }
            });
        });
    };
    ReChapters.prototype.popularNovels = function (pageNo_1, _a) {
        return __awaiter(this, arguments, void 0, function (pageNo, _b) {
            var sort, params, writing;
            var _c, _d;
            var showLatestNovels = _b.showLatestNovels, filters = _b.filters;
            return __generator(this, function (_e) {
                sort = showLatestNovels
                    ? 'last_chapter_at_ts'
                    : ((_c = filters === null || filters === void 0 ? void 0 : filters.sort) === null || _c === void 0 ? void 0 : _c.value) || 'popularity_score';
                params = 'sort=' + encodeURIComponent(sort);
                writing = (_d = filters === null || filters === void 0 ? void 0 : filters.writing) === null || _d === void 0 ? void 0 : _d.value;
                if (writing)
                    params += '&writing=' + encodeURIComponent(writing);
                return [2 /*return*/, this.search(params, pageNo)];
            });
        });
    };
    ReChapters.prototype.searchNovels = function (searchTerm, pageNo) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.search('q=' + encodeURIComponent(searchTerm) + '&sort=relevance', pageNo)];
            });
        });
    };
    ReChapters.prototype.parseNovel = function (novelPath) {
        return __awaiter(this, void 0, void 0, function () {
            var nanoId, res, $, _a, ld, novel, authors, genres, metrics, buckets, lists, i, batch, chapters, seen, _b, lists_1, list, _c, list_1, c, num;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        nanoId = bookNanoId(novelPath);
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(this.resolveUrl(novelPath))];
                    case 1:
                        res = _d.sent();
                        if (!res.ok)
                            throw new Error('Could not load novel: HTTP ' + res.status);
                        _a = cheerio_1.load;
                        return [4 /*yield*/, res.text()];
                    case 2:
                        $ = _a.apply(void 0, [_d.sent()]);
                        ld = {};
                        $('script[type="application/ld+json"]').each(function (_i, el) {
                            try {
                                var parsed = JSON.parse($(el).html() || '');
                                if (parsed && parsed['@type'] === 'Book')
                                    ld = parsed;
                            }
                            catch (_a) {
                                // ignore unrelated or malformed JSON-LD
                            }
                        });
                        novel = {
                            path: novelPath,
                            name: $('h1').first().text().trim() || ld.name || 'Untitled',
                            cover: ld.image || defaultCover_1.defaultCover,
                        };
                        authors = ldAuthorNames(ld.author);
                        if (authors.length)
                            novel.author = authors.join(', ');
                        if (ld.description)
                            novel.summary = ld.description.trim();
                        genres = $('ul[aria-label="Book tags"] li[data-tag-item] a')
                            .map(function (_i, el) { return $(el).attr('aria-label') || $(el).text().trim(); })
                            .get()
                            .filter(Boolean);
                        if (genres.length)
                            novel.genres = genres.join(', ');
                        metrics = $('[aria-label="Book metrics"] span')
                            .map(function (_i, el) { return $(el).text().trim().toLowerCase(); })
                            .get();
                        if (metrics.includes('completed'))
                            novel.status = novelStatus_1.NovelStatus.Completed;
                        else if (metrics.includes('ongoing'))
                            novel.status = novelStatus_1.NovelStatus.Ongoing;
                        else if (metrics.includes('hiatus'))
                            novel.status = novelStatus_1.NovelStatus.OnHiatus;
                        else
                            novel.status = novelStatus_1.NovelStatus.Unknown;
                        return [4 /*yield*/, getApi('/api/book/' + nanoId + '/chapters/buckets')];
                    case 3:
                        buckets = (_d.sent()).buckets;
                        lists = [];
                        i = 0;
                        _d.label = 4;
                    case 4:
                        if (!(i < buckets.length)) return [3 /*break*/, 7];
                        return [4 /*yield*/, Promise.all(buckets
                                .slice(i, i + BUCKET_BATCH)
                                .map(function (b) {
                                return getApi('/api/book/' +
                                    nanoId +
                                    '/chapters?bucket=' +
                                    b.index +
                                    '&order=asc').then(function (d) { return d.items; });
                            }))];
                    case 5:
                        batch = _d.sent();
                        lists.push.apply(lists, batch);
                        _d.label = 6;
                    case 6:
                        i += BUCKET_BATCH;
                        return [3 /*break*/, 4];
                    case 7:
                        chapters = [];
                        seen = {};
                        for (_b = 0, lists_1 = lists; _b < lists_1.length; _b++) {
                            list = lists_1[_b];
                            for (_c = 0, list_1 = list; _c < list_1.length; _c++) {
                                c = list_1[_c];
                                if (seen[c.chapterNanoId])
                                    continue;
                                seen[c.chapterNanoId] = true;
                                num = parseFloat(c.orderNum);
                                chapters.push({
                                    name: c.title,
                                    path: novelPath + '/' + c.chapterNanoId,
                                    releaseTime: c.createdAt,
                                    chapterNumber: isNaN(num) ? undefined : num,
                                });
                            }
                        }
                        chapters.sort(function (a, b) { return (a.chapterNumber || 0) - (b.chapterNumber || 0); });
                        novel.chapters = chapters;
                        return [2 /*return*/, novel];
                }
            });
        });
    };
    ReChapters.prototype.parseChapter = function (chapterPath) {
        return __awaiter(this, void 0, void 0, function () {
            var parts, chapterId, nanoId, base, first, pages, p, _a, _b, html, _c, pages_1, page, _d, _e, block;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        parts = chapterPath.split('/');
                        chapterId = parts.pop() || '';
                        nanoId = bookNanoId(parts.join('/'));
                        base = '/api/account/chapter/' +
                            nanoId +
                            '/' +
                            encodeURIComponent(chapterId) +
                            '/content';
                        return [4 /*yield*/, getApi(base)];
                    case 1:
                        first = _f.sent();
                        pages = [first];
                        p = 2;
                        _f.label = 2;
                    case 2:
                        if (!(p <= first.pageMetas.length)) return [3 /*break*/, 5];
                        _b = (_a = pages).push;
                        return [4 /*yield*/, getApi(base + '?weightPage=' + p)];
                    case 3:
                        _b.apply(_a, [_f.sent()]);
                        _f.label = 4;
                    case 4:
                        p++;
                        return [3 /*break*/, 2];
                    case 5:
                        html = [];
                        for (_c = 0, pages_1 = pages; _c < pages_1.length; _c++) {
                            page = pages_1[_c];
                            for (_d = 0, _e = page.pageBlocks; _d < _e.length; _d++) {
                                block = _e[_d].block;
                                if (block.type === 'text' && block.content) {
                                    html.push('<p>' + escapeHtml(block.content) + '</p>');
                                }
                            }
                        }
                        return [2 /*return*/, html.join('\n')];
                }
            });
        });
    };
    return ReChapters;
}());
exports.default = new ReChapters();
