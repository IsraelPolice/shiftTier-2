import { User } from '../types';

export const isAdmin = (user: User | null): boolean => {
  if (!user) return false;
  return user.email === "dvir@example.com" || user.uid === "c4DgBjBITuW5xjje65mkqwuHxii2";
};

export const isAllowedRepresentative = (user: User | null): boolean => {
  if (!user || !user.email) return false;
  const allowedEmails = [
    "Rozeen.idbyeh@gav.co.il",
    "noah.labay@gav.co.il", 
    "Israel.shmilov@gav.co.il",
    "Lital.eran@gav.co.il",
    "Meital.bs@gav.co.il"
  ];
  return allowedEmails.includes(user.email);
};

export const getRepresentativeDisplayName = (email: string): string => {
  const representatives = {
    "Rozeen.idbyeh@gav.co.il": "רוזין אדביה",
    "noah.labay@gav.co.il": "נוח לבאי",
    "Israel.shmilov@gav.co.il": "ישראל שמילוב", 
    "Lital.eran@gav.co.il": "ליטל ערן",
    "Meital.bs@gav.co.il": "מיטל בר סיני"
  };
  return representatives[email] || email;
};

export const getAllowedRepresentatives = () => [
  { email: "Rozeen.idbyeh@gav.co.il", name: "רוזין אדביה" },
  { email: "noah.labay@gav.co.il", name: "נוח לבאי" },
  { email: "Israel.shmilov@gav.co.il", name: "ישראל שמילוב" },
  { email: "Lital.eran@gav.co.il", name: "ליטל ערן" },
  { email: "Meital.bs@gav.co.il", name: "מיטל בר סיני" }
];

export const getDefaultBreaks = () => [
  { time: "12:00", booked: false, user: null, note: null },
  { time: "12:30", booked: false, user: null, note: null },
  { time: "13:00", booked: false, user: null, note: null },
  { time: "13:30", booked: false, user: null, note: null },
  { time: "14:00", booked: false, user: null, note: null },
  { time: "14:30", booked: false, user: null, note: null },
  { time: "15:00", booked: false, user: null, note: null },
];