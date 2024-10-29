
import { Route, Routes } from 'react-router-dom'
import './App.css'

import SuperAdminLogin from './components/superAdmin/SuperAdminLogin'
import Dashboard from './components/Dashboard/Dashboard'
import AdminLogin from './components/Admins/AdminLogin'
import AdminDashDashboard from './components/Admins/AdminDashBoard'
import UserRegistration from './components/User/UserRegistration'
import UserLogin from './components/User/UserLogin'
import SuperAdminRegistration from './components/superAdmin/SuperAdminRegistration'



function App() {
  

  return (
    <>
    
      <Routes>
        <Route path="/" element={<SuperAdminLogin/>} />
        <Route path="/login" element={<SuperAdminLogin/>} /> 
        <Route path="/registration" element={ <SuperAdminRegistration/>} />
        <Route path="/dashboard/*" element={<Dashboard />} />
        <Route path="/adminlogin" element={<AdminLogin />} />
        <Route path="/userlogin" element={<UserLogin/>}/>
        <Route path="/admindashboard/*" element={<AdminDashDashboard/>} />
        <Route path="/userRegistration"  element={<UserRegistration/>}/>
      </Routes>
    </>
  )
}

export default App
