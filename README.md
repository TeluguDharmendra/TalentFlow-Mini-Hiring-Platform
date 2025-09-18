# TalentFlow - Mini HR Hiring Platform

A comprehensive React-based HR hiring platform built with modern web technologies. This application simulates a full-featured hiring system with job management, candidate tracking, and assessment creation capabilities.

## 🚀 Features

### Authentication & Security
- **Admin Login System**: Secure authentication with username/password
- **Protected Routes**: All main features require authentication
- **Session Persistence**: Login state persists across browser sessions
- **Default Credentials**: `admin` / `password123`

### Job Management
- **Job Listings**: View, create, edit, and manage job postings
- **Advanced Filtering**: Search by title, description, tags, and status
- **Drag & Drop Reordering**: Reorder jobs with optimistic updates and rollback
- **Job Details**: Comprehensive job information with requirements and salary
- **Archive/Unarchive**: Manage job status and visibility
- **Pagination**: Efficient handling of large job lists

### Candidate Management
- **Virtualized List**: High-performance list for 1000+ candidates
- **Advanced Search**: Search by name, email, and other criteria
- **Kanban Board**: Drag-and-drop candidate stage management
- **Stage Tracking**: Applied → Screening → Interview → Offer → Hired/Rejected
- **Candidate Profiles**: Detailed candidate information with timeline
- **Notes with @Mentions**: Team collaboration with mention system
- **Timeline View**: Complete activity history for each candidate

### Assessment Builder
- **Question Types**: Single choice, multiple choice, short text, long text, numeric range, file upload
- **Live Preview**: Real-time preview of assessment as candidates will see it
- **Conditional Logic**: Show/hide questions based on previous answers
- **Section Management**: Organize questions into logical sections
- **Form Validation**: Client-side validation with error handling
- **Drag & Drop**: Reorder sections and questions

### Data & Persistence
- **IndexedDB Storage**: All data persisted locally using Dexie
- **Mock API**: MSW (Mock Service Worker) simulates backend endpoints
- **Realistic Latency**: 200-1200ms response times with 7% error rate
- **Optimistic Updates**: Immediate UI updates with rollback on failure
- **Seed Data**: 25 jobs, 1200+ candidates, and comprehensive assessments

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern React with hooks and functional components
- **React Router 7** - Client-side routing with protected routes
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icon library

### State Management
- **React Context** - Global state management with useReducer
- **Custom Hooks** - Reusable logic for API calls and state

### Data & API
- **Dexie** - IndexedDB wrapper for local storage
- **MSW** - Mock Service Worker for API simulation
- **React Hook Form** - Form handling and validation
- **Yup** - Schema validation

### UI/UX
- **@dnd-kit** - Drag and drop functionality
- **React Window** - Virtualization for large lists
- **React Virtualized Auto Sizer** - Dynamic sizing for virtualized content
- **Custom Components** - Reusable UI components

### Development
- **Vite** - Fast build tool and dev server
- **ESLint** - Code linting and formatting
- **PostCSS** - CSS processing

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd TalentFlow-main
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:5173`

## 🔐 Authentication

The application uses a simple authentication system for demonstration:

- **Username**: `admin`
- **Password**: `password123`

After login, you'll have access to all features. The authentication state persists across browser sessions.

## 📊 Data Structure

### Jobs
```javascript
{
  id: number,
  title: string,
  slug: string,
  description: string,
  requirements: string[],
  location: string,
  type: string,
  salary: { min: number, max: number, currency: string },
  tags: string[],
  status: 'active' | 'archived',
  order: number,
  createdAt: Date,
  updatedAt: Date
}
```

### Candidates
```javascript
{
  id: number,
  name: string,
  email: string,
  phone: string,
  stage: 'applied' | 'screening' | 'interview' | 'offer' | 'hired' | 'rejected',
  jobId: number,
  resume: string,
  experience: number,
  skills: string[],
  location: string,
  salary: { min: number, max: number, currency: string },
  createdAt: Date,
  updatedAt: Date
}
```

### Assessments
```javascript
{
  id: number,
  jobId: number,
  title: string,
  description: string,
  sections: [
    {
      id: string,
      title: string,
      questions: [
        {
          id: string,
          type: 'single_choice' | 'multi_choice' | 'short_text' | 'long_text' | 'numeric_range' | 'file_upload',
          title: string,
          required: boolean,
          options: string[],
          maxLength: number,
          min: number,
          max: number,
          conditional: { showQuestionId: string, showIfAnswer: number },
          acceptedTypes: string[]
        }
      ]
    }
  ],
  createdAt: Date,
  updatedAt: Date
}
```

## 🎯 Key Features Explained

### Virtualization
The candidates page uses React Window for efficient rendering of large lists. This allows smooth scrolling through 1000+ candidates without performance issues.

### Drag & Drop
- **Jobs**: Reorder job listings with optimistic updates
- **Candidates**: Move candidates between stages in Kanban board
- **Assessments**: Reorder sections and questions

### Real-time Updates
- Optimistic UI updates for immediate feedback
- Automatic rollback on API failures
- Loading states and error handling

### Form Validation
- Client-side validation using Yup schemas
- Real-time validation feedback
- Conditional field validation

### Responsive Design
- Mobile-first approach
- Responsive grid layouts
- Touch-friendly interactions

## 🔧 API Endpoints

The application uses MSW to simulate a REST API:

### Jobs
- `GET /api/jobs` - List jobs with filtering and pagination
- `POST /api/jobs` - Create new job
- `GET /api/jobs/:id` - Get job details
- `PATCH /api/jobs/:id` - Update job
- `PATCH /api/jobs/:id/reorder` - Reorder jobs
- `DELETE /api/jobs/:id` - Delete job

### Candidates
- `GET /api/candidates` - List candidates with filtering
- `POST /api/candidates` - Create new candidate
- `GET /api/candidates/:id` - Get candidate details
- `PATCH /api/candidates/:id` - Update candidate
- `GET /api/candidates/:id/timeline` - Get candidate timeline
- `POST /api/candidates/:id/notes` - Add candidate note
- `DELETE /api/candidates/:id` - Delete candidate

### Assessments
- `GET /api/assessments/:jobId` - Get assessment for job
- `PUT /api/assessments/:jobId` - Save assessment
- `POST /api/assessments/:jobId/submit` - Submit assessment response
- `GET /api/assessments/:jobId/responses` - Get assessment responses
- `DELETE /api/assessments/:jobId` - Delete assessment

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Deploy to Vercel/Netlify
1. Build the project
2. Deploy the `dist` folder
3. Configure environment variables if needed

## 🧪 Testing

The application includes comprehensive error handling and edge cases:

- Network failure simulation (7% error rate)
- Optimistic update rollbacks
- Form validation errors
- Loading states
- Empty states
- Error boundaries

## 📱 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🎉 Acknowledgments

- React team for the amazing framework
- Tailwind CSS for the utility-first approach
- Lucide for the beautiful icons
- MSW team for the excellent API mocking
- Dexie team for the IndexedDB wrapper

---

**TalentFlow** - Streamlining the hiring process with modern web technologies.