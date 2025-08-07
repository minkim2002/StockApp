import React, { useEffect, useState } from 'react';

export default function YearSelector({
    symbol,
    trigger,
    selectedIndex,
    setSelectedIndex,
}: {
    symbol: string;
    trigger: number;
    selectedIndex: number;
    setSelectedIndex: (val: number) => void;
}) {
    const [dates, setDates] = useState<string[]>([]);

    useEffect(() => {
        const fetchDates = async () => {
            try {
                const res = await fetch(`http://localhost:8000/metrics/${symbol}`);
                const json = await res.json();
                const parsed = json.income.map((entry: any) => entry.date).reverse();
                setDates(parsed);
                setSelectedIndex(parsed.length - 1);
            } catch (err) {
                console.error('Failed to fetch dates:', err);
            }
        };

        fetchDates();
    }, [trigger, symbol]);

    return (
        <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Select Year</p>
            <input
                type="range"
                min={0}
                max={dates.length - 1}
                value={selectedIndex}
                onChange={(e) => setSelectedIndex(Number(e.target.value))}
                className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-500">
                {dates.length > 0 && (
                    <>
                        <span>{dates[0]}</span>
                        <span>{dates[dates.length - 1]}</span>
                    </>
                )}
            </div>
        </div>
    );
}