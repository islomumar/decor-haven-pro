import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface SystemSettings {
  id: string;
  site_name: string;
  logo_url: string | null;
  favicon_url: string | null;
  contact_phone: string | null;
  whatsapp_number: string | null;
  working_hours_uz: string | null;
  working_hours_ru: string | null;
  address_uz: string | null;
  address_ru: string | null;
  seo_title: string | null;
  seo_description: string | null;
  default_language: string;
  languages_enabled: string[];
  primary_domain: string | null;
  short_description_uz: string | null;
  short_description_ru: string | null;
  social_facebook: string | null;
  social_instagram: string | null;
  social_telegram: string | null;
}

interface SystemSettingsContextType {
  settings: SystemSettings | null;
  loading: boolean;
  refreshSettings: () => Promise<void>;
  getSiteName: () => string;
  getLogo: () => string | null;
  getFavicon: () => string | null;
  getPrimaryDomain: () => string;
  getSEOTitle: (pageName?: string) => string;
  getSEODescription: () => string;
  getShortDescription: (language: 'uz' | 'ru') => string;
  getAddress: (language: 'uz' | 'ru') => string;
  getWorkingHours: (language: 'uz' | 'ru') => string;
}

const SystemSettingsContext = createContext<SystemSettingsContextType | undefined>(undefined);

const defaultSettings: SystemSettings = {
  id: '',
  site_name: 'Mebel Store',
  logo_url: null,
  favicon_url: null,
  contact_phone: '',
  whatsapp_number: '',
  working_hours_uz: '',
  working_hours_ru: '',
  address_uz: '',
  address_ru: '',
  seo_title: '',
  seo_description: '',
  default_language: 'uz',
  languages_enabled: ['uz', 'ru'],
  primary_domain: null,
  short_description_uz: '',
  short_description_ru: '',
  social_facebook: null,
  social_instagram: null,
  social_telegram: null,
};

export function SystemSettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('system_settings')
        .select('*')
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching settings:', error);
        setSettings(defaultSettings);
      } else if (data) {
        setSettings({
          ...defaultSettings,
          ...data,
        } as SystemSettings);
      } else {
        setSettings(defaultSettings);
      }
    } catch (error) {
      console.error('Error:', error);
      setSettings(defaultSettings);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  // Update favicon when settings change
  useEffect(() => {
    if (settings?.favicon_url) {
      updateFavicon(settings.favicon_url);
    }
  }, [settings?.favicon_url]);

  const updateFavicon = (url: string) => {
    // Add cache buster
    const cacheBustedUrl = `${url}?v=${Date.now()}`;
    
    // Remove existing favicon links
    const existingLinks = document.querySelectorAll("link[rel*='icon']");
    existingLinks.forEach(link => link.remove());

    // Create new favicon link
    const link = document.createElement('link');
    link.rel = 'icon';
    link.href = cacheBustedUrl;
    document.head.appendChild(link);

    // Also add shortcut icon for older browsers
    const shortcutLink = document.createElement('link');
    shortcutLink.rel = 'shortcut icon';
    shortcutLink.href = cacheBustedUrl;
    document.head.appendChild(shortcutLink);
  };

  const refreshSettings = async () => {
    await fetchSettings();
  };

  const getSiteName = () => {
    return settings?.site_name || 'Mebel Store';
  };

  const getLogo = () => {
    return settings?.logo_url || null;
  };

  const getFavicon = () => {
    return settings?.favicon_url || null;
  };

  const getPrimaryDomain = () => {
    return settings?.primary_domain || window.location.origin;
  };

  const getSEOTitle = (pageName?: string) => {
    const siteTitle = settings?.seo_title || settings?.site_name || 'Mebel Store';
    if (pageName) {
      return `${pageName} | ${siteTitle}`;
    }
    return siteTitle;
  };

  const getSEODescription = () => {
    return settings?.seo_description || '';
  };

  const getShortDescription = (language: 'uz' | 'ru') => {
    if (language === 'ru') {
      return settings?.short_description_ru || settings?.short_description_uz || '';
    }
    return settings?.short_description_uz || '';
  };

  const getAddress = (language: 'uz' | 'ru') => {
    if (language === 'ru') {
      return settings?.address_ru || settings?.address_uz || '';
    }
    return settings?.address_uz || '';
  };

  const getWorkingHours = (language: 'uz' | 'ru') => {
    if (language === 'ru') {
      return settings?.working_hours_ru || settings?.working_hours_uz || '';
    }
    return settings?.working_hours_uz || '';
  };

  // Update document title when settings load
  useEffect(() => {
    if (settings && !loading) {
      const seoTitle = settings.seo_title || settings.site_name;
      if (seoTitle) {
        document.title = seoTitle;
      }
    }
  }, [settings, loading]);

  return (
    <SystemSettingsContext.Provider
      value={{
        settings,
        loading,
        refreshSettings,
        getSiteName,
        getLogo,
        getFavicon,
        getPrimaryDomain,
        getSEOTitle,
        getSEODescription,
        getShortDescription,
        getAddress,
        getWorkingHours,
      }}
    >
      {children}
    </SystemSettingsContext.Provider>
  );
}

export function useSystemSettings() {
  const context = useContext(SystemSettingsContext);
  if (context === undefined) {
    throw new Error('useSystemSettings must be used within a SystemSettingsProvider');
  }
  return context;
}
