
# Capture Pillar Tasks

## 1. Preparation and Backup
- [ ] Create complete backup of current database
- [ ] Document current schema relationships
  - Document existing tables: donors, emails, locations, employer_data, user_donors
  - Map current relationships and foreign keys
  - Document existing indexes and constraints
- [ ] Set up test environment for migration
- [ ] Create rollback plan

## 2. Schema Migration
### 2.1. Create New Tables
- [ ] Create webhook_data table for storing raw webhook data
- [ ] Create duplicate_matches table with confidence scoring
- [ ] Create merge_history table for tracking contact merges
- [ ] Add necessary indexes for new tables

### 2.2. Modify Existing Tables
- [ ] Rename donors table to contacts
- [ ] Add status field to contacts table
- [ ] Modify phones table:
  - Add type field (ENUM: 'mobile', 'home', 'work', 'other')
  - Add is_primary boolean field with default false
  - Add constraint to ensure only one primary per contact
- [ ] Modify emails table:
  - Add type field (ENUM: 'personal', 'work', 'other')
  - Add is_primary boolean field with default false
  - Add constraint to ensure only one primary per contact
- [ ] Modify locations table:
  - Add type field (ENUM: 'home', 'work', 'mailing', 'other')
  - Add is_primary boolean field with default false
  - Add constraint to ensure only one primary per contact
- [ ] Update foreign key references from donor_id to contact_id
- [ ] Rename user_donors table to user_contacts

### 2.3. Data Migration
- [ ] Migrate existing donor data to contacts table
- [ ] Update foreign key references in related tables:
  - Update emails table references
  - Update locations table references
  - Update employer_data references
  - Update user_donors to user_contacts references
- [ ] Set initial primary flags:
  - Set oldest email record as primary for each contact
  - Set oldest phone record as primary for each contact
  - Set oldest location record as primary for each contact
- [ ] Set initial type values based on available data
- [ ] Verify data integrity after migration
- [ ] Create initial status values for existing contacts

## 3. Backend Implementation
### 3.1. Contact Management
- [ ] Update contact CRUD operations for new schema
- [ ] Implement primary record management:
  - Add endpoint to set primary email
  - Add endpoint to set primary phone
  - Add endpoint to set primary location
  - Add validation to ensure one primary per type
- [ ] Create contact search functionality
- [ ] Implement contact status management
- [ ] Update notification system for new contact structure

### 3.2. Duplicate Detection System
- [ ] Implement confidence score calculation:
  - Name similarity score (75%):
    - First name exact match (35%)
    - Last name exact match (40%)
    - Fuzzy matching for slight variations
  - Contact info match scores (25%):
    - Email exact match (15%)
    - Phone exact match (5%)
    - Address match (5%)
  - Calculate composite confidence score
- [ ] Create duplicate detection service
- [ ] Handle multiple potential matches:
  - Store all matches above 50% confidence
  - Present matches in UI for manual review
  - Allow user to compare and select matches
  - Support bulk and individual merge decisions
- [ ] Implement merge history tracking
- [ ] Add validation for primary field conflicts

### 3.3. Webhook Processing
- [ ] Update ActBlue webhook handling for new schema
- [ ] Implement webhook data storage
- [ ] Create contact matching logic:
  - Reuse core confidence score calculation
  - Set 90% minimum confidence threshold for notifications
  - Handle multiple potential matches:
    - Only proceed with matches above 90% confidence
    - Must have exact match on at least one primary identifier (email/phone)
    - Skip notification if multiple matches above 90%
    - Log skipped notifications for manual review
    - Create system to resolve ambiguous matches later
- [ ] Add error handling and retry logic
- [ ] Update notification system for privacy requirements:
  - Create notifications with type 'donor'
  - Only notify users with matches above 90% confidence
  - Format donation notification without recipient details
  - Send notifications to relevant users only
  - Ensure committee name is never exposed in notifications

## 4. Frontend Implementation
### 4.1. Donors Dashboard Restructure
- [ ] Update navigation:
  - Rename "Donors" sidebar menu item to "Prospects"
  - Update route path if necessary
  - Update any related breadcrumbs
- [ ] Create three-tab interface:
  - Donors Tab: Active donors with donation history and details
  - Prospects Tab: Potential donors who haven't made donations yet
  - Duplicates Tab: Potential duplicate contacts with merge functionality
- [ ] Implement tab-specific list views:
  - Donors: List with donation history and total amounts
  - Prospects: List with basic contact information
  - Duplicates: 
    - List with confidence scores and match details
    - Implement confidence score visualization
    - Add merge interface with primary record selection
    - Show merge history for contacts
- [ ] Add filtering and sorting functionality:
  - Date range filters
  - Amount range filters
  - Status filters
  - Type filters (individual/organization)
  - Custom tag filters

### 4.2. Contact Management
- [ ] Create sliding right panel for contact details:
  - Implement slide-in/out animation
  - Add close/dismiss functionality
  - Display contact summary at top
  - Show primary/secondary emails with types
  - Show primary/secondary phones with types
  - Show primary/secondary locations with types
  - Display donation history section (if donor)
- [ ] Implement contact editing:
  - Add type selection dropdowns for emails/phones/locations
  - Add primary toggle controls
  - Add validation feedback
  - Add status management controls
- [ ] Create contact search interface

## 5. Testing
### 5.1. Database Testing
- [ ] Test all database migrations
- [ ] Test primary record constraints
- [ ] Test type field constraints
- [ ] Verify data integrity of existing relationships
- [ ] Test rollback procedures
- [ ] Performance testing with existing data volume

### 5.2. Backend Testing
- [ ] Unit tests for new services
- [ ] Test primary record management
- [ ] Test type field validation
- [ ] Integration tests for API endpoints
- [ ] Test duplicate detection accuracy
- [ ] Test webhook processing
- [ ] Test notification system with new structure

### 5.3. Frontend Testing
- [ ] Unit tests for new components
- [ ] Test primary record selection UI
- [ ] Test type field selection UI
- [ ] Test sliding panel functionality
- [ ] Integration tests for new features
- [ ] UI/UX testing
- [ ] Cross-browser testing

## 6. Deployment
### 6.1. Preparation
- [ ] Create deployment plan
- [ ] Schedule maintenance window
- [ ] Prepare rollback procedures
- [ ] Update documentation
- [ ] Prepare team communication

### 6.2. Execution
- [ ] Deploy database changes
- [ ] Deploy backend updates
- [ ] Deploy frontend updates
- [ ] Verify system functionality:
  - Test primary record functionality
  - Test type field functionality
  - Verify notification system operation

### 6.3. Post-Deployment
- [ ] Monitor system performance
- [ ] Address any issues
- [ ] Update user documentation:
  - Document new type fields
  - Document primary record management
  - Document merge handling
- [ ] Provide team training on new contact management system
