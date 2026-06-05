export default function ProductDetailLoading() {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
        <div className="aspect-[5/4] rounded-[2rem] bg-card ring-1 ring-border" />
        <div className="flex flex-col gap-4">
          <div className="h-6 w-28 rounded-full bg-muted" />
          <div className="h-12 w-3/4 rounded-full bg-muted" />
          <div className="h-8 w-32 rounded-full bg-muted" />
          <div className="h-4 w-full rounded-full bg-muted" />
          <div className="h-4 w-5/6 rounded-full bg-muted" />
          <div className="h-40 rounded-[2rem] bg-card ring-1 ring-border" />
        </div>
      </div>
    </div>
  );
}
