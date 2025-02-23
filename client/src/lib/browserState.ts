import { create } from 'zustand';

export interface Tab {
  id: string;
  url: string;
  title: string;
  loading: boolean;
}

interface BrowserState {
  tabs: Tab[];
  activeTabId: string | null;
  addTab: (url?: string) => void;
  closeTab: (id: string) => void;
  updateTab: (id: string, updates: Partial<Tab>) => void;
  setActiveTab: (id: string) => void;
}

export const useBrowserStore = create<BrowserState>((set) => ({
  tabs: [],
  activeTabId: null,
  addTab: (url = 'about:blank') => set((state) => {
    const newTab = {
      id: Math.random().toString(36).slice(2),
      url,
      title: 'New Tab',
      loading: false
    };
    const tabs = [...state.tabs, newTab];
    return {
      tabs,
      activeTabId: newTab.id
    };
  }),
  closeTab: (id) => set((state) => {
    const tabs = state.tabs.filter(tab => tab.id !== id);
    let activeTabId = state.activeTabId;
    if (id === activeTabId) {
      activeTabId = tabs[tabs.length - 1]?.id || null;
    }
    return { tabs, activeTabId };
  }),
  updateTab: (id, updates) => set((state) => ({
    tabs: state.tabs.map(tab => 
      tab.id === id ? { ...tab, ...updates } : tab
    )
  })),
  setActiveTab: (id) => set({ activeTabId: id })
}));
