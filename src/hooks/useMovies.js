import { useState, useEffect, useCallback } from 'react'
import { searchMovies, getPopularMovies, getRatedMovies } from '../api/tmdb'

const useMovies = (search, guestSessionId, fetchRated = false, page = 1) => {
  const [currentPage, setCurrentPage] = useState(page)
  const [totalPages, setTotalPages] = useState(0)
  const [totalResults, setTotalResults] = useState(0)
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const [ratedMovies, setRatedMovies] = useState({})

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      let data
      if (fetchRated && guestSessionId) {
        data = await getRatedMovies(guestSessionId, page)
        const newRatedMovies = {}
        data.results.forEach((movie) => {
          newRatedMovies[movie.id] = movie.rating
        })
        setRatedMovies(newRatedMovies)
      } else if (search) {
        data = await searchMovies(search, page)
      } else {
        data = await getPopularMovies(page)
      }
      setMovies(data?.results || [])
      setTotalPages(data?.total_pages || 0)
      setTotalResults(data?.total_results || 0)
      setCurrentPage(page)
    } catch (error) {
      console.error('ошибка феча фильма:', error)
      setMovies([])
      setTotalPages(0)
      setTotalResults(0)
    } finally {
      setLoading(false)
    }
  }, [search, guestSessionId, fetchRated, page])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return {
    movies,
    totalPages,
    totalResults,
    loading,
    currentPage,
    setCurrentPage,
    ratedMovies,
  }
}
export default useMovies
