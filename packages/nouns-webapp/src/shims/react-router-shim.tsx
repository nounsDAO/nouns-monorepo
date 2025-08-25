// A minimal shim to bridge legacy react-router usage in a Next.js App Router app.
// This lets us progressively migrate without blocking builds/tests.

'use client';

import React, { PropsWithChildren, useEffect } from 'react';

import NextLink from 'next/link';
import { useParams as useNextParams, useRouter, useSearchParams } from 'next/navigation';

// Link shim: supports `to`, `className`, `onClick`, `target` props commonly used
export const Link: React.FC<
  PropsWithChildren<{
    to: string;
    className?: string;
    onClick?: React.MouseEventHandler<HTMLAnchorElement>;
    target?: string;
    replace?: boolean;
    prefetch?: boolean;
    reloadDocument?: boolean;
  }>
> = ({ to, className, onClick, target, children, replace, prefetch, reloadDocument }) => {
  if (reloadDocument === true) {
    return (
      <a href={to} className={className} onClick={onClick} target={target}>
        {children}
      </a>
    );
  }
  return (
    <NextLink
      href={to}
      className={className}
      onClick={onClick}
      target={target}
      replace={replace}
      prefetch={prefetch}
    >
      {children}
    </NextLink>
  );
};

// useNavigate shim: returns a function that pushes to the given route
export const useNavigate = () => {
  const router = useRouter();
  return (to: string) => router.push(to);
};

// useParams shim: adapt Next's useParams to legacy react-router typing (non-null, generic)
export const useParams = <T extends Record<string, string>>() => {
  return useNextParams() as unknown as T;
};

// useLocation shim: returns an object with `search`, `hash`, and `pathname`
export const useLocation = () => {
  const params = useSearchParams();
  const qs = params?.toString() ?? '';
  const w = typeof window !== 'undefined' ? window : undefined;
  const hash = w ? w.location.hash : '';
  const pathname = w ? w.location.pathname : '';
  return {
    search: qs ? `?${qs}` : '',
    hash,
    pathname,
  } as { search: string; hash: string; pathname: string };
};

// Optional Navigate shim for places that used <Navigate to="/path" replace />
export const Navigate: React.FC<{ to: string; replace?: boolean }> = ({ to, replace }) => {
  const router = useRouter();
  useEffect(() => {
    if (replace === true) router.replace(to);
    else router.push(to);
  }, [router, to, replace]);
  return null;
};
