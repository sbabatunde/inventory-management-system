// src/modules/procurement/components/Order/PurchaseOrderFormModal.tsx

import React, { useState, useEffect } from "react";
import {
  Modal,
  Input,
  Select,
  Button,
  DataTable,
} from "../../../../shared/components/UI";
import { PurchaseOrder } from "../../types";
import { purchaseOrderService } from "../../services/purchase-order.service";
import { supplierService } from "../../services/supplier.service";
import { storeService } from "../../../inventory/services/store.service";
import { stockItemService } from "../../../inventory/services/stock-item.service";
import {
  showSuccess,
  showError,
  showLoading,
  dismissToast,
} from "../../../../shared/utils/toast";

interface PurchaseOrderFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface FormItem {
  stock_item_id: number;
  stock_item_name?: string;
  stock_item_code?: string;
  quantity_ordered: number;
  unit_of_measure: string;
  unit_price: number;
  total_price: number;
}

const PurchaseOrderFormModal: React.FC<PurchaseOrderFormModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [formData, setFormData] = useState({
    supplier_id: "" as number | "",
    store_id: "" as number | "",
    order_date: new Date().toISOString().split("T")[0],
    expected_delivery_date: "",
    tax_amount: 0,
    discount_amount: 0,
    shipping_cost: 0,
    notes: "",
    terms_and_conditions: "",
  });
  const [items, setItems] = useState<FormItem[]>([]);
  const [suppliers, setSuppliers] = useState<
    Array<{ id: number; name: string; code: string }>
  >([]);
  const [stores, setStores] = useState<
    Array<{ id: number; name: string; code: string }>
  >([]);
  const [stockItems, setStockItems] = useState<
    Array<{ id: number; name: string; code: string; unit_of_measure: string }>
  >([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Item selection
  const [selectedItemId, setSelectedItemId] = useState<number | "">("");
  const [selectedQuantity, setSelectedQuantity] = useState<number>(1);
  const [selectedUnitPrice, setSelectedUnitPrice] = useState<number>(0);

  useEffect(() => {
    if (isOpen) {
      fetchSuppliers();
      fetchStores();
      fetchStockItems();
      resetForm();
    }
  }, [isOpen]);

  const fetchSuppliers = async (): Promise<void> => {
    try {
      const response = await supplierService.getSuppliers({
        per_page: 100,
        status: "active",
      });
      setSuppliers(response.suppliers);
    } catch (error: any) {
      showError(error.message || "Failed to load suppliers");
    }
  };

  const fetchStores = async (): Promise<void> => {
    try {
      const response = await storeService.getStores({
        per_page: 100,
        status: "active",
      });
      setStores(response.stores);
    } catch (error: any) {
      showError(error.message || "Failed to load stores");
    }
  };

  const fetchStockItems = async (): Promise<void> => {
    try {
      const response = await stockItemService.getStockItems({
        per_page: 100,
        status: "active",
      });
      setStockItems(response.stockItems);
    } catch (error: any) {
      showError(error.message || "Failed to load stock items");
    }
  };

  const resetForm = (): void => {
    setFormData({
      supplier_id: "",
      store_id: "",
      order_date: new Date().toISOString().split("T")[0],
      expected_delivery_date: "",
      tax_amount: 0,
      discount_amount: 0,
      shipping_cost: 0,
      notes: "",
      terms_and_conditions: "",
    });
    setItems([]);
    setSelectedItemId("");
    setSelectedQuantity(1);
    setSelectedUnitPrice(0);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.supplier_id) {
      newErrors.supplier_id = "Supplier is required";
    }

    if (!formData.store_id) {
      newErrors.store_id = "Store is required";
    }

    if (items.length === 0) {
      newErrors.items = "At least one item is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddItem = (): void => {
    if (!selectedItemId || selectedQuantity <= 0 || selectedUnitPrice < 0) {
      showError("Please select an item and enter valid quantity and price");
      return;
    }

    const existingItem = items.find(
      (item) => item.stock_item_id === selectedItemId,
    );

    if (existingItem) {
      showError("Item already added to order");
      return;
    }

    const stockItem = stockItems.find((item) => item.id === selectedItemId);

    if (!stockItem) {
      showError("Stock item not found");
      return;
    }

    const newItem: FormItem = {
      stock_item_id: stockItem.id,
      stock_item_name: stockItem.name,
      stock_item_code: stockItem.code,
      quantity_ordered: selectedQuantity,
      unit_of_measure: stockItem.unit_of_measure,
      unit_price: selectedUnitPrice,
      total_price: selectedQuantity * selectedUnitPrice,
    };

    setItems((prev) => [...prev, newItem]);
    setSelectedItemId("");
    setSelectedQuantity(1);
    setSelectedUnitPrice(0);
  };

  const handleRemoveItem = (index: number): void => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    const loadingToast = showLoading("Creating purchase order...");

    try {
      const submitData = {
        ...formData,
        items: items.map((item) => ({
          stock_item_id: item.stock_item_id,
          quantity_ordered: item.quantity_ordered,
          unit_of_measure: item.unit_of_measure,
          unit_price: item.unit_price,
        })),
      };

      await purchaseOrderService.createOrder(submitData);

      dismissToast(loadingToast);
      showSuccess("Purchase order created successfully");
      onSuccess();
      onClose();
    } catch (error: any) {
      dismissToast(loadingToast);
      const message =
        error.response?.data?.message || "Failed to create purchase order";
      showError(message);

      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const itemColumns = [
    {
      key: "item",
      header: "Item",
      render: (item: FormItem) => (
        <div>
          <p className="font-medium text-slate-900">{item.stock_item_name}</p>
          <p className="text-xs text-slate-400">{item.stock_item_code}</p>
        </div>
      ),
    },
    {
      key: "quantity",
      header: "Quantity",
      render: (item: FormItem) => (
        <span className="font-semibold text-slate-900">
          {item.quantity_ordered} {item.unit_of_measure}
        </span>
      ),
    },
    {
      key: "unit_price",
      header: "Unit Price",
      render: (item: FormItem) => (
        <span className="text-sm text-slate-600">
          {new Intl.NumberFormat("en-NG", {
            style: "currency",
            currency: "NGN",
          }).format(item.unit_price)}
        </span>
      ),
    },
    {
      key: "total",
      header: "Total",
      render: (item: FormItem) => (
        <span className="font-semibold text-slate-900">
          {new Intl.NumberFormat("en-NG", {
            style: "currency",
            currency: "NGN",
          }).format(item.total_price)}
        </span>
      ),
    },
    {
      key: "actions",
      header: "",
      render: (item: FormItem, index?: number) => (
        <button
          onClick={() => handleRemoveItem(index!)}
          className="w-8 h-8 flex items-center justify-center rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors"
        >
          <i className="fas fa-trash text-xs" />
        </button>
      ),
    },
  ];

  const subtotal = items.reduce((sum, item) => sum + item.total_price, 0);
  const total =
    subtotal +
    formData.tax_amount +
    formData.shipping_cost -
    formData.discount_amount;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Purchase Order"
      subtitle="Create a new purchase order"
      size="xl"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            isLoading={isSubmitting}
            icon="fa-paper-plane"
          >
            Create Order
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Supplier and Store */}
        <div>
          <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
            <i className="fas fa-info-circle text-amber-600" />
            Order Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Supplier"
              options={suppliers.map((supplier) => ({
                value: supplier.id,
                label: `${supplier.name} (${supplier.code})`,
              }))}
              value={formData.supplier_id}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  supplier_id: Number(e.target.value),
                })
              }
              error={errors.supplier_id}
              placeholder="Select supplier"
              required
            />
            <Select
              label="Store"
              options={stores.map((store) => ({
                value: store.id,
                label: `${store.name} (${store.code})`,
              }))}
              value={formData.store_id}
              onChange={(e) =>
                setFormData({ ...formData, store_id: Number(e.target.value) })
              }
              error={errors.store_id}
              placeholder="Select store"
              required
            />
            <Input
              label="Order Date"
              icon="fa-calendar"
              type="date"
              value={formData.order_date}
              onChange={(e) =>
                setFormData({ ...formData, order_date: e.target.value })
              }
              required
            />
            <Input
              label="Expected Delivery Date"
              icon="fa-calendar-check"
              type="date"
              value={formData.expected_delivery_date}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  expected_delivery_date: e.target.value,
                })
              }
            />
          </div>
        </div>

        {/* Items */}
        <div>
          <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
            <i className="fas fa-boxes-stacked text-amber-600" />
            Items
          </h3>

          <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 mb-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div className="md:col-span-1">
                <Select
                  options={stockItems.map((item) => ({
                    value: item.id,
                    label: `${item.name} (${item.code})`,
                  }))}
                  value={selectedItemId}
                  onChange={(e) => setSelectedItemId(Number(e.target.value))}
                  placeholder="Select item"
                />
              </div>
              <div className="md:col-span-1">
                <Input
                  type="number"
                  min="1"
                  placeholder="Quantity"
                  value={selectedQuantity}
                  onChange={(e) =>
                    setSelectedQuantity(parseInt(e.target.value) || 1)
                  }
                />
              </div>
              <div className="md:col-span-1">
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Unit Price"
                  value={selectedUnitPrice}
                  onChange={(e) =>
                    setSelectedUnitPrice(parseFloat(e.target.value) || 0)
                  }
                />
              </div>
              <div className="md:col-span-1">
                <Button onClick={handleAddItem} icon="fa-plus" fullWidth>
                  Add
                </Button>
              </div>
            </div>
          </div>

          {errors.items && (
            <p className="mt-2 text-xs text-rose-600 flex items-center gap-1">
              <i className="fas fa-circle-exclamation text-[10px]" />
              {errors.items}
            </p>
          )}

          {items.length > 0 && (
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <DataTable<FormItem>
                columns={itemColumns}
                data={items.map((item, index) => ({ ...item, id: index }))}
                showSerialNumbers={false}
              />
            </div>
          )}
        </div>

        {/* Financial Details */}
        <div>
          <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
            <i className="fas fa-money-bill text-amber-600" />
            Financial Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Tax Amount (NGN)"
              icon="fa-percent"
              type="number"
              step="0.01"
              value={formData.tax_amount}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  tax_amount: parseFloat(e.target.value) || 0,
                })
              }
            />
            <Input
              label="Discount (NGN)"
              icon="fa-tag"
              type="number"
              step="0.01"
              value={formData.discount_amount}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  discount_amount: parseFloat(e.target.value) || 0,
                })
              }
            />
            <Input
              label="Shipping Cost (NGN)"
              icon="fa-truck"
              type="number"
              step="0.01"
              value={formData.shipping_cost}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  shipping_cost: parseFloat(e.target.value) || 0,
                })
              }
            />
          </div>

          {/* Summary */}
          <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Subtotal</span>
              <span className="font-semibold text-slate-900">
                {new Intl.NumberFormat("en-NG", {
                  style: "currency",
                  currency: "NGN",
                }).format(subtotal)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Tax</span>
              <span className="font-semibold text-slate-900">
                {new Intl.NumberFormat("en-NG", {
                  style: "currency",
                  currency: "NGN",
                }).format(formData.tax_amount)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Shipping</span>
              <span className="font-semibold text-slate-900">
                {new Intl.NumberFormat("en-NG", {
                  style: "currency",
                  currency: "NGN",
                }).format(formData.shipping_cost)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Discount</span>
              <span className="font-semibold text-rose-600">
                -
                {new Intl.NumberFormat("en-NG", {
                  style: "currency",
                  currency: "NGN",
                }).format(formData.discount_amount)}
              </span>
            </div>
            <div className="border-t border-amber-200 pt-2 flex justify-between">
              <span className="text-sm font-bold text-amber-700">Total</span>
              <span className="text-lg font-bold text-amber-800">
                {new Intl.NumberFormat("en-NG", {
                  style: "currency",
                  currency: "NGN",
                }).format(total)}
              </span>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div>
          <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
            <i className="fas fa-align-left text-amber-600" />
            Notes & Terms
          </h3>
          <textarea
            value={formData.notes}
            onChange={(e) =>
              setFormData({ ...formData, notes: e.target.value })
            }
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-amber-500 focus:bg-white focus:ring-4 focus:ring-amber-500/15 mb-3"
            rows={2}
            placeholder="Additional notes..."
          />
          <textarea
            value={formData.terms_and_conditions}
            onChange={(e) =>
              setFormData({ ...formData, terms_and_conditions: e.target.value })
            }
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-amber-500 focus:bg-white focus:ring-4 focus:ring-amber-500/15"
            rows={3}
            placeholder="Terms and conditions..."
          />
        </div>
      </form>
    </Modal>
  );
};

export default PurchaseOrderFormModal;
