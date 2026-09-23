const mongoose = require('../node_modules/mongoose');
const dotenv = require('../node_modules/dotenv');

dotenv.config();

function getMongoURI() {
  if (process.env.MONGODB_URI) return process.env.MONGODB_URI;
  const { MONGODB_USER, MONGODB_PASSWORD, MONGODB_HOST, MONGODB_DB, MONGODB_lasturl } = process.env;
  if (MONGODB_USER && MONGODB_PASSWORD && MONGODB_HOST) {
    const user = encodeURIComponent(MONGODB_USER);
    const pass = encodeURIComponent(MONGODB_PASSWORD);
    const db = MONGODB_DB || 'workshop';
    const lastUrl = (MONGODB_lasturl || 'retryWrites=true&w=majority').trim();
    return `mongodb+srv://${user}:${pass}@${MONGODB_HOST}/${db}?${lastUrl}`;
  }
  return '';
}

const MONGODB_URI = getMongoURI();

if (!MONGODB_URI) {
  console.error('❌ MongoDB configuration not found in .env file.');
  process.exit(1);
}

const userSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    college: { type: String, required: true },
    yearOfStudy: { type: String, default: '3rd Year' },
    branch: { type: String, default: 'CSE' },
    joiningType: { type: String, default: 'solo' },
    teamName: { type: String, default: '' },
    missionTrack: { type: String, default: 'AI AGENTS' },
    photoUrl: { type: String, default: null },
    seatNumber: { type: Number, required: true },
    registeredAt: { type: Date, default: Date.now }
  },
  {
    collection: 'users',
    timestamps: true
  }
);

const User = mongoose.models.User || mongoose.model('User', userSchema);

const sampleStudents = [
  {
    id: 'MS26-A83F91',
    name: 'Srini Vasu',
    email: 'srini.vasu@example.com',
    phone: '9014312221',
    password: 'password123',
    college: 'Eluru College of Engineering & Technology',
    yearOfStudy: '3rd Year',
    branch: 'CSE',
    joiningType: 'team',
    teamName: 'Cyber Ninjas',
    missionTrack: 'AI AGENTS',
    seatNumber: 1
  },
  {
    id: 'MS26-B94E02',
    name: 'Ananya Sharma',
    email: 'ananya.sharma@example.com',
    phone: '9876543210',
    password: 'ananya2026pass',
    college: 'Sir C.R. Reddy College of Engineering',
    yearOfStudy: '4th Year',
    branch: 'AI & DS',
    joiningType: 'solo',
    teamName: '',
    missionTrack: 'AI VISION',
    seatNumber: 2
  },
  {
    id: 'MS26-C15F33',
    name: 'Rajesh Varma',
    email: 'rajesh.varma@example.com',
    phone: '9123456789',
    password: 'rajeshpassword',
    college: 'Ramachandra College of Engineering',
    yearOfStudy: '2nd Year',
    branch: 'ECE',
    joiningType: 'team',
    teamName: 'Tech Titans',
    missionTrack: 'AI HEALTHCARE',
    seatNumber: 3
  },
  {
    id: 'MS26-D26A44',
    name: 'Priya Reddy',
    email: 'priya.reddy@example.com',
    phone: '9988776655',
    password: 'priyapassword',
    college: 'Eluru College of Engineering',
    yearOfStudy: '3rd Year',
    branch: 'IT',
    joiningType: 'solo',
    teamName: '',
    missionTrack: 'AI WEB',
    seatNumber: 4
  },
  {
    id: 'MS26-E37B55',
    name: 'Kiran Kumar',
    email: 'kiran.kumar@example.com',
    phone: '9440112233',
    password: 'kiranpassword',
    college: 'Sir C.R. Reddy Polytechnic College',
    yearOfStudy: 'MCA / Other',
    branch: 'MCA',
    joiningType: 'solo',
    teamName: '',
    missionTrack: 'AI AUTOMATION',
    seatNumber: 5
  }
];

async function seedData() {
  try {
    console.log('Connecting to MongoDB cluster...');
    await mongoose.connect(MONGODB_URI, { dbName: 'workshop' });
    console.log('✅ Connected to MongoDB Cluster (database: workshop)');

    console.log('Inserting sample student records into "workshop.users" collection...');
    for (const student of sampleStudents) {
      await User.findOneAndUpdate(
        { phone: student.phone },
        student,
        { upsert: true, new: true }
      );
      console.log(`✓ Saved Student: ${student.name} (${student.id}) | Seat #${student.seatNumber} | Phone: ${student.phone}`);
    }

    const totalCount = await User.countDocuments();
    console.log(`\n🎉 SUCCESS! Total student registrations in 'workshop' database -> 'users' collection: ${totalCount}`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error inserting data to MongoDB:', error);
    process.exit(1);
  }
}

seedData();
