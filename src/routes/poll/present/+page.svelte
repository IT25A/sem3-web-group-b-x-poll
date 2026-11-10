<script lang="ts">
    import { useLiveUpdates } from '#lib/live.ts';

    let { data } = $props();

    useLiveUpdates(['question', 'votes', 'results']);

    function percent(count: number): number {
        return data.totalVotes > 0 ? (count / data.totalVotes) * 100 : 0;
    }
</script>

<h1>{data.question.text}</h1>
<p>{data.totalVotes} vote(s) received</p>

{#if data.results}
    {#each data.results as result (result.id)}
        <div class="row">
            <span class="label">{result.label}</span>
            <div class="bar" role="progressbar" aria-valuenow={result.count} aria-valuemin="0" aria-valuemax={data.totalVotes}>
                <div style:width="{percent(result.count)}%"></div>
            </div>
            <span>{result.count}</span>
        </div>
    {/each}
{:else}
    <ul>
        {#each data.question.options as option (option.id)}
            <li>{option.label}</li>
        {/each}
    </ul>
{/if}

<div class="qr">{@html data.qrSvg}</div>
<p>{data.joinUrl}</p>

<style>
    .row {
        display: flex;
        align-items: center;
        gap: 1rem;
        margin: 0.5rem 0;
    }
    .label {
        width: 12rem;
    }
    .bar {
        height: 1.5rem;
        width: 100%;
        background: #ccc;
    }
    .bar > div {
        height: 100%;
        background: #0a0;
        transition: width 0.3s ease-in-out;
    }
    .qr {
        width: 12rem;
    }
</style>