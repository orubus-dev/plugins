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
var novelStatus_1 = require("@libs/novelStatus");
/**
 * BornToBeNovel (borntobenovel.com) LNReader plugin
 *
 * A custom server-rendered site (not a known theme):
 *
 * - Catalog:      `/library/` lists every novel as an `a.novel-card` with
 *                 `data-genre`, `data-status` and `data-search-text`; the
 *                 site filters and searches that one page client-side.
 * - Ordering:     `/static/sliders.json` holds the site's `popular` and
 *                 `recent` (latest updates) slugs, used to order the catalog.
 * - Novel page:   `/novel/<slug>/` — title, genre tags, status tag and
 *                 description are in the markup; the chapter list is the
 *                 inline `window.chapters = {...}` object
 *                 (`{ "<n>": { url, is_free, date } }`).
 * - Chapter page: `/novel/<slug>/chapters/ch-<n>` — the text is a base64
 *                 string in `const contentData` that the page renders as a
 *                 light markdown (`**bold**`, `*italic*`, `* * *` rules).
 *                 Premium chapters carry a paywall notice instead.
 */
var PREMIUM_NOTICE = 'This chapter is available only with premium';
function decodeBase64Utf8(b64) {
    var binary = atob(b64);
    var percentEncoded = '';
    for (var i = 0; i < binary.length; i++) {
        percentEncoded +=
            '%' + ('00' + binary.charCodeAt(i).toString(16)).slice(-2);
    }
    try {
        return decodeURIComponent(percentEncoded);
    }
    catch (_a) {
        return binary;
    }
}
function escapeHtml(text) {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}
function formatInline(text) {
    return escapeHtml(text)
        .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
        .replace(/(^|[^*])\*(?!\*)([^*]+?)\*(?!\*)/g, '$1<em>$2</em>');
}
function markdownToHtml(text) {
    return text
        .split('\n')
        .map(function (line) {
        var trimmed = line.replace(/\r/g, '').trim();
        if (!trimmed)
            return '';
        if (/^\*\s*\*\s*\*$/.test(trimmed))
            return '<hr>';
        return ('<p>' + formatInline(trimmed.replace(/^~|~$/g, '').trim()) + '</p>');
    })
        .filter(Boolean)
        .join('\n');
}
var BornToBeNovel = /** @class */ (function () {
    function BornToBeNovel() {
        var _this = this;
        this.id = 'borntobenovel';
        this.name = 'BornToBeNovel';
        this.icon = 'src/en/borntobenovel/icon.png';
        this.site = 'https://borntobenovel.com';
        this.version = '1.0.0';
        this.resolveUrl = function (path, isNovel) {
            return _this.site + path + (isNovel && !path.endsWith('/') ? '/' : '');
        };
        this.filters = {
            genre: {
                label: 'Genre',
                value: 'all',
                options: [
                    { label: 'All', value: 'all' },
                    { label: 'Yaoi', value: 'Yaoi' },
                    { label: 'Erotica', value: 'Erotica' },
                    { label: 'Shounen', value: 'Shounen' },
                    { label: 'Shoujo', value: 'Shoujo' },
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
                    { label: 'Dropped', value: 'dropped' },
                ],
                type: filterInputs_1.FilterTypes.Picker,
            },
        };
    }
    BornToBeNovel.prototype.fetchPage = function (path) {
        return __awaiter(this, void 0, void 0, function () {
            var res, error;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, fetch_1.fetchApi)(this.site + path, {
                            headers: {
                                'User-Agent': 'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36',
                                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                                'Accept-Language': 'en-US,en;q=0.9',
                                'Referer': this.site + '/',
                            },
                        })];
                    case 1:
                        res = _a.sent();
                        if (!res.ok) {
                            error = new Error('Could not load ' + path + ' (HTTP ' + res.status + ')');
                            error.status = res.status;
                            throw error;
                        }
                        return [2 /*return*/, res.text()];
                }
            });
        });
    };
    BornToBeNovel.prototype.fetchHtml = function (path) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = cheerio_1.load;
                        return [4 /*yield*/, this.fetchPage(path)];
                    case 1: return [2 /*return*/, _a.apply(void 0, [_b.sent()])];
                }
            });
        });
    };
    BornToBeNovel.prototype.fetchCatalog = function () {
        return __awaiter(this, void 0, void 0, function () {
            var $;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.fetchHtml('/library/')];
                    case 1:
                        $ = _a.sent();
                        return [2 /*return*/, $('a.novel-card')
                                .map(function (_, el) {
                                var card = $(el);
                                var src = card.find('img.cover-icon').attr('src');
                                return {
                                    name: card.find('.novel-title').text().trim(),
                                    path: card.attr('href') || '',
                                    cover: src ? _this.resolveAsset(src) : undefined,
                                    genre: card.attr('data-genre') || '',
                                    status: card.attr('data-status') || '',
                                    search: (card.attr('data-search-text') || '').toLowerCase(),
                                };
                            })
                                .get()
                                .filter(function (novel) { return novel.path && novel.name; })];
                }
            });
        });
    };
    BornToBeNovel.prototype.resolveAsset = function (src) {
        return /^https?:\/\//.test(src) ? src : this.site + src;
    };
    BornToBeNovel.prototype.popularNovels = function (pageNo_1, _a) {
        return __awaiter(this, arguments, void 0, function (pageNo, _b) {
            var genre, status, catalog, ranked, rank;
            var _c, _d;
            var showLatestNovels = _b.showLatestNovels, filters = _b.filters;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        // The whole catalog is a single page.
                        if (pageNo > 1)
                            return [2 /*return*/, []];
                        genre = ((_c = filters === null || filters === void 0 ? void 0 : filters.genre) === null || _c === void 0 ? void 0 : _c.value) || 'all';
                        status = ((_d = filters === null || filters === void 0 ? void 0 : filters.status) === null || _d === void 0 ? void 0 : _d.value) || 'all';
                        return [4 /*yield*/, this.fetchCatalog()];
                    case 1:
                        catalog = _e.sent();
                        return [4 /*yield*/, this.fetchRanking(showLatestNovels ? 'recent' : 'popular')];
                    case 2:
                        ranked = _e.sent();
                        rank = function (path) {
                            var index = ranked.indexOf(path);
                            return index < 0 ? ranked.length : index;
                        };
                        return [2 /*return*/, catalog
                                .filter(function (novel) {
                                return (genre === 'all' || novel.genre === genre) &&
                                    (status === 'all' || novel.status === status);
                            })
                                .map(function (novel, index) { return ({ novel: novel, index: index }); })
                                .sort(function (a, b) { return rank(a.novel.path) - rank(b.novel.path) || a.index - b.index; })
                                .map(function (_a) {
                                var _b = _a.novel, name = _b.name, path = _b.path, cover = _b.cover;
                                return ({ name: name, path: path, cover: cover });
                            })];
                }
            });
        });
    };
    BornToBeNovel.prototype.fetchRanking = function (list) {
        return __awaiter(this, void 0, void 0, function () {
            var res, data, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(this.site + '/static/sliders.json')];
                    case 1:
                        res = _b.sent();
                        return [4 /*yield*/, res.json()];
                    case 2:
                        data = _b.sent();
                        return [2 /*return*/, (data[list] || []).map(function (item) { return '/novel/' + item.id + '/'; })];
                    case 3:
                        _a = _b.sent();
                        return [2 /*return*/, []];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    BornToBeNovel.prototype.searchNovels = function (searchTerm, pageNo) {
        return __awaiter(this, void 0, void 0, function () {
            var term;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (pageNo > 1)
                            return [2 /*return*/, []];
                        term = searchTerm.trim().toLowerCase();
                        return [4 /*yield*/, this.fetchCatalog()];
                    case 1: return [2 /*return*/, (_a.sent())
                            .filter(function (novel) { return novel.search.includes(term); })
                            .map(function (_a) {
                            var name = _a.name, path = _a.path, cover = _a.cover;
                            return ({ name: name, path: path, cover: cover });
                        })];
                }
            });
        });
    };
    BornToBeNovel.prototype.parseNovel = function (novelPath) {
        return __awaiter(this, void 0, void 0, function () {
            var path, html, $, title, novel, cover, tags, statusClass, summary;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        path = novelPath.endsWith('/') ? novelPath : novelPath + '/';
                        return [4 /*yield*/, this.fetchPage(path)];
                    case 1:
                        html = _a.sent();
                        if (!html.trim()) {
                            throw new Error('The site returned an empty page for ' + path);
                        }
                        $ = (0, cheerio_1.load)(html);
                        title = $('h1.desktop-title').first().clone();
                        title.find('.alt-names').remove();
                        novel = {
                            path: novelPath,
                            name: title.text().trim() || 'Untitled',
                        };
                        cover = $('img.desktop-cover').attr('src');
                        if (cover)
                            novel.cover = this.resolveAsset(cover);
                        tags = $('#desktopGenres .genre-tag');
                        statusClass = tags.filter('.status-tag').attr('class') || '';
                        if (statusClass.includes('status-completed')) {
                            novel.status = novelStatus_1.NovelStatus.Completed;
                        }
                        else if (statusClass.includes('status-ongoing')) {
                            novel.status = novelStatus_1.NovelStatus.Ongoing;
                        }
                        else if (statusClass.includes('status-dropped')) {
                            novel.status = novelStatus_1.NovelStatus.Cancelled;
                        }
                        novel.genres = tags
                            .filter(function (_, el) {
                            return !$(el).is('.rating-tag, .status-tag, .chapters-tag') &&
                                !$(el).hasClass('genre-more-button');
                        })
                            .map(function (_, el) { return $(el).text().trim(); })
                            .get()
                            .filter(Boolean)
                            .join(', ');
                        summary = $('.desktop-description .novel-description').first();
                        summary.find('br').replaceWith('\n');
                        novel.summary = summary.text().trim() || undefined;
                        novel.chapters = this.parseChapterList(html);
                        return [2 /*return*/, novel];
                }
            });
        });
    };
    BornToBeNovel.prototype.parseChapterList = function (html) {
        var marker = 'window.chapters = ';
        var start = html.indexOf(marker);
        if (start < 0)
            return [];
        var begin = html.indexOf('{', start);
        // The object is flat JSON that ends at the first `};` after it.
        var end = html.indexOf('};', begin);
        if (begin < 0 || end < 0)
            return [];
        var data;
        try {
            data = JSON.parse(html.slice(begin, end + 1));
        }
        catch (_a) {
            return [];
        }
        return Object.keys(data)
            .map(Number)
            .filter(function (n) { return !isNaN(n); })
            .sort(function (a, b) { return a - b; })
            .map(function (n) {
            var item = data[String(n)];
            var _a = (item.date || '').split('.'), day = _a[0], month = _a[1], year = _a[2];
            return {
                name: 'Chapter ' + n + (item.is_free === false ? ' (Premium)' : ''),
                path: item.url,
                releaseTime: year ? year + '-' + month + '-' + day : undefined,
                chapterNumber: n,
            };
        });
    };
    BornToBeNovel.prototype.parseChapter = function (chapterPath) {
        return __awaiter(this, void 0, void 0, function () {
            var html, match, text;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.fetchPage(chapterPath)];
                    case 1:
                        html = _a.sent();
                        match = html.match(/const contentData = '([^']*)'/);
                        if (!match || !match[1]) {
                            throw new Error('Chapter text not found: ' + chapterPath);
                        }
                        text = decodeBase64Utf8(match[1]);
                        if (text.startsWith(PREMIUM_NOTICE)) {
                            throw new Error('Premium chapter: a BornToBeNovel subscription is required to read it.');
                        }
                        return [2 /*return*/, markdownToHtml(text)];
                }
            });
        });
    };
    return BornToBeNovel;
}());
exports.default = new BornToBeNovel();
