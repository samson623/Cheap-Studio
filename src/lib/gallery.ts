// Gallery system for managing generated content

export interface GalleryItem {
  id: string;
  type: 'image' | 'video';
  title: string;
  prompt: string;
  url: string;
  thumbnailUrl?: string;
  model: string;
  aspectRatio: string;
  duration?: number; // for videos
  cost: string;
  processingTime: string;
  createdAt: string;
  metadata?: Record<string, unknown>;
}

export interface CreateGalleryItemRequest {
  type: 'image' | 'video';
  title?: string;
  prompt: string;
  url: string;
  model: string;
  aspectRatio: string;
  duration?: number;
  cost: string;
  processingTime: string;
  metadata?: Record<string, unknown>;
}

// In-memory storage for demo (in production, use a database)
const galleryItems: GalleryItem[] = [];

export function createGalleryItem(data: CreateGalleryItemRequest): GalleryItem {
  const item: GalleryItem = {
    id: `${data.type}_${Date.now()}_${Math.random().toString(36).substring(7)}`,
    title: data.title || `${data.type === 'image' ? 'Generated Image' : 'Generated Video'} - ${new Date().toLocaleString()}`,
    createdAt: new Date().toISOString(),
    thumbnailUrl: data.type === 'image' ? data.url : `${data.url.replace('.mp4', '_thumb.jpg')}`,
    ...data
  };
  
  galleryItems.unshift(item); // Add to beginning of array
  console.log(`📁 Added ${data.type} to gallery:`, item.id);
  
  return item;
}

export function getGalleryItems(type?: 'image' | 'video'): GalleryItem[] {
  if (type) {
    return galleryItems.filter(item => item.type === type);
  }
  return [...galleryItems];
}

export function getGalleryItem(id: string): GalleryItem | null {
  return galleryItems.find(item => item.id === id) || null;
}

export function deleteGalleryItem(id: string): boolean {
  const index = galleryItems.findIndex(item => item.id === id);
  if (index !== -1) {
    galleryItems.splice(index, 1);
    console.log(`🗑️ Deleted gallery item:`, id);
    return true;
  }
  return false;
}

export function updateGalleryItem(id: string, updates: Partial<GalleryItem>): GalleryItem | null {
  const index = galleryItems.findIndex(item => item.id === id);
  if (index !== -1) {
    galleryItems[index] = { ...galleryItems[index], ...updates };
    console.log(`📝 Updated gallery item:`, id);
    return galleryItems[index];
  }
  return null;
}

export function getGalleryStats() {
  const images = galleryItems.filter(item => item.type === 'image');
  const videos = galleryItems.filter(item => item.type === 'video');
  
  return {
    total: galleryItems.length,
    images: images.length,
    videos: videos.length,
    totalCost: galleryItems.reduce((sum, item) => {
      const cost = parseFloat(item.cost.replace('$', ''));
      return sum + (isNaN(cost) ? 0 : cost);
    }, 0),
    latestItem: galleryItems[0] || null
  };
}