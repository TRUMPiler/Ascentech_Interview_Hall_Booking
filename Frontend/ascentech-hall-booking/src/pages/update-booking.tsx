import { useEffect, useState, type FormEvent } from "react";
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

export default function UpdateBooking() {
  const [formData, setFormData] = useState<Booking | null>(null);

  useEffect(() => {
    const auth = Cookies.get("admin_auth");
    if (auth !== "true") {
      window.location.href = "/login";
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    if (id) {
      fetch(`${import.meta.env.VITE_API_URL}/api/bookings/${id}`)
        .then((res) => res.json())
        .then((data) => setFormData(data))
        .catch((err) => console.error(err));
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/bookings/${formData.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        window.location.href = "/admin";
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (!formData) return <div className="p-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Update Booking</h1>
            <a href="/admin" className="text-gray-600 hover:text-gray-800">Cancel</a>
        </div>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="applicantName" value={formData.applicantName} onChange={handleChange} placeholder="Applicant Name" className="border p-2 rounded" />
          <input name="email" value={formData.email} onChange={handleChange} placeholder="Email" className="border p-2 rounded" />
          <input name="mobileNo" value={formData.mobileNo} onChange={handleChange} placeholder="Mobile No" className="border p-2 rounded" />
          <input name="hallName" value={formData.hallName} onChange={handleChange} placeholder="Hall Name" className="border p-2 rounded" />
          <input name="purposeOfUse" value={formData.purposeOfUse} onChange={handleChange} placeholder="Purpose" className="border p-2 rounded" />
          <input name="startDate" value={formData.startDate} onChange={handleChange} placeholder="Start Date" className="border p-2 rounded" />
          <input name="endDate" value={formData.endDate} onChange={handleChange} placeholder="End Date" className="border p-2 rounded" />
          <input name="rent" value={formData.rent} onChange={handleChange} placeholder="Rent" className="border p-2 rounded" />
          <input name="additionalCharges" value={formData.additionalCharges} onChange={handleChange} placeholder="Add. Charges" className="border p-2 rounded" />
          <input name="total" value={formData.total} onChange={handleChange} placeholder="Total" className="border p-2 rounded" />
          <input name="receiptNo" value={formData.receiptNo} onChange={handleChange} placeholder="Receipt No" className="border p-2 rounded" />
          <input name="receiptDate" value={formData.receiptDate} onChange={handleChange} placeholder="Receipt Date" className="border p-2 rounded" />
          <input name="remarks" value={formData.remarks} onChange={handleChange} placeholder="Remarks" className="border p-2 rounded" />
          <select name="status" value={formData.status} onChange={handleChange} className="border p-2 rounded">
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
          </select>
          <button type="submit" className="col-span-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Save Changes</button>
        </form>
      </div>
    </div>
  );
}