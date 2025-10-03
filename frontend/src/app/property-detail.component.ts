import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { PropertyService, Property } from './property.service';

@Component({
  selector: 'app-property-detail',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container" *ngIf="property">
      <button class="back-btn" (click)="goBack()">←</button>
      
      <div class="property-detail">
        <!-- Media Gallery -->
        <div class="media-section" *ngIf="property.images.length > 0 || property.videos.length > 0">
          <div class="main-image" (click)="openFullscreen()">
            <img *ngIf="selectedMedia && isImage(selectedMedia)" [src]="selectedMedia" [alt]="property.title">
            <video *ngIf="selectedMedia && !isImage(selectedMedia)" [src]="selectedMedia" controls></video>
            <div class="fullscreen-hint">🔍 Click to view fullscreen</div>
          </div>
          
          <div class="media-thumbnails" *ngIf="allMedia.length > 1">
            <div class="thumbnail" 
                 *ngFor="let media of allMedia" 
                 [class.active]="media === selectedMedia"
                 (click)="selectMedia(media)">
              <img *ngIf="isImage(media)" [src]="media" alt="Thumbnail">
              <div *ngIf="!isImage(media)" class="video-thumb">🎥</div>
            </div>
          </div>
        </div>

        <!-- Property Info -->
        <div class="info-section">
          <div class="property-header">
            <h1>{{property.title}}</h1>
            <div class="property-type">{{property.propertyType}}</div>
          </div>

          <div class="price-location">
            <div class="price">₹{{formatPrice(property.price)}}</div>
            <div class="location">📍 {{property.location}}</div>
          </div>

          <div class="property-specs">
            {{property.area}} sq ft • {{property.bedrooms}} BHK • {{property.bathrooms}} Bath
          </div>

          <div class="description">
            <h3>Description</h3>
            <p>{{property.description}}</p>
          </div>

          <div class="contact-info">
            <h3>Contact Information</h3>
            <div class="contact-details">
              <div class="contact-item">
                <span class="label">Name:</span>
                <span class="value">{{property.contactName}}</span>
              </div>
              <div class="contact-item">
                <span class="label">Phone:</span>
                <span class="value">{{property.contactPhone}}</span>
              </div>
            </div>
          </div>

          <div class="actions">
            <button class="call-btn" (click)="callOwner()">
              📞 Call
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="container" *ngIf="!property">
      <div class="not-found">
        <h2>Property Not Found</h2>
        <button class="back-btn" (click)="goBack()">← Back to Properties</button>
      </div>
    </div>

    <!-- Fullscreen Media Viewer -->
    <div class="media-modal" *ngIf="showFullscreen" (click)="closeFullscreen()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <button class="close-btn" (click)="closeFullscreen()">×</button>
        
        <div class="media-viewer">
          <div class="main-media">
            <img *ngIf="isImage(currentFullscreenMedia)" [src]="currentFullscreenMedia" alt="Property media">
            <video *ngIf="!isImage(currentFullscreenMedia)" [src]="currentFullscreenMedia" controls></video>
          </div>
          
          <div class="media-nav" *ngIf="allMedia.length > 1">
            <button class="nav-btn" (click)="previousFullscreenMedia()">‹</button>
            <span class="media-counter">{{currentFullscreenIndex + 1}} / {{allMedia.length}}</span>
            <button class="nav-btn" (click)="nextFullscreenMedia()">›</button>
          </div>
          
          <div class="media-thumbnails" *ngIf="allMedia.length > 1">
            <div class="thumb" 
                 *ngFor="let media of allMedia; let i = index" 
                 [class.active]="i === currentFullscreenIndex"
                 (click)="selectFullscreenMedia(i)">
              <img *ngIf="isImage(media)" [src]="media" alt="Thumb">
              <div *ngIf="!isImage(media)" class="video-thumb">🎥</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
      min-height: 100vh;
    }

    .back-btn {
      position: absolute;
      top: 20px;
      left: 20px;
      background: #95a5a6;
      color: white;
      border: none;
      padding: 8px 12px;
      border-radius: 50%;
      cursor: pointer;
      transition: background 0.3s;
      z-index: 10;
      font-size: 16px;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .back-btn:hover {
      background: #7f8c8d;
    }

    .share-btn {
      background: transparent;
      border: none;
      padding: 8px;
      border-radius: 50%;
      cursor: pointer;
      transition: all 0.3s;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .share-btn:hover {
      background: #128c7e;
    }

    .property-detail {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 30px;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 8px 32px rgba(0,0,0,0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .media-section {
      padding: 0;
    }

    .main-image {
      height: 400px;
      overflow: hidden;
      position: relative;
      cursor: pointer;
    }

    .fullscreen-hint {
      position: absolute;
      bottom: 10px;
      left: 10px;
      background: rgba(0,0,0,0.7);
      color: white;
      padding: 6px 12px;
      border-radius: 4px;
      font-size: 12px;
      opacity: 0;
      transition: opacity 0.3s;
    }

    .main-image:hover .fullscreen-hint {
      opacity: 1;
    }

    .main-image img, .main-image video {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .media-thumbnails {
      display: flex;
      gap: 10px;
      padding: 15px;
      overflow-x: auto;
    }

    .thumbnail {
      flex-shrink: 0;
      width: 80px;
      height: 60px;
      border-radius: 6px;
      overflow: hidden;
      cursor: pointer;
      border: 2px solid transparent;
      transition: border-color 0.3s;
    }

    .thumbnail.active {
      border-color: #3498db;
    }

    .thumbnail img {
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
      color: #7f8c8d;
      font-size: 20px;
    }

    .info-section {
      padding: 30px;
    }

    .property-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 20px;
    }

    .property-header h1 {
      color: #2c3e50;
      margin: 0;
      font-size: 28px;
      line-height: 1.3;
    }

    .property-type {
      background: #3498db;
      color: white;
      padding: 6px 12px;
      border-radius: 6px;
      font-size: 14px;
    }

    .price-location {
      margin-bottom: 25px;
    }

    .price {
      color: #27ae60;
      font-size: 32px;
      font-weight: bold;
      margin-bottom: 5px;
    }

    .location {
      color: #7f8c8d;
      font-size: 16px;
    }

    .property-specs {
      margin-bottom: 30px;
      padding: 15px 20px;
      background: #f8f9fa;
      border-radius: 8px;
      color: #2c3e50;
      font-size: 16px;
      font-weight: 500;
      text-align: center;
    }

    .description {
      margin-bottom: 30px;
    }

    .description h3 {
      color: #2c3e50;
      margin-bottom: 15px;
    }

    .description p {
      color: #7f8c8d;
      line-height: 1.6;
    }

    .contact-info {
      margin-bottom: 30px;
    }

    .contact-info h3 {
      color: #2c3e50;
      margin-bottom: 15px;
    }

    .contact-details {
      background: #f8f9fa;
      padding: 20px;
      border-radius: 8px;
    }

    .contact-item {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
    }

    .contact-item:last-child {
      margin-bottom: 0;
    }

    .contact-item .label {
      color: #7f8c8d;
      font-weight: 600;
    }

    .contact-item .value {
      color: #2c3e50;
    }

    .actions {
      display: flex;
      gap: 15px;
    }

    .call-btn, .whatsapp-btn {
      flex: 1;
      padding: 15px;
      border: none;
      border-radius: 8px;
      font-size: 16px;
      cursor: pointer;
      transition: all 0.3s;
      -webkit-tap-highlight-color: transparent;
      touch-action: manipulation;
    }

    .call-btn {
      background: #3498db;
      color: white;
    }

    .call-btn:hover {
      background: #2980b9;
    }

    .whatsapp-btn {
      background: #25d366;
      color: white;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
    }

    .whatsapp-btn:hover {
      background: #128c7e;
    }

    .not-found {
      text-align: center;
      padding: 60px 20px;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      border-radius: 16px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
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

    .media-viewer .main-media {
      width: 100%;
      height: 60vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #000;
      cursor: default;
    }

    .media-viewer .main-media img, .media-viewer .main-media video {
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

    .media-viewer .media-thumbnails {
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

    .thumb .video-thumb {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #ecf0f1;
      font-size: 20px;
    }

    @media (max-width: 768px) {
      .container {
        padding: 5px;
      }

      .header {
        flex-direction: column;
        gap: 10px;
        padding: 15px;
      }

      .back-btn {
        padding: 14px 20px;
        font-size: 16px;
        flex: 1;
      }
      
      .share-btn {
        width: 44px;
        height: 44px;
        font-size: 18px;
      }

      .property-detail {
        grid-template-columns: 1fr;
        border-radius: 12px;
      }

      .main-image {
        height: 250px;
      }

      .media-thumbnails {
        padding: 10px;
      }

      .info-section {
        padding: 20px 15px;
      }

      .property-header {
        flex-direction: column;
        gap: 15px;
        align-items: flex-start;
      }

      .property-header h1 {
        font-size: 22px;
      }

      .price {
        font-size: 28px;
      }

      .property-specs {
        padding: 12px 15px;
        font-size: 14px;
      }

      .contact-details {
        padding: 15px;
      }

      .actions {
        flex-direction: column;
        gap: 10px;
      }

      .call-btn {
        padding: 18px;
        font-size: 18px;
        flex: 1;
      }
      
      .whatsapp-btn {
        width: 56px;
        height: 56px;
        font-size: 20px;
      }
    }
  `]
})
export class PropertyDetailComponent implements OnInit {
  property: Property | undefined;
  selectedMedia: string = '';
  allMedia: string[] = [];
  showFullscreen = false;
  currentFullscreenMedia = '';
  currentFullscreenIndex = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private propertyService: PropertyService
  ) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.property = this.propertyService.getProperty(id);
      if (this.property) {
        this.allMedia = [...this.property.images, ...this.property.videos];
        this.selectedMedia = this.allMedia[0] || '';
      }
    }
  }

  selectMedia(media: string) {
    this.selectedMedia = media;
  }

  isImage(url: string): boolean {
    return this.property?.images.includes(url) || false;
  }

  goBack() {
    this.router.navigate(['/']);
  }

  shareOnWhatsApp() {
    if (this.property) {
      const whatsappUrl = this.propertyService.generateWhatsAppLink(this.property);
      window.open(whatsappUrl, '_blank');
    }
  }

  callOwner() {
    if (this.property) {
      window.open(`tel:${this.property.contactPhone}`, '_self');
    }
  }

  formatPrice(price: number): string {
    return price.toLocaleString('en-IN');
  }

  openFullscreen() {
    this.currentFullscreenIndex = this.allMedia.indexOf(this.selectedMedia);
    this.currentFullscreenMedia = this.selectedMedia;
    this.showFullscreen = true;
  }

  closeFullscreen() {
    this.showFullscreen = false;
  }

  previousFullscreenMedia() {
    this.currentFullscreenIndex = this.currentFullscreenIndex > 0 ? this.currentFullscreenIndex - 1 : this.allMedia.length - 1;
    this.currentFullscreenMedia = this.allMedia[this.currentFullscreenIndex];
  }

  nextFullscreenMedia() {
    this.currentFullscreenIndex = this.currentFullscreenIndex < this.allMedia.length - 1 ? this.currentFullscreenIndex + 1 : 0;
    this.currentFullscreenMedia = this.allMedia[this.currentFullscreenIndex];
  }

  selectFullscreenMedia(index: number) {
    this.currentFullscreenIndex = index;
    this.currentFullscreenMedia = this.allMedia[index];
  }
}