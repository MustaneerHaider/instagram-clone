import MiniProfile from './MiniProfile';
import Posts from './Posts';
import Stories from './Stories';
import Suggestions from './Suggestions';

function Feed({ posts }) {
	return (
		<div
			className='grid grid-cols-1 md:grid-cols-2 md:max-w-2xl
    xl:grid-cols-3 xl:max-w-4xl mx-auto pb-10'
		>
			<section className='col-span-2'>
				<Stories />
				<Posts posts={posts} />
			</section>

			<section className='hidden xl:inline-grid'>
				<div className='fixed top-32'>
					<MiniProfile />
					<Suggestions />
				</div>
			</section>
		</div>
	);
}

export default Feed;
