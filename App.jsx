
import { useContext  } from "react";
import { ToastContainer } from 'react-toastify'
import { AuthContext } from './context/AuthContext'
import NavBar from './components/NavBar'
import { Navigate, Route, Routes } from 'react-router-dom'
import PostsPage from './pages/PostsPage'
import AddPost from './components/AddPost'
import Landing from './pages/Landing'
import Register from './pages/Register';
const App = () => {
  const { token } = useContext(AuthContext)

  return (
    <div className="h-screen">
      <ToastContainer />
      {token ? (
        <>
        <NavBar/>
        <Routes>
          <Route path='/posts' elements={<PostsPage /> } />
          <Route path='/' elements= {<Navigate to = "/posts" /> } /> 
          <Route path='/create-post' element={<AddPost /> } /> 
            <Route path="*" element={<Navigate to="/posts" />} />
        </Routes>
        </>
      ) : (
        <Routes>
        <Route path='/' element={<Landing />} />
        <Route path ='/register' element={<Register /> } /> 
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      )}
    </div>
  )
}

export default App
