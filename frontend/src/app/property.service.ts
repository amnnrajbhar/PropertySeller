import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  area: number;
  bedrooms: number;
  bathrooms: number;
  propertyType: string;
  images: string[];
  videos: string[];
  contactName: string;
  contactPhone: string;
  createdAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class PropertyService {
  private properties = new BehaviorSubject<Property[]>([]);
  public properties$ = this.properties.asObservable();

  constructor() {
    this.loadProperties();
  }

  private loadProperties() {
    const stored = localStorage.getItem('properties');
    if (stored) {
      this.properties.next(JSON.parse(stored));
    }
  }

  private saveProperties(properties: Property[]) {
    localStorage.setItem('properties', JSON.stringify(properties));
    this.properties.next(properties);
  }

  addProperty(property: Omit<Property, 'id' | 'createdAt'>): string {
    const newProperty: Property = {
      ...property,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    
    const current = this.properties.value;
    this.saveProperties([newProperty, ...current]);
    return newProperty.id;
  }

  getProperty(id: string): Property | undefined {
    return this.properties.value.find(p => p.id === id);
  }

  deleteProperty(id: string) {
    const current = this.properties.value;
    const filtered = current.filter(p => p.id !== id);
    this.saveProperties(filtered);
  }

  generateWhatsAppLink(property: Property): string {
    const message = `🏠 *${property.title}*\n\n` +
      `💰 Price: ₹${property.price.toLocaleString('en-IN')}\n` +
      `📍 Location: ${property.location}\n` +
      `📐 Area: ${property.area} sq ft\n` +
      `🛏️ Bedrooms: ${property.bedrooms}\n` +
      `🚿 Bathrooms: ${property.bathrooms}\n` +
      `🏢 Type: ${property.propertyType}\n\n` +
      `📝 Description: ${property.description}\n\n` +
      `📞 Contact: ${property.contactName} - ${property.contactPhone}`;
    
    return `https://wa.me/?text=${encodeURIComponent(message)}`;
  }
}