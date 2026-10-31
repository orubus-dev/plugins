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
exports.ReadNovelFullPlugin = void 0;
var htmlparser2_1 = require("htmlparser2");
var fetch_1 = require("@libs/fetch");
var novelStatus_1 = require("@libs/novelStatus");
var cheerio_1 = require("cheerio");
var ReadNovelFullPlugin = /** @class */ (function () {
    function ReadNovelFullPlugin(metadata) {
        var _a, _b;
        this.lastPage = null;
        this.lastSearch = null;
        this.searchInterval = 3400;
        this.id = metadata.id;
        this.name = metadata.sourceName;
        this.icon = "multisrc/readnovelfull/".concat(metadata.id.toLowerCase(), "/icon.png");
        this.site = metadata.sourceSite;
        var versionIncrements = ((_a = metadata.options) === null || _a === void 0 ? void 0 : _a.versionIncrements) || 0;
        this.version = "2.3.".concat(3 + versionIncrements);
        this.options = metadata.options;
        this.filters = metadata.filters;
        if ((_b = this.options) === null || _b === void 0 ? void 0 : _b.imageReferer) {
            this.imageRequestInit = {
                headers: {
                    'Referer': this.site,
                },
            };
        }
    }
    ReadNovelFullPlugin.prototype.sleep = function (ms) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve) { return setTimeout(resolve, ms); })];
            });
        });
    };
    ReadNovelFullPlugin.prototype.parseNovels = function (html) {
        var _this = this;
        var novels = [];
        var tempNovel = {};
        var depth;
        var listClass = this.options.listClass;
        var isListStart = function (cls) {
            if (!cls)
                return false;
            if (listClass)
                return cls.split(/\s+/).includes(listClass);
            return cls.includes('archive') || cls === 'col-content'; // legacy behaviour
        };
        var stateStack = [ParsingState.Idle];
        var currentState = function () { return stateStack[stateStack.length - 1]; };
        var pushState = function (state) { return stateStack.push(state); };
        var popState = function () {
            return stateStack.length > 1 ? stateStack.pop() : currentState();
        };
        var parser = new htmlparser2_1.Parser({
            onopentag: function (name, attribs) {
                var state = currentState();
                if (isListStart(attribs.class) &&
                    (!listClass || state === ParsingState.Idle)) {
                    pushState(ParsingState.NovelList);
                    depth = 0;
                }
                if (state !== ParsingState.NovelList &&
                    state !== ParsingState.NovelName)
                    return;
                switch (name) {
                    case 'img':
                        {
                            var cover = [
                                attribs['data-src'],
                                attribs['data-cfsrc'],
                                attribs['data-original'],
                                attribs.src,
                            ].find(function (attr) { return attr && !attr.startsWith('data:'); });
                            if (cover) {
                                tempNovel.cover = new URL(cover, _this.site).href;
                            }
                        }
                        break;
                    case 'h3':
                        if (state === ParsingState.NovelList) {
                            pushState(ParsingState.NovelName);
                        }
                        break;
                    case 'a':
                        if (state === ParsingState.NovelName) {
                            var href = attribs.href;
                            if (href) {
                                tempNovel.path = new URL(href, _this.site).pathname.substring(1);
                                tempNovel.name = attribs.title;
                            }
                        }
                        break;
                    case 'div':
                        depth++;
                        break;
                    default:
                        return;
                }
            },
            onclosetag: function (name) {
                var state = currentState();
                if (name === 'a' && state === ParsingState.NovelName) {
                    if (tempNovel.name && tempNovel.path) {
                        novels.push(__assign({}, tempNovel));
                    }
                    tempNovel = {};
                    popState();
                }
                if (name === 'div' && state === ParsingState.NovelList) {
                    depth--;
                    if (depth < 0)
                        popState();
                }
            },
        });
        parser.write(html);
        parser.end();
        return novels;
    };
    // ===========================================================================
    //                              HELPERS (chapter-list pagination)
    // ===========================================================================
    ReadNovelFullPlugin.prototype.parseChapterListFragment = function (html, startIndex) {
        var chapters = [];
        var tempChapter = {};
        var i = startIndex;
        var inChapter = false;
        var parser = new htmlparser2_1.Parser({
            onopentag: function (name, attribs) {
                if (name === 'a' && attribs.href) {
                    i++;
                    inChapter = true;
                    tempChapter.name = attribs.title || "Chapter ".concat(i);
                    tempChapter.releaseTime = null;
                    tempChapter.chapterNumber = i;
                    tempChapter.path = attribs.href.startsWith('/')
                        ? attribs.href.substring(1)
                        : attribs.href;
                }
            },
            onclosetag: function (name) {
                if (name === 'a' && inChapter) {
                    if (tempChapter.name && tempChapter.path) {
                        chapters.push(__assign({}, tempChapter));
                    }
                    tempChapter = {};
                    inChapter = false;
                }
            },
        });
        parser.write(html);
        parser.end();
        return chapters;
    };
    ReadNovelFullPlugin.prototype.fetchAllChaptersViaJsonAjax = function (novelPath) {
        return __awaiter(this, void 0, void 0, function () {
            var pageSize, rateLimitState, first, allChapters, fetchedPages, page, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        pageSize = 40;
                        rateLimitState = { backoffUntil: 0 };
                        return [4 /*yield*/, this.fetchChapterPageWithRetry(novelPath, 1, pageSize, rateLimitState)];
                    case 1:
                        first = _a.sent();
                        if (!first) {
                            return [2 /*return*/, []];
                        }
                        allChapters = __spreadArray([], first.chapters, true);
                        fetchedPages = 1;
                        if (!(first.totalPages > 1)) return [3 /*break*/, 5];
                        page = 2;
                        _a.label = 2;
                    case 2:
                        if (!(page <= first.totalPages)) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.fetchChapterPageWithRetry(novelPath, page, pageSize, rateLimitState)];
                    case 3:
                        result = _a.sent();
                        if (result) {
                            allChapters.push.apply(allChapters, result.chapters);
                            fetchedPages++;
                        }
                        _a.label = 4;
                    case 4:
                        page++;
                        return [3 /*break*/, 2];
                    case 5: return [2 /*return*/, allChapters];
                }
            });
        });
    };
    ReadNovelFullPlugin.prototype.fetchChapterPageWithRetry = function (novelPath, page, pageSize, rateLimitState) {
        return __awaiter(this, void 0, void 0, function () {
            var url, maxAttempts, attempt, waitMs, result, json, chapters, retryAfterHeader, retryAfterMs, cooldownUntil, err_1;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        url = "".concat(this.site).concat(novelPath, "?ajax=chapters&page=").concat(page, "&pageSize=").concat(pageSize);
                        maxAttempts = 3;
                        attempt = 0;
                        _c.label = 1;
                    case 1:
                        if (!(attempt < maxAttempts)) return [3 /*break*/, 14];
                        waitMs = rateLimitState.backoffUntil - Date.now();
                        if (!(waitMs > 0)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.sleep(waitMs)];
                    case 2:
                        _c.sent();
                        _c.label = 3;
                    case 3:
                        _c.trys.push([3, 11, , 13]);
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(url)];
                    case 4:
                        result = _c.sent();
                        if (!result.ok) return [3 /*break*/, 7];
                        return [4 /*yield*/, result.json()];
                    case 5:
                        json = _c.sent();
                        chapters = this.parseChapterListFragment(json.html || '', (page - 1) * pageSize);
                        return [4 /*yield*/, this.sleep(150)];
                    case 6:
                        _c.sent(); // pacing delay — confirmed safe (zero 429s) across multiple runs/novels
                        return [2 /*return*/, { totalPages: json.totalPage || 1, chapters: chapters }];
                    case 7:
                        if (!(result.status === 429)) return [3 /*break*/, 8];
                        retryAfterHeader = (_b = (_a = result.headers) === null || _a === void 0 ? void 0 : _a.get) === null || _b === void 0 ? void 0 : _b.call(_a, 'Retry-After');
                        retryAfterMs = retryAfterHeader
                            ? Number(retryAfterHeader) * 1000
                            : 3000 * (attempt + 1);
                        cooldownUntil = Date.now() + retryAfterMs;
                        // Only extend the cooldown, never shorten it
                        if (cooldownUntil > rateLimitState.backoffUntil) {
                            rateLimitState.backoffUntil = cooldownUntil;
                        }
                        return [3 /*break*/, 10];
                    case 8: return [4 /*yield*/, this.sleep(800 * (attempt + 1))];
                    case 9:
                        _c.sent();
                        _c.label = 10;
                    case 10: return [3 /*break*/, 13];
                    case 11:
                        err_1 = _c.sent();
                        return [4 /*yield*/, this.sleep(800 * (attempt + 1))];
                    case 12:
                        _c.sent();
                        return [3 /*break*/, 13];
                    case 13:
                        attempt++;
                        return [3 /*break*/, 1];
                    case 14: return [2 /*return*/, null];
                }
            });
        });
    };
    // ============================================================================================
    ReadNovelFullPlugin.prototype.popularNovels = function (pageNo_1, _a) {
        return __awaiter(this, arguments, void 0, function (pageNo, _b) {
            var _c, _d, pageParam, novelListing, _e, typeParam, latestPage, _f, genreParam, _g, genreKey, langParam, urlLangCode, _h, noPages, _j, pageAsPath, url, params, basePage, result, html, novels, paths, prev;
            var filters = _b.filters, showLatestNovels = _b.showLatestNovels;
            return __generator(this, function (_k) {
                switch (_k.label) {
                    case 0:
                        _c = this.options, _d = _c.pageParam, pageParam = _d === void 0 ? 'page' : _d, novelListing = _c.novelListing, _e = _c.typeParam, typeParam = _e === void 0 ? 'type' : _e, latestPage = _c.latestPage, _f = _c.genreParam, genreParam = _f === void 0 ? 'category_novel' : _f, _g = _c.genreKey, genreKey = _g === void 0 ? 'id' : _g, langParam = _c.langParam, urlLangCode = _c.urlLangCode, _h = _c.noPages, noPages = _h === void 0 ? [] : _h, _j = _c.pageAsPath, pageAsPath = _j === void 0 ? false : _j;
                        // Skip Pagination for FWN & LR
                        if (pageNo !== 1 &&
                            !showLatestNovels &&
                            !filters.genres.value.length &&
                            noPages.length > 0 &&
                            noPages.includes(filters.type.value)) {
                            return [2 /*return*/, []];
                        }
                        url = '';
                        if (novelListing) {
                            params = new URLSearchParams();
                            if (showLatestNovels) {
                                params.append(typeParam, latestPage);
                            }
                            else if (filters.genres.value.length) {
                                params.append(typeParam, genreParam);
                                params.append(genreKey, filters.genres.value);
                            }
                            else {
                                params.append(typeParam, filters.type.value);
                            }
                            // Add language parameter if specified
                            if (langParam && urlLangCode) {
                                params.append(langParam, urlLangCode);
                            }
                            params.append(pageParam, pageNo.toString());
                            url = "".concat(this.site).concat(novelListing, "?").concat(params.toString());
                        }
                        else {
                            basePage = showLatestNovels
                                ? latestPage
                                : filters.genres.value.length
                                    ? filters.genres.value
                                    : filters.type.value;
                            if (pageAsPath) {
                                if (pageNo > 1) {
                                    url = "".concat(this.site).concat(basePage, "/").concat(pageNo.toString());
                                }
                                else {
                                    url = "".concat(this.site).concat(basePage);
                                }
                            }
                            else {
                                url = "".concat(this.site).concat(basePage, "?").concat(pageParam, "=").concat(pageNo.toString());
                            }
                        }
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(url)];
                    case 1:
                        result = _k.sent();
                        if (!result.ok) {
                            throw new Error("Could not reach site (".concat(result.status, ": ").concat(result.statusText, ") try to open in webview."));
                        }
                        return [4 /*yield*/, result.text()];
                    case 2:
                        html = _k.sent();
                        novels = this.parseNovels(html);
                        paths = novels.map(function (n) { return n.path; });
                        prev = this.lastPage;
                        if (prev &&
                            pageNo > prev.no &&
                            prev.paths.length === paths.length &&
                            prev.paths.every(function (p, i) { return p === paths[i]; })) {
                            return [2 /*return*/, []];
                        }
                        this.lastPage = { no: pageNo, paths: paths };
                        return [2 /*return*/, novels];
                }
            });
        });
    };
    ReadNovelFullPlugin.prototype.parseNovel = function (novelPath) {
        return __awaiter(this, void 0, void 0, function () {
            var url, result, body, novel, summaryParts, statusParts, authorParts, genreArray, infoParts, chapters, novelId, totalChapter, novelTitle, tempChapter, i, depth, stateStack, currentState, pushState, popState, parser, _a, chapterListing, ajaxParam, params, chaptersUrl, fetchOptions, ajaxResult, ajaxBody, ajaxHtml, json, ajaxChapters_1, tempAjaxChapter_1, ajaxParser;
            var _b;
            var _this = this;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        url = this.site + novelPath;
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(url)];
                    case 1:
                        result = _c.sent();
                        if (!result.ok) {
                            throw new Error(result.status === 404
                                ? 'Novel not found (404), it may have been removed from this source.'
                                : "Could not reach site (".concat(result.status, ": ").concat(result.statusText, ") try to open in webview."));
                        }
                        return [4 /*yield*/, result.text()];
                    case 2:
                        body = _c.sent();
                        novel = {
                            path: novelPath,
                            chapters: [],
                        };
                        summaryParts = [];
                        statusParts = [];
                        authorParts = [];
                        genreArray = [];
                        infoParts = [];
                        chapters = [];
                        novelId = null;
                        totalChapter = null;
                        novelTitle = null;
                        tempChapter = {};
                        i = 0;
                        stateStack = [ParsingState.Idle];
                        currentState = function () { return stateStack[stateStack.length - 1]; };
                        pushState = function (state) { return stateStack.push(state); };
                        popState = function () {
                            return stateStack.length > 1 ? stateStack.pop() : currentState();
                        };
                        parser = new htmlparser2_1.Parser({
                            onopentag: function (name, attribs) {
                                var _a, _b, _c;
                                var state = currentState();
                                switch (name) {
                                    case 'div':
                                        switch (attribs.class) {
                                            case 'books':
                                            case 'm-imgtxt':
                                                pushState(ParsingState.Cover);
                                                return;
                                            case 'inner':
                                            case 'desc-text':
                                            case 'desc-text desc-text-collapsed':
                                                if (state === ParsingState.Cover)
                                                    popState();
                                                pushState(ParsingState.Summary);
                                                break;
                                            case 'info':
                                                pushState(ParsingState.Info);
                                                depth = 0;
                                                break;
                                        }
                                        if (!_this.options.noAjax && attribs.id === 'rating') {
                                            novelId = attribs['data-novel-id'];
                                        }
                                        if (attribs.id === 'indexListPage') {
                                            novelId = attribs['data-novel-id'];
                                            totalChapter = Number(attribs['data-total-chapters']);
                                        }
                                        if (state === ParsingState.Info)
                                            depth++;
                                        break;
                                    case 'img':
                                        if (state === ParsingState.Cover) {
                                            var cover = [
                                                attribs['data-src'],
                                                attribs['data-cfsrc'],
                                                attribs['data-original'],
                                                attribs.src,
                                            ].find(function (attr) { return attr && !attr.startsWith('data:'); });
                                            var name_1 = attribs.title;
                                            if (cover) {
                                                novel.cover = new URL(cover, _this.site).href;
                                            }
                                            if (name_1) {
                                                novel.name = name_1;
                                            }
                                            else {
                                                popState();
                                            }
                                        }
                                        break;
                                    case 'h3':
                                        if (state === ParsingState.Cover) {
                                            pushState(ParsingState.NovelName);
                                        }
                                        break;
                                    case 'span':
                                        if (state === ParsingState.Cover && attribs.title) {
                                            var newState = {
                                                'Genre': ParsingState.Genres,
                                                'Author': ParsingState.Author,
                                                'Status': ParsingState.Status,
                                            }[attribs.title];
                                            if (newState)
                                                pushState(newState);
                                        }
                                        if ((_a = attribs.class) === null || _a === void 0 ? void 0 : _a.includes('disqus')) {
                                            novelTitle = attribs['data-disqus-identifier'];
                                        }
                                        break;
                                    case 'br':
                                        if (state === ParsingState.Summary) {
                                            summaryParts.push('\n');
                                        }
                                        break;
                                    case 'ul':
                                        if ((_b = attribs.class) === null || _b === void 0 ? void 0 : _b.includes('info-meta')) {
                                            pushState(ParsingState.Info);
                                        }
                                        if (_this.options.noAjax && attribs.id === 'idData') {
                                            pushState(ParsingState.ChapterList);
                                        }
                                        break;
                                    case 'a':
                                        if ((_c = attribs.class) === null || _c === void 0 ? void 0 : _c.includes('set-case')) {
                                            novelId = attribs['data-articleid'];
                                        }
                                        if (state === ParsingState.ChapterList) {
                                            i++;
                                            var href = attribs.href;
                                            pushState(ParsingState.Chapter);
                                            tempChapter.name = attribs.title || "Chapter ".concat(i);
                                            tempChapter.releaseTime = null;
                                            tempChapter.chapterNumber = i;
                                            tempChapter.path =
                                                (href === null || href === void 0 ? void 0 : href.substring(1)) ||
                                                    novelPath.replace('.html', "/chapter-".concat(i, ".html"));
                                        }
                                        break;
                                    case 'script':
                                        pushState(ParsingState.Hidden);
                                        break;
                                }
                            },
                            ontext: function (data) {
                                var text = data.trim();
                                if (!text)
                                    return;
                                switch (currentState()) {
                                    case ParsingState.NovelName:
                                        novel.name = (novel.name || '') + text;
                                        break;
                                    case ParsingState.Summary:
                                        summaryParts.push(data);
                                        break;
                                    case ParsingState.Info:
                                        infoParts.push(text);
                                        break;
                                    case ParsingState.Genres:
                                        genreArray.push(data);
                                        break;
                                    case ParsingState.Author:
                                        authorParts.push(data);
                                        break;
                                    case ParsingState.Status:
                                        statusParts.push(text);
                                        break;
                                    case ParsingState.Hidden:
                                        if (text.includes('window.chapterPagination')) {
                                            totalChapter = Number(text.match(/totalChapters:\s*(\d+)/)[1]);
                                        }
                                        else if (text.includes('sourceid')) {
                                            novelId = text.match(/sourceid=(\d+)/)[1];
                                        }
                                }
                            },
                            onclosetag: function (name) {
                                var state = currentState();
                                switch (name) {
                                    case 'div':
                                        switch (state) {
                                            case ParsingState.Info:
                                                depth--;
                                                infoParts.push('\n');
                                                if (depth < 0) {
                                                    popState();
                                                }
                                                break;
                                            case ParsingState.Genres:
                                            case ParsingState.Author:
                                            case ParsingState.Status:
                                            case ParsingState.Summary:
                                                popState();
                                                break;
                                        }
                                        break;
                                    case 'h3':
                                        if (state === ParsingState.NovelName) {
                                            popState();
                                        }
                                        break;
                                    case 'a':
                                        if (state === ParsingState.Chapter) {
                                            if (tempChapter.name && tempChapter.path) {
                                                chapters.push(__assign({}, tempChapter));
                                            }
                                            tempChapter = {};
                                            popState();
                                        }
                                        break;
                                    case 'li':
                                        if (state === ParsingState.Info) {
                                            infoParts.push('\n');
                                        }
                                        break;
                                    case 'ul':
                                        switch (state) {
                                            case ParsingState.Info:
                                            case ParsingState.ChapterList:
                                                popState();
                                                break;
                                        }
                                        break;
                                    case 'script':
                                        if (state === ParsingState.Hidden)
                                            popState();
                                        break;
                                    default:
                                        return;
                                }
                            },
                            onend: function () {
                                if (infoParts.length) {
                                    // Split into lines by the '\n' tokens, keeping each line's
                                    // text nodes separate: joining them first would glue
                                    // multi-element values (e.g. genre chips) into one blob.
                                    var lines = [];
                                    var currentLine = [];
                                    for (var _i = 0, infoParts_1 = infoParts; _i < infoParts_1.length; _i++) {
                                        var part = infoParts_1[_i];
                                        if (part === '\n') {
                                            lines.push(currentLine);
                                            currentLine = [];
                                        }
                                        else {
                                            currentLine.push(part);
                                        }
                                    }
                                    if (currentLine.length)
                                        lines.push(currentLine);
                                    lines.forEach(function (tokens) {
                                        var _a, _b;
                                        var line = tokens.join('').trim();
                                        if (!line.includes(':'))
                                            return;
                                        var colonIdx = line.indexOf(':');
                                        var detailName = line.slice(0, colonIdx).trim().toLowerCase();
                                        var rest = line.slice(colonIdx + 1);
                                        var detail;
                                        if (detailName === 'genre') {
                                            // Genre chips arrive as separate text nodes; keep them
                                            // as separate items instead of gluing them together.
                                            var labelIdx = tokens.findIndex(function (t) { return t.includes(':'); });
                                            var labelToken = (_a = tokens[labelIdx]) !== null && _a !== void 0 ? _a : '';
                                            var labelRest = labelToken
                                                .slice(labelToken.indexOf(':') + 1)
                                                .trim();
                                            var items = __spreadArray(__spreadArray([], (labelRest
                                                ? labelRest
                                                    .split(',')
                                                    .map(function (g) { return g.trim(); })
                                                    .filter(Boolean)
                                                : []), true), tokens
                                                .slice(labelIdx + 1)
                                                .map(function (t) { return t.trim(); })
                                                .filter(Boolean), true);
                                            detail = items.join(', ');
                                        }
                                        else {
                                            detail = rest
                                                .split(',')
                                                .map(function (g) { return g.trim(); })
                                                .join(', ');
                                        }
                                        switch (detailName) {
                                            case 'author':
                                                novel.author = detail;
                                                break;
                                            case 'genre':
                                                novel.genres = detail;
                                                break;
                                            case 'status':
                                                {
                                                    var map = {
                                                        ongoing: novelStatus_1.NovelStatus.Ongoing,
                                                        hiatus: novelStatus_1.NovelStatus.OnHiatus,
                                                        dropped: novelStatus_1.NovelStatus.Cancelled,
                                                        cancelled: novelStatus_1.NovelStatus.Cancelled,
                                                        completed: novelStatus_1.NovelStatus.Completed,
                                                    };
                                                    novel.status =
                                                        (_b = map[detail.toLowerCase()]) !== null && _b !== void 0 ? _b : novelStatus_1.NovelStatus.Unknown;
                                                }
                                                break;
                                            default:
                                                return;
                                        }
                                    });
                                    if (!novelId) {
                                        var idMatch = novelPath.match(/\d+/);
                                        novelId = idMatch ? idMatch[0] : null;
                                    }
                                }
                                else {
                                    novel.genres = genreArray
                                        .map(function (g) { return g.trim(); })
                                        .filter(Boolean)
                                        .join(', ');
                                    novel.author = authorParts.join('').trim();
                                    novel.status = statusParts
                                        .join('')
                                        .toLowerCase()
                                        .replace(/\b\w/g, function (char) { return char.toUpperCase(); });
                                }
                                novel.summary = summaryParts.join('\n\n').trim();
                            },
                        });
                        parser.write(body);
                        parser.end();
                        if (!this.options.chapterListPaginated) return [3 /*break*/, 4];
                        _a = novel;
                        return [4 /*yield*/, this.fetchAllChaptersViaJsonAjax(novelPath)];
                    case 3:
                        _a.chapters = _c.sent();
                        return [3 /*break*/, 9];
                    case 4:
                        if (!(this.options.noAjax && chapters.length > 0 && !totalChapter)) return [3 /*break*/, 5];
                        novel.chapters = chapters;
                        return [3 /*break*/, 9];
                    case 5:
                        if (!(novelId !== null)) return [3 /*break*/, 9];
                        chapterListing = this.options.chapterListing || 'ajax/chapter-archive';
                        ajaxParam = this.options.chapterParam || 'novelId';
                        params = new URLSearchParams((_b = {}, _b[ajaxParam] = novelId, _b));
                        chaptersUrl = void 0;
                        fetchOptions = void 0;
                        if (totalChapter) {
                            chaptersUrl = "".concat(this.site).concat(chapterListing);
                            params.set('acode', novelTitle || novelPath.split('/').pop());
                            params.set('cid', String(Math.floor(Math.random() * totalChapter)));
                            fetchOptions = {
                                method: 'POST',
                                body: params.toString(),
                                headers: {
                                    'Content-Type': 'application/x-www-form-urlencoded',
                                    'X-Requested-With': 'XMLHttpRequest',
                                },
                            };
                        }
                        else {
                            chaptersUrl = "".concat(this.site).concat(chapterListing, "?").concat(params.toString());
                        }
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(chaptersUrl, fetchOptions)];
                    case 6:
                        ajaxResult = _c.sent();
                        if (!!ajaxResult.ok) return [3 /*break*/, 7];
                        console.error("Failed to fetch chapters: ".concat(ajaxResult.status));
                        novel.chapters = [];
                        return [3 /*break*/, 9];
                    case 7: return [4 /*yield*/, ajaxResult.text()];
                    case 8:
                        ajaxBody = _c.sent();
                        ajaxHtml = ajaxBody;
                        try {
                            json = JSON.parse(ajaxBody);
                            if (typeof json.html === 'string') {
                                ajaxHtml = json.html;
                            }
                        }
                        catch (_d) {
                            // eslint
                        }
                        ajaxChapters_1 = [];
                        tempAjaxChapter_1 = {};
                        ajaxParser = new htmlparser2_1.Parser({
                            onopentag: function (name, attribs) {
                                var chapterHref;
                                var initialName;
                                if (name === 'a' && attribs.href) {
                                    chapterHref = attribs.href;
                                    initialName = attribs.title || '';
                                    pushState(ParsingState.Chapter);
                                }
                                else if (name === 'option' && attribs.value) {
                                    chapterHref = attribs.value;
                                    initialName = '';
                                    pushState(ParsingState.Chapter);
                                }
                                if (chapterHref !== undefined) {
                                    var path = new URL(chapterHref, _this.site).pathname.substring(1);
                                    tempAjaxChapter_1.path = path;
                                    tempAjaxChapter_1.name = initialName;
                                }
                            },
                            ontext: function (data) {
                                var text = data.trim();
                                if (currentState() === ParsingState.Chapter &&
                                    !tempAjaxChapter_1.name &&
                                    text) {
                                    tempAjaxChapter_1.name += text;
                                }
                            },
                            onclosetag: function (name) {
                                if ((name === 'a' || name === 'option') &&
                                    currentState() === ParsingState.Chapter) {
                                    if (tempAjaxChapter_1.name && tempAjaxChapter_1.path) {
                                        tempAjaxChapter_1.name = tempAjaxChapter_1.name.trim();
                                        tempAjaxChapter_1.releaseTime = null;
                                        ajaxChapters_1.push(__assign({}, tempAjaxChapter_1));
                                    }
                                    tempAjaxChapter_1 = {};
                                    popState();
                                }
                            },
                        });
                        ajaxParser.write(ajaxHtml);
                        ajaxParser.end();
                        novel.chapters = ajaxChapters_1;
                        _c.label = 9;
                    case 9: return [2 /*return*/, novel];
                }
            });
        });
    };
    ReadNovelFullPlugin.prototype.parseChapter = function (chapterPath) {
        return __awaiter(this, void 0, void 0, function () {
            var response, html, $, depth, depthHide, chapterHtml, skipClosingTag, currentTagToSkip, stateStack, currentState, pushState, popState, escapeMap, escapeHtml, parser;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, (0, fetch_1.fetchApi)(this.site + chapterPath)];
                    case 1:
                        response = _b.sent();
                        if (!response.ok) {
                            throw new Error(response.status === 404
                                ? 'Chapter not found (404), it may have been removed from this source.'
                                : "Could not reach site (".concat(response.status, ": ").concat(response.statusText, ") try to open in webview."));
                        }
                        return [4 /*yield*/, response.text()];
                    case 2:
                        html = _b.sent();
                        if ((_a = this.options) === null || _a === void 0 ? void 0 : _a.customJs) {
                            try {
                                $ = (0, cheerio_1.load)(html);
                                $('[class*="app-promo"]').remove();
                                html = $.html();
                            }
                            catch (error) {
                                console.error('Error executing customJs:', error);
                                throw error;
                            }
                        }
                        chapterHtml = [];
                        skipClosingTag = false;
                        currentTagToSkip = '';
                        stateStack = [ParsingState.Idle];
                        currentState = function () { return stateStack[stateStack.length - 1]; };
                        pushState = function (state) { return stateStack.push(state); };
                        popState = function () {
                            return stateStack.length > 1 ? stateStack.pop() : currentState();
                        };
                        escapeMap = {
                            '&': '&amp;',
                            '<': '&lt;',
                            '>': '&gt;',
                            '"': '&quot;',
                            "'": '&#39;',
                            ' ': '&nbsp;',
                            '\u200C': '', // this is probably a breaking change, report if paragraphs look weird
                        };
                        escapeHtml = function (text) {
                            return text.replace(/[&<>"'\xA0\u200C]/g, function (char) { return escapeMap[char]; });
                        };
                        parser = new htmlparser2_1.Parser({
                            onopentag: function (name, attribs) {
                                var _a;
                                var state = currentState();
                                var attrib = (_a = attribs.class) === null || _a === void 0 ? void 0 : _a.trim();
                                switch (state) {
                                    case ParsingState.Idle:
                                        if (attrib === 'txt' ||
                                            attribs.id === 'chr-content' ||
                                            attribs.id === 'chapter-content') {
                                            pushState(ParsingState.Chapter);
                                            depth = 0;
                                        }
                                        break;
                                    case ParsingState.Chapter:
                                        if (name === 'sub' || name === 'iframe') {
                                            pushState(ParsingState.Hidden);
                                        }
                                        else if (name === 'div') {
                                            depth++;
                                            if ((attrib === null || attrib === void 0 ? void 0 : attrib.includes('unlock-buttons')) ||
                                                (attrib === null || attrib === void 0 ? void 0 : attrib.includes('ads'))) {
                                                pushState(ParsingState.Hidden);
                                                depthHide = 0;
                                            }
                                        }
                                        break;
                                    case ParsingState.Hidden:
                                        if (name === 'sub') {
                                            // Allow nesting of hidden states if a sub is inside a div
                                            pushState(ParsingState.Hidden);
                                        }
                                        else if (name === 'div') {
                                            depthHide++;
                                        }
                                        break;
                                    default:
                                        return;
                                }
                                if (currentState() === ParsingState.Chapter) {
                                    var attrKeys = Object.keys(attribs);
                                    if (attrKeys.length === 0) {
                                        chapterHtml.push("<".concat(name, ">"));
                                    }
                                    else if (attrKeys.every(function (key) { return attribs[key].trim() === ''; })) {
                                        // Handle tags with empty attributes as text content
                                        // eg: novel/rising-up-from-a-nobleman-to-intergalactic-warlord/chapter-184
                                        skipClosingTag = true;
                                        currentTagToSkip = name;
                                        var uppercaseName = name.replace(/\b\w/g, function (char) {
                                            return char.toUpperCase();
                                        });
                                        chapterHtml.push(escapeHtml("<".concat(uppercaseName, " ").concat(attrKeys.join(' '), ">")));
                                    }
                                    else {
                                        // Normal tag with attributes
                                        var attrString = attrKeys
                                            .map(function (key) { return " ".concat(key, "=\"").concat(attribs[key].replace(/"/g, '&quot;'), "\""); })
                                            .join('');
                                        chapterHtml.push("<".concat(name).concat(attrString, ">"));
                                    }
                                }
                            },
                            ontext: function (text) {
                                if (currentState() === ParsingState.Chapter) {
                                    var data = escapeHtml(text);
                                    chapterHtml.push(data.trim().replace(/\s\s+/, ' '));
                                }
                            },
                            onclosetag: function (name) {
                                var state = currentState();
                                if (state === ParsingState.Hidden) {
                                    if (name === 'sub' || name === 'iframe') {
                                        popState();
                                    }
                                    else if (name === 'div') {
                                        depthHide--;
                                        if (depthHide < 0) {
                                            popState();
                                            depth--;
                                        }
                                    }
                                }
                                if (state !== ParsingState.Chapter) {
                                    return;
                                }
                                if (!parser['isVoidElement'](name)) {
                                    if (skipClosingTag && name === currentTagToSkip) {
                                        skipClosingTag = false;
                                        currentTagToSkip = '';
                                    }
                                    else {
                                        chapterHtml.push("</".concat(name, ">"));
                                    }
                                }
                                if (name === 'div') {
                                    depth--;
                                    if (depth < 0) {
                                        pushState(ParsingState.Stopped);
                                    }
                                }
                            },
                        });
                        parser.write(html);
                        parser.end();
                        return [2 /*return*/, chapterHtml.join('')];
                }
            });
        });
    };
    ReadNovelFullPlugin.prototype.searchNovels = function (searchTerm, page) {
        return __awaiter(this, void 0, void 0, function () {
            var now, _a, _b, pageParam, _c, searchKey, postSearch, langParam, urlLangCode, searchPage, params, url, fetchOptions, result, html, alertText;
            var _d, _e, _f;
            var _g;
            return __generator(this, function (_h) {
                switch (_h.label) {
                    case 0:
                        now = Date.now();
                        if (!(this.lastSearch && now - this.lastSearch <= this.searchInterval)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.sleep(this.searchInterval)];
                    case 1:
                        _h.sent();
                        _h.label = 2;
                    case 2:
                        _a = this.options, _b = _a.pageParam, pageParam = _b === void 0 ? 'page' : _b, _c = _a.searchKey, searchKey = _c === void 0 ? 'keyword' : _c, postSearch = _a.postSearch, langParam = _a.langParam, urlLangCode = _a.urlLangCode, searchPage = _a.searchPage;
                        params = new URLSearchParams(__assign(__assign((_d = {}, _d[searchKey] = searchTerm, _d), (langParam && urlLangCode && (_e = {}, _e[langParam] = urlLangCode, _e))), (!postSearch && (_f = {}, _f[pageParam] = page.toString(), _f))));
                        url = "".concat(this.site).concat(searchPage).concat(!postSearch ? "?".concat(params.toString()) : '');
                        fetchOptions = postSearch
                            ? {
                                method: 'POST',
                                body: params.toString(),
                                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                            }
                            : undefined;
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(url, fetchOptions)];
                    case 3:
                        result = _h.sent();
                        this.lastSearch = Date.now();
                        // Some sites (e.g. novelfull.com) return 404 for pages past the last one
                        if (result.status === 404 && page > 1)
                            return [2 /*return*/, []];
                        if (!result.ok) {
                            throw new Error("Could not reach site ('".concat(result.status, "') try to open in webview."));
                        }
                        return [4 /*yield*/, result.text()];
                    case 4:
                        html = _h.sent();
                        alertText = ((_g = html.match(/alert\((.*?)\)/)) === null || _g === void 0 ? void 0 : _g[1]) || '';
                        if (alertText)
                            throw new Error(alertText);
                        return [2 /*return*/, this.parseNovels(html)];
                }
            });
        });
    };
    return ReadNovelFullPlugin;
}());
exports.ReadNovelFullPlugin = ReadNovelFullPlugin;
var ParsingState;
(function (ParsingState) {
    ParsingState[ParsingState["Idle"] = 0] = "Idle";
    ParsingState[ParsingState["Info"] = 1] = "Info";
    ParsingState[ParsingState["Cover"] = 2] = "Cover";
    ParsingState[ParsingState["Author"] = 3] = "Author";
    ParsingState[ParsingState["Genres"] = 4] = "Genres";
    ParsingState[ParsingState["Status"] = 5] = "Status";
    ParsingState[ParsingState["Hidden"] = 6] = "Hidden";
    ParsingState[ParsingState["Summary"] = 7] = "Summary";
    ParsingState[ParsingState["Stopped"] = 8] = "Stopped";
    ParsingState[ParsingState["Chapter"] = 9] = "Chapter";
    ParsingState[ParsingState["ChapterList"] = 10] = "ChapterList";
    ParsingState[ParsingState["NovelName"] = 11] = "NovelName";
    ParsingState[ParsingState["NovelList"] = 12] = "NovelList";
})(ParsingState || (ParsingState = {}));
var plugin = new ReadNovelFullPlugin({ "id": "novelping", "sourceSite": "https://novelping.com/", "sourceName": "Novel Ping", "options": { "latestPage": "sort/updates", "searchPage": "search", "versionIncrements": 0, "customJs": "$('[class*=\"app-promo\"]').remove();" }, "filters": { "type": { "type": "Picker", "label": "Novel Listing", "value": "sort/popular", "options": [{ "label": "Hot Novel", "value": "sort/hot" }, { "label": "Completed Novel", "value": "sort/complete" }, { "label": "Most Popular", "value": "sort/popular" }] }, "genres": { "type": "Picker", "label": "Genre (Cancels out 'Novel Listing')", "value": "", "options": [{ "label": "Action", "value": "novelping-genres/action" }, { "label": "Adventure", "value": "novelping-genres/adventure" }, { "label": "Anime & comics", "value": "novelping-genres/anime-&-comics" }, { "label": "Comedy", "value": "novelping-genres/comedy" }, { "label": "Drama", "value": "novelping-genres/drama" }, { "label": "Eastern", "value": "novelping-genres/eastern" }, { "label": "Fan-fic", "value": "novelping-genres/fan-fic" }, { "label": "Fan-fiction", "value": "novelping-genres/fan-fiction" }, { "label": "Fantasy", "value": "novelping-genres/fantasy" }, { "label": "Game", "value": "novelping-genres/game" }, { "label": "Gender bender", "value": "novelping-genres/gender-bender" }, { "label": "Harem", "value": "novelping-genres/harem" }, { "label": "Historical", "value": "novelping-genres/historical" }, { "label": "Horror", "value": "novelping-genres/horror" }, { "label": "Isekai", "value": "novelping-genres/isekai" }, { "label": "Josei", "value": "novelping-genres/josei" }, { "label": "Litrpg", "value": "novelping-genres/litrpg" }, { "label": "Magic", "value": "novelping-genres/magic" }, { "label": "Magical realism", "value": "novelping-genres/magical-realism" }, { "label": "Martial arts", "value": "novelping-genres/martial-arts" }, { "label": "Mature", "value": "novelping-genres/mature" }, { "label": "Mecha", "value": "novelping-genres/mecha" }, { "label": "Military", "value": "novelping-genres/military" }, { "label": "Modern life", "value": "novelping-genres/modern-life" }, { "label": "Mystery", "value": "novelping-genres/mystery" }, { "label": "Psychological", "value": "novelping-genres/psychological" }, { "label": "Realistic", "value": "novelping-genres/realistic" }, { "label": "Reincarnation", "value": "novelping-genres/reincarnation" }, { "label": "Romance", "value": "novelping-genres/romance" }, { "label": "School life", "value": "novelping-genres/school-life" }, { "label": "Sci-fi", "value": "novelping-genres/sci-fi" }, { "label": "Seinen", "value": "novelping-genres/seinen" }, { "label": "Shoujo", "value": "novelping-genres/shoujo" }, { "label": "Shoujo ai", "value": "novelping-genres/shoujo-ai" }, { "label": "Shounen", "value": "novelping-genres/shounen" }, { "label": "Shounen ai", "value": "novelping-genres/shounen-ai" }, { "label": "Slice of life", "value": "novelping-genres/slice-of-life" }, { "label": "Smut", "value": "novelping-genres/smut" }, { "label": "Sports", "value": "novelping-genres/sports" }, { "label": "Supernatural", "value": "novelping-genres/supernatural" }, { "label": "System", "value": "novelping-genres/system" }, { "label": "Thriller", "value": "novelping-genres/thriller" }, { "label": "Tragedy", "value": "novelping-genres/tragedy" }, { "label": "Urban", "value": "novelping-genres/urban" }, { "label": "Urban fantasy", "value": "novelping-genres/urban-fantasy" }, { "label": "Video games", "value": "novelping-genres/video-games" }, { "label": "War", "value": "novelping-genres/war" }, { "label": "Wuxia", "value": "novelping-genres/wuxia" }, { "label": "Xianxia", "value": "novelping-genres/xianxia" }, { "label": "Xuanhuan", "value": "novelping-genres/xuanhuan" }, { "label": "Yaoi", "value": "novelping-genres/yaoi" }, { "label": "Yuri", "value": "novelping-genres/yuri" }] } } });
exports.default = plugin;
