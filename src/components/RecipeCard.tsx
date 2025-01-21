// RecipeCard.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Recipe } from '../lib/types';
import { formatNumber } from '../lib/utils';

interface RecipeCardProps {
    recipe: Recipe;
    scaling?: number;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, scaling = 1 }) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="capitalize">
                    {recipe.productId.replace(/-/g, ' ')}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Ingredient</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Unit</TableHead>
                            {scaling !== 1 && <TableHead>Scaled Amount</TableHead>}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {recipe.ingredients.map((ingredient, idx) => (
                            <TableRow key={idx}>
                                <TableCell>{ingredient.name}</TableCell>
                                <TableCell>{formatNumber(ingredient.amount)}</TableCell>
                                <TableCell>{ingredient.unit}</TableCell>
                                {scaling !== 1 && (
                                    <TableCell>
                                        {formatNumber(ingredient.amount * scaling)} {ingredient.unit}
                                    </TableCell>
                                )}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
};