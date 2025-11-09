import {
  type User,
  type UpsertUser,
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
  users,
  products,
  categories,
  brands,
  supportEmails,
  productClicks,
} from "@shared/schema";
import { randomUUID } from "crypto";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  getAllUsers(): Promise<User[]>;
  updateUserRole(id: string, role: string, roleLevel: number, permissions: string[], brandIds?: string[]): Promise<User | undefined>;
  
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
  private users: Map<string, User>;
  private products: Map<string, Product>;
  private categories: Map<string, Category>;
  private brands: Map<string, Brand>;
  private supportEmails: Map<string, SupportEmail>;
  private productClicks: Map<string, ProductClick>;

  constructor() {
    this.users = new Map();
    this.products = new Map();
    this.categories = new Map();
    this.brands = new Map();
    this.supportEmails = new Map();
    this.productClicks = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const existing = this.users.get(userData.id || "");
    const now = new Date();
    
    if (existing) {
      const updated: User = {
        ...existing,
        ...userData,
        updatedAt: now,
      };
      this.users.set(updated.id, updated);
      return updated;
    }
    
    const id = userData.id || randomUUID();
    const user: User = {
      id,
      email: userData.email || null,
      firstName: userData.firstName || null,
      lastName: userData.lastName || null,
      profileImageUrl: userData.profileImageUrl || null,
      role: userData.role || "viewer",
      roleLevel: userData.roleLevel || 10,
      permissions: userData.permissions || [],
      isActive: userData.isActive !== undefined ? userData.isActive : true,
      createdAt: now,
      updatedAt: now,
    };
    this.users.set(id, user);
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async updateUserRole(id: string, role: string, roleLevel: number, permissions: string[], brandIds?: string[]): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updated: User = {
      ...user,
      role,
      roleLevel,
      permissions,
      brandIds: brandIds || [],
      updatedAt: new Date(),
    };
    this.users.set(id, updated);
    return updated;
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
      id,
      name: insertProduct.name,
      description: insertProduct.description,
      performance: insertProduct.performance || null,
      categoryId: insertProduct.categoryId,
      brandId: insertProduct.brandId || null,
      mainImage: insertProduct.mainImage || null,
      additionalImages: insertProduct.additionalImages || null,
      isActive: insertProduct.isActive !== undefined ? insertProduct.isActive : true,
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
    const category: Category = {
      id,
      name: insertCategory.name,
      isActive: insertCategory.isActive !== undefined ? insertCategory.isActive : true,
      parentId: insertCategory.parentId || null,
    };
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
    const brand: Brand = {
      id,
      name: insertBrand.name,
      isActive: insertBrand.isActive !== undefined ? insertBrand.isActive : true,
    };
    this.brands.set(id, brand);
    return brand;
  }

  async getSupportEmails(): Promise<SupportEmail[]> {
    return Array.from(this.supportEmails.values());
  }

  async createSupportEmail(insertEmail: InsertSupportEmail): Promise<SupportEmail> {
    const id = randomUUID();
    const email: SupportEmail = {
      id,
      from: insertEmail.from,
      subject: insertEmail.subject,
      message: insertEmail.message,
      isRead: insertEmail.isRead !== undefined ? insertEmail.isRead : false,
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

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  async updateUserRole(id: string, role: string, roleLevel: number, permissions: string[], brandIds?: string[]): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set({
        role,
        roleLevel,
        permissions,
        brandIds: brandIds || [],
        updatedAt: new Date(),
      })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async getProducts(): Promise<Product[]> {
    return await db.select().from(products);
  }

  async getProduct(id: string): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product;
  }

  async createProduct(productData: InsertProduct): Promise<Product> {
    const [product] = await db.insert(products).values(productData).returning();
    return product;
  }

  async updateProduct(id: string, updates: Partial<InsertProduct>): Promise<Product | undefined> {
    const [product] = await db
      .update(products)
      .set(updates)
      .where(eq(products.id, id))
      .returning();
    return product;
  }

  async deleteProduct(id: string): Promise<boolean> {
    const result = await db.delete(products).where(eq(products.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }

  async getCategories(): Promise<Category[]> {
    return await db.select().from(categories);
  }

  async getCategory(id: string): Promise<Category | undefined> {
    const [category] = await db.select().from(categories).where(eq(categories.id, id));
    return category;
  }

  async createCategory(categoryData: InsertCategory): Promise<Category> {
    const [category] = await db.insert(categories).values(categoryData).returning();
    return category;
  }

  async updateCategory(id: string, updates: Partial<InsertCategory>): Promise<Category | undefined> {
    const [category] = await db
      .update(categories)
      .set(updates)
      .where(eq(categories.id, id))
      .returning();
    return category;
  }

  async deleteCategory(id: string): Promise<boolean> {
    const result = await db.delete(categories).where(eq(categories.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }

  async getBrands(): Promise<Brand[]> {
    return await db.select().from(brands);
  }

  async createBrand(brandData: InsertBrand): Promise<Brand> {
    const [brand] = await db.insert(brands).values(brandData).returning();
    return brand;
  }

  async getSupportEmails(): Promise<SupportEmail[]> {
    return await db.select().from(supportEmails);
  }

  async createSupportEmail(emailData: InsertSupportEmail): Promise<SupportEmail> {
    const [email] = await db.insert(supportEmails).values(emailData).returning();
    return email;
  }

  async markEmailAsRead(id: string): Promise<boolean> {
    const result = await db
      .update(supportEmails)
      .set({ isRead: true })
      .where(eq(supportEmails.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }

  async trackProductClick(click: InsertProductClick): Promise<ProductClick> {
    const [productClick] = await db.insert(productClicks).values(click).returning();
    return productClick;
  }
}

export const storage = new DatabaseStorage();
