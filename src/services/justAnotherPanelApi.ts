
import { supabase } from '@/integrations/supabase/client';

interface JAPService {
  service: number;
  name: string;
  type: string;
  rate: string;
  min: string;
  max: string;
  category: string;
}

interface JAPOrderResponse {
  order: number;
}

interface JAPOrderStatus {
  charge: string;
  start_count: string;
  status: string;
  remains: string;
  currency: string;
}

class JustAnotherPanelAPI {
  async getServices(): Promise<JAPService[]> {
    const { data, error } = await supabase.functions.invoke('jap-services', {
      body: { action: 'services' }
    });

    if (error) {
      throw new Error(`Failed to fetch services: ${error.message}`);
    }

    return data;
  }

  async createOrder(serviceId: number, link: string, quantity: number): Promise<JAPOrderResponse> {
    const { data, error } = await supabase.functions.invoke('jap-services', {
      body: { 
        action: 'add',
        service: serviceId,
        link,
        quantity
      }
    });

    if (error) {
      throw new Error(`Failed to create order: ${error.message}`);
    }

    return data;
  }

  async getOrderStatus(orderId: number): Promise<JAPOrderStatus> {
    const { data, error } = await supabase.functions.invoke('jap-services', {
      body: { 
        action: 'status',
        order: orderId
      }
    });

    if (error) {
      throw new Error(`Failed to get order status: ${error.message}`);
    }

    return data;
  }

  async getBalance(): Promise<{ balance: string; currency: string }> {
    const { data, error } = await supabase.functions.invoke('jap-services', {
      body: { action: 'balance' }
    });

    if (error) {
      throw new Error(`Failed to get balance: ${error.message}`);
    }

    return data;
  }
}

export { JustAnotherPanelAPI, type JAPService, type JAPOrderResponse, type JAPOrderStatus };
