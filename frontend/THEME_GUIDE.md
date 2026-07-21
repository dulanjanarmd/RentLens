# Theme System - Light & Dark Mode

## Overview

The Smart Rental Platform now includes a fully functional light/dark mode system with the following features:

- **Automatic theme detection**: Respects user's system preferences on first visit
- **Manual theme toggle**: Users can switch between light and dark mode anytime
- **Persistent storage**: Theme preference is saved to localStorage
- **Smooth transitions**: Seamless theme switching across all components
- **Global coverage**: All UI elements automatically adapt to the selected theme

## How to Use

### For Users

1. **Toggle Theme**: Click the sun/moon icon in the top navigation bar (desktop or mobile)
2. **Automatic Save**: Your theme preference is automatically saved
3. **Persistent**: Your chosen theme will be remembered on your next visit

### For Developers

#### Using the Theme Hook

To access the current theme in any component:

```javascript
import { useTheme } from '@/hooks/useTheme'

export default function MyComponent() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button onClick={toggleTheme}>
      Current theme: {theme}
    </button>
  )
}
```

#### Theme Colors

All components automatically adapt to the theme via CSS custom properties defined in `globals.css`:

**Light Mode** (`:root`):
- Background: `#ffffff`
- Foreground: `#1a202c`
- Primary: `#2563eb`
- Secondary: `#f0f9ff`
- Accent: `#06b6d4`

**Dark Mode** (`.dark`):
- Background: `#0f172a`
- Foreground: `#f1f5f9`
- Primary: `#3b82f6`
- Secondary: `#1e3a8a`
- Accent: `#06b6d4`

## Architecture

### Files Structure

- `context/ThemeContext.jsx` - Theme provider and state management
- `hooks/useTheme.js` - Custom hook for accessing theme
- `components/ThemeToggle.jsx` - Theme toggle button component
- `app/layout.jsx` - Root layout with ThemeProvider wrapper
- `app/globals.css` - Color definitions for both themes

### How It Works

1. **ThemeProvider** wraps the entire application in `layout.jsx`
2. **ThemeContext** manages theme state and localStorage persistence
3. **ThemeToggle** button allows users to switch themes
4. **CSS custom properties** automatically apply based on `.dark` class on `<html>`
5. **Tailwind classes** (e.g., `dark:bg-slate-900`) provide theme-specific styles

### Theme Detection Logic

1. Check localStorage for saved theme
2. If not found, detect system preference using `prefers-color-scheme`
3. Apply selected theme to `<html>` element
4. Store preference in localStorage for future visits

## Customization

### Adding Theme-Aware Components

Most components automatically support theming through Tailwind's color tokens and the `dark:` prefix:

```jsx
<div className="bg-background text-foreground dark:bg-background dark:text-foreground">
  Light and dark mode compatible
</div>
```

Or use the theme hook for more complex logic:

```javascript
const { theme } = useTheme()

const bgColor = theme === 'dark' ? '#1e293b' : '#f8f9fa'
```

### Modifying Colors

Edit the CSS custom properties in `app/globals.css`:

```css
:root {
  --background: #ffffff;
  --primary: #2563eb;
  /* ... other colors ... */
}

.dark {
  --background: #0f172a;
  --primary: #3b82f6;
  /* ... other colors ... */
}
```

## Browser Compatibility

- Works in all modern browsers that support CSS custom properties
- Gracefully handles localStorage restrictions (e.g., private browsing)
- Server-side rendering compatible with Next.js

## Performance

- Theme preference stored in localStorage for instant access
- No flickering on page load due to `suppressHydrationWarning` in HTML tag
- Minimal performance impact - CSS variables are natively optimized

## Accessibility

- Theme toggle includes proper aria-labels
- Sufficient contrast ratios in both light and dark modes
- Keyboard navigation fully supported
- Respects user's system color scheme preference by default
