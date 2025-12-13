import { useState, useEffect } from 'react';
import axios from 'axios';

interface Booking {
  id: number;
  applicantName: string;
  hallName: string;
  startDate: string;
  endDate: string;
  mobileNo: string;
  totalAmount: number;
  status: string;
}

const View = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const apiUrl = "http://localhost:5000";

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/bookings`);
        setBookings(response.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch bookings');
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (loading) return <div className="text-center mt-10 text-gray-600">Loading...</div>;
  if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;

  return (
    <div className="max-w-6xl mx-auto p-6 mt-10 bg-white rounded shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Hall Bookings</h1>
        <button 
          onClick={() => window.history.back()} 
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
        >
          Back
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">Applicant</th>
              <th className="py-3 px-6 text-left">Hall</th>
              <th className="py-3 px-6 text-left">Start Date</th>
              <th className="py-3 px-6 text-left">End Date</th>
              <th className="py-3 px-6 text-left">Mobile</th>
              <th className="py-3 px-6 text-right">Total</th>
              <th className="py-3 px-6 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {bookings.map((booking) => (
              <tr key={booking.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                <td className="py-3 px-6 text-left whitespace-nowrap font-medium">{booking.applicantName}</td>
                <td className="py-3 px-6 text-left">{booking.hallName}</td>
                <td className="py-3 px-6 text-left">{new Date(booking.startDate).toLocaleDateString()}</td>
                <td className="py-3 px-6 text-left">{new Date(booking.endDate).toLocaleDateString()}</td>
                <td className="py-3 px-6 text-left">{booking.mobileNo}</td>
                <td className="py-3 px-6 text-right">{booking.totalAmount}</td>
                <td className="py-3 px-6 text-center">
                  <span className="bg-green-100 text-green-700 py-1 px-3 rounded-full text-xs font-medium">
                    {booking.status || 'Confirmed'}
                  </span>
                </td>
              </tr>
            ))}
            {bookings.length === 0 && (
              <tr>
                <td colSpan={7} className="py-4 px-6 text-center text-gray-500">No bookings found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default View;
