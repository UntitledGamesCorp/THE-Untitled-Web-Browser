import { Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useBrowserStore } from '@/lib/browserState';

export function TabBar() {
  const { tabs, activeTabId, addTab, closeTab, setActiveTab } = useBrowserStore();

  return (
    <div className="flex h-10 bg-background border-b">
      <div className="flex-1 flex overflow-x-auto">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={`group flex items-center min-w-[200px] max-w-[200px] px-4 border-r ${
              tab.id === activeTabId ? 'bg-accent' : 'hover:bg-accent/50'
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            <div className="flex-1 truncate text-sm">
              {tab.loading ? 'Loading...' : tab.title || tab.url}
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 opacity-0 group-hover:opacity-100"
              onClick={(e) => {
                e.stopPropagation();
                closeTab(tab.id);
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="h-10 w-10 flex-shrink-0"
        onClick={() => addTab()}
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
}
