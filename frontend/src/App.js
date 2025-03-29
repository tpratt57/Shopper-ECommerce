import './App.css';
import Navbar from './Components/Navbar/Navbar';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Shop from "./Pages/Shop.jsx"
import ShopCategory from "./Pages/ShopCategory.jsx"
import Product from "./Pages/Product.jsx"
import LoginSignUp from "./Pages/LoginSignUp.jsx"
import Cart from "./Pages/Cart.jsx"
import Footer from './Components/Footer/Footer.jsx';
import men_banner from './Components/Assets/Frontend_Assets/banner_mens.png'
import women_banner from './Components/Assets/Frontend_Assets/banner_women.png'
import kid_banner from './Components/Assets/Frontend_Assets/banner_kids.png'

function App() {
  return (
    <div>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path='/' element={<Shop />} />
          <Route path='mens' element={<ShopCategory banner={men_banner} category="mens" />} />
          <Route path='womens' element={<ShopCategory banner={women_banner} category="women" />} />
          <Route path='kids' element={<ShopCategory banner={kid_banner} category="kid" />} />

          <Route path='product' element={<Product />}>
            <Route path=':productId' element={<Product />} />
          </Route>

          <Route path='/cart' element={<Cart />} />
          <Route path='/login' element={<LoginSignUp />} />
        </Routes>
        <Footer />

      </BrowserRouter>

    </div>
  );
}

export default App;
