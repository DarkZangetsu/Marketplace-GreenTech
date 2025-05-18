import { NextResponse } from 'next/server';

// Mock data for user conversations
const mockConversations = [
  {
    id: 1,
    listingId: 1,
    listingTitle: 'Briques de construction',
    otherUser: {
      id: 101,
      name: 'Rabe Michel',
      avatar: null,
    },
    lastMessage: {
      content: 'Bonjour, les briques sont-elles toujours disponibles?',
      timestamp: '2023-05-20T14:30:00',
      isRead: false,
      sentByMe: false,
    },
    messages: [
      {
        id: 1001,
        content: 'Bonjour, je suis intéressé par vos briques de construction. Sont-elles toujours disponibles?',
        timestamp: '2023-05-20T14:30:00',
        sentByMe: false,
      },
    ]
  },
  {
    id: 2,
    listingId: 2,
    listingTitle: 'Poutres en bois',
    otherUser: {
      id: 102,
      name: 'Rasoa Jeanne',
      avatar: null,
    },
    lastMessage: {
      content: 'Merci pour les informations, je viendrai demain.',
      timestamp: '2023-05-19T10:15:00',
      isRead: false,
      sentByMe: false,
    },
    messages: [
      {
        id: 2001,
        content: 'Bonjour, j\'aimerais savoir quelle est la longueur des poutres en bois?',
        timestamp: '2023-05-18T09:30:00',
        sentByMe: false,
      },
    ]
  },
  {
    id: 3,
    listingId: 3,
    listingTitle: 'Panneaux solaires usagés',
    otherUser: {
      id: 103,
      name: 'Nirina Paul',
      avatar: null,
    },
    lastMessage: {
      content: 'Pouvez-vous me donner plus de détails sur les panneaux?',
      timestamp: '2023-05-17T16:20:00',
      isRead: true,
      sentByMe: false,
    },
    messages: [
      {
        id: 3001,
        content: 'Bonjour, je suis intéressé par vos panneaux solaires. Pouvez-vous me donner plus de détails?',
        timestamp: '2023-05-17T16:20:00',
        sentByMe: false,
      },
    ]
  },
];

export async function GET(request) {
  // In a real app, we would authenticate the user and return their conversations
  // For now, just return the mock data
  
  // Get the unread count
  const unreadCount = mockConversations.filter(
    c => !c.lastMessage.isRead && !c.lastMessage.sentByMe
  ).length;
  
  return NextResponse.json({
    conversations: mockConversations,
    unreadCount
  });
}

export async function POST(request) {
  try {
    const body = await request.json();
    
    // In a real app, we would save the message to the database
    // For now, just return a success response
    
    return NextResponse.json({
      success: true,
      message: 'Message sent successfully'
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
} 