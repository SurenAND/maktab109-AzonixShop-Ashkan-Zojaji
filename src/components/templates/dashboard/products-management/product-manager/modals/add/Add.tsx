import {
  useGetCategories,
  useGetSubCategories,
} from '@/src/api/category/category.queries';
import { useAddProduct } from '@/src/api/product/product.queries';
import DragDropImageUploader from '@/src/components/shared/dragdrop-image-uploader/DragDropImageUploader';
import MyFileInput from '@/src/components/shared/file-input/FileInput';
import { useEffect, useState } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { FaTimes } from 'react-icons/fa';

type AddModalProps = {
  openAdd: boolean;
  onClose: () => void;
};

const AddPopUp = ({ openAdd, onClose }: AddModalProps) => {
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const [images, setImages] = useState<File[]>([]);
  const { mutate: addNewProduct } = useAddProduct();
  const { data: categories } = useGetCategories();
  const [productCategory, setProductCategory] = useState('');
  const { data: subCategories, refetch } = useGetSubCategories({
    category: productCategory,
  });

  const filteredList = (id: string) => {
    setProductCategory(id);
  };

  const deleteImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  useEffect(() => {
    if (categories) {
      setProductCategory(categories.data.categories[0]._id);
    }
  }, [categories]);

  useEffect(() => {
    refetch();
  }, [productCategory]);

  // handle mage change on mobile and tablets
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImages((prev) => [...prev, file]);
    }
  };

  function handleForm(data: FieldValues) {
    const FD = new FormData();
    FD.append('name', data.name);
    FD.append('price', data.price);
    FD.append('quantity', data.quantity);
    FD.append('brand', data.brand);
    FD.append('category', data.category);
    FD.append('subcategory', data.subcategory);
    FD.append('description', data.description);
    if (images && images.length > 0) {
      images.forEach((image) => {
        FD.append('images', image);
      });
    }
    addNewProduct(FD, {
      onSuccess: (data) => {
        if (data.status === 'success') {
          reset();
          setImages([]);
          onClose();
        }
      },
    });
  }

  return (
    // backdrop
    <div
      onClick={onClose}
      className={`fixed inset-0 z-50 flex items-center justify-center transition-colors ${
        openAdd ? 'visible bg-black/30' : 'invisible'
      }`}
    >
      {/* modal */}
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative flex max-h-[95vh] w-2/3 flex-col items-center justify-start overflow-y-auto rounded-xl bg-white p-6 text-start shadow transition-all dark:bg-gray-800 lg:w-1/2 ${
          openAdd ? 'scale-100 opacity-100' : 'scale-125 opacity-0'
        }`}
      >
        {/* close button */}
        <button
          onClick={onClose}
          className='absolute end-4 top-4 rounded-lg p-1 text-gray-400 hover:text-red-500 dark:hover:text-white'
        >
          <FaTimes />
        </button>

        {/* add form */}
        <form
          onSubmit={handleSubmit(handleForm)}
          className='grid w-full grid-cols-1 gap-4'
        >
          {/* Product Name */}
          <div className='flex flex-col'>
            <label className='mb-2 dark:text-gray-300'>
              {t('product-name')} :
            </label>
            <input
              type='text'
              {...register('name', {
                required: true,
              })}
              className='rounded border p-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
            />
            {/* name error message */}
            <p
              className={`text-xs text-rose-400 ${
                errors.name ? 'visible' : 'invisible'
              }`}
            >
              {t('product-name-input-error')}
            </p>
          </div>
          {/* Product Price */}
          <div className='grid grid-cols-2 gap-4'>
            <div className='flex flex-col'>
              <label className='mb-2 dark:text-gray-300'>
                {t('product-price')} :
              </label>
              <input
                type='text'
                {...register('price', {
                  required: true,
                  pattern: /^[0-9]+$/,
                })}
                className='rounded border p-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
              />
              {/* price error message */}
              <p
                className={`text-xs text-rose-400 ${
                  errors.price ? 'visible' : 'invisible'
                }`}
              >
                {t('product-price-input-error')}
              </p>
            </div>
            {/* Product Quantity */}
            <div className='flex flex-col'>
              <label className='mb-2 dark:text-gray-300'>
                {t('product-quantity')} :
              </label>
              <input
                type='text'
                {...register('quantity', {
                  required: true,
                  pattern: /^[0-9]+$/,
                })}
                className='rounded border p-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
              />
              {/* quantity error message */}
              <p
                className={`text-xs text-rose-400 ${
                  errors.quantity ? 'visible' : 'invisible'
                }`}
              >
                {t('product-quantity-input-error')}
              </p>
            </div>
          </div>
          {/* Product Brand & Category & Sub Category */}
          <div className='grid gap-4 md:grid-cols-3'>
            {/* Product Brand */}
            <div className='flex flex-col'>
              <label className='mb-2 dark:text-gray-300'>
                {t('product-brand')} :
              </label>
              <input
                type='text'
                {...register('brand', {
                  required: true,
                  pattern: /^[a-zA-Z0-9 ]+$/,
                })}
                className='rounded border p-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
              />
              {/* brand error message */}
              <p
                className={`text-xs text-rose-400 ${
                  errors.brand ? 'visible' : 'invisible'
                }`}
              >
                {t('product-brand-input-error')}
              </p>
            </div>
            {/* Product Category */}
            <div className='flex flex-col'>
              <label className='mb-2 dark:text-gray-300'>
                {t('product-category')} :
              </label>
              <select
                {...register('category', { required: true })}
                onChange={(e) => filteredList(e.target.value)}
                className='rounded border p-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
              >
                {categories?.data.categories.map((category) => (
                  <option value={category._id}>{category.name}</option>
                ))}
              </select>
              {/* category error message */}
              <p
                className={`text-xs text-rose-400 ${
                  errors.category ? 'visible' : 'invisible'
                }`}
              >
                {t('product-category-input-error')}
              </p>
            </div>
            {/* Product Sub Category */}
            <div className='flex flex-col'>
              <label className='mb-2 dark:text-gray-300'>
                {t('product-sub-category')} :
              </label>
              <select
                {...register('subcategory', { required: true })}
                className='rounded border p-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
              >
                {productCategory &&
                  subCategories?.data.subcategories.map((subCategory) => (
                    <option value={subCategory._id}>{subCategory.name}</option>
                  ))}
              </select>
              {/* subcategory error message */}
              <p
                className={`text-xs text-rose-400 ${
                  errors.subcategory ? 'visible' : 'invisible'
                }`}
              >
                {t('product-sub-category-input-error')}
              </p>
            </div>
          </div>
          {/* Product Description */}
          <div className='flex flex-col'>
            <label className='mb-2 dark:text-gray-300'>
              {t('product-description')} :
            </label>
            <textarea
              {...register('description', { required: true, minLength: 10 })}
              className='resize-none rounded border p-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
              rows={2}
            />
            {/* description error message */}
            <p
              className={`text-xs text-rose-400 ${
                errors.description ? 'visible' : 'invisible'
              }`}
            >
              {t('product-description-input-error')}
            </p>
          </div>
          {/* Product Image */}
          <div className='flex flex-col lg:hidden'>
            <label className='mb-2 dark:text-gray-300'>
              {t('product-image')} :
            </label>
            <MyFileInput changeHandler={handleImageChange} />
          </div>
          <DragDropImageUploader
            images={images}
            setImages={setImages}
            deleteImage={deleteImage}
          />
          {/* Add Product Button */}
          <button
            type='submit'
            className='w-full rounded bg-purple-700 py-2 text-white hover:bg-purple-800 dark:bg-purple-900 dark:hover:bg-purple-800'
          >
            {t('add-product')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddPopUp;
