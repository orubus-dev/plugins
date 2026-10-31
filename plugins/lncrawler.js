"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
// LNCrawler — https://lncrawler.monster
// The web frontend is a React SPA; all data comes from its public JSON
// API at https://api.lncrawler.monster:
//   GET /novels/search/?query=&language=en&page=N&page_size=20
//   GET /novels/<slug>/                  novel + all of its sources
//   GET /novels/<slug>/<source>/         per-source details
//   GET /novels/<slug>/<source>/chapters/?page=N   paginated, 100/page
//   GET /novels/<slug>/<source>/chapter/<id>/       chapter body HTML
// A novel aggregates several source sites and languages (5,993 novels,
// ~4,907 with English sources). This plugin reads each novel through the
// English source with the most available chapters.
var API = 'https://api.lncrawler.monster';
var PAGE_SIZE = 20;
// Safety bound for the chapter-list page loop (100 chapters per page).
var MAX_CHAPTER_PAGES = 500;
/**
 * Upper bound on a response this plugin will parse. API responses are
 * orders of magnitude smaller; anything bigger is a broken or hostile
 * payload, and parsing it would bill the reader's phone, not the site.
 */
var MAX_RESPONSE_CHARS = 2000000;
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
/** Strip tags and collapse whitespace (for the HTML synopsis). */
function stripHtml(html) {
    return String(html || '')
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<\/p>/gi, '\n')
        .replace(/<[^>]+>/g, '')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#0?39;|&apos;/g, "'")
        .replace(/&nbsp;/g, ' ')
        .replace(/[ \t]+/g, ' ')
        .replace(/\n\s*\n+/g, '\n')
        .trim();
}
/**
 * Strip executable content from chapter HTML. The chapter body is
 * HTML the API assembled from upstream source sites, i.e. untrusted
 * markup: scripts, frames, form elements, inline event handlers and
 * javascript:/vbscript: URLs must not reach the reader. Everything
 * else (paragraphs, images, links, tables) is kept as-is.
 */
function sanitizeChapterHtml(html) {
    return html
        .replace(/<(script|style|iframe|object|embed|form)\b[\s\S]*?<\/\1\s*>/gi, '')
        .replace(/<(script|style|iframe|object|embed|form|link|meta|base)\b[^>]*>/gi, '')
        .replace(/\son\w+\s*=\s*"[^"]*"/gi, '')
        .replace(/\son\w+\s*=\s*'[^']*'/gi, '')
        .replace(/\son\w+\s*=\s*[^\s>]+/gi, '')
        .replace(/\s(?:href|src)\s*=\s*"\s*(?:javascript|vbscript)\s*:[^"]*"/gi, '')
        .replace(/\s(?:href|src)\s*=\s*'\s*(?:javascript|vbscript)\s*:[^']*'/gi, '')
        .replace(/\s(?:href|src)\s*=\s*"\s*data\s*:\s*text\/html[^"]*"/gi, '')
        .replace(/\s(?:href|src)\s*=\s*'\s*data\s*:\s*text\/html[^']*'/gi, '');
}
/**
 * One page of /novels/search/. The API CLAMPS an out-of-range page to
 * the last page instead of returning an empty one, so callers compare
 * the requested page against totalPages — otherwise the app would
 * re-show the last page forever.
 */
function parseNovelListPage(data) {
    var _a;
    var res = data;
    if (!Array.isArray(res.results)) {
        // An error payload or a changed shape must surface as a failure,
        // not as an empty catalog page.
        throw new Error('Novel list response had an unexpected shape');
    }
    var cards = [];
    for (var _i = 0, _b = res.results; _i < _b.length; _i++) {
        var entry = _b[_i];
        if (!entry || typeof entry.slug !== 'string' || !entry.slug)
            continue;
        var cover = (_a = entry.prefered_source) === null || _a === void 0 ? void 0 : _a.cover_min_url;
        cards.push({
            name: String(entry.title || entry.slug),
            path: entry.slug,
            cover: typeof cover === 'string' && cover ? cover : undefined,
        });
    }
    return {
        cards: cards,
        totalPages: typeof res.total_pages === 'number' ? res.total_pages : 1,
    };
}
function parseNovelSources(data) {
    var _a;
    var res = data;
    if (!Array.isArray(res.sources)) {
        throw new Error('Novel response had an unexpected shape');
    }
    var sources = [];
    for (var _i = 0, _b = res.sources; _i < _b.length; _i++) {
        var s = _b[_i];
        if (!s || typeof s.source_slug !== 'string' || !s.source_slug)
            continue;
        sources.push({
            slug: s.source_slug,
            language: typeof s.language === 'string' ? s.language : '',
            available: typeof s.available_chapters_count === 'number'
                ? s.available_chapters_count
                : 0,
        });
    }
    return {
        name: String(res.title || ''),
        sources: sources,
        preferredSlug: (_a = res.prefered_source) === null || _a === void 0 ? void 0 : _a.source_slug,
    };
}
/**
 * Pick the source the plugin reads through: the English source with the
 * most available chapters (the site's preferred source wins ties when it
 * is English). Falls back to the largest source overall when the novel
 * has no English source, so the novel still opens.
 */
/**
 * Pick the source the plugin reads through. When the catalog was
 * filtered to languages, those are carried in the novel path
 * (`slug?lang=a,b`) and a source in one of them wins — first listed
 * language first. Without them this is: the English source with the
 * most available chapters (the site's preferred source wins ties when
 * it is English), falling back to the largest source overall when the
 * novel has no English source, so the novel still opens.
 */
function chooseSource(detail, preferLangs) {
    if (preferLangs === void 0) { preferLangs = []; }
    var bestEn;
    var bestAny;
    for (var _i = 0, preferLangs_1 = preferLangs; _i < preferLangs_1.length; _i++) {
        var lang = preferLangs_1[_i];
        var bestInLang = void 0;
        for (var _a = 0, _b = detail.sources; _a < _b.length; _a++) {
            var s = _b[_a];
            if (s.available <= 0 || s.language !== lang)
                continue;
            if (!bestInLang ||
                s.available > bestInLang.available ||
                (s.available === bestInLang.available &&
                    s.slug === detail.preferredSlug)) {
                bestInLang = s;
            }
        }
        if (bestInLang)
            return bestInLang;
    }
    for (var _c = 0, _d = detail.sources; _c < _d.length; _c++) {
        var s = _d[_c];
        if (s.available <= 0)
            continue;
        if (!bestAny || s.available > bestAny.available)
            bestAny = s;
        if (s.language === 'en' &&
            (!bestEn ||
                s.available > bestEn.available ||
                (s.available === bestEn.available && s.slug === detail.preferredSlug))) {
            bestEn = s;
        }
    }
    var chosen = bestEn || bestAny;
    if (!chosen) {
        throw new Error('This novel has no readable source on LNCrawler');
    }
    return chosen;
}
function parseSourceDetails(data) {
    var res = data;
    var summary = res.synopsis ? stripHtml(String(res.synopsis)) : '';
    var authors = Array.isArray(res.authors)
        ? res.authors.filter(function (a) { return typeof a === 'string' && a; })
        : [];
    var tags = Array.isArray(res.tags)
        ? res.tags.filter(function (t) { return typeof t === 'string' && t; })
        : [];
    return {
        summary: summary || undefined,
        author: authors.length ? authors.join(', ') : undefined,
        genres: tags.length ? tags.join(', ') : undefined,
        statusRaw: typeof res.status === 'string' ? res.status : '',
        cover: typeof res.cover_url === 'string' && res.cover_url
            ? res.cover_url
            : undefined,
    };
}
/** One page of the chapters endpoint — only chapters carrying content. */
function parseChaptersPage(data) {
    var res = data;
    if (!Array.isArray(res.chapters)) {
        throw new Error('Chapter list response had an unexpected shape');
    }
    var entries = [];
    for (var _i = 0, _a = res.chapters; _i < _a.length; _i++) {
        var c = _a[_i];
        if (!c || c.has_content !== true)
            continue;
        if (typeof c.chapter_id !== 'number')
            continue;
        entries.push({
            id: c.chapter_id,
            title: String(c.title || 'Chapter ' + c.chapter_id),
        });
    }
    return {
        totalPages: typeof res.total_pages === 'number' ? res.total_pages : 1,
        entries: entries,
    };
}
/**
 * Chapter body HTML. The API prefixes the body with an <h1> of the
 * chapter title — which includes the chapter number on LNCrawler.
 * Keeping it gives in-page headings showing title and number, so it
 * is left in place (only executable content is stripped below).
 */
function parseChapterBody(data) {
    var res = data;
    if (typeof res.body !== 'string') {
        throw new Error('Chapter response had an unexpected shape');
    }
    return sanitizeChapterHtml(res.body.trim());
}
/**
 * Languages the LNCrawler search API understands (from the site's own
 * frontend), used for the Languages filter. Responses repeat the
 * `languages` param, which the API aliases to `language`.
 */
var LANGUAGES = [
    { label: 'English', value: 'en' },
    { label: 'French', value: 'fr' },
    { label: 'Spanish', value: 'es' },
    { label: 'German', value: 'de' },
    { label: 'Italian', value: 'it' },
    { label: 'Japanese', value: 'ja' },
    { label: 'Korean', value: 'ko' },
    { label: 'Chinese', value: 'zh' },
    { label: 'Portuguese', value: 'pt' },
    { label: 'Russian', value: 'ru' },
    { label: 'Arabic', value: 'ar' },
    { label: 'Hindi', value: 'hi' },
    { label: 'Thai', value: 'th' },
    { label: 'Vietnamese', value: 'vi' },
    { label: 'Indonesian', value: 'id' },
    { label: 'Turkish', value: 'tr' },
    { label: 'Polish', value: 'pl' },
    { label: 'Dutch', value: 'nl' },
    { label: 'Swedish', value: 'sv' },
    { label: 'Danish', value: 'da' },
];
var SORT_OPTIONS = [
    { label: 'Default', value: '' },
    { label: 'Title', value: 'title' },
    { label: 'Rating', value: 'rating' },
    { label: 'Date added', value: 'date_added' },
    { label: 'All-time views', value: 'popularity' },
    { label: 'Trending', value: 'trending' },
    { label: 'Last updated', value: 'last_updated' },
];
var STATUS_OPTIONS = [
    { label: 'All', value: '' },
    { label: 'Ongoing', value: 'Ongoing' },
    { label: 'Completed', value: 'Completed' },
    { label: 'On Hiatus', value: 'On Hiatus' },
    { label: 'Cancelled', value: 'Cancelled' },
    { label: 'Unknown', value: 'Unknown' },
];
var ADULT_OPTIONS = [
    { label: 'Default', value: '' },
    { label: 'Hide adult content', value: 'hide' },
    { label: 'Show everything', value: 'show' },
    { label: 'Adult content only', value: 'only' },
];
var LNCrawler = /** @class */ (function () {
    function LNCrawler() {
        var _this = this;
        this.id = 'lncrawler';
        this.name = 'LNCrawler';
        this.icon = 'src/en/lncrawler/icon.png';
        this.site = 'https://lncrawler.monster';
        this.version = '1.1.1';
        this.filters = {
            languages: {
                type: filterInputs_1.FilterTypes.CheckboxGroup,
                label: 'Languages',
                value: ['en'],
                options: LANGUAGES,
            },
            status: {
                type: filterInputs_1.FilterTypes.Picker,
                label: 'Status',
                value: '',
                options: STATUS_OPTIONS,
            },
            sort_by: {
                type: filterInputs_1.FilterTypes.Picker,
                label: 'Sort by',
                value: '',
                options: SORT_OPTIONS,
            },
            sort_order: {
                type: filterInputs_1.FilterTypes.Picker,
                label: 'Order',
                value: '',
                options: [
                    { label: 'Default', value: '' },
                    { label: 'Ascending', value: 'asc' },
                    { label: 'Descending', value: 'desc' },
                ],
            },
            adult: {
                type: filterInputs_1.FilterTypes.Picker,
                label: 'Adult content',
                value: '',
                options: ADULT_OPTIONS,
            },
        };
        this.resolveUrl = function (path) {
            if (/^https?:\/\//i.test(path))
                return path;
            if (path.indexOf('//') === 0)
                return 'https:' + path;
            return "".concat(_this.site, "/novels/").concat(path);
        };
    }
    /**
     * Build the /novels/search/ query from filters. Catalog defaults:
     * popular = all-time views descending; the Latest toggle switches to
     * last-updated descending. An empty filter value means "server
     * default" and is simply omitted.
     */
    LNCrawler.prototype.buildSearchQuery = function (options, pageNo, query) {
        var _a, _b, _c, _d, _e;
        var params = new URLSearchParams({
            page: String(pageNo),
            page_size: String(PAGE_SIZE),
        });
        if (query)
            params.set('query', query);
        var opts = options || {
            showLatestNovels: false,
            filters: undefined,
        };
        var filters = opts.filters;
        if (!filters && !options) {
            // Interface callers pass no options: catalog default = English.
            params.append('languages', 'en');
        }
        else {
            for (var _i = 0, _f = ((_a = filters === null || filters === void 0 ? void 0 : filters.languages) === null || _a === void 0 ? void 0 : _a.value) || []; _i < _f.length; _i++) {
                var language = _f[_i];
                if (language)
                    params.append('languages', language);
            }
        }
        if ((_b = filters === null || filters === void 0 ? void 0 : filters.status) === null || _b === void 0 ? void 0 : _b.value)
            params.set('status', filters.status.value);
        if ((_c = filters === null || filters === void 0 ? void 0 : filters.sort_by) === null || _c === void 0 ? void 0 : _c.value) {
            params.set('sort_by', filters.sort_by.value);
        }
        else {
            params.set('sort_by', opts.showLatestNovels ? 'last_updated' : 'popularity');
        }
        if ((_d = filters === null || filters === void 0 ? void 0 : filters.sort_order) === null || _d === void 0 ? void 0 : _d.value) {
            params.set('sort_order', filters.sort_order.value);
        }
        else {
            params.set('sort_order', 'desc');
        }
        if ((_e = filters === null || filters === void 0 ? void 0 : filters.adult) === null || _e === void 0 ? void 0 : _e.value)
            params.set('adult', filters.adult.value);
        return params;
    };
    LNCrawler.prototype.popularNovels = function (pageNo, options) {
        return __awaiter(this, void 0, void 0, function () {
            var data, page;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fetchJson("".concat(API, "/novels/search/?").concat(this.buildSearchQuery(options, pageNo)), 'Failed to load popular novels')];
                    case 1:
                        data = _a.sent();
                        page = parseNovelListPage(data);
                        return [2 /*return*/, this.tagWithLanguages(page, pageNo, options)];
                }
            });
        });
    };
    /** Selected languages carried in the novel path, if any (`slug?lang=a,b`). */
    LNCrawler.prototype.langsFromPath = function (novelPath) {
        var url = new URL(novelPath, this.site);
        var raw = url.searchParams.get('lang') || '';
        return raw.split(',').filter(Boolean);
    };
    LNCrawler.prototype.parseNovel = function (novelPath) {
        return __awaiter(this, void 0, void 0, function () {
            var slug, detail, _a, source, base, details, _b, first, _c, entries, pages, page, next, _d, _i, _e, e, chapters, status;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        slug = new URL(novelPath, this.site).pathname.split('/').filter(Boolean).pop() ||
                            '';
                        _a = parseNovelSources;
                        return [4 /*yield*/, fetchJson("".concat(API, "/novels/").concat(encodeURIComponent(slug), "/"), 'Failed to load novel')];
                    case 1:
                        detail = _a.apply(void 0, [_f.sent()]);
                        if (!detail.name) {
                            throw new Error('Could not load the novel ' + novelPath);
                        }
                        source = chooseSource(detail, this.langsFromPath(novelPath));
                        base = "".concat(API, "/novels/").concat(encodeURIComponent(slug)) +
                            "/".concat(encodeURIComponent(source.slug));
                        _b = parseSourceDetails;
                        return [4 /*yield*/, fetchJson(base + '/', 'Failed to load novel details')];
                    case 2:
                        details = _b.apply(void 0, [_f.sent()]);
                        _c = parseChaptersPage;
                        return [4 /*yield*/, fetchJson(base + '/chapters/', 'Failed to load chapter list')];
                    case 3:
                        first = _c.apply(void 0, [_f.sent()]);
                        entries = first.entries.slice();
                        pages = Math.min(first.totalPages, MAX_CHAPTER_PAGES);
                        page = 2;
                        _f.label = 4;
                    case 4:
                        if (!(page <= pages)) return [3 /*break*/, 7];
                        _d = parseChaptersPage;
                        return [4 /*yield*/, fetchJson("".concat(base, "/chapters/?page=").concat(page), 'Failed to load chapter list')];
                    case 5:
                        next = _d.apply(void 0, [_f.sent()]);
                        for (_i = 0, _e = next.entries; _i < _e.length; _i++) {
                            e = _e[_i];
                            entries.push(e);
                        }
                        _f.label = 6;
                    case 6:
                        page++;
                        return [3 /*break*/, 4];
                    case 7:
                        entries.sort(function (a, b) { return a.id - b.id; });
                        chapters = entries.map(function (e) { return ({
                            name: e.title,
                            path: "".concat(slug, "/").concat(source.slug, "/").concat(e.id),
                            chapterNumber: e.id,
                        }); });
                        status = details.statusRaw === 'Completed'
                            ? novelStatus_1.NovelStatus.Completed
                            : details.statusRaw === 'Ongoing'
                                ? novelStatus_1.NovelStatus.Ongoing
                                : details.statusRaw === 'On Hiatus'
                                    ? novelStatus_1.NovelStatus.OnHiatus
                                    : details.statusRaw === 'Cancelled'
                                        ? novelStatus_1.NovelStatus.Cancelled
                                        : novelStatus_1.NovelStatus.Unknown;
                        return [2 /*return*/, {
                                path: novelPath,
                                name: detail.name,
                                cover: details.cover,
                                summary: details.summary,
                                author: details.author,
                                genres: details.genres,
                                status: status,
                                chapters: chapters,
                            }];
                }
            });
        });
    };
    LNCrawler.prototype.parseChapter = function (chapterPath) {
        return __awaiter(this, void 0, void 0, function () {
            var parts, url, content, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        parts = chapterPath.replace(/^\/+|\/+$/g, '').split('/');
                        if (parts.length !== 3) {
                            throw new Error('Unexpected chapter path: ' + chapterPath);
                        }
                        url = "".concat(API, "/novels/").concat(encodeURIComponent(parts[0])) +
                            "/".concat(encodeURIComponent(parts[1]), "/chapter/").concat(encodeURIComponent(parts[2]), "/");
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
    LNCrawler.prototype.searchNovels = function (searchTerm, pageNo, options) {
        return __awaiter(this, void 0, void 0, function () {
            var data, page;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fetchJson("".concat(API, "/novels/search/?").concat(this.buildSearchQuery(options, pageNo, searchTerm)), 'Failed to search novels')];
                    case 1:
                        data = _a.sent();
                        page = parseNovelListPage(data);
                        return [2 /*return*/, this.tagWithLanguages(page, pageNo, options)];
                }
            });
        });
    };
    /**
     * Catalog cards carry the chosen languages in their path
     * (`slug?lang=a,b`) so parseNovel can pick a chapter source that
     * matches them; used only when a language filter is actually set.
     */
    LNCrawler.prototype.tagWithLanguages = function (page, pageNo, options) {
        var _a, _b;
        if (pageNo > page.totalPages)
            return [];
        var langs = (((_b = (_a = options === null || options === void 0 ? void 0 : options.filters) === null || _a === void 0 ? void 0 : _a.languages) === null || _b === void 0 ? void 0 : _b.value) || [])
            .filter(Boolean)
            .join(',');
        if (!langs)
            return page.cards;
        var suffix = "?lang=".concat(encodeURIComponent(langs));
        return page.cards.map(function (card) { return (__assign(__assign({}, card), { path: card.path + suffix })); });
    };
    return LNCrawler;
}());
exports.default = new LNCrawler();
