# Holidaze

A modern booking platform for venues, built with React, TypeScript, and Vite.

This is the final exam for the Frontend Development course at Noroff.

## Live Demo

[https://holidaze-ms.netlify.app/](https://holidaze-ms.netlify.app/)

## Features

- User authentication (register, login, logout)
- Profile management
- Venue creation and management
- Booking system with availability calendar
- Responsive design
- Modern UI with reusable components

## Getting Started

### Prerequisites

- Node.js (v18 or later recommended)
- npm

### Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/your-username/Holidaze.git
   cd Holidaze
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the development server:
   ```sh
   npm run dev
   ```
4. Open [http://localhost:5173](http://localhost:5173) in your browser.

## API Documentation

- [Holidaze API Swagger Docs (Profiles, Bookings, Venues)](https://v2.api.noroff.dev/docs/static/index.html#/holidaze-profiles)
- [Noroff Holidaze Venues API Reference](https://docs.noroff.dev/docs/v2/holidaze/venues)

## Folder Structure

```
Holidaze/
├── public/                # Static assets
├── src/
│   ├── api/               # API service files
│   ├── assets/            # Images and static assets
│   ├── components/        # Reusable UI and page components
│   ├── context/           # React context providers
│   ├── hooks/             # Custom React hooks
│   ├── pages/             # Route components
│   ├── types/             # TypeScript type definitions
│   └── utils/             # Utility functions
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## Technologies Used

- React
- TypeScript
- Vite
- Tailwind CSS

## Design Decisions and Reflections

### API Limitations

- **Advanced filtering removed:** The API did not support complex filters efficiently, so UI was simplified for performance and clarity.

### Design Focus

- Mobile-first development
- Dark mode and light mode
  - Color palettes inspired by color theory and main image colors
  - Focus on complementary colors and tonal variations
- Responsive layouts
- CSS colocated
- Component-driven structure
  - Reusable React components
  - Reusable button system
  - Reusable form fields
  - Reusable modal system
  - Toast provider system
  - Shared utilities
- Dirty form blocker
- Route protection/auth structure
- Semantic HTML & accessibility
- Scroll restoration solution
- Search & sorting

### Accessibility

Accessibility is a priority throughout the app:

- Semantic HTML elements for structure and meaning
- ARIA labels for screen readers
- Keyboard accessibility for all interactive elements
- Focus management for modals and navigation
- Accessible modal dialogs
- Clear, readable validation messages
- Improved color contrast for readability

### UX elements to enhance user experience

- Booking preview before submission
- Interactive calendar for booking availability
- Unsaved changes protection
- Toast notifications for feedback
- Modal confirmations for destructive actions
- Skeleton loading states for less layout shifts
- Scroll restoration between navigations
- Redirecting back after login
- Dynamic CTA buttons based on context
- Placeholder and fallback images
- Responsive gallery and lightbox for venues

### Challenges / Lessons Learned

- Navigating API limitations and adjusting features accordingly
- Handling dark/light mode
- Full-page backgrounds
- Gallery and image layouts created responsiveness challenges
- Tradeoffs in reusable component abstractions
- Button abstraction and prop management
- State synchronization across forms and routes
- Routing and navigation edge cases
- Validation and error handling complexities
- Case-sensitive import issues in cross-platform development

### Areas for Improvement

- Light mode still has refinement potential
- More consistent global styling could have been implemented earlier
- Tailwind structure and reusable styling could be improved
- Stronger naming conventions and folder organization could improve scalability

## Credits

Holidaze was designed and coded by Malin Skrettingland.

<p align="center">
  <img src="../Holidaze/src/assets/Cartoon-style-portrait-01.5.png" alt="Cartoon-style portrait" width="400">
</p>
