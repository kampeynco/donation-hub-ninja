
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

## 4. Nested Dashboard Navigation Tasks
### 4.1. Component Analysis and Extension
- [ ] Review existing sidebar components:
  - Analyze current sidebar-menu.tsx structure
  - Review sidebar-provider.tsx state management
  - Document sidebar-util.tsx helper functions
- [ ] Create new nested navigation components:
  - Create `DashboardNestedNav.tsx` for reusable nested navigation
  - Create page-specific navigation components:
    - `ProspectsNav.tsx`
    - `SettingsNav.tsx`
    - `LogsNav.tsx`
- [ ] Integrate with existing sidebar structure:
  - Ensure no disruption to main sidebar
  - Maintain current sidebar state management
  - Preserve existing sidebar styling

### 4.2. Dashboard-Specific Navigation
- [ ] Implement Prospects dashboard navigation:
  - Add secondary navigation container
  - Implement navigation for:
    - Prospects (IconAddressBook)
    - Donors (IconHeartDollar)
    - Merge Duplicates (IconLayersDifference)
  - Preserve existing dashboard content

- [ ] Implement Settings dashboard navigation:
  - Add secondary navigation container
  - Implement navigation for:
    - Profile (IconUserCircle)
    - Notifications (IconBell)
    - Billing (IconCreditCard)
  - Preserve existing settings content

- [ ] Implement Logs dashboard navigation:
  - Add secondary navigation container
  - Implement navigation for:
    - All (IconBell)
    - Donors (IconBellHeart)
    - Account (IconBellBolt)
    - System (IconBellCog)
  - Preserve existing logs content

### 4.3. Route Integration
- [ ] Update route handling for nested navigation:
  ```typescript
  // Preserve existing main routes
  /prospects -> Existing main route
  /settings -> Existing main route
  /logs -> Existing main route

  // Add nested routes
  /prospects/:tab // prospects, donors, merge
  /settings/:tab  // profile, notifications, billing
  /logs/:tab      // all, donors, account, system
  ```
- [ ] Implement route parameter handling
- [ ] Add route guards where needed

### 4.4. State Management
- [ ] Extend existing sidebar state:
  - Add nested navigation state
  - Handle active tab state
  - Preserve existing sidebar collapse state
- [ ] Implement tab persistence
- [ ] Handle navigation history

### 4.5. UI Implementation
- [ ] Create nested navigation styling:
  - Match existing sidebar design language
  - Implement proper spacing and hierarchy
  - Add transitions for tab changes
  - Ensure responsive behavior
- [ ] Implement specified Tabler icons:
  DO NOT CHANGE THESE ICONS EVEN IF PACKAGE SHOWS ERRORS
  - Use exact icons as specified for each section
  - Maintain consistent icon sizing with main sidebar
  - Preserve existing main sidebar icons

### 4.6. Testing
- [ ] Test nested navigation integration:
  - Verify no impact on main sidebar
  - Test tab switching
  - Validate route handling
  - Check state persistence
- [ ] Test responsive behavior
- [ ] Cross-browser testing

### 4.7. Documentation
- [ ] Document nested navigation implementation
- [ ] Update component usage guidelines
- [ ] Document state management changes
- [ ] Add examples for future dashboard extensions