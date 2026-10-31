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
var PeachPuffTranslations = /** @class */ (function () {
    function PeachPuffTranslations() {
        this.id = 'peachpuff';
        this.name = 'Peach Puff Translations';
        this.site = 'https://peachpuff.in/';
        this.version = '1.0.0';
        this.icon = 'src/english/peachpuff/icon.png';
    }
    PeachPuffTranslations.prototype.cleanCover = function (src) {
        if (!src)
            return undefined;
        return src
            .replace('i0.wp.com/', '')
            .replace(/^http:/, 'https:')
            .split('?')[0];
    };
    PeachPuffTranslations.prototype.novelPath = function (href) {
        if (!href)
            return undefined;
        return href.replace(this.site, '').replace(/\/+$/, '');
    };
    PeachPuffTranslations.prototype.getNovelCovers = function () {
        return __awaiter(this, void 0, void 0, function () {
            var covers, _a, pages, media, pageLinks, mediaItems, _i, mediaItems_1, item, path, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (this.coversCache)
                            return [2 /*return*/, this.coversCache];
                        covers = new Map();
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, Promise.all([
                                (0, fetch_1.fetchApi)("".concat(this.site, "wp-json/wp/v2/pages?per_page=100&_fields=id,link")).then(function (res) { return res.json(); }),
                                (0, fetch_1.fetchApi)("".concat(this.site, "wp-json/wp/v2/media?per_page=100&_fields=id,post,source_url")).then(function (res) { return res.json(); }),
                            ])];
                    case 2:
                        _a = _c.sent(), pages = _a[0], media = _a[1];
                        pageLinks = new Map(pages.map(function (page) { return [
                            page.id,
                            page.link,
                        ]; }));
                        mediaItems = media;
                        mediaItems.sort(function (a, b) { return a.id - b.id; });
                        for (_i = 0, mediaItems_1 = mediaItems; _i < mediaItems_1.length; _i++) {
                            item = mediaItems_1[_i];
                            path = item.post
                                ? this.novelPath(pageLinks.get(item.post))
                                : undefined;
                            if (path && !covers.has(path))
                                covers.set(path, item.source_url);
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        _b = _c.sent();
                        this.coversCache = covers;
                        return [2 /*return*/, covers];
                    case 4:
                        this.coversCache = covers;
                        return [2 /*return*/, covers];
                }
            });
        });
    };
    PeachPuffTranslations.prototype.parseNovels = function (loadedCheerio) {
        var _this = this;
        var novels = [];
        loadedCheerio('ul.wp-block-list li a[title]').each(function (_, element) {
            var path = _this.novelPath(loadedCheerio(element).attr('href'));
            if (!path)
                return;
            var name = loadedCheerio(element).attr('title') ||
                loadedCheerio(element).text().trim();
            novels.push({ name: name, path: path });
        });
        return novels;
    };
    PeachPuffTranslations.prototype.popularNovels = function () {
        return __awaiter(this, void 0, void 0, function () {
            var body, novels, covers, _i, novels_1, novel;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, fetch_1.fetchApi)(this.site).then(function (res) { return res.text(); })];
                    case 1:
                        body = _a.sent();
                        novels = this.parseNovels((0, cheerio_1.load)(body));
                        return [4 /*yield*/, this.getNovelCovers()];
                    case 2:
                        covers = _a.sent();
                        for (_i = 0, novels_1 = novels; _i < novels_1.length; _i++) {
                            novel = novels_1[_i];
                            novel.cover = covers.get(novel.path);
                        }
                        return [2 /*return*/, novels];
                }
            });
        });
    };
    PeachPuffTranslations.prototype.searchNovels = function (searchTerm) {
        return __awaiter(this, void 0, void 0, function () {
            var query;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = searchTerm.toLowerCase();
                        return [4 /*yield*/, this.popularNovels()];
                    case 1: return [2 /*return*/, (_a.sent()).filter(function (novel) {
                            return novel.name.toLowerCase().includes(query);
                        })];
                }
            });
        });
    };
    PeachPuffTranslations.prototype.parseNovel = function (novelPath) {
        return __awaiter(this, void 0, void 0, function () {
            var body, loadedCheerio, novel, descriptionLabel, summary, chapters;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, fetch_1.fetchApi)(this.site + novelPath).then(function (res) { return res.text(); })];
                    case 1:
                        body = _a.sent();
                        loadedCheerio = (0, cheerio_1.load)(body);
                        novel = {
                            path: novelPath,
                            name: loadedCheerio('div.entry-title h2').first().text().trim(),
                        };
                        novel.cover = this.cleanCover(loadedCheerio('figure.wp-block-image img').first().attr('src'));
                        loadedCheerio('p.wp-block-paragraph strong').each(function (_, element) {
                            var key = loadedCheerio(element).text().trim().toLowerCase();
                            if (key === 'author:') {
                                novel.author = loadedCheerio(element).nextUntil('strong').text().trim();
                            }
                        });
                        descriptionLabel = loadedCheerio('p.wp-block-paragraph strong:contains("Description:")').first();
                        if (descriptionLabel.length) {
                            summary = descriptionLabel
                                .parent()
                                .nextUntil('h4.wp-block-heading')
                                .map(function (_, element) {
                                var paragraph = loadedCheerio(element);
                                paragraph.find('br').replaceWith('\n');
                                return paragraph.text().trim();
                            })
                                .get()
                                .filter(Boolean)
                                .join('\n\n');
                            if (summary)
                                novel.summary = summary;
                        }
                        chapters = [];
                        loadedCheerio('.lcp_catlist li a').each(function (_, element) {
                            var path = _this.novelPath(loadedCheerio(element).attr('href'));
                            if (!path)
                                return;
                            chapters.push({
                                name: loadedCheerio(element).text().trim(),
                                path: path,
                            });
                        });
                        novel.chapters = chapters;
                        return [2 /*return*/, novel];
                }
            });
        });
    };
    PeachPuffTranslations.prototype.parseChapter = function (chapterPath) {
        return __awaiter(this, void 0, void 0, function () {
            var body, loadedCheerio;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, (0, fetch_1.fetchApi)(this.site + chapterPath).then(function (res) {
                            return res.text();
                        })];
                    case 1:
                        body = _b.sent();
                        loadedCheerio = (0, cheerio_1.load)(body);
                        loadedCheerio('.category-post-dropdown-container').remove();
                        loadedCheerio('script, style').remove();
                        return [2 /*return*/, (_a = loadedCheerio('.entry-content').html()) !== null && _a !== void 0 ? _a : ''];
                }
            });
        });
    };
    return PeachPuffTranslations;
}());
exports.default = new PeachPuffTranslations();
