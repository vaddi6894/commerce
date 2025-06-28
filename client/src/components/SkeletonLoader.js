import React from "react";

const SkeletonCard = () => (
  <div className="bg-white rounded-lg shadow-md p-4 animate-pulse flex flex-col gap-2">
    <div className="h-40 w-full bg-gray-200 rounded-lg" />
    <div className="h-4 w-3/4 bg-gray-200 rounded" />
    <div className="h-4 w-1/2 bg-gray-200 rounded" />
    <div className="h-8 w-full bg-gray-200 rounded" />
  </div>
);

const SkeletonList = ({ count = 4 }) => (
  <div className="space-y-4">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="bg-white rounded-lg shadow p-4 animate-pulse">
        <div className="h-4 w-1/2 bg-gray-200 rounded mb-2" />
        <div className="h-4 w-1/3 bg-gray-200 rounded mb-2" />
        <div className="h-4 w-1/4 bg-gray-200 rounded" />
      </div>
    ))}
  </div>
);

const SkeletonTable = ({ rows = 5, cols = 4 }) => (
  <div className="w-full animate-pulse">
    <div className="flex mb-2">
      {Array.from({ length: cols }).map((_, i) => (
        <div key={i} className="h-4 w-24 bg-gray-200 rounded mr-2" />
      ))}
    </div>
    {Array.from({ length: rows }).map((_, r) => (
      <div key={r} className="flex mb-2">
        {Array.from({ length: cols }).map((_, c) => (
          <div key={c} className="h-4 w-24 bg-gray-200 rounded mr-2" />
        ))}
      </div>
    ))}
  </div>
);

const SkeletonLoader = ({ type = "card", count = 4, ...props }) => {
  if (type === "list") return <SkeletonList count={count} {...props} />;
  if (type === "table") return <SkeletonTable {...props} />;
  // Default to card
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
};

export default SkeletonLoader;
