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

interface Brand {
    id: string;
    name: string;
    slug: string;
    logo?: string | null;
    logoFileId?: string | null;
}

export default function BrandManager() {
    const [brands, setBrands] = useState<Brand[]>([]);
    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
    const [formData, setFormData] = useState({ name: '', slug: '', logo: '', logoFileId: '' });
    const [submitting, setSubmitting] = useState(false);

    const fetchBrands = async () => {
        try {
            const res = await fetch('/api/brands');
            const data = await res.json();
            setBrands(data);
        } catch (error) {
            toast.error('Failed to fetch brands');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBrands();
    }, []);

    const handleOpenDialog = (brand?: Brand) => {
        if (brand) {
            setEditingBrand(brand);
            setFormData({ name: brand.name, slug: brand.slug, logo: brand.logo || '', logoFileId: brand.logoFileId || '' });
        } else {
            setEditingBrand(null);
            setFormData({ name: '', slug: '', logo: '', logoFileId: '' });
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
            const method = editingBrand ? 'PATCH' : 'POST';
            const url = editingBrand ? `/api/brands/${editingBrand.id}` : '/api/brands';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!res.ok) throw new Error('Failed to save brand');

            toast.success(`Brand ${editingBrand ? 'updated' : 'created'} successfully`);
            setDialogOpen(false);
            fetchBrands();
        } catch (error) {
            toast.error('Error saving brand');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string, logoFileId?: string | null) => {
        if (!confirm('Are you sure you want to delete this brand?')) return;

        try {
            // First delete image if exists
            if (logoFileId) {
                await fetch('/api/imagekit-delete', {
                    method: 'POST',
                    body: JSON.stringify({ fileId: logoFileId }),
                });
            }

            const res = await fetch(`/api/brands/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Failed to delete brand');

            toast.success('Brand deleted successfully');
            fetchBrands();
        } catch (error) {
            toast.error('Error deleting brand');
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Brands</h2>
                <Button onClick={() => handleOpenDialog()} className="bg-rose-500 hover:bg-rose-600">
                    <Plus className="w-4 h-4 mr-2" /> Add Brand
                </Button>
            </div>

            <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Logo</TableHead>
                            <TableHead>Name</TableHead>
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
                        ) : brands.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-8 text-zinc-500">
                                    No brands found
                                </TableCell>
                            </TableRow>
                        ) : (
                            brands.map((brand) => (
                                <TableRow key={brand.id}>
                                    <TableCell>
                                        {brand.logo ? (
                                            <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-zinc-100">
                                                <Image src={brand.logo} alt={brand.name} fill className="object-contain" />
                                            </div>
                                        ) : (
                                            <div className="w-10 h-10 rounded-lg bg-zinc-50 flex items-center justify-center text-zinc-300">
                                                <ImageIcon className="w-5 h-5" />
                                            </div>
                                        )}
                                    </TableCell>
                                    <TableCell className="font-medium">{brand.name}</TableCell>
                                    <TableCell className="text-zinc-500 font-mono text-xs">{brand.slug}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(brand)}>
                                                <Edit className="w-4 h-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => handleDelete(brand.id, brand.logoFileId)} className="text-red-500 hover:text-red-600 hover:bg-red-50">
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
                        <DialogTitle>{editingBrand ? 'Edit Brand' : 'Add Brand'}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => handleNameChange(e.target.value)}
                                required
                                placeholder="e.g. Sabyasachi"
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
                            <Label>Logo</Label>
                            <div className="flex items-center gap-4">
                                {formData.logo && (
                                    <div className="relative w-16 h-16 rounded-lg border border-zinc-200 overflow-hidden">
                                        <Image src={formData.logo} alt="Preview" fill className="object-contain" />
                                        <button
                                            type="button"
                                            onClick={() => setFormData(prev => ({ ...prev, logo: '', logoFileId: '' }))}
                                            className="absolute top-0 right-0 p-1 bg-red-500 text-white rounded-bl-lg"
                                        >
                                            <Trash2 className="w-3 h-3" />
                                        </button>
                                    </div>
                                )}
                                {!formData.logo && (
                                    <div className="flex-1">
                                        <IKUpload
                                            publicKey={process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY}
                                            urlEndpoint={process.env.NEXT_PUBLIC_IMAGEKIT_URL}
                                            onError={(err) => toast.error('Upload failed')}
                                            onSuccess={(res) => {
                                                setFormData(prev => ({ ...prev, logo: res.url, logoFileId: res.fileId }));
                                                toast.success('Logo uploaded');
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
                                {editingBrand ? 'Update Brand' : 'Create Brand'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
