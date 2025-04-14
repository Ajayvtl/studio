'use client';

import React, {useState} from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {Input} from '@/components/ui/input';
import {Button} from '@/components/ui/button';
import {AddCountryForm} from "@/components/forms/AddCountryForm";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {Edit, Trash} from "lucide-react";
import {ScrollArea} from "@/components/ui/scroll-area";

// Dummy data for countries
const initialCountries = [
  {id: '1', name: 'United States', isoCode: 'US', timeZone: 'EST'},
  {id: '2', name: 'Canada', isoCode: 'CA', timeZone: 'EST'},
  {id: '3', name: 'United Kingdom', isoCode: 'GB', timeZone: 'GMT'},
  {id: '4', name: 'Germany', isoCode: 'DE', timeZone: 'CET'},
  {id: '5', name: 'Japan', isoCode: 'JP', timeZone: 'JST'},
];

const CountryManagement: React.FC = () => {
  const [countries, setCountries] = useState(initialCountries);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddCountryOpen, setIsAddCountryOpen] = useState(false);
  const [countryToDelete, setCountryToDelete] = useState<string | null>(null);
  const [countryToEdit, setCountryToEdit] = useState<string | null>(null);

  const filteredCountries = countries.filter(country =>
    country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    country.isoCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
    country.timeZone.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddCountry = (newCountry: any) => {
    setCountries([...countries, {...newCountry, id: String(Date.now())}]);
    setIsAddCountryOpen(false);
  };

  const handleUpdateCountry = (updatedCountry: any) => {
    setCountries(countries.map(country =>
      country.id === updatedCountry.id ? updatedCountry : country
    ));
    setCountryToEdit(null);
  };

  const handleDeleteConfirmation = (countryId: string) => {
    setCountryToDelete(countryId);
  };

  const handleDelete = () => {
    if (countryToDelete) {
      setCountries(countries.filter(country => country.id !== countryToDelete));
      setCountryToDelete(null);
    }
  };

  const handleEdit = (countryId: string) => {
    setCountryToEdit(countryId);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <Input
          type="text"
          placeholder="Search countries..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
        <Button onClick={() => setIsAddCountryOpen(true)}>Add Country</Button>
      </div>

      <ScrollArea>
        <Table>
          <TableCaption>List of countries and their details.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>ISO Code</TableHead>
              <TableHead>Time Zone</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCountries.map(country => (
              <TableRow key={country.id}>
                <TableCell>{country.name}</TableCell>
                <TableCell>{country.isoCode}</TableCell>
                <TableCell>{country.timeZone}</TableCell>
                <TableCell className="text-right font-medium">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(country.id)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <Trash className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete the
                          country from our servers.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>

      {/* Add Country Form Modal */}
      {isAddCountryOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Add Country</h3>
            <AddCountryForm onAddCountry={handleAddCountry} />
            <div className="text-right mt-4">
              <Button variant="secondary" onClick={() => setIsAddCountryOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Country Form Modal (similar structure as Add Country) */}
      {countryToEdit && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Edit Country</h3>
            {/* Implement EditCountryForm with pre-filled data and update logic */}
            <EditCountryForm
              country={countries.find(country => country.id === countryToEdit)}
              onUpdateCountry={handleUpdateCountry}
              onCancel={() => setCountryToEdit(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

// EditCountryForm component
const EditCountryForm: React.FC<{
  country: any;
  onUpdateCountry: (updatedCountry: any) => void;
  onCancel: () => void;
}> = ({country, onUpdateCountry, onCancel}) => {
  const [name, setName] = useState(country?.name || '');
  const [isoCode, setIsoCode] = useState(country?.isoCode || '');
  const [timeZone, setTimeZone] = useState(country?.timeZone || '');

  const handleSubmit = () => {
    onUpdateCountry({id: country.id, name, isoCode, timeZone});
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Country Name</label>
        <input
          type="text"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          value={name}
          onChange={e => setName(e.target.value)}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">ISO Code</label>
        <input
          type="text"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          value={isoCode}
          onChange={e => setIsoCode(e.target.value)}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Time Zone</label>
        <input
          type="text"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          value={timeZone}
          onChange={e => setTimeZone(e.target.value)}
        />
      </div>
      <div className="flex justify-end gap-4">
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSubmit}>Update</Button>
      </div>
    </div>
  );
};


export default CountryManagement;
