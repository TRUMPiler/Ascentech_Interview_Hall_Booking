import { useState, useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import axios from 'axios';



type RegistrationFormData = {
  startDate: string;
  endDate: string;
  mobileNo: string;
  hallName: string;
  applicantName: string;
  email: string;
  purposeOfUse: string;
  rent: string;
  additionalCharges: string;
  total: string;
  remark: string;
  receiptNo: string;
  receiptDate: string;
};

interface Hall {
  id: number;
  name: string;
}

const Registration=()=> {
  const [halls, setHalls] = useState<Hall[]>([]);
  const apiUrl = "http://localhost:5000";
  
  const { register, handleSubmit, reset, watch, setValue, getValues, formState: { errors } } = useForm<RegistrationFormData>({
    defaultValues: {
      startDate: '',
      endDate: '',
      mobileNo: '',
      hallName: '',
      applicantName: '',
      email: '',
      purposeOfUse: '',
      rent: '',
      additionalCharges: '',
      total: '',
      remark: '',
      receiptNo: '',
      receiptDate: ''
    }
  });

  const rent = watch('rent');
  const additionalCharges = watch('additionalCharges');

  useEffect(() => {
    const totalAmount = (Number(rent) || 0) + (Number(additionalCharges) || 0);
    setValue('total', totalAmount.toString());
  }, [rent, additionalCharges, setValue]);

  useEffect(() => {
    const fetchHalls = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/halls`);
        setHalls(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    if (apiUrl) fetchHalls();
  }, [apiUrl]);

  useEffect(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    setValue('receiptDate', `${year}-${month}-${day}`);

    setValue('receiptNo', `REC-${Date.now().toString().slice(-6)}`);
  }, [setValue]);

  const onSubmit: SubmitHandler<RegistrationFormData> = async (data) => {
    const { total, remark, rent, additionalCharges, ...rest } = data;
    const payload = {
      ...rest,
      rent: Number(rent),
      additionalCharges: Number(additionalCharges),
      totalAmount: Number(total),
      remark: remark,
      status: 'Pending'
    };

    try {
      await axios.post(`${apiUrl}/api/bookings`, payload);
      alert('Registration Successful!');
      reset();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to register');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 mt-10 bg-white rounded shadow-sm">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 text-center">Hall Registration</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label className="block text-sm mb-1 text-gray-700">Start Date</label>
                <input 
                  type="date" 
                  {...register('startDate', { required: "Start Date is required" })}
                  className="w-full p-2 border border-gray-300 rounded bg-white text-gray-900"
                />
                {errors.startDate && <p className="text-red-500 text-xs mt-1">{errors.startDate.message}</p>}
            </div>
            <div>
                <label className="block text-sm mb-1 text-gray-700">End Date</label>
                <input 
                  type="date" 
                  {...register('endDate', { 
                    required: "End Date is required",
                    validate: (value) => {
                      const startDate = getValues('startDate');
                      if (!startDate) return true; 
                      
                      const start = new Date(startDate);
                      const end = new Date(value);
                      
                      if (end < start) {
                        return "End date cannot be before start date";
                      }

                      const maxDate = new Date(start);
                      maxDate.setMonth(maxDate.getMonth() + 3);
                      if (end > maxDate) {
                        return "Booking duration cannot exceed 3 months";
                      }
                      return true;
                    }
                  })}
                  className="w-full p-2 border border-gray-300 rounded bg-white text-gray-900"
                />
                {errors.endDate && <p className="text-red-500 text-xs mt-1">{errors.endDate.message}</p>}
            </div>
        </div>

        <div>
            <label className="block text-sm mb-1 text-gray-700">Mobile No</label>
            <input 
              type="tel" 
              {...register('mobileNo', { required: true })}
              className="w-full p-2 border border-gray-300 rounded bg-white text-gray-900"
              placeholder="Enter mobile number"
            />
        </div>
        
        <div>
            <label className="block text-sm mb-1 text-gray-700">Hall Name</label>
            <select 
              {...register('hallName', { required: true })}
              defaultValue=""
              className="w-full p-2 border border-gray-300 rounded bg-white text-gray-900"
            >
                <option value="" disabled>Select a hall</option>
                {halls.map(hall => (
                    <option key={hall.id} value={hall.name}>{hall.name}</option>
                ))}
            </select>
        </div>

        <div>
            <label className="block text-sm mb-1 text-gray-700">Applicant Name</label>
            <input 
              type="text" 
              {...register('applicantName', { required: true })}
              className="w-full p-2 border border-gray-300 rounded bg-white text-gray-900"
              placeholder="Enter applicant name"
            />
        </div>
        
        <div>
            <label className="block text-sm mb-1 text-gray-700">Email</label>
            <input 
              type="email" 
              {...register('email', { required: true })}
              className="w-full p-2 border border-gray-300 rounded bg-white text-gray-900"
              placeholder="Enter email address"
            />
        </div>
        
        <div>
            <label className="block text-sm mb-1 text-gray-700">Purpose of Use</label>
            <input 
              type="text" 
              {...register('purposeOfUse')}
              className="w-full p-2 border border-gray-300 rounded bg-white text-gray-900"
              placeholder="Event purpose"
            />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
                <label className="block text-sm mb-1 text-gray-700">Rent</label>
                <input 
                  type="number" 
                  {...register('rent')}
                  className="w-full p-2 border border-gray-300 rounded bg-white text-gray-900"
                />
            </div>
            
            <div>
                <label className="block text-sm mb-1 text-gray-700">Additional Charges</label>
                <input 
                  type="number" 
                  {...register('additionalCharges')}
                  className="w-full p-2 border border-gray-300 rounded bg-white text-gray-900"
                />
            </div>
            
            <div>
                <label className="block text-sm mb-1 text-gray-700">Total</label>
                <input 
                  type="number" 
                  {...register('total')}
                  className="w-full p-2 border border-gray-300 rounded bg-white text-gray-900"
                  readOnly
                />
            </div>
        </div>
        
        <div>
            <label className="block text-sm mb-1 text-gray-700">Remarks</label>
            <textarea 
              {...register('remark')}
              rows={3}
              className="w-full p-2 border border-gray-300 rounded resize-none bg-white text-gray-900"
              placeholder="Any additional comments..."
            />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label className="block text-sm mb-1 text-gray-700">Receipt No</label>
                <input 
                  type="text" 
                  {...register('receiptNo')}
                  className="w-full p-2 border border-gray-300 rounded bg-gray-100 text-gray-900"
                  readOnly
                />
            </div>
            
            <div>
                <label className="block text-sm mb-1 text-gray-700">Receipt Date</label>
                <input 
                  type="date" 
                  {...register('receiptDate')}
                  className="w-full p-2 border border-gray-300 rounded bg-gray-100 text-gray-900"
                  readOnly
                />
            </div>
        </div>

        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
          <button 
            type="button" 
            onClick={() => window.history.back()} 
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
          >
            Back
          </button>
          <button 
            type="submit" 
            className="px-4 py-2 bg-blue-600 text-black rounded  hover:bg-blue-700"
          >
            Submit Registration
          </button>
        </div>

      </form>
    </div>
  );
}

export default Registration;