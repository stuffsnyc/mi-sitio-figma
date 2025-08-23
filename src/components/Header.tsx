import { Button } from './ui/button';
import { ThemeToggle } from './ThemeToggle';
import { useNavigation } from './NavigationProvider';

export function Header() {
  const { currentPage, setCurrentPage } = useNavigation();

  const navItems = [
    { id: 'gallery' as const, label: 'Posters' },
    { id: 'about' as const, label: 'About' },
  ];

  return (
    <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div 
            className="cursor-pointer"
            onClick={() => setCurrentPage('gallery')}
          >
            <h1 className="text-2xl font-normal tracking-tight text-foreground hover:text-foreground/80 transition-colors">
              SANTIAGO.POSTERS
            </h1>
          </div>
          
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Button
                key={item.id}
                variant={currentPage === item.id ? 'default' : 'ghost'}
                onClick={() => setCurrentPage(item.id)}
                className="font-normal"
              >
                {item.label}
              </Button>
            ))}
          </nav>

          <div className="flex items-center space-x-4">
            <ThemeToggle />
          </div>
        </div>

        {/* Mobile Navigation */}
        <nav className="md:hidden mt-4 flex space-x-4">
          {navItems.map((item) => (
            <Button
              key={item.id}
              variant={currentPage === item.id ? 'default' : 'ghost'}
              onClick={() => setCurrentPage(item.id)}
              size="sm"
              className="font-normal"
            >
              {item.label}
            </Button>
          ))}
        </nav>
      </div>
    </header>
  );
}