
import { useEffect, useState } from 'react';
import './assets/styles/App.css';
import { TokenContext } from './contexts/TokenContext';
import { BrowserRouter, NavLink, Route, Routes, useLocation } from 'react-router-dom'
import Auth from './components/Auth/Auth';
import Home from './components/Home/Home';
import { UserContext } from './contexts/UserContext';
import { getCurrentUser } from './functions/user';
import User from './components/User/User';
import LeftBar from './components/Home/LeftBar';
import NavOptions from './components/Nav/NavOptions';
import Bubbles from './components/Message/Bubbles';
import { ChatContext } from './contexts/ChatContext';
import Friends from './components/Friends/Friends';
import Groups from './components/Groups/Groups';

function App() {
  const [openChats, setOpenChats] = useState([])
  const [token, setToken] = useState(null)
  const [user, setUser] = useState({})

  const removeChat = (id) => {
    setOpenChats(prev => prev.filter(chat => chat._id !== id))
  }

  const addChat = (chat) => {
    setOpenChats(prev => {
      let filtered = prev.find(el => el._id === chat._id)
      if (filtered) {
        return prev
      } else {
        return [...prev, { ...chat, open: true }]
      }
    })
    showChat(chat._id)
  }

  const hideChat = (id) => {
    setOpenChats(prev => {
      return prev.map(el => {
        if (el._id === id) {
          return { ...el, open: false }
        }
        return el
      })
    })
  }
  const showChat = (id) => {
    setOpenChats(prev => {
      return prev.map(el => {
        if (el._id === id) {
          return { ...el, open: true }
        }
        return el
      })
    })
  }

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

  if (!token || !user) {
    return (
      <TokenContext.Provider value={{ token, setToken }}>
        <div className="App">
          <Auth />
        </div>
      </TokenContext.Provider>
    )
  }

  return (
    <ChatContext.Provider value={{ openChats, addChat, removeChat, hideChat, showChat }}>
      <UserContext.Provider value={user}>
        <TokenContext.Provider value={{ token, setToken }}>
          <BrowserRouter>
            <div className="App">
              <nav>
                <NavLink to={'/'} className="app-name">odinbook</NavLink>
                <div className="searchbar-wrapper">
                  <div className="searchbar">
                    <div className="searchbar-icon">
                      <svg fill="currentColor" viewBox="0 0 16 16" width="1em" height="1em" class="x1lliihq x1k90msu x2h7rmj x1qfuztq xcza8v6 xlup9mm x1kky2od"><g fill-rule="evenodd" transform="translate(-448 -544)"><g fill-rule="nonzero"><path d="M10.743 2.257a6 6 0 1 1-8.485 8.486 6 6 0 0 1 8.485-8.486zm-1.06 1.06a4.5 4.5 0 1 0-6.365 6.364 4.5 4.5 0 0 0 6.364-6.363z" transform="translate(448 544)"></path><path d="M10.39 8.75a2.94 2.94 0 0 0-.199.432c-.155.417-.23.849-.172 1.284.055.415.232.794.54 1.103a.75.75 0 0 0 1.112-1.004l-.051-.057a.39.39 0 0 1-.114-.24c-.021-.155.014-.356.09-.563.031-.081.06-.145.08-.182l.012-.022a.75.75 0 1 0-1.299-.752z" transform="translate(448 544)"></path><path d="M9.557 11.659c.038-.018.09-.04.15-.064.207-.077.408-.112.562-.092.08.01.143.034.198.077l.041.036a.75.75 0 0 0 1.06-1.06 1.881 1.881 0 0 0-1.103-.54c-.435-.058-.867.018-1.284.175-.189.07-.336.143-.433.2a.75.75 0 0 0 .624 1.356l.066-.027.12-.061z" transform="translate(448 544)"></path><path d="m13.463 15.142-.04-.044-3.574-4.192c-.599-.703.355-1.656 1.058-1.057l4.191 3.574.044.04c.058.059.122.137.182.24.249.425.249.96-.154 1.41l-.057.057c-.45.403-.986.403-1.411.154a1.182 1.182 0 0 1-.24-.182zm.617-.616.444-.444a.31.31 0 0 0-.063-.052c-.093-.055-.263-.055-.35.024l.208.232.207-.206.006.007-.22.257-.026-.024.033-.034.025.027-.257.22-.007-.007zm-.027-.415c-.078.088-.078.257-.023.35a.31.31 0 0 0 .051.063l.205-.204-.233-.209z" transform="translate(448 544)"></path></g></g></svg>
                    </div>
                    <input type="text" placeholder='Search in odinbook' className='hover-bar'/>
                  </div>
                </div>
                <NavOptions />
              </nav>
              <div className="main-wrapper">
                <LeftBar className={'home'} />
                <Routes>
                  <Route path='/' element={<Home />} />
                  <Route path='/auth' element={<Auth />} />
                  <Route path='/friends/*' element={<Friends />} />
                  <Route path='/groups/*' element={<Groups />} />
                  <Route path='/:userId/*' element={<User />} />
                </Routes>
              </div>
              <Bubbles />
            </div>
          </BrowserRouter>
        </TokenContext.Provider>
      </UserContext.Provider>
    </ChatContext.Provider>
  );
}

export default App;
