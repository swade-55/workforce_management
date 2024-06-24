import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateTool } from '../slices/toolSlice';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const ToolCard = ({ tool, handleDelete }) => {
  const dispatch = useDispatch();
  const [showFullNotes, setShowFullNotes] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const validationSchema = Yup.object({
    serialNumber: Yup.string().required('Serial Number is required'),
    productName: Yup.string().required('Product Name is required'),
    productId: Yup.string().required('Product ID is required'),
    description: Yup.string().required('Description is required'),
    siteId: Yup.string().required('Site ID is required'),
    storageLocation: Yup.string().required('Storage Location is required'),
    status: Yup.string().required('Status is required'),
    itemOwner: Yup.string().required('Item Owner is required'),
    nokiaSto: Yup.string().required('Nokia STO is required'),
    notes: Yup.string(),
  });

  const formik = useFormik({
    initialValues: {
      serialNumber: tool.serialNumber || '',
      productName: tool.productName || '',
      productId: tool.productId || '',
      description: tool.description || '',
      siteId: tool.siteId || '',
      storageLocation: tool.storageLocation || '',
      status: tool.status || '',
      itemOwner: tool.itemOwner || '',
      nokiaSto: tool.nokiaSto || '',
      notes: tool.notes || '',
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

  const toggleNotes = () => {
    setShowFullNotes(!showFullNotes);
  };

  return (
    <tr>
      {editMode ? (
        <>
          <td className="px-4 py-2">
            <input
              type="text"
              className="input input-bordered w-full"
              {...formik.getFieldProps('serialNumber')}
            />
            {formik.errors.serialNumber && <div className="text-error">{formik.errors.serialNumber}</div>}
          </td>
          <td className="px-4 py-2">
            <input
              type="text"
              className="input input-bordered w-full"
              {...formik.getFieldProps('productName')}
            />
            {formik.errors.productName && <div className="text-error">{formik.errors.productName}</div>}
          </td>
          <td className="px-4 py-2">
            <input
              type="text"
              className="input input-bordered w-full"
              {...formik.getFieldProps('productId')}
            />
            {formik.errors.productId && <div className="text-error">{formik.errors.productId}</div>}
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
              {...formik.getFieldProps('siteId')}
            />
            {formik.errors.siteId && <div className="text-error">{formik.errors.siteId}</div>}
          </td>
          <td className="px-4 py-2">
            <input
              type="text"
              className="input input-bordered w-full"
              {...formik.getFieldProps('storageLocation')}
            />
            {formik.errors.storageLocation && <div className="text-error">{formik.errors.storageLocation}</div>}
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
              {...formik.getFieldProps('itemOwner')}
            />
            {formik.errors.itemOwner && <div className="text-error">{formik.errors.itemOwner}</div>}
          </td>
          <td className="px-4 py-2">
            <input
              type="text"
              className="input input-bordered w-full"
              {...formik.getFieldProps('nokiaSto')}
            />
            {formik.errors.nokiaSto && <div className="text-error">{formik.errors.nokiaSto}</div>}
          </td>
          <td className="px-4 py-2">
            <input
              type="text"
              className="input input-bordered w-full"
              {...formik.getFieldProps('notes')}
            />
            {formik.errors.notes && <div className="text-error">{formik.errors.notes}</div>}
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
          <td className="py-2 px-4 border-b border-gray-200" style={{ wordWrap: 'break-word' }}>{tool.serialNumber}</td>
          <td className="py-2 px-4 border-b border-gray-200" style={{ wordWrap: 'break-word' }}>{tool.productName}</td>
          <td className="py-2 px-4 border-b border-gray-200" style={{ wordWrap: 'break-word' }}>{tool.productId}</td>
          <td className="py-2 px-4 border-b border-gray-200" style={{ wordWrap: 'break-word' }}>{tool.description}</td>
          <td className="py-2 px-4 border-b border-gray-200" style={{ wordWrap: 'break-word' }}>{tool.siteId}</td>
          <td className="py-2 px-4 border-b border-gray-200" style={{ wordWrap: 'break-word' }}>{tool.storageLocation}</td>
          <td className="py-2 px-4 border-b border-gray-200" style={{ wordWrap: 'break-word' }}>{tool.status}</td>
          <td className="py-2 px-4 border-b border-gray-200" style={{ wordWrap: 'break-word' }}>{tool.itemOwner}</td>
          <td className="py-2 px-4 border-b border-gray-200" style={{ wordWrap: 'break-word' }}>{tool.nokiaSto}</td>
          <td className="py-2 px-4 border-b border-gray-200" style={{ wordWrap: 'break-word', position: 'relative' }}>
            {showFullNotes ? tool.notes : ''}
            <button 
              onClick={toggleNotes} 
              className="ml-2 btn btn-xs btn-info"
              style={{ position: 'absolute', right: '0', top: '50%', transform: 'translateY(-50%)' }}
            >
              {showFullNotes ? 'Hide' : 'Show'}
            </button>
          </td>
          <td className="py-2 px-4 border-b border-gray-200 text-center">
            <div className="flex justify-center space-x-2">
              <button onClick={() => setEditMode(true)} className="btn btn-primary">Edit</button>
              <button onClick={handleDelete} className="btn btn-error">Delete</button>
            </div>
          </td>
        </>
      )}
    </tr>
  );
};

export default ToolCard;
