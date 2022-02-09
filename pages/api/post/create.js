import { getSession } from 'next-auth/react';
import prisma from '../../../lib/db';

async function handler(req, res) {
	if (req.method !== 'POST') {
		return;
	}

	const { caption, image } = req.body;

	if (!caption || !image) {
		return res.status(422).json({ message: 'Missing information.' });
	}

	const session = await getSession({ req });

	const user = await prisma.user.findUnique({
		where: { email: session.user.email }
	});

	const createdPost = await prisma.post.create({
		data: {
			caption,
			image,
			authorId: user.id
		}
	});

	return res.status(201).json({ message: 'Post created', post: createdPost });
}

export default handler;
