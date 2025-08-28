import React from 'react';

export const useScrollToLocation = () => {
  const scrolledRef = React.useRef(false);
  const hashRef = React.useRef<string | null>(null);

  React.useEffect(() => {
    const doScroll = () => {
      const currentHash = window.location.hash || '';
      if (!currentHash) return;
      if (hashRef.current !== currentHash) {
        hashRef.current = currentHash;
        scrolledRef.current = false;
      }
      if (!scrolledRef.current) {
        const id = currentHash.replace('#', '');
        const element = document.getElementById(id);
        if (element) {
          const elementOffset = 30;
          const elementPosition = element?.getBoundingClientRect().top || 0;
          const offsetPosition = elementPosition + window.pageYOffset - elementOffset;
          window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
          scrolledRef.current = true;
        }
      }
    };
    doScroll();
    window.addEventListener('hashchange', doScroll);
    return () => window.removeEventListener('hashchange', doScroll);
  }, []);
};
