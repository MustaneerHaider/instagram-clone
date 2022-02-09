import Image from 'next/image';
import {
	DotsHorizontalIcon,
	HeartIcon,
	BookmarkIcon,
	ChatAltIcon,
	PaperAirplaneIcon,
	EmojiHappyIcon,
	TrashIcon
} from '@heroicons/react/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/solid';
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
	comments: postComments,
	hasLiked,
	likes,
	onDelete
}) {
	const [input, setInput] = useState('');
	const [comments, setComments] = useState(postComments);
	const [liked, setHasLiked] = useState(hasLiked);
	const [postLikes, setPostLikes] = useState(likes);
	const { data: session } = useSession();

	const addCommentToPost = async event => {
		event.preventDefault();

		if (!input) return;

		const result = await fetch(`/api/post/comment/${id}`, {
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
	};

	const likePostHandler = async () => {
		if (liked) {
			// delete like on the post
			await fetch(`/api/post/like/${id}`, {
				method: 'DELETE'
			}).then(res => res.json());
			setHasLiked(false);
			setPostLikes(prevLikes => {
				const newLikes = prevLikes.filter(
					like => like.user.email !== session.user.email
				);
				return newLikes;
			});
		} else {
			// add like to the post
			await fetch(`/api/post/like/${id}`, {
				method: 'POST'
			}).then(res => res.json());
			setHasLiked(true);
			setPostLikes(prevLikes => {
				const newLikes = [...prevLikes];
				newLikes.push({
					user: {
						email: session.user.email
					}
				});
				return newLikes;
			});
		}
	};

	const deletePostHandler = async () => {
		await fetch(`/api/post/delete/${id}`, {
			method: 'DELETE'
		}).then(res => res.json());

		onDelete(id);
	};

	return (
		<div className='border bg-white'>
			{/* header */}
			<div className='bg-white p-5 flex items-center border-b'>
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

				<div
					className='h-8 w-8 hover:bg-gray-100 flex justify-center items-center
        cursor-pointer rounded-full relative group'
				>
					<div
						className='hidden group-hover:flex p-2 rounded-md 
            shadow-sm bg-gray-800 absolute top-6 text-xs'
					>
						<TrashIcon
							className='h-6 w-6 text-red-500 hover:animate-bounce'
							onClick={deletePostHandler}
						/>
					</div>
					<DotsHorizontalIcon className='h-6' />
				</div>
			</div>

			{/* image */}
			<img
				src={image}
				className='w-full object-cover cursor-pointer'
				loading='lazy'
			/>

			{/* actions */}
			<div className='bg-white p-4 flex items-center justify-between'>
				<div className='space-x-4 flex items-center'>
					{liked ? (
						<HeartIconSolid
							className='h-6 sm:h-7 text-red-500 cursor-pointer
              hover:scale-125 transition transform duration-150'
							onClick={likePostHandler}
						/>
					) : (
						<HeartIcon className='icon' onClick={likePostHandler} />
					)}
					<ChatAltIcon className='icon' />
					<PaperAirplaneIcon className='icon rotate-45' />
				</div>
				<BookmarkIcon className='icon' />
			</div>

			{/* likes */}
			{postLikes.length > 0 && (
				<p className='text-sm pl-4 mb-2 font-bold -mt-1'>
					{postLikes?.length} likes
				</p>
			)}

			{/* caption */}
			<p className='mb-3 flex pl-4'>
				<span className='text-sm font-semibold'>{author.name}</span>
				<span className='truncate text-sm ml-1.5'>{caption}</span>
			</p>

			{/* comments */}
			{comments.length > 0 && (
				<FlipMove
					className='pl-5 pr-4 bg-white space-y-2 h-16 overflow-y-scroll
      scrollbar-thin scrollbar-thumb-black mb-2'
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
			)}

			{/* creation date */}
			<h4 className='uppercase text-[11px] text-gray-500 pl-4'>
				{moment.unix(createdAt).fromNow()}
			</h4>

			{/* add comment */}
			<form className='bg-white flex p-3 border-t mt-4'>
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
          disabled:cursor-not-allowed disabled:text-blue-200'
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
