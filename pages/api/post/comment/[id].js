import { getSession } from 'next-auth/react';
import prisma from '../../../../lib/db';

async function handler(req, res) {
	if (req.method !== 'POST') {
		return;
	}

	const { comment } = req.body;

	if (!comment) {
		return res.status(422).json({ message: 'Missing comment.' });
	}

	const session = await getSession({ req });

	const user = await prisma.user.findUnique({
		where: { email: session.user.email }
	});

	const createdComment = await prisma.comment.create({
		data: {
			comment,
			postId: req.query.id,
			userId: user.id
		}
	});

	return res
		.status(201)
		.json({ message: 'Comment added.', comment: createdComment });
}

export default handler;
