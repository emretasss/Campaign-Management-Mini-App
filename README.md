# Campaign Management Mini-App

A full-stack web application for managing influencer marketing campaigns, built with Next.js, tRPC, Supabase, and Drizzle ORM.

## 🚀 Features

- **Authentication**: Real Supabase Auth with signup/login
- **Campaign Management**: Full CRUD operations for campaigns
- **Influencer Assignment**: Assign influencers to campaigns
- **Real-time Data**: Live updates with tRPC
- **Responsive UI**: Beautiful, mobile-friendly interface
- **Type Safety**: Full TypeScript support

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 18, Tailwind CSS
- **Backend**: tRPC, Node.js
- **Database**: Supabase (PostgreSQL)
- **ORM**: Drizzle ORM
- **Authentication**: Supabase Auth
- **Language**: TypeScript

## 📋 Requirements

1. **Authentication**
   - Users can sign up and log in
   - After logging in, users only see their own campaigns
   - Uses Supabase Auth

2. **Campaign Management (CRUD)**
   - Create campaigns (title, description, budget, startDate, endDate)
   - View list of user's campaigns
   - Edit and delete campaigns

3. **Influencer Assignment**
   - Assign influencers to campaigns
   - Mock data for creators (with full CRUD capability)
   - Each influencer has: name, followerCount, engagementRate
   - Show influencers linked to individual campaigns

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
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
   
   # Database Configuration
   DATABASE_URL=your_database_url_here
   ```

4. **Supabase Setup**
   - Create a new Supabase project
   - Get your project URL and anon key
   - Update the environment variables
   - Run the database migrations (see Database Setup below)

5. **Database Setup**
   ```bash
   # Generate migration files
   npm run db:generate
   
   # Run migrations
   npm run db:migrate
   
   # Seed with sample data (optional)
   npm run db:seed
   ```

6. **Start Development Server**
   ```bash
   npm run dev
   ```

7. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🗄️ Database Schema

The application uses the following database tables:

- **users**: User accounts (extends Supabase auth.users)
- **campaigns**: Marketing campaigns
- **influencers**: Influencer profiles
- **campaign_influencers**: Many-to-many relationship between campaigns and influencers

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
3. Add environment variables in Vercel dashboard
4. Deploy!

### Netlify

1. Push your code to GitHub
2. Connect your repository to Netlify
3. Add environment variables in Netlify dashboard
4. Deploy!

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
# Campaign-Management-Mini-App
