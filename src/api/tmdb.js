import axios from 'axios'

// const API_KEY = '8a9e3ee1943e2bc590ae088fdd26df31'

const tmdb = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  params: {
    api_key: '8a9e3ee1943e2bc590ae088fdd26df31',
    language: 'en-US',
  },
  timeout: 5000,
})

export const getPopularMovies = async () => {
  try {
    const response = await tmdb.get('/movie/popular')
    return response.data
  } catch (error) {
    console.error('Ошибка получения популярных фильмов:', error)
    throw error
  }
}

export const searchMovies = async (search, page = 1) => {
  try {
    const response = await tmdb.get('/search/movie', {
      params: {
        query: search,
        page: page,
      },
    })
    return response.data
  } catch (error) {
    console.error('ошибка поиска:', error)
    throw error
  }
}

export const createGuestSession = async () => {
  try {
    const response = await tmdb.get(`/authentication/guest_session/new`)
    return response.data
  } catch (error) {
    console.error('ошибка создания гостев:', error)
    throw error
  }
}

export const getRatedMovies = async (guestSessionId, page = 1) => {
  if (!guestSessionId) {
    console.error('Отсутствует guestSessionId')
    return { results: [], total_pages: 0, total_results: 0 }
  }
  try {
    const response = await tmdb.get(`/guest_session/${guestSessionId}/rated/movies`, {
      params: { page: page },
    })

    return response.data
  } catch (error) {
    console.error('ошибка получ. оцен. фильмов:', error)
    return { results: [], total_pages: 0, total_results: 0 }
  }
}

export const postRatedMovies = async (movieId, rating, guestSessionId) => {
  if (!guestSessionId || !movieId) {
    console.error('Не хватает параметров для оценки')
    return null
  }
  try {
    const response = await tmdb.post(
      `/movie/${movieId}/rating`,
      { value: rating },
      {
        params: {
          guest_session_id: guestSessionId,
        },
      },
    )
    return response.data
  } catch (error) {
    console.error('Ошибка отправки рейтинга:', error)
    throw error
  }
}

export const getGenres = async () => {
  try {
    const response = await tmdb.get('/genre/movie/list')
    return response.data.genres
  } catch (error) {
    console.error('не получили жанр:', error)
    return []
  }
}

export const getMovieRating = async (movieId, guestSessionId) => {
  if (!guestSessionId || !movieId) return null
  try {
    const response = await tmdb.get(`/movie/${movieId}/rating`, {
      params: {
        guest_session_id: guestSessionId,
      },
    })
    return response.data
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return null
    }
    console.error('ошибка получения рейтинга фильма:', error)
    return null
  }
}

export default tmdb
