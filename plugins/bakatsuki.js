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
var cheerio_1 = require("cheerio");
var fetch_1 = require("@libs/fetch");
var filterInputs_1 = require("@libs/filterInputs");
var defaultCover_1 = require("@libs/defaultCover");
var novelStatus_1 = require("@libs/novelStatus");
var BakaTsuki = /** @class */ (function () {
    function BakaTsuki() {
        var _this = this;
        this.id = 'bakatsuki';
        this.name = 'Baka-Tsuki';
        this.version = '1.1.0';
        this.icon = 'src/en/bakatsuki/icon.png';
        this.site = 'https://www.baka-tsuki.org/project/';
        this.apiUrl = this.site + 'api.php';
        this.pageSize = 40;
        /**
         * The catalogue is exactly the wiki's own English light novel listing —
         * titles verbatim, romanised as Baka-Tsuki writes them.
         */
        this.catalogueCategory = 'Light novel (English)';
        /**
         * Read for status only, not for catalogue membership. These are
         * language-agnostic and would otherwise pull in translation siblings
         * ("Absolute Duo - Français").
         */
        this.statusCategories = {
            'Active Projects': novelStatus_1.NovelStatus.Ongoing,
            'Completed Project': novelStatus_1.NovelStatus.Completed,
            'Stalled Projects': novelStatus_1.NovelStatus.OnHiatus,
            'Inactive Projects': novelStatus_1.NovelStatus.Inactive,
            'Hosted Projects': novelStatus_1.NovelStatus.Ongoing,
        };
        this.nonEnglishPattern = /(?:^|[\s([~\-_])(?:fran[cç]ais|espa[nñ]ol|spanish|french|german|deutsch|italian|italiano|polski|polish|portugu[eê]s|portuguese|brazilian|russian|swedish|svenska|indonesia|indonesian|vietnamese|chinese|thai|turkish|t[uü]rk[cç]e|arabic|korean|japanese|dutch|nederlands|hungarian|magyar|romanian|greek|hebrew|persian|farsi|czech|bulgarian|serbian|croatian|finnish|danish|norwegian|ukrainian|latvian|lithuanian|estonian|slovak|slovenian|catalan|filipino|tagalog|malay|hindi|bengali|tamil|urdu)(?:$|[\s)\]~\-_:])|[\s\-~_](?:FR|PL|ES|DE|IT|PT|RU|VN|CN|TH|TR|AR|KR|JP|NL|HU|RO|GR|CZ|BG|RS|HR|FI|DK|NO|UA|SE|ID)$/i;
        /**
         * Sub-pages of a project (chapters, illustrations, staff pages). Used to keep
         * them out of novel lists — matching on a bare ":" would be wrong, since real
         * projects contain colons ("Anohana: The Flower We Saw That Day").
         */
        this.subPagePattern = /:(?:\s*)(?:Volume|Vol\.?|Chapter|Part|Book|Full[_ ]Text|Illustrations?|Prologue|Epilogue|Afterword|Side[_ ]Stor(?:y|ies)|Short[_ ]Stor(?:y|ies)|Names[_ ]and[_ ]Terminology|Registration|Registry|Updates?|Staff|Guidelines|Format|Historique|Enregistrement)/i;
        /**
         * Project scaffolding that shares the chapter prefix but isn't readable
         * content ("Absolute Duo:Registration", "…:Names and Terminology").
         */
        this.nonChapterPattern = /^(?:Registration|Registry|Archives?|Staff|Guidelines?|Updates?|Format|Names[\s_]and[\s_]Terminology|Terminology|Translation|Translators?|Editors?|Discussion|Sandbox|Talk|Status|References?|Credits?|To-?do|Feedback|Preview|Announcements?)/i;
        this.genrePattern = /^Category:Genre\s*-\s*(.+)$/i;
        /**
         * Publisher imprints and structural categories, excluded when guessing the
         * author from a page's category list.
         */
        this.nonAuthorCategoryPattern = /^(?:Light novel|Web novel|Original light novel|Visual novel|Audio novel|Genre|Hosted|Active|Completed|Inactive|Stalled|Teaser|Licensed|Pages? |Candidates|Articles|Project|Series|Novel|Manga)|(?:Bunko|Books|Publishing|Shoten|Shuppan|Kadokawa|Shueisha|Kodansha|Shogakukan|ASCII|Media Factory|Enterbrain|Hobby Japan|Overlap|SoftBank|Fujimi|Dengeki|Gagaga|Sneaker|Ichijinsha|Earth Star|Micro Magazine|TO Books|Alphapolis|Famitsu|Fantasia|Dash|Kobunsha|Takeshobo|Houbunsha|Media Works)/i;
        /**
         * Catalogue entries that had no sub-pages at all when last surveyed — nothing
         * to read, so they are hidden from search. Treated as *suspicion* only: each
         * is re-checked once per session before being hidden, so a project that gains
         * chapters reappears on its own rather than staying hidden until this list is
         * regenerated.
         */
        this.possiblyEmpty = new Set([
            'Allison',
            'Ark',
            'Clotaku Club!',
            'CtG—Zero Kara Sodateru Dennou Shoujo',
            'Etsusa Bridge',
            'Famima!',
            'Hikaru ga Chikyuu ni Itakoro......',
            'Hitotsu no Tairiki no Monogatari',
            "I'm a High School Boy and a Bestselling Light Novel author, strangled by my female classmate who is my junior and a voice actress",
            'Kamisu Reina Series',
            'Kill No More',
            'Lillia to Treize',
            'Maru-MA',
            'Meg to Seron',
            'Mushi to Medama',
            'Ojamajo Doremi 16',
            'Onii-chan Dakedo Ai Sae Areba Kankei Nai yo ne—',
            'Ore ga Ojou-Sama Gakkou ni ‘Shomin Sample’ Toshite Usarareta Ken',
            'Ore no Kanojo to Osananajimi ga Shuraba Sugiru ~Brazilian Portuguese~',
            'Ore no Nounai Sentakushi ga, Gakuen Love Come o Zenryoku de Jama Shiteiru',
            'Puppetmaster',
            'Remembrances for a certain pilot',
            'Sayonara Piano Sonata',
            'Sekai Ichi no Imouto-sama',
            'Sword of the Emperor',
            'Tabi ni Deyou, Horobiyuku Sekai no Hate Made',
            'Tsuki Tsuki!',
            'Tsukumodo Antique Shop',
            'Una Simple Revisión en Español',
            'Vamp!',
            "We Don't Open Anywhere -There are no facts, only interpretations.-",
            'White Album 2 Omake',
        ]);
        this.contentCache = new Map();
        this.cataloguePromise = null;
        this.catalogue = [];
        this.catalogueSet = new Set();
        this.statusByTitle = new Map();
        this.filters = {
            status: {
                label: 'Status',
                value: '',
                options: [
                    { label: 'All', value: '' },
                    { label: 'Active', value: novelStatus_1.NovelStatus.Ongoing },
                    { label: 'Completed', value: novelStatus_1.NovelStatus.Completed },
                    { label: 'Stalled', value: novelStatus_1.NovelStatus.OnHiatus },
                    { label: 'Inactive', value: novelStatus_1.NovelStatus.Inactive },
                ],
                type: filterInputs_1.FilterTypes.Picker,
            },
            order: {
                label: 'Order',
                value: 'asc',
                options: [
                    { label: 'A → Z', value: 'asc' },
                    { label: 'Z → A', value: 'desc' },
                ],
                type: filterInputs_1.FilterTypes.Picker,
            },
        };
        /** Page titles use underscores in URLs but spaces in the API. */
        this.toTitle = function (path) { return path.replace(/_/g, ' ').trim(); };
        this.toPath = function (title) { return title.replace(/ /g, '_'); };
        this.resolveUrl = function (path) {
            return "".concat(_this.site, "index.php?title=").concat(encodeURIComponent(_this.toTitle(path)));
        };
    }
    /* ------------------------------------------------------------------ */
    /* API plumbing                                                        */
    /* ------------------------------------------------------------------ */
    BakaTsuki.prototype.query = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var search, response, json;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        search = new URLSearchParams(__assign({ format: 'json', formatversion: '2' }, params));
                        return [4 /*yield*/, (0, fetch_1.fetchApi)("".concat(this.apiUrl, "?").concat(search.toString()))];
                    case 1:
                        response = _a.sent();
                        if (!response.ok) {
                            throw new Error("Baka-Tsuki returned ".concat(response.status, " ").concat(response.statusText));
                        }
                        return [4 /*yield*/, response.json()];
                    case 2:
                        json = (_a.sent());
                        if (json.error) {
                            throw new Error("Baka-Tsuki API error: ".concat(json.error.info));
                        }
                        return [2 /*return*/, json];
                }
            });
        });
    };
    BakaTsuki.prototype.categoryMembers = function (category) {
        return __awaiter(this, void 0, void 0, function () {
            var titles, cmcontinue, json, _i, _a, member;
            var _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        titles = [];
                        _e.label = 1;
                    case 1: return [4 /*yield*/, this.query(__assign({ action: 'query', list: 'categorymembers', cmtitle: "Category:".concat(category), cmnamespace: '0', cmtype: 'page', cmlimit: '500' }, (cmcontinue ? { cmcontinue: cmcontinue } : {})))];
                    case 2:
                        json = _e.sent();
                        for (_i = 0, _a = (_c = (_b = json.query) === null || _b === void 0 ? void 0 : _b.categorymembers) !== null && _c !== void 0 ? _c : []; _i < _a.length; _i++) {
                            member = _a[_i];
                            titles.push(member.title);
                        }
                        cmcontinue = (_d = json.continue) === null || _d === void 0 ? void 0 : _d.cmcontinue;
                        _e.label = 3;
                    case 3:
                        if (cmcontinue) return [3 /*break*/, 1];
                        _e.label = 4;
                    case 4: return [2 /*return*/, titles];
                }
            });
        });
    };
    /* ------------------------------------------------------------------ */
    /* Catalogue                                                           */
    /* ------------------------------------------------------------------ */
    /**
     * The catalogue is the wiki's English light novel category, taken as-is.
     * Status categories are read alongside it purely to populate the status map.
     * Cached for the session — six requests to build.
     */
    BakaTsuki.prototype.getCatalogue = function () {
        return __awaiter(this, void 0, void 0, function () {
            var error_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.cataloguePromise)
                            return [2 /*return*/, this.cataloguePromise];
                        this.cataloguePromise = (function () { return __awaiter(_this, void 0, void 0, function () {
                            var titles, _i, _a, title, _b, _c, _d, category, status_1, _e, _f, title;
                            return __generator(this, function (_g) {
                                switch (_g.label) {
                                    case 0:
                                        titles = new Set();
                                        _i = 0;
                                        return [4 /*yield*/, this.categoryMembers(this.catalogueCategory)];
                                    case 1:
                                        _a = _g.sent();
                                        _g.label = 2;
                                    case 2:
                                        if (!(_i < _a.length)) return [3 /*break*/, 4];
                                        title = _a[_i];
                                        if (!this.subPagePattern.test(title))
                                            titles.add(title);
                                        _g.label = 3;
                                    case 3:
                                        _i++;
                                        return [3 /*break*/, 2];
                                    case 4:
                                        _b = 0, _c = Object.entries(this.statusCategories);
                                        _g.label = 5;
                                    case 5:
                                        if (!(_b < _c.length)) return [3 /*break*/, 10];
                                        _d = _c[_b], category = _d[0], status_1 = _d[1];
                                        _e = 0;
                                        return [4 /*yield*/, this.categoryMembers(category)];
                                    case 6:
                                        _f = _g.sent();
                                        _g.label = 7;
                                    case 7:
                                        if (!(_e < _f.length)) return [3 /*break*/, 9];
                                        title = _f[_e];
                                        if (!this.statusByTitle.has(title)) {
                                            this.statusByTitle.set(title, status_1);
                                        }
                                        _g.label = 8;
                                    case 8:
                                        _e++;
                                        return [3 /*break*/, 7];
                                    case 9:
                                        _b++;
                                        return [3 /*break*/, 5];
                                    case 10:
                                        this.catalogue = Array.from(titles).sort(function (a, b) { return a.localeCompare(b); });
                                        this.catalogueSet = new Set(this.catalogue);
                                        return [2 /*return*/, this.catalogue];
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
                        this.cataloguePromise = null; // allow a retry after a transient failure
                        throw error_1;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /** Attaches cover thumbnails to a slice of titles. `titles` accepts 50/request. */
    BakaTsuki.prototype.withCovers = function (titles) {
        return __awaiter(this, void 0, void 0, function () {
            var novels, i, batch, json, covers, _i, _a, page, _b, novels_1, novel, cover, _c;
            var _this = this;
            var _d, _e, _f;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0:
                        novels = titles.map(function (title) { return ({
                            name: title,
                            path: _this.toPath(title),
                            cover: defaultCover_1.defaultCover,
                        }); });
                        i = 0;
                        _g.label = 1;
                    case 1:
                        if (!(i < titles.length)) return [3 /*break*/, 6];
                        batch = titles.slice(i, i + 50);
                        _g.label = 2;
                    case 2:
                        _g.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, this.query({
                                action: 'query',
                                titles: batch.join('|'),
                                prop: 'pageimages',
                                piprop: 'thumbnail',
                                pithumbsize: '300',
                                pilimit: '50',
                            })];
                    case 3:
                        json = _g.sent();
                        covers = new Map();
                        for (_i = 0, _a = (_e = (_d = json.query) === null || _d === void 0 ? void 0 : _d.pages) !== null && _e !== void 0 ? _e : []; _i < _a.length; _i++) {
                            page = _a[_i];
                            if ((_f = page.thumbnail) === null || _f === void 0 ? void 0 : _f.source)
                                covers.set(page.title, page.thumbnail.source);
                        }
                        for (_b = 0, novels_1 = novels; _b < novels_1.length; _b++) {
                            novel = novels_1[_b];
                            cover = covers.get(novel.name);
                            if (cover)
                                novel.cover = cover;
                        }
                        return [3 /*break*/, 5];
                    case 4:
                        _c = _g.sent();
                        return [3 /*break*/, 5];
                    case 5:
                        i += 50;
                        return [3 /*break*/, 1];
                    case 6: return [2 /*return*/, novels];
                }
            });
        });
    };
    /* ------------------------------------------------------------------ */
    /* Browse                                                              */
    /* ------------------------------------------------------------------ */
    /**
     * "Latest" maps to recently edited pages. Chapter edits are rolled up to
     * their parent project, which is what actually signals a new release.
     */
    BakaTsuki.prototype.latestTitles = function () {
        return __awaiter(this, void 0, void 0, function () {
            var catalogue, json, seen, ordered, _i, _a, change, parent_1, project, _b, catalogue_1, title;
            var _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0: return [4 /*yield*/, this.getCatalogue()];
                    case 1:
                        catalogue = _e.sent();
                        return [4 /*yield*/, this.query({
                                action: 'query',
                                list: 'recentchanges',
                                rcnamespace: '0',
                                rclimit: '500',
                                rctype: 'edit|new',
                                rcprop: 'title',
                            })];
                    case 2:
                        json = _e.sent();
                        seen = new Set();
                        ordered = [];
                        for (_i = 0, _a = (_d = (_c = json.query) === null || _c === void 0 ? void 0 : _c.recentchanges) !== null && _d !== void 0 ? _d : []; _i < _a.length; _i++) {
                            change = _a[_i];
                            parent_1 = change.title.split(':')[0].trim();
                            project = this.catalogueSet.has(change.title)
                                ? change.title
                                : this.catalogueSet.has(parent_1)
                                    ? parent_1
                                    : null;
                            if (project && !seen.has(project)) {
                                seen.add(project);
                                ordered.push(project);
                            }
                        }
                        // Pad with the catalogue so the list never dead-ends on a quiet wiki.
                        for (_b = 0, catalogue_1 = catalogue; _b < catalogue_1.length; _b++) {
                            title = catalogue_1[_b];
                            if (!seen.has(title)) {
                                seen.add(title);
                                ordered.push(title);
                            }
                        }
                        return [2 /*return*/, ordered];
                }
            });
        });
    };
    BakaTsuki.prototype.popularNovels = function (pageNo_1, _a) {
        return __awaiter(this, arguments, void 0, function (pageNo, _b) {
            var titles, _c, _d, status, start;
            var _this = this;
            var _e, _f;
            var showLatestNovels = _b.showLatestNovels, filters = _b.filters;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0:
                        if (!showLatestNovels) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.latestTitles()];
                    case 1:
                        _c = _g.sent();
                        return [3 /*break*/, 4];
                    case 2:
                        _d = [[]];
                        return [4 /*yield*/, this.getCatalogue()];
                    case 3:
                        _c = __spreadArray.apply(void 0, _d.concat([(_g.sent()), true]));
                        _g.label = 4;
                    case 4:
                        titles = _c;
                        status = (_e = filters === null || filters === void 0 ? void 0 : filters.status) === null || _e === void 0 ? void 0 : _e.value;
                        if (status) {
                            titles = titles.filter(function (title) { return _this.statusByTitle.get(title) === status; });
                        }
                        // Recency order is the point of the "latest" feed, so don't re-sort it.
                        if (!showLatestNovels && ((_f = filters === null || filters === void 0 ? void 0 : filters.order) === null || _f === void 0 ? void 0 : _f.value) === 'desc') {
                            titles.reverse();
                        }
                        start = (pageNo - 1) * this.pageSize;
                        if (start >= titles.length)
                            return [2 /*return*/, []];
                        return [2 /*return*/, this.withCovers(titles.slice(start, start + this.pageSize))];
                }
            });
        });
    };
    /* ------------------------------------------------------------------ */
    /* Search                                                              */
    /* ------------------------------------------------------------------ */
    BakaTsuki.prototype.normalize = function (value) {
        return value
            .normalize('NFD')
            .replace(/[̀-ͯ]/g, '')
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, ' ')
            .trim();
    };
    /**
     * Title-first relevance, so partial and out-of-order queries behave the way a
     * reader expects. The wiki's own full-text search ranks any page mentioning
     * the words, which buries the project page under its own chapters.
     */
    BakaTsuki.prototype.score = function (title, term) {
        var a = this.normalize(title);
        var b = this.normalize(term);
        if (!a || !b)
            return 0;
        if (a === b)
            return 1000;
        if (a.startsWith(b))
            return 900 - Math.min(a.length - b.length, 99);
        if (a.includes(b))
            return 800 - Math.min(a.length - b.length, 99);
        var queryTokens = b.split(' ').filter(Boolean);
        var titleTokens = a.split(' ').filter(Boolean);
        var matched = queryTokens.filter(function (token) {
            return titleTokens.some(function (candidate) { return candidate.startsWith(token); });
        }).length;
        if (matched === queryTokens.length)
            return 700 - Math.min(a.length, 99);
        if (matched > 0)
            return Math.round((matched / queryTokens.length) * 500);
        return 0;
    };
    BakaTsuki.prototype.searchNovels = function (searchTerm, pageNo) {
        return __awaiter(this, void 0, void 0, function () {
            var term, catalogue, json, titles, _a, scored, _i, catalogue_2, title, score, _b, prefix, fullText, remote, _c, remote_1, title, score, ranked, _d;
            var _this = this;
            var _e, _f, _g, _h, _j, _k;
            return __generator(this, function (_l) {
                switch (_l.label) {
                    case 0:
                        term = searchTerm.trim();
                        if (!term)
                            return [2 /*return*/, []];
                        return [4 /*yield*/, this.getCatalogue().catch(function () { return []; })];
                    case 1:
                        catalogue = _l.sent();
                        if (!(pageNo > 1)) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.query({
                                action: 'query',
                                list: 'search',
                                srsearch: term,
                                srnamespace: '0',
                                srlimit: String(this.pageSize),
                                sroffset: String((pageNo - 1) * this.pageSize),
                            })];
                    case 2:
                        json = _l.sent();
                        titles = ((_f = (_e = json.query) === null || _e === void 0 ? void 0 : _e.search) !== null && _f !== void 0 ? _f : [])
                            .map(function (result) { return result.title; })
                            .filter(function (title) { return _this.isNovelTitle(title); });
                        _a = this.withCovers;
                        return [4 /*yield*/, this.dropEmptyProjects(titles)];
                    case 3: return [2 /*return*/, _a.apply(this, [_l.sent()])];
                    case 4:
                        scored = new Map();
                        for (_i = 0, catalogue_2 = catalogue; _i < catalogue_2.length; _i++) {
                            title = catalogue_2[_i];
                            score = this.score(title, term);
                            if (score > 0)
                                scored.set(title, score);
                        }
                        return [4 /*yield*/, Promise.all([
                                this.query({
                                    action: 'query',
                                    list: 'prefixsearch',
                                    pssearch: term,
                                    psnamespace: '0',
                                    pslimit: '50',
                                }).catch(function () { return ({}); }),
                                this.query({
                                    action: 'query',
                                    list: 'search',
                                    srsearch: term,
                                    srnamespace: '0',
                                    srlimit: '50',
                                }).catch(function () { return ({}); }),
                            ])];
                    case 5:
                        _b = _l.sent(), prefix = _b[0], fullText = _b[1];
                        remote = __spreadArray(__spreadArray([], ((_h = (_g = prefix.query) === null || _g === void 0 ? void 0 : _g.prefixsearch) !== null && _h !== void 0 ? _h : []).map(function (r) { return r.title; }), true), ((_k = (_j = fullText.query) === null || _j === void 0 ? void 0 : _j.search) !== null && _k !== void 0 ? _k : []).map(function (r) { return r.title; }), true);
                        for (_c = 0, remote_1 = remote; _c < remote_1.length; _c++) {
                            title = remote_1[_c];
                            if (!this.isNovelTitle(title) || scored.has(title))
                                continue;
                            score = this.score(title, term);
                            if (score > 0)
                                scored.set(title, score - 50);
                        }
                        ranked = Array.from(scored.entries())
                            .sort(function (a, b) { return b[1] - a[1] || a[0].localeCompare(b[0]); })
                            .slice(0, this.pageSize)
                            .map(function (_a) {
                            var title = _a[0];
                            return title;
                        });
                        _d = this.withCovers;
                        return [4 /*yield*/, this.dropEmptyProjects(ranked)];
                    case 6: return [2 /*return*/, _d.apply(this, [_l.sent()])];
                }
            });
        });
    };
    /**
     * Chapter pages share namespace 0 with project pages. Catalogue membership is
     * the reliable test; the structural pattern is the fallback so uncategorised
     * projects stay findable.
     */
    /**
     * A handful of catalogue entries are project pages with no chapters behind
     * them, which are noise in search results. Verified with one cheap existence
     * probe, and only for titles already on the suspicion list — so a typical
     * search costs no extra requests.
     */
    BakaTsuki.prototype.hasReadableContent = function (title) {
        return __awaiter(this, void 0, void 0, function () {
            var prefix, json, hasContent, _a;
            var _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        prefix = "".concat(title.split(':')[0].trim(), ":");
                        _e.label = 1;
                    case 1:
                        _e.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.query({
                                action: 'query',
                                list: 'allpages',
                                apprefix: prefix,
                                apnamespace: '0',
                                aplimit: '1',
                            })];
                    case 2:
                        json = _e.sent();
                        hasContent = ((_d = (_c = (_b = json.query) === null || _b === void 0 ? void 0 : _b.allpages) === null || _c === void 0 ? void 0 : _c.length) !== null && _d !== void 0 ? _d : 0) > 0;
                        this.contentCache.set(title, hasContent);
                        return [2 /*return*/, hasContent];
                    case 3:
                        _a = _e.sent();
                        return [2 /*return*/, true]; // Never hide a novel because a probe failed.
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * A catalogue entry not on the suspicion list is known-good and costs nothing.
     * Everything else gets probed: suspicion-list entries so a revived project
     * un-hides itself, and non-catalogue hits because their provenance is unknown
     * — that is how the redirect "Vamp" → "Vamp!" and stray help pages get caught.
     */
    BakaTsuki.prototype.dropEmptyProjects = function (titles) {
        return __awaiter(this, void 0, void 0, function () {
            var probeBudget, probes, verdicts;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        probeBudget = 12;
                        probes = 0;
                        return [4 /*yield*/, Promise.all(titles.map(function (title) {
                                if (_this.catalogueSet.has(title) && !_this.possiblyEmpty.has(title)) {
                                    return true;
                                }
                                var cached = _this.contentCache.get(title);
                                if (cached !== undefined)
                                    return cached;
                                // Bounded so an odd query can't fan out into dozens of requests.
                                if (probes >= probeBudget)
                                    return true;
                                probes++;
                                return _this.hasReadableContent(title);
                            }))];
                    case 1:
                        verdicts = _a.sent();
                        return [2 /*return*/, titles.filter(function (_, index) { return verdicts[index]; })];
                }
            });
        });
    };
    BakaTsuki.prototype.isNovelTitle = function (title) {
        if (this.catalogueSet.has(title))
            return true;
        // Outside the catalogue, any colon is treated as a sub-page marker.
        // Enumerating chapter words per language does not scale — the wiki hosts
        // "…:Tome 1 Chapitre 1", ":Tom 1 Rozdział 2", ":Tập 2", ":Act 1". Real
        // colon-bearing projects are already covered by the catalogue check above.
        if (title.includes(':'))
            return false;
        // Translation siblings are parenthesised ("Fate/Zero (Biełaruś)",
        // "Absolute Duo (Swedish)"). Rejecting the bracket outright beats naming
        // every language; catalogue members are already exempt.
        if (/\([^)]+\)\s*$/.test(title))
            return false;
        return (!this.subPagePattern.test(title) && !this.nonEnglishPattern.test(title));
    };
    /* ------------------------------------------------------------------ */
    /* Novel                                                               */
    /* ------------------------------------------------------------------ */
    BakaTsuki.prototype.parseNovel = function (novelPath) {
        return __awaiter(this, void 0, void 0, function () {
            var requestedTitle, novel, metaJson, page, summary, categories, genres, author, _a;
            var _this = this;
            var _b, _c, _d, _e;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        requestedTitle = this.toTitle(novelPath);
                        novel = {
                            path: novelPath,
                            name: requestedTitle,
                            cover: defaultCover_1.defaultCover,
                            chapters: [],
                        };
                        return [4 /*yield*/, this.query({
                                action: 'query',
                                titles: requestedTitle,
                                prop: 'extracts|pageimages|categories',
                                explaintext: '1',
                                exsectionformat: 'raw',
                                piprop: 'thumbnail',
                                pithumbsize: '400',
                                cllimit: 'max',
                                clshow: '!hidden',
                                redirects: '1',
                            })];
                    case 1:
                        metaJson = _f.sent();
                        page = (_c = (_b = metaJson.query) === null || _b === void 0 ? void 0 : _b.pages) === null || _c === void 0 ? void 0 : _c[0];
                        if (!page || page.missing) {
                            novel.summary = 'This project is not available on Baka-Tsuki.';
                            return [2 /*return*/, novel];
                        }
                        novel.name = page.title;
                        if ((_d = page.thumbnail) === null || _d === void 0 ? void 0 : _d.source)
                            novel.cover = page.thumbnail.source;
                        summary = this.extractSummary(page.extract);
                        if (summary)
                            novel.summary = summary;
                        categories = ((_e = page.categories) !== null && _e !== void 0 ? _e : []).map(function (category) { return category.title; });
                        genres = categories
                            .map(function (category) { var _a, _b; return (_b = (_a = category.match(_this.genrePattern)) === null || _a === void 0 ? void 0 : _a[1]) === null || _b === void 0 ? void 0 : _b.trim(); })
                            .filter(function (genre) { return Boolean(genre); });
                        if (genres.length)
                            novel.genres = genres.join(',');
                        novel.status = this.resolveStatus(categories, page.title);
                        author = this.resolveAuthor(categories);
                        if (author)
                            novel.author = author;
                        _a = novel;
                        return [4 /*yield*/, this.parseChapterList(page.title)];
                    case 2:
                        _a.chapters = _f.sent();
                        return [2 /*return*/, novel];
                }
            });
        });
    };
    /**
     * Project pages open with wiki housekeeping — a registration prompt, project
     * status, translation notices — so the lead section is rarely the synopsis.
     * Prefer an explicitly titled synopsis section and fall back to the first
     * paragraph that isn't boilerplate.
     */
    BakaTsuki.prototype.extractSummary = function (extract) {
        if (!extract)
            return undefined;
        var boilerplate = /^(?:only available to registered users|register here|please read|this project|the project|as of |note:|warning:|attention|status:|translation|editing|recruit)|available in the following languages|this project has been|has been (?:restored|licensed|removed|discontinued|taken down)|do you (?:follow|want)/i;
        var sections = extract.split(/^\s*=+\s*(.+?)\s*=+\s*$/m);
        // split() yields [lead, heading, body, heading, body, ...]
        for (var i = 1; i < sections.length; i += 2) {
            if (!/synopsis|summary|story|plot|description|about/i.test(sections[i])) {
                continue;
            }
            var body = this.cleanParagraphs(sections[i + 1], boilerplate);
            if (body)
                return body;
        }
        return this.cleanParagraphs(sections[0], boilerplate);
    };
    BakaTsuki.prototype.cleanParagraphs = function (text, boilerplate) {
        if (!text)
            return undefined;
        var kept = text
            .split(/\n+/)
            .map(function (line) { return line.replace(/\s+/g, ' ').trim(); })
            .filter(function (line) { return line.length > 40 && !boilerplate.test(line); });
        if (!kept.length)
            return undefined;
        var summary = kept.join('\n\n');
        return summary.length > 1500 ? "".concat(summary.slice(0, 1497), "...") : summary;
    };
    BakaTsuki.prototype.resolveStatus = function (categories, title) {
        var _a;
        for (var _i = 0, categories_1 = categories; _i < categories_1.length; _i++) {
            var category = categories_1[_i];
            var name_1 = category.replace(/^Category:/, '');
            var status_2 = this.statusCategories[name_1];
            if (status_2)
                return status_2;
        }
        return (_a = this.statusByTitle.get(title)) !== null && _a !== void 0 ? _a : novelStatus_1.NovelStatus.Unknown;
    };
    /**
     * Baka-Tsuki files projects under a category named after the author, mixed in
     * with publisher imprints and structural tags. An omitted author is correct;
     * a guessed one is not, so anything that doesn't look like a personal name is
     * discarded.
     */
    BakaTsuki.prototype.resolveAuthor = function (categories) {
        for (var _i = 0, categories_2 = categories; _i < categories_2.length; _i++) {
            var category = categories_2[_i];
            var name_2 = category.replace(/^Category:/, '').trim();
            if (this.genrePattern.test(category))
                continue;
            if (this.nonAuthorCategoryPattern.test(name_2))
                continue;
            if (/\d/.test(name_2))
                continue;
            if (name_2.split(/\s+/).length < 2)
                continue;
            return name_2;
        }
        return undefined;
    };
    /* ------------------------------------------------------------------ */
    /* Chapter list                                                        */
    /* ------------------------------------------------------------------ */
    BakaTsuki.prototype.parseChapterList = function (novelTitle) {
        return __awaiter(this, void 0, void 0, function () {
            var json, html, $, fullTitle, prefixes, shortTitle, seen, candidates, chaptersPerVolume, _i, candidates_1, candidate, kept, chapters;
            var _this = this;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, this.query({
                            action: 'parse',
                            page: novelTitle,
                            prop: 'text',
                            disableeditsection: '1',
                            disabletoc: '1',
                            redirects: '1',
                        }).catch(function () { return ({}); })];
                    case 1:
                        json = _c.sent();
                        html = (_a = json.parse) === null || _a === void 0 ? void 0 : _a.text;
                        if (!html)
                            return [2 /*return*/, []];
                        $ = (0, cheerio_1.load)(html);
                        fullTitle = novelTitle.replace(/_/g, ' ');
                        prefixes = ["".concat(fullTitle, ":")];
                        shortTitle = fullTitle.split(':')[0].trim();
                        if (shortTitle && shortTitle !== fullTitle)
                            prefixes.push("".concat(shortTitle, ":"));
                        seen = new Set();
                        candidates = [];
                        // Document order is what preserves reading order — the API's allpages list
                        // is alphabetical, which puts Chapter 10 before Chapter 2.
                        $('a[href]').each(function (_, element) {
                            var _a, _b, _c, _d, _e;
                            var anchor = $(element);
                            var classes = ((_a = anchor.attr('class')) !== null && _a !== void 0 ? _a : '').split(/\s+/);
                            if (classes.includes('new') || classes.includes('external'))
                                return;
                            var href = (_b = anchor.attr('href')) !== null && _b !== void 0 ? _b : '';
                            if (/^(?:https?:)?\/\//.test(href))
                                return;
                            if (/\.(?:pdf|epub|mobi|zip|rar|7z|docx?)$/i.test(href))
                                return;
                            if (/[?&]action=edit/.test(href))
                                return;
                            var rawTitle = (_c = anchor.attr('title')) === null || _c === void 0 ? void 0 : _c.trim();
                            if (!rawTitle || /\(page does not exist\)$/i.test(rawTitle))
                                return;
                            var title = rawTitle.replace(/_/g, ' ');
                            var prefix = prefixes.find(function (candidate) { return title.startsWith(candidate); });
                            if (!prefix)
                                return;
                            if (/^(?:File|Image|Category|Template|Help|User|Talk|Special):/i.test(title)) {
                                return;
                            }
                            var label = anchor.text().replace(/\s+/g, ' ').trim();
                            var suffix = title.slice(prefix.length).trim();
                            // Project scaffolding lives under the same prefix as the chapters.
                            if (_this.nonChapterPattern.test(suffix))
                                return;
                            var path = _this.toPath(title);
                            if (seen.has(path))
                                return;
                            seen.add(path);
                            candidates.push({
                                title: title,
                                name: label || suffix,
                                volume: (_e = (_d = suffix.match(/(?:Volume|Vol\.?)[\s_]*(\d+)/i)) === null || _d === void 0 ? void 0 : _d[1]) !== null && _e !== void 0 ? _e : '',
                                // The whole-volume page is often titled "…:Volume 1" and only the link
                                // text says "Full Text", so both have to be checked.
                                isFullText: /Full[\s_]*Text/i.test(suffix) || /^Full[\s_]*Text$/i.test(label),
                            });
                        });
                        chaptersPerVolume = new Map();
                        for (_i = 0, candidates_1 = candidates; _i < candidates_1.length; _i++) {
                            candidate = candidates_1[_i];
                            if (!candidate.isFullText) {
                                chaptersPerVolume.set(candidate.volume, ((_b = chaptersPerVolume.get(candidate.volume)) !== null && _b !== void 0 ? _b : 0) + 1);
                            }
                        }
                        kept = candidates.filter(function (candidate) {
                            return !candidate.isFullText || !chaptersPerVolume.get(candidate.volume);
                        });
                        chapters = kept
                            .map(function (candidate, index) { return ({ candidate: candidate, index: index }); })
                            .sort(function (a, b) {
                            var left = a.candidate.volume ? Number(a.candidate.volume) : Infinity;
                            var right = b.candidate.volume
                                ? Number(b.candidate.volume)
                                : Infinity;
                            return left === right ? a.index - b.index : left - right;
                        })
                            .map(function (_a, index) {
                            var candidate = _a.candidate;
                            return ({
                                name: candidate.name,
                                path: _this.toPath(candidate.title),
                                chapterNumber: index + 1,
                                page: candidate.volume ? "Volume ".concat(candidate.volume) : 'Other',
                            });
                        });
                        return [4 /*yield*/, this.attachReleaseTimes(chapters)];
                    case 2:
                        _c.sent();
                        return [2 /*return*/, chapters];
                }
            });
        });
    };
    /**
     * Last-edit timestamps, batched 50 per request and capped — Baka-Tsuki is a
     * small community server and a long project would otherwise fan out into
     * dozens of calls. Best-effort: failures leave the field unset.
     */
    BakaTsuki.prototype.attachReleaseTimes = function (chapters) {
        return __awaiter(this, void 0, void 0, function () {
            var maxBatches, byTitle, titles, i, batch, json, _i, _a, page, timestamp, chapter, _b;
            var _this = this;
            var _c, _d, _e, _f;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0:
                        maxBatches = 4;
                        byTitle = new Map(chapters.map(function (chapter) { return [_this.toTitle(chapter.path), chapter]; }));
                        titles = Array.from(byTitle.keys()).slice(0, maxBatches * 50);
                        i = 0;
                        _g.label = 1;
                    case 1:
                        if (!(i < titles.length)) return [3 /*break*/, 6];
                        batch = titles.slice(i, i + 50);
                        _g.label = 2;
                    case 2:
                        _g.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, this.query({
                                action: 'query',
                                titles: batch.join('|'),
                                prop: 'revisions',
                                rvprop: 'timestamp',
                            })];
                    case 3:
                        json = _g.sent();
                        for (_i = 0, _a = (_d = (_c = json.query) === null || _c === void 0 ? void 0 : _c.pages) !== null && _d !== void 0 ? _d : []; _i < _a.length; _i++) {
                            page = _a[_i];
                            timestamp = (_f = (_e = page.revisions) === null || _e === void 0 ? void 0 : _e[0]) === null || _f === void 0 ? void 0 : _f.timestamp;
                            chapter = byTitle.get(page.title);
                            if (timestamp && chapter) {
                                chapter.releaseTime = timestamp.slice(0, 10);
                            }
                        }
                        return [3 /*break*/, 5];
                    case 4:
                        _b = _g.sent();
                        return [2 /*return*/];
                    case 5:
                        i += 50;
                        return [3 /*break*/, 1];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    /* ------------------------------------------------------------------ */
    /* Chapter                                                             */
    /* ------------------------------------------------------------------ */
    BakaTsuki.prototype.parseChapter = function (chapterPath) {
        return __awaiter(this, void 0, void 0, function () {
            var json, html, $, origin, absolute, content;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.query({
                            action: 'parse',
                            page: this.toTitle(chapterPath),
                            prop: 'text',
                            disableeditsection: '1',
                            disabletoc: '1',
                            redirects: '1',
                        }).catch(function () { return ({}); })];
                    case 1:
                        json = _b.sent();
                        html = (_a = json.parse) === null || _a === void 0 ? void 0 : _a.text;
                        if (!html)
                            return [2 /*return*/, '<p>This chapter is not available on Baka-Tsuki.</p>'];
                        $ = (0, cheerio_1.load)(html);
                        $('.mw-editsection, #toc, .toc, .navbox, .printfooter, .catlinks, ' +
                            '.mw-jump-link, .noprint, #siteSub, .mw-empty-elt, #contentSub, ' +
                            '.mw-references-wrap ~ .navbox, script, style').remove();
                        // Chapter navigation sits in a table at the top and bottom of most pages,
                        // but not reliably in the same position — match on content instead.
                        $('table').each(function (_, element) {
                            var table = $(element);
                            if (/Back to|Return to|Forward to|Main Page/i.test(table.text())) {
                                table.remove();
                            }
                        });
                        origin = new URL(this.site).origin;
                        absolute = function (value) {
                            return value.startsWith('//')
                                ? "https:".concat(value)
                                : value.startsWith('/')
                                    ? origin + value
                                    : value;
                        };
                        $('img[src]').each(function (_, element) {
                            var _a;
                            var img = $(element);
                            img.attr('src', absolute((_a = img.attr('src')) !== null && _a !== void 0 ? _a : ''));
                            img.removeAttr('srcset');
                        });
                        $('a[href]').each(function (_, element) {
                            var _a;
                            var anchor = $(element);
                            anchor.attr('href', absolute((_a = anchor.attr('href')) !== null && _a !== void 0 ? _a : ''));
                        });
                        content = $.html().trim();
                        return [2 /*return*/, content || '<p>This chapter appears to be empty.</p>'];
                }
            });
        });
    };
    return BakaTsuki;
}());
exports.default = new BakaTsuki();
