import classes from './Links.module.css';

const Link: React.FC<{ buttonIcon:React.ReactNode;  url: string; leavesPage: boolean }> = props => {
  const { buttonIcon, url, leavesPage } = props;
  return (
   
     <a
      
       className={classes.link}
       href={url}
       target={leavesPage ? '_blank' : '_self'}
       rel="noreferrer"
     >
       <div className={classes.icon}>{buttonIcon}</div>
     </a>
    
  );
};
export default Link;
