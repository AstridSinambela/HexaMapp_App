<script>
	import { supabase } from '$lib/utils/supabaseClient';
	let email = '';
	let password = '';
	let errorMsg = '';
	
	async function login() {
		const { data, error } = await supabase.auth.signInWithPassword({
			email,
			password
		});
		
		if (error) {
			errorMsg = error.message;
		} else {
			window.location.href = '/map';
		}
	}
</script>

<div class="min-h-screen flex items-center justify-center bg-gray-100">
	<div class="bg-white p-8 rounded shadow w-80">
		<h1 class="text-xl font-bold mb-4">Login</h1>

		{#if errorMsg}
			<p class="text-red-600 text-sm mb-2">{errorMsg}</p>
		{/if}

		<input 
			type="email"
			bind:value={email}
			placeholder="Email"
			class="w-full p-2 border rounded mb-3"
		/>

		<input 
			type="password"
			bind:value={password}
			placeholder="Password"
			class="w-full p-2 border rounded mb-3"
		/>

		<button 
			on:click={login}
			class="w-full bg-blue-600 text-white py-2 rounded"
		>
			Login
		</button>
	</div>
</div>
