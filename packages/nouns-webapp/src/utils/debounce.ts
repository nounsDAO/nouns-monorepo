export const debounce = (func: (...args: any[]) => void, delay: number) => {
  let timer: ReturnType<typeof setTimeout>;

  return (...args: any[]) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func(...args);
    }, delay);
  };
};
