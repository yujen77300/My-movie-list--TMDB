const TMDBPOSTER_URL = "http://image.tmdb.org/t/p/w500";
const DISCOVER_URL = "https://api.themoviedb.org/3/discover/movie?api_key=a1d22d0c51bea4e92a12aaf5190204b5&sort_by=revenue.desc&primary_release_date.gte=2018-01-01&primary_release_date.lte=2022-06-30&with_watch_monetization_types=flatrate&page="





const BASE_URL = 'https://movie-list.alphacamp.io'
const INDEX_URL = BASE_URL + '/api/v1/movies/'
const POSTER_URL = BASE_URL + '/posters/'
const MOVIES_PER_PAGE = 12


const movies = []

const dataPanel = document.querySelector('#data-panel')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')
const paginator = document.querySelector('#paginator')



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
                <button class="btn btn-info btn-add-favorite " data-id=${item.id}>+</button>
              </div>
            </div>
          </div>
        </div>
    
    `


  })

  dataPanel.innerHTML = rawHTML

}


// 要知道分幾頁，所以是傳入電影的數量
function renderPaginator(amount) {
  const numberOfPages = Math.ceil(amount / MOVIES_PER_PAGE)
  let rawHTML = ''

  for (let page = 1; page <= numberOfPages; page++) {
    rawHTML += `<li class="page-item"><a class="page-link" href="#" data-page="${page}">${page}</a></li>`
  }

  paginator.innerHTML = rawHTML
}



//輸入一個PAGE，就會顯示該頁有哪些電影，就像page1 會回傳0~11的電影
function getMoviesByPage(page) {
  // Movie又有分為原本的movie和使用者搜尋後的movies
  const data = filteredMovies.length ? filteredMovies : movies



  const startIndex = (page - 1) * MOVIES_PER_PAGE

  return data.slice(startIndex, startIndex + MOVIES_PER_PAGE)

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

  });

  // axios.get(INDEX_URL + id).then((response) => {
  //   const data = response.data.results

  //   modalTitle.innerText = data.title
  //   modalDate.innerText = 'Release date: ' + data.release_date
  //   modalDescription.innerText = data.description
  //   modalImage.innerHTML = `<img src="${POSTER_URL + data.image
  //     }" alt="movie-poster" class="img-fluid">`
  // })
}


// 點到哪一部電影就要送到local storage儲存
function addToFavorite(id) {
  // 製作收藏清單，將key取為 favoriteMovies
  const list = JSON.parse(localStorage.getItem('favoriteMovies')) || []
  const movie = movies.find((movie) => movie.id === id)

  if (list.some((movie) => movie.id === id)) {
    return alert('此電影已經在收藏清單中！')
  }


  //把電影推到list裡面
  list.push(movie)
  // 存到storage裡面
  localStorage.setItem('favoriteMovies', JSON.stringify(list))

  // console.log(list)

}



// 在datapanel上綁定一個事件，點擊more，除了顯示modal以外還要改掉一些資料
dataPanel.addEventListener('click', function onPanelClicked(event) {
  if (event.target.matches('.btn-show-movie')) {
    console.log(Number(event.target.dataset.id))
    showMovieModal(Number(event.target.dataset.id))
  } else if (event.target.matches('.btn-add-favorite')) {
    addToFavorite(Number(event.target.dataset.id))

  }

})

paginator.addEventListener('click', function onPaginatorClicker(event) {
  if (event.target.tagName !== 'A') return
  const page = Number(event.target.dataset.page)
  renderMovieList(getMoviesByPage(page))
})





for (let tmdbpage = 1; tmdbpage <= 5; tmdbpage++) {
  axios.get(DISCOVER_URL + `${tmdbpage}`).then((response) => {
    // console.log(response.data.results);
    movies.push(...response.data.results);
    renderPaginator(movies.length)
    //如果藥分業這裡就不能直接丟整個movies嘞
    renderMovieList(getMoviesByPage(1))
  });
}

// axios.get(INDEX_URL).then((response) => {
//   movies.push(...response.data.results)
//   renderPaginator(movies.length)
//   //如果藥分業這裡就不能直接丟整個movies嘞
//   renderMovieList(getMoviesByPage(1))
// }).catch((err) => console.log(err))




// 製作搜尋功能 監聽表單提交的事件
// 建立一個搜尋的陣列，可以放入renderMovieList
let filteredMovies = []
searchForm.addEventListener('submit', function onSearchFormSubmitted(event) {
  event.preventDefault()
  let keyword = searchInput.value.trim().toLowerCase()

  // 用迴圈儲存一個新「title 含有 input 值」的電影的陣列
  // for (const movie of movies){
  //   if(movie.title.trim().toLowerCase().includes(keyword)){
  //     filteredMovies.push(movie)
  //   }
  // }


  //陣列的方法 filter
  // filteredMovies = movies.filter( movie => {
  //    return movie.title.trim().toLowerCase().includes(keyword)
  // })

  filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(keyword)
  )




  if (filteredMovies.length === 0) {
    return alert(`您輸入的關鍵字：${keyword} 沒有符合條件的電影`)
  }
  //重製分頁器
  renderPaginator(filteredMovies.length)
  //預設顯示第 1 頁的搜尋結果
  renderMovieList(getMoviesByPage(1))

})