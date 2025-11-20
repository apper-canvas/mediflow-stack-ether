const Loading = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 to-cyan-50">
      <div className="text-center space-y-8 p-8">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-primary-200 rounded-full animate-spin mx-auto"></div>
          <div className="w-16 h-16 border-4 border-transparent border-t-primary-600 rounded-full animate-spin absolute top-0 left-1/2 transform -translate-x-1/2"></div>
        </div>
        <div className="space-y-4">
          <div className="w-48 h-4 bg-gradient-to-r from-primary-200 via-primary-300 to-primary-200 rounded animate-pulse mx-auto"></div>
          <div className="w-32 h-3 bg-gradient-to-r from-secondary-200 via-secondary-300 to-secondary-200 rounded animate-pulse mx-auto"></div>
        </div>
        <p className="text-primary-600 font-medium">Loading MediFlow...</p>
      </div>
    </div>
  );
};

export default Loading;