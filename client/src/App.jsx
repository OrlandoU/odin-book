
import { useEffect, useState } from 'react';
import './assets/styles/App.css';
import { TokenContext } from './contexts/TokenContext';
import { BrowserRouter, NavLink, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
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
import PostDisplay from './components/Post/PostDisplay';
import PhotoDisplay from './components/Post/PhotoDisplay';
import io from 'socket.io-client'
import { SocketContext } from './contexts/SocketContext';
import Search from './components/Search/Search';
import SearchBar from './components/Search/SearchBar';

function App() {
  const [socket, setSocket] = useState({})
  const [openChats, setOpenChats] = useState([])
  const [token, setToken] = useState(null)
  const [user, setUser] = useState({})

  const [isCompact, setIsCompact] = useState(null)
  const [isDarkMode, setIsDarkMode] = useState(null)

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
    const theme = localStorage.getItem('theme-odin')
    const isCompact = localStorage.getItem('isCompact-odin')
    if (storageToken) {
      setToken(storageToken)
    }
    setIsDarkMode(!!theme)
    setIsCompact(!!isCompact)
  }, [])

  useEffect(() => {
    if (isCompact === null) return

    if (isCompact) {
      localStorage.setItem('isCompact-odin', 'true')
      document.documentElement.style.fontSize = "14px";
    } else {
      localStorage.removeItem('isCompact-odin')
      document.documentElement.style.fontSize = "15px";
    }
  }, [isCompact])

  useEffect(() => {
    if (isDarkMode === null) return

    if (isDarkMode) {
      localStorage.setItem('theme-odin', 'true')
    } else {
      localStorage.removeItem('theme-odin')
    }
  }, [isDarkMode])

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

  useEffect(() => {
    if (!token) return
    const newSocket = io('http://localhost:3000', {
      auth: { token: `${token}` }
    }); // Replace with your server URL
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
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
    <SocketContext.Provider value={socket}>
      <ChatContext.Provider value={{ openChats, addChat, removeChat, hideChat, showChat }}>
        <UserContext.Provider value={user}>
          <TokenContext.Provider value={{ token, setToken }}>
            <BrowserRouter>
              <div className={isDarkMode ? "App DarkMode" : "App"}>
                <nav>
                  <NavLink to={'/'} className="app-name">odinbook</NavLink>
                  <SearchBar />
                  <NavOptions isCompact={isCompact} isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} setIsCompact={setIsCompact}/>
                </nav>
                <div className="main-wrapper">
                  <LeftBar className={'home'} />
                  <Routes>
                    <Route path='/' element={<Home />} />
                    <Route path='/auth' element={<Auth />} />
                    <Route path='/friends/*' element={<Friends />} />
                    <Route path='/groups/*' element={<Groups />} />
                    <Route path='/post/:postId' element={<PostDisplay />} />
                    <Route path='/photo/:postId/:index?' element={<PhotoDisplay />} />
                    <Route path='/search/:search/*' element={<Search />} />
                    <Route path='/:userId/*' element={<User />} />
                  </Routes>
                </div>
                <Bubbles />
              </div>
            </BrowserRouter>
          </TokenContext.Provider>
        </UserContext.Provider>
      </ChatContext.Provider>
    </SocketContext.Provider>
  );
}

export default App;
