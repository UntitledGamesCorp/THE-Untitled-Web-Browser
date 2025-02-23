import { useEffect, useRef, useState } from 'react';
import { useBrowserStore } from '@/lib/browserState';
import { apiRequest } from '@/lib/queryClient';
import { AlertCircle, XCircle } from 'lucide-react';
import { HomePage } from './HomePage';
import { PageTransition } from './PageTransition';

export function WebView() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { tabs, activeTabId, updateTab } = useBrowserStore();
  const activeTab = tabs.find(tab => tab.id === activeTabId);
  const [loadError, setLoadError] = useState<string | null>(null);

  const isGoogleDomain = (url: string) => {
    try {
      const hostname = new URL(url).hostname;
      return hostname === 'google.com' || hostname.endsWith('.google.com');
    } catch {
      return false;
    }
  };

  useEffect(() => {
    if (!activeTab || activeTab.url === 'about:blank') return;
    setLoadError(null);

    if (isGoogleDomain(activeTab.url)) {
      setLoadError('COMPETITOR_BLOCKED');
      updateTab(activeTab.id, { loading: false });
      return;
    }

    const iframe = iframeRef.current;
    if (!iframe) return;

    const handleLoad = () => {
      if (!activeTab.id) return;

      try {
        const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
        const title = iframeDoc?.title || activeTab.url;
        updateTab(activeTab.id, { loading: false, title });

        apiRequest('POST', '/api/history', {
          url: activeTab.url,
          title
        });
      } catch (e) {
        setLoadError("This website cannot be displayed in the browser due to security restrictions.");
        updateTab(activeTab.id, { loading: false });
      }
    };

    const handleError = () => {
      if (!activeTab.id) return;
      setLoadError("Failed to load the website. Please check the URL and try again.");
      updateTab(activeTab.id, { loading: false });
    };

    iframe.addEventListener('load', handleLoad);
    iframe.addEventListener('error', handleError);
    return () => {
      iframe.removeEventListener('load', handleLoad);
      iframe.removeEventListener('error', handleError);
    };
  }, [activeTab?.url]);

  if (!activeTab || activeTab.url === 'about:blank') {
    return (
      <PageTransition isLoading={false}>
        <HomePage />
      </PageTransition>
    );
  }

  if (loadError === 'COMPETITOR_BLOCKED') {
    return (
      <PageTransition isLoading={false}>
        <div className="flex-1 flex items-center justify-center bg-background">
          <div className="text-center max-w-md p-6">
            <XCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-4">Hey! Don't go to our competitor!</h3>
            <p className="text-lg text-muted-foreground mb-6">
              Why not stay here and use The Untitled Web Browser instead? We promise we're more fun! 😉
            </p>
            <p className="text-sm text-muted-foreground">
              Attempted to visit: {activeTab.url}
            </p>
          </div>
        </div>
      </PageTransition>
    );
  }

  if (loadError) {
    return (
      <PageTransition isLoading={false}>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-md p-6">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Unable to Load Website</h3>
            <p className="text-muted-foreground">{loadError}</p>
            <p className="text-sm mt-4">
              Try opening <a href={activeTab.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                {activeTab.url}
              </a> in a new window instead.
            </p>
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition isLoading={activeTab.loading}>
      <iframe
        ref={iframeRef}
        src={activeTab.url}
        className="flex-1 w-full h-full border-none"
        sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
      />
    </PageTransition>
  );
}