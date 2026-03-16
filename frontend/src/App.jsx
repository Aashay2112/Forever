import React from 'react'
import { Routes,Route } from 'react-router-dom'
import Home from './pages/Home'
import Collection from './pages/Collection'
import About from './pages/About'
import Contact from './pages/Contact'
import Product from './pages/Product'
import Cart from './pages/Cart'
import Login from './pages/Login'
import PlaceOrder from './pages/PlaceOrder'
import Orders from './pages/Orders'
import PaymentSuccess from './pages/PaymentSuccess'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import SearchBar from './components/SearchBar'
import ProtectedRoute from './components/ProtectedRoute'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const App = () => {
  
  return (
    <div className='px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw] xl:px-[11vw] 2xl:px-[13vw]'>
      <ToastContainer />
      <Navbar/>
      <SearchBar/>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/collection" element={<Collection />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/product/:productId" element={<Product />} />
      <Route
        path="/cart"
        element={
          <ProtectedRoute>
            <Cart />
          </ProtectedRoute>
        }
      />
      <Route path="/login" element={<Login />} />
      <Route
        path="/placeorder"
        element={
          <ProtectedRoute>
            <PlaceOrder />
          </ProtectedRoute>
        }
      />
      <Route
        path="/orders"
        element={
          <ProtectedRoute>
            <Orders />
          </ProtectedRoute>
        }
      />
      <Route path="/payment-success" element={<PaymentSuccess />} />
    </Routes>
    <Footer/>
    </div>
  )
}

export default App