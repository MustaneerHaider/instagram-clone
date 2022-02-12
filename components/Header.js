import Image from 'next/image';
import {
	SearchIcon,
	PaperAirplaneIcon,
	PlusCircleIcon,
	UserGroupIcon,
	HeartIcon,
	MenuIcon
} from '@heroicons/react/outline';
import { HomeIcon } from '@heroicons/react/solid';
import { useSession, signOut } from 'next-auth/react';

function Header({ onOpenModal }) {
	const { data: session } = useSession();

	return (
		<header className='sticky top-0 z-50 bg-white border-b shadow-sm'>
			<div
				className='max-w-4xl lg:mx-auto mx-5 flex 
      items-center justify-between py-3'
			>
				{/* Left */}
				<div
					className='relative h-10 w-24
          cursor-pointer'
				>
					<Image
						src='https://links.papareact.com/ocw'
						layout='fill'
						objectFit='contain'
						alt=''
					/>
				</div>

				{/* Middle */}
				<div
					className='hidden sm:flex items-center p-2 bg-gray-100 rounded-lg
        focus-within:shadow-md'
				>
					<SearchIcon className='h-5 text-gray-500' />
					<input
						type='text'
						placeholder='Search'
						className='ml-2 outline-none bg-transparent'
					/>
				</div>

				{/* Right */}
				<div className='flex items-center space-x-1.5 md:space-x-4'>
					<HomeIcon className='navBtn' />
					<MenuIcon
						className='h-6 md:hidden cursor-pointer hover:scale-125
            transition transform duration-150 ease-out'
					/>
					<div className='relative'>
						<span
							className='hidden md:flex absolute top-0 right-0 bg-red-500
            rounded-full h-4 w-4 text-xs justify-center text-white z-10
            '
						>
							3
						</span>
						<PaperAirplaneIcon className='navBtn rotate-45' />
					</div>
					<PlusCircleIcon
						className='h-6 sm:h-7 cursor-pointer hover:scale-125
            transition transform duration-150 ease-out'
						onClick={onOpenModal}
					/>
					<UserGroupIcon className='navBtn' />
					<HeartIcon className='navBtn' />

					<div className='relative h-8 w-8' onClick={signOut}>
						<Image
							src={session.user.image}
							layout='fill'
							alt=''
							className='cursor-pointer rounded-full'
						/>
					</div>
				</div>
			</div>
		</header>
	);
}

export default Header;
