import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Compass } from 'lucide-react';
import { useDocumentTitle } from '../utils/useDocumentTitle';
import { Button } from '../components/Button';

export const NotFound = () => {
  useDocumentTitle('404 Page Not Found');

  return (
    <div className="max-w-2xl mx-auto px-4 py-24 sm:py-32 text-center space-y-6">
      <div className="w-16 h-16 rounded-2xl bg-stone-100 text-neutral-800 flex items-center justify-center mx-auto shadow-inner">
        <Compass className="w-8 h-8 text-neutral-500" />
      </div>

      <div className="space-y-2">
        <span className="text-xs font-mono uppercase tracking-[0.2em] text-neutral-400">
          Error 404
        </span>
        <h1 className="text-3xl sm:text-5xl font-light text-neutral-950">
          Page Not <span className="font-semibold">Found</span>
        </h1>
        <p className="text-sm text-neutral-500 max-w-md mx-auto">
          The destination you requested does not exist or may have been transitioned to an archival collection.
        </p>
      </div>

      <div className="pt-2 flex justify-center gap-3">
        <Link to="/">
          <Button variant="primary" icon={ArrowLeft}>
            Return Home
          </Button>
        </Link>
        <Link to="/shop">
          <Button variant="outline">
            Browse Catalog
          </Button>
        </Link>
      </div>
    </div>
  );
};
