
import {} from 'react-dom';
import './App.css'
import Registration from './pages/Registration';
import { BrowserRouter, Routes,Route } from 'react-router-dom';
import View from './pages/view';
import Home from './pages/home';
import AdminDashboard from './pages/admin';
import Login from './pages/login';
import UpdateBooking from './pages/update-booking';

function App() {


  return (
    <BrowserRouter>
      <Routes>
        <Route path="/registration" element={<Registration />} />
        <Route path="*" element={<div>404 Not Found</div>} />
        <Route path='/view' element={<View/>}/>
        <Route path='/' element={<Home/>}/>
        <Route path='/admin' element={<AdminDashboard/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/update-booking' element={<UpdateBooking/>}/>
      </Routes>
    </BrowserRouter>

  )
}

export default App
