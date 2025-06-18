import React, { useState } from 'react'
import { Spin, Alert, Pagination } from 'antd'
import MoviesList from '../MoviesList/MoviesList'
import useMovies from '../../hooks/useMovies'

function RatedTab(guestSessionId) {
  const [page, setPage] = useState(1)

  const { movies, totalPages, totalResults, loading, currentPage, setCurrentPage, ratedMovies } = useMovies(
    '',
    guestSessionId,
    true,
    page,
  )

  const handlePageChange = (newPage) => {
    setPage(newPage)
    setCurrentPage(newPage)
  }

  return (
    <Spin spinning={loading}>
      {movies.length === 0 && !loading && (
        <Alert message="Список Ваших оценок пуст" type="info" style={{ marginBottom: 20 }} />
      )}

      <MoviesList movies={movies} guestSessionId={guestSessionId} ratedMovies={ratedMovies} isRatedTab />

      {totalPages > 1 && (
        <Pagination
          current={currentPage}
          total={totalResults}
          pageSize={20}
          onChange={handlePageChange}
          style={{ marginTop: 20, textAlign: 'center' }}
        />
      )}
    </Spin>
  )
}

export default RatedTab
