import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut, User as FirebaseUser } from 'firebase/auth';
import { auth } from '../config/firebase';
import { User, BreakSlot } from '../types';
import { isAdmin, isAllowedRepresentative, getRepresentativeDisplayName } from '../utils/auth';
import { initializeBreaks, subscribeToBreaks } from '../services/firestore';
import AdminDashboard from './AdminDashboard';
import UserDashboard from './UserDashboard';
import AuthForm from './AuthForm';
import DateNavigation from './DateNavigation';

const BreakScheduler: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isUserAdmin, setIsUserAdmin] = useState(false);
  const [isUserAllowed, setIsUserAllowed] = useState(false);
  const [breaks, setBreaks] = useState<BreakSlot[]>([]);
  const [message, setMessage] = useState("");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  // Real-time updates for breaks
  useEffect(() => {
    if (!user) return;
    
    const unsubscribe = subscribeToBreaks(
      selectedDate,
      (breaks) => {
        setBreaks(breaks);
      },
      (error) => {
        console.error("Error in real-time breaks update:", error);
        setMessage("שגיאה בעדכון ההפסקות בזמן אמת");
      }
    );

    initializeBreaks(selectedDate).catch((error) => {
      console.error("Error initializing breaks:", error);
      setMessage("שגיאה בטעינת ההפסקות");
    });

    return () => unsubscribe();
  }, [selectedDate, user]);

  // Monitor authentication state
  useEffect(() => {
    console.log("Starting onAuthStateChanged");
    const unsubscribe = onAuthStateChanged(
      auth,
      (currentUser: FirebaseUser | null) => {
        console.log("onAuthStateChanged triggered", { currentUser });
        if (currentUser) {
          const userData: User = {
            uid: currentUser.uid,
            email: currentUser.email,
          };
          console.log("User email:", currentUser.email);
          console.log("User UID:", currentUser.uid);
          setUser(userData);
          const adminStatus = isAdmin(userData);
          const allowedStatus = isAllowedRepresentative(userData);
          setIsUserAdmin(adminStatus);
          setIsUserAllowed(allowedStatus);
          console.log("isAdmin set to:", adminStatus);
          console.log("isAllowed set to:", allowedStatus);
        } else {
          console.log("No user logged in");
          setUser(null);
          setIsUserAdmin(false);
          setIsUserAllowed(false);
          setBreaks([]);
        }
      },
      (error) => {
        console.error("Auth state change error:", error);
      }
    );

    return () => {
      console.log("Cleaning up onAuthStateChanged");
      unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setMessage("התנתקת בהצלחה");
    } catch (error: any) {
      console.error("Logout error:", error);
      setMessage("שגיאה בהתנתקות: " + error.message);
    }
  };

  return (
    <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-6">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
        צוות ברקת שיבוץ משמרות {user && `- ${selectedDate}`}
      </h1>
      
      {!user ? (
        <AuthForm setMessage={setMessage} />
      ) : !isUserAdmin && !isUserAllowed ? (
        <div className="text-center">
          <p className="text-red-600 mb-4">
            אין לך הרשאה לגשת למערכת זו
          </p>
          <p className="text-gray-600 mb-4">
            מחובר כ: {getRepresentativeDisplayName(user.email || '')}
          </p>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            התנתק
          </button>
        </div>
      ) : (
        <div>
          {user && (
            <DateNavigation 
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
            />
          )}
          
          {isUserAdmin ? (
            <AdminDashboard
              breaks={breaks}
              currentDate={selectedDate}
              setBreaks={setBreaks}
              setMessage={setMessage}
            />
          ) : (
            <UserDashboard
              breaks={breaks}
              user={user}
              selectedDate={selectedDate}
              setBreaks={setBreaks}
              setMessage={setMessage}
              onLogout={handleLogout}
            />
          )}
        </div>
      )}
      
      {message && (
        <p
          className={`mt-4 text-center text-lg ${
            message.includes("הצליחה") ||
            message.includes("בוטל") ||
            message.includes("עודכן") ||
            message.includes("נוסף") ||
            message.includes("נמחק") ||
            message.includes("שובץ")
              ? "text-green-600"
              : "text-red-600"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
};

export default BreakScheduler;