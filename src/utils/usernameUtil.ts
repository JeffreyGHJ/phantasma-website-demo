export const validateUsername = (username: string) => {
	return (
		/^[a-z0-9]*$/.test(username) &&
		username.length >= 2 &&
		username.length <= 14
	);
};
