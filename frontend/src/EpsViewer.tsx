import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface EpsViewerProps {
    symbol: string;
    trigger: number;
    setLoading: (loading: boolean) => void;
    selectedIndex: number;
}

export default function EpsViewer({ symbol, trigger, setLoading, selectedIndex }: EpsViewerProps) {
    const [data, setData] = useState<{ date: string; eps: number }[]>([]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await fetch(`http://localhost:8000/metrics/${symbol}`);
            const json = await res.json();
            const parsed = json.income.map((entry: any) => ({
                date: entry.date,
                eps: entry.eps || 0,
            })).reverse();
            setData(parsed);
        } catch (err) {
            console.error('Failed to fetch EPS:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [trigger]);

    const selected = data[selectedIndex];

    return (
        <Card>
            <CardContent className="p-4 space-y-4">
                <div className="space-y-2">
                   
                    <div className="flex justify-between text-sm text-gray-500">
                        {data.length > 0 && (
                            <>
                                <span>{data[0].date}</span>
                                <span>{data[data.length - 1].date}</span>
                            </>
                        )}
                    </div>
                </div>

                {selected ? (
                    <div className="text-center space-y-1">
                        <p className="text-4xl font-bold text-orange-600">{selected.eps.toFixed(2)}</p>
                        <h2 className="text-base text-muted-foreground">{selected.date}</h2>
                    </div>
                ) : (
                    <p className="text-center text-muted-foreground">No data selected.</p>
                )}
            </CardContent>
        </Card>
    );
}
