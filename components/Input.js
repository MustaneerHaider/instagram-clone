import { useField } from 'formik';

function Input(props) {
	const [field, { error, touched }] = useField(props);

	const hasError = touched && !!error;

	return (
		<div className='mb-4'>
			<div
				className={`bg-gray-50 border border-gray-200 rounded-md
      focus-within:shadow-md ${hasError && 'ring-2 ring-red-400'}`}
			>
				<input
					{...field}
					{...props}
					className='p-2.5 outline-none w-full bg-transparent text-gray-600'
				/>
			</div>
			{hasError && <p className='text-sm text-red-500 mt-1'>{error}</p>}
		</div>
	);
}

export default Input;
