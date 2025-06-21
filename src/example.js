
import fs from 'fs'
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import http from 'http';

import mustache from "mustache";


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


const aiResponse = JSON.parse(fs.readFileSync(path.resolve(__dirname,  './data/lessons_example.json'), 'utf8'));

const mainTemplate = fs.readFileSync(path.resolve(__dirname, './template.mustache'), 'utf8');
const lessonTemplate = fs.readFileSync(path.resolve(__dirname, './lesson.mustache'), 'utf8');


const HTML = mustache.render(mainTemplate, {content: aiResponse.lessons.map(lesson => mustache.render(lessonTemplate, lesson)).join('\n')});

console.log(aiResponse, HTML);

const server = http.createServer((req, res) => {
	res.writeHead(200, {'Content-Type': 'text/html'});
	res.end(HTML);
});

server.listen(3000, () => {
	console.log('Server running at http://localhost:3000/');
});

