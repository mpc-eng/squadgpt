# 🎨 SquadGPT Design System & Styling Guide

## 📋 Overview

This guide provides comprehensive styling utilities and components for the SquadGPT application. All styles are built on top of Tailwind CSS with custom design tokens and component classes.

## 🎯 Design Principles

- **Consistency**: Unified color palette and spacing system
- **Accessibility**: Proper contrast ratios and focus states
- **Responsiveness**: Mobile-first approach with responsive utilities
- **Performance**: Optimized animations and transitions
- **Maintainability**: Reusable component classes and design tokens

## 🎨 Color System

### Base Colors
```css
/* Light Mode */
--background: 0 0% 100%
--foreground: 222.2 84% 4.9%
--primary: 221.2 83.2% 53.3%
--secondary: 210 40% 96%
--muted: 210 40% 96%
--accent: 210 40% 96%
--destructive: 0 84.2% 60.2%

/* Dark Mode */
--background: 222.2 84% 4.9%
--foreground: 210 40% 98%
--primary: 217.2 91.2% 59.8%
--secondary: 217.2 32.6% 17.5%
--muted: 217.2 32.6% 17.5%
--accent: 217.2 32.6% 17.5%
--destructive: 0 62.8% 30.6%
```

### SquadGPT Agent Colors
```css
--squad-business: 200 100% 50%    /* Blue */
--squad-product: 280 100% 60%     /* Purple */
--squad-technical: 120 100% 40%   /* Green */
--squad-scrum: 30 100% 50%        /* Orange */
```

### Status Colors
```css
--success: 142 76% 36%
--warning: 38 92% 50%
--info: 199 89% 48%
```

## 🧩 Component Classes

### Cards
```html
<!-- Basic Card -->
<div class="card p-6">
  <h3>Card Title</h3>
  <p>Card content</p>
</div>

<!-- Elevated Card -->
<div class="card-elevated p-6">
  <h3>Elevated Card</h3>
  <p>With enhanced shadow</p>
</div>

<!-- Interactive Card -->
<div class="card-interactive p-6">
  <h3>Interactive Card</h3>
  <p>Hover effects included</p>
</div>
```

### Buttons
```html
<!-- Primary Button -->
<button class="btn btn-primary">
  Primary Action
</button>

<!-- Secondary Button -->
<button class="btn btn-secondary">
  Secondary Action
</button>

<!-- Ghost Button -->
<button class="btn btn-ghost">
  Ghost Action
</button>

<!-- Size Variants -->
<button class="btn btn-primary btn-sm">Small</button>
<button class="btn btn-primary">Default</button>
<button class="btn btn-primary btn-lg">Large</button>

<!-- Icon Button -->
<button class="btn btn-primary btn-icon">
  <svg>...</svg>
</button>
```

### Inputs
```html
<!-- Basic Input -->
<input class="input" type="text" placeholder="Enter text..." />

<!-- Size Variants -->
<input class="input input-sm" type="text" placeholder="Small" />
<input class="input" type="text" placeholder="Default" />
<input class="input input-lg" type="text" placeholder="Large" />

<!-- Form Group -->
<div class="form-group">
  <label class="form-label">Email</label>
  <input class="input" type="email" />
  <p class="form-help">We'll never share your email.</p>
</div>
```

### Chat Bubbles
```html
<!-- User Message -->
<div class="chat-bubble chat-bubble-user">
  <p>Hello, how can you help me?</p>
</div>

<!-- Agent Message -->
<div class="chat-bubble chat-bubble-agent">
  <p>I'm here to help with your project!</p>
</div>
```

### Status Indicators
```html
<!-- Status Dots -->
<div class="status-dot status-dot-success"></div>
<div class="status-dot status-dot-warning"></div>
<div class="status-dot status-dot-error"></div>
<div class="status-dot status-dot-info"></div>

<!-- Status Badges -->
<span class="badge badge-success">Success</span>
<span class="badge badge-warning">Warning</span>
<span class="badge badge-error">Error</span>
<span class="badge badge-info">Info</span>
```

### Agent Avatars
```html
<!-- Agent Type Avatars -->
<div class="agent-avatar agent-avatar-business">BA</div>
<div class="agent-avatar agent-avatar-product">PM</div>
<div class="agent-avatar agent-avatar-technical">SA</div>
<div class="agent-avatar agent-avatar-scrum">SM</div>
```

## 🎭 Animation Classes

### Built-in Animations
```html
<!-- Fade In -->
<div class="animate-fade-in">Content</div>

<!-- Slide Up -->
<div class="animate-slide-up">Content</div>

<!-- Scale In -->
<div class="animate-scale-in">Content</div>

<!-- Custom Animations -->
<div class="animate-fade-in">Fade In</div>
<div class="animate-slide-up">Slide Up</div>
<div class="animate-scale-in">Scale In</div>
```

### Interactive States
```html
<!-- Hover Scale -->
<div class="scale-hover">Hover to scale</div>

<!-- Active Scale -->
<div class="scale-active">Click to scale</div>

<!-- Interactive -->
<div class="interactive">Hover and click effects</div>
```

## 📱 Layout Utilities

### Containers
```html
<!-- Narrow Container -->
<div class="container-narrow">
  <p>Content with max-width 4xl</p>
</div>

<!-- Wide Container -->
<div class="container-wide">
  <p>Content with max-width 7xl</p>
</div>
```

### Grids
```html
<!-- Auto-fit Grid -->
<div class="grid-auto-fit">
  <div class="card">Item 1</div>
  <div class="card">Item 2</div>
  <div class="card">Item 3</div>
</div>

<!-- Auto-fill Grid -->
<div class="grid-auto-fill">
  <div class="card">Item 1</div>
  <div class="card">Item 2</div>
  <div class="card">Item 3</div>
</div>
```

### Stage Progress
```html
<!-- Progress Bar -->
<div class="stage-progress">
  <div class="stage-progress-bar" style="width: 60%"></div>
</div>
```

## 🎨 Special Effects

### Gradients
```html
<!-- Gradient Text -->
<h1 class="gradient-text">Gradient Title</h1>

<!-- Gradient Background -->
<div class="bg-gradient-primary p-6">
  <h2>Primary Gradient</h2>
</div>

<div class="bg-gradient-secondary p-6">
  <h2>Secondary Gradient</h2>
</div>
```

### Glass Effects
```html
<!-- Light Glass -->
<div class="glass p-6">
  <h3>Glass Effect</h3>
</div>

<!-- Dark Glass -->
<div class="glass-dark p-6">
  <h3>Dark Glass Effect</h3>
</div>
```

### Shadows
```html
<!-- Soft Shadow -->
<div class="shadow-soft p-6">
  <p>Soft shadow effect</p>
</div>

<!-- Strong Shadow -->
<div class="shadow-strong p-6">
  <p>Strong shadow effect</p>
</div>
```

## 🔧 Utility Classes

### Text Utilities
```html
<!-- Text Balance -->
<p class="text-balance">Balanced text wrapping</p>

<!-- Text Pretty -->
<p class="text-pretty">Pretty text formatting</p>
```

### Loading States
```html
<!-- Loading Dots -->
<div class="loading-dots">
  <div></div>
  <div></div>
  <div></div>
</div>
```

### Scrollbar Styling
```html
<!-- Hide Scrollbar -->
<div class="scrollbar-hide overflow-auto">
  <p>Hidden scrollbar</p>
</div>

<!-- Thin Scrollbar -->
<div class="scrollbar-thin overflow-auto">
  <p>Thin scrollbar</p>
</div>
```

## 📐 Spacing System

### Custom Spacing
```css
spacing: {
  '18': '4.5rem',    /* 72px */
  '88': '22rem',     /* 352px */
  '128': '32rem',    /* 512px */
}
```

### Z-Index System
```css
zIndex: {
  'dropdown': 1000,
  'sticky': 1020,
  'fixed': 1030,
  'modal-backdrop': 1040,
  'modal': 1050,
  'popover': 1060,
  'tooltip': 1070,
  'toast': 1080,
}
```

## 🎯 Component-Specific Styling

### AppLayout
```html
<!-- Sticky Topbar -->
<header class="sticky top-0 z-sticky bg-background border-b border-border">
  <div class="container-wide flex items-center justify-between h-16">
    <h1 class="text-xl font-semibold">SquadGPT</h1>
    <ThemeToggle />
  </div>
</header>
```

### StageSidebar
```html
<!-- Sidebar Container -->
<aside class="w-64 bg-background border-r border-border sticky top-0 h-screen overflow-y-auto">
  <nav class="p-6 space-y-2">
    <!-- Stage Items -->
    <button class="flex items-center gap-3 p-4 rounded-lg cursor-pointer transition-all duration-150 ease-in-out hover:bg-accent hover:text-accent-foreground">
      <div class="status-dot status-dot-success"></div>
      <span class="text-base font-medium">Aperture</span>
    </button>
  </nav>
</aside>
```

### PRDEditorPanel
```html
<!-- Right Drawer -->
<div class="w-[400px] bg-card border-l border-border p-4 space-y-4 overflow-y-auto h-screen">
  <div class="sticky top-0 bg-card pb-4 border-b border-border">
    <h2 class="text-2xl font-semibold text-foreground">PRD Editor</h2>
  </div>
  
  <!-- Editable Sections -->
  <div class="space-y-6">
    <div class="space-y-3">
      <h3 class="text-lg font-medium text-foreground border-b border-border pb-2">Problem Statement</h3>
      <textarea class="w-full bg-muted p-3 rounded-md min-h-[100px] border border-input focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring bg-background text-foreground resize-none"></textarea>
    </div>
  </div>
</div>
```

### ChatInterface
```html
<!-- Chat Container -->
<div class="bg-card rounded-2xl shadow-md border h-[600px] flex flex-col">
  <!-- Messages -->
  <div class="flex-1 overflow-y-auto p-4 space-y-4">
    <!-- User Message -->
    <div class="flex items-start gap-3 flex-row-reverse">
      <div class="agent-avatar">U</div>
      <div class="chat-bubble chat-bubble-user">
        <p>User message</p>
      </div>
    </div>
    
    <!-- Agent Message -->
    <div class="flex items-start gap-3">
      <div class="agent-avatar agent-avatar-business">AI</div>
      <div class="chat-bubble chat-bubble-agent">
        <p>Agent response</p>
      </div>
    </div>
  </div>
</div>
```

### SquadJourneyMap
```html
<!-- Journey Map -->
<div class="bg-card border-b border-border">
  <div class="flex space-x-6 overflow-x-auto px-4 py-2 scrollbar-hide">
    <!-- Stage Pills -->
    <button class="rounded-full px-4 py-2 bg-primary text-primary-foreground text-sm font-medium transition-all duration-200 cursor-pointer">
      <div class="flex items-center gap-2">
        <div class="status-dot status-dot-success"></div>
        <span>Aperture</span>
      </div>
    </button>
  </div>
  
  <!-- Progress Bar -->
  <div class="px-4 pb-2">
    <div class="stage-progress">
      <div class="stage-progress-bar" style="width: 33%"></div>
    </div>
  </div>
</div>
```

## 🚀 Best Practices

### 1. Component Composition
- Use semantic HTML elements
- Combine utility classes with component classes
- Maintain consistent spacing with the design system

### 2. Responsive Design
- Use mobile-first approach
- Test on various screen sizes
- Utilize responsive utilities (sm:, md:, lg:, xl:)

### 3. Accessibility
- Ensure proper contrast ratios
- Use semantic HTML structure
- Include focus states for interactive elements
- Provide alternative text for images

### 4. Performance
- Use CSS custom properties for dynamic values
- Optimize animations with `transform` and `opacity`
- Minimize layout shifts with proper sizing

### 5. Dark Mode
- Test all components in both light and dark modes
- Use CSS custom properties for color values
- Ensure proper contrast in both themes

## 🔄 Migration Guide

### From Old Classes to New System
```html
<!-- Old -->
<div class="bg-white rounded-lg shadow-xl p-8">

<!-- New -->
<div class="card p-8">

<!-- Old -->
<button class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">

<!-- New -->
<button class="btn btn-primary">

<!-- Old -->
<input class="w-full px-3 py-2 border border-gray-300 rounded-md">

<!-- New -->
<input class="input">
```

This design system provides a comprehensive foundation for building consistent, accessible, and beautiful components across the SquadGPT application! 🎉 