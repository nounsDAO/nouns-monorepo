/* eslint-disable react/prop-types */
import classes from './nav-bar-item.module.css';

const NavBarItem: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}> = props => {
  const { onClick, children, className } = props;
  return (
    <div className={` ${classes.navBarItem} ${className}`} onClick={onClick}>
      {children}
    </div>
  );
};
export default NavBarItem;
