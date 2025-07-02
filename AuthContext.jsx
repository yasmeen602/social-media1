
import axios from 'axios'
import cookie from 'js-cookie'
import { useEffect, useState, useCallback, createContext }  from 'react'
import {  useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { AuthContext } from './AuthContextContext';

export const AuthContext = createContext();


const AuthContextProvider = ({ children }) => {
   
    const navigate = useNavigate()

    
    const [token, setToken] = useState(!!cookie.get("token"))
    const [ user, setUser] = useState([])

    
    
    const backendUrl = 'http://localhost:3000'


useEffect(() => {
        if (token) {
            fetchCurrentUserDetails()
        }
    }, [fetchCurrentUserDetails, token])



    const fetchCurrentUserDetails = useCallback(async () => {
      try {
        const utoken = cookie.get("token")
        const { data } = await axios.get(`${backendUrl}/api/user/me`, {
            headers: {
                Authorization: `Bearer ${utoken}`
            }
        })
        if (data.success) {
            setUser(data.currentUser)
        }
      } catch (error) {
        console.log(error)
        toast.error("Login again")
      }
    }, [backendUrl])

    const handleRegister = async (username, email, password, avatar) => {
        try {
            const formData = new FormData()
            formData.append("username", username)
            formData.append("email", email)
            formData.append("password", password)
            formData.append("image", avatar)

            const { data } = await axios.post(`${backendUrl}/api/user/register`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            })

            if (data.success) {
                cookie.set("token", data.token, { expires: 7 })
                setToken(true)
                setUser(data.user)
                toast.success(data.message || "Register successfull")
                navigate('/posts')
            }
        } catch (error)  {
            console.log(error)
            toast.error("Register failed")
        }
    }

    const handleLogin = async (email, password) => {
        try {
            const { data } = await axios.post(`${backendUrl}/api/user/register`, { email, password}, {
                headers: {
                    "content-Type": "application/json"
                }
            })

            if (data.success) {
                cookie.set("token", data.token, { expires: 7 })
                setToken(true)
                setUser(data.user)
                toast.success(data.message || "Login successfull" )
                navigate('/posts')
            }
        } catch (error) {
            console.log(error)
            toast.error("Login failed")
        }
    }

    const handleLogout = async () => {
        cookie.remove("token")
        setToken(false)
        setUser(null)
        toast.success("Logout successfully")
    }


    const values =  {
        backendUrl,
        token,
        setToken,
        user, 
        setUser,
        handleRegister,
        handleLogin,
        handleLogout,
        fetchCurrentUserDetails
    }

    return (
        <AuthContext.Provider value={values}>
             { children }
        </AuthContext.Provider>
    )
}

export default AuthContextProvider