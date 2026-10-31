// Buks manga plugin — MangaDex (official JSON API, no scraping).
// Follows the buks manga plugin method set (Mihon-style):
//   popularManga(page), searchManga(term, page), mangaDetails(path),
//   chapterList(path), pageList(chapterPath)
'use strict';
var fetchApi = require('@libs/fetch').fetchApi;
var API = 'https://api.mangadex.org';
var COVERS = 'https://uploads.mangadex.org/covers/';
var PAGE_LIMIT = 100;
var FEED_LIMIT = 500;

function fetchJson(url) {
  return fetchApi(url, { headers: { 'Accept': 'application/json' } }).then(function (r) {
    if (!r.ok) throw new Error('MangaDex HTTP ' + r.status);
    return r.json();
  });
}

function firstTitle(attrs) {
  var t = attrs.title || {};
  return t.en || t['ja-ro'] || (Object.keys(t).length ? t[Object.keys(t)[0]] : undefined);
}

function mapManga(m) {
  var attrs = m.attributes || {};
  var cover = null;
  var rels = attrs.relationships || [];
  for (var i = 0; i < rels.length; i++) {
    if (rels[i].type === 'cover_art') { cover = rels[i].attributes && rels[i].attributes.fileName; break; }
  }
  var alt = (attrs.altTitles || []).map(function (t) { return t.en; }).filter(Boolean);
  return {
    name: firstTitle(attrs) || alt[0] || 'Unknown',
    path: '/manga/' + m.id,
    cover: cover ? (COVERS + m.id + '/' + cover + '.512.jpg') : undefined,
  };
}

function MangaDexPlugin() {
  this.id = 'mangadex';
  this.name = 'MangaDex';
  this.site = 'https://mangadex.org';
  this.version = '1.0.0';
  this.type = 'manga';
  this.lang = 'en';
}

MangaDexPlugin.prototype.popularManga = function (page) {
  var offset = (page - 1) * PAGE_LIMIT;
  var url = API + '/manga?limit=' + PAGE_LIMIT + '&offset=' + offset +
    '&order[followedCount]=desc&contentRating[]=safe&contentRating[]=suggestive' +
    '&includes[]=cover_art&hasAvailableChapters=true';
  return fetchJson(url).then(function (d) {
    return { mangas: (d.data || []).map(mapManga), hasNextPage: (d.data || []).length >= PAGE_LIMIT };
  });
};

MangaDexPlugin.prototype.searchManga = function (searchTerm, page) {
  var offset = (page - 1) * PAGE_LIMIT;
  var url = API + '/manga?limit=' + PAGE_LIMIT + '&offset=' + offset +
    '&title=' + encodeURIComponent(searchTerm) +
    '&order[relevance]=desc&contentRating[]=safe&contentRating[]=suggestive' +
    '&includes[]=cover_art';
  return fetchJson(url).then(function (d) {
    return { mangas: (d.data || []).map(mapManga), hasNextPage: (d.data || []).length >= PAGE_LIMIT };
  });
};

MangaDexPlugin.prototype.mangaDetails = function (novelPath) {
  var id = novelPath.replace(/^\/manga\//, '').split('/')[0];
  var url = API + '/manga/' + id + '?includes[]=cover_art&includes[]=author&includes[]=artist';
  return fetchJson(url).then(function (d) {
    var attrs = (d.data && d.data.attributes) || {};
    var tags = (attrs.tags || []).map(function (t) { return t.attributes && t.attributes.name && (t.attributes.name.en || Object.values(t.attributes.name)[0]); }).filter(Boolean);
    var desc = attrs.description && (attrs.description.en || Object.values(attrs.description)[0]);
    var statusMap = { 'ongoing': 'Ongoing', 'completed': 'Completed', 'hiatus': 'On Hiatus', 'cancelled': 'Cancelled' };
    var author = null;
    var rels = (d.data && d.data.relationships) || [];
    for (var i = 0; i < rels.length; i++) {
      if (rels[i].type === 'author' && rels[i].attributes && rels[i].attributes.name) { author = rels[i].attributes.name; break; }
    }
    var cover = null;
    for (var j = 0; j < rels.length; j++) {
      if (rels[j].type === 'cover_art' && rels[j].attributes) { cover = rels[j].attributes.fileName; break; }
    }
    return {
      name: firstTitle(attrs) || id,
      path: novelPath,
      author: author || undefined,
      cover: cover ? (COVERS + id + '/' + cover + '.512.jpg') : undefined,
      description: desc || '',
      tags: tags,
      status: statusMap[attrs.status] || 'Unknown',
      chapters: [],
    };
  });
};

MangaDexPlugin.prototype.chapterList = function (novelPath) {
  var id = novelPath.replace(/^\/manga\//, '').split('/')[0];
  var chapters = [];
  function feed(offset) {
    var url = API + '/manga/' + id + '/feed?limit=' + FEED_LIMIT + '&offset=' + offset +
      '&translatedLanguage[]=en&order[chapter]=asc&includeExternalUrl=0' +
      '&contentRating[]=safe&contentRating[]=suggestive&contentRating[]=erotica';
    return fetchJson(url).then(function (d) {
      var data = d.data || [];
      for (var i = 0; i < data.length; i++) {
        var a = data[i].attributes || {};
        var label = 'Chapter ' + (a.chapter || '?');
        if (a.title) label += ': ' + a.title;
        chapters.push({
          name: label,
          path: '/chapter/' + data[i].id,
          releaseTime: a.publishAt || a.createdAt || undefined,
        });
      }
      if (data.length >= FEED_LIMIT) return feed(offset + FEED_LIMIT);
      return { chapters: chapters };
    });
  }
  return feed(0);
};

MangaDexPlugin.prototype.pageList = function (chapterPath) {
  var id = chapterPath.replace(/^\/chapter\//, '').split('/')[0];
  return fetchJson(API + '/at-home/server/' + id + '?forcePort443=false').then(function (d) {
    var chapter = d.chapter || {};
    var base = d.baseUrl;
    if (!base) throw new Error('No page server for this chapter');
    var hash = chapter.hash;
    var files = chapter.data || [];
    var pages = [];
    for (var i = 0; i < files.length; i++) {
      pages.push(base + '/data/' + hash + '/' + files[i]);
    }
    return { pages: pages };
  });
};

exports.default = new MangaDexPlugin();
