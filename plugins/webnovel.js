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
var cheerio_1 = require("cheerio");
var fetch_1 = require("@libs/fetch");
var filterInputs_1 = require("@libs/filterInputs");
var storage_1 = require("@libs/storage");
var novelStatus_1 = require("@libs/novelStatus");
var MOBILE_SITE = 'https://m.webnovel.com';
var STATUS = {
    30: novelStatus_1.NovelStatus.Ongoing,
    50: novelStatus_1.NovelStatus.Completed,
};
var grouped = function (n) {
    return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};
/** Same as the site: 82255255 -> "82.2M" (truncated, not rounded) */
var compact = function (n) {
    var units = [
        [1e9, 'B'],
        [1e6, 'M'],
        [1e3, 'K'],
    ];
    for (var _i = 0, units_1 = units; _i < units_1.length; _i++) {
        var _a = units_1[_i], div = _a[0], suffix = _a[1];
        if (n >= div)
            return (Math.floor((n / div) * 10) / 10).toFixed(1) + suffix;
    }
    return grouped(n);
};
var names = function (items) {
    return (items || []).map(function (i) { var _a; return (_a = i.name) === null || _a === void 0 ? void 0 : _a.trim(); }).filter(function (n) { return !!n; });
};
var titleCase = function (s) {
    return s
        .trim()
        .toLowerCase()
        .replace(/(^|\s)\S/g, function (c) { return c.toUpperCase(); });
};
var bookIdOf = function (novelPath) { var _a; return (_a = novelPath.match(/(\d+)\/?$/)) === null || _a === void 0 ? void 0 : _a[1]; };
var delay = function (ms) { return new Promise(function (resolve) { return setTimeout(resolve, ms); }); };
var stat = function (n, format) {
    return typeof n === 'number' && n >= 0 ? format(n) : undefined;
};
var Webnovel = /** @class */ (function () {
    function Webnovel() {
        this.id = 'webnovel';
        this.name = 'Webnovel';
        this.version = '1.1.0';
        this.icon = 'src/en/webnovel/icon.png';
        this.site = 'https://www.webnovel.com';
        this.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        };
        this.imageRequestInit = {
            headers: {
                'referrer': this.site,
            },
        };
        this.hideLocked = storage_1.storage.get('hideLocked');
        this.pluginSettings = {
            hideLocked: {
                value: '',
                label: 'Hide locked chapters',
                type: 'Switch',
            },
        };
        this.filters = {
            sort: {
                label: 'Sort Results By',
                value: '1',
                options: [
                    { label: 'Popular', value: '1' },
                    { label: 'Recommended', value: '2' },
                    { label: 'Most Collections', value: '3' },
                    { label: 'Rating', value: '4' },
                    { label: 'Time Updated', value: '5' },
                ],
                type: filterInputs_1.FilterTypes.Picker,
            },
            status: {
                label: 'Content Status',
                value: '0',
                options: [
                    { label: 'All', value: '0' },
                    { label: 'Completed', value: '2' },
                    { label: 'Ongoing', value: '1' },
                ],
                type: filterInputs_1.FilterTypes.Picker,
            },
            genres_gender: {
                label: 'Genres (Male/Female)',
                value: '1',
                options: [
                    { label: 'Male', value: '1' },
                    { label: 'Female', value: '2' },
                ],
                type: filterInputs_1.FilterTypes.Picker,
            },
            genres_male: {
                label: 'Male Genres',
                value: '1',
                options: [
                    { label: 'All', value: '1' },
                    { label: 'Action', value: 'novel-action-male' },
                    { label: 'Animation, Comics, Games', value: 'novel-acg-male' },
                    { label: 'Eastern', value: 'novel-eastern-male' },
                    { label: 'Fantasy', value: 'novel-fantasy-male' },
                    { label: 'Games', value: 'novel-games-male' },
                    { label: 'History', value: 'novel-history-male' },
                    { label: 'Horror', value: 'novel-horror-male' },
                    { label: 'Realistic', value: 'novel-realistic-male' },
                    { label: 'Sci-fi', value: 'novel-scifi-male' },
                    { label: 'Sports', value: 'novel-sports-male' },
                    { label: 'Urban', value: 'novel-urban-male' },
                    { label: 'War', value: 'novel-war-male' },
                ],
                type: filterInputs_1.FilterTypes.Picker,
            },
            genres_female: {
                label: 'Female Genres',
                value: '2',
                options: [
                    { label: 'All', value: '2' },
                    { label: 'Fantasy', value: 'novel-fantasy-female' },
                    { label: 'General', value: 'novel-general-female' },
                    { label: 'History', value: 'novel-history-female' },
                    { label: 'LGBT+', value: 'novel-lgbt-female' },
                    { label: 'Sci-fi', value: 'novel-scifi-female' },
                    { label: 'Teen', value: 'novel-teen-female' },
                    { label: 'Urban', value: 'novel-urban-female' },
                ],
                type: filterInputs_1.FilterTypes.Picker,
            },
            type: {
                label: 'Content Type',
                value: '0',
                options: [
                    { label: 'All', value: '0' },
                    { label: 'Translate', value: '1' },
                    { label: 'Original', value: '2' },
                    { label: 'MTL (Machine Translation)', value: '3' },
                ],
                type: filterInputs_1.FilterTypes.Picker,
            },
            fanfic_search: {
                label: 'Search fanfics (Overrides other filters)',
                value: '',
                type: filterInputs_1.FilterTypes.TextInput,
            },
        };
    }
    Webnovel.prototype.parseNovels = function (loadedCheerio, category_bool, search_bool) {
        return __awaiter(this, void 0, void 0, function () {
            var selector, attribute;
            return __generator(this, function (_a) {
                selector = category_bool
                    ? '.j_category_wrapper'
                    : search_bool
                        ? '.j_list_container'
                        : '';
                attribute = category_bool
                    ? 'data-original'
                    : search_bool
                        ? 'src'
                        : '';
                return [2 /*return*/, loadedCheerio("".concat(selector, " li"))
                        .map(function (i_, ele) {
                        var novelName = loadedCheerio(ele).find('.g_thumb').attr('title') || 'No Title Found';
                        var novelCover = loadedCheerio(ele)
                            .find('.g_thumb > img')
                            .attr(attribute);
                        var novelPath = loadedCheerio(ele).find('.g_thumb').attr('href');
                        if (!novelPath)
                            return null;
                        return {
                            name: novelName,
                            cover: 'https:' + novelCover,
                            path: novelPath,
                        };
                    })
                        .get()
                        .filter(function (novel) { return novel !== null; })];
            });
        });
    };
    Webnovel.prototype.popularNovels = function (pageNo_1, _a) {
        return __awaiter(this, arguments, void 0, function (pageNo, _b) {
            var url, params, result, body, loadedCheerio;
            var showLatestNovels = _b.showLatestNovels, filters = _b.filters;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (filters === null || filters === void 0 ? void 0 : filters.fanfic_search.value) {
                            return [2 /*return*/, this.searchNovelsInternal(filters.fanfic_search.value, pageNo, 'fanfic')];
                        }
                        url = this.site + '/stories/';
                        params = new URLSearchParams();
                        if (showLatestNovels) {
                            url += "novel?orderBy=5&pageIndex=".concat(pageNo);
                        }
                        else if (filters) {
                            if (filters.genres_gender.value === '1') {
                                if (filters.genres_male.value !== '1') {
                                    url += filters.genres_male.value;
                                }
                                else {
                                    url += 'novel';
                                    params.append('gender', '1');
                                }
                            }
                            else if (filters.genres_gender.value === '2') {
                                if (filters.genres_female.value !== '2') {
                                    url += filters.genres_female.value;
                                }
                                else {
                                    url += 'novel';
                                    params.append('gender', '2');
                                }
                            }
                            if (filters.type.value !== '3') {
                                params.append('sourceType', filters.type.value);
                            }
                            else {
                                params.append('translateMode', '3');
                                params.append('sourceType', '1');
                            }
                            params.append('bookStatus', filters.status.value);
                            params.append('orderBy', filters.sort.value);
                            params.append('pageIndex', pageNo.toString());
                            url += '?' + params.toString();
                        }
                        else {
                            url += "novel?orderBy=1&pageIndex=".concat(pageNo);
                        }
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(url, {
                                headers: this.headers,
                            })];
                    case 1:
                        result = _c.sent();
                        return [4 /*yield*/, result.text()];
                    case 2:
                        body = _c.sent();
                        loadedCheerio = (0, cheerio_1.load)(body);
                        return [2 /*return*/, this.parseNovels(loadedCheerio, true, false)];
                }
            });
        });
    };
    /** Desktop page; retries a Cloudflare "Just a moment" 403 once, then throws */
    Webnovel.prototype.fetchDesktop = function (url) {
        return __awaiter(this, void 0, void 0, function () {
            var status, attempt, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        status = 0;
                        attempt = 0;
                        _a.label = 1;
                    case 1:
                        if (!(attempt < 2)) return [3 /*break*/, 6];
                        if (!attempt) return [3 /*break*/, 3];
                        return [4 /*yield*/, delay(1500)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [4 /*yield*/, (0, fetch_1.fetchApi)(url, { headers: this.headers })];
                    case 4:
                        result = _a.sent();
                        if (result.ok)
                            return [2 /*return*/, result.text()];
                        status = result.status;
                        _a.label = 5;
                    case 5:
                        attempt++;
                        return [3 /*break*/, 1];
                    case 6: throw new Error("Webnovel: HTTP ".concat(status, " for ").concat(url, " (Cloudflare? open the novel in WebView, then retry)"));
                }
            });
        });
    };
    /**
     * Best effort: undefined on Cloudflare blocks, network or parse errors.
     * No User-Agent override: the app's default is the WebView's, so its
     * Cloudflare cookies apply (m.webnovel.com redirects desktop agents).
     */
    Webnovel.prototype.fetchNextData = function (url) {
        return __awaiter(this, void 0, void 0, function () {
            var html, attempt, result, _a, tag, start;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        html = '';
                        attempt = 0;
                        _b.label = 1;
                    case 1:
                        if (!(attempt < 2 && !html)) return [3 /*break*/, 9];
                        if (!attempt) return [3 /*break*/, 3];
                        return [4 /*yield*/, delay(1500)];
                    case 2:
                        _b.sent();
                        _b.label = 3;
                    case 3:
                        _b.trys.push([3, 7, , 8]);
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(url)];
                    case 4:
                        result = _b.sent();
                        if (result.status === 404)
                            return [2 /*return*/, undefined];
                        if (!result.ok) return [3 /*break*/, 6];
                        return [4 /*yield*/, result.text()];
                    case 5:
                        html = _b.sent();
                        _b.label = 6;
                    case 6: return [3 /*break*/, 8];
                    case 7:
                        _a = _b.sent();
                        return [3 /*break*/, 8];
                    case 8:
                        attempt++;
                        return [3 /*break*/, 1];
                    case 9:
                        tag = html.indexOf('id="__NEXT_DATA__"');
                        if (tag < 0)
                            return [2 /*return*/, undefined];
                        start = html.indexOf('>', tag) + 1;
                        try {
                            return [2 /*return*/, JSON.parse(html.slice(start, html.indexOf('</script>', start)))
                                    .props];
                        }
                        catch (_c) {
                            return [2 /*return*/, undefined];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Paths come from the desktop catalog and must not change: the app keys
     * chapters on (novelId, path). Mobile chapters (same ids) add dates.
     */
    Webnovel.prototype.parseChapterList = function (body, mobile) {
        var _this = this;
        var _a, _b;
        var loadedCheerio = (0, cheerio_1.load)(body);
        var mobileChapters = ((_b = (_a = mobile === null || mobile === void 0 ? void 0 : mobile.initialState) === null || _a === void 0 ? void 0 : _a.entities) === null || _b === void 0 ? void 0 : _b.chapter) || {};
        var chapters = [];
        loadedCheerio('.volume-item').each(function (i_v_, ele_v) {
            var _a;
            // "Volume 0 : Auxiliary Volume" or "Volume 1"
            var heading = loadedCheerio(ele_v)
                .find('h4')
                .first()
                .text()
                .replace(/\s+/g, ' ')
                .trim();
            var volumeMatch = heading.match(/^Volume\s*(\d+)\s*(?::\s*(.+))?$/) ||
                loadedCheerio(ele_v)
                    .first()
                    .text()
                    .match(/Volume\s(\d+)/);
            var volumeName = volumeMatch
                ? "Volume ".concat(volumeMatch[1]) +
                    (((_a = volumeMatch[2]) === null || _a === void 0 ? void 0 : _a.trim()) ? ": ".concat(volumeMatch[2].trim()) : '')
                : 'Unknown Volume';
            loadedCheerio(ele_v)
                .find('li')
                .each(function (i_c_, ele_c) {
                var _a, _b;
                var chapterName = "".concat(volumeName, ": ") +
                    (((_a = loadedCheerio(ele_c).find('a').attr('title')) === null || _a === void 0 ? void 0 : _a.trim()) ||
                        'No Title Found');
                var chapterPath = loadedCheerio(ele_c).find('a').attr('href');
                var locked = loadedCheerio(ele_c).find('svg').length;
                var publishTime = (_b = mobileChapters[loadedCheerio(ele_c).attr('data-cid') || '']) === null || _b === void 0 ? void 0 : _b.publishTime;
                if (chapterPath && !(locked && _this.hideLocked)) {
                    chapters.push({
                        name: locked ? "".concat(chapterName, " \uD83D\uDD12") : chapterName,
                        path: chapterPath,
                        // Absolute only: relative dates would change on every refresh
                        releaseTime: publishTime && !isNaN(new Date(publishTime).getTime())
                            ? new Date(publishTime).toISOString()
                            : undefined,
                    });
                }
            });
        });
        return chapters;
    };
    /** Desktop `g_data.book= {...}`: JSON except for escapes like `\ ` */
    Webnovel.prototype.parseGData = function (body) {
        var start = body.indexOf('{', body.indexOf('g_data.book='));
        var end = body.indexOf(',g_data.', start);
        if (body.indexOf('g_data.book=') < 0 || end < 0)
            return undefined;
        try {
            return JSON.parse(body
                .slice(start, end)
                .replace(/\\(["\\/bfnrtu])|\\/g, function (m, valid) { return (valid ? m : ''); })).bookInfo;
        }
        catch (_a) {
            return undefined;
        }
    };
    Webnovel.prototype.parseNovel = function (novelPath) {
        return __awaiter(this, void 0, void 0, function () {
            var catalog, bookId, _a, mobileBook, mobileCatalog, initData, body, _b;
            var _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0: return [4 /*yield*/, this.fetchDesktop(this.site + novelPath + '/catalog')];
                    case 1:
                        catalog = _e.sent();
                        bookId = bookIdOf(novelPath);
                        return [4 /*yield*/, Promise.all([
                                this.fetchNextData(MOBILE_SITE + novelPath),
                                bookId
                                    ? this.fetchNextData("".concat(MOBILE_SITE, "/book/").concat(bookId, "/catalog"))
                                    : undefined,
                            ])];
                    case 2:
                        _a = _e.sent(), mobileBook = _a[0], mobileCatalog = _a[1];
                        initData = (_d = (_c = mobileBook === null || mobileBook === void 0 ? void 0 : mobileBook.initialProps) === null || _c === void 0 ? void 0 : _c.pageProps) === null || _d === void 0 ? void 0 : _d.initData;
                        if (!(initData === null || initData === void 0 ? void 0 : initData.bookInfo)) return [3 /*break*/, 3];
                        _b = '';
                        return [3 /*break*/, 5];
                    case 3: return [4 /*yield*/, this.fetchDesktop(this.site + novelPath)];
                    case 4:
                        _b = _e.sent();
                        _e.label = 5;
                    case 5:
                        body = _b;
                        return [2 /*return*/, __assign(__assign({}, this.buildNovel(novelPath, body, initData)), { chapters: this.parseChapterList(catalog, mobileCatalog) })];
                }
            });
        });
    };
    /** From mobile data, else desktop `g_data`, else desktop HTML */
    Webnovel.prototype.buildNovel = function (novelPath, desktopBody, initData) {
        var _a, _b, _c;
        var book = (initData === null || initData === void 0 ? void 0 : initData.bookInfo) || this.parseGData(desktopBody) || {};
        var tab = initData === null || initData === void 0 ? void 0 : initData.tabInfo;
        var loadedCheerio = (0, cheerio_1.load)(desktopBody);
        var genres = [];
        [book.categoryName]
            .concat((book.tagInfos || []).map(function (t) { return t.tagName; }))
            .forEach(function (genre) {
            var name = genre && titleCase(genre);
            if (name && genres.indexOf(name) < 0)
                genres.push(name);
        });
        var translators = names(book.groupItems).length
            ? names(book.groupItems)
            : names(book.translatorItems);
        var editors = names(book.editorItems).filter(function (n) { return names(book.translatorItems).indexOf(n) < 0; });
        var chapterCount = book.totalChapterNum || book.chapterNum;
        var info = [];
        var add = function (label, value) {
            if (value)
                info.push({ label: label, value: value });
        };
        add('Views', stat(book.pvNum, compact));
        add('Power Stones', stat((_a = tab === null || tab === void 0 ? void 0 : tab.power) === null || _a === void 0 ? void 0 : _a.nums, grouped));
        add('Golden Tickets', stat((_b = tab === null || tab === void 0 ? void 0 : tab.golden) === null || _b === void 0 ? void 0 : _b.nums, grouped));
        add('Chapters', stat(chapterCount, grouped));
        add('Schedule', book.updateFrequency && book.frequencyUnit
            ? "".concat(book.updateFrequency, " ").concat(book.frequencyUnit.replace(/\s*\/\s*/g, '/'))
            : undefined);
        add('Updated', book.updateTime && !isNaN(new Date(book.updateTime).getTime())
            ? new Date(book.updateTime).toISOString().slice(0, 10)
            : undefined);
        add('Translator', translators.join(', '));
        add('Editor', editors.join(', '));
        var htmlStatus = loadedCheerio('.det-hd-detail svg')
            .filter(function (i_, ele) { return loadedCheerio(ele).attr('title') === 'Status'; })
            .next()
            .text()
            .trim();
        var name = book.bookName || loadedCheerio('.g_thumb > img').attr('alt');
        if (!name) {
            throw new Error("Webnovel: no novel data found for ".concat(novelPath));
        }
        var bookId = bookIdOf(novelPath);
        var coverSrc = loadedCheerio('.g_thumb > img').attr('src');
        return {
            path: novelPath,
            name: name,
            cover: bookId && book.coverUpdateTime
                ? "https://book-pic.webnovel.com/bookcover/".concat(bookId, "?imageMogr2/thumbnail/600x&imageId=").concat(book.coverUpdateTime)
                : coverSrc && 'https:' + coverSrc,
            genres: genres.length
                ? genres.join(',')
                : loadedCheerio('.det-hd-detail > .det-hd-tag').attr('title') || '',
            summary: ((_c = book.description) === null || _c === void 0 ? void 0 : _c.replace(/\r\n?/g, '\n').trim()) ||
                loadedCheerio('.j_synopsis > p')
                    .find('br')
                    .replaceWith('\n')
                    .end()
                    .text()
                    .trim() ||
                'No Summary Found',
            author: book.authorName ||
                names(book.authorItems).join(', ') ||
                loadedCheerio('.det-info .c_s')
                    .filter(function (i_, ele) {
                    return loadedCheerio(ele).text().trim() === 'Author:';
                })
                    .next()
                    .text()
                    .trim() ||
                'No Author Found',
            status: (book.actionStatus && STATUS[book.actionStatus]) ||
                htmlStatus ||
                novelStatus_1.NovelStatus.Unknown,
            rating: book.totalScore || undefined,
            ratingCount: book.voters || undefined,
            info: info.length ? info : undefined,
        };
    };
    Webnovel.prototype.parseChapter = function (chapterPath) {
        return __awaiter(this, void 0, void 0, function () {
            var url, result, body, loadedCheerio, bloatElements;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = this.site + chapterPath;
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(url, {
                                headers: this.headers,
                            })];
                    case 1:
                        result = _a.sent();
                        return [4 /*yield*/, result.text()];
                    case 2:
                        body = _a.sent();
                        loadedCheerio = (0, cheerio_1.load)(body);
                        bloatElements = ['.para-comment'];
                        bloatElements.forEach(function (tag) { return loadedCheerio(tag).remove(); });
                        return [2 /*return*/, (loadedCheerio('.cha-tit').html() + loadedCheerio('.cha-words').html())];
                }
            });
        });
    };
    Webnovel.prototype.searchNovels = function (searchTerm, pageNo) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.searchNovelsInternal(searchTerm, pageNo)];
            });
        });
    };
    Webnovel.prototype.searchNovelsInternal = function (searchTerm, pageNo, type) {
        return __awaiter(this, void 0, void 0, function () {
            var url, result, body, loadedCheerio;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        searchTerm = searchTerm.replace(/\s+/g, '+');
                        url = "".concat(this.site, "/search?keywords=").concat(encodeURIComponent(searchTerm), "&pageIndex=").concat(pageNo).concat(type ? "&type=".concat(type) : '');
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(url, {
                                headers: this.headers,
                            })];
                    case 1:
                        result = _a.sent();
                        return [4 /*yield*/, result.text()];
                    case 2:
                        body = _a.sent();
                        loadedCheerio = (0, cheerio_1.load)(body);
                        return [2 /*return*/, this.parseNovels(loadedCheerio, false, true)];
                }
            });
        });
    };
    return Webnovel;
}());
exports.default = new Webnovel();
