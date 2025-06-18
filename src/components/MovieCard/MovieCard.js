import React, { useContext } from 'react'
import { Card, Tag, Typography, Alert } from 'antd'
import './MovieCard.css'

import PropTypes from 'prop-types'
import { format, parse } from 'date-fns'
import MovieRate from './MovieRate'
import GenreContext from '../Genres/GenresContext'

const { Text, Title } = Typography

const MovieCard = ({ movie, guestSessionId, ratedMovies = {} }) => {
  const genres = useContext(GenreContext) || []

  if (!movie) {
    return <Alert message="Данные фильма не загружены" type="error" />
  }

  const {
    title = 'Без названия',
    release_date,
    genre_ids = [],
    overview = '',
    poster_path,
    vote_average = 0,
    id,
  } = movie

  const userRating = ratedMovies[id] || 0

  let formattedDate = ''
  try {
    formattedDate = format(parse(release_date, 'yyyy-MM-dd', new Date()), 'MMMM d, yyyy')
  } catch (error) {
    formattedDate = 'Дата не определена'
  }

  const imageUrl = `https://image.tmdb.org/t/p/w500${poster_path}`

  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) {
      return text
    }
    const lastSpaceIndex = text.lastIndexOf(' ', maxLength)
    if (lastSpaceIndex === -1) {
      return text.substring(0, maxLength) + '...'
    }
    return text.substring(0, lastSpaceIndex) + ' ...'
  }

  const getRatingColor = (voteAverage) => {
    if (voteAverage <= 3) {
      return 'red'
    } else if (voteAverage <= 5) {
      return 'orange'
    } else if (voteAverage <= 7) {
      return 'yellow'
    } else {
      return 'green'
    }
  }

  const ratingColor = getRatingColor(vote_average)

  const genreNames = genre_ids
    ?.map((genreId) => {
      const genre = genres?.find((genre) => genre.id === genreId)
      return genre ? genre.name : ''
    })
    .filter(Boolean)

  return (
    <Card hoverable className="movie-card" cover={<img alt={title} src={imageUrl} className="movie-card__cover" />}>
      <div className="movie-card__content">
        <div className="movie-card__header">
          <Title level={5} className="movie-card__title">
            {truncateText(title, 30)}
          </Title>
          <div
            className="movie-card__rating"
            style={{
              borderColor: ratingColor,
              color: 'black',
            }}
          >
            {vote_average.toFixed(1)}
          </div>
        </div>
        <Text type="secondary" className="movie-card__release-date">
          {formattedDate}
        </Text>
        <div className="movie-card__genres">
          {genreNames?.map((genreName) => (
            <Tag key={genreName} className="movie-card__genre">
              {genreName}
            </Tag>
          ))}
        </div>
        <Text className="movie-card__overview">{truncateText(overview, 150)}</Text>
        <MovieRate movieId={id} guestSessionId={guestSessionId} initialRating={userRating} />
      </div>
    </Card>
  )
}

MovieCard.propTypes = {
  movie: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    release_date: PropTypes.string.isRequired,
    genre_ids: PropTypes.arrayOf(PropTypes.number).isRequired,
    overview: PropTypes.string.isRequired,
    vote_average: PropTypes.number.isRequired,
    poster_path: PropTypes.string.isRequired,
  }).isRequired,
  guestSessionId: PropTypes.string,
  ratedMovies: PropTypes.object.isRequired,
}

export default MovieCard
