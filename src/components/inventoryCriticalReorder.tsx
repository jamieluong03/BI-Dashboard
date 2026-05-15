

export default function CriticalReorderList({ items }: { items: any[] }) {
    if (items.length === 0) {
        return (
            <div className="h-full flex items-center justify-center border-2 border-dashed border-slate-100 rounded-xl p-8 text-slate-400 text-sm">
                No immediate stockout risks detected.
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-3">
            {items.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-white hover:shadow-md transition-shadow">
                    <div className="flex flex-col">
                        <span className="font-bold text-slate-900 text-sm">{item.name}</span>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-500 font-medium">
                                {item.stock} in stock
                            </span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                                item.daysLeft <= 3 ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'
                            }`}>
                                {item.daysLeft} days left
                            </span>
                        </div>
                    </div>
                    
                    <div className="text-right">
                        <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter">Weekly Risk</p>
                        <p className="text-lg font-black text-rose-600">
                            ${item.weeklyRisk.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
}