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
var filterInputs_1 = require("@libs/filterInputs");
var defaultCover_1 = require("@libs/defaultCover");
// Novelito -- https://noveli.to
// A public library front-end with a plain JSON API behind the SPA. No
// account, cookie or JS challenge is needed for the catalogue, the
// search, the novel detail, the chapter list or the chapter text:
//   GET /api/novels                      catalogue (paged + filtered)
//   GET /api/novels/<id>                 novel detail
//   GET /api/novels/<id>/chapters        full chapter list
//   GET /api/novels/<id>/chapters/<cid>  chapter paragraphs
// The chapter endpoint refuses requests without browser-like headers
// (403 "direct chapter extraction is not permitted"), so every request
// sends a browser User-Agent and a site Referer, as the site's own
// reader does.
var SITE = 'https://noveli.to';
var API = SITE + '/api';
/** Same page size the site itself uses for its browse grid. */
var PAGE_SIZE = 36;
/**
 * Upper bound on a response this plugin will parse. The largest
 * payload is a full chapter list (~800 KB for a 3,200-chapter novel);
 * anything far above legitimate responses is broken or hostile, and
 * parsing it would bill the reader's phone.
 */
var MAX_RESPONSE_CHARS = 8000000;
var BROWSER_HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
    'Accept': 'application/json, text/plain, */*',
    'Referer': SITE + '/',
};
/**
 * Error with the HTTP status attached. Tooling (e.g. the repo's live
 * check) reads `error.status` to tell a site block or outage (403/429/503)
 * apart from a plugin bug, so always throw fetch failures this way.
 */
function httpError(message, status) {
    var err = new Error(message);
    err.status = status;
    return err;
}
var MAX_RETRIES = 2;
var MAX_RETRY_WAIT_MS = 10000;
function sleep(ms) {
    return new Promise(function (resolve) { return setTimeout(resolve, ms); });
}
function fetchJson(url, what) {
    return __awaiter(this, void 0, void 0, function () {
        var res, attempt, retryAfter, waitMs, text, data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, fetch_1.fetchApi)(url, { headers: BROWSER_HEADERS })];
                case 1:
                    res = _a.sent();
                    attempt = 0;
                    _a.label = 2;
                case 2:
                    if (!(res.status === 429 && attempt < MAX_RETRIES)) return [3 /*break*/, 6];
                    retryAfter = parseInt(res.headers.get('Retry-After') || '', 10);
                    waitMs = Math.min(isNaN(retryAfter) ? 1000 : retryAfter * 1000, MAX_RETRY_WAIT_MS);
                    return [4 /*yield*/, sleep(waitMs)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, (0, fetch_1.fetchApi)(url, { headers: BROWSER_HEADERS })];
                case 4:
                    res = _a.sent();
                    _a.label = 5;
                case 5:
                    attempt++;
                    return [3 /*break*/, 2];
                case 6:
                    if (!res.ok) {
                        throw httpError("".concat(what, ": HTTP ").concat(res.status), res.status);
                    }
                    return [4 /*yield*/, res.text()];
                case 7:
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
function isRecord(value) {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}
function asString(value, what) {
    if (typeof value !== 'string') {
        throw new Error('Novelito response is missing a valid ' + what);
    }
    return value;
}
function asNumber(value, what) {
    if (typeof value !== 'number' || isNaN(value) || !isFinite(value)) {
        throw new Error('Novelito response is missing a valid ' + what);
    }
    return value;
}
var NAMED_ENTITIES = {
    nbsp: ' ',
    amp: '&',
    lt: '<',
    gt: '>',
    quot: '"',
    apos: "'",
    lsquo: '\u2018',
    rsquo: '\u2019',
    sbquo: '\u201A',
    ldquo: '\u201C',
    rdquo: '\u201D',
    bdquo: '\u201E',
    hellip: '\u2026',
    ndash: '\u2013',
    mdash: '\u2014',
    middot: '\u00B7',
    bull: '\u2022',
    laquo: '\u00AB',
    raquo: '\u00BB',
    copy: '\u00A9',
    deg: '\u00B0',
    times: '\u00D7',
};
function fromCodePoint(code) {
    if (code > 0x10ffff || (code >= 0xd800 && code <= 0xdfff))
        return '';
    if (code <= 0xffff)
        return String.fromCharCode(code);
    var offset = code - 0x10000;
    return String.fromCharCode(0xd800 + (offset >> 10), 0xdc00 + (offset & 0x3ff));
}
// Single pass, so an escaped entity such as "&amp;lt;" decodes only once.
function decodeEntities(text) {
    return text.replace(/&(?:#(\d+)|#x([0-9a-f]+)|([a-z]+));/gi, function (match, dec, hex, name) {
        if (dec)
            return fromCodePoint(parseInt(dec, 10)) || match;
        if (hex)
            return fromCodePoint(parseInt(hex, 16)) || match;
        var named = NAMED_ENTITIES[(name || '').toLowerCase()];
        return named === undefined ? match : named;
    });
}
/** Novel descriptions are sometimes plain text, sometimes HTML. */
function plainText(raw) {
    var withoutTags = raw
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<\/p>/gi, '\n')
        .replace(/<[^>]*>/g, '');
    return decodeEntities(withoutTags)
        .replace(/[ \t]+/g, ' ')
        .replace(/\n{3,}/g, '\n\n')
        .replace(/^\s+|\s+$/g, '');
}
function escapeHtml(text) {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}
// Covers come back either as an absolute URL or as a path below the
// site root, and are occasionally empty.
function coverUrl(value) {
    if (typeof value !== 'string' || value === '')
        return undefined;
    if (/^https?:\/\//i.test(value))
        return value;
    if (value.indexOf('//') === 0)
        return 'https:' + value;
    return SITE + (value.charAt(0) === '/' ? value : '/' + value);
}
function novelPath(novelId) {
    return '/novel/' + novelId;
}
function chapterPath(novelId, chapterId) {
    return '/novel/' + novelId + '/chapter/' + chapterId;
}
function stripQuery(path) {
    var query = path.indexOf('?');
    return query === -1 ? path : path.slice(0, query);
}
function parseIdSegment(segment, what) {
    if (!/^\d+$/.test(segment)) {
        throw new Error('Invalid Novelito ' + what + ' in path');
    }
    var value = parseInt(segment, 10);
    if (isNaN(value) || !isFinite(value)) {
        throw new Error('Invalid Novelito ' + what + ' in path');
    }
    return value;
}
function parseNovelPath(path) {
    var parts = stripQuery(path).split('/');
    if (parts.length !== 3 || parts[0] !== '' || parts[1] !== 'novel') {
        throw new Error('Invalid Novelito novel path: ' + path);
    }
    return parseIdSegment(parts[2], 'novel id');
}
function parseChapterPath(path) {
    var parts = stripQuery(path).split('/');
    if (parts.length !== 5 ||
        parts[0] !== '' ||
        parts[1] !== 'novel' ||
        parts[3] !== 'chapter') {
        throw new Error('Invalid Novelito chapter path: ' + path);
    }
    return {
        novelId: parseIdSegment(parts[2], 'novel id'),
        chapterId: parseIdSegment(parts[4], 'chapter id'),
    };
}
// The list endpoint reports lowercase statuses ("ongoing",
// "completed"), the detail endpoint title-cases them. Anything else
// maps to Unknown, never to a guessed status.
function mapStatus(siteStatus) {
    var value = siteStatus.toLowerCase();
    if (value === 'ongoing' || value === 'releasing')
        return novelStatus_1.NovelStatus.Ongoing;
    if (value === 'completed')
        return novelStatus_1.NovelStatus.Completed;
    if (value === 'hiatus' || value === 'on hiatus' || value === 'paused') {
        return novelStatus_1.NovelStatus.OnHiatus;
    }
    if (value === 'dropped' || value === 'cancelled' || value === 'canceled') {
        return novelStatus_1.NovelStatus.Cancelled;
    }
    return novelStatus_1.NovelStatus.Unknown;
}
function toNovelItem(record) {
    if (!isRecord(record)) {
        throw new Error('Novelito novel entry is not an object');
    }
    var id = asNumber(record['id'], 'novel id');
    return {
        name: asString(record['title'], 'novel title'),
        path: novelPath(id),
        cover: coverUrl(record['cover_image']) || defaultCover_1.defaultCover,
    };
}
function fetchNovelList(params) {
    return __awaiter(this, void 0, void 0, function () {
        var query, data, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    query = Object.keys(params)
                        .map(function (key) { return key + '=' + encodeURIComponent(params[key]); })
                        .join('&');
                    return [4 /*yield*/, fetchJson("".concat(API, "/novels?").concat(query), 'Failed to load novels')];
                case 1:
                    data = _a.sent();
                    res = data;
                    if (res.success !== true || !Array.isArray(res.data)) {
                        throw new Error('Novelito novel list is missing its data array');
                    }
                    return [2 /*return*/, res.data];
            }
        });
    });
}
function parseChapters(data, novelId) {
    var res = data;
    if (!Array.isArray(res.chapters)) {
        throw new Error('Novelito chapter list is missing its chapters array');
    }
    var chapters = [];
    var seen = {};
    for (var _i = 0, _a = res.chapters; _i < _a.length; _i++) {
        var entry = _a[_i];
        if (!isRecord(entry)) {
            throw new Error('Novelito chapter entry is not an object');
        }
        var id = asNumber(entry['id'], 'chapter id');
        if (seen[String(id)])
            continue;
        seen[String(id)] = true;
        var number = entry['chapter_number'];
        var chapterNumber = typeof number === 'number' && isFinite(number) ? number : undefined;
        var rawTitle = typeof entry['title'] === 'string' ? entry['title'] : '';
        var title = rawTitle.replace(/^\s+|\s+$/g, '');
        var chapter = {
            name: title !== ''
                ? title
                : chapterNumber !== undefined
                    ? 'Chapter ' + chapterNumber
                    : 'Chapter',
            path: chapterPath(novelId, id),
        };
        if (chapterNumber !== undefined)
            chapter.chapterNumber = chapterNumber;
        var createdAt = entry['created_at'];
        if (typeof createdAt === 'string' && /^\d{4}-\d{2}-\d{2}/.test(createdAt)) {
            chapter.releaseTime = createdAt.slice(0, 10);
        }
        chapters.push(chapter);
    }
    // The API returns chapters in reading order already; sorting here
    // keeps the list correct even if a volume-based response interleaves
    // them.
    var order = {};
    for (var i = 0; i < chapters.length; i++) {
        var n = chapters[i].chapterNumber;
        order[chapters[i].path] = n === undefined ? i : n;
    }
    chapters.sort(function (a, b) { return order[a.path] - order[b.path]; });
    return chapters;
}
var READER_CHROME = [
    'Settings',
    'Font Size',
    'A',
    'A',
    '16px',
    'Font Family',
    'Background Color',
];
var SITE_NOTICE_TEXTS = [
    'Provided by Noveli.to',
    'If you want to support more free releases please read on Noveli.to',
];
function parseChapterBody(data) {
    var res = data;
    if (!isRecord(res.chapter)) {
        throw new Error('Novelito chapter response is missing its chapter');
    }
    var paragraphs = res.chapter['paragraphs'];
    if (!Array.isArray(paragraphs)) {
        throw new Error('Novelito chapter is missing its paragraphs array');
    }
    var texts = [];
    for (var _i = 0, paragraphs_1 = paragraphs; _i < paragraphs_1.length; _i++) {
        var paragraph = paragraphs_1[_i];
        if (!isRecord(paragraph))
            continue;
        var html = typeof paragraph['html'] === 'string' ? paragraph['html'] : '';
        // The site injects a "Provided by Noveli.to" notice at the start
        // and a support line at the end of every chapter; it also hides a
        // couple of site notices inside the payload. None of them are part
        // of the story.
        if (paragraph['isHoneypot'] === true ||
            paragraph['isMidWatermark'] === true ||
            html.indexOf('watermark-notice') !== -1 ||
            html.indexOf('noveli-canary') !== -1) {
            continue;
        }
        var text = typeof paragraph['text'] === 'string'
            ? decodeEntities(paragraph['text'])
            : plainText(html);
        var trimmed = text.replace(/^\s+|\s+$/g, '');
        if (trimmed === '' || SITE_NOTICE_TEXTS.indexOf(trimmed) !== -1) {
            continue;
        }
        texts.push(trimmed);
    }
    var start = 0;
    if (texts.length >= READER_CHROME.length) {
        var matches = true;
        for (var i = 0; i < READER_CHROME.length; i++) {
            if (texts[i] !== READER_CHROME[i]) {
                matches = false;
                break;
            }
        }
        if (matches)
            start = READER_CHROME.length;
    }
    var parts = [];
    for (var i = start; i < texts.length; i++) {
        parts.push('<p>' + escapeHtml(texts[i]) + '</p>');
    }
    if (parts.length === 0) {
        throw new Error('Novelito chapter has no readable content');
    }
    return parts.join('\n');
}
var Novelito = /** @class */ (function () {
    function Novelito() {
        this.id = 'novelito';
        this.name = 'Novelito';
        this.icon = 'src/en/novelito/icon.png';
        this.site = SITE;
        this.version = '1.0.0';
        this.filters = {
            sort: {
                label: 'Sort Results By',
                value: 'popular',
                options: [
                    { label: 'Popular', value: 'popular' },
                    { label: 'Trending', value: 'trending' },
                    { label: 'Top Rated', value: 'rating' },
                    { label: 'Most Viewed', value: 'views' },
                ],
                type: filterInputs_1.FilterTypes.Picker,
            },
            status: {
                label: 'Status',
                value: 'All',
                options: [
                    { label: 'All', value: 'All' },
                    { label: 'Ongoing', value: 'Ongoing' },
                    { label: 'Completed', value: 'Completed' },
                ],
                type: filterInputs_1.FilterTypes.Picker,
            },
            genres: {
                label: 'Genres',
                value: [],
                options: [
                    { label: 'LitRPG', value: 'LitRPG' },
                    { label: 'Progression', value: 'Progression' },
                    { label: 'Fantasy', value: 'Fantasy' },
                    { label: 'Action', value: 'Action' },
                    { label: 'Adventure', value: 'Adventure' },
                    { label: 'Cultivation', value: 'Cultivation' },
                    { label: 'Martial Arts', value: 'Martial Arts' },
                    { label: 'Sci-Fi', value: 'Sci-Fi' },
                    { label: 'Time Loop', value: 'Time Loop' },
                    { label: 'Comedy', value: 'Comedy' },
                    { label: 'Romance', value: 'Romance' },
                ],
                type: filterInputs_1.FilterTypes.CheckboxGroup,
            },
        };
        // resolveUrl MUST pass absolute URLs through unchanged: the app
        // passes novel cover URLs through here too (EPUB export), and
        // prefixing the site onto an absolute cover breaks it. Plugin paths
        // mirror the site's own routes, so they work unchanged.
        this.resolveUrl = function (path) {
            if (/^https?:\/\//i.test(path))
                return path;
            if (path.indexOf('//') === 0)
                return 'https:' + path;
            return SITE + path;
        };
    }
    Novelito.prototype.popularNovels = function (pageNo_1, _a) {
        return __awaiter(this, arguments, void 0, function (pageNo, _b) {
            var params, genres, novels;
            var showLatestNovels = _b.showLatestNovels, filters = _b.filters;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        params = {
                            page: String(pageNo),
                            limit: String(PAGE_SIZE),
                            sort: showLatestNovels ? 'newest' : filters.sort.value,
                        };
                        if (filters.status.value !== 'All') {
                            params.status = filters.status.value;
                        }
                        genres = filters.genres.value.filter(function (genre) { return genre !== ''; });
                        if (genres.length > 0) {
                            params.genres = genres.join(',');
                        }
                        return [4 /*yield*/, fetchNovelList(params)];
                    case 1:
                        novels = _c.sent();
                        return [2 /*return*/, novels.map(toNovelItem)];
                }
            });
        });
    };
    Novelito.prototype.parseNovel = function (novelPathParam) {
        return __awaiter(this, void 0, void 0, function () {
            var novelId, detail, record, info, chapterList, novel, cover, summary, genres, _i, _a, genre, rating;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        novelId = parseNovelPath(novelPathParam);
                        return [4 /*yield*/, fetchJson("".concat(API, "/novels/").concat(novelId), 'Failed to load novel')];
                    case 1:
                        detail = _b.sent();
                        record = detail;
                        if (!isRecord(record.data)) {
                            throw new Error('Novelito novel detail is missing its data object');
                        }
                        info = record.data;
                        return [4 /*yield*/, fetchJson("".concat(API, "/novels/").concat(novelId, "/chapters"), 'Failed to load chapter list')];
                    case 2:
                        chapterList = _b.sent();
                        novel = {
                            path: novelPathParam,
                            name: asString(info['title'], 'novel title'),
                            chapters: parseChapters(chapterList, novelId),
                        };
                        if (typeof info['author'] === 'string' && info['author'] !== '') {
                            novel.author = info['author'];
                        }
                        cover = coverUrl(info['cover_image']);
                        novel.cover = cover || defaultCover_1.defaultCover;
                        if (typeof info['description'] === 'string') {
                            summary = plainText(info['description']);
                            if (summary !== '')
                                novel.summary = summary;
                        }
                        if (Array.isArray(info['genres'])) {
                            genres = [];
                            for (_i = 0, _a = info['genres']; _i < _a.length; _i++) {
                                genre = _a[_i];
                                if (typeof genre === 'string' && genre !== '')
                                    genres.push(genre);
                            }
                            if (genres.length > 0)
                                novel.genres = genres.join(', ');
                        }
                        if (typeof info['status'] === 'string') {
                            novel.status = mapStatus(info['status']);
                        }
                        rating = info['rating'];
                        if (typeof rating === 'number' && isFinite(rating) && rating > 0) {
                            novel.rating = rating;
                        }
                        return [2 /*return*/, novel];
                }
            });
        });
    };
    Novelito.prototype.parseChapter = function (path) {
        return __awaiter(this, void 0, void 0, function () {
            var parsed, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        parsed = parseChapterPath(path);
                        return [4 /*yield*/, fetchJson("".concat(API, "/novels/").concat(parsed.novelId, "/chapters/").concat(parsed.chapterId), 'Failed to load chapter')];
                    case 1:
                        data = _a.sent();
                        return [2 /*return*/, parseChapterBody(data)];
                }
            });
        });
    };
    Novelito.prototype.searchNovels = function (searchTerm, pageNo) {
        return __awaiter(this, void 0, void 0, function () {
            var term, novels;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        term = searchTerm.replace(/^\s+|\s+$/g, '');
                        if (term === '')
                            return [2 /*return*/, []];
                        return [4 /*yield*/, fetchNovelList({
                                search: term,
                                page: String(pageNo),
                                limit: String(PAGE_SIZE),
                            })];
                    case 1:
                        novels = _a.sent();
                        return [2 /*return*/, novels.map(toNovelItem)];
                }
            });
        });
    };
    return Novelito;
}());
exports.default = new Novelito();
