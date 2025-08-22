import { useState, useEffect, useCallback, useRef } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Heart, Share2, MessageCircle, MapPin, Calendar, DollarSign, Loader2, Eye, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface Poster {
  id: string;
  title: string;
  designer: string;
  description: string;
  images: string[];
  price: string;
  technique: string;
  dimensions: string;
  year: string;
  series: string;
  likes: number;
  comments: number;
  tags: string[];
}

const allPosters: Poster[] = [
  {
    id: '1',
    title: 'Abstract Harmony',
    designer: 'Santiago Camiro',
    description: 'A vibrant exploration of color and form, this poster embodies the essence of contemporary abstract design. Bold geometric patterns intersect with organic shapes to create visual rhythm.',
    images: [
      'https://stuffs.nyc/wp-content/uploads/IMG_6131-scaled.jpg',
      'https://stuffs.nyc/wp-content/uploads/IMG_6131-scaled.jpg',
      'https://stuffs.nyc/wp-content/uploads/IMG_6131-scaled.jpg',
      'https://stuffs.nyc/wp-content/uploads/IMG_6131-scaled.jpg',
      'https://stuffs.nyc/wp-content/uploads/IMG_6131-scaled.jpg'
    ],
    price: '$45',
    technique: 'Digital Print on Premium Paper',
    dimensions: '18" x 12"',
    year: '2024',
    series: 'Abstract Collection',
    likes: 189,
    comments: 34,
    tags: ['abstract', 'geometric', 'contemporary']
  },
  {
    id: '2',
    title: 'Urban Composition',
    designer: 'Santiago Camiro',
    description: 'Dynamic patterns that pulse with the energy of city life. This poster explores the visual language of urban architecture and its impact on contemporary design.',
    images: [
      'https://stuffs.nyc/wp-content/uploads/20250815_131722_bded153f-scaled.jpg',
      'https://stuffs.nyc/wp-content/uploads/20250815_131722_bded153f-scaled.jpg',
      'https://stuffs.nyc/wp-content/uploads/20250815_131722_bded153f-scaled.jpg',
      'https://stuffs.nyc/wp-content/uploads/20250815_131722_bded153f-scaled.jpg',
      'https://stuffs.nyc/wp-content/uploads/20250815_131722_bded153f-scaled.jpg'
    ],
    price: '$38',
    technique: 'Screen Print on Cotton Paper',
    dimensions: '24" x 16"',
    year: '2024',
    series: 'Urban Series',
    likes: 156,
    comments: 28,
    tags: ['urban', 'modern', 'architectural']
  },
  {
    id: '3',
    title: 'Color Symphony',
    designer: 'Santiago Camiro',
    description: 'A harmonious blend of vibrant colors and flowing forms. This design celebrates the emotional power of color in contemporary poster art.',
    images: [
      'https://stuffs.nyc/wp-content/uploads/IMG_5965-scaled.jpg',
      'https://stuffs.nyc/wp-content/uploads/IMG_5965-scaled.jpg',
      'https://stuffs.nyc/wp-content/uploads/IMG_5965-scaled.jpg',
      'https://stuffs.nyc/wp-content/uploads/IMG_5965-scaled.jpg',
      'https://stuffs.nyc/wp-content/uploads/IMG_5965-scaled.jpg'
    ],
    price: '$42',
    technique: 'Eco-Friendly Soy Ink Print',
    dimensions: '20" x 13.3"',
    year: '2024',
    series: 'Color Collection',
    likes: 234,
    comments: 45,
    tags: ['colorful', 'vibrant', 'expressive']
  },
  {
    id: '4',
    title: 'Digital Landscape',
    designer: 'Santiago Camiro',
    description: 'A forward-looking poster that visualizes our relationship with digital environments. Contemporary aesthetics meet innovative design principles.',
    images: [
      'https://stuffs.nyc/wp-content/uploads/20250815_131053_559b07a9-scaled.jpg',
      'https://stuffs.nyc/wp-content/uploads/20250815_131053_559b07a9-scaled.jpg',
      'https://stuffs.nyc/wp-content/uploads/20250815_131053_559b07a9-scaled.jpg',
      'https://stuffs.nyc/wp-content/uploads/20250815_131053_559b07a9-scaled.jpg',
      'https://stuffs.nyc/wp-content/uploads/20250815_131053_559b07a9-scaled.jpg'
    ],
    price: '$52',
    technique: 'Holographic Foil Print',
    dimensions: '27" x 18"',
    year: '2024',
    series: 'Digital Series',
    likes: 298,
    comments: 67,
    tags: ['digital', 'futuristic', 'innovative']
  },
  {
    id: '5',
    title: 'Artistic Expression',
    designer: 'Santiago Camiro',
    description: 'A celebration of creative expression through bold visual elements. This poster captures the essence of contemporary artistic movement.',
    images: [
      'https://stuffs.nyc/wp-content/uploads/IMG_5966-scaled.jpg',
      'https://stuffs.nyc/wp-content/uploads/IMG_5966-scaled.jpg',
      'https://stuffs.nyc/wp-content/uploads/IMG_5966-scaled.jpg',
      'https://stuffs.nyc/wp-content/uploads/IMG_5966-scaled.jpg',
      'https://stuffs.nyc/wp-content/uploads/IMG_5966-scaled.jpg'
    ],
    price: '$35',
    technique: 'Letterpress with Hand-lettering',
    dimensions: '24" x 16"',
    year: '2024',
    series: 'Expression Collection',
    likes: 167,
    comments: 31,
    tags: ['artistic', 'expressive', 'creative']
  },
  {
    id: '6',
    title: 'Modern Aesthetics',
    designer: 'Santiago Camiro',
    description: 'A journey through contemporary design aesthetics. Clean lines and bold elements create a poster that bridges traditional and modern design trends.',
    images: [
      'https://stuffs.nyc/wp-content/uploads/20250815_132924_ce9c800c-scaled.jpg',
      'https://stuffs.nyc/wp-content/uploads/20250815_132924_ce9c800c-scaled.jpg',
      'https://stuffs.nyc/wp-content/uploads/20250815_132924_ce9c800c-scaled.jpg',
      'https://stuffs.nyc/wp-content/uploads/20250815_132924_ce9c800c-scaled.jpg',
      'https://stuffs.nyc/wp-content/uploads/20250815_132924_ce9c800c-scaled.jpg'
    ],
    price: '$48',
    technique: 'UV Reactive Ink Print',
    dimensions: '30" x 20"',
    year: '2024',
    series: 'Modern Collection',
    likes: 342,
    comments: 78,
    tags: ['modern', 'contemporary', 'aesthetic']
  },
  {
    id: '7',
    title: 'Creative Vision',
    designer: 'Santiago Camiro',
    description: 'A bold vision of creative expression. This design showcases the power of visual communication through innovative poster design.',
    images: [
      'https://stuffs.nyc/wp-content/uploads/IMG_6128-scaled.jpg',
      'https://stuffs.nyc/wp-content/uploads/IMG_6128-scaled.jpg',
      'https://stuffs.nyc/wp-content/uploads/IMG_6128-scaled.jpg',
      'https://stuffs.nyc/wp-content/uploads/IMG_6128-scaled.jpg',
      'https://stuffs.nyc/wp-content/uploads/IMG_6128-scaled.jpg'
    ],
    price: '$40',
    technique: 'Fine Art Giclée Print',
    dimensions: '22" x 14.7"',
    year: '2024',
    series: 'Vision Collection',
    likes: 198,
    comments: 42,
    tags: ['creative', 'visionary', 'artistic']
  },
  {
    id: '8',
    title: 'Dynamic Forms',
    designer: 'Santiago Camiro',
    description: 'Bold shapes and dynamic compositions collide in this expressive poster design. A modern interpretation of form and movement in visual art.',
    images: [
      'https://stuffs.nyc/wp-content/uploads/IMG_6119-scaled.jpg',
      'https://stuffs.nyc/wp-content/uploads/IMG_6119-scaled.jpg',
      'https://stuffs.nyc/wp-content/uploads/IMG_6119-scaled.jpg',
      'https://stuffs.nyc/wp-content/uploads/IMG_6119-scaled.jpg',
      'https://stuffs.nyc/wp-content/uploads/IMG_6119-scaled.jpg'
    ],
    price: '$44',
    technique: 'Acrylic Print on Metal',
    dimensions: '20" x 13.3"',
    year: '2024',
    series: 'Dynamic Collection',
    likes: 145,
    comments: 29,
    tags: ['dynamic', 'movement', 'bold']
  },
  {
    id: '9',
    title: 'Contemporary Design',
    designer: 'Santiago Camiro',
    description: 'A showcase of contemporary design principles. This poster embodies the cutting-edge approach to visual communication and artistic expression.',
    images: [
      'https://stuffs.nyc/wp-content/uploads/IMG_6124-scaled.jpg',
      'https://stuffs.nyc/wp-content/uploads/IMG_6124-scaled.jpg',
      'https://stuffs.nyc/wp-content/uploads/IMG_6124-scaled.jpg',
      'https://stuffs.nyc/wp-content/uploads/IMG_6124-scaled.jpg',
      'https://stuffs.nyc/wp-content/uploads/IMG_6124-scaled.jpg'
    ],
    price: '$46',
    technique: 'Metallic Ink Print',
    dimensions: '24" x 16"',
    year: '2024',
    series: 'Contemporary Collection',
    likes: 276,
    comments: 58,
    tags: ['contemporary', 'design', 'modern']
  },
  {
    id: '10',
    title: 'Artistic Fusion',
    designer: 'Santiago Camiro',
    description: 'A fusion of artistic styles and contemporary design. This poster celebrates the intersection of traditional art techniques with modern visual language.',
    images: [
      'https://stuffs.nyc/wp-content/uploads/IMG_5968-scaled.jpg',
      'https://stuffs.nyc/wp-content/uploads/IMG_5968-scaled.jpg',
      'https://stuffs.nyc/wp-content/uploads/IMG_5968-scaled.jpg',
      'https://stuffs.nyc/wp-content/uploads/IMG_5968-scaled.jpg',
      'https://stuffs.nyc/wp-content/uploads/IMG_5968-scaled.jpg'
    ],
    price: '$36',
    technique: 'Offset Print with Spot UV',
    dimensions: '18" x 12"',
    year: '2024',
    series: 'Fusion Collection',
    likes: 123,
    comments: 19,
    tags: ['fusion', 'artistic', 'contemporary']
  }
];

const mockAds = [
  {
    title: 'Custom Poster Design',
    description: 'Work with Santiago to create a custom poster for your event or brand',
    cta: 'Get Quote',
    image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=300&h=200&fit=crop'
  },
  {
    title: 'Poster Printing Services',
    description: 'High-quality printing on premium papers with fast turnaround',
    cta: 'Learn More',
    image: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=300&h=200&fit=crop'
  }
];

const INITIAL_LOAD = 6;
const LOAD_MORE = 4;

// Swipeable carousel component for poster images in modal
function PosterCarousel({ images, title }: { images: string[]; title: string }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Manual navigation functions
  const nextImage = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const prevImage = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  const goToImage = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  // Enhanced touch/swipe handling for mobile
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
    setIsDragging(true);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) {
      setIsDragging(false);
      return;
    }
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && images.length > 1) {
      nextImage();
    }
    if (isRightSwipe && images.length > 1) {
      prevImage();
    }
    
    setIsDragging(false);
  };

  // Mouse drag support for desktop
  const [mouseStart, setMouseStart] = useState<number | null>(null);
  const [mouseEnd, setMouseEnd] = useState<number | null>(null);
  const [isMouseDragging, setIsMouseDragging] = useState(false);

  const onMouseDown = (e: React.MouseEvent) => {
    setMouseEnd(null);
    setMouseStart(e.clientX);
    setIsMouseDragging(true);
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isMouseDragging) return;
    setMouseEnd(e.clientX);
  };

  const onMouseUp = () => {
    if (!mouseStart || !mouseEnd || !isMouseDragging) {
      setIsMouseDragging(false);
      return;
    }
    
    const distance = mouseStart - mouseEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && images.length > 1) {
      nextImage();
    }
    if (isRightSwipe && images.length > 1) {
      prevImage();
    }
    
    setIsMouseDragging(false);
  };

  const onMouseLeave = () => {
    setIsMouseDragging(false);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' && images.length > 1) {
        prevImage();
      } else if (e.key === 'ArrowRight' && images.length > 1) {
        nextImage();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextImage, prevImage, images.length]);

  return (
    <div className="relative group">
      <div 
        className={`relative overflow-hidden rounded-lg aspect-[2/3] bg-muted ${isDragging || isMouseDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}
      >
        {/* Image strip container */}
        <div 
          className="flex transition-transform duration-300 ease-out h-full"
          style={{
            transform: `translateX(-${currentIndex * 100}%)`,
            width: `${images.length * 100}%`
          }}
        >
          {images.map((image, index) => (
            <div key={index} className="flex-shrink-0 w-full h-full">
              <ImageWithFallback
                src={image}
                alt={`${title} - Image ${index + 1}`}
                className="w-full h-full object-cover select-none"
                draggable={false}
              />
            </div>
          ))}
        </div>
        
        {/* Navigation buttons */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-3 rounded-full transition-all duration-200 z-10 opacity-0 group-hover:opacity-100 sm:opacity-100"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-3 rounded-full transition-all duration-200 z-10 opacity-0 group-hover:opacity-100 sm:opacity-100"
              aria-label="Next image"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
        
        {/* Dots indicator */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => goToImage(index)}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${ 
                  index === currentIndex 
                    ? 'bg-white scale-110 shadow-lg' 
                    : 'bg-white/60 hover:bg-white/80'
                }`}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        )}
        
        {/* Image counter */}
        {images.length > 1 && (
          <div className="absolute top-4 right-4 bg-black/70 text-white text-sm px-3 py-1 rounded-full backdrop-blur-sm">
            {currentIndex + 1} / {images.length}
          </div>
        )}
        
        {/* Swipe indicator for mobile */}
        {images.length > 1 && (
          <div className="absolute top-4 left-4 bg-black/70 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm sm:hidden">
            Swipe
          </div>
        )}
      </div>
    </div>
  );
}

// Individual poster item component with fade-in animation
function PosterItem({ poster, isNew = false, onLike, isLiked }: {
  poster: Poster;
  isNew?: boolean;
  onLike: (id: string) => void;
  isLiked: boolean;
}) {
  const randomAd = mockAds[Math.floor(Math.random() * mockAds.length)];

  return (
    <div className={`w-full max-w-sm mx-auto ${isNew ? 'animate-in fade-in slide-in-from-bottom-4 duration-700' : ''}`}>
      <Dialog>
        <DialogTrigger asChild>
          <div className="group cursor-pointer space-y-4">
            <div className="relative overflow-hidden rounded-lg aspect-[2/3]">
              <ImageWithFallback
                src={poster.images[0]}
                alt={poster.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              
              {/* Hover overlay showing image count */}
              {poster.images.length > 1 && (
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="bg-white/90 text-black px-3 py-1 rounded-full text-sm font-medium">
                    +{poster.images.length - 1} more
                  </div>
                </div>
              )}
            </div>
            
            {/* Poster info */}
            <div className="space-y-3">
              <div>
                <h3 className="font-medium text-lg">{poster.title}</h3>
                <p className="text-muted-foreground">{poster.designer} • {poster.year}</p>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Heart 
                      className={`w-4 h-4 cursor-pointer ${isLiked ? 'fill-red-500 text-red-500' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onLike(poster.id);
                      }}
                    />
                    <span>{poster.likes + (isLiked ? 1 : 0)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle className="w-4 h-4" />
                    <span>{poster.comments}</span>
                  </div>
                  <Button variant="ghost" size="sm" className="p-0 h-auto" onClick={(e) => e.stopPropagation()}>
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
                <div className="font-medium text-green-600 dark:text-green-400">{poster.price}</div>
              </div>
              
              {isNew && (
                <Badge variant="secondary" className="text-xs bg-primary text-primary-foreground">
                  New
                </Badge>
              )}
            </div>
          </div>
        </DialogTrigger>
        <DialogContent className="w-[95vw] h-[95vh] max-w-none sm:w-[90vw] sm:h-[90vh] md:w-[85vw] md:h-[85vh] lg:w-[80vw] lg:h-[80vh] overflow-y-auto">
          <div className="space-y-6">
            <div>
              {/* Swipeable Image Carousel */}
              <div className="relative">
                <PosterCarousel images={poster.images} title={poster.title} />
              </div>
            </div>
            <div className="space-y-4">
              <DialogHeader>
                <DialogTitle>{poster.title}</DialogTitle>
                <DialogDescription>
                  Poster design by {poster.designer} - {poster.year}
                </DialogDescription>
              </DialogHeader>
              
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Heart 
                    className={`w-4 h-4 cursor-pointer ${isLiked ? 'fill-red-500 text-red-500' : ''}`}
                    onClick={() => onLike(poster.id)}
                  />
                  <span>{poster.likes + (isLiked ? 1 : 0)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageCircle className="w-4 h-4" />
                  <span>{poster.comments}</span>
                </div>
                <Button variant="ghost" size="sm" className="p-0 h-auto">
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-green-600 dark:text-green-400" />
                  <span className="font-medium text-green-600 dark:text-green-400">{poster.price}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{poster.year}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{poster.series}</span>
                </div>
              </div>

              <div>
                <h4 className="mb-2">Description</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{poster.description}</p>
              </div>

              <div>
                <h4 className="mb-2">Details</h4>
                <div className="text-sm space-y-1">
                  <p><span className="font-medium">Technique:</span> {poster.technique}</p>
                  <p><span className="font-medium">Dimensions:</span> {poster.dimensions}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {poster.tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    #{tag}
                  </Badge>
                ))}
              </div>

              <div className="flex gap-2">
                <Button className="flex-1">Purchase Print</Button>
                <Button variant="outline" className="flex-1">Add to Cart</Button>
              </div>

              {/* Shopify Collection Mockup Section */}
              <div className="mt-8 p-6 bg-card border border-border rounded-lg">
                <div className="mb-4">
                  <h4 className="mb-2">Complete the Collection</h4>
                  <p className="text-sm text-muted-foreground">Discover more designs from the {poster.series}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="group cursor-pointer">
                    <div className="relative overflow-hidden rounded-lg aspect-[2/3] bg-muted mb-2">
                      <ImageWithFallback
                        src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=450&fit=crop"
                        alt="Related Poster 1"
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute top-2 left-2">
                        <Badge variant="secondary" className="text-xs bg-primary text-primary-foreground">
                          New
                        </Badge>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <h5 className="text-sm font-medium line-clamp-1">Urban Architecture</h5>
                      <p className="text-xs text-muted-foreground">Santiago Camiro • 2024</p>
                      <p className="text-sm font-medium text-green-600 dark:text-green-400">$42</p>
                    </div>
                  </div>
                  
                  <div className="group cursor-pointer">
                    <div className="relative overflow-hidden rounded-lg aspect-[2/3] bg-muted mb-2">
                      <ImageWithFallback
                        src="https://images.unsplash.com/photo-1557804506-669a67965ba0?w=300&h=450&fit=crop"
                        alt="Related Poster 2"
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute top-2 left-2">
                        <Badge variant="outline" className="text-xs bg-background/80">
                          Best Seller
                        </Badge>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <h5 className="text-sm font-medium line-clamp-1">City Dreamscape</h5>
                      <p className="text-xs text-muted-foreground">Santiago Camiro • 2024</p>
                      <p className="text-sm font-medium text-green-600 dark:text-green-400">$38</p>
                    </div>
                  </div>
                  
                  <div className="group cursor-pointer">
                    <div className="relative overflow-hidden rounded-lg aspect-[2/3] bg-muted mb-2">
                      <ImageWithFallback
                        src="https://images.unsplash.com/photo-1541753866388-0b3c701627d3?w=300&h=450&fit=crop"
                        alt="Related Poster 3"
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <div className="space-y-1">
                      <h5 className="text-sm font-medium line-clamp-1">Geometric Forms</h5>
                      <p className="text-xs text-muted-foreground">Santiago Camiro • 2023</p>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-green-600 dark:text-green-400">$35</p>
                        <p className="text-xs text-muted-foreground line-through">$45</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="group cursor-pointer">
                    <div className="relative overflow-hidden rounded-lg aspect-[2/3] bg-muted mb-2">
                      <ImageWithFallback
                        src="https://images.unsplash.com/photo-1551732998-cac4b1c5b9b5?w=300&h=450&fit=crop"
                        alt="Related Poster 4"
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="bg-white/90 text-black px-2 py-1 rounded text-xs font-medium">
                          Quick View
                        </div>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <h5 className="text-sm font-medium line-clamp-1">Abstract Motion</h5>
                      <p className="text-xs text-muted-foreground">Santiago Camiro • 2024</p>
                      <p className="text-sm font-medium text-green-600 dark:text-green-400">$48</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-border">
                  <Button variant="outline" className="w-full text-sm">
                    View All in {poster.series}
                  </Button>
                </div>
              </div>

              {/* Ad Section */}
              <div className="mt-6 p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-3">
                  <ImageWithFallback
                    src={randomAd.image}
                    alt={randomAd.title}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h5 className="font-medium text-sm">{randomAd.title}</h5>
                    <p className="text-xs text-muted-foreground mb-2">{randomAd.description}</p>
                    <Button size="sm" variant="outline" className="text-xs">
                      {randomAd.cta}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Load more trigger component
function LoadMoreTrigger({ onLoadMore, loading, hasMore }: {
  onLoadMore: () => void;
  loading: boolean;
  hasMore: boolean;
}) {
  return (
    <div className="mt-16 mb-8 flex flex-col items-center space-y-4">
      {hasMore ? (
        <>
          <div 
            className="flex flex-col items-center space-y-3 p-6 rounded-lg border-2 border-dashed border-muted-foreground/30 hover:border-primary/50 transition-colors cursor-pointer group"
            onClick={onLoadMore}
          >
            {loading ? (
              <>
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <div className="text-center">
                  <p className="font-medium text-primary">Loading more posters...</p>
                  <p className="text-sm text-muted-foreground">Discovering new designs for you</p>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center space-x-2 text-primary group-hover:scale-105 transition-transform">
                  <Eye className="w-6 h-6" />
                  <ChevronDown className="w-5 h-5 animate-bounce" />
                </div>
                <div className="text-center">
                  <p className="font-medium text-primary group-hover:underline">Load more posters</p>
                  <p className="text-sm text-muted-foreground">Scroll down or click to see more</p>
                </div>
              </>
            )}
          </div>
          <div className="w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        </>
      ) : (
        <div className="text-center py-8">
          <div className="mb-4">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <Eye className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-medium mb-2">You've seen them all!</h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              You've reached the end of Santiago's complete poster collection. 
              All {allPosters.length} unique designs are now visible.
            </p>
          </div>
          <div className="w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        </div>
      )}
    </div>
  );
}

export function ArtGallery() {
  const [displayedPosters, setDisplayedPosters] = useState<Poster[]>([]);
  const [likedPosters, setLikedPosters] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [newlyLoadedIds, setNewlyLoadedIds] = useState<Set<string>>(new Set());
  const loadingRef = useRef<HTMLDivElement>(null);

  // Initialize with first items
  useEffect(() => {
    setDisplayedPosters(allPosters.slice(0, INITIAL_LOAD));
  }, []);

  // Load more items
  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    
    setLoading(true);
    
    // Simulate loading delay for better UX
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const currentLength = displayedPosters.length;
    const nextItems = allPosters.slice(currentLength, currentLength + LOAD_MORE);
    
    if (nextItems.length === 0) {
      setHasMore(false);
    } else {
      // Mark new items for animation
      const newIds = new Set(nextItems.map(item => item.id));
      setNewlyLoadedIds(newIds);
      
      setDisplayedPosters(prev => [...prev, ...nextItems]);
      
      // Clear new item markers after animation
      setTimeout(() => {
        setNewlyLoadedIds(new Set());
      }, 1000);
    }
    
    setLoading(false);
  }, [displayedPosters.length, loading, hasMore]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && hasMore && !loading) {
          loadMore();
        }
      },
      {
        threshold: 0.3,
        rootMargin: '100px',
      }
    );

    if (loadingRef.current) {
      observer.observe(loadingRef.current);
    }

    return () => {
      if (loadingRef.current) {
        observer.unobserve(loadingRef.current);
      }
    };
  }, [loadMore, hasMore, loading]);

  const handleLike = (posterId: string) => {
    setLikedPosters(prev => {
      const newSet = new Set(prev);
      if (newSet.has(posterId)) {
        newSet.delete(posterId);
      } else {
        newSet.add(posterId);
      }
      return newSet;
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Responsive Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {displayedPosters.map((poster) => (
          <PosterItem
            key={poster.id}
            poster={poster}
            isNew={newlyLoadedIds.has(poster.id)}
            onLike={handleLike}
            isLiked={likedPosters.has(poster.id)}
          />
        ))}
      </div>

      {/* Load More Trigger - Intersection Observer Target */}
      <div ref={loadingRef}>
        <LoadMoreTrigger
          onLoadMore={loadMore}
          loading={loading}
          hasMore={hasMore}
        />
      </div>
    </div>
  );
}