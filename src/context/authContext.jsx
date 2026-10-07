import { createContext, useContext, useEffect, useState } from "react";
import axios from 'axios'
import { URL_TOKEN } from "../constants/urls";


const AuthContext = createContext(null)

export function AuthProvider({children}) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const getMe = async () => {
    const token = localStorage.getItem('userToken')
    if (!token) {
      setLoading(false)
      return
    }
  
    try {
      const response = await axios.get(URL_TOKEN.ME, {headers: {Authorization: `Bearer ${token}`}})
      setUser(response.data)
    } catch (err) {
      console.error(err)
      localStorage.removeItem('userToken')
    }
    setLoading(false)
  }

  const login = async (token) => {
    localStorage.setItem("userToken", token)
    await getMe()
  }
  
  const logout = async (token) => {
    localStorage.removeItem("userToken")
    setUser(null)
  }

  useEffect(() => {
    getMe().finally(() => setLoading(false))
  }, [])

  return (
    <AuthContext.Provider value={{user, loading, login, logout, getMe}}>
      {children}
    </AuthContext.Provider>
  )
}

export default function useAuth() {
  return useContext(AuthContext)
}

