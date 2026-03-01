# IMIJEWEL - Premium Jewelry E-commerce

A modern, high-end e-commerce platform for premium jewelry, built with Next.js 15, Tailwind CSS, and Neon DB.

## ✨ Features

- **Premium UI/UX**: Designed for luxury with smooth animations, custom SVG icons, and a glassmorphism aesthetic.
- **Smart Product Discovery**:
    - "Complete the Look" curated collections based on product tags.
    - Category-based recommendations.
    - Advanced search and filtering.
- **Responsive Gallery**: Mobile-optimized image slider with "peek" effect for enhanced discovery.
- **Admin Dashboard**: Full CRUD management for products, categories, brands, tags, and hero content.
- **Image Management**: Seamless integration with ImageKit for fast, optimized image serving.
- **WhatsApp Integration**: Direct-to-chat inquiry buttons for quick customer communication.
- **Secure Authentication**: Admin authentication powered by NextAuth.js.

## 🛠️ Tech Stack

- **Framework**: [Next.js 15 (App Router)](https://nextjs.org)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com)
- **Database**: [Neon DB (PostgreSQL)](https://neon.tech)
- **ORM**: [Drizzle ORM](https://orm.drizzle.team)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/)
- **Authentication**: [NextAuth.js v5](https://authjs.dev)
- **Icons**: [Lucide React](https://lucide.dev)
- **Components**: [Radix UI](https://www.radix-ui.com) & [Sonner](https://sonner.stevenly.me)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- A Neon DB database
- An ImageKit project

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd imijewel
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root and add the following:
   ```env
   DATABASE_URL=your_postgres_url
   NEXTAUTH_SECRET=your_auth_secret
   NEXTAUTH_URL=http://localhost:3000
   
   NEXT_PUBLIC_IMAGEKIT_URL=your_imagekit_url
   NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY=your_public_key
   IMAGEKIT_PRIVATE_KEY=your_private_key
   
   NEXT_PUBLIC_WHATSAPP=your_whatsapp_number_with_country_code
   SEED_SECRET=your_seed_secret
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Seed the admin user (first time only):
   Send a POST request to `/api/seed` with your `x-seed-secret` header.

## 📁 Project Structure

- `src/app`: Next.js App Router pages and API routes.
- `src/components`: UI components (Home, Admin, UI-kit).
- `src/lib`: Database configuration, schemas, and utility functions.
- `src/stores`: Zustand state stores for global data management.
- `src/styles`: Global CSS and Tailwind configurations.

## 🔒 Security Audit

A recent security audit has been performed. Key findings and the improvement roadmap can be found in `src/brain/security_and_api_audit.md`.

## 📄 License

[MIT](LICENSE)
