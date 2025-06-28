const Review = ({ review }) => (
  <div className="border-b py-2">
    <div className="flex items-center gap-2">
      <span className="font-semibold">{review.user?.name || "User"}</span>
      <span className="text-yellow-500">
        {"★".repeat(review.rating)}
        {"☆".repeat(5 - review.rating)}
      </span>
    </div>
    <p className="text-gray-700 mt-1">{review.comment}</p>
    <span className="text-xs text-gray-400">
      {new Date(review.createdAt).toLocaleDateString()}
    </span>
  </div>
);

export default Review;
