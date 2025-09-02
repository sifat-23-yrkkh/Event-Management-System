

const LoadingSpinner = () => {
  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-900"></div>
        <p className="mt-4 text-blue-900 font-medium">Loading...</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;