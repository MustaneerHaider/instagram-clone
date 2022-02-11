import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useRef, useState } from 'react';
import { CameraIcon } from '@heroicons/react/outline';
import moment from 'moment-mini';
import { useSession } from 'next-auth/react';
import ClientSidePortal from './ClientSidePortal';

function Modal({ show, onCloseModal, onAddPost }) {
	const [imageToPost, setImageToPost] = useState('');
	const [loading, setLoading] = useState(false);
	const filePickerRef = useRef(null);
	const captionRef = useRef(null);
	const { data: session } = useSession();

	const addImageToPost = async event => {
		const file = event.target.files[0];
		if (!file) return;

		const reader = new FileReader();
		reader.readAsDataURL(file);

		reader.onload = readerEvent => {
			setImageToPost(readerEvent.target.result);
		};

		const fd = new FormData();
		fd.append('file', file);
		fd.append('upload_preset', 'my-uploads');

		const result = await fetch(
			'https://api.cloudinary.com/v1_1/diezkb6ih/image/upload',
			{
				method: 'POST',
				body: fd
			}
		).then(res => res.json());

		setImageToPost(result.secure_url);
	};

	const submitHandler = async event => {
		event.preventDefault();

		if (loading) return;

		setLoading(true);
		const data = await fetch('/api/post/create', {
			method: 'POST',
			body: JSON.stringify({
				caption: captionRef.current.value,
				image: imageToPost
			}),
			headers: { 'Content-Type': 'application/json' }
		}).then(res => res.json());

		// add created post to posts array
		const postData = {
			...data.post,
			createdAt: moment(data.post.createdAt).unix(),
			likes: [],
			comments: [],
			author: {
				name: session.user.name,
				image: session.user.image
			}
		};
		onAddPost(postData);

		captionRef.current.value = '';
		setLoading(false);
		onCloseModal();
		setImageToPost('');
	};

	return (
		<ClientSidePortal selector='#overlay'>
			<Transition.Root show={show} as={Fragment}>
				<Dialog
					as='div'
					className='fixed inset-0 z-50 overflow-y-auto'
					onClose={onCloseModal}
				>
					<div className='min-h-screen px-4 text-center'>
						<Transition.Child
							as={Fragment}
							enter='ease-out duration-300'
							enterFrom='opacity-0'
							enterTo='opacity-100'
							leave='ease-in duration-200'
							leaveFrom='opacity-100'
							leaveTo='opacity-0'
						>
							<Dialog.Overlay
								className='fixed inset-0 bg-gray-500 
              bg-opacity-75 transition-opacity'
							/>
						</Transition.Child>

						<span
							className='inline-block h-screen align-middle'
							aria-hidden='true'
						>
							&#8203;
						</span>

						<Transition.Child
							as={Fragment}
							enter='ease-out duration-300'
							enterFrom='opacity-0 scale-95'
							enterTo='opacity-100 scale-100'
							leave='ease-in duration-200'
							leaveFrom='opacity-100 scale-100'
							leaveTo='opacity-0 scale-95'
						>
							<div
								className='inline-block w-full max-w-md p-6 my-8 
              overflow-hidden align-middle transition-all 
              transform bg-white shadow-xl rounded-xl'
							>
								<form className='flex flex-col'>
									{!imageToPost ? (
										<div>
											<div
												className='bg-red-50 h-16 w-16 flex items-center justify-center
                    rounded-full mx-auto'
											>
												<CameraIcon
													className='h-10 text-red-400 cursor-pointer'
													onClick={() =>
														filePickerRef.current.click()
													}
												/>
											</div>

											<p className='mt-3 text-xl text-gray-600'>
												Upload a Photo
											</p>
										</div>
									) : (
										<img
											src={imageToPost}
											className='w-full object-contain cursor-pointer mx-auto'
											onClick={() => setImageToPost('')}
										/>
									)}
									<input
										type='file'
										hidden
										ref={filePickerRef}
										onChange={addImageToPost}
									/>

									<input
										type='text'
										ref={captionRef}
										placeholder='Please enter a caption...'
										className='outline-none my-4 text-lg mx-auto'
									/>

									<button
										className='button disabled:cursor-not-allowed disabled:bg-blue-200'
										disabled={loading}
										type='submit'
										onClick={submitHandler}
									>
										{loading ? 'Uploading...' : 'Upload'}
									</button>
								</form>
							</div>
						</Transition.Child>
					</div>
				</Dialog>
			</Transition.Root>
		</ClientSidePortal>
	);
}

export default Modal;
