import React from 'react';
import { useDispatch } from 'react-redux';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { addTestLine } from '../slices/toolSlice'; // Adjust import path as necessary

const TestLineForm = ({ onClose }) => {
  const dispatch = useDispatch();

  const initialValues = {
    name: '',
    status: 'available',
  };

  const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
  });

  const onSubmit = (values, { setSubmitting }) => {
    dispatch(addTestLine(values)).unwrap()
      .then(() => {
        setSubmitting(false);
        onClose();
      })
      .catch((error) => {
        console.error('Failed to add test line', error);
        setSubmitting(false);
      });
  };

  return (
    <div className="p-4 bg-base-100">
      <h3 className="text-lg font-semibold">Add a Test Line</h3>
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
        {({ isSubmitting }) => (
          <Form className="form-control w-full max-w-xs">
            <label className="label" htmlFor="name">
              <span className="label-text">Name</span>
            </label>
            <Field name="name" type="text" className="input input-bordered w-full max-w-xs" />
            <ErrorMessage name="name" component="div" className="text-error" />

            <label className="label" htmlFor="status">
              <span className="label-text">Status</span>
            </label>
            <Field as="select" name="status" className="select select-bordered w-full max-w-xs">
              <option value="available">Available</option>
              {/* <option value="checked out">Checked Out</option> */}
            </Field>
            <ErrorMessage name="status" component="div" className="text-error" />

            <div className="flex justify-end mt-4">
              <button type="submit" disabled={isSubmitting} className="btn btn-primary">Add</button>
              <button type="button" onClick={onClose} className="btn btn-secondary ml-2">Cancel</button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default TestLineForm;
