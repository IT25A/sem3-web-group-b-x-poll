<script lang="ts">
	import { page } from '$app/state';
	import { authClient } from '#lib/auth-client.ts';

	// only allow relative redirects to prevent open redirect vulnerabilities
	const redirectTo = $derived.by(() => {
		const target = page.url.searchParams.get('redirect_to');
		return target?.startsWith('/') && !target.startsWith('//') ? target : '/';
	});

	function login() {
		return authClient.signIn.social({ provider: 'oidc', callbackURL: redirectTo });
	}
</script>

<h1>Sign in</h1>
<p>Acess to <i>{redirectTo}</i> is restricted. Please sign in to continue.</p>
<button onclick={login}>Sign in with IT25A</button>
