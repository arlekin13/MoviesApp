import { useState, useEffect, useCallback } from 'react'
import { searchMovies, getPopularMovies } from '../api/tmdb'

const useMovies = (search) => {
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [totalResults, setTotalResults] = useState(0)
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchPopularMovies = useCallback(async () => {
    setLoading(true)
    try {
      const data = await getPopularMovies()
      setMovies(data || [])
    } catch (error) {
      // console.error("не получили поп кина:", error);
      setMovies([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true)

      try {
        const data = await searchMovies(search, currentPage)

        setMovies(data.result || [])
        setTotalPages(data.totalPages)
        setTotalResults(data.totalResults)
      } catch (error) {
        // console.error("не получили кина:", error);
        setMovies([])
        setTotalPages(0)
        setTotalResults(0)
      } finally {
        setLoading(false)
      }
    }

    if (search) {
      fetchMovies()
    } else {
      fetchPopularMovies()
    }
  }, [search, currentPage, fetchPopularMovies])

  return {
    movies,
    totalPages,
    totalResults,
    loading,
    currentPage,
    setCurrentPage,
    fetchPopularMovies,
  }
}
export default useMovies
