import React from 'react'
import { Card, Tag, Typography, Rate } from 'antd'
import './MovieCard.css'

import PropTypes from 'prop-types'
import { format, parse } from 'date-fns'

const { Text, Title } = Typography

const MovieCard = ({ movie }) => {
  const { title, release_date, genres_ids, overview, poster_path, vote_average } = movie

  let formattedDate = ''
  try {
    formattedDate = format(parse(release_date, 'MMMM d, yyyy', new Date()), 'MMMM d, yyyy')
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

  return (
    <Card hoverable className="movie-card" cover={<img alt={title} src={imageUrl} className="movie-card__cover" />}>
      <div className="movie-card__content">
        <Title level={5} className="movie-card__title">
          {truncateText(movie.title, 30)}
        </Title>
        <Text type="secondary" className="movie-card__release-date">
          {formattedDate}
        </Text>
        <div className="movie-card__genres">
          {genres_ids &&
            Array.isArray(genres_ids) &&
            genres_ids.map((genre) => (
              <Tag key={genre} className="movie-card__genre">
                {genre}
              </Tag>
            ))}
        </div>

        <Text className="movie-card__overview">{truncateText(overview, 204)}</Text>
        <Rate count={10} className="rating-stars" value={vote_average} />
      </div>
    </Card>
  )
}

MovieCard.propTypes = {
  movie: PropTypes.shape({
    title: PropTypes.string.isRequired,
    release_date: PropTypes.string.isRequired,
    genres_ids: PropTypes.arrayOf(PropTypes.string).isRequired,
    overview: PropTypes.string.isRequired,
    vote_average: PropTypes.number.isRequired,
    poster_path: PropTypes.string.isRequired,
  }).isRequired,
}

export default MovieCard
