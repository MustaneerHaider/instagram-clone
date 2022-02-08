import Post from './Post';

function Posts({ posts }) {
	console.log('POST ->', posts);
	return (
		<div className='space-y-6 mt-8'>
			{posts.map(({ caption, image, author, id, comments }) => (
				<Post
					key={id}
					id={id}
					caption={caption}
					image={image}
					author={author}
					comments={comments}
				/>
			))}
		</div>
	);
}

export default Posts;
