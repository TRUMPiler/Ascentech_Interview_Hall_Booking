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
  remark: string;
  receiptNo: string;
  receiptDate: string;
  status: 'Pending' | 'Confirmed';
}

interface Hall {
  id: number;
  name: string;
}

export default function UpdateBooking() {
  const [formData, setFormData] = useState<Booking | null>(null);
  const [halls, setHalls] = useState<Hall[]>([]);

  useEffect(() => {
    const auth = Cookies.get("admin_auth");
    if (auth !== "true") {
      window.location.href = "/login";
      return;
    }
    fetch(`${import.meta.env.VITE_API_URL}/api/halls`)
      .then((res) => res.json())
      .then((data) => setHalls(data))
      .catch((err) => console.error("Error fetching halls:", err));

    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    if (id) {
      fetch(`${import.meta.env.VITE_API_URL}/api/bookings`)
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            const booking = data.find((b: Booking) => b.id === Number(id));
            if (booking) {
              const rent = parseFloat(booking.rent) || 0;
              const additional = parseFloat(booking.additionalCharges) || 0;
              booking.total = (rent + additional).toString();
              booking.remarks = booking.remarks || "";
              setFormData(booking);
            }
          }
        })
        .catch((err) => console.error(err));
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      if (!prev) return null;
      const updated = { ...prev, [name]: value };

      if (name === "rent" || name === "additionalCharges") {
        const rent = parseFloat(updated.rent) || 0;
        const additional = parseFloat(updated.additionalCharges) || 0;
        updated.total = (rent + additional).toString();
      }
      return updated;
    });
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
          <select name="hallName" value={formData.hallName} onChange={handleChange} className="border p-2 rounded">
            <option value="">Select Hall</option>
            {halls.map((hall) => (
              <option key={hall.id} value={hall.name}>{hall.name}</option>
            ))}
          </select>
          <input name="purposeOfUse" value={formData.purposeOfUse} onChange={handleChange} placeholder="Purpose" className="border p-2 rounded" />
          <input name="startDate" value={formData.startDate} onChange={handleChange} placeholder="Start Date" className="border p-2 rounded" />
          <input name="endDate" value={formData.endDate} onChange={handleChange} placeholder="End Date" className="border p-2 rounded" />
          <input name="rent" value={formData.rent} onChange={handleChange} placeholder="Rent" className="border p-2 rounded" />
          <input name="additionalCharges" value={formData.additionalCharges} onChange={handleChange} placeholder="Add. Charges" className="border p-2 rounded" />
          <input name="total" value={formData.total} readOnly placeholder="Total" className="border p-2 rounded bg-gray-100" />
          <input name="receiptNo" value={formData.receiptNo} onChange={handleChange} placeholder="Receipt No" className="border p-2 rounded" />
          <input name="receiptDate" value={formData.receiptDate} onChange={handleChange} placeholder="Receipt Date" className="border p-2 rounded" />
          <textarea name="remarks" value={formData.remark} onChange={handleChange} placeholder="Remarks" className="border p-2 rounded col-span-full" rows={3} />
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