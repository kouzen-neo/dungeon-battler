import { create } from 'zustand';
import { useStoryStore } from '../game/storyProgress';
import { useSaveStore } from './saveStore';

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  price: number;
  icon: string;
}

interface ShopState {
  inventory: Record<string, number>;
  buyItem: (item: ShopItem) => Promise<boolean>;
  consumeItem: (itemId: string) => Promise<boolean>;
}

export const useShopStore = create<ShopState>((set, get) => ({
  inventory: {},

  buyItem: async (item: ShopItem) => {
    const story = useStoryStore.getState();
    const save = useSaveStore.getState();

    if (story.gold >= item.price) {
      // Deduct gold
      useStoryStore.setState({ gold: story.gold - item.price });
      
      // Add to inventory
      set((state) => ({
        inventory: {
          ...state.inventory,
          [item.id]: (state.inventory[item.id] || 0) + 1,
        },
      }));

      // Persist changes
      await save.persistAll();
      return true;
    }
    return false;
  },

  consumeItem: async (itemId: string) => {
    const { inventory } = get();
    const save = useSaveStore.getState();
    if (inventory[itemId] && inventory[itemId] > 0) {
      set((state) => ({
        inventory: {
          ...state.inventory,
          [itemId]: state.inventory[itemId] - 1
        }
      }));
      await save.persistAll();
      return true;
    }
    return false;
  }
}));
