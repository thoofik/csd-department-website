import { NextRequest, NextResponse } from 'next/server';
import { listAllResumes } from '../../../../lib/cloudinaryStorage';

export async function GET(request: NextRequest) {
  try {
    const resumes = await listAllResumes();
    
    // Sort by upload date (newest first)
    resumes.sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime());

    return NextResponse.json({ 
      success: true, 
      resumes: resumes,
      count: resumes.length
    });

  } catch (error) {
    console.error('List resumes error:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to list resumes',
      resumes: []
    });
  }
}
