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
var HangulPlanetPlugin = /** @class */ (function () {
    function HangulPlanetPlugin() {
        this.id = 'hangulplanet';
        this.name = 'HangulPlanet';
        this.icon = 'src/en/hangulplanet/icon.png';
        this.site = 'https://hangulplanet.com';
        this.version = '2.3.0';
    }
    HangulPlanetPlugin.prototype.fetchPage = function (url_1) {
        return __awaiter(this, arguments, void 0, function (url, search) {
            var r, text, $, title;
            if (search === void 0) { search = false; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, fetch_1.fetchApi)(url)];
                    case 1:
                        r = _a.sent();
                        if (!r.ok && !search) {
                            throw new Error('Could not reach site (' + r.status + ') try to open in webview.');
                        }
                        return [4 /*yield*/, r.text()];
                    case 2:
                        text = _a.sent();
                        console.log('response byte length:', text.length);
                        $ = (0, cheerio_1.load)(text);
                        title = $('title').text().trim();
                        if (title === 'Bot Verification' ||
                            title === 'You are being redirected...' ||
                            title === 'Un instant...' ||
                            title === 'Just a moment...' ||
                            title === 'Redirecting...') {
                            throw new Error('Captcha error, please open in webview');
                        }
                        return [2 /*return*/, { $: $, text: text }];
                }
            });
        });
    };
    HangulPlanetPlugin.prototype.getCheerio = function (url_1) {
        return __awaiter(this, arguments, void 0, function (url, search) {
            var $;
            if (search === void 0) { search = false; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.fetchPage(url, search)];
                    case 1:
                        $ = (_a.sent()).$;
                        return [2 /*return*/, $];
                }
            });
        });
    };
    HangulPlanetPlugin.prototype.parseNovelCards = function ($) {
        var _this = this;
        var novels = [];
        $('a[href^="/novel/"]').each(function (_, el) {
            var _a;
            var href = $(el).attr('href') || '';
            var img = $(el).find('img.object-cover').first();
            var name = ((_a = img.attr('alt')) === null || _a === void 0 ? void 0 : _a.trim()) || '';
            var src = img.attr('src');
            var cover = src ? _this.site + src : defaultCover_1.defaultCover;
            if (!href || !name)
                return;
            novels.push({ name: name, cover: cover, path: href });
        });
        return novels;
    };
    HangulPlanetPlugin.prototype.popularNovels = function (pageNo_1, _a) {
        return __awaiter(this, arguments, void 0, function (pageNo, _b) {
            var sort, $;
            var showLatestNovels = _b.showLatestNovels;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (pageNo > 1)
                            return [2 /*return*/, []];
                        sort = showLatestNovels ? 'latest' : 'popular';
                        return [4 /*yield*/, this.getCheerio("".concat(this.site, "/browse?sort=").concat(sort))];
                    case 1:
                        $ = _c.sent();
                        return [2 /*return*/, this.parseNovelCards($)];
                }
            });
        });
    };
    HangulPlanetPlugin.prototype.searchNovels = function (searchTerm, pageNo) {
        return __awaiter(this, void 0, void 0, function () {
            var url, $;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (pageNo > 1)
                            return [2 /*return*/, []];
                        url = "".concat(this.site, "/browse?q=").concat(encodeURIComponent(searchTerm));
                        return [4 /*yield*/, this.getCheerio(url, true)];
                    case 1:
                        $ = _a.sent();
                        return [2 /*return*/, this.parseNovelCards($)];
                }
            });
        });
    };
    /**
      IMPORTANT: this site does NOT render its full chapter list as real
      <a> DOM elements. Beyond a small SSR-visible slice, the list lives
      inside a Next.js RSC ("flight") payload
     */
    HangulPlanetPlugin.prototype.parseChaptersFromText = function (novelPath, text, chapters, seen) {
        var added = 0;
        // Primary: escaped-JSON form from the RSC payload.
        var hrefPattern = /\\"href\\":\\"([^"\\]*\/chapter-(\d+))\\"/g;
        var WINDOW = 800;
        var match;
        while ((match = hrefPattern.exec(text)) !== null) {
            var chapterNumber = parseInt(match[2], 10);
            if (seen.has(chapterNumber))
                continue;
            seen.add(chapterNumber);
            var windowText = text.slice(match.index, match.index + WINDOW);
            var nameMatch = windowText.match(/\\"line-clamp-1 flex-1 text-sm\\",\\"children\\":\\"([^\\]*)\\"/);
            var dateMatch = windowText.match(/\\"dateTime\\":\\"([^\\]*)\\"/);
            chapters.push({
                name: nameMatch ? nameMatch[1] : "Chapter ".concat(chapterNumber),
                path: match[1],
                chapterNumber: chapterNumber,
                releaseTime: dateMatch ? dateMatch[1] : null,
            });
            added++;
        }
        var $ = (0, cheerio_1.load)(text);
        $('#chapters a[href*="/chapter-"]').each(function (_, el) {
            var href = $(el).attr('href') || '';
            var chapterNumMatch = href.match(/chapter-(\d+)$/);
            if (!href || !chapterNumMatch)
                return;
            var chapterNumber = parseInt(chapterNumMatch[1], 10);
            if (seen.has(chapterNumber))
                return;
            seen.add(chapterNumber);
            var name = $(el).find('.line-clamp-1').text().trim();
            var releaseTime = $(el).find('time').attr('datetime') || null;
            chapters.push({
                name: name || "Chapter ".concat(chapterNumber),
                path: href,
                chapterNumber: chapterNumber,
                releaseTime: releaseTime,
            });
            added++;
        });
        return added;
    };
    HangulPlanetPlugin.prototype.parseNovel = function (novelPath) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, $, text, coverSrc, heading, novel, statusText, chapters, seen, foundOnPage1, MAX_PAGES, page, pageText, added;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.fetchPage(this.site + novelPath)];
                    case 1:
                        _a = _b.sent(), $ = _a.$, text = _a.text;
                        coverSrc = $('img.object-cover').first().attr('src');
                        heading = $('h1').first();
                        novel = {
                            path: novelPath,
                            name: heading.text().trim(),
                            author: heading.next('p').text().trim() || undefined,
                            cover: coverSrc ? this.site + coverSrc : defaultCover_1.defaultCover,
                            summary: $('.prose').first().text().trim(),
                            status: novelStatus_1.NovelStatus.Unknown,
                        };
                        statusText = $('span[data-slot="badge"]').first().text().trim();
                        novel.status = statusText.includes('Ongoing')
                            ? novelStatus_1.NovelStatus.Ongoing
                            : statusText.includes('Completed')
                                ? novelStatus_1.NovelStatus.Completed
                                : novelStatus_1.NovelStatus.Unknown;
                        novel.genres = $('a[href*="browse?genre="]')
                            .map(function (_, el) { return $(el).text().trim(); })
                            .get()
                            .join(', ');
                        chapters = [];
                        seen = new Set();
                        foundOnPage1 = this.parseChaptersFromText(novelPath, text, chapters, seen);
                        console.log('chapters found on page 1 (RSC + DOM):', foundOnPage1);
                        MAX_PAGES = 100;
                        page = 2;
                        _b.label = 2;
                    case 2:
                        if (!(page <= MAX_PAGES)) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.fetchPage("".concat(this.site).concat(novelPath, "?cpage=").concat(page))];
                    case 3:
                        pageText = (_b.sent()).text;
                        added = this.parseChaptersFromText(novelPath, pageText, chapters, seen);
                        console.log("cpage=".concat(page, " contributed ").concat(added, " new chapters"));
                        if (added === 0)
                            return [3 /*break*/, 4];
                        page++;
                        return [3 /*break*/, 2];
                    case 4:
                        console.log('total chapter links found:', chapters.length);
                        novel.chapters = chapters.sort(function (a, b) { var _a, _b; return ((_a = a.chapterNumber) !== null && _a !== void 0 ? _a : 0) - ((_b = b.chapterNumber) !== null && _b !== void 0 ? _b : 0); });
                        return [2 /*return*/, novel];
                }
            });
        });
    };
    HangulPlanetPlugin.prototype.parseChapter = function (chapterPath) {
        return __awaiter(this, void 0, void 0, function () {
            var $, content;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getCheerio(this.site + chapterPath)];
                    case 1:
                        $ = _a.sent();
                        content = $('article[data-reader-article="true"] .reader-prose');
                        //Remove the TL/ED credit(annoying for TTS)
                        content
                            .find('p')
                            .first()
                            .each(function (_, el) {
                            if ($(el).text().trim().startsWith('TL/ED')) {
                                $(el).remove();
                            }
                        });
                        return [2 /*return*/, content.html() || ''];
                }
            });
        });
    };
    return HangulPlanetPlugin;
}());
exports.default = new HangulPlanetPlugin();
