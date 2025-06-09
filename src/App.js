import React, { useState, useEffect, useCallback, useRef } from 'react'
import { ConfigProvider, Spin, Alert, Pagination, Tabs } from 'antd'
import MoviesList from './components/MoviesList/MoviesList'
import SearchPanel from './components/SearchPanel/SearchPanel'
import { Online } from 'react-detect-offline'
import debounce from 'lodash.debounce'
import './App.css'
import useMovies from './hooks/useMovies'
import GenreContext from './components/Genres/GenresContext'
import { createGuestSession, getGenres } from './api/tmdb'

const { TabPane } = Tabs

function App() {
  const [search, setSearch] = useState('')
  const [guestSessionId, setGuestSessionId] = useState(localStorage.getItem('guestSessionId') || null)
  const [activeTab, setActiveTab] = useState('1')
  const [genres, setGenres] = useState([])
  const [page, setPage] = useState(1)
  const [genreError, setGenreError] = useState(null)
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const { movies, totalPages, totalResults, currentPage, setCurrentPage, loading, ratedMovies } = useMovies(
    search,
    guestSessionId,
    activeTab === '2',
    page,
  )

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber)
    setPage(pageNumber)
  }

  const handleTabChange = (key) => {
    setActiveTab(key)
    setPage(1)
    setCurrentPage(1)
  }

  useEffect(() => {
    const createSession = async () => {
      if (!localStorage.getItem('guestSessionId')) {
        const session = await createGuestSession()
        localStorage.setItem('guestSessionId', session.guest_session_id)
        setGuestSessionId(session.guest_session_id)
      }
    }
    createSession()
  }, [])
  useEffect(() => {
    const fetchGenresData = async () => {
      try {
        const genresData = await getGenres()
        setGenres(genresData)
        setGenreError(null)
      } catch (error) {
        console.error('Error fetching genres:', error)
        setGenreError('Проверьте подключение к интернету.')
        setGenres([])
      }
    }
    fetchGenresData()
  }, [])

  const handleSearch = (search) => {
    debouncedSetSearch(search)
  }

  const debouncedSetSearch = useCallback(
    debounce((search) => {
      setSearch(search)
    }, 500),
    [],
  )
  useEffect(() => {
    const handleOnlineStatus = () => {
      setIsOnline(navigator.onLine)
    }

    window.addEventListener('online', handleOnlineStatus)
    window.addEventListener('offline', handleOnlineStatus)

    return () => {
      window.removeEventListener('online', handleOnlineStatus)
      window.removeEventListener('offline', handleOnlineStatus)
    }
  }, [])

  return (
    <GenreContext.Provider value={genres}>
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
          {!isOnline && <Alert message="Нет соединения с интернетом" type="error" />}
          <Online>
            {genreError && <Alert message={genreError} type="error" />}
            <Tabs defaultActiveKey="1" onChange={handleTabChange}>
              <TabPane tab="Search" key="1">
                <Spin spinning={loading}>
                  <SearchPanel onSearch={handleSearch} />
                  {movies.length === 0 && !loading && <Alert message="КИНА НЕ БУДЕТ!" type="info" />}

                  <MoviesList movies={movies} guestSessionId={guestSessionId} ratedMovies={ratedMovies} />

                  {totalPages > 1 && (
                    <Pagination
                      current={currentPage}
                      total={totalResults}
                      pageSize={6}
                      onChange={(page) => setCurrentPage(page)}
                      style={{ marginTop: 20 }}
                    />
                  )}
                </Spin>
              </TabPane>
              <TabPane tab="Rated" key="2">
                <Spin spinning={loading}>
                  {movies.length === 0 && !loading ? <Alert message="Список Ваших оценок пуст" type="info" /> : null}
                  <MoviesList movies={movies} guestSessionId={guestSessionId} ratedMovies={ratedMovies} />
                </Spin>
              </TabPane>
            </Tabs>
          </Online>
        </div>
      </ConfigProvider>
    </GenreContext.Provider>
  )
}

export default App
