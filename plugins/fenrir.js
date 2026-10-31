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
Object.defineProperty(exports, "__esModule", { value: true });
var fetch_1 = require("@libs/fetch");
var cheerio_1 = require("cheerio");
var filterInputs_1 = require("@libs/filterInputs");
var storage_1 = require("@libs/storage");
var defaultCover_1 = require("@libs/defaultCover");
var aes_1 = require("@libs/aes");
var CONTENT_SALT_V1 = 'fr-content-v1';
var FRAG_SALT_V1 = 'fr-frag-v1';
var CONTENT_SALT_V2 = 'fr-content-v2';
var FRAG_SALT_V2 = 'fr-frag-v2';
var AES_GCM_IV_LENGTH = 12;
var AES_GCM_TAG_LENGTH = 16;
var SHA256_K = new Uint32Array([
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
]);
function rotr32(x, n) {
    return (x >>> n) | (x << (32 - n));
}
function sha256Bytes(input) {
    var bytes = new TextEncoder().encode(input);
    var bitLen = bytes.length * 8;
    var padLen = (((bytes.length + 8) >> 6) + 1) << 6;
    var buf = new Uint8Array(padLen);
    buf.set(bytes);
    buf[bytes.length] = 0x80;
    var view = new DataView(buf.buffer);
    view.setUint32(padLen - 4, bitLen >>> 0, false);
    view.setUint32(padLen - 8, Math.floor(bitLen / 0x100000000) >>> 0, false);
    var h0 = 0x6a09e667;
    var h1 = 0xbb67ae85;
    var h2 = 0x3c6ef372;
    var h3 = 0xa54ff53a;
    var h4 = 0x510e527f;
    var h5 = 0x9b05688c;
    var h6 = 0x1f83d9ab;
    var h7 = 0x5be0cd19;
    var w = new Uint32Array(64);
    for (var i = 0; i < padLen; i += 64) {
        for (var j = 0; j < 16; j++) {
            w[j] = view.getUint32(i + j * 4, false);
        }
        for (var j = 16; j < 64; j++) {
            var s0 = rotr32(w[j - 15], 7) ^ rotr32(w[j - 15], 18) ^ (w[j - 15] >>> 3);
            var s1 = rotr32(w[j - 2], 17) ^ rotr32(w[j - 2], 19) ^ (w[j - 2] >>> 10);
            w[j] = (w[j - 16] + s0 + w[j - 7] + s1) >>> 0;
        }
        var a = h0;
        var b = h1;
        var c = h2;
        var d = h3;
        var e = h4;
        var f = h5;
        var g = h6;
        var h = h7;
        for (var j = 0; j < 64; j++) {
            var S1 = rotr32(e, 6) ^ rotr32(e, 11) ^ rotr32(e, 25);
            var ch = (e & f) ^ (~e & g);
            var temp1 = (h + S1 + ch + SHA256_K[j] + w[j]) >>> 0;
            var S0 = rotr32(a, 2) ^ rotr32(a, 13) ^ rotr32(a, 22);
            var maj = (a & b) ^ (a & c) ^ (b & c);
            var temp2 = (S0 + maj) >>> 0;
            h = g;
            g = f;
            f = e;
            e = (d + temp1) >>> 0;
            d = c;
            c = b;
            b = a;
            a = (temp1 + temp2) >>> 0;
        }
        h0 = (h0 + a) >>> 0;
        h1 = (h1 + b) >>> 0;
        h2 = (h2 + c) >>> 0;
        h3 = (h3 + d) >>> 0;
        h4 = (h4 + e) >>> 0;
        h5 = (h5 + f) >>> 0;
        h6 = (h6 + g) >>> 0;
        h7 = (h7 + h) >>> 0;
    }
    var out = new Uint8Array(32);
    var outView = new DataView(out.buffer);
    outView.setUint32(0, h0, false);
    outView.setUint32(4, h1, false);
    outView.setUint32(8, h2, false);
    outView.setUint32(12, h3, false);
    outView.setUint32(16, h4, false);
    outView.setUint32(20, h5, false);
    outView.setUint32(24, h6, false);
    outView.setUint32(28, h7, false);
    return out;
}
function xorshift128Next(state) {
    var t = state[0];
    var r = (t ^ (t << 11)) >>> 0;
    r = (r ^ (r >>> 8)) >>> 0;
    var o = state[3];
    state[0] = state[1];
    state[1] = state[2];
    state[2] = o;
    var f = (o ^ (o >>> 19) ^ r) >>> 0;
    state[3] = f;
    return f;
}
function unshuffleFragments(fragments, seedStr) {
    var count = fragments.length;
    if (count < 2)
        return count === 1 ? fragments[0] : '';
    var digest = sha256Bytes(seedStr);
    var view = new DataView(digest.buffer, digest.byteOffset, digest.byteLength);
    var state = new Uint32Array([
        view.getUint32(0, true),
        view.getUint32(4, true),
        view.getUint32(8, true),
        view.getUint32(12, true),
    ]);
    var perm = new Array(count);
    for (var i = 0; i < count; i++) {
        perm[i] = i;
    }
    for (var i = count - 1; i > 0; i--) {
        var j = xorshift128Next(state) % (i + 1);
        var tmp = perm[i];
        perm[i] = perm[j];
        perm[j] = tmp;
    }
    var restored = new Array(count);
    for (var i = 0; i < count; i++) {
        restored[perm[i]] = fragments[i];
    }
    return restored.join('');
}
function decodeBase64Bytes(b64) {
    var binary = atob(b64);
    var bytes = new Uint8Array(binary.length);
    for (var i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
}
function parseReadTokenPayload(token) {
    var _a;
    try {
        var payloadPart = (_a = token.split('.')[0]) !== null && _a !== void 0 ? _a : '';
        if (!payloadPart)
            return { vid: '', cid: null, exp: null };
        var b64 = payloadPart.replace(/-/g, '+').replace(/_/g, '/');
        var padded = b64 + '='.repeat((4 - (b64.length % 4)) % 4);
        var decoded = new TextDecoder().decode(decodeBase64Bytes(padded));
        var parsed = JSON.parse(decoded);
        return {
            vid: typeof (parsed === null || parsed === void 0 ? void 0 : parsed.vid) === 'string' ? parsed.vid : '',
            cid: typeof (parsed === null || parsed === void 0 ? void 0 : parsed.cid) === 'number' && parsed.cid > 0 ? parsed.cid : null,
            exp: typeof (parsed === null || parsed === void 0 ? void 0 : parsed.exp) === 'number' && parsed.exp > 0 ? parsed.exp : null,
        };
    }
    catch (_b) {
        return { vid: '', cid: null, exp: null };
    }
}
function extractVidFromReadToken(token) {
    return parseReadTokenPayload(token).vid;
}
var FenrirRealmPlugin = /** @class */ (function () {
    function FenrirRealmPlugin() {
        this.id = 'fenrir';
        this.name = 'Fenrir Realm';
        this.icon = 'src/en/fenrirrealm/icon.png';
        this.site = 'https://fenrirealm.com';
        this.version = '1.1.4';
        this.imageRequestInit = undefined;
        this.cachedReadToken = null;
        this.hideLocked = storage_1.storage.get('hideLocked');
        this.pluginSettings = {
            hideLocked: {
                value: '',
                label: 'Hide locked chapters',
                type: 'Switch',
            },
        };
        this.filters = {
            status: {
                type: filterInputs_1.FilterTypes.Picker,
                label: 'Status',
                value: '',
                options: [
                    { label: 'All', value: '' },
                    { label: 'Ongoing', value: 'on-going' },
                    { label: 'Completed', value: 'completed' },
                    { label: 'Hiatus', value: 'hiatus' },
                    { label: 'On Hold', value: 'on-hold' },
                    { label: 'Dropped', value: 'dropped' },
                ],
            },
            sort: {
                type: filterInputs_1.FilterTypes.Picker,
                label: 'Sort',
                value: 'popular',
                options: [
                    { label: 'Popular', value: 'popular' },
                    { label: 'Latest', value: 'latest' },
                    { label: 'Updated', value: 'updated' },
                ],
            },
            genres: {
                type: filterInputs_1.FilterTypes.CheckboxGroup,
                label: 'Genres',
                value: [],
                options: [
                    { 'label': 'Action', 'value': '1' },
                    { 'label': 'Adult', 'value': '2' },
                    {
                        'label': 'Adventure',
                        'value': '3',
                    },
                    { 'label': 'Comedy', 'value': '4' },
                    { 'label': 'Drama', 'value': '5' },
                    {
                        'label': 'Ecchi',
                        'value': '6',
                    },
                    { 'label': 'Fantasy', 'value': '7' },
                    { 'label': 'Gender Bender', 'value': '8' },
                    {
                        'label': 'Harem',
                        'value': '9',
                    },
                    { 'label': 'Historical', 'value': '10' },
                    { 'label': 'Horror', 'value': '11' },
                    {
                        'label': 'Josei',
                        'value': '12',
                    },
                    { 'label': 'Martial Arts', 'value': '13' },
                    { 'label': 'Mature', 'value': '14' },
                    {
                        'label': 'Mecha',
                        'value': '15',
                    },
                    { 'label': 'Mystery', 'value': '16' },
                    { 'label': 'Psychological', 'value': '17' },
                    {
                        'label': 'Romance',
                        'value': '18',
                    },
                    { 'label': 'School Life', 'value': '19' },
                    { 'label': 'Sci-fi', 'value': '20' },
                    {
                        'label': 'Seinen',
                        'value': '21',
                    },
                    { 'label': 'Shoujo', 'value': '22' },
                    { 'label': 'Shoujo Ai', 'value': '23' },
                    {
                        'label': 'Shounen',
                        'value': '24',
                    },
                    { 'label': 'Shounen Ai', 'value': '25' },
                    { 'label': 'Slice of Life', 'value': '26' },
                    {
                        'label': 'Smut',
                        'value': '27',
                    },
                    { 'label': 'Sports', 'value': '28' },
                    { 'label': 'Supernatural', 'value': '29' },
                    {
                        'label': 'Tragedy',
                        'value': '30',
                    },
                    { 'label': 'Wuxia', 'value': '31' },
                    { 'label': 'Xianxia', 'value': '32' },
                    {
                        'label': 'Xuanhuan',
                        'value': '33',
                    },
                    { 'label': 'Yaoi', 'value': '34' },
                    { 'label': 'Yuri', 'value': '35' },
                ],
            },
        };
    }
    FenrirRealmPlugin.prototype.setCachedReadToken = function (token, expiresAt, cid) {
        if (!token)
            return;
        var parsed = parseReadTokenPayload(token);
        var resolvedExp = typeof expiresAt === 'number' && expiresAt > 0
            ? expiresAt
            : parsed.exp !== null
                ? parsed.exp
                : Math.floor(Date.now() / 1000) + 300;
        var resolvedCid = parsed.cid !== null
            ? parsed.cid
            : typeof cid === 'number' && cid > 0
                ? cid
                : null;
        this.cachedReadToken = {
            value: token,
            expiresAt: resolvedExp,
            cid: resolvedCid,
        };
    };
    FenrirRealmPlugin.prototype.getActiveTokenValue = function () {
        if (!this.cachedReadToken)
            return null;
        if (this.cachedReadToken.expiresAt * 1000 - Date.now() < 5000) {
            this.cachedReadToken = null;
            return null;
        }
        return this.cachedReadToken.value;
    };
    FenrirRealmPlugin.prototype.getCachedReadToken = function (chapterId) {
        var value = this.getActiveTokenValue();
        if (!value || !this.cachedReadToken)
            return null;
        if (chapterId != null &&
            this.cachedReadToken.cid !== null &&
            this.cachedReadToken.cid !== chapterId) {
            return null;
        }
        return value;
    };
    FenrirRealmPlugin.prototype.captureReadTokenHeader = function (res, cid) {
        var _a, _b, _c, _d;
        var issued = (_b = (_a = res.headers) === null || _a === void 0 ? void 0 : _a.get) === null || _b === void 0 ? void 0 : _b.call(_a, 'x-read-token-issued');
        if (!issued)
            return;
        var expHeader = (_d = (_c = res.headers) === null || _c === void 0 ? void 0 : _c.get) === null || _d === void 0 ? void 0 : _d.call(_c, 'x-read-token-expires-at');
        var parsedExp = expHeader ? parseInt(expHeader, 10) : NaN;
        this.setCachedReadToken(issued, Number.isFinite(parsedExp) ? parsedExp : null, cid);
    };
    FenrirRealmPlugin.prototype.resolveRemintTarget = function (data, fallbackId) {
        return (data.remint_chapter_uuid ||
            data.remint_chapter_id ||
            data.uuid ||
            data.id ||
            fallbackId ||
            null);
    };
    FenrirRealmPlugin.prototype.buildChapterHeaders = function () {
        var headers = {
            'Accept': 'application/json',
            'X-Accepts-Encrypted-Content': '3',
        };
        var activeToken = this.getActiveTokenValue();
        if (activeToken) {
            headers['Cookie'] = "fr_read=".concat(activeToken);
        }
        return headers;
    };
    FenrirRealmPlugin.prototype.mintReadToken = function (chapterTarget, cid) {
        return __awaiter(this, void 0, void 0, function () {
            var payload_1, requestMint, activeToken, data, numericId, _a;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 4, , 5]);
                        payload_1 = {};
                        if (chapterTarget !== null &&
                            chapterTarget !== undefined &&
                            chapterTarget !== '') {
                            payload_1.chapter_id = String(chapterTarget);
                        }
                        requestMint = function (cookieToken) { return __awaiter(_this, void 0, void 0, function () {
                            var headers, res, data;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        headers = {
                                            'Content-Type': 'application/json',
                                            'Accept': 'application/json',
                                        };
                                        if (cookieToken) {
                                            headers['Cookie'] = "fr_read=".concat(cookieToken);
                                        }
                                        return [4 /*yield*/, (0, fetch_1.fetchApi)("".concat(this.site, "/api/read-token"), {
                                                method: 'POST',
                                                headers: headers,
                                                body: JSON.stringify(payload_1),
                                            })];
                                    case 1:
                                        res = _a.sent();
                                        if (!res.ok)
                                            return [2 /*return*/, null];
                                        return [4 /*yield*/, res.json()];
                                    case 2:
                                        data = _a.sent();
                                        return [2 /*return*/, (data === null || data === void 0 ? void 0 : data.active) &&
                                                typeof data.token === 'string' &&
                                                data.token !== ''
                                                ? data
                                                : null];
                                }
                            });
                        }); };
                        activeToken = this.getActiveTokenValue();
                        return [4 /*yield*/, requestMint(activeToken)];
                    case 1:
                        data = _b.sent();
                        if (!(!data && activeToken)) return [3 /*break*/, 3];
                        this.cachedReadToken = null;
                        return [4 /*yield*/, requestMint(null)];
                    case 2:
                        data = _b.sent();
                        _b.label = 3;
                    case 3:
                        if (data) {
                            numericId = typeof cid === 'number' && cid > 0
                                ? cid
                                : typeof chapterTarget === 'number'
                                    ? chapterTarget
                                    : null;
                            this.setCachedReadToken(data.token, data.expires_at, numericId);
                            return [2 /*return*/, true];
                        }
                        this.cachedReadToken = null;
                        return [2 /*return*/, false];
                    case 4:
                        _a = _b.sent();
                        return [2 /*return*/, false];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    FenrirRealmPlugin.prototype.getReadToken = function (chapterId) {
        return __awaiter(this, void 0, void 0, function () {
            var cached, headers, activeToken, res, data, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        cached = this.getCachedReadToken(chapterId);
                        if (cached !== null)
                            return [2 /*return*/, cached];
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 4, , 5]);
                        headers = {
                            'Accept': 'application/json',
                        };
                        activeToken = this.getActiveTokenValue();
                        if (activeToken) {
                            headers['Cookie'] = "fr_read=".concat(activeToken);
                        }
                        return [4 /*yield*/, (0, fetch_1.fetchApi)("".concat(this.site, "/api/read-token"), {
                                method: 'GET',
                                headers: headers,
                            })];
                    case 2:
                        res = _b.sent();
                        if (!res.ok)
                            return [2 /*return*/, null];
                        return [4 /*yield*/, res.json()];
                    case 3:
                        data = _b.sent();
                        if ((data === null || data === void 0 ? void 0 : data.active) && typeof data.token === 'string' && data.token !== '') {
                            this.setCachedReadToken(data.token, typeof data.expires_at === 'number' ? data.expires_at : null, chapterId !== null && chapterId !== void 0 ? chapterId : null);
                            return [2 /*return*/, data.token];
                        }
                        return [2 /*return*/, null];
                    case 4:
                        _a = _b.sent();
                        return [2 /*return*/, null];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    FenrirRealmPlugin.prototype.decryptWithToken = function (chapterData, token) {
        try {
            var isV2 = chapterData.content_scheme === 'fragmented-v2';
            var vid = isV2 ? extractVidFromReadToken(token) : '';
            var b64Cipher = Array.isArray(chapterData.content)
                ? unshuffleFragments(chapterData.content, isV2
                    ? "".concat(token, ":").concat(vid, ":").concat(chapterData.id, ":").concat(FRAG_SALT_V2)
                    : "".concat(token, ":").concat(chapterData.id, ":").concat(FRAG_SALT_V1))
                : typeof chapterData.content === 'string'
                    ? chapterData.content
                    : '';
            if (!b64Cipher)
                return null;
            var raw = decodeBase64Bytes(b64Cipher);
            if (raw.length <= AES_GCM_IV_LENGTH + AES_GCM_TAG_LENGTH)
                return null;
            var keySeed = isV2 && vid !== ''
                ? "".concat(token, ":").concat(vid, ":").concat(chapterData.id, ":").concat(CONTENT_SALT_V2)
                : "".concat(token, ":").concat(chapterData.id, ":").concat(CONTENT_SALT_V1);
            var keyBytes = sha256Bytes(keySeed);
            var iv = raw.slice(0, AES_GCM_IV_LENGTH);
            var ciphertextWithTag = raw.slice(AES_GCM_IV_LENGTH);
            var decrypted = (0, aes_1.gcm)(keyBytes, iv).decrypt(ciphertextWithTag);
            return new TextDecoder().decode(decrypted);
        }
        catch (_a) {
            return null;
        }
    };
    FenrirRealmPlugin.prototype.formatChapterContent = function (content) {
        try {
            // Attempt 1: Handle legacy stringified TipTap JSON AST schema
            var parsedContent = JSON.parse(content);
            if (parsedContent.type === 'doc' ||
                parsedContent.type === 'systemWindow') {
                return parsedContent.content
                    .map(function (node) {
                    var _a, _b, _c;
                    if (node.type === 'paragraph') {
                        var innerHtml = ((_a = node.content) === null || _a === void 0 ? void 0 : _a.map(function (c) {
                            var _a;
                            if (c.type === 'text') {
                                var text = c.text;
                                if (c.marks) {
                                    for (var _i = 0, _b = c.marks; _i < _b.length; _i++) {
                                        var mark = _b[_i];
                                        if (mark.type === 'bold')
                                            text = "<b>".concat(text, "</b>");
                                        if (mark.type === 'italic')
                                            text = "<i>".concat(text, "</i>");
                                        if (mark.type === 'underline')
                                            text = "<u>".concat(text, "</u>");
                                        if (mark.type === 'strike')
                                            text = "<strike>".concat(text, "</strike>");
                                        if (mark.type === 'link')
                                            text = "<a href=\"".concat((_a = mark.attrs) === null || _a === void 0 ? void 0 : _a.href, "\">").concat(text, "</a>");
                                    }
                                }
                                return text;
                            }
                            if (c.type === 'hardBreak')
                                return '<br>';
                            return '';
                        }).join('')) || '';
                        return "<p>".concat(innerHtml, "</p>");
                    }
                    if (node.type === 'heading') {
                        var level = ((_b = node.attrs) === null || _b === void 0 ? void 0 : _b.level) || 1;
                        var innerHtml = ((_c = node.content) === null || _c === void 0 ? void 0 : _c.map(function (c) { return c.text; }).join('')) || '';
                        return "<h".concat(level, ">").concat(innerHtml, "</h").concat(level, ">");
                    }
                    return '';
                })
                    .join('\n')
                    .replace(/[\u200B-\u200D\uFEFF]/g, '');
            }
        }
        catch (_a) {
            // Fall through to HTML cleaner
        }
        /**
         * HTML Response Cleaner:
         * Fenrir Realm inserts anti-scraping & watermark elements:
         * 1. Scramble hidden divs (`[aria-hidden="true"]`)
         * 2. Inline `<style>` blocks
         * 3. Reader attributions / Copy references (`.reader-attribution`, `[data-fr-attr]`)
         * 4. Zero-width characters (`\u200B-\u200D\uFEFF`)
         */
        var $ = (0, cheerio_1.load)(content);
        $('[aria-hidden="true"]').remove();
        $('.reader-attribution').remove();
        $('[data-fr-attr]').remove();
        $('style, script').remove();
        $('p, div, span, small').each(function (_, el) {
            var text = $(el).text().trim();
            if (text.startsWith('Copy reference:') || text.startsWith('Bookmark:')) {
                $(el).remove();
            }
        });
        var cleanedHtml = $.html() || content;
        return cleanedHtml.replace(/[\u200B-\u200D\uFEFF]/g, '');
    };
    FenrirRealmPlugin.prototype.popularNovels = function (pageNo_1, _a) {
        return __awaiter(this, arguments, void 0, function (pageNo, _b) {
            var params, res;
            var _this = this;
            var showLatestNovels = _b.showLatestNovels, filters = _b.filters;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        params = new URLSearchParams({
                            page: pageNo.toString(),
                            per_page: '20',
                            sort: showLatestNovels ? 'latest' : filters.sort.value,
                        });
                        if (filters.status.value) {
                            params.append('statuses[]', filters.status.value);
                        }
                        filters.genres.value.forEach(function (g) { return params.append('genres[]', g); });
                        return [4 /*yield*/, (0, fetch_1.fetchApi)("".concat(this.site, "/api/new/v2/series?").concat(params.toString())).then(function (r) {
                                return r.json().catch(function () {
                                    throw new Error('There was an error fetching the data from the server. Please try to open it in WebView');
                                });
                            })];
                    case 1:
                        res = _c.sent();
                        return [2 /*return*/, (res.data || []).map(function (r) { return _this.parseNovelFromApi(r); })];
                }
            });
        });
    };
    FenrirRealmPlugin.prototype.parseNovel = function (novelPath) {
        return __awaiter(this, void 0, void 0, function () {
            var cleanNovelPath, apiRes, slugMatch, searchSlug, words, SearchStr, searchRes, seriesData, summaryCheerio, novel, chapters;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        cleanNovelPath = novelPath;
                        return [4 /*yield*/, (0, fetch_1.fetchApi)("".concat(this.site, "/api/new/v2/series/").concat(novelPath, "/chapters"), {})];
                    case 1:
                        apiRes = _c.sent();
                        if (!!apiRes.ok) return [3 /*break*/, 6];
                        slugMatch = novelPath.match(/^\d+-(.+)$/);
                        searchSlug = slugMatch ? slugMatch[1] : novelPath;
                        return [4 /*yield*/, (0, fetch_1.fetchApi)("".concat(this.site, "/api/new/v2/series/").concat(searchSlug, "/chapters"), {})];
                    case 2:
                        apiRes = _c.sent();
                        cleanNovelPath = searchSlug;
                        if (!!apiRes.ok) return [3 /*break*/, 5];
                        words = searchSlug.replace(/-/g, ' ').split(' ');
                        SearchStr = words.find(function (w) { return w.length > 3; }) || words[0];
                        return [4 /*yield*/, (0, fetch_1.fetchApi)("".concat(this.site, "/api/series/filter?page=1&per_page=20&search=").concat(encodeURIComponent(SearchStr))).then(function (r) { return r.json(); })];
                    case 3:
                        searchRes = _c.sent();
                        if (!(searchRes.data && searchRes.data.length > 0)) return [3 /*break*/, 5];
                        cleanNovelPath = searchRes.data[0].slug;
                        return [4 /*yield*/, (0, fetch_1.fetchApi)("".concat(this.site, "/api/new/v2/series/").concat(cleanNovelPath, "/chapters"), {})];
                    case 4:
                        apiRes = _c.sent();
                        _c.label = 5;
                    case 5:
                        if (!apiRes.ok) {
                            throw new Error('Novel not found. It may have been removed or its URL changed significantly.');
                        }
                        _c.label = 6;
                    case 6: return [4 /*yield*/, (0, fetch_1.fetchApi)("".concat(this.site, "/api/new/v2/series/").concat(cleanNovelPath)).then(function (r) { return r.json(); })];
                    case 7:
                        seriesData = _c.sent();
                        summaryCheerio = (0, cheerio_1.load)(seriesData.description || '');
                        novel = {
                            path: cleanNovelPath,
                            name: seriesData.title || '',
                            summary: summaryCheerio('p').length > 0
                                ? summaryCheerio('p')
                                    .map(function (_, el) { return (0, cheerio_1.load)(el).text(); })
                                    .get()
                                    .join('\n\n')
                                : summaryCheerio.text() || '',
                            author: ((_a = seriesData.user) === null || _a === void 0 ? void 0 : _a.name) || ((_b = seriesData.user) === null || _b === void 0 ? void 0 : _b.username) || '',
                            cover: seriesData.cover
                                ? this.site + '/' + seriesData.cover
                                : defaultCover_1.defaultCover,
                            genres: (seriesData.genres || []).map(function (g) { return g.name; }).join(','),
                            status: seriesData.status || 'Unknown',
                        };
                        return [4 /*yield*/, apiRes.json()];
                    case 8:
                        chapters = _c.sent();
                        if (this.hideLocked) {
                            chapters = chapters.filter(function (c) { var _a; return !((_a = c.locked) === null || _a === void 0 ? void 0 : _a.price); });
                        }
                        novel.chapters = chapters
                            .map(function (c) {
                            var _a, _b, _c, _d, _e, _f;
                            return ({
                                name: (((_a = c.locked) === null || _a === void 0 ? void 0 : _a.price) ? '🔒 ' : '') +
                                    (((_b = c.group) === null || _b === void 0 ? void 0 : _b.index) == null ? '' : 'Vol ' + ((_c = c.group) === null || _c === void 0 ? void 0 : _c.index) + ' ') +
                                    'Chapter ' +
                                    c.number +
                                    (c.title && c.title.trim() != 'Chapter ' + c.number
                                        ? ' - ' + c.title.replace(/^chapter [0-9]+ . /i, '')
                                        : ''),
                                path: cleanNovelPath +
                                    (((_d = c.group) === null || _d === void 0 ? void 0 : _d.index) == null ? '' : '/' + ((_e = c.group) === null || _e === void 0 ? void 0 : _e.slug)) +
                                    '/' +
                                    (c.slug || 'chapter-' + c.number) +
                                    '~~' +
                                    c.id,
                                releaseTime: c.created_at,
                                chapterNumber: c.number + (((_f = c.group) === null || _f === void 0 ? void 0 : _f.index) || 0) * 10000,
                            });
                        })
                            .sort(function (a, b) { return a.chapterNumber - b.chapterNumber; });
                        return [2 /*return*/, novel];
                }
            });
        });
    };
    FenrirRealmPlugin.prototype.parseChapter = function (chapterPath) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, slugPath, chapterId, apiUrl, parsedCid, initialCid, res, minted, json, remintTarget, remintCid, minted, retryRes, token, decrypted, remintTarget, retryRes, retryJson, freshToken, url, result, body, loadedCheerio, chapterText, jsonUrl, jsonRes, json, nodes, data, contentStr, _b;
            var _c, _d, _e;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        _a = chapterPath.split('~~'), slugPath = _a[0], chapterId = _a[1];
                        apiUrl = chapterId
                            ? "".concat(this.site, "/api/new/v2/chapters/").concat(chapterId)
                            : "".concat(this.site, "/api/new/v2/series/").concat(slugPath);
                        parsedCid = chapterId ? parseInt(chapterId, 10) : NaN;
                        initialCid = Number.isFinite(parsedCid) ? parsedCid : null;
                        if (!(this.getCachedReadToken(initialCid) === null)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.mintReadToken(chapterId || null, initialCid)];
                    case 1:
                        _f.sent();
                        _f.label = 2;
                    case 2: return [4 /*yield*/, (0, fetch_1.fetchApi)(apiUrl, { headers: this.buildChapterHeaders() })];
                    case 3:
                        res = _f.sent();
                        if (res.status === 429) {
                            throw new Error('Rate limited by Fenrir Realm (Too Many Attempts). Please wait a moment before loading more chapters.');
                        }
                        this.captureReadTokenHeader(res, initialCid);
                        if (!(res.status === 403)) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.mintReadToken(chapterId || null, initialCid)];
                    case 4:
                        minted = _f.sent();
                        if (!minted) return [3 /*break*/, 6];
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(apiUrl, { headers: this.buildChapterHeaders() })];
                    case 5:
                        res = _f.sent();
                        if (res.status === 429) {
                            throw new Error('Rate limited by Fenrir Realm (Too Many Attempts). Please wait a moment before loading more chapters.');
                        }
                        this.captureReadTokenHeader(res, initialCid);
                        _f.label = 6;
                    case 6:
                        if (!res.ok) return [3 /*break*/, 20];
                        return [4 /*yield*/, res.json()];
                    case 7:
                        json = _f.sent();
                        this.captureReadTokenHeader(res, json.id);
                        if (!(json.content_format === 'locked')) return [3 /*break*/, 11];
                        if (((_c = json.locked) === null || _c === void 0 ? void 0 : _c.price) &&
                            json.locked.price > 0 &&
                            !((_d = json.bought) === null || _d === void 0 ? void 0 : _d.bought_at) &&
                            !json.bypass) {
                            throw new Error('This chapter is locked (paid). Please unlock it on Fenrir Realm first.');
                        }
                        remintTarget = this.resolveRemintTarget(json, chapterId);
                        remintCid = json.remint_chapter_id || json.id || initialCid;
                        return [4 /*yield*/, this.mintReadToken(remintTarget, remintCid)];
                    case 8:
                        minted = _f.sent();
                        if (!minted) return [3 /*break*/, 11];
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(apiUrl, {
                                headers: this.buildChapterHeaders(),
                            })];
                    case 9:
                        retryRes = _f.sent();
                        if (retryRes.status === 429) {
                            throw new Error('Rate limited by Fenrir Realm (Too Many Attempts). Please wait a moment before loading more chapters.');
                        }
                        if (!retryRes.ok) return [3 /*break*/, 11];
                        return [4 /*yield*/, retryRes.json()];
                    case 10:
                        json = _f.sent();
                        this.captureReadTokenHeader(retryRes, json.id);
                        _f.label = 11;
                    case 11:
                        if (!(json.content_format === 'encrypted')) return [3 /*break*/, 19];
                        return [4 /*yield*/, this.getReadToken(json.id)];
                    case 12:
                        token = _f.sent();
                        decrypted = token ? this.decryptWithToken(json, token) : null;
                        if (!!decrypted) return [3 /*break*/, 18];
                        remintTarget = this.resolveRemintTarget(json, chapterId);
                        return [4 /*yield*/, this.mintReadToken(remintTarget, json.id)];
                    case 13:
                        if (!_f.sent()) return [3 /*break*/, 18];
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(apiUrl, {
                                headers: this.buildChapterHeaders(),
                            })];
                    case 14:
                        retryRes = _f.sent();
                        if (retryRes.status === 429) {
                            throw new Error('Rate limited by Fenrir Realm (Too Many Attempts). Please wait a moment before loading more chapters.');
                        }
                        if (!retryRes.ok) return [3 /*break*/, 18];
                        return [4 /*yield*/, retryRes.json()];
                    case 15:
                        retryJson = _f.sent();
                        this.captureReadTokenHeader(retryRes, retryJson.id);
                        if (!(retryJson.content_format === 'encrypted')) return [3 /*break*/, 17];
                        return [4 /*yield*/, this.getReadToken(retryJson.id)];
                    case 16:
                        freshToken = _f.sent();
                        decrypted = freshToken
                            ? this.decryptWithToken(retryJson, freshToken)
                            : null;
                        return [3 /*break*/, 18];
                    case 17:
                        if (retryJson.content_format !== 'locked' &&
                            typeof retryJson.content === 'string' &&
                            retryJson.content) {
                            decrypted = retryJson.content;
                        }
                        _f.label = 18;
                    case 18:
                        if (decrypted) {
                            return [2 /*return*/, this.formatChapterContent(decrypted)];
                        }
                        json = __assign(__assign({}, json), { content: '', content_format: 'locked' });
                        _f.label = 19;
                    case 19:
                        if (json.content_format === 'locked') {
                            this.cachedReadToken = null;
                            throw new Error('Chapter is protected by Cloudflare Turnstile. Please open this chapter in WebView to verify and try again.');
                        }
                        if (typeof json.content === 'string' && json.content) {
                            return [2 /*return*/, this.formatChapterContent(json.content)];
                        }
                        _f.label = 20;
                    case 20:
                        url = "".concat(this.site, "/series/").concat(slugPath);
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(url)];
                    case 21:
                        result = _f.sent();
                        return [4 /*yield*/, result.text()];
                    case 22:
                        body = _f.sent();
                        loadedCheerio = (0, cheerio_1.load)(body);
                        // Clean up anti-scraping and watermark elements first
                        loadedCheerio('[aria-hidden="true"]').remove();
                        loadedCheerio('.reader-attribution').remove();
                        loadedCheerio('[data-fr-attr]').remove();
                        chapterText = loadedCheerio('.reader-area p, div.content-area p, [id^="reader-area"] p')
                            .map(function (_, el) {
                            var _a;
                            var html = (_a = loadedCheerio(el).html()) === null || _a === void 0 ? void 0 : _a.trim();
                            return html ? "<p>".concat(html, "</p>") : '';
                        })
                            .get()
                            .filter(Boolean)
                            .join('\n')
                            .replace(/[\u200B-\u200D\uFEFF]/g, '');
                        if (chapterText) {
                            return [2 /*return*/, chapterText];
                        }
                        _f.label = 23;
                    case 23:
                        _f.trys.push([23, 26, , 27]);
                        jsonUrl = "".concat(this.site, "/series/").concat(slugPath, "/__data.json?x-sveltekit-invalidated=001");
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(jsonUrl)];
                    case 24:
                        jsonRes = _f.sent();
                        return [4 /*yield*/, jsonRes.json()];
                    case 25:
                        json = _f.sent();
                        nodes = json.nodes;
                        data = (_e = nodes === null || nodes === void 0 ? void 0 : nodes.find(function (n) { return n.type === 'data'; })) === null || _e === void 0 ? void 0 : _e.data;
                        if (data) {
                            contentStr = data.find(function (d) { return typeof d === 'string' && d.includes('{"type":"doc"'); });
                            if (contentStr) {
                                return [2 /*return*/, this.formatChapterContent(contentStr)];
                            }
                        }
                        return [3 /*break*/, 27];
                    case 26:
                        _b = _f.sent();
                        return [3 /*break*/, 27];
                    case 27: return [2 /*return*/, chapterText];
                }
            });
        });
    };
    FenrirRealmPlugin.prototype.searchNovels = function (searchTerm, pageNo) {
        return __awaiter(this, void 0, void 0, function () {
            var url, res, words, fallbackTerm;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = "".concat(this.site, "/api/series/filter?page=").concat(pageNo, "&per_page=20&search=").concat(encodeURIComponent(searchTerm));
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(url).then(function (r) { return r.json(); })];
                    case 1:
                        res = _a.sent();
                        if (!(pageNo === 1 && (!res.data || res.data.length === 0))) return [3 /*break*/, 3];
                        words = searchTerm.split(' ');
                        fallbackTerm = words.find(function (w) { return w.length > 3; }) || words[0];
                        if (!(fallbackTerm && fallbackTerm !== searchTerm)) return [3 /*break*/, 3];
                        url = "".concat(this.site, "/api/series/filter?page=").concat(pageNo, "&per_page=20&search=").concat(encodeURIComponent(fallbackTerm));
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(url).then(function (r) { return r.json(); })];
                    case 2:
                        res = _a.sent();
                        _a.label = 3;
                    case 3: return [2 /*return*/, (res.data || []).map(function (novel) {
                            return _this.parseNovelFromApi(novel);
                        })];
                }
            });
        });
    };
    FenrirRealmPlugin.prototype.parseNovelFromApi = function (apiData) {
        return {
            name: apiData.title,
            path: apiData.slug,
            cover: this.site + '/' + apiData.cover,
            summary: apiData.description,
            status: apiData.status,
            genres: apiData.genres.map(function (g) { return g.name; }).join(','),
        };
    };
    FenrirRealmPlugin.prototype.resolveUrl = function (path) {
        return "".concat(this.site, "/series/").concat(path.split('~~')[0]);
    };
    return FenrirRealmPlugin;
}());
exports.default = new FenrirRealmPlugin();
