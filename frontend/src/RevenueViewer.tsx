import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

interface RevenueViewerProps {
    symbol: string;
    trigger: number;
    setLoading: (v: boolean) => void;
    selectedIndex: number;
}

function formatRevenue(value: number): string {
    if (value >= 1e12) return `${(value / 1e12).toFixed(2)}T`;
    if (value >= 1e9) return `${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `${(value / 1e6).toFixed(2)}M`;
    if (value >= 1e3) return `${(value / 1e3).toFixed(2)}K`;
    return value.toString();
}

export default function RevenueViewer({ symbol, trigger, setLoading, selectedIndex }: RevenueViewerProps) {
    const [data, setData] = useState<{ date: string; revenue: number }[]>([]);
 

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await fetch(`http://localhost:8000/metrics/${symbol}`);
            const json = await res.json();
            const parsed = json.income.map((entry) => ({
                date: entry.date,
                revenue: entry.revenue || 0
            })).reverse();
            setData(parsed);
        } catch (err) {
            console.error('Failed to fetch revenue:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [trigger]); // re-fetch when trigger changes

    const selected = data[selectedIndex];

    return (
        <div className="space-y-6">
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
                            <p className="text-4xl font-bold text-green-600">
                                ${formatRevenue(selected.revenue)}
                            </p>
                            <h2 className="text-base text-muted-foreground">{selected.date}</h2>
                        </div>
                    ) : (
                        <p className="text-center text-muted-foreground">No data selected.</p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
