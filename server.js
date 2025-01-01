// const express = require('express');
// const mongoose = require('mongoose');
// const bodyParser = require('body-parser');
// const cors = require('cors');
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');

// const app = express();
// const PORT = 5000;
// const SECRET_KEY = "your_secret_key";

// // Middleware
// app.use(cors());
// app.use(bodyParser.json());

// // MongoDB Connection
// mongoose
//   .connect('mongodb://127.0.0.1:27017/loanApp', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => console.log('Connected to MongoDB'))
//   .catch((err) => console.error('Failed to connect to MongoDB', err));

// // User Schema
// const userSchema = new mongoose.Schema({
//   username: { type: String, required: true, unique: true },
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
//   phone: { type: String, required: true, unique: true }, // Added phone field
// });

// const User = mongoose.model('User', userSchema);

// // Routes

// // Signup
// app.post('/signup', async (req, res) => {
//   const { username, email, password, phone } = req.body;

//   try {
//     // Check if email or phone number already exists
//     const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
//     if (existingUser) {
//       return res.status(400).json({ error: 'Email or phone number already in use' });
//     }

//     // Hash the password
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const newUser = new User({
//       username,
//       email,
//       password: hashedPassword,
//       phone, // Save phone number
//     });

//     await newUser.save();
//     res.status(201).json({ message: 'User registered successfully' });
//   } catch (error) {
//     console.error(error);
//     res.status(400).json({ error: 'Error registering user' });
//   }
// });

// // Login
// app.post('/login', async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(404).json({ error: 'User not found' });
//     }

//     const isPasswordValid = await bcrypt.compare(password, user.password);
//     if (!isPasswordValid) {
//       return res.status(401).json({ error: 'Invalid credentials' });
//     }

//     // Generate JWT
//     const token = jwt.sign({ id: user._id }, SECRET_KEY, { expiresIn: '1h' });
//     res.status(200).json({ message: 'Login successful', token });
//   } catch (error) {
//     res.status(500).json({ error: 'Error logging in' });
//   }
// });

// // Get Dashboard Data
// app.get('/dashboard', async (req, res) => {
//   const token = req.headers['authorization'];

//   if (!token) {
//     return res.status(403).json({ error: 'No token provided' });
//   }

//   try {
//     const decoded = jwt.verify(token, SECRET_KEY);
//     const user = await User.findById(decoded.id).select('-password');
//     if (!user) {
//       return res.status(404).json({ error: 'User not found' });
//     }

//     res.status(200).json(user);
//   } catch (error) {
//     res.status(401).json({ error: 'Unauthorized' });
//   }
// });

// // Start the Server
// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });
require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 5000;
const SECRET_KEY = process.env.JWT_SECRET;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection using environment variable
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Failed to connect to MongoDB', err));

// User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);

// Loan Application Schema
const loanApplicationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  age: { type: Number, required: true },
  address: { type: String, required: true },
  monthlyIncome: { type: Number, required: true },
  loanAmount: { type: Number, required: true },
  tenure: { type: Number, required: true },
  cibilScore: { type: Number, required: true },
});

const LoanApplication = mongoose.model('LoanApplication', loanApplicationSchema);

// Middleware to authenticate token
function authenticateToken(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];  // Extract token from header

  if (!token) {
    return res.status(403).json({ error: 'No token provided' });
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token is not valid' });
    }

    req.user = user;  // Attach the user information to the request
    next();
  });
}

// Loan Application Route
app.post('/api/user/apply', authenticateToken, async (req, res) => {
  const { name, email, phone, age, address, monthlyIncome, loanAmount, tenure, cibilScore } = req.body;

  try {
    // Use req.user.id to get the user info
    const userId = req.user.id;

    // Creating a Loan Application
    const newApplication = new LoanApplication({
      userId,
      name,
      email,
      phone,
      age,
      address,
      monthlyIncome,
      loanAmount,
      tenure,
      cibilScore,
    });

    await newApplication.save();

    res.status(200).json({ message: 'Loan application submitted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to submit loan application' });
  }
});

// Signup Route
app.post('/api/auth/signup', async (req, res) => {
  const { name, email, password, phone } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      phone,
    });

    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(400).json({ error: 'Error registering user' });
  }
});

// Login Route
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, SECRET_KEY, { expiresIn: '1h' });
    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    res.status(500).json({ error: 'Error logging in' });
  }
});

// Start the Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
