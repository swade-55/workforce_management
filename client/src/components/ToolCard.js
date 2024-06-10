import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { deleteTool, updateTool } from '../slices/toolSlice';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const ToolCard = ({ tool, handleDelete }) => {
  const dispatch = useDispatch();
  const [editMode, setEditMode] = useState(false);

  const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    description: Yup.string().required('Description is required'),
    category: Yup.string().required('Category is required'),
    status: Yup.string().required('Status is required'),
    serial: Yup.string().required('Serial is required'),
  });

  const formik = useFormik({
    initialValues: {
      name: tool.name || '',
      description: tool.description || '',
      category: tool.category.name || '',
      status: tool.status || '',
      serial: tool.serial || '',
    },
    validationSchema,
    onSubmit: (values) => {
      const updatedData = {
        toolId: tool.id,
        ...values,
      };
      console.log('Dispatching updateTool with data:', updatedData);
      dispatch(updateTool(updatedData))
        .unwrap()
        .then(() => {
          setEditMode(false); // Turn off edit mode on successful update
        })
        .catch(error => {
          console.error('Error updating tool:', error);
        });
    },
  });

  return (
    <tr>
      {editMode ? (
        <>
          <td className="px-4 py-2">
            <input
              type="text"
              className="input input-bordered w-full"
              {...formik.getFieldProps('name')}
            />
            {formik.errors.name && <div className="text-error">{formik.errors.name}</div>}
          </td>
          <td className="px-4 py-2">
            <input
              type="text"
              className="input input-bordered w-full"
              {...formik.getFieldProps('description')}
            />
            {formik.errors.description && <div className="text-error">{formik.errors.description}</div>}
          </td>
          <td className="px-4 py-2">
            <input
              type="text"
              className="input input-bordered w-full"
              {...formik.getFieldProps('category')}
            />
            {formik.errors.category && <div className="text-error">{formik.errors.category}</div>}
          </td>
          <td className="px-4 py-2">
            <input
              type="text"
              className="input input-bordered w-full"
              {...formik.getFieldProps('status')}
            />
            {formik.errors.status && <div className="text-error">{formik.errors.status}</div>}
          </td>
          <td className="px-4 py-2">
            <input
              type="text"
              className="input input-bordered w-full"
              {...formik.getFieldProps('serial')}
            />
            {formik.errors.serial && <div className="text-error">{formik.errors.serial}</div>}
          </td>
          <td className="px-4 py-2 text-center">
            <div className="flex justify-center space-x-2">
              <button type="button" onClick={formik.handleSubmit} className="btn btn-primary">Save</button>
              <button type="button" onClick={() => setEditMode(false)} className="btn btn-secondary">Cancel</button>
            </div>
          </td>
        </>
      ) : (
        <>
          <td className="px-4 py-2">{tool.name}</td>
          <td className="px-4 py-2">{tool.description}</td>
          <td className="px-4 py-2">{tool.category.name}</td>
          <td className="px-4 py-2">{tool.status}</td>
          <td className="px-4 py-2">{tool.serial}</td>
          <td className="px-4 py-2 text-center">
            <div className="flex justify-center space-x-2">
              <button onClick={() => setEditMode(true)} className="btn btn-primary">Edit</button>
              <button onClick={() => handleDelete(tool.id)} className="btn btn-error">Delete</button>
            </div>
          </td>
        </>
      )}
    </tr>
  );
};

export default ToolCard;
