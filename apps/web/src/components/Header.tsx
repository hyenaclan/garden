import Navigation from '@/components/Navigation';

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <h1 className="text-base font-semibold flex items-center gap-2 text-garden-primary-darkest">
            <span className="text-lg">🌱</span>
            Garden Manager
          </h1>
          <Navigation />
        </div>
      </div>
    </header>
  );
}
