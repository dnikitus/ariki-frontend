import './App.css';
import Footer from "./Footer";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CartProvider } from "./CartContext";

import Navbar from "./Navbar";
import Home from "./Home";
import ProductsPage from "./ProductsPage";
import ProductDetailsPage from "./ProductDetailsPage";
import CartPage from "./CartPage";
import News from "./News";
import Contact from "./Contact";
import About from "./About";
import Profile from "./Profile";

function App() {
  return (
    <CartProvider>
      <Router>
        <div className="app-container">
          <Navbar />

          <main className="page-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/products/:id" element={<ProductDetailsPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/news" element={<News />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/about" element={<About />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;