import React from 'react';
import { Check, Smartphone, ShoppingBag, Home } from 'lucide-react';
import { CartItem, PaymentData } from '../App';

interface ReceiptProps {
  cart: CartItem[];
  paymentData: PaymentData;
  total: number;
  onSendWhatsApp: () => void;
  onNewOrder: () => void;
}

const Receipt: React.FC<ReceiptProps> = ({ 
  cart, 
  paymentData, 
  total, 
  onSendWhatsApp, 
  onNewOrder 
}) => {
  const formatPaymentMethod = () => {
    switch (paymentData.method) {
      case 'card':
        return 'Cartão na Entrega';
      case 'cash':
        return `Dinheiro (Troco para R$ ${paymentData.changeFor?.toFixed(2)})`;
      case 'pix':
        return 'Pix';
      default:
        return paymentData.method;
    }
  };

  const orderNumber = Date.now().toString().slice(-6);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Pedido Confirmado!</h2>
            <p className="text-gray-600">Seu pedido foi recebido com sucesso</p>
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-4">
              <p className="text-green-800 font-semibold">Pedido #SB{orderNumber}</p>
            </div>
          </div>

          {/* Restaurant Info */}
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
            <h3 className="text-xl font-bold text-orange-800 mb-1">🍕 Sabor da Terra</h3>
            <p className="text-orange-700 text-sm">Obrigado por escolher nossa pizzaria!</p>
          </div>

          {/* Order Items */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <ShoppingBag className="w-5 h-5" />
              Itens do Pedido
            </h3>
            <div className="space-y-3">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between items-start p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="font-semibold">{item.quantity}x {item.name}</p>
                    {item.size && (
                      <p className="text-sm text-gray-600">Tamanho: {item.size}</p>
                    )}
                    {item.flavors && item.flavors.length > 0 && (
                      <p className="text-sm text-gray-600">
                        Sabores: {item.flavors.join(', ')}
                      </p>
                    )}
                  </div>
                  <p className="font-bold text-green-600">
                    R$ {(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="border-t pt-4 mb-6">
            <div className="flex justify-between items-center">
              <span className="text-xl font-bold">Total:</span>
              <span className="text-2xl font-bold text-green-600">
                R$ {total.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Payment Info */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">💳 Pagamento</h3>
            <p className="text-gray-700">{formatPaymentMethod()}</p>
            {paymentData.method === 'cash' && paymentData.changeFor && (
              <p className="text-sm text-gray-600">
                Troco: R$ {(paymentData.changeFor - total).toFixed(2)}
              </p>
            )}
          </div>

          {/* Delivery Info */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Home className="w-5 h-5" />
              Entrega
            </h3>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-gray-700 mb-1">{paymentData.address}</p>
              <p className="text-gray-600 text-sm">📞 {paymentData.phone}</p>
              {paymentData.observation && (
                <div className="mt-2 pt-2 border-t border-gray-200">
                  <p className="text-sm text-gray-600">
                    <strong>Observação:</strong> {paymentData.observation}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Delivery Time */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-blue-800 font-semibold">⏰ Tempo estimado de entrega:</p>
            <p className="text-blue-700">30-45 minutos</p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            {paymentData.method === 'pix' && (
              <button
                onClick={onSendWhatsApp}
                className="w-full bg-green-600 text-white py-4 rounded-xl font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
              >
                <Smartphone className="w-5 h-5" />
                Enviar Comprovante via WhatsApp
              </button>
            )}
            
            <button
              onClick={onNewOrder}
              className="w-full bg-orange-600 text-white py-4 rounded-xl font-semibold hover:bg-orange-700 transition-colors"
            >
              Fazer Novo Pedido
            </button>
          </div>

          {/* Footer */}
          <div className="text-center mt-8 pt-6 border-t border-gray-200">
            <p className="text-gray-500 text-sm">
              Em caso de dúvidas, entre em contato conosco
            </p>
            <p className="text-gray-600 font-semibold">📱 (11) 99999-9999</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Receipt;