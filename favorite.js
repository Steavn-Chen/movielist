const BASE_URL = 'https://movie-list.alphacamp.io'
const INDEX_URL = BASE_URL + '/api/v1/movies/'
const POSTER_URL = BASE_URL + '/posters/'

const movies = JSON.parse(localStorage.getItem('favoriteMovies'))
const datapanel = document.querySelector('#data-panel')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')
const interfaceMode = document.querySelector('#interface-mode')
let interfaceModeControl = "cardmode"

function renderMoviesList(data) {
  let rawHTML = ''
  data.forEach(function (item) {
    rawHTML += ` <div class="col-sm-3">
      <div class="mb-2">
        <div class="card">
          <img src="${POSTER_URL + item.image}" class="card-img-top" alt="Movie Poster">
          <div class="card-body">
            <h5 class="card-title">${item.title}</h5>
            </div>
            <div class="card-footer text-muted">
             <button class="btn btn-primary btn-show-movie" data-toggle="modal" data-target="#movie-modal" data-id="${item.id}">More</button>
            <button class="btn btn-danger btn-remove-favorite" data-id="${item.id}">X</button>
            </div>
        </div>
      </div>
    </div>`
  })
  datapanel.innerHTML = rawHTML
}

function renderMoviesItem(data) {
  let rawHTML = ``;
  rawHTML += `<ul class="list-group list-group-flush w-100 d-flex justify-content-center">`;
  data.forEach(function (item) {
    rawHTML += `
  <div class="list-group-item">
    <div class="row d-flex flex-nowrap ">
      <h5 class="list-name col-4"> ${item.title}</h5>
      <span class="col-4">Release date: ${item.release_date}</span>
      <div class="list-button col-4">
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

function interfaceModeChange(mode) {
  if (interfaceModeControl === "cardmode") {
    return renderMoviesList(mode);
  } else if (interfaceModeControl === "listmode") {
    return renderMoviesItem(mode);
  }
}

function showMovieModal(id) {
  // get elements
  const modalTitle = document.querySelector('#movie-modal-title')
  const modalImage = document.querySelector('#movie-modal-image')
  const modalDate = document.querySelector('#movie-modal-date')
  const modalDescription = document.querySelector('#movie-modal-description')

  // send request to show api
  axios.get(INDEX_URL + id).then(function (response) {
    const data = response.data.results
    console.log(data)
    // insert data into modal ui
    modalTitle.innerText = data.title
    modalDate.innerText = 'Release date: ' + data.release_date
    modalDescription.innerText = data.description
    modalImage.innerHTML = `<img src="${POSTER_URL + data.image
      }" alt="movie-poster" class="img-fluid">`
  })
}

function removeFromFavorite(id) {
  if (!movies) return
  const movieIndex = movies.findIndex(function (movie) {
    return movie.id === id
  })
  if (movieIndex === -1) return
  movies.splice(movieIndex, 1)
  localStorage.setItem('favoriteMovies', JSON.stringify(movies))
  renderMoviesList(movies)
}

datapanel.addEventListener('click', function onPaneilclicked(event) {
  if (event.target.matches('.btn-show-movie')) {
    showMovieModal(Number(event.target.dataset.id))
  } else if (event.target.matches('.btn-remove-favorite')) {
    removeFromFavorite(Number(event.target.dataset.id))
  }
})

interfaceMode.addEventListener("click", function oninterfaceModeclicked(event) {
  // const datalength = filteredMovies.length ? filteredMovies : movies;
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
  interfaceModeChange(movies)
  // interfaceModeChange(getMoviesByPage(1))
  // renderpaginator(movies.length)
  // renderpaginator(datalength.length)
});

renderMoviesList(movies)






