import Header from '@/components/Header';
import Home from '@/components/Home';
import Footer from '@/components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-10">
        <Home />
      </main>

      <Footer />
    </div>
  );
}

export default App
