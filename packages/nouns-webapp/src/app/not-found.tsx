import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="container py-5">
      <h1 className="display-5 fw-bold">Page not found</h1>
      <p className="text-muted mt-3">
        The page you are looking for doesn’t exist or has been moved.
      </p>
      <div className="mt-4">
        <Link href="/" className="btn btn-primary">
          Go back home
        </Link>
      </div>
    </main>
  );
}
