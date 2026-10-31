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
var BronsTLPlugin = /** @class */ (function () {
    function BronsTLPlugin() {
        this.id = 'bronstl';
        this.name = 'BronsTL';
        this.icon = 'src/en/bronstl/icon.png';
        this.site = 'https://bronstl.com';
        this.version = '1.0.0';
        this.headers = {
            'Accept': 'application/json',
            'Referer': 'https://bronstl.com/',
            'X-Requested-With': 'XMLHttpRequest',
        };
    }
    BronsTLPlugin.prototype.api = function (path) {
        return __awaiter(this, void 0, void 0, function () {
            var url, r;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = path.startsWith('http') ? path : this.site + '/api/' + path;
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(url, { headers: this.headers })];
                    case 1:
                        r = _a.sent();
                        if (!r.ok) {
                            throw new Error('Could not reach site (' + r.status + ') try to open in webview.');
                        }
                        return [4 /*yield*/, r.json()];
                    case 2: return [2 /*return*/, (_a.sent())];
                }
            });
        });
    };
    BronsTLPlugin.prototype.fetchAll = function (path) {
        return __awaiter(this, void 0, void 0, function () {
            var items, next, guard, page;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        items = [];
                        next = path;
                        guard = 0;
                        _a.label = 1;
                    case 1:
                        if (!(next && guard++ < 100)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.api(next)];
                    case 2:
                        page = _a.sent();
                        items.push.apply(items, page.data);
                        next = page.next_page_url;
                        return [3 /*break*/, 1];
                    case 3: return [2 /*return*/, items];
                }
            });
        });
    };
    BronsTLPlugin.prototype.toItem = function (book) {
        return {
            name: book.title,
            path: 'books/' + book.slug,
            cover: book.cover_image || defaultCover_1.defaultCover,
        };
    };
    BronsTLPlugin.prototype.popularNovels = function (pageNo) {
        return __awaiter(this, void 0, void 0, function () {
            var books;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (pageNo > 1)
                            return [2 /*return*/, []];
                        return [4 /*yield*/, this.fetchAll('books')];
                    case 1:
                        books = _a.sent();
                        return [2 /*return*/, books.map(function (b) { return _this.toItem(b); })];
                }
            });
        });
    };
    BronsTLPlugin.prototype.searchNovels = function (searchTerm, pageNo) {
        return __awaiter(this, void 0, void 0, function () {
            var term, books;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (pageNo > 1)
                            return [2 /*return*/, []];
                        term = searchTerm.toLowerCase().trim();
                        return [4 /*yield*/, this.fetchAll('books')];
                    case 1:
                        books = _a.sent();
                        return [2 /*return*/, books
                                .filter(function (b) {
                                return b.title.toLowerCase().includes(term) ||
                                    (b.author || '').toLowerCase().includes(term);
                            })
                                .map(function (b) { return _this.toItem(b); })];
                }
            });
        });
    };
    BronsTLPlugin.prototype.parseNovel = function (novelPath) {
        return __awaiter(this, void 0, void 0, function () {
            var slug, book, status, chapters;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        slug = novelPath.replace(/^\/?books\//, '');
                        return [4 /*yield*/, this.api('books/' + slug)];
                    case 1:
                        book = _b.sent();
                        status = novelStatus_1.NovelStatus.Unknown;
                        switch ((_a = book.status) === null || _a === void 0 ? void 0 : _a.name) {
                            case 'ongoing':
                                status = novelStatus_1.NovelStatus.Ongoing;
                                break;
                            case 'finished':
                                status = novelStatus_1.NovelStatus.Completed;
                                break;
                            case 'dropped':
                                status = novelStatus_1.NovelStatus.Cancelled;
                                break;
                        }
                        return [4 /*yield*/, this.fetchAll('books/' + slug + '/chapters')];
                    case 2:
                        chapters = (_b.sent())
                            .sort(function (a, b) { return a.chapter_weight - b.chapter_weight; })
                            .map(function (c, i) { return ({
                            name: c.chapter_title,
                            path: 'books/' + slug + '/chapters/' + c.chapter_slug,
                            releaseTime: c.created_at,
                            chapterNumber: i + 1,
                        }); });
                        return [2 /*return*/, {
                                path: novelPath,
                                name: book.title,
                                cover: book.cover_image || defaultCover_1.defaultCover,
                                author: book.author || undefined,
                                artist: book.illustrator || undefined,
                                summary: book.description || undefined,
                                genres: (book.tags || [])
                                    .map(function (t) { return t.name; })
                                    .filter(Boolean)
                                    .join(', '),
                                status: status,
                                chapters: chapters,
                            }];
                }
            });
        });
    };
    BronsTLPlugin.prototype.parseChapter = function (chapterPath) {
        return __awaiter(this, void 0, void 0, function () {
            var chapter, $;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.api(chapterPath.replace(/^\//, ''))];
                    case 1:
                        chapter = _a.sent();
                        $ = (0, cheerio_1.load)(chapter.body || '');
                        $('img').each(function (_, el) {
                            var src = $(el).attr('src');
                            if (src && src.startsWith('/'))
                                $(el).attr('src', _this.site + src);
                        });
                        return [2 /*return*/, $('body').html() || ''];
                }
            });
        });
    };
    BronsTLPlugin.prototype.resolveUrl = function (path) {
        return this.site + '/' + path.replace(/^\//, '');
    };
    return BronsTLPlugin;
}());
exports.default = new BronsTLPlugin();
