import React from 'react';

interface DateNavigationProps {
  selectedDate: string;
  setSelectedDate: (date: string) => void;
}

const DateNavigation: React.FC<DateNavigationProps> = ({
  selectedDate,
  setSelectedDate,
}) => {
  const handleDateChange = (offset: number) => {
    const current = new Date(selectedDate);
    current.setDate(current.getDate() + offset);
    setSelectedDate(current.toISOString().split("T")[0]);
  };

  return (
    <div className="mb-6 flex justify-between items-center">
      <button
        onClick={() => handleDateChange(-1)}
        className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
      >
        יום קודם
      </button>
      <input
        type="date"
        value={selectedDate}
        onChange={(e) => setSelectedDate(e.target.value)}
        className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
      />
      <button
        onClick={() => handleDateChange(1)}
        className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
      >
        יום הבא
      </button>
    </div>
  );
};

export default DateNavigation;