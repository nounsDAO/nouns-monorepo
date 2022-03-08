import { useRef, useEffect } from 'react';

/**
 * Dynamically append a string to the browser title. The title can optionally be replaced. Based on https://dev.to/luispa/how-to-add-a-dynamic-title-on-your-react-app-1l7k
 * @param title string to set as the document title.
 * @param replaceTitle replace the document title instead of appending. Default: false
 * @param resetUnmount reset to the previous title when the component is unmounted. Default: true
 */
function useDocumentTitle(
  title: string | undefined | null,
  replaceTitle = false,
  resetUnmount = true,
) {
  const defaultTitle = useRef(document.title);

  useEffect(() => {
    if (!title) return;
    document.title = replaceTitle ? title : `${defaultTitle.current} ${title}`;
  }, [title, replaceTitle]);

  // Resets the title if `resetUnmount == true`
  useEffect(
    () => () => {
      if (resetUnmount) {
        document.title = defaultTitle.current;
      }
    },
    [resetUnmount],
  );
}

export default useDocumentTitle;
