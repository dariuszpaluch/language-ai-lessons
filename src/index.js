import fs from 'fs'
import path, {dirname} from 'path';
import {fileURLToPath} from 'url';

import colors from 'colors'
import OpenAI from 'openai'
import {parse} from "csv-parse/sync";
import mustache from "mustache";
import open from 'open';

import {prompt, promptResponseValidation} from "./utils/prompt.js";


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const mainTemplate = fs.readFileSync(path.resolve(__dirname, './templates/main.mustache'), 'utf8');
const lessonTemplate = fs.readFileSync(path.resolve(__dirname, './templates/lesson.mustache'), 'utf8');

const ENGLISH_HISTORY_MAX_LENGTH = 50; // Max length of the history file in lines;
const MAX_API_ATTEMPTS = 5; // Maximum number of attempts to call OpenAI API

colors.enable();

const getConfig = () => {
	const config = {
		OPENAI_API_KEY: process.env.OPENAI_API_KEY,
		MODEL: process.env.MODEL || 'gpt-4.1',
		ENGLISH_HISTORY_FILE: process.env.ENGLISH_HISTORY_FILE,
		ENGLISH_HISTORY_FILE_CSV_COLUMN_INDEX: process.env.ENGLISH_HISTORY_FILE_CSV_COLUMN_INDEX || 0,
	};

	if (!config.OPENAI_API_KEY) {
		console.error('Please set OPENAI_API_KEY environment variable.'.red);
		process.exit(1);
	}

	if (!config.ENGLISH_HISTORY_FILE) {
		console.error('Please set ENGLISH_HISTORY_FILE environment variable to the path of your English history file.'.red);
		process.exit(1);
	}

	if (config.ENGLISH_HISTORY_FILE.includes('.csv') && !config.ENGLISH_HISTORY_FILE_CSV_COLUMN_INDEX) {
		console.error('Please set ENGLISH_HISTORY_FILE_CSV_COLUMN_INDEX environment variable to the index of the column with English history in your CSV file.'.red);
		process.exit(1);
	}

	return config;
}

const getGetEnglishLesson = async (openai, config, input) => {
		let completion;
		let result;

		for (let attempt = 0; attempt < MAX_API_ATTEMPTS; attempt++) {
			try {
				!!attempt && console.info(`Ai request attempt ${attempt + 1} of ${MAX_API_ATTEMPTS}`.yellow);
				completion = await openai.chat.completions.create({
					model: config.MODEL,
					messages: [
						{
							role: "system",
							content: prompt
						},
						{
							role: "user",
							content: `This is my history of texts requests to english fixer program:
							${input}
						`
						}
					],
				}, {timeout: 60 * 1000});

				result = completion.choices[0].message.content;
				if (result.startsWith('{') && result.endsWith('}')) {
					result = JSON.parse(result);
				}


				break;
			} catch (e) {
				console.error(`Error:    ${e}`);
				console.log('retrying...'.red);
			}
		}

		console.info('AI response received successfully.'.green);
		return result;
	}
;

const app = async () => {
	const config = getConfig();

	const openai = new OpenAI({
		apiKey: config.OPENAI_API_KEY,
	});

	let englishHistory = fs.readFileSync(config.ENGLISH_HISTORY_FILE, 'utf8');

	if (config.ENGLISH_HISTORY_FILE.includes(".csv")) {
		englishHistory = (parse(englishHistory, {
			columns: true,
			skip_empty_lines: true,
			relax_quotes: true,
			relax_column_count: true
		})).map(row => row.Input);
	}

	if (englishHistory.length > ENGLISH_HISTORY_MAX_LENGTH) {
		englishHistory.splice(0, englishHistory.length - ENGLISH_HISTORY_MAX_LENGTH);
	}

	let aiResponse = await getGetEnglishLesson(openai, config, englishHistory.join('\n'));
	promptResponseValidation(aiResponse);

	const datePostfix = new Date().toISOString().split('T')[0];

	const resultJsonFile = path.resolve(__dirname, `../dist/lesson_${datePostfix}.json`);
	fs.writeFileSync(resultJsonFile, JSON.stringify(aiResponse), 'utf8');
	console.info(`English lessons saved to ./dist/lesson_${datePostfix}.json`.green);

	const lessonsHtml = mustache.render(mainTemplate, {
		content: aiResponse.lessons.map(lesson => mustache.render(lessonTemplate, lesson))
	});

	const outputFileName = path.resolve(__dirname, `../dist/english_lessons_${datePostfix}.html`);
	fs.writeFileSync(outputFileName, lessonsHtml, 'utf8');
	console.info(`English lessons saved to ${outputFileName}`.green);

	await open(outputFileName, {app: {name: 'default'}});
};

app();
