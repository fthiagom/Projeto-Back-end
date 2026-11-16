import starIcon from '../assets/star-icon.svg';
const BuyBox = ({
  name,
  reference,
  stars,
  rating,
  price,
  priceDiscount,
  description,
  children
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
     
      <h1 style={{ fontSize: '32px', color: 'var(--dark-gray, #1F1F1F)', margin: 0, lineHeight: '1.2' }}>
        {name}
      </h1>

      <span style={{ fontSize: '12px', color: 'var(--dark-gray-3, #666666)' }}>
        {reference}
      </span>

      
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div
          style={{
            backgroundColor: 'var(--warning, #F6AA1C)',
            color: 'var(--white, #FFFFFF)',
            fontSize: '14px',
            fontWeight: '700',
            padding: '4px 10px',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          <span>{stars}</span>
          <img src={starIcon} alt="Estrela" style={{ width: '14px', height: '14px' }} />
        </div>
        <span style={{ fontSize: '14px', color: 'var(--light-gray, #8F8F8F)' }}>
          ({rating} avaliações)
        </span>
      </div>

      
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', margin: '8px 0' }}>
        {priceDiscount ? (
          <>
            <span style={{ fontSize: '32px', fontWeight: '700', color: 'var(--dark-gray-2, #474747)' }}>
              R$ {Number(priceDiscount).toFixed(2).replace('.', ',')}
            </span>
            <span
              style={{
                fontSize: '16px',
                color: 'var(--light-gray-2, #CCCCCC)',
                textDecoration: 'line-through'
              }}
            >
              R$ {Number(price).toFixed(2).replace('.', ',')}
            </span>
          </>
        ) : (
          <span style={{ fontSize: '32px', fontWeight: '700', color: 'var(--dark-gray-2, #474747)' }}>
            R$ {Number(price).toFixed(2).replace('.', ',')}
          </span>
        )}
      </div>

     
      <div>
        <p style={{ fontSize: '14px', fontWeight: '700', color: 'var(--light-gray, #8F8F8F)', marginBottom: '4px' }}>
          Descrição do produto
        </p>
        <p style={{ fontSize: '14px', color: 'var(--dark-gray-2, #474747)', lineHeight: '1.5', margin: 0 }}>
          {description}
        </p>
      </div>

      
      <div style={{ margin: '10px 0' }}>
        {children}
      </div>

    
      <button
        type="button"
        style={{
          backgroundColor: 'var(--warning, #F6AA1C)',
          color: 'var(--white, #FFFFFF)',
          fontSize: '16px',
          fontWeight: '700',
          border: 'none',
          borderRadius: '4px',
          padding: '14px 24px',
          width: '220px',
          cursor: 'pointer',
          textTransform: 'uppercase',
          marginTop: '8px'
        }}
      >
        COMPRAR
      </button>
    </div>
  );
};

export default BuyBox;