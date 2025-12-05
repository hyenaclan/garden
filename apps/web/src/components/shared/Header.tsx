export function Header({ children }: { children?: React.ReactNode }) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-white shadow-sm">
      {children}
    </header>
  );
}

export function HeaderContainer({ children }: { children?: React.ReactNode }) {
  return (
    <div className="flex h-14 max-w-7xl mx-auto px-4 items-center">
      {children}
    </div>
  );
}

export function HeaderBrand({ children }: { children?: React.ReactNode }) {
  return <div className="mr-20 flex">{children}</div>;
}

export function HeaderNav({ children }: { children?: React.ReactNode }) {
  return <nav className="flex items-center gap-6 text-sm">{children}</nav>;
}

export function HeaderActions({ children }: { children?: React.ReactNode }) {
  return (
    <div className="flex flex-1 items-center justify-end gap-2">{children}</div>
  );
}
