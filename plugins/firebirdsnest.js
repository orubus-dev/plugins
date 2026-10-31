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
var novelStatus_1 = require("@libs/novelStatus");
var isAbsoluteUrl_1 = require("@libs/isAbsoluteUrl");
/** Non-novel pages that can sit next to novels in navigation menus. */
var NON_NOVEL_PATHS = ['/projects/', '/about/'];
/** Hosts that serve this same site (custom domain + wpcom mapped domain). */
var SAME_SITE_HOSTS = [
    'firebirdsnest.org',
    'www.firebirdsnest.org',
    'firebirdsnest.wordpress.com',
];
/**
 * Firebird's Nest (firebirdsnest.org) is a small WordPress.com-hosted fan
 * translation site. Its structure differs from the usual novel CMS themes:
 *
 * - Each novel is a WordPress *page* (`/heavy-knight/`) whose entry content
 *   holds the synopsis and a hand-maintained "Table of Contents".
 *   Chapters are child pages (`/heavy-knight/v1-ch1/`).
 * - The site's novel catalogue is the "Projects" sub-menu of the primary
 *   navigation; the homepage itself is a paginated feed of chapter
 *   *announcement posts* (`/2024/03/25/heavy-knight-v3ch39/`), not novels.
 * - Announcement posts are tagged per novel (`/tag/heavy-knight/`, paginated
 *   10 per page) and each announcement links to the real chapter page. The
 *   tag archives are the only complete index of chapters: the hand-written
 *   ToCs are stale (Heavy Knight's ToC stops at v2-ch19 while the site
 *   publishes up to v3-ch39). Pre-2017 announcement-style posts (e.g. the
 *   No Fatigue "ch-6" era) contain the chapter text directly instead of
 *   linking to a child page.
 * - Search is native WordPress `/?s=term&paged=N` and mixes chapter posts
 *   with chapter pages; results are mapped back to their novel.
 */
var FirebirdsNestPlugin = /** @class */ (function () {
    function FirebirdsNestPlugin() {
        var _this = this;
        this.id = 'firebirdsnest';
        this.name = "Firebird's Nest";
        this.icon = 'src/en/firebirdsnest/icon.png';
        this.site = 'https://firebirdsnest.org';
        this.version = '1.0.0';
        this.filters = undefined;
        this.resolveUrl = function (path) {
            return (0, isAbsoluteUrl_1.isUrlAbsolute)(path) ? path : _this.site + _this.toPath(path);
        };
    }
    FirebirdsNestPlugin.prototype.popularNovels = function (pageNo) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // The full catalogue lives in the site's "Projects" navigation sub-menu
                // and is a single page; there is no paginated novel browse on this site.
                if (pageNo > 1) {
                    return [2 /*return*/, []];
                }
                return [2 /*return*/, this.fetchNovelCatalog()];
            });
        });
    };
    FirebirdsNestPlugin.prototype.parseNovel = function (novelPath) {
        return __awaiter(this, void 0, void 0, function () {
            var path, $, _a, content, name, novelSlug, novel, tocEntries, archive, annDates, _i, _b, post, chapters, used, _c, tocEntries_1, entry, chapter, date, extras, _d, extras_1, candidate;
            var _this = this;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        path = this.toPath(novelPath);
                        _a = cheerio_1.load;
                        return [4 /*yield*/, this.fetchHtml(this.site + path)];
                    case 1:
                        $ = _a.apply(void 0, [_e.sent()]);
                        content = this.entryContent($);
                        if (content.length === 0) {
                            throw new Error("Firebird's Nest: no entry content at ".concat(path));
                        }
                        name = this.normalizeText($('#main h1.entry-title').first().text());
                        if (!name) {
                            throw new Error("Firebird's Nest: missing novel title at ".concat(path));
                        }
                        novelSlug = this.lastSegment(path);
                        novel = {
                            path: path,
                            name: name,
                            cover: defaultCover_1.defaultCover,
                        };
                        this.applyMetadata(content, $, novel);
                        tocEntries = this.parseToc(content, $);
                        return [4 /*yield*/, this.fetchTagArchive(novelSlug)];
                    case 2:
                        archive = _e.sent();
                        annDates = {};
                        if (archive) {
                            for (_i = 0, _b = archive.posts; _i < _b.length; _i++) {
                                post = _b[_i];
                                annDates[post.slug] = post.date;
                            }
                        }
                        chapters = [];
                        used = {};
                        for (_c = 0, tocEntries_1 = tocEntries; _c < tocEntries_1.length; _c++) {
                            entry = tocEntries_1[_c];
                            if (used[entry.path]) {
                                continue;
                            }
                            used[entry.path] = true;
                            chapter = {
                                name: entry.name,
                                path: entry.path,
                            };
                            date = this.announcementDateFor(entry.path, novelSlug, archive, annDates);
                            if (date) {
                                chapter.releaseTime = date;
                            }
                            chapters.push(chapter);
                        }
                        if (!archive) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.resolveAnnouncementChapters(archive, novelSlug, path)];
                    case 3:
                        extras = _e.sent();
                        extras.sort(function (a, b) {
                            if (a.post.date !== b.post.date) {
                                return a.post.date < b.post.date ? -1 : 1;
                            }
                            return _this.lastNumber(a.post.slug) - _this.lastNumber(b.post.slug);
                        });
                        for (_d = 0, extras_1 = extras; _d < extras_1.length; _d++) {
                            candidate = extras_1[_d];
                            if (used[candidate.path]) {
                                continue;
                            }
                            used[candidate.path] = true;
                            chapters.push({
                                name: candidate.post.title,
                                path: candidate.path,
                                releaseTime: candidate.post.date,
                            });
                        }
                        _e.label = 4;
                    case 4:
                        if (chapters.length === 0) {
                            throw new Error("Firebird's Nest: no chapters found for ".concat(path));
                        }
                        chapters.forEach(function (chapter, index) {
                            chapter.chapterNumber = index + 1;
                        });
                        novel.chapters = chapters;
                        return [2 /*return*/, novel];
                }
            });
        });
    };
    FirebirdsNestPlugin.prototype.parseChapter = function (chapterPath) {
        return __awaiter(this, void 0, void 0, function () {
            var path, url, $, _a, content, html;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        path = this.toPath(chapterPath);
                        url = (0, isAbsoluteUrl_1.isUrlAbsolute)(path) ? path : this.site + path;
                        _a = cheerio_1.load;
                        return [4 /*yield*/, this.fetchHtml(url)];
                    case 1:
                        $ = _a.apply(void 0, [_b.sent()]);
                        content = this.entryContent($);
                        if (content.length === 0) {
                            throw new Error("Firebird's Nest: no chapter content at ".concat(path));
                        }
                        // Drop the "Previous | TOC | Next" navigation line and Jetpack widgets
                        // (sharing/likes/rating) that live inside the entry content.
                        content.find('#jp-post-flair, .sharedaddy, .jp-relatedposts').remove();
                        content.find('p').each(function (i, el) {
                            var text = _this.normalizeText($(el).text());
                            if (text.length < 60 &&
                                text.indexOf('|') !== -1 &&
                                /(TOC|Contents)/i.test(text)) {
                                $(el).remove();
                            }
                        });
                        html = content.html();
                        if (!html || html.trim().length === 0) {
                            throw new Error("Firebird's Nest: empty chapter content at ".concat(path));
                        }
                        return [2 /*return*/, html.trim()];
                }
            });
        });
    };
    FirebirdsNestPlugin.prototype.searchNovels = function (searchTerm, pageNo) {
        return __awaiter(this, void 0, void 0, function () {
            var catalog, query, paged, $, _a, slugByName, novelSlugs, _i, catalog_1, novel, slug, results, seen;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.fetchNovelCatalog()];
                    case 1:
                        catalog = _b.sent();
                        query = encodeURIComponent(searchTerm);
                        paged = pageNo > 1 ? "&paged=".concat(pageNo) : '';
                        _a = cheerio_1.load;
                        return [4 /*yield*/, this.fetchHtml("".concat(this.site, "/?s=").concat(query).concat(paged))];
                    case 2:
                        $ = _a.apply(void 0, [_b.sent()]);
                        slugByName = {};
                        novelSlugs = [];
                        for (_i = 0, catalog_1 = catalog; _i < catalog_1.length; _i++) {
                            novel = catalog_1[_i];
                            slug = this.lastSegment(novel.path);
                            novelSlugs.push(slug);
                            slugByName[slug] = novel.name;
                        }
                        results = [];
                        seen = {};
                        $('h2.entry-title > a').each(function (i, el) {
                            var href = $(el).attr('href');
                            if (!href) {
                                return;
                            }
                            var slug = _this.novelSlugForResult(_this.toPath(href), novelSlugs);
                            if (!slug || seen[slug]) {
                                return;
                            }
                            seen[slug] = true;
                            results.push({
                                name: slugByName[slug],
                                path: "/".concat(slug, "/"),
                                cover: defaultCover_1.defaultCover,
                            });
                        });
                        return [2 /*return*/, results];
                }
            });
        });
    };
    /**
     * The site's novel catalogue: the "Projects" sub-menus of the primary
     * navigation, which list every live novel page with its real title.
     */
    FirebirdsNestPlugin.prototype.fetchNovelCatalog = function () {
        return __awaiter(this, void 0, void 0, function () {
            var $, _a, novels, seen;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = cheerio_1.load;
                        return [4 /*yield*/, this.fetchHtml(this.site + '/')];
                    case 1:
                        $ = _a.apply(void 0, [_b.sent()]);
                        novels = [];
                        seen = {};
                        $('#site-navigation .sub-menu a').each(function (i, el) {
                            var href = $(el).attr('href');
                            if (!href) {
                                return;
                            }
                            var path = _this.toPath(href);
                            if (!path || NON_NOVEL_PATHS.indexOf(path) !== -1 || seen[path]) {
                                return;
                            }
                            var name = _this.normalizeText($(el).text());
                            if (!name) {
                                return;
                            }
                            seen[path] = true;
                            novels.push({ name: name, path: path, cover: defaultCover_1.defaultCover });
                        });
                        if (novels.length === 0) {
                            throw new Error("Firebird's Nest: no novels found in the site menu");
                        }
                        return [2 /*return*/, novels];
                }
            });
        });
    };
    /** Author/status/synopsis from the info block above the ToC. */
    FirebirdsNestPlugin.prototype.applyMetadata = function (content, $, novel) {
        var _this = this;
        // Flatten the info block into lines so "Author: ..." / "Status: ..."
        // (separated by <br>) can be picked up regardless of markup.
        var raw = (content.html() || '')
            .replace(/<br\s*\/?>/gi, '\n')
            .replace(/<\/p>/gi, '\n');
        var flattened = (0, cheerio_1.load)("<div>".concat(raw, "</div>"))('div').text();
        var lines = flattened
            .split('\n')
            .map(function (line) { return _this.normalizeText(line); })
            .filter(function (line) { return line; });
        for (var _i = 0, lines_1 = lines; _i < lines_1.length; _i++) {
            var line = lines_1[_i];
            var authorMatch = line.match(/^Author:\s*(.+)$/i);
            if (authorMatch) {
                novel.author = this.normalizeText(authorMatch[1]);
                continue;
            }
            var statusMatch = line.match(/^Status:\s*(.+)$/i);
            if (statusMatch) {
                novel.status = this.parseStatus(statusMatch[1]);
            }
        }
        // The synopsis is every link-free paragraph above the ToC heading; the
        // info paragraph itself carries links (source novel, collaborator blogs)
        // and is skipped by the same rule.
        var paragraphs = [];
        var reachedToc = false;
        content.find('p, strong, h1, h2, h3, h4, h5, h6').each(function (i, el) {
            if (reachedToc) {
                return;
            }
            var element = $(el);
            var text = _this.normalizeText(element.text());
            if (_this.isTocMarker(element, text)) {
                reachedToc = true;
                return;
            }
            if (!element.is('p')) {
                return;
            }
            if (element.find('a').length > 0 ||
                /^Author:/i.test(text) ||
                /^Status:/i.test(text) ||
                !text) {
                return;
            }
            paragraphs.push(text);
        });
        if (paragraphs.length > 0) {
            novel.summary = paragraphs.join('\n\n');
        }
    };
    /** Detect the "Table of Contents" / "VOLUME 1 CONTENTS" heading. */
    FirebirdsNestPlugin.prototype.isTocMarker = function (element, text) {
        if (element.is('p')) {
            return /^table of contents/i.test(text);
        }
        return /(table of )?contents$/i.test(text);
    };
    FirebirdsNestPlugin.prototype.parseStatus = function (value) {
        var normalized = value.toLowerCase();
        if (normalized.indexOf('ongoing') === 0) {
            return novelStatus_1.NovelStatus.Ongoing;
        }
        if (normalized.indexOf('completed') === 0) {
            return novelStatus_1.NovelStatus.Completed;
        }
        if (normalized.indexOf('hiatus') !== -1) {
            return novelStatus_1.NovelStatus.OnHiatus;
        }
        return novelStatus_1.NovelStatus.Unknown;
    };
    /**
     * Chapter links from the novel page's "Table of Contents" block: every
     * anchor after the ToC marker inside the entry content, in document order.
     */
    FirebirdsNestPlugin.prototype.parseToc = function (content, $) {
        var _this = this;
        var entries = [];
        var seen = {};
        var reachedToc = false;
        content.find('a, p, strong, h1, h2, h3, h4, h5, h6').each(function (i, el) {
            var element = $(el);
            if (!reachedToc) {
                if (element.is('a')) {
                    return;
                }
                if (_this.isTocMarker(element, _this.normalizeText(element.text()))) {
                    reachedToc = true;
                }
                return;
            }
            if (!element.is('a')) {
                return;
            }
            var href = element.attr('href');
            if (!href) {
                return;
            }
            var path = _this.toPath(href);
            var name = _this.normalizeText(element.text());
            if (!path || !name || seen[path] || path.indexOf('/feed') !== -1) {
                return;
            }
            seen[path] = true;
            entries.push({ path: path, name: name });
        });
        return entries;
    };
    /**
     * All chapter announcements for a novel from its paginated tag archive.
     * The tag slug is usually the novel slug; for novels whose tag was created
     * under a shorter name (e.g. `contractor`), fall back to the first word of
     * the novel slug. Returns null when the site has no tag archive at all.
     */
    FirebirdsNestPlugin.prototype.fetchTagArchive = function (novelSlug) {
        return __awaiter(this, void 0, void 0, function () {
            var candidates, firstWord, _loop_1, this_1, _i, candidates_1, tagSlug, state_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        candidates = [novelSlug];
                        firstWord = novelSlug.split('-')[0];
                        if (firstWord && firstWord !== novelSlug) {
                            candidates.push(firstWord);
                        }
                        _loop_1 = function (tagSlug) {
                            var url, res, first, _b, _c, pageNumbers, n, restPages, posts, _d, restPages_1, page, _e, _f, post;
                            return __generator(this, function (_g) {
                                switch (_g.label) {
                                    case 0:
                                        url = "".concat(this_1.site, "/tag/").concat(tagSlug, "/");
                                        return [4 /*yield*/, (0, fetch_1.fetchApi)(url)];
                                    case 1:
                                        res = _g.sent();
                                        if (res.status === 404) {
                                            return [2 /*return*/, "continue"];
                                        }
                                        if (!res.ok) {
                                            throw this_1.httpError(res.status, url);
                                        }
                                        _c = (_b = this_1).parseTagPage;
                                        return [4 /*yield*/, res.text()];
                                    case 2:
                                        first = _c.apply(_b, [_g.sent()]);
                                        pageNumbers = [];
                                        for (n = 2; n <= first.maxPage; n++) {
                                            pageNumbers.push(n);
                                        }
                                        return [4 /*yield*/, this_1.mapLimit(pageNumbers, 6, function (n) {
                                                return _this.parseTagPageAsync(n, tagSlug);
                                            })];
                                    case 3:
                                        restPages = _g.sent();
                                        posts = first.posts;
                                        for (_d = 0, restPages_1 = restPages; _d < restPages_1.length; _d++) {
                                            page = restPages_1[_d];
                                            for (_e = 0, _f = page.posts; _e < _f.length; _e++) {
                                                post = _f[_e];
                                                posts.push(post);
                                            }
                                        }
                                        return [2 /*return*/, { value: { tagSlug: tagSlug, posts: posts } }];
                                }
                            });
                        };
                        this_1 = this;
                        _i = 0, candidates_1 = candidates;
                        _a.label = 1;
                    case 1:
                        if (!(_i < candidates_1.length)) return [3 /*break*/, 4];
                        tagSlug = candidates_1[_i];
                        return [5 /*yield**/, _loop_1(tagSlug)];
                    case 2:
                        state_1 = _a.sent();
                        if (typeof state_1 === "object")
                            return [2 /*return*/, state_1.value];
                        _a.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/, null];
                }
            });
        });
    };
    FirebirdsNestPlugin.prototype.parseTagPageAsync = function (pageNo, tagSlug) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this.parseTagPage;
                        return [4 /*yield*/, this.fetchHtml("".concat(this.site, "/tag/").concat(tagSlug, "/page/").concat(pageNo, "/"))];
                    case 1: return [2 /*return*/, _a.apply(this, [_b.sent()])];
                }
            });
        });
    };
    FirebirdsNestPlugin.prototype.parseTagPage = function (html) {
        var _this = this;
        var $ = (0, cheerio_1.load)(html);
        var posts = [];
        $('#main h2.entry-title > a').each(function (i, el) {
            var href = $(el).attr('href');
            if (!href) {
                return;
            }
            var path = _this.toPath(href);
            var match = path.match(/^\/(\d{4})\/(\d{2})\/(\d{2})\/([^/]+)\/$/);
            if (!match) {
                return;
            }
            posts.push({
                path: path,
                slug: match[4],
                date: "".concat(match[1], "-").concat(match[2], "-").concat(match[3]),
                title: _this.normalizeText($(el).text()),
            });
        });
        var maxPage = 1;
        $('#main .nav-links a').each(function (i, el) {
            var href = $(el).attr('href') || '';
            var match = href.match(/\/page\/(\d+)\//);
            if (match && Number(match[1]) > maxPage) {
                maxPage = Number(match[1]);
            }
        });
        return { posts: posts, maxPage: maxPage };
    };
    /**
     * Turn announcement posts into chapter paths the ToC does not already
     * cover. Most slugs map directly onto their child chapter page; unusual
     * slugs are resolved by reading the announcement's own chapter link, and
     * pre-2017 text posts (no child link) are chapters themselves.
     */
    FirebirdsNestPlugin.prototype.resolveAnnouncementChapters = function (archive, novelSlug, novelPath) {
        return __awaiter(this, void 0, void 0, function () {
            var prefix, resolved, unresolved, _i, _a, post, rest, direct, fetched, _b, fetched_1, candidate;
            var _this = this;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        prefix = archive.tagSlug + '-';
                        resolved = [];
                        unresolved = [];
                        for (_i = 0, _a = archive.posts; _i < _a.length; _i++) {
                            post = _a[_i];
                            if (post.slug.indexOf(prefix) !== 0) {
                                continue;
                            }
                            rest = post.slug.slice(prefix.length);
                            direct = this.deriveChapterPath(rest, novelSlug, post.path);
                            if (direct) {
                                resolved.push({ post: post, path: direct });
                            }
                            else {
                                unresolved.push(post);
                            }
                        }
                        return [4 /*yield*/, this.mapLimit(unresolved, 4, function (post) { return __awaiter(_this, void 0, void 0, function () {
                                var path;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, this.resolveAnnouncementPath(post, novelPath)];
                                        case 1:
                                            path = _a.sent();
                                            return [2 /*return*/, path ? { post: post, path: path } : null];
                                    }
                                });
                            }); })];
                    case 1:
                        fetched = _c.sent();
                        for (_b = 0, fetched_1 = fetched; _b < fetched_1.length; _b++) {
                            candidate = fetched_1[_b];
                            if (candidate) {
                                resolved.push(candidate);
                            }
                        }
                        return [2 /*return*/, resolved];
                }
            });
        });
    };
    /**
     * Known announcement-slug shapes. Returns the chapter path, the post's own
     * path when the post *is* the chapter (2015-era `ch-6` style posts), or
     * null when the slug is unknown and the announcement must be read.
     */
    FirebirdsNestPlugin.prototype.deriveChapterPath = function (rest, novelSlug, postPath) {
        if (/^ch-\d+(-\d+)?$/.test(rest)) {
            return postPath;
        }
        var volume = rest.match(/^v(\d+)ch(\d+)$/);
        if (volume) {
            return "/".concat(novelSlug, "/v").concat(volume[1], "-ch").concat(volume[2], "/");
        }
        if (/^(v\d+c\d+|ch\d+)(-\d+)?$/.test(rest)) {
            return "/".concat(novelSlug, "/").concat(rest, "/");
        }
        return null;
    };
    /** Read an announcement and follow its "Chapter here." style link. */
    FirebirdsNestPlugin.prototype.resolveAnnouncementPath = function (post, novelPath) {
        return __awaiter(this, void 0, void 0, function () {
            var $, _a, content, prefix, found, text;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = cheerio_1.load;
                        return [4 /*yield*/, this.fetchHtml(this.site + post.path)];
                    case 1:
                        $ = _a.apply(void 0, [_b.sent()]);
                        content = this.entryContent($);
                        if (content.length === 0) {
                            return [2 /*return*/, null];
                        }
                        prefix = novelPath.charAt(novelPath.length - 1) === '/'
                            ? novelPath
                            : novelPath + '/';
                        found = null;
                        content.find('a').each(function (i, el) {
                            if (found) {
                                return;
                            }
                            var href = $(el).attr('href');
                            if (!href) {
                                return;
                            }
                            var path = _this.toPath(href);
                            if (path.indexOf(prefix) === 0 &&
                                path !== novelPath &&
                                path.indexOf('/feed') === -1) {
                                found = path;
                            }
                        });
                        if (found) {
                            return [2 /*return*/, found];
                        }
                        text = this.normalizeText(content.text());
                        return [2 /*return*/, text.length >= 200 ? post.path : null];
                }
            });
        });
    };
    /** Release date of a ToC chapter, when the site announced it by date. */
    FirebirdsNestPlugin.prototype.announcementDateFor = function (chapterPath, novelSlug, archive, annDates) {
        if ((0, isAbsoluteUrl_1.isUrlAbsolute)(chapterPath) || !archive) {
            return undefined;
        }
        var base = this.lastSegment(chapterPath);
        var compact = base.replace(/^v(\d+)-ch/, 'v$1ch');
        var keys = [
            base,
            compact,
            "".concat(novelSlug, "-").concat(base),
            "".concat(novelSlug, "-").concat(compact),
            "".concat(archive.tagSlug, "-").concat(base),
            "".concat(archive.tagSlug, "-").concat(compact),
        ];
        for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
            var key = keys_1[_i];
            if (annDates[key]) {
                return annDates[key];
            }
        }
        return undefined;
    };
    /**
     * Map one search-result URL (dated announcement, chapter child page, or
     * top-level novel page) back to a novel slug from the site catalogue.
     */
    FirebirdsNestPlugin.prototype.novelSlugForResult = function (path, novelSlugs) {
        var segments = path.split('/').filter(function (segment) { return segment; });
        if (segments.length === 0) {
            return null;
        }
        var isDatedPost = segments.length === 4 && /^\d{4}$/.test(segments[0]);
        if (isDatedPost) {
            var slug = segments[3];
            for (var _i = 0, novelSlugs_1 = novelSlugs; _i < novelSlugs_1.length; _i++) {
                var novelSlug = novelSlugs_1[_i];
                if (slug.indexOf(novelSlug + '-') === 0) {
                    return novelSlug;
                }
            }
            return null;
        }
        if (novelSlugs.indexOf(segments[0]) !== -1) {
            return segments[0];
        }
        if (segments.length > 1 && novelSlugs.indexOf(segments[1]) !== -1) {
            return segments[1];
        }
        return null;
    };
    FirebirdsNestPlugin.prototype.entryContent = function ($) {
        var content = $('#main .entry-content').first();
        if (content.length === 0) {
            content = $('.entry-content').first();
        }
        return content;
    };
    /** Normalize a URL or href to a site-relative path (or an external URL). */
    FirebirdsNestPlugin.prototype.toPath = function (href) {
        var raw = href.trim();
        if (raw.indexOf('//') === 0) {
            raw = 'https:' + raw;
        }
        if (/^https?:\/\//i.test(raw)) {
            var match = raw.match(/^https?:\/\/([^/?#]+)([/?#].*)?$/i);
            if (!match) {
                return '';
            }
            var host = match[1].toLowerCase();
            if (SAME_SITE_HOSTS.indexOf(host) === -1) {
                return raw.split('#')[0];
            }
            raw = match[2] || '/';
        }
        var clean = raw.split('#')[0].split('?')[0];
        if (!clean) {
            return '/';
        }
        var path = clean.charAt(0) === '/' ? clean : '/' + clean;
        return path.charAt(path.length - 1) === '/' ? path : path + '/';
    };
    FirebirdsNestPlugin.prototype.fetchHtml = function (url) {
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
    FirebirdsNestPlugin.prototype.httpError = function (status, url) {
        // Carry the status so tooling can tell a refused/blocked request
        // (403/503) apart from a genuine parsing failure.
        return Object.assign(new Error("HTTP ".concat(status, " while fetching ").concat(url)), {
            status: status,
        });
    };
    FirebirdsNestPlugin.prototype.mapLimit = function (items, limit, task) {
        return __awaiter(this, void 0, void 0, function () {
            var results, next, workers, count, w;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        results = new Array(items.length);
                        next = 0;
                        workers = [];
                        count = Math.min(limit, items.length);
                        for (w = 0; w < count; w++) {
                            workers.push((function () { return __awaiter(_this, void 0, void 0, function () {
                                var index, _a, _b;
                                return __generator(this, function (_c) {
                                    switch (_c.label) {
                                        case 0:
                                            if (!(next < items.length)) return [3 /*break*/, 2];
                                            index = next;
                                            next += 1;
                                            _a = results;
                                            _b = index;
                                            return [4 /*yield*/, task(items[index])];
                                        case 1:
                                            _a[_b] = _c.sent();
                                            return [3 /*break*/, 0];
                                        case 2: return [2 /*return*/];
                                    }
                                });
                            }); })());
                        }
                        return [4 /*yield*/, Promise.all(workers)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, results];
                }
            });
        });
    };
    FirebirdsNestPlugin.prototype.normalizeText = function (text) {
        return text
            .replace(/\u00a0/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
    };
    FirebirdsNestPlugin.prototype.lastSegment = function (path) {
        var segments = path.split('/').filter(function (segment) { return segment; });
        return segments.length > 0 ? segments[segments.length - 1] : '';
    };
    FirebirdsNestPlugin.prototype.lastNumber = function (value) {
        var matches = value.match(/\d+/g);
        if (!matches) {
            return 0;
        }
        return Number(matches[matches.length - 1]);
    };
    return FirebirdsNestPlugin;
}());
exports.default = new FirebirdsNestPlugin();
