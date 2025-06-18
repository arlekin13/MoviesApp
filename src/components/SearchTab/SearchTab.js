import React, { useState, useCallback } from 'react'
import MoviesList from '../MoviesList/MoviesList'
import SearchPanel from '../SearchPanel/SearchPanel'
import debounce from 'lodash.debounce'
import { Spin, Alert, Pagination } from 'antd'

import useMovies from '../../hooks/useMovies'

function SearchTab(guestSessionId) {
  const [searchQuery, setSearchQuery] = useState('')
  const [page, setPage] = useState(1)

  const { movies, totalPages, totalResults, currentPage, loading, setCurrentPage, ratedMovies } = useMovies(
    searchQuery,
    guestSessionId,
    false,
    page,
  )

  const handleSearch = useCallback(
    debounce((query) => {
      setSearchQuery(query)
      setPage(1)
      setCurrentPage(1)
    }, 500),
    [],
  )
  return (
    <Spin spinning={loading}>
      <SearchPanel onSearch={handleSearch} />
      {movies.length === 0 && !loading && (
        <Alert message="такого еще не сняли, поробуйте найти другой фильм!" type="info" />
      )}

      <MoviesList movies={movies} guestSessionId={guestSessionId} />

      {totalPages > 1 && (
        <Pagination
          current={currentPage}
          total={totalResults}
          pageSize={6}
          onChange={(newPage) => {
            setPage(newPage)
            setCurrentPage(newPage)
          }}
          style={{ marginTop: 20 }}
        />
      )}
    </Spin>
  )
}
export default SearchTab
