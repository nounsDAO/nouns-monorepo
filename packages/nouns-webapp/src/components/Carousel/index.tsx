import { useEffect, useRef } from 'react';
import { useSnapCarousel } from 'react-snap-carousel';
import { CarouselItemProps } from '../CarouselItem';

interface CarouselProps<T> {
  items: T[];
  rootClassName?: string;
  scrollClassName?: string;
  startScrollRight?: boolean;
  onPageChanged?: (pageIndex: number) => void;
  renderItem: (props: CarouselRenderItemProps<T>) => React.ReactElement<CarouselItemProps>;
}

interface CarouselRenderItemProps<T> {
  item: T;
  isSnapPoint: boolean;
}

const Carousel = <T extends any>({
  items,
  rootClassName,
  scrollClassName,
  startScrollRight,
  onPageChanged,
  renderItem,
}: CarouselProps<T>) => {
  const scrollEl = useRef<HTMLUListElement>(null);
  const { scrollRef, activePageIndex } = useSnapCarousel();

  useEffect(() => {
    if (startScrollRight && scrollEl.current) {
      scrollEl.current.scrollLeft = scrollEl.current.scrollWidth - scrollEl.current.clientWidth;
    }
    scrollRef(scrollEl.current);
  }, [scrollRef, startScrollRight]);

  useEffect(() => {
    onPageChanged?.(activePageIndex);
  }, [activePageIndex, onPageChanged]);

  return (
    <div className={rootClassName}>
      <ul className={scrollClassName} ref={scrollEl}>
        <div style={{ flexShrink: 0, width: '50%' }} />
        {items.map(item =>
          renderItem({
            item,
            isSnapPoint: true, // For now, every item is a snap point
          }),
        )}
        <div style={{ flexShrink: 0, width: '50%' }} />
      </ul>
    </div>
  );
};

export default Carousel;
