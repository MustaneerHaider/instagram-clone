import Image from 'next/image';
import React from 'react';

function Suggestion({ img, company, username }) {
	return (
		<div className='flex items-center space-y-5'>
			<div className='relative h-10 w-10 self-end'>
				<Image
					src={img}
					className='rounded-full'
					layout='fill'
					alt=''
				/>
			</div>

			<div className='ml-4 flex-grow'>
				<h2 className='font-semibold text-sm'>{username}</h2>
				<h3 className='text-xs text-gray-500 w-48 truncate'>
					Works at {company}
				</h3>
			</div>

			<button className='text-xs text-blue-400 font-semibold'>
				Follow
			</button>
		</div>
	);
}

export default Suggestion;
