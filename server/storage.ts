import {
  type User,
  type UpsertUser,
  type Product,
  type InsertProduct,
  type Category,
  type InsertCategory,
  type CompanyInfo,
  type InsertCompanyInfo,
  type SupportEmail,
  type InsertSupportEmail,
  type ProductClick,
  type InsertProductClick,
  type UserInvitation,
  type InsertUserInvitation,
  type Role,
  users,
  products,
  categories,
  companyInfos,
  supportEmails,
  productClicks,
  userInvitations,
  roles,
} from "@shared/schema";
import { randomUUID } from "crypto";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  getAllUsers(): Promise<User[]>;
  updateUserRole(id: string, roleId: number, companyIds?: number[]): Promise<User | undefined>;
  createInvitedUser(email: string, roleId: number, companyIds?: number[]): Promise<User>;
  deletePendingUser(email: string): Promise<void>;
  
  getProducts(): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: number): Promise<boolean>;
  
  getCategories(): Promise<Category[]>;
  getCategory(id: number): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: number, category: Partial<InsertCategory>): Promise<Category | undefined>;
  deleteCategory(id: number): Promise<boolean>;
  
  getCompanyInfos(): Promise<CompanyInfo[]>;
  createCompanyInfo(companyInfo: InsertCompanyInfo): Promise<CompanyInfo>;
  updateCompanyInfo(id: number, companyInfo: Partial<InsertCompanyInfo>): Promise<CompanyInfo | undefined>;
  deleteCompanyInfo(id: number): Promise<boolean>;
  
  getSupportEmails(): Promise<SupportEmail[]>;
  createSupportEmail(email: InsertSupportEmail): Promise<SupportEmail>;
  markEmailAsRead(id: number): Promise<boolean>;
  
  trackProductClick(click: InsertProductClick): Promise<ProductClick>;
  
  getRoles(): Promise<import("@shared/schema").Role[]>;
  getRole(roleId: number): Promise<import("@shared/schema").Role | undefined>;
  updateRolePages(roleId: number, allowedPages: string[]): Promise<import("@shared/schema").Role | undefined>;
}

export class MemStorage implements IStorage {
  // MemStorage is not actively used - DatabaseStorage is used instead
  async getUser(id: string): Promise<User | undefined> {
    throw new Error("MemStorage not implemented - use DatabaseStorage");
  }
  async getUserByEmail(email: string): Promise<User | undefined> {
    throw new Error("MemStorage not implemented - use DatabaseStorage");
  }
  async upsertUser(userData: UpsertUser): Promise<User> {
    throw new Error("MemStorage not implemented - use DatabaseStorage");
  }
  async getAllUsers(): Promise<User[]> {
    throw new Error("MemStorage not implemented - use DatabaseStorage");
  }
  async updateUserRole(id: string, roleId: number, companyIds?: number[]): Promise<User | undefined> {
    throw new Error("MemStorage not implemented - use DatabaseStorage");
  }
  async createInvitedUser(email: string, roleId: number, companyIds?: number[]): Promise<User> {
    throw new Error("MemStorage not implemented - use DatabaseStorage");
  }
  async deletePendingUser(email: string): Promise<void> {
    throw new Error("MemStorage not implemented - use DatabaseStorage");
  }
  async getProducts(): Promise<Product[]> {
    throw new Error("MemStorage not implemented - use DatabaseStorage");
  }
  async getProduct(id: number): Promise<Product | undefined> {
    throw new Error("MemStorage not implemented - use DatabaseStorage");
  }
  async createProduct(product: InsertProduct): Promise<Product> {
    throw new Error("MemStorage not implemented - use DatabaseStorage");
  }
  async updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | undefined> {
    throw new Error("MemStorage not implemented - use DatabaseStorage");
  }
  async deleteProduct(id: number): Promise<boolean> {
    throw new Error("MemStorage not implemented - use DatabaseStorage");
  }
  async getCategories(): Promise<Category[]> {
    throw new Error("MemStorage not implemented - use DatabaseStorage");
  }
  async getCategory(id: number): Promise<Category | undefined> {
    throw new Error("MemStorage not implemented - use DatabaseStorage");
  }
  async createCategory(category: InsertCategory): Promise<Category> {
    throw new Error("MemStorage not implemented - use DatabaseStorage");
  }
  async updateCategory(id: number, category: Partial<InsertCategory>): Promise<Category | undefined> {
    throw new Error("MemStorage not implemented - use DatabaseStorage");
  }
  async deleteCategory(id: number): Promise<boolean> {
    throw new Error("MemStorage not implemented - use DatabaseStorage");
  }
  async getCompanyInfos(): Promise<CompanyInfo[]> {
    throw new Error("MemStorage not implemented - use DatabaseStorage");
  }
  async createCompanyInfo(companyInfo: InsertCompanyInfo): Promise<CompanyInfo> {
    throw new Error("MemStorage not implemented - use DatabaseStorage");
  }
  async updateCompanyInfo(id: number, companyInfo: Partial<InsertCompanyInfo>): Promise<CompanyInfo | undefined> {
    throw new Error("MemStorage not implemented - use DatabaseStorage");
  }
  async deleteCompanyInfo(id: number): Promise<boolean> {
    throw new Error("MemStorage not implemented - use DatabaseStorage");
  }
  async getSupportEmails(): Promise<SupportEmail[]> {
    throw new Error("MemStorage not implemented - use DatabaseStorage");
  }
  async createSupportEmail(email: InsertSupportEmail): Promise<SupportEmail> {
    throw new Error("MemStorage not implemented - use DatabaseStorage");
  }
  async markEmailAsRead(id: number): Promise<boolean> {
    throw new Error("MemStorage not implemented - use DatabaseStorage");
  }
  async trackProductClick(click: InsertProductClick): Promise<ProductClick> {
    throw new Error("MemStorage not implemented - use DatabaseStorage");
  }
  async getRoles(): Promise<Role[]> {
    throw new Error("MemStorage not implemented - use DatabaseStorage");
  }
  async getRole(roleId: number): Promise<Role | undefined> {
    throw new Error("MemStorage not implemented - use DatabaseStorage");
  }
  async updateRolePages(roleId: number, allowedPages: string[]): Promise<Role | undefined> {
    throw new Error("MemStorage not implemented - use DatabaseStorage");
  }
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
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

  async updateUserRole(id: string, roleId: number, companyIds?: number[]): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set({
        roleId,
        companyIds: companyIds || [],
        updatedAt: new Date(),
      })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async createInvitedUser(email: string, roleId: number, companyIds?: number[]): Promise<User> {
    const tempId = `pending_${email}`;
    const [user] = await db
      .insert(users)
      .values({
        id: tempId,
        email,
        roleId,
        companyIds: companyIds || [],
        verificationStatus: "pending",
        isActive: false, // Inactive until they verify
      })
      .returning();
    return user;
  }

  async deletePendingUser(email: string): Promise<void> {
    await db
      .delete(users)
      .where(eq(users.email, email));
  }

  async getProducts(): Promise<Product[]> {
    return await db.select().from(products);
  }

  async getProduct(id: number): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product;
  }

  async createProduct(productData: InsertProduct): Promise<Product> {
    const [product] = await db.insert(products).values(productData).returning();
    return product;
  }

  async updateProduct(id: number, updates: Partial<InsertProduct>): Promise<Product | undefined> {
    const [product] = await db
      .update(products)
      .set(updates)
      .where(eq(products.id, id))
      .returning();
    return product;
  }

  async deleteProduct(id: number): Promise<boolean> {
    const result = await db.delete(products).where(eq(products.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }

  async getCategories(): Promise<Category[]> {
    return await db.select().from(categories);
  }

  async getCategory(id: number): Promise<Category | undefined> {
    const [category] = await db.select().from(categories).where(eq(categories.id, id));
    return category;
  }

  async createCategory(categoryData: InsertCategory): Promise<Category> {
    const [category] = await db.insert(categories).values(categoryData).returning();
    return category;
  }

  async updateCategory(id: number, updates: Partial<InsertCategory>): Promise<Category | undefined> {
    const [category] = await db
      .update(categories)
      .set(updates)
      .where(eq(categories.id, id))
      .returning();
    return category;
  }

  async deleteCategory(id: number): Promise<boolean> {
    const result = await db.delete(categories).where(eq(categories.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }

  async getCompanyInfos(): Promise<CompanyInfo[]> {
    return await db.select().from(companyInfos);
  }

  async createCompanyInfo(companyData: InsertCompanyInfo): Promise<CompanyInfo> {
    const [company] = await db.insert(companyInfos).values(companyData).returning();
    return company;
  }

  async updateCompanyInfo(id: number, updates: Partial<InsertCompanyInfo>): Promise<CompanyInfo | undefined> {
    const [company] = await db
      .update(companyInfos)
      .set(updates)
      .where(eq(companyInfos.id, id))
      .returning();
    return company;
  }

  async deleteCompanyInfo(id: number): Promise<boolean> {
    const result = await db.delete(companyInfos).where(eq(companyInfos.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }

  async getSupportEmails(): Promise<SupportEmail[]> {
    return await db.select().from(supportEmails);
  }

  async createSupportEmail(emailData: InsertSupportEmail): Promise<SupportEmail> {
    const [email] = await db.insert(supportEmails).values(emailData).returning();
    return email;
  }

  async markEmailAsRead(id: number): Promise<boolean> {
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

  async getRoles(): Promise<Role[]> {
    return await db.select().from(roles);
  }

  async getRole(roleId: number): Promise<Role | undefined> {
    const [role] = await db.select().from(roles).where(eq(roles.id, roleId));
    return role;
  }

  async updateRolePages(roleId: number, allowedPages: string[]): Promise<Role | undefined> {
    const [role] = await db
      .update(roles)
      .set({ allowedPages })
      .where(eq(roles.id, roleId))
      .returning();
    return role;
  }
}

export const storage = new DatabaseStorage();
