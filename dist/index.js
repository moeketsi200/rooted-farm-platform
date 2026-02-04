// server/index.ts
import express from "express";

// server/routes.ts
import { createServer } from "http";

// server/storage.ts
import { randomUUID } from "crypto";
var MemStorage = class {
  users;
  crops;
  donations;
  constructor() {
    this.users = /* @__PURE__ */ new Map();
    this.crops = /* @__PURE__ */ new Map();
    this.donations = /* @__PURE__ */ new Map();
  }
  // User methods
  async getUser(id) {
    return this.users.get(id);
  }
  async getUserByEmail(email) {
    return Array.from(this.users.values()).find((user) => user.email === email);
  }
  async createUser(insertUser) {
    const id = randomUUID();
    const user = {
      ...insertUser,
      id,
      location: insertUser.location || null,
      createdAt: /* @__PURE__ */ new Date()
    };
    this.users.set(id, user);
    return user;
  }
  // Crop methods
  async getCrop(id) {
    return this.crops.get(id);
  }
  async getCropsByFarmer(farmerId) {
    return Array.from(this.crops.values()).filter((crop) => crop.farmerId === farmerId);
  }
  async getMarketplaceCrops() {
    return Array.from(this.crops.values()).filter((crop) => !crop.donationFlag && crop.status === "available");
  }
  async createCrop(insertCrop) {
    const id = randomUUID();
    const crop = {
      ...insertCrop,
      id,
      status: "available",
      donationFlag: insertCrop.donationFlag || false,
      createdAt: /* @__PURE__ */ new Date()
    };
    this.crops.set(id, crop);
    return crop;
  }
  async updateCrop(id, updates) {
    const crop = this.crops.get(id);
    if (!crop) return void 0;
    const updatedCrop = { ...crop, ...updates };
    this.crops.set(id, updatedCrop);
    return updatedCrop;
  }
  // Donation methods
  async getDonation(id) {
    return this.donations.get(id);
  }
  async getDonationRequests() {
    return Array.from(this.donations.values()).filter((donation) => donation.status === "pending");
  }
  async createDonation(insertDonation) {
    const id = randomUUID();
    const donation = {
      ...insertDonation,
      id,
      status: "pending",
      requestedAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    };
    this.donations.set(id, donation);
    return donation;
  }
  async updateDonation(id, updates) {
    const donation = this.donations.get(id);
    if (!donation) return void 0;
    const updatedDonation = {
      ...donation,
      ...updates,
      updatedAt: /* @__PURE__ */ new Date()
    };
    this.donations.set(id, updatedDonation);
    return updatedDonation;
  }
};
var storage = new MemStorage();

// shared/schema.ts
import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, decimal, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  userType: text("user_type").notNull(),
  // 'farmer' | 'buyer'
  location: text("location"),
  createdAt: timestamp("created_at").default(sql`now()`)
});
var crops = pgTable("crops", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  farmerId: varchar("farmer_id").notNull().references(() => users.id),
  cropName: text("crop_name").notNull(),
  quantity: integer("quantity").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  harvestDate: timestamp("harvest_date").notNull(),
  donationFlag: boolean("donation_flag").default(false),
  status: text("status").default("available"),
  // 'available' | 'sold' | 'donated'
  createdAt: timestamp("created_at").default(sql`now()`)
});
var donations = pgTable("donations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  cropId: varchar("crop_id").notNull().references(() => crops.id),
  communityName: text("community_name").notNull(),
  status: text("status").default("pending"),
  // 'pending' | 'accepted' | 'declined' | 'completed'
  requestedAt: timestamp("requested_at").default(sql`now()`),
  updatedAt: timestamp("updated_at").default(sql`now()`)
});
var insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true
});
var insertCropSchema = createInsertSchema(crops).omit({
  id: true,
  createdAt: true
});
var insertDonationSchema = createInsertSchema(donations).omit({
  id: true,
  requestedAt: true,
  updatedAt: true
});

// server/routes.ts
import { z } from "zod";
function registerRoutes(app2) {
  app2.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      res.json(user);
    } catch (error) {
      res.status(400).json({ message: "Invalid user data" });
    }
  });
  app2.get("/api/users/:id", async (req, res) => {
    try {
      const user = await storage.getUser(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.get("/api/users/email/:email", async (req, res) => {
    try {
      const user = await storage.getUserByEmail(req.params.email);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.post("/api/crops", async (req, res) => {
    try {
      const cropData = insertCropSchema.parse(req.body);
      const crop = await storage.createCrop(cropData);
      res.json(crop);
    } catch (error) {
      res.status(400).json({ message: "Invalid crop data" });
    }
  });
  app2.get("/api/crops/marketplace", async (req, res) => {
    try {
      const crops2 = await storage.getMarketplaceCrops();
      res.json(crops2);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.get("/api/crops/:farmerId", async (req, res) => {
    try {
      const crops2 = await storage.getCropsByFarmer(req.params.farmerId);
      res.json(crops2);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.patch("/api/crops/:id", async (req, res) => {
    try {
      const updateSchema = z.object({
        quantity: z.number().optional(),
        price: z.number().optional(),
        donationFlag: z.boolean().optional(),
        status: z.string().optional()
      });
      const updates = updateSchema.parse(req.body);
      const crop = await storage.updateCrop(req.params.id, updates);
      if (!crop) {
        return res.status(404).json({ message: "Crop not found" });
      }
      res.json(crop);
    } catch (error) {
      res.status(400).json({ message: "Invalid update data" });
    }
  });
  app2.post("/api/donations", async (req, res) => {
    try {
      const donationData = insertDonationSchema.parse(req.body);
      const donation = await storage.createDonation(donationData);
      res.json(donation);
    } catch (error) {
      res.status(400).json({ message: "Invalid donation data" });
    }
  });
  app2.get("/api/donations", async (req, res) => {
    try {
      const donations2 = await storage.getDonationRequests();
      res.json(donations2);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.patch("/api/donations/:id", async (req, res) => {
    try {
      const updateSchema = z.object({
        status: z.enum(["pending", "accepted", "declined", "completed"])
      });
      const updates = updateSchema.parse(req.body);
      const donation = await storage.updateDonation(req.params.id, updates);
      if (!donation) {
        return res.status(404).json({ message: "Donation not found" });
      }
      res.json(donation);
    } catch (error) {
      res.status(400).json({ message: "Invalid update data" });
    }
  });
  app2.get("/api/weather", async (req, res) => {
    try {
      const location = req.query.location || "San Francisco";
      const apiKey = process.env.OPENWEATHER_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ message: "Weather service not configured" });
      }
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&appid=${apiKey}&units=metric`
      );
      if (!response.ok) {
        throw new Error("Weather API request failed");
      }
      const weatherData = await response.json();
      res.json(weatherData);
    } catch (error) {
      console.error("Weather API error:", error);
      res.status(500).json({ message: "Failed to fetch weather data" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/index.ts
var app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      console.log(logLine);
    }
  });
  next();
});
var server = registerRoutes(app);
app.use((err, _req, res, _next) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(status).json({ message });
});
if (process.env.NODE_ENV !== "production") {
  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    console.log(`serving on port ${port}`);
  });
}
var index_default = app;
export {
  index_default as default
};
