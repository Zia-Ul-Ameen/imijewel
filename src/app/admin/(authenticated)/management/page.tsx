'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BrandManager from './components/BrandManager';
import CategoryManager from './components/CategoryManager';
import TagManager from './components/TagManager';

export default function ManagementPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-black text-zinc-900">Store Management</h1>
                <p className="text-sm text-zinc-500 mt-1">
                    Manage your brands, categories, and tags.
                </p>
            </div>

            <Tabs defaultValue="categories" className="w-full">
                <TabsList className="bg-white border border-zinc-200 p-1 rounded-xl w-full max-w-md grid grid-cols-3">
                    <TabsTrigger value="categories" className="rounded-lg data-[state=active]:bg-rose-500 data-[state=active]:text-white transition-all">
                        Categories
                    </TabsTrigger>
                    <TabsTrigger value="brands" className="rounded-lg data-[state=active]:bg-rose-500 data-[state=active]:text-white transition-all">
                        Brands
                    </TabsTrigger>
                    <TabsTrigger value="tags" className="rounded-lg data-[state=active]:bg-rose-500 data-[state=active]:text-white transition-all">
                        Tags
                    </TabsTrigger>
                </TabsList>

                <div className="mt-6">
                    <TabsContent value="categories" className="focus-visible:outline-none">
                        <CategoryManager />
                    </TabsContent>
                    <TabsContent value="brands" className="focus-visible:outline-none">
                        <BrandManager />
                    </TabsContent>
                    <TabsContent value="tags" className="focus-visible:outline-none">
                        <TagManager />
                    </TabsContent>
                </div>
            </Tabs>
        </div>
    );
}
