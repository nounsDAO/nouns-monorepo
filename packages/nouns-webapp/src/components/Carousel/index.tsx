import { useEffect, useRef } from 'react';
import { CarouselItemProps } from '../CarouselItem';
import { useSnapCarousel } from '../../hooks/useSnapCarousel';
import classes from './Carousel.module.css';

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
        <li className={`${classes.padding} ${classes.paddingLeft}`} />
        {items.map(item =>
          renderItem({
            item,
            isSnapPoint: true, // For now, every item is a snap point
          }),
        )}
        <li className={`${classes.padding} ${classes.paddingRight}`} />
      </ul>
    </div>
  );
};

export default Carousel;
