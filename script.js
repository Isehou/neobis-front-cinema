document.addEventListener("DOMContentLoaded", () => {
  const searchForm = document.querySelector(".search-form");
  const searchInput = document.querySelector(".search-input");
  const searchBtn = document.querySelector(".search-btn");
  const movie = document.querySelector(".movie");

  const currentDate = new Date();
  const month = currentDate.toLocaleString("en-US", { month: "long" });
  const year = currentDate.getFullYear();

  const API_KEY = "72d22a44-c41a-4690-9718-8c298089bca8";

  const API_URL_PREMIERES = `https://kinopoiskapiunofficial.tech/api/v2.2/films/premieres?year=${year}&month=${month}`;
  const API_URL_RELEASES = `https://kinopoiskapiunofficial.tech/api/v2.1/films/releases?year=${year}&month=${month}&page=1`;
  const API_URL_TOP = `https://kinopoiskapiunofficial.tech/api/v2.2/films/collections?type=TOP_POPULAR_MOVIES&page=1`;
  const API_URL_CLOSE_RELEASES = `https://kinopoiskapiunofficial.tech/api/v2.2/films/collections?type=CLOSES_RELEASES&page=1`;

  getDataMovie(API_URL_PREMIERES);

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

  function displayMovieList(data) {
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

      let rating = document.createElement("h4");
      rating.className = "rating";
      rating.textContent = item.rating;

      let year = document.createElement("h4");
      year.textContent = item.year;
      year.className = "years";

      let genre = document.createElement("h4");
      genre.className = "genre";
      genre.textContent = item.genres[0].genre;

      // html layout appenChild's
      card.appendChild(image);
      block_left.append(title, year, genre);
      block_right.append(icon, rating);
      block.append(block_left, block_right);
      card.appendChild(block);
      movie.appendChild(card);
    });
  }

  function handleSearch() {
    const searchElement = searchInput.value.trim();
    getDataMovie(searchElement);
  }

  function init() {
    searchInput.addEventListener("input", handleSearch);
    searchForm.addEventListener("submit", (e) => {
      e.preventDefault();
      handleSearch();
    });
  }

  init();
  console.log("DOM полностью загружен");
});
