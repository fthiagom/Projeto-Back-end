import { Link } from 'react-router-dom';

const Section = ({ title, titleAlign = 'left', link, children }) => {
  return (
    <section style={{ margin: '32px 0' }}>
      <div style={{
        display: 'flex',
        justifyContent: titleAlign === 'center' ? 'center' : 'space-between',
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <h2 style={{
          color: 'var(--dark-gray-2)',
          fontSize: '24px',
          fontWeight: '700',
          textAlign: titleAlign,
          width: titleAlign === 'center' ? '100%' : 'auto'
        }}>
          {title}
        </h2>
        {link && (
          <Link to={link.href} style={{
            color: 'var(--primary)',
            fontSize: '18px',
            textDecoration: 'none',
            whiteSpace: 'nowrap'
          }}>
            {link.text} &rarr;
          </Link>
        )}
      </div>
      <div>{children}</div>
    </section>
  );
};

export default Section;