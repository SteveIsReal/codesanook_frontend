import { Navigate, Outlet } from "react-router"
import useAuth from '../context/authContext'
import { PATH } from "./customRoute";


export default function ProtectedRoute({allowedGroup}) {
  const {user, loading} = useAuth()
  if (loading) {
    return <div>Loading...</div>
  }
  if (!user) {
    return <Navigate to={PATH.LOGIN} replace/>
  }
  console.log(user)
  console.log(user.groups)
  console.log(allowedGroup)
  const allowed = user.groups.some(group => allowedGroup.includes(group))
  if (!allowed) {
    return <Navigate to={PATH.ATTENDANCE} replace/>
  }
  return <Outlet />
}