import { useState } from 'react';
import { Form } from 'react-bootstrap';
import { getNavBarButtonVariant, NavBarButtonStyle } from '../NavBarButton';
import classes from './NavBarSelect.module.css';

interface NavBarSelectProps {
  buttonText: React.ReactNode;
  buttonIcon?: React.ReactNode;
  buttonStyle?: NavBarButtonStyle;
}

const NavBarSelect: React.FC<NavBarSelectProps> = props => {
  const { buttonText, buttonIcon, buttonStyle } = props;

  return (
    <div style={{position: 'relative'}}>
      <div style={{ position: 'absolute' }}>
        <div className={`${classes.wrapper} ${getNavBarButtonVariant(buttonStyle)}`}>
          <div className={classes.button}>
            {buttonIcon && <div className={classes.icon}>{buttonIcon}</div>}
            <div>{buttonText}</div>
          </div>
        </div>
      </div>

      <div style={{ position: 'absolute' }}>
        <div
          className={`${classes.wrapper} ${getNavBarButtonVariant(buttonStyle)}`}
          style={{
            opacity: '.1%',
          }}
        >
          <select
            style={{
              width: '100%',
              height: '100%',
              textAlign: 'center',
              backgroundColor: 'transparent',
              border: '0',
              fontWeight: 'bold',
              fontFamily: 'PT Root UI',
            }}
          >
            <option>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Language
            </option>
            <option>Language</option>
            <option>Language</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default NavBarSelect;
