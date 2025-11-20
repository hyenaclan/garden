import { useState } from 'react';
import { Menu, House, Users, User } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';

type NavItem = 'home' | 'cults' | 'profile';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeItem, setActiveItem] = useState<NavItem>('home');

  const navItems = [
    { id: 'home' as NavItem, label: 'Home', icon: House },
    { id: 'cults' as NavItem, label: 'Cult', icon: Users },
    { id: 'profile' as NavItem, label: 'Profile', icon: User },
  ];

  return (
    <>
      {/* Desktop Navigation */}
      <Tabs value={activeItem} onValueChange={(value: string) => setActiveItem(value as NavItem)} className="hidden md:block">
        <TabsList>
          {navItems.map(({ id, label, icon: Icon }) => (
            <TabsTrigger key={id} value={id} className="gap-2">
              <Icon className="w-4 h-4" />
              {label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Mobile Navigation */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label="Toggle menu"
          >
            <Menu className="w-6 h-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-64 p-0" aria-describedby={undefined}>
          <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
          <nav className="flex flex-col mt-8">
            {navItems.map(({ id, label, icon: Icon }) => (
              <Button
                key={id}
                variant="ghost"
                className={`justify-start px-6 py-3 text-left text-sm border-b border-gray-100 rounded-none h-auto ${
                  activeItem === id ? 'text-garden-primary font-medium' : 'text-gray-500 font-normal'
                }`}
                onClick={() => {
                  setActiveItem(id);
                  setIsOpen(false);
                }}
              >
                <Icon className="w-4 h-4 mr-3" />
                {label}
              </Button>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
    </>
  );
}
