import { useState, useRef, useEffect } from 'react';
import { Menu, X, House, Users, User } from 'lucide-react';

type NavItem = 'home' | 'cults' | 'profile';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeItem, setActiveItem] = useState<NavItem>('home');
  const [underlineStyle, setUnderlineStyle] = useState({ left: 0, width: 0 });
  const navRefs = useRef<Record<NavItem, HTMLButtonElement | null>>({
    home: null,
    cults: null,
    profile: null,
  });

  const navItems = [
    { id: 'home' as NavItem, label: 'Home', icon: House },
    { id: 'cults' as NavItem, label: 'Cult', icon: Users },
    { id: 'profile' as NavItem, label: 'Profile', icon: User },
  ];

  const baseNavClass = 'relative text-sm font-normal h-full flex items-center gap-2 transition-colors hover:text-garden-primary-light cursor-pointer';
  const baseNavMobileClass = 'px-6 py-4 text-left text-sm border-b border-gray-100 hover:bg-gray-50 transition-colors flex items-center gap-3 cursor-pointer';

  useEffect(() => {
    const activeButton = navRefs.current[activeItem];
    if (activeButton) {
      setUnderlineStyle({
        left: activeButton.offsetLeft,
        width: activeButton.offsetWidth,
      });
    }
  }, [activeItem]);

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex gap-10 h-full items-center relative">
        {navItems.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            ref={(el) => { navRefs.current[id] = el; }}
            className={`${baseNavClass} ${activeItem === id ? 'text-garden-primary' : 'text-gray-500'}`}
            onClick={() => setActiveItem(id)}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
        {/* Animated underline */}
        <span
          className="absolute bottom-0 h-0.5 bg-garden-primary transition-all duration-300 ease-in-out"
          style={{
            left: `${underlineStyle.left}px`,
            width: `${underlineStyle.width}px`,
          }}
        />
      </nav>

      {/* Mobile Hamburger Button */}
      <button
        className="md:hidden p-2 hover:bg-gray-100 rounded-md transition-colors cursor-pointer"
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
                className="p-2 hover:bg-gray-100 rounded-md transition-colors cursor-pointer"
                aria-label="Close menu"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            <nav className="flex flex-col">
              {navItems.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  className={`${baseNavMobileClass} ${activeItem === id ? 'text-garden-primary font-medium' : 'text-gray-500 font-normal'}`}
                  onClick={() => {
                    setActiveItem(id);
                    setIsOpen(false);
                  }}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}
          </nav>
        </div>
      </>
    </>
  );
}
