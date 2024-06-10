import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { addTool } from '../slices/toolSlice';
import * as Yup from 'yup';

function ToolForm({ onClose }) {
  const dispatch = useDispatch();
  const tools = useSelector(state => state.tools.tools);
  const uniqueCategories = useSelector(state=>state.tools.categories)

  const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    category_id: Yup.number().required('Category is required'),
    serial: Yup.number().required('Serial is required'),
    description: Yup.string().required('Description is required'),
    model: Yup.string().required('Model is required'),
    status: Yup.string().required('Status is required'),
  });



  const uniqueStatus = ['New', 'In Use', 'Storage', 'Damaged', 'Lost'];

  const initialValues = {
    name: '',
    category_id: '',
    serial: '',
    description: '',
    model: '',
    status: '',
  };

  const onSubmit = (values, { setSubmitting, resetForm }) => {
    const payload = {
      name: values.name,
      category_id: parseInt(values.category_id, 10),
      serial: values.serial,
      description: values.description,
      model: values.model,
      status: values.status,
    };

    dispatch(addTool(payload))
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
      <h3 className="text-lg font-semibold">Add a New Tool</h3>
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
        {({ isSubmitting, setFieldValue }) => (
          <Form className="form-control w-full max-w-xs">
            <label className="label" htmlFor="category_id">
              <span className="label-text">Category</span>
            </label>
            <Field as="select" name="category_id" className="select select-bordered w-full max-w-xs" onChange={e => setFieldValue("category_id", e.target.value)}>
              <option value="">Select a Category</option>
              {uniqueCategories.map(category => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </Field>
            <ErrorMessage name="category_id" component="div" className="text-error" />

            <label className="label" htmlFor="name">
              <span className="label-text">Name</span>
            </label>
            <Field name="name" placeholder="Name" className="input input-bordered w-full max-w-xs" />
            <ErrorMessage name="name" component="div" className="text-error" />

            <label className="label" htmlFor="model">
              <span className="label-text">Model</span>
            </label>
            <Field name="model" placeholder="Model" className="input input-bordered w-full max-w-xs" />
            <ErrorMessage name="model" component="div" className="text-error" />

            <label className="label" htmlFor="serial">
              <span className="label-text">Serial</span>
            </label>
            <Field name="serial" placeholder="Serial" className="input input-bordered w-full max-w-xs" />
            <ErrorMessage name="serial" component="div" className="text-error" />

            <label className="label" htmlFor="description">
              <span className="label-text">Description</span>
            </label>
            <Field name="description" placeholder="Description" className="input input-bordered w-full max-w-xs" />
            <ErrorMessage name="description" component="div" className="text-error" />

            <label className="label" htmlFor="status">
              <span className="label-text">Status</span>
            </label>
            <Field as="select" name="status" className="select select-bordered w-full max-w-xs">
              <option value="">Select a Status</option>
              {uniqueStatus.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </Field>
            <ErrorMessage name="status" component="div" className="text-error" />

            <button className="btn btn-primary mt-4" type="submit" disabled={isSubmitting}>Submit</button>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default ToolForm;
