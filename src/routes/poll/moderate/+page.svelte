<script lang="ts">
    import { enhance } from '$app/forms';
    import { useLiveUpdates } from '#lib/live.ts';

    let { data } = $props();

    useLiveUpdates(['question', 'votes', 'results']);
</script>

<h1>Moderator</h1>
<p>Question {data.index + 1} of {data.total}: <strong>{data.question.text}</strong></p>
<p>Votes received: {data.totalVotes}</p>

<form method="POST" action="?/previous" use:enhance>
    <button disabled={data.index === 0}>Previous</button>
</form>
<form method="POST" action="?/toggleResults" use:enhance>
    <button>{data.showResults ? 'Hide results' : 'Show results'} on presenter screen</button>
</form>
<form method="POST" action="?/next" use:enhance>
    <button disabled={data.index === data.total - 1}>Next</button>
</form>
<form method="POST" action="?/reset" use:enhance={({ cancel }) => { 
    if (!confirm('Delete ALL votes and go back to question 1?')) cancel()
}}>
    <button>Reset all votes</button>
</form>