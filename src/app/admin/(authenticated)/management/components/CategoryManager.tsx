'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Loader2, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import Image from 'next/image';
import { IKUpload } from 'imagekitio-next';

interface Category {
    id: string;
    name: string;
    slug: string;
    image?: string | null;
    imageFileId?: string | null;
    order: number;
}

export default function CategoryManager() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [formData, setFormData] = useState({ name: '', slug: '', image: '', imageFileId: '', order: 0 });
    const [submitting, setSubmitting] = useState(false);
    const [removedImageIds, setRemovedImageIds] = useState<string[]>([]);

    const fetchCategories = async () => {
        try {
            const res = await fetch('/api/categories');
            const data = await res.json();
            if (Array.isArray(data)) {
                setCategories(data);
            } else {
                setCategories([]);
                if (data.error) toast.error(data.error);
            }
        } catch (error) {
            toast.error('Failed to fetch categories');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleOpenDialog = (category?: Category) => {
        setRemovedImageIds([]);
        if (category) {
            setEditingCategory(category);
            setFormData({ name: category.name, slug: category.slug, image: category.image || '', imageFileId: category.imageFileId || '', order: category.order });
        } else {
            setEditingCategory(null);
            setFormData({ name: '', slug: '', image: '', imageFileId: '', order: categories.length });
        }
        setDialogOpen(true);
    };

    const handleNameChange = (name: string) => {
        setFormData(prev => ({
            ...prev,
            name,
            slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const method = editingCategory ? 'PATCH' : 'POST';
            const url = editingCategory ? `/api/categories/${editingCategory.id}` : '/api/categories';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!res.ok) throw new Error('Failed to save category');

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

            toast.success(`Category ${editingCategory ? 'updated' : 'created'} successfully`);
            setDialogOpen(false);
            fetchCategories();
            setRemovedImageIds([]);
        } catch (error) {
            toast.error('Error saving category');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string, imageFileId?: string | null) => {
        if (!confirm('Are you sure you want to delete this category?')) return;

        try {
            if (imageFileId) {
                await fetch('/api/imagekit-delete', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ fileId: imageFileId }),
                });
            }

            const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Failed to delete category');

            toast.success('Category deleted successfully');
            fetchCategories();
        } catch (error) {
            toast.error('Error deleting category');
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Categories</h2>
                <Button onClick={() => handleOpenDialog()} className="bg-rose-500 hover:bg-rose-600">
                    <Plus className="w-4 h-4 mr-2" /> Add Category
                </Button>
            </div>

            <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Image</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Order</TableHead>
                            <TableHead>Slug</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-8">
                                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-zinc-400" />
                                </TableCell>
                            </TableRow>
                        ) : categories.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-8 text-zinc-500">
                                    No categories found
                                </TableCell>
                            </TableRow>
                        ) : (
                            categories.map((category) => (
                                <TableRow key={category.id}>
                                    <TableCell>
                                        {category.image ? (
                                            <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-zinc-100">
                                                <Image src={category.image} alt={category.name} fill className="object-cover" />
                                            </div>
                                        ) : (
                                            <div className="w-10 h-10 rounded-lg bg-zinc-50 flex items-center justify-center text-zinc-300">
                                                <ImageIcon className="w-5 h-5" />
                                            </div>
                                        )}
                                    </TableCell>
                                    <TableCell className="font-medium">{category.name}</TableCell>
                                    <TableCell>{category.order}</TableCell>
                                    <TableCell className="text-zinc-500 font-mono text-xs">{category.slug}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(category)}>
                                                <Edit className="w-4 h-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => handleDelete(category.id, category.imageFileId)} className="text-red-500 hover:text-red-600 hover:bg-red-50">
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
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingCategory ? 'Edit Category' : 'Add Category'}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => handleNameChange(e.target.value)}
                                required
                                placeholder="e.g. Necklaces"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="slug">Slug</Label>
                            <Input
                                id="slug"
                                value={formData.slug}
                                readOnly
                                className="bg-zinc-50 text-zinc-500"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="order">Display Order</Label>
                            <Input
                                id="order"
                                type="number"
                                value={formData.order}
                                onChange={(e) => setFormData(prev => ({ ...prev, order: parseInt(e.target.value) || 0 }))}
                                required
                                placeholder="e.g. 0"
                            />
                            <p className="text-[10px] text-zinc-500">Lower numbers appear first (0, 1, 2...)</p>
                        </div>

                        <div className="space-y-2">
                            <Label>Image</Label>
                            <div className="flex items-center gap-4">
                                {formData.image && (
                                    <div className="relative w-16 h-16 rounded-lg border border-zinc-200 overflow-hidden">
                                        <Image src={formData.image} alt="Preview" fill className="object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                if (formData.imageFileId) {
                                                    setRemovedImageIds(prev => [...prev, formData.imageFileId]);
                                                }
                                                setFormData(prev => ({ ...prev, image: '', imageFileId: '' }));
                                            }}
                                            className="absolute top-0 right-0 p-1 bg-red-500 text-white rounded-bl-lg"
                                        >
                                            <Trash2 className="w-3 h-3" />
                                        </button>
                                    </div>
                                )}
                                {!formData.image && (
                                    <div className="flex-1">
                                        <IKUpload
                                            publicKey={process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY}
                                            urlEndpoint={process.env.NEXT_PUBLIC_IMAGEKIT_URL}
                                            onError={(err) => toast.error('Upload failed')}
                                            onSuccess={(res) => {
                                                setFormData(prev => ({ ...prev, image: res.url, imageFileId: res.fileId }));
                                                toast.success('Image uploaded');
                                            }}
                                            className="text-sm"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        <DialogFooter>
                            <Button type="button" variant="ghost" onClick={() => setDialogOpen(false)}>Cancel</Button>
                            <Button type="submit" disabled={submitting} className="bg-rose-500 hover:bg-rose-600">
                                {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                                {editingCategory ? 'Update Category' : 'Create Category'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
