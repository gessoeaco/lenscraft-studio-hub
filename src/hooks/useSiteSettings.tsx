import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface SiteSettings {
  [key: string]: any;
}

export const useSiteSettings = () => {
  const [settings, setSettings] = useState<SiteSettings>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data, error } = await supabase
          .from("site_settings")
          .select("setting_key, setting_value");

        if (error) throw error;

        const settingsObj = data.reduce((acc, setting) => {
          acc[setting.setting_key] = setting.setting_value;
          return acc;
        }, {} as SiteSettings);

        setSettings(settingsObj);
      } catch (error) {
        console.error("Error fetching site settings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const updateSetting = async (key: string, value: any) => {
    try {
      const { error } = await supabase
        .from("site_settings")
        .upsert({ setting_key: key, setting_value: value });

      if (error) throw error;

      setSettings(prev => ({ ...prev, [key]: value }));
    } catch (error) {
      console.error("Error updating setting:", error);
      throw error;
    }
  };

  return { settings, loading, updateSetting };
};