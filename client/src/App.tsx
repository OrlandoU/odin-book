
import { useEffect, useState } from 'react';
import './assets/styles/App.css';
import { TokenContext } from './contexts/TokenContext';
import { HashRouter, NavLink, Route, Routes, useLocation, useParams } from 'react-router-dom'
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
import io, { Socket } from 'socket.io-client'
import { SocketContext } from './contexts/SocketContext';
import Search from './components/Search/Search';
import SearchBar from './components/Search/SearchBar';
import PostSaved from './components/Post/PostSaved';
import { UpdateUserContext } from './contexts/UpdateUserContext';
import Chat from './interfaces/Chat';
import UserI from './interfaces/User'
import UserWrapper from './components/User/UserWrapper';

type localVar = string | null

function App(): React.JSX.Element {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [openChats, setOpenChats] = useState<Chat[]>([])
  const [token, setToken] = useState<string>('')
  const [user, setUser] = useState<UserI | null>(null)

  const [isCompact, setIsCompact] = useState<boolean>(false)
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false)

  const removeChat = (id: string) => {
    setOpenChats(prev => prev.filter(chat => chat._id !== id))
  }

  const addChat = (chat: Chat): void => {
    setOpenChats((prev: Chat[]) => {
      let filtered = prev.find(el => el._id === chat._id)
      if (filtered) {
        return prev
      } else {
        return [...prev, { ...chat, open: true }]
      }
    })
    showChat(chat._id)
  }

  const hideChat = (id: string): void => {
    setOpenChats(prev => {
      return prev.map(el => {
        if (el._id === id) {
          return { ...el, open: false }
        }
        return el
      })
    })
  }
  const showChat = (id: string) => {
    setOpenChats(prev => {
      return prev.map(el => {
        if (el._id === id) {
          return { ...el, open: true }
        }
        return el
      })
    })
  }
  const fetchUser = (token: string) => {
    if (token === '') {
      setUser(null)
    } else {

      getCurrentUser(token as string).then((data: UserI | void) => {
        data && setUser(data)
      })
    }
  }

  useEffect(() => {
    const storageToken: localVar = localStorage.getItem('jwt-odin')
    const theme: localVar = localStorage.getItem('theme-odin')
    const isCompact: localVar = localStorage.getItem('isCompact-odin')
    if (storageToken) {
      setToken(storageToken as string)
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
      localStorage.setItem('jwt-odin', token as string)
      fetchUser(token)
    }
  }, [token])

  useEffect(() => {
    if (!token) return
    const newSocket: Socket = io('https://oodinbook.fly.dev', {
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
    <UpdateUserContext.Provider value={fetchUser}>
      <SocketContext.Provider value={socket}>
        <ChatContext.Provider value={{ openChats, addChat, removeChat, hideChat, showChat }}>
          <UserContext.Provider value={user!}>
            <TokenContext.Provider value={{ token: token!, setToken }}>
              <HashRouter>
                <div className={isDarkMode ? "App DarkMode" : "App"}>
                  <nav>
                    <NavLink to={'/'} className="app-name">odinbook</NavLink>
                    <SearchBar />
                    <NavOptions isCompact={isCompact} isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} setIsCompact={setIsCompact} />
                  </nav>
                  <div className="main-wrapper">
                    <LeftBar/>
                    <Routes>
                      <Route path='/' element={<Home />} />
                      <Route path='/auth' element={<Auth />} />
                      <Route path='/friends/*' element={<Friends />} />
                      <Route path='/groups/*' element={<Groups />} />
                      <Route path='/posts/saved' element={<PostSaved />} />
                      <Route path='/post/:postId' element={<PostDisplay />} />
                      <Route path='/photo/:postId/:index?' element={<PhotoDisplay isCompact={isCompact} isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} setIsCompact={setIsCompact} />} />
                      <Route path='/search/:search/*' element={<Search />} />
                      <Route path='/:userId/*' element={<UserWrapper />} />
                    </Routes>
                  </div>
                  <Bubbles />
                </div>
              </HashRouter>
            </TokenContext.Provider>
          </UserContext.Provider>
        </ChatContext.Provider>
      </SocketContext.Provider>
    </UpdateUserContext.Provider>
  );
}

export default App;
