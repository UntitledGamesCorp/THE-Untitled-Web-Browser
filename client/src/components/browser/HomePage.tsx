import { useState } from 'react';
import { useBrowserStore } from '@/lib/browserState';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

export function HomePage() {
  const [url, setUrl] = useState('');
  const { activeTabId, updateTab } = useBrowserStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTabId) return;

    let finalUrl = url;
    if (!/^https?:\/\//i.test(finalUrl)) {
      finalUrl = `https://${finalUrl}`;
    }

    updateTab(activeTabId, { url: finalUrl, loading: true });
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 bg-background">
      <img 
        src="/attached_assets/Icon.png" 
        alt="The Untitled Web Browser"
        className="h-32 mb-8"
      />

      <form onSubmit={handleSubmit} className="w-full max-w-2xl">
        <div className="relative">
          <Input
            type="text"
            placeholder="Enter a URL or search term"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="pl-10 h-12 text-lg shadow-lg"
          />
          <Search className="absolute left-3 top-3 h-6 w-6 text-muted-foreground" />
        </div>

        <div className="flex justify-center mt-6 gap-4">
          <Button type="submit" size="lg">
            Browse
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            size="lg"
            onClick={() => {
              if (activeTabId) {
                updateTab(activeTabId, { url: 'about:blank' });
              }
            }}
          >
            Clear
          </Button>
        </div>
      </form>
    </div>
  );
}