
import { Route, Routes } from 'react-router-dom'
import './App.css'
import SuperAdminRegistration from './components/superAdmin/superAdminRegistration'
import SuperAdminLogin from './components/superAdmin/SuperAdminLogin'
import Dashboard from './components/Dashboard/Dashboard'



function App() {
  

  return (
    <>
    
      <Routes>
        <Route path="/" element={<SuperAdminLogin/>} />
        <Route path="/login" element={<SuperAdminLogin/>} /> 
        <Route path="/registration" element={ <SuperAdminRegistration/>} />
        <Route path="/dashboard/*" element={<Dashboard />} />
        
      </Routes>
    </>
  )
}

export default App
