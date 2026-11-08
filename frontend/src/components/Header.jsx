import React from 'react';
import { Calendar } from 'lucide-react';

export default function Header({
  selectedYear,
  setSelectedYear
}) {
  const years = ['2025', '2024', '2023', '2022', '2021', '2020'];

  return (
    <header className="top-header" style={{ justifyContent: 'flex-end' }}>
      <div className="header-actions">
        {/* Year Selector */}
        <div className="year-picker">
          <Calendar size={14} color="#94a3b8" />
          <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>รอบปีข้อมูล:</span>
          <select
            className="year-select"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
          >
            {years.map((yr) => (
              <option key={yr} value={yr}>
                {yr}
              </option>
            ))}
          </select>
        </div>
      </div>
    </header>
  );
}
