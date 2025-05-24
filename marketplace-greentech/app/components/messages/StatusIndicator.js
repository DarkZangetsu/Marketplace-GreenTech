export const StatusIndicator = ({ isOnline, userId, onlineUsers }) => {
  const userOnline = (onlineUsers && onlineUsers.has && onlineUsers.has(userId)) || isOnline;
  
  return (
    <div className="relative">
      <div
        className={`w-3 h-3 rounded-full border-2 border-white ${userOnline ? 'bg-green-500' : 'bg-gray-400'}`}
      />
      {userOnline && (
        <div className="absolute inset-0 w-3 h-3 bg-green-500 rounded-full animate-ping opacity-75" />
      )}
    </div>
  );
};
