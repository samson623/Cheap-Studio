import { NextRequest, NextResponse } from "next/server";
import { 
  createGalleryItem, 
  getGalleryItems, 
  getGalleryStats,
  CreateGalleryItemRequest 
} from "@/lib/gallery";

// GET /api/gallery - Get all gallery items or filter by type
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') as 'image' | 'video' | null;
    const stats = searchParams.get('stats') === 'true';

    if (stats) {
      return NextResponse.json({
        success: true,
        data: getGalleryStats()
      });
    }

    const items = getGalleryItems(type || undefined);
    
    return NextResponse.json({
      success: true,
      data: {
        items,
        total: items.length,
        type: type || 'all'
      }
    });

  } catch (error) {
    console.error('Gallery GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch gallery items' },
      { status: 500 }
    );
  }
}

// POST /api/gallery - Add new item to gallery
export async function POST(request: NextRequest) {
  try {
    const body: CreateGalleryItemRequest = await request.json();
    
    // Validate required fields
    if (!body.prompt || !body.url || !body.model || !body.type) {
      return NextResponse.json(
        { error: 'Missing required fields: prompt, url, model, type' },
        { status: 400 }
      );
    }

    const item = createGalleryItem(body);
    
    console.log(`📁 New ${body.type} saved to gallery:`, {
      id: item.id,
      prompt: item.prompt.substring(0, 50) + '...',
      model: item.model
    });

    return NextResponse.json({
      success: true,
      data: item
    });

  } catch (error) {
    console.error('Gallery POST error:', error);
    return NextResponse.json(
      { error: 'Failed to save item to gallery' },
      { status: 500 }
    );
  }
}