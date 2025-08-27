# Campaign Management Mini-App

A full-stack web application for managing influencer marketing campaigns, built with Next.js, tRPC, Supabase, and Drizzle ORM.

## 🌐 Live Demo

**🔗 [View Live Demo](https://campaign-management-mini-app.vercel.app/)**

## 📌 Goal

Build a small full-stack web application that simulates a mini campaign management tool. The goal of this task is to evaluate skills in Next.js, tRPC, Supabase, and the ability to structure a simple full-stack project.

## 🔹 Requirements

### 1. Authentication
- Implement a simple authentication system
- Users should be able to sign up and log in
- After logging in, a user should only see their own campaigns
- Uses Supabase Auth (preferred)

### 2. Campaign Management (CRUD)
A logged-in user should be able to:
- Create a campaign (fields: title, description, budget, startDate, endDate)
- View a list of their campaigns
- Edit and delete campaigns

### 3. Influencer Assignment
- A user should be able to assign influencers to a campaign
- Uses mock data for creators (with full CRUD capability)
- Each influencer should have at least:
  - name
  - followerCount
  - engagementRate
- Show a list of influencers linked to individual campaigns

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 18, Tailwind CSS
- **Backend**: tRPC, Node.js
- **Database**: Supabase (PostgreSQL)
- **ORM**: Drizzle ORM
- **Authentication**: Supabase Auth
- **Language**: TypeScript

## 🚀 Features

- **Authentication**: Real Supabase Auth with signup/login
- **Campaign Management**: Full CRUD operations for campaigns
- **Influencer Assignment**: Assign influencers to campaigns
- **Real-time Data**: Live updates with tRPC
- **Responsive UI**: Beautiful, mobile-friendly interface
- **Type Safety**: Full TypeScript support

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account
- PostgreSQL database

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd campaign-management-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory:
   ```env
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
   
   # Database Configuration
   DATABASE_URL=postgresql://postgres:password@db.your-project-id.supabase.co:5432/postgres
   ```

4. **Supabase Setup**
   - Create a new Supabase project at [supabase.com](https://supabase.com)
   - Go to Settings → API to get your project URL and keys
   - Update the environment variables with your actual values
   - Go to SQL Editor and run the database setup script (see Database Setup below)
   - Enable Row Level Security (RLS) for all tables
   - Configure authentication settings (email confirmation, etc.)

5. **Database Setup**
   
   **Option A: Using Drizzle Migrations**
   ```bash
   # Generate migration files
   npm run db:generate
   
   # Run migrations
   npm run db:migrate
   
   # Seed with sample data (optional)
   npm run db:seed
   ```
   
   **Option B: Manual SQL Setup (Recommended)**
   - Go to Supabase Dashboard → SQL Editor
   - Run the following SQL script to create tables and sample data:
   ```sql
   -- Create tables
   CREATE TABLE IF NOT EXISTS public.campaigns (
     id SERIAL PRIMARY KEY,
     user_id UUID NOT NULL,
     title VARCHAR(256) NOT NULL,
     description TEXT,
     budget NUMERIC(12,2) NOT NULL DEFAULT 0,
     start_date DATE NOT NULL,
     end_date DATE NOT NULL,
     created_at TIMESTAMP DEFAULT NOW() NOT NULL
   );
   
   CREATE TABLE IF NOT EXISTS public.influencers (
     id SERIAL PRIMARY KEY,
     name VARCHAR(256) NOT NULL,
     follower_count INTEGER NOT NULL DEFAULT 0,
     engagement_rate NUMERIC(5,2) NOT NULL DEFAULT 0,
     created_at TIMESTAMP DEFAULT NOW() NOT NULL
   );
   
   CREATE TABLE IF NOT EXISTS public.campaign_influencers (
     campaign_id INTEGER NOT NULL,
     influencer_id INTEGER NOT NULL,
     PRIMARY KEY (campaign_id, influencer_id),
     FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON DELETE CASCADE,
     FOREIGN KEY (influencer_id) REFERENCES influencers(id) ON DELETE CASCADE
   );
   
   -- Enable RLS
   ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
   ALTER TABLE public.influencers ENABLE ROW LEVEL SECURITY;
   ALTER TABLE public.campaign_influencers ENABLE ROW LEVEL SECURITY;
   
   -- Create RLS policies
   CREATE POLICY "Users can view their own campaigns" ON public.campaigns FOR SELECT USING (auth.uid() = user_id);
   CREATE POLICY "Users can insert their own campaigns" ON public.campaigns FOR INSERT WITH CHECK (auth.uid() = user_id);
   CREATE POLICY "Users can update their own campaigns" ON public.campaigns FOR UPDATE USING (auth.uid() = user_id);
   CREATE POLICY "Users can delete their own campaigns" ON public.campaigns FOR DELETE USING (auth.uid() = user_id);
   
   CREATE POLICY "Anyone can view influencers" ON public.influencers FOR SELECT USING (true);
   CREATE POLICY "Authenticated users can insert influencers" ON public.influencers FOR INSERT WITH CHECK (auth.role() = 'authenticated');
   CREATE POLICY "Authenticated users can update influencers" ON public.influencers FOR UPDATE USING (auth.role() = 'authenticated');
   CREATE POLICY "Authenticated users can delete influencers" ON public.influencers FOR DELETE USING (auth.role() = 'authenticated');
   
   CREATE POLICY "Users can view campaign influencers" ON public.campaign_influencers FOR SELECT USING (
     EXISTS(SELECT 1 FROM public.campaigns c WHERE c.id = campaign_id AND c.user_id = auth.uid())
   );
   CREATE POLICY "Users can insert campaign influencers" ON public.campaign_influencers FOR INSERT WITH CHECK (
     EXISTS(SELECT 1 FROM public.campaigns c WHERE c.id = campaign_id AND c.user_id = auth.uid())
   );
   CREATE POLICY "Users can delete campaign influencers" ON public.campaign_influencers FOR DELETE USING (
     EXISTS(SELECT 1 FROM public.campaigns c WHERE c.id = campaign_id AND c.user_id = auth.uid())
   );
   
   -- Insert sample influencers
   INSERT INTO public.influencers (name, follower_count, engagement_rate) VALUES
   ('techguru', 250000, 4.2),
   ('fashionista', 180000, 3.8),
   ('fitnesspro', 320000, 5.1),
   ('foodlover', 150000, 4.5),
   ('travelbug', 280000, 3.9),
   ('gamingmaster', 450000, 6.2),
   ('beautyqueen', 220000, 4.8),
   ('lifestyleblogger', 190000, 4.1),
   ('businessinsider', 120000, 3.2),
   ('musicvibes', 350000, 5.5),
   ('sportshighlight', 400000, 4.9),
   ('comedyking', 500000, 7.1),
   ('artgallery', 80000, 3.5),
   ('petlover', 110000, 4.3),
   ('cookingchef', 130000, 4.6),
   ('motivationguru', 200000, 4.7),
   ('techreviewer', 160000, 3.6),
   ('fashiontrend', 140000, 4.0),
   ('healthylife', 170000, 4.4),
   ('entertainment', 380000, 5.8);
   ```

6. **Start Development Server**
   ```bash
   npm run dev
   ```

7. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:generate` - Generate database migrations
- `npm run db:migrate` - Run database migrations
- `npm run db:seed` - Seed database with sample data

## 🌐 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `DATABASE_URL`
4. Deploy!

### Netlify

1. Push your code to GitHub
2. Connect your repository to Netlify
3. Add environment variables in Netlify dashboard
4. Deploy!

## 🗄️ Database Schema

The application uses the following database tables:

- **users**: User accounts (extends Supabase auth.users)
- **campaigns**: Marketing campaigns
- **influencers**: Influencer profiles
- **campaign_influencers**: Many-to-many relationship between campaigns and influencers

## 📱 API Endpoints

The application uses tRPC for type-safe API calls:

- `campaigns.*` - Campaign management operations
- `influencers.*` - Influencer management operations

All endpoints are protected and require authentication.

## 🔐 Authentication

- Uses Supabase Auth for secure authentication
- JWT tokens for session management
- Protected routes and API endpoints
- User-specific data isolation

## 🎨 UI/UX Features

- Responsive design for all device sizes
- Modern, clean interface with Tailwind CSS
- Smooth animations and transitions
- Intuitive user experience
- Mobile-first approach

## 🧪 Testing

```bash
# Run tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 📝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues:

1. Check the [Issues](../../issues) page
2. Create a new issue with detailed information
3. Contact the development team

## 🔄 Updates

Stay updated with the latest changes:

- Watch the repository
- Check the [Releases](../../releases) page
- Follow the development blog

---

**Built with ❤️ using Next.js, tRPC, Supabase, and Drizzle ORM**
