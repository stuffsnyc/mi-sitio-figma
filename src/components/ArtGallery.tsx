import { useState, useEffect, useCallback, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Heart, MessageCircle, MapPin, Calendar, Loader2, ChevronDown, ChevronLeft, ChevronRight, ShoppingCart, Zap, Search } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface Product {
  id: string;
  title: string;
  price: string;
  originalPrice?: string;
  image: string;
  creationDate: string;
  location: string;
  description: string;
  materials: string[];
  hashtags: string[];
  sizes: string[];
  variations: { name: string; options: string[] }[];
  stockNumber: string;
  stockQuantity: number;
  inStock: boolean;
  badge?: string;
}

interface PosterCollection {
  id: string;
  title: string;
  designer: string;
  description: string;
  mainImage: string;
  price: string;
  technique: string;
  dimensions: string;
  year: string;
  series: string;
  likes: number;
  comments: number;
  tags: string[];
  products: Product[];
}

const allPosters: PosterCollection[] = [
  {
    id: '1',
    title: 'Abstract Harmony Collection',
    designer: 'Santiago Camiro',
    description: 'A vibrant exploration of color and form, this collection embodies the essence of contemporary abstract design.',
    mainImage: 'https://stuffs.nyc/wp-content/uploads/IMG_6131-scaled.jpg',
    price: '$45',
    technique: 'Digital Print on Premium Paper',
    dimensions: '18" x 12"',
    year: '2024',
    series: 'Abstract Collection',
    likes: 189,
    comments: 34,
    tags: ['abstract', 'geometric', 'contemporary'],
    products: [
      {
        id: 'p1-1',
        title: 'Abstract Harmony Print',
        price: '$45',
        originalPrice: '$65',
        image: 'https://stuffs.nyc/wp-content/uploads/IMG_6131-scaled.jpg',
        creationDate: 'March 2024',
        location: 'New York, NY',
        description: 'A stunning abstract composition featuring bold geometric patterns that intersect with organic shapes to create visual rhythm and movement.',
        materials: ['Premium Cotton Paper', 'Archival Inks', 'UV Protective Coating'],
        hashtags: ['abstract', 'geometric', 'modern', 'artwork'],
        sizes: ['A4 (8×12")', 'A3 (12×16")', 'A2 (16×24")'],
        variations: [
          { name: 'Frame', options: ['Black Frame', 'White Frame', 'Natural Wood', 'No Frame'] },
          { name: 'Finish', options: ['Matte', 'Glossy', 'Satin'] }
        ],
        stockNumber: 'AH-001',
        stockQuantity: 24,
        inStock: true,
        badge: 'Best Seller'
      },
      {
        id: 'p1-2',
        title: 'Geometric Rhythms',
        price: '$38',
        image: 'https://stuffs.nyc/wp-content/uploads/20250815_131722_bded153f-scaled.jpg',
        creationDate: 'February 2024',
        location: 'Brooklyn, NY',
        description: 'Exploring the intersection of geometry and organic forms through vibrant color palettes and dynamic compositions.',
        materials: ['Fine Art Paper', 'Giclée Print', 'Museum Quality'],
        hashtags: ['geometric', 'vibrant', 'rhythm', 'design'],
        sizes: ['A4 (8×12")', 'A3 (12×16")', 'A1 (24×32")'],
        variations: [
          { name: 'Frame', options: ['Black Frame', 'White Frame', 'No Frame'] },
          { name: 'Edition', options: ['Standard', 'Artist Signed'] }
        ],
        stockNumber: 'GR-002',
        stockQuantity: 18,
        inStock: true
      },
      {
        id: 'p1-3',
        title: 'Color Flow Study',
        price: '$52',
        image: 'https://stuffs.nyc/wp-content/uploads/IMG_5965-scaled.jpg',
        creationDate: 'April 2024',
        location: 'Manhattan, NY',
        description: 'A mesmerizing study of color transitions and flow patterns that captures the essence of contemporary abstract expression.',
        materials: ['Canvas Print', 'Acrylic Finish', 'Gallery Wrapped'],
        hashtags: ['colorful', 'flow', 'study', 'contemporary'],
        sizes: ['A3 (12×16")', 'A2 (16×24")', 'A1 (24×32")'],
        variations: [
          { name: 'Mount', options: ['Canvas Stretch', 'Gallery Wrap', 'Float Mount'] },
          { name: 'Finish', options: ['Matte', 'Semi-Gloss'] }
        ],
        stockNumber: 'CFS-003',
        stockQuantity: 12,
        inStock: true,
        badge: 'Limited Edition'
      }
    ]
  },
  {
    id: '2',
    title: 'Urban Composition Series',
    designer: 'Santiago Camiro',
    description: 'Dynamic patterns that pulse with the energy of city life.',
    mainImage: 'https://stuffs.nyc/wp-content/uploads/20250815_131722_bded153f-scaled.jpg',
    price: '$38',
    technique: 'Screen Print on Cotton Paper',
    dimensions: '24" x 16"',
    year: '2024',
    series: 'Urban Series',
    likes: 156,
    comments: 28,
    tags: ['urban', 'modern', 'architectural'],
    products: [
      {
        id: 'p2-1',
        title: 'City Pulse',
        price: '$38',
        image: 'https://stuffs.nyc/wp-content/uploads/20250815_131722_bded153f-scaled.jpg',
        creationDate: 'June 2024',
        location: 'Manhattan, NY',
        description: 'Capturing the rhythmic pulse of urban life through dynamic visual patterns and energetic compositions.',
        materials: ['Cotton Paper', 'Screen Print', 'Water-based Inks'],
        hashtags: ['urban', 'pulse', 'energy', 'dynamic'],
        sizes: ['A4 (8×12")', 'A3 (12×16")'],
        variations: [
          { name: 'Color Scheme', options: ['Original', 'Black & White', 'Sepia'] },
          { name: 'Frame', options: ['Black Frame', 'Silver Frame', 'No Frame'] }
        ],
        stockNumber: 'CP-004',
        stockQuantity: 31,
        inStock: true,
        badge: 'New'
      },
      {
        id: 'p2-2',
        title: 'Metropolitan Grid',
        price: '$44',
        image: 'https://stuffs.nyc/wp-content/uploads/20250815_132924_ce9c800c-scaled.jpg',
        creationDate: 'July 2024',
        location: 'Brooklyn, NY',
        description: 'An architectural interpretation of city grids and urban planning through modern artistic expression.',
        materials: ['Recycled Paper', 'Digital Print', 'Matte Finish'],
        hashtags: ['metropolitan', 'grid', 'architecture', 'planning'],
        sizes: ['A3 (12×16")', 'A2 (16×24")'],
        variations: [
          { name: 'Paper', options: ['Recycled White', 'Recycled Cream', 'Standard White'] },
          { name: 'Frame', options: ['Bamboo Frame', 'Metal Frame', 'No Frame'] }
        ],
        stockNumber: 'MG-005',
        stockQuantity: 22,
        inStock: true
      }
    ]
  },
  {
    id: '3',
    title: 'Color Symphony Collection',
    designer: 'Santiago Camiro',
    description: 'A harmonious blend of vibrant colors and flowing forms.',
    mainImage: 'https://stuffs.nyc/wp-content/uploads/IMG_5965-scaled.jpg',
    price: '$42',
    technique: 'Eco-Friendly Soy Ink Print',
    dimensions: '20" x 13.3"',
    year: '2024',
    series: 'Color Collection',
    likes: 234,
    comments: 45,
    tags: ['colorful', 'vibrant', 'expressive'],
    products: [
      {
        id: 'p3-1',
        title: 'Vibrant Flow',
        price: '$42',
        image: 'https://stuffs.nyc/wp-content/uploads/IMG_5965-scaled.jpg',
        creationDate: 'March 2024',
        location: 'Chelsea, NY',
        description: 'A celebration of color in motion, where vibrant hues flow and dance across the canvas in perfect harmony.',
        materials: ['Eco Paper', 'Soy-based Inks', 'Biodegradable Finish'],
        hashtags: ['vibrant', 'flow', 'color', 'harmony'],
        sizes: ['A4 (8×12")', 'A3 (12×16")', 'A2 (16×24")'],
        variations: [
          { name: 'Eco-Level', options: ['Standard Eco', 'Premium Eco', 'Carbon Neutral'] },
          { name: 'Frame', options: ['Sustainable Wood', 'Recycled Metal', 'No Frame'] }
        ],
        stockNumber: 'VF-006',
        stockQuantity: 15,
        inStock: true,
        badge: 'Eco-Friendly'
      }
    ]
  }
];

const INITIAL_LOAD = 6;
const LOAD_MORE = 4;

// Horizontal Product Carousel Component
function ProductCarousel({ products }: { products: Product[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({});
  const [selectedVariations, setSelectedVariations] = useState<Record<string, Record<string, string>>>({});
  const [isMobile, setIsMobile] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isZoomModalOpen, setIsZoomModalOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const startTimeRef = useRef<number>(0);
  const startPositionRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  const nextProduct = useCallback(() => {
    if (currentIndex < products.length - 1 && !isTransitioning) {
      setIsTransitioning(true);
      setCurrentIndex(currentIndex + 1);
      // Reset scroll position when changing products
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop = 0;
      }
      setTimeout(() => setIsTransitioning(false), 300);
    }
  }, [currentIndex, products.length, isTransitioning]);

  const prevProduct = useCallback(() => {
    if (currentIndex > 0 && !isTransitioning) {
      setIsTransitioning(true);
      setCurrentIndex(currentIndex - 1);
      // Reset scroll position when changing products
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop = 0;
      }
      setTimeout(() => setIsTransitioning(false), 300);
    }
  }, [currentIndex, isTransitioning]);

  const goToProduct = useCallback((index: number) => {
    if (index !== currentIndex && index >= 0 && index < products.length && !isTransitioning) {
      setIsTransitioning(true);
      setCurrentIndex(index);
      // Reset scroll position when changing products
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop = 0;
      }
      setTimeout(() => setIsTransitioning(false), 300);
    }
  }, [currentIndex, products.length, isTransitioning]);

  // Touch and mouse event handlers
  const handleStart = useCallback((clientX: number, clientY: number) => {
    if (products.length <= 1) return;
    
    setIsDragging(true);
    setDragStart(clientX);
    setDragOffset(0);
    startTimeRef.current = Date.now();
    startPositionRef.current = { x: clientX, y: clientY };
  }, [products.length]);

  const handleMove = useCallback((clientX: number, clientY: number) => {
    if (!isDragging || products.length <= 1) return;

    const deltaX = clientX - dragStart;
    const deltaY = clientY - startPositionRef.current.y;
    
    // Prevent vertical scrolling when dragging horizontally
    if (Math.abs(deltaX) > Math.abs(deltaY) * 2) {
      const maxDrag = containerRef.current?.offsetWidth || 300;
      const constrainedDelta = Math.max(-maxDrag, Math.min(maxDrag, deltaX));
      setDragOffset(constrainedDelta);
    }
  }, [isDragging, dragStart, products.length]);

  const handleEnd = useCallback(() => {
    if (!isDragging || products.length <= 1) return;

    const threshold = 50; // Minimum drag distance to trigger change
    const velocity = Math.abs(dragOffset) / (Date.now() - startTimeRef.current);
    const shouldChange = Math.abs(dragOffset) > threshold || velocity > 0.3;

    if (shouldChange) {
      if (dragOffset > 0 && currentIndex > 0) {
        prevProduct();
      } else if (dragOffset < 0 && currentIndex < products.length - 1) {
        nextProduct();
      }
    }

    setIsDragging(false);
    setDragOffset(0);
  }, [isDragging, dragOffset, currentIndex, products.length, prevProduct, nextProduct]);

  // Mouse events
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    handleStart(e.clientX, e.clientY);
  }, [handleStart]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    handleMove(e.clientX, e.clientY);
  }, [handleMove]);

  const handleMouseUp = useCallback(() => {
    handleEnd();
  }, [handleEnd]);

  // Touch events
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    handleStart(touch.clientX, touch.clientY);
  }, [handleStart]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    handleMove(touch.clientX, touch.clientY);
  }, [handleMove]);

  const handleTouchEnd = useCallback(() => {
    handleEnd();
  }, [handleEnd]);

  // Add global mouse event listeners
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const handleSizeSelect = (productId: string, size: string) => {
    setSelectedSizes(prev => ({
      ...prev,
      [productId]: size
    }));
  };

  const handleVariationSelect = (productId: string, variationName: string, option: string) => {
    setSelectedVariations(prev => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        [variationName]: option
      }
    }));
  };

  const product = products[currentIndex];

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Scrollable Container */}
      <div 
        ref={scrollContainerRef}
        className="w-full h-full overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent scroll-smooth"
      >
        <div 
          ref={containerRef}
          className="w-full min-h-full p-2 sm:p-4 md:p-6 select-none"
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{
            transform: isDragging ? `translateX(${dragOffset * 0.3}px)` : 'none',
            transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            cursor: isDragging ? 'grabbing' : 'grab'
          }}
        >
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col gap-4 sm:gap-6 md:gap-8">
              {/* Product Image Section */}
              <div className="flex items-center justify-center">
                <div className="relative group w-full max-w-xs sm:max-w-sm md:max-w-md aspect-[2/3]">
                  <div className="relative w-full h-full rounded-lg overflow-hidden bg-muted">
                    <ImageWithFallback
                      src={product.image}
                      alt={product.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 select-none"
                      draggable={false}
                    />
                    
                    {/* Product Badge */}
                    {product.badge && (
                      <div className="absolute top-2 left-2 sm:top-4 sm:left-4">
                        <Badge 
                          variant={product.badge === 'Sale' ? 'destructive' : 'secondary'}
                          className={`text-xs ${
                            product.badge === 'Best Seller' ? 'bg-yellow-500 text-yellow-900' :
                            product.badge === 'Limited Edition' ? 'bg-purple-500 text-white' :
                            product.badge === 'New' ? 'bg-green-500 text-white' :
                            product.badge === 'Eco-Friendly' ? 'bg-green-600 text-white' :
                            ''
                          }`}
                        >
                          {product.badge}
                        </Badge>
                      </div>
                    )}

                    {/* Stock Status */}
                    {!product.inStock && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <div className="bg-white/90 text-black px-3 py-2 sm:px-4 sm:py-2 rounded-lg font-medium text-sm">
                          Sold Out
                        </div>
                      </div>
                    )}

                    {/* Drag hint overlay */}
                    {products.length > 1 && !isDragging && (
                      <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                        <div className="bg-white/90 text-black px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
                          <ChevronLeft className="w-4 h-4" />
                          <span>Swipe</span>
                          <ChevronRight className="w-4 h-4" />
                        </div>
                      </div>
                    )}

                    {/* Magnifying glass zoom button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsZoomModalOpen(true);
                      }}
                      className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4 bg-black/70 hover:bg-black/90 text-white p-2 sm:p-3 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100 hover:scale-110 animate-pulse-gentle z-20"
                      aria-label="Zoom image"
                    >
                      <Search className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Product Details Section - Fully Scrollable */}
              <div className="flex flex-col space-y-4 sm:space-y-6 px-1 sm:px-2">
                {/* Header */}
                <div className="text-center">
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-medium mb-2">{product.title}</h3>
                  <div className="flex items-center justify-center gap-3 sm:gap-4 text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span>{product.creationDate}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span>{product.location}</span>
                    </div>
                  </div>
                  
                  {/* Price */}
                  <div className="flex items-center justify-center gap-2 mb-3 sm:mb-4">
                    <span className="text-2xl sm:text-3xl md:text-4xl font-medium text-primary">{product.price}</span>
                    {product.originalPrice && (
                      <span className="text-lg sm:text-xl text-muted-foreground line-through">{product.originalPrice}</span>
                    )}
                  </div>

                  {/* Stock Information */}
                  <div className="flex items-center justify-center gap-3 sm:gap-4 text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
                    <div className="flex items-center gap-1">
                      <span>Stock #:</span>
                      <span className="font-mono">{product.stockNumber}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>{product.stockQuantity} in stock</span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h4 className="font-medium mb-2 text-center text-sm sm:text-base">Description</h4>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed text-center">{product.description}</p>
                </div>

                {/* Materials */}
                <div>
                  <h4 className="font-medium mb-2 text-center text-sm sm:text-base">Materials</h4>
                  <div className="flex flex-wrap gap-1 sm:gap-2 justify-center">
                    {product.materials.map((material, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {material}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Variations Selection */}
                {product.variations.map((variation) => (
                  <div key={variation.name}>
                    <h4 className="font-medium mb-2 sm:mb-3 text-center text-sm sm:text-base">Select {variation.name}</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-xs sm:max-w-md mx-auto">
                      {variation.options.map((option) => (
                        <button
                          key={option}
                          onClick={() => handleVariationSelect(product.id, variation.name, option)}
                          className={`p-2 sm:p-3 text-xs sm:text-sm border rounded-lg transition-colors text-center ${
                            selectedVariations[product.id]?.[variation.name] === option
                              ? 'border-primary bg-primary/5 text-primary'
                              : 'border-border hover:border-primary/50'
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}

                {/* Size Selection */}
                <div>
                  <h4 className="font-medium mb-2 sm:mb-3 text-center text-sm sm:text-base">Choose Size</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-xs sm:max-w-md mx-auto">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => handleSizeSelect(product.id, size)}
                        className={`p-2 sm:p-3 text-xs sm:text-sm border rounded-lg transition-colors text-center ${
                          selectedSizes[product.id] === size
                            ? 'border-primary bg-primary/5 text-primary'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                  
                  {/* Size Chart Link */}
                  <div className="text-center mt-2 sm:mt-3">
                    <button className="text-xs sm:text-sm text-primary hover:underline">
                      Size Chart
                    </button>
                  </div>
                </div>

                {/* Hashtags */}
                <div>
                  <h4 className="font-medium mb-2 text-center text-sm sm:text-base">Tags</h4>
                  <div className="flex flex-wrap gap-1 sm:gap-2 justify-center">
                    {product.hashtags.map((tag, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Payment Info */}
                <div className="text-center py-3 sm:py-4 px-3 sm:px-4 bg-muted/30 rounded-lg max-w-xs sm:max-w-md mx-auto">
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    💳 Pay in 2 interest-free installments
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2 sm:space-y-3 pt-3 sm:pt-4 max-w-xs sm:max-w-md mx-auto w-full py-3 sm:py-4 mb-16">
                  <Button 
                    size={isMobile ? "default" : "lg"}
                    className="w-full text-sm"
                    disabled={!product.inStock}
                  >
                    <Zap className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                    Buy Now
                  </Button>
                  <Button 
                    variant="outline" 
                    size={isMobile ? "default" : "lg"}
                    className="w-full text-sm"
                    disabled={!product.inStock}
                  >
                    <ShoppingCart className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                    Add to Cart
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      {products.length > 1 && (
        <>
          <button
            onClick={prevProduct}
            disabled={currentIndex === 0 || isDragging}
            className={`absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-2 sm:p-3 rounded-full transition-all duration-200 z-10 ${
              currentIndex === 0 || isDragging
                ? 'opacity-30 cursor-not-allowed' 
                : 'opacity-80 hover:opacity-100 animate-pulse-gentle'
            }`}
            aria-label="Previous product"
          >
            <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6" />
          </button>
          <button
            onClick={nextProduct}
            disabled={currentIndex === products.length - 1 || isDragging}
            className={`absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-2 sm:p-3 rounded-full transition-all duration-200 z-10 ${
              currentIndex === products.length - 1 || isDragging
                ? 'opacity-30 cursor-not-allowed' 
                : 'opacity-80 hover:opacity-100 animate-pulse-gentle'
            }`}
            aria-label="Next product"
          >
            <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6" />
          </button>
        </>
      )}

      {/* Product Counter and Dots */}
      {products.length > 1 && (
        <>
          {/* Counter */}
          <div className="absolute top-3 sm:top-6 right-3 sm:right-6 bg-black/70 text-white text-xs sm:text-sm px-2 sm:px-3 py-1 rounded-full backdrop-blur-sm z-10">
            {currentIndex + 1} / {products.length}
          </div>
          
          {/* Dots indicator */}
          <div className="absolute bottom-3 sm:bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {products.map((_, index) => (
              <button
                key={index}
                onClick={() => goToProduct(index)}
                disabled={isDragging}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  index === currentIndex 
                    ? 'bg-white scale-125' 
                    : 'bg-white/50 hover:bg-white/75'
                } ${isDragging ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                aria-label={`Go to product ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}

      {/* Zoom Modal */}
      {isZoomModalOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4" 
          onClick={() => setIsZoomModalOpen(false)}
        >
          <div 
            className="relative max-w-5xl max-h-full w-full h-full flex items-center justify-center" 
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setIsZoomModalOpen(false)}
              className="absolute top-4 right-4 bg-black/70 hover:bg-black/90 text-white p-3 rounded-full transition-colors z-10 hover:scale-110"
              aria-label="Close zoom"
            >
              <span className="text-xl">✕</span>
            </button>
            
            {/* Zoomed Image */}
            <div className="relative w-full h-full max-w-4xl max-h-[85vh] flex items-center justify-center">
              <ImageWithFallback
                src={product.image}
                alt={product.title}
                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                draggable={false}
              />
              
              {/* Image info overlay */}
              <div className="absolute bottom-4 left-4 right-4 bg-black/80 text-white p-4 rounded-lg backdrop-blur-sm">
                <h4 className="font-medium mb-1 text-lg">{product.title}</h4>
                <p className="text-sm text-white/90 mb-2">{product.description}</p>
                <div className="flex items-center gap-4 text-xs text-white/80">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{product.creationDate}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    <span>{product.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="font-medium text-primary">{product.price}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Individual poster item component with fade-in animation
function PosterItem({ poster, isNew = false, onLike, isLiked }: {
  poster: PosterCollection;
  isNew?: boolean;
  onLike: (id: string) => void;
  isLiked: boolean;
}) {
  return (
    <div className={`w-full max-w-sm mx-auto ${isNew ? 'animate-in fade-in slide-in-from-bottom-4 duration-700' : ''}`}>
      <Dialog>
        <DialogTrigger asChild>
          <div className="group cursor-pointer space-y-4">
            <div className="relative overflow-hidden rounded-lg aspect-[2/3]">
              <ImageWithFallback
                src={poster.mainImage}
                alt={poster.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              
              {/* Hover overlay showing product count */}
              {poster.products.length > 1 && (
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="bg-white/90 text-black px-3 py-1 rounded-full text-sm font-medium">
                    {poster.products.length} Products
                  </div>
                </div>
              )}
            </div>
            
            {/* Poster Info */}
            <div className="space-y-2">
              <div className="flex items-start justify-between">
                <div className="min-w-0 flex-1">
                  <h3 className="font-medium text-sm truncate">{poster.title}</h3>
                </div>
              </div>
            </div>
          </div>
        </DialogTrigger>
        
        {/* Enhanced Scrollable Dialog */}
        <DialogContent className="max-w-6xl w-full h-[90vh] p-0 overflow-hidden">
          <div className="h-full flex flex-col overflow-hidden">
            {/* Header with Collection Info - Fixed */}
            <DialogHeader className="px-4 sm:px-6 py-4 border-b bg-background/95 backdrop-blur-sm flex-shrink-0">
              <div className="flex items-start">
                <div>
                  <DialogTitle className="text-lg sm:text-xl md:text-2xl font-medium leading-tight">{poster.title}</DialogTitle>
                </div>

              </div>
            </DialogHeader>
            
            {/* Products Carousel - Fully Scrollable */}
            <div className="flex-1 overflow-hidden">
              <ProductCarousel products={poster.products} />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export function ArtGallery() {
  const [displayedPosters, setDisplayedPosters] = useState<PosterCollection[]>(allPosters.slice(0, INITIAL_LOAD));
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(allPosters.length > INITIAL_LOAD);
  const [likedPosters, setLikedPosters] = useState<Set<string>>(new Set());

  const loadMorePosters = useCallback(() => {
    if (loading || !hasMore) return;

    setLoading(true);

    // Simulate loading delay
    setTimeout(() => {
      const nextIndex = displayedPosters.length;
      const nextPosters = allPosters.slice(nextIndex, nextIndex + LOAD_MORE);
      
      setDisplayedPosters(prev => [...prev, ...nextPosters]);
      setHasMore(nextIndex + LOAD_MORE < allPosters.length);
      setLoading(false);
    }, 1000);
  }, [displayedPosters.length, loading, hasMore]);

  const handleLike = (id: string) => {
    setLikedPosters(prev => {
      const newLiked = new Set(prev);
      if (newLiked.has(id)) {
        newLiked.delete(id);
      } else {
        newLiked.add(id);
      }
      return newLiked;
    });
  };

  // Infinite scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 1000) {
        loadMorePosters();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadMorePosters]);

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {displayedPosters.map((poster, index) => (
            <PosterItem
              key={poster.id}
              poster={poster}
              isNew={index >= INITIAL_LOAD}
              onLike={handleLike}
              isLiked={likedPosters.has(poster.id)}
            />
          ))}
        </div>

        {/* Loading indicator */}
        {loading && (
          <div className="flex justify-center items-center py-8">
            <div className="flex items-center gap-3 text-muted-foreground animate-pulse-slow">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-sm">Loading more posters...</span>
            </div>
          </div>
        )}

        {/* Load more button (fallback for manual loading) */}
        {!loading && hasMore && (
          <div className="flex justify-center py-8">
            <Button 
              onClick={loadMorePosters}
              variant="outline"
              className="flex items-center gap-2"
            >
              <ChevronDown className="w-4 h-4" />
              Load More
            </Button>
          </div>
        )}

        {/* End of content indicator */}
        {!hasMore && displayedPosters.length > INITIAL_LOAD && (
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-sm">You've seen all the latest posters</p>
          </div>
        )}
      </div>
    </div>
  );
}
