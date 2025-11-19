import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sprout } from 'lucide-react';

export default function Seedbox() {
  return (
    <section>
      <Card className="bg-white border-gray-200 shadow-sm">
        <CardContent className="p-8">
          <div className="flex items-center justify-between">
            <div className="flex items-start gap-4">
              <Sprout className="w-8 h-8 text-garden-primary flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-xl font-semibold text-garden-primary-darkest mb-2">Seedbox</h2>
                <p className="text-garden-primary">
                  Manage your seed inventory, planting schedules, and variety information
                </p>
              </div>
            </div>
            <Button className="bg-garden-primary hover:bg-garden-primary-dark text-white px-6 flex-shrink-0">
              Go to Seedbox
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
