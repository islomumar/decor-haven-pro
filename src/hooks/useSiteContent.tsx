import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './use-toast';

interface ContentItem {
  id: string;
  key: string;
  value_uz: string | null;
  value_ru: string | null;
  content_type: string | null;
  page: string | null;
  section: string | null;
}

interface SiteContentContextType {
  content: Record<string, ContentItem>;
  loading: boolean;
  getContent: (key: string, language: 'uz' | 'ru', fallback?: string) => string;
  updateContent: (key: string, language: 'uz' | 'ru', value: string) => Promise<boolean>;
  refreshContent: () => Promise<void>;
}

const SiteContentContext = createContext<SiteContentContextType | undefined>(undefined);

export function SiteContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<Record<string, ContentItem>>({});
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchContent = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('site_content')
        .select('*');

      if (error) throw error;

      const contentMap: Record<string, ContentItem> = {};
      data?.forEach((item) => {
        contentMap[item.key] = item;
      });
      setContent(contentMap);
    } catch (error) {
      console.error('Error fetching site content:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  const getContent = useCallback((key: string, language: 'uz' | 'ru', fallback: string = '') => {
    const item = content[key];
    if (!item) return fallback;
    const value = language === 'uz' ? item.value_uz : item.value_ru;
    return value || fallback;
  }, [content]);

  const updateContent = useCallback(async (key: string, language: 'uz' | 'ru', value: string): Promise<boolean> => {
    try {
      const updateField = language === 'uz' ? 'value_uz' : 'value_ru';
      
      // Check if content exists
      const existing = content[key];
      
      if (existing) {
        const { error } = await supabase
          .from('site_content')
          .update({ [updateField]: value })
          .eq('key', key);

        if (error) throw error;
      } else {
        // Create new content
        const { error } = await supabase
          .from('site_content')
          .insert({
            key,
            [updateField]: value,
            content_type: 'text',
          });

        if (error) throw error;
      }

      // Update local state
      setContent((prev) => ({
        ...prev,
        [key]: {
          ...prev[key],
          id: prev[key]?.id || key,
          key,
          [updateField]: value,
          value_uz: language === 'uz' ? value : prev[key]?.value_uz || null,
          value_ru: language === 'ru' ? value : prev[key]?.value_ru || null,
          content_type: prev[key]?.content_type || 'text',
          page: prev[key]?.page || null,
          section: prev[key]?.section || null,
        },
      }));

      toast({ title: 'Saqlandi', description: 'Kontent muvaffaqiyatli yangilandi' });
      return true;
    } catch (error: any) {
      console.error('Error updating content:', error);
      toast({ variant: 'destructive', title: 'Xatolik', description: error.message });
      return false;
    }
  }, [content, toast]);

  const refreshContent = useCallback(async () => {
    setLoading(true);
    await fetchContent();
  }, [fetchContent]);

  return (
    <SiteContentContext.Provider value={{ content, loading, getContent, updateContent, refreshContent }}>
      {children}
    </SiteContentContext.Provider>
  );
}

export function useSiteContent() {
  const context = useContext(SiteContentContext);
  if (context === undefined) {
    throw new Error('useSiteContent must be used within a SiteContentProvider');
  }
  return context;
}
