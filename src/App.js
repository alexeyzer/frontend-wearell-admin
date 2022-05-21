import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

import Login from './pages/Login'
import Main from './pages/Main'
import Navibar from './components/Navibar'
import Sizes from './pages/Sizes'
import Size from './pages/Size'
import Brands from './pages/Brands'
import Brand from './pages/Brand'
import Categories from './pages/Categories'
import Category from './pages/Category'
import Roles from './pages/Roles'
import Role from './pages/Role'
import Users from './pages/Users'
import User from './pages/User'
import Products from './pages/Products'
import Product from './pages/Product'

function App() {
  return (
    <>
    <Router>
      <Navibar/>
      <Routes>
        <Route path="/" element={<Main/>}></Route>
        <Route path="/login" element={<Login/>}></Route>
        <Route path="/users" element={<Users/>}></Route>
        <Route path="/sizes" element={<Sizes/>}></Route>
        <Route path="/sizes/:id" element={<Size/>}></Route>
        <Route path="/brands" element={<Brands/>}></Route>
        <Route path="/brands/:id" element={<Brand/>}></Route>
        <Route path="/categories" element={<Categories/>}></Route>
        <Route path="/categories/:id" element={<Category/>}></Route>
        <Route path="/roles" element={<Roles/>}></Route>
        <Route path="/roles/:id" element={<Role/>}></Route>
        <Route path="/users" element={<Users/>}></Route>
        <Route path="/users/:id" element={<User/>}></Route>
        <Route path="/products" element={<Products/>}></Route>
        <Route path="/products/:id" element={<Product/>}></Route>
      </Routes>
    </Router>
    </>
  );
}

export default App;
