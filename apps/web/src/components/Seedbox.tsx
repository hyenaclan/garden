import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function Seedbox() {
  return (
    <section className="space-y-6">
      <h2 className="text-xl font-semibold" style={{ color: '#065f46' }}>Seedbox</h2>

      <Card className="bg-white border-gray-200 shadow-sm">
        <CardContent className="p-8">
          <div className="space-y-6">
            <p className="leading-relaxed text-center max-w-3xl mx-auto" style={{ color: '#6b7280' }}>
              Your personal seed collection and planning tool. Keep track of your seeds,
              plan your planting schedule, and discover new varieties to grow in your garden.
              The seedbox helps you organize seed packets, track planting dates, and manage
              your inventory throughout the growing season.
            </p>

            <div className="flex justify-center">
              <Button size="lg" variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 text-base font-medium">
                Go to Seedbox
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
