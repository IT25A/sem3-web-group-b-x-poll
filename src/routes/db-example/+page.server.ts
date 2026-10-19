import { fail } from '@sveltejs/kit';
import { getAllMembers, createMember, deleteMember } from '#lib/server/db/queries/members.ts';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const members = await getAllMembers();
	return { members };
};

export const actions = {
	'add-member': async ({ request }) => {
		const data = await request.formData();
		const name = String(data.get('name'));
		const email = String(data.get('email'));

		if (!name || !email.includes('@')) {
			return fail(400, { error: 'Invalid name or email', name, email });
		}

		try {
			await createMember(name, email);
		} catch (error) {
			// 23505 = unique_violation, which means the email already exists in the database
			if (error instanceof Error && 'code' in error && error.code === '23505') {
				return fail(409, { error: 'Email already exists', name, email });
			}
			throw error;
		}
		return { success: true };
	},
	'delete-member': async ({ request }) => {
		const data = await request.formData();
		const id = Number(data.get('id'));

		if (!Number.isInteger(id)) {
			return fail(400, { error: 'Invalid member ID' });
		}

		const deletedMember = await deleteMember(id);
		if (!deletedMember) {
			return fail(404, { error: 'Member not found' });
		}

		return { success: true };
	}
} satisfies Actions;
