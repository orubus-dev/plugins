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
var PuffinFolioPlugin = /** @class */ (function () {
    function PuffinFolioPlugin() {
        var _this = this;
        this.id = 'puffinfolio';
        this.name = 'Puffin Folio';
        this.icon = 'src/en/puffinfolio/icon.png';
        this.site = 'https://www.puffinfolio.com/';
        this.version = '1.0.0';
        this.filters = undefined;
        this.imageRequestInit = undefined;
        this.resolveUrl = function (path) { return _this.site + path.replace(/^\//, ''); };
    }
    PuffinFolioPlugin.prototype.loadPage = function (path) {
        return __awaiter(this, void 0, void 0, function () {
            var response, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, (0, fetch_1.fetchApi)(this.site + path.replace(/^\//, ''))];
                    case 1:
                        response = _b.sent();
                        _a = cheerio_1.load;
                        return [4 /*yield*/, response.text()];
                    case 2: return [2 /*return*/, _a.apply(void 0, [_b.sent()])];
                }
            });
        });
    };
    // Covers are served through next/image, so the real file sits in a url= param.
    PuffinFolioPlugin.prototype.resolveCover = function (raw) {
        if (!raw)
            return defaultCover_1.defaultCover;
        var candidate = raw.trim().split(/\s+/)[0];
        var embedded = candidate.match(/url=([^&]+)/);
        var file = embedded ? decodeURIComponent(embedded[1]) : candidate;
        if (/^https?:\/\//.test(file))
            return file;
        return (this.site.replace(/\/$/, '') + (file.startsWith('/') ? file : '/' + file));
    };
    PuffinFolioPlugin.prototype.novelList = function () {
        return __awaiter(this, void 0, void 0, function () {
            var $, novels;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.loadPage('browse')];
                    case 1:
                        $ = _a.sent();
                        novels = [];
                        $('a[href^="/novel/"]').each(function (_, element) {
                            var _a;
                            var link = $(element);
                            var href = link.attr('href');
                            if (!href || href.includes('/chapter/'))
                                return;
                            var image = link.find('img').first();
                            var name = link.find('h3').first().text().trim() || ((_a = image.attr('alt')) === null || _a === void 0 ? void 0 : _a.trim());
                            if (!name)
                                return;
                            var path = href.replace(/^\//, '');
                            if (novels.some(function (novel) { return novel.path === path; }))
                                return;
                            novels.push({
                                name: name,
                                path: path,
                                cover: _this.resolveCover(image.attr('src') || image.attr('srcset')),
                            });
                        });
                        return [2 /*return*/, novels];
                }
            });
        });
    };
    PuffinFolioPlugin.prototype.popularNovels = function (pageNo) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // The catalogue is small enough to sit on a single browse page.
                if (pageNo > 1)
                    return [2 /*return*/, []];
                return [2 /*return*/, this.novelList()];
            });
        });
    };
    PuffinFolioPlugin.prototype.parseNovel = function (novelPath) {
        return __awaiter(this, void 0, void 0, function () {
            var $, novel, cover, statusText, chapters;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.loadPage(novelPath)];
                    case 1:
                        $ = _b.sent();
                        novel = {
                            path: novelPath,
                            name: $('h1').first().text().trim() || 'Untitled',
                        };
                        cover = $('img[src*="covers"], img[srcset*="covers"]').first();
                        novel.cover = this.resolveCover(cover.attr('src') || cover.attr('srcset'));
                        novel.summary = (_a = $('meta[name="description"]').attr('content')) === null || _a === void 0 ? void 0 : _a.trim();
                        novel.genres = $('a[href^="/browse?tag="]')
                            .map(function (_, element) { return $(element).text().trim(); })
                            .get()
                            .filter(Boolean)
                            .join(',');
                        statusText = $('span')
                            .map(function (_, element) { return $(element).text().trim(); })
                            .get()
                            .find(function (text) { return text === 'Ongoing' || text === 'Completed'; });
                        novel.status =
                            statusText === 'Completed'
                                ? novelStatus_1.NovelStatus.Completed
                                : statusText === 'Ongoing'
                                    ? novelStatus_1.NovelStatus.Ongoing
                                    : novelStatus_1.NovelStatus.Unknown;
                        chapters = [];
                        $('li a[href*="/chapter/"]').each(function (_, element) {
                            var _a;
                            var link = $(element);
                            var href = link.attr('href');
                            if (!href)
                                return;
                            var path = href.replace(/^\//, '');
                            if (chapters.some(function (chapter) { return chapter.path === path; }))
                                return;
                            var time = link.find('time');
                            // Strip the leading chapter-number badge so the name reads "Chapter 7".
                            var label = link.find('span').first().clone();
                            label.find('span').remove();
                            chapters.push({
                                name: label.text().trim() || href.split('/').pop() || '',
                                path: path,
                                releaseTime: time.attr('datetime') || time.attr('title') || null,
                                chapterNumber: Number((_a = href.match(/\/chapter\/(\d+)/)) === null || _a === void 0 ? void 0 : _a[1]) || undefined,
                            });
                        });
                        novel.chapters = chapters.sort(function (a, b) { var _a, _b; return ((_a = a.chapterNumber) !== null && _a !== void 0 ? _a : 0) - ((_b = b.chapterNumber) !== null && _b !== void 0 ? _b : 0); });
                        return [2 /*return*/, novel];
                }
            });
        });
    };
    PuffinFolioPlugin.prototype.parseChapter = function (chapterPath) {
        return __awaiter(this, void 0, void 0, function () {
            var $;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.loadPage(chapterPath)];
                    case 1:
                        $ = _a.sent();
                        return [2 /*return*/, $('.reader-prose').html() || ''];
                }
            });
        });
    };
    PuffinFolioPlugin.prototype.searchNovels = function (searchTerm, pageNo) {
        return __awaiter(this, void 0, void 0, function () {
            var term, novels;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (pageNo > 1)
                            return [2 /*return*/, []];
                        term = searchTerm.toLowerCase();
                        return [4 /*yield*/, this.novelList()];
                    case 1:
                        novels = _a.sent();
                        return [2 /*return*/, novels.filter(function (novel) { return novel.name.toLowerCase().includes(term); })];
                }
            });
        });
    };
    return PuffinFolioPlugin;
}());
exports.default = new PuffinFolioPlugin();
