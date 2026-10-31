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
exports.FictioneerPlugin = void 0;
var cheerio_1 = require("cheerio");
var fetch_1 = require("@libs/fetch");
var novelStatus_1 = require("@libs/novelStatus");
var defaultSelectors = {
    browseCard: '#featured-list > li > div > div, #list-of-stories > li > div > div',
    searchCard: '#search-result-list > li > div > div',
    cardTitle: 'h3 > a',
    cardCover: 'a.cell-img:has(img)',
    novelTitle: 'h1.story__identity-title',
    novelAuthor: 'div.story__identity-meta',
    novelCover: 'figure.story__thumbnail > a',
    novelSummary: 'section.story__summary',
};
var FictioneerPlugin = /** @class */ (function () {
    function FictioneerPlugin(metadata) {
        var _this = this;
        var _a, _b;
        this.filters = undefined;
        this.resolveUrl = function (path) {
            return _this.site.replace(/\/+$/, '') + '/' + path.replace(/^\/+|\/+$/g, '') + '/';
        };
        this.id = metadata.id;
        this.name = metadata.sourceName;
        this.icon = "multisrc/fictioneer/".concat(metadata.id.toLowerCase(), "/icon.png");
        this.site = metadata.sourceSite;
        var versionIncrements = ((_a = metadata.options) === null || _a === void 0 ? void 0 : _a.versionIncrements) || 0;
        this.version = "1.2.".concat(0 + versionIncrements);
        this.options = metadata.options;
        this.selectors = __assign(__assign({}, defaultSelectors), (_b = metadata.options) === null || _b === void 0 ? void 0 : _b.selectors);
    }
    FictioneerPlugin.prototype.toPath = function (url) {
        var path = new URL(url, this.site).pathname.substring(1);
        return this.options.trimTrailingSlash ? path.replace(/\/$/, '') : path;
    };
    FictioneerPlugin.prototype.parseNovels = function (loadedCheerio, selector) {
        var _this = this;
        return loadedCheerio(selector)
            .map(function (i, el) {
            var element = loadedCheerio(el);
            var title = element.find(_this.selectors.cardTitle);
            var novelName = title.text();
            var cover = element.find(_this.selectors.cardCover);
            var novelCover = cover.attr('data-src') || cover.attr('src') || cover.attr('href');
            var novelUrl = title.attr('href');
            if (!novelUrl)
                return;
            return {
                name: novelName,
                cover: novelCover,
                path: _this.toPath(novelUrl),
            };
        })
            .toArray();
    };
    FictioneerPlugin.prototype.popularNovels = function (pageNo_1, _a) {
        return __awaiter(this, arguments, void 0, function (pageNo, _b) {
            var req_1, body_1, loadedCheerio_1, req, body, loadedCheerio;
            var showLatestNovels = _b.showLatestNovels;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (!showLatestNovels) return [3 /*break*/, 3];
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(this.site +
                                "/".concat(pageNo === 1 ? '' : 'page/' + pageNo + '/', "?s=&post_type=fcn_story&orderby=modified&order=desc"))];
                    case 1:
                        req_1 = _c.sent();
                        return [4 /*yield*/, req_1.text()];
                    case 2:
                        body_1 = _c.sent();
                        loadedCheerio_1 = (0, cheerio_1.load)(body_1);
                        return [2 /*return*/, this.parseNovels(loadedCheerio_1, this.selectors.searchCard)];
                    case 3: return [4 /*yield*/, (0, fetch_1.fetchApi)(this.site +
                            '/' +
                            this.options.browsePage +
                            '/' +
                            (pageNo === 1 ? '' : 'page/' + pageNo + '/'))];
                    case 4:
                        req = _c.sent();
                        return [4 /*yield*/, req.text()];
                    case 5:
                        body = _c.sent();
                        loadedCheerio = (0, cheerio_1.load)(body);
                        return [2 /*return*/, this.parseNovels(loadedCheerio, this.selectors.browseCard)];
                }
            });
        });
    };
    FictioneerPlugin.prototype.parseNovel = function (novelPath) {
        return __awaiter(this, void 0, void 0, function () {
            var req, body, loadedCheerio, novel, author, cover, summary, statusElement, status;
            var _this = this;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, (0, fetch_1.fetchApi)(this.site + '/' + novelPath + '/')];
                    case 1:
                        req = _b.sent();
                        return [4 /*yield*/, req.text()];
                    case 2:
                        body = _b.sent();
                        loadedCheerio = (0, cheerio_1.load)(body);
                        novel = {
                            path: novelPath,
                            name: loadedCheerio(this.selectors.novelTitle).text(),
                        };
                        author = loadedCheerio(this.selectors.novelAuthor).text();
                        // The default selector matches the "Author: X | ..." meta line, while an
                        // override is expected to match the author name itself.
                        novel.author = ((_a = this.options.selectors) === null || _a === void 0 ? void 0 : _a.novelAuthor)
                            ? author.trim()
                            : author.split('|')[0].replace('Author: ', '').replace('by ', '').trim();
                        cover = loadedCheerio(this.selectors.novelCover);
                        novel.cover =
                            cover.attr('data-src') || cover.attr('src') || cover.attr('href');
                        novel.genres = loadedCheerio('div.tag-group > a, section.tag-group > a')
                            .map(function (i, el) { return loadedCheerio(el).text(); })
                            .toArray()
                            .join(',');
                        summary = loadedCheerio(this.selectors.novelSummary);
                        summary.find('.related-stories-block, section.small-card-block').remove();
                        summary.find('p').after('\n\n');
                        summary.find('br').after('\n');
                        novel.summary = summary
                            .text()
                            .trim()
                            .replace(/\n{3,}/g, '\n\n');
                        novel.chapters = loadedCheerio('li.chapter-group__list-item._publish')
                            .filter(function (i, el) { return !el.attribs['class'].includes('_password'); })
                            .filter(function (i, el) {
                            return !(loadedCheerio(el).find('i').first().attr('class') || '').includes('fa-lock');
                        })
                            .map(function (i, el) {
                            var chapterName = loadedCheerio(el).find('a').text();
                            var chapterUrl = loadedCheerio(el).find('a').attr('href');
                            if (!chapterUrl)
                                return;
                            var chapter = {
                                name: chapterName,
                                path: _this.toPath(chapterUrl),
                            };
                            var chapterNumber = chapterName.match(/^(?:cap[íi]tulo|chapter|ch\.?)\s*(\d+(?:\.\d+)?)/i);
                            if (chapterNumber)
                                chapter.chapterNumber = Number(chapterNumber[1]);
                            return chapter;
                        })
                            .toArray();
                        statusElement = loadedCheerio('span.story__status');
                        status = statusElement.text().trim();
                        if (statusElement.hasClass('_ongoing') || status === 'Ongoing')
                            novel.status = novelStatus_1.NovelStatus.Ongoing;
                        if (statusElement.hasClass('_completed') ||
                            statusElement.hasClass('_oneshot') ||
                            status === 'Completed')
                            novel.status = novelStatus_1.NovelStatus.Completed;
                        if (statusElement.hasClass('_canceled') ||
                            status === 'Canceled' ||
                            status === 'Cancelled')
                            novel.status = novelStatus_1.NovelStatus.Cancelled;
                        if (statusElement.hasClass('_hiatus') || status === 'Hiatus')
                            novel.status = novelStatus_1.NovelStatus.OnHiatus;
                        return [2 /*return*/, novel];
                }
            });
        });
    };
    FictioneerPlugin.prototype.parseChapter = function (chapterPath) {
        return __awaiter(this, void 0, void 0, function () {
            var req, body, loadedCheerio;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, fetch_1.fetchApi)(this.site + '/' + chapterPath + '/')];
                    case 1:
                        req = _a.sent();
                        return [4 /*yield*/, req.text()];
                    case 2:
                        body = _a.sent();
                        loadedCheerio = (0, cheerio_1.load)(body);
                        loadedCheerio('section#chapter-content')
                            .find('script, style, iframe')
                            .remove();
                        return [2 /*return*/, loadedCheerio('section#chapter-content > div').html() || ''];
                }
            });
        });
    };
    FictioneerPlugin.prototype.searchNovels = function (searchTerm, pageNo) {
        return __awaiter(this, void 0, void 0, function () {
            var req, body, loadedCheerio;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, fetch_1.fetchApi)(this.site +
                            "/".concat(pageNo === 1 ? '' : 'page/' + pageNo + '/', "?s=").concat(encodeURIComponent(searchTerm), "&post_type=fcn_story"))];
                    case 1:
                        req = _a.sent();
                        return [4 /*yield*/, req.text()];
                    case 2:
                        body = _a.sent();
                        loadedCheerio = (0, cheerio_1.load)(body);
                        return [2 /*return*/, this.parseNovels(loadedCheerio, this.selectors.searchCard)];
                }
            });
        });
    };
    return FictioneerPlugin;
}());
exports.FictioneerPlugin = FictioneerPlugin;
var plugin = new FictioneerPlugin({ "id": "daoistquest", "sourceSite": "https://daoist.quest", "sourceName": "Daoist Quest", "options": { "browsePage": "collection/novels", "versionIncrements": 1 } });
exports.default = plugin;
