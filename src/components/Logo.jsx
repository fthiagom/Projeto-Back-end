import logoHeader from '../assets/logo-header.svg';
import logoFooter from '../assets/logo-footer.svg';

const Logo = ({ isFooter = false }) => {
  return (
    <img
      src={isFooter ? logoFooter : logoHeader}
      alt="Digital Store Logo"
      width={253}
      height={44}
      style={{ display: 'block' }}
    />
  );
};

export default Logo;