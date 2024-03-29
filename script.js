document.addEventListener("DOMContentLoaded", () => {
  const searchForm = document.querySelector(".search-form");
  const searchInput = document.querySelector(".search-input");
  const searchBtn = document.querySelector(".search-btn");
  const logo = document.querySelector(".logo-container");
  const navigationList = document.querySelector(".header-nav__list");
  const navigationItem = document.querySelector(".nav-item");

  const premiers = document.querySelector(".premiers");
  const releases = document.querySelector(".releases");
  const popular = document.querySelector(".popular");
  const closeReleases = document.querySelector(".close-releases");
  const favorites = document.querySelector(".header-nav__favorites");
  const movie = document.querySelector(".movie");

  const currentDate = new Date();
  const month = currentDate.toLocaleString("en-US", { month: "long" });
  const year = currentDate.getFullYear();

  const API_KEY = "72d22a44-c41a-4690-9718-8c298089bca8";

  const API_URL_PREMIERES = `https://kinopoiskapiunofficial.tech/api/v2.2/films/premieres?year=${year}&month=${month}`;
  const API_URL_RELEASES = `https://kinopoiskapiunofficial.tech/api/v2.1/films/releases?year=${year}&month=${month}&page=1`;
  const API_URL_TOP = `https://kinopoiskapiunofficial.tech/api/v2.2/films/collections?type=TOP_POPULAR_MOVIES&page=1`;
  const API_URL_CLOSE_RELEASES = `https://kinopoiskapiunofficial.tech/api/v2.2/films/collections?type=CLOSES_RELEASES&page=1`;

  const KEYWORD = searchInput.value.trim();
  const API_URL_KEYWORD = `https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword?keyword=${KEYWORD}&page=1`;

  getLocal();

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

      let blockLeft = document.createElement("div");
      blockLeft.className = "block-left";
      let blockTop = document.createElement("div");
      blockTop.className = "block-top";

      let title = document.createElement("h2");
      title.className = "title";
      title.textContent = item.nameRu;

      let image = document.createElement("img");
      image.className = "movie__card-img";
      image.src = item.posterUrl;

      let icon = document.createElement("img");
      icon.classList = "icon";
      icon.src = isFavorite(item)
        ? "./image/heart_fill.svg"
        : "./image/heart_outline.svg";

      icon.addEventListener("click", () => {
        toggleFavorite(item);
        icon.src = isFavorite(item)
          ? "./image/heart_outline.svg"
          : "./image/heart_fill.svg";
      });

      let movieRating = document.createElement("div");
      movieRating.className = "rating";

      if (item.kinopoiskRating || item.rating) {
        getRating = item.kinopoiskRating || item.rating;
        movieRating.textContent = getRating;
      } else {
        movieRating.textContent = "None";
      }

      let year = document.createElement("div");
      year.textContent = item.year;
      year.className = "years";

      let genre = document.createElement("div");
      genre.className = "genre";
      genre.textContent = item.genres[0].genre;

      card.appendChild(image);
      blockLeft.append(title, year, genre);
      blockTop.append(movieRating, icon);
      block.append(blockLeft, blockTop);
      card.appendChild(block);
      movie.appendChild(card);
    });
  }
  function isFavorite(item) {
    let data = JSON.parse(localStorage.getItem("films")) || [];
    for (let i = 0; i < data.length; i++) {
      if (
        (data[i].filmId && data[i].filmId === item.filmId) ||
        (data[i].kinopoiskId && data[i].kinopoiskId === item.kinopoiskId)
      ) {
        return true;
      }
    }
  }
  function toggleFavorite(item) {
    let data = JSON.parse(localStorage.getItem("films")) || [];
    const filmIndex = -1;
    for (let i = 0; i < data.length; i++) {
      if (
        (data[i].filmId && data[i].filmId === item.filmId) ||
        (data[i].kinopoiskId && data[i].kinopoiskId === item.kinopoiskId)
      ) {
        filmIndex = index;
      }
    }
    if (filmIndex !== -1) {
      data.splice(filmIndex, 1);
    } else {
      data.push(item);
    }
    localStorage.setItem("films", JSON.stringify(data));
  }

  function init() {
    navigationList.addEventListener("click", function () {
      document.querySelectorAll(".nav-item").forEach((item) => {
        item.classList.remove("active");
      });
      this.classList.add("active");
    });

    searchInput.addEventListener("input", () => getDataMovie(API_URL_KEYWORD));
    searchForm.addEventListener("submit", (e) => {
      e.preventDefault();
      if (searchInput.value) {
        getDataMovie(API_URL_KEYWORD);
      }
    });
    if (logo) {
      logo.addEventListener("click", () => {
        getDataMovie(API_URL_PREMIERES);
      });
    }
    window.addEventListener("load", () => {
      getDataMovie(API_URL_PREMIERES);
    });

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
    favorites.addEventListener("click", () => {
      let data = JSON.parse(localStorage.getItem("films"));
      displayMovieList(data);
    });
  }
  init();

  console.log("DOM готов к использованию");
});
