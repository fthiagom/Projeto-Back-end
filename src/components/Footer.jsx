import Logo from './Logo';

const Footer = ({ informations }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={{ backgroundColor: '#1F1F1F', color: '#FFFFFF', padding: '60px 100px 20px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '40px', marginBottom: '60px' }}>
        <div>
          <div style={{ filter: 'brightness(0) invert(1)' }}>
            <Logo isFooter={true} />
          </div>
          <p style={{ marginTop: '24px', lineHeight: '1.6', color: '#CCCCCC' }}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
          <div style={{ display: 'flex', gap: '15px', marginTop: '30px' }}>
            <img src="../src/assets/facebook.svg" alt="Facebook" width={24} height={24} />
            <img src="../src/assets/instagram.svg" alt="Instagram" width={24} height={24} />
            <img src="../src/assets/twitter.svg" alt="Twitter" width={24} height={24} />
          </div>
        </div>

        {informations && informations.map((info, index) => (
          <div key={index}>
            <h4 style={{ fontSize: '18px', marginBottom: '20px' }}>{info.title}</h4>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {info.data.map((item, i) => (
                <li key={i} style={{ marginBottom: '12px' }}>
                  <a href={item.link} style={{ color: '#CCCCCC', textDecoration: 'none' }}>{item.text}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <hr style={{ borderColor: '#474747', marginBottom: '30px' }} />
      <p style={{ textAlign: 'center', color: '#CCCCCC', fontSize: '14px' }}>
        © {currentYear} Digital Store
      </p>
    </footer>
  );
};

export default Footer;