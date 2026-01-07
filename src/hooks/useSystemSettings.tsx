import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface SystemSettings {
  id: string;
  site_name: string;
  logo_url: string | null;
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
}

interface SystemSettingsContextType {
  settings: SystemSettings | null;
  loading: boolean;
  refreshSettings: () => Promise<void>;
  getSiteName: () => string;
  getLogo: () => string | null;
  getPrimaryDomain: () => string;
  getSEOTitle: (pageName?: string) => string;
  getSEODescription: () => string;
}

const SystemSettingsContext = createContext<SystemSettingsContextType | undefined>(undefined);

const defaultSettings: SystemSettings = {
  id: '',
  site_name: 'Mebel Store',
  logo_url: null,
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
        });
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

  const refreshSettings = async () => {
    await fetchSettings();
  };

  const getSiteName = () => {
    return settings?.site_name || 'Mebel Store';
  };

  const getLogo = () => {
    return settings?.logo_url || null;
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
        getPrimaryDomain,
        getSEOTitle,
        getSEODescription,
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
