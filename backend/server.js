const express = require('express');
const cors = require('cors');
const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'starhospital_secret_key_123';

// Middleware
app.use(cors());
app.use(express.json());

// SQLite Connection
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, 'database.sqlite'),
    logging: false
});

// Models
const User = sequelize.define('User', {
    email: { type: DataTypes.STRING, unique: true, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.STRING, defaultValue: 'patient' }, // patient, staff, admin
    fullName: { type: DataTypes.STRING }
});

const Patient = sequelize.define('Patient', {
    userId: { type: DataTypes.INTEGER, allowNull: false },
    phone: { type: DataTypes.STRING },
    address: { type: DataTypes.TEXT },
    bloodGroup: { type: DataTypes.STRING }
});

const Appointment = sequelize.define('Appointment', {
    userId: { type: DataTypes.INTEGER, allowNull: false },
    patientName: { type: DataTypes.STRING },
    patientPhone: { type: DataTypes.STRING },
    department: { type: DataTypes.STRING },
    doctorName: { type: DataTypes.STRING, allowNull: false },
    date: { type: DataTypes.DATE, allowNull: false },
    time: { type: DataTypes.STRING },
    type: { type: DataTypes.STRING, defaultValue: 'consultation' },
    notes: { type: DataTypes.TEXT },
    status: { type: DataTypes.STRING, defaultValue: 'pending' }
});

const CallbackRequest = sequelize.define('CallbackRequest', {
    fullName: { type: DataTypes.STRING, allowNull: false },
    phone: { type: DataTypes.STRING, allowNull: false },
    time: { type: DataTypes.STRING },
    reason: { type: DataTypes.TEXT },
    status: { type: DataTypes.STRING, defaultValue: 'pending' }
});

const Department = sequelize.define('Department', {
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT },
    icon: { type: DataTypes.STRING }
});

const Doctor = sequelize.define('Doctor', {
    name: { type: DataTypes.STRING, allowNull: false },
    specialty: { type: DataTypes.STRING, allowNull: false },
    experience: { type: DataTypes.STRING },
    departmentId: { type: DataTypes.INTEGER }
});

// Sync Database
(async () => {
    try {
        await sequelize.authenticate();
        console.log('SQLite Connection established.');
        await sequelize.sync({ alter: true });
        console.log('Database synced.');

        // Seed some data if empty
        const docCount = await Doctor.count();
        if (docCount === 0) {
            const cardiology = await Department.create({ name: 'Cardiology', description: 'Heart care specialists' });
            await Doctor.create({ name: 'Dr. Sarah Johnson', specialty: 'Cardiology', departmentId: cardiology.id });
            await Doctor.create({ name: 'Dr. Michael Chen', specialty: 'Neurology' });
        }
    } catch (error) {
        console.error('Database error:', error);
    }
})();

// --- Auth Middleware ---
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// --- Auth Routes ---
app.post('/api/auth/register', async (req, res) => {
    try {
        const { email, password, fullName, role } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ email, password: hashedPassword, fullName, role });

        if (role === 'patient') {
            await Patient.create({ userId: user.id });
        }

        const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET);
        res.status(201).json({ user: { id: user.id, email: user.email, role: user.role, fullName: user.fullName }, token });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET);
        res.json({ user: { id: user.id, email: user.email, role: user.role, fullName: user.fullName }, token });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/auth/me', authenticateToken, async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id);
        res.json({ id: user.id, email: user.email, role: user.role, fullName: user.fullName });
    } catch (err) {
        res.status(401).json({ error: 'Unauthorized' });
    }
});

// --- Callback Routes ---
app.post('/api/callbacks', async (req, res) => {
    try {
        const callback = await CallbackRequest.create(req.body);
        res.status(201).json(callback);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.get('/api/callbacks', authenticateToken, async (req, res) => {
    try {
        const callbacks = await CallbackRequest.findAll({ order: [['createdAt', 'DESC']] });
        res.json(callbacks);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/callbacks/:id/status', authenticateToken, async (req, res) => {
    try {
        const { status } = req.body;
        await CallbackRequest.update({ status }, { where: { id: req.params.id } });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- Appointment Routes ---
app.get('/api/appointments', authenticateToken, async (req, res) => {
    try {
        const appointments = await Appointment.findAll({ where: { userId: req.user.id } });
        res.json(appointments);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/appointments', authenticateToken, async (req, res) => {
    try {
        const appointment = await Appointment.create({ ...req.body, userId: req.user.id });
        res.status(201).json(appointment);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// --- Doctors & Departments ---
app.get('/api/departments', async (req, res) => {
    try {
        const depts = await Department.findAll();
        res.json(depts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/doctors', async (req, res) => {
    try {
        const { departmentId } = req.query;
        const where = departmentId ? { departmentId } : {};
        const docs = await Doctor.findAll({ where });
        res.json(docs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
