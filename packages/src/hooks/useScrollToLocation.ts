import React from 'react';
import { useLocation } from 'react-router-dom';

export const useScrollToLocation = () => {
  const scrolledRef = React.useRef(false);
  const { hash } = useLocation();
  const hashRef = React.useRef(hash);

  React.useEffect(() => {
    if (hash) {
      if (hashRef.current !== hash) {
        hashRef.current = hash;
        scrolledRef.current = false;
      }
      if (!scrolledRef.current) {
        const id = hash.replace('#', '');
        const element = document.getElementById(id);

        if (element) {
          var elementOffset = 30;
          const elementPosition = element?.getBoundingClientRect().top || 0;
          const offsetPosition = elementPosition + window.pageYOffset - elementOffset;
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth',
          });
          scrolledRef.current = true;
        }
      }
    }
  });
};
