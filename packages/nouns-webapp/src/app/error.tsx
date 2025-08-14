'use client';

import React from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="container py-5">
      <h1 className="display-6 fw-semibold">Something went wrong</h1>
      {error?.message ? (
        <p className="text-muted mt-3" role="status">
          {error.message}
        </p>
      ) : null}
      <div className="d-flex mt-4 gap-2">
        <button className="btn btn-primary" onClick={() => reset()}>
          Try again
        </button>
        <button className="btn btn-outline-secondary" onClick={() => (window.location.href = '/')}>
          Go home
        </button>
      </div>
    </main>
  );
}
