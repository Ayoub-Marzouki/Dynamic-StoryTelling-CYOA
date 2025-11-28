import express from 'express';
import multer from 'multer';
import xsltProcessor from 'xslt-processor';
import { parseStringPromise } from 'xml2js';
import Genre from '../models/Genre.js';
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
const xslPath = path.join(__dirname, '../schema/genres.xsl');

// Get all genres (Public)
router.get('/', async (req, res) => {
  try {
    const genres = await Genre.find();
    res.json(genres);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Import Genres from XML (Admin only)
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
    
    let genreData = result.data.genres.genre;
    if (!Array.isArray(genreData)) {
      genreData = [genreData];
    }

    // Clear existing genres before import? Or update? Let's update/upsert.
    let count = 0;
    for (const g of genreData) {
      await Genre.findOneAndUpdate(
        { genreId: g.id },
        { 
          label: g.label,
          description: g.description,
          icon: g.icon
        },
        { upsert: true, new: true }
      );
      count++;
    }

    res.json({ message: `Successfully imported/updated ${count} genres.` });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
