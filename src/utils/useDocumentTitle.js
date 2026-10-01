import { useEffect } from 'react';

export const useDocumentTitle = (title) => {
  useEffect(() => {
    const prevTitle = document.title;
    if (title) {
      document.title = `${title} — AURELIA`;
    } else {
      document.title = 'AURELIA — Curated for the way you live.';
    }
    return () => {
      document.title = prevTitle;
    };
  }, [title]);
};
