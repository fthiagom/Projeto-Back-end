import { Link } from 'react-router-dom';

const ProductCard = ({ id = 1, image, name, price, priceDiscount }) => {
  return (
    <Link 
      to={`/product/${id}`} 
      style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
    >
      <div style={{ width: '292px', cursor: 'pointer' }}>
        
        <div
          style={{
            width: '292px',
            height: '321px',
            backgroundColor: 'var(--white, #FFFFFF)',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '12px'
          }}
        >
          <img
            src={image}
            alt={name}
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        </div>

       
        <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--light-gray, #8F8F8F)' }}>
          Tênis
        </span>

        <h3 style={{ fontSize: '24px', fontWeight: '400', color: 'var(--dark-gray-2, #474747)', margin: '4px 0' }}>
          {name}
        </h3>

     
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {priceDiscount ? (
            <>
              <span
                style={{
                  fontSize: '24px',
                  color: 'var(--light-gray, #8F8F8F)',
                  textDecoration: 'line-through'
                }}
              >
                R$ {Number(price).toFixed(2).replace('.', ',')}
              </span>
              <span style={{ fontSize: '24px', fontWeight: '700', color: 'var(--dark-gray, #1F1F1F)' }}>
                R$ {Number(priceDiscount).toFixed(2).replace('.', ',')}
              </span>
            </>
          ) : (
            <span style={{ fontSize: '24px', fontWeight: '700', color: 'var(--dark-gray, #1F1F1F)' }}>
              R$ {Number(price).toFixed(2).replace('.', ',')}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;