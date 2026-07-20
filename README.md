# Reel Finder

A small, responsive movie and TV discovery app with a built-in demo catalogue and optional live data.

## Run it

```bash
npm start
```

Open `http://localhost:4173`.

## Enable live search

The app works immediately with live, no-key movie and TV search, IMDb ratings, synopses, cast, trailers, release information, and episode data. For more comprehensive regional streaming-provider data, set a TMDB API read-access token. Add an OMDb key to enrich TMDB results with IMDb and Rotten Tomatoes ratings.

```bash
TMDB_ACCESS_TOKEN="your_tmdb_read_token" OMDB_API_KEY="your_omdb_key" npm start
```

- TMDB provides search, metadata, cast, videos, external IDs, and watch-provider data.
- OMDb provides IMDb and Rotten Tomatoes ratings when available.
- Cinemeta powers the immediate no-key search and metadata fallback.
- Streaming availability is regional and can change; the interface links to JustWatch for a current cross-check.

No dependencies or build step are required; Node 18+ is enough.
