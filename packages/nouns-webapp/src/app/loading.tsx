export default function Loading() {
  return (
    <main className="container py-5" aria-busy="true" aria-live="polite">
      <div className="d-flex align-items-center gap-3">
        <div className="spinner-border" role="status" aria-label="Loading" />
        <span className="text-muted">Loading…</span>
      </div>
    </main>
  );
}
