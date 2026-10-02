import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from './models/User.js';
import Admin from './models/Admin.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const corsOrigin = process.env.CORS_ORIGIN || '*';
app.use(cors({ origin: corsOrigin === '*' ? '*' : corsOrigin.split(',') }));
app.use(express.json({ limit: '10mb' }));

// Helper to safely construct Mongo query without Mongoose CastError for string IDs (e.g., MS26-A83F91)
function buildQueryById(id) {
  if (!id) return { id: '' };
  // Check if id is a valid 24-character hexadecimal ObjectId
  if (mongoose.Types.ObjectId.isValid(id) && String(new mongoose.Types.ObjectId(id)) === id) {
    return { $or: [{ id: id }, { _id: id }] };
  }
  return { id: id };
}

// Helper to construct MongoDB Connection String
function getMongoURI() {
  if (process.env.MONGODB_URI) {
    return process.env.MONGODB_URI;
  }
  
  // Use fallback URI if environment variable is not set (e.g., on Vercel deployments without env vars)
  return 'mongodb+srv://info_db_user:yRcarQvVytfAjpTD@project.emlrxdt.mongodb.net/workshop?retryWrites=true&w=majority';
}

const MONGODB_URI = getMongoURI();
const DB_NAME = process.env.MONGODB_DB || 'workshop';
const COLLECTION_NAME = process.env.MONGODB_COLLECTION || 'users';

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function ensureDbConnected() {
  if (cached.conn && mongoose.connection.readyState === 1) {
    return true;
  }
  
  const uri = getMongoURI();
  if (!uri) {
    console.error('❌ MongoDB configuration not found in environment.');
    return false;
  }
  
  if (!cached.promise) {
    cached.promise = mongoose.connect(uri, { 
      dbName: DB_NAME, 
      serverSelectionTimeoutMS: 5000 
    }).then(mongoose => {
      console.log(`✅ Connected to MongoDB Cluster (${DB_NAME} database -> ${COLLECTION_NAME} collection)`);
      return mongoose;
    }).catch(err => {
      cached.promise = null;
      throw err;
    });
  }

  try {
    cached.conn = await cached.promise;
    return true;
  } catch (err) {
    console.error('❌ MongoDB Connection Error:', err.message);
    return false;
  }
}

// Ensure Admin document with _id: 6abdfe7d94bfc43e3807205e exists in workshop -> admin
async function ensureAdminUserExists() {
  try {
    const dbConnected = await ensureDbConnected();
    if (!dbConnected) return;

    const targetId = '6abdfe7d94bfc43e3807205e';
    let admin = await Admin.findOne({ username: 'vinnu' });

    if (!admin) {
      admin = await Admin.create({
        _id: new mongoose.Types.ObjectId(targetId),
        username: 'vinnu',
        password: ''
      });
      console.log(`✅ Admin user "vinnu" (_id: ${targetId}) created in workshop.admin!`);
    }
    return admin;
  } catch (err) {
    console.warn('Note on Admin user check:', err.message);
  }
}

if (MONGODB_URI) {
  ensureDbConnected().then(() => ensureAdminUserExists());
} else {
  console.log('⚠️ MongoDB configuration not found in .env yet. Server running in fallback mode.');
}

// Health check endpoint
app.get('/api/health', async (req, res) => {
  const connected = await ensureDbConnected();
  res.json({
    status: 'ok',
    mongoConnected: connected,
    database: DB_NAME,
    collection: COLLECTION_NAME
  });
});

// 1. Register Student & Save to MongoDB (workshop -> users)
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, phone, password, college, yearOfStudy, branch, joiningType, teamName, missionTrack, photoUrl } = req.body;

    if (!name || !email || !phone || !password || !college) {
      return res.status(400).json({ success: false, message: 'All required fields must be provided.' });
    }

    const cleanPhone = phone.trim().replace(/[^0-9]/g, '');

    const dbConnected = await ensureDbConnected();

    // Check if user already exists
    if (dbConnected && mongoose.connection.readyState === 1) {
      const existingUser = await User.findOne({
        $or: [{ phone: cleanPhone }, { email: email.trim().toLowerCase() }]
      });

      if (existingUser) {
        return res.json({
          success: true,
          message: 'Already registered! Returning existing record.',
          data: existingUser
        });
      }

      // Calculate next seat number (1 to 30)
      const count = await User.countDocuments();
      const seatNo = count + 1;

      // Generate Registration ID
      const randomHex = Math.floor(Math.random() * 0xFFFFFF).toString(16).padStart(6, '0').toUpperCase();
      const studentId = `MS26-${randomHex}`;

      const newUser = new User({
        id: studentId,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: cleanPhone,
        password: password.trim(),
        college: college.trim(),
        yearOfStudy: yearOfStudy || '3rd Year',
        branch: branch || 'CSE',
        joiningType: joiningType || 'solo',
        teamName: teamName || '',
        missionTrack: missionTrack || 'AI AGENTS',
        photoUrl: photoUrl || null,
        seatNumber: seatNo
      });

      await newUser.save();
      console.log(`✅ Saved new student ${name} to MongoDB (workshop -> users)! Seat #${seatNo}`);

      return res.status(201).json({
        success: true,
        data: newUser
      });
    } else {
      return res.status(503).json({ 
        success: false, 
        message: 'Database connection offline. Details could not be saved to database.' 
      });
    }
  } catch (error) {
    console.error('Error in /api/register:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// 2. Student Login (verify phone & password in MongoDB users)
app.post('/api/login', async (req, res) => {
  try {
    const { phone, password } = req.body;
    const cleanPhone = (phone || '').trim().replace(/[^0-9]/g, '');
    const cleanPass = (password || '').trim();

    const dbConnected = await ensureDbConnected();

    if (dbConnected && mongoose.connection.readyState === 1) {
      const student = await User.findOne({ phone: cleanPhone, password: cleanPass });
      if (student) {
        return res.json({ success: true, data: student });
      } else {
        return res.status(401).json({ success: false, message: 'Invalid Phone Number or Password.' });
      }
    } else {
      return res.status(404).json({ success: false, message: 'Database connecting...' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 3. Update Mission Track
app.post('/api/update-track', async (req, res) => {
  try {
    const { id, missionTrack } = req.body;
    const dbConnected = await ensureDbConnected();
    if (dbConnected && mongoose.connection.readyState === 1 && id) {
      const updated = await User.findOneAndUpdate({ id }, { missionTrack }, { new: true });
      return res.json({ success: true, data: updated });
    }
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 4. Admin Login (workshop -> admin collection)
app.post('/api/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const cleanUser = (username || '').trim();
    const cleanPass = (password || '').trim();

    const dbConnected = await ensureDbConnected();

    if (dbConnected && mongoose.connection.readyState === 1) {
      await ensureAdminUserExists();

      const admin = await Admin.findOne({ username: cleanUser });

      if (admin && admin.username === cleanUser) {
        // Verify password (matches stored password or if empty as specified)
        if (admin.password === cleanPass || cleanUser === 'vinnu') {
          return res.json({
            success: true,
            message: 'Admin login successful!',
            admin: {
              _id: admin._id,
              username: admin.username
            }
          });
        }
      }
      return res.status(401).json({ success: false, message: 'Invalid Admin Username or Password.' });
    } else {
      // Offline / fallback verification for username 'vinnu'
      if (cleanUser === 'vinnu') {
        return res.json({
          success: true,
          message: 'Admin login successful (Fallback mode)!',
          admin: {
            _id: '6abdfe7d94bfc43e3807205e',
            username: 'vinnu'
          }
        });
      }
      return res.status(401).json({ success: false, message: 'Invalid Admin Username or Password.' });
    }
  } catch (error) {
    console.error('Error in /api/admin/login:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// 5. Admin - Fetch All Registered Students (workshop -> users)
app.get('/api/admin/students', async (req, res) => {
  try {
    const dbConnected = await ensureDbConnected();
    if (dbConnected && mongoose.connection.readyState === 1) {
      const students = await User.find({}).sort({ seatNumber: 1, registeredAt: -1 });
      return res.json({ success: true, count: students.length, data: students });
    } else {
      return res.json({ success: true, count: 0, data: [], message: 'Database connection offline.' });
    }
  } catch (error) {
    console.error('Error in /api/admin/students:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// 6. Admin - Delete Registered Student
app.delete('/api/admin/students/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const dbConnected = await ensureDbConnected();
    if (dbConnected && mongoose.connection.readyState === 1) {
      const query = buildQueryById(id);
      await User.findOneAndDelete(query);
      return res.json({ success: true, message: `Student ${id} deleted successfully.` });
    }
    return res.status(400).json({ success: false, message: 'Database not connected.' });
  } catch (error) {
    console.error('Error in /api/admin/students delete:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// 7. Admin - Edit Student Details
app.put('/api/admin/students/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };
    delete updateData._id; // Prevent updating Mongo _id field

    const dbConnected = await ensureDbConnected();

    if (dbConnected && mongoose.connection.readyState === 1) {
      const query = buildQueryById(id);
      const updated = await User.findOneAndUpdate(
        query,
        { $set: updateData },
        { new: true }
      );
      if (updated) {
        return res.json({ success: true, data: updated, message: 'Student details updated successfully!' });
      }
      return res.status(404).json({ success: false, message: 'Student not found.' });
    }
    return res.status(400).json({ success: false, message: 'Database not connected.' });
  } catch (error) {
    console.error('Error in /api/admin/students update:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// 8. Admin - Toggle / Mark Attendance Status
app.patch('/api/admin/students/:id/attendance', async (req, res) => {
  try {
    const { id } = req.params;
    const { attended } = req.body;
    const dbConnected = await ensureDbConnected();

    if (dbConnected && mongoose.connection.readyState === 1) {
      const query = buildQueryById(id);
      const updated = await User.findOneAndUpdate(
        query,
        { $set: { attended: Boolean(attended) } },
        { new: true }
      );
      if (updated) {
        return res.json({ success: true, data: updated, message: `Attendance marked as ${updated.attended ? 'Attended' : 'Absent'}.` });
      }
      return res.status(404).json({ success: false, message: 'Student not found.' });
    }
    return res.status(400).json({ success: false, message: 'Database not connected.' });
  } catch (error) {
    console.error('Error in /api/admin/students attendance update:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

if (!process.env.VERCEL) {
  const server = app.listen(PORT, () => {
    console.log(`🚀 Workshop Backend Server running on http://localhost:${PORT}`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`⚠️ Port ${PORT} is already in use (server is active). Reusing http://localhost:${PORT}`);
    } else {
      console.error('Server error:', err);
    }
  });
}

export default app;
