const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const { URL } = require("node:url");

const PORT = Number(process.env.PORT || 4173);
const ROOT = __dirname;
const TMDB_TOKEN = process.env.TMDB_ACCESS_TOKEN;
const OMDB_KEY = process.env.OMDB_API_KEY;
const rtCache = new Map();
const castPhotoCache = new Map();

const mime = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
};

const json = (res, status, body) => {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(body));
};

async function tmdb(route, params = {}) {
  const url = new URL(`https://api.themoviedb.org/3${route}`);
  Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, value));
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${TMDB_TOKEN}`, accept: "application/json" },
  });
  if (!response.ok) throw new Error(`TMDB request failed (${response.status})`);
  return response.json();
}

async function fetchText(url, timeout = 9000) {
  const response = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0 (compatible; ReelFinder/1.0)", accept: "text/html,application/json" },
    signal: AbortSignal.timeout(timeout),
  });
  if (!response.ok) throw new Error(`Request failed (${response.status})`);
  return response.text();
}

const normalizeTitle = (value = "") => value.toLowerCase().replace(/&amp;/g, "and").replace(/&/g, "and").replace(/[^a-z0-9]+/g, " ").trim();
const decodeText = (value = "") => value.replace(/&amp;/g, "&").replace(/&#39;/g, "'").replace(/&quot;/g, '"');

async function castProfile(name) {
  if (castPhotoCache.has(name)) return castPhotoCache.get(name);
  let photo = null;
  try {
    const data = JSON.parse(await fetchText(`https://v3.sg.media-imdb.com/suggestion/x/${encodeURIComponent(name)}.json`));
    const people = (data.d || []).filter((item) => String(item.id || "").startsWith("nm"));
    const person = people.find((item) => normalizeTitle(item.l) === normalizeTitle(name)) || people[0];
    if (person?.i?.imageUrl) photo = person.i.imageUrl.replace(/\._V1_.*\.jpg$/i, "._V1_SX300.jpg");
  } catch (error) {
    console.error(`Cast image lookup failed for ${name}:`, error);
  }
  castPhotoCache.set(name, photo);
  return photo;
}

async function castProfiles(names) {
  return Promise.all(names.slice(0, 8).map(async (name) => ({ name, role: "Cast", photo: await castProfile(name) })));
}

async function rottenTomatoes(title, type) {
  const cacheKey = `${type}:${normalizeTitle(title)}`;
  if (rtCache.has(cacheKey)) return rtCache.get(cacheKey);
  const fallback = { score: "—", audienceScore: "—", reviewCount: 0, reviews: [], url: `https://www.rottentomatoes.com/search?search=${encodeURIComponent(title)}` };
  try {
    const searchHtml = await fetchText(fallback.url);
    const matches = [...searchHtml.matchAll(/href="(https:\/\/www\.rottentomatoes\.com\/(?:m|tv)\/[^"?#]+)"[^>]*data-qa="info-name"[^>]*slot="title"[^>]*>\s*([^<]+)</gi)]
      .map((match) => ({ url: match[1], title: decodeText(match[2].trim()) }));
    const wantedPrefix = type === "movie" ? "/m/" : "/tv/";
    const exact = matches.find((match) => match.url.includes(wantedPrefix) && normalizeTitle(match.title) === normalizeTitle(title));
    const candidate = exact || matches.find((match) => match.url.includes(wantedPrefix));
    if (!candidate) return fallback;
    const page = await fetchText(candidate.url);
    const reviewDataMatch = page.match(/<script type="application\/json" data-json="reviewsData">([\s\S]*?)<\/script>/i);
    let reviewData = {};
    try { reviewData = reviewDataMatch ? JSON.parse(reviewDataMatch[1]) : {}; } catch { reviewData = {}; }
    const score = reviewData.criticsScore?.score
      || page.match(/"criticsScore":\{[^}]*"score":"?(\d{1,3})"?/i)?.[1]
      || page.match(/"criticsScore":\{[^}]*"scorePercent":"(\d{1,3})%"/i)?.[1];
    const audienceScore = reviewData.audienceScore?.score;
    const reviews = (reviewData.reviews || []).slice(0, 5).map((review) => ({
      name: review.displayName || review.user?.displayName || "Audience member",
      rating: review.rating || null,
      text: (review.review || "").split(/\s+/).slice(0, 20).join(" ") + ((review.review || "").split(/\s+/).length > 20 ? "…" : ""),
      date: review.displayDate || "",
      verified: Boolean(review.isVerified),
    })).filter((review) => review.text);
    const result = {
      score: score ? `${score}%` : "—",
      audienceScore: audienceScore ? `${audienceScore}%` : "—",
      reviewCount: reviewData.audienceScore?.reviewCount || 0,
      reviews,
      url: candidate.url,
    };
    rtCache.set(cacheKey, result);
    return result;
  } catch {
    return fallback;
  }
}

async function justWatch(title, type, country = "US") {
  const query = `query Search($filter:TitleFilter!,$country:Country!,$language:Language!,$first:Int!,$platform:Platform!){popularTitles(country:$country,filter:$filter,first:$first){edges{node{id objectType content(country:$country,language:$language){title fullPath} offers(country:$country,platform:$platform){monetizationType standardWebURL package{clearName icon}}}}}}`;
  try {
    const response = await fetch("https://apis.justwatch.com/graphql", {
      method: "POST",
      headers: { "content-type": "application/json", "User-Agent": "Mozilla/5.0 (compatible; ReelFinder/1.0)" },
      body: JSON.stringify({ query, variables: { filter: { searchQuery: title }, country, language: "en", first: 6, platform: "WEB" } }),
      signal: AbortSignal.timeout(9000),
    });
    if (!response.ok) throw new Error(`JustWatch request failed (${response.status})`);
    const data = await response.json();
    const edges = data.data?.popularTitles?.edges || [];
    const wantedType = type === "movie" ? "MOVIE" : "SHOW";
    const exact = edges.find(({ node }) => node.objectType === wantedType && normalizeTitle(node.content?.title) === normalizeTitle(title));
    const match = exact || edges.find(({ node }) => node.objectType === wantedType);
    if (!match) return { providers: [], link: null };
    const priority = { FREE: 0, ADS: 1, FLATRATE: 2, RENT: 3, BUY: 4 };
    const offers = (match.node.offers || [])
      .filter((offer) => offer.package?.clearName && offer.standardWebURL)
      .sort((a, b) => (priority[a.monetizationType] ?? 9) - (priority[b.monetizationType] ?? 9));
    const unique = offers.filter((offer, index, all) => all.findIndex((item) => item.package.clearName === offer.package.clearName && item.monetizationType === offer.monetizationType) === index);
    return {
      providers: unique.slice(0, 10).map((offer) => ({
        name: offer.package.clearName,
        access: offer.monetizationType === "FLATRATE" ? "Stream" : offer.monetizationType === "ADS" ? "Free with ads" : offer.monetizationType === "FREE" ? "Free" : offer.monetizationType === "RENT" ? "Rent" : "Buy",
        link: offer.standardWebURL,
        logo: offer.package.icon ? `https://images.justwatch.com${offer.package.icon.replace("{profile}", "s100").replace("{format}", "png")}` : null,
      })),
      link: `https://www.justwatch.com${match.node.content?.fullPath || `/us/search?q=${encodeURIComponent(title)}`}`,
    };
  } catch (error) {
    console.error("JustWatch lookup failed:", error);
    return { providers: [], link: null };
  }
}

async function cinemetaSearch(query, type) {
  const remoteType = type === "tv" ? "series" : "movie";
  const url = `https://v3-cinemeta.strem.io/catalog/${remoteType}/top/search=${encodeURIComponent(query)}.json`;
  const data = JSON.parse(await fetchText(url));
  return (data.metas || []).slice(0, 8).map((item) => ({
    id: item.id,
    type,
    title: item.name,
    year: (item.releaseInfo || "").replace(/–|-$/, "") || "TBA",
    synopsis: item.description || "",
    poster: item.poster || null,
    backdrop: item.background || null,
    imdb: item.imdbRating || null,
    genres: item.genres || [],
    popularity: item.popularity || item.popularities?.stremio || 0,
  }));
}

async function cinemetaDetail(type, id, includeRt = true) {
  const remoteType = type === "tv" ? "series" : "movie";
  const raw = JSON.parse(await fetchText(`https://v3-cinemeta.strem.io/meta/${remoteType}/${encodeURIComponent(id)}.json`));
  const meta = raw.meta;
  if (!meta) throw new Error("Title not found");
  const episodes = (meta.videos || []).filter((episode) => Number(episode.season) > 0);
  const seasons = new Set(episodes.map((episode) => Number(episode.season)));
  const aired = episodes.filter((episode) => new Date(episode.firstAired || episode.released || 0) <= new Date());
  const latest = aired.sort((a, b) => new Date(b.firstAired || b.released) - new Date(a.firstAired || a.released))[0];
  const castNames = (meta.cast || []).slice(0, 8);
  const [rt, watching, actors] = includeRt
    ? await Promise.all([rottenTomatoes(meta.name, type), justWatch(meta.name, type), castProfiles(castNames)])
    : [{ score: "—", audienceScore: "—", reviewCount: 0, reviews: [], url: `https://www.rottentomatoes.com/search?search=${encodeURIComponent(meta.name)}` }, { providers: [], link: null }, castNames.map((name) => ({ name, role: "Cast", photo: null }))];
  const releaseDate = meta.released ? meta.released.slice(0, 10) : "To be announced";
  const releaseIsFuture = meta.released && new Date(meta.released) > new Date();
  return {
    id: meta.id || id,
    type,
    title: meta.name,
    year: meta.year || meta.releaseInfo || (meta.released || "").slice(0, 4) || "TBA",
    synopsis: meta.description || "A synopsis is not available yet.",
    poster: meta.poster || null,
    backdrop: meta.background || meta.poster || null,
    imdb: meta.imdbRating || "—",
    rottenTomatoes: rt.score,
    audienceScore: rt.audienceScore,
    audienceReviewCount: rt.reviewCount,
    audienceReviews: rt.reviews,
    genres: meta.genres || meta.genre || [],
    runtime: meta.runtime || (type === "tv" ? "Runtime unavailable" : "—"),
    releaseDate,
    status: releaseIsFuture ? "Upcoming" : (meta.status || (type === "movie" ? "Released" : "Status unavailable")),
    seasons: seasons.size || null,
    episodes: episodes.length || null,
    latestEpisode: latest ? `S${latest.season} E${latest.number || latest.episode} · ${latest.name}` : null,
    latestAirDate: latest ? (latest.firstAired || latest.released || "").slice(0, 10) : null,
    actors,
    trailer: meta.trailers?.[0]?.source ? `https://www.youtube.com/embed/${meta.trailers[0].source}?rel=0` : null,
    providers: watching.providers,
    providerLink: watching.link,
    imdbUrl: `https://www.imdb.com/title/${meta.imdb_id || id}/`,
    rottenTomatoesUrl: rt.url,
  };
}

async function handleSearch(url, res) {
  const query = (url.searchParams.get("q") || "").trim();
  if (!query) return json(res, 200, { results: [] });
  if (!TMDB_TOKEN) {
    const searches = await Promise.allSettled([cinemetaSearch(query, "movie"), cinemetaSearch(query, "tv")]);
    searches.forEach((result, index) => {
      if (result.status === "rejected") console.error(`Cinemeta ${index === 0 ? "movie" : "series"} search failed:`, result.reason);
    });
    let results = searches.flatMap((result) => result.status === "fulfilled" ? result.value : []);
    if (!results.length) return json(res, 200, { source: "cinemeta", results: [] });
    const wanted = normalizeTitle(query);
    results.sort((a, b) => {
      const score = (item) => normalizeTitle(item.title) === wanted ? 1000 : normalizeTitle(item.title).startsWith(wanted) ? 500 : 0;
      return score(b) - score(a) || Number(b.popularity || 0) - Number(a.popularity || 0);
    });
    results = results.slice(0, 12);
    const enriched = await Promise.all(results.map(async (result, index) => {
      if (index >= 4) return result;
      try {
        const detail = await cinemetaDetail(result.type, result.id, false);
        return { ...result, synopsis: detail.synopsis, imdb: detail.imdb, genres: detail.genres, runtime: detail.runtime };
      } catch { return result; }
    }));
    return json(res, 200, { source: "cinemeta", results: enriched });
  }
  const data = await tmdb("/search/multi", { query, include_adult: "false", language: "en-US" });
  const results = data.results
    .filter((item) => item.media_type === "movie" || item.media_type === "tv")
    .slice(0, 12)
    .map((item) => ({
      id: String(item.id),
      type: item.media_type,
      title: item.title || item.name,
      year: (item.release_date || item.first_air_date || "").slice(0, 4) || "TBA",
      synopsis: item.overview,
      poster: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : null,
      backdrop: item.backdrop_path ? `https://image.tmdb.org/t/p/w1280${item.backdrop_path}` : null,
      tmdbRating: item.vote_average ? item.vote_average.toFixed(1) : "—",
    }));
  json(res, 200, { results });
}

async function handleDetail(type, id, res) {
  if (!TMDB_TOKEN) return json(res, 404, { error: "Live data is not configured." });
  const [item, credits, videos, providers, external] = await Promise.all([
    tmdb(`/${type}/${id}`, { language: "en-US" }),
    tmdb(`/${type}/${id}/credits`, { language: "en-US" }),
    tmdb(`/${type}/${id}/videos`, { language: "en-US" }),
    tmdb(`/${type}/${id}/watch/providers`),
    tmdb(`/${type}/${id}/external_ids`),
  ]);

  let omdb = null;
  const imdbId = external.imdb_id;
  if (OMDB_KEY && imdbId) {
    const response = await fetch(`https://www.omdbapi.com/?apikey=${encodeURIComponent(OMDB_KEY)}&i=${encodeURIComponent(imdbId)}&plot=full`);
    if (response.ok) omdb = await response.json();
  }

  const trailer = videos.results.find((v) => v.site === "YouTube" && v.type === "Trailer" && v.official)
    || videos.results.find((v) => v.site === "YouTube" && v.type === "Trailer");
  const region = providers.results.US || Object.values(providers.results)[0] || {};
  const rating = (omdb?.Ratings || []).find((r) => r.Source === "Rotten Tomatoes")?.Value || "—";
  const rt = await rottenTomatoes(item.title || item.name, type);
  const released = type === "movie" ? item.release_date : item.first_air_date;
  const latest = item.last_episode_to_air;

  json(res, 200, {
    id: String(item.id),
    type,
    title: item.title || item.name,
    year: (released || "").slice(0, 4) || "TBA",
    synopsis: omdb?.Plot && omdb.Plot !== "N/A" ? omdb.Plot : item.overview,
    poster: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : null,
    backdrop: item.backdrop_path ? `https://image.tmdb.org/t/p/original${item.backdrop_path}` : null,
    imdb: omdb?.imdbRating && omdb.imdbRating !== "N/A" ? omdb.imdbRating : "—",
    rottenTomatoes: rating !== "—" ? rating : rt.score,
    audienceScore: rt.audienceScore,
    audienceReviewCount: rt.reviewCount,
    audienceReviews: rt.reviews,
    genres: item.genres?.map((g) => g.name) || [],
    runtime: type === "movie" ? `${item.runtime || "—"} min` : `${item.episode_run_time?.[0] || "—"} min episodes`,
    releaseDate: released || "To be announced",
    status: item.status,
    seasons: item.number_of_seasons,
    episodes: item.number_of_episodes,
    latestEpisode: latest ? `S${latest.season_number} E${latest.episode_number} · ${latest.name}` : null,
    latestAirDate: latest?.air_date,
    actors: credits.cast.slice(0, 8).map((person) => ({
      name: person.name,
      role: person.character,
      photo: person.profile_path ? `https://image.tmdb.org/t/p/w185${person.profile_path}` : null,
    })),
    trailer: trailer ? `https://www.youtube.com/embed/${trailer.key}?rel=0` : null,
    providers: [...(region.flatrate || []).map((provider) => ({ ...provider, access: "Stream" })), ...(region.rent || []).map((provider) => ({ ...provider, access: "Rent" })), ...(region.buy || []).map((provider) => ({ ...provider, access: "Buy" }))]
      .filter((provider, index, all) => all.findIndex((p) => p.provider_id === provider.provider_id) === index)
      .map((provider) => ({
        name: provider.provider_name,
        logo: `https://image.tmdb.org/t/p/w92${provider.logo_path}`,
        access: provider.access,
        link: region.link || null,
      })),
    providerLink: region.link || null,
    imdbUrl: imdbId ? `https://www.imdb.com/title/${imdbId}/` : null,
    rottenTomatoesUrl: `https://www.rottentomatoes.com/search?search=${encodeURIComponent(item.title || item.name)}`,
  });
}

function serveFile(pathname, res) {
  const relative = pathname === "/" ? "index.html" : pathname.replace(/^\/+/, "");
  const filePath = path.resolve(ROOT, relative);
  if (!filePath.startsWith(ROOT + path.sep) && filePath !== path.join(ROOT, "index.html")) {
    return json(res, 403, { error: "Forbidden" });
  }
  fs.readFile(filePath, (error, data) => {
    if (error) {
      if (!path.extname(pathname)) return serveFile("/index.html", res);
      res.writeHead(404); res.end("Not found"); return;
    }
    res.writeHead(200, { "Content-Type": mime[path.extname(filePath)] || "application/octet-stream" });
    res.end(data);
  });
}

async function requestHandler(req, res) {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);
    if (url.pathname === "/api/search") return await handleSearch(url, res);
    const match = url.pathname.match(/^\/api\/title\/(movie|tv)\/(\d+|tt\d+)$/);
    if (match) {
      if (!TMDB_TOKEN || match[2].startsWith("tt")) return json(res, 200, await cinemetaDetail(match[1], match[2]));
      return await handleDetail(match[1], match[2], res);
    }
    serveFile(url.pathname, res);
  } catch (error) {
    console.error(error);
    json(res, 500, { error: "The film desk could not load that right now." });
  }
}

if (require.main === module) {
  const server = http.createServer(requestHandler);
  server.listen(PORT, () => console.log(`Reel Finder is running at http://localhost:${PORT}`));
}

module.exports = requestHandler;
