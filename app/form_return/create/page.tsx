'use client';
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Toaster, toast } from 'react-hot-toast';
import imageCompression from 'browser-image-compression';
import { data } from '@/app/data/regions';

const CreateFormReturn = () => {
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
  const [suggestions, setSuggestions] = useState<any[]>([]);

  const router = useRouter();

  const allowedExtensions = ['.jpg', '.jpeg', '.webp', '.svg', '.png'];

  const handleImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    setImage: React.Dispatch<React.SetStateAction<File | null>>,
    setImagePreview: React.Dispatch<React.SetStateAction<string | null>>
  ) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      if (!allowedExtensions.includes(`.${fileExtension}`)) {
        toast.error('Only image files are allowed.');
        return;
      }

      try {
        const options = {
          maxSizeMB: 0.5, // 500 KB
          maxWidthOrHeight: 1024,
          useWebWorker: true,
        };
        const compressedFile = await imageCompression(file, options);
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(compressedFile);
        setImage(compressedFile);
      } catch (error) {
        console.error('Error compressing image', error);
        toast.error('Error compressing image');
      }
    } else {
      setImage(null);
      setImagePreview(null);
    }
  };

  const checkPhoneNumberExists = async (phoneNumber: string) => {
    try {
      const response = await axios.get(`/api/form_return/check-phone?phoneNumber=${phoneNumber}`);
      return response.data.exists;
    } catch (error) {
      console.error('Error checking phone number:', error);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const phoneExists = await checkPhoneNumberExists(phoneNumber);
      if (phoneExists) {
        toast.error('This phone number is already in use.');
        return;
      }

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
      formData.append('numberOfSigners', numberOfSigners.toString());
      if (image1) formData.append('image1', image1);
      if (image2) formData.append('image2', image2);

      const response = await axios.post('/api/form_return', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.error) {
        toast.error(response.data.error);
      } else {
        toast.success('Form submitted successfully.');
        router.push('/form_return');
      }
    } catch (error) {
      console.error('Error in form submission:', error);
      toast.error('An error occurred while submitting the form.');
    }
  };

  const handleDistrictChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDistrict(value);

    if (value.length > 0) {
      const filteredSuggestions = data
        .filter((region) => region.district.startsWith(value))
        .slice(0, 10);
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion: any) => {
    setDistrict(suggestion.district);
    setAmphoe(suggestion.amphoe);
    setProvince(suggestion.province);
    setZipcode(suggestion.zipcode.toString());
    setType(suggestion.type);
    setSuggestions([]);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Toaster />
      <h1 className="text-2xl font-semibold mb-6">Create a New Form Return</h1>
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
            onChange={handleDistrictChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          {suggestions.length > 0 && (
            <ul className="border border-gray-300 mt-1 max-h-60 overflow-auto">
              {suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="cursor-pointer p-2 hover:bg-gray-200"
                >
                  {suggestion.district} - {suggestion.amphoe}, {suggestion.province}, {suggestion.zipcode}
                </li>
              ))}
            </ul>
          )}
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
            onBlur={async () => {
              const phoneExists = await checkPhoneNumberExists(phoneNumber);
              if (phoneExists) {
                toast.error('This phone number is already in use.');
              }
            }}
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
                alt="Image Preview 1"
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
                alt="Image Preview 2"
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
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateFormReturn;
