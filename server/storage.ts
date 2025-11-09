import {
  type AdminUser,
  type InsertAdminUser,
  type Product,
  type InsertProduct,
  type Category,
  type InsertCategory,
  type Brand,
  type InsertBrand,
  type SupportEmail,
  type InsertSupportEmail,
  type ProductClick,
  type InsertProductClick,
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getAdminUser(id: string): Promise<AdminUser | undefined>;
  getAdminUserByUsername(username: string): Promise<AdminUser | undefined>;
  createAdminUser(user: InsertAdminUser): Promise<AdminUser>;
  
  getProducts(): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: string): Promise<boolean>;
  
  getCategories(): Promise<Category[]>;
  getCategory(id: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: string, category: Partial<InsertCategory>): Promise<Category | undefined>;
  deleteCategory(id: string): Promise<boolean>;
  
  getBrands(): Promise<Brand[]>;
  createBrand(brand: InsertBrand): Promise<Brand>;
  
  getSupportEmails(): Promise<SupportEmail[]>;
  createSupportEmail(email: InsertSupportEmail): Promise<SupportEmail>;
  markEmailAsRead(id: string): Promise<boolean>;
  
  trackProductClick(click: InsertProductClick): Promise<ProductClick>;
}

export class MemStorage implements IStorage {
  private adminUsers: Map<string, AdminUser>;
  private products: Map<string, Product>;
  private categories: Map<string, Category>;
  private brands: Map<string, Brand>;
  private supportEmails: Map<string, SupportEmail>;
  private productClicks: Map<string, ProductClick>;

  constructor() {
    this.adminUsers = new Map();
    this.products = new Map();
    this.categories = new Map();
    this.brands = new Map();
    this.supportEmails = new Map();
    this.productClicks = new Map();
  }

  async getAdminUser(id: string): Promise<AdminUser | undefined> {
    return this.adminUsers.get(id);
  }

  async getAdminUserByUsername(username: string): Promise<AdminUser | undefined> {
    return Array.from(this.adminUsers.values()).find(
      (user) => user.username === username,
    );
  }

  async createAdminUser(insertUser: InsertAdminUser): Promise<AdminUser> {
    const id = randomUUID();
    const user: AdminUser = {
      ...insertUser,
      id,
      createdAt: new Date(),
    };
    this.adminUsers.set(id, user);
    return user;
  }

  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProduct(id: string): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = randomUUID();
    const product: Product = {
      ...insertProduct,
      id,
      createdAt: new Date(),
    };
    this.products.set(id, product);
    return product;
  }

  async updateProduct(id: string, updates: Partial<InsertProduct>): Promise<Product | undefined> {
    const product = this.products.get(id);
    if (!product) return undefined;
    const updated = { ...product, ...updates };
    this.products.set(id, updated);
    return updated;
  }

  async deleteProduct(id: string): Promise<boolean> {
    return this.products.delete(id);
  }

  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async getCategory(id: string): Promise<Category | undefined> {
    return this.categories.get(id);
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = randomUUID();
    const category: Category = { ...insertCategory, id };
    this.categories.set(id, category);
    return category;
  }

  async updateCategory(id: string, updates: Partial<InsertCategory>): Promise<Category | undefined> {
    const category = this.categories.get(id);
    if (!category) return undefined;
    const updated = { ...category, ...updates };
    this.categories.set(id, updated);
    return updated;
  }

  async deleteCategory(id: string): Promise<boolean> {
    return this.categories.delete(id);
  }

  async getBrands(): Promise<Brand[]> {
    return Array.from(this.brands.values());
  }

  async createBrand(insertBrand: InsertBrand): Promise<Brand> {
    const id = randomUUID();
    const brand: Brand = { ...insertBrand, id };
    this.brands.set(id, brand);
    return brand;
  }

  async getSupportEmails(): Promise<SupportEmail[]> {
    return Array.from(this.supportEmails.values());
  }

  async createSupportEmail(insertEmail: InsertSupportEmail): Promise<SupportEmail> {
    const id = randomUUID();
    const email: SupportEmail = {
      ...insertEmail,
      id,
      receivedAt: new Date(),
    };
    this.supportEmails.set(id, email);
    return email;
  }

  async markEmailAsRead(id: string): Promise<boolean> {
    const email = this.supportEmails.get(id);
    if (!email) return false;
    email.isRead = true;
    this.supportEmails.set(id, email);
    return true;
  }

  async trackProductClick(click: InsertProductClick): Promise<ProductClick> {
    const id = randomUUID();
    const productClick: ProductClick = {
      id,
      productId: click.productId,
      clickedAt: new Date(),
    };
    this.productClicks.set(id, productClick);
    return productClick;
  }
}

export const storage = new MemStorage();
