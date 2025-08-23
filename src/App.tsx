import { ThemeProvider } from './components/ThemeProvider';
import { NavigationProvider, useNavigation } from './components/NavigationProvider';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ArtGallery } from './components/ArtGallery';
import { AboutPage } from './components/pages/AboutPage';
import { PrivacyPage } from './components/pages/PrivacyPage';
import { TermsPage } from './components/pages/TermsPage';

function AppContent() {
  const { currentPage } = useNavigation();

  const renderPage = () => {
    switch (currentPage) {
      case 'gallery':
        return <ArtGallery />;
      case 'about':
        return <AboutPage />;
      case 'privacy':
        return <PrivacyPage />;
      case 'terms':
        return <TermsPage />;
      default:
        return <ArtGallery />;
    }
  };

  return (
    <div className="min-h-screen bg-background transition-colors flex flex-col">
      <Header />
      <main className="flex-1">
        {renderPage()}
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <NavigationProvider>
        <AppContent />
      </NavigationProvider>
    </ThemeProvider>
  );
}