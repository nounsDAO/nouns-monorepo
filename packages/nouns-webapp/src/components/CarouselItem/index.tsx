export interface CarouselItemProps {
  isSnapPoint: boolean;
  itemClassName?: string;
  itemSnapPointClassName?: string;
  children?: React.ReactNode;
}

export const CarouselItem = ({ isSnapPoint, children, itemClassName, itemSnapPointClassName }: CarouselItemProps) => (
  <li className={`${itemClassName} ${isSnapPoint ? itemSnapPointClassName : ''}`}>
    {children}
  </li>
);

export default CarouselItem;
