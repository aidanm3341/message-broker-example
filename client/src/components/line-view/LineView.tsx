import React from 'react';
import { Line, LineChart } from 'recharts';

interface LineViewProps {
    data: unknown[];
    dataKey: string;
}

export function LineView({ data, dataKey }: LineViewProps) {
    return (
        <div
            style={{
                border: '1px solid #444444',
                padding: '1rem',
            }}
        >
            <LineChart width={300} height={200} data={data}>
                <Line
                    type='monotone'
                    dataKey={dataKey}
                    stroke='#8884d8'
                    strokeWidth={2}
                    isAnimationActive={false}
                    dot={false}
                />
            </LineChart>
        </div>
    );
}
