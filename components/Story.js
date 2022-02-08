import Image from 'next/image';

function Story({ img, username }) {
	return (
		<div>
			<div
				className='relative h-14 w-14 ring-2 ring-offset-2 ring-red-500
      rounded-full'
			>
				<Image
					src={img}
					className='rounded-full cursor-pointer hover:animate-pulse'
					alt=''
					layout='fill'
				/>
			</div>

			<h2 className='text-xs text-gray-600 mt-2 text-center'>
				{username}
			</h2>
		</div>
	);
}

export default Story;
