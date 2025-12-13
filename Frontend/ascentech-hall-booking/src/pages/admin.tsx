import { useEffect, useState } from "react";
import Cookies from "js-cookie";

interface Booking {
  id: number;
  hallName: string;
  startDate: string;
  endDate: string;
  mobileNo: string;
  applicantName: string;
  email: string;
  purposeOfUse: string;
  rent: string;
  additionalCharges: string;
  total: string;
  remarks: string;
  receiptNo: string;
  receiptDate: string;
  status: 'Pending' | 'Confirmed';
}

export default function AdminDashboard() {
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    const auth = Cookies.get("admin_auth");
    if (auth !== "true") {
      window.location.href = "/login";
    } else {
      fetch(`${import.meta.env.VITE_API_URL}/api/bookings`)
        .then((res) => res.json())
        .then((data) => setBookings(data))
        .catch((err) => console.error("Error fetching bookings:", err));
    }
  }, []);

  const handleGrant = async (id: number) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/bookings/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Confirmed" }),
      });
      if (res.ok) {
        setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status: "Confirmed" } : b)));
      }
    } catch (error) {
      console.error("Error updating booking:", error);
    }
  };

  const handleUpdate = async (booking: Booking) => {
    const newHallName = window.prompt("Enter new Hall Name:", booking.hallName);
    if (newHallName && newHallName !== booking.hallName) {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/bookings/${booking.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ hallName: newHallName }),
        });
        if (res.ok) {
          setBookings((prev) => prev.map((b) => (b.id === booking.id ? { ...b, hallName: newHallName } : b)));
        }
      } catch (error) {
        console.error("Error updating booking:", error);
      }
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this booking?")) {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/bookings/${id}`, { method: "DELETE" });
        if (res.ok) {
          setBookings((prev) => prev.filter((b) => b.id !== id));
        }
      } catch (error) {
        console.error("Error deleting booking:", error);
      }
    }
  };

  const handleLogout = () => {
    Cookies.remove("admin_auth");
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <a href="/" className="text-gray-600 hover:text-gray-800 font-medium">
              &larr; Back
            </a>
            <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
          </div>
          <button onClick={handleLogout} className="text-red-600 hover:text-red-800 font-medium">Logout</button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 border-b">
                <th className="p-3 font-semibold text-gray-700">Applicant</th>
                <th className="p-3 font-semibold text-gray-700">Hall Info</th>
                <th className="p-3 font-semibold text-gray-700">Dates</th>
                <th className="p-3 font-semibold text-gray-700">Financials</th>
                <th className="p-3 font-semibold text-gray-700">Receipt</th>
                <th className="p-3 font-semibold text-gray-700">Status</th>
                <th className="p-3 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">
                    <div className="font-medium">{booking.applicantName}</div>
                    <div className="text-xs text-gray-500">{booking.email}</div>
                    <div className="text-xs text-gray-500">{booking.mobileNo}</div>
                  </td>
                  <td className="p-3">
                    <div className="font-medium">{booking.hallName}</div>
                    <div className="text-xs text-gray-500 truncate max-w-[150px]" title={booking.purposeOfUse}>{booking.purposeOfUse}</div>
                  </td>
                  <td className="p-3 text-sm">
                    <div className="whitespace-nowrap">Start: {booking.startDate}</div>
                    <div className="whitespace-nowrap">End: {booking.endDate}</div>
                  </td>
                  <td className="p-3 text-sm">
                    <div>Rent: {booking.rent}</div>
                    <div>Total: {booking.total}</div>
                  </td>
                  <td className="p-3 text-sm">
                    <div>#{booking.receiptNo}</div>
                    <div className="whitespace-nowrap">{booking.receiptDate}</div>
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded text-xs ${booking.status === 'Confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="p-3 space-x-2">
                    {booking.status === 'Pending' && (
                      <button 
                        onClick={() => handleGrant(booking.id)}
                        className="bg-blue-600 text-green-800 px-3 py-1 rounded text-sm hover:bg-blue-700"
                      >
                        Grant
                      </button>
                    )}
                    <button 
                      onClick={() => handleUpdate(booking)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600"
                    >
                      Update
                    </button>
                    <button 
                      onClick={() => handleDelete(booking.id)}
                      className="bg-red-600 text-shadow-red-600 px-3 py-1 rounded text-sm hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {bookings.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-4 text-center text-gray-500">No bookings found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}