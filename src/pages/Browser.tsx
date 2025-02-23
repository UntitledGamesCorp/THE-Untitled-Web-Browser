import { TabBar } from '@/components/browser/TabBar';
import { NavigationBar } from '@/components/browser/NavigationBar';
import { WebView } from '@/components/browser/WebView';
import { useEffect } from 'react';
import { useBrowserStore } from '@/lib/browserState';

export default function Browser() {
  const { tabs, addTab } = useBrowserStore();

  useEffect(() => {
    if (tabs.length === 0) {
      addTab();
    }
  }, []);

  return (
    <div className="flex flex-col h-screen">
      <TabBar />
      <NavigationBar />
      <WebView />
    </div>
  );
}
