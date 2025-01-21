// ProductRow.tsx
import React from 'react';
import { Input } from "./components/ui/input";
import { Button } from "./components/ui/button";
import { TableCell, TableRow } from "./components/ui/table";
import { Trash2 } from 'lucide-react';
import { Product, Location } from './lib/types';

interface ProductRowProps {
    product: Product;
    locations: Location[];
    onUpdate: (id: string, field: string, value: any) => void;
    onDelete: (id: string) => void;
}

export const ProductRow: React.FC<ProductRowProps> = ({
    product,
    locations,
    onUpdate,
    onDelete
}) => {
    const handleQuantityChange = (location: string, value: string) => {
        const numValue = parseInt(value) || 0;
        if (numValue >= 0) {
            onUpdate(product.id, location, numValue);
        }
    };

    return (
        <TableRow>
            <TableCell>
                <Input
                    value={product.name}
                    onChange={e => onUpdate(product.id, 'name', e.target.value)}
                    placeholder="Product name"
                    className={!product.name ? 'border-red-500' : ''}
                />
            </TableCell>
            {locations.map(location => (
                <TableCell key={location}>
                    <Input
                        type="number"
                        value={product.quantities[location]}
                        onChange={e => handleQuantityChange(location, e.target.value)}
                        min="0"
                        className="w-24"
                    />
                </TableCell>
            ))}
            <TableCell>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(product.id)}
                >
                    <Trash2 className="w-4 h-4" />
                </Button>
            </TableCell>
        </TableRow>
    );
};