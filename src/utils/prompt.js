export const prompt = `You are a professional English Teacher. Your task is to analyze student's history of texts. Identify the most common and important mistakes he made. Select only 2 of them, for each issue, create a focused English lesson that includes:
	1.	A clear explanation of the rule.
	2.	Display this examples when I made this error and next to it please add correct form, with bold the words which you change.
	3.	Practice tasks (with 5 example exercises) to help me learn and internalize the rule. Below add answers for this tasks.”
	As result you should return JSON with lessons array. Answer should be in following format:
	{
		"lessons": [
			{
				"title": "Lesson Title",
				"explanation": "Explanation of the rule",
				"examples": [
					"original": "Original text, in HTML with <strong> words with errors",
					"corrected": "Corrected text, in HTML", with <strong> words where is different between original"
				],
				"tasks": [
					{
						"description": "Task description",
						"answer": "Answer for task"
					}
				]
			}
		]
	}
`;

export const promptResponseValidation = (response) => {
	if (typeof response !== 'object' || !Array.isArray(response.lessons)) {
		throw new Error('Response must be an object with a lessons array');
	}

	for (const lesson of response.lessons) {
		if (typeof lesson.title !== 'string' || !lesson.title.trim()) {
			throw new Error('Each lesson must have a non-empty title');
		}
		if (typeof lesson.explanation !== 'string' || !lesson.explanation.trim()) {
			throw new Error('Each lesson must have a non-empty explanation');
		}
		if (!Array.isArray(lesson.examples) || lesson.examples.length === 0) {
			throw new Error('Each lesson must have a non-empty examples array');
		}
		if (!Array.isArray(lesson.tasks) || lesson.tasks.length === 0) {
			throw new Error('Each lesson must have a non-empty tasks array');
		}

		for (const example of lesson.examples) {
			if (typeof example.original !== 'string' || !example.original.trim()) {
				throw new Error('Each example must have a non-empty original text');
			}
			if (typeof example.corrected !== 'string' || !example.corrected.trim()) {
				throw new Error('Each example must have a non-empty corrected text');
			}
		}

		for (const task of lesson.tasks) {
			if (typeof task.description !== 'string' || !task.description.trim()) {
				throw new Error('Each task must have a non-empty description');
			}
			if (typeof task.answer !== 'string' || !task.answer.trim()) {
				throw new Error('Each task must have a non-empty answer');
			}
		}
	}
}
