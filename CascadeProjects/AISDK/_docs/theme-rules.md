# Theme Rules

Comprehensive color palette, typography, spacing, and visual styling guidelines for the AI Lab application, implementing technical minimalism with dark theme support.

---

## Color System

### **Primary Color Palette**
```css
:root {
  /* Base Colors */
  --background: 255 255 255;           /* Pure white background */
  --foreground: 15 23 42;              /* Slate-900 for primary text */
  --muted: 248 250 252;                /* Slate-50 for subtle backgrounds */
  --muted-foreground: 100 116 139;     /* Slate-500 for secondary text */
  --border: 226 232 240;               /* Slate-200 for borders */
  --input: 255 255 255;                /* White for input backgrounds */
  --ring: 59 130 246;                  /* Blue-500 for focus rings */

  /* UI Element Colors */
  --card: 255 255 255;                 /* White for cards */
  --card-foreground: 15 23 42;         /* Slate-900 for card text */
  --popover: 255 255 255;              /* White for popovers */
  --popover-foreground: 15 23 42;      /* Slate-900 for popover text */

  /* Interactive Colors */
  --primary: 15 23 42;                 /* Slate-900 for primary actions */
  --primary-foreground: 248 250 252;   /* Slate-50 for primary text */
  --secondary: 241 245 249;            /* Slate-100 for secondary actions */
  --secondary-foreground: 15 23 42;    /* Slate-900 for secondary text */
  --accent: 241 245 249;               /* Slate-100 for accents */
  --accent-foreground: 15 23 42;       /* Slate-900 for accent text */

  /* Status Colors */
  --destructive: 239 68 68;            /* Red-500 for errors */
  --destructive-foreground: 248 250 252; /* Slate-50 for error text */
  --success: 34 197 94;                /* Green-500 for success */
  --success-foreground: 255 255 255;   /* White for success text */
  --warning: 245 158 11;               /* Amber-500 for warnings */
  --warning-foreground: 255 255 255;   /* White for warning text */
  --info: 59 130 246;                  /* Blue-500 for info */
  --info-foreground: 255 255 255;      /* White for info text */
}
```

### **Dark Theme Palette**
```css
.dark {
  /* Base Colors */
  --background: 2 6 23;                /* Slate-950 background */
  --foreground: 248 250 252;           /* Slate-50 for primary text */
  --muted: 15 23 42;                   /* Slate-900 for subtle backgrounds */
  --muted-foreground: 148 163 184;     /* Slate-400 for secondary text */
  --border: 30 41 59;                  /* Slate-800 for borders */
  --input: 15 23 42;                   /* Slate-900 for input backgrounds */
  --ring: 59 130 246;                  /* Blue-500 for focus rings */

  /* UI Element Colors */
  --card: 15 23 42;                    /* Slate-900 for cards */
  --card-foreground: 248 250 252;      /* Slate-50 for card text */
  --popover: 15 23 42;                 /* Slate-900 for popovers */
  --popover-foreground: 248 250 252;   /* Slate-50 for popover text */

  /* Interactive Colors */
  --primary: 248 250 252;              /* Slate-50 for primary actions */
  --primary-foreground: 15 23 42;      /* Slate-900 for primary text */
  --secondary: 30 41 59;               /* Slate-800 for secondary actions */
  --secondary-foreground: 248 250 252; /* Slate-50 for secondary text */
  --accent: 30 41 59;                  /* Slate-800 for accents */
  --accent-foreground: 248 250 252;    /* Slate-50 for accent text */

  /* Status Colors - Same as light theme for consistency */
  --destructive: 239 68 68;            /* Red-500 for errors */
  --destructive-foreground: 248 250 252; /* Slate-50 for error text */
  --success: 34 197 94;                /* Green-500 for success */
  --success-foreground: 255 255 255;   /* White for success text */
  --warning: 245 158 11;               /* Amber-500 for warnings */
  --warning-foreground: 255 255 255;   /* White for warning text */
  --info: 59 130 246;                  /* Blue-500 for info */
  --info-foreground: 255 255 255;      /* White for info text */
}
```

### **Semantic Color Applications**

#### AI Mode Colors
```css
/* Mode-specific colors for visual differentiation */
.tools-mode {
  --mode-color: 59 130 246;            /* Blue-500 for Tools mode */
  --mode-bg: 219 234 254;              /* Blue-100 for Tools background */
}

.agents-mode {
  --mode-color: 147 51 234;            /* Purple-600 for Agents mode */
  --mode-bg: 233 213 255;              /* Purple-100 for Agents background */
}

.auto-mode {
  --mode-color: 34 197 94;             /* Green-500 for Auto mode */
  --mode-bg: 220 252 231;              /* Green-100 for Auto background */
}
```

#### Content Type Colors
```css
/* Different content types get distinct left borders */
.tool-result-card {
  border-left: 4px solid rgb(59 130 246);    /* Blue for tool results */
}

.citation-card {
  border-left: 4px solid rgb(245 158 11);    /* Amber for citations */
}

.image-result-card {
  border-left: 4px solid rgb(147 51 234);    /* Purple for images */
}

.agent-result-card {
  border-left: 4px solid rgb(34 197 94);     /* Green for agent results */
}

.error-card {
  border-left: 4px solid rgb(239 68 68);     /* Red for errors */
}
```

---

## Typography System

### **Font Stack**
```css
:root {
  /* Primary font for UI text */
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 
               'Roboto', 'Helvetica Neue', Arial, sans-serif;
  
  /* Monospace font for code and technical content */
  --font-mono: 'JetBrains Mono', 'Fira Code', 'Monaco', 'Cascadia Code', 
               'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace;
}

body {
  font-family: var(--font-sans);
  font-feature-settings: 'cv02', 'cv03', 'cv04', 'cv11';
}

.font-mono {
  font-family: var(--font-mono);
  font-feature-settings: 'liga' 0, 'calt' 0;
}
```

### **Typography Scale**
```css
/* Heading Sizes */
.text-4xl { font-size: 2.25rem; line-height: 2.5rem; }    /* 36px */
.text-3xl { font-size: 1.875rem; line-height: 2.25rem; }  /* 30px */
.text-2xl { font-size: 1.5rem; line-height: 2rem; }       /* 24px */
.text-xl { font-size: 1.25rem; line-height: 1.75rem; }    /* 20px */
.text-lg { font-size: 1.125rem; line-height: 1.75rem; }   /* 18px */

/* Body Sizes */
.text-base { font-size: 1rem; line-height: 1.5rem; }      /* 16px */
.text-sm { font-size: 0.875rem; line-height: 1.25rem; }   /* 14px */
.text-xs { font-size: 0.75rem; line-height: 1rem; }       /* 12px */

/* Font Weights */
.font-light { font-weight: 300; }
.font-normal { font-weight: 400; }
.font-medium { font-weight: 500; }
.font-semibold { font-weight: 600; }
.font-bold { font-weight: 700; }
```

### **Typography Usage Guidelines**
```typescript
// Chat message content
<div className="text-base leading-relaxed">
  {messageContent}
</div>

// Tool result titles
<h3 className="text-sm font-medium text-foreground">
  {toolName}
</h3>

// Technical metadata
<div className="text-xs font-mono text-muted-foreground">
  {technicalDetails}
</div>

// Developer view content
<pre className="text-xs font-mono bg-muted p-3 rounded-md overflow-x-auto">
  {debugInfo}
</pre>
```

---

## Spacing System

### **Spacing Scale (4px base unit)**
```css
/* Spacing values based on 4px increments */
.space-0 { margin: 0; }
.space-1 { margin: 0.25rem; }    /* 4px */
.space-2 { margin: 0.5rem; }     /* 8px */
.space-3 { margin: 0.75rem; }    /* 12px */
.space-4 { margin: 1rem; }       /* 16px */
.space-5 { margin: 1.25rem; }    /* 20px */
.space-6 { margin: 1.5rem; }     /* 24px */
.space-8 { margin: 2rem; }       /* 32px */
.space-10 { margin: 2.5rem; }    /* 40px */
.space-12 { margin: 3rem; }      /* 48px */
.space-16 { margin: 4rem; }      /* 64px */
.space-20 { margin: 5rem; }      /* 80px */
.space-24 { margin: 6rem; }      /* 96px */
```

### **Component Spacing Guidelines**
```css
/* Chat message spacing */
.chat-message {
  margin-bottom: 1rem;           /* 16px between messages */
  padding: 0.75rem 1rem;         /* 12px vertical, 16px horizontal */
}

/* Card spacing */
.card {
  padding: 1.5rem;               /* 24px internal padding */
  margin-bottom: 1rem;           /* 16px between cards */
}

/* Input areas */
.input-area {
  padding: 1rem;                 /* 16px around input */
  gap: 0.5rem;                   /* 8px between elements */
}

/* Panel spacing */
.panel {
  padding: 1.5rem;               /* 24px panel padding */
  gap: 1rem;                     /* 16px between panel sections */
}
```

---

## Border and Shadow System

### **Border Radius**
```css
.rounded-none { border-radius: 0; }
.rounded-sm { border-radius: 0.125rem; }    /* 2px */
.rounded { border-radius: 0.25rem; }        /* 4px */
.rounded-md { border-radius: 0.375rem; }    /* 6px */
.rounded-lg { border-radius: 0.5rem; }      /* 8px */
.rounded-xl { border-radius: 0.75rem; }     /* 12px */
.rounded-2xl { border-radius: 1rem; }       /* 16px */
.rounded-full { border-radius: 9999px; }
```

### **Shadow System**
```css
/* Subtle shadows for technical minimalism */
.shadow-sm { 
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

.shadow { 
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 
              0 1px 2px 0 rgba(0, 0, 0, 0.06);
}

.shadow-md { 
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 
              0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.shadow-lg { 
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 
              0 4px 6px -2px rgba(0, 0, 0, 0.05);
}
```

### **Border Usage**
```css
/* Standard borders */
.border { border: 1px solid rgb(var(--border)); }
.border-t { border-top: 1px solid rgb(var(--border)); }
.border-r { border-right: 1px solid rgb(var(--border)); }
.border-b { border-bottom: 1px solid rgb(var(--border)); }
.border-l { border-left: 1px solid rgb(var(--border)); }

/* Accent borders for content types */
.border-l-4 { border-left: 4px solid; }
```

---

## Animation and Transitions

### **Animation Timing**
```css
:root {
  --duration-fast: 150ms;        /* Quick interactions */
  --duration-normal: 250ms;      /* Standard transitions */
  --duration-slow: 350ms;        /* Complex animations */
  
  --easing-ease-out: cubic-bezier(0, 0, 0.2, 1);
  --easing-ease-in: cubic-bezier(0.4, 0, 1, 1);
  --easing-ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
}
```

### **Common Transitions**
```css
/* Hover transitions */
.transition-colors {
  transition: color var(--duration-fast) var(--easing-ease-out),
              background-color var(--duration-fast) var(--easing-ease-out),
              border-color var(--duration-fast) var(--easing-ease-out);
}

/* Layout transitions */
.transition-all {
  transition: all var(--duration-normal) var(--easing-ease-in-out);
}

/* Transform transitions */
.transition-transform {
  transition: transform var(--duration-normal) var(--easing-ease-out);
}
```

### **Loading Animations**
```css
/* Typing indicator */
@keyframes bounce {
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1); }
}

.animate-bounce {
  animation: bounce 1.4s infinite ease-in-out both;
}

/* Pulse for loading states */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Streaming text cursor */
@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}

.animate-blink {
  animation: blink 1s step-end infinite;
}
```

---

## Component Theming

### **Button Variants**
```css
/* Primary button */
.btn-primary {
  background-color: rgb(var(--primary));
  color: rgb(var(--primary-foreground));
  border: 1px solid rgb(var(--primary));
}

.btn-primary:hover {
  background-color: rgb(var(--primary) / 0.9);
}

/* Secondary button */
.btn-secondary {
  background-color: rgb(var(--secondary));
  color: rgb(var(--secondary-foreground));
  border: 1px solid rgb(var(--border));
}

.btn-secondary:hover {
  background-color: rgb(var(--accent));
}

/* Ghost button */
.btn-ghost {
  background-color: transparent;
  color: rgb(var(--foreground));
}

.btn-ghost:hover {
  background-color: rgb(var(--accent));
}
```

### **Input Styling**
```css
.input {
  background-color: rgb(var(--input));
  border: 1px solid rgb(var(--border));
  color: rgb(var(--foreground));
  border-radius: 0.375rem;
  padding: 0.5rem 0.75rem;
  transition: border-color var(--duration-fast) var(--easing-ease-out);
}

.input:focus {
  outline: none;
  border-color: rgb(var(--ring));
  box-shadow: 0 0 0 2px rgb(var(--ring) / 0.2);
}

.input::placeholder {
  color: rgb(var(--muted-foreground));
}
```

### **Card Styling**
```css
.card {
  background-color: rgb(var(--card));
  color: rgb(var(--card-foreground));
  border: 1px solid rgb(var(--border));
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
}

.card-header {
  padding: 1.5rem 1.5rem 0;
}

.card-content {
  padding: 1.5rem;
}

.card-footer {
  padding: 0 1.5rem 1.5rem;
}
```

---

## Responsive Design Tokens

### **Breakpoint Variables**
```css
:root {
  --breakpoint-sm: 640px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 1024px;
  --breakpoint-xl: 1280px;
  --breakpoint-2xl: 1536px;
}
```

### **Container Sizes**
```css
.container {
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  padding-left: 1rem;
  padding-right: 1rem;
}

@media (min-width: 640px) {
  .container { max-width: 640px; }
}

@media (min-width: 768px) {
  .container { 
    max-width: 768px;
    padding-left: 1.5rem;
    padding-right: 1.5rem;
  }
}

@media (min-width: 1024px) {
  .container { 
    max-width: 1024px;
    padding-left: 2rem;
    padding-right: 2rem;
  }
}

@media (min-width: 1280px) {
  .container { max-width: 1280px; }
}

@media (min-width: 1536px) {
  .container { max-width: 1536px; }
}
```

---

## Theme Implementation

### **CSS Custom Properties Setup**
```css
/* globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    /* Light theme variables */
    --background: 255 255 255;
    --foreground: 15 23 42;
    /* ... all other light theme variables */
  }

  .dark {
    /* Dark theme variables */
    --background: 2 6 23;
    --foreground: 248 250 252;
    /* ... all other dark theme variables */
  }

  * {
    @apply border-border;
  }

  body {
    @apply bg-background text-foreground;
    font-feature-settings: "rlig" 1, "calt" 1;
  }
}
```

### **Tailwind Configuration**
```javascript
// tailwind.config.js
module.exports = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        border: 'rgb(var(--border))',
        input: 'rgb(var(--input))',
        ring: 'rgb(var(--ring))',
        background: 'rgb(var(--background))',
        foreground: 'rgb(var(--foreground))',
        primary: {
          DEFAULT: 'rgb(var(--primary))',
          foreground: 'rgb(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'rgb(var(--secondary))',
          foreground: 'rgb(var(--secondary-foreground))',
        },
        // ... rest of color definitions
      },
      fontFamily: {
        sans: ['var(--font-sans)'],
        mono: ['var(--font-mono)'],
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
```

### **Theme Toggle Implementation**
```typescript
// theme-provider.tsx
'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'dark' | 'light' | 'system'

const ThemeProviderContext = createContext<{
  theme: Theme
  setTheme: (theme: Theme) => void
}>({
  theme: 'system',
  setTheme: () => null,
})

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('system')

  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove('light', 'dark')

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
        .matches ? 'dark' : 'light'
      root.classList.add(systemTheme)
    } else {
      root.classList.add(theme)
    }
  }, [theme])

  return (
    <ThemeProviderContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeProviderContext)
```

This comprehensive theme system ensures visual consistency across all components while supporting both light and dark modes with smooth transitions and proper accessibility considerations.
