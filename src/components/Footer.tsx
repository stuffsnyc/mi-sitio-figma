import { Button } from './ui/button';
import { useNavigation } from './NavigationProvider';
import { Mail, Instagram, Twitter } from 'lucide-react';

export function Footer() {
  const { setCurrentPage } = useNavigation();

  return (
    <footer className="border-t bg-muted/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="md:col-span-2">
            <h3 className="mb-4">SANTIAGO.POSTERS</h3>
            <p className="text-sm text-muted-foreground mb-4 max-w-md">
              Contemporary poster designer specializing in visual communication and graphic storytelling. 
              Based in Barcelona, creating impactful designs that bridge art and commercial application.
            </p>
            <div className="flex space-x-3">
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                <Mail className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                <Instagram className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                <Twitter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-4">Quick Links</h4>
            <nav className="space-y-2">
              <Button 
                variant="ghost" 
                className="w-full justify-start p-0 h-auto text-sm text-muted-foreground hover:text-foreground"
                onClick={() => setCurrentPage('gallery')}
              >
                Poster Gallery
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start p-0 h-auto text-sm text-muted-foreground hover:text-foreground"
                onClick={() => setCurrentPage('about')}
              >
                About Santiago
              </Button>
              <a 
                href="mailto:santiago@santiago.gallery" 
                className="block text-sm text-muted-foreground hover:text-foreground"
              >
                Contact
              </a>
            </nav>
          </div>

          {/* Legal */}
          <div>
            <h4 className="mb-4">Legal</h4>
            <nav className="space-y-2">
              <Button 
                variant="ghost" 
                className="w-full justify-start p-0 h-auto text-sm text-muted-foreground hover:text-foreground"
                onClick={() => setCurrentPage('privacy')}
              >
                Privacy Policy
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start p-0 h-auto text-sm text-muted-foreground hover:text-foreground"
                onClick={() => setCurrentPage('terms')}
              >
                Terms & Conditions
              </Button>
            </nav>
          </div>
        </div>

        <div className="border-t mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
            <p>© 2025 Santiago Camiro. All rights reserved.</p>
            <p>Poster Designer • Visual Communication • Print & Digital Design</p>
          </div>
        </div>
      </div>
    </footer>
  );
}