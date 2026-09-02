// src/modules/procurement/components/Order/PurchaseOrderList.tsx

import React, { useState } from "react";
import {
  PageHeader,
  Button,
  Input,
  Select,
  DataTable,
  Badge,
  ConfirmDialog,
  EmptyState,
} from "../../../../shared/components/UI";
import { PurchaseOrder, PurchaseOrderStatus } from "../../types";
import { usePurchaseOrders } from "../../hooks/usePurchaseOrders";
import { purchaseOrderService } from "../../services/purchase-order.service";
import {
  PURCHASE_ORDER_STATUSES,
  PURCHASE_ORDER_STATUS_MAP,
} from "../../constants";
import { showSuccess, showError } from "../../../../shared/utils/toast";
import PurchaseOrderFormModal from "./PurchaseOrderFormModal";
import PurchaseOrderDetailsModal from "./PurchaseOrderDetailsModal";

const PurchaseOrderList: React.FC = () => {
  const {
    orders,
    pagination,
    isLoading,
    handlePageChange,
    handleSearch,
    handleStatusFilter,
    refreshOrders,
  } = usePurchaseOrders();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<PurchaseOrder | null>(
    null,
  );
  const [orderToCancel, setOrderToCancel] = useState<PurchaseOrder | null>(
    null,
  );
  const [isProcessing, setIsProcessing] = useState(false);

  const handleViewOrder = (order: PurchaseOrder): void => {
    setSelectedOrder(order);
    setIsDetailsModalOpen(true);
  };

  const handleCancelOrder = async (): Promise<void> => {
    if (!orderToCancel) return;

    setIsProcessing(true);
    try {
      await purchaseOrderService.cancelOrder(orderToCancel.id);
      showSuccess("Purchase order cancelled successfully");
      setOrderToCancel(null);
      refreshOrders();
    } catch (error: any) {
      showError(error.response?.data?.message || "Failed to cancel order");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSendOrder = async (order: PurchaseOrder): Promise<void> => {
    try {
      await purchaseOrderService.sendOrder(order.id);
      showSuccess("Purchase order sent successfully");
      refreshOrders();
    } catch (error: any) {
      showError(error.response?.data?.message || "Failed to send order");
    }
  };

  const getStatusBadge = (status: PurchaseOrderStatus) => {
    const statusInfo = PURCHASE_ORDER_STATUS_MAP[status];
    const variant =
      statusInfo.color === "green"
        ? "success"
        : statusInfo.color === "blue"
          ? "info"
          : statusInfo.color === "amber"
            ? "warning"
            : statusInfo.color === "red"
              ? "danger"
              : "neutral";
    return <Badge variant={variant}>{statusInfo.label}</Badge>;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(amount);
  };

  const columns = [
    {
      key: "po_no",
      header: "PO No",
      render: (order: PurchaseOrder) => (
        <div>
          <p className="font-medium text-slate-900">{order.po_no}</p>
          <p className="text-xs text-slate-400">
            {new Date(order.order_date).toLocaleDateString()}
          </p>
        </div>
      ),
    },
    {
      key: "supplier",
      header: "Supplier",
      render: (order: PurchaseOrder) => (
        <div>
          <p className="font-medium text-slate-900">{order.supplier?.name}</p>
          <p className="text-xs text-slate-400">{order.supplier?.code}</p>
        </div>
      ),
    },
    {
      key: "store",
      header: "Store",
      render: (order: PurchaseOrder) => (
        <div>
          <p className="font-medium text-slate-900">{order.store?.name}</p>
          <p className="text-xs text-slate-400">{order.store?.code}</p>
        </div>
      ),
    },
    {
      key: "items",
      header: "Items",
      render: (order: PurchaseOrder) => (
        <span className="font-semibold text-slate-900">
          {order.total_items || order.items?.length || 0} items
        </span>
      ),
    },
    {
      key: "total",
      header: "Total Amount",
      render: (order: PurchaseOrder) => (
        <span className="text-sm text-slate-600 font-medium">
          {formatCurrency(order.total_amount)}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (order: PurchaseOrder) => getStatusBadge(order.status),
    },
    {
      key: "receipt",
      header: "Receipt",
      render: (order: PurchaseOrder) =>
        order.receipt_percentage !== undefined ? (
          <div className="w-24">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-500">
                {order.receipt_percentage}%
              </span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-1.5">
              <div
                className="bg-emerald-600 h-1.5 rounded-full"
                style={{ width: `${order.receipt_percentage}%` }}
              />
            </div>
          </div>
        ) : (
          <span className="text-sm text-slate-400">N/A</span>
        ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (order: PurchaseOrder) => (
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => handleViewOrder(order)}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
            title="View"
          >
            <i className="fas fa-eye text-xs" />
          </button>
          {order.status === "draft" && (
            <>
              <button
                onClick={() => handleSendOrder(order)}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors"
                title="Send"
              >
                <i className="fas fa-paper-plane text-xs" />
              </button>
              <button
                onClick={() => setOrderToCancel(order)}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors"
                title="Cancel"
              >
                <i className="fas fa-ban text-xs" />
              </button>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Purchase Orders"
        icon="fa-file-invoice"
        breadcrumbs={[{ label: "Procurement" }, { label: "Purchase Orders" }]}
        actions={
          <Button icon="fa-plus" onClick={() => setIsCreateModalOpen(true)}>
            New Purchase Order
          </Button>
        }
      />

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-6">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <Input
              icon="fa-search"
              placeholder="Search purchase orders..."
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
          <Select
            placeholder="All Statuses"
            options={PURCHASE_ORDER_STATUSES}
            onChange={(e) =>
              handleStatusFilter(e.target.value as PurchaseOrderStatus)
            }
            wrapperClassName="w-40"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        {orders.length === 0 && !isLoading ? (
          <EmptyState
            icon="fa-file-invoice"
            title="No purchase orders found"
            description="Create a purchase order to order items from suppliers"
            actionLabel="New Purchase Order"
            onAction={() => setIsCreateModalOpen(true)}
          />
        ) : (
          <DataTable<PurchaseOrder>
            columns={columns}
            data={orders}
            pagination={pagination || undefined}
            onPageChange={handlePageChange}
            loading={isLoading}
          />
        )}
      </div>

      {/* Modals */}
      <PurchaseOrderFormModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => {
          setIsCreateModalOpen(false);
          refreshOrders();
        }}
      />

      <PurchaseOrderDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        order={selectedOrder}
        onRefresh={refreshOrders}
      />

      <ConfirmDialog
        isOpen={!!orderToCancel}
        onClose={() => setOrderToCancel(null)}
        onConfirm={handleCancelOrder}
        title="Cancel Purchase Order"
        message={`Are you sure you want to cancel order ${orderToCancel?.po_no}?`}
        confirmLabel="Cancel Order"
        isLoading={isProcessing}
      />
    </div>
  );
};

export default PurchaseOrderList;
