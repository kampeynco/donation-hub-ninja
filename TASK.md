
# Capture Pillar Tasks

## 1. Preparation and Backup
[X] Create complete backup of current database
[X] Document current schema relationships
  - Document existing tables: donors, emails, locations, employer_data, user_donors
  - Map current relationships and foreign keys
  - Document existing indexes and constraints
[X] Set up test environment for migration
[X] Create rollback plan

## 2. Schema Migration
### 2.1. Create New Tables
[X] Create webhook_data table for storing raw webhook data
[ ] Create duplicate_matches table with confidence scoring
[X] Create merge_history table for tracking contact merges
[X] Add necessary indexes for new tables

### 2.2. Modify Existing Tables
[X] Rename donors table to contacts
[X] Add status field to contacts table
[X] Modify phones table:
  - Add type field (ENUM: 'mobile', 'home', 'work', 'other')
  - Add is_primary boolean field with default false
  - Add constraint to ensure only one primary per contact
[X] Modify emails table:
  - Add type field (ENUM: 'personal', 'work', 'other')
  - Add is_primary boolean field with default false
  - Add constraint to ensure only one primary per contact
[X] Modify locations table:
  - Add type field (ENUM: 'home', 'work', 'mailing', 'other')
  - Add is_primary boolean field with default false
  - Add constraint to ensure only one primary per contact
[X] Update foreign key references from donor_id to contact_id
[X] Rename user_donors table to user_contacts

### 2.3. Data Migration
[X] Migrate existing donor data to contacts table
[X] Update foreign key references in related tables:
  - Update emails table references
  - Update locations table references
  - Update employer_data references
  - Update user_donors to user_contacts references
[X] Set initial primary flags:
  - Set oldest email record as primary for each contact
  - Set oldest phone record as primary for each contact
  - Set oldest location record as primary for each contact
[X] Set initial type values based on available data
[X] Verify data integrity after migration
[X] Create initial status values for existing contacts

## 3. Backend Implementation
### 3.1. Contact Management
[X] Update contact CRUD operations for new schema
[X] Implement primary record management:
  - Add endpoint to set primary email
  - Add endpoint to set primary phone
  - Add endpoint to set primary location
  - Add validation to ensure one primary per type
[X] Create contact search functionality
[X] Implement contact status management
[X] Update notification system for new contact structure

### 3.2. Duplicate Detection System
[ ] Implement confidence score calculation:
  - Name similarity score (75%):
    - First name exact match (35%)
    - Last name exact match (40%)
    - Fuzzy matching for slight variations
  - Contact info match scores (25%):
    - Email exact match (15%)
    - Phone exact match (5%)
    - Address match (5%)
  - Calculate composite confidence score
[ ] Create duplicate detection service
[ ] Handle multiple potential matches:
  - Store all matches above 50% confidence
  - Present matches in UI for manual review
  - Allow user to compare and select matches
  - Support bulk and individual merge decisions
[ ] Implement merge history tracking
[ ] Add validation for primary field conflicts

### 3.3. Webhook Processing
[X] Update ActBlue webhook handling for new schema
[X] Implement webhook data storage
[ ] Create contact matching logic:
  - Reuse core confidence score calculation
  - Set 90% minimum confidence threshold for notifications
  - Handle multiple potential matches:
    - Only proceed with matches above 90% confidence
    - Must have exact match on at least one primary identifier (email/phone)
    - Skip notification if multiple matches above 90%
    - Log skipped notifications for manual review
    - Create system to resolve ambiguous matches later
[X] Add error handling and retry logic
[X] Update notification system for privacy requirements:
  - Create notifications with type 'donor'
  - Only notify users with matches above 90% confidence
  - Format donation notification without recipient details
  - Send notifications to relevant users only
  - Ensure committee name is never exposed in notifications

## 4. Nested Left Sidebar Tasks
### 4.1. Component Creation
- [ ] Create new directory `src/components/layout` if it doesn't exist
- [ ] Create `NestedSidebar.tsx` component
- [ ] Create reusable sub-components:
  - `SidebarItem.tsx` for main menu items
  - `SubSidebarItem.tsx` for secondary menu items

### 4.2. Route Structure Updates
- [ ] Update route configuration to support new nested structure:
  ```typescript
  /prospects
    /prospects/prospects
    /prospects/donors
    /prospects/merge
  /settings
    /settings/profile
    /settings/notifications
    /settings/billing
  ```
- [ ] Create route constants file for centralized route management
- [ ] Add route guards/authentication checks if needed

### 4.3. Component Migration
- [ ] Move existing tab content components to standalone pages:
  - Migrate `ProspectsContent` from tab content
  - Migrate `DonorsContent` from tab content
  - Migrate `MergeDuplicatesContent` from tab content
  - Migrate `ProfileTab` content
  - Migrate `NotificationsTab` content
  - Migrate `BillingTab` content
- [ ] Update component imports and exports
- [ ] Remove old tab-based components

### 4.4. State Management
- [ ] Implement active route tracking
- [ ] Add state management for sidebar collapse/expand
- [ ] Handle secondary sidebar visibility based on route
- [ ] Preserve user preferences (e.g., sidebar state)

### 4.5. UI Implementation
- [ ] Implement main sidebar styling:
  - Use Inter font family
  - Add proper spacing and padding
  - Implement hover states
  - Add active state styling
- [ ] Implement secondary sidebar styling:
  - Match design language of main sidebar
  - Add subtle background difference
  - Implement proper transitions
- [ ] Add Tabler icons:
  - IconHome for Dashboard
  - IconUserCircle for Prospects
  - IconSettings for Settings
  - IconUserPlus for Prospects sub-menu
  - IconCoin for Donors sub-menu
  - IconUsers for Merge Duplicates
  - IconUser for Profile
  - IconBell for Notifications
  - IconCreditCard for Billing

### 4.6. Responsive Design
- [ ] Implement mobile-friendly layout
- [ ] Add collapse/expand functionality
- [ ] Add touch gestures for mobile
- [ ] Test breakpoints and responsive behavior

### 4.7. Navigation Logic
- [ ] Implement navigation state management
- [ ] Add route change handlers
- [ ] Implement breadcrumb generation
- [ ] Handle deep linking

### 4.8. Testing
- [ ] Add unit tests for sidebar components
- [ ] Add integration tests for navigation
- [ ] Test responsive behavior
- [ ] Test route handling
- [ ] Cross-browser testing

### 4.9. Performance Optimization
- [ ] Implement code splitting for routes
- [ ] Optimize component rendering
- [ ] Add loading states
- [ ] Implement transition animations

### 4.10. Documentation
- [ ] Add component documentation
- [ ] Document routing structure
- [ ] Add usage examples
- [ ] Document state management
- [ ] Add migration guide for existing code

### 4.11. Cleanup
- [ ] Remove old tab-based navigation code
- [ ] Clean up unused imports
- [ ] Remove deprecated routes
- [ ] Update test files
- [ ] Remove unused dependencies

### 4.12. Final Review
- [ ] Conduct accessibility audit
- [ ] Review mobile responsiveness
- [ ] Check performance metrics
- [ ] Verify all routes work as expected
- [ ] Ensure design consistency