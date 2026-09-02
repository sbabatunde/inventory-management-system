// src/modules/procurement/components/Order/PurchaseOrderDetailsModal.tsx

import React, { useState, useEffect } from 'react';
import { Modal, Badge, Button, DataTable, Input, EmptyState } from '../../../../shared/components/UI';
import { PurchaseOrder, PurchaseOrderStatus } from '../../types';
import { PURCHASE_ORDER_STATUS_MAP } from '../../constants';
import { purchaseOrderService } from '../../services/purchase-order.service';
import { showSuccess, showError, showLoading, dismissToast } from '../../../../shared/utils/toast';

interface PurchaseOrderDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    order: PurchaseOrder | null;
    onRefresh: () => void;
}

interface ReceiveItem {
    item_id: number;
    quantity_received: number;
}

const PurchaseOrderDetailsModal: React.FC<PurchaseOrderDetailsModalProps> = ({
    isOpen,
    onClose,
    order,
    onRefresh,
}) => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [showReceiveForm, setShowReceiveForm] = useState(false);
    const [receivedItems, setReceivedItems] = useState<ReceiveItem[]>([]);

    useEffect(() => {
        if (order && showReceiveForm) {
            setReceivedItems(order.items.map(item => ({
                item_id: item.id!,
                quantity_received: 0,
            })));
        }
    }, [order, showReceiveForm]);

    if (!order) return null;

    const statusInfo = PURCHASE_ORDER_STATUS_MAP[order.status];

    const getStatusBadge = (status: PurchaseOrderStatus) => {
        const info = PURCHASE_ORDER_STATUS_MAP[status];
        const variant = info.color === 'green' ? 'success' :
                       info.color === 'blue' ? 'info' :
                       info.color === 'amber' ? 'warning' :
                       info.color === 'red' ? 'danger' : 'neutral';
        return (
            <Badge variant={variant}>
                {info.label}
            </Badge>
        );
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN',
        }).format(amount);
    };

    const handleSendOrder = async (): Promise<void> => {
        setIsProcessing(true);
        const loadingToast = showLoading('Sending purchase order...');

        try {
            await purchaseOrderService.sendOrder(order.id);
            dismissToast(loadingToast);
            showSuccess('Purchase order sent successfully');
            onRefresh();
            onClose();
        } catch (error: any) {
            dismissToast(loadingToast);
            showError(error.response?.data?.message || 'Failed to send order');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleReceiveGoods = async (): Promise<void> => {
        const validItems = receivedItems.filter(item => item.quantity_received > 0);
        
        if (validItems.length === 0) {
            showError('Please enter received quantities for at least one item');
            return;
        }

        setIsProcessing(true);
        const loadingToast = showLoading('Receiving goods...');

        try {
            await purchaseOrderService.receiveGoods(order.id, validItems);
            dismissToast(loadingToast);
            showSuccess('Goods received successfully');
            setShowReceiveForm(false);
            onRefresh();
            onClose();
        } catch (error: any) {
            dismissToast(loadingToast);
            showError(error.response?.data?.message || 'Failed to receive goods');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleQuantityChange = (itemId: number, quantity: number): void => {
        setReceivedItems(prev => prev.map(item => 
            item.item_id === itemId ? { ...item, quantity_received: quantity } : item
        ));
    };

    const itemColumns = [
        {
            key: 'item',
            header: 'Item',
            render: (item: any) => (
                <div>
                    <p className="font-medium text-slate-900">{item.stock_item?.name}</p>
                    <p className="text-xs text-slate-400">{item.stock_item?.code}</p>
                </div>
            ),
        },
        {
            key: 'ordered',
            header: 'Ordered',
            render: (item: any) => (
                <span className="text-sm text-slate-600">
                    {item.quantity_ordered} {item.unit_of_measure}
                </span>
            ),
        },
        {
            key: 'received',
            header: 'Received',
            render: (item: any) => (
                <span className="font-semibold text-emerald-600">
                    {item.quantity_received} {item.unit_of_measure}
                </span>
            ),
        },
        {
            key: 'pending',
            header: 'Pending',
            render: (item: any) => (
                <span className="font-semibold text-amber-600">
                    {item.quantity_ordered - item.quantity_received} {item.unit_of_measure}
                </span>
            ),
        },
        {
            key: 'unit_price',
            header: 'Unit Price',
            render: (item: any) => (
                <span className="text-sm text-slate-600">
                    {formatCurrency(item.unit_price)}
                </span>
            ),
        },
        {
            key: 'total',
            header: 'Total',
            render: (item: any) => (
                <span className="font-semibold text-slate-900">
                    {formatCurrency(item.total_price)}
                </span>
            ),
        },
    ];

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Purchase Order Details"
            subtitle={order.po_no}
            size="xl"
            footer={
                <>
                    <Button variant="outline" onClick={onClose}>
                        Close
                    </Button>
                    
                    {order.status === 'draft' && (
                        <Button onClick={handleSendOrder} isLoading={isProcessing} icon="fa-paper-plane">
                            Send Order
                        </Button>
                    )}
                    
                    {(order.status === 'sent' || order.status === 'partially_received') && !showReceiveForm && (
                        <Button onClick={() => setShowReceiveForm(true)} icon="fa-box-open">
                            Receive Goods
                        </Button>
                    )}
                    
                    {showReceiveForm && (
                        <>
                            <Button variant="outline" onClick={() => setShowReceiveForm(false)}>
                                Cancel
                            </Button>
                            <Button onClick={handleReceiveGoods} isLoading={isProcessing} icon="fa-check">
                                Confirm Receipt
                            </Button>
                        </>
                    )}
                </>
            }
        >
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-amber-600 to-amber-800 rounded-2xl flex items-center justify-center text-white text-2xl">
                        <i className="fas fa-file-invoice" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-bold text-slate-900">{order.po_no}</h3>
                        <p className="text-sm text-slate-500">
                            {order.supplier?.name} • {order.store?.name}
                        </p>
                    </div>
                    {getStatusBadge(order.status)}
                </div>

                {/* Order Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                            Order Date
                        </label>
                        <p className="text-sm text-slate-900 font-medium">
                            {new Date(order.order_date).toLocaleDateString()}
                        </p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                            Expected Delivery
                        </label>
                        <p className="text-sm text-slate-900 font-medium">
                            {order.expected_delivery_date ? new Date(order.expected_delivery_date).toLocaleDateString() : 'N/A'}
                        </p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                            Total Amount
                        </label>
                        <p className="text-sm text-slate-900 font-bold">
                            {formatCurrency(order.total_amount)}
                        </p>
                    </div>
                </div>

                {/* Items */}
                <div>
                    <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                        <i className="fas fa-boxes-stacked text-amber-600" />
                        Items ({order.items?.length || 0})
                    </h4>
                    
                    {order.items?.length === 0 ? (
                        <EmptyState
                            icon="fa-boxes-stacked"
                            title="No items"
                            description="No items in this purchase order"
                        />
                    ) : (
                        <div className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden">
                            <DataTable<any>
                                columns={itemColumns}
                                data={order.items}
                                showSerialNumbers={false}
                            />
                        </div>
                    )}
                </div>

                {/* Receive Goods Form */}
                {showReceiveForm && (
                    <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                        <h4 className="text-sm font-bold text-emerald-700 mb-4 flex items-center gap-2">
                            <i className="fas fa-box-open" />
                            Receive Goods
                        </h4>
                        <div className="space-y-3">
                            {order.items.map((item) => (
                                <div key={item.id} className="flex items-center gap-3">
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-slate-900">
                                            {item.stock_item?.name}
                                        </p>
                                        <p className="text-xs text-slate-500">
                                            Ordered: {item.quantity_ordered} | Received: {item.quantity_received}
                                        </p>
                                    </div>
                                    <Input
                                        type="number"
                                        min="0"
                                        max={item.quantity_ordered - item.quantity_received}
                                        placeholder="Qty"
                                        value={receivedItems.find(r => r.item_id === item.id)?.quantity_received || 0}
                                        onChange={(e) => handleQuantityChange(item.id!, parseInt(e.target.value) || 0)}
                                        wrapperClassName="w-32"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Financial Summary */}
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Subtotal</span>
                        <span className="font-semibold text-slate-900">{formatCurrency(order.subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Tax</span>
                        <span className="font-semibold text-slate-900">{formatCurrency(order.tax_amount)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Shipping</span>
                        <span className="font-semibold text-slate-900">{formatCurrency(order.shipping_cost)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Discount</span>
                        <span className="font-semibold text-rose-600">-{formatCurrency(order.discount_amount)}</span>
                    </div>
                    <div className="border-t border-amber-200 pt-2 flex justify-between">
                        <span className="text-sm font-bold text-amber-700">Total</span>
                        <span className="text-lg font-bold text-amber-800">{formatCurrency(order.total_amount)}</span>
                    </div>
                </div>

                {/* Notes */}
                {order.notes && (
                    <div>
                        <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                            <i className="fas fa-align-left text-amber-600" />
                            Notes
                        </h4>
                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                            <p className="text-sm text-slate-700 leading-relaxed">{order.notes}</p>
                        </div>
                    </div>
                )}
            </div>
        </Modal>
    );
};

export default PurchaseOrderDetailsModal;