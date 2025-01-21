import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { Input } from "./components/ui/input";
import { Button } from "./components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./components/ui/table";
import { Alert, AlertDescription } from "./components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { Plus, Trash2, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';
import { formatAmount } from './lib/utils';

interface OrderItem {
  id: string;
  drinkType: string;
  quantity: number;
}

interface CustomerOrder {
  id: string;
  customerName: string;
  items: OrderItem[];
}

type Recipes = {
  [key: string]: {
    name: string;
    ingredients: {
      name: string;
      amount: number;
      unit: string;
      scaling: number;
    }[];
  };
};

const BottledDrinksCalculator = () => {
  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [ordersExpanded, setOrdersExpanded] = useState(true);
  
  const recipes: Recipes = {
    'peach-palmer': {
      name: 'Peach Palmer',
      ingredients: [
        { name: 'Peach Tea', amount: 448, unit: 'ml', scaling: 1 },
        { name: 'Lemon Concentrate', amount: 74, unit: 'ml', scaling: 1 },
        { name: 'Water', amount: 375, unit: 'ml', scaling: 1 },
        { name: 'Cane Syrup', amount: 160, unit: 'ml', scaling: 1 }
      ]
    },
    'strawberry-lemonade': {
      name: 'Strawberry Lemonade',
      ingredients: [
        { name: 'Water', amount: 743, unit: 'ml', scaling: 1 },
        { name: 'Lemon Concentrate', amount: 144, unit: 'ml', scaling: 1 },
        { name: 'Strawberry Syrup', amount: 96, unit: 'ml', scaling: 1 },
        { name: 'Cane Syrup', amount: 64, unit: 'ml', scaling: 1 }
      ]
    },
    'cold-brew': {
      name: 'Cold Brew',
      ingredients: [
        { name: 'Cold Brew Concentrate', amount: 496, unit: 'ml', scaling: 1 },
        { name: 'Water', amount: 496, unit: 'ml', scaling: 1 }
      ]
    }
  };

  const createInitialOrderItems = () => {
    return Object.entries(recipes).map(([recipeId, _]) => ({
      id: `${Date.now()}-${recipeId}`,
      drinkType: recipeId,
      quantity: 0
    }));
  };

  const addOrder = () => {
    const newOrder: CustomerOrder = {
      id: Date.now().toString(),
      customerName: '',
      items: createInitialOrderItems()
    };
    setOrders([...orders, newOrder]);
  };

  const updateOrderCustomer = (orderId: string, customerName: string) => {
    setOrders(orders.map(order =>
      order.id === orderId ? { ...order, customerName } : order
    ));
  };

  const updateOrderItem = (orderId: string, itemId: string, quantity: number) => {
    setOrders(orders.map(order => {
      if (order.id === orderId) {
        return {
          ...order,
          items: order.items.map(item => {
            if (item.id === itemId) {
              return { ...item, quantity: Math.max(0, quantity) };
            }
            return item;
          })
        };
      }
      return order;
    }));
  };

  const deleteOrder = (orderId: string) => {
    setOrders(orders.filter(order => order.id !== orderId));
  };

  const resetOrders = () => {
    if (confirm('Are you sure you want to clear all orders?')) {
      setOrders([]);
    }
  };

  const getTotalsByDrink = () => {
    return orders.reduce((acc, order) => {
      order.items.forEach(item => {
        const drinkName = recipes[item.drinkType].name;
        acc[drinkName] = (acc[drinkName] || 0) + item.quantity;
      });
      return acc;
    }, {} as { [key: string]: number });
  };

  const calculateBatchRecipe = (drinkType: string, bottleCount: number) => {
    const recipe = recipes[drinkType];
    return recipe.ingredients.map(ingredient => ({
      ...ingredient,
      amount: ingredient.amount * bottleCount
    }));
  };

  const getTotalIngredients = () => {
    const totals: { [key: string]: { amount: number; unit: string } } = {};
    
    orders.forEach(order => {
      order.items.forEach(item => {
        const recipe = recipes[item.drinkType];
        recipe.ingredients.forEach(ingredient => {
          if (!totals[ingredient.name]) {
            totals[ingredient.name] = { amount: 0, unit: ingredient.unit };
          }
          totals[ingredient.name].amount += ingredient.amount * item.quantity;
        });
      });
    });

    return totals;
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Bottling Calculator</span>
            <div className="space-x-2">
              <Button onClick={addOrder} size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Order
              </Button>
              <Button onClick={resetOrders} variant="outline" size="sm">
                <RefreshCw className="w-4 h-4 mr-2" />
                Reset All
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="orders" className="space-y-4">
            <TabsList>
              <TabsTrigger value="orders">Orders</TabsTrigger>
              <TabsTrigger value="recipes">Batch Recipes</TabsTrigger>
              <TabsTrigger value="totals">Total Ingredients</TabsTrigger>
            </TabsList>

            <TabsContent value="orders">
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <Button 
                    variant="outline" 
                    onClick={() => setOrdersExpanded(!ordersExpanded)}
                  >
                    {ordersExpanded ? (
                      <>
                        <ChevronUp className="w-4 h-4 mr-2" />
                        Collapse Orders
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-4 h-4 mr-2" />
                        Expand Orders
                      </>
                    )}
                  </Button>
                </div>

                {orders.length === 0 && (
                  <Alert>
                    <AlertDescription>No orders available. Please add an order.</AlertDescription>
                  </Alert>
                )}

                {ordersExpanded && orders.length > 0 && (
                  <div className="space-y-4">
                    {orders.map(order => (
                      <Card key={order.id} className="relative">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute top-2 right-2"
                          onClick={() => deleteOrder(order.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                        <CardHeader>
                          <CardTitle>
                            <Input
                              value={order.customerName}
                              onChange={(e) => updateOrderCustomer(order.id, e.target.value)}
                              placeholder="Customer name"
                              className="max-w-md"
                            />
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Drink Type</TableHead>
                                <TableHead>Quantity</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {order.items.map(item => (
                                <TableRow key={item.id}>
                                  <TableCell>{recipes[item.drinkType].name}</TableCell>
                                  <TableCell>
                                    <Input
                                      type="number"
                                      value={item.quantity}
                                      onChange={(e) => updateOrderItem(order.id, item.id, parseInt(e.target.value) || 0)}
                                      min="0"
                                      className="w-24"
                                    />
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                {orders.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Order Totals</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Drink</TableHead>
                            <TableHead>Total Bottles</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {Object.entries(getTotalsByDrink())
                            .filter(([_, total]) => total > 0)
                            .map(([drink, total]) => (
                              <TableRow key={drink}>
                                <TableCell>{drink}</TableCell>
                                <TableCell>{total}</TableCell>
                              </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            <TabsContent value="recipes">
              <div className="space-y-6">
                {Object.entries(getTotalsByDrink())
                  .filter(([_, total]) => total > 0)
                  .map(([drinkName, totalBottles]) => (
                    <Card key={drinkName}>
                      <CardHeader>
                        <CardTitle>
                          {drinkName} ({totalBottles} bottles)
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Ingredient</TableHead>
                              <TableHead>Amount</TableHead>
                              <TableHead>Unit</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {calculateBatchRecipe(
                              Object.entries(recipes).find(([_, r]) => r.name === drinkName)?.[0] || '',
                              totalBottles
                            ).map((ingredient, idx) => {
                              const formatted = formatAmount(ingredient.amount, ingredient.unit);
                              return (
                                <TableRow key={idx}>
                                  <TableCell>{ingredient.name}</TableCell>
                                  <TableCell>{formatted.amount}</TableCell>
                                  <TableCell>{formatted.unit}</TableCell>
                                </TableRow>
                              );
                            })}
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="totals">
              <Card>
                <CardHeader>
                  <CardTitle>Total Ingredients Needed</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Ingredient</TableHead>
                        <TableHead>Total Amount</TableHead>
                        <TableHead>Unit</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {Object.entries(getTotalIngredients())
                        .filter(([_, { amount }]) => amount > 0)
                        .map(([name, { amount, unit }]) => {
                          const formatted = formatAmount(amount, unit);
                          return (
                            <TableRow key={name}>
                              <TableCell>{name}</TableCell>
                              <TableCell>{formatted.amount}</TableCell>
                              <TableCell>{formatted.unit}</TableCell>
                            </TableRow>
                          );
                        })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default BottledDrinksCalculator;