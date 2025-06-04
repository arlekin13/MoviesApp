import React, { useEffect, useState } from 'react'
import { Input } from 'antd'
import PropTypes from 'prop-types'

const SearchPanel = ({ onSearch }) => {
  const [search, setSearch] = useState('')
  const handleInputChange = (event) => {
    setSearch(event.target.value)
  }

  useEffect(() => {
    onSearch(search)
  }, [search, onSearch])

  return (
    <Input
      placeholder="Введите название фильма..."
      value={search}
      onChange={handleInputChange}
      style={{ marginBottom: 16 }}
    />
  )
}

SearchPanel.propTypes = {
  onSearch: PropTypes.func.isRequired,
}
export default SearchPanel
