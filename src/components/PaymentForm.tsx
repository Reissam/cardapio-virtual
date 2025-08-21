import React, { useState } from 'react';
import { CreditCard, Banknote, Smartphone, ArrowLeft, MapPin, Phone } from 'lucide-react';
import { PaymentData } from '../../lib/types';

interface PaymentFormProps {
  total: number;
  onSubmit: (data: PaymentData) => void;
  onBack: () => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ total, onSubmit, onBack }) => {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cash' | 'pix'>('card');
  const [changeFor, setChangeFor] = useState<number>(0);
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [observation, setObservation] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!address.trim() || !phone.trim()) {
      alert('Por favor, preencha o endereço e telefone!');
      return;
    }

    if (paymentMethod === 'cash' && changeFor < total) {
      alert('O valor para troco deve ser maior ou igual ao total do pedido!');
      return;
    }

    onSubmit({
      method: paymentMethod,
      changeFor: paymentMethod === 'cash' ? changeFor : undefined,
      address: address.trim(),
      phone: phone.trim(),
      observation: observation.trim()
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={onBack}
              className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Finalizar Pedido</h2>
              <p className="text-gray-600">Total: R$ {total.toFixed(2)}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Payment Method */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Forma de Pagamento:</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-4 border-2 rounded-xl flex flex-col items-center gap-2 transition-all ${
                    paymentMethod === 'card'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <CreditCard className="w-8 h-8" />
                  <span className="font-semibold">Cartão na Entrega</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('cash')}
                  className={`p-4 border-2 rounded-xl flex flex-col items-center gap-2 transition-all ${
                    paymentMethod === 'cash'
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-gray-200 hover:border-green-300'
                  }`}
                >
                  <Banknote className="w-8 h-8" />
                  <span className="font-semibold">Dinheiro</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('pix')}
                  className={`p-4 border-2 rounded-xl flex flex-col items-center gap-2 transition-all ${
                    paymentMethod === 'pix'
                      ? 'border-purple-500 bg-purple-50 text-purple-700'
                      : 'border-gray-200 hover:border-purple-300'
                  }`}
                >
                  <Smartphone className="w-8 h-8" />
                  <span className="font-semibold">Pix</span>
                </button>
              </div>
            </div>

            {/* Change Amount for Cash */}
            {paymentMethod === 'cash' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Troco para qual valor?
                </label>
                <input
                  type="number"
                  step="0.01"
                  min={total}
                  value={changeFor}
                  onChange={(e) => setChangeFor(parseFloat(e.target.value) || 0)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Digite o valor"
                  required
                />
                {changeFor > 0 && changeFor >= total && (
                  <p className="text-sm text-green-600 mt-1">
                    Troco: R$ {(changeFor - total).toFixed(2)}
                  </p>
                )}
              </div>
            )}

            {/* Delivery Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="w-4 h-4 inline mr-1" />
                Endereço de Entrega:
              </label>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                rows={3}
                placeholder="Rua, número, bairro, cidade..."
                required
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Phone className="w-4 h-4 inline mr-1" />
                Telefone para Contato:
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="(11) 99999-9999"
                required
              />
            </div>

            {/* Observation */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Observações (opcional):
              </label>
              <textarea
                value={observation}
                onChange={(e) => setObservation(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                rows={2}
                placeholder="Alguma observação especial..."
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!address.trim() || !phone.trim()}
              className={`w-full py-4 rounded-xl font-semibold transition-all ${
                address.trim() && phone.trim()
                  ? 'bg-orange-600 text-white hover:bg-orange-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Finalizar Compra
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PaymentForm;