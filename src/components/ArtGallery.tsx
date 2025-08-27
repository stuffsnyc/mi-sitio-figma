import { useState, useEffect, useCallback, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Heart, MessageCircle, MapPin, Calendar, Loader2, ChevronDown, ChevronLeft, ChevronRight, ShoppingCart, Zap, Search } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

// Configuración de Shopify
const SHOPIFY_STORE = 'tndztv-yx';
const SHOPIFY_ACCESS_TOKEN = '64aab96a1d4aaa428d04fb9d6519a916';
const TARGET_CATEGORY = 'posters';

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

// Función para obtener productos de Shopify
async function fetchProductsFromShopify() {
  try {
    const query = `
    {
      collectionByHandle(handle: "${TARGET_CATEGORY}") {
        title
        products(first: 20) {
          edges {
            node {
              id
              title
              description
              createdAt
              variants(first: 10) {
                edges {
                  node {
                    price
                    compareAtPrice
                    sku
                    inventoryQuantity
                    availableForSale
                  }
                }
              }
              images(first: 1) {
                edges {
                  node {
                    url
                    altText
                  }
                }
              }
              tags
              vendor
            }
          }
        }
      }
    }
    `;
    
    const response = await fetch(`https://${SHOPIFY_STORE}.myshopify.com/api/2023-04/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': SHOPIFY_ACCESS_TOKEN
      },
      body: JSON.stringify({ query })
    });
    
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.errors) {
      throw new Error(data.errors[0].message);
    }
    
    // Procesar los productos de Shopify
    const products = data.data.collectionByHandle.products.edges.map((edge: any) => {
      const product = edge.node;
      const variant = product.variants.edges[0]?.node;
      
      return {
        id: product.id,
        title: product.title,
        price: `$${variant?.price || '0'}`,
        originalPrice: variant?.compareAtPrice ? `$${variant.compareAtPrice}` : undefined,
        image: product.images.edges[0]?.node.url || 'https://via.placeholder.com/300',
        creationDate: new Date(product.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
        location: 'New York, NY', // Valor por defecto
        description: product.description || 'No description available',
        materials: ['Premium Paper', 'Archival Inks'], // Valores por defecto
        hashtags: product.tags || [],
        sizes: ['A4 (8×12")', 'A3 (12×16")', 'A2 (16×24")'], // Valores por defecto
        variations: [
          { name: 'Frame', options: ['Black Frame', 'White Frame', 'Natural Wood', 'No Frame'] },
          { name: 'Finish', options: ['Matte', 'Glossy', 'Satin'] }
        ],
        stockNumber: variant?.sku || 'N/A',
        stockQuantity: variant?.inventoryQuantity || 0,
        inStock: variant?.availableForSale || false
      };
    });
    
    return products;
  } catch (error) {
    console.error('Error fetching products from Shopify:', error);
    return [];
  }
}

// Función para agrupar productos por colección
function groupProductsIntoCollections(products: Product[]): PosterCollection[] {
  // Aquí puedes implementar tu lógica para agrupar productos
  // Por ahora, simplemente creamos una colección por producto
  return products.map((product, index) => ({
    id: `collection-${index}`,
    title: product.title,
    designer: 'Santiago Camiro', // Valor por defecto
    description: product.description,
    mainImage: product.image,
    price: product.price,
    technique: 'Digital Print', // Valor por defecto
    dimensions: '18" x 12"', // Valor por defecto
    year: new Date().getFullYear().toString(),
    series: 'Abstract Collection', // Valor por defecto
    likes: Math.floor(Math.random() * 100),
    comments: Math.floor(Math.random() * 30),
    tags: product.hashtags,
    products: [product] // Cada colección tiene solo su producto principal
  }));
}

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
  const [displayedPosters, setDisplayedPosters] = useState<PosterCollection[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(false);
  const [likedPosters, setLikedPosters] = useState<Set<string>>(new Set());

  // Cargar productos de Shopify al montar el componente
  useEffect(() => {
    async function loadShopifyProducts() {
      setLoading(true);
      try {
        const products = await fetchProductsFromShopify();
        const collections = groupProductsIntoCollections(products);
        
        setDisplayedPosters(collections.slice(0, INITIAL_LOAD));
        setHasMore(collections.length > INITIAL_LOAD);
      } catch (error) {
        console.error('Error loading Shopify products:', error);
        // En caso de error, usar datos de ejemplo
        setDisplayedPosters(allPosters.slice(0, INITIAL_LOAD));
        setHasMore(allPosters.length > INITIAL_LOAD);
      } finally {
        setLoading(false);
      }
    }
    
    loadShopifyProducts();
  }, []);

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

  if (loading && displayedPosters.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-3 text-muted-foreground">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-sm">Loading posters from Shopify...</span>
        </div>
      </div>
    );
  }

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

// Datos de ejemplo para respaldo
const allPosters: PosterCollection[] = [
  // ... (mantener tus datos de ejemplo existentes como respaldo)
];
