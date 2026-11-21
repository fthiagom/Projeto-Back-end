import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { ProductListingPage } from './pages/ProductListingPage';
import ProductViewPage from './pages/ProductViewPage';

function App() {
  return (
    <BrowserRouter>
      {/* Barra de navegação opcional para alternar entre rotas */}
      <nav style={{ padding: '15px', background: '#f5f5f5', display: 'flex', gap: '20px', borderBottom: '1px solid #ddd' }}>
        <Link to="/" style={{ textDecoration: 'none', color: '#333', fontWeight: 'bold' }}>Início</Link>
        <Link to="/products" style={{ textDecoration: 'none', color: '#333', fontWeight: 'bold' }}>Produtos</Link>
      </nav>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductListingPage />} />
        <Route path="/product/:id" element={<ProductViewPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;