# EECE27 Team Formation Platform 🔥

A modern web application built with Next.js 14+ and Supabase that helps EECE27 students find and form project teams. Students can create projects, browse available team members, and connect via WhatsApp for seamless collaboration.

## ✨ Features

### 🔐 Authentication
- **Google OAuth Integration** - Quick and secure sign-in
- **Smart Redirects** - Users return to their intended page after authentication
- **Profile Setup** - One-time setup with name, section, and WhatsApp number

### 📋 Project Management
- **Create Projects** - Students can create and describe their project ideas
- **Browse Projects** - View all available projects with descriptions
- **Project Details** - Detailed project pages with applicant information

### 👥 Team Formation
- **Apply to Projects** - Students can express interest in joining projects
- **View Applicants** - See who's interested in your project
- **WhatsApp Integration** - Direct contact via WhatsApp for team communication
- **Real-time Updates** - Live updates when people join or leave projects

### 🎨 User Experience
- **Modern UI** - Built with shadcn/ui and Tailwind CSS
- **Responsive Design** - Works perfectly on desktop and mobile
- **Search & Filter** - Find people by name or filter by section
- **Smart Time Display** - WhatsApp-style time formatting (e.g., "2 hours ago")

## 🚀 Tech Stack

- **Frontend**: Next.js 14+ with App Router
- **UI Components**: shadcn/ui (Tailwind CSS)
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth with Google OAuth
- **Deployment**: Vercel (recommended)
- **Language**: TypeScript

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account
- Google Cloud Console project (for OAuth)

### 1. Clone the Repository
```bash
git clone https://github.com/dahroug-h/EECE27team.git
cd EECE27team
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Database Setup
Run the SQL commands from `database-schema.sql` in your Supabase SQL editor to create the required tables and policies.

### 5. Google OAuth Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `http://localhost:3000/auth/callback` (development)
   - `https://your-domain.com/auth/callback` (production)
   - `https://your-supabase-project.supabase.co/auth/v1/callback`

### 6. Supabase Configuration
1. In Supabase Dashboard, go to Authentication > Providers
2. Enable Google provider
3. Add your Google OAuth credentials
4. Set redirect URL to your domain

### 7. Run Development Server
```bash
npm run dev
```

Visit `http://localhost:3000` to see the application.

## 🗄️ Database Schema

The application uses three main tables:

### `profiles`
- User profile information
- Full name, section, WhatsApp number
- Linked to Supabase auth users

### `projects`
- Project information
- Name, description, creator
- Auto-generated slugs for URLs

### `applications`
- Project applications
- Links users to projects
- Tracks application timestamps

## 🎯 Usage

### For Students
1. **Sign in** with your Google account
2. **Complete profile** with your name, section, and WhatsApp number
3. **Browse projects** or create your own
4. **Apply to projects** you're interested in
5. **Contact team members** via WhatsApp

### For Project Creators
1. **Create a project** with name and description
2. **View applicants** who want to join
3. **Contact applicants** via WhatsApp
4. **Manage your project** and team

## 🔧 Development

### Project Structure
```
src/
├── app/                 # Next.js App Router pages
│   ├── auth/           # Authentication routes
│   ├── create/         # Project creation
│   ├── p/[slug]/       # Individual project pages
│   └── setup-profile/  # Profile setup
├── components/         # Reusable UI components
│   └── ui/            # shadcn/ui components
└── lib/               # Utilities and configurations
    ├── supabase/      # Supabase client setup
    └── types.ts       # TypeScript type definitions
```

### Key Files
- `src/lib/supabase/queries.ts` - Database operations
- `src/lib/types.ts` - TypeScript interfaces
- `src/middleware.ts` - Authentication middleware
- `database-schema.sql` - Database setup

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Other Platforms
The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🤝 Contributing

We welcome contributions from the EECE27 community! Here's how you can help:

### 🐛 Bug Reports
- Use GitHub Issues to report bugs
- Include steps to reproduce
- Add screenshots if applicable

### 💡 Feature Requests
- Suggest new features via GitHub Issues
- Describe the use case and benefits
- Consider implementation complexity

### 🔧 Code Contributions
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Test thoroughly
5. Commit: `git commit -m 'Add amazing feature'`
6. Push: `git push origin feature/amazing-feature`
7. Open a Pull Request

### 📝 Documentation
- Improve README sections
- Add code comments
- Create tutorials or guides
- Fix typos and grammar

## 🎨 UI/UX Improvements
- Design better layouts
- Improve mobile responsiveness
- Add animations and transitions
- Enhance accessibility
- Create better icons and graphics

## 🔒 Security
- Review authentication flows
- Check for security vulnerabilities
- Improve input validation
- Add rate limiting
- Enhance error handling

## 🚀 Performance
- Optimize database queries
- Improve loading times
- Add caching strategies
- Optimize images and assets
- Implement lazy loading

## 📱 Mobile Features
- PWA capabilities
- Push notifications
- Offline functionality
- Better mobile navigation

## 🌟 Future Ideas

### Potential Features
- **Project Categories** - Organize projects by type
- **Skills Matching** - Match students by skills
- **Team Chat** - Built-in messaging system
- **File Sharing** - Share project documents
- **Progress Tracking** - Track project milestones
- **Rating System** - Rate team members and projects
- **Notifications** - Email/SMS notifications
- **Calendar Integration** - Schedule team meetings
- **GitHub Integration** - Link to project repositories
- **Analytics Dashboard** - Project and user statistics

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👥 Team

Created by the EECE27 community for EECE27 students.

## 📞 Support

- **GitHub Issues**: Report bugs and request features
- **Discussions**: Ask questions and share ideas
- **Email**: Contact the maintainers

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Database powered by [Supabase](https://supabase.com/)
- Icons from [Lucide](https://lucide.dev/)

---

**Happy Team Building! 🎉**

*Made with ❤️ for EECE27 students*