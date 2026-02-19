import express from "express";
import { config } from "dotenv";
import cors from "cors";
import connectDB from "./database/connection.js";
import User from "./models/User.js";
import Contact from "./models/Contact.js";
import { sendEmail } from "./utils/sendEmail.js";

const app = express();
const router = express.Router();

// Load environment variables
if (process.env.NODE_ENV !== 'production') {
  config({ path: "./config.env" });
}

// Connect to MongoDB
connectDB();


app.use(
  cors({
    origin: '*',
    methods: ["GET", "POST", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check route
router.get("/", (req, res) => {
  res.json({ 
    success: true, 
    message: "Gym App Backend API is running!",
    endpoints: ["/join", "/members", "/send/mail"]
  });
});

router.post("/send/mail", async (req, res) => {
  const { name, email, message } = req.body;
  
  console.log('Contact form received:', { name, email, message });
  
  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      message: "Please provide all details",
    });
  }
  
  try {
    // Try to save to database
    try {
      const contact = new Contact({ name, email, message });
      await contact.save();
      console.log('Contact saved to database');
    } catch (dbError) {
      console.log('Database save failed:', dbError.message);
    }
    
    // Try to send email
    try {
      await sendEmail(
        email,
        'Message Received - Prime Fitness',
        `<h1>Hi ${name}!</h1>
         <p>Thank you for contacting Prime Fitness.</p>
         <p>We have received your message and will get back to you within 24 hours.</p>`
      );
      console.log('Email sent successfully');
    } catch (emailError) {
      console.log('Email failed:', emailError.message);
    }
    
    // Always return success
    res.status(200).json({
      success: true,
      message: "Message received successfully!",
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    res.status(200).json({
      success: true,
      message: "Message received successfully!",
    });
  }
});

// Join gym membership
router.post("/join", async (req, res) => {
  try {
    const { name, email, phone, plan } = req.body;
    
    const planPrices = {
      QUARTERLY: { price: 7000, months: 3 },
      HALF_YEARLY: { price: 12000, months: 6 },
      YEARLY: { price: 17000, months: 12 }
    };
    
    const selectedPlan = planPrices[plan];
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + selectedPlan.months);
    
    const user = new User({
      name,
      email,
      phone,
      plan,
      price: selectedPlan.price,
      endDate
    });
    
    await user.save();
    
    // Try to send welcome email but don't fail if it doesn't work
    try {
      await sendEmail(
        email,
        'Welcome to Prime Fitness! 🎉',
        `<h1>Welcome ${name}!</h1>
         <p>Thank you for joining Prime Fitness with the <strong>${plan}</strong> plan.</p>
         <p>Your membership is valid until: <strong>${new Date(endDate).toLocaleDateString()}</strong></p>
         <p>We're excited to have you on your fitness journey!</p>`
      );
    } catch (emailError) {
      console.log('Email failed but membership created:', emailError.message);
    }
    
    res.status(201).json({
      success: true,
      message: "Membership created successfully!",
      user: {
        name: user.name,
        plan: user.plan,
        endDate: user.endDate
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.code === 11000 ? "Email already registered" : "Server error"
    });
  }
});

// Get all members
router.get("/members", async (req, res) => {
  try {
    const members = await User.find().select('-__v');
    res.json({ success: true, members });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Delete member
router.delete("/members/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await User.findByIdAndDelete(id);
    
    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        message: "Member not found"
      });
    }
    
    res.json({
      success: true,
      message: "Member deleted successfully"
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.use(router);


const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server listening at port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

