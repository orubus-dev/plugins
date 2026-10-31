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
/** Matches a JSON string body with escaped quotes, e.g. "a \"quoted\" title". */
var JSON_STR = '((?:[^"\\\\]|\\\\.)*)';
/**
 * Upper bound on a page this plugin will parse. Site pages are orders
 * of magnitude smaller; anything bigger is a broken or hostile
 * response, and regex-scanning / JSON-parsing it would bill the
 * reader's phone, not the site. Enforced before any parsing happens.
 */
var MAX_PAGE_CHARS = 10000000;
/**
 * Decode one flight string field. The field is a JSON string body, so
 * decode it as JSON — that handles every escape (\", \\, \n, \uXXXX)
 * exactly the way the site encoded it. A hand-rolled unescaper only
 * ever covers the escapes its author remembered. If the body is not
 * valid JSON (site changed shape), fall back to the two common escapes
 * rather than losing the field entirely.
 */
function unescapeFlight(s) {
    try {
        return JSON.parse('"' + s + '"');
    }
    catch (_a) {
        return s.replace(/\\"/g, '"').replace(/\\'/g, "'");
    }
}
/**
 * Next.js app-router pages embed their data in
 *   self.__next_f.push([1,"<escaped payload>"])</script>
 * scripts. Decode every payload into one searchable text blob.
 * The closing tag match tolerates an optional semicolon / whitespace
 * (some Next.js versions emit `);</script>`), so chunks are never
 * silently skipped due to formatting.
 */
function extractFlightText(html) {
    if (html.length > MAX_PAGE_CHARS)
        throw new Error("Page too large to parse safely");
    var re = /self\.__next_f\.push\(\[1,"([\s\S]*?)"\]\)\s*;?\s*<\/script>/g;
    var out = "";
    var m;
    while ((m = re.exec(html)) !== null) {
        try {
            out += JSON.parse('"' + m[1] + '"');
        }
        catch (_a) {
            /* skip malformed chunk */
        }
    }
    return out;
}
/**
 * The novel-card pattern, built once and shared: parseNovelEntries
 * captures the slug (pass a capture group), findIndexEntry looks up one
 * known slug (pass the escaped literal — no group, so field numbering
 * shifts by one; both callers index accordingly). The card shape must
 * only ever be edited here: two hand-written copies of this pattern
 * are how the parsers drift apart.
 */
function entryPattern(slugPattern) {
    return ('"slug":"' +
        slugPattern +
        '","title":"' +
        JSON_STR +
        '","author":"' +
        JSON_STR +
        '","genres":(\\[[^\\]]*\\]),"glyph":"[^"]*","cover":\\[[^\\]]*\\],"coverUrl":"([^"]*)","chapters":(\\d+),"status":"([^"]*)"');
}
var ENTRY_RE = new RegExp(entryPattern("([a-z0-9-]+)"), "g");
/** Parse every novel card object embedded in flight data (browse/search pages). */
function parseNovelEntries(flight) {
    var out = [];
    var seen = new Set();
    ENTRY_RE.lastIndex = 0;
    var m;
    while ((m = ENTRY_RE.exec(flight)) !== null) {
        if (seen.has(m[1]))
            continue;
        seen.add(m[1]);
        var genres = [];
        try {
            genres = JSON.parse(m[4]);
        }
        catch (_a) {
            /* keep empty */
        }
        out.push({
            slug: m[1],
            title: unescapeFlight(m[2]),
            author: unescapeFlight(m[3]),
            genres: genres,
            coverUrl: m[5],
            chapterCount: parseInt(m[6], 10),
            status: m[7],
        });
    }
    return out;
}
/** Find the novel's own card in the page's embedded novel index (header data). */
function findIndexEntry(flight, slug) {
    var re = new RegExp(entryPattern(slug.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
    var m = re.exec(flight);
    if (!m)
        return null;
    var genres = [];
    try {
        genres = JSON.parse(m[3]);
    }
    catch (_a) {
        /* keep empty */
    }
    return {
        slug: slug,
        title: unescapeFlight(m[1]),
        author: unescapeFlight(m[2]),
        genres: genres,
        coverUrl: m[4],
        chapterCount: parseInt(m[5], 10),
        status: m[6],
    };
}
var HTML_ENTITY_CHARS = {
    amp: "&",
    quot: '"',
    "#39": "'",
    apos: "'",
    lt: "<",
    gt: ">",
};
function decodeHtmlEntities(s) {
    // Single pass, one regex: a chain of sequential .replace() calls decodes
    // twice, turning a literal "&amp;lt;" in the source into "<". The
    // alternation also bounds the map lookup to exactly these keys.
    return s.replace(/&(amp|quot|#39|apos|lt|gt);/g, function (m, e) { var _a; return (_a = HTML_ENTITY_CHARS[e]) !== null && _a !== void 0 ? _a : m; });
}
/** Title from the rendered <h1> (in the flight data). */
var TITLE_RE = new RegExp('"\\$","h1",null,\\{"className":"text-3xl[^"]*","children":"' +
    JSON_STR +
    '"\\}');
/** Author: the <dd> right after the "Author" <dt>. */
var AUTHOR_RE = new RegExp('"children":"Author"\\}\\],\\["\\$","dd",null,\\{"className":"mt-0\\.5 text-sm font-medium","children":"' +
    JSON_STR +
    '"\\}');
/** Chapter list entries: flat {number,title,publishedAt,words,tier} objects. */
var CHAPTER_RE = new RegExp('"number":(\\d+(?:\\.\\d+)?),"title":"' +
    JSON_STR +
    '","publishedAt":"([^"]*)","words":(\\d+),"tier":"([^"]*)"', "g");
/** Parse a /novel/<slug> page into its details + full chapter list. */
function parseNovelPage(html, flight, slug) {
    var details = {
        name: slug,
        author: "",
        genres: [],
        status: "",
        cover: "",
        summary: "",
        chapters: [],
    };
    var m;
    // Title from the rendered <h1>.
    m = TITLE_RE.exec(flight);
    if (m)
        details.name = unescapeFlight(m[1]);
    // Author: the <dd> right after the "Author" <dt>.
    m = AUTHOR_RE.exec(flight);
    if (m)
        details.author = unescapeFlight(m[1]);
    // Genres: prefer the novel's own entry in the embedded novel index;
    // fall back to the "#Tag" chips in the tag row under the header.
    var indexEntry = findIndexEntry(flight, slug);
    if (indexEntry && indexEntry.genres.length > 0) {
        details.genres = indexEntry.genres;
    }
    else {
        var chipRow = flight.indexOf("mt-3 flex flex-wrap gap-1.5");
        if (chipRow >= 0) {
            var chipRe = /"children":\["#","([^"]*)"\]/g;
            chipRe.lastIndex = chipRow;
            var cm = void 0;
            var count = 0;
            while ((cm = chipRe.exec(flight)) !== null &&
                cm.index < chipRow + 6000 &&
                count < 40) {
                details.genres.push(cm[1]);
                count++;
            }
        }
    }
    // Fill any gaps from the index entry.
    if (indexEntry) {
        if (!details.author && indexEntry.author)
            details.author = indexEntry.author;
        if (!details.status && indexEntry.status)
            details.status = indexEntry.status;
        if (!details.cover && indexEntry.coverUrl)
            details.cover = indexEntry.coverUrl;
        if (details.name === slug && indexEntry.title)
            details.name = indexEntry.title;
    }
    // Status chip (Ongoing / Completed / ...).
    m =
        /"className":"chip"[\s\S]{0,150}?"children":"(Ongoing|Completed|Hiatus|Dropped|On Hiatus|Cancelled)"/.exec(flight);
    if (m)
        details.status = m[1];
    // Cover: first supabase-hosted cover image on the page is the novel's own.
    m = /"src":"(https:\/\/[^"]*?supabase[^"]*?covers[^"]*?)"/.exec(flight);
    if (m)
        details.cover = m[1];
    // Synopsis from the meta description tag.
    m = /<meta name="description" content="([\s\S]*?)"/.exec(html);
    if (m)
        details.summary = decodeHtmlEntities(m[1]).replace(/\\n/g, "\n");
    // Chapter list: flat {number,title,publishedAt,words,tier} objects.
    var seenCh = new Set();
    CHAPTER_RE.lastIndex = 0;
    var chm;
    while ((chm = CHAPTER_RE.exec(flight)) !== null) {
        var num = parseFloat(chm[1]);
        if (seenCh.has(num))
            continue;
        seenCh.add(num);
        details.chapters.push({
            number: num,
            title: unescapeFlight(chm[2]),
            publishedAt: chm[3],
            tier: chm[5],
        });
    }
    details.chapters.sort(function (a, b) { return a.number - b.number; });
    return details;
}
var LOCKED_MESSAGE = "<p><strong>This chapter is locked on Nightjar Reads.</strong></p>" +
    "<p>It is a premium chapter — unlock it on nightjarreads.com to read it here.</p>";
function escapeHtml(s) {
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
/** The chapter body: a JSON string array followed by translatorNotes. */
var BODY_RE = /"body":\[\"([\s\S]*?)\"\],\"translatorNotes\"/;
/**
 * True when THIS chapter's record says the chapter is locked. The flag
 * is looked up only where the site puts it: in the record fields right
 * AFTER the chapter's "body" value — never across the whole page, and
 * never inside the body text itself. An unscoped test over the entire
 * blob would let any unrelated record containing "locked":true
 * (another novel's data, a recommendation payload) mislabel a free
 * chapter as locked. (A locked chapter's body is null, so for that
 * case the window starts at the "body" key itself.)
 */
function isLockedChapter(flight, bodyMatch) {
    var from = bodyMatch
        ? bodyMatch.index + bodyMatch[0].length
        : flight.indexOf('"body":');
    if (from < 0)
        return false;
    return /"locked":true/.test(flight.slice(from, from + 400));
}
/**
 * Parse a /novel/<slug>/<n> chapter page.
 * Returns the chapter HTML, or LOCKED_MESSAGE when the chapter is premium.
 * Returns null when the page has no readable content at all.
 */
function parseChapterPage(flight) {
    var m = BODY_RE.exec(flight);
    if (isLockedChapter(flight, m))
        return LOCKED_MESSAGE;
    if (!m)
        return null;
    var parsedBody;
    try {
        parsedBody = JSON.parse('["' + m[1] + '"]');
    }
    catch (_a) {
        return null;
    }
    if (!Array.isArray(parsedBody))
        return null;
    // Body members are strings by contract, but the array comes from the
    // page: one non-string member used to throw out of the .map below
    // (p.trim is not a function) and crash the chapter load, instead of
    // returning null as this function documents. Non-strings are dropped.
    var paras = parsedBody
        .filter(function (p) { return typeof p === "string"; })
        .map(function (p) { return p.trim(); })
        .filter(function (p) { return p.length > 0 && !/Advance chapters at Nightjar Reads/.test(p); });
    if (paras.length === 0)
        return null;
    return paras.map(function (p) { return "<p>" + escapeHtml(p) + "</p>"; }).join("\n");
}
/**
 * How far past the search marker the results section can run. On real
 * pages the result links sit within a few hundred characters of the
 * marker; the bound exists so links from unrelated later sections
 * (recommendations, rails) can never be collected as results.
 */
var SEARCH_SECTION_MAX_CHARS = 200000;
/**
 * Parse a /search?q=... page: result slugs in order, looked up in the index.
 *
 * The marker is built from the query as the site stores it — JSON-escaped
 * inside the flight payload. Searching for the RAW query meant any
 * query containing a quote never matched its marker (the site stores
 * \"), and the fallback then scanned the whole page, returning whatever
 * links it found in whatever order. The scan is also bounded to the
 * results section: from the marker to the next section's marker or
 * SEARCH_SECTION_MAX_CHARS, whichever comes first.
 */
function parseSearchResults(flight, query) {
    var marker = '"initial":"' + query.replace(/\\/g, "\\\\").replace(/"/g, '\\"') + '"';
    var start = flight.indexOf(marker);
    var section = flight;
    if (start >= 0) {
        var end = flight.indexOf('"initial":"', start + marker.length);
        if (end < 0 || end > start + SEARCH_SECTION_MAX_CHARS)
            end = Math.min(flight.length, start + SEARCH_SECTION_MAX_CHARS);
        section = flight.slice(start, end);
    }
    // The page itself states how many results it found, right after the
    // marker ("children":[N," ","result"," for ...). When that count is
    // readable, take exactly N links — a recommendation rail further down
    // the page can no longer leak in, however close it sits. When it
    // isn't (site changed the wording), the bounded scan above is the
    // fallback.
    var limit = Infinity;
    var countM = /\[(\d+)," ","result/.exec(section.slice(0, 2000));
    if (countM)
        limit = parseInt(countM[1], 10);
    var hrefRe = /"href":"\/novel\/([a-z0-9-]+)"/g;
    var order = [];
    var seen = new Set();
    var hm;
    while ((hm = hrefRe.exec(section)) !== null && order.length < limit) {
        if (!seen.has(hm[1])) {
            seen.add(hm[1]);
            order.push(hm[1]);
        }
    }
    var index = new Map(parseNovelEntries(flight).map(function (n) { return [n.slug, n]; }));
    return order
        .map(function (slug) { return index.get(slug); })
        .filter(function (n) { return !!n; });
}
var NightjarReads = /** @class */ (function () {
    function NightjarReads() {
        var _this = this;
        this.id = "nightjarreads";
        this.name = "Nightjar Reads";
        this.icon = "src/en/nightjarreads/icon.png";
        this.site = "https://nightjarreads.com";
        this.version = "1.0.0";
        this.resolveUrl = function (path) { return _this.site + path; };
    }
    NightjarReads.prototype.popularNovels = function (pageNo) {
        return __awaiter(this, void 0, void 0, function () {
            var html;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (pageNo > 1)
                            return [2 /*return*/, []];
                        return [4 /*yield*/, (0, fetch_1.fetchText)(this.site + "/browse?sort=popular")];
                    case 1:
                        html = _a.sent();
                        return [2 /*return*/, parseNovelEntries(extractFlightText(html)).map(function (n) { return ({
                                name: n.title,
                                path: "/novel/" + n.slug,
                                cover: n.coverUrl,
                            }); })];
                }
            });
        });
    };
    NightjarReads.prototype.parseNovel = function (novelPath) {
        return __awaiter(this, void 0, void 0, function () {
            var slug, html, d, status, novel;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        slug = novelPath.split("/").filter(Boolean).pop() || "";
                        return [4 /*yield*/, (0, fetch_1.fetchText)(this.site + novelPath)];
                    case 1:
                        html = _a.sent();
                        d = parseNovelPage(html, extractFlightText(html), slug);
                        status = novelStatus_1.NovelStatus.Unknown;
                        if (d.status === "Ongoing")
                            status = novelStatus_1.NovelStatus.Ongoing;
                        else if (d.status === "Completed")
                            status = novelStatus_1.NovelStatus.Completed;
                        else if (d.status === "On Hiatus" || d.status === "Hiatus")
                            status = novelStatus_1.NovelStatus.OnHiatus;
                        else if (d.status === "Cancelled" || d.status === "Dropped")
                            status = novelStatus_1.NovelStatus.Cancelled;
                        novel = {
                            path: novelPath,
                            name: d.name,
                            status: status,
                        };
                        if (d.cover)
                            novel.cover = d.cover;
                        if (d.author)
                            novel.author = d.author;
                        if (d.genres.length)
                            novel.genres = d.genres.join(", ");
                        if (d.summary)
                            novel.summary = d.summary;
                        novel.chapters = d.chapters.map(function (c) { return ({
                            name: "Chapter " + c.number + ": " + c.title,
                            path: "/novel/" + slug + "/" + c.number,
                            releaseTime: c.publishedAt,
                            chapterNumber: c.number,
                        }); });
                        return [2 /*return*/, novel];
                }
            });
        });
    };
    NightjarReads.prototype.parseChapter = function (chapterPath) {
        return __awaiter(this, void 0, void 0, function () {
            var html, content;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, fetch_1.fetchText)(this.site + chapterPath)];
                    case 1:
                        html = _a.sent();
                        content = parseChapterPage(extractFlightText(html));
                        if (content === null) {
                            return [2 /*return*/, ("<p><strong>Could not load this chapter.</strong></p>" +
                                    "<p>It may be locked or temporarily unavailable on Nightjar Reads.</p>")];
                        }
                        return [2 /*return*/, content];
                }
            });
        });
    };
    NightjarReads.prototype.searchNovels = function (searchTerm, pageNo) {
        return __awaiter(this, void 0, void 0, function () {
            var html, flight;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (pageNo > 1)
                            return [2 /*return*/, []];
                        return [4 /*yield*/, (0, fetch_1.fetchText)(this.site + "/search?q=" + encodeURIComponent(searchTerm))];
                    case 1:
                        html = _a.sent();
                        flight = extractFlightText(html);
                        return [2 /*return*/, parseSearchResults(flight, searchTerm).map(function (n) { return ({
                                name: n.title,
                                path: "/novel/" + n.slug,
                                cover: n.coverUrl,
                            }); })];
                }
            });
        });
    };
    return NightjarReads;
}());
exports.default = new NightjarReads();
