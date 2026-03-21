import Container from "@/components/ui/Container";

export default function Loading() {
  return (
    <main className="pt-32 pb-24 min-h-screen bg-slate-50">
      <Container>
        <div className="max-w-4xl mx-auto animate-pulse">
          {/* Header skeleton */}
          <div className="text-center mb-16">
            <div className="h-10 bg-slate-200 rounded-xl w-2/3 mx-auto mb-6" />
            <div className="h-5 bg-slate-200 rounded-lg w-1/2 mx-auto" />
          </div>

          {/* Content skeleton */}
          <div className="grid md:grid-cols-2 gap-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-3xl p-8 border border-slate-100">
                <div className="h-6 bg-slate-200 rounded w-3/4 mb-4" />
                <div className="space-y-2">
                  <div className="h-4 bg-slate-200 rounded w-full" />
                  <div className="h-4 bg-slate-200 rounded w-5/6" />
                  <div className="h-4 bg-slate-200 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </main>
  );
}
