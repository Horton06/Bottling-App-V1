// useRecipes.ts
import { useState } from 'react';
import { Recipe } from './types';

const defaultRecipes: Record<string, Recipe> = {
    'peach-palmer': {
        productId: 'peach-palmer',
        ingredients: [
            { name: 'Peach Tea', amount: 448, unit: 'ml', scaling: 1 },
            { name: 'Lemon Concentrate', amount: 74, unit: 'ml', scaling: 1 },
            { name: 'Water', amount: 375, unit: 'ml', scaling: 1 },
            { name: 'Cane Syrup', amount: 160, unit: 'g', scaling: 1 }
        ]
    },
    'strawberry-lemonade': {
        productId: 'strawberry-lemonade',
        ingredients: [
            { name: 'Water', amount: 743, unit: 'ml', scaling: 1 },
            { name: 'Lemon Concentrate', amount: 144, unit: 'ml', scaling: 1 },
            { name: 'Strawberry Syrup', amount: 96, unit: 'g', scaling: 1 },
            { name: 'Cane Syrup', amount: 64, unit: 'g', scaling: 1 }
        ]
    },
    'cold-brew': {
        productId: 'cold-brew',
        ingredients: [
            { name: 'Cold Brew Concentrate', amount: 496, unit: 'ml', scaling: 1 },
            { name: 'Water', amount: 496, unit: 'ml', scaling: 1 }
        ]
    }
};

export const useRecipes = () => {
    const [recipes, setRecipes] = useState<Record<string, Recipe>>(defaultRecipes);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const addRecipe = (recipe: Recipe) => {
        setRecipes(prev => ({
            ...prev,
            [recipe.productId]: recipe
        }));
    };

    const updateRecipe = (productId: string, updates: Partial<Recipe>) => {
        setRecipes(prev => ({
            ...prev,
            [productId]: {
                ...prev[productId],
                ...updates
            }
        }));
    };

    const deleteRecipe = (productId: string) => {
        setRecipes(prev => {
            const newRecipes = { ...prev };
            delete newRecipes[productId];
            return newRecipes;
        });
    };

    return {
        recipes,
        loading,
        error,
        addRecipe,
        updateRecipe,
        deleteRecipe
    };
};