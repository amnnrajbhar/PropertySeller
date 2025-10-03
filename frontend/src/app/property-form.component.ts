import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UploadService, PresignedUrlResponse } from './upload.service';
import { PropertyService, Property } from './property.service';

interface FileUpload {
  file: File;
  progress: number;
  uploaded: boolean;
  url?: string;
  key?: string;
  isImage: boolean;
}

@Component({
  selector: 'app-property-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <div class="form-card">
        <h1>Add New Property</h1>
        
        <form (ngSubmit)="onSubmit()" #propertyForm="ngForm">
          <!-- Basic Details -->
          <div class="form-section">
            <h3>Property Details</h3>
            
            <div class="form-group">
              <label>Property Title *</label>
              <input type="text" [(ngModel)]="property.title" name="title" required 
                     placeholder="e.g., 3BHK Apartment in Bandra">
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Property Type *</label>
                <select [(ngModel)]="property.propertyType" name="propertyType" required>
                  <option value="">Select Type</option>
                  <option value="Apartment">Apartment</option>
                  <option value="Villa">Villa</option>
                  <option value="House">House</option>
                  <option value="Plot">Plot</option>
                  <option value="Commercial">Commercial</option>
                </select>
              </div>
              
              <div class="form-group">
                <label>Price (₹) *</label>
                <input type="number" [(ngModel)]="property.price" name="price" required 
                       placeholder="5000000">
              </div>
            </div>

            <div class="form-group">
              <label>Location *</label>
              <input type="text" [(ngModel)]="property.location" name="location" required 
                     placeholder="e.g., Bandra West, Mumbai">
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Area (sq ft) *</label>
                <input type="number" [(ngModel)]="property.area" name="area" required 
                       placeholder="1200">
              </div>
              
              <div class="form-group">
                <label>Bedrooms *</label>
                <select [(ngModel)]="property.bedrooms" name="bedrooms" required>
                  <option value="">Select</option>
                  <option value="1">1 BHK</option>
                  <option value="2">2 BHK</option>
                  <option value="3">3 BHK</option>
                  <option value="4">4 BHK</option>
                  <option value="5">5+ BHK</option>
                </select>
              </div>
              
              <div class="form-group">
                <label>Bathrooms *</label>
                <select [(ngModel)]="property.bathrooms" name="bathrooms" required>
                  <option value="">Select</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5+</option>
                </select>
              </div>
            </div>

            <div class="form-group">
              <label>Description *</label>
              <textarea [(ngModel)]="property.description" name="description" required 
                        placeholder="Describe your property features, amenities, etc." rows="4"></textarea>
            </div>
          </div>

          <!-- Media Upload -->
          <div class="form-section">
            <h3>Property Media</h3>
            
            <div class="upload-area">
              <input type="file" #fileInput multiple accept="image/*,video/*" 
                     (change)="onFilesSelected($event)" style="display: none">
              <button type="button" class="upload-btn" (click)="fileInput.click()">
                📷 Add Photos & Videos
              </button>
              <p class="upload-hint">Upload images and videos of your property</p>
            </div>

            <div class="media-grid" *ngIf="uploads.length > 0">
              <div class="media-item" *ngFor="let upload of uploads; trackBy: trackByFile">
                <div class="media-preview">
                  <img *ngIf="upload.isImage && upload.url" [src]="upload.url" alt="Preview">
                  <div *ngIf="!upload.isImage" class="video-placeholder">🎥 Video</div>
                  <div class="progress-overlay" *ngIf="!upload.uploaded">
                    <div class="progress-bar">
                      <div class="progress-fill" [style.width.%]="upload.progress"></div>
                    </div>
                    <span>{{upload.progress}}%</span>
                  </div>
                </div>
                <button type="button" class="remove-btn" (click)="removeFile(upload)">×</button>
              </div>
            </div>
          </div>

          <!-- Contact Details -->
          <div class="form-section">
            <h3>Contact Information</h3>
            
            <div class="form-row">
              <div class="form-group">
                <label>Name *</label>
                <input type="text" [(ngModel)]="property.contactName" name="contactName" required 
                       placeholder="full name">
              </div>
              
              <div class="form-group">
                <label>Phone Number *</label>
                <input type="tel" [(ngModel)]="property.contactPhone" name="contactPhone" required 
                       placeholder="+91 9876543210">
              </div>
            </div>
          </div>

          <!-- Submit -->
          <div class="form-actions">
            <button type="button" class="btn-secondary" (click)="goBack()">Cancel</button>
            <button type="submit" class="btn-primary" [disabled]="!propertyForm.valid || isSubmitting">
              {{isSubmitting ? 'Publishing...' : 'Publish Property'}}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .container {
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
      min-height: 100vh;
      background: #f5f5f5;
    }

    /* Touch-friendly inputs */
    input, select, textarea {
      -webkit-appearance: none;
      -webkit-tap-highlight-color: transparent;
    }

    button {
      -webkit-tap-highlight-color: transparent;
      touch-action: manipulation;
    }

    .form-card {
      background: white;
      border-radius: 12px;
      padding: 30px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.1);
    }

    h1 {
      color: #2c3e50;
      margin-bottom: 30px;
      text-align: center;
      font-size: 28px;
    }

    .form-section {
      margin-bottom: 30px;
      padding-bottom: 20px;
      border-bottom: 1px solid #eee;
    }

    .form-section:last-child {
      border-bottom: none;
    }

    h3 {
      color: #34495e;
      margin-bottom: 20px;
      font-size: 20px;
    }

    .form-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
    }

    .form-group {
      margin-bottom: 20px;
    }

    label {
      display: block;
      margin-bottom: 8px;
      font-weight: 600;
      color: #2c3e50;
    }

    input, select, textarea {
      width: 100%;
      padding: 12px;
      border: 2px solid #ddd;
      border-radius: 8px;
      font-size: 16px;
      transition: border-color 0.3s;
    }

    input:focus, select:focus, textarea:focus {
      outline: none;
      border-color: #3498db;
    }

    .upload-area {
      text-align: center;
      padding: 40px;
      border: 2px dashed #ddd;
      border-radius: 8px;
      margin-bottom: 20px;
    }

    .upload-btn {
      background: #3498db;
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 8px;
      font-size: 16px;
      cursor: pointer;
      transition: background 0.3s;
    }

    .upload-btn:hover {
      background: #2980b9;
    }

    .upload-hint {
      margin-top: 10px;
      color: #7f8c8d;
    }

    .media-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
      gap: 15px;
    }

    .media-item {
      position: relative;
      border-radius: 8px;
      overflow: hidden;
      background: #f8f9fa;
    }

    .media-preview {
      position: relative;
      aspect-ratio: 1;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .media-preview img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .video-placeholder {
      font-size: 24px;
      color: #7f8c8d;
    }

    .progress-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.7);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: white;
    }

    .progress-bar {
      width: 80%;
      height: 4px;
      background: rgba(255,255,255,0.3);
      border-radius: 2px;
      margin-bottom: 10px;
    }

    .progress-fill {
      height: 100%;
      background: #3498db;
      border-radius: 2px;
      transition: width 0.3s;
    }

    .remove-btn {
      position: absolute;
      top: 5px;
      right: 5px;
      background: #e74c3c;
      color: white;
      border: none;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      cursor: pointer;
      font-size: 16px;
      line-height: 1;
    }

    .form-actions {
      display: flex;
      gap: 15px;
      justify-content: flex-end;
      margin-top: 30px;
    }

    .btn-primary, .btn-secondary {
      padding: 12px 24px;
      border-radius: 8px;
      font-size: 16px;
      cursor: pointer;
      border: none;
      transition: all 0.3s;
    }

    .btn-primary {
      background: #27ae60;
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      background: #229954;
    }

    .btn-primary:disabled {
      background: #95a5a6;
      cursor: not-allowed;
    }

    .btn-secondary {
      background: #95a5a6;
      color: white;
    }

    .btn-secondary:hover {
      background: #7f8c8d;
    }

    @media (max-width: 768px) {
      .container {
        padding: 5px;
      }

      .form-card {
        padding: 15px;
        border-radius: 0;
        margin: 0;
      }

      h1 {
        font-size: 24px;
        margin-bottom: 20px;
      }

      .form-row {
        grid-template-columns: 1fr;
        gap: 15px;
      }

      .form-group {
        margin-bottom: 15px;
      }

      input, select, textarea {
        padding: 16px;
        font-size: 16px;
        border-radius: 12px;
      }

      .upload-area {
        padding: 30px 15px;
      }

      .upload-btn {
        padding: 16px 24px;
        font-size: 18px;
        width: 100%;
      }

      .media-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 10px;
      }

      .form-actions {
        flex-direction: column;
        gap: 10px;
      }

      .btn-primary, .btn-secondary {
        padding: 16px;
        font-size: 18px;
        width: 100%;
      }
    }
  `]
})
export class PropertyFormComponent {
  property = {
    title: '',
    description: '',
    price: 0,
    location: '',
    area: 0,
    bedrooms: 0,
    bathrooms: 0,
    propertyType: '',
    contactName: '',
    contactPhone: '',
    images: [] as string[],
    videos: [] as string[]
  };

  uploads: FileUpload[] = [];
  isSubmitting = false;

  constructor(
    private uploadService: UploadService,
    private propertyService: PropertyService,
    private router: Router
  ) { }

  onFilesSelected(event: Event) {
    const target = event.target as HTMLInputElement;
    if (!target.files) return;
    const files = Array.from(target.files) as File[];

    files.forEach(file => {
      const isImage = file.type.startsWith('image/');
      const upload: FileUpload = {
        file,
        progress: 0,
        uploaded: false,
        isImage,
        url: isImage ? URL.createObjectURL(file) : undefined
      };

      this.uploads.push(upload);
      this.uploadFile(upload);
    });
  }

  private uploadFile(upload: FileUpload) {
    this.uploadService.getPresignedUrl(upload.file.name, upload.file.type)
      .subscribe({
        next: (response: PresignedUrlResponse) => {
          upload.key = response.key;

          this.uploadService.uploadFile(response.presignedUrl, upload.file)
            .subscribe({
              next: () => {
                upload.uploaded = true;
                upload.progress = 100;
                this.getFileDisplayUrl(upload, response.bucket);
              },
              error: (error) => {
                console.error('Upload failed:', error);
                this.removeFile(upload);
              }
            });
        },
        error: (error) => {
          console.error('Failed to get presigned URL:', error);
          this.removeFile(upload);
        }
      });

    this.uploadService.getUploadProgress().subscribe(progress => {
      upload.progress = progress.percentage;
    });
  }

  removeFile(upload: FileUpload) {
    const index = this.uploads.indexOf(upload);
    if (index > -1) {
      this.uploads.splice(index, 1);
      if (upload.url && upload.isImage) {
        URL.revokeObjectURL(upload.url);
      }
    }
  }

  trackByFile(index: number, upload: FileUpload): string {
    return upload.file.name + upload.file.size;
  }

  onSubmit() {
    if (this.uploads.some(u => !u.uploaded)) {
      alert('Please wait for all files to upload');
      return;
    }

    this.isSubmitting = true;

    // Separate images and videos
    this.property.images = this.uploads
      .filter(u => u.isImage && u.url)
      .map(u => u.url as string);

    this.property.videos = this.uploads
      .filter(u => !u.isImage && u.url)
      .map(u => u.url as string);

    const propertyId = this.propertyService.addProperty(this.property);

    setTimeout(() => {
      this.router.navigate(['/property', propertyId]);
    }, 500);
  }

  goBack() {
    this.router.navigate(['/']);
  }

  private getFileDisplayUrl(upload: FileUpload, bucket: string) {
    this.uploadService.getUploadedFiles().subscribe({
      next: (response) => {
        const file = response.files.find(f => f.key === upload.key);
        if (file) {
          upload.url = file.url;
        }
      },
      error: () => {
        upload.url = `https://${bucket}.s3.amazonaws.com/${upload.key}`;
      }
    });
  }
}