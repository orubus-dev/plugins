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
var API = 'https://api.wetriedtls.com';
/**
 * Build the catalog browse URL for a page. The API honors the `status`
 * query param (Ongoing / Completed / Dropped / Canceled) but ignores
 * `tags` and `sort` params, so status is the only exposed filter.
 * 'all' (or empty) means no status filtering.
 */
function catalogUrl(pageNo, status) {
    var url = API + '/query?adult=true&query_string=&page=' + pageNo;
    var s = (status || '').trim();
    if (s && s !== 'all')
        url += '&status=' + encodeURIComponent(s);
    return url;
}
var SITE = 'https://wetriedtls.com';
function safeJson(text) {
    try {
        return JSON.parse(text);
    }
    catch (_a) {
        return undefined;
    }
}
function isRecord(v) {
    return typeof v === 'object' && v !== null;
}
function str(v) {
    return typeof v === 'string' ? v : '';
}
/** Decode a handful of HTML entities; the site uses a small set. */
function decodeEntities(s) {
    return s
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#0?39;/g, "'")
        .replace(/&rsquo;|&lsquo;/g, "'")
        .replace(/&rdquo;|&ldquo;/g, '"')
        .replace(/&mdash;/g, '—')
        .replace(/&#(\d+);/g, function (_, n) { return String.fromCharCode(parseInt(n, 10)); });
}
/** Strip tags, collapse whitespace. */
function stripHtml(html) {
    return decodeEntities(html.replace(/<[^>]+>/g, ' '))
        .replace(/[ \t\xa0]+/g, ' ')
        .replace(/\n{3,}/g, '\n\n')
        .trim();
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
    var re = /self\.__next_f\.push\(\[1,"([\s\S]*?)"\]\)\s*;?\s*<\/script>/g;
    var out = '';
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
 * Slice a JS string by UTF-8 byte offsets (the flight protocol's `T<hex>`
 * length prefix counts UTF-8 bytes of the row payload, not UTF-16 chars).
 */
function sliceUtf8Bytes(s, start, byteLen) {
    var bytes = 0;
    var i = start;
    while (i < s.length && bytes < byteLen) {
        var code = s.charCodeAt(i);
        if (code >= 0xd800 && code <= 0xdbff && i + 1 < s.length) {
            var next = s.charCodeAt(i + 1);
            if (next >= 0xdc00 && next <= 0xdfff) {
                i += 2;
                bytes += 4;
                continue;
            }
        }
        bytes += code < 0x80 ? 1 : code < 0x800 ? 2 : 3;
        i++;
    }
    return s.slice(start, i);
}
/** Inner text of one <p>...</p> block, tags stripped. */
function paragraphText(p) {
    return decodeEntities(p.replace(/<[^>]+>/g, '')).trim();
}
function isTitleRepeat(p, knownTitles) {
    // A paragraph that is nothing but bold text is the site's repeated
    // series / chapter title header — but only when it actually matches a
    // title the caller knows. A genuine bold-only content line (a scene
    // label, a POV header) must never be stripped, so without a matching
    // known title nothing is treated as a repeat.
    var inner = p
        .replace(/^<p[^>]*>/i, '')
        .replace(/<\/p>$/i, '')
        .trim();
    if (!/^<strong>[\s\S]*<\/strong>$/.test(inner))
        return false;
    if (!knownTitles || knownTitles.length === 0)
        return false;
    var text = decodeEntities(inner.replace(/<[^>]+>/g, ''))
        .trim()
        .toLowerCase();
    return knownTitles.some(function (t) { return t.trim().toLowerCase() === text; });
}
/**
 * Translation credits ("Translator: X", "Editor: Y") are site chrome, not
 * story content — the site puts them in the chapter header next to the
 * banner. Stripped with the rest of the header so the reader starts at
 * the story. Narrow on purpose: a genuine bold content line never looks
 * like this.
 */
function isCreditLine(p) {
    var t = paragraphText(p);
    return /^(translator|editor|proofreader|typesetter)\s*:/i.test(t);
}
function isPromoParagraph(p) {
    // A block that carries an illustration is content, never promo — even
    // when it has no text of its own (e.g. <p><div><img></div></p>).
    if (/<img[\s>]/i.test(p))
        return false;
    var t = paragraphText(p).toLowerCase();
    if (!t || t === '= = =')
        return true;
    if (t.indexOf('we tried translations') !== -1)
        return true;
    if (t.indexOf('dsc.gg') !== -1 || t.indexOf('join our discord') !== -1)
        return true;
    return false;
}
/**
 * Decode the HTML entities that can appear inside an attribute value —
 * decimal (&#106;), hex (&#x6A;), and the named entities used to smuggle a
 * scheme past a naive prefix check (&colon;) — so the scheme test below
 * sees what the browser will actually navigate to.
 */
function decodeAttrEntities(s) {
    return s
        .replace(/&#x([0-9a-f]+);?/gi, function (_m, h) {
        return String.fromCharCode(parseInt(h, 16));
    })
        .replace(/&#(\d+);?/g, function (_m, n) {
        return String.fromCharCode(parseInt(n, 10));
    })
        .replace(/&colon;?/gi, ':')
        .replace(/&semi;?/gi, ';')
        .replace(/&amp;?/gi, '&')
        .replace(/&lt;?/gi, '<')
        .replace(/&gt;?/gi, '>')
        .replace(/&quot;?/gi, '"')
        .replace(/&#0?39;?/g, "'");
}
/**
 * True for URLs that would execute script when followed from the reader.
 * The value is entity-decoded and stripped of whitespace/control
 * characters first, so &#106;avascript:, javascript&colon;, and
 * java<TAB>script:-style smuggling are all caught.
 */
function isScriptUrl(url) {
    var norm = decodeAttrEntities(url).replace(/[\s\u0000-\u001f\u007f]+/g, '');
    return /^(javascript|vbscript):/i.test(norm);
}
/**
 * Strip anything that could execute code from chapter HTML before it
 * reaches the reader, which renders the HTML unsanitized: dangerous
 * elements (script/iframe/object/...), event handler attributes
 * (e.g. <img onerror=...>), and javascript: URLs. Everything else —
 * paragraphs, headings, figures, images, inline formatting — is
 * preserved as-is.
 */
function sanitizeHtml(html) {
    var out = html;
    // Remove dangerous elements entirely, content included.
    out = out.replace(/<(script|iframe|object|embed|form|input|textarea|select|button|style|link|meta|base|noscript)[\s>][\s\S]*?<\/\1\s*>/gi, '');
    out = out.replace(/<\/?(script|iframe|object|embed|form|input|textarea|select|button|style|link|meta|base|noscript)[^>]*>/gi, '');
    // Strip event handler attributes (onclick, onerror, ...).
    out = out.replace(/\son[a-z]+\s*=\s*("[^"]*"|'[^']*'|[^\s"'=<>`]+)/gi, '');
    // Neutralize script URLs (href/src/action). The value is entity-decoded
    // before the scheme check so encoded variants can't slip through.
    out = out.replace(/\s(href|src|action)\s*=\s*("[^"]*"|'[^']*'|[^\s"'=<>`]+)/gi, function (_m, _attr, val) {
        var unquoted = val.replace(/^['"]|['"]$/g, '');
        return isScriptUrl(unquoted) ? '' : _m;
    });
    return out;
}
/** Parse the /query API response (catalog + search share the shape). */
function parseQueryResults(jsonText) {
    var root = safeJson(jsonText);
    var items = [];
    var lastPage = 1;
    if (isRecord(root)) {
        var meta = root.meta;
        if (isRecord(meta) && typeof meta.last_page === 'number')
            lastPage = meta.last_page;
        var data = Array.isArray(root.data) ? root.data : [];
        for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
            var it = data_1[_i];
            if (!isRecord(it))
                continue;
            if (it.series_type && it.series_type !== 'Novel')
                continue;
            var slug = str(it.series_slug).trim();
            var title = str(it.title).trim();
            if (!slug || !title)
                continue;
            items.push({
                slug: slug,
                title: decodeEntities(title),
                cover: str(it.thumbnail),
            });
        }
    }
    return { items: items, lastPage: lastPage };
}
/** Parse the /series/{slug} API response. */
function parseSeriesDetail(jsonText) {
    var s = safeJson(jsonText);
    if (!isRecord(s) || typeof s.id !== 'number')
        return null;
    var tags = Array.isArray(s.tags) ? s.tags : [];
    return {
        id: s.id,
        name: decodeEntities(str(s.title)),
        author: decodeEntities(str(s.author)),
        genres: tags
            .map(function (t) { return (isRecord(t) ? decodeEntities(str(t.name)) : ''); })
            .filter(function (g) { return g.length > 0; }),
        status: str(s.status),
        cover: str(s.thumbnail),
        summary: stripHtml(str(s.description)),
    };
}
/**
 * Parse one page of the /chapters/{seriesId} API response.
 * Pass locked=true for pages from the /paid endpoint.
 */
function parseChapterList(jsonText, locked) {
    if (locked === void 0) { locked = false; }
    // A blank response means the request itself failed — it must never be
    // treated as a valid (empty) page, or callers would mistake a failed
    // fetch for the end of the list and return an incomplete chapter list
    // as though it were complete. Throw so the failure is loud, not silent.
    if (!jsonText || !jsonText.trim()) {
        throw new Error('Empty response while fetching the chapter list');
    }
    var root = safeJson(jsonText);
    // A non-blank but unusable response (an error page, a proxy block page,
    // truncated JSON) must fail loudly too: silently returning an empty page
    // here would make parseNovel stop fetching and present an incomplete
    // chapter list as though it were complete.
    if (!isRecord(root) || !Array.isArray(root.data)) {
        throw new Error('Invalid chapter-list response (not the expected JSON)');
    }
    var items = [];
    var lastPage = 1;
    var meta = root.meta;
    if (isRecord(meta) && typeof meta.last_page === 'number')
        lastPage = meta.last_page;
    for (var _i = 0, _a = root.data; _i < _a.length; _i++) {
        var c = _a[_i];
        if (!isRecord(c))
            continue;
        var slug = str(c.chapter_slug).trim();
        var name_1 = str(c.chapter_name).trim();
        if (!slug || !name_1)
            continue;
        var title = str(c.chapter_title).trim();
        var idx = parseFloat(str(c.index));
        items.push({
            slug: slug,
            name: title ? name_1 + ': ' + decodeEntities(title) : name_1,
            number: isNaN(idx) ? 0 : idx,
            publishedAt: str(c.created_at),
            locked: locked,
        });
    }
    return { items: items, lastPage: lastPage };
}
/**
 * The display name for a chapter in the app. Locked (paywalled) chapters
 * get a lock prefix so readers can see which ones are premium before
 * tapping them. LNReader sorts by chapterNumber, so the prefix never
 * affects chapter order.
 */
function chapterDisplayName(c) {
    return c.locked ? '🔒 ' + c.name : c.name;
}
function proxiedImageUrl(url, width) {
    var bare = url.replace(/^https?:\/\//i, '');
    return ('https://images.weserv.nl/?url=' +
        encodeURIComponent(bare) +
        '&w=' +
        width +
        '&q=80&output=webp');
}
function shrinkIllustrations(html) {
    return html.replace(/<img\b([^>]*?)\bsrc="(https?:\/\/media\.reaperscans\.net\/[^"]+)"([^>]*?)>/gi, function (_m, pre, src, post) {
        return '<img' + pre + ' src="' + proxiedImageUrl(src, 800) + '"' + post + '>';
    });
}
/**
 * Covers are served directly from the site's CDN. An earlier version
 * routed them through the images.weserv.nl proxy for smaller list
 * thumbnails, but a single URL field cannot carry a fallback: if the
 * proxy is blocked or down, every cover breaks while the site's own CDN
 * still works. The direct URL avoids that external dependency.
 * Non-URL values pass through.
 */
function coverUrl(thumbnail) {
    var t = (thumbnail || '').trim();
    if (!/^https?:\/\//i.test(t))
        return t;
    return t;
}
/**
 * Extract the chapter body from a chapter page's HTML.
 *
 * The page is a Next.js app-router page: the chapter record carries
 * `"chapter_content":"$<rowId>"` and the body HTML lives in the flight
 * row `<rowId>:T<hex>,` that follows, where <hex> is the exact UTF-8 byte
 * length of the payload. Slicing by that byte count is required — a
 * "next row" lookahead overshoots into flight metadata and corrupts the
 * HTML.
 *
 * `knownTitles` (the novel title and this chapter's display name) lets the
 * parser tell the site's repeated title header apart from a genuine
 * bold-only content line, which must be kept. Returns the cleaned HTML,
 * or a non-ok status for locked / missing / unparseable chapters.
 */
function parseChapterContent(html, knownTitles) {
    if (/this chapter is premium!/i.test(html))
        return { status: 'premium' };
    // Only the real <title> element counts for the 404 check: Next.js flight
    // data always embeds a notFound template containing similar wording.
    var title = /<title[^>]*>([\s\S]*?)<\/title>/i.exec(html);
    if (title && /^\s*404/i.test(title[1]))
        return { status: 'notfound' };
    var flight = extractFlightText(html);
    // chapter_content is either a flight-row reference ("$<rowId>") or the
    // chapter HTML inline (gallery/illustration chapters). The value is a
    // JSON string, so internal quotes arrive escaped.
    var contentM = /"chapter_content":"((?:[^"\\]|\\.)*)"/.exec(flight);
    if (!contentM)
        return { status: 'empty' };
    var raw;
    try {
        raw = JSON.parse('"' + contentM[1] + '"');
    }
    catch (_a) {
        return { status: 'empty' };
    }
    var payload;
    var rowRef = /^\$([0-9a-z]{1,4})$/.exec(raw);
    if (rowRef) {
        // The row looks like `<rowId>:T<hex>,<payload>` where <hex> is the exact
        // UTF-8 byte length of the payload. Respecting it is the only reliable
        // end boundary: flight metadata follows the payload on the same line,
        // so a "next row" lookahead overshoots.
        var rowRe = new RegExp('\\n' +
            rowRef[1].replace(/[.*+?^${}()|[\]\\]/g, '\\$&') +
            ':T([0-9a-f]+),');
        var row = rowRe.exec(flight);
        if (!row)
            return { status: 'empty' };
        var byteLen = parseInt(row[1], 16);
        if (!(byteLen > 0))
            return { status: 'empty' };
        var payloadStart = row.index + row[0].length;
        payload = sliceUtf8Bytes(flight, payloadStart, byteLen);
    }
    else if (/^\s*</.test(raw)) {
        payload = raw;
    }
    else {
        return { status: 'empty' };
    }
    if (!payload)
        return { status: 'empty' };
    // Paragraph breaks inside the payload are literal \r\n / \n sequences.
    var body = payload
        .replace(/\\r\\n/g, '\n')
        .replace(/\\n/g, '\n')
        .replace(/\\r/g, '\n')
        .trim();
    if (!body)
        return { status: 'empty' };
    // Split into top-level blocks in document order. Paragraphs, headings,
    // figures and standalone images are recognized; anything else that
    // carries text (lists, tables, blockquotes, divs) is kept too — dropping
    // it would silently lose chapter content. Only the site's promo header /
    // footer (banner, credits, title repeats, discord plug) is trimmed from
    // the edges.
    var blocks = [];
    var blockRe = /<p[\s\S]*?<\/p>|<h[1-6][\s\S]*?<\/h[1-6]>|<figure[\s\S]*?<\/figure>|<img[^>]*>/gi;
    var last = 0;
    var bm;
    while ((bm = blockRe.exec(body)) !== null) {
        var gap = body.slice(last, bm.index);
        if (gap.replace(/<[^>]+>/g, '').trim())
            blocks.push(gap.trim());
        blocks.push(bm[0]);
        last = bm.index + bm[0].length;
    }
    var tail = body.slice(last);
    if (tail.replace(/<[^>]+>/g, '').trim())
        blocks.push(tail.trim());
    if (blocks.length === 0)
        blocks.push(body);
    var start = 0;
    var end = blocks.length;
    var isEdgeJunk = function (p) {
        return isPromoParagraph(p) || isCreditLine(p) || isTitleRepeat(p, knownTitles);
    };
    while (start < end && isEdgeJunk(blocks[start]))
        start++;
    while (end > start && isEdgeJunk(blocks[end - 1]))
        end--;
    var cleaned = blocks.slice(start, end).join('\n');
    // An image-only chapter (illustrations with no text) is still real
    // content — it must not be reported as empty.
    if (!paragraphText(cleaned) && !/<img[\s>]/i.test(cleaned))
        return { status: 'empty' };
    // The reader renders this HTML unsanitized, so strip anything that
    // could run code (event handlers, scripts, javascript: URLs) first.
    return { status: 'ok', html: sanitizeHtml(shrinkIllustrations(cleaned)) };
}
function mapStatus(s) {
    if (s === 'Ongoing')
        return novelStatus_1.NovelStatus.Ongoing;
    if (s === 'Completed')
        return novelStatus_1.NovelStatus.Completed;
    if (s === 'Hiatus' || s === 'On Hiatus')
        return novelStatus_1.NovelStatus.OnHiatus;
    if (s === 'Cancelled' || s === 'Dropped')
        return novelStatus_1.NovelStatus.Cancelled;
    return novelStatus_1.NovelStatus.Unknown;
}
// --- Catalog filters ----------------------------------------------------
// The API honors `status` but ignores `tags` and `sort`, so the filter
// menu offers status only.
var STATUS_FILTER_OPTIONS = [
    { label: 'All', value: 'all' },
    { label: 'Ongoing', value: 'Ongoing' },
    { label: 'Completed', value: 'Completed' },
    { label: 'Dropped', value: 'Dropped' },
    { label: 'Canceled', value: 'Canceled' },
];
/**
 * Pull a plain string value out of the app's filter payload, which may be
 * the raw string or a { type, value } wrapper object.
 */
function extractFilterValue(filters, key) {
    if (!filters || typeof filters !== 'object')
        return '';
    var f = filters[key];
    if (f === null || f === undefined)
        return '';
    var v = typeof f === 'object' && 'value' in f ? f.value : f;
    return typeof v === 'string' ? v : '';
}
var WeTriedTLS = /** @class */ (function () {
    function WeTriedTLS() {
        this.id = 'wetriedtls';
        this.name = 'We Tried TLS';
        this.icon = 'src/en/wetriedtls/icon.png';
        this.site = SITE;
        this.version = '1.0.6';
        // Novel/chapter titles behind each chapter path, recorded by parseNovel.
        // parseChapter passes them to parseChapterContent so the site's repeated
        // title header can be told apart from a genuine bold-only content line
        // (which must be kept).
        this.chapterTitles = {};
        this.filters = {
            status: {
                type: filterInputs_1.FilterTypes.Picker,
                label: 'Status',
                value: 'all',
                options: STATUS_FILTER_OPTIONS,
            },
        };
        this.resolveUrl = function (path, _isNovel) {
            return SITE + '/series/' + path;
        };
    }
    WeTriedTLS.prototype.popularNovels = function (pageNo_1, _a) {
        return __awaiter(this, arguments, void 0, function (pageNo, _b) {
            var status, page, _c;
            var filters = _b.filters;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        status = extractFilterValue(filters, 'status');
                        _c = parseQueryResults;
                        return [4 /*yield*/, (0, fetch_1.fetchText)(catalogUrl(pageNo, status))];
                    case 1:
                        page = _c.apply(void 0, [_d.sent()]);
                        if (pageNo > page.lastPage)
                            return [2 /*return*/, []];
                        return [2 /*return*/, page.items.map(function (n) { return ({
                                name: n.title,
                                path: n.slug,
                                cover: coverUrl(n.cover),
                            }); })];
                }
            });
        });
    };
    WeTriedTLS.prototype.parseNovel = function (novelPath) {
        return __awaiter(this, void 0, void 0, function () {
            var slug, detail, _a, all, pageNo, lastPage, json, page, _i, _b, c, paidPageNo, paidLastPage, page, _c, _d, _e, c, _f, seen, chapters, novel;
            var _this = this;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0:
                        slug = novelPath.split('/').filter(Boolean).pop() || '';
                        _a = parseSeriesDetail;
                        return [4 /*yield*/, (0, fetch_1.fetchText)(API + '/series/' + slug)];
                    case 1:
                        detail = _a.apply(void 0, [_g.sent()]);
                        if (!detail)
                            throw new Error('Could not load novel details');
                        all = [];
                        pageNo = 1;
                        lastPage = 1;
                        _g.label = 2;
                    case 2: return [4 /*yield*/, (0, fetch_1.fetchText)(API +
                            '/chapters/' +
                            detail.id +
                            '?page=' +
                            pageNo +
                            '&perPage=500&order=asc')];
                    case 3:
                        json = _g.sent();
                        // The official fetchText returns '' when the request fails. That must
                        // never be treated as a valid page: parseChapterList would default
                        // lastPage to 1 and parseNovel would return an incomplete chapter
                        // list as though it were complete. Fail loudly instead.
                        if (!json || !json.trim())
                            throw new Error('Failed to load the chapter list (page ' + pageNo + ')');
                        page = parseChapterList(json);
                        lastPage = page.lastPage;
                        for (_i = 0, _b = page.items; _i < _b.length; _i++) {
                            c = _b[_i];
                            all.push(c);
                        }
                        pageNo++;
                        _g.label = 4;
                    case 4:
                        if (pageNo <= lastPage) return [3 /*break*/, 2];
                        _g.label = 5;
                    case 5:
                        _g.trys.push([5, 10, , 11]);
                        paidPageNo = 1;
                        paidLastPage = 1;
                        _g.label = 6;
                    case 6:
                        _c = parseChapterList;
                        return [4 /*yield*/, (0, fetch_1.fetchText)(API +
                                '/chapters/' +
                                detail.id +
                                '/paid?query=&page=' +
                                paidPageNo +
                                '&perPage=1000&order=asc')];
                    case 7:
                        page = _c.apply(void 0, [_g.sent(), true]);
                        paidLastPage = page.lastPage;
                        for (_d = 0, _e = page.items; _d < _e.length; _d++) {
                            c = _e[_d];
                            all.push(c);
                        }
                        paidPageNo++;
                        _g.label = 8;
                    case 8:
                        if (paidPageNo <= paidLastPage) return [3 /*break*/, 6];
                        _g.label = 9;
                    case 9: return [3 /*break*/, 11];
                    case 10:
                        _f = _g.sent();
                        return [3 /*break*/, 11];
                    case 11:
                        seen = {};
                        chapters = [];
                        all
                            .filter(function (c) {
                            if (!c.slug || seen[c.slug])
                                return false;
                            seen[c.slug] = true;
                            return true;
                        })
                            .sort(function (a, b) { return a.number - b.number; })
                            .forEach(function (c) {
                            var displayName = chapterDisplayName(c);
                            var chapterPath = slug + '/' + c.slug;
                            chapters.push({
                                name: displayName,
                                path: chapterPath,
                                releaseTime: c.publishedAt,
                                chapterNumber: c.number,
                            });
                            _this.chapterTitles[chapterPath] = [
                                detail.name,
                                displayName.replace(/^🔒\s*/, ''),
                            ];
                        });
                        novel = {
                            path: novelPath,
                            name: detail.name,
                            status: mapStatus(detail.status),
                        };
                        if (detail.cover)
                            novel.cover = coverUrl(detail.cover);
                        if (detail.author)
                            novel.author = detail.author;
                        if (detail.genres.length)
                            novel.genres = detail.genres.join(', ');
                        if (detail.summary)
                            novel.summary = detail.summary;
                        novel.chapters = chapters;
                        return [2 /*return*/, novel];
                }
            });
        });
    };
    WeTriedTLS.prototype.parseChapter = function (chapterPath) {
        return __awaiter(this, void 0, void 0, function () {
            var result, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = parseChapterContent;
                        return [4 /*yield*/, (0, fetch_1.fetchText)(SITE + '/series/' + chapterPath)];
                    case 1:
                        result = _a.apply(void 0, [_b.sent(), this.chapterTitles[chapterPath]]);
                        if (result.status === 'ok')
                            return [2 /*return*/, result.html];
                        if (result.status === 'premium') {
                            return [2 /*return*/, ('<p><strong>This chapter is premium on We Tried TLS.</strong></p>' +
                                    '<p>It requires a paid subscription on the website and cannot be read here. ' +
                                    'Free chapters of this novel still work.</p>')];
                        }
                        if (result.status === 'notfound') {
                            return [2 /*return*/, ('<p><strong>This chapter is no longer available on We Tried TLS.</strong></p>' +
                                    '<p>It may have been removed or moved. Refresh the novel to update the chapter list.</p>')];
                        }
                        return [2 /*return*/, ('<p><strong>Could not load this chapter.</strong></p>' +
                                '<p>It may be temporarily unavailable on We Tried TLS.</p>')];
                }
            });
        });
    };
    WeTriedTLS.prototype.searchNovels = function (searchTerm, pageNo) {
        return __awaiter(this, void 0, void 0, function () {
            var page, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = parseQueryResults;
                        return [4 /*yield*/, (0, fetch_1.fetchText)(API +
                                '/query?adult=true&query_string=' +
                                encodeURIComponent(searchTerm) +
                                '&page=' +
                                pageNo)];
                    case 1:
                        page = _a.apply(void 0, [_b.sent()]);
                        if (pageNo > page.lastPage)
                            return [2 /*return*/, []];
                        return [2 /*return*/, page.items.map(function (n) { return ({
                                name: n.title,
                                path: n.slug,
                                cover: coverUrl(n.cover),
                            }); })];
                }
            });
        });
    };
    return WeTriedTLS;
}());
exports.default = new WeTriedTLS();
