<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData } from './$types';

	interface Props {
		data: PageData;
	}
	let { data }: Props = $props();
</script>

<h1>Database Example</h1>
<p>Here are all the members stored in the database:</p>
<ul>
	{#each data.members as member (member.id)}
		<li>
			<form method="POST" action="?/delete-member" use:enhance>
				<input type="hidden" name="id" value={member.id} />
				<span>{member.name} - {member.email}</span>
				<button type="submit">Delete</button>
			</form>
		</li>
	{:else}
		<li>No members found.</li>
	{/each}
</ul>

<form method="POST" action="?/add-member" use:enhance>
	<input type="text" name="name" placeholder="Name" />
	<input type="email" name="email" placeholder="Email" />
	<button type="submit">Add Member</button>
</form>

<style>
	li form {
		display: flex;
		width: 400px;
		justify-content: space-between;
		gap: 1rem;
		padding-bottom: 0.5rem;
	}
</style>
