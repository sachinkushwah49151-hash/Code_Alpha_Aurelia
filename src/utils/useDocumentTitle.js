import { useEffect } from 'react';

export const useDocumentTitle = (title) => {
  useEffect(() => {
    const prevTitle = document.title;
    if (title) {
      document.title = `${title} — NOVA`;
    } else {
      document.title = 'NOVA — Modern E-Commerce';
    }
    return () => {
      document.title = prevTitle;
    };
  }, [title]);
};
