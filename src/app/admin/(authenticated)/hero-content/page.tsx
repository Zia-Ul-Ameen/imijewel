'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Loader2, Image as ImageIcon, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import Image from 'next/image';
import { IKUpload } from 'imagekitio-next';

interface HeroSlide {
    id: string;
    title: string;
    description?: string | null;
    image: string;
    imagekitFileId: string;
    brandName?: string | null;
    exploreLink?: string | null;
    isActive: boolean;
    order: number;
}

export default function HeroContentPage() {
    const [slides, setSlides] = useState<HeroSlide[]>([]);
    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        image: '',
        imagekitFileId: '',
        brandName: '',
        exploreLink: '',
        isActive: true,
        order: 0,
    });
    const [submitting, setSubmitting] = useState(false);
    const [removedImageIds, setRemovedImageIds] = useState<string[]>([]);

    const fetchSlides = async () => {
        try {
            const res = await fetch('/api/hero-content/all');
            const data = await res.json();
            setSlides(data);
        } catch (error) {
            toast.error('Failed to fetch hero slides');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSlides();
    }, []);

    const handleOpenDialog = (slide?: HeroSlide) => {
        setRemovedImageIds([]);
        if (slide) {
            setEditingSlide(slide);
            setFormData({
                title: slide.title,
                description: slide.description || '',
                image: slide.image,
                imagekitFileId: slide.imagekitFileId,
                brandName: slide.brandName || '',
                exploreLink: slide.exploreLink || '',
                isActive: slide.isActive,
                order: slide.order,
            });
        } else {
            setEditingSlide(null);
            setFormData({
                title: '',
                description: '',
                image: '',
                imagekitFileId: '',
                brandName: '',
                exploreLink: '',
                isActive: true,
                order: slides.length,
            });
        }
        setDialogOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.image) {
            toast.error('Please upload an image first');
            return;
        }
        setSubmitting(true);
        try {
            const method = editingSlide ? 'PATCH' : 'POST';
            const url = editingSlide ? `/api/hero-content/${editingSlide.id}` : '/api/hero-content';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!res.ok) throw new Error('Failed to save slide');

            // Cleanup removed images from ImageKit
            if (removedImageIds.length > 0) {
                await Promise.all(removedImageIds.map(fileId =>
                    fetch('/api/imagekit-delete', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ fileId }),
                    })
                )).catch(err => console.error('Image cleanup failed:', err));
            }

            toast.success(`Slide ${editingSlide ? 'updated' : 'created'} successfully`);
            setDialogOpen(false);
            fetchSlides();
            setRemovedImageIds([]);
        } catch (error) {
            toast.error('Error saving slide');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string, imagekitFileId: string) => {
        if (!confirm('Are you sure you want to delete this slide?')) return;

        try {
            // Delete from ImageKit
            await fetch('/api/imagekit-delete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fileId: imagekitFileId }),
            });

            const res = await fetch(`/api/hero-content/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Failed to delete slide');

            toast.success('Slide deleted successfully');
            fetchSlides();
        } catch (error) {
            toast.error('Error deleting slide');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-black text-zinc-900">Hero Content</h1>
                    <p className="text-sm text-zinc-500 mt-1">Manage slides on your homepage slider.</p>
                </div>
                <Button onClick={() => handleOpenDialog()} className="bg-rose-500 hover:bg-rose-600">
                    <Plus className="w-4 h-4 mr-2" /> Add Slide
                </Button>
            </div>

            <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Preview</TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Order</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-12">
                                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-rose-500" />
                                </TableCell>
                            </TableRow>
                        ) : slides.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-12 text-zinc-500">
                                    No hero slides found. Add one to get started.
                                </TableCell>
                            </TableRow>
                        ) : (
                            slides.sort((a, b) => a.order - b.order).map((slide) => (
                                <TableRow key={slide.id}>
                                    <TableCell>
                                        <div className="relative w-20 h-12 rounded-lg overflow-hidden border border-zinc-100">
                                            <Image src={slide.image} alt={slide.title} fill className="object-cover" />
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-bold text-sm text-zinc-900 line-clamp-1">{slide.title}</span>
                                            {slide.brandName && <span className="text-[10px] text-rose-500 uppercase font-black">{slide.brandName}</span>}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {slide.isActive ? (
                                            <div className="flex items-center gap-1.5 text-green-600 text-xs font-bold bg-green-50 px-2.5 py-1 rounded-full w-fit">
                                                <CheckCircle2 className="w-3.5 h-3.5" /> Active
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-1.5 text-zinc-400 text-xs font-bold bg-zinc-50 px-2.5 py-1 rounded-full w-fit">
                                                <XCircle className="w-3.5 h-3.5" /> Inactive
                                            </div>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-zinc-500 font-mono text-xs">{slide.order}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(slide)}>
                                                <Edit className="w-4 h-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => handleDelete(slide.id, slide.imagekitFileId)} className="text-red-500 hover:text-red-600 hover:bg-red-50">
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>{editingSlide ? 'Edit Hero Slide' : 'Add Hero Slide'}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4 py-2">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Main Title</Label>
                                <Input
                                    id="title"
                                    value={formData.title}
                                    onChange={(e) => setFormData(p => ({ ...p, title: e.target.value }))}
                                    required
                                    placeholder="e.g. Modern Elegance"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="brandName">Brand Label (Optional)</Label>
                                <Input
                                    id="brandName"
                                    value={formData.brandName}
                                    onChange={(e) => setFormData(p => ({ ...p, brandName: e.target.value }))}
                                    placeholder="e.g. Handmade Collection"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => setFormData(p => ({ ...p, description: e.target.value }))}
                                placeholder="Briefly describe this collection..."
                                rows={3}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="exploreLink">Explore Link (URL)</Label>
                                <Input
                                    id="exploreLink"
                                    value={formData.exploreLink}
                                    onChange={(e) => setFormData(p => ({ ...p, exploreLink: e.target.value }))}
                                    placeholder="/shop?categoryId=..."
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="order">Display Order</Label>
                                <Input
                                    id="order"
                                    type="number"
                                    value={formData.order}
                                    onChange={(e) => setFormData(p => ({ ...p, order: parseInt(e.target.value) || 0 }))}
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-8 py-2">
                            <div className="flex items-center space-x-2">
                                <Switch
                                    id="isActive"
                                    checked={formData.isActive}
                                    onCheckedChange={(checked) => setFormData(p => ({ ...p, isActive: checked }))}
                                />
                                <Label htmlFor="isActive">Active Status</Label>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Slide Image (aspect-[7/3] recommended)</Label>
                            <div className="flex flex-col gap-4">
                                {formData.image ? (
                                    <div className="relative aspect-[16/9] w-full rounded-xl border border-zinc-200 overflow-hidden group">
                                        <Image src={formData.image} alt="Preview" fill className="object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                if (formData.imagekitFileId) {
                                                    setRemovedImageIds(prev => [...prev, formData.imagekitFileId]);
                                                }
                                                setFormData(prev => ({ ...prev, image: '', imagekitFileId: '' }));
                                            }}
                                            className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="aspect-[16/9] w-full rounded-xl border-2 border-dashed border-zinc-200 flex flex-col items-center justify-center bg-zinc-50 hover:bg-zinc-100 transition-colors cursor-pointer relative overflow-hidden">
                                        <IKUpload
                                            fileName="hero-slide.jpg"
                                            publicKey={process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY}
                                            urlEndpoint={process.env.NEXT_PUBLIC_IMAGEKIT_URL}
                                            onError={(err) => {
                                                toast.error('Upload failed');
                                                console.error(err);
                                            }}
                                            onSuccess={(res) => {
                                                setFormData(prev => ({ ...prev, image: res.url, imagekitFileId: res.fileId }));
                                                toast.success('Image uploaded');
                                            }}
                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                        />
                                        <div className="flex flex-col items-center text-zinc-400">
                                            <ImageIcon className="w-10 h-10 mb-2 opacity-20" />
                                            <p className="text-sm font-medium">Click to upload image</p>
                                            <p className="text-[10px] uppercase tracking-widest mt-1">ImageKit Only</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <DialogFooter className="pt-4 border-t border-zinc-100 mt-4">
                            <Button type="button" variant="ghost" onClick={() => setDialogOpen(false)} className="rounded-xl">Cancel</Button>
                            <Button type="submit" disabled={submitting} className="bg-rose-500 hover:bg-rose-600 rounded-xl px-8">
                                {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                                {editingSlide ? 'Update Slide' : 'Create Slide'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
