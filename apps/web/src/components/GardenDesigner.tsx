import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function GardenDesigner() {
  return (
    <section className="space-y-6">
      <h2 className="text-xl font-semibold text-garden-primary-darkest">Garden Designer</h2>

      <Card className="bg-white border-gray-200 shadow-sm">
        <CardContent className="p-8">
          {/* Garden plot visualization */}
          <div className="relative bg-amber-50 rounded-lg p-12 min-h-[450px] flex items-center justify-center border border-amber-100">
            {/* Compass directions */}
            <div className="absolute top-6 left-1/2 -translate-x-1/2">
              <span className="text-sm font-semibold text-gray-600">N</span>
            </div>
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
              <span className="text-sm font-semibold text-gray-600">S</span>
            </div>
            <div className="absolute left-6 top-1/2 -translate-y-1/2">
              <span className="text-sm font-semibold text-gray-600">W</span>
            </div>
            <div className="absolute right-6 top-1/2 -translate-y-1/2">
              <span className="text-sm font-semibold text-gray-600">E</span>
            </div>

            {/* Garden bed visualization - placeholder rectangles */}
            <div className="grid grid-cols-2 gap-8 max-w-lg">
              <div className="bg-amber-800 h-36 w-full rounded-sm shadow-md hover:shadow-lg transition-shadow cursor-pointer"></div>
              <div className="bg-amber-800 h-36 w-full rounded-sm shadow-md hover:shadow-lg transition-shadow cursor-pointer"></div>
              <div className="bg-amber-800 h-36 w-full rounded-sm shadow-md hover:shadow-lg transition-shadow cursor-pointer"></div>
              <div className="bg-amber-800 h-36 w-full rounded-sm shadow-md hover:shadow-lg transition-shadow cursor-pointer"></div>
            </div>
          </div>

          {/* Open Designer button */}
          <div className="mt-8 flex justify-center">
            <Button size="lg" className="px-8 text-base font-medium text-white bg-garden-primary hover:bg-garden-primary-dark">
              Open Designer
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
