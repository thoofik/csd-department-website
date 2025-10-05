import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { action, studentUSN, data } = req.body;

  // Get the Socket.IO server instance
  const io = (res as any).socket?.server?.io;
  
  if (!io) {
    return res.status(500).json({ message: 'Socket.IO server not available' });
  }

  try {
    // Broadcast to the specific student room
    io.to(`student-${studentUSN}`).emit(action, {
      studentUSN,
      ...data
    });

    console.log(`Broadcasted ${action} to student-${studentUSN}:`, data);
    
    res.status(200).json({ success: true, message: 'Broadcast sent' });
  } catch (error) {
    console.error('Broadcast error:', error);
    res.status(500).json({ message: 'Failed to broadcast' });
  }
}
