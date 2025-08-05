import React, { useState } from 'react';
import './App.css';

const BreakScheduler: React.FC = () => {
  const users = ["Dvir", "Rozeen", "Lital", "Israel", "Noah", "Meital"];
  const [selectedUser, setSelectedUser] = useState("");
  const [password, setPassword] = useState("");
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [breaks, setBreaks] = useState([
    { time: "12:00", booked: false, user: null },
    { time: "12:30", booked: false, user: null },
    { time: "13:00", booked: false, user: null },
    { time: "13:30", booked: false, user: null },
    { time: "14:00", booked: false, user: null },
    { time: "14:30", booked: false, user: null },
    { time: "15:00", booked: false, user: null },
  ]);
  const [message, setMessage] = useState("");

  const handleUserSelect = (user: string) => {
    setSelectedUser(user);
    setPassword("");
    setIsAdminAuthenticated(false);
  };

  const handleAdminLogin = () => {
    if (selectedUser === "Dvir" && password === "316439249") {
      setIsAdminAuthenticated(true);
      setMessage("התחברות כאדמין הצליחה");
    } else {
      setIsAdminAuthenticated(false);
      setMessage("סיסמה שגויה");
    }
  };

  const handleBooking = (index: number) => {
    if (!selectedUser) {
      setMessage("אנא בחר משתמש");
      return;
    }
    if (selectedUser === "Dvir" && !isAdminAuthenticated) {
      setMessage("אנא הזן סיסמה נכונה כדי לבצע פעולות כאדמין");
      return;
    }
    if (breaks[index].booked) {
      setMessage("סלוט זה כבר תפוס");
      return;
    }
    if (breaks.some((slot) => slot.booked && slot.user === selectedUser)) {
      setMessage("כבר בחרת הפסקה, לא ניתן לבחור שוב");
      return;
    }
    const newBreaks = [...breaks];
    newBreaks[index] = { ...newBreaks[index], booked: true, user: selectedUser };
    setBreaks(newBreaks);
    setMessage(`הפסקה בשעה ${newBreaks[index].time} נשמרה עבור ${selectedUser}`);
  };

  const handleCancelBooking = (index: number) => {
    if (selectedUser !== "Dvir" || !isAdminAuthenticated) {
      setMessage("רק אדמין (Dvir) עם סיסמה תקינה יכול לבטל שיבוצים");
      return;
    }
    const newBreaks = [...breaks];
    newBreaks[index] = { ...newBreaks[index], booked: false, user: null };
    setBreaks(newBreaks);
    setMessage(`השיבוץ בשעה ${newBreaks[index].time} בוטל`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-6">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">שיבוץ הפסקות</h1>
        <div className="mb-6">
          <select
            value={selectedUser}
            onChange={(e) => handleUserSelect(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
          >
            <option value="" disabled>בחר משתמש</option>
            {users.map((user) => (
              <option key={user} value={user}>
                {user}
              </option>
            ))}
          </select>
        </div>
        {selectedUser === "Dvir" && (
          <div className="mb-6">
            <input
              type="password"
              placeholder="הזן סיסמה לאדמין"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
            />
            <button
              onClick={handleAdminLogin}
              className="mt-2 w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              התחבר כאדמין
            </button>
          </div>
        )}
        <div className="space-y-3">
          {breaks.map((breakSlot, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg flex justify-between items-center transition-all duration-200 ${
                breakSlot.booked ? "bg-red-100" : "bg-green-100 hover:bg-green-200"
              }`}
            >
              <span className="text-lg font-medium text-gray-700">{breakSlot.time}</span>
              <span className="text-sm text-gray-600">
                {breakSlot.booked ? `תפוס על ידי ${breakSlot.user}` : "זמין"}
              </span>
              <div>
                {!breakSlot.booked && (
                  <button
                    onClick={() => handleBooking(index)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    disabled={selectedUser !== "Dvir" && breakSlot.user && breakSlot.user !== selectedUser}
                  >
                    שמור
                  </button>
                )}
                {breakSlot.booked && selectedUser === "Dvir" && isAdminAuthenticated && (
                  <button
                    onClick={() => handleCancelBooking(index)}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    בטל
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
        {message && (
          <p className={`mt-4 text-center text-lg ${message.includes("נשמרה") || message.includes("בוטל") ? "text-green-600" : "text-red-600"}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default BreakScheduler;
