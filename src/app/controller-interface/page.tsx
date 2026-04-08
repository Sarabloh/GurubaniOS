import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/common/Header';
import ControllerInterfaceClient from './components/ControllerInterfaceClient';
import { SHABAD_COLLECTIONS } from '@/data/shabadLines';

export const metadata: Metadata = {
  title: 'Controller Interface - Gurbani Presenter',
  description: 'Manage and control Gurbani presentations during religious services with search functionality, line-by-line navigation, and custom slide creation capabilities.',
};

export default function ControllerInterfacePage({
  searchParams,
}: {
  searchParams: { collection?: string };
}) {
  const collectionKey = searchParams.collection;
  const collection = collectionKey ? SHABAD_COLLECTIONS[collectionKey as keyof typeof SHABAD_COLLECTIONS] : undefined;

  if (!collection) {
    const items = Object.values(SHABAD_COLLECTIONS);
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
        <Header />
        <div className="max-w-6xl mx-auto p-8">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 shadow-2xl backdrop-blur-xl">
            <h1 className="text-5xl font-extrabold tracking-tight mb-3">Collection chooser - Guru Gobind Singh Ji</h1>
            <p className="text-base text-slate-300">Pick a Gurbani source to load in the controller interface.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 md:auto-rows-fr gap-6 mt-8">
            {items.map((item) => (
              <Link
                key={item.id}
                href={`/controller-interface?collection=${item.id}`}
                className="group block h-full p-8 rounded-2xl border border-white/10 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 shadow-lg hover:shadow-2xl transition-all duration-300"
              >
                <div className="h-full flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-3xl font-bold text-white">{item.title}</h2>
                    <span className="text-xs font-semibold uppercase tracking-wide px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-200">
                      {item.supportsAng ? 'Ang' : 'Text'}
                    </span>
                  </div>
                  <p className="text-slate-300 leading-relaxed min-h-[72px]">{item.description}</p>
                  <span className="mt-auto pt-4 text-sm font-medium text-slate-200 underline decoration-emerald-400/40 group-hover:text-white">
                    Open {item.title}
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <p className="text-sm text-slate-300 mt-6">
            Tip: Choose one to continue <Link href="/" className="underline text-slate-100"></Link>.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <ControllerInterfaceClient initialCollectionKey={collectionKey} />
    </div>
  );
}
