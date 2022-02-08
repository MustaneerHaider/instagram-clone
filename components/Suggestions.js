import { faker } from '@faker-js/faker';
import { useEffect, useState } from 'react';
import Suggestion from './Suggestion';

function Suggestions() {
	const [suggestions, setSuggestions] = useState([]);

	useEffect(() => {
		const suggestions = [...Array(5)].map((_, i) => ({
			...faker.helpers.contextualCard(),
			id: i
		}));

		setSuggestions(suggestions);
	}, []);

	return (
		<div className='ml-10'>
			<div className='flex justify-between mt-6'>
				<h2 className='text-sm font-semibold text-gray-500'>
					Suggestions For You
				</h2>
				<h3 className='text-xs font-semibold mb-2'>See All</h3>
			</div>
			{suggestions.map(suggestion => (
				<Suggestion
					key={suggestion.id}
					username={suggestion.name}
					img={suggestion.avatar}
					company={suggestion.company.name}
				/>
			))}
		</div>
	);
}

export default Suggestions;
