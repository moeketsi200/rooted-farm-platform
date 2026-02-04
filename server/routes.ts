import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertCropSchema, insertDonationSchema } from "@shared/schema";
import { z } from "zod";

export function registerRoutes(app: Express): Server {
  // User routes
  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      res.json(user);
    } catch (error) {
      res.status(400).json({ message: "Invalid user data" });
    }
  });

  app.get("/api/users/:id", async (req, res) => {
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

  app.get("/api/users/email/:email", async (req, res) => {
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

  // Crop routes
  app.post("/api/crops", async (req, res) => {
    try {
      const cropData = insertCropSchema.parse(req.body);
      const crop = await storage.createCrop(cropData);
      res.json(crop);
    } catch (error) {
      res.status(400).json({ message: "Invalid crop data" });
    }
  });

  app.get("/api/crops/marketplace", async (req, res) => {
    try {
      const crops = await storage.getMarketplaceCrops();
      res.json(crops);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/crops/:farmerId", async (req, res) => {
    try {
      const crops = await storage.getCropsByFarmer(req.params.farmerId);
      res.json(crops);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.patch("/api/crops/:id", async (req, res) => {
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

  // Donation routes
  app.post("/api/donations", async (req, res) => {
    try {
      const donationData = insertDonationSchema.parse(req.body);
      const donation = await storage.createDonation(donationData);
      res.json(donation);
    } catch (error) {
      res.status(400).json({ message: "Invalid donation data" });
    }
  });

  app.get("/api/donations", async (req, res) => {
    try {
      const donations = await storage.getDonationRequests();
      res.json(donations);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.patch("/api/donations/:id", async (req, res) => {
    try {
      const updateSchema = z.object({
        status: z.enum(['pending', 'accepted', 'declined', 'completed'])
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

  // Weather route
  app.get("/api/weather", async (req, res) => {
    try {
      const location = req.query.location as string || "San Francisco";
      const apiKey = process.env.OPENWEATHER_API_KEY;
      
      if (!apiKey) {
        return res.status(500).json({ message: "Weather service not configured" });
      }

      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&appid=${apiKey}&units=metric`
      );

      if (!response.ok) {
        throw new Error('Weather API request failed');
      }

      const weatherData = await response.json();
      res.json(weatherData);
    } catch (error) {
      console.error('Weather API error:', error);
      res.status(500).json({ message: "Failed to fetch weather data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
