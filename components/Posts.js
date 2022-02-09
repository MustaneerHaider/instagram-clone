import { useSession } from 'next-auth/react';
import Post from './Post';

function Posts({ posts, onDeletePost }) {
	const { data: session } = useSession();

	return (
		<div className='space-y-6 mt-8'>
			{posts.map(
				({
					caption,
					image,
					author,
					id,
					comments,
					likes,
					createdAt
				}) => (
					<Post
						key={id}
						id={id}
						caption={caption}
						image={image}
						author={author}
						comments={comments}
						likes={likes}
						createdAt={createdAt}
						hasLiked={
							likes.findIndex(
								like => like.user?.email === session.user.email
							) !== -1
						}
						onDelete={onDeletePost}
					/>
				)
			)}
		</div>
	);
}

export default Posts;
