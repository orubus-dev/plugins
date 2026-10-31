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
var cheerio_1 = require("cheerio");
var defaultCover_1 = require("@libs/defaultCover");
/** Dated permalink every chapter post uses, e.g. `/2022/01/26/<slug>/`. */
var CHAPTER_PATH = /^\/(\d{4})\/(\d{2})\/(\d{2})\/[^/]+\/$/;
/** Headings that open a new section inside a novel page's chapter list. */
var SECTION_HEADING = /^(chapters|part\s*\d+)$/i;
/** Previous / TOC / Next navigation words at the top or bottom of a chapter. */
var NAV_WORDS = /\[?\s*(previous|next|toc)\s*\]?/gi;
/**
 * Mizupan's Archives (mizupanshoko.wordpress.com) is a WordPress.com fan
 * translation blog with a plain, theme-driven structure:
 *
 * - Each novel is a WordPress *page* (`/shisha-sosei/`) linked from the
 *   main menu. Its entry content holds the synopsis and a hand-maintained
 *   chapter list that links to each released chapter post. Chapters that are
 *   not out yet appear as plain bracketed text and are not listed.
 * - Chapters are dated posts (`/2020/07/24/shisha-sosei-chapter-1-.../`) that
 *   sit in a per-novel category sharing the novel's slug.
 * - The REST API is not exposed on this site, so everything is scraped from
 *   the HTML pages.
 * - Search is native WordPress `/?s=term`; chapter hits are mapped back to
 *   their novel through the category slug on each result.
 */
var MizupanPlugin = /** @class */ (function () {
    function MizupanPlugin() {
        var _this = this;
        this.id = 'mizupanshoko';
        this.name = "Mizupan's Archives";
        this.icon = 'src/en/mizupanshoko/icon.png';
        this.site = 'https://mizupanshoko.wordpress.com';
        this.version = '1.0.0';
        this.filters = undefined;
        this.resolveUrl = function (path) { return _this.site + _this.toPath(path); };
        this.toNovelItem = function (novel) { return ({
            name: novel.name,
            path: novel.path,
            cover: novel.cover,
        }); };
    }
    MizupanPlugin.prototype.popularNovels = function (pageNo) {
        return __awaiter(this, void 0, void 0, function () {
            var catalogue;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // Every novel is linked from the main menu; there is no paginated browse.
                        if (pageNo > 1) {
                            return [2 /*return*/, []];
                        }
                        return [4 /*yield*/, this.fetchCatalogue()];
                    case 1:
                        catalogue = _a.sent();
                        return [2 /*return*/, catalogue.map(this.toNovelItem)];
                }
            });
        });
    };
    MizupanPlugin.prototype.parseNovel = function (novelPath) {
        return __awaiter(this, void 0, void 0, function () {
            var path, $, chapters, page, novel, summary;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        path = this.toPath(novelPath);
                        return [4 /*yield*/, this.loadNovelPage(path)];
                    case 1:
                        $ = _a.sent();
                        chapters = this.novelChapters($);
                        if (chapters.length === 0) {
                            throw new Error("Mizupan's Archives: no chapters listed at ".concat(path));
                        }
                        page = this.toNovelPage(path, $);
                        novel = {
                            path: path,
                            name: page.name,
                            cover: page.cover,
                            chapters: chapters,
                        };
                        summary = this.novelSummary($);
                        if (summary) {
                            novel.summary = summary;
                        }
                        return [2 /*return*/, novel];
                }
            });
        });
    };
    MizupanPlugin.prototype.parseChapter = function (chapterPath) {
        return __awaiter(this, void 0, void 0, function () {
            var path, $, _a, content;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        path = this.toPath(chapterPath);
                        _a = cheerio_1.load;
                        return [4 /*yield*/, this.fetchHtml(this.site + path)];
                    case 1:
                        $ = _a.apply(void 0, [_b.sent()]);
                        content = this.entryContent($);
                        if (content.length === 0) {
                            throw new Error("Mizupan's Archives: no chapter text at ".concat(path));
                        }
                        content.find('script, style, .sharedaddy, .jp-relatedposts').remove();
                        // Drop the Previous / TOC / Next navigation paragraphs, which hold nothing
                        // but those words and their links.
                        content.find('p').each(function (_, el) {
                            var text = $(el).text();
                            if (/\b(previous|next|toc)\b/i.test(text) &&
                                text.replace(NAV_WORDS, '').trim() === '') {
                                $(el).remove();
                            }
                        });
                        return [2 /*return*/, content.html() || ''];
                }
            });
        });
    };
    MizupanPlugin.prototype.searchNovels = function (searchTerm, pageNo) {
        return __awaiter(this, void 0, void 0, function () {
            var base, url, res, $, _a, catalogue, byPath, _i, catalogue_1, novel, found, seen;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        base = pageNo > 1 ? "".concat(this.site, "/page/").concat(pageNo, "/") : "".concat(this.site, "/");
                        url = "".concat(base, "?s=").concat(encodeURIComponent(searchTerm));
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(url)];
                    case 1:
                        res = _b.sent();
                        if (res.status === 404) {
                            return [2 /*return*/, []];
                        }
                        if (!res.ok) {
                            throw this.httpError(res.status, url);
                        }
                        _a = cheerio_1.load;
                        return [4 /*yield*/, res.text()];
                    case 2:
                        $ = _a.apply(void 0, [_b.sent()]);
                        return [4 /*yield*/, this.fetchCatalogue()];
                    case 3:
                        catalogue = _b.sent();
                        byPath = {};
                        for (_i = 0, catalogue_1 = catalogue; _i < catalogue_1.length; _i++) {
                            novel = catalogue_1[_i];
                            byPath[novel.path] = novel;
                        }
                        found = [];
                        seen = {};
                        $('article').each(function (_, el) {
                            var article = $(el);
                            var classes = article.attr('class') || '';
                            var paths;
                            if (classes.indexOf('type-page') !== -1) {
                                // A novel page itself matched.
                                paths = [
                                    _this.toPath(article.find('.entry-title a').first().attr('href') || ''),
                                ];
                            }
                            else {
                                // A chapter post: its category slug is the novel's slug.
                                var categories = classes.match(/\bcategory-[\w-]+/g) || [];
                                paths = categories.map(function (category) { return "/".concat(category.slice(9), "/"); });
                            }
                            for (var _i = 0, paths_1 = paths; _i < paths_1.length; _i++) {
                                var path = paths_1[_i];
                                if (byPath[path] && !seen[path]) {
                                    seen[path] = true;
                                    found.push(byPath[path]);
                                }
                            }
                        });
                        return [2 /*return*/, found.map(this.toNovelItem)];
                }
            });
        });
    };
    /** Novels are the menu pages whose content links to chapter posts. */
    MizupanPlugin.prototype.fetchCatalogue = function () {
        return __awaiter(this, void 0, void 0, function () {
            var $, _a, paths, pages, _i, paths_2, path, $_1;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = cheerio_1.load;
                        return [4 /*yield*/, this.fetchHtml(this.site + '/')];
                    case 1:
                        $ = _a.apply(void 0, [_b.sent()]);
                        paths = [];
                        $('li.menu-item > a').each(function (_, el) {
                            var path = _this.toPath($(el).attr('href') || '');
                            if (path.charAt(0) === '/' &&
                                path !== '/' &&
                                paths.indexOf(path) === -1) {
                                paths.push(path);
                            }
                        });
                        pages = [];
                        _i = 0, paths_2 = paths;
                        _b.label = 2;
                    case 2:
                        if (!(_i < paths_2.length)) return [3 /*break*/, 5];
                        path = paths_2[_i];
                        return [4 /*yield*/, this.loadNovelPage(path)];
                    case 3:
                        $_1 = _b.sent();
                        if (this.novelChapters($_1).length > 0) {
                            pages.push(this.toNovelPage(path, $_1));
                        }
                        _b.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 2];
                    case 5: return [2 /*return*/, pages];
                }
            });
        });
    };
    MizupanPlugin.prototype.loadNovelPage = function (path) {
        return __awaiter(this, void 0, void 0, function () {
            var $, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = cheerio_1.load;
                        return [4 /*yield*/, this.fetchHtml(this.site + path)];
                    case 1:
                        $ = _a.apply(void 0, [_b.sent()]);
                        $('.jp-relatedposts, .sharedaddy, script, style').remove();
                        return [2 /*return*/, $];
                }
            });
        });
    };
    MizupanPlugin.prototype.toNovelPage = function (path, $) {
        var name = this.normalizeText($('h1.entry-title').first().text());
        // Novels without artwork fall back to WordPress's blank placeholder image.
        var ogImage = $('meta[property="og:image"]').attr('content') || '';
        var cover = ogImage && ogImage.indexOf('/i/blank.jpg') === -1
            ? ogImage
            : defaultCover_1.defaultCover;
        return { path: path, name: name, cover: cover };
    };
    MizupanPlugin.prototype.novelChapters = function ($) {
        var _this = this;
        var chapters = [];
        var seen = {};
        this.entryContent($)
            .find('a[href]')
            .each(function (_, el) {
            var path = _this.toPath($(el).attr('href') || '');
            var match = CHAPTER_PATH.exec(path);
            if (!match || seen[path]) {
                return;
            }
            seen[path] = true;
            var name = _this.normalizeText($(el).text());
            var numbered = name.match(/\b(?:Ch\.?|Chapter)\s*(\d+)/i);
            chapters.push({
                name: name,
                path: path,
                releaseTime: "".concat(match[1], "-").concat(match[2], "-").concat(match[3]),
                chapterNumber: numbered ? Number(numbered[1]) : chapters.length + 1,
            });
        });
        return chapters;
    };
    /** Synopsis paragraphs: everything before the chapter list begins. */
    MizupanPlugin.prototype.novelSummary = function ($) {
        var _this = this;
        var lines = [];
        this.entryContent($)
            .find('p, h4')
            .each(function (_, el) {
            var element = $(el);
            var text = _this.normalizeText(element.text());
            var hasChapterLink = element
                .find('a[href]')
                .toArray()
                .some(function (link) {
                return CHAPTER_PATH.test(_this.toPath($(link).attr('href') || ''));
            });
            if (SECTION_HEADING.test(text) || hasChapterLink) {
                return false;
            }
            if (text) {
                lines.push(text);
            }
        });
        return lines.join('\n');
    };
    MizupanPlugin.prototype.entryContent = function ($) {
        var content = $('.entry-content').first();
        if (content.length === 0) {
            content = $('article .entry-content').first();
        }
        return content;
    };
    /** Normalize a URL or href to a site-relative path with a trailing slash. */
    MizupanPlugin.prototype.toPath = function (href) {
        var raw = href.trim();
        var sameSite = raw.match(/^https?:\/\/mizupanshoko\.wordpress\.com(\/.*)?$/i);
        if (/^https?:\/\//i.test(raw) && !sameSite) {
            return raw;
        }
        var clean = (sameSite ? sameSite[1] || '/' : raw).split(/[?#]/)[0];
        var path = clean.charAt(0) === '/' ? clean : '/' + clean;
        return path.charAt(path.length - 1) === '/' ? path : path + '/';
    };
    MizupanPlugin.prototype.fetchHtml = function (url) {
        return __awaiter(this, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, fetch_1.fetchApi)(url)];
                    case 1:
                        res = _a.sent();
                        if (!res.ok) {
                            throw this.httpError(res.status, url);
                        }
                        return [2 /*return*/, res.text()];
                }
            });
        });
    };
    MizupanPlugin.prototype.httpError = function (status, url) {
        // Carry the status so tooling can tell a refused/blocked request
        // (403/503) apart from a genuine parsing failure.
        return Object.assign(new Error("HTTP ".concat(status, " while fetching ").concat(url)), {
            status: status,
        });
    };
    MizupanPlugin.prototype.normalizeText = function (text) {
        return text.replace(/\s+/g, ' ').trim();
    };
    return MizupanPlugin;
}());
exports.default = new MizupanPlugin();
