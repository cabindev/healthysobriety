"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

interface FormReturn {
  id: number;
  firstName: string;
  lastName: string;
  organizationName: string;
  addressLine1: string;
  subDistrict: string;
  district: string;
  province: string;
  zipcode: string;
  phoneNumber: string;
  image1: string | null;
  image2: string | null;
  numberOfSigners: number;
}

export default function ListFormReturn() {
  const [forms, setForms] = useState<FormReturn[]>([]);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('desc');

  useEffect(() => {
    fetchForms();
  }, [search, sort]);

  const fetchForms = async () => {
    try {
      const query = new URLSearchParams({ search, sort }).toString();
      const res = await axios.get(`/api/form_return?${query}`);
      const data = res.data;
  
      if (data && Array.isArray(data.forms)) {
        setForms(data.forms);
      } else {
        console.error('Invalid forms data:', data);
        setForms([]); // Set forms to an empty array if the data is invalid
      }
    } catch (error) {
      console.error('Failed to fetch forms', error);
      setForms([]); // Set forms to an empty array in case of an error
    }
  };

  const handleApplyFilters = () => {
    fetchForms();
  };

  const deleteForm = async (id: number) => {
    try {
      await axios.delete(`/api/form_return/${id}`);
      fetchForms();
    } catch (error) {
      console.error('Failed to delete the form', error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6">Form Returns</h1>

      <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
        <div className="flex flex-wrap gap-4 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full sm:w-auto"
          />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full sm:w-auto"
          >
            <option value="desc">Latest</option>
            <option value="asc">Oldest</option>
          </select>
          <button
            onClick={handleApplyFilters}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors w-full sm:w-auto"
          >
            Apply
          </button>
        </div>
      </div>

      <div className="shadow overflow-x-auto border-b border-gray-200 sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Organization
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Address
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Phone
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Image/1
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Image/2
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {forms.map((form) => (
              <tr key={form.id}>
                <td className="px-6 py-4 whitespace-normal">
                  <div className="text-sm font-medium text-gray-900">
                    {form.firstName} {form.lastName}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-normal">
                  <div className="text-sm font-medium text-gray-900">
                    {form.organizationName}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-normal">
                  <div className="text-sm font-medium text-gray-900">
                    {form.addressLine1}, {form.subDistrict}, {form.district}, {form.province}, {form.zipcode}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-normal">
                  <div className="text-sm font-medium text-gray-900">
                    {form.phoneNumber}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-normal">
                  {form.image1 && (
                    <div className="avatar">
                      <div className="w-8 rounded">
                        <img src={form.image1} alt={`image1-${form.id}`} className="object-cover" />
                      </div>
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-normal">
                  {form.image2 && (
                    <div className="avatar">
                      <div className="w-8 rounded">
                        <img src={form.image2} alt={`image2-${form.id}`} className="object-cover" />
                      </div>
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-normal text-sm font-medium">
                  <Link className="text-indigo-600 hover:text-indigo-900 mr-4" href={`/form_return/edit/${form.id}`}>
                    Edit
                  </Link>
                  <button onClick={() => deleteForm(form.id)} className="text-red-600 hover:text-red-900">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Link
        className="mt-4 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        href="/form_return/create"
      >
        Create a New Form
      </Link>
    </div>
  );
}
