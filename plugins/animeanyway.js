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
var defaultCover_1 = require("@libs/defaultCover");
var novelStatus_1 = require("@libs/novelStatus");
var AnimeAnyway = /** @class */ (function () {
    function AnimeAnyway() {
        var _this = this;
        this.id = 'animeanyway';
        this.name = 'Anime Anyway';
        this.icon = 'src/en/animeanyway/icon.png';
        this.site = 'https://animeanyway.com/';
        this.version = '1.0.0';
        /**
         * The site's own volume titles ("Year 3 Vol. 4") don't name the franchise,
         * unlike "High School Syndrome" which is already self-explanatory — prefix
         * just the former so both are recognisable in a novel list.
         */
        this.yearVolumePattern = /^Year\s+\d+\s+Vol(?:ume)?\.?\s*\d+/i;
        /**
         * Sanity's image CDN URL for a Portable Text image block, which only carries
         * an asset reference ("image-<id>-<w>x<h>-<format>"), not a resolved URL —
         * unlike mainImage/banner elsewhere on the site, which come pre-resolved.
         * Project id and dataset are this site's own fixed identifiers.
         */
        this.sanityImageBase = 'https://cdn.sanity.io/images/m1xj6lbt/production/';
        this.cataloguePromise = null;
        this.resolveUrl = function (path) { return "".concat(_this.site).concat(path); };
    }
    /** Extracts the Next.js page data every server-rendered page embeds. */
    AnimeAnyway.prototype.fetchPageData = function (path) {
        return __awaiter(this, void 0, void 0, function () {
            var response, html, match, parsed;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, (0, fetch_1.fetchApi)("".concat(this.site).concat(path))];
                    case 1:
                        response = _b.sent();
                        return [4 /*yield*/, response.text()];
                    case 2:
                        html = _b.sent();
                        match = html.match(/<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/);
                        if (!match)
                            return [2 /*return*/, undefined];
                        parsed = JSON.parse(match[1]);
                        return [2 /*return*/, (_a = parsed.props) === null || _a === void 0 ? void 0 : _a.pageProps];
                }
            });
        });
    };
    AnimeAnyway.prototype.displayName = function (title, displayTitle) {
        var volumeTitle = displayTitle === null || displayTitle === void 0 ? void 0 : displayTitle.trim();
        if (volumeTitle && volumeTitle.toLowerCase() !== title.toLowerCase()) {
            return "".concat(title, ": ").concat(volumeTitle);
        }
        return this.yearVolumePattern.test(title)
            ? "Classroom of the Elite: ".concat(title)
            : title;
    };
    /** Supports both the legacy pageProps.vol and current volumeProps.vol. */
    AnimeAnyway.prototype.getVolume = function (data) {
        var _a, _b;
        return (_a = data === null || data === void 0 ? void 0 : data.vol) !== null && _a !== void 0 ? _a : (_b = data === null || data === void 0 ? void 0 : data.volumeProps) === null || _b === void 0 ? void 0 : _b.vol;
    };
    AnimeAnyway.prototype.getVolumePath = function (volume) {
        return volume.series && volume.seriesUsesRootPath === false
            ? "".concat(volume.series, "/").concat(volume.volkeyword)
            : volume.volkeyword;
    };
    /**
     * The catalogue is the homepage's own volume list, one novel per volume —
     * each is published as its own book on the site, so that's what's exposed
     * here too. Cached for the session (shared promise, retried on failure).
     */
    AnimeAnyway.prototype.getCatalogue = function () {
        return __awaiter(this, void 0, void 0, function () {
            var error_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.cataloguePromise)
                            return [2 /*return*/, this.cataloguePromise];
                        this.cataloguePromise = (function () { return __awaiter(_this, void 0, void 0, function () {
                            var home, volumes;
                            var _this = this;
                            var _a;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0: return [4 /*yield*/, this.fetchPageData('')];
                                    case 1:
                                        home = _b.sent();
                                        volumes = (_a = home === null || home === void 0 ? void 0 : home.allVolumes) !== null && _a !== void 0 ? _a : [];
                                        return [2 /*return*/, volumes.map(function (volume) {
                                                var _a, _b, _c, _d;
                                                return ({
                                                    path: _this.getVolumePath(volume),
                                                    name: _this.displayName(volume.title, volume.displayTitle),
                                                    cover: (_c = (_b = (_a = volume.mainImage) === null || _a === void 0 ? void 0 : _a.asset) === null || _b === void 0 ? void 0 : _b.url) !== null && _c !== void 0 ? _c : defaultCover_1.defaultCover,
                                                    releaseDate: (_d = volume.releaseDate) !== null && _d !== void 0 ? _d : '',
                                                });
                                            })];
                                }
                            });
                        }); })();
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.cataloguePromise];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3:
                        error_1 = _a.sent();
                        this.cataloguePromise = null;
                        throw error_1;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    AnimeAnyway.prototype.popularNovels = function (pageNo_1, _a) {
        return __awaiter(this, arguments, void 0, function (pageNo, _b) {
            var catalogue, ordered;
            var _this = this;
            var showLatestNovels = _b.showLatestNovels;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (pageNo > 1)
                            return [2 /*return*/, []];
                        return [4 /*yield*/, this.getCatalogue()];
                    case 1:
                        catalogue = _c.sent();
                        ordered = catalogue;
                        if (!showLatestNovels) return [3 /*break*/, 3];
                        // Older catalogue payloads omit release dates, so fill only those gaps.
                        return [4 /*yield*/, Promise.all(catalogue.map(function (entry) { return __awaiter(_this, void 0, void 0, function () {
                                var vol, _a;
                                var _b;
                                return __generator(this, function (_c) {
                                    switch (_c.label) {
                                        case 0:
                                            if (entry.releaseDate)
                                                return [2 /*return*/];
                                            _a = this.getVolume;
                                            return [4 /*yield*/, this.fetchPageData(entry.path)];
                                        case 1:
                                            vol = _a.apply(this, [_c.sent()]);
                                            entry.releaseDate = (_b = vol === null || vol === void 0 ? void 0 : vol.releaseDate) !== null && _b !== void 0 ? _b : '';
                                            return [2 /*return*/];
                                    }
                                });
                            }); }))];
                    case 2:
                        // Older catalogue payloads omit release dates, so fill only those gaps.
                        _c.sent();
                        ordered = __spreadArray([], catalogue, true).sort(function (a, b) {
                            return b.releaseDate.localeCompare(a.releaseDate);
                        });
                        _c.label = 3;
                    case 3: return [2 /*return*/, ordered.map(function (entry) { return ({
                            name: entry.name,
                            path: entry.path,
                            cover: entry.cover,
                        }); })];
                }
            });
        });
    };
    AnimeAnyway.prototype.normalize = function (value) {
        return value
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, ' ')
            .trim();
    };
    AnimeAnyway.prototype.score = function (name, term) {
        var a = this.normalize(name);
        var b = this.normalize(term);
        if (!a || !b)
            return 0;
        if (a === b)
            return 1000;
        if (a.startsWith(b))
            return 900;
        if (a.includes(b))
            return 800;
        var queryTokens = b.split(' ').filter(Boolean);
        var matched = queryTokens.filter(function (token) { return a.includes(token); }).length;
        if (matched === queryTokens.length)
            return 700;
        if (matched > 0)
            return Math.round((matched / queryTokens.length) * 500);
        return 0;
    };
    AnimeAnyway.prototype.searchNovels = function (searchTerm, pageNo) {
        return __awaiter(this, void 0, void 0, function () {
            var catalogue;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (pageNo > 1 || !searchTerm.trim())
                            return [2 /*return*/, []];
                        return [4 /*yield*/, this.getCatalogue()];
                    case 1:
                        catalogue = _a.sent();
                        return [2 /*return*/, catalogue
                                .map(function (entry) { return ({ entry: entry, score: _this.score(entry.name, searchTerm) }); })
                                .filter(function (_a) {
                                var score = _a.score;
                                return score > 0;
                            })
                                .sort(function (a, b) { return b.score - a.score; })
                                .map(function (_a) {
                                var entry = _a.entry;
                                return ({
                                    name: entry.name,
                                    path: entry.path,
                                    cover: entry.cover,
                                });
                            })];
                }
            });
        });
    };
    /** Reconstructs a Sanity CDN URL from a Portable Text image asset ref. */
    AnimeAnyway.prototype.resolveImageRef = function (ref) {
        var match = ref === null || ref === void 0 ? void 0 : ref.match(/^image-([a-f0-9]+)-(\d+x\d+)-(\w+)$/);
        if (!match)
            return undefined;
        return "".concat(this.sanityImageBase).concat(match[1], "-").concat(match[2], ".").concat(match[3]);
    };
    AnimeAnyway.prototype.renderPortableText = function (blocks) {
        var _a, _b;
        if (!blocks)
            return '';
        var parts = [];
        for (var _i = 0, blocks_1 = blocks; _i < blocks_1.length; _i++) {
            var block = blocks_1[_i];
            if (block._type === 'horizontalLine') {
                parts.push('<hr>');
            }
            else if (block._type === 'image') {
                var src = this.resolveImageRef((_a = block.asset) === null || _a === void 0 ? void 0 : _a._ref);
                if (src)
                    parts.push("<img src=\"".concat(src, "\">"));
            }
            else if (block._type === 'block') {
                var b = block;
                var tag = b.style === 'h2' ? 'h2' : 'p';
                var inner = ((_b = b.children) !== null && _b !== void 0 ? _b : [])
                    .map(function (span) {
                    var _a, _b, _c;
                    var text = (_a = span.text) !== null && _a !== void 0 ? _a : '';
                    if ((_b = span.marks) === null || _b === void 0 ? void 0 : _b.includes('strong'))
                        text = "<strong>".concat(text, "</strong>");
                    if ((_c = span.marks) === null || _c === void 0 ? void 0 : _c.includes('em'))
                        text = "<em>".concat(text, "</em>");
                    return text;
                })
                    .join('');
                if (inner.trim())
                    parts.push("<".concat(tag, ">").concat(inner, "</").concat(tag, ">"));
            }
            // Unrecognized block types are skipped rather than thrown on.
        }
        return parts.join('\n');
    };
    AnimeAnyway.prototype.plainTextFromPortableText = function (blocks) {
        if (!blocks)
            return undefined;
        var text = blocks
            .filter(function (block) {
            return block._type === 'block';
        })
            .map(function (block) { var _a; return ((_a = block.children) !== null && _a !== void 0 ? _a : []).map(function (span) { return span.text; }).join(''); })
            .filter(function (line) { return line.trim(); })
            .join('\n\n');
        return text || undefined;
    };
    AnimeAnyway.prototype.parseNovel = function (novelPath) {
        return __awaiter(this, void 0, void 0, function () {
            var novel, data, vol;
            var _a, _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        novel = {
                            path: novelPath,
                            name: novelPath,
                            cover: defaultCover_1.defaultCover,
                            status: novelStatus_1.NovelStatus.Ongoing,
                            chapters: [],
                        };
                        return [4 /*yield*/, this.fetchPageData(novelPath)];
                    case 1:
                        data = _e.sent();
                        vol = this.getVolume(data);
                        if (!vol) {
                            novel.summary = 'This novel is not available on Anime Anyway.';
                            return [2 /*return*/, novel];
                        }
                        novel.name = this.displayName(vol.title, vol.displayTitle);
                        novel.cover = (_c = (_b = (_a = vol.mainImage) === null || _a === void 0 ? void 0 : _a.asset) === null || _b === void 0 ? void 0 : _b.url) !== null && _c !== void 0 ? _c : defaultCover_1.defaultCover;
                        novel.summary = this.plainTextFromPortableText(vol.synopsis);
                        novel.chapters = ((_d = vol.chapters) !== null && _d !== void 0 ? _d : []).map(function (chapter, index) { return ({
                            name: chapter.title,
                            path: "".concat(novelPath, "/").concat(chapter.chkeyword),
                            chapterNumber: index + 1,
                        }); });
                        return [2 /*return*/, novel];
                }
            });
        });
    };
    AnimeAnyway.prototype.parseChapter = function (chapterPath) {
        return __awaiter(this, void 0, void 0, function () {
            var data, content, html;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.fetchPageData(chapterPath)];
                    case 1:
                        data = _b.sent();
                        content = (_a = data === null || data === void 0 ? void 0 : data.chapter) === null || _a === void 0 ? void 0 : _a.content;
                        if (!content)
                            return [2 /*return*/, '<p>This chapter is not available on Anime Anyway.</p>'];
                        html = this.renderPortableText(content);
                        return [2 /*return*/, html || '<p>This chapter appears to be empty.</p>'];
                }
            });
        });
    };
    return AnimeAnyway;
}());
exports.default = new AnimeAnyway();
