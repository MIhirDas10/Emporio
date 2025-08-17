import React from "react";
import { Minus, Plus, Trash } from "lucide-react";
import { useCartStore } from "../stores/useCartStore";

const CartItem = ({ item }) => {
  const { removeFromCart, updateQuantity } = useCartStore();

  return (
    <div className="grid grid-cols-[1fr_auto_auto] items-center border-b border-gray-700 py-4 px-2 hover:bg-gray-800/50 transition-colors gap-6">
      <div className="flex items-center gap-4">
        <img
          src={item.image}
          alt={item.name}
          className="h-16 w-16 object-cover rounded-md border border-gray-700 flex-shrink-0"
        />

        <div>
          <span className="text-sm font-bold text-white uppercase tracking-wide block">
            {item.name}
          </span>

          <p className="text-sm text-gray-400">{item.description}</p>
          {item.color && (
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-gray-400">Color:</span>
              <div
                className="h-3 w-3 rounded-full border border-gray-500"
                style={{ backgroundColor: item.color }}
              />
              <button className="px-2 py-0.5 text-xs rounded-full border border-gray-600 text-gray-300 hover:border-emerald-500 transition-colors">
                Edit
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 justify-center">
        <span className="text-xs text-gray-400">Qty:</span>
        <div className="flex items-center rounded-full border border-gray-600 overflow-hidden">
          <button
            className="px-2 py-2 bg-gray-900 hover:bg-red-700 transition-colors"
            onClick={() => updateQuantity(item._id, item.quantity - 1)}
          >
            <Minus size={14} className="text-white" />
          </button>
          <span className="px-3 py-1 bg-white text-black text-sm">
            {item.quantity}
          </span>
          <button
            className="px-2 py-2 bg-gray-900 hover:bg-emerald-600 transition-colors"
            onClick={() => updateQuantity(item._id, item.quantity + 1)}
          >
            <Plus
              size={14}
              className="text-white"
              onClick={() => updateQuantity(item._id, item.quantity + 1)}
            />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-4 justify-end">
        <span className="text-lg font-bold text-white whitespace-nowrap">
          {item.price}$
        </span>
        <button
          onClick={() => removeFromCart(item._id)}
          className="px-1 py-1 text-xs rounded-full border border-gray-600 text-gray-300 hover:border-red-500 hover:text-red-400 transition-colors"
        >
          <Trash size={20} />
        </button>
      </div>
    </div>
  );
};

export default CartItem;
