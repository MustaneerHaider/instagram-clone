import { getSession } from 'next-auth/react';
import prisma from '../../../../lib/db';

async function handler(req, res) {
	if (req.method !== 'DELETE' && req.method !== 'POST') {
		return;
	}

	const { id: postId } = req.query;

	if (req.method === 'POST') {
		const session = await getSession({ req });

		const user = await prisma.user.findUnique({
			where: { email: session.user.email }
		});

		const newLike = await prisma.like.create({
			data: {
				postId,
				userId: user.id
			}
		});

		return res.status(201).json({ message: 'Like added.' });
	}

	if (req.method === 'DELETE') {
		const session = await getSession({ req });

		const user = await prisma.user.findUnique({
			where: { email: session.user.email }
		});

		await prisma.like.delete({
			where: {
				userId_postId: {
					userId: user.id,
					postId
				}
			}
		});

		return res.status(200).json({ message: 'Like removed' });
	}
}

export default handler;
