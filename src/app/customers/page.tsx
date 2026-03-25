'use client';

import { useCustomers } from "@/hooks/dataTables";

export default function Customers() {

    const { customers, isLoading } = useCustomers();

    if (isLoading) return <p>Loading your customers...</p>;

    return (
    <div className="overflow-x-auto rounded-lg border border-slate-200">
        <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
            <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Customer</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Email</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Total Orders</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Total Spent</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Loyalty Member</th>
            </tr>
        </thead>
        <tbody className="bg-white divide-y divide-slate-200">
            {customers?.map((customer) => (
            <tr key={customer.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">{customer.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{customer.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{customer.totalOrders}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{customer.totalSpent}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{customer.isLoyaltyMember ? 'true' : 'false'}</td>
            </tr>
            ))}
        </tbody>
        </table>
    </div>
    );
}