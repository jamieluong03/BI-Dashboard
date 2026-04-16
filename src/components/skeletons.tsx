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