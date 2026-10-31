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
var cheerio_1 = require("cheerio");
var htmlparser2_1 = require("htmlparser2");
var defaultCover_1 = require("@libs/defaultCover");
var novelStatus_1 = require("@libs/novelStatus");
var fetch_1 = require("@libs/fetch");
var filterInputs_1 = require("@libs/filterInputs");
var FuckNovelpia = /** @class */ (function () {
    function FuckNovelpia() {
        this.id = 'FuckNovelpia';
        this.name = 'FuckNovelpia';
        this.icon = 'src/en/fucknovelpia/icon.png';
        this.site = 'https://fucknovelpia.com/';
        this.version = '1.1.3';
        this.filters = {
            sort: {
                label: 'Sort',
                value: 'newest',
                options: [
                    { label: 'Newest', value: 'newest' },
                    { label: 'Popular', value: 'popular' },
                    { label: 'Oldest', value: 'oldest' },
                    { label: 'Title A-Z', value: 'title' },
                    { label: 'Year (Descending)', value: 'year_desc' },
                    { label: 'Year (Ascending)', value: 'year_asc' },
                ],
                type: filterInputs_1.FilterTypes.Picker,
            },
            status: {
                label: 'Status',
                value: '',
                options: [
                    { label: 'Any', value: '' },
                    { label: 'Ongoing', value: 'ongoing' },
                    { label: 'Completed', value: 'completed' },
                    { label: 'Hiatus', value: 'hiatus' },
                    { label: 'Dropped', value: 'dropped' },
                ],
                type: filterInputs_1.FilterTypes.Picker,
            },
            lang: {
                label: 'Language',
                value: '',
                options: [
                    { label: 'Any', value: '' },
                    { label: 'EN', value: 'en' },
                    { label: 'ES', value: 'es' },
                    { label: 'KO', value: 'ko' },
                    { label: 'JA', value: 'ja' },
                    { label: 'ZH', value: 'zh' },
                ],
                type: filterInputs_1.FilterTypes.Picker,
            },
            has_images: {
                label: 'Image Chapters',
                value: false,
                type: filterInputs_1.FilterTypes.Switch,
            },
            read_only: {
                label: 'Read Mode',
                value: 'and',
                options: [
                    { label: 'Any', value: 'any' },
                    { label: 'Read Only', value: 'yes' },
                    { label: 'Downloadable', value: 'no' },
                ],
                type: filterInputs_1.FilterTypes.Picker,
            },
            genres_include_operator: {
                label: 'Include Genres',
                value: 'and',
                options: [
                    { label: 'AND', value: 'and' },
                    { label: 'OR', value: 'or' },
                ],
                type: filterInputs_1.FilterTypes.Picker,
            },
            genres: {
                label: 'Genres',
                value: {
                    include: [],
                    exclude: [],
                },
                options: [
                    { label: 'Academy', value: '1' },
                    { label: 'Action', value: '2' },
                    { label: 'Adventure', value: '3' },
                    { label: 'Fantasy', value: '4' },
                    { label: 'Horror', value: '5' },
                    { label: 'Mystery', value: '6' },
                    { label: 'Romance', value: '7' },
                    { label: 'School', value: '8' },
                    { label: 'Martial', value: '9' },
                    { label: 'Smut', value: '10' },
                    { label: 'Adult', value: '11' },
                    { label: 'Harem', value: '12' },
                    { label: 'Historical', value: '13' },
                    { label: 'Sci-Fi', value: '14' },
                    { label: 'Slice of Life', value: '15' },
                    { label: 'Sports', value: '16' },
                    { label: 'Uncategorized', value: '17' },
                ],
                type: filterInputs_1.FilterTypes.ExcludableCheckboxGroup,
            },
            tags_include_operator: {
                label: 'Include Tags',
                value: 'and',
                options: [
                    { label: 'AND', value: 'and' },
                    { label: 'OR', value: 'or' },
                ],
                type: filterInputs_1.FilterTypes.Picker,
            },
            tags: {
                label: 'Tags',
                value: {
                    include: [],
                    exclude: [],
                },
                options: [
                    { label: '583', value: '583' },
                    { label: '600', value: '600' },
                    { label: '606', value: '606' },
                    { label: '621', value: '621' },
                    { label: '644', value: '644' },
                    { label: 'Academy Setting', value: 'academy setting' },
                    { label: 'Adventurer Guild', value: 'adventurer guild' },
                    { label: 'Age Gap', value: 'age gap' },
                    { label: 'AI', value: 'ai' },
                    { label: 'Alchemy', value: 'alchemy' },
                    { label: 'Aliens', value: 'aliens' },
                    { label: 'Alternate History', value: 'alternate history' },
                    { label: 'Androids', value: 'androids' },
                    { label: 'Angels', value: 'angels' },
                    { label: 'Anti-Hero', value: 'anti-hero' },
                    { label: 'Apocalypse System', value: 'apocalypse system' },
                    { label: 'Army Building', value: 'army building' },
                    { label: 'Arranged Marriage', value: 'arranged marriage' },
                    { label: 'Artifact User', value: 'artifact user' },
                    { label: 'Assassin', value: 'assassin' },
                    { label: 'Awakening', value: 'awakening' },
                    { label: 'Bad Girl', value: 'bad girl' },
                    { label: 'Battle Heavy', value: 'battle heavy' },
                    { label: 'Beast Taming', value: 'beast taming' },
                    { label: 'Beastfolk', value: 'beastfolk' },
                    { label: 'Berserker', value: 'berserker' },
                    { label: 'Betrayal', value: 'betrayal' },
                    { label: 'Bisexual Protagonist', value: 'bisexual protagonist' },
                    { label: 'Blackmail', value: 'blackmail' },
                    { label: 'Blood Magic', value: 'blood magic' },
                    { label: 'Body Horror', value: 'body horror' },
                    { label: 'Brainwashing', value: 'brainwashing' },
                    { label: 'Breakup', value: 'breakup' },
                    { label: 'Broken Protagonist', value: 'broken protagonist' },
                    { label: 'Bureaucracy', value: 'bureaucracy' },
                    { label: 'Cat Girl', value: 'cat girl' },
                    { label: 'Cheat Ability', value: 'cheat ability' },
                    { label: 'Childhood Friends', value: 'childhood friends' },
                    { label: 'Chosen One', value: 'chosen one' },
                    { label: 'Church', value: 'church' },
                    { label: 'City Building', value: 'city building' },
                    { label: 'Class System', value: 'class system' },
                    { label: 'Cold Protagonist', value: 'cold protagonist' },
                    { label: 'Comedy', value: 'comedy' },
                    { label: 'Conspiracy', value: 'conspiracy' },
                    { label: 'Contract Marriage', value: 'contract marriage' },
                    { label: 'Cooking', value: 'cooking' },
                    { label: 'Corporate War', value: 'corporate war' },
                    { label: 'Corruption', value: 'corruption' },
                    { label: 'Courtroom', value: 'courtroom' },
                    { label: 'Crafting', value: 'crafting' },
                    { label: 'Crime', value: 'crime' },
                    { label: 'Criminal Organization', value: 'criminal organization' },
                    { label: 'Cult', value: 'cult' },
                    { label: 'Cultivation', value: 'cultivation' },
                    { label: 'Cursed Power', value: 'cursed power' },
                    { label: 'Cyberpunk', value: 'cyberpunk' },
                    { label: 'Daily Life', value: 'daily life' },
                    { label: 'Dark Fantasy', value: 'dark fantasy' },
                    { label: 'Dark Magic', value: 'dark magic' },
                    { label: 'Demon Lord', value: 'demon lord' },
                    { label: 'Demon Powers', value: 'demon powers' },
                    { label: 'Demon Protagonist', value: 'demon protagonist' },
                    { label: 'Demons', value: 'demons' },
                    { label: 'Depression', value: 'depression' },
                    { label: 'Detective', value: 'detective' },
                    { label: 'Detective Setting', value: 'detective setting' },
                    { label: 'Diplomacy', value: 'diplomacy' },
                    { label: 'Divine Powers', value: 'divine powers' },
                    { label: 'Domestic Life', value: 'domestic life' },
                    { label: 'Dragon Protagonist', value: 'dragon protagonist' },
                    { label: 'Dragonkin', value: 'dragonkin' },
                    { label: 'Dungeon', value: 'dungeon' },
                    { label: 'Dungeon World', value: 'dungeon world' },
                    { label: 'Dwarves', value: 'dwarves' },
                    { label: 'Dystopia', value: 'dystopia' },
                    { label: 'Economy', value: 'economy' },
                    { label: 'Elemental Magic', value: 'elemental magic' },
                    { label: 'Elves', value: 'elves' },
                    { label: 'Empire Building', value: 'empire building' },
                    { label: 'Enemies To Lovers', value: 'enemies to lovers' },
                    { label: 'Erotic', value: 'erotic' },
                    { label: 'Experiments', value: 'experiments' },
                    { label: 'Explicit Sex', value: 'explicit sex' },
                    { label: 'Fake Dating', value: 'fake dating' },
                    { label: 'Family Drama', value: 'family drama' },
                    { label: 'Farming', value: 'farming' },
                    { label: 'Female Protagonist', value: 'female protagonist' },
                    { label: 'Forbidden Love', value: 'forbidden love' },
                    { label: 'Forbidden Magic', value: 'forbidden magic' },
                    { label: 'Forensics', value: 'forensics' },
                    { label: 'Found Family', value: 'found family' },
                    { label: 'Fox Girl', value: 'fox girl' },
                    { label: 'Friends To Lovers', value: 'friends to lovers' },
                    { label: 'Game World', value: 'game world' },
                    { label: 'Game-Like World', value: 'game-like world' },
                    { label: 'Gangs', value: 'gangs' },
                    { label: 'Gaslighting', value: 'gaslighting' },
                    { label: 'Gender Bender', value: 'gender bender' },
                    { label: 'Genetic Engineering', value: 'genetic engineering' },
                    { label: 'Genius Protagonist', value: 'genius protagonist' },
                    { label: 'Girl', value: 'girl' },
                    { label: 'Goblins', value: 'goblins' },
                    { label: 'Gods', value: 'gods' },
                    { label: 'Gore', value: 'gore' },
                    { label: 'Grief', value: 'grief' },
                    { label: 'Hacking', value: 'hacking' },
                    { label: 'Harem', value: 'harem' },
                    { label: 'Healer', value: 'healer' },
                    { label: 'Healing Story', value: 'healing story' },
                    { label: 'Heist', value: 'heist' },
                    { label: 'Hero', value: 'hero' },
                    { label: 'Historical Setting', value: 'historical setting' },
                    { label: 'Holy Magic', value: 'holy magic' },
                    { label: 'Horror Elements', value: 'horror elements' },
                    { label: 'Hypnosis', value: 'hypnosis' },
                    { label: 'Imperial Court', value: 'imperial court' },
                    { label: 'Investigation', value: 'investigation' },
                    { label: 'Isekai', value: 'isekai' },
                    { label: 'Kemonomimi', value: 'kemonomimi' },
                    { label: 'Kidnapping', value: 'kidnapping' },
                    { label: 'Kind Protagonist', value: 'kind protagonist' },
                    { label: 'Kingdom Building', value: 'kingdom building' },
                    { label: 'Kingdom Setting', value: 'kingdom setting' },
                    { label: 'Leadership', value: 'leadership' },
                    { label: 'Leveling', value: 'leveling' },
                    { label: 'LitRPG', value: 'litrpg' },
                    { label: 'Love Triangle', value: 'love triangle' },
                    { label: 'Madness', value: 'madness' },
                    { label: 'Mafia', value: 'mafia' },
                    { label: 'Mage Protagonist', value: 'mage protagonist' },
                    { label: 'Magic', value: 'magic' },
                    { label: 'Male Protagonist', value: 'male protagonist' },
                    { label: 'Management', value: 'management' },
                    { label: 'Manipulation', value: 'manipulation' },
                    { label: 'Marriage', value: 'marriage' },
                    { label: 'Martial Arts', value: 'martial arts' },
                    { label: 'Mastermind Protagonist', value: 'mastermind protagonist' },
                    { label: 'Mecha', value: 'mecha' },
                    { label: 'Medieval Fantasy', value: 'medieval fantasy' },
                    { label: 'Mental Breakdown', value: 'mental breakdown' },
                    { label: 'Mercenaries', value: 'mercenaries' },
                    { label: 'Merchant Life', value: 'merchant life' },
                    { label: 'Military', value: 'military' },
                    { label: 'Military Setting', value: 'military setting' },
                    { label: 'Mind Break', value: 'mind break' },
                    { label: 'Modern World', value: 'modern world' },
                    { label: 'Monster Girls', value: 'monster girls' },
                    { label: 'Monster Protagonist', value: 'monster protagonist' },
                    { label: 'Moral Dilemmas', value: 'moral dilemmas' },
                    {
                        label: 'Morally Gray Protagonist',
                        value: 'morally gray protagonist',
                    },
                    { label: 'Multiple Protagonists', value: 'multiple protagonists' },
                    { label: 'Mystery', value: 'mystery' },
                    { label: 'Naive Protagonist', value: 'naive protagonist' },
                    { label: 'Necromancy', value: 'necromancy' },
                    { label: 'Negotiation', value: 'negotiation' },
                    { label: 'Nobles', value: 'nobles' },
                    { label: 'Non-Consensual', value: 'non-consensual' },
                    { label: 'Non-Human Protagonist', value: 'non-human protagonist' },
                    { label: 'NTR', value: 'ntr' },
                    { label: 'Obsession', value: 'obsession' },
                    { label: 'Obsessive Love', value: 'obsessive love' },
                    { label: 'Orcs', value: 'orcs' },
                    { label: 'Orphan Protagonist', value: 'orphan protagonist' },
                    { label: 'Overpowered Protagonist', value: 'overpowered protagonist' },
                    { label: 'Parallel World', value: 'parallel world' },
                    { label: 'Parody', value: 'parody' },
                    { label: 'Police', value: 'police' },
                    { label: 'Political Intrigue', value: 'political intrigue' },
                    { label: 'Political Marriage', value: 'political marriage' },
                    { label: 'Politics', value: 'politics' },
                    { label: 'Polyamory', value: 'polyamory' },
                    { label: 'Possessive Love', value: 'possessive love' },
                    { label: 'Post-Apocalyptic', value: 'post-apocalyptic' },
                    { label: 'Prince Protagonist', value: 'prince protagonist' },
                    { label: 'Princess Protagonist', value: 'princess protagonist' },
                    { label: 'Progression Fantasy', value: 'progression fantasy' },
                    { label: 'Prostitution', value: 'prostitution' },
                    { label: 'Prostitution Arc', value: 'prostitution arc' },
                    { label: 'Psychological', value: 'psychological' },
                    { label: 'Rape', value: 'rape' },
                    { label: 'Rebels', value: 'rebels' },
                    { label: 'Reconciliation', value: 'reconciliation' },
                    { label: 'Redemption', value: 'redemption' },
                    { label: 'Regression', value: 'regression' },
                    { label: 'Reincarnated Villainess', value: 'reincarnated villainess' },
                    { label: 'Reincarnation', value: 'reincarnation' },
                    { label: 'Revenge', value: 'revenge' },
                    { label: 'Revenge Driven', value: 'revenge driven' },
                    { label: 'Reverse Harem', value: 'reverse harem' },
                    { label: 'Romance', value: 'romance' },
                    { label: 'Royalty', value: 'royalty' },
                    { label: 'Ruthless Protagonist', value: 'ruthless protagonist' },
                    { label: 'Saintess Protagonist', value: 'saintess protagonist' },
                    { label: 'Satire', value: 'satire' },
                    { label: 'Scheming', value: 'scheming' },
                    { label: 'School Setting', value: 'school setting' },
                    { label: 'Sci-Fi', value: 'sci-fi' },
                    { label: 'Sci-Fi Setting', value: 'sci-fi setting' },
                    { label: 'Second Chance', value: 'second chance' },
                    { label: 'Secret Organization', value: 'secret organization' },
                    { label: 'Serial Killer', value: 'serial killer' },
                    { label: 'Sex Slavery', value: 'sex slavery' },
                    { label: 'Sex Work', value: 'sex work' },
                    { label: 'Shop Owner', value: 'shop owner' },
                    { label: 'Simulation', value: 'simulation' },
                    { label: 'Skill System', value: 'skill system' },
                    { label: 'Slave Heroine', value: 'slave heroine' },
                    { label: 'Slice of Life', value: 'slice of life' },
                    { label: 'Slime', value: 'slime' },
                    { label: 'Slow Burn', value: 'slow burn' },
                    { label: 'Smut', value: 'smut' },
                    { label: 'Soulmate', value: 'soulmate' },
                    { label: 'Space Opera', value: 'space opera' },
                    { label: 'Space Travel', value: 'space travel' },
                    { label: 'Spider', value: 'spider' },
                    { label: 'Spies', value: 'spies' },
                    { label: 'Spirits', value: 'spirits' },
                    { label: 'Stats Window', value: 'stats window' },
                    { label: 'Steampunk', value: 'steampunk' },
                    { label: 'Strategy', value: 'strategy' },
                    { label: 'Summoner', value: 'summoner' },
                    { label: 'Summoning', value: 'summoning' },
                    { label: 'Super Soldiers', value: 'super soldiers' },
                    { label: 'Superhero Setting', value: 'superhero setting' },
                    { label: 'Survival Combat', value: 'survival combat' },
                    { label: 'Suspense', value: 'suspense' },
                    { label: 'Swordsmanship', value: 'swordsmanship' },
                    { label: 'System', value: 'system' },
                    { label: 'Tactics', value: 'tactics' },
                    { label: 'Talent Growth', value: 'talent growth' },
                    { label: 'Thriller', value: 'thriller' },
                    { label: 'Time Loop', value: 'time loop' },
                    { label: 'Time Travel', value: 'time travel' },
                    { label: 'Torture', value: 'torture' },
                    { label: 'Tower', value: 'tower' },
                    { label: 'Toxic Relationship', value: 'toxic relationship' },
                    { label: 'Trade', value: 'trade' },
                    { label: 'Tragedy', value: 'tragedy' },
                    { label: 'Tragic Protagonist', value: 'tragic protagonist' },
                    { label: 'Training Arc', value: 'training arc' },
                    { label: 'Transmigration', value: 'transmigration' },
                    { label: 'Trauma', value: 'trauma' },
                    { label: 'TS', value: 'ts' },
                    { label: 'Undead', value: 'undead' },
                    { label: 'Undead Protagonist', value: 'undead protagonist' },
                    { label: 'Underworld', value: 'underworld' },
                    { label: 'Underworld Setting', value: 'underworld setting' },
                    { label: 'Urban Fantasy', value: 'urban fantasy' },
                    { label: 'Vampire', value: 'vampire' },
                    { label: 'Villain Protagonist', value: 'villain protagonist' },
                    { label: 'Violence', value: 'violence' },
                    { label: 'Virtual Reality', value: 'virtual reality' },
                    { label: 'Virtual World', value: 'virtual world' },
                    { label: 'War Arc', value: 'war arc' },
                    { label: 'War Strategy', value: 'war strategy' },
                    { label: 'Warrior Protagonist', value: 'warrior protagonist' },
                    { label: 'Weak To Strong', value: 'weak to strong' },
                    { label: 'Werewolf', value: 'werewolf' },
                    { label: 'Wholesome', value: 'wholesome' },
                    { label: 'Wolf Girl', value: 'wolf girl' },
                    { label: 'Wuxia', value: 'wuxia' },
                    { label: 'Xianxia', value: 'xianxia' },
                    { label: 'Yaoi', value: 'yaoi' },
                    { label: 'Yuri', value: 'yuri' },
                ],
                type: filterInputs_1.FilterTypes.ExcludableCheckboxGroup,
            },
            author: {
                label: 'Author',
                value: '',
                type: filterInputs_1.FilterTypes.TextInput,
            },
            uploader: {
                label: 'Uploader',
                value: '',
                type: filterInputs_1.FilterTypes.TextInput,
            },
            translator_group: {
                label: 'Translator Group',
                value: '',
                type: filterInputs_1.FilterTypes.TextInput,
            },
            country: {
                label: 'Country',
                value: '',
                type: filterInputs_1.FilterTypes.TextInput,
            },
            year_from: {
                label: 'Year From',
                value: '',
                type: filterInputs_1.FilterTypes.TextInput,
            },
            year_to: {
                label: 'Year To',
                value: '',
                type: filterInputs_1.FilterTypes.TextInput,
            },
        };
    }
    FuckNovelpia.prototype.sleep = function (ms) {
        return new Promise(function (resolve) { return setTimeout(resolve, ms); });
    };
    // The site intermittently swaps in anti-scrape pages (nginx 403, a custom
    // "Blocked" 429 page, or a Cloudflare challenge) whose bodies contain no
    // reader markup. Parsing those silently produced empty chapters/novel lists
    // (issue #2540), so surface them as errors instead, and wait out the rate
    // limiter once before giving up.
    //
    // Do not override User-Agent. fetchApi already sends the app's configured
    // agent, the same one WebView uses when the reader solves Cloudflare.
    // A hardcoded desktop agent does not match that cf_clearance cookie, so the
    // site keeps answering 403 after the check succeeds (issue #2730).
    FuckNovelpia.prototype.fetchHtml = function (url) {
        return __awaiter(this, void 0, void 0, function () {
            var response, retryAfter, waitMs, status_1, message, error;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, fetch_1.fetchApi)(url)];
                    case 1:
                        response = _a.sent();
                        if (!(response.status === 429)) return [3 /*break*/, 4];
                        retryAfter = parseInt(response.headers.get('Retry-After') || '', 10);
                        waitMs = (isNaN(retryAfter) ? 2 : Math.min(retryAfter, 10)) * 1000;
                        return [4 /*yield*/, this.sleep(waitMs)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(url)];
                    case 3:
                        response = _a.sent();
                        _a.label = 4;
                    case 4:
                        if (!response.ok) {
                            status_1 = response.status;
                            message = status_1 === 403 || status_1 === 503
                                ? "Cloudflare protection detected (HTTP ".concat(status_1, "). Open the plugin in WebView, complete the check, then try again.")
                                : "FuckNovelpia returned HTTP ".concat(status_1);
                            error = new Error(message);
                            error.status = status_1;
                            throw error;
                        }
                        return [4 /*yield*/, response.text()];
                    case 5: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    // Returns false once the site has silently clamped us past the real last page.
    FuckNovelpia.prototype.hasRequestedPage = function (cheerio, requestedPage) {
        if (requestedPage <= 1)
            return true;
        var activeText = cheerio('div.pagination a.active').first().text().trim();
        var activePage = parseInt(activeText, 10);
        // No pagination at all, or active page doesn't match what we asked for
        // -> the site redirected us (usually back to page 1). Stop here.
        return !isNaN(activePage) && activePage === requestedPage;
    };
    FuckNovelpia.prototype.parseNovelsList = function (cheerio) {
        var novels = [];
        var seen = new Set();
        cheerio('.card-book a').each(function (i, el) {
            var $el = cheerio(el);
            var href = $el.attr('href');
            if (!href)
                return;
            var path = href.startsWith('/') ? href.slice(1) : href;
            if (seen.has(path))
                return;
            var img = $el.find('img').attr('src');
            var title = $el.find('img').attr('alt') || $el.find('.title').text().trim();
            seen.add(path);
            novels.push({
                path: path,
                name: title,
                cover: img || defaultCover_1.defaultCover,
            });
        });
        return novels;
    };
    FuckNovelpia.prototype.parseLatestUpdates = function () {
        return __awaiter(this, void 0, void 0, function () {
            var link, html, novels, tempNovel, seen, stateStack, currentState, pushState, popState, parser;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        link = this.site + 'updates.php';
                        return [4 /*yield*/, this.fetchHtml(link)];
                    case 1:
                        html = _a.sent();
                        novels = [];
                        tempNovel = {};
                        seen = new Set();
                        stateStack = [ParsingState.Idle];
                        currentState = function () { return stateStack[stateStack.length - 1]; };
                        pushState = function (state) { return stateStack.push(state); };
                        popState = function () {
                            return stateStack.length > 1 ? stateStack.pop() : currentState();
                        };
                        parser = new htmlparser2_1.Parser({
                            onopentag: function (name, attribs) {
                                var state = currentState();
                                if (attribs.class === 'updates-list') {
                                    pushState(ParsingState.NovelList);
                                }
                                if (state === ParsingState.Idle)
                                    return;
                                switch (name) {
                                    case 'a':
                                        if (seen.has(attribs.href))
                                            return;
                                        seen.add(attribs.href);
                                        pushState(ParsingState.Novel);
                                        tempNovel.path = attribs.href.substring(1);
                                        break;
                                    case 'img':
                                        tempNovel.cover = attribs.src;
                                        tempNovel.name = attribs.alt;
                                        break;
                                    case 'div':
                                        switch (attribs.class) {
                                            case 'copy':
                                                if (tempNovel.name && tempNovel.path) {
                                                    novels.push(__assign({}, tempNovel));
                                                    popState();
                                                }
                                                tempNovel = {};
                                                break;
                                            case 'install-banner':
                                                popState();
                                                break;
                                        }
                                        break;
                                }
                            },
                        });
                        parser.write(html);
                        parser.end();
                        return [2 /*return*/, novels];
                }
            });
        });
    };
    FuckNovelpia.prototype.popularNovels = function (page_1, _a) {
        return __awaiter(this, arguments, void 0, function (page, _b) {
            var params, _i, _c, key, _d, _e, value, _f, _g, value, _h, _j, value, _k, _l, value, link, body, loadedCheerio;
            var _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z;
            var showLatestNovels = _b.showLatestNovels, filters = _b.filters;
            return __generator(this, function (_0) {
                switch (_0.label) {
                    case 0:
                        if (showLatestNovels) {
                            return [2 /*return*/, this.parseLatestUpdates()];
                        }
                        params = new URLSearchParams();
                        params.set('q', '');
                        params.set('sort', filters.sort.value);
                        // Search metadata filters (appears all the time)
                        for (_i = 0, _c = [
                            'author',
                            'uploader',
                            'translator_group',
                            'country',
                            'year_from',
                            'year_to',
                        ]; _i < _c.length; _i++) {
                            key = _c[_i];
                            params.set(key, filters[key].value);
                        }
                        params.set('status', filters.status.value);
                        params.set('language', filters.lang.value);
                        params.set('read_only', filters.read_only.value);
                        if ((_m = filters.has_images) === null || _m === void 0 ? void 0 : _m.value) {
                            params.set('has_images', '1');
                        }
                        // Genre filters
                        params.set('genre_mode', filters.genres_include_operator.value);
                        for (_d = 0, _e = (_q = (_p = (_o = filters.genres) === null || _o === void 0 ? void 0 : _o.value) === null || _p === void 0 ? void 0 : _p.include) !== null && _q !== void 0 ? _q : []; _d < _e.length; _d++) {
                            value = _e[_d];
                            params.append('genres_include[]', value);
                        }
                        for (_f = 0, _g = (_t = (_s = (_r = filters.genres) === null || _r === void 0 ? void 0 : _r.value) === null || _s === void 0 ? void 0 : _s.exclude) !== null && _t !== void 0 ? _t : []; _f < _g.length; _f++) {
                            value = _g[_f];
                            params.append('genres_exclude[]', value);
                        }
                        // Tag filters
                        params.set('tag_mode', filters.tags_include_operator.value);
                        for (_h = 0, _j = (_w = (_v = (_u = filters.tags) === null || _u === void 0 ? void 0 : _u.value) === null || _v === void 0 ? void 0 : _v.include) !== null && _w !== void 0 ? _w : []; _h < _j.length; _h++) {
                            value = _j[_h];
                            params.append('tags_include[]', value);
                        }
                        for (_k = 0, _l = (_z = (_y = (_x = filters.tags) === null || _x === void 0 ? void 0 : _x.value) === null || _y === void 0 ? void 0 : _y.exclude) !== null && _z !== void 0 ? _z : []; _k < _l.length; _k++) {
                            value = _l[_k];
                            params.append('tags_exclude[]', value);
                        }
                        if (page > 1) {
                            params.set('page', String(page));
                        }
                        link = this.site + 'search.php?' + params.toString();
                        return [4 /*yield*/, this.fetchHtml(link)];
                    case 1:
                        body = _0.sent();
                        loadedCheerio = (0, cheerio_1.load)(body);
                        if (!this.hasRequestedPage(loadedCheerio, page))
                            return [2 /*return*/, []];
                        return [2 /*return*/, this.parseNovelsList(loadedCheerio)];
                }
            });
        });
    };
    FuckNovelpia.prototype.parseNovel = function (novelPath) {
        return __awaiter(this, void 0, void 0, function () {
            var body, loadedCheerio, novelInfo, parsed, name, cover, summary, author, genres, novel, rawStatus, statusMap, chapters;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.fetchHtml(this.site + novelPath)];
                    case 1:
                        body = _a.sent();
                        loadedCheerio = (0, cheerio_1.load)(body);
                        novelInfo = loadedCheerio('script[type="application/ld+json"]').text();
                        parsed = {};
                        try {
                            parsed = JSON.parse(novelInfo);
                        }
                        catch (_b) {
                            // JSON-LD missing or malformed — fields will fall back to defaults
                        }
                        name = parsed.name || loadedCheerio('h1').text().trim();
                        cover = parsed.image || defaultCover_1.defaultCover;
                        summary = parsed.description || loadedCheerio('.hero-summary').text().trim();
                        author = [parsed.author]
                            .flat()
                            .map(function (a) { return a === null || a === void 0 ? void 0 : a.name; })
                            .filter(Boolean)
                            .join(', ');
                        if (!author) {
                            author = loadedCheerio('.info-list li')
                                .first()
                                .text()
                                .replace(/^Author:\s*/i, '')
                                .trim();
                        }
                        genres = [parsed.genre].flat().filter(Boolean).join(',');
                        if (!genres) {
                            genres = loadedCheerio('.genre-pill')
                                .map(function (_, el) { return loadedCheerio(el).text().trim(); })
                                .get()
                                .filter(Boolean)
                                .join(',');
                        }
                        novel = {
                            path: novelPath,
                            name: name || 'Untitled',
                            cover: cover,
                            summary: summary,
                            author: author,
                            genres: genres,
                            chapters: [],
                        };
                        rawStatus = loadedCheerio('.status-badge').text().trim();
                        statusMap = {
                            ongoing: novelStatus_1.NovelStatus.Ongoing,
                            completed: novelStatus_1.NovelStatus.Completed,
                            hiatus: novelStatus_1.NovelStatus.OnHiatus,
                            dropped: novelStatus_1.NovelStatus.Cancelled,
                        };
                        novel.status = statusMap[rawStatus.toLowerCase()] || novelStatus_1.NovelStatus.Unknown;
                        chapters = [];
                        loadedCheerio('#chapter-list li').each(function (i, el) {
                            var $el = loadedCheerio(el);
                            var href = ($el.find('a').attr('href') || '').trim();
                            var path = href.startsWith('/') ? href.slice(1) : href;
                            var name = $el.find('.chapter-item-main').text().trim();
                            if (!path || !name)
                                return;
                            chapters.push({
                                name: name + ($el.find('.chapter-item-flag').length ? ' [IMG]' : ''),
                                path: path,
                                chapterNumber: Number($el.attr('data-ch')),
                            });
                        });
                        // Chapters on the novel page are already listed oldest -> newest.
                        novel.chapters = chapters;
                        return [2 /*return*/, novel];
                }
            });
        });
    };
    FuckNovelpia.prototype.parseChapter = function (chapterPath) {
        return __awaiter(this, void 0, void 0, function () {
            var body, $, chapter;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, this.fetchHtml(this.site + chapterPath)];
                    case 1:
                        body = _c.sent();
                        $ = (0, cheerio_1.load)(body);
                        chapter = $('.reader').first();
                        if (!chapter.length) {
                            // A 200 without reader markup is a changed/blocked page, not an empty
                            // chapter — never report a false empty-success.
                            throw new Error('Chapter content not found in page');
                        }
                        // Remove things that aren't part of the chapter
                        chapter.find('.reader-nav').remove();
                        chapter.find('script').remove();
                        chapter.find('style').remove();
                        return [2 /*return*/, (_b = (_a = chapter.html()) === null || _a === void 0 ? void 0 : _a.replace(/&nbsp;/g, ' ')) !== null && _b !== void 0 ? _b : ''];
                }
            });
        });
    };
    FuckNovelpia.prototype.searchNovels = function (searchTerm, page) {
        return __awaiter(this, void 0, void 0, function () {
            var params, link, body, loadedCheerio;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = new URLSearchParams();
                        params.set('q', searchTerm);
                        params.set('author', '');
                        params.set('uploader', '');
                        params.set('translator_group', '');
                        params.set('country', '');
                        params.set('year_from', '');
                        params.set('year_to', '');
                        params.set('status', '');
                        params.set('language', '');
                        params.set('read_only', 'any');
                        params.set('sort', 'newest');
                        params.set('tag_mode', 'AND');
                        params.set('genre_mode', 'AND');
                        if (page > 1) {
                            params.set('page', String(page));
                        }
                        link = this.site + 'search.php?' + params.toString();
                        return [4 /*yield*/, this.fetchHtml(link)];
                    case 1:
                        body = _a.sent();
                        loadedCheerio = (0, cheerio_1.load)(body);
                        if (!this.hasRequestedPage(loadedCheerio, page))
                            return [2 /*return*/, []];
                        return [2 /*return*/, this.parseNovelsList(loadedCheerio)];
                }
            });
        });
    };
    return FuckNovelpia;
}());
exports.default = new FuckNovelpia();
var ParsingState;
(function (ParsingState) {
    ParsingState[ParsingState["Idle"] = 0] = "Idle";
    ParsingState[ParsingState["Novel"] = 1] = "Novel";
    ParsingState[ParsingState["NovelList"] = 2] = "NovelList";
})(ParsingState || (ParsingState = {}));
