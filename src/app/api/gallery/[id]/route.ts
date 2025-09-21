import { NextRequest, NextResponse } from "next/server";
import { 
  getGalleryItem, 
  deleteGalleryItem, 
  updateGalleryItem 
} from "@/lib/gallery";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

// GET /api/gallery/[id] - Get single gallery item
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const item = getGalleryItem(id);
    
    if (!item) {
      return NextResponse.json(
        { error: 'Gallery item not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: item
    });

  } catch (error) {
    console.error('Gallery GET [id] error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch gallery item' },
      { status: 500 }
    );
  }
}

// PUT /api/gallery/[id] - Update gallery item
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const updates = await request.json();
    const item = updateGalleryItem(id, updates);
    
    if (!item) {
      return NextResponse.json(
        { error: 'Gallery item not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: item
    });

  } catch (error) {
    console.error('Gallery PUT error:', error);
    return NextResponse.json(
      { error: 'Failed to update gallery item' },
      { status: 500 }
    );
  }
}

// DELETE /api/gallery/[id] - Delete gallery item
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const deleted = deleteGalleryItem(id);
    
    if (!deleted) {
      return NextResponse.json(
        { error: 'Gallery item not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Gallery item deleted successfully'
    });

  } catch (error) {
    console.error('Gallery DELETE error:', error);
    return NextResponse.json(
      { error: 'Failed to delete gallery item' },
      { status: 500 }
    );
  }
}