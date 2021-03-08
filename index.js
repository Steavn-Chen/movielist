const BASE_URL = "https://movie-list.alphacamp.io";
const INDEX_URL = BASE_URL + "/api/v1/movies/";
const POSTER_URL = BASE_URL + "/posters/";

const movies = [];
let filteredMovies = [];
const MOVIES_PER_PAGE = 12;
let interfaceModeControl = "cardmode";

const interfaceMode = document.querySelector("#interface-mode");
const datapanel = document.querySelector("#data-panel");
const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#search-input");

function renderMoviesList(data) {
  let rawHTML = "";
  data.forEach(function (item) {
    // title ,image
    rawHTML += ` <div class="col-12 col-sm-6 col-md-4 col-xl-3 "  >
      <div class="mb-4" >
        <div class="card "  >
          <img src="${
      POSTER_URL + item.image
      } " class="card-img-top  " alt="Movie Poster">
          <div class="card-body">
            <h5 class="card-title text-center d-flex align-items-center">${renderMoviesName(item.title)}</h5>
            </div>
            <div class="card-footer text-muted">
             <button class="btn btn-primary btn-show-movie" data-toggle="modal" data-target="#movie-modal" data-id="${item.id
      }">More</button>
             <button class="btn btn-info btn-add-favorite" data-id="${
      item.id
      }">+</button>
            </div>
        </div>
      </div>
    </div>`;
  });
  datapanel.innerHTML = rawHTML;
}

function renderMoviesItem(data) {
  let rawHTML = ``;
  rawHTML += `<ul class="list-group list-group-flush w-100 d-flex justify-content-center">`;
  data.forEach(function (item) {
    rawHTML += `
 <div class="list-group-item">
 <div class="row d-flex flex-nowrap ">
  <h5 class="list-name col-6"> ${item.title}</h5>
  <span>Release date: ${item.release_date}</span>
  <div class="list-button col-6 ">
  <button class="btn btn-primary btn-show-movie " data-toggle="modal" data-target="#movie-modal" data-id="${item.id}">More</button>
  <button class="btn btn-info btn-add-favorite " data-id="${item.id}">+</button>
  </div>
  </div>
  </div>
`;
  });

  rawHTML += `</ul>`;
  datapanel.innerHTML = rawHTML;
}

//
function renderMoviesName(name) {
  let newname = name.slice(0, 9)
  if (name.length > 10) {
    newname += "  ..."
  }
  return newname
}

// 介面切換函式
function interfaceModeChange(mode) {
  if (interfaceModeControl === "cardmode") {
    return renderMoviesList(mode);
  } else if (interfaceModeControl === "listmode") {
    return renderMoviesItem(mode);
  }
}

function getMoviesByPage(page) {
  const datamovies = filteredMovies.length ? filteredMovies : movies;
  const startIndex = (page - 1) * MOVIES_PER_PAGE;
  return datamovies.slice(startIndex, startIndex + MOVIES_PER_PAGE);
}

function renderpaginator(amount) {
  const numberOfPages = Math.ceil(amount / MOVIES_PER_PAGE);
  let rawHTML = ``;
  for (let page = 1; page <= numberOfPages; page++) {
    rawHTML += `<li class="page-item"><a class="page-link" href="#" data-page="${page}">${page}</a></li> `;
  }
  paginator.innerHTML = rawHTML;
}

function showMovieModal(id) {
  // get elements
  const modalTitle = document.querySelector("#movie-modal-title");
  const modalImage = document.querySelector("#movie-modal-image");
  const modalDate = document.querySelector("#movie-modal-date");
  const modalDescription = document.querySelector("#movie-modal-description");

  // send request to show api
  axios.get(INDEX_URL + id).then(function (response) {
    const data = response.data.results;
    console.log(data);
    // insert data into modal ui
    modalTitle.innerText = data.title;
    modalDate.innerText = "Release date: " + data.release_date;
    modalDescription.innerText = data.description;
    modalImage.innerHTML = `<img src="${
      POSTER_URL + data.image
      }" alt="movie-poster" class="img-fluid" >`;
    console.log(modalImage);
  });
}

function addToFavorite(id) {
  console.log(id);
  const list = JSON.parse(localStorage.getItem("favoriteMovies")) || [];
  const movie = movies.find(function (movie) {
    return movie.id === id;
  });
  if (
    list.some(function (movie) {
      return movie.id === id;
    })
  ) {
    return alert("此電影己經收藏在清單中");
  }
  list.push(movie);
  localStorage.setItem("favoriteMovies", JSON.stringify(list));
}

datapanel.addEventListener("click", function onPaneilclicked(event) {
  if (event.target.matches(".btn-show-movie")) {
    showMovieModal(Number(event.target.dataset.id));
  } else if (event.target.matches(".btn-add-favorite")) {
    addToFavorite(Number(event.target.dataset.id));
  }
});

searchForm.addEventListener("submit", function onSearchFormSubmitted(event) {
  event.preventDefault();
  const keyword = searchInput.value.trim().toLowerCase();
  if (!keyword.length) {
    return alert("請輸入有效字串");
  }
  filteredMovies = movies.filter(function (movie) {
    return movie.title.toLowerCase().includes(keyword);
  });
  if (filteredMovies.length === 0) {
    return alert(`您輸入的關鍵字:${keyword}沒有符合條件的電影`);
  }
  renderpaginator(filteredMovies.length);
  interfaceModeChange(getMoviesByPage(1));
});

paginator.addEventListener("click", function onPaginatorLClicked(event) {
  if (event.target.tagName === "A") {
    const page = Number(event.target.dataset.page);
    interfaceModeChange(getMoviesByPage(page));
  }
});

interfaceMode.addEventListener("click", function oninterfaceModeclicked(event) {
  const datalength = filteredMovies.length ? filteredMovies : movies;
  const fath = document.querySelector('.fa-th')
  const fabars = document.querySelector('.fa-bars')
  if (event.target.matches(".fa-th")) {
    interfaceModeControl = "cardmode";
    event.target.classList.add('takeon');
    fabars.classList.remove('takeon')
  } else if (event.target.matches(".fa-bars")) {
    interfaceModeControl = "listmode";
    event.target.classList.add('takeon');
    fath.classList.remove('takeon')
  }
  interfaceModeChange(getMoviesByPage(1))
  renderpaginator(datalength.length)
});

axios
  .get(INDEX_URL)
  .then((response) => {
    movies.push(...response.data.results);
    renderMoviesList(getMoviesByPage(1));
    renderpaginator(movies.length);
  })
  .catch((error) => {
    console.log(error);
  });
