import logo from '../assets/logo.png';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

export default function Home() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const auth = Cookies.get('admin_auth');
    setIsAdmin(auth === 'true');
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="max-w-sm w-full bg-white p-6 rounded shadow-sm text-center">
        <img 
          src={logo} 
          alt="Ascentech Logo" 
          className="mx-auto h-20 mb-6 object-contain"
        />
        <h1 className="text-xl font-bold text-gray-800 mb-6">
          Ascentech Hall Booking System
        </h1>
        <nav>
          <ul className="space-y-3">
            
            <li>
              <a href="/registration" className="block w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded">
               <p className='text-white'>  Hall Registration</p>
              </a>
            </li>
            <li>
              <a href="/view" className="block w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded">
               <p className='text-white'>  View Hall Booking </p>
              </a>
            </li>
            {isAdmin && (
              <li>
                <a href="/admin" className="block w-full py-2 px-4 bg-green-600 hover:bg-green-700 text-white rounded">
                  <p className='text-white'>  Admin Dashboard </p>
                </a>
              </li>
            )}
            {!isAdmin && (
              <li>
                <a href="/login" className="block w-full py-2 px-4 bg-gray-600 hover:bg-gray-700 text-white rounded">
                  <p className='text-white'>  Admin Login </p>
                </a>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </div>
  );
}