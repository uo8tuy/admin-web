import { sql } from "drizzle-orm";
import { pgTable, text, varchar, boolean, timestamp, integer, bigint, jsonb, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// Roles table - stores all system roles
export const roles = pgTable("roles", {
  id: bigint("id", { mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
  name: text("name").notNull().unique(),
  level: integer("level").notNull(),
  permissions: text("permissions").array().notNull().default(sql`ARRAY[]::text[]`),
  allowedPages: text("allowed_pages").array().notNull().default(sql`ARRAY[]::text[]`),
  isSystem: boolean("is_system").notNull().default(true),
  description: text("description"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// User storage table for Replit Auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey(), // Replit Auth provides string IDs (or temporary ID for pending invites)
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  roleId: bigint("role_id", { mode: "number" }).references(() => roles.id),
  companyIds: bigint("company_ids", { mode: "number" }).array().default(sql`ARRAY[]::bigint[]`),
  verificationStatus: varchar("verification_status").notNull().default("pending"), // "pending" | "verified"
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const categories = pgTable("categories", {
  id: bigint("id", { mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
  name: text("name").notNull(),
  isActive: boolean("is_active").notNull().default(true),
  parentId: bigint("parent_id", { mode: "number" }),
});

export const companyInfos = pgTable("company_infos", {
  id: bigint("id", { mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
  name: text("name").notNull(),
  foundedDate: text("founded_date"),
  logo: text("logo"),
  founder: text("founder"),
  country: text("country"),
  location: text("location"),
  contactInfo: jsonb("contact_info"), // { email, phone, website, facebook, instagram, twitter, linkedin, youtube }
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const products = pgTable("products", {
  id: bigint("id", { mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  performance: text("performance"),
  categoryId: bigint("category_id", { mode: "number" }).notNull(),
  companyId: bigint("company_id", { mode: "number" }),
  mainImage: text("main_image"),
  additionalImages: text("additional_images").array().default(sql`ARRAY[]::text[]`),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const productClicks = pgTable("product_clicks", {
  id: bigint("id", { mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
  productId: bigint("product_id", { mode: "number" }).notNull(),
  clickedAt: timestamp("clicked_at").notNull().defaultNow(),
});

export const supportEmails = pgTable("support_emails", {
  id: bigint("id", { mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
  from: text("from").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  isRead: boolean("is_read").notNull().default(false),
  receivedAt: timestamp("received_at").notNull().defaultNow(),
});

export const orders = pgTable("orders", {
  id: bigint("id", { mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
  productName: text("product_name").notNull(),
  location: text("location").notNull(),
  quantity: integer("quantity").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  preferredDate: text("preferred_date").notNull(),
  additionalNotes: text("additional_notes"),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const userInvitations = pgTable("user_invitations", {
  id: bigint("id", { mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
  email: varchar("email").notNull().unique(),
  roleId: bigint("role_id", { mode: "number" }).notNull().references(() => roles.id),
  companyIds: bigint("company_ids", { mode: "number" }).array().default(sql`ARRAY[]::bigint[]`),
  inviterId: varchar("inviter_id").notNull(), // References users.id (varchar)
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  acceptedAt: timestamp("accepted_at"),
});

export const insertRoleSchema = createInsertSchema(roles).omit({
  id: true,
  createdAt: true,
});

export const insertUserSchema = createInsertSchema(users).omit({
  createdAt: true,
  updatedAt: true,
});

export const insertCategorySchema = createInsertSchema(categories).omit({
  id: true,
});

export const insertCompanyInfoSchema = createInsertSchema(companyInfos).omit({
  id: true,
  createdAt: true,
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
  createdAt: true,
});

export const insertSupportEmailSchema = createInsertSchema(supportEmails).omit({
  id: true,
  receivedAt: true,
});

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  status: true,
  createdAt: true,
});

export const insertUserInvitationSchema = createInsertSchema(userInvitations).omit({
  id: true,
  status: true,
  createdAt: true,
  acceptedAt: true,
});

export type InsertRole = z.infer<typeof insertRoleSchema>;
export type Role = typeof roles.$inferSelect;
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Category = typeof categories.$inferSelect;
export type InsertCompanyInfo = z.infer<typeof insertCompanyInfoSchema>;
export type CompanyInfo = typeof companyInfos.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;
export type InsertProductClick = { productId: number };
export type ProductClick = typeof productClicks.$inferSelect;
export type InsertUserInvitation = z.infer<typeof insertUserInvitationSchema>;
export type UserInvitation = typeof userInvitations.$inferSelect;
export type InsertSupportEmail = z.infer<typeof insertSupportEmailSchema>;
export type SupportEmail = typeof supportEmails.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof orders.$inferSelect;
