import { useEffect, useRef } from 'react';

export const useThrottledEffect = (callback: React.EffectCallback, deps: React.DependencyList | undefined, delay: number) => {
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
	}, [...deps || [], delay]);
};

export default useThrottledEffect;