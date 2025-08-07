import React, { useState } from 'react';
import RevenueViewer from './RevenueViewer';
import IncomeViewer from './IncomeViewer';
import EditdaViewer from './EbitdaViewer';
import EpsViewer from './EpsViewer';
import YearSelector from './YearSelector';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    DndContext,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    useSortable,
    rectSortingStrategy
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const COMPONENTS = {
    revenue: RevenueViewer,
    income: IncomeViewer,
    ebitda: EditdaViewer,
    eps: EpsViewer,
};

function SortableCard({ id, symbol, trigger, setLoading, selectedIndex }: any) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const Component = COMPONENTS[id];

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <Component
                symbol={symbol}
                trigger={trigger}
                setLoading={setLoading}
                selectedIndex={selectedIndex}
            />
        </div>
    );
}

function App() {
  const [symbol, setSymbol] = useState('AAPL');
  const [loading, setLoading] = useState(false);
  const [trigger, setTrigger] = useState(0);
    const [selectedIndex, setSelectedIndex] = useState(0);

    const [cards, setCards] = useState(['revenue', 'income', 'ebitda', 'eps']);

    const sensors = useSensors(useSensor(PointerSensor));

    const handleDragEnd = (event: any) => {
        const { active, over } = event;
        if (active.id !== over.id) {
            const oldIndex = cards.indexOf(active.id);
            const newIndex = cards.indexOf(over.id);
            setCards(arrayMove(cards, oldIndex, newIndex));
        }
    };

  const handleFetch = () => {
    setTrigger((prev) => prev + 1);
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Stock Financials Dashboard</h1>

      <div className="flex gap-2">
        <Input
          placeholder="Enter stock symbol (e.g. AAPL)"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value.toUpperCase())}
        />
        <Button onClick={handleFetch} disabled={loading}>
          {loading ? 'Loading...' : 'Fetch'}
        </Button>
      </div>
          <YearSelector
              symbol={symbol}
              trigger={trigger}
              selectedIndex={selectedIndex}
              setSelectedIndex={setSelectedIndex}
          />
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={cards} strategy={rectSortingStrategy}>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {cards.map((id) => (
                          <SortableCard
                              key={id}
                              id={id}
                              symbol={symbol}
                              trigger={trigger}
                              setLoading={setLoading}
                              selectedIndex={selectedIndex}
                          />
                      ))}
                  </div>
              </SortableContext>
          </DndContext>
    </div>
  );
}

export default App;
