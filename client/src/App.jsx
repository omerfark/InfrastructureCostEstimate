import { useEffect, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import {BrowserRouter, Routes, Route  } from 'react-router-dom'
import Signup from './Components/Signup/Signup'
import Login from './Components/Login/Login'
import MainPage from './Components/MainPage/MainPage'
import Contact from "./Components/Contact/Contact";
import Footer from "./Components/Footer/Footer";
import Navbar from './Components/Navbar/Navbar';
import Excavation from './Components/Excavation/Excavation'
import AsphaltCalculator from './Components/AsphaltProject/AsphaltCalculator'
import Comprehensive from './Components/Comprehensive/Comprehensive'
import ForgotPassword from './Components/ForgotPassword/ForgotPassword'
import ResetPassword from './Components/ResetPassword/ResetPassword'
import ConcreteRoad from './Components/ConcreteRoad/ConcreteRoad'
import ElectricProject from './Components/ElectricProject/ElectricProject'
import PipeConcrete from './Components/PipeConcrete/PipeConcrete'
import Sidebar from './Components/Sidebar/Sidebar'
import ProjectProfile from './Components/ProjectProfile/ProjectProfile'


function App() {

  return (
    <BrowserRouter>
      <div className='container1'>
      <Navbar />
      <Routes>
        <Route path='/' element={<MainPage/>}></Route>
        <Route path='/signup' element={<Signup/>}></Route>
        <Route path='/login' element={<Login/>}></Route>
        <Route path='/contact' element={<Contact/>}></Route>
        <Route path='/excavation' element={<Excavation/>}></Route>
        <Route path='/asphaltcalculator' element={<AsphaltCalculator/>}></Route>
        <Route path='/pipeconcrete' element={<PipeConcrete/>}></Route>
        <Route path='/concreteRoad' element={<ConcreteRoad/>}></Route>
        <Route path='/electric' element={<ElectricProject/>}></Route>
        <Route path='/comprehensive' element={<Comprehensive/>}></Route>
        <Route path='/projectprofile' element={<ProjectProfile/>}></Route>
        <Route path='/forgotPassword' element={<ForgotPassword/>}></Route>
        <Route path='/resetPassword/:token' element={<ResetPassword/>}></Route>
        <Route path='/sidebar' element={<Sidebar/>}></Route>
      </Routes>
      <Footer/>
      </div>
    </BrowserRouter>
  )
}

export default App
