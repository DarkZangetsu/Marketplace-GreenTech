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
  if (!user) return 'Utilisateur inconnu';
  if (user.firstName && user.lastName) {
    return `${user.firstName} ${user.lastName}`;
  }
  return user.username || 'Utilisateur';
};

export const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  return `http://localhost:8000/media/${imagePath}`;
};
