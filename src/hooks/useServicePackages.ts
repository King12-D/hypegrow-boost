
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface ServicePackage {
  id: string;
  platform: string;
  service_type: string;
  package_name: string;
  quantity: number;
  price: number;
  is_popular: boolean;
  is_active: boolean;
}

export const useServicePackages = () => {
  return useQuery({
    queryKey: ['service-packages'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('service_packages')
        .select('*')
        .eq('is_active', true)
        .order('platform')
        .order('service_type')
        .order('price');

      if (error) throw error;
      return data as ServicePackage[];
    },
  });
};

export const useServicePackagesByPlatform = (platform: string) => {
  return useQuery({
    queryKey: ['service-packages', platform],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('service_packages')
        .select('*')
        .eq('platform', platform)
        .eq('is_active', true)
        .order('service_type')
        .order('price');

      if (error) throw error;
      return data as ServicePackage[];
    },
  });
};
