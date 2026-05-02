import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function DashboardSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-pulse">
      <header className="mb-8">
        <Skeleton className="h-9 w-64 mb-2" />
        <Skeleton className="h-4 w-40" />
      </header>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 p-2">
        {/* Top 4 Stat Cards */}
        {[...Array(4)].map((_, i) => (
          <Card key={`stat-top-${i}`} className="h-[140px]">
            <CardHeader><Skeleton className="h-4 w-1/2" /></CardHeader>
            <CardContent className="space-y-2">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-3 w-full" />
            </CardContent>
          </Card>
        ))}

        {/* 2 Big Charts */}
        <Card className="col-span-2 h-[350px]">
          <CardHeader><Skeleton className="h-5 w-1/3" /></CardHeader>
          <CardContent><Skeleton className="h-full w-full rounded-xl" /></CardContent>
        </Card>
        <Card className="col-span-2 h-[350px]">
          <CardHeader><Skeleton className="h-5 w-1/3" /></CardHeader>
          <CardContent><Skeleton className="h-full w-full rounded-xl" /></CardContent>
        </Card>

        {/* Middle 4 Stat Cards */}
        {[...Array(4)].map((_, i) => (
          <Card key={`stat-mid-${i}`} className="h-[140px]">
            <CardHeader><Skeleton className="h-4 w-1/2" /></CardHeader>
            <CardContent className="space-y-2">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-3 w-full" />
            </CardContent>
          </Card>
        ))}

        {/* Bottom Row: 2 Stats + Inventory */}
        <Card className="h-[160px]">
           <CardHeader><Skeleton className="h-4 w-1/2" /></CardHeader>
           <CardContent className="space-y-2"><Skeleton className="h-8 w-3/4" /><Skeleton className="h-3 w-full" /></CardContent>
        </Card>
        <Card className="h-[160px]">
           <CardHeader><Skeleton className="h-4 w-1/2" /></CardHeader>
           <CardContent className="space-y-2"><Skeleton className="h-8 w-3/4" /><Skeleton className="h-3 w-full" /></CardContent>
        </Card>
        
        {/* Inventory Card Span */}
        <Card className="col-span-2 h-[160px]">
          <CardHeader><Skeleton className="h-5 w-1/4" /></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <Skeleton className="h-10 w-1/2" />
              <Skeleton className="h-10 w-1/2" />
            </div>
            <Skeleton className="h-4 w-full" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export function NetProfitLoadingSkeleton() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Skeleton className="h-[420px] w-full rounded-2xl" />
            <Skeleton className="h-[420px] w-full rounded-2xl" />
            <Skeleton className="lg:col-span-2 h-[400px] w-full rounded-2xl" />
        </div>
    );
};

export function TotalOrdersSkeleton() {
    return (
        <div className="w-full animate-pulse">
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-100 gap-3">
                    <Skeleton className="h-3 w-24 bg-slate-200" />
                    <Skeleton className="h-8 w-32 rounded-md bg-slate-200" />
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col h-auto lg:min-h-[250px]">
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-8">
                        <div className="space-y-2">
                            <Skeleton className="h-3 w-32 bg-slate-100" />
                            <div className="flex items-baseline gap-2">
                                <Skeleton className="h-10 w-24 bg-slate-100" />
                                <Skeleton className="h-3 w-16 bg-slate-100" />
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <Skeleton className="h-3 w-12 rounded-full bg-slate-100" />
                            <Skeleton className="h-3 w-12 rounded-full bg-slate-100" />
                        </div>
                    </div>
                    <Skeleton className="w-full h-[125px] md:h-[180px] rounded-lg bg-slate-50" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm min-h-[300px] lg:h-[320px] flex flex-col space-y-4">
                        <Skeleton className="h-3 w-32 bg-slate-100" />
                        <div className="flex-1 flex flex-col gap-3 justify-center">
                            <Skeleton className="h-8 w-[90%] bg-slate-50" />
                            <Skeleton className="h-8 w-[75%] bg-slate-50" />
                            <Skeleton className="h-8 w-[85%] bg-slate-50" />
                            <Skeleton className="h-8 w-[60%] bg-slate-50" />
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm min-h-[300px] lg:h-[320px] flex flex-col items-center justify-between">
                        <div className="w-full">
                            <Skeleton className="h-3 w-32 bg-slate-100" />
                        </div>
                        <div className="relative flex items-center justify-center">
                            <Skeleton className="h-32 w-32 rounded-full border-[12px] border-slate-50 bg-transparent" />
                            <Skeleton className="absolute h-8 w-12 bg-slate-50" />
                        </div>
                        <div className="grid grid-cols-3 gap-4 w-full">
                            <Skeleton className="h-8 w-full bg-slate-50" />
                            <Skeleton className="h-8 w-full bg-slate-50" />
                            <Skeleton className="h-8 w-full bg-slate-50" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export function AovSkeleton() {
    return (
        <div className="w-full animate-pulse">
            <div className="flex flex-col gap-4">
                
                <div className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-100 gap-3">
                    <Skeleton className="h-3 w-32 bg-slate-200" />
                    <Skeleton className="h-8 w-32 rounded-md bg-slate-200" />
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col lg:min-h-[250px]">
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-8">
                        <div className="space-y-4">
                            <Skeleton className="h-3 w-40 bg-slate-100" />
                            <div className="space-y-2">
                                <Skeleton className="h-10 w-32 bg-slate-100" />
                                <Skeleton className="h-3 w-20 bg-slate-100" />
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <Skeleton className="h-3 w-16 rounded-full bg-slate-100" />
                            <Skeleton className="h-3 w-16 rounded-full bg-slate-100" />
                        </div>
                    </div>
                    <Skeleton className="w-full h-[125px] md:h-[160px] rounded-lg bg-slate-50/50" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm min-h-[300px] lg:h-[320px] flex flex-col">
                        <Skeleton className="h-3 w-40 mb-10 bg-slate-100" />
                        <div className="flex-1 flex items-end justify-around gap-2 px-4">
                            <Skeleton className="h-[40%] w-10 rounded-t-md bg-slate-50" />
                            <Skeleton className="h-[70%] w-10 rounded-t-md bg-slate-50" />
                            <Skeleton className="h-[90%] w-10 rounded-t-md bg-slate-50" />
                            <Skeleton className="h-[50%] w-10 rounded-t-md bg-slate-50" />
                            <Skeleton className="h-[30%] w-10 rounded-t-md bg-slate-50" />
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm min-h-[300px] lg:h-[320px] flex flex-col items-center">
                        <div className="w-full">
                            <Skeleton className="h-3 w-40 bg-slate-100" />
                        </div>
                        <div className="relative mt-12 flex items-center justify-center">
                            <Skeleton className="h-40 w-40 rounded-full border-[16px] border-slate-50 bg-transparent" />
                            <div className="absolute flex flex-col items-center gap-2">
                                <Skeleton className="h-8 w-12 bg-slate-50" />
                                <Skeleton className="h-3 w-16 bg-slate-50" />
                            </div>
                        </div>
                        <Skeleton className="mt-auto h-3 w-[80%] bg-slate-50" />
                    </div>
                </div>

            </div>
        </div>
    );
};