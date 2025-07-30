import React, { useState } from 'react';
import { Pizza, ShoppingCart, MapPin, CreditCard, Smartphone, Banknote, Check, Phone } from 'lucide-react';
import PizzaMenu from './components/PizzaMenu';
import HamburgerMenu from './components/HamburgerMenu';
import DrinkMenu from './components/DrinkMenu';
import Cart from './components/Cart';
import PaymentForm from './components/PaymentForm';
import Receipt from './components/Receipt';

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

function App() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showPayment, setShowPayment] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);

  const addToCart = (item: Omit<CartItem, 'id' | 'quantity'>) => {
    const existingItem = cart.find(cartItem => 
      cartItem.name === item.name && 
      cartItem.size === item.size &&
      JSON.stringify(cartItem.flavors) === JSON.stringify(item.flavors)
    );

    if (existingItem) {
      setCart(cart.map(cartItem =>
        cartItem.id === existingItem.id
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      ));
    } else {
      const newItem: CartItem = {
        ...item,
        id: Date.now().toString(),
        quantity: 1
      };
      setCart([...cart, newItem]);
    }
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity === 0) {
      setCart(cart.filter(item => item.id !== id));
    } else {
      setCart(cart.map(item =>
        item.id === id ? { ...item, quantity } : item
      ));
    }
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleConfirmOrder = () => {
    if (cart.length === 0) {
      alert('Adicione itens ao carrinho antes de confirmar o pedido!');
      return;
    }
    setShowPayment(true);
  };

  const handlePaymentSubmit = (data: PaymentData) => {
    setPaymentData(data);
    setShowReceipt(true);
    setShowPayment(false);
  };

  const sendToWhatsApp = () => {
    const orderDetails = cart.map(item => {
      let itemText = `${item.quantity}x ${item.name}`;
      if (item.size) itemText += ` (${item.size})`;
      if (item.flavors && item.flavors.length > 0) {
        itemText += ` - ${item.flavors.join(', ')}`;
      }
      itemText += ` - R$ ${(item.price * item.quantity).toFixed(2)}`;
      return itemText;
    }).join('\n');

    const total = getTotalPrice().toFixed(2);
    const paymentMethod = paymentData?.method === 'card' ? 'Cartão na entrega' :
                         paymentData?.method === 'cash' ? `Dinheiro (troco para R$ ${paymentData.changeFor?.toFixed(2)})` :
                         'Pix';

    const message = `🍕 *PEDIDO SABOR DA TERRA* 🍕\n\n` +
                   `📋 *ITENS:*\n${orderDetails}\n\n` +
                   `💰 *TOTAL: R$ ${total}*\n\n` +
                   `💳 *PAGAMENTO:* ${paymentMethod}\n\n` +
                   `📍 *ENTREGA:* ${paymentData?.address}\n` +
                   `📞 *TELEFONE:* ${paymentData?.phone}\n` +
                   (paymentData?.observation ? `📝 *OBS:* ${paymentData.observation}\n` : '') +
                   `\n✅ Pedido confirmado!`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/5511999999999?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  const resetOrder = () => {
    setCart([]);
    setShowPayment(false);
    setShowReceipt(false);
    setPaymentData(null);
  };

  if (showReceipt && paymentData) {
    return (
      <Receipt
        cart={cart}
        paymentData={paymentData}
        total={getTotalPrice()}
        onSendWhatsApp={sendToWhatsApp}
        onNewOrder={resetOrder}
      />
    );
  }

  if (showPayment) {
    return (
      <PaymentForm
        total={getTotalPrice()}
        onSubmit={handlePaymentSubmit}
        onBack={() => setShowPayment(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Pizza className="w-8 h-8" />
              <div>
                <h1 className="text-3xl font-bold">Sabor da Terra</h1>
                <p className="text-orange-100">Cardápio Virtual</p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-white/20 rounded-full px-4 py-2">
              <ShoppingCart className="w-5 h-5" />
              <span className="font-semibold">{cart.length} itens</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Bem-vindo ao nosso cardápio virtual!
          </h2>
          <p className="text-gray-600">Intuitivo e fácil de usar</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Pizza Menu */}
            <PizzaMenu onAddToCart={addToCart} />
            
            {/* Hamburger Menu */}
            <HamburgerMenu onAddToCart={addToCart} />
            
            {/* Drink Menu */}
            <DrinkMenu onAddToCart={addToCart} />
          </div>
          
          {/* Cart */}
          <div className="lg:col-span-1">
            <Cart
              cart={cart}
              onUpdateQuantity={updateQuantity}
              total={getTotalPrice()}
              onConfirmOrder={handleConfirmOrder}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;