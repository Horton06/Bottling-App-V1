import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Product, Recipe, ValidationError } from './types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const validateProduct = (product: Product): ValidationError[] => {
    const errors: ValidationError[] = [];
    if (!product.name.trim()) {
        errors.push({
            field: 'name',
            message: 'Product name is required'
        });
    }
    Object.entries(product.quantities).forEach(([location, quantity]) => {
        if (quantity < 0) {
            errors.push({
                field: `quantities.${location}`,
                message: `${location} quantity cannot be negative`
            });
        }
    });
    return errors;
};

export const calculateIngredientTotals = (
    products: Product[],
    recipes: Record<string, Recipe>
): Record<string, { amount: number; unit: string }> => {
    const totals: Record<string, { amount: number; unit: string }> = {};
    products.forEach(product => {
        const recipe = recipes[product.id];
        if (!recipe) return;
        const totalQuantity = Object.values(product.quantities)
            .reduce((a, b) => a + b, 0);
        recipe.ingredients.forEach(ingredient => {
            const scaledAmount = ingredient.amount * totalQuantity * ingredient.scaling;
            if (!totals[ingredient.name]) {
                totals[ingredient.name] = { amount: 0, unit: ingredient.unit };
            }
            totals[ingredient.name].amount += scaledAmount;
        });
    });
    return totals;
};

export const formatNumber = (num: number): string => {
    return num.toFixed(2).replace(/\.?0+$/, '');
};

export const formatAmount = (amount: number, unit: string): { amount: string; unit: string } => {
  if (unit === 'ml' && amount >= 1000) {
    return {
      amount: `${(amount / 1000).toFixed(2)}L (${amount.toFixed(0)}ml)`,
      unit: ''  // Unit is included in the amount string for better readability
    };
  }
  
  return {
    amount: amount.toFixed(1),
    unit: unit
  };
};

export const STORAGE_KEY = 'bottledDrinksProducts';

export const saveToLocalStorage = (products: Product[]): void => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    } catch (error) {
        console.error('Error saving to localStorage:', error);
    }
};

export const loadFromLocalStorage = (): Product[] => {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved ? JSON.parse(saved) : [];
    } catch (error) {
        console.error('Error loading from localStorage:', error);
        return [];
    }
};