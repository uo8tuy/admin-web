import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import {
  insertProductSchema,
  insertCategorySchema,
  insertBrandSchema,
  insertSupportEmailSchema,
} from "@shared/schema";
import { canManageUserByRoleId, getAssignableRolesByRoleId } from "@shared/roles";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  await setupAuth(app);

  app.get('/admin/auth/user', async (req: any, res) => {
    try {
      if (!req.isAuthenticated() || !req.user?.claims?.sub) {
        return res.json(null);
      }
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user ?? null);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  app.get('/admin/users', isAuthenticated, async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  app.get('/admin/roles', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const currentUser = await storage.getUser(userId);
      
      // Only Super Admin (roleId=1) and Admin (roleId=2) can view roles
      if (!currentUser || (currentUser.roleId !== 1 && currentUser.roleId !== 2)) {
        return res.status(403).json({ message: "Forbidden: Admin access required" });
      }

      const roles = await storage.getRoles();
      res.json(roles);
    } catch (error) {
      console.error("Error fetching roles:", error);
      res.status(500).json({ message: "Failed to fetch roles" });
    }
  });

  app.get('/admin/roles/:id', isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const role = await storage.getRole(parseInt(id));
      
      if (!role) {
        return res.status(404).json({ message: "Role not found" });
      }

      res.json(role);
    } catch (error) {
      console.error("Error fetching role:", error);
      res.status(500).json({ message: "Failed to fetch role" });
    }
  });

  app.patch('/admin/roles/:id/pages', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const currentUser = await storage.getUser(userId);
      
      // Only Super Admin (roleId=1) and Admin (roleId=2) can update role pages
      if (!currentUser || (currentUser.roleId !== 1 && currentUser.roleId !== 2)) {
        return res.status(403).json({ message: "Forbidden: Admin access required" });
      }

      const { id } = req.params;
      const { allowedPages } = req.body;
      
      const role = await storage.updateRolePages(parseInt(id), allowedPages);
      if (!role) {
        return res.status(404).json({ message: "Role not found" });
      }

      res.json(role);
    } catch (error) {
      console.error("Error updating role pages:", error);
      res.status(500).json({ message: "Failed to update role pages" });
    }
  });

  app.patch('/admin/users/:id', isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.claims.sub;
      
      // Only allow users to update their own profile
      if (id !== userId) {
        return res.status(403).json({ message: "You can only update your own profile" });
      }

      const { firstName, lastName } = req.body;
      const user = await storage.upsertUser({
        id,
        firstName,
        lastName,
      });
      
      res.json(user);
    } catch (error) {
      console.error("Error updating user profile:", error);
      res.status(500).json({ message: "Failed to update profile" });
    }
  });

  app.patch('/admin/users/:id/role', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const currentUser = await storage.getUser(userId);
      
      if (!currentUser || !currentUser.roleId) {
        return res.status(403).json({ message: "Forbidden: No role assigned" });
      }

      const { id } = req.params;
      const { roleId, brandIds } = req.body;
      
      // Get target user
      const targetUser = await storage.getUser(id);
      if (!targetUser) {
        return res.status(404).json({ message: "User not found" });
      }

      // Check if current user can manage target user
      if (!canManageUserByRoleId(currentUser.roleId, targetUser.roleId)) {
        return res.status(403).json({ message: "Forbidden: Cannot manage this user" });
      }

      // Check if current user can assign the new role
      const assignableRoleIds = getAssignableRolesByRoleId(currentUser.roleId);
      if (!assignableRoleIds.includes(roleId)) {
        return res.status(403).json({ message: "Forbidden: Cannot assign this role" });
      }

      const user = await storage.updateUserRole(id, roleId, brandIds);
      res.json(user);
    } catch (error) {
      console.error("Error updating user role:", error);
      res.status(500).json({ message: "Failed to update user role" });
    }
  });

  app.post('/admin/users/invite', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const currentUser = await storage.getUser(userId);
      
      if (!currentUser || !currentUser.roleId) {
        return res.status(403).json({ message: "Forbidden: No role assigned" });
      }

      const { email, roleId, brandIds } = req.body;
      
      if (!email || !roleId) {
        return res.status(400).json({ message: "Email and role are required" });
      }

      // Check if current user can assign this role
      const assignableRoleIds = getAssignableRolesByRoleId(currentUser.roleId);
      if (!assignableRoleIds.includes(roleId)) {
        return res.status(403).json({ message: "Forbidden: Cannot assign this role" });
      }

      // Check if user already exists
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: "User with this email already exists" });
      }

      // Create pending user
      const user = await storage.createInvitedUser(email, roleId, brandIds);
      
      // TODO: Send invitation email here
      
      res.json({ 
        message: "User invited successfully. They will receive an email with instructions.",
        user,
      });
    } catch (error) {
      console.error("Error inviting user:", error);
      res.status(500).json({ message: "Failed to invite user" });
    }
  });

  app.get('/admin/products', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const currentUser = await storage.getUser(userId);
      
      if (!currentUser) {
        return res.status(401).json({ message: "User not found" });
      }

      let products = await storage.getProducts();
      
      // Filter by brand if user has brand restrictions
      if (currentUser.brandIds && currentUser.brandIds.length > 0) {
        products = products.filter(p => 
          p.brandId && currentUser.brandIds?.includes(p.brandId)
        );
      }
      
      res.json(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.get('/admin/products/:id', isAuthenticated, async (req, res) => {
    try {
      const product = await storage.getProduct(parseInt(req.params.id));
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  app.post('/admin/products', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const currentUser = await storage.getUser(userId);
      
      if (!currentUser) {
        return res.status(401).json({ message: "User not found" });
      }

      const validatedData = insertProductSchema.parse(req.body);
      
      // Check if user can manage this brand
      if (currentUser.brandIds && currentUser.brandIds.length > 0) {
        if (!validatedData.brandId || !currentUser.brandIds.includes(validatedData.brandId)) {
          return res.status(403).json({ message: "You can only create products for your assigned brands" });
        }
      }
      
      const product = await storage.createProduct(validatedData);
      res.status(201).json(product);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid product data", errors: error.errors });
      }
      console.error("Error creating product:", error);
      res.status(500).json({ message: "Failed to create product" });
    }
  });

  app.patch('/admin/products/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const currentUser = await storage.getUser(userId);
      
      if (!currentUser) {
        return res.status(401).json({ message: "User not found" });
      }

      const productId = parseInt(req.params.id);
      const existingProduct = await storage.getProduct(productId);
      if (!existingProduct) {
        return res.status(404).json({ message: "Product not found" });
      }

      // Check if user can manage this brand
      if (currentUser.brandIds && currentUser.brandIds.length > 0) {
        if (!existingProduct.brandId || !currentUser.brandIds.includes(existingProduct.brandId)) {
          return res.status(403).json({ message: "You can only edit products from your assigned brands" });
        }
      }
      
      const product = await storage.updateProduct(productId, req.body);
      res.json(product);
    } catch (error) {
      console.error("Error updating product:", error);
      res.status(500).json({ message: "Failed to update product" });
    }
  });

  app.delete('/admin/products/:id', isAuthenticated, async (req, res) => {
    try {
      const success = await storage.deleteProduct(parseInt(req.params.id));
      if (!success) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json({ message: "Product deleted" });
    } catch (error) {
      console.error("Error deleting product:", error);
      res.status(500).json({ message: "Failed to delete product" });
    }
  });

  app.get('/admin/categories', isAuthenticated, async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  app.post('/admin/categories', isAuthenticated, async (req, res) => {
    try {
      const validatedData = insertCategorySchema.parse(req.body);
      const category = await storage.createCategory(validatedData);
      res.status(201).json(category);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid category data", errors: error.errors });
      }
      console.error("Error creating category:", error);
      res.status(500).json({ message: "Failed to create category" });
    }
  });

  app.patch('/admin/categories/:id', isAuthenticated, async (req, res) => {
    try {
      const category = await storage.updateCategory(parseInt(req.params.id), req.body);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      res.json(category);
    } catch (error) {
      console.error("Error updating category:", error);
      res.status(500).json({ message: "Failed to update category" });
    }
  });

  app.delete('/admin/categories/:id', isAuthenticated, async (req, res) => {
    try {
      const success = await storage.deleteCategory(parseInt(req.params.id));
      if (!success) {
        return res.status(404).json({ message: "Category not found" });
      }
      res.json({ message: "Category deleted" });
    } catch (error) {
      console.error("Error deleting category:", error);
      res.status(500).json({ message: "Failed to delete category" });
    }
  });

  app.get('/admin/brands', isAuthenticated, async (req, res) => {
    try {
      const brands = await storage.getBrands();
      res.json(brands);
    } catch (error) {
      console.error("Error fetching brands:", error);
      res.status(500).json({ message: "Failed to fetch brands" });
    }
  });

  app.post('/admin/brands', isAuthenticated, async (req, res) => {
    try {
      const validatedData = insertBrandSchema.parse(req.body);
      const brand = await storage.createBrand(validatedData);
      res.status(201).json(brand);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid brand data", errors: error.errors });
      }
      console.error("Error creating brand:", error);
      res.status(500).json({ message: "Failed to create brand" });
    }
  });

  app.get('/admin/emails', isAuthenticated, async (req, res) => {
    try {
      const emails = await storage.getSupportEmails();
      res.json(emails);
    } catch (error) {
      console.error("Error fetching emails:", error);
      res.status(500).json({ message: "Failed to fetch emails" });
    }
  });

  app.post('/admin/emails', isAuthenticated, async (req, res) => {
    try {
      const validatedData = insertSupportEmailSchema.parse(req.body);
      const email = await storage.createSupportEmail(validatedData);
      res.status(201).json(email);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid email data", errors: error.errors });
      }
      console.error("Error creating email:", error);
      res.status(500).json({ message: "Failed to create email" });
    }
  });

  app.patch('/admin/emails/:id/read', isAuthenticated, async (req, res) => {
    try {
      const success = await storage.markEmailAsRead(parseInt(req.params.id));
      if (!success) {
        return res.status(404).json({ message: "Email not found" });
      }
      res.json({ message: "Email marked as read" });
    } catch (error) {
      console.error("Error marking email as read:", error);
      res.status(500).json({ message: "Failed to mark email as read" });
    }
  });

  app.post('/admin/analytics/click', isAuthenticated, async (req, res) => {
    try {
      const schema = z.object({ productId: z.number() });
      const validatedData = schema.parse(req.body);
      const click = await storage.trackProductClick(validatedData);
      res.status(201).json(click);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid click data", errors: error.errors });
      }
      console.error("Error tracking click:", error);
      res.status(500).json({ message: "Failed to track click" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
