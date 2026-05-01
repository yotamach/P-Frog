module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './index.html',
  ],
  theme: {
    extend: {
      colors: {
        // Primary colors
        primary: 'hsl(var(--color-primary) / <alpha-value>)',
        'primary-foreground': 'hsl(var(--color-primary-foreground) / <alpha-value>)',
        secondary: 'hsl(var(--color-secondary) / <alpha-value>)',
        'secondary-foreground': 'hsl(var(--color-secondary-foreground) / <alpha-value>)',
        accent: 'hsl(var(--color-accent) / <alpha-value>)',
        'accent-foreground': 'hsl(var(--color-accent-foreground) / <alpha-value>)',

        // Background & surface
        background: 'hsl(var(--color-background) / <alpha-value>)',
        foreground: 'hsl(var(--color-foreground) / <alpha-value>)',
        card: 'hsl(var(--color-card) / <alpha-value>)',
        'card-foreground': 'hsl(var(--color-card-foreground) / <alpha-value>)',
        popover: 'hsl(var(--color-popover) / <alpha-value>)',
        'popover-foreground': 'hsl(var(--color-popover-foreground) / <alpha-value>)',
        surface: 'hsl(var(--color-surface) / <alpha-value>)',
        'surface-warm': 'hsl(var(--color-surface-warm) / <alpha-value>)',
        'surface-raised': 'hsl(var(--color-surface-raised) / <alpha-value>)',

        // Text colors
        'text-primary': 'hsl(var(--color-text-primary) / <alpha-value>)',
        'text-secondary': 'hsl(var(--color-text-secondary) / <alpha-value>)',
        'text-muted': 'hsl(var(--color-text-muted) / <alpha-value>)',

        // Semantic text
        muted: 'hsl(var(--color-muted) / <alpha-value>)',
        'muted-foreground': 'hsl(var(--color-muted-foreground) / <alpha-value>)',

        // Destructive
        destructive: 'hsl(var(--color-destructive) / <alpha-value>)',
        'destructive-foreground': 'hsl(var(--color-destructive-foreground) / <alpha-value>)',

        // Border & input
        border: 'hsl(var(--color-border) / <alpha-value>)',
        input: 'hsl(var(--color-input) / <alpha-value>)',
        ring: 'hsl(var(--color-ring) / <alpha-value>)',

        // Button colors
        'button-primary': 'hsl(var(--color-button-primary) / <alpha-value>)',
        'button-primary-foreground': 'hsl(var(--color-button-primary-foreground) / <alpha-value>)',
        'button-primary-hover': 'hsl(var(--color-button-primary-hover) / <alpha-value>)',
        'button-secondary': 'hsl(var(--color-button-secondary) / <alpha-value>)',
        'button-secondary-foreground': 'hsl(var(--color-button-secondary-foreground) / <alpha-value>)',
        'button-secondary-hover': 'hsl(var(--color-button-secondary-hover) / <alpha-value>)',
        'button-destructive': 'hsl(var(--color-button-destructive) / <alpha-value>)',
        'button-destructive-foreground': 'hsl(var(--color-button-destructive-foreground) / <alpha-value>)',
        'button-destructive-hover': 'hsl(var(--color-button-destructive-hover) / <alpha-value>)',
        'button-outline': 'hsl(var(--color-button-outline) / <alpha-value>)',
        'button-outline-foreground': 'hsl(var(--color-button-outline-foreground) / <alpha-value>)',
        'button-outline-border': 'hsl(var(--color-button-outline-border) / <alpha-value>)',
        'button-outline-hover': 'hsl(var(--color-button-outline-hover) / <alpha-value>)',
        'button-ghost-foreground': 'hsl(var(--color-button-ghost-foreground) / <alpha-value>)',
        'button-ghost-hover': 'hsl(var(--color-button-ghost-hover) / <alpha-value>)',
        'button-link': 'hsl(var(--color-button-link) / <alpha-value>)',
        'button-link-hover': 'hsl(var(--color-button-link-hover) / <alpha-value>)',
        'button-create': 'hsl(var(--color-button-create) / <alpha-value>)',
        'button-edit': 'hsl(var(--color-button-edit) / <alpha-value>)',
        'button-delete': 'hsl(var(--color-button-delete) / <alpha-value>)',
        'button-disabled': 'hsl(var(--color-button-disabled) / <alpha-value>)',

        // Table colors
        'table-text': 'hsl(var(--color-table-text) / <alpha-value>)',
        'table-text-muted': 'hsl(var(--color-table-text-muted) / <alpha-value>)',
        'table-border': 'hsl(var(--color-table-border) / <alpha-value>)',
        'table-hover': 'hsl(var(--color-table-hover) / <alpha-value>)',
        'table-selected': 'hsl(var(--color-table-selected) / <alpha-value>)',
        'table-header-bg': 'hsl(var(--color-table-header-bg) / <alpha-value>)',

        // Drawer colors
        'drawer-bg': 'hsl(var(--color-drawer-bg) / <alpha-value>)',
        'drawer-border': 'hsl(var(--color-drawer-border) / <alpha-value>)',
        'drawer-foreground': 'hsl(var(--color-drawer-foreground) / <alpha-value>)',
        'drawer-title': 'hsl(var(--color-drawer-title) / <alpha-value>)',
        'drawer-description': 'hsl(var(--color-drawer-description) / <alpha-value>)',
        'drawer-overlay': 'var(--color-drawer-overlay)',

        // Sidebar colors
        'sidebar-bg': 'hsl(var(--color-sidebar-bg) / <alpha-value>)',
        'sidebar-border': 'hsl(var(--color-sidebar-border) / <alpha-value>)',
        'sidebar-text': 'hsl(var(--color-sidebar-text) / <alpha-value>)',
        'sidebar-hover': 'hsl(var(--color-sidebar-hover) / <alpha-value>)',
        'sidebar-active': 'hsl(var(--color-sidebar-active) / <alpha-value>)',

        // Rail colors
        'rail-bg': 'hsl(var(--color-rail-bg) / <alpha-value>)',
        'rail-text': 'hsl(var(--color-rail-text) / <alpha-value>)',
        'rail-active': 'hsl(var(--color-rail-active) / <alpha-value>)',
        'rail-hover': 'hsl(var(--color-rail-hover) / <alpha-value>)',

        // Header colors
        'header-bg': 'hsl(var(--color-header-bg) / <alpha-value>)',
        'header-bg-end': 'hsl(var(--color-header-bg-end) / <alpha-value>)',
        'footer-bg': 'hsl(var(--color-footer-bg) / <alpha-value>)',

        // Status colors
        success: 'hsl(var(--color-success) / <alpha-value>)',
        'success-bg': 'hsl(var(--color-success-bg) / <alpha-value>)',
        warning: 'hsl(var(--color-warning) / <alpha-value>)',
        'warning-bg': 'hsl(var(--color-warning-bg) / <alpha-value>)',
        error: 'hsl(var(--color-error) / <alpha-value>)',
        'error-bg': 'hsl(var(--color-error-bg) / <alpha-value>)',
        info: 'hsl(var(--color-info) / <alpha-value>)',
        'info-bg': 'hsl(var(--color-info-bg) / <alpha-value>)',

        // Gray scale
        gray: {
          50: 'hsl(var(--color-gray-50) / <alpha-value>)',
          100: 'hsl(var(--color-gray-100) / <alpha-value>)',
          200: 'hsl(var(--color-gray-200) / <alpha-value>)',
          300: 'hsl(var(--color-gray-300) / <alpha-value>)',
          400: 'hsl(var(--color-gray-400) / <alpha-value>)',
          500: 'hsl(var(--color-gray-500) / <alpha-value>)',
          600: 'hsl(var(--color-gray-600) / <alpha-value>)',
          700: 'hsl(var(--color-gray-700) / <alpha-value>)',
          800: 'hsl(var(--color-gray-800) / <alpha-value>)',
          900: 'hsl(var(--color-gray-900) / <alpha-value>)',
        },
      },
    },
  },
  plugins: [require('tw-animate-css')],
};
