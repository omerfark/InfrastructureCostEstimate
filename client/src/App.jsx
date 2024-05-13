import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import {BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import Signup from './Components/Signup/Signup'
import Login from './Components/Login/Login'
import MainPage from './Components/MainPage/MainPage'
import About from "./Components/About/About";
import Campus from "./Components/Campus/Campus";
import Contact from "./Components/Contact/Contact";
import Footer from "./Components/Footer/Footer";
import Navbar from './Components/Navbar/Navbar';
import Excavation from './Components/Excavation/Excavation'
import AsphaltCalculator from './Components/AsphaltProject/AsphaltCalculator'
import PictureInPictureEvent from './Components/PipeInfrastructure/PipeInfrastructure'
import UserProfile from './Components/UserProfile/UserProfile'
import ForgotPassword from './Components/ForgotPassword/ForgotPassword'
import ResetPassword from './Components/ResetPassword/ResetPassword'



function App() {

  return (
    <BrowserRouter>
      <div className='container1'>
      <Navbar/>
      <Routes>
        <Route path='/' element={<MainPage/>}></Route>
        <Route path='/signup' element={<Signup/>}></Route>
        <Route path='/login' element={<Login/>}></Route>
        <Route path='/about' element={<About/>}></Route>
        <Route path='/campus' element={<Campus/>}></Route>
        <Route path='/contact' element={<Contact/>}></Route>
        <Route path='/excavation' element={<Excavation/>}></Route>
        <Route path='/asphaltcalculator' element={<AsphaltCalculator/>}></Route>
        <Route path='/pipeinfrastructure' element={<PictureInPictureEvent/>}></Route>
        <Route path='/userprofile' element={<UserProfile/>}></Route>
        <Route path='/forgotPassword' element={<ForgotPassword/>}></Route>
        <Route path='/resetPassword/:token' element={<ResetPassword/>}></Route>
      </Routes>
      <Footer/>
      </div>
    </BrowserRouter>
  )
}

export default App
