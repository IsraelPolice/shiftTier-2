import React from 'react';
import { BreakSlot, User } from '../types';
import { updateBreak } from '../services/firestore';
import { getRepresentativeDisplayName } from '../utils/auth';

interface UserDashboardProps {
  breaks: BreakSlot[];
  user: User;
  selectedDate: string;
  setBreaks: (breaks: BreakSlot[]) => void;
  setMessage: (message: string) => void;
  onLogout: () => void;
}

const UserDashboard: React.FC<UserDashboardProps> = ({
  breaks,
  user,
  selectedDate,
  setBreaks,
  setMessage,
  onLogout,
}) => {
  const handleBooking = async (index: number) => {
    if (!user) {
      setMessage("אנא התחבר כדי לבצע פעולות");
      return;
    }
    if (breaks[index].booked) {
      setMessage("סלוט זה כבר תפוס");
      return;
    }
    if (breaks.some((slot) => slot.booked && slot.user === user.email)) {
      setMessage("כבר בחרת הפסקה, לא ניתן לבחור שוב");
      return;
    }
    const newBreaks = [...breaks];
    newBreaks[index] = {
      ...newBreaks[index],
      booked: true,
      user: user.email,
    };
    setBreaks(newBreaks);
    setMessage(`הפסקה בשעה ${newBreaks[index].time} נשמרה עבורך`);

    try {
      await updateBreak(selectedDate, index, newBreaks[index]);
    } catch (error) {
      console.error("Error saving break:", error);
      setMessage("שגיאה בשמירת ההפסקה");
    }
  };

  return (
    <div>
      <div className="mb-6">
        <p className="text-center text-lg text-gray-700">
          מחובר כ: {user.email}
        </p>
        <button
          onClick={onLogout}
          className="w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors mt-2"
        >
          התנתק
        </button>
      </div>
      <div className="space-y-3">
        {breaks.map((breakSlot, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg flex flex-col space-y-2 transition-all duration-200 ${
              breakSlot.booked
                ? "bg-red-100"
                : "bg-green-100 hover:bg-green-200"
            }`}
          >
            <div className="flex justify-between items-center">
              <span className="text-lg font-medium text-gray-700">
                {breakSlot.time}
              </span>
              <span className="text-sm text-gray-600">
                {breakSlot.booked
                  ? `תפוס על ידי ${getRepresentativeDisplayName(breakSlot.user || '')}`
                  : "זמין"}
              </span>
            </div>
            {breakSlot.note && (
              <span className="text-sm text-gray-500">
                הערה: {breakSlot.note}
              </span>
            )}
            <div>
              {!breakSlot.booked && (
                <button
                  onClick={() => handleBooking(index)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  שמור
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserDashboard;