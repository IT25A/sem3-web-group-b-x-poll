<script lang="ts">
	import { authClient } from '#lib/auth-client.ts';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<nav>
	<a href="/oidc-example">Back to OIDC Example</a>
</nav>

<h1>OIDC Example - Protected Subpage</h1>
<p>This page is protected and requires authentication. You are currently logged in as:</p>

<pre>{JSON.stringify(data.user, null, 2)}</pre>
<button onclick={() => authClient.signOut({ callbackURL: '/' })}>Sign out</button>
