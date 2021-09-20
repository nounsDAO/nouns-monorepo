import { Link } from 'react-router-dom';
import classes from './NavBarLink.module.css';

const NavBarLink: React.FC<{ to: string; className?: string }> = props => {
  const { to, children, className } = props;
  // hacks to make React Router work with external links
  const onClick = () => (/http/.test(to) ? (window.location.href = to) : null);
  const target = /http/.test(to) ? '_blank' : '';
  return (
    <Link
      to={to}
      className={`${classes.navBarLink} ${className}`}
      onClick={onClick}
      target={target}
    >
      {children}
    </Link>
  );
};
export default NavBarLink;
