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
var cheerio_1 = require("cheerio");
var fetch_1 = require("@libs/fetch");
var filterInputs_1 = require("@libs/filterInputs");
var storage_1 = require("@libs/storage");
var defaultCover_1 = require("@libs/defaultCover");
var novelStatus_1 = require("@libs/novelStatus");
var CrimsonScrollsPlugin = /** @class */ (function () {
    function CrimsonScrollsPlugin() {
        var _this = this;
        this.id = 'crimsonscrolls';
        this.name = 'Crimson Scrolls';
        this.icon = 'src/en/crimsonscrolls/icon.png';
        this.site = 'https://crimsonscrolls.net';
        this.version = '1.1.0';
        this.hideLocked = storage_1.storage.get('hideLocked');
        this.pluginSettings = {
            hideLocked: {
                value: '',
                label: 'Hide locked chapters',
                type: 'Switch',
            },
        };
        this.resolveUrl = function (path, isNovel) {
            if (/^https?:\/\//i.test(path))
                return path;
            if (path.startsWith('//'))
                return "https:".concat(path);
            // Chapters saved by versions before 1.1.0 store only the chapter slug;
            // the site redirects /chapter/<slug>/ to the chapter's current URL.
            return !isNovel && !path.includes('/')
                ? "".concat(_this.site, "/chapter/").concat(path, "/")
                : "".concat(_this.site, "/").concat(path);
        };
        this.filters = {
            sort: {
                type: filterInputs_1.FilterTypes.Picker,
                label: 'Sort by',
                value: 'latest-updated',
                options: [
                    { label: 'Latest Updated', value: 'latest-updated' },
                    { label: 'Newest Added', value: 'newest' },
                    { label: 'Highest Rated', value: 'top-rated' },
                ],
            },
            status: {
                type: filterInputs_1.FilterTypes.Picker,
                label: 'Status',
                value: '',
                options: [
                    { label: 'Any status', value: '' },
                    { label: 'Ongoing', value: 'ongoing' },
                    { label: 'Completed', value: 'completed' },
                    { label: 'On Hiatus', value: 'on-hiatus' },
                    { label: 'Dropped', value: 'dropped' },
                ],
            },
            genres: {
                type: filterInputs_1.FilterTypes.CheckboxGroup,
                label: 'Genres',
                value: [],
                options: [
                    { label: 'Abyssal Villain', value: 'abyssal-villain' },
                    { label: 'Anti-Hero', value: 'anti-hero' },
                    { label: 'Anti-Hero Villain', value: 'anti-hero-villain' },
                    { label: 'Comedy', value: 'comedy' },
                    { label: 'Cultivation', value: 'cultivation' },
                    { label: 'Dark Villain', value: 'dark-villain' },
                    { label: 'Emotional Story', value: 'emotional-story' },
                    { label: 'Fantasy', value: 'fantasy' },
                    { label: 'Harem', value: 'harem' },
                    { label: 'Horror', value: 'horror' },
                    { label: 'Mature', value: 'mature' },
                    { label: 'Misunderstanding', value: 'misunderstanding' },
                    { label: 'Romance', value: 'romance' },
                    { label: 'Sci-Fi', value: 'sci-fi' },
                    { label: 'Slice of Life', value: 'slice-of-life' },
                    { label: 'Tragedy', value: 'tragedy' },
                    { label: 'Urban', value: 'urban' },
                    { label: 'Urban Fantasy', value: 'urban-fantasy' },
                    { label: 'Yandere', value: 'yandere' },
                ],
            },
        };
    }
    CrimsonScrollsPlugin.prototype.fetchPage = function (url) {
        return __awaiter(this, void 0, void 0, function () {
            var body;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, fetch_1.fetchApi)(url).then(function (r) { return r.text(); })];
                    case 1:
                        body = _a.sent();
                        return [2 /*return*/, (0, cheerio_1.load)(body)];
                }
            });
        });
    };
    CrimsonScrollsPlugin.prototype.toPath = function (url) {
        return new URL(url, this.site).pathname.substring(1);
    };
    CrimsonScrollsPlugin.prototype.parseNovels = function (loadedCheerio) {
        var _this = this;
        var novels = [];
        loadedCheerio('article.cs-browse-card').each(function (_, el) {
            var card = loadedCheerio(el);
            var link = card.find('h2 a');
            var novelUrl = link.attr('href');
            if (!novelUrl)
                return;
            var img = card.find('.cs-browse-card__cover img');
            var src = img.attr('data-src') || img.attr('src');
            novels.push({
                name: (link.attr('title') || link.text()).trim(),
                cover: src && !src.startsWith('data:') ? src : defaultCover_1.defaultCover,
                path: _this.toPath(novelUrl),
            });
        });
        return novels;
    };
    CrimsonScrollsPlugin.prototype.browse = function (page, params) {
        return __awaiter(this, void 0, void 0, function () {
            var loadedCheerio;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params.append('cs_page', page.toString());
                        return [4 /*yield*/, this.fetchPage("".concat(this.site, "/novels/?").concat(params.toString()))];
                    case 1:
                        loadedCheerio = _a.sent();
                        return [2 /*return*/, this.parseNovels(loadedCheerio)];
                }
            });
        });
    };
    CrimsonScrollsPlugin.prototype.popularNovels = function (page_1, _a) {
        return __awaiter(this, arguments, void 0, function (page, _b) {
            var params;
            var showLatestNovels = _b.showLatestNovels, filters = _b.filters;
            return __generator(this, function (_c) {
                params = new URLSearchParams({
                    sort: showLatestNovels ? 'latest-updated' : filters.sort.value,
                });
                if (filters.status.value)
                    params.append('status', filters.status.value);
                filters.genres.value.forEach(function (g) { return params.append('genres[]', g); });
                return [2 /*return*/, this.browse(page, params)];
            });
        });
    };
    CrimsonScrollsPlugin.prototype.searchNovels = function (searchTerm, page) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.browse(page, new URLSearchParams({ s: searchTerm }))];
            });
        });
    };
    CrimsonScrollsPlugin.prototype.fetchChapters = function (novelId, tier) {
        return __awaiter(this, void 0, void 0, function () {
            var chapters, page, pages, params, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        chapters = [];
                        page = 1;
                        pages = 1;
                        _a.label = 1;
                    case 1:
                        params = new URLSearchParams({
                            novel_id: novelId,
                            tier: tier,
                            page: page.toString(),
                            per_page: '100',
                            order: 'ASC',
                        });
                        return [4 /*yield*/, (0, fetch_1.fetchApi)("".concat(this.site, "/wp-json/crimsonscrolls/v2/novel-chapters?").concat(params.toString())).then(function (r) { return r.json(); })];
                    case 2:
                        data = _a.sent();
                        chapters.push.apply(chapters, (data.items || []));
                        pages = Number(data.pages) || 1;
                        page++;
                        _a.label = 3;
                    case 3:
                        if (page <= pages) return [3 /*break*/, 1];
                        _a.label = 4;
                    case 4: return [2 /*return*/, chapters];
                }
            });
        });
    };
    CrimsonScrollsPlugin.prototype.parseNovel = function (novelPath) {
        return __awaiter(this, void 0, void 0, function () {
            var loadedCheerio, novelInfo, cover, coverSrc, novel, rawStatus, statusMap, chapterPanel, novelId, tiers, chapters, _loop_1, this_1, _i, tiers_1, tier;
            var _this = this;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.fetchPage("".concat(this.site, "/").concat(novelPath))];
                    case 1:
                        loadedCheerio = _b.sent();
                        novelInfo = loadedCheerio('.cs-novel-info');
                        cover = loadedCheerio('.cs-cover img');
                        coverSrc = cover.attr('data-src') || cover.attr('src');
                        novel = {
                            path: novelPath,
                            name: novelInfo.find('h1').text().trim() || 'Untitled',
                            cover: coverSrc && !coverSrc.startsWith('data:') ? coverSrc : defaultCover_1.defaultCover,
                            summary: loadedCheerio('.cs-synopsis-content p')
                                .map(function (_, el) { return loadedCheerio(el).text().trim(); })
                                .toArray()
                                .filter(function (text) { return text; })
                                .join('\n\n'),
                            author: loadedCheerio('.cs-novel-creator-card--author strong')
                                .first()
                                .text()
                                .trim(),
                            genres: loadedCheerio('.cs-detail-genres a')
                                .map(function (_, el) { return loadedCheerio(el).text().trim(); })
                                .toArray()
                                .join(','),
                            chapters: [],
                        };
                        rawStatus = loadedCheerio('.cs-cover-status')
                            .first()
                            .text()
                            .trim()
                            .toLowerCase();
                        statusMap = {
                            'ongoing': novelStatus_1.NovelStatus.Ongoing,
                            'completed': novelStatus_1.NovelStatus.Completed,
                            'on hiatus': novelStatus_1.NovelStatus.OnHiatus,
                            'hiatus': novelStatus_1.NovelStatus.OnHiatus,
                            'dropped': novelStatus_1.NovelStatus.Cancelled,
                            'cancelled': novelStatus_1.NovelStatus.Cancelled,
                        };
                        novel.status = (_a = statusMap[rawStatus]) !== null && _a !== void 0 ? _a : novelStatus_1.NovelStatus.Unknown;
                        chapterPanel = loadedCheerio('[data-novel-chapters]');
                        novelId = chapterPanel.attr('data-novel-chapters') ||
                            loadedCheerio('main.cs-novel-page').attr('data-view-id');
                        if (!novelId)
                            return [2 /*return*/, novel];
                        tiers = loadedCheerio('[data-chapter-access-tier]')
                            .map(function (_, el) { return loadedCheerio(el).attr('data-chapter-access-tier'); })
                            .toArray()
                            .filter(function (tier) { return tier; });
                        if (!tiers.length)
                            tiers.push(chapterPanel.attr('data-default-tier') || 'free');
                        chapters = [];
                        _loop_1 = function (tier) {
                            var locked, items;
                            return __generator(this, function (_c) {
                                switch (_c.label) {
                                    case 0:
                                        locked = tier !== 'free';
                                        if (locked && this_1.hideLocked)
                                            return [2 /*return*/, "continue"];
                                        return [4 /*yield*/, this_1.fetchChapters(novelId, tier)];
                                    case 1:
                                        items = _c.sent();
                                        items.forEach(function (item) {
                                            var _a;
                                            var title = (_a = item.title) === null || _a === void 0 ? void 0 : _a.trim();
                                            var name = "Chapter ".concat(item.number).concat(title ? ": ".concat(title) : '');
                                            chapters.push({
                                                name: locked ? "\uD83D\uDD12 ".concat(name) : name,
                                                path: _this.toPath(item.url),
                                                releaseTime: item.date || null,
                                                chapterNumber: chapters.length + 1,
                                            });
                                        });
                                        return [2 /*return*/];
                                }
                            });
                        };
                        this_1 = this;
                        _i = 0, tiers_1 = tiers;
                        _b.label = 2;
                    case 2:
                        if (!(_i < tiers_1.length)) return [3 /*break*/, 5];
                        tier = tiers_1[_i];
                        return [5 /*yield**/, _loop_1(tier)];
                    case 3:
                        _b.sent();
                        _b.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 2];
                    case 5:
                        novel.chapters = chapters;
                        return [2 /*return*/, novel];
                }
            });
        });
    };
    CrimsonScrollsPlugin.prototype.parseChapter = function (chapterPath) {
        return __awaiter(this, void 0, void 0, function () {
            var loadedCheerio, content;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.fetchPage(this.resolveUrl(chapterPath, false))];
                    case 1:
                        loadedCheerio = _a.sent();
                        content = loadedCheerio('article.cs-reader');
                        if (content.find('.cs-tier-gate').length) {
                            throw new Error('This chapter is locked. Unlock it on Crimson Scrolls to read it.');
                        }
                        content
                            .find([
                            'header.cs-reader-title',
                            '.cs-chapter-ad',
                            '.cs-copy-watermark',
                            'ins',
                            'script',
                            'style',
                            'noscript',
                            'iframe',
                        ].join(','))
                            .remove();
                        content.find('*').each(function (_, el) {
                            if (!('attribs' in el))
                                return;
                            for (var _i = 0, _a = Object.keys(el.attribs); _i < _a.length; _i++) {
                                var attr = _a[_i];
                                var value = el.attribs[attr].trim().toLowerCase();
                                if (attr.startsWith('on') || value.startsWith('javascript:'))
                                    loadedCheerio(el).removeAttr(attr);
                            }
                        });
                        return [2 /*return*/, content.html() || ''];
                }
            });
        });
    };
    return CrimsonScrollsPlugin;
}());
exports.default = new CrimsonScrollsPlugin();
