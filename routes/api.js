
import express from "express";
const router = express.Router();

// Import Models
import Project from "../DataBase/models/Project.js";
import Client from "../DataBase/models/Client.js";
import Contact from "../DataBase/models/Contact.js";
import Subscriber from "../DataBase/models/Subscriber.js";  



import multer from "multer";
import { v2 as cloudinary } from "cloudinary";

const upload = multer({ storage: multer.memoryStorage() });

// ==========================================
// 1. PROJECTS ROUTES
// ==========================================

// @route   GET /api/projects
// @desc    Fetch all projects (For Landing Page & Admin Panel)

router.get("/projects", async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 }); // Newest first
    res.json(projects);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   POST /api/projects
// @desc    Add a new project (For Admin Panel)


router.post("/projects", upload.single("image"), async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name || !description || !req.file) {
      return res.status(400).json({ msg: "All fields required" });
    }

    // 🔥 CONFIGURE CLOUDINARY RIGHT HERE
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    console.log("UPLOAD CALLED - INLINE CLOUDINARY CONFIG");

    const result = await cloudinary.uploader.upload(
      `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`,
      {
        folder: "projects",
        quality: "auto",
        fetch_format: "auto",
      }
    );

    const newProject = new Project({
      name,
      description,
      image: result.secure_url,
    });

    await newProject.save();

    console.log("NEW PROJECT SAVED:", newProject);

    res.json({ msg: "Project created", data: newProject });
  } catch (err) {
    console.error("CLOUDINARY ERROR:", err);
    res.status(500).send("Server Error");
  }
});


// ==========================================
// 2. CLIENTS ROUTES
// ==========================================

// @route   GET /api/clients
// @desc    Fetch all clients (For Landing Page & Admin Panel)

router.get("/clients", async (req, res) => {
  try {
    const clients = await Client.find().sort({ createdAt: -1 });
    res.json(clients);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error in Fetching Clients");
  }
});

// @route   POST /api/clients
// @desc    Add a new client (For Admin Panel)


router.post("/clients", upload.single("image"), async (req, res) => {
  try {
    const { name, designation, description } = req.body;

    if (!name || !designation || !description || !req.file) {
      return res.status(400).json({ msg: "All fields required" });
    }

    const result = await cloudinary.uploader.upload(
      `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`,
      { folder: "clients" }
    );

    const newClient = new Client({
      name,
      designation,
      description,
      image: result.secure_url,
    });

    await newClient.save();
    res.json({ msg: "Client created", data: newClient });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});



// ==========================================
// 3. CONTACT FORM ROUTES
// ==========================================

// @route   POST /api/contact
// @desc    Submit contact form (For Landing Page)
router.post("/contact", async (req, res) => {
  try {
    const { fullName, email, mobileNumber, city } = req.body;

    if (!fullName || !email || !mobileNumber || !city) {
      return res.status(400).json({ msg: "Please enter all fields" });
    }

    const newContact = new Contact({
      fullName,
      email,
      mobileNumber,
      city,
    });

    const savedContact = await newContact.save();
    res.json({
      msg: "Contact form submitted successfully",
      data: savedContact,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error in Submitting Contact Form");
  }
});

// @route   GET /api/admin/contacts
// @desc    View all contact submissions (For Admin Panel)
router.get("/admin/contacts", async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error in Fetching Contacts");
  }
});

// ==========================================
// 4. NEWSLETTER ROUTES
// ==========================================

// @route   POST /api/subscribe
// @desc    Subscribe to newsletter (For Landing Page)
router.post("/subscribe", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ msg: "Please enter an email address" });
    }

    // Check if email already exists
    let subscriber = await Subscriber.findOne({ email });
    if (subscriber) {
      return res.status(400).json({ msg: "Email is already subscribed" });
    }

    const newSubscriber = new Subscriber({
      email,
    });

    await newSubscriber.save();
    res.json({ msg: "Subscribed successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error in Subscribing Email");
  }
});

// @route   GET /api/admin/subscribers (Optional Helper)
// @desc    View all subscribed emails (For Admin Panel)
router.get("/admin/subscribers", async (req, res) => {
  try {
    const subscribers = await Subscriber.find().sort({ createdAt: -1 });
    res.json(subscribers);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

export default router;
