
const FilterGroup = ({ title, inputType, options = [] }) => {
  return (
    <div style={{ backgroundColor: 'var(--white)', padding: '20px', borderRadius: '4px', marginBottom: '20px' }}>
      <h3 style={{ fontSize: '16px', color: 'var(--dark-gray-2)', marginBottom: '15px' }}>{title}</h3>
      <hr style={{ borderColor: 'var(--light-gray-2)', marginBottom: '15px' }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {options.map((opt, index) => (
          <label key={index} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: 'var(--dark-gray-2)', cursor: 'pointer' }}>
            <input
              type={inputType}
              name={title}
              value={opt.value || opt.text}
              style={{ width: '22px', height: '22px', accentColor: 'var(--primary)', cursor: 'pointer' }}
            />
            {opt.text}
          </label>
        ))}
      </div>
    </div>
  );
};

export default FilterGroup;