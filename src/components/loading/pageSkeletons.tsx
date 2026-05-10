function SkeletonBlock({ className }: { className: string }) {
  return (
    <div className={`animate-pulse rounded bg-[var(--border)] ${className}`} />
  );
}

export function VenueGridSkeleton({ count = 12 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }, (_, index) => (
        <div
          key={`venue-skeleton-${index}`}
          className="card-gradient-border mx-auto my-1 flex h-full w-full max-w-sm flex-col overflow-hidden"
          aria-hidden="true"
        >
          <div className="h-52 w-full animate-pulse bg-[var(--border)] md:h-56" />
          <div className="flex flex-1 flex-col gap-3 p-4">
            <SkeletonBlock className="h-4 w-2/3" />
            <SkeletonBlock className="h-6 w-3/4" />
            <SkeletonBlock className="h-4 w-full" />
            <SkeletonBlock className="h-4 w-5/6" />
            <SkeletonBlock className="mt-auto h-5 w-1/3" />
          </div>
        </div>
      ))}
    </>
  );
}

export function VenueDetailSkeleton() {
  return (
    <section className="pb-10" aria-hidden="true">
      <div className="h-[320px] w-full animate-pulse bg-[var(--border)] md:h-[420px]" />
      <div className="mx-auto w-full max-w-6xl space-y-5 px-4 pt-6 md:px-6">
        <SkeletonBlock className="h-10 w-2/3" />
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
          <SkeletonBlock className="h-5 w-1/3" />
          <SkeletonBlock className="h-5 w-20" />
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
          <SkeletonBlock className="h-6 w-48" />
          <SkeletonBlock className="h-5 w-32" />
        </div>
      </div>
      <div className="mx-auto mt-4 grid w-full max-w-6xl gap-6 px-4 md:px-6 lg:grid-cols-[1fr_1fr_16rem]">
        <div className="space-y-3">
          <SkeletonBlock className="h-8 w-28" />
          <SkeletonBlock className="h-4 w-full" />
          <SkeletonBlock className="h-4 w-11/12" />
          <SkeletonBlock className="h-4 w-10/12" />
        </div>
        <div className="space-y-3">
          <SkeletonBlock className="h-8 w-36" />
          <SkeletonBlock className="h-56 w-full" />
        </div>
        <div className="space-y-3">
          <SkeletonBlock className="h-8 w-20" />
          <SkeletonBlock className="h-6 w-40" />
          <SkeletonBlock className="h-56 w-full" />
        </div>
      </div>
    </section>
  );
}

export function ProfilePageSkeleton() {
  return (
    <section aria-hidden="true" className="pb-8">
      <div className="h-[320px] w-full animate-pulse bg-[var(--border)]" />
      <div className="mx-auto w-full max-w-6xl px-4 py-4 md:px-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-16 w-16 animate-pulse rounded-full bg-[var(--border)]" />
            <SkeletonBlock className="h-8 w-44" />
          </div>
          <SkeletonBlock className="h-10 w-28" />
        </div>

        <div className="mt-4 space-y-3">
          <SkeletonBlock className="h-4 w-full" />
          <SkeletonBlock className="h-4 w-11/12" />
          <SkeletonBlock className="h-4 w-10/12" />
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          <SkeletonBlock className="h-56 w-full" />
          <SkeletonBlock className="h-56 w-full" />
        </div>
      </div>
    </section>
  );
}

export function EditProfileSkeleton() {
  return (
    <div aria-hidden="true" className="mx-auto w-full max-w-xl px-4 py-8">
      <SkeletonBlock className="h-10 w-48" />

      <div className="mt-6 space-y-6">
        <div className="space-y-4">
          <SkeletonBlock className="h-8 w-24" />
          <SkeletonBlock className="h-10 w-full" />
          <SkeletonBlock className="h-10 w-full" />
        </div>

        <div className="space-y-4">
          <SkeletonBlock className="h-8 w-24" />
          <SkeletonBlock className="h-10 w-full" />
          <SkeletonBlock className="h-10 w-full" />
        </div>

        <SkeletonBlock className="h-28 w-full" />
        <SkeletonBlock className="h-6 w-52" />

        <div className="flex gap-3">
          <SkeletonBlock className="h-10 w-32" />
          <SkeletonBlock className="h-10 w-24" />
        </div>
      </div>
    </div>
  );
}

export function CreateVenueSkeleton() {
  return (
    <section
      className="mx-auto w-full max-w-3xl px-4 py-8 text-left"
      aria-hidden="true"
    >
      <SkeletonBlock className="h-10 w-44" />

      <div className="mt-6 space-y-4">
        <SkeletonBlock className="h-10 w-full" />
        <SkeletonBlock className="h-36 w-full" />

        <div className="space-y-2">
          <SkeletonBlock className="h-5 w-24" />
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-[minmax(0,1fr)_12rem_auto]">
            <SkeletonBlock className="h-10 w-full" />
            <SkeletonBlock className="h-10 w-full" />
            <SkeletonBlock className="h-10 w-12" />
          </div>
          <SkeletonBlock className="h-5 w-36" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <SkeletonBlock className="h-10 w-full" />
          <SkeletonBlock className="h-10 w-full" />
        </div>

        <SkeletonBlock className="h-10 w-48" />

        <div className="grid grid-cols-2 gap-3">
          <SkeletonBlock className="h-10 w-full" />
          <SkeletonBlock className="h-10 w-full" />
        </div>

        <div className="grid grid-cols-4 gap-2">
          <SkeletonBlock className="h-10 w-full" />
          <SkeletonBlock className="h-10 w-full" />
          <SkeletonBlock className="h-10 w-full" />
          <SkeletonBlock className="h-10 w-full" />
        </div>

        <SkeletonBlock className="h-10 w-32" />
      </div>
    </section>
  );
}
