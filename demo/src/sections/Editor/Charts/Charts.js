import { useEffect, useRef } from 'react';
import Chart from 'chart.js';

const MyChartComponent = ({ data }) => {
    const chartRef = useRef(null);

    useEffect(() => {
        if (chartRef && chartRef.current) {
            const newChartInstance = new Chart(chartRef.current, {
                type: 'bar',
                data: data,
                options: {
                    // Customization options go here
                }
            });
        }
    }, [chartRef, data]);

    return (
        <>
            <canvas ref={chartRef} />
        </>
    );
}

export default MyChartComponent;