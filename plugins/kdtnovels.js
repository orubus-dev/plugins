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
var defaultCover_1 = require("@libs/defaultCover");
var novelStatus_1 = require("@libs/novelStatus");
/**
 * KDT Novels replaced its LightNovelWP WordPress theme with its own Next.js
 * site, so it no longer fits the lightnovelwp multisrc template.
 *
 * - Listing/search: `/search/?page=<n>&genre=<slug>&q=<term>`, 24 cards
 *                   (`a.group`) per page, most recently updated first.
 * - Novel page:     `/series/<slug>/`. The HTML only lists the chapters of
 *                   the expanded volume; every volume's chapters are in the
 *                   embedded React Server Components payload.
 * - Chapter page:   `/<chapter-slug>/`, text in `article.reader-content`.
 *                   VIP chapters render an unlock prompt instead.
 */
var KDTNovels = /** @class */ (function () {
    function KDTNovels() {
        var _this = this;
        this.id = 'kdtnovels';
        this.name = 'KDT Novels';
        this.version = '2.0.0';
        this.icon = 'src/en/kdtnovels/icon.png';
        this.site = 'https://kdtnovels.net/';
        this.resolveUrl = function (path) { return _this.site + path; };
        this.filters = {
            genre: {
                label: 'Genre',
                value: '',
                options: [
                    { label: 'All', value: '' },
                    { label: 'Action', value: 'action' },
                    { label: 'Adult', value: 'adult' },
                    { label: 'Adventure', value: 'adventure' },
                    { label: 'Battle Royale', value: 'battle-royale' },
                    { label: 'Childhood Friends', value: 'childhood-friends' },
                    { label: 'Cohabitation', value: 'cohabitation' },
                    { label: 'Comedy', value: 'comedy' },
                    { label: 'Drama', value: 'drama' },
                    { label: 'Ecchi', value: 'ecchi' },
                    { label: 'Fantasy', value: 'fantasy' },
                    { label: 'Gender Bender', value: 'gender-bender' },
                    { label: 'Genderswap', value: 'genderswap' },
                    { label: 'Gore', value: 'gore' },
                    { label: 'Harem', value: 'harem' },
                    { label: 'Horror', value: 'horror' },
                    { label: 'Idol', value: 'idol' },
                    { label: 'Isekai', value: 'isekai' },
                    { label: 'Isekai reincarnation', value: 'isekai-reincarnation' },
                    { label: 'Magic', value: 'magic' },
                    { label: 'Martial Arts', value: 'martial-arts' },
                    { label: 'Mature', value: 'mature' },
                    { label: 'Mecha', value: 'mecha' },
                    { label: 'Monster Girls', value: 'monster-girls' },
                    { label: 'Monsters', value: 'monsters' },
                    { label: 'Mystery', value: 'mystery' },
                    { label: 'Parallel world', value: 'parallel-world' },
                    { label: 'Psychological', value: 'psychological' },
                    { label: 'Psychological drama', value: 'psychological-drama' },
                    { label: 'Reincarnation', value: 'reincarnation' },
                    { label: 'Romance', value: 'romance' },
                    { label: 'Romance school', value: 'romance-school' },
                    { label: 'Romantic Comedy', value: 'romantic-comedy' },
                    { label: 'School', value: 'school' },
                    { label: 'School Life', value: 'school-life' },
                    { label: 'Sci-fi', value: 'sci-fi' },
                    { label: 'Seinen', value: 'seinen' },
                    { label: 'Sexual Violence', value: 'sexual-violence' },
                    { label: 'Shonen', value: 'shonen' },
                    { label: 'Shota', value: 'shota' },
                    { label: 'Shoujo Ai', value: 'shoujo-ai' },
                    { label: 'Shounen', value: 'shounen' },
                    { label: 'Slice of Life', value: 'slice-of-life' },
                    { label: 'Smut', value: 'smut' },
                    { label: 'Supernatural', value: 'supernatural' },
                    { label: 'Survival', value: 'survival' },
                    { label: 'Time Travel', value: 'time-travel' },
                    { label: 'Tragedy', value: 'tragedy' },
                    { label: 'Villainess Otome Game', value: 'villainess-otome-game' },
                    { label: 'Yamikawa', value: 'yamikawa' },
                    { label: 'Youth', value: 'youth' },
                    { label: 'Yuri', value: 'yuri' },
                ],
                type: filterInputs_1.FilterTypes.Picker,
            },
        };
    }
    KDTNovels.prototype.fetchHtml = function (url) {
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
    KDTNovels.prototype.fetchPage = function (url) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = cheerio_1.load;
                        return [4 /*yield*/, this.fetchHtml(url)];
                    case 1: return [2 /*return*/, _a.apply(void 0, [_b.sent()])];
                }
            });
        });
    };
    KDTNovels.prototype.absolute = function (url) {
        if (!url)
            return undefined;
        return url.startsWith('/') ? this.site + url.slice(1) : url;
    };
    KDTNovels.prototype.parseCards = function ($) {
        var _this = this;
        var novels = [];
        $('a.group[href^="/series/"]').each(function (_, el) {
            var card = $(el);
            var title = card.find('h3');
            novels.push({
                name: title.attr('title') || title.text().trim(),
                path: card.attr('href').slice(1),
                cover: _this.absolute(card.find('img').attr('src')) || defaultCover_1.defaultCover,
            });
        });
        return novels;
    };
    KDTNovels.prototype.popularNovels = function (pageNo_1, _a) {
        return __awaiter(this, arguments, void 0, function (pageNo, _b) {
            var url, _c;
            var showLatestNovels = _b.showLatestNovels, filters = _b.filters;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        url = this.site + 'search/?page=' + pageNo;
                        if (!showLatestNovels && filters.genre.value) {
                            url += '&genre=' + filters.genre.value;
                        }
                        _c = this.parseCards;
                        return [4 /*yield*/, this.fetchPage(url)];
                    case 1: return [2 /*return*/, _c.apply(this, [_d.sent()])];
                }
            });
        });
    };
    /**
     * Reads the volume groups from the Next.js flight payload, which the page
     * streams as `self.__next_f.push([1, "<chunk>"])` script calls.
     */
    KDTNovels.prototype.parseChapterGroups = function (html) {
        var pushRegex = /self\.__next_f\.push\(\[1,("(?:[^"\\]|\\.)*")\]\)/g;
        var flight = '';
        var match;
        while ((match = pushRegex.exec(html))) {
            flight += JSON.parse(match[1]);
        }
        for (var _i = 0, _a = flight.split('\n'); _i < _a.length; _i++) {
            var line = _a[_i];
            if (!line.includes('"groups":['))
                continue;
            var row = void 0;
            try {
                row = JSON.parse(line.slice(line.indexOf(':') + 1));
            }
            catch (_b) {
                continue; // a text row, not a JSON one
            }
            var found = findGroups(row);
            if (found)
                return found;
        }
        return undefined;
    };
    KDTNovels.prototype.parseNovel = function (novelPath) {
        return __awaiter(this, void 0, void 0, function () {
            var html, $, title, novel, summary, paragraphs, credits, badge, groups, chapters, _i, groups_1, group, _a, _b, chapter, name_1;
            var _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, this.fetchHtml(this.site + novelPath)];
                    case 1:
                        html = _d.sent();
                        $ = (0, cheerio_1.load)(html);
                        title = $('main h1').first();
                        novel = {
                            path: novelPath,
                            name: title.text().trim() || 'Untitled',
                            cover: this.absolute($('meta[property="og:image"]').attr('content')) ||
                                defaultCover_1.defaultCover,
                            genres: $('main a[href^="/search/?genre="]')
                                .map(function (_, el) { return $(el).text().trim(); })
                                .get()
                                .join(', '),
                        };
                        summary = $('main .reader-content').first();
                        paragraphs = summary
                            .find('p')
                            .map(function (_, el) { return $(el).text().trim(); })
                            .get()
                            .filter(Boolean);
                        novel.summary = paragraphs.length
                            ? paragraphs.join('\n\n')
                            : summary.text().trim();
                        credits = title
                            .parent()
                            .next('p:not(.flex)')
                            .text()
                            .split(' · Art: ');
                        if (credits[0].trim())
                            novel.author = credits[0].trim();
                        if ((_c = credits[1]) === null || _c === void 0 ? void 0 : _c.trim())
                            novel.artist = credits[1].trim();
                        badge = title.siblings('span').first().text().trim().toLowerCase();
                        switch (badge) {
                            case '':
                                novel.status = novelStatus_1.NovelStatus.Ongoing;
                                break;
                            case 'completed':
                                novel.status = novelStatus_1.NovelStatus.Completed;
                                break;
                            case 'hiatus':
                                novel.status = novelStatus_1.NovelStatus.OnHiatus;
                                break;
                            default:
                                novel.status = novelStatus_1.NovelStatus.Unknown;
                        }
                        groups = this.parseChapterGroups(html);
                        if (!groups)
                            throw new Error('Could not find the chapter list.');
                        chapters = [];
                        for (_i = 0, groups_1 = groups; _i < groups_1.length; _i++) {
                            group = groups_1[_i];
                            for (_a = 0, _b = group.chapters; _a < _b.length; _a++) {
                                chapter = _b[_a];
                                name_1 = group.label + ' · Ch. ' + chapter.chapter_no;
                                if (chapter.subtitle)
                                    name_1 += ': ' + chapter.subtitle;
                                chapters.push({
                                    name: chapter.locked ? '🔒 ' + name_1 : name_1,
                                    path: chapter.slug + '/',
                                    chapterNumber: chapters.length + 1,
                                });
                            }
                        }
                        novel.chapters = chapters;
                        return [2 /*return*/, novel];
                }
            });
        });
    };
    KDTNovels.prototype.parseChapter = function (chapterPath) {
        return __awaiter(this, void 0, void 0, function () {
            var $, content;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.fetchPage(this.site + chapterPath)];
                    case 1:
                        $ = _a.sent();
                        content = $('article.reader-content').first();
                        if (!content.length) {
                            if ($('main h2').text().includes('This chapter is locked')) {
                                throw new Error('This chapter is locked. Unlock it on KDT Novels to read it.');
                            }
                            throw new Error('Could not find the chapter text.');
                        }
                        content.find('script, style, noscript').remove();
                        // Illustrations are placeholders that the site's script swaps for images.
                        content.find('.kdt-ilus[data-ilus]').each(function (_, el) {
                            var src = _this.absolute($(el).attr('data-ilus'));
                            $(el).replaceWith(src ? $('<img>').attr('src', src) : '');
                        });
                        // The app renders this HTML as is, so drop event handlers and URLs that
                        // would run script.
                        content.find('*').each(function (_, el) {
                            var node = $(el);
                            for (var _i = 0, _a = Object.keys(el.attribs); _i < _a.length; _i++) {
                                var name_2 = _a[_i];
                                if (/^on/i.test(name_2)) {
                                    node.removeAttr(name_2);
                                }
                                else if (name_2 === 'href' || name_2 === 'src') {
                                    var value = el.attribs[name_2]
                                        .split('')
                                        .filter(function (c) { return c.charCodeAt(0) > 32; })
                                        .join('')
                                        .toLowerCase();
                                    if (/^(javascript|vbscript):/.test(value) ||
                                        (value.startsWith('data:') && !value.startsWith('data:image/'))) {
                                        node.removeAttr(name_2);
                                    }
                                }
                            }
                        });
                        return [2 /*return*/, content.html() || ''];
                }
            });
        });
    };
    KDTNovels.prototype.searchNovels = function (searchTerm, pageNo) {
        return __awaiter(this, void 0, void 0, function () {
            var $;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.fetchPage(this.site +
                            'search/?q=' +
                            encodeURIComponent(searchTerm.trim()) +
                            '&page=' +
                            pageNo)];
                    case 1:
                        $ = _a.sent();
                        return [2 /*return*/, this.parseCards($)];
                }
            });
        });
    };
    return KDTNovels;
}());
/** Finds the first `groups` array of chapter groups in a flight row. */
function findGroups(node) {
    if (!node || typeof node !== 'object')
        return undefined;
    var record = node;
    var groups = record.groups;
    if (Array.isArray(groups) &&
        groups.every(function (group) { return Array.isArray(group === null || group === void 0 ? void 0 : group.chapters); })) {
        return groups;
    }
    for (var key in record) {
        var found = findGroups(record[key]);
        if (found)
            return found;
    }
    return undefined;
}
exports.default = new KDTNovels();
