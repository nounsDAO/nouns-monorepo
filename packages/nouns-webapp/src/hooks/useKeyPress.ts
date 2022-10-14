import { useEffect, useState } from 'react';

/**
 * A function that listens for specific keyboard keys and returns a boolean if that key is pressed
 * @param targetKey keyboard key to listen to
 * @returns boolean value of specified key press state
 */
export function useKeyPress(targetKey: KeyboardEvent['key']) {
  // State for keeping track of whether key is pressed
  const [keyPressed, setKeyPressed] = useState(false);

  // Add event listeners
  useEffect(() => {
    // If pressed key is our target key then set to true
    function downHandler({ key }: KeyboardEvent) {
      if (key === targetKey) {
        setKeyPressed(true);
      }
    }
    // If released key is our target key then set to false
    const upHandler = ({ key }: KeyboardEvent) => {
      if (key === targetKey) {
        setKeyPressed(false);
      }
    };

    window.addEventListener('keydown', downHandler);
    window.addEventListener('keyup', upHandler);
    // Remove event listeners on cleanup
    return () => {
      window.removeEventListener('keydown', downHandler);
      window.removeEventListener('keyup', upHandler);
    };
  }, [targetKey]); // rerun the effect if the targetKey changes

  return keyPressed;
}
