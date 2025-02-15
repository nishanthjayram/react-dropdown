import { useState, useMemo } from "react";

export const useVirtualization = (
  totalItems: number,
  virtualize: boolean,
  containerHeight: number,
  itemHeight: number
) => {
  const [scrollTop, setScrollTop] = useState(0);

  const visibleCount = Math.ceil(containerHeight / itemHeight) + 1;
  const shouldVirtualize = virtualize && totalItems > visibleCount;

  const rawStartIndex = Math.floor(scrollTop / itemHeight);
  const maxStartIndex = Math.max(0, totalItems - visibleCount);
  const startIndex = shouldVirtualize
    ? Math.min(rawStartIndex, maxStartIndex)
    : 0;
  const endIndex = shouldVirtualize
    ? Math.min(totalItems, startIndex + visibleCount)
    : totalItems;

  const visibleIndices = useMemo(() => {
    const indices: number[] = [];
    for (let i = startIndex; i < endIndex; i++) {
      indices.push(i);
    }
    return indices;
  }, [startIndex, endIndex]);

  const onScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  };

  return { visibleIndices, onScroll, shouldVirtualize, setScrollTop };
};
