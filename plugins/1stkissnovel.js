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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MadaraPlugin = void 0;
var fetch_1 = require("@libs/fetch");
var cheerio_1 = require("cheerio");
var defaultCover_1 = require("@libs/defaultCover");
var novelStatus_1 = require("@libs/novelStatus");
var dayjs_1 = __importDefault(require("dayjs"));
var storage_1 = require("@libs/storage");
var SECOND_REGEX = /detik|segundo|second|วินาที/i;
var MINUTE_REGEX = /menit|dakika|min|minute|minuto|นาที|دقائق/i;
var HOUR_REGEX = /jam|saat|heure|hora|hour|ชั่วโมง|giờ|ore|ساعة|小时/i;
var DAY_REGEX = /hari|gün|jour|día|dia|day|วัน|ngày|giorni|أيام|天/i;
var WEEK_REGEX = /week|semana/i;
var MONTH_REGEX = /month|mes/i;
var YEAR_REGEX = /year|año/i;
var REVERSE_ALPHA = 'zyxwvutsrqponmlkjihgfedcbaZYXWVUTSRQPONMLKJIHGFEDCBA';
var FORWARD_ALPHA = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
var MadaraPlugin = /** @class */ (function () {
    function MadaraPlugin(metadata) {
        var _this = this;
        var _a, _b;
        this.hideLocked = storage_1.storage.get('hideLocked');
        this.dateCache = new Map();
        this.parseData = function (date) {
            var _a;
            var cached = _this.dateCache.get(date);
            if (cached !== undefined)
                return cached;
            if (_this.dateCache.size > 2000)
                _this.dateCache.clear();
            var dayJSDate = (0, dayjs_1.default)(); // today
            var timeAgo = ((_a = date.match(/\d+/)) === null || _a === void 0 ? void 0 : _a[0]) || '';
            var timeAgoInt = parseInt(timeAgo, 10);
            if (!timeAgo) {
                _this.dateCache.set(date, date);
                return date; // there is no number!
            }
            var result;
            if (SECOND_REGEX.test(date)) {
                result = dayJSDate.subtract(timeAgoInt, 'second').format('LL');
            }
            else if (MINUTE_REGEX.test(date)) {
                result = dayJSDate.subtract(timeAgoInt, 'minute').format('LL');
            }
            else if (HOUR_REGEX.test(date)) {
                result = dayJSDate.subtract(timeAgoInt, 'hours').format('LL');
            }
            else if (DAY_REGEX.test(date)) {
                result = dayJSDate.subtract(timeAgoInt, 'days').format('LL');
            }
            else if (WEEK_REGEX.test(date)) {
                result = dayJSDate.subtract(timeAgoInt, 'week').format('LL');
            }
            else if (MONTH_REGEX.test(date)) {
                result = dayJSDate.subtract(timeAgoInt, 'month').format('LL');
            }
            else if (YEAR_REGEX.test(date)) {
                result = dayJSDate.subtract(timeAgoInt, 'year').format('LL');
            }
            else {
                var parsed = (0, dayjs_1.default)(date);
                var formatted = parsed.format('LL');
                result = formatted !== 'Invalid Date' ? formatted : date;
            }
            _this.dateCache.set(date, result);
            return result;
        };
        this.id = metadata.id;
        this.name = metadata.sourceName;
        this.icon = "multisrc/madara/".concat(metadata.id.toLowerCase(), "/icon.png");
        this.site = metadata.sourceSite;
        var versionIncrements = ((_a = metadata.options) === null || _a === void 0 ? void 0 : _a.versionIncrements) || 0;
        this.version = "2.3.".concat(versionIncrements);
        this.options = metadata.options;
        this.filters = metadata.filters;
        if ((_b = this.options) === null || _b === void 0 ? void 0 : _b.hasLocked) {
            this.pluginSettings = {
                hideLocked: {
                    value: '',
                    label: 'Hide locked chapters',
                    type: 'Switch',
                },
            };
        }
    }
    Object.defineProperty(MadaraPlugin.prototype, "requestHeaders", {
        // Opt-in for sites whose bot check rejects fetchApi's wildcard Accept
        // headers (e.g. lovelyblossoms.com, see #2599). The app's User-Agent is
        // left untouched so WebView clearance cookies still match.
        get: function () {
            var _a;
            if (!((_a = this.options) === null || _a === void 0 ? void 0 : _a.browserHeaders))
                return undefined;
            return {
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.9',
            };
        },
        enumerable: false,
        configurable: true
    });
    MadaraPlugin.prototype.translateDragontea = function (text) {
        var _a;
        if (this.id !== 'dragontea')
            return text;
        var $ = (0, cheerio_1.load)(((_a = text
            .html()) === null || _a === void 0 ? void 0 : _a.replace('\n', '').replace(/<br\s*\/?>/g, '\n')) || '');
        text.html($.html());
        text
            .find('*')
            .addBack()
            .contents()
            .filter(function (_, el) { return el.nodeType === 3; })
            .each(function (_, el) {
            var $el = $(el);
            var translated = $el
                .text()
                .normalize('NFD')
                .split('')
                .map(function (char) {
                var base = char.normalize('NFC');
                var idx = FORWARD_ALPHA.indexOf(base);
                return idx >= 0
                    ? REVERSE_ALPHA[idx] + char.slice(base.length)
                    : char;
            })
                .join('');
            $el.replaceWith(translated.replace('\n', '<br>'));
        });
        return text;
    };
    MadaraPlugin.prototype.getHostname = function (url) {
        url = url.split('/')[2];
        var url_parts = url.split('.');
        url_parts.pop(); // remove TLD
        return url_parts.join('.');
    };
    MadaraPlugin.prototype.getCheerio = function (url, search) {
        return __awaiter(this, void 0, void 0, function () {
            var r, text, titleMatch, title;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, fetch_1.fetchApi)(url, { headers: this.requestHeaders })];
                    case 1:
                        r = _a.sent();
                        if (!r.ok && search != true)
                            throw new Error('Could not reach site (' + r.status + ') try to open in webview.');
                        return [4 /*yield*/, r.text()];
                    case 2:
                        text = _a.sent();
                        titleMatch = text.match(/<title[^>]*>([^<]+)<\/title>/i);
                        title = titleMatch ? titleMatch[1].trim() : '';
                        if (this.getHostname(url) != this.getHostname(r.url) ||
                            title == 'Bot Verification' ||
                            title == 'You are being redirected...' ||
                            title == 'Un instant...' ||
                            title == 'Just a moment...' ||
                            title == 'Redirecting...')
                            throw new Error('Captcha error, please open in webview');
                        return [2 /*return*/, (0, cheerio_1.load)(text)];
                }
            });
        });
    };
    MadaraPlugin.prototype.extractCover = function (image) {
        var _a, _b, _c;
        var candidates = [
            image.attr('data-lazy-src'),
            image.attr('data-src'),
            image.attr('data-cfsrc'),
            (_a = image.attr('data-srcset')) === null || _a === void 0 ? void 0 : _a.split(' ')[0],
            (_b = image.attr('data-lazy-srcset')) === null || _b === void 0 ? void 0 : _b.split(' ')[0],
            (_c = image.attr('srcset')) === null || _c === void 0 ? void 0 : _c.split(' ')[0],
            image.attr('src'),
        ];
        for (var _i = 0, candidates_1 = candidates; _i < candidates_1.length; _i++) {
            var candidate = candidates_1[_i];
            if (candidate && !candidate.includes('dflazy')) {
                return candidate;
            }
        }
        return defaultCover_1.defaultCover;
    };
    MadaraPlugin.prototype.parseNovels = function (loadedCheerio) {
        var _this = this;
        var novels = [];
        loadedCheerio('.manga-title-badges').remove();
        loadedCheerio('.page-item-detail, .c-tabs-item__content').each(function (index, element) {
            var $el = loadedCheerio(element);
            var $title = $el.find('.post-title');
            var novelName = $title.text().trim();
            var novelUrl = $title.find('a').attr('href') || '';
            if (!novelName || !novelUrl)
                return;
            var novelCover = _this.extractCover($el.find('img'));
            var novel = {
                name: novelName,
                cover: novelCover,
                path: novelUrl.replace(/https?:\/\/.*?\//, ''),
            };
            novels.push(novel);
        });
        return novels;
    };
    MadaraPlugin.prototype.resolveCoverAsDataUri = function (url) {
        return __awaiter(this, void 0, void 0, function () {
            var timeout, controller_1, res, blob_1, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!url || !url.startsWith('http') || url.startsWith('data:'))
                            return [2 /*return*/, url];
                        timeout = null;
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 5, 6, 7]);
                        controller_1 = typeof AbortController !== 'undefined' ? new AbortController() : null;
                        timeout = controller_1 ? setTimeout(function () { return controller_1.abort(); }, 4000) : null;
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(url, __assign({ headers: this.requestHeaders }, (controller_1 ? { signal: controller_1.signal } : {})))];
                    case 2:
                        res = _b.sent();
                        if (!res.ok)
                            return [2 /*return*/, url];
                        return [4 /*yield*/, res.blob()];
                    case 3:
                        blob_1 = _b.sent();
                        return [4 /*yield*/, new Promise(function (resolve) {
                                var FileReaderClass = typeof FileReader !== 'undefined'
                                    ? FileReader
                                    : globalThis
                                        .FileReader;
                                if (!FileReaderClass)
                                    return resolve(url);
                                var fr = new FileReaderClass();
                                fr.onloadend = function () {
                                    if (typeof fr.result === 'string') {
                                        resolve(fr.result);
                                    }
                                    else {
                                        resolve(url);
                                    }
                                };
                                fr.onerror = function () { return resolve(url); };
                                fr.readAsDataURL(blob_1);
                            })];
                    case 4: return [2 /*return*/, _b.sent()];
                    case 5:
                        _a = _b.sent();
                        return [2 /*return*/, url];
                    case 6:
                        if (timeout)
                            clearTimeout(timeout);
                        return [7 /*endfinally*/];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    MadaraPlugin.prototype.resolveNovelsCovers = function (novels) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!((_a = this.options) === null || _a === void 0 ? void 0 : _a.resolveCoverDataUri))
                            return [2 /*return*/, novels];
                        return [4 /*yield*/, Promise.all(novels.map(function (novel) { return __awaiter(_this, void 0, void 0, function () {
                                var _a;
                                return __generator(this, function (_b) {
                                    switch (_b.label) {
                                        case 0:
                                            if (!(novel.cover && novel.cover.startsWith('http'))) return [3 /*break*/, 2];
                                            _a = novel;
                                            return [4 /*yield*/, this.resolveCoverAsDataUri(novel.cover)];
                                        case 1:
                                            _a.cover = _b.sent();
                                            _b.label = 2;
                                        case 2: return [2 /*return*/];
                                    }
                                });
                            }); }))];
                    case 1:
                        _b.sent();
                        return [2 /*return*/, novels];
                }
            });
        });
    };
    MadaraPlugin.prototype.popularNovels = function (pageNo_1, _a) {
        return __awaiter(this, arguments, void 0, function (pageNo, _b) {
            var baseUrl, url, key, _i, _c, value, loadedCheerio, novels;
            var filters = _b.filters, showLatestNovels = _b.showLatestNovels;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        baseUrl = this.site.replace(/\/+$/, '');
                        url = "".concat(baseUrl, "/page/").concat(pageNo, "/?s=&post_type=wp-manga");
                        if (!filters)
                            filters = this.filters || {};
                        if (showLatestNovels)
                            url += '&m_orderby=latest';
                        for (key in filters) {
                            if (typeof filters[key].value === 'object')
                                for (_i = 0, _c = filters[key].value; _i < _c.length; _i++) {
                                    value = _c[_i];
                                    url += "&".concat(key, "=").concat(value);
                                }
                            else if (filters[key].value)
                                url += "&".concat(key, "=").concat(filters[key].value);
                        }
                        return [4 /*yield*/, this.getCheerio(url, pageNo != 1)];
                    case 1:
                        loadedCheerio = _d.sent();
                        novels = this.parseNovels(loadedCheerio);
                        return [4 /*yield*/, this.resolveNovelsCovers(novels)];
                    case 2: return [2 /*return*/, _d.sent()];
                }
            });
        });
    };
    MadaraPlugin.prototype.parseNovel = function (novelPath) {
        return __awaiter(this, void 0, void 0, function () {
            var baseUrl, cleanPath, novelUrl, loadedCheerio, initialChapterHtmlPromise, chapterEndpointUrl, novel, chapters, html, _a, $firstPage_1, pageLinks, maxPage, lastHref, queryIndex, queryTemplate, pageUrls, page, BATCH_SIZE, i, batch, batchResults, _i, batchResults_1, pageHtml, novelId, formData, chapterElements, totalChapters, defaultDate;
            var _this = this;
            var _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        baseUrl = this.site.replace(/\/+$/, '');
                        cleanPath = novelPath.replace(/^\/+/, '');
                        novelUrl = novelPath.startsWith('http')
                            ? novelPath
                            : "".concat(baseUrl, "/").concat(cleanPath);
                        initialChapterHtmlPromise = null;
                        chapterEndpointUrl = "".concat(novelUrl.replace(/\/+$/, ''), "/ajax/chapters/");
                        if (!((_b = this.options) === null || _b === void 0 ? void 0 : _b.useNewChapterEndpoint)) return [3 /*break*/, 2];
                        initialChapterHtmlPromise = (0, fetch_1.fetchApi)(chapterEndpointUrl, {
                            method: 'POST',
                            headers: this.requestHeaders,
                            referrer: novelUrl,
                        })
                            .then(function (res) { return res.text(); })
                            .catch(function () { return ''; });
                        return [4 /*yield*/, Promise.all([
                                this.getCheerio(novelUrl, false),
                                initialChapterHtmlPromise,
                            ])];
                    case 1:
                        loadedCheerio = (_d.sent())[0];
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, this.getCheerio(novelUrl, false)];
                    case 3:
                        loadedCheerio = _d.sent();
                        _d.label = 4;
                    case 4:
                        loadedCheerio('.manga-title-badges, #manga-title span').remove();
                        novel = {
                            path: novelPath,
                            name: loadedCheerio('.post-title h1').text().trim() ||
                                loadedCheerio('#manga-title h1').text().trim() ||
                                loadedCheerio('.manga-title').text().trim() ||
                                '',
                        };
                        novel.cover = this.extractCover(loadedCheerio('.summary_image > a > img'));
                        loadedCheerio('.post-content_item, .post-content').each(function () {
                            var detailName = loadedCheerio(this).find('h5').text().trim();
                            var detail = loadedCheerio(this).find('.summary-content') ||
                                loadedCheerio(this).find('.summary_content');
                            switch (detailName) {
                                case 'Genre(s)':
                                case 'Genre':
                                case 'Tags(s)':
                                case 'Tag(s)':
                                case 'Tags':
                                case 'Género(s)':
                                case 'Kategori':
                                case 'التصنيفات':
                                    if (novel.genres)
                                        novel.genres +=
                                            ', ' +
                                                detail
                                                    .find('a')
                                                    .map(function (i, el) { return loadedCheerio(el).text(); })
                                                    .get()
                                                    .join(', ');
                                    else
                                        novel.genres = detail
                                            .find('a')
                                            .map(function (i, el) { return loadedCheerio(el).text(); })
                                            .get()
                                            .join(', ');
                                    break;
                                case 'Author(s)':
                                case 'Author':
                                case 'Autor(es)':
                                case 'المؤلف':
                                case 'المؤلف (ين)':
                                    novel.author = detail.text().trim();
                                    break;
                                case 'Translator(s)':
                                case 'Translator':
                                case 'Translators':
                                    if (!novel.author)
                                        novel.author = detail.text().trim();
                                    break;
                                case 'Status':
                                case 'Novel':
                                case 'Estado':
                                case 'Durum':
                                    novel.status =
                                        detail.text().trim().includes('OnGoing') ||
                                            detail.text().trim().includes('مستمرة')
                                            ? novelStatus_1.NovelStatus.Ongoing
                                            : novelStatus_1.NovelStatus.Completed;
                                    break;
                                case 'Artist(s)':
                                    novel.artist = detail.text().trim();
                                    break;
                            }
                        });
                        // Checks for "Madara NovelHub" version
                        {
                            if (!novel.genres)
                                novel.genres = loadedCheerio('.genres-content').text().trim();
                            if (!novel.status)
                                novel.status = loadedCheerio('.manga-status')
                                    .text()
                                    .trim()
                                    .includes('OnGoing')
                                    ? novelStatus_1.NovelStatus.Ongoing
                                    : novelStatus_1.NovelStatus.Completed;
                            if (!novel.author)
                                novel.author = loadedCheerio('.manga-author a').text().trim();
                            if (!novel.rating)
                                novel.rating = parseFloat(loadedCheerio('.post-rating span').text().trim());
                        }
                        if (!novel.author)
                            novel.author = loadedCheerio('.manga-authors').text().trim();
                        loadedCheerio('div.summary__content .code-block,script,noscript').remove();
                        novel.summary =
                            this.translateDragontea(loadedCheerio('div.summary__content'))
                                .text()
                                .trim() ||
                                loadedCheerio('#tab-manga-about').text().trim() ||
                                loadedCheerio('.post-content_item h5:contains("Summary")')
                                    .next()
                                    .find('span')
                                    .map(function (i, el) { return loadedCheerio(el).text(); })
                                    .get()
                                    .join('\n\n')
                                    .trim() ||
                                loadedCheerio('.post-content_item h5:contains("Summary")')
                                    .next()
                                    .find('p')
                                    .map(function (i, el) { return loadedCheerio(el).text(); })
                                    .get()
                                    .join('\n\n')
                                    .trim() ||
                                loadedCheerio('.manga-summary p')
                                    .map(function (i, el) { return loadedCheerio(el).text(); })
                                    .get()
                                    .join('\n\n')
                                    .trim() ||
                                loadedCheerio('.manga-excerpt p')
                                    .map(function (i, el) { return loadedCheerio(el).text(); })
                                    .get()
                                    .join('\n\n')
                                    .trim();
                        chapters = [];
                        html = '';
                        if (!((_c = this.options) === null || _c === void 0 ? void 0 : _c.useNewChapterEndpoint)) return [3 /*break*/, 14];
                        if (!initialChapterHtmlPromise) return [3 /*break*/, 6];
                        return [4 /*yield*/, initialChapterHtmlPromise];
                    case 5:
                        _a = _d.sent();
                        return [3 /*break*/, 7];
                    case 6:
                        _a = '';
                        _d.label = 7;
                    case 7:
                        html =
                            (_a) ||
                                '';
                        if (!!html) return [3 /*break*/, 9];
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(chapterEndpointUrl, {
                                method: 'POST',
                                headers: this.requestHeaders,
                                referrer: novelUrl,
                            })
                                .then(function (res) { return res.text(); })
                                .catch(function () { return ''; })];
                    case 8:
                        html = _d.sent();
                        _d.label = 9;
                    case 9:
                        $firstPage_1 = (0, cheerio_1.load)(html);
                        pageLinks = $firstPage_1('.pagination a[data-page]');
                        if (!(pageLinks.length > 0)) return [3 /*break*/, 13];
                        maxPage = Math.max.apply(Math, pageLinks
                            .map(function (_, el) {
                            return parseInt($firstPage_1(el).attr('data-page') || '1', 10);
                        })
                            .get());
                        lastHref = pageLinks.last().attr('href') || '';
                        queryIndex = lastHref.indexOf('?');
                        if (!(queryIndex !== -1)) return [3 /*break*/, 13];
                        queryTemplate = lastHref.slice(queryIndex).replace(/\d+$/, '');
                        pageUrls = [];
                        for (page = 2; page <= maxPage; page++) {
                            pageUrls.push("".concat(chapterEndpointUrl).concat(queryTemplate).concat(page));
                        }
                        BATCH_SIZE = 6;
                        i = 0;
                        _d.label = 10;
                    case 10:
                        if (!(i < pageUrls.length)) return [3 /*break*/, 13];
                        batch = pageUrls.slice(i, i + BATCH_SIZE);
                        return [4 /*yield*/, Promise.all(batch.map(function (url) {
                                return (0, fetch_1.fetchApi)(url, {
                                    method: 'POST',
                                    headers: _this.requestHeaders,
                                    referrer: novelUrl,
                                })
                                    .then(function (res) { return res.text(); })
                                    .catch(function () { return ''; });
                            }))];
                    case 11:
                        batchResults = _d.sent();
                        for (_i = 0, batchResults_1 = batchResults; _i < batchResults_1.length; _i++) {
                            pageHtml = batchResults_1[_i];
                            if (pageHtml && pageHtml !== '0')
                                html += pageHtml;
                        }
                        _d.label = 12;
                    case 12:
                        i += BATCH_SIZE;
                        return [3 /*break*/, 10];
                    case 13: return [3 /*break*/, 16];
                    case 14:
                        novelId = loadedCheerio('.rating-post-id').attr('value') ||
                            loadedCheerio('#manga-chapters-holder').attr('data-id') ||
                            '';
                        formData = new FormData();
                        formData.append('action', 'manga_get_chapters');
                        formData.append('manga', novelId);
                        return [4 /*yield*/, (0, fetch_1.fetchApi)("".concat(baseUrl, "/wp-admin/admin-ajax.php"), {
                                method: 'POST',
                                headers: this.requestHeaders,
                                body: formData,
                            }).then(function (res) { return res.text(); })];
                    case 15:
                        html = _d.sent();
                        _d.label = 16;
                    case 16:
                        if (html !== '0' && html) {
                            loadedCheerio = (0, cheerio_1.load)(html);
                        }
                        chapterElements = loadedCheerio('.wp-manga-chapter');
                        totalChapters = chapterElements.length;
                        defaultDate = (0, dayjs_1.default)().format('LL');
                        chapterElements.each(function (chapterIndex, element) {
                            var _a;
                            var $el = loadedCheerio(element);
                            var $a = $el.find('a');
                            var chapterUrl = $a.attr('href') || '';
                            if (!chapterUrl || chapterUrl === '#')
                                return;
                            var elementClass = ((_a = element.attribs) === null || _a === void 0 ? void 0 : _a.class) || '';
                            var locked = elementClass.includes('premium-block');
                            if (locked && _this.hideLocked)
                                return;
                            var chapterName = $a.text().trim();
                            if (locked) {
                                chapterName = '🔒 ' + chapterName;
                            }
                            var rawDate = $el.find('span.chapter-release-date').text().trim();
                            var releaseDate = rawDate ? _this.parseData(rawDate) : defaultDate;
                            chapters.push({
                                name: chapterName,
                                path: chapterUrl.replace(/https?:\/\/.*?\//, ''),
                                releaseTime: releaseDate || null,
                                chapterNumber: totalChapters - chapterIndex,
                            });
                        });
                        novel.chapters = chapters.reverse();
                        return [2 /*return*/, novel];
                }
            });
        });
    };
    MadaraPlugin.prototype.parseChapter = function (chapterPath) {
        return __awaiter(this, void 0, void 0, function () {
            var baseUrl, cleanPath, loadedCheerio, chapterText;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        baseUrl = this.site.replace(/\/+$/, '');
                        cleanPath = chapterPath.replace(/^\/+/, '');
                        return [4 /*yield*/, this.getCheerio("".concat(baseUrl, "/").concat(cleanPath), false)];
                    case 1:
                        loadedCheerio = _b.sent();
                        chapterText = loadedCheerio('.text-left');
                        if (!chapterText.length)
                            chapterText = loadedCheerio('.text-right');
                        if (!chapterText.length)
                            chapterText = loadedCheerio('.entry-content');
                        if (!chapterText.length) {
                            chapterText = loadedCheerio('.c-blog-post > div > div:nth-child(2)');
                        }
                        if ((_a = this.options) === null || _a === void 0 ? void 0 : _a.customJs) {
                            try {
                            }
                            catch (error) {
                                console.error('Error executing customJs:', error);
                                throw error;
                            }
                        }
                        return [2 /*return*/, this.translateDragontea(chapterText).html() || ''];
                }
            });
        });
    };
    MadaraPlugin.prototype.searchNovels = function (searchTerm, pageNo) {
        return __awaiter(this, void 0, void 0, function () {
            var baseUrl, url, loadedCheerio, novels;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        baseUrl = this.site.replace(/\/+$/, '');
                        url = "".concat(baseUrl, "/page/").concat(pageNo !== null && pageNo !== void 0 ? pageNo : 1, "/?s=").concat(encodeURIComponent(searchTerm), "&post_type=wp-manga");
                        return [4 /*yield*/, this.getCheerio(url, true)];
                    case 1:
                        loadedCheerio = _a.sent();
                        novels = this.parseNovels(loadedCheerio);
                        return [4 /*yield*/, this.resolveNovelsCovers(novels)];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    return MadaraPlugin;
}());
exports.MadaraPlugin = MadaraPlugin;
var plugin = new MadaraPlugin({ "id": "1stkissnovel", "sourceSite": "https://1stkissnovel.org/", "sourceName": "FirstKissNovel", "options": { "useNewChapterEndpoint": true }, "filters": { "genre[]": { "type": "Checkbox", "label": "Genre", "value": [], "options": [{ "label": "Action", "value": "action" }, { "label": "Adult", "value": "adult" }, { "label": "Adventure", "value": "adventure" }, { "label": "Anime", "value": "anime" }, { "label": "Apocalypse", "value": "apocalypse" }, { "label": "Boy's Love", "value": "boys-love" }, { "label": "Comedy", "value": "comedy" }, { "label": "Completed", "value": "completed" }, { "label": "Cooking", "value": "cooking" }, { "label": "Demons", "value": "demons" }, { "label": "Detective", "value": "detective" }, { "label": "Drama", "value": "drama" }, { "label": "Ecchi", "value": "ecchi" }, { "label": "Fan-Fiction", "value": "fan-fiction" }, { "label": "Fantasy", "value": "fantasy" }, { "label": "Food", "value": "food" }, { "label": "Game", "value": "game" }, { "label": "Gender Bender", "value": "gender-bender" }, { "label": "Girls Love", "value": "girls-love" }, { "label": "Harem", "value": "harem" }, { "label": "Historical", "value": "historical" }, { "label": "Horror", "value": "horror" }, { "label": "Humor", "value": "humor" }, { "label": "Isekai", "value": "isekai" }, { "label": "Josei", "value": "josei" }, { "label": "Magic", "value": "magic" }, { "label": "Magical", "value": "magical" }, { "label": "Manhua", "value": "manhua" }, { "label": "Manhwa", "value": "manhwa" }, { "label": "Martial Arts", "value": "martial-arts" }, { "label": "Mature", "value": "mature" }, { "label": "Mecha", "value": "mecha" }, { "label": "Medical", "value": "medical" }, { "label": "Military", "value": "military" }, { "label": "Moder", "value": "moder" }, { "label": "Modern", "value": "modern" }, { "label": "Murim", "value": "murim" }, { "label": "Music", "value": "music" }, { "label": "Mystery", "value": "mystery" }, { "label": "Psychological", "value": "psychological" }, { "label": "Reverse", "value": "reverse" }, { "label": "Reverse harem", "value": "reverse-harem" }, { "label": "Romance", "value": "romance" }, { "label": "School Life", "value": "school-life" }, { "label": "Sci-fi", "value": "sci-fi" }, { "label": "Seinen", "value": "seinen" }, { "label": "Shoujo", "value": "shoujo" }, { "label": "Shoujo Ai", "value": "shoujo-ai" }, { "label": "Shounen", "value": "shounen" }, { "label": "Shounen Ai", "value": "shounen-ai" }, { "label": "Slice of Life", "value": "slice-of-life" }, { "label": "Smut", "value": "smut" }, { "label": "Sports", "value": "sports" }, { "label": "Super power", "value": "super-power" }, { "label": "Superhero", "value": "superhero" }, { "label": "Supernatural", "value": "supernatural" }, { "label": "Thriller", "value": "thriller" }, { "label": "Tragedy", "value": "tragedy" }, { "label": "Urban Life", "value": "urban-life" }, { "label": "Vampire", "value": "vampire" }, { "label": "Webtoons", "value": "webtoons" }, { "label": "Wuxia", "value": "wuxia" }, { "label": "Xianxia", "value": "xianxia" }, { "label": "Xuanhuan", "value": "xuanhuan" }, { "label": "Yaoi", "value": "yaoi" }, { "label": "Yuri", "value": "yuri" }] }, "op": { "type": "Switch", "label": "having all selected genres", "value": false }, "author": { "type": "Text", "label": "Author", "value": "" }, "artist": { "type": "Text", "label": "Artist", "value": "" }, "release": { "type": "Text", "label": "Year of Released", "value": "" }, "adult": { "type": "Picker", "label": "Adult content", "value": "", "options": [{ "label": "All", "value": "" }, { "label": "None adult content", "value": "0" }, { "label": "Only adult content", "value": "1" }] }, "status[]": { "type": "Checkbox", "label": "Status", "value": [], "options": [{ "label": "OnGoing", "value": "on-going" }, { "label": "Completed", "value": "end" }, { "label": "Canceled", "value": "canceled" }, { "label": "On Hold", "value": "on-hold" }, { "label": "Upcoming", "value": "upcoming" }] }, "m_orderby": { "type": "Picker", "label": "Order by", "value": "", "options": [{ "label": "Relevance", "value": "" }, { "label": "Latest", "value": "latest" }, { "label": "A-Z", "value": "alphabet" }, { "label": "Rating", "value": "rating" }, { "label": "Trending", "value": "trending" }, { "label": "Most Views", "value": "views" }, { "label": "New", "value": "new-manga" }] } } });
exports.default = plugin;
