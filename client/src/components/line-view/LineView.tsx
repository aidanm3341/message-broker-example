import { Line, LineChart } from 'recharts';
import { CHART_CONFIG } from '../../config/constants.ts';
import { styles } from './styles.ts';

interface LineViewProps {
    data: unknown[];
    dataKey: string;
}

export function LineView({ data, dataKey }: LineViewProps) {
    return (
        <div style={styles.container}>
            <LineChart width={CHART_CONFIG.WIDTH} height={CHART_CONFIG.HEIGHT} data={data}>
                <Line
                    type='monotone'
                    dataKey={dataKey}
                    stroke={CHART_CONFIG.STROKE_COLOR}
                    strokeWidth={CHART_CONFIG.STROKE_WIDTH}
                    isAnimationActive={false}
                    dot={false}
                />
            </LineChart>
        </div>
    );
}
