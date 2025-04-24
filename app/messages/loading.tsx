import { Skeleton } from "@/components/ui/skeleton"

export default function MessagesLoading() {
  return (
    <div className="container mx-auto py-8">
      <Skeleton className="h-10 w-48 mb-6" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 border rounded-lg overflow-hidden">
          <div className="p-4 border-b">
            <Skeleton className="h-10 w-full" />
          </div>

          <div className="px-4 pt-2">
            <Skeleton className="h-10 w-full mb-4" />
          </div>

          <div className="space-y-2 p-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="flex items-start gap-4 p-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-3 w-3/4" />
                </div>
                <Skeleton className="h-3 w-16" />
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 border rounded-lg overflow-hidden">
          <div className="p-4 border-b">
            <div className="flex items-center">
              <Skeleton className="h-10 w-10 rounded-full mr-3" />
              <Skeleton className="h-6 w-40" />
            </div>
          </div>

          <div className="p-4 space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className={`flex ${i % 2 === 0 ? "justify-start" : "justify-end"}`}>
                <div className={`max-w-[70%] ${i % 2 === 0 ? "mr-auto" : "ml-auto"}`}>
                  <Skeleton className={`h-20 w-full rounded-lg`} />
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t">
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    </div>
  )
}
