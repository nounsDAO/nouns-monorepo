import { useState, useEffect } from "react";

const useMousePosition = () => {
  const [position, setPosition] = useState({
    clientX: 0,
    clientY: 0,
    pageX: 0,
    pageY: 0,
  });

  const update = (event: MouseEvent) => {
    const { pageX, pageY, clientX, clientY } = event;

    setPosition({
      clientX,
      clientY,
      pageX,
      pageY,
    });
  };

  useEffect(() => {
    document.addEventListener("mousemove", update, false);
    document.addEventListener("mouseenter", update, false);

    return () => {
      document.removeEventListener("mousemove", update);
      document.removeEventListener("mouseenter", update);
    };
  }, []);

  return position;
};

export default useMousePosition;