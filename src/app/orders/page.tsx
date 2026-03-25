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
            accessorKey: "customerName",
            header: 'Customer'
        },
        {
            accessorKey: "totalRevenue",
            header: "Revenue",
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
        }
    ], []);
    const [columnVisibility, setcolumnVisibility] = React.useState<VisibilityState>({});
    const [columnOrder, setColumnOrder] = React.useState<ColumnOrderState>(['id', 'customerName', 'totalRevenue', 'status']);

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

                <div className="overflow-x-auto rounded-lg border border-slate-200">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                            {table.getHeaderGroups().map((hg) => (
                                <tr key={hg.id}>
                                    {hg.headers.map((header) => (
                                        <th key={header.id}>
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
                                        <td key={cell.id}>
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