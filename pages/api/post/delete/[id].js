import prisma from '../../../../lib/db';

export default async function handler(req, res) {
	if (req.method !== 'DELETE') {
		return;
	}

	const { id } = req.query;

	const existingPost = await prisma.post.findUnique({
		where: { id }
	});

	if (!existingPost) {
		return res.status(404).json({ message: 'Post not found!' });
	}

	await prisma.post.delete({
		where: {
			id
		}
	});

	return res.status(200).json({ message: `Post deleted with ID -> ${id}` });
}
