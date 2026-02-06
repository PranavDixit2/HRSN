# Patient Mobile Screening App

A mobile-first PWA for AHC HRSN (Accountable Health Communities Health-Related Social Needs) screening designed to achieve 85%+ completion rates through strict completeness enforcement and optimized UX.

## Features

- **Token-Based Access**: Unique URL per patient (`/s/{token}`)
- **10 Required Questions**: AHC HRSN screening questions with privacy protection
- **Multi-Language Support**: English, Spanish, Chinese (Simplified), Russian, Bengali
- **Autosave**: Automatic saving after every answer with localStorage backup
- **Resume Capability**: Continue where you left off if page is refreshed
- **100% Completeness Enforcement**: Submit button disabled until all required fields are complete
- **Mobile-First Design**: Optimized for touch with 44px minimum tap targets
- **PWA Support**: Installable on mobile devices with offline asset caching
- **WCAG 2.1 AA Accessible**: Screen reader support, keyboard navigation, high contrast

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **Forms**: React Hook Form + Zod
- **i18n**: i18next + react-i18next
- **API**: Axios
- **PWA**: vite-plugin-pwa
- **Build Tool**: Vite

## Project Structure

```
patient-screening-app/
├── public/
│   └── icons/              # PWA icons (192x192, 512x512) - NEEDS TO BE ADDED
├── src/
│   ├── api/
│   │   └── screening.ts    # API client with retry logic
│   ├── components/
│   │   ├── ConfirmationScreen.tsx
│   │   ├── DemographicsForm.tsx
│   │   ├── ErrorScreen.tsx
│   │   ├── LanguageSelector.tsx
│   │   ├── LoadingState.tsx
│   │   ├── NavigationButtons.tsx
│   │   ├── PrivacyInterstitial.tsx
│   │   ├── ProgressIndicator.tsx
│   │   ├── QuestionCard.tsx
│   │   └── ReviewSummary.tsx
│   ├── contexts/
│   │   └── ScreeningContext.tsx
│   ├── locales/
│   │   ├── en.json
│   │   ├── es.json
│   │   ├── zh.json
│   │   ├── ru.json
│   │   └── bn.json
│   ├── pages/
│   │   ├── DemographicsPage.tsx
│   │   ├── QuestionPage.tsx
│   │   ├── ReviewPage.tsx
│   │   └── ScreeningPage.tsx
│   ├── types/
│   │   └── screening.ts
│   ├── utils/
│   │   ├── localStorage.ts
│   │   └── validation.ts
│   ├── App.tsx
│   ├── i18n.ts
│   ├── main.tsx
│   └── index.css
├── .env
├── .env.example
├── package.json
├── tailwind.config.js
├── vite.config.ts
└── README.md
```

## Environment Setup

1. **Clone the repository**

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and set your API base URL:
   ```
   VITE_API_BASE_URL=https://your-backend-api.com
   ```

4. **Add PWA Icons** (REQUIRED):
   Create two icon files in `public/icons/`:
   - `icon-192x192.png` (192x192 pixels)
   - `icon-512x512.png` (512x512 pixels)
   
   These should be simple, professional medical/health icons with your branding.

## Development

Start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Testing Locally

Since the app requires a token URL (`/s/{token}`), you'll need to either:

1. **Use a mock token**: Temporarily modify the API client to return mock data
2. **Connect to your backend**: Set `VITE_API_BASE_URL` to your backend API
3. **Create a demo route**: See the Demo Route section below

## Backend API Requirements

The app expects the following endpoints:

### GET /public/screening/{token}

Returns screening state and clinic information.

**Response**:
```json
{
  "clinic_info": {
    "clinic_name": "Example Clinic",
    "clinic_logo_url": "https://...",
    "patient_first_name": "John",
    "language_preference": "en"
  },
  "screening_state": {
    "status": "not_started" | "in_progress" | "complete" | "declined" | "expired",
    "answers": {
      "q1": "yes" | "no" | null,
      "q2": "yes" | "no" | null,
      ...
      "q9": "yes" | "no" | "prefer_not_to_answer" | null
    },
    "demographics": {
      "dob": "MM/DD/YYYY" | null,
      "race": "..." | null,
      "ethnicity": "hispanic" | "not_hispanic" | null,
      "preferred_language": "en" | null,
      "zip": "12345" | null
    },
    "token_expires_at": "2024-03-15T12:00:00Z"
  }
}
```

### PATCH /public/screening/{token}

Autosave partial answers.

**Request**:
```json
{
  "answers": { "q1": "yes" },
  "demographics": { "zip": "12345" }
}
```

### POST /public/screening/{token}/submit

Final submission.

**Response**:
```json
{
  "success": true,
  "missing_fields": [],
  "message": "Screening submitted successfully"
}
```

## Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## Deployment to Vercel

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel
   ```

4. **Set environment variables** in Vercel dashboard:
   - `VITE_API_BASE_URL`: Your production API URL

5. **Deploy to production**:
   ```bash
   vercel --prod
   ```

### Vercel Configuration

The app works out of the box with Vercel. For custom domains and environment variables, use the Vercel dashboard.

## Translation Review

> **IMPORTANT**: The Spanish, Chinese, Russian, and Bengali translations are AI-generated placeholders. Before production use, these MUST be reviewed by professional medical translators to ensure:
> - Medical terminology accuracy
> - Cultural appropriateness
> - Clarity for patients with limited health literacy

## Accessibility

The app meets WCAG 2.1 AA standards:

- ✅ Minimum 4.5:1 color contrast
- ✅ 44px minimum tap targets
- ✅ Screen reader support (ARIA labels)
- ✅ Keyboard navigation
- ✅ Focus indicators
- ✅ Semantic HTML

## Browser Support

- **Mobile**: iOS Safari 15+, Android Chrome 90+
- **Desktop**: Chrome, Firefox, Safari, Edge (latest 2 versions)

## License

[Your License Here]

## Support

For issues or questions, contact [your-support-email@example.com]
