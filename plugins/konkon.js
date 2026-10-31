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
var fetch_1 = require("@libs/fetch");
var novelStatus_1 = require("@libs/novelStatus");
var defaultCover_1 = require("@libs/defaultCover");
var storage_1 = require("@libs/storage");
var cheerio_1 = require("cheerio");
var KonkonPlugin = /** @class */ (function () {
    function KonkonPlugin() {
        var _this = this;
        this.id = 'konkon';
        this.name = 'Konkon';
        this.icon = 'src/en/konkon/icon.png';
        this.site = 'https://konkon.ink';
        this.version = '1.0.0';
        this.filters = undefined;
        this.pluginSettings = {
            hideLocked: {
                value: '',
                label: 'Hide locked chapters',
                type: 'Switch',
            },
        };
        this.hideLocked = storage_1.storage.get('hideLocked');
        this.api = 'https://api-k.konkon.ink';
        this.pageSize = 20;
        this.resolveUrl = function (path) { return _this.site + path; };
    }
    KonkonPlugin.prototype.getJson = function (path) {
        return __awaiter(this, void 0, void 0, function () {
            var response, contentType;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, fetch_1.fetchApi)(this.api + path, {
                            headers: {
                                Accept: 'application/json',
                                Referer: this.site + '/',
                            },
                        })];
                    case 1:
                        response = _a.sent();
                        if (!response.ok) {
                            throw new Error("Could not reach Konkon (".concat(response.status, "). Try opening the site in webview."));
                        }
                        contentType = response.headers.get('content-type') || '';
                        if (!contentType.includes('application/json')) {
                            throw new Error('Konkon returned an unexpected response. Try opening the site in webview.');
                        }
                        return [4 /*yield*/, response.json()];
                    case 2: return [2 /*return*/, (_a.sent())];
                }
            });
        });
    };
    KonkonPlugin.prototype.encodeBase64 = function (input) {
        var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
        var output = '';
        for (var block = 0, charCode = void 0, index = 0, map = chars; input.charAt(index | 0) || ((map = '='), index % 1); output += map.charAt(63 & (block >> (8 - (index % 1) * 8)))) {
            charCode = input.charCodeAt((index += 3 / 4));
            if (charCode > 0xff) {
                throw new Error('Could not encode Konkon media path.');
            }
            block = (block << 8) | charCode;
        }
        return output;
    };
    KonkonPlugin.prototype.coverUrl = function (novel) {
        var key = novel.featured_image_thumb_medium_key ||
            novel.featured_image_key ||
            novel.featured_image_thumb_small_key ||
            novel.featured_image;
        if (!key)
            return defaultCover_1.defaultCover;
        return "".concat(this.api, "/api/media/k/").concat(this.encodeBase64(key));
    };
    KonkonPlugin.prototype.toNovelItem = function (novel) {
        return {
            name: novel.title || 'Untitled',
            path: "/read/".concat(novel.slug),
            cover: this.coverUrl(novel),
        };
    };
    KonkonPlugin.prototype.popularNovels = function (pageNo_1, _a) {
        return __awaiter(this, arguments, void 0, function (pageNo, _b) {
            var response_1, limit, response;
            var _this = this;
            var showLatestNovels = _b.showLatestNovels;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (!showLatestNovels) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.getJson("/api/public/latest-updates?per_page=".concat(this.pageSize, "&page=").concat(pageNo))];
                    case 1:
                        response_1 = _c.sent();
                        return [2 /*return*/, response_1.data.map(function (novel) { return _this.toNovelItem(novel); })];
                    case 2:
                        limit = pageNo * this.pageSize;
                        return [4 /*yield*/, this.getJson("/api/public/novels_trending?limit=".concat(limit))];
                    case 3:
                        response = _c.sent();
                        return [2 /*return*/, response.data
                                .slice((pageNo - 1) * this.pageSize, limit)
                                .map(function (novel) { return _this.toNovelItem(novel); })];
                }
            });
        });
    };
    KonkonPlugin.prototype.status = function (status) {
        switch (status === null || status === void 0 ? void 0 : status.toLowerCase()) {
            case 'ongoing':
                return novelStatus_1.NovelStatus.Ongoing;
            case 'completed':
            case 'complete':
                return novelStatus_1.NovelStatus.Completed;
            case 'cancelled':
            case 'canceled':
                return novelStatus_1.NovelStatus.Cancelled;
            case 'hiatus':
            case 'on hiatus':
                return novelStatus_1.NovelStatus.OnHiatus;
            default:
                return novelStatus_1.NovelStatus.Unknown;
        }
    };
    KonkonPlugin.prototype.readerHtml = function (html) {
        var content = (0, cheerio_1.load)(html, undefined, false);
        content('script, style').remove();
        content('[style]').each(function (_, element) {
            var style = content(element).attr('style') || '';
            var readerSafeStyle = style
                .replace(/(^|;)\s*color\s*:[^;]*/gi, '$1')
                .replace(/;{2,}/g, ';')
                .replace(/^\s*;|;\s*$/g, '')
                .trim();
            if (readerSafeStyle)
                content(element).attr('style', readerSafeStyle);
            else
                content(element).removeAttr('style');
        });
        return content.root().html() || html;
    };
    KonkonPlugin.prototype.summaryText = function (html) {
        var content = (0, cheerio_1.load)(html, undefined, false);
        var paragraphs = content('p')
            .map(function (_, element) { return content(element).text().trim(); })
            .get()
            .filter(Boolean);
        return (paragraphs.length ? paragraphs.join('\n\n') : content.text()).trim();
    };
    KonkonPlugin.prototype.getNovelPage = function (slug, pageNo) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getJson("/api/public/novels/".concat(encodeURIComponent(slug), "?page=").concat(pageNo, "&per_page=100"))];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                }
            });
        });
    };
    KonkonPlugin.prototype.parseNovel = function (novelPath) {
        return __awaiter(this, void 0, void 0, function () {
            var slug, firstPage, lastPage, pages, pageNo, _a, _b, chapters, genres;
            var _this = this;
            var _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        slug = novelPath.replace(/^\/?read\//, '').split(/[?#]/)[0];
                        return [4 /*yield*/, this.getNovelPage(slug, 1)];
                    case 1:
                        firstPage = _d.sent();
                        lastPage = Math.max(1, Number((_c = firstPage.chapters_pagination) === null || _c === void 0 ? void 0 : _c.last_page) || 1);
                        pages = [firstPage];
                        pageNo = 2;
                        _d.label = 2;
                    case 2:
                        if (!(pageNo <= lastPage)) return [3 /*break*/, 5];
                        _b = (_a = pages).push;
                        return [4 /*yield*/, this.getNovelPage(slug, pageNo)];
                    case 3:
                        _b.apply(_a, [_d.sent()]);
                        _d.label = 4;
                    case 4:
                        pageNo += 1;
                        return [3 /*break*/, 2];
                    case 5:
                        chapters = pages
                            .flatMap(function (page) { return page.volumes || []; })
                            .sort(function (a, b) { return (a.order || 0) - (b.order || 0); })
                            .flatMap(function (volume) {
                            return __spreadArray([], (volume.chapters || []), true).sort(function (a, b) { return (a.sort_order || 0) - (b.sort_order || 0); });
                        })
                            .filter(function (chapter) { return chapter.status === 'published'; })
                            .filter(function (chapter) {
                            return !_this.hideLocked || !chapter.is_locked || chapter.user_has_access;
                        })
                            .map(function (chapter, index) {
                            var locked = Boolean(chapter.is_locked && !chapter.user_has_access);
                            return {
                                name: "".concat(locked ? '🔒 ' : '').concat(chapter.title),
                                path: "/read/chapter/".concat(chapter.id, "/").concat(chapter.slug),
                                chapterNumber: index + 1,
                                releaseTime: chapter.scheduled_for || chapter.created_at || null,
                            };
                        });
                        genres = __spreadArray(__spreadArray([], (firstPage.genres || []), true), (firstPage.tags || []), true).map(function (item) { return item.name; })
                            .filter(function (name, index, all) { return name && all.indexOf(name) === index; })
                            .join(', ');
                        return [2 /*return*/, {
                                name: firstPage.title || 'Untitled',
                                path: "/read/".concat(firstPage.slug),
                                cover: this.coverUrl(firstPage),
                                author: firstPage.author_name || undefined,
                                genres: genres,
                                summary: firstPage.description
                                    ? this.summaryText(firstPage.description)
                                    : undefined,
                                status: this.status(firstPage.novel_status),
                                chapters: chapters,
                            }];
                }
            });
        });
    };
    KonkonPlugin.prototype.parseChapter = function (chapterPath) {
        return __awaiter(this, void 0, void 0, function () {
            var chapterId, response, chapter;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        chapterId = (_a = chapterPath.match(/\/read\/chapter\/(\d+)/)) === null || _a === void 0 ? void 0 : _a[1];
                        if (!chapterId)
                            throw new Error('Invalid chapter path.');
                        return [4 /*yield*/, this.getJson("/api/public/chapters/".concat(chapterId))];
                    case 1:
                        response = _b.sent();
                        chapter = response.data;
                        if ((chapter.locked || chapter.is_locked) && !chapter.user_has_access) {
                            throw new Error('This chapter is locked.');
                        }
                        if (!chapter.content) {
                            throw new Error('Konkon returned no chapter content.');
                        }
                        return [2 /*return*/, this.readerHtml(chapter.content)];
                }
            });
        });
    };
    KonkonPlugin.prototype.searchNovels = function (searchTerm, pageNo) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (pageNo > 1)
                            return [2 /*return*/, []];
                        return [4 /*yield*/, this.getJson("/api/public/search?q=".concat(encodeURIComponent(searchTerm.trim())))];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.results.map(function (novel) { return _this.toNovelItem(novel); })];
                }
            });
        });
    };
    return KonkonPlugin;
}());
exports.default = new KonkonPlugin();
