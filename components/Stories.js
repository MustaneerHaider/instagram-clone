import { useEffect, useState } from 'react';
import { faker } from '@faker-js/faker';
import Story from './Story';

function Stories() {
	const [stories, setStories] = useState([]);

	useEffect(() => {
		const stories = [...Array(15)].map((_, i) => ({
			id: i,
			...faker.helpers.contextualCard()
		}));

		setStories(stories);
	}, []);

	return (
		<div
			className='bg-white border p-5 flex overflow-x-scroll
    mt-8 space-x-4 scrollbar-thin scrollbar-thumb-black'
		>
			{stories.map(story => (
				<Story
					key={story.id}
					img={story.avatar}
					username={story.name}
				/>
			))}
		</div>
	);
}

export default Stories;
