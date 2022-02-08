import Image from 'next/image';
import {
	DotsHorizontalIcon,
	HeartIcon,
	BookmarkIcon,
	ChatAltIcon,
	PaperAirplaneIcon,
	EmojiHappyIcon
} from '@heroicons/react/outline';
import { useState } from 'react';
import Comment from './Comment';
import { useSession } from 'next-auth/react';
import moment from 'moment-mini';
import FlipMove from 'react-flip-move';

function Post({
	caption,
	image,
	createdAt,
	author,
	id,
	comments: postComments
}) {
	const [input, setInput] = useState('');
	const [comments, setComments] = useState(postComments);
	const { data: session } = useSession();

	const addCommentToPost = async event => {
		event.preventDefault();

		if (!input) return;

		const result = await fetch('/api/comment', {
			method: 'POST',
			body: JSON.stringify({
				comment: input,
				postId: id
			}),
			headers: { 'Content-Type': 'application/json' }
		}).then(res => res.json());

		setComments(prevComments => {
			const newComments = [...prevComments];
			newComments.unshift({
				...result.comment,
				createdtAt: moment(result.comment.createdtAt).unix(),
				user: {
					name: session.user.name,
					image: session.user.image
				}
			});
			return newComments;
		});

		setInput('');

		console.log('Comment', result);
	};

	return (
		<div className='border bg-white'>
			{/* header */}
			<div className='bg-white p-5'>
				<div className='flex items-center '>
					<div className='relative h-10 w-10'>
						<Image
							src={author.image}
							layout='fill'
							alt=''
							className='cursor-pointer rounded-full'
						/>
					</div>
					<p className='ml-3 flex-1 text-sm font-semibold'>
						{author.name}
					</p>

					<DotsHorizontalIcon className='h-6 cursor-pointer' />
				</div>

				{/* caption */}
				<p className='mt-2 text-sm'>{caption}</p>
			</div>

			{/* image */}
			<img src={image} className='w-full object-cover cursor-pointer' />

			{/* actions */}
			<div className='bg-white p-4 flex items-center justify-between'>
				<div className='space-x-4 flex items-center'>
					<HeartIcon className='icon' />
					<ChatAltIcon className='icon' />
					<PaperAirplaneIcon className='icon rotate-45' />
				</div>
				<BookmarkIcon className='icon' />
			</div>

			{/* comments */}
			<FlipMove
				className='px-4 bg-white space-y-2 h-16 overflow-y-scroll
      scrollbar-thin scrollbar-thumb-black'
			>
				{comments?.map(({ id, user, comment, createdtAt }) => (
					<Comment
						key={id}
						username={user.name}
						img={user.image}
						comment={comment}
						createdAt={createdtAt}
					/>
				))}
			</FlipMove>

			{/* add comment */}
			<form className='bg-white flex p-3 border-t mt-2'>
				<EmojiHappyIcon className='h-6 sm:h-7' />
				<input
					value={input}
					type='text'
					placeholder='Add a comment...'
					className='flex-grow outline-none ml-2 text-sm'
					onChange={event => setInput(event.target.value)}
				/>
				<button
					className='text-blue-300 text-sm ml-1 font-semibold
          disabled:cursor-not-allowed disabled:text-gray-300'
					onClick={addCommentToPost}
					disabled={!input}
				>
					Post
				</button>
			</form>
		</div>
	);
}

export default Post;
