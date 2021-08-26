import React, { useEffect, useRef } from 'react';

export const useThrottledEffect = (callback: React.EffectCallback, deps: React.DependencyList, delay: number) => {
	const lastRan = useRef(Date.now());

	useEffect(() => {
		const handler = setTimeout(function () {
			if (Date.now() - lastRan.current >= delay) {
				callback();
				lastRan.current = Date.now();
			}
		}, delay - (Date.now() - lastRan.current));
		return () => {
			clearTimeout(handler);
		};

		// react-hooks/exhaustive-deps complaints:
		// 1. React Hook useEffect was passed a dependency list that is not an array literal. This means we can't statically verify whether you've passed the correct dependencies                                                                           react-hooks/exhaustive-deps
		// 2. React Hook useEffect has missing dependencies: 'callback' and 'delay'. Either include them or remove the dependency array. If 'callback' changes too often, find the parent component that defines it and wrap that definition in useCallback  react-hooks/exhaustive-deps
		//
		// but:
		// 1. passing `deps` here is perfectly fine.
		// 2. callback, and delay are missing, but we don't care. 
		// eslint-disable-next-line
	}, deps)
};

export default useThrottledEffect;