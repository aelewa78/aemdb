const IMG = {
  city: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=900&q=82",
  office: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=900&q=82",
  space: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=900&q=82",
  studio: "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=900&q=82",
  coast: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=82",
  noir: "https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=900&q=82",
};

let catalog = [
  {
    id: "sinners", type: "movie", title: "Sinners", year: "2025", genres: ["Horror", "Drama"], runtime: "2h 17m",
    releaseDate: "2025-04-18", status: "Released", imdb: "7.5", rottenTomatoes: "97%", tmdbRating: "7.6",
    poster: IMG.city, backdrop: IMG.city,
    synopsis: "Trying to leave troubled lives behind, twin brothers return to their hometown to start again—only to discover that an even greater darkness is waiting to welcome them back.",
    actors: [{name:"Michael B. Jordan",role:"Smoke / Stack"},{name:"Hailee Steinfeld",role:"Mary"},{name:"Miles Caton",role:"Sammie"},{name:"Wunmi Mosaku",role:"Annie"}],
    providers: [{name:"Max"},{name:"Apple TV"},{name:"Prime Video"}], trailerQuery: "Sinners official trailer Warner Bros",
  },
  {
    id: "severance", type: "tv", title: "Severance", year: "2022", genres: ["Sci-Fi", "Mystery"], runtime: "50 min episodes",
    releaseDate: "2022-02-18", status: "Returning Series", imdb: "8.7", rottenTomatoes: "96%", tmdbRating: "8.4", seasons: 2, episodes: 19,
    latestEpisode: "S2 E10 · Cold Harbor", latestAirDate: "2025-03-21", poster: IMG.office, backdrop: IMG.office,
    synopsis: "At Lumon Industries, employees undergo a procedure that surgically divides their work and personal memories. Mark Scout begins to uncover the truth behind the experiment.",
    actors: [{name:"Adam Scott",role:"Mark Scout"},{name:"Britt Lower",role:"Helly Riggs"},{name:"Tramell Tillman",role:"Seth Milchick"},{name:"Zach Cherry",role:"Dylan George"}],
    providers: [{name:"Apple TV+"}], trailerQuery: "Severance season 2 official trailer Apple TV",
  },
  {
    id: "mickey17", type: "movie", title: "Mickey 17", year: "2025", genres: ["Sci-Fi", "Comedy"], runtime: "2h 17m",
    releaseDate: "2025-03-07", status: "Released", imdb: "6.8", rottenTomatoes: "77%", tmdbRating: "6.9", poster: IMG.space, backdrop: IMG.space,
    synopsis: "An expendable employee on a human expedition is sent on dangerous assignments and regenerated when he dies. Trouble begins when one version survives long enough to meet his replacement.",
    actors: [{name:"Robert Pattinson",role:"Mickey Barnes"},{name:"Naomi Ackie",role:"Nasha"},{name:"Steven Yeun",role:"Timo"},{name:"Toni Collette",role:"Gwen"}],
    providers: [], trailerQuery: "Mickey 17 official trailer Warner Bros",
  },
  {
    id: "thestudio", type: "tv", title: "The Studio", year: "2025", genres: ["Comedy"], runtime: "30 min episodes",
    releaseDate: "2025-03-26", status: "Returning Series", imdb: "8.1", rottenTomatoes: "93%", tmdbRating: "7.7", seasons: 1, episodes: 10,
    latestEpisode: "S1 E10 · The Presentation", latestAirDate: "2025-05-21", poster: IMG.studio, backdrop: IMG.studio,
    synopsis: "A newly appointed studio head scrambles to balance corporate demands with creative ambitions while trying to keep movies alive—and himself relevant.",
    actors: [{name:"Seth Rogen",role:"Matt Remick"},{name:"Catherine O’Hara",role:"Patty Leigh"},{name:"Ike Barinholtz",role:"Sal Saperstein"},{name:"Chase Sui Wonders",role:"Quinn Hackett"}],
    providers: [{name:"Apple TV+"}], trailerQuery: "The Studio official trailer Apple TV",
  },
  {
    id: "wildrobot", type: "movie", title: "The Wild Robot", year: "2024", genres: ["Animation", "Family"], runtime: "1h 42m",
    releaseDate: "2024-09-27", status: "Released", imdb: "8.2", rottenTomatoes: "97%", tmdbRating: "8.3", poster: IMG.coast, backdrop: IMG.coast,
    synopsis: "After a shipwreck, an intelligent robot is stranded on an uninhabited island and must learn to adapt, build relationships with the animals, and care for an orphaned gosling.",
    actors: [{name:"Lupita Nyong’o",role:"Roz"},{name:"Pedro Pascal",role:"Fink"},{name:"Kit Connor",role:"Brightbill"},{name:"Bill Nighy",role:"Longneck"}],
    providers: [{name:"Netflix"},{name:"Prime Video"}], trailerQuery: "The Wild Robot official trailer DreamWorks",
  },
  {
    id: "ripley", type: "tv", title: "Ripley", year: "2024", genres: ["Crime", "Drama"], runtime: "55 min episodes",
    releaseDate: "2024-04-04", status: "Ended", imdb: "8.1", rottenTomatoes: "86%", tmdbRating: "8.0", seasons: 1, episodes: 8,
    latestEpisode: "S1 E8 · Narcissus", latestAirDate: "2024-04-04", poster: IMG.noir, backdrop: IMG.noir,
    synopsis: "A grifter in 1960s New York is hired to bring a wealthy man’s son home from Italy, leading him into a life of deceit, fraud, and murder.",
    actors: [{name:"Andrew Scott",role:"Tom Ripley"},{name:"Dakota Fanning",role:"Marge Sherwood"},{name:"Johnny Flynn",role:"Dickie Greenleaf"},{name:"Maurizio Lombardi",role:"Inspector Ravini"}],
    providers: [{name:"Netflix"}], trailerQuery: "Ripley official trailer Netflix",
  },
];

const registry = new Map(catalog.map((item) => [`${item.type}:${item.id}`, item]));
const hasStorageConsent = () => document.cookie.split("; ").some((part) => part === "reel_storage_consent=accepted");
const readStored = (key, fallback) => {
  if (!hasStorageConsent()) return fallback;
  try { return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback)); } catch { return fallback; }
};
const state = {
  filter: "all",
  searchFilter: "all",
  watchlist: new Set(readStored("reel-watchlist", [])),
  reviews: readStored("reel-reviews", {}),
  preferences: readStored("reel-preferences", { genre: "all", format: "all", year: "all", runtime: "all", mood: "all" }),
  searched: [],
  searchRequest: 0,
  searchAbort: null,
};

const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
const esc = (value = "") => String(value).replace(/[&<>'"]/g, (char) => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", "'":"&#39;", '"':"&quot;" }[char]));
const youtubeSearch = (query) => `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
const keyFor = (item) => `${item.type}:${item.id}`;

function localReviewStats(key) {
  const reviews = state.reviews[key] || [];
  const average = reviews.length ? reviews.reduce((sum, review) => sum + Number(review.rating), 0) / reviews.length : 0;
  return { reviews, average };
}

function cardMarkup(item, index = 0) {
  const key = keyFor(item);
  const saved = state.watchlist.has(key);
  return `<article class="title-card" style="animation-delay:${index * 45}ms">
    <button class="save-button ${saved ? "saved" : ""}" data-save="${esc(key)}" aria-label="${saved ? "Remove from" : "Add to"} watchlist">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 4.5h12v16l-6-4-6 4z"/></svg>
    </button>
    <button class="card-poster" data-open="${esc(key)}" aria-label="Open ${esc(item.title)} details">
      ${item.poster ? `<img src="${esc(item.poster)}" alt="${esc(item.title)} artwork" />` : ""}
      <span class="card-type">${item.type === "tv" ? "Series" : "Film"}</span>
    </button>
    <div class="card-info"><div><h3>${esc(item.title)}</h3><div class="card-meta">${esc(item.year)} · ${esc((item.genres || []).slice(0, 2).join(" / ") || item.type)}</div></div><span class="tiny-rating">${esc(item.imdb || item.tmdbRating || "—")}</span></div>
  </article>`;
}

function resultCardMarkup(item, index = 0) {
  const key = keyFor(item);
  const saved = state.watchlist.has(key);
  const local = localReviewStats(key);
  return `<article class="search-result-card" data-card="${esc(key)}" style="animation-delay:${index * 35}ms">
    <button class="result-poster" data-open="${esc(key)}" aria-label="Open ${esc(item.title)} details">
      ${item.poster ? `<img src="${esc(item.poster)}" alt="${esc(item.title)} poster" />` : `<span class="poster-fallback">${esc(item.title.slice(0, 1))}</span>`}
    </button>
    <div class="result-copy">
      <div class="result-kicker"><span>${item.type === "tv" ? "Series" : "Film"}</span><span>${esc(item.year || "TBA")}</span><span>${esc((item.genres || []).slice(0, 3).join(" · "))}</span></div>
      <button class="result-title" data-open="${esc(key)}"><h3>${esc(item.title)}</h3></button>
      <p>${esc(item.synopsis || "Full synopsis and release information available in details.")}</p>
      <div class="result-availability" data-streaming>${item.providers?.length ? `Streaming on ${esc(item.providers.slice(0, 2).map((provider) => provider.name).join(" + "))}` : "Checking where to watch…"}</div>
      <div class="result-actions"><button class="open-result" data-open="${esc(key)}">Full details <span>↗</span></button><button class="save-result ${saved ? "saved" : ""}" data-save="${esc(key)}">${saved ? "Saved ✓" : "+ Watchlist"}</button></div>
    </div>
    <div class="score-deck" aria-label="Ratings">
      <div><small>IMDb</small><strong data-imdb>${esc(item.imdb || item.tmdbRating || "—")}</strong><span>/10</span></div>
      <div><small>Audience</small><strong data-audience>${esc(item.audienceScore || "—")}</strong><span>${item.audienceReviewCount ? `${Number(item.audienceReviewCount).toLocaleString()} ratings` : "Rotten Tomatoes"}</span></div>
      <div class="community-score"><small>Reel Finder</small><strong data-community>${local.average ? local.average.toFixed(1) : "—"}</strong><span>${local.reviews.length ? `${local.reviews.length} review${local.reviews.length === 1 ? "" : "s"}` : "Be the first"}</span></div>
    </div>
  </article>`;
}

function renderGrid(target, items) {
  target.innerHTML = items.length ? items.map(cardMarkup).join("") : `<div class="empty"><strong>Nothing queued yet.</strong>Save a title and it’ll wait here for movie night.</div>`;
}

function renderSearchResults() {
  const grid = $("#resultsGrid");
  const visible = state.searched.filter((item) => state.searchFilter === "all" || item.type === state.searchFilter);
  grid.innerHTML = visible.length ? visible.map(resultCardMarkup).join("") : `<div class="empty"><strong>No clean match.</strong>Try another title or switch the film/series filter.</div>`;
}

function renderShelf() {
  const preferences = state.preferences;
  const moodGenres = { light: ["Comedy", "Romance", "Music"], tense: ["Thriller", "Horror", "Crime", "Mystery"], thoughtful: ["Drama", "Documentary", "Sci-Fi"], family: ["Family", "Animation", "Adventure"] };
  const runtimeMinutes = (value = "") => {
    const hours = Number(value.match(/(\d+)h/)?.[1] || 0);
    const minutes = Number(value.match(/(\d+)\s*min/)?.[1] || 0);
    return hours * 60 + minutes;
  };
  const items = catalog.filter((item) => {
    const year = Number.parseInt(item.year, 10) || 0;
    const minutes = runtimeMinutes(item.runtime);
    const genres = item.genres || [];
    return (state.filter === "all" || item.type === state.filter)
      && (preferences.format === "all" || item.type === preferences.format)
      && (preferences.genre === "all" || genres.includes(preferences.genre))
      && (preferences.year === "all" || preferences.year === "new" && year >= 2020 || preferences.year === "modern" && year >= 2000 && year < 2020 || preferences.year === "classic" && year && year < 2000)
      && (preferences.runtime === "all" || !minutes || preferences.runtime === "short" && minutes < 45 || preferences.runtime === "medium" && minutes >= 45 && minutes <= 120 || preferences.runtime === "long" && minutes > 120)
      && (preferences.mood === "all" || moodGenres[preferences.mood].some((genre) => genres.includes(genre)));
  });
  renderGrid($("#titleGrid"), items);
  $("#filterSummary").textContent = `${items.length} recommendation${items.length === 1 ? "" : "s"} match your choices${preferences.runtime !== "all" && items.some((item) => !item.runtime) ? "; titles without runtime data remain included" : ""}.`;
  return items;
}

function setFeaturedPoster(button, image, titleNode, kickerNode, item, kicker) {
  if (!button || !image || !titleNode || !item) return;
  button.dataset.titleId = item.id;
  button.setAttribute("aria-label", `Open ${item.title} details`);
  image.src = item.backdrop || item.poster || IMG.studio;
  image.alt = `${item.title} artwork`;
  titleNode.textContent = item.title.toUpperCase();
  if (kickerNode) kickerNode.textContent = kicker;
}

function renderFeatured(items, updatedAt) {
  if (!items.length) return;
  catalog = items;
  items.forEach((item) => registry.set(keyFor(item), item));
  const main = items[0];
  const sideOne = items.find((item, index) => index > 0 && item.type !== main.type) || items[1];
  const sideTwo = items.find((item, index) => index > 0 && item !== sideOne && item.type === main.type) || items[2];
  setFeaturedPoster($(".poster-main"), $("#featuredMainImage"), $("#featuredMainTitle"), $("#featuredMainKicker"), main, "TRENDING THIS WEEK");
  setFeaturedPoster($(".poster-top"), $("#featuredSideOneImage"), $("#featuredSideOneTitle"), $("#featuredSideOneKicker"), sideOne, sideOne.type === "tv" ? "POPULAR SERIES" : "POPULAR FILM");
  setFeaturedPoster($(".poster-bottom"), $("#featuredSideTwoImage"), $("#featuredSideTwoTitle"), $("#featuredSideTwoKicker"), sideTwo, sideTwo.type === "tv" ? "POPULAR SERIES" : "POPULAR FILM");
  $("#featuredMainMeta").textContent = [main.year, ...(main.genres || []).slice(0, 2)].filter(Boolean).join(" · ");
  $("#catalogUpdated").textContent = `Updated ${new Intl.DateTimeFormat("en", { hour: "numeric", minute: "2-digit" }).format(new Date(updatedAt))}`;
  const genres = [...new Set(items.flatMap((item) => item.genres || []))].sort();
  $("#genreFilter").innerHTML = `<option value="all">Any genre</option>${genres.map((genre) => `<option value="${esc(genre)}">${esc(genre)}</option>`).join("")}`;
  Object.entries(state.preferences).forEach(([name, value]) => {
    const control = $(`#${name}Filter`);
    if (control && [...control.options].some((option) => option.value === value)) control.value = value;
  });
  renderShelf();
  syncWatchlist();
}

async function loadFeatured() {
  try {
    const response = await fetch("/api/featured");
    if (!response.ok) throw new Error();
    const data = await response.json();
    renderFeatured(data.items || [], data.updatedAt);
  } catch {
    $("#catalogUpdated").textContent = "Curated offline edition";
  }
}

function syncWatchlist() {
  if (hasStorageConsent()) localStorage.setItem("reel-watchlist", JSON.stringify([...state.watchlist]));
  $("#watchCount").textContent = state.watchlist.size;
  $("#mobileWatchCount").textContent = state.watchlist.size;
  $$('[data-save]').forEach((button) => {
    const saved = state.watchlist.has(button.dataset.save);
    button.classList.toggle("saved", saved);
    button.setAttribute("aria-label", `${saved ? "Remove from" : "Add to"} watchlist`);
    if (button.classList.contains("save-result")) button.textContent = saved ? "Saved ✓" : "+ Watchlist";
  });
  renderGrid($("#watchlistGrid"), [...state.watchlist].map((key) => registry.get(key)).filter(Boolean));
}

function toast(message) {
  const node = $("#toast");
  node.textContent = message;
  node.classList.add("show");
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => node.classList.remove("show"), 2200);
}

function providerMarkup(provider, link) {
  const initials = provider.name.split(/\s+/).map((part) => part[0]).join("").slice(0, 2);
  const target = provider.link || link;
  return `<a class="provider" href="${esc(target || "#")}" ${target ? 'target="_blank" rel="noreferrer"' : ""}>
    ${provider.logo ? `<img src="${esc(provider.logo)}" alt="" />` : `<span class="avatar-fallback" style="width:38px;height:38px;font-size:13px">${esc(initials)}</span>`}<span><strong>${esc(provider.name)}</strong><small>${esc(provider.access || "View options")}</small></span></a>`;
}

function reviewCardMarkup(review, local = false) {
  return `<article class="review-card ${local ? "local-review" : ""}">
    <div class="review-head"><span class="review-avatar">${esc((review.name || "A").split(" ").map((part) => part[0]).join("").slice(0, 2))}</span><div><strong>${esc(review.name || "Audience member")}</strong><small>${local ? "Reel Finder review" : review.verified ? "Verified audience" : "Audience review"}${review.date ? ` · ${esc(review.date)}` : ""}</small></div><span class="review-stars">★ ${esc(review.rating || "—")}/5</span></div>
    <p>${esc(review.text)}</p>
  </article>`;
}

function reviewsMarkup(item) {
  const key = keyFor(item);
  const local = localReviewStats(key);
  const external = (item.audienceReviews || []).slice(0, 5);
  const allReviews = [...local.reviews.map((review) => ({ ...review, local: true })), ...external];
  return `<section class="detail-section audience-section">
    <div class="audience-heading"><div><p class="detail-kicker">Audience notes</p><h3>User reviews</h3></div><div class="audience-big-score"><strong>${local.average ? local.average.toFixed(1) : item.audienceScore || "—"}</strong><span>${local.average ? `${local.reviews.length} Reel Finder review${local.reviews.length === 1 ? "" : "s"}` : item.audienceReviewCount ? `${Number(item.audienceReviewCount).toLocaleString()} audience ratings` : "No ratings yet"}</span></div></div>
    <form class="review-form" data-review-form="${esc(key)}">
      <div><label for="reviewName">Your name</label><input id="reviewName" name="name" maxlength="40" placeholder="Moviegoer" /></div>
      <div class="rating-field"><label>Your rating</label><div class="star-picker" role="radiogroup" aria-label="Your rating out of five">${[1,2,3,4,5].map((star) => `<button type="button" role="radio" aria-checked="false" data-star="${star}" aria-label="${star} star${star === 1 ? "" : "s"}">★</button>`).join("")}</div><input type="hidden" name="rating" required /></div>
      <div class="review-text"><label for="reviewText">Your review</label><textarea id="reviewText" name="text" maxlength="500" required placeholder="What worked—or didn’t?"></textarea></div>
      <button class="submit-review" type="submit">Publish review</button>
    </form>
    <div class="review-list">${allReviews.length ? allReviews.map((review) => reviewCardMarkup(review, review.local)).join("") : `<div class="no-reviews">No audience notes yet. Be the first to leave one.</div>`}</div>
    ${external.length && item.rottenTomatoesUrl ? `<a class="all-reviews-link" href="${esc(item.rottenTomatoesUrl)}" target="_blank" rel="noreferrer">Read more audience reviews on Rotten Tomatoes ↗</a>` : ""}
  </section>`;
}

function detailMarkup(item) {
  const running = item.type === "tv" && /returning|production/i.test(item.status || "");
  const trailer = item.trailer;
  const trailerLink = item.trailerQuery ? youtubeSearch(item.trailerQuery) : null;
  const meta = [item.year, item.runtime, ...(item.genres || []), item.type === "tv" ? `${item.seasons || "—"} seasons · ${item.episodes || "—"} episodes` : null].filter(Boolean);
  const actors = (item.actors || []).slice(0, 8);
  return `<div class="detail-hero" style="background-image:url('${esc(item.backdrop || item.poster || IMG.studio)}')">
      <button class="close-detail" aria-label="Close details">×</button>
      <div class="detail-copy">
        <p class="detail-kicker">${item.type === "tv" ? (running ? "Now running · Series" : "Television series") : "Feature film"}</p>
        <h2>${esc(item.title)}</h2>
        <div class="detail-meta">${meta.map((m) => `<span>${esc(m)}</span>`).join("")}</div>
        <p class="synopsis">${esc(item.synopsis || "A synopsis is not available yet.")}</p>
        <div class="rating-row"><span class="rating-pill"><b>IMDb</b> ${esc(item.imdb || "—")}/10</span><span class="rating-pill"><b>Tomatometer</b> ${esc(item.rottenTomatoes || "—")}</span><span class="rating-pill"><b>Audience</b> ${esc(item.audienceScore || "—")}</span></div>
        <div class="detail-actions">${trailer ? `<a class="primary" href="#trailer">Watch trailer ▶</a>` : trailerLink ? `<a class="primary" href="${trailerLink}" target="_blank" rel="noreferrer">Find trailer ▶</a>` : ""}<button data-save-detail="${esc(`${item.type}:${item.id}`)}">${state.watchlist.has(`${item.type}:${item.id}`) ? "Saved ✓" : "+ Watchlist"}</button><button data-share="${esc(`${item.type}:${item.id}`)}">Share ↗</button></div>
      </div>
    </div>
    <div class="detail-body">
      ${item.latestEpisode ? `<div class="episode-banner"><div><small>${running ? "Latest episode · Still running" : "Final episode"}</small><strong>${esc(item.latestEpisode)}</strong></div><span>${esc(item.latestAirDate || "")}</span></div>` : ""}
      <div class="detail-columns"><div>
        <section class="detail-section"><h3>Cast</h3><div class="cast-list">${actors.map((actor) => `<div class="cast-person">${actor.photo ? `<img src="${esc(actor.photo)}" alt="${esc(actor.name)}" />` : `<div class="avatar-fallback">${esc(actor.name.split(" ").map((p) => p[0]).join("").slice(0,2))}</div>`}<strong>${esc(actor.name)}</strong><span>${esc(actor.role || "")}</span></div>`).join("")}</div></section>
        ${trailer ? `<section class="detail-section" id="trailer"><h3>Trailer</h3><iframe class="trailer" src="${esc(trailer)}" title="${esc(item.title)} trailer" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></section>` : ""}
      </div><aside>
        <section class="detail-section"><div class="watch-heading"><h3>Where to watch</h3><span>US · ${item.lastChecked ? `checked ${esc(new Intl.DateTimeFormat("en", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }).format(new Date(item.lastChecked)))}` : "availability"}</span></div>${item.providers?.length ? `<div class="providers">${item.providers.slice(0, 10).map((provider) => providerMarkup(provider, item.providerLink)).join("")}</div><p class="source-links"><a href="${esc(item.providerLink || `https://www.justwatch.com/us/search?q=${encodeURIComponent(item.title)}`)}" target="_blank" rel="noreferrer">Compare every legal option ↗</a></p>` : item.providerStatus === "unavailable" ? `<div class="no-provider"><strong>Availability couldn’t be checked.</strong><br/>The catalogue source did not respond. Try again later or check JustWatch directly.<br/><a href="${esc(`https://www.justwatch.com/us/search?q=${encodeURIComponent(item.title)}`)}" target="_blank" rel="noreferrer">Check JustWatch</a></div>` : `<div class="no-provider"><strong>No legal stream is currently listed.</strong><br/>Availability changes often. Check again or search verified stores.<br/><a href="${esc(`https://www.justwatch.com/us/search?q=${encodeURIComponent(item.title)}`)}" target="_blank" rel="noreferrer">Check JustWatch</a> · <a href="${esc(`https://www.google.com/search?q=${encodeURIComponent(`${item.title} legal streaming`)}`)}" target="_blank" rel="noreferrer">Search legal options</a></div>`}</section>
        <section class="detail-section"><h3>Release</h3><div class="provider"><span>${esc(item.releaseDate || "To be announced")}</span></div><div class="provider"><span>${esc(item.status || "Status unknown")}</span></div></section>
        <section class="detail-section"><h3>Sources</h3><div class="source-links">${item.imdbUrl ? `<a href="${esc(item.imdbUrl)}" target="_blank" rel="noreferrer">IMDb ↗</a>` : `<a href="${esc(`https://www.imdb.com/find/?q=${encodeURIComponent(item.title)}`)}" target="_blank" rel="noreferrer">IMDb ↗</a>`}<a href="${esc(item.rottenTomatoesUrl || `https://www.rottentomatoes.com/search?search=${encodeURIComponent(item.title)}`)}" target="_blank" rel="noreferrer">Rotten Tomatoes ↗</a></div></section>
      </aside></div>
      ${reviewsMarkup(item)}
    </div>`;
}

function syncTitleMetadata(item, push = true) {
  const url = new URL(location.href);
  url.searchParams.set("title", keyFor(item));
  history[push ? "pushState" : "replaceState"]({ title: keyFor(item) }, "", url);
  document.title = `${item.title} — Reel Finder`;
  document.querySelector('meta[name="description"]').content = item.synopsis || `Ratings and streaming availability for ${item.title}.`;
  document.querySelector('meta[property="og:title"]').content = `${item.title} — Reel Finder`;
  document.querySelector('meta[property="og:description"]').content = item.synopsis || `See where to watch ${item.title}.`;
  $("#canonicalUrl").href = url.href;
  let structured = $("#titleStructuredData");
  if (!structured) { structured = document.createElement("script"); structured.id = "titleStructuredData"; structured.type = "application/ld+json"; document.head.append(structured); }
  structured.textContent = JSON.stringify({ "@context": "https://schema.org", "@type": item.type === "tv" ? "TVSeries" : "Movie", name: item.title, dateCreated: item.year, description: item.synopsis, image: item.poster || item.backdrop });
}

function resetTitleMetadata() {
  const url = new URL(location.href); url.searchParams.delete("title"); history.replaceState({}, "", url);
  document.title = "Reel Finder — What to watch, without the wandering";
  $("#canonicalUrl").href = `${location.origin}${location.pathname}`;
  $("#titleStructuredData")?.remove();
}

async function openDetail(key, { updateUrl = true } = {}) {
  const dialog = $("#detailDialog");
  const content = $("#detailContent");
  let item = registry.get(key);
  dialog.showModal();
  document.body.style.overflow = "hidden";
  if (/^(movie|tv):(\d+|tt\d+)$/.test(key) && (!item || !item.actors)) {
    content.innerHTML = `<div class="dialog-loading">THREADING THE REEL…</div>`;
    try {
      const [type, id] = key.split(":");
      const response = await fetch(`/api/title/${type}/${id}`);
      if (!response.ok) throw new Error();
      item = await response.json();
      registry.set(key, item);
    } catch {
      toast("Details couldn’t be loaded. Try again shortly.");
    }
  }
  if (!item) { dialog.close(); return; }
  content.innerHTML = detailMarkup(item);
  syncTitleMetadata(item, updateUrl);
}

async function enrichSearchResults(results, requestId) {
  await Promise.allSettled(results.slice(0, 6).map(async (item) => {
    if (item.actors || !/^(\d+|tt\d+)$/.test(String(item.id))) return;
    const key = keyFor(item);
    try {
      const response = await fetch(`/api/title/${item.type}/${item.id}`);
      if (!response.ok || requestId !== state.searchRequest) return;
      const detail = await response.json();
      Object.assign(item, detail);
      registry.set(key, item);
      const card = document.querySelector(`[data-card="${CSS.escape(key)}"]`);
      if (!card) return;
      const imdb = $("[data-imdb]", card);
      const audience = $("[data-audience]", card);
      const streaming = $("[data-streaming]", card);
      if (imdb) imdb.textContent = item.imdb || "—";
      if (audience) audience.textContent = item.audienceScore || "—";
      if (audience?.nextElementSibling) audience.nextElementSibling.textContent = item.audienceReviewCount ? `${Number(item.audienceReviewCount).toLocaleString()} ratings` : "Rotten Tomatoes";
      if (streaming) streaming.textContent = item.providers?.length ? `Available on ${item.providers.slice(0, 3).map((provider) => provider.name).join(" · ")}` : "No legal stream currently listed";
    } catch {
      const card = document.querySelector(`[data-card="${CSS.escape(key)}"]`);
      const streaming = card && $("[data-streaming]", card);
      if (streaming) streaming.textContent = "Open for availability details";
    }
  }));
}

async function search(query, { scroll = true } = {}) {
  const section = $("#results");
  const grid = $("#resultsGrid");
  const status = $("#resultStatus");
  const requestId = ++state.searchRequest;
  state.searchAbort?.abort();
  state.searchAbort = new AbortController();
  section.hidden = false;
  $("#resultsTitle").textContent = `“${query}”`;
  status.textContent = "Searching films and television…";
  grid.setAttribute("aria-busy", "true");
  grid.innerHTML = `<div class="search-skeleton"></div><div class="search-skeleton"></div><div class="search-skeleton"></div>`;
  if (scroll) section.scrollIntoView({ behavior: "smooth", block: "start" });
  try {
    const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`, { signal: state.searchAbort.signal });
    const data = await response.json();
    if (requestId !== state.searchRequest) return;
    let results = data.results || [];
    if (data.demo) {
      const needle = query.toLowerCase();
      results = catalog.filter((item) => [item.title, item.synopsis, ...(item.genres || []), ...(item.actors || []).flatMap((a) => [a.name, a.role])].join(" ").toLowerCase().includes(needle));
      status.textContent = results.length ? `${results.length} demo-catalog match${results.length === 1 ? "" : "es"}. Add TMDB and OMDb keys for live search.` : "No demo matches. Add API keys to search the full catalogue.";
    } else {
      status.textContent = `${results.length} match${results.length === 1 ? "" : "es"}, best match first. Ratings and availability are still loading.`;
    }
    results.forEach((item) => registry.set(`${item.type}:${item.id}`, item));
    state.searched = results;
    renderSearchResults();
    grid.setAttribute("aria-busy", "false");
    enrichSearchResults(results, requestId).then(() => {
      if (requestId === state.searchRequest) status.textContent = `${results.length} match${results.length === 1 ? "" : "es"}, best match first.`;
    });
  } catch (error) {
    if (error.name === "AbortError") return;
    status.textContent = "Search is offline right now.";
    grid.innerHTML = `<div class="empty"><strong>The projector stalled.</strong>Check the connection and try that search again.</div>`;
    grid.setAttribute("aria-busy", "false");
  }
}

document.addEventListener("click", (event) => {
  const open = event.target.closest("[data-open]");
  const hero = event.target.closest("[data-title-id]");
  const save = event.target.closest("[data-save], [data-save-detail]");
  const quick = event.target.closest("[data-query]");
  const star = event.target.closest("[data-star]");
  const resultFilter = event.target.closest("[data-result-filter]");
  const share = event.target.closest("[data-share]");
  if (open) openDetail(open.dataset.open);
  if (hero) {
    const item = catalog.find((entry) => entry.id === hero.dataset.titleId);
    if (item) openDetail(`${item.type}:${item.id}`);
  }
  if (save) {
    const key = save.dataset.save || save.dataset.saveDetail;
    state.watchlist.has(key) ? state.watchlist.delete(key) : state.watchlist.add(key);
    syncWatchlist();
    if (save.dataset.saveDetail) save.textContent = state.watchlist.has(key) ? "Saved ✓" : "+ Watchlist";
    toast(state.watchlist.has(key) ? "Saved to your watchlist" : "Removed from your watchlist");
  }
  if (quick) { $("#searchInput").value = quick.dataset.query; search(quick.dataset.query); }
  if (star) {
    const picker = star.closest(".star-picker");
    const rating = Number(star.dataset.star);
    $$('[data-star]', picker).forEach((button) => {
      button.classList.toggle("selected", Number(button.dataset.star) <= rating);
      button.setAttribute("aria-checked", String(Number(button.dataset.star) === rating));
    });
    picker.nextElementSibling.value = rating;
  }
  if (resultFilter) {
    state.searchFilter = resultFilter.dataset.resultFilter;
    $$('[data-result-filter]').forEach((button) => button.classList.toggle("selected", button === resultFilter));
    renderSearchResults();
  }
  if (share) {
    const item = registry.get(share.dataset.share);
    const shareUrl = new URL(location.href);
    shareUrl.searchParams.set("title", share.dataset.share);
    if (navigator.share) navigator.share({ title: `${item?.title || "Title"} — Reel Finder`, text: item?.synopsis || "See ratings and where to watch.", url: shareUrl.href }).catch(() => {});
    else navigator.clipboard?.writeText(shareUrl.href).then(() => toast("Share link copied"));
  }
  if (event.target.closest(".close-detail")) $("#detailDialog").close();
});

document.addEventListener("submit", (event) => {
  const form = event.target.closest("[data-review-form]");
  if (!form) return;
  event.preventDefault();
  const data = new FormData(form);
  const rating = Number(data.get("rating"));
  const text = String(data.get("text") || "").trim();
  if (!rating || !text) { toast("Choose a star rating and write a short review."); return; }
  const key = form.dataset.reviewForm;
  const review = { name: String(data.get("name") || "Moviegoer").trim() || "Moviegoer", rating, text, date: "Just now", createdAt: Date.now() };
  state.reviews[key] = [review, ...(state.reviews[key] || [])];
  if (hasStorageConsent()) localStorage.setItem("reel-reviews", JSON.stringify(state.reviews));
  const item = registry.get(key);
  $("#detailContent").innerHTML = detailMarkup(item);
  renderSearchResults();
  toast("Your review is live on this device.");
});

$("#searchForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const query = $("#searchInput").value.trim();
  if (query) search(query);
});
let liveSearchTimer;
$("#searchInput").addEventListener("input", (event) => {
  clearTimeout(liveSearchTimer);
  const query = event.target.value.trim();
  if (query.length < 3) return;
  liveSearchTimer = setTimeout(() => search(query, { scroll: false }), 480);
});
$("#detailDialog").addEventListener("close", () => { document.body.style.overflow = ""; $("#detailContent").innerHTML = ""; resetTitleMetadata(); });
$("#detailDialog").addEventListener("click", (event) => { if (event.target === event.currentTarget) event.currentTarget.close(); });
$("#clearSearch").addEventListener("click", () => { state.searchAbort?.abort(); state.searched = []; $("#results").hidden = true; $("#searchInput").value = ""; $("#discover").scrollIntoView({behavior:"smooth"}); });
$("#watchlistLink").addEventListener("click", (event) => { event.preventDefault(); const section = $("#watchlist"); section.hidden = false; syncWatchlist(); section.scrollIntoView({behavior:"smooth"}); });
$("#mobileWatchlistLink").addEventListener("click", (event) => { event.preventDefault(); $("#watchlistLink").click(); });
$("#randomButton").addEventListener("click", () => { const item = catalog[Math.floor(Math.random() * catalog.length)]; openDetail(`${item.type}:${item.id}`); });
$("#smartPickButton").addEventListener("click", () => {
  const matches = renderShelf();
  if (!matches.length) { toast("No title matches every choice yet. Try widening one filter."); return; }
  openDetail(keyFor(matches[Math.floor(Math.random() * matches.length)]));
});
$$('[data-filter]').forEach((button) => button.addEventListener("click", () => { state.filter = button.dataset.filter; $$('[data-filter]').forEach((b) => b.classList.toggle("selected", b === button)); renderShelf(); }));

[$("#genreFilter"), $("#formatFilter"), $("#yearFilter"), $("#runtimeFilter"), $("#moodFilter")].forEach((control) => control.addEventListener("change", () => {
  state.preferences = { genre: $("#genreFilter").value, format: $("#formatFilter").value, year: $("#yearFilter").value, runtime: $("#runtimeFilter").value, mood: $("#moodFilter").value };
  if (hasStorageConsent()) localStorage.setItem("reel-preferences", JSON.stringify(state.preferences));
  renderShelf();
}));

const cookieNotice = $("#cookieNotice");
if (!document.cookie.split("; ").some((part) => part.startsWith("reel_storage_consent="))) cookieNotice.hidden = false;
$("#acceptCookies").addEventListener("click", () => {
  document.cookie = "reel_storage_consent=accepted; Max-Age=31536000; Path=/; SameSite=Lax";
  localStorage.setItem("reel-watchlist", JSON.stringify([...state.watchlist]));
  localStorage.setItem("reel-reviews", JSON.stringify(state.reviews));
  localStorage.setItem("reel-preferences", JSON.stringify(state.preferences));
  cookieNotice.hidden = true;
  toast("Device storage allowed");
});
$("#declineCookies").addEventListener("click", () => {
  document.cookie = "reel_storage_consent=declined; Max-Age=2592000; Path=/; SameSite=Lax";
  cookieNotice.hidden = true;
  toast("Choices will last only for this visit");
});

window.addEventListener("popstate", () => {
  const key = new URL(location.href).searchParams.get("title");
  if (key) openDetail(key, { updateUrl: false });
  else if ($("#detailDialog").open) $("#detailDialog").close();
});

renderShelf();
syncWatchlist();
loadFeatured();
const initialTitle = new URL(location.href).searchParams.get("title");
if (initialTitle) openDetail(initialTitle, { updateUrl: false });
