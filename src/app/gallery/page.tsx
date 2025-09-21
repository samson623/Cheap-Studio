"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GalleryItem } from "@/lib/gallery";

interface GalleryStats {
  total: number;
  images: number;
  videos: number;
  totalCost: number;
  latestItem: GalleryItem | null;
}

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [stats, setStats] = useState<GalleryStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'image' | 'video'>('all');
  const [error, setError] = useState<string>('');

  const fetchGalleryItems = async (currentFilter: 'all' | 'image' | 'video') => {
    try {
      setLoading(true);
      const typeParam = currentFilter !== 'all' ? `?type=${currentFilter}` : '';
      const response = await fetch(`/api/gallery${typeParam}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch gallery items');
      }
      
      const result = await response.json();
      setItems(result.data.items || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load gallery');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/gallery?stats=true');
      if (response.ok) {
        const result = await response.json();
        setStats(result.data);
      }
    } catch (err) {
      console.warn('Failed to fetch stats:', err);
    }
  };

  const deleteItem = async (id: string) => {
    try {
      const response = await fetch(`/api/gallery/${id}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        setItems(items.filter(item => item.id !== id));
        fetchStats(); // Refresh stats
      } else {
        throw new Error('Failed to delete item');
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  useEffect(() => {
    fetchGalleryItems(filter);
    fetchStats();
  }, [filter]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <div className="relative mx-auto max-w-7xl space-y-6 px-4 py-12">
        <div className="text-center text-white">
          <div className="animate-pulse">🎨 Loading your gallery...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative mx-auto max-w-7xl space-y-8 px-4 py-12">
      {/* Header */}
      <div className="space-y-3 text-white">
        <span className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-300">
          Your Creative Collection
        </span>
        <h1 className="text-3xl font-semibold tracking-tight">Gallery</h1>
        <p className="max-w-2xl text-sm text-white/70">
          Browse, manage, and download all your AI-generated images and videos.
        </p>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="border-white/10 bg-slate-900/70 text-slate-100">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-sky-300">{stats.total}</div>
              <div className="text-xs text-white/70">Total Creations</div>
            </CardContent>
          </Card>
          <Card className="border-white/10 bg-slate-900/70 text-slate-100">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-300">{stats.images}</div>
              <div className="text-xs text-white/70">Images Generated</div>
            </CardContent>
          </Card>
          <Card className="border-white/10 bg-slate-900/70 text-slate-100">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-purple-300">{stats.videos}</div>
              <div className="text-xs text-white/70">Videos Created</div>
            </CardContent>
          </Card>
          <Card className="border-white/10 bg-slate-900/70 text-slate-100">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-amber-300">${stats.totalCost.toFixed(2)}</div>
              <div className="text-xs text-white/70">Total Cost</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filter Buttons */}
      <div className="flex gap-2">
        <Button
          variant={filter === 'all' ? 'default' : 'secondary'}
          onClick={() => setFilter('all')}
          className={filter === 'all' ? 'bg-sky-500 hover:bg-sky-400' : 'border-white/10 bg-white/10 text-white hover:bg-white/20'}
        >
          All ({stats?.total || 0})
        </Button>
        <Button
          variant={filter === 'image' ? 'default' : 'secondary'}
          onClick={() => setFilter('image')}
          className={filter === 'image' ? 'bg-sky-500 hover:bg-sky-400' : 'border-white/10 bg-white/10 text-white hover:bg-white/20'}
        >
          Images ({stats?.images || 0})
        </Button>
        <Button
          variant={filter === 'video' ? 'default' : 'secondary'}
          onClick={() => setFilter('video')}
          className={filter === 'video' ? 'bg-sky-500 hover:bg-sky-400' : 'border-white/10 bg-white/10 text-white hover:bg-white/20'}
        >
          Videos ({stats?.videos || 0})
        </Button>
      </div>

      {/* Error State */}
      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-red-200">
          <div className="font-medium">Error loading gallery</div>
          <div className="text-sm">{error}</div>
        </div>
      )}

      {/* Gallery Grid */}
      {items.length === 0 && !loading && !error ? (
        <Card className="border-white/10 bg-slate-900/70 text-slate-100">
          <CardContent className="p-12 text-center">
            <div className="text-4xl mb-4">🎨</div>
            <div className="text-xl font-medium mb-2">Your gallery is empty</div>
            <div className="text-white/70 mb-6">
              Generate some images or videos to see them here!
            </div>
            <div className="space-x-4">
              <Button 
                className="bg-sky-500 hover:bg-sky-400"
                onClick={() => window.location.href = '/generate/image'}
              >
                Generate Image
              </Button>
              <Button 
                className="bg-purple-500 hover:bg-purple-400"
                onClick={() => window.location.href = '/generate/video'}
              >
                Generate Video
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((item) => (
            <Card key={item.id} className="border-white/10 bg-slate-900/70 text-slate-100 overflow-hidden">
              <div className="relative aspect-video bg-slate-950/60">
                {item.type === 'image' ? (
                  <Image
                    src={item.thumbnailUrl || item.url}
                    alt={item.title}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <div className="text-4xl mb-2">🎬</div>
                      <div className="text-sm text-white/70">
                        {item.duration}s video
                      </div>
                    </div>
                  </div>
                )}
                <div className="absolute top-2 left-2">
                  <Badge variant="secondary" className="bg-black/50 text-white">
                    {item.type === 'image' ? '🖼️' : '🎬'} {item.type}
                  </Badge>
                </div>
              </div>
              
              <CardHeader className="pb-2">
                <CardTitle className="text-sm truncate">{item.title}</CardTitle>
                <CardDescription className="text-xs text-white/60 line-clamp-2">
                  {item.prompt}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-white/50">Model:</span>
                    <div className="font-medium">{item.model}</div>
                  </div>
                  <div>
                    <span className="text-white/50">Cost:</span>
                    <div className="font-medium text-green-300">{item.cost}</div>
                  </div>
                </div>
                
                <div className="text-xs text-white/50">
                  {formatDate(item.createdAt)}
                </div>
                
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    className="flex-1 border-white/10 bg-white/10 text-white hover:bg-white/20"
                    onClick={() => window.open(item.url, '_blank')}
                  >
                    View
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="border-red-500/30 bg-red-500/10 text-red-300 hover:bg-red-500/20"
                    onClick={() => deleteItem(item.id)}
                  >
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}