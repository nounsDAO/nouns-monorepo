import { useEffect, useRef } from 'react';
import { CarouselItemProps } from '../CarouselItem';
import { useSnapCarousel } from '../../hooks/useSnapCarousel';

interface CarouselProps<T> {
  items: T[];
  rootClassName?: string;
  scrollClassName?: string;
  startScrollRight?: boolean;
  onPageChanged?: (pageIndex: number, pageCount: number) => void;
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
  const { scrollRef, refresh, activePageIndex, pages } = useSnapCarousel();

  useEffect(() => {
    if (startScrollRight && scrollEl.current) {
      scrollEl.current.scrollLeft = scrollEl.current.scrollWidth - scrollEl.current.clientWidth;
    }
    scrollRef(scrollEl.current);
  }, [scrollRef, startScrollRight]);

  useEffect(() => {
    onPageChanged?.(activePageIndex, pages.length);
    refresh();
  }, [activePageIndex, onPageChanged, pages.length, refresh]);

  return (
    <div className={rootClassName}>
      <ul className={scrollClassName} ref={scrollEl}>
        <li style={{ flexShrink: 0, width: '50%' }} />
        {items.map(item =>
          renderItem({
            item,
            isSnapPoint: true, // For now, every item is a snap point
          }),
        )}
        <li style={{ flexShrink: 0, width: '50%' }} />
      </ul>
    </div>
  );
};

export default Carousel;
