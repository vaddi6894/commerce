const typeStyles = {
  success: "bg-green-100 text-green-700",
  error: "bg-red-100 text-red-700",
  info: "bg-blue-100 text-blue-700",
};

const Message = ({ type = "info", children }) => (
  <div className={`p-3 rounded mb-2 ${typeStyles[type] || typeStyles.info}`}>
    {children}
  </div>
);

export default Message;
