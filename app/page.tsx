export default function Home() {
  return (
    <main className="min-h-screen bg-slate-100">
      <div className="max-w-5xl mx-auto p-8">

        <h1 className="text-4xl font-bold">
          🏠 Stavebník
        </h1>

        <p className="text-slate-600 mt-2">
          Evidencia stavby domu svojpomocne.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-3">

          <div className="bg-white rounded-2xl p-6 shadow">
            <h2 className="font-semibold">
              Projekty
            </h2>

            <p className="text-sm text-slate-500 mt-2">
              Správa stavebných projektov.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow">
            <h2 className="font-semibold">
              Náklady
            </h2>

            <p className="text-sm text-slate-500 mt-2">
              Evidencia faktúr a výdavkov.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow">
            <h2 className="font-semibold">
              Stavebný denník
            </h2>

            <p className="text-sm text-slate-500 mt-2">
              Fotky a priebeh stavby.
            </p>
          </div>

        </div>
      </div>
    </main>
  );
}