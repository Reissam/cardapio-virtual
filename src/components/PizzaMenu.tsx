import React, { useState } from 'react';
import { Pizza, Plus } from 'lucide-react';
import { CartItem } from '../../lib/types';

interface PizzaMenuProps {
  onAddToCart: (item: Omit<CartItem, 'id' | 'quantity'>) => void;
}

const sizes = {
  P: { name: 'Pequena', price: 25.90 },
  M: { name: 'Média', price: 35.90 },
  G: { name: 'Grande', price: 45.90 },
  F: { name: 'Família', price: 55.90 }
};

const flavors = [
  'Margherita', 'Pepperoni', 'Calabresa', 'Frango Catupiry', 'Portuguesa',
  'Quatro Queijos', 'Bacon', 'Vegetariana', 'Napolitana', 'Toscana',
  'Camarão', 'Chocolate', 'Banana Canela', 'Palmito', 'Atum'
];

const PizzaMenu: React.FC<PizzaMenuProps> = ({ onAddToCart }) => {
  const [selectedSize, setSelectedSize] = useState<keyof typeof sizes>('M');
  const [flavorCount, setFlavorCount] = useState<1 | 2>(1);
  const [selectedFlavors, setSelectedFlavors] = useState<string[]>([]);

  const handleSizeChange = (size: keyof typeof sizes) => {
    setSelectedSize(size);
    setFlavorCount(1);
    setSelectedFlavors([]);
  };

  const handleFlavorToggle = (flavor: string) => {
    if (selectedFlavors.includes(flavor)) {
      setSelectedFlavors(selectedFlavors.filter(f => f !== flavor));
    } else if (selectedFlavors.length < flavorCount) {
      setSelectedFlavors([...selectedFlavors, flavor]);
    }
  };

  const canAddToCart = () => {
    return selectedFlavors.length === flavorCount;
  };

  const handleAddToCart = () => {
    if (!canAddToCart()) return;

    const pizzaName = `Pizza ${sizes[selectedSize].name}`;
    onAddToCart({
      type: 'pizza',
      name: pizzaName,
      size: selectedSize,
      flavors: selectedFlavors,
      price: sizes[selectedSize].price
    });

    setSelectedFlavors([]);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
          <Pizza className="w-6 h-6 text-orange-600" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-gray-800">Pizzas</h3>
          <p className="text-gray-600">Escolha o tamanho e os sabores</p>
        </div>
      </div>

      {/* Size Selection */}
      <div className="mb-6">
        <h4 className="text-lg font-semibold mb-3">Tamanho:</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Object.entries(sizes).map(([key, { name, price }]) => (
            <button
              key={key}
              onClick={() => handleSizeChange(key as keyof typeof sizes)}
              className={`p-4 rounded-xl border-2 transition-all ${
                selectedSize === key
                  ? 'border-orange-500 bg-orange-50 text-orange-700'
                  : 'border-gray-200 hover:border-orange-300'
              }`}
            >
              <div className="font-semibold">{key}</div>
              <div className="text-sm">{name}</div>
              <div className="text-sm font-bold">R$ {price.toFixed(2)}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Flavor Count Selection (for G and F sizes) */}
      {(selectedSize === 'G' || selectedSize === 'F') && (
        <div className="mb-6">
          <h4 className="text-lg font-semibold mb-3">Quantidade de sabores:</h4>
          <div className="flex gap-3">
            <button
              onClick={() => { setFlavorCount(1); setSelectedFlavors([]); }}
              className={`px-6 py-3 rounded-xl border-2 transition-all ${
                flavorCount === 1
                  ? 'border-orange-500 bg-orange-50 text-orange-700'
                  : 'border-gray-200 hover:border-orange-300'
              }`}
            >
              1 Sabor
            </button>
            <button
              onClick={() => { setFlavorCount(2); setSelectedFlavors([]); }}
              className={`px-6 py-3 rounded-xl border-2 transition-all ${
                flavorCount === 2
                  ? 'border-orange-500 bg-orange-50 text-orange-700'
                  : 'border-gray-200 hover:border-orange-300'
              }`}
            >
              2 Sabores
            </button>
          </div>
        </div>
      )}

      {/* Flavor Selection */}
      <div className="mb-6">
        <h4 className="text-lg font-semibold mb-3">
          Sabores {flavorCount > 1 && `(${selectedFlavors.length}/${flavorCount})`}:
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {flavors.map((flavor) => (
            <button
              key={flavor}
              onClick={() => handleFlavorToggle(flavor)}
              disabled={!selectedFlavors.includes(flavor) && selectedFlavors.length >= flavorCount}
              className={`p-3 rounded-lg border-2 text-sm transition-all ${
                selectedFlavors.includes(flavor)
                  ? 'border-orange-500 bg-orange-50 text-orange-700'
                  : selectedFlavors.length >= flavorCount
                  ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                  : 'border-gray-200 hover:border-orange-300'
              }`}
            >
              {flavor}
            </button>
          ))}
        </div>
      </div>

      {/* Add to Cart Button */}
      <button
        onClick={handleAddToCart}
        disabled={!canAddToCart()}
        className={`w-full py-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${
          canAddToCart()
            ? 'bg-orange-600 text-white hover:bg-orange-700'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
      >
        <Plus className="w-5 h-5" />
        Adicionar ao Carrinho
      </button>
    </div>
  );
};

export default PizzaMenu;