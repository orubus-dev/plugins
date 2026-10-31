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
var PLACEHOLDER_COVER = /404\.png|cover-404|noimagefound/i;
// Chapters are `/<group>/<chapter>/`; the group is usually the series slug.
var CHAPTER_PATH = /^\/(?!series\/)[^/]+\/[^/]+\/?$/;
var LIST_STATUS = {
    'on-going': novelStatus_1.NovelStatus.Ongoing,
    completed: novelStatus_1.NovelStatus.Completed,
    dropped: novelStatus_1.NovelStatus.Cancelled,
};
var TinyTranslation = /** @class */ (function () {
    function TinyTranslation() {
        this.id = 'tinytranslation';
        this.name = 'TinyTranslation';
        this.site = 'https://www.tinytranslation.xyz';
        this.icon = 'src/en/tinytranslation/icon.png';
        this.version = '1.0.0';
        this.filters = undefined;
    }
    TinyTranslation.prototype.request = function (url) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, fetch_1.fetchApi)(url)];
                    case 1:
                        response = _a.sent();
                        if (!response.ok) {
                            throw Object.assign(new Error("TinyTranslation: HTTP ".concat(response.status, ".")), {
                                status: response.status,
                            });
                        }
                        return [2 /*return*/, response];
                }
            });
        });
    };
    /** Converts an href or path into a canonical `/series/<slug>/` path. */
    TinyTranslation.prototype.seriesPath = function (href) {
        if (!href)
            return undefined;
        var parts = new URL(href, this.site).pathname.split('/').filter(Boolean);
        return parts[0] === 'series' && parts[1]
            ? "/series/".concat(parts[1], "/")
            : undefined;
    };
    /** The site's full catalogue: one page, grouped by status, no pagination. */
    TinyTranslation.prototype.catalogue = function () {
        return __awaiter(this, void 0, void 0, function () {
            var $, _a, novels, seen, status;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = cheerio_1.load;
                        return [4 /*yield*/, this.request("".concat(this.site, "/list-novels/"))];
                    case 1: return [4 /*yield*/, (_b.sent()).text()];
                    case 2:
                        $ = _a.apply(void 0, [_b.sent()]);
                        novels = [];
                        seen = new Set();
                        $('h3, ul.series-posts-list').each(function (_, el) {
                            if ($(el).is('h3')) {
                                status = LIST_STATUS[$(el).text().trim().toLowerCase()];
                                return;
                            }
                            $(el)
                                .find('a[href]')
                                .each(function (_, link) {
                                var path = _this.seriesPath($(link).attr('href'));
                                var name = $(link).text().trim().replace(/\s+/g, ' ');
                                if (!path || !name || seen.has(path))
                                    return;
                                seen.add(path);
                                novels.push({ name: name, path: path, cover: defaultCover_1.defaultCover, status: status });
                            });
                        });
                        return [2 /*return*/, novels];
                }
            });
        });
    };
    TinyTranslation.prototype.popularNovels = function (pageNo) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (pageNo > 1)
                    return [2 /*return*/, []];
                return [2 /*return*/, this.catalogue()];
            });
        });
    };
    TinyTranslation.prototype.parseNovel = function (novelPath) {
        return __awaiter(this, void 0, void 0, function () {
            var $, _a, name, coverSrc, cover, details, detailsHtml, labels, author, genres, synopsisHtml, synopsis, summary, origin, chapters, seen, chapterHeading, nodes, following, _i, following_1, el, seriesPath, status;
            var _this = this;
            var _b, _c, _d, _e, _f;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0:
                        _a = cheerio_1.load;
                        return [4 /*yield*/, this.request(this.resolveUrl(novelPath))];
                    case 1: return [4 /*yield*/, (_g.sent()).text()];
                    case 2:
                        $ = _a.apply(void 0, [_g.sent()]);
                        name = $('h1.wp-block-post-title').first().text().trim() ||
                            $('h2.title-content').first().text().trim() ||
                            'Untitled';
                        coverSrc = $('.separator img').first().attr('src');
                        cover = coverSrc && !PLACEHOLDER_COVER.test(coverSrc)
                            ? new URL(coverSrc, this.site).href
                            : defaultCover_1.defaultCover;
                        details = $('h5')
                            .filter(function (_, el) { return /^details:$/i.test($(el).text().trim()); })
                            .first()
                            .parent();
                        detailsHtml = details.html() || '';
                        labels = (0, cheerio_1.load)(detailsHtml.replace(/<br\s*\/?>/gi, '\n')).text();
                        author = (_c = (_b = /^\s*Author\s*:[ \t]*(.+)$/im.exec(labels)) === null || _b === void 0 ? void 0 : _b[1]) === null || _c === void 0 ? void 0 : _c.trim();
                        genres = (_e = (_d = /^\s*Genre\s*:[ \t]*(.+)$/im
                            .exec(labels)) === null || _d === void 0 ? void 0 : _d[1]) === null || _e === void 0 ? void 0 : _e.trim().replace(/[\s,]+$/, '');
                        synopsisHtml = ((_f = /Synopsis:[\s\S]*?<\/h5>([\s\S]*?)(?=<h5|$)/i.exec(detailsHtml)) === null || _f === void 0 ? void 0 : _f[1]) ||
                            '';
                        synopsis = (0, cheerio_1.load)(synopsisHtml
                            .replace(/\s*\n\s*/g, ' ')
                            .replace(/<br\s*\/?>|<\/p>/gi, '\n'));
                        synopsis('u')
                            .filter(function (_, el) { return /raw source/i.test(synopsis(el).text()); })
                            .remove();
                        summary = synopsis
                            .root()
                            .text()
                            .split('\n')
                            .map(function (line) { return line.replace(/\s+/g, ' ').trim(); })
                            .filter(Boolean)
                            .join('\n\n');
                        origin = new URL(this.site).origin;
                        chapters = [];
                        seen = new Set();
                        chapterHeading = $('h5')
                            .filter(function (_, el) { return /^chapter\b.*:$/i.test($(el).text().trim()); })
                            .first()
                            .get(0);
                        if (chapterHeading) {
                            nodes = $('*').toArray();
                            following = nodes.slice(nodes.indexOf(chapterHeading) + 1);
                            for (_i = 0, following_1 = following; _i < following_1.length; _i++) {
                                el = following_1[_i];
                                if ($(el).is('h1, h2, h3, h4, h5, h6'))
                                    break;
                                if (!$(el).is('ul'))
                                    continue;
                                $(el)
                                    .find('a[href]')
                                    .each(function (_, link) {
                                    var _a;
                                    var parsed = new URL($(link).attr('href'), _this.site);
                                    if (parsed.origin !== origin || !CHAPTER_PATH.test(parsed.pathname))
                                        return;
                                    if (seen.has(parsed.pathname))
                                        return;
                                    seen.add(parsed.pathname);
                                    var chapterName = $(link).text().trim().replace(/\s+/g, ' ');
                                    if (!chapterName)
                                        return;
                                    var number = (_a = /chapter\s+(\d+(?:\.\d+)?)/i.exec(chapterName)) === null || _a === void 0 ? void 0 : _a[1];
                                    chapters.push({
                                        name: chapterName,
                                        path: parsed.pathname,
                                        chapterNumber: number ? Number(number) : undefined,
                                    });
                                });
                            }
                        }
                        if (!chapters.length)
                            throw new Error('TinyTranslation: no chapters were found on this page.');
                        seriesPath = this.seriesPath(novelPath);
                        return [4 /*yield*/, this.catalogue()
                                .then(function (novels) { var _a; return (_a = novels.find(function (novel) { return novel.path === seriesPath; })) === null || _a === void 0 ? void 0 : _a.status; })
                                .catch(function () { return undefined; })];
                    case 3:
                        status = _g.sent();
                        return [2 /*return*/, {
                                path: novelPath,
                                name: name,
                                cover: cover,
                                author: author,
                                genres: genres,
                                status: status,
                                summary: summary || undefined,
                                chapters: chapters,
                            }];
                }
            });
        });
    };
    TinyTranslation.prototype.parseChapter = function (chapterPath) {
        return __awaiter(this, void 0, void 0, function () {
            var $, _a, scoped, content, chapter;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = cheerio_1.load;
                        return [4 /*yield*/, this.request(this.resolveUrl(chapterPath))];
                    case 1: return [4 /*yield*/, (_b.sent()).text()];
                    case 2:
                        $ = _a.apply(void 0, [_b.sent()]);
                        scoped = $('.entry-content .content').first();
                        content = scoped.length ? scoped : $('.content').first();
                        content
                            .find('h2.title-content, script, style, noscript, iframe, form, .navigate, #google_translate_element, .google_translate_element, .post-views, .tooltip, .adsbygoogle')
                            .remove();
                        content
                            .find('p')
                            .filter(function (_, el) { return /please bookmark this series/i.test($(el).text()); })
                            .remove();
                        chapter = content.html() || '';
                        if ((0, cheerio_1.load)(chapter).text().trim().length < 200)
                            throw new Error('TinyTranslation: no readable chapter text was found.');
                        return [2 /*return*/, chapter];
                }
            });
        });
    };
    TinyTranslation.prototype.searchNovels = function (searchTerm, pageNo) {
        return __awaiter(this, void 0, void 0, function () {
            var tokens, novels;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tokens = searchTerm
                            .toLowerCase()
                            .split(/[^a-z0-9]+/)
                            .filter(Boolean);
                        if (!tokens.length || pageNo > 1)
                            return [2 /*return*/, []];
                        return [4 /*yield*/, this.catalogue()];
                    case 1:
                        novels = _a.sent();
                        return [2 /*return*/, novels.filter(function (novel) {
                                var name = novel.name.toLowerCase();
                                return tokens.every(function (token) { return name.includes(token); });
                            })];
                }
            });
        });
    };
    TinyTranslation.prototype.resolveUrl = function (path) {
        return new URL(path, this.site).href;
    };
    return TinyTranslation;
}());
exports.default = new TinyTranslation();
