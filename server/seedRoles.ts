import { db } from "./db";
import { roles } from "@shared/schema";
import { ROLES, ROLE_PERMISSIONS } from "@shared/roles";

async function seedRoles() {
  console.log("Seeding roles...");
  
  const rolesToInsert = Object.entries(ROLES).map(([key, role]) => ({
    name: role.name,
    level: role.level,
    permissions: ROLE_PERMISSIONS[key as keyof typeof ROLES],
    isSystem: role.isSystem,
    description: role.description,
  }));

  try {
    // Insert all roles (upsert if they exist)
    for (const role of rolesToInsert) {
      await db.insert(roles)
        .values(role)
        .onConflictDoNothing({ target: roles.name });
      console.log(`✓ Seeded role: ${role.name}`);
    }
    
    console.log("✅ All roles seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding roles:", error);
    process.exit(1);
  }
}

seedRoles();
