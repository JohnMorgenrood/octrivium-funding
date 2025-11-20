"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Plus, Edit, Trash2, Package } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Product {
  id: string;
  name: string;
  description: string | null;
  unitPrice: number;
  costPrice: number | null;
  category: string | null;
  sku: string | null;
  taxable: boolean;
  active: boolean;
}

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    unitPrice: "",
    costPrice: "",
    category: "",
    sku: "",
    taxable: true,
    active: true,
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/accounting/products");
      if (!response.ok) throw new Error("Failed to fetch products");
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load products",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      unitPrice: "",
      costPrice: "",
      category: "",
      sku: "",
      taxable: true,
      active: true,
    });
    setEditingId(null);
  };

  const handleOpenNew = () => {
    resetForm();
    setIsOpen(true);
  };

  const handleOpenEdit = (product: Product) => {
    setFormData({
      name: product.name,
      description: product.description || "",
      unitPrice: product.unitPrice.toString(),
      costPrice: product.costPrice?.toString() || "",
      category: product.category || "",
      sku: product.sku || "",
      taxable: product.taxable,
      active: product.active,
    });
    setEditingId(product.id);
    setIsOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Product name is required",
        variant: "destructive",
      });
      return;
    }

    if (!formData.unitPrice || parseFloat(formData.unitPrice) < 0) {
      toast({
        title: "Error",
        description: "Valid unit price is required",
        variant: "destructive",
      });
      return;
    }

    const productData = {
      name: formData.name,
      description: formData.description || null,
      unitPrice: parseFloat(formData.unitPrice),
      costPrice: formData.costPrice ? parseFloat(formData.costPrice) : null,
      category: formData.category || null,
      sku: formData.sku || null,
      taxable: formData.taxable,
      active: formData.active,
    };

    try {
      const url = editingId
        ? `/api/accounting/products/${editingId}`
        : "/api/accounting/products";
      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      });

      if (!response.ok) throw new Error("Failed to save product");

      toast({
        title: "Success",
        description: editingId ? "Product updated" : "Product created",
      });
      setIsOpen(false);
      resetForm();
      fetchProducts();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save product",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const response = await fetch(`/api/accounting/products/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete product");

      toast({
        title: "Success",
        description: "Product deleted",
      });
      fetchProducts();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive",
      });
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-ZA", {
      style: "currency",
      currency: "ZAR",
    }).format(amount);
  };

  const calculateMargin = (unitPrice: number, costPrice: number | null) => {
    if (!costPrice || costPrice === 0) return null;
    const margin = ((unitPrice - costPrice) / unitPrice) * 100;
    return margin.toFixed(1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Products</h2>
          <p className="text-muted-foreground">
            Manage your product catalog for quick invoice entry
          </p>
        </div>
        <Button onClick={handleOpenNew}>
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>

      {/* Products Grid */}
      {products.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-center">
              No products yet. Create your first product to get started.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <Card key={product.id} className={!product.active ? "opacity-60" : ""}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate">{product.name}</h3>
                    {product.category && (
                      <span className="text-xs text-muted-foreground">
                        {product.category}
                      </span>
                    )}
                  </div>
                  <div className="flex gap-1 ml-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleOpenEdit(product)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(product.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                </div>

                {product.description && (
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {product.description}
                  </p>
                )}

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Price:</span>
                    <span className="font-medium">
                      {formatCurrency(product.unitPrice)}
                    </span>
                  </div>
                  {product.costPrice && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Cost:</span>
                        <span>{formatCurrency(product.costPrice)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Margin:</span>
                        <span className="text-green-600 font-medium">
                          {calculateMargin(product.unitPrice, product.costPrice)}%
                        </span>
                      </div>
                    </>
                  )}
                  {product.sku && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">SKU:</span>
                      <span className="text-xs">{product.sku}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="text-muted-foreground">Status:</span>
                    <span
                      className={`text-xs font-medium ${
                        product.active ? "text-green-600" : "text-gray-500"
                      }`}
                    >
                      {product.active ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingId ? "Edit Product" : "Add New Product"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">
                  Product Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="e.g., Web Design Service"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Optional product description"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="unitPrice">
                    Unit Price <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="unitPrice"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.unitPrice}
                    onChange={(e) =>
                      setFormData({ ...formData, unitPrice: e.target.value })
                    }
                    placeholder="0.00"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="costPrice">Cost Price</Label>
                  <Input
                    id="costPrice"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.costPrice}
                    onChange={(e) =>
                      setFormData({ ...formData, costPrice: e.target.value })
                    }
                    placeholder="Optional"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    placeholder="e.g., Services, Products"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="sku">SKU</Label>
                  <Input
                    id="sku"
                    value={formData.sku}
                    onChange={(e) =>
                      setFormData({ ...formData, sku: e.target.value })
                    }
                    placeholder="Optional product code"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="taxable"
                    checked={formData.taxable}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, taxable: checked })
                    }
                  />
                  <Label htmlFor="taxable">Taxable (VAT applicable)</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="active"
                    checked={formData.active}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, active: checked })
                    }
                  />
                  <Label htmlFor="active">Active</Label>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                {editingId ? "Update Product" : "Create Product"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
