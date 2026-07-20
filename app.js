const IMG = {
  city: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=900&q=82",
  office: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=900&q=82",
  space: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=900&q=82",
  studio: "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=900&q=82",
  coast: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=82",
  noir: "https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=900&q=82",
};

const catalog = [
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
const state = { filter: "all", watchlist: new Set(JSON.parse(localStorage.getItem("reel-watchlist") || "[]")), searched: [] };

const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
const esc = (value = "") => String(value).replace(/[&<>'"]/g, (char) => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", "'":"&#39;", '"':"&quot;" }[char]));
const youtubeSearch = (query) => `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;

function cardMarkup(item, index = 0) {
  const key = `${item.type}:${item.id}`;
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

function renderGrid(target, items) {
  target.innerHTML = items.length ? items.map(cardMarkup).join("") : `<div class="empty"><strong>Nothing queued yet.</strong>Save a title and it’ll wait here for movie night.</div>`;
}

function renderShelf() {
  const items = catalog.filter((item) => state.filter === "all" || item.type === state.filter);
  renderGrid($("#titleGrid"), items);
}

function syncWatchlist() {
  localStorage.setItem("reel-watchlist", JSON.stringify([...state.watchlist]));
  $("#watchCount").textContent = state.watchlist.size;
  $$('[data-save]').forEach((button) => {
    const saved = state.watchlist.has(button.dataset.save);
    button.classList.toggle("saved", saved);
    button.setAttribute("aria-label", `${saved ? "Remove from" : "Add to"} watchlist`);
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
  return `<a class="provider" href="${esc(link || "#")}" ${link ? 'target="_blank" rel="noreferrer"' : ""}>
    ${provider.logo ? `<img src="${esc(provider.logo)}" alt="" />` : `<span class="avatar-fallback" style="width:38px;height:38px;font-size:13px">${esc(initials)}</span>`}<span>${esc(provider.name)}</span></a>`;
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
        <div class="rating-row"><span class="rating-pill"><b>IMDb</b> ${esc(item.imdb || "—")}/10</span><span class="rating-pill"><b>RT</b> ${esc(item.rottenTomatoes || "—")}</span></div>
        <div class="detail-actions">${trailer ? `<a class="primary" href="#trailer">Watch trailer ▶</a>` : trailerLink ? `<a class="primary" href="${trailerLink}" target="_blank" rel="noreferrer">Find trailer ▶</a>` : ""}<button data-save-detail="${esc(`${item.type}:${item.id}`)}">${state.watchlist.has(`${item.type}:${item.id}`) ? "Saved ✓" : "+ Watchlist"}</button></div>
      </div>
    </div>
    <div class="detail-body">
      ${item.latestEpisode ? `<div class="episode-banner"><div><small>${running ? "Latest episode · Still running" : "Final episode"}</small><strong>${esc(item.latestEpisode)}</strong></div><span>${esc(item.latestAirDate || "")}</span></div>` : ""}
      <div class="detail-columns"><div>
        <section class="detail-section"><h3>Cast</h3><div class="cast-list">${actors.map((actor) => `<div class="cast-person">${actor.photo ? `<img src="${esc(actor.photo)}" alt="${esc(actor.name)}" />` : `<div class="avatar-fallback">${esc(actor.name.split(" ").map((p) => p[0]).join("").slice(0,2))}</div>`}<strong>${esc(actor.name)}</strong><span>${esc(actor.role || "")}</span></div>`).join("")}</div></section>
        ${trailer ? `<section class="detail-section" id="trailer"><h3>Trailer</h3><iframe class="trailer" src="${esc(trailer)}" title="${esc(item.title)} trailer" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></section>` : ""}
      </div><aside>
        <section class="detail-section"><h3>Where to watch</h3>${item.providers?.length ? `<div class="providers">${item.providers.slice(0, 7).map((provider) => providerMarkup(provider, item.providerLink)).join("")}</div><p class="source-links"><a href="${esc(`https://www.justwatch.com/us/search?q=${encodeURIComponent(item.title)}`)}" target="_blank" rel="noreferrer">Check every service ↗</a></p>` : `<div class="no-provider">No legal streaming source is listed right now. Availability changes often.<br/><a href="${esc(`https://www.justwatch.com/us/search?q=${encodeURIComponent(item.title)}`)}" target="_blank" rel="noreferrer">Check JustWatch</a> · <a href="${esc(`https://www.google.com/search?q=${encodeURIComponent(`${item.title} legal streaming`)}`)}" target="_blank" rel="noreferrer">Search legal options</a></div>`}</section>
        <section class="detail-section"><h3>Release</h3><div class="provider"><span>${esc(item.releaseDate || "To be announced")}</span></div><div class="provider"><span>${esc(item.status || "Status unknown")}</span></div></section>
        <section class="detail-section"><h3>Sources</h3><div class="source-links">${item.imdbUrl ? `<a href="${esc(item.imdbUrl)}" target="_blank" rel="noreferrer">IMDb ↗</a>` : `<a href="${esc(`https://www.imdb.com/find/?q=${encodeURIComponent(item.title)}`)}" target="_blank" rel="noreferrer">IMDb ↗</a>`}<a href="${esc(item.rottenTomatoesUrl || `https://www.rottentomatoes.com/search?search=${encodeURIComponent(item.title)}`)}" target="_blank" rel="noreferrer">Rotten Tomatoes ↗</a></div></section>
      </aside></div>
    </div>`;
}

async function openDetail(key) {
  const dialog = $("#detailDialog");
  const content = $("#detailContent");
  let item = registry.get(key);
  dialog.showModal();
  document.body.style.overflow = "hidden";
  if (!item) return;
  if (/^(movie|tv):(\d+|tt\d+)$/.test(key) && !item.actors) {
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
  content.innerHTML = detailMarkup(item);
}

async function search(query) {
  const section = $("#results");
  const grid = $("#resultsGrid");
  const status = $("#resultStatus");
  section.hidden = false;
  $("#resultsTitle").textContent = `“${query}”`;
  status.textContent = "Searching the catalogue…";
  grid.innerHTML = "";
  section.scrollIntoView({ behavior: "smooth", block: "start" });
  try {
    const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
    const data = await response.json();
    let results = data.results || [];
    if (data.demo) {
      const needle = query.toLowerCase();
      results = catalog.filter((item) => [item.title, item.synopsis, ...(item.genres || []), ...(item.actors || []).flatMap((a) => [a.name, a.role])].join(" ").toLowerCase().includes(needle));
      status.textContent = results.length ? `${results.length} demo-catalog match${results.length === 1 ? "" : "es"}. Add TMDB and OMDb keys for live search.` : "No demo matches. Add API keys to search the full catalogue.";
    } else {
      status.textContent = `${results.length} live match${results.length === 1 ? "" : "es"}, ranked by title relevance.`;
    }
    results.forEach((item) => registry.set(`${item.type}:${item.id}`, item));
    state.searched = results;
    renderGrid(grid, results);
    if (!results.length) grid.innerHTML = `<div class="empty"><strong>No clean match.</strong>Try the exact title, an actor, or a shorter phrase.</div>`;
  } catch {
    status.textContent = "Search is offline right now.";
    grid.innerHTML = `<div class="empty"><strong>The projector stalled.</strong>Check the connection and try that search again.</div>`;
  }
}

document.addEventListener("click", (event) => {
  const open = event.target.closest("[data-open]");
  const hero = event.target.closest("[data-title-id]");
  const save = event.target.closest("[data-save], [data-save-detail]");
  const quick = event.target.closest("[data-query]");
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
  if (event.target.closest(".close-detail")) $("#detailDialog").close();
});

$("#searchForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const query = $("#searchInput").value.trim();
  if (query) search(query);
});
$("#detailDialog").addEventListener("close", () => { document.body.style.overflow = ""; $("#detailContent").innerHTML = ""; });
$("#detailDialog").addEventListener("click", (event) => { if (event.target === event.currentTarget) event.currentTarget.close(); });
$("#clearSearch").addEventListener("click", () => { $("#results").hidden = true; $("#searchInput").value = ""; $("#discover").scrollIntoView({behavior:"smooth"}); });
$("#watchlistLink").addEventListener("click", (event) => { event.preventDefault(); const section = $("#watchlist"); section.hidden = false; syncWatchlist(); section.scrollIntoView({behavior:"smooth"}); });
$("#randomButton").addEventListener("click", () => { const item = catalog[Math.floor(Math.random() * catalog.length)]; openDetail(`${item.type}:${item.id}`); });
$$('[data-filter]').forEach((button) => button.addEventListener("click", () => { state.filter = button.dataset.filter; $$('[data-filter]').forEach((b) => b.classList.toggle("selected", b === button)); renderShelf(); }));

$("#today").textContent = new Intl.DateTimeFormat("en", { month: "short", day: "numeric" }).format(new Date()).toUpperCase();
renderShelf();
syncWatchlist();
