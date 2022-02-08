import prisma from '../../../lib/db';
import { hashPassword } from '../../../lib/auth';

async function handler(req, res) {
	if (req.method !== 'POST') {
		return;
	}

	const { name, email, password, image } = req.body;

	if (
		!name ||
		!image ||
		!email.includes('@') ||
		!email ||
		!password ||
		!password.trim().length >= 6
	) {
		return res.status(422).json({ message: 'Missing information.' });
	}

	const existingUser = await prisma.user.findUnique({
		where: { email: email }
	});

	if (existingUser) {
		return res.status(422).json({ message: 'User already exists!' });
	}

	const hashedPassword = await hashPassword(password);

	const user = await prisma.user.create({
		data: {
			name,
			email,
			password: hashedPassword,
			image
		}
	});

	return res.status(201).json({ message: 'User created.', userId: user.id });
}

export default handler;
