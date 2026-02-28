'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface Tag {
    id: string;
    name: string;
    slug: string;
}

export default function TagManager() {
    const [tags, setTags] = useState<Tag[]>([]);
    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingTag, setEditingTag] = useState<Tag | null>(null);
    const [formData, setFormData] = useState({ name: '', slug: '' });
    const [submitting, setSubmitting] = useState(false);

    const fetchTags = async () => {
        try {
            const res = await fetch('/api/tags');
            const data = await res.json();
            setTags(data);
        } catch (error) {
            toast.error('Failed to fetch tags');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTags();
    }, []);

    const handleOpenDialog = (tag?: Tag) => {
        if (tag) {
            setEditingTag(tag);
            setFormData({ name: tag.name, slug: tag.slug });
        } else {
            setEditingTag(null);
            setFormData({ name: '', slug: '' });
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
            const method = editingTag ? 'PATCH' : 'POST';
            const url = editingTag ? `/api/tags/${editingTag.id}` : '/api/tags';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!res.ok) throw new Error('Failed to save tag');

            toast.success(`Tag ${editingTag ? 'updated' : 'created'} successfully`);
            setDialogOpen(false);
            fetchTags();
        } catch (error) {
            toast.error('Error saving tag');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this tag?')) return;

        try {
            const res = await fetch(`/api/tags/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Failed to delete tag');

            toast.success('Tag deleted successfully');
            fetchTags();
        } catch (error) {
            toast.error('Error deleting tag');
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Tags</h2>
                <Button onClick={() => handleOpenDialog()} className="bg-rose-500 hover:bg-rose-600">
                    <Plus className="w-4 h-4 mr-2" /> Add Tag
                </Button>
            </div>

            <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Slug</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={3} className="text-center py-8">
                                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-zinc-400" />
                                </TableCell>
                            </TableRow>
                        ) : tags.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={3} className="text-center py-8 text-zinc-500">
                                    No tags found
                                </TableCell>
                            </TableRow>
                        ) : (
                            tags.map((tag) => (
                                <TableRow key={tag.id}>
                                    <TableCell className="font-medium">{tag.name}</TableCell>
                                    <TableCell className="text-zinc-500 font-mono text-xs">{tag.slug}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(tag)}>
                                                <Edit className="w-4 h-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => handleDelete(tag.id)} className="text-red-500 hover:text-red-600 hover:bg-red-50">
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
                        <DialogTitle>{editingTag ? 'Edit Tag' : 'Add Tag'}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => handleNameChange(e.target.value)}
                                required
                                placeholder="e.g. Handmade"
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

                        <DialogFooter>
                            <Button type="button" variant="ghost" onClick={() => setDialogOpen(false)}>Cancel</Button>
                            <Button type="submit" disabled={submitting} className="bg-rose-500 hover:bg-rose-600">
                                {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                                {editingTag ? 'Update Tag' : 'Create Tag'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
