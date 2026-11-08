'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { formatPrice } from '@/lib/utils';
import { useCart } from '@/lib/cart-context';
import { CustomizationSelection, CartRestaurantInfo } from '@/types';
import { X, Check, Flame, Clock, Plus, Minus, ShoppingBag } from 'lucide-react';

export interface CustomizationOptionData {
  id: string;
  name: string;
  price: number; // in paise
  isDefault: boolean;
}

export interface CustomizationGroupData {
  id: string;
  name: string;
  minSelections: number;
  maxSelections: number;
  isRequired: boolean;
  options: CustomizationOptionData[];
}

export interface ModalMenuItem {
  id: string;
  name: string;
  description: string;
  image: string;
  price: number; // in paise
  isVeg: boolean;
  preparationTime: number;
  spicyLevel: string;
  customizationGroups?: CustomizationGroupData[];
}

interface CustomizationModalProps {
  item: ModalMenuItem | null;
  restaurant: CartRestaurantInfo | null;
  onClose: () => void;
}

export default function CustomizationModal({
  item,
  restaurant,
  onClose,
}: CustomizationModalProps) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [specialInstructions, setSpecialInstructions] = useState('');

  // Selected options state: key is groupId, value is array of optionIds
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string[]>>(() => {
    if (!item?.customizationGroups) return {};
    const initial: Record<string, string[]> = {};
    item.customizationGroups.forEach((group) => {
      const defaultOpt = group.options.find((o) => o.isDefault) || (group.isRequired ? group.options[0] : null);
      if (defaultOpt) {
        initial[group.id] = [defaultOpt.id];
      } else {
        initial[group.id] = [];
      }
    });
    return initial;
  });

  if (!item || !restaurant) return null;

  const handleToggleOption = (
    group: CustomizationGroupData,
    option: CustomizationOptionData
  ) => {
    setSelectedOptions((prev) => {
      const current = prev[group.id] || [];
      const isSelected = current.includes(option.id);

      if (group.maxSelections === 1) {
        // Radio style: select this one
        return { ...prev, [group.id]: [option.id] };
      }

      // Checkbox style
      if (isSelected) {
        return { ...prev, [group.id]: current.filter((id) => id !== option.id) };
      } else {
        if (current.length < group.maxSelections) {
          return { ...prev, [group.id]: [...current, option.id] };
        }
        return prev;
      }
    });
  };

  // Calculate total price with customizations
  let extraCost = 0;
  const selectionsSummary: CustomizationSelection[] = [];

  if (item.customizationGroups) {
    item.customizationGroups.forEach((group) => {
      const selectedIds = selectedOptions[group.id] || [];
      group.options.forEach((opt) => {
        if (selectedIds.includes(opt.id)) {
          extraCost += opt.price;
          selectionsSummary.push({
            groupId: group.id,
            groupName: group.name,
            optionId: opt.id,
            optionName: opt.name,
            price: opt.price,
          });
        }
      });
    });
  }

  const singleItemPrice = item.price + extraCost;
  const finalTotalPrice = singleItemPrice * quantity;

  const handleAddToCart = () => {
    addItem(
      {
        menuItemId: item.id,
        restaurantId: restaurant.id,
        restaurantName: restaurant.name,
        name: item.name,
        image: item.image,
        price: item.price,
        quantity,
        isVeg: item.isVeg,
        customizations: selectionsSummary,
        specialInstructions: specialInstructions.trim() || undefined,
      },
      restaurant
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-vanilla-espresso/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-vanilla-cream rounded-3xl max-w-xl w-full max-h-[90vh] flex flex-col border border-vanilla-caramel/30 shadow-luxury overflow-hidden">
        {/* Header with image */}
        <div className="relative h-48 w-full bg-vanilla-ivory flex-shrink-0">
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-vanilla-cream via-transparent to-black/30" />
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/80 hover:bg-white text-vanilla-espresso flex items-center justify-center shadow-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Veg badge */}
          <div className="absolute top-4 left-4 bg-white/95 rounded-lg px-2.5 py-1 flex items-center gap-1.5 shadow-sm">
            <span
              className={`w-2 h-2 rounded-full ${
                item.isVeg ? 'bg-emerald-600' : 'bg-red-600'
              }`}
            />
            <span className="text-[10px] font-bold tracking-wider uppercase text-gray-700">
              {item.isVeg ? 'Pure Veg' : 'Non-Veg'}
            </span>
          </div>

          <div className="absolute bottom-3 left-6 right-6">
            <h3 className="font-serif text-2xl font-bold text-vanilla-espresso">
              {item.name}
            </h3>
            <div className="flex items-center gap-3 text-xs text-vanilla-chocolate/80 mt-1">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-vanilla-caramel" />
                {item.preparationTime} mins
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-amber-600" />
                {item.spicyLevel}
              </span>
            </div>
          </div>
        </div>

        {/* Scrollable Customization Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <p className="text-xs text-vanilla-chocolate/80 leading-relaxed">
            {item.description}
          </p>

          {/* Customization groups */}
          {item.customizationGroups && item.customizationGroups.length > 0 ? (
            item.customizationGroups.map((group) => {
              const selectedIds = selectedOptions[group.id] || [];
              return (
                <div key={group.id} className="space-y-3">
                  <div className="flex items-center justify-between pb-1.5 border-b border-vanilla-caramel/15">
                    <div>
                      <h4 className="font-serif text-base font-bold text-vanilla-espresso">
                        {group.name}
                      </h4>
                      <p className="text-[11px] text-vanilla-chocolate/70">
                        {group.maxSelections === 1
                          ? 'Select 1 option'
                          : `Choose up to ${group.maxSelections} options`}
                        {group.isRequired && ' (Required)'}
                      </p>
                    </div>
                    {group.isRequired && (
                      <span className="text-[10px] uppercase font-bold tracking-wider bg-vanilla-peach/40 text-vanilla-chocolate px-2 py-0.5 rounded-full">
                        Required
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-2">
                    {group.options.map((opt) => {
                      const isSelected = selectedIds.includes(opt.id);
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => handleToggleOption(group, opt)}
                          className={`w-full text-left p-3 rounded-2xl border transition-all flex items-center justify-between ${
                            isSelected
                              ? 'bg-vanilla-ivory/80 border-vanilla-caramel shadow-sm'
                              : 'bg-white/60 border-vanilla-caramel/15 hover:bg-white'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-4 h-4 rounded-full flex items-center justify-center border transition-colors ${
                                isSelected
                                  ? 'bg-vanilla-caramel border-vanilla-caramel text-white'
                                  : 'border-gray-300 bg-white'
                              }`}
                            >
                              {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                            </div>
                            <span className="text-xs font-semibold text-vanilla-espresso">
                              {opt.name}
                            </span>
                          </div>
                          <span className="text-xs font-bold text-vanilla-chocolate">
                            {opt.price === 0 ? 'Included' : `+${formatPrice(opt.price)}`}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-2 text-xs text-vanilla-chocolate/60">
              No bespoke customizations required for this dish.
            </div>
          )}

          {/* Special Instructions */}
          <div className="space-y-2 pt-2">
            <label className="block font-serif text-sm font-bold text-vanilla-espresso">
              Special Instructions to Chef
            </label>
            <textarea
              rows={2}
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              placeholder="e.g., Less salt, extra crispy frites, allergen note..."
              className="w-full bg-white/70 border border-vanilla-caramel/25 rounded-2xl p-3 text-xs text-vanilla-espresso placeholder-gray-400 focus:outline-none focus:border-vanilla-caramel"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-5 border-t border-vanilla-caramel/20 bg-white/80 flex items-center justify-between gap-4">
          {/* Quantity Controls */}
          <div className="flex items-center gap-3 bg-vanilla-ivory rounded-full px-3 py-1.5 border border-vanilla-caramel/25">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-vanilla-chocolate shadow-sm hover:bg-vanilla-peach/30 transition-colors"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="font-bold text-sm text-vanilla-espresso w-5 text-center">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-vanilla-chocolate shadow-sm hover:bg-vanilla-peach/30 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Add to basket CTA */}
          <button
            onClick={handleAddToCart}
            className="flex-1 py-3.5 px-6 rounded-full bg-vanilla-espresso hover:bg-vanilla-chocolate text-vanilla-cream font-bold text-xs uppercase tracking-wider flex items-center justify-between shadow-soft-glow transition-all active:scale-95"
          >
            <span className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-vanilla-peach" />
              Add to Basket
            </span>
            <span className="font-mono text-sm tracking-normal">
              {formatPrice(finalTotalPrice)}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

