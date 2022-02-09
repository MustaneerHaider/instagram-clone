import { Formik, Form } from 'formik';
import { Fragment } from 'react';
import Input from '../components/Input';
import * as yup from 'yup';
import Image from 'next/image';
import { useRef, useState } from 'react';
import { getSession, signIn } from 'next-auth/react';
import { ToastContainer, toast } from 'react-toastify';
import { useRouter } from 'next/router';
import 'react-toastify/dist/ReactToastify.css';

// validation schemas
const signupValidationSchema = yup.object({
	name: yup.string().required(),
	email: yup.string().email().required(),
	password: yup.string().min(6).required()
});

const loginValidationSchema = yup.object({
	email: yup.string().email().required(),
	password: yup.string().min(6).required()
});

async function createUser(user) {
	const response = await fetch('/api/auth/signup', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(user)
	});

	const data = await response.json();

	if (!response.ok) {
		throw new Error(data.message || 'An error occured.');
	}

	return data;
}

function Auth() {
	const [isLogin, setLogin] = useState(true);
	const [imageSrc, setImageSrc] = useState('');
	const [uploading, setUploading] = useState(false);
	const router = useRouter();
	const filePickerRef = useRef(null);

	const submitHandler = async values => {
		if (isLogin) {
			// log user in...
			const result = await signIn('credentials', {
				redirect: false,
				email: values.email,
				password: values.password
			});

			if (result.error) {
				toast.error(result.error, {
					closeOnClick: true,
					position: 'bottom-center',
					theme: 'colored',
					autoClose: 3000
				});
			} else {
				router.replace('/');
			}
		} else {
			// create user
			if (!imageSrc) return;
			try {
				const result = await createUser({ ...values, image: imageSrc });
				setLogin(true);
			} catch (error) {
				toast.error(error.message, {
					closeOnClick: true,
					position: 'bottom-center',
					theme: 'colored',
					autoClose: 2000
				});
			}
		}
	};

	const switchAuthModeHandler = () => {
		setLogin(prevState => !prevState);
	};

	const handleFileUpload = async event => {
		if (uploading) return;

		const file = event.target.files[0];

		const fd = new FormData();
		fd.append('file', file);
		fd.append('upload_preset', 'my-uploads');

		setUploading(true);
		const result = await fetch(
			'https://api.cloudinary.com/v1_1/diezkb6ih/image/upload',
			{
				method: 'POST',
				body: fd
			}
		).then(res => res.json());
		setUploading(false);
		setImageSrc(result.secure_url);
	};

	return (
		<Fragment>
			<ToastContainer />
			<div className='max-w-md md:mx-auto mx-5 mt-10'>
				<div className='relative h-20 sm:h-24 mb-3 mx-auto'>
					<Image
						src='https://links.papareact.com/ocw'
						layout='fill'
						alt=''
						objectFit='contain'
					/>
				</div>
				<Formik
					initialValues={
						isLogin
							? {
									email: '',
									password: ''
							  }
							: {
									name: '',
									email: '',
									password: ''
							  }
					}
					onSubmit={submitHandler}
					validationSchema={
						isLogin ? loginValidationSchema : signupValidationSchema
					}
				>
					{() => (
						<Form>
							{!isLogin && (
								<Input
									name='name'
									type='text'
									placeholder='FullName'
								/>
							)}
							<Input
								name='email'
								type='email'
								placeholder='Email Address'
							/>
							<Input
								name='password'
								type='password'
								placeholder='Password'
							/>

							{!isLogin && (
								<div className='mb-4'>
									<input
										type='file'
										hidden
										ref={filePickerRef}
										onChange={handleFileUpload}
									/>
									{!imageSrc ? (
										<p
											className='text-blue-400 font-semibold cursor-pointer'
											onClick={() =>
												filePickerRef.current.click()
											}
										>
											Upload a profile photo
										</p>
									) : null}
									{!!imageSrc && (
										<img
											src={imageSrc}
											className='w-12 rounded-sm object-contain cursor-pointer'
											onClick={() => setImageSrc('')}
										/>
									)}
								</div>
							)}

							<button className='button'>
								{isLogin ? 'LOGIN' : 'SIGN UP'}
							</button>
						</Form>
					)}
				</Formik>
				<p
					className='mt-3 text-gray-600 font-semibold hover:underline cursor-pointer'
					onClick={switchAuthModeHandler}
				>
					{isLogin
						? "Don't have an account? Sign up now."
						: 'Have an existing account? Login.'}
				</p>
			</div>
		</Fragment>
	);
}

export default Auth;
