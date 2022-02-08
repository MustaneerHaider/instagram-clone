import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import React from 'react';

function MiniProfile() {
	const { data: session } = useSession();

	return (
		<div className='ml-10 flex items-center'>
			<div className='relative h-14 w-14'>
				<Image
					src={session.user.image}
					layout='fill'
					alt=''
					className='cursor-pointer rounded-full'
				/>
			</div>

			<div className='ml-4 flex-grow'>
				<h2 className='text-sm font-semibold flex-grow'>
					{session.user.name}
				</h2>
				<h3 className='text-xs text-gray-500'>Welcome to Instagram</h3>
			</div>

			<button
				className='text-xs text-blue-400 font-semibold'
				onClick={signOut}
			>
				Sign out
			</button>
		</div>
	);
}

export default MiniProfile;
