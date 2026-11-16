import Header from './Header';
import Footer from './Footer';

const Layout = ({ children }) => {
  const footerInfo = [
    {
      title: 'Informações',
      data: [
        { text: 'Sobre Drip Store', link: '/about' },
        { text: 'Segurança', link: '/security' },
        { text: 'Wishlist', link: '/wishlist' }
      ]
    },
    {
      title: 'Categorias',
      data: [
        { text: 'Tênis', link: '/products?category=tenis' },
        { text: 'Uniformes', link: '/products?category=uniformes' }
      ]
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <main style={{ flex: 1, maxWidth: '1440px', width: '100%', margin: '0 auto' }}>
        {children}
      </main>
      <Footer informations={footerInfo} />
    </div>
  );
};

export default Layout;