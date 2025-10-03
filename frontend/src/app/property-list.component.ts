import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PropertyService, Property } from './property.service';

@Component({
  selector: 'app-property-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <div class="header">
        <h1>My Properties</h1>
      </div>

      <div class="properties-grid" *ngIf="properties.length > 0">
        <div class="property-card" *ngFor="let property of properties" (click)="viewProperty(property.id)">
          <div class="property-image" (click)="openMediaViewer(property)">
            <img *ngIf="property.images.length > 0" [src]="property.images[0]" [alt]="property.title">
            <div *ngIf="property.images.length === 0" class="no-image">📷 No Image</div>
            <div class="property-type">{{property.propertyType}}</div>
            <div class="media-count" *ngIf="getTotalMedia(property) > 1">
              📷 {{getTotalMedia(property)}}
            </div>
          </div>
          
          <div class="property-content">
            <div class="title-row">
              <h3>{{property.title}}</h3>
              <div class="action-buttons">
                <button class="share-btn" (click)="shareOnWhatsApp(property)" title="Share on WhatsApp" (click)="$event.stopPropagation()">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 48 48">
                    <path fill="#fff" d="M4.9,43.3l2.7-9.8C5.9,30.6,5,27.3,5,24C5,13.5,13.5,5,24,5c5.1,0,9.8,2,13.4,5.6C41,14.2,43,18.9,43,24c0,10.5-8.5,19-19,19c0,0,0,0,0,0h0c-3.2,0-6.3-0.8-9.1-2.3L4.9,43.3z"></path>
                    <path fill="#40c351" d="M35.2,12.8c-3-3-6.9-4.6-11.2-4.6C15.3,8.2,8.2,15.3,8.2,24c0,3,0.8,5.9,2.4,8.4L11,33l-1.6,5.8l6-1.6l0.6,0.3c2.4,1.4,5.2,2.2,8,2.2h0c8.7,0,15.8-7.1,15.8-15.8C39.8,19.8,38.2,15.8,35.2,12.8z"></path>
                    <path fill="#fff" d="M19.3,16c-0.4-0.8-0.7-0.8-1.1-0.8c-0.3,0-0.6,0-0.9,0s-0.8,0.1-1.3,0.6c-0.4,0.5-1.7,1.6-1.7,4s1.7,4.6,1.9,4.9s3.3,5.3,8.1,7.2c4,1.6,4.8,1.3,5.7,1.2c0.9-0.1,2.8-1.1,3.2-2.3c0.4-1.1,0.4-2.1,0.3-2.3c-0.1-0.2-0.4-0.3-0.9-0.6s-2.8-1.4-3.2-1.5c-0.4-0.2-0.8-0.2-1.1,0.2c-0.3,0.5-1.2,1.5-1.5,1.9c-0.3,0.3-0.6,0.4-1,0.1c-0.5-0.2-2-0.7-3.8-2.4c-1.4-1.3-2.4-2.8-2.6-3.3c-0.3-0.5,0-0.7,0.2-1c0.2-0.2,0.5-0.6,0.7-0.8c0.2-0.3,0.3-0.5,0.5-0.8c0.2-0.3,0.1-0.6,0-0.8C20.6,19.3,19.7,17,19.3,16z"></path>
                  </svg>
                </button>
                <button class="delete-btn" (click)="deleteProperty(property.id)" title="Delete Property" (click)="$event.stopPropagation()">
                  🗑️
                </button>
              </div>
            </div>
            <p class="location">📍 {{property.location}}</p>
            <p class="price">₹{{formatPrice(property.price)}}</p>
            
            <div class="property-details">
              {{property.area}} sq ft • {{property.bedrooms}} BHK • {{property.bathrooms}} Bath
            </div>
          </div>
        </div>
      </div>

      <div class="empty-state" *ngIf="properties.length === 0">
        <div class="empty-icon">🏠</div>
        <h2>No Properties Listed</h2>
        <p>Start by adding your first property listing</p>
        <button class="add-btn" (click)="addProperty()">
          + Add Your First Property
        </button>
      </div>
    </div>

    <!-- Media Viewer Modal -->
    <div class="media-modal" *ngIf="showMediaViewer" (click)="closeMediaViewer()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <button class="close-btn" (click)="closeMediaViewer()">×</button>
        
        <div class="media-viewer">
          <div class="main-media">
            <img *ngIf="isCurrentMediaImage()" [src]="currentMedia" alt="Property media">
            <video *ngIf="!isCurrentMediaImage()" [src]="currentMedia" controls></video>
          </div>
          
          <div class="media-nav" *ngIf="selectedPropertyMedia.length > 1">
            <button class="nav-btn" (click)="previousMedia()">‹</button>
            <span class="media-counter">{{currentMediaIndex + 1}} / {{selectedPropertyMedia.length}}</span>
            <button class="nav-btn" (click)="nextMedia()">›</button>
          </div>
          
          <div class="media-thumbnails" *ngIf="selectedPropertyMedia.length > 1">
            <div class="thumb" 
                 *ngFor="let media of selectedPropertyMedia; let i = index" 
                 [class.active]="i === currentMediaIndex"
                 (click)="selectMedia(i)">
              <img *ngIf="selectedProperty && selectedProperty.images.includes(media)" [src]="media" alt="Thumb">
              <div *ngIf="selectedProperty && !selectedProperty.images.includes(media)" class="video-thumb">🎥</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Floating Add Button -->
    <div class="floating-add-container">
      <button class="floating-add-btn" (click)="addProperty()">
        +
      </button>
      <span class="add-tooltip">+ Add New Property</span>
    </div>
  `,
  styles: [`
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
      min-height: 100vh;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      padding: 20px;
      border-radius: 16px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    h1 {
      color: #2c3e50;
      margin: 0;
      font-size: 28px;
    }

    .add-btn {
      background: #27ae60;
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 8px;
      font-size: 16px;
      cursor: pointer;
      transition: background 0.3s;
      -webkit-tap-highlight-color: transparent;
      touch-action: manipulation;
    }

    .add-btn:hover {
      background: #229954;
    }

    .properties-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 20px;
    }

    .property-card {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 8px 32px rgba(0,0,0,0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .property-card:hover {
      transform: translateY(-8px) scale(1.02);
      box-shadow: 0 12px 40px rgba(0,0,0,0.2);
    }

    .property-image {
      position: relative;
      height: 200px;
      overflow: hidden;
    }

    .property-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .no-image {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #ecf0f1;
      color: #7f8c8d;
      font-size: 24px;
    }

    .property-type {
      position: absolute;
      top: 10px;
      right: 10px;
      background: rgba(0,0,0,0.7);
      color: white;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
    }

    .media-count {
      position: absolute;
      bottom: 10px;
      right: 10px;
      background: rgba(0,0,0,0.7);
      color: white;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
    }

    .media-modal {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.9);
      z-index: 1000;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .modal-content {
      position: relative;
      max-width: 90vw;
      max-height: 90vh;
      background: white;
      border-radius: 12px;
      overflow: hidden;
    }

    .close-btn {
      position: absolute;
      top: 15px;
      right: 15px;
      background: rgba(0,0,0,0.7);
      color: white;
      border: none;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      font-size: 24px;
      cursor: pointer;
      z-index: 1001;
    }

    .media-viewer {
      display: flex;
      flex-direction: column;
    }

    .main-media {
      width: 100%;
      height: 60vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #000;
    }

    .main-media img, .main-media video {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
    }

    .media-nav {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 15px;
      background: #f8f9fa;
      gap: 20px;
    }

    .nav-btn {
      background: #3498db;
      color: white;
      border: none;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      font-size: 20px;
      cursor: pointer;
    }

    .media-counter {
      font-weight: bold;
      color: #2c3e50;
    }

    .media-thumbnails {
      display: flex;
      gap: 10px;
      padding: 15px;
      background: #f8f9fa;
      overflow-x: auto;
      justify-content: center;
    }

    .thumb {
      width: 60px;
      height: 60px;
      border-radius: 6px;
      overflow: hidden;
      cursor: pointer;
      border: 2px solid transparent;
      flex-shrink: 0;
    }

    .thumb.active {
      border-color: #3498db;
    }

    .thumb img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .video-thumb {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #ecf0f1;
      font-size: 20px;
    }

    .property-content {
      padding: 20px;
    }

    .title-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
    }

    .property-content h3 {
      margin: 0;
      color: #2c3e50;
      font-size: 18px;
      line-height: 1.3;
      flex: 1;
    }

    .location {
      color: #7f8c8d;
      margin: 0 0 10px 0;
      font-size: 14px;
    }

    .price {
      color: #27ae60;
      font-size: 20px;
      font-weight: bold;
      margin: 0 0 15px 0;
    }

    .property-details {
      margin-bottom: 15px;
      font-size: 14px;
      color: #7f8c8d;
      line-height: 1.4;
    }



    .action-buttons {
      display: flex;
      gap: 8px;
      flex-shrink: 0;
    }

    .share-btn, .delete-btn {
      border: none;
      padding: 6px;
      border-radius: 50%;
      font-size: 14px;
      cursor: pointer;
      transition: all 0.3s;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .share-btn {
      background: #25d366;
      color: white;
    }

    .delete-btn {
      background: #e74c3c;
      color: white;
    }

    .share-btn:hover {
      background: #128c7e;
    }

    .floating-add-container {
      position: fixed;
      bottom: 30px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 999;
    }

    .floating-add-btn {
      width: 60px;
      height: 60px;
      background: #27ae60;
      color: white;
      border: none;
      border-radius: 50%;
      font-size: 24px;
      cursor: pointer;
      box-shadow: 0 4px 20px rgba(39, 174, 96, 0.4);
      transition: all 0.3s ease;
      -webkit-tap-highlight-color: transparent;
      touch-action: manipulation;
      position: relative;
    }

    .add-tooltip {
      position: absolute;
      bottom: 75px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(0, 0, 0, 0.8);
      color: white;
      padding: 8px 16px;
      border-radius: 20px;
      font-size: 14px;
      white-space: nowrap;
      opacity: 0;
      visibility: hidden;
      transition: all 0.3s ease;
      pointer-events: none;
    }

    .add-tooltip::after {
      content: '';
      position: absolute;
      top: 100%;
      left: 50%;
      transform: translateX(-50%);
      border: 6px solid transparent;
      border-top-color: rgba(0, 0, 0, 0.8);
    }

    .floating-add-container:hover .floating-add-btn {
      background: #229954;
      transform: scale(1.1);
      box-shadow: 0 6px 25px rgba(39, 174, 96, 0.6);
    }

    .floating-add-container:hover .add-tooltip {
      opacity: 1;
      visibility: visible;
      transform: translateX(-50%) translateY(-5px);
    }

    .floating-add-btn:active {
      transform: scale(0.95);
    }

    .empty-state {
      text-align: center;
      padding: 60px 20px;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      border-radius: 16px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .empty-icon {
      font-size: 64px;
      margin-bottom: 20px;
    }

    .empty-state h2 {
      color: #2c3e50;
      margin-bottom: 10px;
    }

    .empty-state p {
      color: #7f8c8d;
      margin-bottom: 30px;
    }

    @media (max-width: 768px) {
      .container {
        padding: 5px;
      }

      .header {
        flex-direction: column;
        gap: 15px;
        text-align: center;
        padding: 15px;
      }

      h1 {
        font-size: 24px;
      }

      .add-btn {
        padding: 16px 24px;
        font-size: 18px;
        width: 100%;
      }

      .properties-grid {
        grid-template-columns: 1fr;
        gap: 15px;
      }

      .property-card {
        border-radius: 12px;
      }

      .property-content {
        padding: 15px;
      }

      .property-content h3 {
        font-size: 16px;
      }

      .price {
        font-size: 18px;
      }

      .property-details {
        font-size: 13px;
      }

      .share-btn, .delete-btn {
        width: 28px;
        height: 28px;
        font-size: 12px;
      }

      .empty-state {
        padding: 40px 15px;
      }

      .empty-icon {
        font-size: 48px;
      }

      .modal-content {
        max-width: 95vw;
        max-height: 95vh;
      }

      .main-media {
        height: 50vh;
      }

      .media-thumbnails {
        padding: 10px 5px;
      }

      .thumb {
        width: 50px;
        height: 50px;
      }

      .floating-add-container {
        bottom: 20px;
      }

      .floating-add-btn {
        width: 56px;
        height: 56px;
        font-size: 22px;
      }

      .add-tooltip {
        font-size: 13px;
        padding: 6px 12px;
        bottom: 70px;
      }
    }
  `]
})
export class PropertyListComponent implements OnInit {
  properties: Property[] = [];
  showMediaViewer = false;
  selectedProperty: Property | null = null;
  selectedPropertyMedia: string[] = [];
  currentMediaIndex = 0;
  currentMedia = '';

  constructor(
    private propertyService: PropertyService,
    private router: Router
  ) {}

  ngOnInit() {
    this.propertyService.properties$.subscribe(properties => {
      this.properties = properties;
    });
  }

  addProperty() {
    this.router.navigate(['/add-property']);
  }

  viewProperty(id: string) {
    this.router.navigate(['/property', id]);
  }

  shareOnWhatsApp(property: Property) {
    const whatsappUrl = this.propertyService.generateWhatsAppLink(property);
    window.open(whatsappUrl, '_blank');
  }

  deleteProperty(id: string) {
    if (confirm('Are you sure you want to delete this property?')) {
      this.propertyService.deleteProperty(id);
    }
  }

  formatPrice(price: number): string {
    return price.toLocaleString('en-IN');
  }

  getTotalMedia(property: Property): number {
    return property.images.length + property.videos.length;
  }

  openMediaViewer(property: Property) {
    this.selectedProperty = property;
    this.selectedPropertyMedia = [...property.images, ...property.videos];
    this.currentMediaIndex = 0;
    this.currentMedia = this.selectedPropertyMedia[0] || '';
    this.showMediaViewer = true;
  }

  closeMediaViewer() {
    this.showMediaViewer = false;
    this.selectedProperty = null;
  }

  isCurrentMediaImage(): boolean {
    return this.selectedProperty?.images.includes(this.currentMedia) || false;
  }

  previousMedia() {
    this.currentMediaIndex = this.currentMediaIndex > 0 ? this.currentMediaIndex - 1 : this.selectedPropertyMedia.length - 1;
    this.currentMedia = this.selectedPropertyMedia[this.currentMediaIndex];
  }

  nextMedia() {
    this.currentMediaIndex = this.currentMediaIndex < this.selectedPropertyMedia.length - 1 ? this.currentMediaIndex + 1 : 0;
    this.currentMedia = this.selectedPropertyMedia[this.currentMediaIndex];
  }

  selectMedia(index: number) {
    this.currentMediaIndex = index;
    this.currentMedia = this.selectedPropertyMedia[index];
  }
}