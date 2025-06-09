import React, { useState } from 'react'
import { Rate } from 'antd'
import { postRatedMovies } from '../../api/tmdb'
import PropTypes from 'prop-types'

const MovieRate = ({ movieId, guestSessionId, initialRating }) => {
  const [rating, setRating] = useState(initialRating || 0)
  const [loading, setLoading] = useState(false)

  const handleRateChange = async (value) => {
    setLoading(true)
    setRating(value)
    try {
      await postRatedMovies(movieId, value, guestSessionId)
      console.log(`рейт ${movieId} с ${value} звезд`)
    } catch (error) {
      console.error('ошибк рейтинг фильма:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <Rate allowHalf value={rating} onChange={handleRateChange} disabled={loading} count={10} />
    </div>
  )
}
MovieRate.propTypes = {
  movieId: PropTypes.number.isRequired,
  guestSessionId: PropTypes.string,
  initialRating: PropTypes.number,
}
export default MovieRate
