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
var defaultCover_1 = require("@libs/defaultCover");
var novelStatus_1 = require("@libs/novelStatus");
var storage_1 = require("@libs/storage");
var DreamyTranslationsPlugin = /** @class */ (function () {
    function DreamyTranslationsPlugin() {
        var _this = this;
        this.id = 'dreamyTranslations';
        this.name = 'Dreamy Translations';
        this.icon = 'src/en/dreamyTranslations/icon.png';
        this.site = 'https://dreamy-translations.com';
        this.version = '1.1.1';
        this.filters = undefined;
        this.imageRequestInit = undefined;
        this.pluginSettings = {
            hideLocked: {
                value: false,
                label: 'Hide locked chapters',
                type: 'Switch',
            },
        };
        this.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36',
            Referer: this.site,
            Accept: '*/*',
            'Accept-Language': 'en-US,en;q=0.9',
            'Cache-Control': 'no-cache',
            Pragma: 'no-cache',
            RSC: '1',
        };
        this.resolveUrl = function (path) { return _this.site + path; };
    }
    /**
     * Dreamy Translations is a Next.js application.
     *
     * Normal page requests return a loading shell, while requests
     * containing the RSC header return a React Server Component
     * Flight response containing the actual page data.
     */
    DreamyTranslationsPlugin.prototype.fetchRsc = function (url) {
        return __awaiter(this, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, fetch_1.fetchApi)(url, {
                            headers: this.headers,
                        })];
                    case 1:
                        res = _a.sent();
                        return [4 /*yield*/, res.text()];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Extract an object from a normal JSON RSC record.
     */
    DreamyTranslationsPlugin.prototype.extractRscObject = function (rscText, marker) {
        var line = rscText.split('\n').find(function (l) { return l.includes(marker); });
        if (!line) {
            throw new Error("Could not find \"".concat(marker, "\" in Dreamy Translations RSC response"));
        }
        var colonIndex = line.indexOf(':');
        if (colonIndex === -1) {
            throw new Error('Invalid Dreamy Translations RSC record');
        }
        var jsonStr = line.slice(colonIndex + 1);
        var parsed = JSON.parse(jsonStr);
        /*
         * Next.js Flight records commonly contain the actual
         * application data at index 3.
         */
        if (Array.isArray(parsed) && parsed.length > 3) {
            return parsed[3];
        }
        return parsed;
    };
    /**
     * Extract a streamed text record.
     *
     * RSC text records look like:
     *
     *   123:T1a,<raw text>
     *
     * The length is expressed as UTF-8 byte length, so the
     * response must be sliced by encoded bytes rather than
     * JavaScript string characters.
     */
    DreamyTranslationsPlugin.prototype.extractDeferredText = function (rscText, refId) {
        var escapedId = refId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        var match = new RegExp("(?:^|\\n)".concat(escapedId, ":T([0-9a-fA-F]+),")).exec(rscText);
        if (!match) {
            throw new Error('Could not locate chapter content in server response');
        }
        var start = match.index + match[0].length;
        var byteLength = parseInt(match[1], 16);
        var rest = rscText.slice(start);
        var bytes = new TextEncoder().encode(rest);
        return new TextDecoder().decode(bytes.slice(0, byteLength));
    };
    /**
     * Find a streamed text record.
     *
     * This is a non-throwing version of extractDeferredText()
     * used when chapter content may already be inline.
     */
    DreamyTranslationsPlugin.prototype.findDeferredText = function (rscText, refId) {
        var escapedId = refId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        var match = new RegExp("(?:^|\\n)".concat(escapedId, ":T([0-9a-fA-F]+),")).exec(rscText);
        if (!match) {
            return undefined;
        }
        var start = match.index + match[0].length;
        var byteLength = parseInt(match[1], 16);
        var bytes = new TextEncoder().encode(rscText.slice(start));
        return new TextDecoder().decode(bytes.slice(0, byteLength));
    };
    /**
     * Chapter-specific RSC extraction.
     *
     * Chapter responses are not always represented by a
     * directly JSON.parse()-able record. We therefore:
     *
     * 1. Try the normal RSC record format.
     * 2. Search for the chapter object directly.
     * 3. Parse a balanced JSON object.
     * 4. Fall back to other JSON-looking Flight records.
     */
    DreamyTranslationsPlugin.prototype.extractChapterObject = function (rscText) {
        var lines = rscText.split('\n');
        /*
         * First attempt: normal Flight record.
         */
        var chapterLine = lines.find(function (line) { return line.includes('"chapter"') && line.includes('"hasAccess"'); });
        if (chapterLine) {
            var colonIndex = chapterLine.indexOf(':');
            if (colonIndex !== -1) {
                var payload = chapterLine.slice(colonIndex + 1);
                try {
                    var parsed = JSON.parse(payload);
                    if (Array.isArray(parsed) && parsed.length > 3 && parsed[3]) {
                        return parsed[3];
                    }
                    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
                        return parsed;
                    }
                }
                catch (_a) {
                    /*
                     * The record isn't directly JSON.
                     * Continue with the fallbacks.
                     */
                }
            }
        }
        /*
         * Second attempt: locate the chapter object
         * directly inside the Flight response.
         */
        var marker = '"chapter":{';
        var markerIndex = rscText.indexOf(marker);
        if (markerIndex === -1) {
            throw new Error('Could not locate chapter data in server response');
        }
        var start = -1;
        for (var i = markerIndex; i >= 0; i--) {
            if (rscText[i] !== '{') {
                continue;
            }
            var candidate = rscText.slice(i, markerIndex + marker.length);
            if (candidate.startsWith('{') && candidate.includes('"chapter"')) {
                start = i;
                break;
            }
        }
        if (start === -1) {
            throw new Error('Could not locate chapter object in server response');
        }
        /*
         * Find the matching closing brace while
         * respecting quoted strings and escapes.
         */
        var depth = 0;
        var inString = false;
        var escaped = false;
        for (var i = start; i < rscText.length; i++) {
            var char = rscText[i];
            if (inString) {
                if (escaped) {
                    escaped = false;
                }
                else if (char === '\\') {
                    escaped = true;
                }
                else if (char === '"') {
                    inString = false;
                }
                continue;
            }
            if (char === '"') {
                inString = true;
                continue;
            }
            if (char === '{') {
                depth++;
            }
            else if (char === '}') {
                depth--;
                if (depth === 0) {
                    var json = rscText.slice(start, i + 1);
                    try {
                        return JSON.parse(json);
                    }
                    catch (_b) {
                        break;
                    }
                }
            }
        }
        /*
         * Final fallback: inspect JSON-looking
         * Flight records.
         */
        for (var _i = 0, lines_1 = lines; _i < lines_1.length; _i++) {
            var line = lines_1[_i];
            var colon = line.indexOf(':');
            if (colon === -1) {
                continue;
            }
            var payload = line.slice(colon + 1);
            if (!payload.startsWith('[') && !payload.startsWith('{')) {
                continue;
            }
            try {
                var parsed = JSON.parse(payload);
                if (Array.isArray(parsed)) {
                    for (var _c = 0, parsed_1 = parsed; _c < parsed_1.length; _c++) {
                        var value = parsed_1[_c];
                        if (value &&
                            typeof value === 'object' &&
                            !Array.isArray(value) &&
                            'chapter' in value) {
                            return value;
                        }
                    }
                }
                if (parsed &&
                    typeof parsed === 'object' &&
                    !Array.isArray(parsed) &&
                    'chapter' in parsed) {
                    return parsed;
                }
            }
            catch (_d) {
                // Ignore unrelated RSC records.
            }
        }
        throw new Error('Could not parse chapter data from Dreamy Translations response');
    };
    /**
     * Fetch every novel from the series page.
     */
    DreamyTranslationsPlugin.prototype.fetchAllNovels = function () {
        return __awaiter(this, void 0, void 0, function () {
            var rscText, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.fetchRsc("".concat(this.site, "/series"))];
                    case 1:
                        rscText = _a.sent();
                        data = this.extractRscObject(rscText, '"projects"');
                        return [2 /*return*/, data.projects.map(function (project) { return ({
                                name: project.title,
                                path: "/novel/".concat(project.slug),
                                cover: data.squareImageUrls[String(project.id)] || defaultCover_1.defaultCover,
                            }); })];
                }
            });
        });
    };
    DreamyTranslationsPlugin.prototype.popularNovels = function (pageNo) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (pageNo !== 1) {
                    return [2 /*return*/, []];
                }
                return [2 /*return*/, this.fetchAllNovels()];
            });
        });
    };
    DreamyTranslationsPlugin.prototype.parseNovel = function (novelPath) {
        return __awaiter(this, void 0, void 0, function () {
            var rscText, data, novel, raw, shouldHideLocked, chaptersToShow;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.fetchRsc("".concat(this.site).concat(novelPath))];
                    case 1:
                        rscText = _a.sent();
                        data = this.extractRscObject(rscText, '"chapters":[');
                        novel = {
                            path: novelPath,
                            name: data.project.title || 'Untitled',
                            cover: data.coverUrl || defaultCover_1.defaultCover,
                            author: data.project.author,
                            genres: (data.project.genres || []).join(', '),
                            summary: data.project.synopsis || data.project.short_synopsis,
                            status: data.project.completed
                                ? novelStatus_1.NovelStatus.Completed
                                : novelStatus_1.NovelStatus.Ongoing,
                        };
                        raw = storage_1.storage.get('hideLocked');
                        shouldHideLocked = raw === true || raw === 'true';
                        chaptersToShow = shouldHideLocked
                            ? data.chapters.filter(function (ch) { return ch.free; })
                            : data.chapters;
                        novel.chapters = chaptersToShow.map(function (chapter) { return ({
                            name: chapter.free ? chapter.title : "\uD83D\uDD12 ".concat(chapter.title),
                            path: "".concat(novelPath, "/chapter/").concat(chapter.index),
                            chapterNumber: chapter.index,
                        }); });
                        return [2 /*return*/, novel];
                }
            });
        });
    };
    DreamyTranslationsPlugin.prototype.parseChapter = function (chapterPath) {
        return __awaiter(this, void 0, void 0, function () {
            var rscText, data, content, refMatch, streamed, normalized;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.fetchRsc("".concat(this.site).concat(chapterPath))];
                    case 1:
                        rscText = _a.sent();
                        data = this.extractChapterObject(rscText);
                        if (!data.hasAccess) {
                            throw new Error('This chapter requires premium access and cannot be read here. ' +
                                'You can enable "Hide locked chapters" in the plugin settings to filter out locked chapters.');
                        }
                        content = data.chapter.content;
                        refMatch = typeof content === 'string' ? /^\$([0-9a-zA-Z]+)$/.exec(content) : null;
                        if (refMatch) {
                            streamed = this.findDeferredText(rscText, refMatch[1]);
                            if (streamed !== undefined) {
                                content = streamed;
                            }
                        }
                        if (!content || !content.trim()) {
                            throw new Error('Dreamy Translations returned an empty chapter');
                        }
                        normalized = content
                            .replace(/\r\n/g, '\n')
                            .replace(/\r/g, '\n')
                            /*
                             * Dreamy currently returns image src values
                             * in this form:
                             *
                             * src="[https://example.com/image](https://example.com/image)"
                             *
                             * Convert that into:
                             *
                             * src="https://example.com/image"
                             */
                            .replace(/(\bsrc\s*=\s*["'])\[([^\]]+)\]\(\2\)(["'])/gi, '$1$2$3');
                        return [2 /*return*/, normalized
                                .split(/\n{2,}/)
                                .map(function (paragraph) { return paragraph.trim(); })
                                .filter(Boolean)
                                .map(function (paragraph) {
                                /*
                                 * Don't wrap standalone images in <p>.
                                 */
                                if (/^<img\b[^>]*\/?>$/i.test(paragraph)) {
                                    return paragraph;
                                }
                                /*
                                 * Preserve Dreamy's HTML while
                                 * converting ordinary newlines to
                                 * reader line breaks.
                                 */
                                return "<p>".concat(paragraph.replace(/\n/g, '<br>'), "</p>");
                            })
                                .join('')];
                }
            });
        });
    };
    DreamyTranslationsPlugin.prototype.searchNovels = function (searchTerm, pageNo) {
        return __awaiter(this, void 0, void 0, function () {
            var novels, term;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (pageNo !== 1) {
                            return [2 /*return*/, []];
                        }
                        return [4 /*yield*/, this.fetchAllNovels()];
                    case 1:
                        novels = _a.sent();
                        term = searchTerm.toLowerCase();
                        return [2 /*return*/, novels.filter(function (novel) { return novel.name.toLowerCase().includes(term); })];
                }
            });
        });
    };
    return DreamyTranslationsPlugin;
}());
exports.default = new DreamyTranslationsPlugin();
