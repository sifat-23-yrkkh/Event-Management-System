import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const DatePickerModal = ({ isOpen, onClose, selectedDate, onDateChange, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded shadow-md">
        <h2 className="text-xl mb-4">Select a Date</h2>
        <div className="calendar">
          <DatePicker
            selected={selectedDate}
            onChange={onDateChange}
            inline
          />
        </div>
        <div className="mt-4 flex justify-between">
          <button
            className="bg-[#179ac8] text-white py-2 px-4 rounded hover:bg-[#1482b0]"
            onClick={onConfirm}
          >
            Confirm
          </button>
          <button
            className="bg-[#179ac8] text-white py-2 px-4 rounded hover:bg-[#1482b0]"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default DatePickerModal;