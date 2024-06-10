import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux'
import { loginUser } from '../slices/authSlice';
import { fetchTools } from '../slices/toolSlice'


const LoginForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const initialValues = {
    username: '',
    password: '',
  };

  const validationSchema = Yup.object().shape({
    username: Yup.string().required('Username is required'),
    password: Yup.string().required('Password is required'),
  });

  const onSubmit = (values, { setSubmitting, setErrors }) => {
    dispatch(loginUser(values))
      .unwrap()
      .then((user) => {
        console.log('Login Success:', user);
        navigate('/layout'); 
        dispatch(fetchTools());
      })
      .catch((error) => {
        console.error('Error:', error);
        setErrors({ submit: error.message || 'Login failed. Please check your username and password.' });
      })
      .finally(() => setSubmitting(false));
  };

  return (
    <div className="flex justify-center items-center h-screen bg-neutral">
      <div className="card w-full max-w-sm shadow-2xl bg-base-100">
        <div className="card-body">
          <h1 className="text-3xl font-bold text-center mb-4">Sign In</h1>
          <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
            {({ isSubmitting, errors }) => (
              <Form>
                {errors.submit && <p className="text-error mb-4">{errors.submit}</p>}

                <div className="form-control">
                  <Field name="username" type="text" placeholder="Username" className="input input-bordered" />
                  <ErrorMessage name="username" component="p" className="text-error mt-1" />
                </div>

                <div className="form-control mt-4">
                  <Field name="password" type="password" placeholder="Password" className="input input-bordered" />
                  <ErrorMessage name="password" component="p" className="text-error mt-1" />
                </div>

                <div className="form-control mt-6">
                  <button type="submit" disabled={isSubmitting} className="btn btn-primary btn-lg p-4 text-4xl">
                    Login
                  </button>
                </div>
              </Form>
            )}
          </Formik>

          <div className="flex justify-between mt-4">
            <Link to="/forgot-password" className="text-secondary">Forgot Password?</Link>
            <Link to="/signup" className="text-secondary">Sign up</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
