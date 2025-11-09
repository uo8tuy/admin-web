# Design Guidelines: Company Admin Dashboard

## Design Approach
**Selected System:** Carbon Design System (IBM) - specifically built for data-intensive enterprise applications with complex workflows and role-based interfaces.

**Key Principles:**
- Clarity over decoration - every element serves a function
- Consistent patterns for scalability across modules
- Information density without overwhelming users
- Clear visual hierarchy for quick scanning

---

## Typography System

**Font Family:** IBM Plex Sans (primary), IBM Plex Mono (code/data)

**Hierarchy:**
- Page Titles: 32px, Semibold
- Section Headers: 20px, Semibold  
- Card/Panel Titles: 16px, Medium
- Body Text: 14px, Regular
- Helper Text/Labels: 12px, Regular
- Data Tables: 13px, Regular (slightly condensed for density)

---

## Layout System

**Spacing Units:** Tailwind classes limited to: 1, 2, 3, 4, 6, 8, 12, 16
- Micro spacing (between related elements): 1-2
- Component internal padding: 4-6
- Section spacing: 8-12
- Page margins: 16

**Grid Structure:**
- Sidebar navigation: 240px fixed width
- Main content area: Responsive with max-w-7xl container
- Dashboard cards: 3-column grid on desktop (grid-cols-1 md:grid-cols-2 lg:grid-cols-3)
- Tables: Full-width within container
- Form layouts: 2-column grid for efficiency (grid-cols-1 lg:grid-cols-2)

---

## Component Library

### Navigation
- **Sidebar:** Fixed left navigation with collapsible sections, icon + label format, active state indicator
- **Top Bar:** Breadcrumbs, user profile menu, notifications icon, quick actions
- **Sub-navigation:** Tabs for module sections (Products, Categories, Users, etc.)

### Dashboard Widgets
- **Stat Cards:** Icon, metric value, label, percentage change indicator, sparkline graph
- **Charts:** Bar charts for category performance, line graphs for trends, donut charts for distribution
- **Recent Activity Feed:** Timeline-style list with icons, timestamps, user avatars

### Data Tables
- **Structure:** Sticky header, alternating row backgrounds for readability, hover states
- **Features:** Sortable columns, filter dropdowns, search bar, bulk actions checkbox
- **Row Actions:** Icon buttons (edit, delete, view) aligned right
- **Pagination:** Bottom-aligned with items per page selector
- **Empty States:** Centered icon + message + CTA button

### Forms & Inputs
- **Product Form:** Multi-step wizard or single page with clear sections
- **Image Upload:** Drag-and-drop zone with thumbnail preview grid for multiple images
- **Rich Text Editor:** Toolbar for product descriptions
- **Toggle Switches:** For active/inactive states (category visibility, product status)
- **Permission Matrix:** Checkbox grid for role-based access control
- **Select Dropdowns:** Searchable for categories, brands, user roles

### Cards & Panels
- **Product Cards:** Thumbnail image (4:3 ratio), title, category badge, status indicator, action menu
- **Email Preview:** Sender, subject, timestamp, unread indicator, message preview
- **User Cards:** Avatar, name, role badge, last active timestamp, permission pills

### Status Indicators
- **Badges:** Pill-shaped for categories, product status (Active/Inactive/Draft)
- **Permission Pills:** Small, rounded rectangles showing access levels
- **Status Dots:** Inline colored indicators (green=active, gray=inactive, red=error)

### Modals & Overlays
- **Confirmation Dialogs:** For delete/deactivate actions with clear warning text
- **Product Details Modal:** Lightbox for image gallery viewing
- **Quick Edit Drawer:** Slide-in panel from right for inline editing
- **Filter Panel:** Collapsible sidebar for advanced filtering

### Analytics Components
- **Product Click Heatmap:** Visual representation of most-clicked products
- **Traffic Charts:** Time-series graphs with date range selector
- **Top Products List:** Ranked list with thumbnail, name, click count, trend arrow

---

## Page Layouts

### Dashboard Home
Three-row structure:
1. KPI stat cards (4 across)
2. Charts section (2 columns: traffic trends + category performance)
3. Recent activity feed + top products list (2 columns)

### Product Management
- Filter bar (category, brand, status dropdowns + search)
- Product grid/table toggle view
- Bulk action toolbar when items selected
- Floating "Add Product" button (bottom-right)

### Product Editor
Two-column layout:
- Left: Image upload section with primary + gallery
- Right: Form fields (name, description, performance specs, category, pricing)
- Fixed bottom action bar (Save, Publish, Discard buttons)

### User Management
- User table with role badges, last login, status
- Quick permission editor in slide-out panel
- Add user button opens modal form

### Email Support Inbox
Three-panel layout:
- Left: Folder list (Inbox, Assigned to Me, Archive)
- Middle: Email list with preview snippets
- Right: Full email view with reply/forward actions

### Category Management
- Tree structure or nested list showing category hierarchy
- Inline toggle for active/inactive status
- Quick edit icon for renaming
- Product count indicator per category

---

## Images

**Dashboard Illustrations:**
- Empty state graphics for "No products," "No emails," "No data yet"
- Product placeholder images (400x300px) for items without uploads
- User avatar placeholders (40x40px circles)

**No Hero Section Required** - This is an admin dashboard, not a marketing site. Focus on functional layouts.

---

## Accessibility
- All interactive elements keyboard accessible
- Form inputs with clear labels and error states
- High contrast for text readability (WCAG AA minimum)
- Screen reader friendly table headers and navigation
- Focus indicators on all clickable elements