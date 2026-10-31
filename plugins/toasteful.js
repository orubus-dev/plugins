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
var cheerio_1 = require("cheerio");
var defaultCover_1 = require("@libs/defaultCover");
var novelStatus_1 = require("@libs/novelStatus");
var NOVEL_LABEL = 'Web Novel';
var PAGE_SIZE = 25;
var CHAPTER_PATH = /^\/\d{4}\/\d{2}\/[^/]+\.html$/;
var PLACEHOLDER_COVER = 'No_image_available';
var MAX_PARTS = 20;
var Toasteful = /** @class */ (function () {
    function Toasteful() {
        this.id = 'toasteful';
        this.name = 'Toasteful';
        this.site = 'https://www.toasteful.com';
        this.icon = 'src/en/toasteful/icon.png';
        this.version = '1.0.2';
        this.listedCache = new Map();
        this.filters = {
            genres: {
                label: 'Genres',
                value: [],
                options: [
                    'Action',
                    'Adventure',
                    'Comedy',
                    'Drama',
                    'Ecchi',
                    'Fantasy',
                    'Harem',
                    'Isekai',
                    'Reincarnation',
                    'Romance',
                    'Slice of Life',
                    'Slow Life',
                    'Supernatural',
                    'Overpowered',
                    'Villain',
                ].map(function (label) { return ({ label: label, value: label }); }),
                type: filterInputs_1.FilterTypes.CheckboxGroup,
            },
        };
    }
    Toasteful.prototype.request = function (url) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, fetch_1.fetchApi)(url)];
                    case 1:
                        response = _a.sent();
                        if (!response.ok) {
                            throw Object.assign(new Error("Toasteful: HTTP ".concat(response.status, ".")), {
                                status: response.status,
                            });
                        }
                        return [2 /*return*/, response];
                }
            });
        });
    };
    Toasteful.prototype.feedUrl = function (labels, params) {
        var path = labels.map(function (label) { return encodeURIComponent(label); }).join('/');
        var query = new URLSearchParams(__assign({ 'alt': 'json' }, params)).toString();
        return "".concat(this.site, "/feeds/posts/default/-/").concat(path, "?").concat(query);
    };
    Toasteful.prototype.entryToNovel = function (entry) {
        var _a, _b, _c, _d, _e;
        try {
            var href = (_b = (_a = entry.link) === null || _a === void 0 ? void 0 : _a.find(function (link) { return link.rel === 'alternate'; })) === null || _b === void 0 ? void 0 : _b.href;
            if (!href)
                return undefined;
            var name_1 = (_d = (_c = entry.title) === null || _c === void 0 ? void 0 : _c.$t) === null || _d === void 0 ? void 0 : _d.replace(/^\(NEW!!!\)\s*/, '').trim();
            if (!name_1)
                return undefined;
            var resolved = this.resolveUrl(href);
            var cover = void 0;
            var html = (_e = entry.content) === null || _e === void 0 ? void 0 : _e.$t;
            if (html) {
                var src = (0, cheerio_1.load)(html)('img').first().attr('src');
                if (src && !src.includes(PLACEHOLDER_COVER))
                    cover = src;
            }
            return {
                name: name_1,
                path: new URL(resolved).pathname,
                cover: cover || defaultCover_1.defaultCover,
            };
        }
        catch (_f) {
            return undefined;
        }
    };
    Toasteful.prototype.popularNovels = function (pageNo_1, _a) {
        return __awaiter(this, arguments, void 0, function (pageNo, _b) {
            var labels, params, data, entries, novels, _i, entries_1, entry, novel;
            var _c, _d;
            var showLatestNovels = _b.showLatestNovels, filters = _b.filters;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        labels = __spreadArray([NOVEL_LABEL], (((_c = filters === null || filters === void 0 ? void 0 : filters.genres) === null || _c === void 0 ? void 0 : _c.value) || []), true);
                        params = {
                            'max-results': String(PAGE_SIZE),
                            'start-index': String((pageNo - 1) * PAGE_SIZE + 1),
                        };
                        if (showLatestNovels)
                            params['orderby'] = 'updated';
                        return [4 /*yield*/, this.request(this.feedUrl(labels, params))];
                    case 1: return [4 /*yield*/, (_e.sent()).json()];
                    case 2:
                        data = _e.sent();
                        entries = ((_d = data.feed) === null || _d === void 0 ? void 0 : _d.entry) || [];
                        novels = [];
                        for (_i = 0, entries_1 = entries; _i < entries_1.length; _i++) {
                            entry = entries_1[_i];
                            novel = this.entryToNovel(entry);
                            if (novel)
                                novels.push(novel);
                        }
                        return [2 /*return*/, novels];
                }
            });
        });
    };
    Toasteful.prototype.parseNovel = function (novelPath) {
        return __awaiter(this, void 0, void 0, function () {
            var url, $, _a, name, coverSrc, cover, labels, statusLabel, status, normalize, novelLabel, genres, authorText, author, body, summary, article, synopsis, paragraphs_1, inChapters_1, chapters, seen, volume;
            var _this = this;
            var _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        url = this.resolveUrl(novelPath);
                        _a = cheerio_1.load;
                        return [4 /*yield*/, this.request(url)];
                    case 1: return [4 /*yield*/, (_e.sent()).text()];
                    case 2:
                        $ = _a.apply(void 0, [_e.sent()]);
                        name = $('h3.post-title').text().trim() ||
                            ((_b = $('meta[property="og:title"]').attr('content')) === null || _b === void 0 ? void 0 : _b.trim()) ||
                            'Untitled';
                        coverSrc = $('link[rel="image_src"]').attr('href') ||
                            $('.post-body img').first().attr('src');
                        cover = coverSrc && !coverSrc.includes(PLACEHOLDER_COVER)
                            ? coverSrc
                            : defaultCover_1.defaultCover;
                        labels = $('span.post-labels a[rel="tag"]')
                            .toArray()
                            .map(function (el) { return $(el).text().trim(); })
                            .filter(Boolean);
                        statusLabel = (_c = labels
                            .find(function (label) { return /completed|on-?going|dropped|hiatus/i.test(label); })) === null || _c === void 0 ? void 0 : _c.toLowerCase();
                        if (statusLabel) {
                            if (/completed/.test(statusLabel))
                                status = novelStatus_1.NovelStatus.Completed;
                            else if (/on-?going/.test(statusLabel))
                                status = novelStatus_1.NovelStatus.Ongoing;
                            else if (/dropped/.test(statusLabel))
                                status = novelStatus_1.NovelStatus.Cancelled;
                            else if (/hiatus/.test(statusLabel))
                                status = novelStatus_1.NovelStatus.OnHiatus;
                        }
                        normalize = function (text) {
                            return text.toLowerCase().replace(/[^a-z0-9]/g, '');
                        };
                        novelLabel = normalize(name);
                        genres = labels
                            .filter(function (label) {
                            return !/completed|on-?going|dropped|hiatus/i.test(label) &&
                                label.toLowerCase() !== NOVEL_LABEL.toLowerCase() &&
                                label.toLowerCase() !== 'light novel' &&
                                normalize(label) !== novelLabel;
                        })
                            .join(', ');
                        authorText = $('.post-body')
                            .find('b')
                            .toArray()
                            .map(function (el) { return $(el).parent().text(); })
                            .find(function (text) { return /^author:/i.test(text.trim()); });
                        author = authorText
                            ? ((_d = authorText
                                .trim()
                                .replace(/^author:\s*/i, '')
                                .split(/\n|genre:|raw\s*source:|raw:|status:|synopsis:/i)[0]) === null || _d === void 0 ? void 0 : _d.trim()) || undefined
                            : undefined;
                        body = $('.post-body').first();
                        summary = '';
                        article = body.find('article').first();
                        if (article.length) {
                            synopsis = article.clone();
                            synopsis.find('b').each(function (_, el) {
                                if (/^synopsis:/i.test($(el).text().trim()))
                                    $(el).remove();
                            });
                            summary = synopsis.text().trim();
                        }
                        else {
                            paragraphs_1 = [];
                            inChapters_1 = false;
                            body.find('p, a[href]').each(function (_, el) {
                                var node = $(el);
                                if (node.is('a')) {
                                    if (_this.isChapterLink(node.attr('href'), url, node.text()))
                                        inChapters_1 = true;
                                    return;
                                }
                                if (inChapters_1)
                                    return;
                                var text = node.text().trim();
                                if (!text || /^genre:/i.test(text) || /raw source:/i.test(text))
                                    return;
                                paragraphs_1.push(text);
                            });
                            summary = paragraphs_1.join('\n\n');
                        }
                        chapters = [];
                        seen = new Set();
                        body.find('b, a[href]').each(function (_, el) {
                            var _a;
                            var node = $(el);
                            if (node.is('a')) {
                                var href = node.attr('href');
                                if (!_this.isChapterLink(href, url, node.text()))
                                    return;
                                var chapterPath = new URL(href, _this.site).pathname;
                                if (seen.has(chapterPath))
                                    return;
                                seen.add(chapterPath);
                                var chapterName = node.text().trim().replace(/\s+/g, ' ');
                                if (!chapterName)
                                    return;
                                var number = (_a = /chapter\s+(\d+(?:\.\d+)?)/i.exec(chapterName)) === null || _a === void 0 ? void 0 : _a[1];
                                chapters.push({
                                    name: volume ? "".concat(volume, " - ").concat(chapterName) : chapterName,
                                    path: chapterPath,
                                    chapterNumber: number ? Number(number) : undefined,
                                });
                                return;
                            }
                            if (node.find('a[href]').length)
                                return;
                            var text = node.text().trim().replace(/\s+/g, ' ');
                            if (/^(volume|afterstory)\b/i.test(text))
                                volume = text;
                        });
                        if (!chapters.length)
                            throw new Error('Toasteful: no chapters were found on this page.');
                        return [2 /*return*/, {
                                name: name,
                                path: new URL(url).pathname,
                                cover: cover,
                                summary: summary || undefined,
                                author: author,
                                genres: genres || undefined,
                                status: status,
                                chapters: chapters,
                            }];
                }
            });
        });
    };
    Toasteful.prototype.isChapterLink = function (href, pageUrl, linkText) {
        if (!href)
            return false;
        var path;
        try {
            var parsed = new URL(href, this.site);
            if (parsed.origin !== this.site)
                return false;
            path = parsed.pathname;
        }
        catch (_a) {
            return false;
        }
        if (!CHAPTER_PATH.test(path))
            return false;
        if (path === new URL(pageUrl).pathname)
            return false;
        // Side-story hubs are linked as bare "here" pointers, not chapters.
        if (linkText.trim().toLowerCase() === 'here')
            return false;
        if (!/\b(chapter|episode|part|prologue|epilogue|interlude|afterstory|volume)\b|\bside\s*story\b/i.test(linkText))
            return false;
        return true;
    };
    Toasteful.prototype.parseChapter = function (chapterPath) {
        return __awaiter(this, void 0, void 0, function () {
            var url, $, _a, novelHref, next, parts, novelPath, currentPath, firstSlug, seen, part, nextPath, parsed, response, $part, _b, content, chapter;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        url = this.resolveUrl(chapterPath);
                        _a = cheerio_1.load;
                        return [4 /*yield*/, this.request(url)];
                    case 1: return [4 /*yield*/, (_c.sent()).text()];
                    case 2:
                        $ = _a.apply(void 0, [_c.sent()]);
                        novelHref = $('.ChapterNav a.all').attr('href');
                        next = $('.ChapterNav a.next').attr('href');
                        parts = [this.chapterContent($)];
                        if (!novelHref) return [3 /*break*/, 7];
                        novelPath = new URL(novelHref, this.site).pathname;
                        currentPath = new URL(url).pathname;
                        firstSlug = this.slug(currentPath);
                        seen = new Set([currentPath]);
                        _c.label = 3;
                    case 3:
                        if (!(parts.length < MAX_PARTS)) return [3 /*break*/, 7];
                        // Some posts ship an empty "Next CH." that the site fills in by
                        // guessing the next part number; guess the same way.
                        if (!next) {
                            part = /^(.*)-(\d+)$/.exec(this.slug(currentPath));
                            if (!part)
                                return [3 /*break*/, 7];
                            next = currentPath.replace(/[^/]+\.html$/, "".concat(part[1], "-").concat(Number(part[2]) + 1, ".html"));
                        }
                        nextPath = void 0;
                        try {
                            parsed = new URL(next, this.site);
                            if (parsed.origin !== this.site)
                                return [3 /*break*/, 7];
                            nextPath = parsed.pathname;
                        }
                        catch (_d) {
                            return [3 /*break*/, 7];
                        }
                        if (seen.has(nextPath))
                            return [3 /*break*/, 7];
                        if (!this.isPartOf(firstSlug, this.slug(nextPath), this.slug(novelPath)))
                            return [3 /*break*/, 7];
                        return [4 /*yield*/, this.listedPaths(novelPath)];
                    case 4:
                        if ((_c.sent()).has(nextPath))
                            return [3 /*break*/, 7];
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(this.site + nextPath)];
                    case 5:
                        response = _c.sent();
                        if (response.status === 404)
                            return [3 /*break*/, 7];
                        if (!response.ok) {
                            throw new Error("Toasteful: HTTP ".concat(response.status, "."));
                        }
                        seen.add(nextPath);
                        currentPath = nextPath;
                        _b = cheerio_1.load;
                        return [4 /*yield*/, response.text()];
                    case 6:
                        $part = _b.apply(void 0, [_c.sent()]);
                        next = $part('.ChapterNav a.next').attr('href');
                        content = this.chapterContent($part);
                        // An empty part would otherwise hide behind part 1's length.
                        if (!(0, cheerio_1.load)(content).text().trim())
                            throw new Error("Toasteful: no readable chapter text was found in ".concat(nextPath, "."));
                        parts.push(content);
                        return [3 /*break*/, 3];
                    case 7:
                        chapter = parts.join('<hr>');
                        if ((0, cheerio_1.load)(chapter).text().trim().length < 200)
                            throw new Error('Toasteful: no readable chapter text was found.');
                        return [2 /*return*/, chapter];
                }
            });
        });
    };
    Toasteful.prototype.chapterContent = function ($) {
        var content = $('.content-post').first().length
            ? $('.content-post').first()
            : $('.post-body').first();
        content.find('script,style,iframe,form,noscript,.ChapterNav').remove();
        content
            .find('.reader-toolbar,.js-notice,.adsbygoogle,.ad,.ads,[class^="ad-"],[class*=" ad-"]')
            .remove();
        content.find('a[href*="docs.google.com/forms"]').remove();
        var junk = /hello,?\s+we have a (new|other)|we also have a similar genre|please bookmark this series|report error/i;
        content.find('div,p').each(function (_, el) {
            var node = $(el);
            if (node.is('div') && node.find('p,div').length)
                return;
            if (junk.test(node.text().trim()))
                node.remove();
        });
        return content.html() || '';
    };
    Toasteful.prototype.slug = function (path) {
        var _a;
        return ((_a = /([^/]+)\.html$/.exec(path)) === null || _a === void 0 ? void 0 : _a[1]) || '';
    };
    // A part shares its chapter's slug stem: "x-4-1" -> "x-4-2", "x-v1c23" ->
    // "x-v1c23-2". The stem must be longer than the novel slug, so the next
    // chapter ("x-379" -> "x-380") is never taken for a part.
    Toasteful.prototype.isPartOf = function (firstSlug, nextSlug, novelSlug) {
        var stem = nextSlug.startsWith(firstSlug + '-')
            ? firstSlug
            : firstSlug.replace(/-\d+$/, '');
        return stem.startsWith(novelSlug + '-') && nextSlug.startsWith(stem + '-');
    };
    // Posts the novel page links are chapters of their own, never parts.
    Toasteful.prototype.listedPaths = function (novelPath) {
        return __awaiter(this, void 0, void 0, function () {
            var paths, $, _a, _i, _b, el, parsed;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        paths = this.listedCache.get(novelPath);
                        if (!!paths) return [3 /*break*/, 3];
                        _a = cheerio_1.load;
                        return [4 /*yield*/, this.request(this.site + novelPath)];
                    case 1: return [4 /*yield*/, (_c.sent()).text()];
                    case 2:
                        $ = _a.apply(void 0, [_c.sent()]);
                        paths = new Set();
                        for (_i = 0, _b = $('.post-body a[href]').toArray(); _i < _b.length; _i++) {
                            el = _b[_i];
                            try {
                                parsed = new URL($(el).attr('href'), this.site);
                                if (parsed.origin === this.site)
                                    paths.add(parsed.pathname);
                            }
                            catch (_d) {
                                continue;
                            }
                        }
                        this.listedCache.set(novelPath, paths);
                        _c.label = 3;
                    case 3: return [2 /*return*/, paths];
                }
            });
        });
    };
    Toasteful.prototype.searchNovels = function (searchTerm, pageNo) {
        return __awaiter(this, void 0, void 0, function () {
            var tokens, novels, start, round, data, entries, _loop_1, this_1, _i, entries_2, entry, total;
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        tokens = searchTerm
                            .toLowerCase()
                            .split(/[^a-z0-9]+/)
                            .filter(Boolean);
                        if (!tokens.length)
                            return [2 /*return*/, []];
                        novels = [];
                        start = 1;
                        round = 0;
                        _d.label = 1;
                    case 1:
                        if (!(round < 4)) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.request(this.feedUrl([NOVEL_LABEL], {
                                'max-results': '150',
                                'start-index': String(start),
                            }))];
                    case 2: return [4 /*yield*/, (_d.sent()).json()];
                    case 3:
                        data = _d.sent();
                        entries = ((_a = data.feed) === null || _a === void 0 ? void 0 : _a.entry) || [];
                        if (!entries.length)
                            return [3 /*break*/, 5];
                        _loop_1 = function (entry) {
                            var novel = this_1.entryToNovel(entry);
                            if (!novel || novels.some(function (item) { return item.path === novel.path; }))
                                return "continue";
                            var name_2 = novel.name.toLowerCase();
                            if (tokens.every(function (token) { return name_2.includes(token); }))
                                novels.push(novel);
                        };
                        this_1 = this;
                        for (_i = 0, entries_2 = entries; _i < entries_2.length; _i++) {
                            entry = entries_2[_i];
                            _loop_1(entry);
                        }
                        total = Number(((_c = (_b = data.feed) === null || _b === void 0 ? void 0 : _b.openSearch$totalResults) === null || _c === void 0 ? void 0 : _c.$t) || 0);
                        start += entries.length;
                        if (!total || start > total)
                            return [3 /*break*/, 5];
                        _d.label = 4;
                    case 4:
                        round++;
                        return [3 /*break*/, 1];
                    case 5: return [2 /*return*/, novels.slice((pageNo - 1) * PAGE_SIZE, pageNo * PAGE_SIZE)];
                }
            });
        });
    };
    Toasteful.prototype.resolveUrl = function (path) {
        var url = new URL(path, this.site);
        if (url.origin !== this.site)
            throw new Error('Toasteful: invalid page address.');
        return url.href;
    };
    return Toasteful;
}());
exports.default = new Toasteful();
