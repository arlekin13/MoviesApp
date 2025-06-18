import React, { useState, useEffect } from 'react'
import { ConfigProvider, Alert, Tabs } from 'antd'

import { Online } from 'react-detect-offline'
import SearchTab from './components/SearchTab/SearchTab'
import RatedTab from './components/RatedTab/RatedTab'

import './App.css'

import GenreContext from './components/Genres/GenresContext'
import { createGuestSession, getGenres } from './api/tmdb'

const { TabPane } = Tabs

function App() {
  const [guestSessionId, setGuestSessionId] = useState(localStorage.getItem('guestSessionId') || null)

  const [genres, setGenres] = useState([])

  const [genreError, setGenreError] = useState(null)
  const [isOnline, setIsOnline] = useState(navigator.onLine)

  useEffect(() => {
    const initSession = async () => {
      try {
        const savedSession = localStorage.getItem('guestSessionId')
        if (savedSession) {
          setGuestSessionId(savedSession)
        } else {
          const session = await createGuestSession()
          localStorage.setItem('guestSessionId', session.guest_session_id)
          setGuestSessionId(session.guest_session_id)
        }
      } catch (error) {
        console.error('ошибка создания гостевой сессии:', error)
      }
    }
    initSession()
  }, [])

  useEffect(() => {
    const loadGenres = async () => {
      try {
        const genresData = await getGenres()
        setGenres(genresData)
      } catch (error) {
        console.error('ошибка закгрузки жанров:', error)
        setGenreError('Проверьте подключение к интернету')
      }
    }
    loadGenres()
  }, [])

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

            <Tabs defaultActiveKey="1" centered>
              <TabPane tab="Search" key="1">
                <SearchTab guestSessionId={guestSessionId} />
              </TabPane>

              <TabPane tab="Rated" key="2">
                <RatedTab guestSessionId={guestSessionId} />
              </TabPane>
            </Tabs>
          </Online>
        </div>
      </ConfigProvider>
    </GenreContext.Provider>
  )
}

export default App
