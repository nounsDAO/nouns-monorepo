import { TransitionStyles } from '../components/NounsTransition';

export const basicFadeInOut = {
  enteringStyle: { opacity: 1 },
  enteredStyle: { opacity: 1 },
  exitingStyle: { opacity: 0.5 },
  exitedStyle: { opacity: 0 },
} as TransitionStyles;

export const mobileModalSlideInFromBottm = {
  enteringStyle: {
    opacity: 1,
    transform: 'translateY(0rem) scale(1)',
    transition: 'opacity 100ms, transform 100ms',
  },
  enteredStyle: {
    opacity: 1,
    transform: 'translateY(0) scale(1)',
    transition: 'opacity 100ms, transform 100ms',
  },
  exitingStyle: {
    opacity: 0,
    transform: 'translateY(20rem) scale(0.9)',
    transition: 'opacity 100ms, transform 100ms',
  },
  exitedStyle: { opacity: 0 },
};

export const desktopModalSlideInFromTopAndGrow = {
  enteringStyle: {
    opacity: 1,
    transform: 'translateY(0rem) scale(1)',
    transition: 'opacity 100ms, transform 100ms',
  },
  enteredStyle: {
    opacity: 1,
    transform: 'translateY(0) scale(1)',
    transition: 'opacity 100ms, transform 100ms',
  },
  exitingStyle: {
    opacity: 0,
    transform: 'translateY(-1rem) scale(0)',
    transition: 'opacity 100ms, transform 100ms',
  },
  exitedStyle: { opacity: 0 },
};
