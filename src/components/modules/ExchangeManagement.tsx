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
import AddExchangeForm from "@/components/forms/AddExchangeForm";
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

// Dummy data for exchanges
const initialExchanges = [
  {
    id: '1',
    name: 'New York Stock Exchange',
    country: 'USA',
    socialMediaLink: 'https://twitter.com/NYSE',
    timeZone: 'EST',
    holidaySchedule: 'https://www.nyse.com/markets/hours-calendars',
    webLink: 'https://www.nyse.com/',
  },
  {
    id: '2',
    name: 'London Stock Exchange',
    country: 'UK',
    socialMediaLink: 'https://twitter.com/LSEplc',
    timeZone: 'GMT',
    holidaySchedule: 'https://www.londonstockexchange.com/exchange/news-and-insights/closing-days/closing-days.html',
    webLink: 'https://www.londonstockexchange.com/',
  },
  {
    id: '3',
    name: 'Tokyo Stock Exchange',
    country: 'Japan',
    socialMediaLink: 'https://twitter.com/JPX_official',
    timeZone: 'JST',
    holidaySchedule: 'https://www.jpx.co.jp/corporate/calendar/index.html',
    webLink: 'https://www.jpx.co.jp/en/',
  },
];

const ExchangeManagement: React.FC = () => {
  const [exchanges, setExchanges] = useState(initialExchanges);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddExchangeOpen, setIsAddExchangeOpen] = useState(false);
  const [exchangeToDelete, setExchangeToDelete] = useState<string | null>(null);
  const [exchangeToEdit, setExchangeToEdit] = useState<string | null>(null);

  const filteredExchanges = exchanges.filter(exchange =>
    exchange.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    exchange.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
    exchange.timeZone.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddExchange = (newExchange: any) => {
    setExchanges([...exchanges, {...newExchange, id: String(Date.now())}]);
    setIsAddExchangeOpen(false);
  };

  const handleUpdateExchange = (updatedExchange: any) => {
    setExchanges(exchanges.map(exchange =>
      exchange.id === updatedExchange.id ? updatedExchange : exchange
    ));
    setExchangeToEdit(null);
  };

  const handleDeleteConfirmation = (exchangeId: string) => {
    setExchangeToDelete(exchangeId);
  };

  const handleDelete = () => {
    if (exchangeToDelete) {
      setExchanges(exchanges.filter(exchange => exchange.id !== exchangeToDelete));
      setExchangeToDelete(null);
    }
  };

  const handleEdit = (exchangeId: string) => {
    setExchangeToEdit(exchangeId);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <Input
          type="text"
          placeholder="Search exchanges..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
        <Button onClick={() => setIsAddExchangeOpen(true)}>Add Exchange</Button>
      </div>

      <ScrollArea>
        <Table>
          <TableCaption>List of stock exchanges and their details.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Country</TableHead>
              <TableHead>Time Zone</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredExchanges.map(exchange => (
              <TableRow key={exchange.id}>
                <TableCell>{exchange.name}</TableCell>
                <TableCell>{exchange.country}</TableCell>
                <TableCell>{exchange.timeZone}</TableCell>
                <TableCell className="text-right font-medium">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(exchange.id)}
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
                          exchange from our servers.
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

      {/* Add Exchange Form Modal */}
      {isAddExchangeOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Add Exchange</h3>
            <AddExchangeForm onAddExchange={handleAddExchange} />
            <div className="text-right mt-4">
              <Button variant="secondary" onClick={() => setIsAddExchangeOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Exchange Form Modal (similar structure as Add Exchange) */}
      {exchangeToEdit && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Edit Exchange</h3>
            {/* Implement EditExchangeForm with pre-filled data and update logic */}
            <EditExchangeForm
              exchange={exchanges.find(exchange => exchange.id === exchangeToEdit)}
              onUpdateExchange={handleUpdateExchange}
              onCancel={() => setExchangeToEdit(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

// EditExchangeForm component
const EditExchangeForm: React.FC<{
  exchange: any;
  onUpdateExchange: (updatedExchange: any) => void;
  onCancel: () => void;
}> = ({exchange, onUpdateExchange, onCancel}) => {
  const [name, setName] = useState(exchange?.name || '');
  const [country, setCountry] = useState(exchange?.country || '');
  const [socialMediaLink, setSocialMediaLink] = useState(exchange?.socialMediaLink || '');
  const [timeZone, setTimeZone] = useState(exchange?.timeZone || '');
  const [holidaySchedule, setHolidaySchedule] = useState(exchange?.holidaySchedule || '');
  const [webLink, setWebLink] = useState(exchange?.webLink || '');

  const handleSubmit = () => {
    onUpdateExchange({id: exchange.id, name, country, socialMediaLink, timeZone, holidaySchedule, webLink});
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Exchange Name</label>
        <input
          type="text"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          value={name}
          onChange={e => setName(e.target.value)}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Country</label>
        <input
          type="text"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          value={country}
          onChange={e => setCountry(e.target.value)}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Social Media Link</label>
        <input
          type="text"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          value={socialMediaLink}
          onChange={e => setSocialMediaLink(e.target.value)}
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
      <div>
        <label className="block text-sm font-medium text-gray-700">Holiday Schedule</label>
        <input
          type="text"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          value={holidaySchedule}
          onChange={e => setHolidaySchedule(e.target.value)}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Web Link</label>
        <input
          type="text"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          value={webLink}
          onChange={e => setWebLink(e.target.value)}
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

export default ExchangeManagement;
