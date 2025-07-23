import React, { useState } from 'react';

interface StudentFieldsProps {
  scholarNumber: string;
  onScholarNumberChange: (value: string) => void;
  semester: string;
  onSemesterChange: (value: string) => void;
}

const StudentFields = ({
  scholarNumber,
  onScholarNumberChange,
  semester,
  onSemesterChange
}: StudentFieldsProps) => {
  const [showAdditionalFields, setShowAdditionalFields] = useState(false);

  return (
    <div>
      <div className="flex flex-col">
        <label htmlFor="scholarNumber" className="text-sm font-medium text-gray-700 mb-1">
          Scholar Number
        </label>
        <input
          required
          type="text"
          id="scholarNumber"
          value={scholarNumber}
          onChange={(e) => onScholarNumberChange(e.target.value)}
          className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white p-2 border text-sm"
        />
      </div>

      <button
        type="button"
        onClick={() => setShowAdditionalFields(!showAdditionalFields)}
        className="mt-4 text-sm text-blue-500 underline"
      >
        {showAdditionalFields ? 'Hide Additional Details' : 'Add Additional Details'}
      </button>

      {showAdditionalFields && (
        <div className="mt-4 space-y-2">
          <div className="flex flex-col">
            <label htmlFor="semester" className="text-sm font-medium text-gray-700 mb-1">
              Semester
            </label>
            <select
              id="semester"
              value={semester}
              onChange={(e) => onSemesterChange(e.target.value)}
              className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white p-2 border text-sm"
            >
              <option value="">Select Semester</option>
              <option value="I">I</option>
              <option value="II">II</option>
              <option value="III">III</option>
              <option value="IV">IV</option>
              <option value="V">V</option>
              <option value="VI">VI</option>
              <option value="VII">VII</option>
              <option value="VIII">VIII</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentFields;
