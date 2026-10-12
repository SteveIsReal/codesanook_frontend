import { Navigate, Outlet } from "react-router"
import useAuth from '../context/authContext'
import { PATH } from "./CustomRoute";


export default function ProtectedRoute({allowedGroup}) {
  const {user, loading} = useAuth()
  if (loading) {
    return <div>Loading...</div>
  }
  if (!user) {
    return <Navigate to={PATH.LOGIN} replace/>
  }
  const allowed = user.groups.some(group => allowedGroup.includes(group))
  if (!allowed) {
    return <Navigate to={PATH.ATTENDANCE} replace/>
  }
  return <Outlet />
}