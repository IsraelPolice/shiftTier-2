import React, { useState } from 'react';
import { AdminDashboardProps } from '../types';
import { updateBreak, deleteBreak } from '../services/firestore';
import { getAllowedRepresentatives, getRepresentativeDisplayName } from '../utils/auth';

const AdminDashboard: React.FC<AdminDashboardProps> = ({
  breaks,
  currentDate,
  setBreaks,
  setMessage,
}) => {
  const allowedRepresentatives = getAllowedRepresentatives();
  const [selectedUser, setSelectedUser] = useState("");
  const [newSlotTime, setNewSlotTime] = useState("");
  const [newSlotNote, setNewSlotNote] = useState("");

  const handleCancelBooking = async (index: number) => {
    const newBreaks = [...breaks];
    newBreaks[index] = {
      ...newBreaks[index],
      booked: false,
      user: null,
      note: null,
    };
    setBreaks(newBreaks);
    setMessage(`השיבוץ בשעה ${newBreaks[index].time} בוטל`);

    try {
      await updateBreak(currentDate, index, newBreaks[index]);
    } catch (error) {
      console.error("Error canceling break:", error);
      setMessage("שגיאה בביטול ההפסקה");
    }
  };

  const handleUpdateBooking = async (index: number) => {
    if (!selectedUser) {
      setMessage("אנא בחר משתמש לעדכון");
      return;
    }
    const newBreaks = [...breaks];
    newBreaks[index] = {
      ...newBreaks[index],
      booked: true,
      user: selectedUser, // This will be the email
    };
    setBreaks(newBreaks);
    const displayName = getRepresentativeDisplayName(selectedUser);
    setMessage(`השיבוץ בשעה ${newBreaks[index].time} עודכן ל-${displayName}`);

    try {
      await updateBreak(currentDate, index, newBreaks[index]);
    } catch (error) {
      console.error("Error updating break:", error);
      setMessage("שגיאה בעדכון ההפסקה");
    }
  };

  const handleAssignBooking = async (index: number) => {
    if (!selectedUser) {
      setMessage("אנא בחר משתמש לשיבוץ");
      return;
    }
    const newBreaks = [...breaks];
    newBreaks[index] = {
      ...newBreaks[index],
      booked: true,
      user: selectedUser, // This will be the email
    };
    setBreaks(newBreaks);
    const displayName = getRepresentativeDisplayName(selectedUser);
    setMessage(`הסלוט בשעה ${newBreaks[index].time} שובץ ל-${displayName}`);

    try {
      await updateBreak(currentDate, index, newBreaks[index]);
    } catch (error) {
      console.error("Error assigning break:", error);
      setMessage("שגיאה בשיבוץ ההפסקה");
    }
  };

  const handleAddSlot = async () => {
    if (!newSlotTime || !/^\d{2}:\d{2}$/.test(newSlotTime)) {
      setMessage("אנא הזן שעה תקינה בפורמט HH:MM");
      return;
    }
    const newBreaks = [
      ...breaks,
      {
        time: newSlotTime,
        booked: false,
        user: null,
        note: newSlotNote || null,
      },
    ];
    const newIndex = newBreaks.length - 1;
    setBreaks(newBreaks.sort((a, b) => a.time.localeCompare(b.time)));
    setMessage(`סלוט חדש בשעה ${newSlotTime} נוסף`);
    setNewSlotTime("");
    setNewSlotNote("");

    try {
      await updateBreak(currentDate, newIndex, newBreaks[newIndex]);
    } catch (error) {
      console.error("Error adding slot:", error);
      setMessage("שגיאה בהוספת סלוט");
    }
  };

  const handleDeleteSlot = async (index: number) => {
    const newBreaks = breaks.filter((_, i) => i !== index);
    setBreaks(newBreaks.sort((a, b) => a.time.localeCompare(b.time)));
    setMessage(`סלוט בשעה ${breaks[index].time} נמחק`);

    try {
      await deleteBreak(currentDate, index);
    } catch (error) {
      console.error("Error deleting slot:", error);
      setMessage("שגיאה במחיקת סלוט");
    }
  };

  const handleUpdateNote = async (index: number, note: string) => {
    const newBreaks = [...breaks];
    newBreaks[index] = { ...newBreaks[index], note };
    setBreaks(newBreaks);
    setMessage(`הערה לסלוט בשעה ${newBreaks[index].time} עודכנה`);

    try {
      await updateBreak(currentDate, index, newBreaks[index]);
    } catch (error) {
      console.error("Error updating note:", error);
      setMessage("שגיאה בעדכון ההערה");
    }
  };

  const bookedCount = breaks.filter((slot) => slot.booked).length;
  const availableCount = breaks.length - bookedCount;

  return (
    <div className="max-w-lg w-full bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
        ניהול משמרות
      </h2>
      <div className="mb-6">
        <p className="text-center text-lg text-gray-700">
          סטטוס משמרת: {bookedCount} תפוסים, {availableCount} זמינים
        </p>
      </div>
      <div className="mb-6">
        <select
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
        >
        {allowedRepresentatives.map((rep) => (
          <option key={rep.email} value={rep.email}>
            {rep.name}
          </option>
        ))}
        </select>
      </div>
      <div className="mb-6">
        <input
          type="text"
          placeholder="הוסף סלוט חדש (HH:MM)"
          value={newSlotTime}
          onChange={(e) => setNewSlotTime(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-right mb-2"
        />
        <input
          type="text"
          placeholder="הוסף הערה לסלוט (אופציונלי)"
          value={newSlotNote}
          onChange={(e) => setNewSlotNote(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-right mb-2"
        />
        <button
          onClick={handleAddSlot}
          className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
        >
          הוסף סלוט
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
                  ? `תפוס על ידי ${breakSlot.user}`
                  : "זמין"}
              </span>
            </div>
            {breakSlot.note && (
              <span className="text-sm text-gray-500">
                הערה: {breakSlot.note}
              </span>
            )}
            <div className="flex space-x-2">
              {!breakSlot.booked && (
                <button
                  onClick={() => handleAssignBooking(index)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  שיבוץ
                </button>
              )}
              {breakSlot.booked && (
                <button
                  onClick={() => handleCancelBooking(index)}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  בטל
                </button>
              )}
              {breakSlot.booked && (
                <button
                  onClick={() => handleUpdateBooking(index)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  עדכן
                </button>
              )}
              <button
                onClick={() => handleDeleteSlot(index)}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                מחק
              </button>
              <input
                type="text"
                placeholder="הוסף/ערוך הערה"
                defaultValue={breakSlot.note || ""}
                onBlur={(e) => handleUpdateNote(index, e.target.value)}
                className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;