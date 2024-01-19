document.addEventListener("DOMContentLoaded", () => {
  const searchForm = document.querySelector(".search-form");
  const searchInput = document.querySelector(".search-input");
  const searchBtn = document.querySelector(".search-btn");
  const premiers = document.querySelector(".premiers");
  const releases = document.querySelector(".releases");
  const popular = document.querySelector(".popular");
  const closeReleases = document.querySelector(".close-releases");
  const movie = document.querySelector(".movie");

  const currentDate = new Date();
  const month = currentDate.toLocaleString("en-US", { month: "long" });
  const year = currentDate.getFullYear();

  const API_KEY = "72d22a44-c41a-4690-9718-8c298089bca8";

  const API_URL_PREMIERES = `https://kinopoiskapiunofficial.tech/api/v2.2/films/premieres?year=${year}&month=${month}`;
  const API_URL_RELEASES = `https://kinopoiskapiunofficial.tech/api/v2.1/films/releases?year=${year}&month=${month}&page=1`;
  const API_URL_TOP = `https://kinopoiskapiunofficial.tech/api/v2.2/films/collections?type=TOP_POPULAR_MOVIES&page=1`;
  const API_URL_CLOSE_RELEASES = `https://kinopoiskapiunofficial.tech/api/v2.2/films/collections?type=CLOSES_RELEASES&page=1`;

  // Search by keyword
  const KEYWORD = searchInput.value.trim("");
  const API_URL_KEYWORD = `https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword?keyword=${KEYWORD}&page=1`;

  async function getDataMovie(url) {
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "X-API-KEY": API_KEY,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      } else {
        const data = await response.json();
        displayMovieList(getParam(data));
      }
    } catch (error) {
      console.log("Error:", error);
    }
  }
  function getParam(data) {
    if (data.films) {
      return data.films;
    } else if (data.items) {
      return data.items;
    } else {
      return data.releases;
    }
  }

  function getLocal() {
    if (!localStorage.getItem("films")) {
      localStorage.setItem("films", JSON.stringify([]));
    }
  }

  function displayMovieList(data) {
    movie.innerHTML = "";
    data.forEach((item) => {
      let card = document.createElement("div");
      card.className = "movie__card";

      let block = document.createElement("div");
      block.className = "movie__card-block";

      let block_left = document.createElement("div");
      block_left.className = "block-left";
      let block_right = document.createElement("div");
      block_right.className = "block-right";

      let title = document.createElement("h2");
      title.className = "title";
      title.textContent = item.nameRu;

      let image = document.createElement("img");
      image.className = "movie__card-img";
      image.src = item.posterUrl;

      let icon = document.createElement("img");
      icon.classList = "icon";

      let rating = document.createElement("div");
      rating.className = "rating";
      // rating.textContent = item.rating;
      rating.innerHTML = "10";

      let year = document.createElement("div");
      year.textContent = item.year;
      year.className = "years";

      let genre = document.createElement("div");
      genre.className = "genre";
      genre.textContent = item.genres[0].genre;

      card.appendChild(image);
      block_left.append(title, year, genre);
      block_right.append(rating, icon);
      block.append(block_left, block_right);
      card.appendChild(block);
      movie.appendChild(card);
    });
  }

  function init() {
    searchInput.addEventListener("input", (e) => {
      if (e.key === "Enter") {
        console.log("Выполняется поиска" + searchInput.value);
      }
    });
    searchForm.addEventListener("submit", (e) => {
      e.preventDefault();
    });
  }

  init();

  premiers.addEventListener("click", () => {
    getDataMovie(API_URL_PREMIERES);
  });
  releases.addEventListener("click", () => {
    getDataMovie(API_URL_RELEASES);
  });
  popular.addEventListener("click", () => {
    getDataMovie(API_URL_TOP);
  });
  closeReleases.addEventListener("click", () => {
    getDataMovie(API_URL_CLOSE_RELEASES);
  });
});
