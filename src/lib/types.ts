// types.ts
export type Location = 'Lodgic' | 'Bake' | 'Brew';

export type Product = {
    id: string;
    name: string;
    quantities: Record<Location, number>;
};

export type Ingredient = {
    name: string;
    amount: number;
    unit: string;
    scaling: number;
};

export type Recipe = {
    productId: string;
    ingredients: Ingredient[];
};

export type ValidationError = {
    field: string;
    message: string;
};