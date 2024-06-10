import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useDispatch } from 'react-redux';
import { addCategory } from '../slices/toolSlice';
import * as Yup from 'yup';

function CategoryForm({ onClose }) {
  const dispatch = useDispatch();

  const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
  });

  const initialValues = {
    name: '',
  };

  const onSubmit = (values, { setSubmitting, resetForm }) => {
    const payload = { name: values.name };

    dispatch(addCategory(payload))
      .then(() => {
        onClose();
        resetForm();
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  return (
    <div className="p-4 bg-base-100">
      <h3 className="text-lg font-semibold">Add a New Category</h3>
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
        {({ isSubmitting }) => (
          <Form className="form-control w-full max-w-xs">
            <label className="label" htmlFor="name">
              <span className="label-text">Name</span>
            </label>
            <Field name="name" placeholder="Name" className="input input-bordered w-full max-w-xs" />
            <ErrorMessage name="name" component="div" className="text-error" />

            <button className="btn btn-primary mt-4" type="submit" disabled={isSubmitting}>Submit</button>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default CategoryForm;
