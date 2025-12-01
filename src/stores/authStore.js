import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      currentUser: null,
      users: [],

      // Register new user
      register: (userData) => {
        const { users } = get();
        
        // Check if email already exists
        if (users.find(user => user.email === userData.email)) {
          throw new Error('Email already exists');
        }

        // Create new user
        const newUser = {
          id: Date.now().toString(),
          ...userData,
          createdAt: new Date().toISOString(),
          favorites: [],
          bookings: []
        };

        const updatedUsers = [...users, newUser];
        set({ users: updatedUsers, currentUser: newUser });
        
        return newUser;
      },

      // Login user
      login: (email, password) => {
        const { users } = get();
        const user = users.find(u => u.email === email && u.password === password);
        
        if (!user) {
          throw new Error('Invalid email or password');
        }

        set({ currentUser: user });
        return user;
      },

      // Logout user
      logout: () => {
        set({ currentUser: null });
      },

      // Check if user is logged in
      isLoggedIn: () => {
        const { currentUser } = get();
        return currentUser !== null;
      },

      // Add item to favorites
      addToFavorites: (itemId, itemData) => {
        const { currentUser, users } = get();
        
        if (!currentUser) {
          throw new Error('Please login to add favorites');
        }

        const userIndex = users.findIndex(u => u.id === currentUser.id);
        
        if (userIndex !== -1) {
          const updatedUsers = [...users];
          if (!updatedUsers[userIndex].favorites) {
            updatedUsers[userIndex].favorites = [];
          }
          
          if (!updatedUsers[userIndex].favorites.find(fav => fav.id === itemId)) {
            updatedUsers[userIndex].favorites.push({ 
              id: itemId, 
              ...itemData, 
              addedAt: new Date().toISOString() 
            });
            
            set({ 
              users: updatedUsers, 
              currentUser: updatedUsers[userIndex] 
            });
            return true;
          }
        }
        return false;
      },

      // Remove from favorites
      removeFromFavorites: (itemId) => {
        const { currentUser, users } = get();
        
        if (!currentUser) return false;

        const userIndex = users.findIndex(u => u.id === currentUser.id);
        
        if (userIndex !== -1) {
          const updatedUsers = [...users];
          updatedUsers[userIndex].favorites = 
            updatedUsers[userIndex].favorites.filter(fav => fav.id !== itemId);
          
          set({ 
            users: updatedUsers, 
            currentUser: updatedUsers[userIndex] 
          });
          return true;
        }
        return false;
      },

      // Check if item is in favorites
      isFavorite: (itemId) => {
        const { currentUser } = get();
        if (!currentUser || !currentUser.favorites) return false;
        return currentUser.favorites.some(fav => fav.id === itemId);
      },

      // Get user's favorites
      getFavorites: () => {
        const { currentUser } = get();
        if (!currentUser) return [];
        return currentUser.favorites || [];
      },

      // Toggle favorite
      toggleFavorite: (itemData) => {
        const { isFavorite, addToFavorites, removeFromFavorites } = get();
        const itemId = itemData.id;
        const isCurrentlyFavorite = isFavorite(itemId);

        if (isCurrentlyFavorite) {
          removeFromFavorites(itemId);
          return false;
        } else {
          addToFavorites(itemId, itemData);
          return true;
        }
      },
    }),
    {
      name: 'eventra-auth-storage',
    }
  )
);
