import { useState } from 'react';
import { Menu, X, House, Users, User } from 'lucide-react';

type NavItem = 'home' | 'cults' | 'profile';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeItem, setActiveItem] = useState<NavItem>('home');

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex gap-10 h-full items-center">
        <button
          className="relative text-sm font-normal h-full flex items-center gap-2 transition-colors hover:opacity-80"
          style={{ color: activeItem === 'home' ? 'var(--garden-primary)' : '#6b7280' }}
          onClick={() => setActiveItem('home')}
        >
          <House className="w-4 h-4" />
          Home
          {activeItem === 'home' && (
            <span
              className="absolute bottom-0 left-0 right-0 h-0.5"
              style={{ backgroundColor: 'var(--garden-primary)' }}
            />
          )}
        </button>
        <button
          className="relative text-sm font-normal h-full flex items-center gap-2 transition-colors hover:opacity-80"
          style={{ color: activeItem === 'cults' ? 'var(--garden-primary)' : '#6b7280' }}
          onClick={() => setActiveItem('cults')}
        >
          <Users className="w-4 h-4" />
          Cults
          {activeItem === 'cults' && (
            <span
              className="absolute bottom-0 left-0 right-0 h-0.5"
              style={{ backgroundColor: 'var(--garden-primary)' }}
            />
          )}
        </button>
        <button
          className="relative text-sm font-normal h-full flex items-center gap-2 transition-colors hover:opacity-80"
          style={{ color: activeItem === 'profile' ? 'var(--garden-primary)' : '#6b7280' }}
          onClick={() => setActiveItem('profile')}
        >
          <User className="w-4 h-4" />
          Profile
          {activeItem === 'profile' && (
            <span
              className="absolute bottom-0 left-0 right-0 h-0.5"
              style={{ backgroundColor: 'var(--garden-primary)' }}
            />
          )}
        </button>
      </nav>

      {/* Mobile Hamburger Button */}
      <button
        className="md:hidden p-2 hover:bg-gray-100 rounded-md transition-colors"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        {isOpen ? (
          <X className="w-6 h-6 text-gray-500" />
        ) : (
          <Menu className="w-6 h-6 text-gray-500" />
        )}
      </button>

      {/* Mobile Slide-out Sidebar */}
      <>
        {/* Semi-transparent Backdrop - click to close */}
        <div
          className="fixed inset-0 z-40 md:hidden transition-opacity duration-300"
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            opacity: isOpen ? 1 : 0,
            pointerEvents: isOpen ? 'auto' : 'none',
          }}
          onClick={() => setIsOpen(false)}
        />

        {/* Sidebar Panel - Full Height */}
        <div
          className="fixed top-0 right-0 h-full w-64 bg-white shadow-2xl z-50 md:hidden border-l border-gray-200 transition-transform duration-300 ease-in-out"
          style={{
            transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
          }}
        >
            {/* Close Button */}
            <div className="flex justify-end p-4 border-b border-gray-100">
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-md transition-colors"
                aria-label="Close menu"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            <nav className="flex flex-col">
              <button
                className="px-6 py-4 text-left text-sm border-b border-gray-100 hover:bg-gray-50 transition-colors flex items-center gap-3"
                style={{
                  color: activeItem === 'home' ? 'var(--garden-primary)' : '#6b7280',
                  fontWeight: activeItem === 'home' ? 500 : 400
                }}
                onClick={() => {
                  setActiveItem('home');
                  setIsOpen(false);
                }}
              >
                <House className="w-4 h-4" />
                Home
              </button>
              <button
                className="px-6 py-4 text-left text-sm border-b border-gray-100 hover:bg-gray-50 transition-colors flex items-center gap-3"
                style={{
                  color: activeItem === 'cults' ? 'var(--garden-primary)' : '#6b7280',
                  fontWeight: activeItem === 'cults' ? 500 : 400
                }}
                onClick={() => {
                  setActiveItem('cults');
                  setIsOpen(false);
                }}
              >
                <Users className="w-4 h-4" />
                Cults
              </button>
              <button
                className="px-6 py-4 text-left text-sm border-b border-gray-100 hover:bg-gray-50 transition-colors flex items-center gap-3"
                style={{
                  color: activeItem === 'profile' ? 'var(--garden-primary)' : '#6b7280',
                  fontWeight: activeItem === 'profile' ? 500 : 400
                }}
                onClick={() => {
                  setActiveItem('profile');
                  setIsOpen(false);
                }}
              >
                <User className="w-4 h-4" />
                Profile
              </button>
          </nav>
        </div>
      </>
    </>
  );
}
