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
var BeastNovels = /** @class */ (function () {
    function BeastNovels() {
        var _this = this;
        this.id = 'beastnovels';
        this.name = 'Beast Novels';
        this.version = '1.1.0';
        this.icon = 'src/en/beastnovels/icon.png';
        this.site = 'https://beastnovels.com/';
        this.pluginSettings = {
            hideLocked: {
                value: '',
                label: 'Hide locked chapters',
                type: 'Switch',
            },
        };
        this.resolveUrl = function (path) { return _this.site + path; };
        this.filters = {
            sort: {
                label: 'Sort By',
                value: 'popular',
                options: [
                    { label: 'Popular', value: 'popular' },
                    { label: 'Latest', value: 'latest' },
                    { label: 'Updated', value: 'updated' },
                ],
                type: filterInputs_1.FilterTypes.Picker,
            },
            status: {
                label: 'Status',
                value: 'all',
                options: [
                    { label: 'All', value: 'all' },
                    { label: 'Ongoing', value: 'ongoing' },
                    { label: 'Completed', value: 'completed' },
                    { label: 'Hiatus', value: 'hiatus' },
                ],
                type: filterInputs_1.FilterTypes.Picker,
            },
            genres: {
                label: 'Genres',
                value: [],
                options: [
                    { label: 'Action', value: '3' },
                    { label: 'Adventure', value: '6' },
                    { label: 'Comedy', value: '8' },
                    { label: 'Fantasy', value: '5' },
                    { label: 'Shounen', value: '7' },
                ],
                type: filterInputs_1.FilterTypes.CheckboxGroup,
            },
        };
    }
    BeastNovels.prototype.fetchText = function (url) {
        return __awaiter(this, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, fetch_1.fetchApi)(url)];
                    case 1:
                        res = _a.sent();
                        // Throw (carrying the HTTP status) so a runner-side block is reported
                        // INCONCLUSIVE per docs/testing.md instead of an empty-result FAIL.
                        if (!res.ok) {
                            throw Object.assign(new Error('Request failed: ' + res.status), {
                                status: res.status,
                            });
                        }
                        return [2 /*return*/, res.text()];
                }
            });
        });
    };
    BeastNovels.prototype.fetchCatalog = function () {
        return __awaiter(this, void 0, void 0, function () {
            var html, marker, start, depth, inString, i, ch;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.fetchText(this.site + 'novels')];
                    case 1:
                        html = _a.sent();
                        marker = html.search(/allBooks\s*:\s*\[/);
                        if (marker === -1)
                            throw new Error('Could not find the novel catalog');
                        start = html.indexOf('[', marker);
                        depth = 0;
                        inString = false;
                        for (i = start; i < html.length; i++) {
                            ch = html[i];
                            if (inString) {
                                if (ch === '\\')
                                    i++;
                                else if (ch === '"')
                                    inString = false;
                            }
                            else if (ch === '"') {
                                inString = true;
                            }
                            else if (ch === '[' || ch === '{') {
                                depth++;
                            }
                            else if (ch === ']' || ch === '}') {
                                depth--;
                                if (depth === 0)
                                    return [2 /*return*/, JSON.parse(html.slice(start, i + 1))];
                            }
                        }
                        throw new Error('Could not parse the novel catalog');
                }
            });
        });
    };
    BeastNovels.prototype.toNovelItem = function (book) {
        return {
            name: book.bookname,
            path: 'series/' + book.bookslug,
            cover: book.image_url || defaultCover_1.defaultCover,
        };
    };
    BeastNovels.prototype.popularNovels = function (pageNo_1, _a) {
        return __awaiter(this, arguments, void 0, function (pageNo, _b) {
            var sort, status, genres, books, key_1;
            var _this = this;
            var showLatestNovels = _b.showLatestNovels, filters = _b.filters;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        // The whole catalog is served on one page.
                        if (pageNo > 1)
                            return [2 /*return*/, []];
                        sort = showLatestNovels ? 'updated' : filters.sort.value;
                        status = filters.status.value;
                        genres = filters.genres.value;
                        return [4 /*yield*/, this.fetchCatalog()];
                    case 1:
                        books = (_c.sent()).filter(function (book) {
                            if (status !== 'all' && book.novel_status !== status)
                                return false;
                            var bookGenres = (book.genres || []).map(String);
                            return genres.every(function (g) { return bookGenres.includes(g); });
                        });
                        if (sort === 'popular') {
                            books.sort(function (a, b) { return (b.totalview || 0) - (a.totalview || 0); });
                        }
                        else {
                            key_1 = sort === 'updated' ? 'updated_at' : 'created_at';
                            books.sort(function (a, b) { return Date.parse(b[key_1]) - Date.parse(a[key_1]); });
                        }
                        return [2 /*return*/, books.map(function (book) { return _this.toNovelItem(book); })];
                }
            });
        });
    };
    BeastNovels.prototype.parseNovel = function (novelPath) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, html, catalog, $, novel, slug, book, hideLocked, chapters;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, Promise.all([
                            this.fetchText(this.site + novelPath),
                            this.fetchCatalog().catch(function () { return []; }),
                        ])];
                    case 1:
                        _a = _b.sent(), html = _a[0], catalog = _a[1];
                        $ = (0, cheerio_1.load)(html);
                        novel = {
                            path: novelPath,
                            name: $('h1').first().text().trim() || 'Untitled',
                            cover: $('#heroImg').attr('src') || defaultCover_1.defaultCover,
                            author: $('h1').first().next('p').find('span').text().trim(),
                            summary: $('h2:contains("Synopsis")').next().find('p').text().trim(),
                            genres: $('a[href*="/novels?genre="]')
                                .map(function (_, el) { return $(el).text().trim(); })
                                .get()
                                .join(', '),
                        };
                        slug = novelPath.split('/').pop();
                        book = catalog.find(function (b) { return b.bookslug === slug; });
                        switch (book === null || book === void 0 ? void 0 : book.novel_status) {
                            case 'ongoing':
                                novel.status = novelStatus_1.NovelStatus.Ongoing;
                                break;
                            case 'completed':
                                novel.status = novelStatus_1.NovelStatus.Completed;
                                break;
                            case 'hiatus':
                                novel.status = novelStatus_1.NovelStatus.OnHiatus;
                                break;
                        }
                        hideLocked = storage_1.storage.get('hideLocked');
                        chapters = [];
                        $('a.chapter-row').each(function (_, el) {
                            var href = $(el).attr('href');
                            if (!href)
                                return;
                            var locked = $(el).attr('data-premium') === '1';
                            if (locked && hideLocked)
                                return;
                            var num = $(el).find('.chapter-card__num').text().trim();
                            var number = parseFloat($(el).attr('data-chapter-number') || '');
                            var name = $(el).find('.chapter-card__title').text().trim() || num;
                            chapters.push({
                                name: locked ? "\uD83D\uDD12 ".concat(name) : name,
                                path: href.replace(_this.site, ''),
                                chapterNumber: isNaN(number) ? undefined : number,
                            });
                        });
                        novel.chapters = chapters;
                        return [2 /*return*/, novel];
                }
            });
        });
    };
    // Browsers ignore ASCII control characters and whitespace inside a URL
    // scheme (`java&#10;script:`), so drop them before checking the scheme.
    // The parser has already decoded entities in attribute values.
    BeastNovels.prototype.isUnsafeUrl = function (value) {
        // eslint-disable-next-line no-control-regex
        var url = value.replace(/[\u0000- \u007f]/g, '').toLowerCase();
        return (url.startsWith('javascript:') ||
            url.startsWith('vbscript:') ||
            (url.startsWith('data:') && !url.startsWith('data:image/')));
    };
    BeastNovels.prototype.parseChapter = function (chapterPath) {
        return __awaiter(this, void 0, void 0, function () {
            var html, $, content;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.fetchText(this.site + chapterPath)];
                    case 1:
                        html = _a.sent();
                        $ = (0, cheerio_1.load)(html);
                        content = $('.chapter-content');
                        if (!content.length) {
                            // Premium chapters redirect to the login page.
                            throw new Error($('input[type="password"]').length
                                ? 'This chapter is locked. Unlock it on Beast Novels to read it.'
                                : 'Could not find the chapter text.');
                        }
                        content.find('script, style, iframe').remove();
                        content.find('*').each(function (_, el) {
                            if (el.type !== 'tag')
                                return;
                            for (var _i = 0, _a = Object.keys(el.attribs); _i < _a.length; _i++) {
                                var attr = _a[_i];
                                if (/^on/i.test(attr) || _this.isUnsafeUrl(el.attribs[attr])) {
                                    $(el).removeAttr(attr);
                                }
                            }
                        });
                        return [2 /*return*/, content.html() || ''];
                }
            });
        });
    };
    BeastNovels.prototype.searchNovels = function (searchTerm, pageNo) {
        return __awaiter(this, void 0, void 0, function () {
            var term;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (pageNo > 1)
                            return [2 /*return*/, []];
                        term = searchTerm.trim().toLowerCase();
                        return [4 /*yield*/, this.fetchCatalog()];
                    case 1: return [2 /*return*/, (_a.sent())
                            .filter(function (book) {
                            return book.bookname.toLowerCase().includes(term) ||
                                (book.author || '').toLowerCase().includes(term);
                        })
                            .map(function (book) { return _this.toNovelItem(book); })];
                }
            });
        });
    };
    return BeastNovels;
}());
exports.default = new BeastNovels();
