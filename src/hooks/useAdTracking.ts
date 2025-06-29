
import { useAnalytics } from './useAnalytics';

export const useAdTracking = () => {
  const { track } = useAnalytics();

  const trackAdImpression = (adSlot: string, page: string) => {
    track('ad_impression', {
      ad_slot: adSlot,
      page: page,
      timestamp: new Date().toISOString()
    });
  };

  const trackAdClick = (adSlot: string, page: string) => {
    track('ad_click', {
      ad_slot: adSlot,
      page: page,
      timestamp: new Date().toISOString()
    });
  };

  return {
    trackAdImpression,
    trackAdClick
  };
};
