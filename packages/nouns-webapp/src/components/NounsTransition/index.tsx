import React from 'react';
import { Transition } from 'react-transition-group';

export interface TransitionStyles {
  enteringStyle: React.CSSProperties;
  enteredStyle: React.CSSProperties;
  exitingStyle: React.CSSProperties;
  exitedStyle: React.CSSProperties;
}

export interface NounsTransitionProps {
  children?: React.ReactNode;
  nodeRef: React.MutableRefObject<null>;
  show: boolean;
  transitionStyes: TransitionStyles;
  timeout?: number;
  onClick?: (e: any) => void;
  className?: string;
}

/**
 * Higher order util component wrapping functionality of react-transition-group to play nice with how we style CSS
 * @param props  NounsTransitionProps
 */
const NounsTransition: React.FC<NounsTransitionProps> = props => {
  const {
    children = <></>,
    nodeRef,
    show,
    timeout = 200,
    transitionStyes,
    onClick = () => {},
    className = '',
  } = props;

  const getStyle = (state: string) => {
    if (state === 'entering') {
      return transitionStyes.enteringStyle;
    }

    if (state === 'entered') {
      return transitionStyes.enteredStyle;
    }

    if (state === 'exiting') {
      return transitionStyes.exitingStyle;
    }

    if (state === 'exited') {
      return transitionStyes.exitedStyle;
    }
  };

  return (
    <Transition nodeRef={nodeRef} in={show} timeout={timeout} unmountOnExit>
      {state => (
        <div
          onClick={onClick}
          className={className}
          ref={nodeRef}
          style={{
            ...getStyle(state as string),
          }}
        >
          {children}
        </div>
      )}
    </Transition>
  );
};

export default NounsTransition;
