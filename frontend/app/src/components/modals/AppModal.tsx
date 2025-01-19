import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { IFormField, IApprovedReservation } from "../../types";

interface IModalProps {
  isOpen: boolean;
  title: string;
  formSchema: Array<IFormField>;
  onClose: () => void;
  onSubmit: (data: Record<string, any>) => void;
  approvedReservations?: Array<IApprovedReservation>;
  vehicleCategory?: string;
}

const AppModal: React.FC<IModalProps> = ({
  isOpen,
  title,
  formSchema,
  onClose,
  onSubmit,
  approvedReservations,
}) => {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [unavailableDates, setUnavailableDates] = useState<Date[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);

  const getUnavailableDates = (vehicleId: string): Date[] => {
    const dates: Date[] = [];
    approvedReservations?.forEach((reservation) => {
      if (reservation.vehicle._id === vehicleId) {
        const startDate = new Date(reservation.period.start);
        const endDate = new Date(reservation.period.end);

        let currentDate = new Date(startDate);
        while (currentDate <= endDate) {
          dates.push(new Date(currentDate));
          currentDate.setDate(currentDate.getDate() + 1);
        }
      }
    });
    return dates;
  };

  useEffect(() => {
    if (selectedVehicle) {
      const unavailable = getUnavailableDates(selectedVehicle);
      setUnavailableDates(unavailable);
    }
  }, [selectedVehicle, approvedReservations]);

  useEffect(() => {
    const initialFormData: Record<string, any> = {};
    formSchema.forEach((field) => {
      initialFormData[field.name] = field.value || "";
    });
    setFormData(initialFormData);
  }, [formSchema]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "vehicle") {
      setSelectedVehicle(value);
    }
  };

  const handleSubmit = () => {
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-md w-1/4">
        <h2 className="text-xl font-bold mb-6">{title}</h2>
        <form className="flex flex-col gap-4">
          {formSchema.map((field) => {
            switch (field.type) {
              case "input":
                return (
                  <div
                    key={field.name}
                    className="flex flex-col items-start mb-2"
                  >
                    <label className="block font-medium mb-2">
                      {field.label}:
                    </label>
                    <input
                      type="text"
                      name={field.name}
                      value={formData[field.name] || ""}
                      onChange={handleInputChange}
                      placeholder={field.placeholder}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                );

              case "select":
                return (
                  <div
                    key={field.name}
                    className="flex flex-col items-start mb-2"
                  >
                    <label className="block font-medium mb-2">
                      {field.label}:
                    </label>
                    <select
                      name={field.name}
                      value={formData[field.name] || ""}
                      onChange={handleInputChange}
                      disabled={field.disabled}
                      className="w-full p-2 border rounded"
                    >
                      {field.name === "vehicle" ||
                      field.name === "vehicleCategory" ? (
                        <option key="Odaberi opciju">-- Odaberi opciju</option>
                      ) : null}
                      {field.options?.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                );

              case "date":
                return (
                  <div
                    key={field.name}
                    className="flex flex-col items-start mb-2"
                  >
                    <label className="block font-medium mb-2">
                      {field.label}:
                    </label>
                    <DatePicker
                      selected={
                        formData[field.name]
                          ? new Date(formData[field.name])
                          : null
                      }
                      onChange={(date: Date | null) =>
                        setFormData((prev) => ({
                          ...prev,
                          [field.name]: date ? date.toISOString() : "",
                        }))
                      }
                      dateFormat="yyyy-MM-dd"
                      className="w-full p-2 border rounded"
                      placeholderText={field.placeholder}
                      minDate={new Date()}
                    />
                  </div>
                );

              case "calendar":
                return (
                  <div
                    key={field.name}
                    className="flex flex-col items-start mb-2"
                  >
                    <label className="block font-medium mb-2">
                      {field.label}
                    </label>
                    <DatePicker
                      selected={formData[field.name]}
                      excludeDates={unavailableDates}
                      inline
                      dateFormat="yyyy-MM-dd"
                      className="w-full p-2 border rounded"
                      minDate={new Date()}
                    />
                  </div>
                );

              default:
                return null;
            }
          })}
          <div className="flex justify-center gap-6 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Close
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="px-4 py-2 bg-cyan-700 text-white rounded hover:bg-cyan-900"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AppModal;
