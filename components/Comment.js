import moment from 'moment-mini';
import Image from 'next/image';
import { forwardRef } from 'react';

const Comment = forwardRef(({ username, img, createdAt, comment }, ref) => {
	return (
		<div className='flex items-center' ref={ref}>
			<div className='relative h-6 w-6'>
				<Image
					src={img}
					layout='fill'
					alt=''
					className='rounded-full cursor-pointer'
				/>
			</div>

			<h2 className='text-xs ml-2 font-semibold'>{username}</h2>

			<p className='text-xs ml-1 truncate flex-grow'>{comment}</p>

			<h4 className='text-xs font-semibold'>
				{moment.unix(createdAt).fromNow()}
			</h4>
		</div>
	);
});

Comment.displayName = 'Comment';

export default Comment;
