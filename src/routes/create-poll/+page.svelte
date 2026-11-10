<script lang="ts">
	const { data } = $props();
	type QuestionType = 'single' | 'multiple' | 'text' | 'rating';

	type Question = {
		id: number;
		text: string;
		type: QuestionType;
		options: string[];
		editing: boolean;
	};

	const typeLabels: Record<QuestionType, string> = {
		single: 'Single choice',
		multiple: 'Multiple choice',
		text: 'Free text',
		rating: 'Rating (1-5)'
	};

	let title = $state('');
	let description = $state('');
	let questions = $state<Question[]>([]);
	let nextId = 1;

	function addQuestion() {
		questions.push({
			id: nextId++,
			text: '',
			type: 'single',
			options: ['', ''],
			editing: true
		});
	}

	function deleteQuestion(id: number) {
		questions = questions.filter((q) => q.id !== id);
	}

	function hasOptions(type: QuestionType) {
		return type === 'single' || type === 'multiple';
	}
</script>

<main>
	<h1>Create a poll</h1>

	<form method="post" action="?/createPoll">
		<input type="hidden" name="questionCount" value={questions.length} />

		{#each questions as question, i (question.id)}
			<input type="hidden" name="questions/{i}/id" value={question.id} />
			<input type="hidden" name="questions/{i}/text" value={question.text} />
			<input type="hidden" name="questions/{i}/type" value={question.type} />
			{#if hasOptions(question.type)}
				{#each question.options as option, j}
					<input type="hidden" name="questions/{i}/options/{j}" value={option} />
				{/each}
			{/if}
		{/each}
		<label>
			Title
			<input type="text" bind:value={title} name="title" placeholder="Poll title" required />
		</label>

		<label>
			Description
			<textarea bind:value={description} name="description" rows="3" placeholder="What is this poll about?"></textarea>
		</label>

		<h2>Questions</h2>

		{#each questions as question, i (question.id)}
			<section class="question">
				{#if question.editing}
					<input
						type="text"
						bind:value={question.text}
						placeholder="Question {i + 1}"
						aria-label="Question text"
						name="questions/{i}/text"
						required
					/>

					<select bind:value={question.type} name="questions/{i}/type" aria-label="Question type">
						{#each Object.entries(typeLabels) as [value, label]}
							<option {value}>{label}</option>
						{/each}
					</select>

					{#if hasOptions(question.type)}
						<ul>
							{#each question.options as _, j}
							<input type="hidden" name="questions/{i}/optionCount" value={question.options.length} />
								<li>
									<input
										type="text"
										bind:value={question.options[j]}
										placeholder="Option {j + 1}"
										aria-label="Option {j + 1}"
										name="questions/{i}/options/{j}"
									/>
									<button
										type="button"
										onclick={() => question.options.splice(j, 1)}
										disabled={question.options.length <= 2}
									>
										Remove
									</button>
								</li>
							{/each}
						</ul>
						<button type="button" onclick={() => question.options.push('')}>Add option</button>
					{/if}
				{:else}
					<strong>{i + 1}. {question.text || '(untitled)'}</strong>
					<em>{typeLabels[question.type]}</em>
					{#if hasOptions(question.type)}
						<ul>
							{#each question.options.filter((o) => o.trim()) as option}
								<li>{option}</li>
							{/each}
						</ul>
					{/if}
				{/if}

				<div class="actions">
					<button type="button" onclick={() => (question.editing = !question.editing)}>
						{question.editing ? 'Done' : 'Edit'}
					</button>
					<button type="button" onclick={() => deleteQuestion(question.id)}>Delete</button>
				</div>
			</section>
		{:else}
			<p>No questions yet.</p>
		{/each}

		<button type="button" onclick={addQuestion}>+ Add question</button>
		<button type="submit" disabled={!title.trim() || questions.length === 0}>Create poll</button>
	</form>
	<ul>
		{#each data.polls as poll}
			<li>
				<p>[{poll.id}] {poll.title} - {poll.description}</p>
			</li>
		{/each}
	</ul>

</main>

<style>
	main {
		max-width: 40rem;
		margin: 2rem auto;
		padding: 0 1rem;
	}

	form {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	label {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.question {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		padding: 1rem;
		border: 1px solid #ccc;
		border-radius: 0.5rem;
	}

	ul {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		margin: 0;
		padding-left: 1rem;
	}

	li {
		display: flex;
		gap: 0.5rem;
	}

	li input {
		flex: 1;
	}

	.actions {
		display: flex;
		gap: 0.5rem;
	}
</style>
