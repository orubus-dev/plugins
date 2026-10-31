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
// ─── Helpers ──────────────────────────────────────────────────────────────────
var PAGE_SIZE = 18;
/** Extract the pathname from a full URL, e.g. "/novel-slug/" */
function toPath(url) {
    try {
        return new URL(url).pathname;
    }
    catch (_a) {
        return url;
    }
}
/** Parse the cover image URL out of a WP category description field. */
function coverFromDesc(description) {
    var m = description.match(/src=["']([^"'>]+)/);
    return m ? m[1] : defaultCover_1.defaultCover;
}
/** Map a WP category to a NovelItem. */
function catToNovel(cat) {
    return {
        name: cat.name,
        path: toPath(cat.link),
        cover: coverFromDesc(cat.description),
    };
}
/** Fetch categories from WP REST API with the given query params. */
function fetchCategories(rest, params) {
    return __awaiter(this, void 0, void 0, function () {
        var qs;
        return __generator(this, function (_a) {
            qs = Object.entries(params)
                .map(function (_a) {
                var k = _a[0], v = _a[1];
                return "".concat(k, "=").concat(encodeURIComponent(v));
            })
                .join('&');
            return [2 /*return*/, (0, fetch_1.fetchApi)("".concat(rest, "/categories?").concat(qs)).then(function (r) { return r.json(); })];
        });
    });
}
// ─── Plugin ───────────────────────────────────────────────────────────────────
var Novel7sPlugin = /** @class */ (function () {
    function Novel7sPlugin() {
        var _this = this;
        this.id = 'novel7s';
        this.name = 'Novel7s';
        this.icon = 'src/en/novel7s/icon.png';
        this.site = 'https://novel7s.com';
        this.rest = "".concat(this.site, "/wp-json/wp/v2");
        this.version = '1.0.1';
        this.filters = {
            sort: {
                label: 'Sort by',
                value: 'count',
                options: [
                    { label: 'Most chapters (popular)', value: 'count' },
                    { label: 'Trending (views)', value: 'trending' },
                    { label: 'Latest uploaded', value: 'id' },
                    { label: 'A → Z', value: 'name_asc' },
                    { label: 'Z → A', value: 'name_desc' },
                ],
                type: filterInputs_1.FilterTypes.Picker,
            },
        };
        // ── resolveUrl ──────────────────────────────────────────────────────────────
        this.resolveUrl = function (path) { return _this.site + path; };
    }
    // ── popularNovels ───────────────────────────────────────────────────────────
    Novel7sPlugin.prototype.popularNovels = function (pageNo_1, _a) {
        return __awaiter(this, arguments, void 0, function (pageNo, _b) {
            var sort, offset, data, isAlpha, orderby, finalOrder, cats;
            var _c, _d, _e;
            var showLatestNovels = _b.showLatestNovels, filters = _b.filters;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        sort = showLatestNovels ? 'id' : ((_d = (_c = filters === null || filters === void 0 ? void 0 : filters.sort) === null || _c === void 0 ? void 0 : _c.value) !== null && _d !== void 0 ? _d : 'count');
                        if (!(sort === 'trending')) return [3 /*break*/, 2];
                        offset = (pageNo - 1) * PAGE_SIZE;
                        return [4 /*yield*/, (0, fetch_1.fetchApi)("".concat(this.site, "/wp-admin/admin-ajax.php?action=n7_load_more&type=trending&offset=").concat(offset)).then(function (r) { return r.json(); })];
                    case 1:
                        data = _f.sent();
                        return [2 /*return*/, ((_e = data.items) !== null && _e !== void 0 ? _e : []).map(function (item) { return ({
                                name: item.name,
                                path: toPath(item.url),
                                cover: item.cover || defaultCover_1.defaultCover,
                            }); })];
                    case 2:
                        isAlpha = sort === 'name_asc' || sort === 'name_desc';
                        orderby = isAlpha ? 'name' : sort;
                        finalOrder = sort === 'name_asc' ? 'asc' : 'desc';
                        return [4 /*yield*/, fetchCategories(this.rest, {
                                orderby: orderby,
                                order: finalOrder,
                                per_page: PAGE_SIZE,
                                page: pageNo,
                                hide_empty: 1,
                                _fields: 'id,name,slug,count,description,link',
                            })];
                    case 3:
                        cats = _f.sent();
                        return [2 /*return*/, cats.map(catToNovel)];
                }
            });
        });
    };
    // ── parseNovel ──────────────────────────────────────────────────────────────
    Novel7sPlugin.prototype.parseNovel = function (novelPath) {
        return __awaiter(this, void 0, void 0, function () {
            var slug, cats, cat, chaptersUrl, firstRes, totalPages, firstChapters, allPosts, extra, chapters, summary;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        slug = novelPath.replace(/^\/|\/$/g, '');
                        return [4 /*yield*/, fetchCategories(this.rest, {
                                slug: slug,
                                _fields: 'id,name,count,description',
                            })];
                    case 1:
                        cats = _a.sent();
                        if (!cats || cats.length === 0) {
                            return [2 /*return*/, { path: novelPath, name: slug }];
                        }
                        cat = cats[0];
                        chaptersUrl = "".concat(this.rest, "/posts?categories=").concat(cat.id, "&orderby=date&order=asc&per_page=100&_fields=id,title,slug,link,date,excerpt");
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(chaptersUrl)];
                    case 2:
                        firstRes = _a.sent();
                        totalPages = parseInt(firstRes.headers.get('X-WP-TotalPages') || '1', 10);
                        return [4 /*yield*/, firstRes.json()];
                    case 3:
                        firstChapters = _a.sent();
                        allPosts = __spreadArray([], firstChapters, true);
                        if (!(totalPages > 1)) return [3 /*break*/, 5];
                        return [4 /*yield*/, Promise.all(Array.from({ length: totalPages - 1 }, function (_, i) {
                                return (0, fetch_1.fetchApi)("".concat(chaptersUrl, "&page=").concat(i + 2)).then(function (r) { return r.json(); });
                            }))];
                    case 4:
                        extra = _a.sent();
                        extra.forEach(function (page) { return allPosts.push.apply(allPosts, page); });
                        _a.label = 5;
                    case 5:
                        chapters = allPosts.map(function (post, i) {
                            var title = post.title.rendered;
                            var numMatch = title.match(/Chapter\s+(\d+(?:\.\d+)?)/i);
                            return {
                                name: numMatch ? "Chapter ".concat(numMatch[1]) : title,
                                path: toPath(post.link),
                                chapterNumber: numMatch ? parseFloat(numMatch[1]) : i + 1,
                                releaseTime: post.date,
                            };
                        });
                        summary = '';
                        if (allPosts.length > 0 && allPosts[0].excerpt) {
                            summary = (0, cheerio_1.load)(allPosts[0].excerpt.rendered).text().trim();
                            // Remove chapter title repetition from start of summary if present
                            summary = summary
                                .replace(/^.*?Chapter\s+\d+(?:\.\d+)?(?:[:-]|\s)+/i, '')
                                .trim();
                        }
                        return [2 /*return*/, {
                                path: novelPath,
                                name: cat.name,
                                cover: coverFromDesc(cat.description),
                                author: 'Novel7s',
                                summary: summary,
                                status: novelStatus_1.NovelStatus.Completed,
                                chapters: chapters,
                            }];
                }
            });
        });
    };
    // ── parseChapter ────────────────────────────────────────────────────────────
    Novel7sPlugin.prototype.parseChapter = function (chapterPath) {
        return __awaiter(this, void 0, void 0, function () {
            var slug, posts, rawHtml, $, paragraphs, i, current, next, text;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        slug = chapterPath.replace(/^\/|\/$/g, '');
                        return [4 /*yield*/, (0, fetch_1.fetchApi)("".concat(this.rest, "/posts?slug=").concat(slug, "&_fields=content")).then(function (r) { return r.json(); })];
                    case 1:
                        posts = _a.sent();
                        if (!posts || posts.length === 0)
                            return [2 /*return*/, ''];
                        rawHtml = posts[0].content.rendered;
                        $ = (0, cheerio_1.load)(rawHtml);
                        // Remove the first <p> that only contains <strong> (repeated chapter title)
                        $('p:has(strong)').first().remove();
                        paragraphs = $('p').toArray();
                        for (i = 0; i < paragraphs.length - 1; i++) {
                            current = paragraphs[i];
                            next = paragraphs[i + 1];
                            if ($(current).next()[0] !== next)
                                continue;
                            text = $(current).text().trim();
                            if (!text)
                                continue;
                            // If it ends like a complete sentence, keep separate
                            if (/[.!?…]["'”’»]?$/.test(text))
                                continue;
                            $(current).append(' ');
                            $(current).append($(next).contents());
                            $(next).remove();
                            paragraphs.splice(i + 1, 1);
                            i--;
                        }
                        return [2 /*return*/, $.html()];
                }
            });
        });
    };
    // ── searchNovels ────────────────────────────────────────────────────────────
    Novel7sPlugin.prototype.searchNovels = function (searchTerm, pageNo) {
        return __awaiter(this, void 0, void 0, function () {
            var cats;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // Guard: empty term would return the default category list, not search results.
                        if (!searchTerm.trim())
                            return [2 /*return*/, []];
                        return [4 /*yield*/, fetchCategories(this.rest, {
                                search: searchTerm.trim(),
                                per_page: PAGE_SIZE,
                                page: pageNo,
                                hide_empty: 1,
                                _fields: 'id,name,slug,count,description,link',
                            })];
                    case 1:
                        cats = _a.sent();
                        return [2 /*return*/, cats.map(catToNovel)];
                }
            });
        });
    };
    return Novel7sPlugin;
}());
exports.default = new Novel7sPlugin();
