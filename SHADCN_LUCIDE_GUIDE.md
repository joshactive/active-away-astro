# shadcn/ui & Lucide Icons Guide

This project now uses **shadcn/ui** components and **Lucide React** icons for a consistent, modern UI.

## 📦 Installed Packages

- `@astrojs/react` - React integration for Astro
- `react` & `react-dom` - React framework
- `lucide-react` - Beautiful, consistent icons
- `class-variance-authority` - Component variant management
- `clsx` & `tailwind-merge` - Utility class management
- `@radix-ui/react-slot` - Component composition

## 🎨 Using shadcn/ui Components

### Button Component

The Button component is available in `src/components/ui/button.tsx` with multiple variants:

```astro
---
import { Button } from '../components/ui/button';
---

<!-- Default variant (dark gray) -->
<Button client:load>Click Me</Button>

<!-- Gold variant -->
<Button variant="gold" client:load>Book Now</Button>

<!-- Outline variant -->
<Button variant="outline" client:load>Login</Button>

<!-- Ghost variant -->
<Button variant="ghost" client:load>Cancel</Button>

<!-- Different sizes -->
<Button size="sm" client:load>Small</Button>
<Button size="lg" client:load>Large</Button>
```

**Important:** Always add `client:load` to React components in Astro files to enable interactivity!

## 🎯 Using Lucide Icons

### Basic Usage

```astro
---
import { Menu, X, Search, Star, ArrowRight } from 'lucide-react';
---

<!-- Use icons as React components -->
<Menu client:load className="w-6 h-6 text-white" />
<Search client:load className="w-4 h-4 text-gray-600" />
<Star client:load className="w-5 h-5 text-gold" fill="currentColor" />
```

### Available Icon Helpers

We've created convenient icon wrappers in `src/components/ui/MobileMenuButton.tsx`:

- `SearchIcon` - Search/magnifying glass
- `StarIcon` - Star rating icon (with fill)
- `ChevronDownIcon` - Dropdown arrow
- `ArrowUpRightIcon` - External link arrow
- `MobileMenuButton` - Mobile menu icon button
- `CloseButton` - Close/X button

### Browse All Icons

Visit [lucide.dev](https://lucide.dev/icons) to browse 1000+ beautiful icons!

## 🔧 Creating New shadcn/ui Components

1. Create component in `src/components/ui/`
2. Use `cn()` utility from `src/lib/utils.ts` for class merging
3. Use `cva` for variant management
4. Follow shadcn/ui patterns

Example structure:
```tsx
import { cn } from "../../lib/utils"
import { cva, type VariantProps } from "class-variance-authority"

const componentVariants = cva(
  "base-classes",
  {
    variants: {
      variant: {
        default: "default-classes",
        gold: "gold-classes"
      }
    }
  }
)

export function Component({ className, variant }: Props) {
  return (
    <div className={cn(componentVariants({ variant }), className)}>
      Content
    </div>
  )
}
```

## 🎨 Custom Gold Color

The gold color (`#ad986c`) is configured in `tailwind.config.js`:

- `gold` or `gold-400`: #ad986c (primary)
- `gold-50` through `gold-900`: Full palette
- Use `bg-gold`, `text-gold`, `border-gold`, etc.

## 📝 Best Practices

1. **Always use `client:load`** for React components in Astro
2. Use Lucide icons for consistency
3. Use Button component instead of custom button styles
4. Leverage the `cn()` utility for dynamic classes
5. Follow shadcn/ui component patterns for new components

## 🔗 Resources

- [shadcn/ui Documentation](https://ui.shadcn.com/)
- [Lucide Icons](https://lucide.dev/)
- [Astro React Integration](https://docs.astro.build/en/guides/integrations-guide/react/)
- [Tailwind CSS](https://tailwindcss.com/)

