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
/**
 * Upper bound on a page this plugin will parse. Site pages are orders
 * of magnitude smaller; anything bigger is a broken or hostile
 * response, and regex-scanning it would bill the reader's phone, not
 * the site. Enforced before any parsing happens.
 */
var MAX_PAGE_CHARS = 10000000;
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
function fetchPage(url, what) {
    return __awaiter(this, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, fetch_1.fetchApi)(url)];
                case 1:
                    res = _a.sent();
                    if (!res.ok) {
                        throw httpError("".concat(what, ": HTTP ").concat(res.status), res.status);
                    }
                    return [2 /*return*/, res.text()];
            }
        });
    });
}
var HTML_ENTITY_CHARS = {
    amp: '&',
    quot: '"',
    '#39': "'",
    apos: "'",
    lt: '<',
    gt: '>',
    nbsp: ' ',
    ndash: '–',
    mdash: '—',
    hellip: '…',
    lsquo: '‘',
    rsquo: '’',
    ldquo: '“',
    rdquo: '”',
};
/** Encode one Unicode code point without String.fromCodePoint. */
function codePointToString(cp) {
    if (cp < 0x10000)
        return String.fromCharCode(cp);
    var v = cp - 0x10000;
    return String.fromCharCode(0xd800 + (v >> 10), 0xdc00 + (v & 0x3ff));
}
function decodeHtmlEntities(s) {
    // Named entities first (single pass so "&amp;lt;" stays literal),
    // then numeric entities (&#8217; / &#x2019;).
    return s
        .replace(/&(amp|quot|#39|apos|lt|gt|nbsp|ndash|mdash|hellip|lsquo|rsquo|ldquo|rdquo);/g, function (m, e) { var _a; return (_a = HTML_ENTITY_CHARS[e]) !== null && _a !== void 0 ? _a : m; })
        .replace(/&#(\d+);/g, function (m, d) {
        var cp = parseInt(d, 10);
        return cp > 0 && cp <= 0x10ffff ? codePointToString(cp) : m;
    })
        .replace(/&#x([0-9a-fA-F]+);/g, function (m, h) {
        var cp = parseInt(h, 16);
        return cp > 0 && cp <= 0x10ffff ? codePointToString(cp) : m;
    });
}
function stripTags(s) {
    return s.replace(/<[^>]*>/g, '');
}
function cleanText(s) {
    return decodeHtmlEntities(stripTags(s)).replace(/\s+/g, ' ').trim();
}
function checkSize(html) {
    if (html.length > MAX_PAGE_CHARS)
        throw new Error('Page too large to parse');
}
/**
 * Catalog / search cards: <a class="ln-ncard" href="/novel/<slug>">
 * wrapping a cover <img> and an <h3> title.
 */
function parseCatalogCards(html) {
    checkSize(html);
    var cards = [];
    var seen = new Set();
    var anchorRe = /<a\b([^>]*)>([\s\S]*?)<\/a>/g;
    var m;
    while ((m = anchorRe.exec(html)) !== null) {
        var attrs = m[1];
        if (!/\bln-ncard\b/.test(attrs))
            continue;
        var href = /\bhref="([^"]+)"/.exec(attrs);
        if (!href || !href[1].startsWith('/novel/'))
            continue;
        var path = href[1];
        if (seen.has(path))
            continue;
        seen.add(path);
        var body = m[2];
        var name_1 = '';
        var h3 = /<h3\b[^>]*>([\s\S]*?)<\/h3>/.exec(body);
        if (h3)
            name_1 = cleanText(h3[1]);
        var cover = void 0;
        var img = /<img\b([^>]*)>/.exec(body);
        if (img) {
            var src = /\bsrc="([^"]+)"/.exec(img[1]);
            if (src)
                cover = src[1];
            if (!name_1) {
                var alt = /\balt="([^"]*)"/.exec(img[1]);
                if (alt)
                    name_1 = cleanText(alt[1]);
            }
        }
        if (!name_1)
            continue;
        cards.push({ name: name_1, path: path, cover: cover });
    }
    return cards;
}
function findLdBook(html) {
    var re = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g;
    var m;
    while ((m = re.exec(html)) !== null) {
        try {
            var data = JSON.parse(m[1]);
            var graph = Array.isArray(data['@graph'])
                ? data['@graph']
                : [data];
            for (var _i = 0, graph_1 = graph; _i < graph_1.length; _i++) {
                var node = graph_1[_i];
                var n = node;
                if (n && n['@type'] === 'Book')
                    return n;
            }
        }
        catch (e) {
            // Not valid JSON — keep looking at the next block.
        }
    }
    return null;
}
/** Novel details from the novel page (JSON-LD, with DOM fallbacks). */
function parseNovelDetails(html) {
    checkSize(html);
    var book = findLdBook(html);
    var name = book && book.name ? cleanText(book.name) : '';
    if (!name) {
        var h1 = /<h1\b[^>]*class="[^"]*ln-dtitle[^"]*"[^>]*>([\s\S]*?)<\/h1>/.exec(html);
        if (h1)
            name = cleanText(h1[1]);
    }
    var cover = book && book.image ? book.image : '';
    if (!cover) {
        var dc = /<div\b[^>]*class="[^"]*ln-dcv[^"]*"[^>]*>([\s\S]*?)<\/div>/.exec(html);
        if (dc) {
            var img = /\bsrc="([^"]+)"/.exec(dc[1]);
            if (img)
                cover = img[1];
        }
    }
    var authorNames = [];
    if (book && Array.isArray(book.author)) {
        for (var _i = 0, _a = book.author; _i < _a.length; _i++) {
            var a = _a[_i];
            if (a && a.name)
                authorNames.push(cleanText(a.name));
        }
    }
    return {
        name: name,
        cover: cover,
        summary: book && book.description ? cleanText(book.description) : '',
        author: authorNames.join(', '),
        genres: book && Array.isArray(book.genre)
            ? book.genre.map(function (g) { return cleanText(String(g)); }).filter(function (g) { return g.length > 0; })
            : [],
        statusRaw: book && book.creativeWorkStatus ? book.creativeWorkStatus : '',
    };
}
/**
 * Chapter list from GET /api/novel-chapters?slug=<slug>.
 * The novel page itself only embeds the first few and latest few
 * chapters, so the full list has to come from this endpoint — the
 * same one the site's "Show all chapters" button uses.
 * Entries are sorted ascending by chapter number; the chapter's site
 * path is /novel/<novel slug>/<entry slug>.
 */
function parseChapterList(text) {
    checkSize(text);
    var data;
    try {
        data = JSON.parse(text);
    }
    catch (e) {
        throw new Error('Chapter list response was not valid JSON');
    }
    var raw = Array.isArray(data)
        ? data
        : (function () {
            if (data === null || typeof data !== 'object') {
                throw new Error('Chapter list response had an unexpected shape');
            }
            var chapters = data.chapters;
            if (!Array.isArray(chapters)) {
                // An error payload or a changed shape must surface as a
                // clear error — never as a novel that silently shows zero
                // chapters. A genuine empty array stays valid.
                throw new Error('Chapter list response had an unexpected shape');
            }
            return chapters;
        })();
    var entries = [];
    for (var _i = 0, raw_1 = raw; _i < raw_1.length; _i++) {
        var item = raw_1[_i];
        var it = item;
        if (!it || typeof it.slug !== 'string' || !it.slug)
            continue;
        var number = typeof it.number === 'number'
            ? it.number
            : parseInt(String(it.slug).replace(/\D+/g, ''), 10) ||
                entries.length + 1;
        entries.push({
            slug: it.slug,
            title: it.title ? cleanText(it.title) : 'Chapter ' + number,
            number: number,
            createdAt: it.createdAt,
        });
    }
    entries.sort(function (a, b) { return a.number - b.number; });
    return entries;
}
/**
 * Chapter body: the inner HTML of <div class="ln-prose">. Scripts,
 * styles and comments are removed before locating the div, so a
 * `.ln-prose` CSS rule, a JS reference to the class, or a comment
 * earlier in the page can never mislocate the content; the div is
 * then matched to its closing tag by depth scan so nested markup
 * can never truncate the content.
 */
function parseChapterContent(html) {
    checkSize(html);
    var clean = html
        .replace(/<script\b[\s\S]*?<\/script>/gi, '')
        .replace(/<style\b[\s\S]*?<\/style>/gi, '')
        .replace(/<!--[\s\S]*?-->/g, '');
    // Find the real opening tag whose class list contains ln-prose —
    // never a bare indexOf('ln-prose'), which can land inside a style
    // rule, a script, or a comment and grab the wrong div (or none).
    var openRe = /<div\b[^>]*>/g;
    var m;
    var tagEnd = -1;
    while ((m = openRe.exec(clean)) !== null) {
        var cls = /\bclass\s*=\s*(?:"([^"]*)"|'([^']*)')/.exec(m[0]);
        var tokens = (cls && (cls[1] !== undefined ? cls[1] : cls[2])) || '';
        if (/(^|\s)ln-prose(\s|$)/.test(tokens)) {
            tagEnd = m.index + m[0].length;
            break;
        }
    }
    if (tagEnd < 0)
        return '';
    var depth = 1;
    var contentStart = tagEnd;
    var divRe = /<\/?div\b[^>]*>/g;
    divRe.lastIndex = contentStart;
    var contentEnd = -1;
    while ((m = divRe.exec(clean)) !== null) {
        if (m[0].startsWith('</')) {
            depth--;
            if (depth === 0) {
                contentEnd = m.index;
                break;
            }
        }
        else if (!m[0].endsWith('/>')) {
            depth++;
        }
    }
    if (contentEnd < 0)
        return '';
    return clean.slice(contentStart, contentEnd).trim();
}
var LightNovelTo = /** @class */ (function () {
    function LightNovelTo() {
        this.id = 'lightnovelto';
        this.name = 'LightNovel.to';
        this.icon = 'src/en/lightnovelto/icon.png';
        this.site = 'https://lightnovel.to';
        this.version = '1.0.0';
    }
    LightNovelTo.prototype.popularNovels = function (pageNo, options) {
        return __awaiter(this, void 0, void 0, function () {
            var sort, html;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sort = options && options.showLatestNovels ? 'latest' : 'popular';
                        return [4 /*yield*/, fetchPage("".concat(this.site, "/novels?sort=").concat(sort, "&page=").concat(pageNo), 'Failed to load popular novels')];
                    case 1:
                        html = _a.sent();
                        return [2 /*return*/, parseCatalogCards(html)];
                }
            });
        });
    };
    LightNovelTo.prototype.parseNovel = function (novelPath) {
        return __awaiter(this, void 0, void 0, function () {
            var slug, html, details, listText, entries, chapters, status;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        slug = novelPath.replace(/^\/novel\//, '').replace(/\/+$/, '');
                        return [4 /*yield*/, fetchPage(this.site + novelPath, 'Failed to load novel page')];
                    case 1:
                        html = _a.sent();
                        details = parseNovelDetails(html);
                        if (!details.name) {
                            throw new Error('Could not parse the novel page for ' + novelPath);
                        }
                        return [4 /*yield*/, fetchPage("".concat(this.site, "/api/novel-chapters?slug=").concat(encodeURIComponent(slug)), 'Failed to load chapter list')];
                    case 2:
                        listText = _a.sent();
                        entries = parseChapterList(listText);
                        chapters = entries.map(function (e) { return ({
                            name: e.title,
                            path: "/novel/".concat(slug, "/").concat(e.slug),
                            releaseTime: e.createdAt,
                            chapterNumber: e.number,
                        }); });
                        status = details.statusRaw === 'Completed'
                            ? novelStatus_1.NovelStatus.Completed
                            : details.statusRaw === 'Incomplete'
                                ? novelStatus_1.NovelStatus.Ongoing
                                : novelStatus_1.NovelStatus.Unknown;
                        return [2 /*return*/, {
                                path: novelPath,
                                name: details.name,
                                cover: details.cover || undefined,
                                summary: details.summary || undefined,
                                author: details.author || undefined,
                                genres: details.genres.length ? details.genres.join(', ') : undefined,
                                status: status,
                                chapters: chapters,
                            }];
                }
            });
        });
    };
    LightNovelTo.prototype.parseChapter = function (chapterPath) {
        return __awaiter(this, void 0, void 0, function () {
            var html, content;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fetchPage(this.site + chapterPath, 'Failed to load chapter')];
                    case 1:
                        html = _a.sent();
                        content = parseChapterContent(html);
                        if (!content) {
                            throw new Error('Chapter content not found on the page');
                        }
                        return [2 /*return*/, content];
                }
            });
        });
    };
    LightNovelTo.prototype.searchNovels = function (searchTerm, pageNo) {
        return __awaiter(this, void 0, void 0, function () {
            var html;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fetchPage("".concat(this.site, "/novels?search=").concat(encodeURIComponent(searchTerm), "&page=").concat(pageNo), 'Failed to search novels')];
                    case 1:
                        html = _a.sent();
                        return [2 /*return*/, parseCatalogCards(html)];
                }
            });
        });
    };
    LightNovelTo.prototype.resolveUrl = function (path) {
        // Absolute URLs (e.g. the cover image, which EPUB export passes
        // through here) must go out unchanged.
        return /^https?:\/\//i.test(path) ? path : this.site + path;
    };
    return LightNovelTo;
}());
exports.default = new LightNovelTo();
