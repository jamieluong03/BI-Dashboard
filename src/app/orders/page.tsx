'use client';

import { useOrders } from "@/hooks/dataTables";
import { formatOrderId } from "@/lib/utils";
import {
    ColumnDef,
    useReactTable,
    getCoreRowModel,
    ColumnOrderState,
    VisibilityState,
    flexRender
} from '@tanstack/react-table';
import * as React from 'react';
import { Order } from '@/types/analytics';

export default function Orders() {

    const { orders, isLoading } = useOrders();

    const columns = React.useMemo<ColumnDef<Order>[]>(() => [
        {
            accessorKey: "id",
            header: "Order ID",
            cell: ({ getValue }) => (
                <span>
                    {formatOrderId(getValue() as string)}
                </span>
            )
        },
        {
            accessorKey: "createdAt",
            header: "Date",
            cell: ({ getValue }) => {
                const value = getValue() as string;
                if (!value) return "-";

                const date = new Date(value);
                const dateStr = new Intl.DateTimeFormat("en-US", {
                    month: "2-digit",
                    day: "2-digit",
                    year: "2-digit",
                }).format(date);

                const timeStr = new Intl.DateTimeFormat("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                }).format(date);
                return (
                    <div className="flex flex-col">
                        <span className="text-slate-900 font-medium">{dateStr}</span>
                        <span className="text-[10px] text-slate-400 uppercase tracking-wider">
                            {timeStr}
                        </span>
                    </div>
                )
            }
        },
        {
            accessorKey: "customerName",
            header: 'Customer'
        },
        {
            accessorKey: "totalRevenue",
            header: "Order Total",
            cell: ({ getValue }) => (
                <span>
                    {`$${Number(getValue()).toLocaleString()}`}
                </span>
            )
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ getValue }) => {
                const status = getValue() as string;
                const colors = {
                    shipped: "bg-emerald-50 text-emerald-700 border-emerald-100",
                    processing: "bg-amber-50 text-amber-700 border-amber-100",
                    cancelled: "bg-rose-50 text-rose-700 border-rose-100",
                };
                return (
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${colors[status as keyof typeof colors] || "bg-slate-50 text-slate-600"}`}>
                        {status}
                    </span>
                );
            }
        },
        {
            accessorKey: "channel",
            header: "Sales Channel"
        },
        {
            accessorKey: "region",
            header: "Region"
        },
        {
            accessorKey: "discountAmount",
            header: "Discount",
            cell: ({ getValue }) => (
                <span>
                    {`$${Number(getValue()).toLocaleString()}`}
                </span>
            )
        },
        {
            accessorKey: "shippingCost",
            header: "Shipping",
            cell: ({ getValue }) => (
                <span>
                    {`$${Number(getValue()).toLocaleString()}`}
                </span>
            )
        }
    ], []);
    const [columnVisibility, setcolumnVisibility] = React.useState<VisibilityState>({});
    const [columnOrder, setColumnOrder] = React.useState<ColumnOrderState>(['id', 'createdAt', 'customerName', 'totalRevenue', 'status']);

    const table = useReactTable({
        data: orders || [],
        columns,
        state: {
            columnVisibility,
            columnOrder,
        },
        onColumnVisibilityChange: setcolumnVisibility,
        onColumnOrderChange: setColumnOrder,
        getCoreRowModel: getCoreRowModel(),
    });

    const visibleColumnsCount = table.getVisibleLeafColumns().length;
    
    if (isLoading) return <p>Loading your orders...</p>;

    return (
        <>
            <div className="p-8 space-y-6">
                <header>
                    <h1 className="text-2xl font-bold text-slate-900">All Orders</h1>
                </header>
                <div className="flex flex-wrap gap-2">
                    <p className="text-sm font-medium w-full mb-1">Display Columns:</p>
                    {table.getAllLeafColumns().map(column => {
                        const header = column.columnDef.header;
                        const labelText = typeof header === 'string' ? header : column.id;

                        return (
                            <label key={column.id} className="flex items-center gap-2 text-xs bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-md cursor-pointer hover:bg-white transition-all">
                                <input
                                    type="checkbox"
                                    checked={column.getIsVisible()}
                                    onChange={column.getToggleVisibilityHandler()}
                                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-3 h-3"
                                />
                                <span className="font-medium text-slate-600">{labelText}</span>
                            </label>
                        );
                    })}
                </div>

                <div 
                className={`
                    overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm
                    ${visibleColumnsCount > 6 ? 'cursor-grab active:cursor-grabbing' : ''}
                `}>
                    <table className="min-w-full divide-y divide-slate-200" 
                    style={{ 
                        minWidth: visibleColumnsCount > 6 ? `${visibleColumnsCount * 180}px` : '100%' 
                    }}>
                        <thead className="bg-slate-50">
                            {table.getHeaderGroups().map((hg) => (
                                <tr key={hg.id}>
                                    {hg.headers.map((header) => (
                                        <th key={header.id} className="px-5 py-3 border-r last:border-r-0">
                                            {flexRender(header.column.columnDef.header, header.getContext())}
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-200">
                            {table.getRowModel().rows.map((row) => (
                                <tr key={row.id}>
                                    {row.getVisibleCells().map((cell) => (
                                        <td key={cell.id} className="text-center px-5 py-3 whitespace-nowrap text-sm text-slate-600 border-r border-slate-200 last:border-r-0">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}