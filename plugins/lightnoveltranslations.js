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
// import { defaultCover } from '@libs/defaultCover';
var novelStatus_1 = require("@libs/novelStatus");
// import { isUrlAbsolute } from '@libs/isAbsoluteUrl';
// import { storage, localStorage, sessionStorage } from '@libs/storage';
// import { encode, decode } from 'urlencode';
// import dayjs from 'dayjs';
// import { Parser } from 'htmlparser2';
var LNTPlugin = /** @class */ (function () {
    function LNTPlugin() {
        var _this = this;
        this.id = 'lightnoveltranslations';
        this.name = 'Light Novel Translations';
        this.icon = 'src/en/lightnoveltranslations/icon.png';
        this.site = 'https://lightnovelstranslations.com/';
        this.version = '1.0.2';
        this.filters = undefined;
        this.imageRequestInit = undefined;
        // The site serves only 6 novels per page, so one app page fetches
        // several consecutive site pages and combines them. Otherwise opening
        // the source shows a nearly empty grid next to sources that serve 20+
        // novels per page.
        this.pagesPerAppPage = 5;
        this.resolveUrl = function (path) { return _this.site + path; };
    }
    // Site pages covered by one app page: app page 1 -> site pages 1-5,
    // app page 2 -> site pages 6-10, and so on.
    LNTPlugin.prototype.appPageSitePages = function (appPage) {
        var first = (appPage - 1) * this.pagesPerAppPage + 1;
        var pages = [];
        for (var i = 0; i < this.pagesPerAppPage; i++) {
            pages.push(first + i);
        }
        return pages;
    };
    LNTPlugin.prototype.fetchNovelCards = function (urls) {
        return __awaiter(this, void 0, void 0, function () {
            var novels, _i, urls_1, url, body, html, cards;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        novels = [];
                        _i = 0, urls_1 = urls;
                        _a.label = 1;
                    case 1:
                        if (!(_i < urls_1.length)) return [3 /*break*/, 5];
                        url = urls_1[_i];
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(url)];
                    case 2:
                        body = _a.sent();
                        return [4 /*yield*/, body.text()];
                    case 3:
                        html = _a.sent();
                        cards = this.parseNovelCards(html);
                        novels.push.apply(novels, cards);
                        _a.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 1];
                    case 5: return [2 /*return*/, novels];
                }
            });
        });
    };
    LNTPlugin.prototype.browsePageUrl = function (pageNo, sortby) {
        return pageNo > 1
            ? "".concat(this.site, "browse/page/").concat(pageNo, "/?sortby=").concat(sortby)
            : "".concat(this.site, "browse/?sortby=").concat(sortby);
    };
    LNTPlugin.prototype.searchPageUrl = function (pageNo, searchTerm) {
        var query = "field-search=".concat(encodeURIComponent(searchTerm));
        return pageNo > 1
            ? "".concat(this.site, "browse/page/").concat(pageNo, "/?").concat(query)
            : "".concat(this.site, "browse/?").concat(query);
    };
    LNTPlugin.prototype.popularNovels = function (pageNo_1, _a) {
        return __awaiter(this, arguments, void 0, function (pageNo, _b) {
            var sortby, urls;
            var _this = this;
            var showLatestNovels = _b.showLatestNovels;
            return __generator(this, function (_c) {
                sortby = showLatestNovels ? 'most-recent' : 'most-liked';
                urls = this.appPageSitePages(pageNo).map(function (page) {
                    return _this.browsePageUrl(page, sortby);
                });
                return [2 /*return*/, this.fetchNovelCards(urls)];
            });
        });
    };
    LNTPlugin.prototype.parseNovelCards = function (html) {
        var loadedCheerio = (0, cheerio_1.load)(html);
        var baseUrl = this.site;
        var novels = [];
        loadedCheerio('.read_list-story-item').each(function (i, el) {
            var card = loadedCheerio(el);
            var thumbLink = card.find('.item_thumb').find('a').first();
            var img = card.find('.item_thumb').find('img').first().attr('src');
            var path = thumbLink.attr('href');
            path = path ? path.slice(baseUrl.length) : '';
            var title = thumbLink.attr('aria-label') ||
                card.find('.wrap_item_content').find('h3').first().text().trim() ||
                thumbLink.attr('title') ||
                '';
            var tempNovel = {};
            tempNovel.name = title;
            tempNovel.path = path;
            tempNovel.cover = img;
            novels.push(tempNovel);
        });
        return novels;
    };
    LNTPlugin.prototype.parseNovel = function (novelPath) {
        return __awaiter(this, void 0, void 0, function () {
            var url, body, html, novel, loadedCheerio, baseUrl, chapters;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = this.site + novelPath;
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(url)];
                    case 1:
                        body = _a.sent();
                        return [4 /*yield*/, body.text().then(function (r) { return r.replace(/>\s+</g, '><'); })];
                    case 2:
                        html = _a.sent();
                        novel = {
                            path: novelPath,
                            name: '',
                            totalPages: 1,
                            summary: '',
                            author: '',
                            status: '',
                            chapters: [],
                        };
                        loadedCheerio = (0, cheerio_1.load)(html);
                        novel.cover = loadedCheerio('div.novel-image').find('img').attr('src');
                        novel.status = loadedCheerio('div.novel_status').text().trim();
                        switch (novel.status) {
                            case 'Ongoing':
                                novel.status = novelStatus_1.NovelStatus.Ongoing;
                                break;
                            case 'Hiatus':
                                novel.status = novelStatus_1.NovelStatus.OnHiatus;
                                break;
                            case 'Completed':
                                novel.status = novelStatus_1.NovelStatus.Completed;
                                break;
                            default:
                                novel.status = novelStatus_1.NovelStatus.Unknown;
                        }
                        novel.name = loadedCheerio('div.novel_title')
                            .find('h3')
                            .first()
                            .text()
                            .trim();
                        novel.author = loadedCheerio('div.novel_detail_info')
                            .find('li')
                            .filter(function () {
                            return loadedCheerio(this).text().includes('Author');
                        })
                            .first()
                            .text()
                            .trim();
                        novel.summary = loadedCheerio('div.novel_text')
                            .find('p')
                            .first()
                            .text()
                            .trim();
                        baseUrl = this.site;
                        chapters = [];
                        loadedCheerio('li.chapter-item.unlock').each(function (i, el) {
                            var chapterName = loadedCheerio(el).find('a').text().trim();
                            var chapterPath = loadedCheerio(el).find('a').attr('href');
                            if (chapterPath) {
                                var chapter = {
                                    name: chapterName,
                                    path: chapterPath.slice(baseUrl.length),
                                };
                                chapters.push(chapter);
                            }
                        });
                        novel.chapters = chapters;
                        return [2 /*return*/, novel];
                }
            });
        });
    };
    LNTPlugin.prototype.parseChapter = function (chapterPath) {
        return __awaiter(this, void 0, void 0, function () {
            var body, html, loadedCheerio, chapterText;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, fetch_1.fetchApi)(this.site + chapterPath)];
                    case 1:
                        body = _a.sent();
                        return [4 /*yield*/, body.text().then(function (r) { return r.replace(/>\s+</g, '><'); })];
                    case 2:
                        html = _a.sent();
                        loadedCheerio = (0, cheerio_1.load)(html);
                        chapterText = loadedCheerio('div.text_story');
                        chapterText.find('div.ads_content').remove();
                        return [2 /*return*/, chapterText.html() || ''];
                }
            });
        });
    };
    LNTPlugin.prototype.searchNovels = function (searchTerm, pageNo) {
        return __awaiter(this, void 0, void 0, function () {
            var urls;
            var _this = this;
            return __generator(this, function (_a) {
                urls = this.appPageSitePages(pageNo).map(function (page) {
                    return _this.searchPageUrl(page, searchTerm);
                });
                return [2 /*return*/, this.fetchNovelCards(urls)];
            });
        });
    };
    return LNTPlugin;
}());
exports.default = new LNTPlugin();
