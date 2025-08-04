import React, { useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';

interface AuthFormProps {
  setMessage: (message: string) => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ setMessage }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setMessage("התחברות הצליחה");
    } catch (error: any) {
      console.error("Login error:", error);
      setMessage("שגיאה בהתחברות: " + error.message);
    }
  };

  const handleRegister = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setMessage("הרשמה הצליחה, אנא התחבר");
      setIsRegistering(false);
    } catch (error: any) {
      console.error("Registration error:", error);
      setMessage("שגיאה בהרשמה: " + error.message);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <input
          type="email"
          placeholder="הזן אימייל"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
        />
      </div>
      <div className="mb-6">
        <input
          type="password"
          placeholder="הזן סיסמה"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
        />
      </div>
      {isRegistering ? (
        <button
          onClick={handleRegister}
          className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors mb-2"
        >
          הרשם
        </button>
      ) : (
        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors mb-2"
        >
          התחבר
        </button>
      )}
      <button
        onClick={() => setIsRegistering(!isRegistering)}
        className="w-full bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
      >
        {isRegistering ? "חזור להתחברות" : "הרשם"}
      </button>
    </div>
  );
};

export default AuthForm;