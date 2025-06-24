
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
  private baseUrl = 'https://justanotherpanel.com/api/v2';
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private async makeRequest(action: string, params: Record<string, any> = {}) {
    const formData = new FormData();
    formData.append('key', this.apiKey);
    formData.append('action', action);
    
    Object.entries(params).forEach(([key, value]) => {
      formData.append(key, value.toString());
    });

    const response = await fetch(this.baseUrl, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    return response.json();
  }

  async getServices(): Promise<JAPService[]> {
    return this.makeRequest('services');
  }

  async createOrder(serviceId: number, link: string, quantity: number): Promise<JAPOrderResponse> {
    return this.makeRequest('add', {
      service: serviceId,
      link,
      quantity,
    });
  }

  async getOrderStatus(orderId: number): Promise<JAPOrderStatus> {
    return this.makeRequest('status', { order: orderId });
  }

  async getBalance(): Promise<{ balance: string; currency: string }> {
    return this.makeRequest('balance');
  }
}

export { JustAnotherPanelAPI, type JAPService, type JAPOrderResponse, type JAPOrderStatus };
