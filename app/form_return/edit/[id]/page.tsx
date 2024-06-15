'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';

const EditFormReturn = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [organizationName, setOrganizationName] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [district, setDistrict] = useState('');
  const [amphoe, setAmphoe] = useState('');
  const [province, setProvince] = useState('');
  const [zipcode, setZipcode] = useState('');
  const [type, setType] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [numberOfSigners, setNumberOfSigners] = useState('');
  const [image1, setImage1] = useState<File | null>(null);
  const [imagePreview1, setImagePreview1] = useState<string | null>(null);
  const [image2, setImage2] = useState<File | null>(null);
  const [imagePreview2, setImagePreview2] = useState<string | null>(null);
  const router = useRouter();
  const { id } = useParams();

  useEffect(() => {
    const fetchForm = async () => {
      if (id) {
        const res = await axios.get(`/api/form_return/${id}`);
        const form = res.data;
        setFirstName(form.firstName);
        setLastName(form.lastName);
        setOrganizationName(form.organizationName);
        setAddressLine1(form.addressLine1);
        setDistrict(form.district);
        setAmphoe(form.amphoe);
        setProvince(form.province);
        setZipcode(form.zipcode);
        setType(form.type);
        setPhoneNumber(form.phoneNumber);
        setNumberOfSigners(form.numberOfSigners.toString());
        setImagePreview1(form.image1);
        setImagePreview2(form.image2);
      }
    };
    fetchForm();
  }, [id]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, setImage: React.Dispatch<React.SetStateAction<File | null>>, setImagePreview: React.Dispatch<React.SetStateAction<string | null>>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setImage(file);
    } else {
      setImage(null);
      setImagePreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append('firstName', firstName);
      formData.append('lastName', lastName);
      formData.append('organizationName', organizationName);
      formData.append('addressLine1', addressLine1);
      formData.append('district', district);
      formData.append('amphoe', amphoe);
      formData.append('province', province);
      formData.append('zipcode', zipcode);
      formData.append('type', type);
      formData.append('phoneNumber', phoneNumber);
      formData.append('numberOfSigners', numberOfSigners);
      if (image1) formData.append('image1', image1);
      if (image2) formData.append('image2', image2);

      await axios.put(`/api/form_return/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      router.push('/form_return');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6">Edit Form Return</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
            First Name
          </label>
          <input
            type="text"
            name="firstName"
            id="firstName"
            required
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
            Last Name
          </label>
          <input
            type="text"
            name="lastName"
            id="lastName"
            required
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="organizationName" className="block text-sm font-medium text-gray-700">
            Organization Name
          </label>
          <input
            type="text"
            name="organizationName"
            id="organizationName"
            required
            value={organizationName}
            onChange={(e) => setOrganizationName(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="addressLine1" className="block text-sm font-medium text-gray-700">
            Address Line 1
          </label>
          <input
            type="text"
            name="addressLine1"
            id="addressLine1"
            required
            value={addressLine1}
            onChange={(e) => setAddressLine1(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="district" className="block text-sm font-medium text-gray-700">
            District
          </label>
          <input
            type="text"
            name="district"
            id="district"
            required
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="amphoe" className="block text-sm font-medium text-gray-700">
            Amphoe
          </label>
          <input
            type="text"
            name="amphoe"
            id="amphoe"
            required
            value={amphoe}
            onChange={(e) => setAmphoe(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="province" className="block text-sm font-medium text-gray-700">
            Province
          </label>
          <input
            type="text"
            name="province"
            id="province"
            required
            value={province}
            onChange={(e) => setProvince(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="zipcode" className="block text-sm font-medium text-gray-700">
            Zipcode
          </label>
          <input
            type="text"
            name="zipcode"
            id="zipcode"
            required
            value={zipcode}
            onChange={(e) => setZipcode(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700">
            Type
          </label>
          <input
            type="text"
            name="type"
            id="type"
            required
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
            Phone Number
          </label>
          <input
            type="text"
            name="phoneNumber"
            id="phoneNumber"
            required
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="numberOfSigners" className="block text-sm font-medium text-gray-700">
            Number of Signers
          </label>
          <input
            type="number"
            name="numberOfSigners"
            id="numberOfSigners"
            required
            value={numberOfSigners}
            onChange={(e) => setNumberOfSigners(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="image1" className="block text-sm font-medium text-gray-700">
            Image 1
          </label>
          <input
            type="file"
            name="image1"
            id="image1"
            onChange={(e) => handleImageChange(e, setImage1, setImagePreview1)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          {imagePreview1 && (
            <div className="mt-4">
              <Image
                src={imagePreview1}
                alt="Image 1 Preview"
                width={200}
                height={200}
                className="rounded-md"
              />
            </div>
          )}
        </div>
        <div>
          <label htmlFor="image2" className="block text-sm font-medium text-gray-700">
            Image 2
          </label>
          <input
            type="file"
            name="image2"
            id="image2"
            onChange={(e) => handleImageChange(e, setImage2, setImagePreview2)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          {imagePreview2 && (
            <div className="mt-4">
              <Image
                src={imagePreview2}
                alt="Image 2 Preview"
                width={200}
                height={200}
                className="rounded-md"
              />
            </div>
          )}
        </div>
        <div>
          <button
            type="submit"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Update
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditFormReturn;
