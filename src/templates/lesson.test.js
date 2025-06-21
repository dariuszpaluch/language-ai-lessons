import Mustache from 'mustache';
import fs from 'fs';
import path from 'path';
import {describe, beforeAll, it, expect} from '@jest/globals';
const __dirname = import.meta.dirname;

describe('lesson.html Mustache template', () => {
	let template;
	beforeAll(() => {
		template = fs.readFileSync(path.join(__dirname, './lesson.mustache'), 'utf8');
	});

	const sampleData = {
		title: 'Past Simple Tense',
		explanation: 'The past simple is used to describe actions that happened in the past.',
		examples: [
			{original: 'He <strong>go</strong> to school.', corrected: 'He <strong>went</strong> to school.'},
			{original: 'I <strong>eat</strong> breakfast.', corrected: 'I <strong>ate</strong> breakfast.'}
		],
		tasks: [
			{description: 'Change to past: She walks to the park.', answer: 'She walked to the park.'},
			{description: 'Change to past: They play football.', answer: 'They played football.'}
		]
	};

	it('renders the lesson title and explanation', () => {
		const output = Mustache.render(template, sampleData);
		expect(output).toContain(sampleData.title);
		expect(output).toContain(sampleData.explanation);
	});

	it('renders all examples', () => {
		const output = Mustache.render(template, sampleData);
		sampleData.examples.forEach(example => {
			expect(output).toContain(example.original);
			expect(output).toContain(example.corrected);
		});
	});

	it('renders all tasks and answers', () => {
		const output = Mustache.render(template, sampleData);
		sampleData.tasks.forEach(task => {
			expect(output).toContain(task.description);
			expect(output).toContain(task.answer);
		});
	});
});

