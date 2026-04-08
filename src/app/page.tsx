import Link from 'next/link';
import { SHABAD_COLLECTIONS } from '@/data/shabadLines';

export default function HomePage() {
  const collections = Object.values(SHABAD_COLLECTIONS);

  return (
    <main className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-foreground mb-4">Gurbani Presenter</h1>
        <p className="text-text-secondary mb-8">
          Select a scripture collection to start controlling the presentation.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {collections.map((collection) => (
            <Link
              key={collection.id}
              href={`/controller-interface?collection=${collection.id}`}
              className="block p-6 rounded-xl border border-border bg-surface hover:border-primary hover:ring-2 hover:ring-primary/25 transition-all"
            >
              <h2 className="text-2xl font-semibold text-foreground mb-2">{collection.title}</h2>
              <p className="text-text-secondary mb-4">{collection.description}</p>
              <p className="text-sm text-text-secondary">
                {collection.supportsAng ? 'Ang search available' : 'Text search only'}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
