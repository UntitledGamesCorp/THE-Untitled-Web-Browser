import { ArrowLeft, ArrowRight, RotateCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useBrowserStore } from '@/lib/browserState';
import { useState } from 'react';

export function NavigationBar() {
  const { tabs, activeTabId, updateTab } = useBrowserStore();
  const activeTab = tabs.find(tab => tab.id === activeTabId);
  const [inputUrl, setInputUrl] = useState(activeTab?.url || '');

  const handleNavigation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTabId) return;

    let url = inputUrl;
    if (!/^https?:\/\//i.test(url)) {
      url = `https://${url}`;
    }

    updateTab(activeTabId, { url, loading: true });
  };

  return (
    <div className="flex items-center gap-2 p-2 bg-background border-b">
      <div className="flex gap-1">
        <Button variant="ghost" size="icon" disabled>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" disabled>
          <ArrowRight className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={() => {
          if (activeTabId) {
            updateTab(activeTabId, { loading: true });
          }
        }}>
          <RotateCw className="h-4 w-4" />
        </Button>
      </div>
      <form onSubmit={handleNavigation} className="flex-1">
        <Input
          value={inputUrl}
          onChange={(e) => setInputUrl(e.target.value)}
          placeholder="Enter URL"
          className="w-full"
        />
      </form>
    </div>
  );
}
