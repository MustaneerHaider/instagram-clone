import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import prisma from '../../../lib/db';
import { verifyPassword } from '../../../lib/auth';

export default NextAuth({
	providers: [
		CredentialsProvider({
			async authorize({ email, password }) {
				const user = await prisma.user.findUnique({ where: { email } });

				if (!user) {
					throw new Error('Invalid email or password.');
				}

				const isEqual = await verifyPassword(password, user.password);

				if (!isEqual) {
					throw new Error('Invalid email or password.');
				}

				return {
					name: user.name,
					email: user.email,
					image: user.image
				};
			}
		})
	],
	session: {
		strategy: 'jwt'
	},
	secret: process.env.SECRET
});
