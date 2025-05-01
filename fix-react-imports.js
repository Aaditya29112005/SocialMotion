import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uiComponentsDir = path.join(__dirname, 'src/components/ui');

// Read all files in the UI components directory
fs.readdirSync(uiComponentsDir).forEach(file => {
  if (file.endsWith('.tsx')) {
    const filePath = path.join(uiComponentsDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Check if the file uses React.forwardRef
    const usesForwardRef = content.includes('React.forwardRef');
    
    if (!usesForwardRef) {
      // Remove React imports only if not using forwardRef
      content = content.replace(/import \* as React from "react"\n/g, '');
      content = content.replace(/import React from "react"\n/g, '');
      console.log(`Removed React import from ${file}`);
    } else {
      // Ensure we have the correct React import
      if (!content.includes('import React from "react"')) {
        content = 'import React from "react"\n' + content;
        console.log(`Added React import to ${file}`);
      }
    }
    
    fs.writeFileSync(filePath, content);
  }
}); 