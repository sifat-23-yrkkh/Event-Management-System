import { useState } from 'react';

const FeatureInput = ({ features, onFeatureAdd }) => {
  const [newFeature, setNewFeature] = useState('');
  const [isInputVisible, setIsInputVisible] = useState(false);

  const handleAddFeature = () => {
    if (newFeature.trim() !== '') {
      onFeatureAdd(newFeature.trim());
      setNewFeature('');
      setIsInputVisible(false);
    }
  };

  const handleCancel = () => {
    setNewFeature('');
    setIsInputVisible(false);
  };

  return (
    <div className="mb-6">
      <h2 className="text-2xl font-semibold mb-3 text-black">Features:</h2>
      <div className="flex flex-wrap gap-2 mb-2">
        {features?.map((feature, index) => (
          <div key={index} className="bg-[#179ac8] text-white px-3 py-1 rounded-full text-sm">
            {feature}
          </div>
        ))}
        {!isInputVisible && (
          <div
            className="bg-[#179ac8] text-white px-3 py-1 rounded-full text-sm cursor-pointer"
            onClick={() => setIsInputVisible(true)}
          >
            +Add Feature
          </div>
        )}
      </div>
      {isInputVisible && (
        <div className="flex items-center mt-2">
          <input
            type="text"
            value={newFeature}
            onChange={(e) => setNewFeature(e.target.value)}
            placeholder="Enter new feature"
            className="mr-2 px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleAddFeature}
            className="mr-2 px-4 py-1 bg-[#179ac8] text-white rounded hover:bg-blue-700 transition"
          >
            Add
          </button>
          <button
            onClick={handleCancel}
            className="px-4 py-1 border border-gray-300 rounded text-gray-700 hover:bg-gray-100 transition"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default FeatureInput;