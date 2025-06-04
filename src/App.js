import React, { useState, useEffect, useCallback, useRef } from 'react'
import { ConfigProvider, Row, Col, Spin, Alert, Pagination } from 'antd'
import MovieCard from './components/MovieCard/MovieCard'

import SearchPanel from './components/SearchPanel/SearchPanel'
import { Online, Offline } from 'react-detect-offline'
import debounce from 'lodash.debounce'

import './App.css'
import useMovies from './hooks/useMovies'

function App() {
  const [search, setSearch] = useState('')
  const { movies, totalPages, totalResults, currentPage, setCurrentPage, loading, fetchPopularMovies } =
    useMovies(search)

  const setSearchRef = useRef(setSearch)
  useEffect(() => {
    setSearchRef.current = setSearch
  }, [setSearch])

  useEffect(() => {
    fetchPopularMovies()
  }, [fetchPopularMovies])

  const handleSearch = (search) => {
    debouncedSetSearch(search)
  }
  const debouncedSetSearch = useCallback(
    debounce((search) => {
      setSearchRef.current(search)
    }, 500),
    [],
  )

  return (
    <ConfigProvider
      theme={{
        components: {
          Card: {
            borderRadius: 0,
            boxShadow: '0px 4px 12px 0px rgba(0, 0, 0, 0.15)',
          },
        },
      }}
    >
      <div className="app">
        <Offline>
          <Alert message="net inet" type="error" />
        </Offline>

        <Online>
          <Spin spinning={loading}>
            <SearchPanel search={search} onSearch={handleSearch} />
            {movies.length === 0 && !loading && <Alert message="КИНА НЕ БУДЕТ!" type="info" />}

            <Row gutter={[36, 36]} justify={'center'}>
              {movies.map((movie) => (
                <Col key={movie.id} xs={24} md={24} lg={12} xl={12}>
                  <MovieCard movie={movie} />
                </Col>
              ))}
            </Row>
            {totalPages > 1 && (
              <Pagination
                current={currentPage}
                total={totalResults}
                pageSize={6}
                onChange={(page) => setCurrentPage(page)}
                style={{ marginTop: 16, textAlign: 'center' }}
              />
            )}
          </Spin>
        </Online>
      </div>
    </ConfigProvider>
  )
}

export default App
