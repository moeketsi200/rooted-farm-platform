import { type User, type InsertUser, type Crop, type InsertCrop, type Donation, type InsertDonation } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Crop methods
  getCrop(id: string): Promise<Crop | undefined>;
  getCropsByFarmer(farmerId: string): Promise<Crop[]>;
  getMarketplaceCrops(): Promise<Crop[]>;
  createCrop(crop: InsertCrop): Promise<Crop>;
  updateCrop(id: string, updates: Partial<Crop>): Promise<Crop | undefined>;
  
  // Donation methods
  getDonation(id: string): Promise<Donation | undefined>;
  getDonationRequests(): Promise<Donation[]>;
  createDonation(donation: InsertDonation): Promise<Donation>;
  updateDonation(id: string, updates: Partial<Donation>): Promise<Donation | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private crops: Map<string, Crop>;
  private donations: Map<string, Donation>;

  constructor() {
    this.users = new Map();
    this.crops = new Map();
    this.donations = new Map();
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id,
      location: insertUser.location || null,
      createdAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  // Crop methods
  async getCrop(id: string): Promise<Crop | undefined> {
    return this.crops.get(id);
  }

  async getCropsByFarmer(farmerId: string): Promise<Crop[]> {
    return Array.from(this.crops.values()).filter(crop => crop.farmerId === farmerId);
  }

  async getMarketplaceCrops(): Promise<Crop[]> {
    return Array.from(this.crops.values()).filter(crop => !crop.donationFlag && crop.status === 'available');
  }

  async createCrop(insertCrop: InsertCrop): Promise<Crop> {
    const id = randomUUID();
    const crop: Crop = {
      ...insertCrop,
      id,
      status: 'available',
      donationFlag: insertCrop.donationFlag || false,
      createdAt: new Date()
    };
    this.crops.set(id, crop);
    return crop;
  }

  async updateCrop(id: string, updates: Partial<Crop>): Promise<Crop | undefined> {
    const crop = this.crops.get(id);
    if (!crop) return undefined;
    
    const updatedCrop = { ...crop, ...updates };
    this.crops.set(id, updatedCrop);
    return updatedCrop;
  }

  // Donation methods
  async getDonation(id: string): Promise<Donation | undefined> {
    return this.donations.get(id);
  }

  async getDonationRequests(): Promise<Donation[]> {
    return Array.from(this.donations.values()).filter(donation => donation.status === 'pending');
  }

  async createDonation(insertDonation: InsertDonation): Promise<Donation> {
    const id = randomUUID();
    const donation: Donation = {
      ...insertDonation,
      id,
      status: 'pending',
      requestedAt: new Date(),
      updatedAt: new Date()
    };
    this.donations.set(id, donation);
    return donation;
  }

  async updateDonation(id: string, updates: Partial<Donation>): Promise<Donation | undefined> {
    const donation = this.donations.get(id);
    if (!donation) return undefined;
    
    const updatedDonation = { 
      ...donation, 
      ...updates, 
      updatedAt: new Date() 
    };
    this.donations.set(id, updatedDonation);
    return updatedDonation;
  }
}

export const storage = new MemStorage();
