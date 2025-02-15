import { useState, useEffect } from "react";

export default function useMeasure(ref: React.RefObject<HTMLElement>) {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!ref.current) return;

    const measure = () => {
      setDimensions({
        width: ref.current!.offsetWidth,
        height: ref.current!.offsetHeight,
      });
    };

    measure(); // initial measure

    const resizeObserver = new ResizeObserver(() => measure());
    resizeObserver.observe(ref.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, [ref]);

  return dimensions;
}
