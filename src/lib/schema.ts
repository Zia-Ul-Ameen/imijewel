import { pgTable, text, integer, boolean, timestamp, uuid, decimal, jsonb } from 'drizzle-orm/pg-core';

// Admin users (only admin@imijewel.com)
export const admins = pgTable('admins', {
    id: uuid('id').primaryKey().defaultRandom(),
    email: text('email').notNull().unique(),
    passwordHash: text('password_hash').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Hero slider content
export const heroContent = pgTable('hero_content', {
    id: uuid('id').primaryKey().defaultRandom(),
    title: text('title').notNull(),
    description: text('description'),
    image: text('image').notNull(),  // ImageKit URL
    imagekitFileId: text('imagekit_file_id'), // for deletion
    brandName: text('brand_name'),
    exploreLink: text('explore_link').default('/shop'),
    isActive: boolean('is_active').default(true).notNull(),
    order: integer('order').default(0).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Brands
export const brands = pgTable('brands', {
    id: uuid('id').primaryKey().defaultRandom(),
    name: text('name').notNull(),
    slug: text('slug').notNull().unique(),
    logo: text('logo'),  // ImageKit URL
    logoFileId: text('logo_file_id'), // for deletion
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Categories
export const categories = pgTable('categories', {
    id: uuid('id').primaryKey().defaultRandom(),
    name: text('name').notNull(),
    slug: text('slug').notNull().unique(),
    image: text('image'),  // ImageKit URL
    imageFileId: text('image_file_id'), // for deletion
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Tags
export const tags = pgTable('tags', {
    id: uuid('id').primaryKey().defaultRandom(),
    name: text('name').notNull(),
    slug: text('slug').notNull().unique(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Products
export const products = pgTable('products', {
    id: uuid('id').primaryKey().defaultRandom(),
    name: text('name').notNull(),
    modelNumber: text('model_number').notNull(),
    description: text('description'),
    price: decimal('price', { precision: 10, scale: 2 }).notNull(),
    offerPrice: decimal('offer_price', { precision: 10, scale: 2 }),
    images: jsonb('images').$type<{ url: string; fileId: string }[]>().default([]).notNull(),
    categoryId: uuid('category_id').references(() => categories.id, { onDelete: 'set null' }),
    brandId: uuid('brand_id').references(() => brands.id, { onDelete: 'set null' }),
    tagIds: jsonb('tag_ids').$type<string[]>().default([]).notNull(),
    isActive: boolean('is_active').default(true).notNull(),
    stock: integer('stock').default(0).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Type exports
export type Admin = typeof admins.$inferSelect;
export type HeroContent = typeof heroContent.$inferSelect;
export type Brand = typeof brands.$inferSelect;
export type Category = typeof categories.$inferSelect;
export type Tag = typeof tags.$inferSelect;
export type Product = typeof products.$inferSelect;

export type NewHeroContent = typeof heroContent.$inferInsert;
export type NewBrand = typeof brands.$inferInsert;
export type NewCategory = typeof categories.$inferInsert;
export type NewTag = typeof tags.$inferInsert;
export type NewProduct = typeof products.$inferInsert;
