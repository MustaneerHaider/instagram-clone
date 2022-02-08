import bcrypt from 'bcrypt';

export const hashPassword = password => {
	return bcrypt.hash(password, 12);
};

export const verifyPassword = (password, hashedPassword) => {
	return bcrypt.compare(password, hashedPassword);
};
