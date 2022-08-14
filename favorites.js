const TMDBPOSTER_URL = "http://image.tmdb.org/t/p/w500";
const DISCOVER_URL = "https://api.themoviedb.org/3/discover/movie?api_key=a1d22d0c51bea4e92a12aaf5190204b5&sort_by=revenue.desc&primary_release_date.gte=2018-01-01&primary_release_date.lte=2022-06-30&with_watch_monetization_types=flatrate&page="



const BASE_URL = 'https://movie-list.alphacamp.io'
const INDEX_URL = BASE_URL + '/api/v1/movies/'
const POSTER_URL = BASE_URL + '/posters/'


const movies = JSON.parse(localStorage.getItem('favoriteMovies')) || []

const dataPanel = document.querySelector('#data-panel')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')


// 把資料經過處理變成html元素
// 盡量讓某一函數只做一件事
function renderMovieList(data) {
  let rawHTML = ''


  data.forEach((item) => {
    // 每部電影都要 藥劑的用+=
    rawHTML += `
        <div class="col-sm-3">
          <div class="mb-2">
            <div class="card">
              <img
                src="${TMDBPOSTER_URL + item.poster_path}"
                class="card-img-top" alt="Movie Poster" />
              <div class="card-body">
                <h5 class="card-title">${item.title}</h5>
              </div>
              <div class="card-footer">
                <button class="btn btn-primary btn-show-movie" data-bs-toggle="modal"
                  data-bs-target="#movie-modal" data-id=${item.id}>More</button>
                <button class="btn btn-danger btn-remove-favorite " data-id=${item.id}>X</button>
              </div>
            </div>
          </div>
        </div>
    
    `


  })

  dataPanel.innerHTML = rawHTML

}


function showMovieModal(id) {
  const modalTitle = document.querySelector('#movie-modal-title')
  const modalImage = document.querySelector('#movie-modal-image')
  const modalDate = document.querySelector('#movie-modal-date')
  const modalDescription = document.querySelector('#movie-modal-description')

  axios.get(`https://api.themoviedb.org/3/movie/${id}?api_key=a1d22d0c51bea4e92a12aaf5190204b5`).then((response) => {
    const data = response.data
    console.log(data.poster_path)

    modalTitle.innerText = data.original_title
    modalDate.innerText = 'Release date: ' + data.release_date
    modalDescription.innerText = data.overview
    modalImage.innerHTML = `<img src="${TMDBPOSTER_URL + data.poster_path}" alt="movie-poster" class="img-fluid">`
  })
}


function removeFromFavorite(id) {
  if (!movies) return
  // 想想要刪除一個陣列，splice我們要知道id在陣列中的位置
  const movieIndex = movies.findIndex(movie => movie.id === id)
  movies.splice(movieIndex, 1)
  if (movieIndex === -1) return

  // 存回locastorage
  localStorage.setItem('favoriteMovies', JSON.stringify(movies))
  // 刪除完會馬上更新畫面
  renderMovieList(movies)

}

// 在datapanel上綁定一個事件，典籍more，除了顯示modal以外還要改掉一些資料
dataPanel.addEventListener('click', function onPanelClicked(event) {
  if (event.target.matches('.btn-show-movie')) {
    showMovieModal(Number(event.target.dataset.id))
  } else if (event.target.matches('.btn-remove-favorite')) {
    removeFromFavorite(Number(event.target.dataset.id))

  }

})

renderMovieList(movies)




