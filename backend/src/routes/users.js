import express from 'express';
import multer from 'multer';
import xsltProcessor from 'xslt-processor';
import { parseStringPromise } from 'xml2js';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import auth from '../middleware/auth.js';
import admin from '../middleware/admin.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const { XmlParser, Xslt } = xsltProcessor;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });
const xslPath = path.join(__dirname, '../schema/users.xsl');

// Get all users (Admin only)
router.get('/', [auth, admin], async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Import Users from XML (Admin only)
router.post('/import', [auth, admin], upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const xmlContent = req.file.buffer.toString();
    const xslContent = fs.readFileSync(xslPath, 'utf8');

    const parser = new XmlParser();
    const processor = new Xslt();

    const xmlDoc = parser.xmlParse(xmlContent);
    const xslDoc = parser.xmlParse(xslContent);
    const transformedXml = await processor.xsltProcess(xmlDoc, xslDoc);
    
    const result = await parseStringPromise(transformedXml, { explicitArray: false, mergeAttrs: true });
    
    let usersData = result.data.users.user;
    if (!Array.isArray(usersData)) {
      usersData = [usersData];
    }

    let count = 0;
    for (const u of usersData) {
      const existing = await User.findOne({ email: u.email });
      if (!existing) {
        const hashedPassword = await bcrypt.hash(u.password, 10);
        await User.create({
          username: u.username,
          email: u.email,
          password: hashedPassword,
          role: u.role || 'user'
        });
        count++;
      }
    }

    res.json({ message: `Successfully imported ${count} users.` });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
