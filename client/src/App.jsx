
import { useEffect, useState } from 'react';
import './assets/styles/App.css';
import { TokenContext } from './contexts/TokenContext';
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Auth from './components/Auth/Auth';
import Home from './components/Home/Home';
import { UserContext } from './contexts/UserContext';
import { getCurrentUser } from './functions/user';
import User from './components/User/User';

function App() {
  const [token, setToken] = useState(null)
  const [user, setUser] = useState({})

  useEffect(() => {
    const storageToken = localStorage.getItem('jwt-odin')
    if (storageToken) {
      setToken(storageToken)
    }
  }, [])

  useEffect(() => {
    if (token !== null) {
      localStorage.setItem('jwt-odin', token)
      if (token === '') {
        setUser({})
      } else {
        getCurrentUser(token).then((data) => {
          setUser(data)
        })
      }
    }
  }, [token])

  if (!token) {
    return (
      <TokenContext.Provider value={{ token, setToken }}>
        <div className="App">
          <Auth />
        </div>
      </TokenContext.Provider>
    )
  }

  return (
    <UserContext.Provider value={user}>
      <TokenContext.Provider value={{ token, setToken }}>
        <div className="App">
          <nav>
            <div className="app-name">odinbook</div>
            <div className="searchbar-wrapper">
              <div className="searchbar">
                <div className="searchbar-icon">
                  <svg fill="currentColor" viewBox="0 0 16 16" width="1em" height="1em" class="x1lliihq x1k90msu x2h7rmj x1qfuztq xcza8v6 xlup9mm x1kky2od"><g fill-rule="evenodd" transform="translate(-448 -544)"><g fill-rule="nonzero"><path d="M10.743 2.257a6 6 0 1 1-8.485 8.486 6 6 0 0 1 8.485-8.486zm-1.06 1.06a4.5 4.5 0 1 0-6.365 6.364 4.5 4.5 0 0 0 6.364-6.363z" transform="translate(448 544)"></path><path d="M10.39 8.75a2.94 2.94 0 0 0-.199.432c-.155.417-.23.849-.172 1.284.055.415.232.794.54 1.103a.75.75 0 0 0 1.112-1.004l-.051-.057a.39.39 0 0 1-.114-.24c-.021-.155.014-.356.09-.563.031-.081.06-.145.08-.182l.012-.022a.75.75 0 1 0-1.299-.752z" transform="translate(448 544)"></path><path d="M9.557 11.659c.038-.018.09-.04.15-.064.207-.077.408-.112.562-.092.08.01.143.034.198.077l.041.036a.75.75 0 0 0 1.06-1.06 1.881 1.881 0 0 0-1.103-.54c-.435-.058-.867.018-1.284.175-.189.07-.336.143-.433.2a.75.75 0 0 0 .624 1.356l.066-.027.12-.061z" transform="translate(448 544)"></path><path d="m13.463 15.142-.04-.044-3.574-4.192c-.599-.703.355-1.656 1.058-1.057l4.191 3.574.044.04c.058.059.122.137.182.24.249.425.249.96-.154 1.41l-.057.057c-.45.403-.986.403-1.411.154a1.182 1.182 0 0 1-.24-.182zm.617-.616.444-.444a.31.31 0 0 0-.063-.052c-.093-.055-.263-.055-.35.024l.208.232.207-.206.006.007-.22.257-.026-.024.033-.034.025.027-.257.22-.007-.007zm-.027-.415c-.078.088-.078.257-.023.35a.31.31 0 0 0 .051.063l.205-.204-.233-.209z" transform="translate(448 544)"></path></g></g></svg>
                </div>
                <input type="text" placeholder='Search in odinbook' />
              </div>
            </div>
            <div className="nav-options">
              <div className="nav-svg">
                <svg viewBox="0 0 28 28" alt="" class="x1lliihq x1k90msu x2h7rmj x1qfuztq x198g3q0" fill="currentColor" height="20" width="20"><path d="M14 2.042c6.76 0 12 4.952 12 11.64S20.76 25.322 14 25.322a13.091 13.091 0 0 1-3.474-.461.956 .956 0 0 0-.641.047L7.5 25.959a.961.961 0 0 1-1.348-.849l-.065-2.134a.957.957 0 0 0-.322-.684A11.389 11.389 0 0 1 2 13.682C2 6.994 7.24 2.042 14 2.042ZM6.794 17.086a.57.57 0 0 0 .827.758l3.786-2.874a.722.722 0 0 1 .868 0l2.8 2.1a1.8 1.8 0 0 0 2.6-.481l3.525-5.592a.57.57 0 0 0-.827-.758l-3.786 2.874a.722.722 0 0 1-.868 0l-2.8-2.1a1.8 1.8 0 0 0-2.6.481Z"></path></svg>
              </div>
              <div className="nav-svg">
                <svg viewBox="0 0 28 28" alt="" class="x1lliihq x1k90msu x2h7rmj x1qfuztq x198g3q0" fill="currentColor" height="20" width="20"><path d="M7.847 23.488C9.207 23.488 11.443 23.363 14.467 22.806 13.944 24.228 12.581 25.247 10.98 25.247 9.649 25.247 8.483 24.542 7.825 23.488L7.847 23.488ZM24.923 15.73C25.17 17.002 24.278 18.127 22.27 19.076 21.17 19.595 18.724 20.583 14.684 21.369 11.568 21.974 9.285 22.113 7.848 22.113 7.421 22.113 7.068 22.101 6.79 22.085 4.574 21.958 3.324 21.248 3.077 19.976 2.702 18.049 3.295 17.305 4.278 16.073L4.537 15.748C5.2 14.907 5.459 14.081 5.035 11.902 4.086 7.022 6.284 3.687 11.064 2.753 15.846 1.83 19.134 4.096 20.083 8.977 20.506 11.156 21.056 11.824 21.986 12.355L21.986 12.356 22.348 12.561C23.72 13.335 24.548 13.802 24.923 15.73Z"></path></svg>
              </div>
              <div className="nav-svg">
                U
              </div>
            </div>
          </nav>
          <BrowserRouter>
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/auth' element={<Auth />} />
              <Route path='/:userId' element={<User />} />
            </Routes>
          </BrowserRouter>
        </div>
      </TokenContext.Provider>
    </UserContext.Provider>
  );
}

export default App;
