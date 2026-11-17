<script lang="ts">
    import { enhance } from '$app/forms';
    import { useLiveUpdates } from '#lib/live.ts';

    let { data, form } = $props();

    useLiveUpdates(['question']); // participants only care about question changes
</script>

<h1>{data.question.text}</h1>

{#if data.myVote}
    <p>Thanks, your vote is in. Waiting for the next question…</p>
{:else}
    <form method="POST" use:enhance>
        <input type="hidden" name="questionId" value={data.question.id} />
        {#each data.question.options as option (option.id)}
            <button name="optionId" value={option.id}>{option.label}</button>
        {/each}
    </form>
    {#if form?.message}<p>{form.message}</p>{/if}
{/if}