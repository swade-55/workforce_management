import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { addTool } from '../slices/toolSlice';
import * as Yup from 'yup';

function ToolForm({ onClose }) {
  const dispatch = useDispatch();
  const uniqueCategories = useSelector(state => state.tools.categories);

  const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    category_id: Yup.number().required('Category is required'),
    serial: Yup.string().required('Serial is required'),
    description: Yup.string().required('Description is required'),
    model: Yup.string().required('Model is required'),
    status: Yup.string().required('Status is required'),
    productId: Yup.string().required('Product ID is required'),
    siteId: Yup.string().required('Site ID is required'),
    storageLocation: Yup.string().required('Storage Location is required'),
    itemOwner: Yup.string().required('Item Owner is required'),
    nokiaSto: Yup.string().required('Nokia STO is required'),
    notes: Yup.string().required('Notes are required'),
  });

  const uniqueStatus = ['New', 'In Use', 'Storage', 'Damaged', 'Lost'];

  const initialValues = {
    name: '',
    category_id: '',
    serial: '',
    description: '',
    model: '',
    status: '',
    productId: '',
    siteId: '',
    storageLocation: '',
    itemOwner: '',
    nokiaSto: '',
    notes: '',
  };

  const onSubmit = (values, { setSubmitting, resetForm }) => {
    const payload = {
      name: values.name,
      category_id: parseInt(values.category_id, 10),
      serial: values.serial,
      description: values.description,
      model: values.model,
      status: values.status,
      productId: values.productId,
      siteId: values.siteId,
      storageLocation: values.storageLocation,
      itemOwner: values.itemOwner,
      nokiaSto: values.nokiaSto,
      notes: values.notes,
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
          <Form className="form-control w-full max-w-lg mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label" htmlFor="category_id">
                  <span className="label-text">Category</span>
                </label>
                <Field as="select" name="category_id" className="select select-bordered w-full" onChange={e => setFieldValue("category_id", e.target.value)}>
                  <option value="">Select a Category</option>
                  {uniqueCategories.map(category => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                  ))}
                </Field>
                <ErrorMessage name="category_id" component="div" className="text-error" />
              </div>

              <div>
                <label className="label" htmlFor="name">
                  <span className="label-text">Name</span>
                </label>
                <Field name="name" placeholder="Name" className="input input-bordered w-full" />
                <ErrorMessage name="name" component="div" className="text-error" />
              </div>

              <div>
                <label className="label" htmlFor="model">
                  <span className="label-text">Model</span>
                </label>
                <Field name="model" placeholder="Model" className="input input-bordered w-full" />
                <ErrorMessage name="model" component="div" className="text-error" />
              </div>

              <div>
                <label className="label" htmlFor="serial">
                  <span className="label-text">Serial</span>
                </label>
                <Field name="serial" placeholder="Serial" className="input input-bordered w-full" />
                <ErrorMessage name="serial" component="div" className="text-error" />
              </div>

              <div>
                <label className="label" htmlFor="description">
                  <span className="label-text">Description</span>
                </label>
                <Field name="description" placeholder="Description" className="input input-bordered w-full" />
                <ErrorMessage name="description" component="div" className="text-error" />
              </div>

              <div>
                <label className="label" htmlFor="status">
                  <span className="label-text">Status</span>
                </label>
                <Field as="select" name="status" className="select select-bordered w-full">
                  <option value="">Select a Status</option>
                  {uniqueStatus.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </Field>
                <ErrorMessage name="status" component="div" className="text-error" />
              </div>

              <div>
                <label className="label" htmlFor="productId">
                  <span className="label-text">Product ID</span>
                </label>
                <Field name="productId" placeholder="Product ID" className="input input-bordered w-full" />
                <ErrorMessage name="productId" component="div" className="text-error" />
              </div>

              <div>
                <label className="label" htmlFor="siteId">
                  <span className="label-text">Site ID</span>
                </label>
                <Field name="siteId" placeholder="Site ID" className="input input-bordered w-full" />
                <ErrorMessage name="siteId" component="div" className="text-error" />
              </div>

              <div>
                <label className="label" htmlFor="storageLocation">
                  <span className="label-text">Storage Location</span>
                </label>
                <Field name="storageLocation" placeholder="Storage Location" className="input input-bordered w-full" />
                <ErrorMessage name="storageLocation" component="div" className="text-error" />
              </div>

              <div>
                <label className="label" htmlFor="itemOwner">
                  <span className="label-text">Item Owner</span>
                </label>
                <Field name="itemOwner" placeholder="Item Owner" className="input input-bordered w-full" />
                <ErrorMessage name="itemOwner" component="div" className="text-error" />
              </div>

              <div>
                <label className="label" htmlFor="nokiaSto">
                  <span className="label-text">Nokia STO</span>
                </label>
                <Field name="nokiaSto" placeholder="Nokia STO" className="input input-bordered w-full" />
                <ErrorMessage name="nokiaSto" component="div" className="text-error" />
              </div>

              <div>
                <label className="label" htmlFor="notes">
                  <span className="label-text">Notes</span>
                </label>
                <Field name="notes" placeholder="Notes" className="input input-bordered w-full" />
                <ErrorMessage name="notes" component="div" className="text-error" />
              </div>
            </div>

            <button className="btn btn-primary mt-4" type="submit" disabled={isSubmitting}>Submit</button>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default ToolForm;
