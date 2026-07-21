# Quick Start: Light & Dark Mode

## For Users

### How to Use Theme Toggle

1. **Desktop View**
   - Look for the sun/moon icon in the top-right corner of the navigation bar
   - Click to instantly switch between light and dark mode
   - Your preference is automatically saved

2. **Mobile View**
   - Open the mobile menu (hamburger icon)
   - Scroll to the bottom of the menu
   - You'll see "Theme" with a sun/moon toggle
   - Click to switch themes
   - Your preference is automatically saved

### What Changes
When you switch themes:
- **Background**: Changes from white to dark blue/navy
- **Text**: Changes from dark to light for readability
- **Cards**: Adapt to match the theme
- **Buttons**: Colors adjust for visibility
- **Charts**: Colors remain vibrant in both modes
- **Icons**: Adapt to the current theme

### First Visit
- The app automatically detects your system theme preference
- If you have dark mode enabled in your OS settings, the app will start in dark mode
- You can override this anytime by clicking the theme toggle

---

## For Developers

### Adding Theme Support to Components

#### Method 1: Using CSS Variables (Recommended)

```jsx
export default function MyComponent() {
  return (
    <div className="bg-background text-foreground border border-border">
      This automatically adapts to theme changes
    </div>
  )
}
```

**Available CSS Variables:**
- `bg-background` / `text-foreground` - Main colors
- `bg-card` / `text-card-foreground` - Card colors
- `bg-primary` / `text-primary-foreground` - Primary action colors
- `border-border` - Borders
- `bg-muted` / `text-muted-foreground` - Secondary text
- And 40+ more in `globals.css`

#### Method 2: Using the Theme Hook

```jsx
import { useTheme } from '@/hooks/useTheme'

export default function MyComponent() {
  const { theme, toggleTheme } = useTheme()

  return (
    <div>
      <p>Current theme: {theme}</p>
      <button onClick={toggleTheme}>Toggle Theme</button>
      
      {theme === 'dark' && <p>Dark mode is active!</p>}
      {theme === 'light' && <p>Light mode is active!</p>}
    </div>
  )
}
```

#### Method 3: Conditional Styling with Tailwind

```jsx
export default function MyComponent() {
  return (
    <div className="bg-white dark:bg-slate-900 text-black dark:text-white">
      This uses Tailwind's dark: prefix for theme-specific styles
    </div>
  )
}
```

### Component Examples

#### Example 1: Simple Card
```jsx
export default function Card() {
  return (
    <div className="bg-card text-card-foreground border border-border rounded-lg p-4">
      <h3 className="text-lg font-semibold">Card Title</h3>
      <p className="text-muted-foreground">Card description</p>
    </div>
  )
}
```

#### Example 2: Button with Theme
```jsx
export default function Button() {
  return (
    <button className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-lg transition-colors">
      Click me
    </button>
  )
}
```

#### Example 3: Theme-Aware Chart
```jsx
import { useTheme } from '@/hooks/useTheme'

export default function Chart() {
  const { theme } = useTheme()
  
  const chartColor = theme === 'dark' ? '#60a5fa' : '#2563eb'
  
  return (
    <div className="bg-card p-4 rounded-lg">
      {/* Use chartColor for your chart */}
    </div>
  )
}
```

### File Structure
```
/app
  /layout.jsx          (ThemeProvider wrapper)
  /globals.css         (Color definitions)
/context
  /ThemeContext.jsx    (Theme state management)
/hooks
  /useTheme.js         (Custom hook)
/components
  /ThemeToggle.jsx     (Toggle button)
```

### Testing Themes

#### Manual Testing
1. Click the theme toggle button
2. Verify all colors change appropriately
3. Refresh the page - theme persists
4. Check mobile and desktop views

#### Checking localStorage
```javascript
// In browser console:
localStorage.getItem('theme')  // Returns 'light' or 'dark'
```

#### Checking Theme Class
```javascript
// In browser console:
document.documentElement.classList  // Should contain 'dark' in dark mode
```

---

## Available Color Variables

### Background Colors
- `--background` - Main background
- `--card` - Card/component background
- `--popover` - Popover background
- `--input` - Input field background

### Text Colors
- `--foreground` - Main text
- `--card-foreground` - Card text
- `--popover-foreground` - Popover text
- `--muted-foreground` - Secondary text

### Action Colors
- `--primary` - Primary buttons/links
- `--primary-foreground` - Primary text
- `--secondary` - Secondary elements
- `--secondary-foreground` - Secondary text
- `--accent` - Accent elements
- `--accent-foreground` - Accent text

### System Colors
- `--destructive` - Error/delete actions
- `--border` - Borders
- `--input` - Input borders
- `--ring` - Focus rings
- `--muted` - Disabled states

### Chart Colors
- `--chart-1` through `--chart-5` - Data visualization colors

---

## Troubleshooting

### Theme Not Persisting
- Check if localStorage is enabled in browser
- Clear browser cache and try again
- Check console for errors

### Flickering on Page Load
- Ensure `suppressHydrationWarning` is in layout.jsx `<html>` tag
- Check that ThemeProvider wraps the entire app

### Colors Look Wrong
- Verify CSS custom properties are defined in `globals.css`
- Check that Tailwind is properly configured
- Clear Next.js cache: `rm -rf .next && npm run dev`

### Hook Not Working
- Ensure component using `useTheme` has `'use client'` directive
- Verify component is within `ThemeProvider` (via layout)

---

## Performance Tips

1. **Use CSS Variables**: Let CSS handle theme switching - it's instant
2. **Avoid useTheme in Large Trees**: Use CSS classes when possible
3. **Memoize Theme Values**: If computing theme-dependent values
4. **Lazy Load Theme Logic**: Theme switch doesn't need immediate re-render

---

## Future Ideas

- [ ] Add system preference auto-detection
- [ ] Create multiple theme presets (ocean, forest, cyberpunk)
- [ ] Add theme customizer in settings
- [ ] Time-based auto theme switching
- [ ] Per-page theme overrides
- [ ] Animation preferences for theme switch
