export interface CartItem {
  id: string;
  type: 'pizza' | 'hamburger' | 'drink';
  name: string;
  size?: string;
  flavors?: string[];
  price: number;
  quantity: number;
}

export interface PaymentData {
  method: 'card' | 'cash' | 'pix';
  changeFor?: number;
  address: string;
  phone: string;
  observation?: string;
}


