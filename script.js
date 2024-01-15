const searchForm = document.querySelector(".search-form");
const searchInput = document.querySelector(".search-input");
const searchBtn = document.querySelector(".search-btn");

const API_KEY = "72d22a44-c41a-4690-9718-8c298089bca8";
const API_URL = "https://kinopoiskapiunofficial.tech/api/v2.2/films/";

const MONTHS = [
  "JANUARY",
  "FEBRUARY",
  "MARCH",
  "APRIL",
  "MAY",
  "JUNE",
  "JULY",
  "AUGUST",
  "SEPTEMBER",
  "OCTOBER",
  "NOVEMBER",
  "DECEMBER",
];

const PREMIERES_ENDPOINT = "premieres";
const TOP_ENDPOINT = "top";

function fetchRequest(API_URL) {
  fetch(`${API_URL}${PREMIERES_ENDPOINT}`, {
    method: "GET",
    headers: {
      "X-API-KEY": API_KEY,
      "Content-Type": "application/json",
    },
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error(`HTTP failed ${res.status}`);
      } else {
        return res.json();
      }
    })
    .then((data) => console.log(data))
    .catch((error) => console.error("Error:", error));
}
fetchRequest();

function handleSearch() {
  const searchElement = searchInput.value.trim();
  fetchRequest(searchElement);
}

searchInput.addEventListener("input", handleSearch);

searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  handleSearch();
});
