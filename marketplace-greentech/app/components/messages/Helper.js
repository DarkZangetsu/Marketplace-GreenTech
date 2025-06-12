// Helper functions
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffMinutes = Math.floor(diffTime / (1000 * 60));
  const diffHours = Math.floor(diffTime / (1000 * 60 * 60));

  if (diffMinutes < 1) return 'Maintenant';
  if (diffMinutes < 60) return `${diffMinutes}min`;
  if (diffHours < 24) return `${diffHours}h`;
  return `${date.getDate()}/${date.getMonth() + 1}`;
};

export const formatMessageDate = (dateString) => {
  const date = new Date(dateString);
  return `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
};

export const getFullName = (user) => {
  if (!user) return '';
  return `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username;
};

export const getImageUrl = (url) => {
  if (!url) return null;
  if (url.startsWith('http')) return url;
  return `${process.env.NEXT_PUBLIC_API_URL || 'https://marketplace-greentech.onrender.com'}${url}`;
};

export const getFileUrl = (url) => {
  if (!url) return null;
  if (url.startsWith('http')) return url;
  return `${process.env.NEXT_PUBLIC_API_URL || 'https://marketplace-greentech.onrender.com'}${url}`;
};

export const getProfilePictureUrl = (url) => {
  if (!url) return '/default-avatar.png';
  if (url.startsWith('http')) return url;
  return `${process.env.NEXT_PUBLIC_MEDIA_URL || 'https://marketplace-greentech.onrender.com/media/'}${url}`;
};
