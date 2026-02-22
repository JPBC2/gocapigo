import { supabase } from '../lib/supabase';

interface OrderData {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    shippingAddress: string;
    shippingCity: string;
    shippingState: string;
    shippingZip: string;
    shippingZone: string;
    shippingCost: number;
    subtotal: number;
    total: number;
    notes?: string;
    items: {
        productId: string;
        productName: string;
        quantity: number;
        unitPrice: number;
    }[];
}

export async function createOrder(order: OrderData) {
    // 1. Insert order
    const { data: orderRow, error: orderError } = await supabase
        .from('orders')
        .insert({
            customer_name: order.customerName,
            customer_email: order.customerEmail,
            customer_phone: order.customerPhone,
            shipping_address: order.shippingAddress,
            shipping_city: order.shippingCity,
            shipping_state: order.shippingState,
            shipping_zip: order.shippingZip,
            shipping_zone: order.shippingZone,
            shipping_cost: order.shippingCost,
            subtotal: order.subtotal,
            total: order.total,
            notes: order.notes || null,
        })
        .select()
        .single();

    if (orderError) throw orderError;

    // 2. Insert order items
    const { error: itemsError } = await supabase
        .from('order_items')
        .insert(
            order.items.map(item => ({
                order_id: orderRow.id,
                product_id: item.productId,
                product_name: item.productName,
                quantity: item.quantity,
                unit_price: item.unitPrice,
                total_price: item.unitPrice * item.quantity,
            }))
        );

    if (itemsError) throw itemsError;

    // 3. Update stock for each product
    for (const item of order.items) {
        await supabase.rpc('decrement_stock', {
            product_id: item.productId,
            qty: item.quantity,
        });
    }

    return orderRow;
}

export async function getOrders() {
    const { data, error } = await supabase
        .from('orders')
        .select(`*, order_items(*)`)
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
}

export async function updateOrderStatus(orderId: string, status: string) {
    const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId);

    if (error) throw error;
}
