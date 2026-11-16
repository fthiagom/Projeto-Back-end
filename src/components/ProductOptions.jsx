import React, { useState } from 'react';

const ProductOptions = ({ options = [], radius = '4px', shape = 'square', type = 'text' }) => {
  const [selected, setSelected] = useState(null);

  return (
    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '8px' }}>
      {options.map((option, index) => {
        const isSelected = selected === index;
        const isCircle = shape === 'circle';

        const baseStyle = {
          width: isCircle ? '31px' : 'auto',
          minWidth: isCircle ? '31px' : '46px',
          height: isCircle ? '31px' : '46px',
          padding: isCircle ? '0' : '0 12px',
          borderRadius: isCircle ? '50%' : radius,
          border: isSelected ? '2px solid var(--primary, #C92071)' : '1px solid var(--light-gray-2, #CCCCCC)',
          backgroundColor: type === 'color' ? option : isSelected ? 'var(--primary, #C92071)' : 'var(--white, #FFFFFF)',
          color: type === 'text' ? (isSelected ? 'var(--white, #FFFFFF)' : 'var(--dark-gray-2, #474747)') : 'transparent',
          fontSize: '24px',
          fontWeight: '700',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          outline: isCircle && isSelected ? '2px solid var(--primary, #C92071)' : 'none',
          outlineOffset: '2px',
          transition: 'all 0.2s ease'
        };

        return (
          <button
            key={index}
            type="button"
            onClick={() => setSelected(index)}
            style={baseStyle}
          >
            {type === 'text' ? option : ''}
          </button>
        );
      })}
    </div>
  );
};

export default ProductOptions;