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
var defaultCover_1 = require("@libs/defaultCover");
var novelStatus_1 = require("@libs/novelStatus");
var storage_1 = require("@libs/storage");
// The title of the only series the site hosts.
var NOVEL_NAME = 'That Time I Got Reincarnated as a Slime';
// A volume's table of contents sits in its first few KB; the rest of the file
// is the whole volume's text, which only a chapter fetch needs.
var TOC_RANGE = 'bytes=0-23999';
var unescapeAttr = function (value) {
    return value
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&');
};
var escapeText = function (value) {
    return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
};
// Mirrors the site's own `capitalCase` helper from its reader controller.
var capitalCase = function (phrase, everyWord) {
    return phrase
        .toLowerCase()
        .split(' ')
        .map(function (word, index) {
        return word && (everyWord || index === 0)
            ? word[0].toUpperCase() + word.slice(1)
            : word;
    })
        .join(' ');
};
var TensurafanPlugin = /** @class */ (function () {
    function TensurafanPlugin() {
        var _this = this;
        this.id = 'tensurafan';
        this.name = 'Tensurafan';
        this.icon = 'src/en/tensurafan/icon.png';
        this.site = 'https://tensurafan.github.io';
        this.version = '1.0.0';
        this.pluginSettings = {
            termSet: {
                value: 'default',
                label: 'Names and terms (the same choices as "Set All Terms to ..." under Extras > Manage Selectable terms on the site; applies to chapters opened after changing it)',
                type: 'Select',
                options: [
                    { label: 'Default terms', value: 'default' },
                    { label: 'Official terms', value: 'official' },
                    { label: 'Text-to-speech friendly terms', value: 'tts' },
                ],
            },
        };
        this.resolveUrl = function (path, isNovel) {
            return _this.site + (isNovel ? '/' : path);
        };
    }
    TensurafanPlugin.prototype.fetchOk = function (url, headers) {
        return __awaiter(this, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, fetch_1.fetchApi)(url, headers ? { headers: headers } : undefined)];
                    case 1:
                        res = _a.sent();
                        if (!res.ok) {
                            throw new Error("Tensurafan returned HTTP ".concat(res.status, " for ").concat(url));
                        }
                        return [2 /*return*/, res];
                }
            });
        });
    };
    TensurafanPlugin.prototype.getVolumeList = function () {
        return this.fetchOk(this.site + '/ln/volumes.json').then(function (r) { return r.json(); });
    };
    TensurafanPlugin.prototype.getVolumes = function () {
        return __awaiter(this, void 0, void 0, function () {
            var seen;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        seen = {};
                        return [4 /*yield*/, this.getVolumeList()];
                    case 1: return [2 /*return*/, (_a.sent()).filter(function (volume) {
                            if (seen[volume.path])
                                return false;
                            seen[volume.path] = true;
                            return true;
                        })];
                }
            });
        });
    };
    TensurafanPlugin.prototype.getTermSet = function () {
        var value = storage_1.storage.get('termSet');
        return value === 'official' || value === 'tts' ? value : 'default';
    };
    /**
     * The site renders every name as a `<span data-term>` holding a template
     * that picks the reader's chosen term for it. Replace each one with the
     * term from the selected set (the key itself is the site's default).
     */
    TensurafanPlugin.prototype.applyTerms = function (html, terms, set) {
        var pick = function (key) {
            var term = terms && terms[key];
            if (!term || !set || set === 'default')
                return key;
            var index = set === 'official' ? term.officialTermIndex : term.textToSpeechIndex;
            return term.options[index] || key;
        };
        return html.replace(/<span class="clickable [^"]*" data-term="([^"]*)" onclick="[^"]*">\{:\s*([^]*?)\s*:\}\|\{[^}]*\}\|<\/span>/g, function (_, rawKey, expression) {
            var chosen = pick(unescapeAttr(rawKey));
            var text = chosen;
            if (/toLowerCase\(\)/.test(expression)) {
                text = chosen.toLowerCase();
            }
            else if (/capitalCase\(.*,\s*true\s*\)/.test(expression)) {
                text = capitalCase(chosen, true);
            }
            else if (/capitalCase\(/.test(expression)) {
                text = capitalCase(chosen, false);
            }
            return escapeText(text);
        });
    };
    TensurafanPlugin.prototype.parseSections = function (html) {
        var $ = (0, cheerio_1.load)(this.applyTerms(html));
        var sections = [];
        $('p.toc-chapter, p.toc-chapter-space').each(function (_, el) {
            var link = $(el).find('a.hlink').first();
            var anchor = (link.attr('href') || '').replace(/^#/, '');
            var title = link.text().replace(/\s+/g, ' ').trim();
            if (anchor && title)
                sections.push({ anchor: anchor, title: title });
        });
        return sections;
    };
    TensurafanPlugin.prototype.getVolumeHtml = function (volume) {
        return __awaiter(this, void 0, void 0, function () {
            var html;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.volumeCache && this.volumeCache.path === volume.path) {
                            return [2 /*return*/, this.volumeCache.html];
                        }
                        return [4 /*yield*/, this.fetchOk(this.site + volume.path).then(function (r) {
                                return r.text();
                            })];
                    case 1:
                        html = _a.sent();
                        this.volumeCache = { path: volume.path, html: html };
                        return [2 /*return*/, html];
                }
            });
        });
    };
    /** Start of the element carrying `id`, including a lone wrapping `<div>`. */
    TensurafanPlugin.prototype.sectionStart = function (html, anchor) {
        var at = html.indexOf("id=\"".concat(anchor, "\""));
        if (at < 0)
            return -1;
        var start = html.lastIndexOf('<', at);
        if (html.slice(start - 5, start) === '<div>')
            start -= 5;
        return start;
    };
    TensurafanPlugin.prototype.popularNovels = function (pageNo) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (pageNo > 1)
                            return [2 /*return*/, []];
                        return [4 /*yield*/, this.getNovelItem()];
                    case 1: return [2 /*return*/, [_a.sent()]];
                }
            });
        });
    };
    TensurafanPlugin.prototype.getNovelItem = function () {
        return __awaiter(this, void 0, void 0, function () {
            var first, _a;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, this.getVolumes()];
                    case 1:
                        first = (_c.sent())[0];
                        _b = {
                            name: NOVEL_NAME,
                            path: '/'
                        };
                        if (!first) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.getCover(first)];
                    case 2:
                        _a = _c.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        _a = defaultCover_1.defaultCover;
                        _c.label = 4;
                    case 4: return [2 /*return*/, (_b.cover = _a,
                            _b)];
                }
            });
        });
    };
    TensurafanPlugin.prototype.getCover = function (volume) {
        return __awaiter(this, void 0, void 0, function () {
            var head, src;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.fetchOk(this.site + volume.path, {
                            Range: TOC_RANGE,
                        }).then(function (r) { return r.text(); })];
                    case 1:
                        head = _a.sent();
                        src = /<img[^>]*\ssrc="([^"{]+)"/.exec(head);
                        return [2 /*return*/, src ? this.site + encodeURI(unescapeAttr(src[1])) : defaultCover_1.defaultCover];
                }
            });
        });
    };
    TensurafanPlugin.prototype.parseNovel = function (novelPath) {
        return __awaiter(this, void 0, void 0, function () {
            var listed, volumes, heads, novel, credits, cover, chapters;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getVolumeList()];
                    case 1:
                        listed = _a.sent();
                        return [4 /*yield*/, this.getVolumes()];
                    case 2:
                        volumes = _a.sent();
                        return [4 /*yield*/, Promise.all(volumes.map(function (volume) {
                                return _this.fetchOk(_this.site + volume.path, { Range: TOC_RANGE }).then(function (r) {
                                    return r.text();
                                });
                            }))];
                    case 3:
                        heads = _a.sent();
                        novel = {
                            path: novelPath,
                            name: NOVEL_NAME,
                            cover: defaultCover_1.defaultCover,
                            status: listed.some(function (volume) { var _a; return ((_a = volume.progress) !== null && _a !== void 0 ? _a : 100) < 100; })
                                ? novelStatus_1.NovelStatus.Ongoing
                                : novelStatus_1.NovelStatus.Completed,
                        };
                        credits = (0, cheerio_1.load)(heads[0] || '');
                        credits('p.credits-entry-space, p.credits-entry').each(function (_, el) {
                            var text = credits(el).text();
                            var author = /^Author:\s*(.+)$/.exec(text);
                            var artist = /^Illustration:\s*(.+)$/.exec(text);
                            if (author)
                                novel.author = author[1].trim();
                            if (artist)
                                novel.artist = artist[1].trim();
                        });
                        cover = /<img[^>]*\ssrc="([^"{]+)"/.exec(heads[0] || '');
                        if (cover)
                            novel.cover = this.site + encodeURI(unescapeAttr(cover[1]));
                        chapters = [];
                        volumes.forEach(function (volume, index) {
                            _this.parseSections(heads[index]).forEach(function (section) {
                                chapters.push({
                                    name: "".concat(volume.name, " - ").concat(section.title),
                                    path: "/read/".concat(volume.id, "#").concat(section.anchor),
                                    chapterNumber: chapters.length + 1,
                                });
                            });
                        });
                        novel.chapters = chapters;
                        return [2 /*return*/, novel];
                }
            });
        });
    };
    TensurafanPlugin.prototype.parseChapter = function (chapterPath) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, volumeId, anchor, volume, html, sections, position, start, next, end, body, set, terms, $;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = /^\/read\/([^#]+)#(.+)$/.exec(chapterPath) || [], volumeId = _a[1], anchor = _a[2];
                        if (!volumeId)
                            throw new Error('Unrecognised chapter path ' + chapterPath);
                        return [4 /*yield*/, this.getVolumes()];
                    case 1:
                        volume = (_b.sent()).find(function (v) { return v.id === volumeId; });
                        if (!volume)
                            throw new Error('Unknown volume ' + volumeId);
                        return [4 /*yield*/, this.getVolumeHtml(volume)];
                    case 2:
                        html = _b.sent();
                        sections = this.parseSections(html.slice(0, 24000));
                        position = sections.findIndex(function (s) { return s.anchor === anchor; });
                        start = this.sectionStart(html, anchor);
                        if (position < 0 || start < 0) {
                            throw new Error("Section ".concat(anchor, " not found in ").concat(volume.name));
                        }
                        next = sections[position + 1];
                        end = next ? this.sectionStart(html, next.anchor) : -1;
                        body = html.slice(start, end > start ? end : undefined);
                        set = this.getTermSet();
                        if (!(set !== 'default')) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.fetchOk(this.site + '/ln/terms.json')
                                .then(function (r) { return r.json(); })
                                .then(function (data) { return data.terms; })];
                    case 3:
                        terms = _b.sent();
                        _b.label = 4;
                    case 4:
                        body = this.applyTerms(body, terms, set)
                            // Illustrations are templated on the site's "coloured illustrations"
                            // option, which is on by default: use the coloured file it names.
                            .replace(/(src="[^"{]*)\{:[^?]*\?\s*'([^']*)'\s*:\s*'[^']*'\s*:\}\|\{[^}]*\}\|/g, '$1$2')
                            // The footnote icon keeps its text in an attribute and shows it on tap.
                            .replace(/<span class="icon [^"]*" data-hover-text="([^"]*)"[^>]*>[^]*?<\/span><\/span>/g, '<sup>[$1]</sup>')
                            .replace(/<div class="scenebreak">[^]*?<\/div>/g, '<hr>');
                        $ = (0, cheerio_1.load)(body, null, false);
                        // The full-page title card repeats the heading that follows it as text.
                        $('script, style, noscript, iframe, object, embed, p.pagebreak').remove();
                        $('div:has(> img[src*="/title_cards/"])').remove();
                        $('img').each(function (_, el) {
                            var img = $(el);
                            var src = img.attr('src');
                            if (src && !/^[a-z][a-z\d+.-]*:/i.test(src)) {
                                img.attr('src', _this.site + encodeURI(src));
                            }
                        });
                        // The app renders this HTML as is, so drop event handlers and URLs that
                        // would run script.
                        $('*').each(function (_, el) {
                            var node = $(el);
                            for (var _i = 0, _a = Object.keys(el.attribs); _i < _a.length; _i++) {
                                var name_1 = _a[_i];
                                if (/^on/i.test(name_1)) {
                                    node.removeAttr(name_1);
                                }
                                else if (name_1 === 'href' || name_1 === 'src') {
                                    var value = el.attribs[name_1]
                                        .split('')
                                        .filter(function (c) { return c.charCodeAt(0) > 32; })
                                        .join('')
                                        .toLowerCase();
                                    if (/^(javascript|vbscript):/.test(value) ||
                                        (value.startsWith('data:') && !value.startsWith('data:image/'))) {
                                        node.removeAttr(name_1);
                                    }
                                }
                            }
                        });
                        return [2 /*return*/, $.html()];
                }
            });
        });
    };
    TensurafanPlugin.prototype.searchNovels = function (searchTerm) {
        return __awaiter(this, void 0, void 0, function () {
            var query, haystack, matches, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        query = searchTerm.trim().toLowerCase();
                        if (!query)
                            return [2 /*return*/, []];
                        haystack = "".concat(NOVEL_NAME, " Tensura ").concat(this.name).toLowerCase();
                        matches = query.split(/\s+/).every(function (word) { return haystack.includes(word); });
                        if (!matches) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.getNovelItem()];
                    case 1:
                        _a = [_b.sent()];
                        return [3 /*break*/, 3];
                    case 2:
                        _a = [];
                        _b.label = 3;
                    case 3: return [2 /*return*/, _a];
                }
            });
        });
    };
    return TensurafanPlugin;
}());
exports.default = new TensurafanPlugin();
