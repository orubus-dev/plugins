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
var htmlparser2_1 = require("htmlparser2");
var fetch_1 = require("@libs/fetch");
var filterInputs_1 = require("@libs/filterInputs");
var novelStatus_1 = require("@libs/novelStatus");
var isAbsoluteUrl_1 = require("@libs/isAbsoluteUrl");
var storage_1 = require("@libs/storage");
var RoyalRoad = /** @class */ (function () {
    function RoyalRoad() {
        this.id = 'royalroad';
        this.name = 'Royal Road';
        this.version = '2.3.4';
        this.icon = 'src/en/royalroad/icon.png';
        this.site = 'https://www.royalroad.com/';
        this.enableVol = storage_1.storage.get('enableVol');
        this.pluginSettings = {
            enableVol: {
                value: '',
                label: 'Enable Pagination / Volume view (not recommended)',
                type: 'Switch',
            },
        };
        this.filters = {
            'keyword': {
                'type': filterInputs_1.FilterTypes.TextInput,
                'label': 'Keyword (title or description)',
                'value': '',
            },
            'author': {
                'type': filterInputs_1.FilterTypes.TextInput,
                'label': 'Author',
                'value': '',
            },
            'genres': {
                'type': filterInputs_1.FilterTypes.ExcludableCheckboxGroup,
                'label': 'Genres',
                'value': {
                    'include': [],
                    'exclude': [],
                },
                'options': [
                    {
                        'label': 'Action',
                        'value': 'action',
                    },
                    {
                        'label': 'Adventure',
                        'value': 'adventure',
                    },
                    {
                        'label': 'Comedy',
                        'value': 'comedy',
                    },
                    {
                        'label': 'Contemporary',
                        'value': 'contemporary',
                    },
                    {
                        'label': 'Drama',
                        'value': 'drama',
                    },
                    {
                        'label': 'Fantasy',
                        'value': 'fantasy',
                    },
                    {
                        'label': 'Historical',
                        'value': 'historical',
                    },
                    {
                        'label': 'Horror',
                        'value': 'horror',
                    },
                    {
                        'label': 'Mystery',
                        'value': 'mystery',
                    },
                    {
                        'label': 'Psychological',
                        'value': 'psychological',
                    },
                    {
                        'label': 'Romance',
                        'value': 'romance',
                    },
                    {
                        'label': 'Satire',
                        'value': 'satire',
                    },
                    {
                        'label': 'Sci-fi',
                        'value': 'sci_fi',
                    },
                    {
                        'label': 'Short Story',
                        'value': 'one_shot',
                    },
                    {
                        'label': 'Tragedy',
                        'value': 'tragedy',
                    },
                ],
            },
            'tags': {
                'type': filterInputs_1.FilterTypes.ExcludableCheckboxGroup,
                'label': 'Tags',
                'value': {
                    'include': [],
                    'exclude': [],
                },
                'options': [
                    {
                        'label': 'Anti-Hero Lead',
                        'value': 'anti-hero_lead',
                    },
                    {
                        'label': 'Artificial Intelligence',
                        'value': 'artificial_intelligence',
                    },
                    {
                        'label': 'Attractive Lead',
                        'value': 'attractive_lead',
                    },
                    {
                        'label': 'Cyberpunk',
                        'value': 'cyberpunk',
                    },
                    {
                        'label': 'Dungeon',
                        'value': 'dungeon',
                    },
                    {
                        'label': 'Dystopia',
                        'value': 'dystopia',
                    },
                    {
                        'label': 'Female Lead',
                        'value': 'female_lead',
                    },
                    {
                        'label': 'First Contact',
                        'value': 'first_contact',
                    },
                    {
                        'label': 'GameLit',
                        'value': 'gamelit',
                    },
                    {
                        'label': 'Gender Bender',
                        'value': 'gender_bender',
                    },
                    {
                        'label': 'Genetically Engineered',
                        'value': 'genetically_engineered ',
                    },
                    {
                        'label': 'Grimdark',
                        'value': 'grimdark',
                    },
                    {
                        'label': 'Hard Sci-fi',
                        'value': 'hard_sci-fi',
                    },
                    {
                        'label': 'Harem',
                        'value': 'harem',
                    },
                    {
                        'label': 'High Fantasy',
                        'value': 'high_fantasy',
                    },
                    {
                        'label': 'LitRPG',
                        'value': 'litrpg',
                    },
                    {
                        'label': 'Low Fantasy',
                        'value': 'low_fantasy',
                    },
                    {
                        'label': 'Magic',
                        'value': 'magic',
                    },
                    {
                        'label': 'Male Lead',
                        'value': 'male_lead',
                    },
                    {
                        'label': 'Martial Arts',
                        'value': 'martial_arts',
                    },
                    {
                        'label': 'Multiple Lead Characters',
                        'value': 'multiple_lead',
                    },
                    {
                        'label': 'Mythos',
                        'value': 'mythos',
                    },
                    {
                        'label': 'Non-Human Lead',
                        'value': 'non-human_lead',
                    },
                    {
                        'label': 'Portal Fantasy / Isekai',
                        'value': 'summoned_hero',
                    },
                    {
                        'label': 'Post Apocalyptic',
                        'value': 'post_apocalyptic',
                    },
                    {
                        'label': 'Progression',
                        'value': 'progression',
                    },
                    {
                        'label': 'Reader Interactive',
                        'value': 'reader_interactive',
                    },
                    {
                        'label': 'Reincarnation',
                        'value': 'reincarnation',
                    },
                    {
                        'label': 'Ruling Class',
                        'value': 'ruling_class',
                    },
                    {
                        'label': 'School Life',
                        'value': 'school_life',
                    },
                    {
                        'label': 'Secret Identity',
                        'value': 'secret_identity',
                    },
                    {
                        'label': 'Slice of Life',
                        'value': 'slice_of_life',
                    },
                    {
                        'label': 'Soft Sci-fi',
                        'value': 'soft_sci-fi',
                    },
                    {
                        'label': 'Space Opera',
                        'value': 'space_opera',
                    },
                    {
                        'label': 'Sports',
                        'value': 'sports',
                    },
                    {
                        'label': 'Steampunk',
                        'value': 'steampunk',
                    },
                    {
                        'label': 'Strategy',
                        'value': 'strategy',
                    },
                    {
                        'label': 'Strong Lead',
                        'value': 'strong_lead',
                    },
                    {
                        'label': 'Super Heroes',
                        'value': 'super_heroes',
                    },
                    {
                        'label': 'Supernatural',
                        'value': 'supernatural',
                    },
                    {
                        'label': 'Technologically Engineered',
                        'value': 'technologically_engineered',
                    },
                    {
                        'label': 'Time Loop',
                        'value': 'loop',
                    },
                    {
                        'label': 'Time Travel',
                        'value': 'time_travel',
                    },
                    {
                        'label': 'Urban Fantasy',
                        'value': 'urban_fantasy',
                    },
                    {
                        'label': 'Villainous Lead',
                        'value': 'villainous_lead',
                    },
                    {
                        'label': 'Virtual Reality',
                        'value': 'virtual_reality',
                    },
                    {
                        'label': 'War and Military',
                        'value': 'war_and_military',
                    },
                    {
                        'label': 'Wuxia',
                        'value': 'wuxia',
                    },
                    {
                        'label': 'Xianxia',
                        'value': 'xianxia',
                    },
                ],
            },
            'content_warnings': {
                'type': filterInputs_1.FilterTypes.ExcludableCheckboxGroup,
                'label': 'Content Warnings',
                'value': {
                    'include': [],
                    'exclude': [],
                },
                'options': [
                    {
                        'label': 'Profanity',
                        'value': 'profanity',
                    },
                    {
                        'label': 'Sexual Content',
                        'value': 'sexuality',
                    },
                    {
                        'label': 'Graphic Violence',
                        'value': 'graphic_violence',
                    },
                    {
                        'label': 'Sensitive Content',
                        'value': 'sensitive',
                    },
                    {
                        'label': 'AI-Assisted Content',
                        'value': 'ai_assisted',
                    },
                    {
                        'label': 'AI-Generated Content',
                        'value': 'ai_generated',
                    },
                ],
            },
            'minPages': {
                'type': filterInputs_1.FilterTypes.TextInput,
                'label': 'Min Pages',
                'value': '0',
            },
            'maxPages': {
                'type': filterInputs_1.FilterTypes.TextInput,
                'label': 'Max Pages',
                'value': '20000',
            },
            'minRating': {
                'type': filterInputs_1.FilterTypes.TextInput,
                'label': 'Min Rating (0.0 - 5.0)',
                'value': '0.0',
            },
            'maxRating': {
                'type': filterInputs_1.FilterTypes.TextInput,
                'label': 'Max Rating (0.0 - 5.0)',
                'value': '5.0',
            },
            'status': {
                'type': filterInputs_1.FilterTypes.Picker,
                'label': 'Status',
                'value': 'ALL',
                'options': [
                    {
                        'label': 'All',
                        'value': 'ALL',
                    },
                    {
                        'label': 'Completed',
                        'value': 'COMPLETED',
                    },
                    {
                        'label': 'Dropped',
                        'value': 'DROPPED',
                    },
                    {
                        'label': 'Ongoing',
                        'value': 'ONGOING',
                    },
                    {
                        'label': 'Hiatus',
                        'value': 'HIATUS',
                    },
                    {
                        'label': 'Stub',
                        'value': 'STUB',
                    },
                ],
            },
            'orderBy': {
                'type': filterInputs_1.FilterTypes.Picker,
                'label': 'Order by',
                'value': 'relevance',
                'options': [
                    {
                        'label': 'Relevance',
                        'value': 'relevance',
                    },
                    {
                        'label': 'Popularity',
                        'value': 'popularity',
                    },
                    {
                        'label': 'Average Rating',
                        'value': 'rating',
                    },
                    {
                        'label': 'Last Update',
                        'value': 'last_update',
                    },
                    {
                        'label': 'Release Date',
                        'value': 'release_date',
                    },
                    {
                        'label': 'Followers',
                        'value': 'followers',
                    },
                    {
                        'label': 'Number of Pages',
                        'value': 'length',
                    },
                    {
                        'label': 'Views',
                        'value': 'views',
                    },
                    {
                        'label': 'Title',
                        'value': 'title',
                    },
                    {
                        'label': 'Author',
                        'value': 'author',
                    },
                ],
            },
            'dir': {
                'type': filterInputs_1.FilterTypes.Picker,
                'label': 'Direction',
                'value': 'desc',
                'options': [
                    {
                        'label': 'Ascending',
                        'value': 'asc',
                    },
                    {
                        'label': 'Descending',
                        'value': 'desc',
                    },
                ],
            },
            'type': {
                'type': filterInputs_1.FilterTypes.Picker,
                'label': 'Type',
                'value': 'ALL',
                'options': [
                    {
                        'label': 'All',
                        'value': 'ALL',
                    },
                    {
                        'label': 'Fan Fiction',
                        'value': 'fanfiction',
                    },
                    {
                        'label': 'Original',
                        'value': 'original',
                    },
                ],
            },
        };
    }
    // Royal Road puts an Anubis proof-of-work check in front of its pages. Until
    // the client has the Anubis cookie, every page is the check page (HTTP 200).
    // Pass the check the same way a browser does. The app keeps the cookie for
    // later requests, until the IP address changes or the cookie expires.
    RoyalRoad.prototype.fetchHtml = function (url) {
        return __awaiter(this, void 0, void 0, function () {
            var html, challenge, page;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!anubisCheck) return [3 /*break*/, 2];
                        return [4 /*yield*/, anubisCheck.catch(function () { return ''; })];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [4 /*yield*/, fetchPageHtml(url)];
                    case 3:
                        html = _a.sent();
                        challenge = readAnubisChallenge(html);
                        if (!challenge)
                            return [2 /*return*/, html];
                        if (!anubisCheck) return [3 /*break*/, 6];
                        return [4 /*yield*/, anubisCheck];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, fetchPageHtml(url)];
                    case 5:
                        page = _a.sent();
                        return [3 /*break*/, 10];
                    case 6:
                        anubisCheck = passAnubisChallenge(html, challenge, url);
                        _a.label = 7;
                    case 7:
                        _a.trys.push([7, , 9, 10]);
                        return [4 /*yield*/, anubisCheck];
                    case 8:
                        page = _a.sent();
                        return [3 /*break*/, 10];
                    case 9:
                        anubisCheck = undefined;
                        return [7 /*endfinally*/];
                    case 10:
                        if (readAnubisChallenge(page))
                            throw new Error(BOT_CHECK_ERROR);
                        return [2 /*return*/, page];
                }
            });
        });
    };
    RoyalRoad.prototype.parseNovels = function (html) {
        var baseUrl = this.site;
        var novels = [];
        var tempNovel = {};
        var state = ParsingState.Idle;
        var parser = new htmlparser2_1.Parser({
            onopentag: function (name, attribs) {
                var _a;
                if ((_a = attribs['class']) === null || _a === void 0 ? void 0 : _a.includes('fiction-list-item')) {
                    state = ParsingState.Novel;
                }
                if (state !== ParsingState.Novel)
                    return;
                switch (name) {
                    case 'a':
                        if (attribs['href']) {
                            tempNovel.path = attribs['href'].split('/').slice(1, 3).join('/');
                        }
                        break;
                    case 'img':
                        if (attribs['src']) {
                            tempNovel.name = attribs['alt'] || '';
                            tempNovel.cover = !(0, isAbsoluteUrl_1.isUrlAbsolute)(attribs['src'])
                                ? baseUrl + attribs['src'].slice(1)
                                : attribs['src'];
                        }
                        break;
                }
            },
            onclosetag: function (name) {
                if (name === 'figure') {
                    if (tempNovel.path && tempNovel.name) {
                        novels.push(tempNovel);
                        tempNovel = {};
                    }
                    state = ParsingState.Idle;
                }
            },
        });
        parser.write(html);
        parser.end();
        return novels;
    };
    RoyalRoad.prototype.popularNovels = function (page_1, _a) {
        return __awaiter(this, arguments, void 0, function (page, _b) {
            var params, key, _i, _c, include, _d, _e, exclude, link, body;
            var filters = _b.filters, showLatestNovels = _b.showLatestNovels;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        params = new URLSearchParams({
                            page: page.toString(),
                        });
                        if (showLatestNovels) {
                            params.append('orderBy', 'last_update');
                        }
                        if (!filters)
                            filters = this.filters || {};
                        for (key in filters) {
                            if (filters[key].value === '')
                                continue;
                            if (key === 'genres' || key === 'tags' || key === 'content_warnings') {
                                if (filters[key].value.include) {
                                    for (_i = 0, _c = filters[key].value.include; _i < _c.length; _i++) {
                                        include = _c[_i];
                                        params.append('tagsAdd', include);
                                    }
                                }
                                if (filters[key].value.exclude) {
                                    for (_d = 0, _e = filters[key].value.exclude; _d < _e.length; _d++) {
                                        exclude = _e[_d];
                                        params.append('tagsRemove', exclude);
                                    }
                                }
                            }
                            else {
                                params.append(key, String(filters[key].value));
                            }
                        }
                        link = "".concat(this.site, "fictions/search?").concat(params.toString());
                        return [4 /*yield*/, this.fetchHtml(link)];
                    case 1:
                        body = _f.sent();
                        return [2 /*return*/, this.parseNovels(body)];
                }
            });
        });
    };
    RoyalRoad.prototype.parseNovel = function (novelPath) {
        return __awaiter(this, void 0, void 0, function () {
            var html, novel, baseUrl, parseChapters, state, statusText, statusSpanCounter, nameParts, summaryParts, scriptContentParts, genreArray, parser;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.fetchHtml(this.site + novelPath)];
                    case 1:
                        html = _a.sent();
                        novel = {
                            path: novelPath,
                        };
                        baseUrl = this.site;
                        parseChapters = function (scriptContent) {
                            return _this.parseChapters(scriptContent);
                        };
                        state = ParsingState.Idle;
                        statusText = '';
                        statusSpanCounter = 0;
                        nameParts = [];
                        summaryParts = [];
                        scriptContentParts = [];
                        genreArray = [];
                        parser = new htmlparser2_1.Parser({
                            onopentag: function (name, attribs) {
                                var _a, _b, _c, _d;
                                switch (name) {
                                    case 'h1':
                                        state = ParsingState.InTitle;
                                        break;
                                    case 'a':
                                        if (((_a = attribs['href']) === null || _a === void 0 ? void 0 : _a.startsWith('/profile/')) && !novel.author) {
                                            state = ParsingState.InAuthor;
                                        }
                                        else if (state === ParsingState.InTags) {
                                            state = ParsingState.InTagLink;
                                        }
                                        break;
                                    case 'div':
                                        if (attribs['class'] === 'description') {
                                            state = ParsingState.InDescription;
                                        }
                                        break;
                                    case 'hr':
                                        if (state === ParsingState.InDescription) {
                                            summaryParts.push('\n\n---\n\n');
                                        }
                                        break;
                                    case 'br':
                                        if (state === ParsingState.InDescription) {
                                            summaryParts.push('\n\n');
                                        }
                                        break;
                                    case 'span':
                                        if ((_b = attribs['class']) === null || _b === void 0 ? void 0 : _b.includes('tags')) {
                                            state = ParsingState.InTags;
                                        }
                                        else if ((_c = attribs['class']) === null || _c === void 0 ? void 0 : _c.includes('label-sm')) {
                                            statusSpanCounter++;
                                            if (statusSpanCounter === 2) {
                                                state = ParsingState.InStatusSpan;
                                                statusText = '';
                                            }
                                        }
                                        break;
                                    case 'img':
                                        if ((_d = attribs['class']) === null || _d === void 0 ? void 0 : _d.includes('thumbnail')) {
                                            novel.cover = attribs['src'];
                                            if (novel.cover && !(0, isAbsoluteUrl_1.isUrlAbsolute)(novel.cover)) {
                                                novel.cover = baseUrl + novel.cover.slice(1);
                                            }
                                        }
                                        break;
                                    case 'script':
                                        state = ParsingState.InScript;
                                        break;
                                }
                            },
                            ontext: function (text) {
                                var trimmedText = text.trim();
                                if (!trimmedText && state !== ParsingState.InScript)
                                    return;
                                switch (state) {
                                    case ParsingState.InTitle:
                                        nameParts.push(text);
                                        break;
                                    case ParsingState.InAuthor:
                                        novel.author = trimmedText;
                                        break;
                                    case ParsingState.InDescription:
                                        summaryParts.push(text);
                                        break;
                                    case ParsingState.InStatusSpan:
                                        statusText = trimmedText;
                                        break;
                                    case ParsingState.InTagLink:
                                        genreArray.push(trimmedText);
                                        break;
                                    case ParsingState.InScript:
                                        scriptContentParts.push(text);
                                        break;
                                }
                            },
                            onclosetag: function (name) {
                                switch (name) {
                                    case 'h1':
                                        if (state === ParsingState.InTitle) {
                                            novel.name = nameParts.join('').trim();
                                            state = ParsingState.Idle;
                                        }
                                        break;
                                    case 'a':
                                        if (state === ParsingState.InTagLink) {
                                            state = ParsingState.InTags;
                                        }
                                        else if (state === ParsingState.InAuthor) {
                                            state = ParsingState.Idle;
                                        }
                                        break;
                                    case 'p':
                                        if (state === ParsingState.InDescription) {
                                            summaryParts.push('\n\n');
                                        }
                                        break;
                                    case 'div':
                                        if (state === ParsingState.InDescription) {
                                            novel.summary = summaryParts
                                                .join('')
                                                .replace(/&nbsp;/g, ' ')
                                                .replace(/\n{3,}/g, '\n\n')
                                                .trim();
                                            summaryParts.length = 0;
                                            state = ParsingState.Idle;
                                        }
                                        break;
                                    case 'span':
                                        if (state === ParsingState.InTags) {
                                            novel.genres = genreArray.join(', ');
                                            state = ParsingState.Idle;
                                        }
                                        else if (state === ParsingState.InStatusSpan) {
                                            state = ParsingState.Idle;
                                        }
                                        break;
                                    case 'script':
                                        if (state === ParsingState.InScript) {
                                            state = ParsingState.Idle;
                                        }
                                        break;
                                }
                            },
                            onend: function () {
                                switch (statusText) {
                                    case 'ONGOING':
                                        novel.status = novelStatus_1.NovelStatus.Ongoing;
                                        break;
                                    case 'HIATUS':
                                        novel.status = novelStatus_1.NovelStatus.OnHiatus;
                                        break;
                                    case 'COMPLETED':
                                        novel.status = novelStatus_1.NovelStatus.Completed;
                                        break;
                                    default:
                                        novel.status = novelStatus_1.NovelStatus.Unknown;
                                }
                                novel.chapters = parseChapters(scriptContentParts.join(''));
                            },
                        });
                        parser.write(html);
                        parser.end();
                        return [2 /*return*/, novel];
                }
            });
        });
    };
    RoyalRoad.prototype.parseChapters = function (scriptContent) {
        var chapterMatch = scriptContent.match(/window\.chapters\s*=\s*(\[.*?\]);/);
        var volumeMatch = scriptContent.match(/window\.volumes\s*=\s*(\[.*?\]);/);
        var chapterJson = (chapterMatch === null || chapterMatch === void 0 ? void 0 : chapterMatch[1])
            ? JSON.parse(chapterMatch[1])
            : [];
        var volumeJson = (volumeMatch === null || volumeMatch === void 0 ? void 0 : volumeMatch[1]) && this.enableVol ? JSON.parse(volumeMatch[1]) : [];
        return chapterJson.map(function (chapter) {
            var matchingVolume = volumeJson.find(function (volume) { return volume.id === chapter.volumeId; });
            return {
                name: chapter.title,
                path: (function () {
                    var parts = chapter.url.split('/');
                    return "".concat(parts[1], "/").concat(parts[2], "/").concat(parts[4], "/").concat(parts[5]);
                })(),
                releaseTime: chapter.date,
                chapterNumber: chapter === null || chapter === void 0 ? void 0 : chapter.order,
                page: matchingVolume === null || matchingVolume === void 0 ? void 0 : matchingVolume.title,
            };
        });
    };
    // LNReader asks for a page when it has no stored chapters for it, e.g. a novel
    // that was saved without its chapter list. Every chapter is on the fiction page.
    RoyalRoad.prototype.parsePage = function (novelPath, page) {
        return __awaiter(this, void 0, void 0, function () {
            var chapters, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this.parseChapters;
                        return [4 /*yield*/, this.fetchHtml(this.site + novelPath)];
                    case 1:
                        chapters = _a.apply(this, [_b.sent()]);
                        // Page "1" is asked for when the app has no stored pages at all, so give it
                        // the whole list; any other page is a volume title.
                        return [2 /*return*/, {
                                chapters: page === '1'
                                    ? chapters
                                    : chapters.filter(function (chapter) { return chapter.page === page; }),
                            }];
                }
            });
        });
    };
    RoyalRoad.prototype.parseChapter = function (chapterPath) {
        return __awaiter(this, void 0, void 0, function () {
            var html, state, stateDepth, depth, chapterHtmlParts, notesHtmlParts, beforeNotesParts, afterNotesParts, isBeforeChapter, match, hiddenClass, stateBeforeHidden, escapeRegex, escapeMap, escapeHtml, parser;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.fetchHtml(this.site + chapterPath)];
                    case 1:
                        html = _b.sent();
                        state = ParsingState.Idle;
                        stateDepth = 0;
                        depth = 0;
                        chapterHtmlParts = [];
                        notesHtmlParts = [];
                        beforeNotesParts = [];
                        afterNotesParts = [];
                        isBeforeChapter = true;
                        match = html.match(/<style>\n\s+.(.+?){[^{]+?display: none;/);
                        hiddenClass = (_a = match === null || match === void 0 ? void 0 : match[1]) === null || _a === void 0 ? void 0 : _a.trim();
                        stateBeforeHidden = null;
                        escapeRegex = /[&<>"']/g;
                        escapeMap = {
                            '&': '&amp;',
                            '<': '&lt;',
                            '>': '&gt;',
                            '"': '&quot;',
                            "'": '&#39;',
                        };
                        escapeHtml = function (text) {
                            return escapeRegex.test(text)
                                ? ((escapeRegex.lastIndex = 0),
                                    text.replace(escapeRegex, function (char) { return escapeMap[char]; }))
                                : text;
                        };
                        parser = new htmlparser2_1.Parser({
                            onopentag: function (name, attribs) {
                                depth++;
                                var classes = attribs['class'] || '';
                                if (state !== ParsingState.InHidden &&
                                    hiddenClass &&
                                    classes.includes(hiddenClass)) {
                                    stateBeforeHidden = { state: state, depth: stateDepth };
                                    state = ParsingState.InHidden;
                                    stateDepth = depth;
                                    return;
                                }
                                switch (state) {
                                    case ParsingState.Idle:
                                        if (classes.includes('chapter-content')) {
                                            state = ParsingState.InChapter;
                                            stateDepth = depth;
                                            isBeforeChapter = false;
                                        }
                                        else if (classes.includes('author-note-portlet')) {
                                            state = ParsingState.InNote;
                                            stateDepth = depth;
                                        }
                                        break;
                                    case ParsingState.InHidden:
                                        return;
                                }
                                if (state === ParsingState.InChapter || state === ParsingState.InNote) {
                                    var tag = "<".concat(name);
                                    for (var attr in attribs) {
                                        var value = attribs[attr].replace(/"/g, '&quot;');
                                        tag += " ".concat(attr, "=\"").concat(value, "\"");
                                    }
                                    tag += '>';
                                    if (state === ParsingState.InChapter) {
                                        chapterHtmlParts.push(tag);
                                    }
                                    else {
                                        notesHtmlParts.push(tag);
                                    }
                                }
                            },
                            ontext: function (text) {
                                switch (state) {
                                    case ParsingState.InChapter:
                                        chapterHtmlParts.push(escapeHtml(text));
                                        break;
                                    case ParsingState.InNote:
                                        notesHtmlParts.push(escapeHtml(text));
                                        break;
                                }
                            },
                            onclosetag: function (name) {
                                if (depth === stateDepth) {
                                    switch (state) {
                                        case ParsingState.InHidden:
                                            if (!stateBeforeHidden) {
                                                state = ParsingState.Idle; // Attempt recovery
                                                stateDepth = 0;
                                            }
                                            else {
                                                state = stateBeforeHidden.state;
                                                stateDepth = stateBeforeHidden.depth;
                                                stateBeforeHidden = null;
                                            }
                                            depth--;
                                            return;
                                        case ParsingState.InChapter:
                                            chapterHtmlParts.push("</div>");
                                            state = ParsingState.Idle;
                                            stateDepth = 0;
                                            depth--;
                                            return;
                                        case ParsingState.InNote:
                                            {
                                                var noteClass = "author-note-".concat(isBeforeChapter ? 'before' : 'after');
                                                var notesHtml = notesHtmlParts.join('').trim();
                                                var fullNote = "<div class=\"".concat(noteClass, "\">").concat(notesHtml, "</div>");
                                                if (isBeforeChapter) {
                                                    beforeNotesParts.push(fullNote);
                                                }
                                                else {
                                                    afterNotesParts.push(fullNote);
                                                }
                                                notesHtmlParts.length = 0;
                                                state = ParsingState.Idle;
                                                stateDepth = 0;
                                                depth--;
                                            }
                                            return;
                                    }
                                }
                                else if (state === ParsingState.InChapter ||
                                    state === ParsingState.InNote) {
                                    if (!parser['isVoidElement'](name)) {
                                        var closingTag = "</".concat(name, ">");
                                        if (state === ParsingState.InChapter) {
                                            chapterHtmlParts.push(closingTag);
                                        }
                                        else {
                                            notesHtmlParts.push(closingTag);
                                        }
                                    }
                                }
                                depth--;
                            },
                        });
                        parser.write(html);
                        parser.end();
                        return [2 /*return*/, [
                                beforeNotesParts.length > 0 ? beforeNotesParts.join('') : null,
                                chapterHtmlParts.length > 0 ? chapterHtmlParts.join('').trim() : null,
                                afterNotesParts.length > 0 ? afterNotesParts.join('') : null,
                            ]
                                .filter(Boolean)
                                .join('\n<hr class="notes-separator">\n')];
                }
            });
        });
    };
    RoyalRoad.prototype.searchNovels = function (searchTerm, page) {
        return __awaiter(this, void 0, void 0, function () {
            var params, searchUrl, body;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = new URLSearchParams({
                            page: page.toString(),
                            title: searchTerm,
                            globalFilters: 'true',
                        });
                        searchUrl = "".concat(this.site, "fictions/search?").concat(params.toString());
                        return [4 /*yield*/, this.fetchHtml(searchUrl)];
                    case 1:
                        body = _a.sent();
                        return [2 /*return*/, this.parseNovels(body)];
                }
            });
        });
    };
    return RoyalRoad;
}());
exports.default = new RoyalRoad();
var ParsingState;
(function (ParsingState) {
    ParsingState[ParsingState["Idle"] = 0] = "Idle";
    ParsingState[ParsingState["InTitle"] = 1] = "InTitle";
    ParsingState[ParsingState["InAuthor"] = 2] = "InAuthor";
    ParsingState[ParsingState["InDescription"] = 3] = "InDescription";
    ParsingState[ParsingState["InTags"] = 4] = "InTags";
    ParsingState[ParsingState["InTagLink"] = 5] = "InTagLink";
    ParsingState[ParsingState["InStatusSpan"] = 6] = "InStatusSpan";
    ParsingState[ParsingState["InScript"] = 7] = "InScript";
    ParsingState[ParsingState["InNote"] = 8] = "InNote";
    ParsingState[ParsingState["InChapter"] = 9] = "InChapter";
    ParsingState[ParsingState["InHidden"] = 10] = "InHidden";
    ParsingState[ParsingState["Novel"] = 11] = "Novel";
})(ParsingState || (ParsingState = {}));
var BOT_CHECK_ERROR = "Royal Road's bot check could not be passed. Open a novel from Royal Road in WebView, wait for it to load, then try again.";
// Difficulty 4 needs about 65,000 hashes: a few seconds on a phone. Each step
// up is 16 times more work, so stop and ask for WebView instead.
var MAX_ANUBIS_DIFFICULTY = 4;
var anubisCheck;
function fetchPageHtml(url_1) {
    return __awaiter(this, arguments, void 0, function (url, passingChallenge) {
        var response, cloudflareChallenge;
        if (passingChallenge === void 0) { passingChallenge = false; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, fetch_1.fetchApi)(url)];
                case 1:
                    response = _a.sent();
                    cloudflareChallenge = response.headers.get('cf-mitigated') === 'challenge';
                    if (cloudflareChallenge || !response.ok) {
                        throw Object.assign(new Error(cloudflareChallenge || passingChallenge
                            ? BOT_CHECK_ERROR
                            : "Royal Road request failed (HTTP ".concat(response.status, "). Try again later.")), { response: response });
                    }
                    return [2 /*return*/, response.text()];
            }
        });
    });
}
function readAnubisChallenge(html) {
    var json = readJsonScript(html, 'anubis_challenge');
    return json ? JSON.parse(json) : undefined;
}
function readJsonScript(html, id) {
    var match = html.match(new RegExp('<script id="' + id + '" type="application/json">([\\s\\S]*?)</script>'));
    return match === null || match === void 0 ? void 0 : match[1];
}
// Solve the check and send the answer. Anubis then sets its cookie and
// redirects to `url`, so the result is the page that was asked for.
function passAnubisChallenge(html_1, _a, url_1) {
    return __awaiter(this, arguments, void 0, function (html, _b, url) {
        var basePrefix, start, _c, nonce, hash, params, origin;
        var _d;
        var rules = _b.rules, challenge = _b.challenge;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    if ((rules.algorithm !== 'fast' && rules.algorithm !== 'slow') ||
                        typeof rules.difficulty !== 'number' ||
                        rules.difficulty < 0 ||
                        rules.difficulty % 1 !== 0 ||
                        rules.difficulty > MAX_ANUBIS_DIFFICULTY) {
                        throw new Error(BOT_CHECK_ERROR);
                    }
                    basePrefix = JSON.parse(readJsonScript(html, 'anubis_base_prefix') || '""');
                    start = Date.now();
                    return [4 /*yield*/, solveProofOfWork(challenge.randomData, rules.difficulty)];
                case 1:
                    _c = _e.sent(), nonce = _c.nonce, hash = _c.hash;
                    params = new URLSearchParams({
                        id: challenge.id,
                        response: hash,
                        nonce: String(nonce),
                        redir: url,
                        elapsedTime: String(Date.now() - start),
                    });
                    origin = (_d = url.match(/^https?:\/\/[^/]+/)) === null || _d === void 0 ? void 0 : _d[0];
                    return [2 /*return*/, fetchPageHtml("".concat(origin).concat(basePrefix, "/.within.website/x/cmd/anubis/api/pass-challenge?").concat(params.toString()), true)];
            }
        });
    });
}
// Find the nonce for which sha256(data + nonce), in hex, starts with
// `difficulty` zeros. The app has no SHA-256 for plugins, so it is done here.
function solveProofOfWork(data, difficulty) {
    return __awaiter(this, void 0, void 0, function () {
        var search, from, found;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    search = nonceSearch(data, difficulty);
                    from = 0;
                    _a.label = 1;
                case 1:
                    found = search(from, from + 4096);
                    if (found)
                        return [2 /*return*/, found];
                    // Let the app do other work between batches of hashes.
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 0); })];
                case 2:
                    // Let the app do other work between batches of hashes.
                    _a.sent();
                    _a.label = 3;
                case 3:
                    from += 4096;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/];
            }
        });
    });
}
// Return a function that tries the nonces from `from` to `to` (exclusive).
// The full 64-byte blocks of `data` are hashed only once; each nonce then
// hashes only the last block or two. The search loop is synchronous, because
// a loop inside an async function is slow after the ES5 build.
function nonceSearch(data, difficulty) {
    var schedule = new Array(64);
    var prefixState = SHA256_INIT.slice();
    var fullBlocks = data.length >> 6;
    var words = new Array(32);
    for (var block = 0; block < fullBlocks; block++) {
        writeAscii(words, data.slice(block * 64, block * 64 + 64), 16);
        sha256Block(prefixState, words, 0, schedule);
    }
    var tail = data.slice(fullBlocks * 64);
    var state = new Array(8);
    var zeroBits = 32 - 4 * difficulty;
    return function (from, to) {
        for (var nonce = from; nonce < to; nonce++) {
            var rest = tail + nonce;
            var blocks = rest.length + 9 > 64 ? 2 : 1;
            writeAscii(words, rest, blocks * 16);
            words[rest.length >> 2] |= 0x80 << (24 - (rest.length & 3) * 8);
            words[blocks * 16 - 1] = (fullBlocks * 64 + rest.length) * 8;
            for (var i = 0; i < 8; i++)
                state[i] = prefixState[i];
            for (var block = 0; block < blocks; block++) {
                sha256Block(state, words, block * 16, schedule);
            }
            if (difficulty === 0 || state[0] >>> zeroBits === 0) {
                return { nonce: nonce, hash: toHex(state) };
            }
        }
        return undefined;
    };
}
// Write `text` as big-endian 32-bit words and zero the rest of `count` words.
function writeAscii(words, text, count) {
    for (var i = 0; i < count; i++)
        words[i] = 0;
    for (var i = 0; i < text.length; i++) {
        words[i >> 2] |= text.charCodeAt(i) << (24 - (i & 3) * 8);
    }
}
function toHex(state) {
    var hex = '';
    for (var i = 0; i < 8; i++) {
        hex += ('0000000' + (state[i] >>> 0).toString(16)).slice(-8);
    }
    return hex;
}
// SHA-256 compression of the 16 words at `offset` into `state`.
function sha256Block(state, words, offset, w) {
    var a = state[0];
    var b = state[1];
    var c = state[2];
    var d = state[3];
    var e = state[4];
    var f = state[5];
    var g = state[6];
    var h = state[7];
    for (var i = 0; i < 64; i++) {
        if (i < 16) {
            w[i] = words[offset + i] | 0;
        }
        else {
            var x = w[i - 15];
            var y = w[i - 2];
            w[i] =
                ((((x >>> 7) | (x << 25)) ^ ((x >>> 18) | (x << 14)) ^ (x >>> 3)) +
                    w[i - 7] +
                    (((y >>> 17) | (y << 15)) ^ ((y >>> 19) | (y << 13)) ^ (y >>> 10)) +
                    w[i - 16]) |
                    0;
        }
        var t1 = (h +
            (((e >>> 6) | (e << 26)) ^
                ((e >>> 11) | (e << 21)) ^
                ((e >>> 25) | (e << 7))) +
            ((e & f) ^ (~e & g)) +
            SHA256_K[i] +
            w[i]) |
            0;
        var t2 = ((((a >>> 2) | (a << 30)) ^
            ((a >>> 13) | (a << 19)) ^
            ((a >>> 22) | (a << 10))) +
            ((a & b) ^ (a & c) ^ (b & c))) |
            0;
        h = g;
        g = f;
        f = e;
        e = (d + t1) | 0;
        d = c;
        c = b;
        b = a;
        a = (t1 + t2) | 0;
    }
    state[0] = (state[0] + a) | 0;
    state[1] = (state[1] + b) | 0;
    state[2] = (state[2] + c) | 0;
    state[3] = (state[3] + d) | 0;
    state[4] = (state[4] + e) | 0;
    state[5] = (state[5] + f) | 0;
    state[6] = (state[6] + g) | 0;
    state[7] = (state[7] + h) | 0;
}
var SHA256_INIT = [
    0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c,
    0x1f83d9ab, 0x5be0cd19,
];
var SHA256_K = [
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1,
    0x923f82a4, 0xab1c5ed5, 0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3,
    0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174, 0xe49b69c1, 0xefbe4786,
    0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147,
    0x06ca6351, 0x14292967, 0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13,
    0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85, 0xa2bfe8a1, 0xa81a664b,
    0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a,
    0x5b9cca4f, 0x682e6ff3, 0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208,
    0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
];
