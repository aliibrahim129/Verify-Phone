const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const axios = require("axios");
const { z } = require("zod");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;
const MONGO_URL = process.env.MONGO_URL;
const PHONE_VALIDATOR_URL = process.env.PHONE_VALIDATOR_URL || "http://localhost:4001";

// --- Mongo connection ---
mongoose.set("strictQuery", true);
mongoose
  .connect(MONGO_URL)
  .then(() => console.log("[server] Mongo connected"))
  .catch((err) => {
    console.error("[server] Mongo connection error:", err.message);
    process.exit(1);
  });

// --- Item model ---
const itemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    mobileNumber: { type: String },
    phoneMeta: {
      countryCode: String,
      countryName: String,
      operatorName: String,
    },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  },
  { timestamps: true }
);
const Item = mongoose.model("Item", itemSchema);
// NEW: Category model
const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
  },
  { timestamps: true }
);
const Category = mongoose.model("Category", categorySchema);

// --- Validation schema for create ---
const CreateItemSchema = z.object({
  name: z.string().min(1, "name is required"),
  description: z.string().optional(),
  mobileNumber: z.string().trim().optional(),
  defaultCountry: z.string().length(2).optional(), // optional hint, not stored
  categoryId: z.string().regex(/^[0-9a-fA-F]{24}$/).optional(), // optional ObjectId
});

const UpdateItemSchema = z.object({
  name: z.string().min(1, "name cannot be empty").optional(),
  description: z.string().optional(),
  mobileNumber: z.union([z.string(), z.null()]).optional(),
  defaultCountry: z.string().length(2).optional(), // only used for validation, not stored
   categoryId: z.union([z.string().regex(/^[0-9a-fA-F]{24}$/), z.null()]).optional(), // optional ObjectId or null to clear
});

// --- Categories: create
app.post("/api/categories", async (req, res) => {
  try {
    const { name } = req.body || {};
    if (!name || !name.trim()) return res.status(400).json({ error: "name is required" });
   const cat = await Category.create({ name: name.trim() });
    res.status(201).json(cat);
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ error: "Category name already exists" });
    console.error("[POST /api/categories] error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});
// --- Categories: getList
app.get("/api/categories", async (_req, res) => {
  try {
    const cats = await Category.find().sort({ name: 1 });
    res.json(cats);
  } catch (err) {
    console.error("[GET /api/categories] error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// --- Create item ---
app.post("/api/items", async (req, res) => {
  try {
    const parsed = CreateItemSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.issues.map(i => i.message).join(", ") });
    }
    const { name, description, mobileNumber, defaultCountry, categoryId } = parsed.data;

    let phoneMeta = undefined;

    if (mobileNumber && mobileNumber.trim()) {
      try {
        const { data } = await axios.post(
          `${PHONE_VALIDATOR_URL}/validate`,
          { mobile: mobileNumber, defaultCountry },
          { timeout: 8000 }
        );
        phoneMeta = data; // { countryCode, countryName, operatorName }
      } catch (e) {
        if (e.response && e.response.status === 400) {
          return res.status(400).json(e.response.data);
        }
        return res.status(502).json({ error: "Phone validation service unavailable" });
      }
    }

       // Validate categoryId if provided
    let category = undefined;
    if (categoryId) {
      const exists = await Category.exists({ _id: categoryId });
      if (!exists) return res.status(400).json({ error: "Invalid categoryId" });
      category = categoryId;
    }

    const item = await Item.create({
      name,
      description,
      mobileNumber: mobileNumber || undefined,
      phoneMeta,
       categoryId: category,
    });

    return res.status(201).json(item);
  } catch (err) {
    console.error("[POST /api/items] error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/items", async (req, res) => {
  try {
    const items = await Item.find().sort({ createdAt: -1 }).populate("categoryId", "name");
    res.json(items);
  } catch (err) {
    console.error("[GET /api/items] error:", err);NP
    res.status(500).json({ error: "Internal server error" });
  }
});

// --- GET one item by id (optional but handy) ---
app.get("/api/items/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid id" });
    }
    const item = await Item.findById(id).populate("categoryId", "name");
    if (!item) return res.status(404).json({ error: "Not found" });
    res.json(item);
  } catch (err) {
    console.error("[GET /api/items/:id] error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// --- DELETE one item by id ---
app.delete("/api/items/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid id" });
    }
    const deleted = await Item.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: "Not found" });
    res.json({ deleted: true, id });
  } catch (err) {
    console.error("[DELETE /api/items/:id] error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// --- UPDATE one item by id ---
app.put("/api/items/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid id" });
    }

    const parsed = UpdateItemSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        error: parsed.error.issues.map(i => i.message).join(", "),
      });
    }
    const { name, description, mobileNumber, defaultCountry } = parsed.data;

    const existing = await Item.findById(id);
    if (!existing) return res.status(404).json({ error: "Not found" });

    const $set = {};
    const $unset = {};

    if (typeof name !== "undefined") $set.name = name;
    if (typeof description !== "undefined") $set.description = description;

    // Handle mobileNumber changes
    if (Object.prototype.hasOwnProperty.call(parsed.data, "mobileNumber")) {
      // Caller wants to change/clear it
      const incoming = mobileNumber;

      // Clear if null or empty string
      if (incoming === null || (typeof incoming === "string" && incoming.trim() === "")) {
        $unset.mobileNumber = "";
        $unset.phoneMeta = "";
      } else if (typeof incoming === "string") {
        // Only re-validate if value changed
        const changed = (existing.mobileNumber || "") !== incoming;
        if (!changed) {
          // Keep current phoneMeta, but still set same number
          $set.mobileNumber = incoming;
        } else {
          // Call the microservice to validate adn lookup for meta
          try {
            const { data } = await axios.post(
              `${PHONE_VALIDATOR_URL}/validate`,
              { mobile: incoming, defaultCountry },
              { timeout: 8000 }
            );
            // data = { countryCode, countryName, operatorName }
            $set.mobileNumber = incoming;
            $set.phoneMeta = data;
          } catch (e) {
            if (e.response && e.response.status === 400) {
              return res.status(400).json(e.response.data); 
             }
            return res.status(502).json({ error: "Phone validation service unavailable" });
          }
        }
      }
    }

       // Handle category changes
    if (Object.prototype.hasOwnProperty.call(parsed.data, "categoryId")) {
      const cid = parsed.data.categoryId;
      if (cid === null || cid === "") {
        $unset.categoryId = "";
      } else if (typeof cid === "string") {
        const exists = await Category.exists({ _id: cid });
        if (!exists) return res.status(400).json({ error: "Invalid categoryId" });
        $set.categoryId = cid;
      }
    }
    // If nothing to change
    if (!Object.keys($set).length && !Object.keys($unset).length) {
      return res.json(existing);
    }

    const updateOps = {};
    if (Object.keys($set).length) updateOps.$set = $set;
    if (Object.keys($unset).length) updateOps.$unset = $unset;

    const updated = await Item.findByIdAndUpdate(id, updateOps, {
      new: true,
      runValidators: true,
    });

    return res.json(updated);
  } catch (err) {
    console.error("[PUT /api/items/:id] error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// --- Start ---
app.listen(PORT, () => {
  console.log(`[server] listening on http://localhost:${PORT}`);
});
