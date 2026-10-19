import { query, queryOne } from '../index';
import type { Member } from '../types';

export function getAllMembers() {
	return query<Member>(
		`SELECT id, name, email, created_at
         FROM members`
	);
}

export function getMemberById(id: number) {
	return queryOne<Member>(
		`SELECT id, name, email, created_at
         FROM members
         WHERE id = $1`,
		[id]
	);
}

export function createMember(name: string, email: string) {
	return queryOne<Member>(
		`INSERT INTO members (name, email)
          VALUES ($1, $2)
          RETURNING id, name, email, created_at`,
		[name, email]
	);
}

export function deleteMember(id: number) {
	return queryOne<Member>(
		`DELETE FROM members
         WHERE id = $1
         RETURNING id, name, email, created_at`,
		[id]
	);
}
