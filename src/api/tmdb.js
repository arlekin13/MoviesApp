import axios from 'axios'

const API_KEY = '8a9e3ee1943e2bc590ae088fdd26df31'

const tmdb = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  params: {
    api_key: API_KEY,
    language: 'en-US',
  },
})

export const getPopularMovies = async () => {
  try {
    const response = await tmdb.get('/movie/popular')
    return response.data.results
  } catch (error) {
    return []
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
    const result = response.data.results.slice(0, 6)
    return {
      result: result,
      totalPages: response.data.total_pages,
      totalResults: response.data.total_results,
    }
  } catch (error) {
    return { results: [], totalPages: 0, totalResults: 0 }
  }
}

export default tmdb
