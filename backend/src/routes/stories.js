import express from 'express';
import multer from 'multer';
import xsltProcessor from 'xslt-processor';
import { parseStringPromise } from 'xml2js';
import Story from '../models/Story.js';
import auth from '../middleware/auth.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const { XmlParser, Xslt } = xsltProcessor;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

const xslPath = path.join(__dirname, '../schema/story.xsl');

router.post('/', auth, upload.single('file'), async (req, res) => {
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
    
    // Extract data from parsed XML result
    const data = result.data;
    if (!data) {
        throw new Error("Invalid XML structure after transformation");
    }

    const title = data.title || "Untitled";
    
    // Normalize nodes
    let nodes = [];
    if (data.nodes && data.nodes.node) {
        nodes = Array.isArray(data.nodes.node) ? data.nodes.node : [data.nodes.node];
    }

    // Normalize choices for each node
    nodes = nodes.map(node => {
        let choices = [];
        if (node.choices && node.choices.choice) {
            choices = Array.isArray(node.choices.choice) ? node.choices.choice : [node.choices.choice];
        }
        
        return {
            id: node.id,
            text: node.text,
            image: node.image,
            choices: choices.map(c => ({
                text: c._ || c, // text content
                target: c.target
            }))
        };
    });

    const jsonContent = {
        title,
        nodes
    };

    const story = new Story({
      title: title,
      author: req.user.id,
      originalXML: xmlContent,
      jsonContent: jsonContent
    });

    await story.save();
    res.status(201).json(story);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const stories = await Story.find().populate('author', 'username');
    res.json(stories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const story = await Story.findById(req.params.id).populate('author', 'username');
    if (!story) return res.status(404).json({ message: 'Story not found' });
    res.json(story);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
