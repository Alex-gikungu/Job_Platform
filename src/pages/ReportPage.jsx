// src/pages/ReportPage.jsx

import React, { useEffect, useState, useRef } from 'react';
import { Bar, Chart } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
} from 'chart.js';
import { Download, X } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

ChartJS.register(
  BarElement,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

const ReportPage = () => {
  const [summary, setSummary] = useState({ generated: 0, expected: 0 });
  const [trend, setTrend] = useState({ dates: [], posted: [], claimed: [] });
  const [jobDetails, setJobDetails] = useState([]);
  const [selectedType, setSelectedType] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [errorDetails, setErrorDetails] = useState('');
  const reportRef = useRef(null);

  const BASE_URL = 'http://127.0.0.1:5000';
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchSummary();
    fetchTrend();
  }, []);

  const fetchSummary = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/report/summary`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Summary fetch failed');
      setSummary(await res.json());
    } catch (err) {
      console.error(err);
    }
  };

  const fetchTrend = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/report/trends`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Trend fetch failed');
      setTrend(await res.json());
    } catch (err) {
      console.error(err);
    }
  };

  const fetchRevenueDetails = async (type) => {
    setLoadingDetails(true);
    setErrorDetails('');
    try {
      const res = await fetch(
        `${BASE_URL}/api/report/revenue-details?type=${type}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!res.ok) throw new Error('Failed to load details');
      const data = await res.json();
      setJobDetails(data);
      setSelectedType(type);
    } catch (err) {
      console.error(err);
      setErrorDetails(err.message);
    } finally {
      setLoadingDetails(false);
    }
  };

  const closeDetails = () => {
    setSelectedType(null);
    setJobDetails([]);
    setErrorDetails('');
  };

const downloadPDF = async () => {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const margin = 7;
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  // 1. Title & Date
  pdf.setFontSize(20);
  pdf.setTextColor('#1976d2');
  pdf.text('Revenue & Trend Report', margin, 20);

  pdf.setFontSize(10);
  pdf.setTextColor('#424242');
  pdf.text(`Generated on: ${new Date().toLocaleString()}`, margin, 26);

  // 2. Executive Summary
  pdf.setFontSize(11);
  pdf.setTextColor('#000');
  const summaryText =
    `This report provides an overview of total revenue generated versus expected revenue from posted jobs. ` +
    `You will find a week-by-week view of postings (bars) and claim activity (line), followed by a detailed breakdown.`;
  const summaryLines = pdf.splitTextToSize(summaryText, pageWidth - margin * 2);
  const summaryStartY = 34;
  pdf.text(summaryLines, margin, summaryStartY);

  // 3. Key Highlights (compute Y after summary)
  const lineHeight = pdf.internal.getLineHeight() || pdf.getFontSize() * 0.3528;
  const summaryHeight = summaryLines.length * lineHeight;
  const padding = 3;
  const highlightsY = summaryStartY + summaryHeight + padding;

  pdf.setFontSize(11);
  pdf.text('Key Highlights:', margin, highlightsY);

  pdf.setFontSize(10);
  const bullets = [
    `• Total Generated: KES ${summary.generated.toLocaleString()}`,
    `• Total Expected:  KES ${summary.expected.toLocaleString()}`,
    `• Peak Claims on:  ${trend.dates.reduce((prev, curr) =>
         trend.claimed[trend.dates.indexOf(curr)] > trend.claimed[trend.dates.indexOf(prev)]
           ? curr
           : prev
       )}`
  ];
  pdf.text(
    pdf.splitTextToSize(bullets.join('\n'), pageWidth - margin * 2),
    margin,
    highlightsY + 4
  );

  // 4. Chart with dynamic scaling
  const canvas = await html2canvas(reportRef.current, { scale: 2 });
  const imgData = canvas.toDataURL('image/png');
  const imgProps = pdf.getImageProperties(imgData);
  const imgWidth = pageWidth - margin * 2;

  // Calculate available height before signature (reserve ~20mm for signature+footer)
  const chartStartY = highlightsY + 30;
  const reservedForSig = 20;
  const maxChartHeight = pageHeight - chartStartY - reservedForSig - margin;
  const originalChartHeight = (imgProps.height * imgWidth) / imgProps.width;
  const chartHeight = Math.min(originalChartHeight, maxChartHeight);

  pdf.addImage(imgData, 'PNG', margin, chartStartY, imgWidth, chartHeight);

  // 5. Signature line & footer (just below the chart)
  const sigY = chartStartY + chartHeight + 5;
  pdf.setDrawColor('#000').setLineWidth(0.5);
  pdf.line(margin, sigY, pageWidth - margin, sigY);

  pdf.setFontSize(12);
  pdf.text('Approved by: ______________________', margin, sigY + 8);

  pdf.setFontSize(8);
  pdf.text(`Page 1 of 1`, pageWidth - margin - 20, pageHeight - 10);

  pdf.save('revenue-trend-report.pdf');
};


  // Revenue comparison bar chart data
  const barData = {
    labels: ['Revenue Generated', 'Expected Revenue'],
    datasets: [
      {
        label: 'KES',
        data: [summary.generated, summary.expected],
        backgroundColor: ['#10B981', '#3B82F6']
      }
    ]
  };

  // Prepare weekly trend data (last 7 days)
  const lastDates = trend.dates.slice(-7);
  const lastPosted = trend.posted.slice(-7);
  const lastClaimed = trend.claimed.slice(-7);

  // Format as "Mon 08-04"
  const formattedLabels = lastDates.map(d => {
    const dt = new Date(d);
    const weekday = dt.toLocaleDateString('en-US', { weekday: 'short' });
    const day = String(dt.getDate()).padStart(2, '0');
    const month = String(dt.getMonth() + 1).padStart(2, '0');
    return `${weekday} ${day}-${month}`;
  });

  const mixedData = {
    labels: formattedLabels,
    datasets: [
      {
        type: 'bar',
        label: 'Jobs Posted',
        data: lastPosted,
        backgroundColor: '#3B82F6',
        borderRadius: 4,
        barThickness: 32
      },
      {
        type: 'line',
        label: 'Jobs Claimed',
        data: lastClaimed,
        borderColor: '#EF4444',
        backgroundColor: 'rgba(239,68,68,0.2)',
        tension: 0.4,
        borderWidth: 3,
        fill: true,
        pointRadius: 5
      }
    ]
  };

  const mixedOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top', labels: { color: '#D1D5DB', padding: 20 } },
      tooltip: { mode: 'index', intersect: false }
    },
    scales: {
      x: {
        title: { display: true, text: 'Day & Date', color: '#9CA3AF' },
        ticks: { color: '#D1D5DB' },
        grid: { display: false }
      },
      y: {
        title: { display: true, text: 'Number of Jobs', color: '#9CA3AF' },
        ticks: { color: '#D1D5DB', stepSize: 1 },
        grid: { color: 'rgba(255,255,255,0.1)' }
      }
    }
  };

  return (
    <div className="min-h-screen bg-black text-white px-6 py-16">
      <div ref={reportRef} className="space-y-12">

        <div className="flex justify-between items-center">
          <h2 className="text-4xl font-bold text-blue-400">
            Revenue & Trend Report
          </h2>
          <button
            onClick={downloadPDF}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
          >
            <Download size={20} /> Download PDF
          </button>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          <div
            onClick={() => fetchRevenueDetails('generated')}
            className="cursor-pointer bg-gray-900 p-6 rounded-lg shadow hover:bg-gray-800 transition"
          >
            <h3 className="text-xl font-semibold text-gray-300">
              Revenue Generated
            </h3>
            <p className="mt-2 text-3xl font-bold text-green-400">
              KES {summary.generated.toLocaleString()}
            </p>
          </div>
          <div
            onClick={() => fetchRevenueDetails('expected')}
            className="cursor-pointer bg-gray-900 p-6 rounded-lg shadow hover:bg-gray-800 transition"
          >
            <h3 className="text-xl font-semibold text-gray-300">
              Expected Revenue
            </h3>
            <p className="mt-2 text-3xl font-bold text-blue-400">
              KES {summary.expected.toLocaleString()}
            </p>
          </div>
        </div>

        {selectedType && (
          <section className="bg-gray-900 p-6 rounded-lg shadow max-w-5xl mx-auto">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-semibold text-gray-300">
                {selectedType === 'generated'
                  ? 'Generated Revenue Breakdown'
                  : 'Expected Revenue Breakdown'}
              </h4>
              <button
                onClick={closeDetails}
                className="text-gray-400 hover:text-gray-200"
              >
                <X size={20} />
              </button>
            </div>

            {loadingDetails && <p>Loading details…</p>}
            {errorDetails && <p className="text-red-500">{errorDetails}</p>}

            {!loadingDetails && !errorDetails && jobDetails.length > 0 && (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 text-left text-sm text-gray-400">
                        Job ID
                      </th>
                      <th className="px-4 py-2 text-left text-sm text-gray-400">
                        Title
                      </th>
                      <th className="px-4 py-2 text-right text-sm text-gray-400">
                        Amount (KES)
                      </th>
                      <th className="px-4 py-2 text-center text-sm text-gray-400">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-gray-800 divide-y divide-gray-700">
                    {jobDetails.map(job => (
                      <tr key={job.jobId}>
                        <td className="px-4 py-2 text-gray-200">
                          {job.jobId}
                        </td>
                        <td className="px-4 py-2 text-gray-200">
                          {job.title}
                        </td>
                        <td className="px-4 py-2 text-right text-green-300">
                          {job.amount.toLocaleString()}
                        </td>
                        <td className="px-4 py-2 text-center text-gray-200">
                          {new Date(job.date).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {!loadingDetails && !errorDetails && jobDetails.length === 0 && (
              <p className="text-gray-400">No jobs found for this category.</p>
            )}
          </section>
        )}

        <section className="bg-gray-900 p-6 rounded-lg shadow max-w-4xl mx-auto">
          <h4 className="text-lg font-semibold text-gray-300 mb-4">
            Revenue Comparison
          </h4>
          <Bar
            data={barData}
            options={{
              responsive: true,
              plugins: { legend: { display: false } },
              scales: {
                y: {
                  ticks: { color: '#D1D5DB' },
                  grid: { color: 'rgba(255,255,255,0.1)' }
                },
                x: { ticks: { color: '#D1D5DB' } }
              }
            }}
          />
        </section>

        <section className="bg-gray-900 p-6 rounded-lg shadow max-w-4xl mx-auto">
          <h4 className="text-lg font-semibold text-gray-300 mb-4">
            Weekly Jobs Posted (bars) & Claimed (line)
          </h4>
          <Chart type="bar" data={mixedData} options={mixedOptions} />
        </section>
      </div>
    </div>
  );
};

export default ReportPage;
