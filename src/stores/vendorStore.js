import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useVendorStore = create(
  persist(
    (set, get) => ({
      // All products from all vendors
      products: [
        // Sample products for initial data
        {
          id: '1',
          vendorId: 'vendor1',
          title: 'Premium Sofa Set',
          category: 'furniture',
          description: 'Luxurious 3-seater sofa with elegant design',
          price: '₹2,500/hr',
          priceValue: 2500,
          rating: 4.8,
          image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80',
          status: 'available',
          stock: 5,
          createdAt: new Date().toISOString(),
        },
        {
          id: '2',
          vendorId: 'vendor1',
          title: 'Professional Sound System',
          category: 'sound-system',
          description: 'High-quality PA system with mixer and speakers',
          price: '₹5,000/hr',
          priceValue: 5000,
          rating: 4.9,
          image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&q=80',
          status: 'available',
          stock: 3,
          createdAt: new Date().toISOString(),
        },
        {
          id: '3',
          vendorId: 'vendor1',
          title: 'LED Stage Lights',
          category: 'lighting',
          description: 'Professional RGB LED lights for stage performances',
          price: '₹1,800/hr',
          priceValue: 1800,
          rating: 4.7,
          image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80',
          status: 'available',
          stock: 10,
          createdAt: new Date().toISOString(),
        },
        {
          id: '4',
          vendorId: 'vendor1',
          title: 'Floral Centerpiece Set',
          category: 'decor',
          description: 'Beautiful handcrafted floral arrangements',
          price: '₹800/hr',
          priceValue: 800,
          rating: 4.6,
          image: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800&q=80',
          status: 'available',
          stock: 15,
          createdAt: new Date().toISOString(),
        },
        {
          id: '5',
          vendorId: 'vendor1',
          title: 'Industrial Coffee Maker',
          category: 'appliances',
          description: 'Commercial grade coffee machine for events',
          price: '₹1,200/hr',
          priceValue: 1200,
          rating: 4.5,
          image: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=800&q=80',
          status: 'available',
          stock: 4,
          createdAt: new Date().toISOString(),
        },
      ],

      // Get all products
      getAllProducts: () => {
        return get().products;
      },

      // Get products by category
      getProductsByCategory: (category) => {
        return get().products.filter(p => p.category === category && p.status === 'available');
      },

      // Get product by ID
      getProductById: (id) => {
        return get().products.find(p => p.id === id);
      },

      // Get products by vendor
      getVendorProducts: (vendorId) => {
        return get().products.filter(p => p.vendorId === vendorId);
      },

      // Add new product (vendor only)
      addProduct: (productData, vendorId) => {
        const newProduct = {
          id: Date.now().toString(),
          vendorId: vendorId,
          ...productData,
          status: 'available',
          createdAt: new Date().toISOString(),
          rating: 0,
        };

        set({ products: [...get().products, newProduct] });
        return newProduct;
      },

      // Update product (vendor only)
      updateProduct: (productId, updates) => {
        const products = get().products;
        const index = products.findIndex(p => p.id === productId);
        
        if (index !== -1) {
          const updatedProducts = [...products];
          updatedProducts[index] = {
            ...updatedProducts[index],
            ...updates,
            updatedAt: new Date().toISOString(),
          };
          
          set({ products: updatedProducts });
          return updatedProducts[index];
        }
        return null;
      },

      // Delete product (vendor only)
      deleteProduct: (productId) => {
        set({ 
          products: get().products.filter(p => p.id !== productId) 
        });
      },

      // Update product status
      updateProductStatus: (productId, status) => {
        const products = get().products;
        const index = products.findIndex(p => p.id === productId);
        
        if (index !== -1) {
          const updatedProducts = [...products];
          updatedProducts[index].status = status;
          set({ products: updatedProducts });
        }
      },

      // Update stock
      updateStock: (productId, stock) => {
        const products = get().products;
        const index = products.findIndex(p => p.id === productId);
        
        if (index !== -1) {
          const updatedProducts = [...products];
          updatedProducts[index].stock = stock;
          set({ products: updatedProducts });
        }
      },

      // Search products
      searchProducts: (query) => {
        const q = query.toLowerCase();
        return get().products.filter(p => 
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
        );
      },
    }),
    {
      name: 'eventra-vendor-storage',
    }
  )
);
