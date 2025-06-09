import React from 'react'
import { Row, Col } from 'antd'
import MovieCard from '../MovieCard/MovieCard'
import PropTypes from 'prop-types'

function MoviesList({ movies, guestSessionId, ratedMovies }) {
  return (
    <Row gutter={[36, 36]} justify={'center'}>
      {movies.map((movie) => (
        <Col key={movie.id} xs={24} md={24} lg={12} xl={12}>
          <MovieCard movie={movie} guestSessionId={guestSessionId} ratedMovies={ratedMovies} />
        </Col>
      ))}
    </Row>
  )
}
MoviesList.propTypes = {
  movies: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
    }),
  ).isRequired,
  guestSessionId: PropTypes.string,
  ratedMovies: PropTypes.object.isRequired,
}
export default MoviesList
