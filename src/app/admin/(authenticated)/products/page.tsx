'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Loader2, Image as ImageIcon, Search, SlidersHorizontal, CheckCircle2, XCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import Image from 'next/image';
import { IKUpload } from 'imagekitio-next';

interface Product {
    id: string;
    name: string;
    modelNumber: string;
    description?: string | null;
    price: string | number;
    offerPrice?: string | number | null;
    images: { url: string; fileId: string }[];
    categoryId: string | null;
    brandId: string | null;
    tags: string[];
    stock: number;
    isActive: boolean;
    categoryName?: string;
    brandName?: string;
}

interface MetaData { id: string; name: string; }

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<MetaData[]>([]);
    const [brands, setBrands] = useState<MetaData[]>([]);
    const [tags, setTags] = useState<MetaData[]>([]);

    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [submitting, setSubmitting] = useState(false);

    // Filters & Pagination
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [formData, setFormData] = useState({
        name: '',
        modelNumber: '',
        description: '',
        price: '',
        offerPrice: '',
        images: [] as { url: string; fileId: string }[],
        categoryId: 'none',
        brandId: 'none',
        tags: [] as string[],
        stock: 0,
        isActive: true,
    });

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: String(page),
                limit: '10',
                search,
            });
            const res = await fetch(`/api/products?${params}`);
            const data = await res.json();
            setProducts(data.products || []);
            setTotalPages(data.pagination?.totalPages || 1);
        } catch (error) {
            toast.error('Failed to fetch products');
        } finally {
            setLoading(false);
        }
    };

    const fetchMeta = async () => {
        const [cats, brnds, tgs] = await Promise.all([
            fetch('/api/categories').then(r => r.json()),
            fetch('/api/brands').then(r => r.json()),
            fetch('/api/tags').then(r => r.json()),
        ]);
        setCategories(cats);
        setBrands(brnds);
        setTags(tgs);
    };

    useEffect(() => {
        fetchProducts();
    }, [page, search]);

    useEffect(() => {
        fetchMeta();
    }, []);

    const handleOpenDialog = (product?: Product) => {
        if (product) {
            setEditingProduct(product);
            setFormData({
                name: product.name,
                modelNumber: product.modelNumber,
                description: product.description || '',
                price: String(product.price),
                offerPrice: product.offerPrice ? String(product.offerPrice) : '',
                images: product.images || [],
                categoryId: product.categoryId || 'none',
                brandId: product.brandId || 'none',
                tags: product.tags || [],
                stock: product.stock,
                isActive: product.isActive,
            });
        } else {
            setEditingProduct(null);
            setFormData({
                name: '',
                modelNumber: '',
                description: '',
                price: '',
                offerPrice: '',
                images: [],
                categoryId: 'none',
                brandId: 'none',
                tags: [],
                stock: 0,
                isActive: true,
            });
        }
        setDialogOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.images.length === 0) {
            toast.error('Please upload at least one image');
            return;
        }
        setSubmitting(true);
        try {
            const payload = {
                ...formData,
                categoryId: formData.categoryId === 'none' ? null : formData.categoryId,
                brandId: formData.brandId === 'none' ? null : formData.brandId,
                price: Number(formData.price),
                offerPrice: formData.offerPrice ? Number(formData.offerPrice) : null,
            };

            const method = editingProduct ? 'PATCH' : 'POST';
            const url = editingProduct ? `/api/products/${editingProduct.id}` : '/api/products';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!res.ok) throw new Error('Failed to save product');

            toast.success(`Product ${editingProduct ? 'updated' : 'created'} successfully`);
            setDialogOpen(false);
            fetchProducts();
        } catch (error) {
            toast.error('Error saving product');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string, images: { fileId: string }[]) => {
        if (!confirm('Are you sure you want to delete this product?')) return;

        try {
            // Delete images from ImageKit
            await Promise.all(images.map(img =>
                fetch('/api/imagekit-delete', {
                    method: 'POST',
                    body: JSON.stringify({ fileId: img.fileId }),
                })
            ));

            const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Failed to delete product');

            toast.success('Product deleted successfully');
            fetchProducts();
        } catch (error) {
            toast.error('Error deleting product');
        }
    };

    const handleTagToggle = (tagId: string) => {
        setFormData(prev => ({
            ...prev,
            tags: prev.tags.includes(tagId)
                ? prev.tags.filter(t => t !== tagId)
                : [...prev.tags, tagId]
        }));
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-zinc-900">Products</h1>
                    <p className="text-sm text-zinc-500 mt-1">Manage your jewellery inventory.</p>
                </div>
                <Button onClick={() => handleOpenDialog()} className="bg-rose-500 hover:bg-rose-600 rounded-xl h-11 px-6 font-bold shadow-lg shadow-rose-500/20">
                    <Plus className="w-5 h-5 mr-2" /> Add Product
                </Button>
            </div>

            {/* Toolbar */}
            <div className="flex items-center gap-3">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                    <Input
                        placeholder="Search products..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10 h-11 rounded-xl border-zinc-200 bg-white"
                    />
                </div>
                <Button variant="outline" className="h-11 rounded-xl border-zinc-200 text-zinc-600 font-medium">
                    <SlidersHorizontal className="w-4 h-4 mr-2" /> Filters
                </Button>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-zinc-200 overflow-hidden shadow-sm">
                <Table>
                    <TableHeader className="bg-zinc-50/50">
                        <TableRow>
                            <TableHead className="w-20">Image</TableHead>
                            <TableHead>Product Info</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Category/Brand</TableHead>
                            <TableHead>Stock</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-20">
                                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-rose-500" />
                                </TableCell>
                            </TableRow>
                        ) : products.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-20 text-zinc-500">
                                    No products found. Add your first item!
                                </TableCell>
                            </TableRow>
                        ) : (
                            products.map((p) => (
                                <TableRow key={p.id}>
                                    <TableCell>
                                        <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-zinc-100 bg-zinc-50">
                                            {p.images?.[0] ? (
                                                <Image src={p.images[0].url} alt={p.name} fill className="object-cover" />
                                            ) : (
                                                <ImageIcon className="w-6 h-6 m-3 text-zinc-300" />
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-bold text-zinc-900 text-sm line-clamp-1">{p.name}</span>
                                            <span className="text-[10px] text-zinc-400 font-mono ">{p.modelNumber}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col leading-tight">
                                            <span className="font-bold text-zinc-900">₹{Number(p.offerPrice || p.price).toLocaleString()}</span>
                                            {p.offerPrice && <span className="text-[10px] text-zinc-400 line-through">₹{Number(p.price).toLocaleString()}</span>}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col gap-1">
                                            {p.categoryName && <span className="text-[10px] uppercase font-black tracking-widest text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded w-fit">{p.categoryName}</span>}
                                            {p.brandName && <span className="text-[10px] uppercase font-black tracking-widest text-rose-500 bg-rose-50 px-2 py-0.5 rounded w-fit">{p.brandName}</span>}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className={`text-xs font-bold ${p.stock <= 5 ? 'text-amber-600' : 'text-zinc-600'}`}>
                                            {p.stock} units
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        {p.isActive ? (
                                            <div className="flex items-center gap-1.5 text-green-600 text-[10px] font-black uppercase bg-green-50 px-2.5 py-1 rounded-full w-fit">
                                                <CheckCircle2 className="w-3.5 h-3.5" /> Published
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-1.5 text-zinc-400 text-[10px] font-black uppercase bg-zinc-50 px-2.5 py-1 rounded-full w-fit">
                                                <XCircle className="w-3.5 h-3.5" /> Hidden
                                            </div>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-1">
                                            <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(p)} className="rounded-lg">
                                                <Edit className="w-4 h-4 text-zinc-600" />
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => handleDelete(p.id, p.images)} className="rounded-lg text-red-500 hover:bg-red-50">
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="px-6 py-4 border-t border-zinc-100 flex items-center justify-between bg-zinc-50/30">
                        <span className="text-xs text-zinc-500 font-medium">Page {page} of {totalPages}</span>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={page === 1}
                                onClick={() => setPage(page - 1)}
                                className="h-8 rounded-lg"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={page === totalPages}
                                onClick={() => setPage(page + 1)}
                                className="h-8 rounded-lg"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            {/* Editor Dialog */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-6 py-4">
                        {/* Basic Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Product Name</Label>
                                    <Input id="name" value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="modelNumber">Model Number</Label>
                                    <Input id="modelNumber" placeholder="e.g. IJ-NK-001" value={formData.modelNumber} onChange={e => setFormData(p => ({ ...p, modelNumber: e.target.value }))} required />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="price">Price (₹)</Label>
                                        <Input id="price" type="number" value={formData.price} onChange={e => setFormData(p => ({ ...p, price: e.target.value }))} required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="offerPrice">Offer Price (₹)</Label>
                                        <Input id="offerPrice" type="number" placeholder="Optional" value={formData.offerPrice} onChange={e => setFormData(p => ({ ...p, offerPrice: e.target.value }))} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="stock">Stock Quantity</Label>
                                    <Input id="stock" type="number" value={formData.stock} onChange={e => setFormData(p => ({ ...p, stock: parseInt(e.target.value) || 0 }))} required />
                                </div>
                                <div className="flex items-center space-x-2 pt-2">
                                    <Switch id="isActive" checked={formData.isActive} onCheckedChange={v => setFormData(p => ({ ...p, isActive: v }))} />
                                    <Label htmlFor="isActive">Visible to Customers</Label>
                                </div>
                            </div>

                            {/* Relations */}
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Category</Label>
                                    <Select value={formData.categoryId || 'none'} onValueChange={v => setFormData(p => ({ ...p, categoryId: v }))}>
                                        <SelectTrigger className="rounded-xl h-11">
                                            <SelectValue placeholder="Select Category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="none">Uncategorized</SelectItem>
                                            {categories.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Brand</Label>
                                    <Select value={formData.brandId || 'none'} onValueChange={v => setFormData(p => ({ ...p, brandId: v }))}>
                                        <SelectTrigger className="rounded-xl h-11">
                                            <SelectValue placeholder="Select Brand" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="none">No Brand</SelectItem>
                                            {brands.map(b => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Tags</Label>
                                    <div className="p-3 border border-zinc-200 rounded-xl grid grid-cols-2 gap-2 max-h-32 overflow-y-auto bg-zinc-50/50">
                                        {tags.map(t => (
                                            <div key={t.id} className="flex items-center space-x-2">
                                                <Checkbox id={`tag-${t.id}`} checked={formData.tags.includes(t.id)} onCheckedChange={() => handleTagToggle(t.id)} />
                                                <label htmlFor={`tag-${t.id}`} className="text-xs font-medium cursor-pointer">{t.name}</label>
                                            </div>
                                        ))}
                                        {tags.length === 0 && <p className="text-[10px] text-zinc-400 col-span-2">No tags available</p>}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="description">Product Description</Label>
                                    <Textarea id="description" value={formData.description} onChange={e => setFormData(p => ({ ...p, description: e.target.value }))} rows={4} placeholder="Detailed product specifications..." />
                                </div>
                            </div>
                        </div>

                        {/* Images */}
                        <div className="space-y-3 border-t border-zinc-100 pt-6">
                            <Label className="text-base">Product Images (Upload first, drag to reorder disabled for now)</Label>
                            <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                                {formData.images.map((img, idx) => (
                                    <div key={img.fileId} className="relative aspect-square rounded-xl border border-zinc-200 overflow-hidden group bg-zinc-50">
                                        <Image src={img.url} alt={`Product ${idx}`} fill className="object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => setFormData(p => ({ ...p, images: p.images.filter(i => i.fileId !== img.fileId) }))}
                                            className="absolute top-1 right-1 p-1.5 bg-red-500 text-white rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                        {idx === 0 && <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[8px] font-black uppercase tracking-widest text-center py-1">Cover</div>}
                                    </div>
                                ))}

                                <div className="relative aspect-square rounded-xl border-2 border-dashed border-zinc-200 flex flex-col items-center justify-center bg-zinc-50 hover:bg-zinc-100 transition-colors cursor-pointer group">
                                    <IKUpload
                                        publicKey={process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY}
                                        urlEndpoint={process.env.NEXT_PUBLIC_IMAGEKIT_URL}
                                        onError={(e) => toast.error('Upload failed')}
                                        onSuccess={(res) => {
                                            setFormData(p => ({ ...p, images: [...p.images, { url: res.url, fileId: res.fileId }] }));
                                            toast.success('Image added');
                                        }}
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                    />
                                    <Plus className="w-6 h-6 text-zinc-300 group-hover:text-rose-400 group-hover:scale-110 transition-all" />
                                    <span className="text-[9px] font-black uppercase text-zinc-400 mt-1">Upload</span>
                                </div>
                            </div>
                        </div>

                        <DialogFooter className="pt-6 border-t border-zinc-100 mt-6">
                            <Button type="button" variant="ghost" onClick={() => setDialogOpen(false)} className="rounded-xl h-12 px-6">Cancel</Button>
                            <Button type="submit" disabled={submitting} className="bg-rose-500 hover:bg-rose-600 rounded-xl h-12 px-10 font-bold shadow-lg shadow-rose-500/20">
                                {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                                {editingProduct ? 'Update Product' : 'Create Product'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
