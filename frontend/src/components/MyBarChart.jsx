import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const data = {
  labels: ['Jan', 'Feb', 'Mar'],
  datasets: [
    {
      label: 'Sales',
      data: [30, 50, 70],
      backgroundColor: 'rgba(75, 192, 192, 0.6)',
    }
  ]
};

const options = {
  responsive: true,             // make chart responsive
  maintainAspectRatio: false,   // allows height to adjust automatically
  plugins: {
    legend: {
      labels: {
        font: {
          size: 14,             // font size for legend, adjust as needed
        }
      }
    },
    tooltip: {
      enabled: true,
    }
  },
  scales: {
    x: {
      ticks: {
        font: {
          size: 12,             // font size for x-axis labels
        }
      }
    },
    y: {
      ticks: {
        font: {
          size: 12,             // font size for y-axis labels
        },
        beginAtZero: true,
      }
    }
  }
};

export default function MyBarChart() {
  return (
    <div className="w-full max-w-xl mx-auto p-4" style={{ height: '300px' }}>
      <Bar data={data} options={options} />
    </div>
  );
}
