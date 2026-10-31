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
var SkyTheWood = /** @class */ (function () {
    function SkyTheWood() {
        this.id = 'skythewoodtranslations';
        this.name = 'Skythewood Translations';
        this.site = 'https://skythewood.blogspot.com';
        this.icon = 'src/en/skythewood/icon.png';
        this.version = '1.0.0';
    }
    SkyTheWood.prototype.popularNovels = function (pageNo) {
        return __awaiter(this, void 0, void 0, function () {
            var doneProjects, ongoingProjects, projects, novels, _i, projects_1, proj, newNovel;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // I'm fetching all the completed project here in one go
                        // There are no novels in the ongoing projects page right now so that won't work
                        //   And this is a blogger site with a messy link structure so not every novel is visible
                        // tbh idk how i can fix that but some is better than none so "\-(シ)-/"
                        if (pageNo > 1)
                            return [2 /*return*/, []];
                        return [4 /*yield*/, this.getDoneProjects()];
                    case 1:
                        doneProjects = _a.sent();
                        ongoingProjects = { names: [], novels: [] };
                        projects = ongoingProjects.novels.concat(doneProjects.novels);
                        novels = [];
                        for (_i = 0, projects_1 = projects; _i < projects_1.length; _i++) {
                            proj = projects_1[_i];
                            newNovel = this.projectToNovel(proj);
                            novels.push(newNovel);
                        }
                        // console.log(novels);
                        return [2 /*return*/, novels];
                }
            });
        });
    };
    SkyTheWood.prototype.getDoneProjects = function () {
        return __awaiter(this, void 0, void 0, function () {
            var pageRes, page, $, anchors, projects, dedup, names, _loop_1, _i, projects_2, proj, withCovers;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, fetch_1.fetchApi)('https://skythewood.blogspot.com/p/done.html')];
                    case 1:
                        pageRes = _a.sent();
                        return [4 /*yield*/, pageRes.text()];
                    case 2:
                        page = _a.sent();
                        $ = (0, cheerio_1.load)(page);
                        anchors = $('.post-body > div a').toArray();
                        projects = anchors
                            .filter(function (el) { return $(el).attr('href'); })
                            .filter(function (el) {
                            var href = $(el).attr('href');
                            return (href.startsWith('http://skythewood.blogspot.sg/p/') ||
                                href.startsWith('http://skythewood.blogspot.com/p/') ||
                                href.startsWith('https://skythewood.blogspot.sg/p/') ||
                                href.startsWith('https://skythewood.blogspot.com/p/'));
                        })
                            .filter(function (el) { return $(el).text(); });
                        dedup = [];
                        names = [];
                        _loop_1 = function (proj) {
                            if ($(proj).text().length == 0)
                                return "continue";
                            var dupIndex = dedup.findIndex(function (el) { return $(el).attr('href') == $(proj).attr('href'); });
                            if (dupIndex === -1) {
                                dedup.push(proj);
                                names.push([$(proj).text()]);
                            }
                            else
                                names[dupIndex].push($(proj).text());
                        };
                        for (_i = 0, projects_2 = projects; _i < projects_2.length; _i++) {
                            proj = projects_2[_i];
                            _loop_1(proj);
                        }
                        withCovers = findCovers($, dedup);
                        return [2 /*return*/, {
                                novels: withCovers,
                                names: names,
                            }];
                }
            });
        });
    };
    SkyTheWood.prototype.parseNovel = function (novelPath) {
        return __awaiter(this, void 0, void 0, function () {
            var pageRes, page, $, name, artist, boldEls, authorEl, chapterAnchors, filtered, withVolumes, chapters, _i, withVolumes_1, ch, name_1, chapter;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, fetch_1.fetchApi)(novelPath)];
                    case 1:
                        pageRes = _a.sent();
                        return [4 /*yield*/, pageRes.text()];
                    case 2:
                        page = _a.sent();
                        $ = (0, cheerio_1.load)(page);
                        name = $('.post-title').text();
                        {
                            boldEls = $('b').toArray();
                            authorEl = boldEls.find(function (el) { return $(el).text().startsWith('Author'); });
                            if (authorEl) {
                                artist = $(authorEl).text().split(':')[1].trim();
                            }
                        }
                        chapterAnchors = $('.post-body a').toArray();
                        filtered = chapterAnchors
                            .filter(function (el) { return $(el).attr('href'); })
                            .filter(function (el) { return $(el).attr('href').includes('skythewood'); });
                        withVolumes = findVolumes($, filtered);
                        chapters = [];
                        for (_i = 0, withVolumes_1 = withVolumes; _i < withVolumes_1.length; _i++) {
                            ch = withVolumes_1[_i];
                            name_1 = ch.volume ? "".concat(ch.volume, " - ").concat(ch.name) : ch.name;
                            chapter = {
                                name: name_1,
                                path: ch.href.replace('http://', 'https://'),
                            };
                            chapters.push(chapter);
                        }
                        return [2 /*return*/, {
                                name: name,
                                path: novelPath,
                                cover: $('img').eq(1).attr('src'),
                                artist: artist,
                                chapters: chapters,
                            }];
                }
            });
        });
    };
    SkyTheWood.prototype.parseChapter = function (chapterPath) {
        return __awaiter(this, void 0, void 0, function () {
            var pageRes, page, $, body;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, fetch_1.fetchApi)(chapterPath)];
                    case 1:
                        pageRes = _a.sent();
                        return [4 /*yield*/, pageRes.text()];
                    case 2:
                        page = _a.sent();
                        $ = (0, cheerio_1.load)(page);
                        body = $('.post-body').html();
                        return [2 /*return*/, body || ''];
                }
            });
        });
    };
    SkyTheWood.prototype.searchNovels = function (searchTerm, pageNo) {
        return __awaiter(this, void 0, void 0, function () {
            var projects, result, i, names;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (pageNo > 1)
                            return [2 /*return*/, []];
                        return [4 /*yield*/, this.getDoneProjects()];
                    case 1:
                        projects = _a.sent();
                        result = new Set();
                        for (i = 0; i < projects.novels.length; i++) {
                            names = projects.names[i];
                            if (!names)
                                continue;
                            if (names.some(function (name) {
                                return name.toLowerCase().includes(searchTerm.toLocaleLowerCase());
                            })) {
                                result.add(this.projectToNovel(projects.novels[i]));
                            }
                        }
                        return [2 /*return*/, Array.from(result)];
                }
            });
        });
    };
    SkyTheWood.prototype.projectToNovel = function (proj) {
        return {
            name: proj.name,
            path: proj.href.replace('http://', 'https://'),
            cover: proj.cover,
        };
    };
    return SkyTheWood;
}());
function findCovers($, anchors) {
    var anchorSet = new Set(anchors);
    var result = [];
    var lastImg;
    $('.post-body')
        .find('*')
        .each(function (_, el) {
        var $el = $(el);
        if ($el.prop('tagName') === 'IMG') {
            lastImg = $el.attr('src') || undefined;
        }
        if (anchorSet.has(el)) {
            result.push({
                name: $el.text(),
                href: $el.attr('href') || '',
                cover: lastImg,
            });
        }
    });
    return result;
}
function findVolumes($, anchors) {
    var anchorSet = new Set(anchors);
    var result = [];
    var lastVolume = null;
    $('.post-body')
        .find('*')
        .each(function (_, el) {
        var $el = $(el);
        var text = $el.text();
        if (text.startsWith('Volume')) {
            lastVolume = text;
        }
        if (anchorSet.has(el)) {
            result.push({
                name: text,
                href: $el.attr('href') || '',
                volume: lastVolume,
            });
        }
    });
    return result;
}
exports.default = new SkyTheWood();
