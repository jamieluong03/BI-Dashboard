

export default function CriticalReorderList({ items }: { items: any[] }) {
    if (items.length === 0) {
        return (
            <div className="h-full flex items-center justify-center border-2 border-dashed border-slate-100 rounded-xl p-8 text-slate-400 text-sm">
                No immediate stockout risks detected.
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-2">
            {items.map((item, key) => (
                <div key={item.id} className="flex md:items-center justify-between px-4 py-2 border-b-1 last:border-b-0 border-slate-200 bg-white hover:shadow-md transition-shadow">
                    <div className="flex flex-row gap-4">
                        <span className="font-bold text-lg text-slate-900 content-center border-r-1 border-slate-100 pr-4">
                            {key + 1}
                        </span>
                        <div>
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
                    </div>
                    
                    <div className="text-right">
                        <p className="text-[10px] text-slate-400 uppercase font-bold">Weekly Risk</p>
                        <p className="text-lg font-black text-rose-600">
                            ${item.weeklyRisk.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
}