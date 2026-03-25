'use client';

import { useOrders } from "@/hooks/dataTables";
import { formatOrderId } from "@/lib/utils";

export default function Orders() {

    const { orders, isLoading } = useOrders();

    if (isLoading) return <p>Loading your orders...</p>;

    return (
    <div className="overflow-x-auto rounded-lg border border-slate-200">
        <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
            <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Order No.</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Customer</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">No. Items</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Total</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Region</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Channel</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Created At</th>
            </tr>
        </thead>
        <tbody className="bg-white divide-y divide-slate-200">
            {orders?.map((order) => (
            <tr key={order.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">{formatOrderId(order.id)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{order.customerName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{order.items.length}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{order.totalRevenue}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{order.region}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{order.status}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{order.channel}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{order.createdAt}</td>
            </tr>
            ))}
        </tbody>
        </table>
    </div>
    );
}