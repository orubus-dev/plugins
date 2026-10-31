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
var Dragonholic = /** @class */ (function () {
    function Dragonholic() {
        var _this = this;
        this.id = 'dragonholic';
        this.name = 'Dragonholic';
        this.icon = 'src/en/dragonholic/icon.png';
        this.site = 'https://dragonholictranslations.com';
        this.version = '3.0.0';
        this.resolveUrl = function (path) {
            return _this.site + '/series/' + _this.normalizePath(path) + '/';
        };
    }
    Dragonholic.prototype.decodeEntities = function (text) {
        return text
            .replace(/&#(\d+);/g, function (_, code) {
            try {
                return String.fromCharCode(parseInt(code, 10));
            }
            catch (_a) {
                return _;
            }
        })
            .replace(/&#x([0-9a-fA-F]+);/g, function (_, code) {
            try {
                return String.fromCharCode(parseInt(code, 16));
            }
            catch (_a) {
                return _;
            }
        })
            .replace(/&(amp|lt|gt|quot|apos|nbsp|#039);/g, function (_, entity) {
            switch (entity) {
                case 'amp':
                    return '&';
                case 'lt':
                    return '<';
                case 'gt':
                    return '>';
                case 'quot':
                    return '"';
                case 'apos':
                    return "'";
                case 'nbsp':
                    return ' ';
                case '#039':
                    return "'";
                default:
                    return _;
            }
        });
    };
    // Throw (carrying the HTTP status) on a refused response so a block is
    // reported instead of being parsed into a false empty result.
    Dragonholic.prototype.fetchSite = function (url, init) {
        return __awaiter(this, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, fetch_1.fetchApi)(url, init)];
                    case 1:
                        res = _a.sent();
                        if (!res.ok) {
                            throw Object.assign(new Error('Request failed: ' + res.status), {
                                status: res.status,
                            });
                        }
                        return [2 /*return*/, res];
                }
            });
        });
    };
    Dragonholic.prototype.normalizePath = function (path) {
        return path
            .replace(/\/{2,}/g, '/')
            .replace(/^\/+|\/+$/g, '')
            .replace(/^novel\//, '');
    };
    Dragonholic.prototype.popularNovels = function (pageNo) {
        return __awaiter(this, void 0, void 0, function () {
            var url, res, body, loadedCheerio, novels, seen;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = pageNo > 1 ? this.site + '/?updates_page=' + pageNo : this.site;
                        return [4 /*yield*/, this.fetchSite(url)];
                    case 1:
                        res = _a.sent();
                        return [4 /*yield*/, res.text()];
                    case 2:
                        body = _a.sent();
                        loadedCheerio = (0, cheerio_1.load)(body);
                        novels = [];
                        seen = new Set();
                        loadedCheerio('[data-latest-updates-content] a[href*="/series/"]').each(function (_, element) {
                            var href = loadedCheerio(element).attr('href') || '';
                            var match = href.match(/\/series\/([^/]+)\/?/);
                            if (!match)
                                return;
                            var slug = match[1];
                            if (seen.has(slug))
                                return;
                            seen.add(slug);
                            var card = loadedCheerio(element).closest('div[class*="rounded"]');
                            var name = card.find('h3 a').first().text().trim() ||
                                loadedCheerio(element).first().text().trim();
                            var cover = card.find('img').first().attr('src') ||
                                loadedCheerio(element).find('img').first().attr('src') ||
                                defaultCover_1.defaultCover;
                            if (name) {
                                novels.push({ name: name, path: slug, cover: cover });
                            }
                        });
                        return [2 /*return*/, novels];
                }
            });
        });
    };
    Dragonholic.prototype.parseNovel = function (path) {
        return __awaiter(this, void 0, void 0, function () {
            var novelPath, res, body, loadedCheerio, novel, cover, genres, statusText, summary, seriesId, chapters, chaptersRes, data, list;
            var _this = this;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        novelPath = this.normalizePath(path);
                        return [4 /*yield*/, this.fetchSite(this.resolveUrl(novelPath))];
                    case 1:
                        res = _c.sent();
                        return [4 /*yield*/, res.text()];
                    case 2:
                        body = _c.sent();
                        loadedCheerio = (0, cheerio_1.load)(body);
                        novel = {
                            path: novelPath,
                            name: '',
                        };
                        novel.name = loadedCheerio('h1').first().text().trim();
                        cover = loadedCheerio('[x-data="coverModal()"] img').first().attr('src') ||
                            loadedCheerio('h1').parent().parent().find('img').first().attr('src');
                        novel.cover = cover || defaultCover_1.defaultCover;
                        novel.author =
                            loadedCheerio('a[href*="/author/"]').first().text().trim() || undefined;
                        genres = [];
                        loadedCheerio('a[href*="/genre/"]').each(function (_, element) {
                            var genre = loadedCheerio(element).text().trim();
                            if (genre)
                                genres.push(genre);
                        });
                        if (genres.length) {
                            novel.genres = genres.join(',');
                        }
                        statusText = loadedCheerio('div[class*="rounded-full"]')
                            .toArray()
                            .map(function (element) { return loadedCheerio(element).text().trim().toLowerCase(); })
                            .find(function (text) { return /ongoing|completed|hiatus|cancelled|dropped/.test(text); });
                        if (statusText) {
                            if (statusText.includes('ongoing'))
                                novel.status = novelStatus_1.NovelStatus.Ongoing;
                            else if (statusText.includes('completed'))
                                novel.status = novelStatus_1.NovelStatus.Completed;
                            else if (statusText.includes('hiatus'))
                                novel.status = novelStatus_1.NovelStatus.OnHiatus;
                            else
                                novel.status = novelStatus_1.NovelStatus.Unknown;
                        }
                        summary = loadedCheerio('[x-ref="synopsis"] p')
                            .toArray()
                            .map(function (element) { return loadedCheerio(element).text().trim(); })
                            .filter(function (text) { return text && !/^synopsis:?$/i.test(text); })
                            .join('\n');
                        if (summary) {
                            novel.summary = summary;
                        }
                        seriesId = (_a = body.match(/seriesId:\s*(\d+)/)) === null || _a === void 0 ? void 0 : _a[1];
                        chapters = [];
                        if (!seriesId) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.fetchSite(this.site +
                                '/api/chapters?series_id=' +
                                seriesId +
                                '&load_all=1&sort_order=asc', {
                                headers: {
                                    Accept: 'application/json',
                                    'X-Requested-With': 'XMLHttpRequest',
                                },
                            })];
                    case 3:
                        chaptersRes = _c.sent();
                        return [4 /*yield*/, chaptersRes.json()];
                    case 4:
                        data = (_c.sent());
                        list = ((_b = data === null || data === void 0 ? void 0 : data.data) === null || _b === void 0 ? void 0 : _b.chapters) || (data === null || data === void 0 ? void 0 : data.chapters) || [];
                        list.forEach(function (item) {
                            if (!item.slug)
                                return;
                            var order = Number(item.chapter_order);
                            var title = _this.decodeEntities([item.heading || item.name, item.subtitle]
                                .filter(function (part) { return part && part.trim(); })
                                .join(' - ') || item.slug);
                            chapters.push({
                                name: item.is_premium ? '🔒 ' + title : title,
                                path: novelPath + '/' + item.slug,
                                releaseTime: item.created_at || undefined,
                                chapterNumber: order > 0 ? order : chapters.length + 1,
                            });
                        });
                        _c.label = 5;
                    case 5:
                        novel.chapters = chapters;
                        return [2 /*return*/, novel];
                }
            });
        });
    };
    Dragonholic.prototype.parseChapter = function (chapterPath) {
        return __awaiter(this, void 0, void 0, function () {
            var res, body, loadedCheerio, content, chapterText;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.fetchSite(this.resolveUrl(chapterPath))];
                    case 1:
                        res = _a.sent();
                        return [4 /*yield*/, res.text()];
                    case 2:
                        body = _a.sent();
                        loadedCheerio = (0, cheerio_1.load)(body);
                        content = loadedCheerio('.chapter-content');
                        content
                            .find('script, style, ins, .ad-container, [data-lumina-ad-code]')
                            .remove();
                        chapterText = '';
                        content.find('p').each(function (_, element) {
                            var paragraph = loadedCheerio(element);
                            if (paragraph.text().trim() || paragraph.find('img').length) {
                                chapterText += '<p>' + (paragraph.html() || '').trim() + '</p>';
                            }
                        });
                        return [2 /*return*/, chapterText];
                }
            });
        });
    };
    Dragonholic.prototype.searchNovels = function (searchTerm) {
        return __awaiter(this, void 0, void 0, function () {
            var res, data, novels;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.fetchSite(this.site + '/api/search?q=' + encodeURIComponent(searchTerm), {
                            headers: {
                                Accept: 'application/json',
                                'X-Requested-With': 'XMLHttpRequest',
                            },
                        })];
                    case 1:
                        res = _a.sent();
                        return [4 /*yield*/, res.json()];
                    case 2:
                        data = (_a.sent());
                        novels = [];
                        ((data === null || data === void 0 ? void 0 : data.results) || []).forEach(function (item) {
                            var match = (item.url || '').match(/\/series\/([^/]+)\/?/);
                            if (item.title && match) {
                                novels.push({
                                    name: _this.decodeEntities(item.title),
                                    path: match[1],
                                    cover: item.thumbnail || defaultCover_1.defaultCover,
                                });
                            }
                        });
                        return [2 /*return*/, novels];
                }
            });
        });
    };
    return Dragonholic;
}());
exports.default = new Dragonholic();
