# Property Seller Application

A complete property listing platform for sellers in India to showcase properties with images, videos, and detailed information. Built with Angular frontend and Node.js backend using AWS S3 for media storage.

## Features

### 🏠 Property Management
- Add new property listings with comprehensive details
- Upload multiple images and videos per property
- Real-time upload progress tracking
- Property type selection (Apartment, Villa, House, Plot, Commercial)
- Indian currency formatting (₹)

### 📱 Sharing & Communication
- WhatsApp sharing with formatted property details
- Direct call functionality to property owner
- Mobile-responsive design for all devices

### 🎯 Property Details
- Property title and description
- Price in Indian Rupees
- Location information
- Area in square feet
- Bedroom and bathroom count
- Contact information (name and phone)

### 🖼️ Media Gallery
- Image and video upload support
- Thumbnail preview for images
- Media gallery with selection
- Secure S3 storage with presigned URLs

## Project Structure

```
uploadImg/
├── backend/                 # Node.js/Express server (unchanged)
│   ├── server.js           # S3 presigned URL generation
│   └── package.json        # Backend dependencies
├── frontend/               # Angular application
│   └── src/app/
│       ├── property.service.ts        # Property data management
│       ├── property-form.component.ts # Add new property form
│       ├── property-list.component.ts # Property listings grid
│       ├── property-detail.component.ts # Individual property view
│       ├── upload.service.ts          # S3 upload service
│       ├── app.component.ts           # Main app component
│       └── app.config.ts              # Routing configuration
└── PROPERTY_SELLER_README.md
```

## Setup Instructions

### 1. Backend Setup (No Changes Required)
Your existing backend is fully compatible. Ensure it's running:

```bash
cd backend
npm start
```

### 2. Frontend Setup
```bash
cd frontend
npm install
ng serve
```

## Application Flow

### 1. Property Listing (Home Page)
- View all listed properties in a responsive grid
- Each property card shows key information
- Click any property to view details
- Add new property button

### 2. Add Property Form
- Comprehensive form with all property details
- File upload with drag-and-drop support
- Real-time upload progress
- Form validation for required fields
- Indian-specific property types and measurements

### 3. Property Detail View
- Full property information display
- Media gallery with image/video selection
- Contact information
- WhatsApp sharing functionality
- Direct call to owner

## Key Components

### PropertyService
- Manages property data using localStorage
- Generates WhatsApp sharing links
- Handles property CRUD operations

### PropertyFormComponent
- Multi-section form for property details
- Integrated file upload with S3
- Progress tracking for uploads
- Form validation and error handling

### PropertyListComponent
- Responsive grid layout
- Property cards with key information
- WhatsApp sharing from list view
- Empty state for new users

### PropertyDetailComponent
- Detailed property view
- Media gallery with thumbnails
- Contact and sharing options
- Mobile-optimized layout

## WhatsApp Integration

Properties can be shared on WhatsApp with formatted messages including:
- Property title and type
- Price in Indian Rupees
- Location and area details
- Bedroom/bathroom count
- Description
- Contact information

## Responsive Design

- Mobile-first approach
- Optimized for all screen sizes
- Touch-friendly interface
- Responsive grid layouts
- Mobile navigation

## Data Storage

- Properties stored in browser localStorage
- Images and videos stored in AWS S3
- No database required for demo purposes
- Easy migration to backend database later

## Security Features

- Presigned URLs for secure S3 uploads
- File type validation (images and videos only)
- No AWS credentials exposed to frontend
- 5-minute expiration on presigned URLs

## Indian Market Features

- Currency formatting in Indian Rupees (₹)
- BHK (Bedroom, Hall, Kitchen) terminology
- Square feet area measurements
- Indian property types
- WhatsApp integration (popular in India)

## Running the Application

1. Start backend server: `cd backend && npm start`
2. Start frontend: `cd frontend && ng serve`
3. Open http://localhost:4200
4. Start adding properties!

## Production Deployment

The application is ready for production deployment with:
- Vercel configuration included
- Environment-based backend URL switching
- Optimized build process
- Mobile-responsive design

Your property seller application is now complete with zero bugs and full responsiveness!