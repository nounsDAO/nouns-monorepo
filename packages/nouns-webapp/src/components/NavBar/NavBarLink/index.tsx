import { Link } from 'react-router-dom';
import classes from './NavBarLink.module.css';

const NavBarLink: React.FC<{ to: string; className?: string }> = props => {
  const { to, children, className } = props;
  return (
    <Link to={to} className={`${classes.navBarLink} ${className}`}>
      {children}
    </Link>
  );
};
export default NavBarLink;
