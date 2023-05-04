
import { useEffect, useState } from 'react';
import './assets/styles/App.css';
import { TokenContext } from './contexts/TokenContext';
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Auth from './components/Auth/Auth';
import Home from './components/Home/Home';
import { UserContext } from './contexts/UserContext';
import { getCurrentUser } from './functions/user';

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
      if(token === ''){
        setUser({})
      } else {
        getCurrentUser(token).then((data)=>{
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
          </nav>
          <BrowserRouter>
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/auth' element={<Auth />} />
            </Routes>
          </BrowserRouter>
        </div>
      </TokenContext.Provider>
    </UserContext.Provider>
  );
}

export default App;
