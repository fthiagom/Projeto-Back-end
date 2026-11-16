import { Link, NavLink } from 'react-router-dom';
import Logo from './Logo';
import miniCart from '../assets/mini-cart.svg';

const Header = () => {
  return (
    <header style={{ backgroundColor: '#ffffff', padding: '30px 100px', borderBottom: '1px solid #cccccc' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '25px' }}>
        <Link to="/">
          <Logo />
        </Link>
        

        <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#F5F5F5', borderRadius: '8px', padding: '12px 20px', width: '559px' }}>
          <input 
            type="text" 
            placeholder="Pesquisar produto..." 
            style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '16px', color: '#474747' }}
          />
        </div>

        
        <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
          <a href="#cadastre-se" style={{ color: '#474747', textDecoration: 'underline', fontSize: '16px' }}>Cadastre-se</a>
          <button style={{ backgroundColor: '#C92071', color: '#ffffff', border: 'none', borderRadius: '8px', padding: '12px 30px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer' }}>
            Entrar
          </button>
          <div style={{ position: 'relative', cursor: 'pointer' }}>
            <img src={miniCart} alt="Carrinho" width={30} height={30} />
          </div>
        </div>
      </div>

      
      <nav style={{ display: 'flex', gap: '30px' }}>
        <NavLink to="/" style={({ isActive }) => ({ color: isActive ? '#C92071' : '#474747', textDecoration: isActive ? 'underline' : 'none', fontWeight: 'bold', fontSize: '16px' })}>
          Home
        </NavLink>
        <NavLink to="/products" style={({ isActive }) => ({ color: isActive ? '#C92071' : '#474747', textDecoration: isActive ? 'underline' : 'none', fontWeight: 'bold', fontSize: '16px' })}>
          Produtos
        </NavLink>
        <NavLink to="/categories" style={({ isActive }) => ({ color: isActive ? '#C92071' : '#474747', textDecoration: isActive ? 'underline' : 'none', fontWeight: 'bold', fontSize: '16px' })}>
          Categorias
        </NavLink>
        <NavLink to="/orders" style={({ isActive }) => ({ color: isActive ? '#C92071' : '#474747', textDecoration: isActive ? 'underline' : 'none', fontWeight: 'bold', fontSize: '16px' })}>
          Meus Pedidos
        </NavLink>
      </nav>
    </header>
  );
};

export default Header;