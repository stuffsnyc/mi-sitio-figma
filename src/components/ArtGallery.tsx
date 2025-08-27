// Shopify service for fetching products from the tndztv-yx store
const SHOPIFY_STORE = 'tndztv-yx';
const SHOPIFY_TOKEN = '64aab96a1d4aaa428d04fb9d6519a916';
const SHOPIFY_API_VERSION = '2024-01';

interface ShopifyProduct {
  id: string;
  title: string;
  handle: string;
  description: string;
  product_type: string;
  created_at: string;
  updated_at: string;
  vendor: string;
  tags: string;
  variants: ShopifyVariant[];
  images: ShopifyImage[];
  options: ShopifyOption[];
}

interface ShopifyVariant {
  id: string;
  title: string;
  option1: string | null;
  option2: string | null;
  option3: string | null;
  sku: string;
  requires_shipping: boolean;
  taxable: boolean;
  featured_image: ShopifyImage | null;
  available: boolean;
  price: string;
  grams: number;
  compare_at_price: string | null;
  position: number;
  product_id: string;
  created_at: string;
  updated_at: string;
  inventory_quantity: number;
  inventory_management: string;
  inventory_policy: string;
}

interface ShopifyImage {
  id: string;
  product_id: string;
  position: number;
  created_at: string;
  updated_at: string;
  alt: string | null;
  width: number;
  height: number;
  src: string;
  variant_ids: string[];
}

interface ShopifyOption {
  id: string;
  product_id: string;
  name: string;
  position: number;
  values: string[];
}

interface ShopifyCollection {
  id: string;
  handle: string;
  title: string;
  updated_at: string;
  body_html: string;
  published_at: string;
  sort_order: string;
  template_suffix: string;
  disjunctive: boolean;
  rules: any[];
  published_scope: string;
  admin_graphql_api_id: string;
}

// Formatted product interface for the gallery
export interface FormattedProduct {
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
  handle: string;
  shopifyId: string;
}

export interface FormattedPosterCollection {
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
  products: FormattedProduct[];
  handle: string;
}

class ShopifyService {
  private baseUrl: string;
  private headers: HeadersInit;

  constructor() {
    this.baseUrl = `https://${SHOPIFY_STORE}.myshopify.com/admin/api/${SHOPIFY_API_VERSION}`;
    this.headers = {
      'X-Shopify-Access-Token': SHOPIFY_TOKEN,
      'Content-Type': 'application/json',
    };
  }

  private async request<T>(endpoint: string): Promise<T> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        headers: this.headers,
      });

      if (!response.ok) {
        throw new Error(`Shopify API error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Shopify API request failed:', error);
      throw error;
    }
  }

  async getCollections(): Promise<{ collections: ShopifyCollection[] }> {
    return this.request('/collections.json');
  }

  async getProductsByCollection(collectionId: string): Promise<{ products: ShopifyProduct[] }> {
    return this.request(`/collections/${collectionId}/products.json`);
  }

  async getAllProducts(): Promise<{ products: ShopifyProduct[] }> {
    return this.request('/products.json?limit=250');
  }

  async getProductsByTag(tag: string): Promise<{ products: ShopifyProduct[] }> {
    return this.request(`/products.json?limit=250&fields=id,title,handle,description,product_type,created_at,vendor,tags,variants,images,options&published_status=published`);
  }

  async findProductsByName(productName: string): Promise<ShopifyProduct[]> {
    try {
      const response = await this.getAllProducts();
      return response.products.filter(product => 
        product.title.toLowerCase().includes(productName.toLowerCase()) ||
        product.handle.toLowerCase().includes(productName.toLowerCase().replace(/\s+/g, '-'))
      );
    } catch (error) {
      console.error('Error finding products by name:', error);
      return [];
    }
  }

  private formatProduct(product: ShopifyProduct): FormattedProduct {
    const mainVariant = product.variants[0];
    
    // Fallback images array for when Shopify images are not available
    const fallbackImages = [
      'https://images.unsplash.com/photo-1687211980289-ba127aa649e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBhYnN0cmFjdCUyMHBvc3RlciUyMGRlc2lnbnxlbnwxfHx8fDE3NTYzMjAzMjR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      'https://images.unsplash.com/photo-1648144019383-089b37a98e75?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnZW9tZXRyaWMlMjBhcnQlMjBwb3N0ZXJ8ZW58MXx8fHwxNzU2MzIwMzI5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      'https://images.unsplash.com/photo-1613759007428-9d918fe2d36f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwcG9zdGVyJTIwZGVzaWdufGVufDF8fHx8MTc1NjI5NjcxNHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    ];
    
    // Use Shopify image or random fallback
    const mainImage = product.images[0]?.src || fallbackImages[Math.floor(Math.random() * fallbackImages.length)];
    
    // Extract materials from tags or description
    const materials = this.extractMaterials(product.tags, product.description);
    
    // Extract hashtags from tags
    const hashtags = product.tags ? product.tags.split(',').map(tag => tag.trim().toLowerCase()) : [];
    
    // Extract sizes from variant options
    const sizes = this.extractSizes(product.options, product.variants);
    
    // Extract variations from options
    const variations = this.extractVariations(product.options);
    
    // Format creation date
    const creationDate = new Date(product.created_at).toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric'
    });

    // Generate stock number from SKU or product ID
    const stockNumber = mainVariant.sku || `SC-${product.id.slice(-6)}`;

    // Determine badge based on tags or other criteria
    const badge = this.determineBadge(product.tags, product.created_at);

    return {
      id: `sp-${product.id}`,
      shopifyId: product.id,
      title: product.title,
      price: `$${parseFloat(mainVariant.price).toFixed(0)}`,
      originalPrice: mainVariant.compare_at_price ? `$${parseFloat(mainVariant.compare_at_price).toFixed(0)}` : undefined,
      image: mainImage,
      creationDate,
      location: 'New York, NY', // Default location
      description: product.description || 'Beautiful artwork by Santiago Camiro',
      materials,
      hashtags,
      sizes,
      variations,
      stockNumber,
      stockQuantity: mainVariant.inventory_quantity || 0,
      inStock: mainVariant.available,
      badge,
      handle: product.handle
    };
  }

  private extractMaterials(tags: string, description: string): string[] {
    const commonMaterials = [
      'premium cotton paper', 'archival inks', 'uv protective coating',
      'fine art paper', 'giclée print', 'museum quality',
      'canvas print', 'acrylic finish', 'gallery wrapped',
      'cotton paper', 'screen print', 'water-based inks',
      'recycled paper', 'digital print', 'matte finish',
      'eco paper', 'soy-based inks', 'biodegradable finish'
    ];

    const materials: string[] = [];
    const searchText = `${tags} ${description}`.toLowerCase();

    commonMaterials.forEach(material => {
      if (searchText.includes(material.toLowerCase())) {
        materials.push(material.split(' ').map(word => 
          word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' '));
      }
    });

    // Default materials if none found
    if (materials.length === 0) {
      materials.push('Premium Cotton Paper', 'Archival Inks', 'UV Protective Coating');
    }

    return materials;
  }

  private extractSizes(options: ShopifyOption[], variants: ShopifyVariant[]): string[] {
    const sizeOption = options.find(option => 
      option.name.toLowerCase().includes('size') || 
      option.name.toLowerCase().includes('dimension')
    );

    if (sizeOption) {
      return sizeOption.values;
    }

    // Default sizes for posters
    return ['A4 (8×12")', 'A3 (12×16")', 'A2 (16×24")'];
  }

  private extractVariations(options: ShopifyOption[]): { name: string; options: string[] }[] {
    const variations: { name: string; options: string[] }[] = [];

    options.forEach(option => {
      if (!option.name.toLowerCase().includes('size') && 
          !option.name.toLowerCase().includes('dimension')) {
        variations.push({
          name: option.name,
          options: option.values
        });
      }
    });

    // Default variations if none found
    if (variations.length === 0) {
      variations.push(
        { name: 'Frame', options: ['Black Frame', 'White Frame', 'Natural Wood', 'No Frame'] },
        { name: 'Finish', options: ['Matte', 'Glossy', 'Satin'] }
      );
    }

    return variations;
  }

  private determineBadge(tags: string, createdAt: string): string | undefined {
    if (!tags) return undefined;

    const tagList = tags.toLowerCase().split(',').map(tag => tag.trim());
    
    if (tagList.includes('bestseller') || tagList.includes('best seller')) {
      return 'Best Seller';
    }
    if (tagList.includes('limited') || tagList.includes('limited edition')) {
      return 'Limited Edition';
    }
    if (tagList.includes('eco') || tagList.includes('eco-friendly')) {
      return 'Eco-Friendly';
    }
    if (tagList.includes('sale')) {
      return 'Sale';
    }

    // Check if created within last 30 days for "New" badge
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    if (new Date(createdAt) > thirtyDaysAgo) {
      return 'New';
    }

    return undefined;
  }

  async getPosterCollections(): Promise<FormattedPosterCollection[]> {
    try {
      // Get all products and filter for posters
      const response = await this.getAllProducts();
      const posterProducts = response.products.filter(product => 
        product.product_type?.toLowerCase().includes('poster') ||
        product.tags?.toLowerCase().includes('poster') ||
        product.title.toLowerCase().includes('poster')
      );

      // Group products by similar names/collections
      const collections = this.groupProductsIntoCollections(posterProducts);
      
      // If no collections found, return mock data
      return collections.length > 0 ? collections : this.getMockPosterCollections();
    } catch (error) {
      console.error('Error fetching poster collections, falling back to demo data:', error);
      // Return mock data as fallback when API is not accessible
      return this.getMockPosterCollections();
    }
  }

  private groupProductsIntoCollections(products: ShopifyProduct[]): FormattedPosterCollection[] {
    const collections: FormattedPosterCollection[] = [];
    
    // Fallback images for collections
    const fallbackImages = [
      'https://images.unsplash.com/photo-1687211980289-ba127aa649e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBhYnN0cmFjdCUyMHBvc3RlciUyMGRlc2lnbnxlbnwxfHx8fDE3NTYzMjAzMjR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      'https://images.unsplash.com/photo-1648144019383-089b37a98e75?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnZW9tZXRyaWMlMjBhcnQlMjBwb3N0ZXJ8ZW58MXx8fHwxNzU2MzIwMzI5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      'https://images.unsplash.com/photo-1613759007428-9d918fe2d36f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwcG9zdGVyJTIwZGVzaWdufGVufDF8fHx8MTc1NjI5NjcxNHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    ];
    
    products.forEach((product, index) => {
      const formattedProduct = this.formatProduct(product);
      
      // Create a collection for each main product
      const collection: FormattedPosterCollection = {
        id: `col-${product.id}`,
        title: product.title,
        designer: 'Santiago Camiro',
        description: product.description || 'A stunning poster design by Santiago Camiro',
        mainImage: product.images[0]?.src || fallbackImages[index % fallbackImages.length],
        price: formattedProduct.price,
        technique: this.extractTechnique(product.tags, product.description),
        dimensions: this.extractDimensions(product.options, product.description),
        year: new Date(product.created_at).getFullYear().toString(),
        series: this.extractSeries(product.tags, product.title),
        likes: Math.floor(Math.random() * 300) + 50, // Random likes for demo
        comments: Math.floor(Math.random() * 50) + 10, // Random comments for demo
        tags: product.tags ? product.tags.split(',').map(tag => tag.trim().toLowerCase()) : [],
        products: [formattedProduct], // Start with the main product
        handle: product.handle
      };
      
      collections.push(collection);
    });

    return collections;
  }

  private extractTechnique(tags: string, description: string): string {
    const techniques = [
      'digital print', 'screen print', 'giclée print', 'lithograph', 
      'offset print', 'archival print', 'canvas print'
    ];
    
    const searchText = `${tags} ${description}`.toLowerCase();
    
    for (const technique of techniques) {
      if (searchText.includes(technique)) {
        return technique.split(' ').map(word => 
          word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ') + ' on Premium Paper';
      }
    }
    
    return 'Digital Print on Premium Paper';
  }

  private extractDimensions(options: ShopifyOption[], description: string): string {
    const sizeOption = options.find(option => 
      option.name.toLowerCase().includes('size') || 
      option.name.toLowerCase().includes('dimension')
    );

    if (sizeOption && sizeOption.values.length > 0) {
      // Return the largest size as the main dimension
      return sizeOption.values[sizeOption.values.length - 1];
    }

    // Check description for dimensions
    const dimensionMatch = description.match(/(\d+["']?\s*[x×]\s*\d+["']?)/i);
    if (dimensionMatch) {
      return dimensionMatch[1];
    }

    return '18" x 12"'; // Default dimension
  }

  private extractSeries(tags: string, title: string): string {
    if (tags) {
      const tagList = tags.split(',').map(tag => tag.trim());
      const seriesTag = tagList.find(tag => 
        tag.toLowerCase().includes('series') || 
        tag.toLowerCase().includes('collection')
      );
      if (seriesTag) {
        return seriesTag.charAt(0).toUpperCase() + seriesTag.slice(1);
      }
    }

    // Extract series from title
    if (title.includes('Collection')) {
      return title.split(' ').slice(0, -1).join(' ') + ' Collection';
    }
    if (title.includes('Series')) {
      return title.split(' ').slice(0, -1).join(' ') + ' Series';
    }

    return 'Poster Collection';
  }

  async findRelatedProducts(productTitle: string): Promise<FormattedProduct[]> {
    try {
      const relatedProducts = await this.findProductsByName(productTitle);
      return relatedProducts.map(product => this.formatProduct(product));
    } catch (error) {
      console.error('Error finding related products:', error);
      return [];
    }
  }

  private getMockPosterCollections(): FormattedPosterCollection[] {
    const fallbackImages = [
      'https://images.unsplash.com/photo-1687211980289-ba127aa649e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBhYnN0cmFjdCUyMHBvc3RlciUyMGRlc2lnbnxlbnwxfHx8fDE3NTYzMjAzMjR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      'https://images.unsplash.com/photo-1648144019383-089b37a98e75?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnZW9tZXRyaWMlMjBhcnQlMjBwb3N0ZXJ8ZW58MXx8fHwxNzU2MzIwMzI5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      'https://images.unsplash.com/photo-1613759007428-9d918fe2d36f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwcG9zdGVyJTIwZGVzaWdufGVufDF8fHx8MTc1NjI5NjcxNHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      'https://images.unsplash.com/photo-1704039562258-b444d01e47a0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xvcmZ1bCUyMGFic3RyYWN0JTIwYXJ0JTIwcG9zdGVyfGVufDF8fHx8MTc1NjMyMTk0NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      'https://images.unsplash.com/photo-1540312790810-8d1eeb1caa7b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1cmJhbiUyMHN0cmVldCUyMGFydCUyMHBvc3RlcnxlbnwxfHx8fDE3NTYzMjE5NDh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      'https://images.unsplash.com/photo-1717601716921-c3c2d4574a60?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwdHlwb2dyYXBoeSUyMHBvc3RlcnxlbnwxfHx8fDE3NTYzMjE5NTN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    ];

    return [
      {
        id: 'mock-1',
        title: 'Abstract Harmony Collection',
        designer: 'Santiago Camiro',
        description: 'A vibrant exploration of color and form, this collection embodies the essence of contemporary abstract design.',
        mainImage: fallbackImages[0],
        price: '$45',
        technique: 'Digital Print on Premium Paper',
        dimensions: '18" x 12"',
        year: '2024',
        series: 'Abstract Collection',
        likes: 189,
        comments: 34,
        tags: ['abstract', 'geometric', 'contemporary'],
        handle: 'abstract-harmony-collection',
        products: [
          {
            id: 'mock-p1-1',
            shopifyId: 'mock-sp-1',
            title: 'Abstract Harmony Print',
            price: '$45',
            originalPrice: '$65',
            image: fallbackImages[0],
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
            badge: 'Best Seller',
            handle: 'abstract-harmony-print'
          },
          {
            id: 'mock-p1-2',
            shopifyId: 'mock-sp-1-2',
            title: 'Geometric Rhythms',
            price: '$38',
            image: fallbackImages[1],
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
            inStock: true,
            badge: 'New',
            handle: 'geometric-rhythms'
          }
        ]
      },
      {
        id: 'mock-2',
        title: 'Geometric Rhythms Series',
        designer: 'Santiago Camiro',
        description: 'Dynamic patterns that pulse with the energy of geometric precision and artistic expression.',
        mainImage: fallbackImages[1],
        price: '$38',
        technique: 'Screen Print on Cotton Paper',
        dimensions: '24" x 16"',
        year: '2024',
        series: 'Geometric Series',
        likes: 156,
        comments: 28,
        tags: ['geometric', 'modern', 'rhythmic'],
        handle: 'geometric-rhythms-series',
        products: [
          {
            id: 'mock-p2-1',
            shopifyId: 'mock-sp-2',
            title: 'City Pulse',
            price: '$38',
            image: fallbackImages[1],
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
            handle: 'city-pulse'
          },
          {
            id: 'mock-p2-2',
            shopifyId: 'mock-sp-2-2',
            title: 'Metropolitan Grid',
            price: '$44',
            image: fallbackImages[2],
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
            inStock: true,
            handle: 'metropolitan-grid'
          }
        ]
      },
      {
        id: 'mock-3',
        title: 'Minimalist Essence Collection',
        designer: 'Santiago Camiro',
        description: 'Clean lines and thoughtful composition create a sense of calm and sophistication.',
        mainImage: fallbackImages[2],
        price: '$42',
        technique: 'Eco-Friendly Soy Ink Print',
        dimensions: '20" x 13.3"',
        year: '2024',
        series: 'Minimalist Collection',
        likes: 234,
        comments: 45,
        tags: ['minimalist', 'clean', 'modern'],
        handle: 'minimalist-essence-collection',
        products: [
          {
            id: 'mock-p3-1',
            shopifyId: 'mock-sp-3',
            title: 'Vibrant Flow',
            price: '$42',
            image: fallbackImages[2],
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
            badge: 'Eco-Friendly',
            handle: 'vibrant-flow'
          }
        ]
      },
      {
        id: 'mock-4',
        title: 'Color Explosion Series',
        designer: 'Santiago Camiro',
        description: 'Vibrant bursts of color that capture the energy and dynamism of contemporary expression.',
        mainImage: fallbackImages[3],
        price: '$55',
        technique: 'High Resolution Digital Print',
        dimensions: '20" x 16"',
        year: '2024',
        series: 'Color Series',
        likes: 298,
        comments: 67,
        tags: ['colorful', 'vibrant', 'energetic'],
        handle: 'color-explosion-series',
        products: [
          {
            id: 'mock-p4-1',
            shopifyId: 'mock-sp-4',
            title: 'Chromatic Burst',
            price: '$55',
            image: fallbackImages[3],
            creationDate: 'April 2024',
            location: 'SoHo, NY',
            description: 'An explosive celebration of color that energizes any space with its dynamic composition and vivid palette.',
            materials: ['Premium Photo Paper', 'Fade-Resistant Inks', 'Protective Laminate'],
            hashtags: ['colorful', 'burst', 'energy', 'vivid'],
            sizes: ['A4 (8×12")', 'A3 (12×16")', 'A2 (16×24")', 'A1 (24×32")'],
            variations: [
              { name: 'Print Quality', options: ['Standard', 'Premium', 'Gallery Quality'] },
              { name: 'Frame', options: ['Black Frame', 'White Frame', 'Natural Oak', 'No Frame'] }
            ],
            stockNumber: 'CB-007',
            stockQuantity: 12,
            inStock: true,
            badge: 'Limited Edition',
            handle: 'chromatic-burst'
          }
        ]
      },
      {
        id: 'mock-5',
        title: 'Urban Expression Collection',
        designer: 'Santiago Camiro',
        description: 'Street-inspired designs that capture the raw energy and authentic spirit of urban culture.',
        mainImage: fallbackImages[4],
        price: '$40',
        technique: 'Street Art Style Print',
        dimensions: '18" x 24"',
        year: '2024',
        series: 'Urban Collection',
        likes: 167,
        comments: 89,
        tags: ['urban', 'street', 'edgy'],
        handle: 'urban-expression-collection',
        products: [
          {
            id: 'mock-p5-1',
            shopifyId: 'mock-sp-5',
            title: 'Street Pulse',
            price: '$40',
            image: fallbackImages[4],
            creationDate: 'May 2024',
            location: 'Williamsburg, NY',
            description: 'Raw urban energy captured in striking visual form, bringing the authentic spirit of street culture to your walls.',
            materials: ['Heavy Stock Paper', 'UV-Resistant Coating', 'Weatherproof Finish'],
            hashtags: ['street', 'urban', 'pulse', 'authentic'],
            sizes: ['A4 (8×12")', 'A3 (12×16")', 'A2 (16×24")'],
            variations: [
              { name: 'Style', options: ['Original Color', 'Monochrome', 'Sepia Tone'] },
              { name: 'Frame', options: ['Industrial Black', 'Raw Steel', 'Reclaimed Wood', 'No Frame'] }
            ],
            stockNumber: 'SP-008',
            stockQuantity: 27,
            inStock: true,
            handle: 'street-pulse'
          }
        ]
      },
      {
        id: 'mock-6',
        title: 'Vintage Typography Series',
        designer: 'Santiago Camiro',
        description: 'Classic typography meets contemporary design in this timeless collection of typographic art.',
        mainImage: fallbackImages[5],
        price: '$35',
        technique: 'Vintage-Style Letterpress Effect',
        dimensions: '16" x 20"',
        year: '2024',
        series: 'Typography Collection',
        likes: 203,
        comments: 45,
        tags: ['vintage', 'typography', 'classic'],
        handle: 'vintage-typography-series',
        products: [
          {
            id: 'mock-p6-1',
            shopifyId: 'mock-sp-6',
            title: 'Classic Letters',
            price: '$35',
            image: fallbackImages[5],
            creationDate: 'January 2024',
            location: 'Brooklyn, NY',
            description: 'Timeless typography that celebrates the art of letterforms with vintage charm and contemporary appeal.',
            materials: ['Textured Art Paper', 'Matte Finish', 'Aged-Effect Coating'],
            hashtags: ['typography', 'vintage', 'letters', 'classic'],
            sizes: ['A4 (8×12")', 'A3 (12×16")', 'A2 (16×24")'],
            variations: [
              { name: 'Color Scheme', options: ['Vintage Sepia', 'Classic Black', 'Antique Gold'] },
              { name: 'Frame', options: ['Vintage Wood', 'Antique Brass', 'Classic Black', 'No Frame'] }
            ],
            stockNumber: 'CL-009',
            stockQuantity: 33,
            inStock: true,
            badge: 'Bestseller',
            handle: 'classic-letters'
          }
        ]
      }
    ];
  }
}

export const shopifyService = new ShopifyService();
