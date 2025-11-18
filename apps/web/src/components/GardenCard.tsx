import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function GardenCard() {
  return (
    <Card className="w-full md:w-96 bg-gradient-to-br from-green-50 to-emerald-100 border-garden-green">
      <CardHeader>
        <CardTitle className="text-garden-green">My Garden 🌱</CardTitle>
        <CardDescription>Track your plants and watch them grow</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-lg overflow-hidden bg-white">
          <div className="h-48 bg-gradient-to-b from-garden-sky to-garden-green flex items-end justify-center pb-4">
            <span className="text-4xl">🌻🌿🌱</span>
          </div>
        </div>

        <div className="space-y-2">
          <Button className="w-full bg-garden-green hover:bg-garden-green-dark">
            Water Plants 💧
          </Button>
          <Button variant="outline" className="w-full border-garden-green text-garden-green">
            Add New Plant
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center text-sm">
          <div className="bg-white rounded p-2">
            <div className="font-bold text-garden-green">12</div>
            <div className="text-xs text-muted-foreground">Plants</div>
          </div>
          <div className="bg-white rounded p-2">
            <div className="font-bold text-garden-leaf">8</div>
            <div className="text-xs text-muted-foreground">Watered</div>
          </div>
          <div className="bg-white rounded p-2">
            <div className="font-bold text-garden-flower">3</div>
            <div className="text-xs text-muted-foreground">Blooming</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
