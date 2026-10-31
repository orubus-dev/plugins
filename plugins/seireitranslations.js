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
var cheerio_1 = require("cheerio");
var defaultCover_1 = require("@libs/defaultCover");
var PAGE_SIZE = 20;
var FEED_PAGE_SIZE = 150;
var COVER_SIZE = 's320';
var PLACEHOLDER_COVER = 'No_image_available';
var CHAPTER_PATH = /^\/\d{4}\/\d{2}\/[^/]+\.html$/;
var NOVEL_PATH = /^\/search\/label\/(.+)$/;
var NAV_TEXT = /^(previous|next|table of contents?|[|\s])+$/i;
// Labels that are not novels: Indonesian translations are matched by their
// "[Bahasa Indonesia]" tag, and the named labels in EXCLUDED_LABELS are not
// novels.
var NON_ENGLISH_TAG = /\[bahasa indonesia\]/i;
var EXCLUDED_LABELS = new Set([
    'Back Then I Adored You',
    'ChroNoiR',
    'Lagu',
    'Rainy Night',
    'The Great Wish',
]);
var postHref = function (entry) { var _a, _b; return (_b = (_a = entry.link) === null || _a === void 0 ? void 0 : _a.find(function (link) { return link.rel === 'alternate'; })) === null || _b === void 0 ? void 0 : _b.href; };
var SeireiTranslations = /** @class */ (function () {
    function SeireiTranslations() {
        this.id = 'seireitranslations';
        this.name = 'Seirei Translations';
        this.icon = 'src/en/seireitranslations/icon.png';
        this.site = 'https://seireitranslations.blogspot.com';
        this.version = '1.0.0';
        this.filters = undefined;
    }
    SeireiTranslations.prototype.request = function (url) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, fetch_1.fetchApi)(url)];
                    case 1:
                        response = _a.sent();
                        if (!response.ok) {
                            throw Object.assign(new Error("Seirei Translations: HTTP ".concat(response.status, ".")), { status: response.status });
                        }
                        return [2 /*return*/, response];
                }
            });
        });
    };
    SeireiTranslations.prototype.getFeed = function (params, label) {
        return __awaiter(this, void 0, void 0, function () {
            var feed, query, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        feed = label ? "summary/-/".concat(encodeURIComponent(label)) : 'summary';
                        query = new URLSearchParams(__assign({ alt: 'json' }, params)).toString();
                        return [4 /*yield*/, this.request("".concat(this.site, "/feeds/posts/").concat(feed, "?").concat(query))];
                    case 1: return [4 /*yield*/, (_a.sent()).json()];
                    case 2:
                        data = _a.sent();
                        return [2 /*return*/, data.feed];
                }
            });
        });
    };
    /** Blogger's label list is the blog's own grouping of novels. */
    SeireiTranslations.prototype.novelLabels = function () {
        return __awaiter(this, void 0, void 0, function () {
            var feed;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getFeed({ 'max-results': '1' })];
                    case 1:
                        feed = _a.sent();
                        return [2 /*return*/, ((feed === null || feed === void 0 ? void 0 : feed.category) || [])
                                .map(function (category) { return category.term; })
                                .filter(function (label) { return !NON_ENGLISH_TAG.test(label) && !EXCLUDED_LABELS.has(label); })];
                }
            });
        });
    };
    SeireiTranslations.prototype.novelPath = function (label) {
        return "/search/label/".concat(encodeURIComponent(label));
    };
    SeireiTranslations.prototype.labelFromPath = function (novelPath) {
        var match = NOVEL_PATH.exec(new URL(novelPath, this.site).pathname);
        if (!match)
            throw new Error('Seirei Translations: invalid novel address.');
        return decodeURIComponent(match[1]);
    };
    SeireiTranslations.prototype.coverFrom = function (entry) {
        var _a;
        var thumbnail = (_a = entry === null || entry === void 0 ? void 0 : entry.media$thumbnail) === null || _a === void 0 ? void 0 : _a.url;
        if (!thumbnail || thumbnail.includes(PLACEHOLDER_COVER))
            return defaultCover_1.defaultCover;
        return thumbnail.replace(/\/s\d+(-c)?\//, "/".concat(COVER_SIZE, "/"));
    };
    /** Each novel's cover is the thumbnail of its newest post. */
    SeireiTranslations.prototype.toNovelItems = function (labels) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, Promise.all(labels.map(function (label) { return __awaiter(_this, void 0, void 0, function () {
                        var feed;
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0: return [4 /*yield*/, this.getFeed({ 'max-results': '1' }, label).catch(function () { return undefined; })];
                                case 1:
                                    feed = _b.sent();
                                    return [2 /*return*/, {
                                            name: label,
                                            path: this.novelPath(label),
                                            cover: this.coverFrom((_a = feed === null || feed === void 0 ? void 0 : feed.entry) === null || _a === void 0 ? void 0 : _a[0]),
                                        }];
                            }
                        });
                    }); }))];
            });
        });
    };
    SeireiTranslations.prototype.popularNovels = function (pageNo) {
        return __awaiter(this, void 0, void 0, function () {
            var labels;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.novelLabels()];
                    case 1:
                        labels = (_a.sent()).slice((pageNo - 1) * PAGE_SIZE, pageNo * PAGE_SIZE);
                        return [2 /*return*/, this.toNovelItems(labels)];
                }
            });
        });
    };
    /** Every post of a label, newest first, with duplicates across pages removed. */
    SeireiTranslations.prototype.labelPosts = function (label) {
        return __awaiter(this, void 0, void 0, function () {
            var posts, seen, start, total, feed, entries, _i, entries_1, entry, href;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        posts = [];
                        seen = new Set();
                        start = 1;
                        total = 1;
                        _b.label = 1;
                    case 1:
                        if (!(start <= total)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.getFeed({
                                'max-results': String(FEED_PAGE_SIZE),
                                'start-index': String(start),
                            }, label)];
                    case 2:
                        feed = _b.sent();
                        entries = (feed === null || feed === void 0 ? void 0 : feed.entry) || [];
                        if (!entries.length)
                            return [3 /*break*/, 3];
                        for (_i = 0, entries_1 = entries; _i < entries_1.length; _i++) {
                            entry = entries_1[_i];
                            href = postHref(entry);
                            if (!href || seen.has(href))
                                continue;
                            seen.add(href);
                            posts.push(entry);
                        }
                        // Blogger returns fewer posts than asked per page, so step by what came back.
                        start += entries.length;
                        total = Number(((_a = feed === null || feed === void 0 ? void 0 : feed.openSearch$totalResults) === null || _a === void 0 ? void 0 : _a.$t) || 0);
                        return [3 /*break*/, 1];
                    case 3: return [2 /*return*/, posts];
                }
            });
        });
    };
    SeireiTranslations.prototype.parseNovel = function (novelPath) {
        return __awaiter(this, void 0, void 0, function () {
            var label, posts, chapters, _i, posts_1, entry, href, name_1, path;
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        label = this.labelFromPath(novelPath);
                        return [4 /*yield*/, this.labelPosts(label)];
                    case 1:
                        posts = _d.sent();
                        chapters = [];
                        for (_i = 0, posts_1 = posts; _i < posts_1.length; _i++) {
                            entry = posts_1[_i];
                            href = postHref(entry);
                            name_1 = (_b = (_a = entry.title) === null || _a === void 0 ? void 0 : _a.$t) === null || _b === void 0 ? void 0 : _b.trim();
                            if (!href || !name_1)
                                continue;
                            path = new URL(href).pathname;
                            if (!CHAPTER_PATH.test(path))
                                continue;
                            chapters.push({
                                name: name_1,
                                path: path,
                                releaseTime: (_c = entry.published) === null || _c === void 0 ? void 0 : _c.$t,
                            });
                        }
                        if (!chapters.length)
                            throw new Error('Seirei Translations: no chapters were found.');
                        // Blogger lists newest first; readers expect the series in publish order.
                        chapters.reverse();
                        return [2 /*return*/, {
                                name: label,
                                path: this.novelPath(label),
                                cover: this.coverFrom(posts[0]),
                                chapters: chapters,
                            }];
                }
            });
        });
    };
    SeireiTranslations.prototype.parseChapter = function (chapterPath) {
        return __awaiter(this, void 0, void 0, function () {
            var url, $, _a, content, chapter, hasImages;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        url = this.resolveUrl(chapterPath);
                        _a = cheerio_1.load;
                        return [4 /*yield*/, this.request(url)];
                    case 1: return [4 /*yield*/, (_b.sent()).text()];
                    case 2:
                        $ = _a.apply(void 0, [_b.sent()]);
                        content = $('div.post-body').first();
                        content
                            .find('script,style,iframe,noscript,form,.sharethis-inline-reaction-buttons')
                            .remove();
                        // Drop the "Previous | Table of Contents | Next" footer.
                        content.find('div,p').each(function (_, el) {
                            var node = $(el);
                            var text = node.text().replace(/\s+/g, ' ').trim();
                            if (node.find('a').length && NAV_TEXT.test(text))
                                node.remove();
                        });
                        chapter = content.html() || '';
                        hasImages = content.find('img').length > 0;
                        if (!hasImages && content.text().trim().length < 200)
                            throw new Error('Seirei Translations: no readable chapter text was found.');
                        return [2 /*return*/, chapter];
                }
            });
        });
    };
    SeireiTranslations.prototype.searchNovels = function (searchTerm, pageNo) {
        return __awaiter(this, void 0, void 0, function () {
            var terms, labels;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        terms = searchTerm.toLowerCase().split(/\s+/).filter(Boolean);
                        if (!terms.length)
                            return [2 /*return*/, []];
                        return [4 /*yield*/, this.novelLabels()];
                    case 1:
                        labels = (_a.sent()).filter(function (label) {
                            return terms.every(function (term) { return label.toLowerCase().includes(term); });
                        });
                        return [2 /*return*/, this.toNovelItems(labels.slice((pageNo - 1) * PAGE_SIZE, pageNo * PAGE_SIZE))];
                }
            });
        });
    };
    SeireiTranslations.prototype.resolveUrl = function (path) {
        var url = new URL(path, this.site);
        if (url.origin !== this.site)
            throw new Error('Seirei Translations: invalid page address.');
        return url.href;
    };
    return SeireiTranslations;
}());
exports.default = new SeireiTranslations();
