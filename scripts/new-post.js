import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const title = process.argv[2];

if (!title) {
    console.error('Please provide a title for the post.');
    console.log('Usage: npm run new-post "Your Post Title"');
    process.exit(1);
}

const slug = title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .trim();

const date = new Date().toISOString().split('T')[0];
const filename = `${slug}.md`;
const filePath = path.join(__dirname, '../blog/posts', filename);

if (fs.existsSync(filePath)) {
    console.error(`Error: Post "${filename}" already exists.`);
    process.exit(1);
}

const template = `---
title: ${title}
date: ${date}
category: Uncategorized
tags:
  - Todo
---

# ${title}

Write your introduction here...

## Section One

Content goes here...
`;

fs.writeFileSync(filePath, template);
console.log(`Successfully created: blog/posts/${filename}`);
