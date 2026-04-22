import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "../../components/ui/table";
import Badge from "../../components/ui/badge/Badge";
import Input from "../../components/form/input/InputField";
import MultiSelect from "../../components/form/MultiSelect";
import ComponentCard from "../../components/common/ComponentCard";
import DatePicker from "../../components/form/date-picker.tsx";

import flatpickr from "flatpickr";
import DateOption = flatpickr.Options.DateOption;

import { useEffect, useState } from 'react';
import api from '../../api';

import EditModal from './EditModal';

interface User {
    id: number;
    first_name: string;
    last_name: string;
    username: string;
    email: string;
    phone: string;
    last_login: string;
    license_number: string;
    license_type: string;
    contact_name: string;
    contact_phone: string;
    status: string;
}

const TableOne = () => {

    const [userList, setUserList] = useState<User[]>([]);
    const [itemsPerPage, setItemsPerPage] = useState(20);
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');

    const [filterOpen, setFilterOpen] = useState(false);

    const [sortConfig, setSortConfig] = useState<{
        key: keyof User;
        direction: 'asc' | 'desc'
    } | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [from, setFrom] = useState(0);
    const [to, setTo] = useState(0);
    const [totalRecords, setTotalRecords] = useState(0);

    const [selectedDateFrom, setSelectedDateFrom] = useState<DateOption>();
    const [selectedDateTo, setSelectedDateTo] = useState<DateOption>();
    const [selectedValues, setSelectedValues] = useState<string[]>([]);
    const multiOptions = [
        { value: "Active", text: "Active", selected: false },
        { value: "Inactive", text: "Inactive", selected: false },
    ];

    const formatDate = (utcDateString: string) => {
        if (!utcDateString) return "";

        const date = new Date(utcDateString);

        return date.toLocaleString('zh-TW', {
            timeZone: 'Australia/Sydney',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });
    };

    const sortedData = [...userList].sort((a, b) => {
        if (!sortConfig) return 0;

        const { key, direction } = sortConfig;
        const isAsc = direction === 'asc';

        if (key === 'last_login') {
            const timeA = a[key] ? new Date(a[key]).getTime() : 0;
            const timeB = b[key] ? new Date(b[key]).getTime() : 0;

            if (timeA === timeB) return 0;
            return isAsc ? timeA - timeB : timeB - timeA;
        }

        if (a[key] === b[key]) return 0;

        const result = a[key] < b[key] ? -1 : 1;
        return isAsc ? result : -result;
    });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const fetchUsers = async () => {

        try {
            const response = await api.get('/api/driver', {
                params: {
                    page: currentPage,
                    per_page: itemsPerPage,
                    search: searchTerm,
                    select_date_from: selectedDateFrom,
                    select_date_to: selectedDateTo,
                    select_status: selectedValues,
                }
            });
            setUserList(response.data.data);
            setTotalPages(response.data.pagination.total_pages);
            setFrom(response.data.pagination.from);
            setTo(response.data.pagination.to);
            setTotalRecords(response.data.pagination.total_records);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const requestSort = (key: keyof User) => {
        let direction: 'asc' | 'desc' = 'asc';

        if (sortConfig?.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }

        setSortConfig({ key, direction });
    };


    const handleAddClick = () => {
        setSelectedUser(null);
        setIsModalOpen(true);
    };

    const handleEditClick = (user: User) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    };

    const handleSave = async (formData: any) => {
        try {
            if (selectedUser) {
                
                await api.put(`/api/driver/${selectedUser.id}`, formData);
            } else {
                
                await api.post('/api/driver', formData);
            }
            setIsModalOpen(false);
            fetchUsers();
        } catch (error) {
            console.error('Error:', error);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchTerm);
            setCurrentPage(1);
        }, 500);

        return () => clearTimeout(timer);
    }, [searchTerm]);

    useEffect(() => {
        fetchUsers();
    }, [currentPage, itemsPerPage, debouncedSearch, selectedDateFrom, selectedDateTo, selectedValues]);

    return (

        <div
            className={`rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]`}
        >
            {/* Card Header */}

            <div className="flex flex-col items-center px-4 py-5 xl:px-6 xl:py-6">
                <div className="flex flex-col w-full gap-5 sm:justify-between xl:flex-row xl:items-center">
                    <div className="flex flex-wrap items-center gap-x-1 gap-y-2 rounded-lg p-0.5 dark:bg-gray-900">
                        <div className="flex items-center gap-3">
                            <span className="text-gray-500 dark:text-gray-400"> Show </span>
                            <div className="relative z-20 bg-transparent">
                                <select
                                    value={itemsPerPage}
                                    onChange={(e) => {
                                        setItemsPerPage(Number(e.target.value));
                                        setCurrentPage(1);
                                    }}
                                    className="dark:bg-dark-900 shadow-theme-xs focus:border-brand-300 focus:ring-brand-500/10 dark:focus:border-brand-800 h-9 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none py-2 pr-8 pl-3 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 text-gray-500 dark:text-gray-400">
                                    <option value="20" className="text-gray-500 dark:bg-gray-900 dark:text-gray-400">
                                        20
                                    </option>
                                    <option value="50" className="text-gray-500 dark:bg-gray-900 dark:text-gray-400">
                                        50
                                    </option>
                                    <option value="100" className="text-gray-500 dark:bg-gray-900 dark:text-gray-400">
                                        100
                                    </option>
                                </select>
                                <span className="pointer-events-none absolute right-2 top-1/2 z-30 -translate-y-1/2">
                                    <svg className="stroke-current" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M3.8335 5.9165L8.00016 10.0832L12.1668 5.9165" stroke="" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                                    </svg>
                                </span>
                            </div>
                            <span className="text-gray-500 dark:text-gray-400"> entries </span>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 xl:justify-end">

                        <button onClick={handleAddClick} className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white shadow-theme-xs hover:bg-brand-600">
                            Add New Driver

                            <svg className="fill-current" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M9.2502 4.99951C9.2502 4.5853 9.58599 4.24951 10.0002 4.24951C10.4144 4.24951 10.7502 4.5853 10.7502 4.99951V9.24971H15.0006C15.4148 9.24971 15.7506 9.5855 15.7506 9.99971C15.7506 10.4139 15.4148 10.7497 15.0006 10.7497H10.7502V15.0001C10.7502 15.4143 10.4144 15.7501 10.0002 15.7501C9.58599 15.7501 9.2502 15.4143 9.2502 15.0001V10.7497H5C4.58579 10.7497 4.25 10.4139 4.25 9.99971C4.25 9.5855 4.58579 9.24971 5 9.24971H9.2502V4.99951Z" fill=""></path>
                            </svg>
                        </button>

                        <div className="relative">
                            <button className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-500 dark:text-gray-400">
                                <svg className="fill-current" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M3.04199 9.37363C3.04199 5.87693 5.87735 3.04199 9.37533 3.04199C12.8733 3.04199 15.7087 5.87693 15.7087 9.37363C15.7087 12.8703 12.8733 15.7053 9.37533 15.7053C5.87735 15.7053 3.04199 12.8703 3.04199 9.37363ZM9.37533 1.54199C5.04926 1.54199 1.54199 5.04817 1.54199 9.37363C1.54199 13.6991 5.04926 17.2053 9.37533 17.2053C11.2676 17.2053 13.0032 16.5344 14.3572 15.4176L17.1773 18.238C17.4702 18.5309 17.945 18.5309 18.2379 18.238C18.5308 17.9451 18.5309 17.4703 18.238 17.1773L15.4182 14.3573C16.5367 13.0033 17.2087 11.2669 17.2087 9.37363C17.2087 5.04817 13.7014 1.54199 9.37533 1.54199Z" fill=""></path>
                                </svg>
                            </button>
                            <Input
                                id="search"
                                name="search"
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setCurrentPage(1);
                                }}
                                placeholder="Search"
                                type="text"
                                className="dark:bg-dark-900 shadow-theme-xs focus:border-brand-300 focus:ring-brand-500/10 dark:focus:border-brand-800 h-11 w-full rounded-lg border border-gray-300 bg-transparent py-2.5 pr-4 pl-11 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-hidden xl:w-[300px] dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
                            />
                        </div>

                        <div className="relative">
                            <button
                                onClick={() => setFilterOpen(!filterOpen)}
                                className={`inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2.5 text-theme-sm font-medium shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 ${selectedValues.length > 0 || selectedDateFrom || selectedDateTo
                                    ? 'bg-brand-500 text-white'
                                    : 'bg-white4 text-gray-700'
                                    }`}
                                >
                                <svg
                                    className="stroke-current fill-white dark:fill-gray-800"
                                    width="20"
                                    height="20"
                                    viewBox="0 0 20 20"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M2.29004 5.90393H17.7067"
                                        stroke=""
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                    <path
                                        d="M17.7075 14.0961H2.29085"
                                        stroke=""
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                    <path
                                        d="M12.0826 3.33331C13.5024 3.33331 14.6534 4.48431 14.6534 5.90414C14.6534 7.32398 13.5024 8.47498 12.0826 8.47498C10.6627 8.47498 9.51172 7.32398 9.51172 5.90415C9.51172 4.48432 10.6627 3.33331 12.0826 3.33331Z"
                                        fill=""
                                        stroke=""
                                        strokeWidth="1.5"
                                    />
                                    <path
                                        d="M7.91745 11.525C6.49762 11.525 5.34662 12.676 5.34662 14.0959C5.34661 15.5157 6.49762 16.6667 7.91745 16.6667C9.33728 16.6667 10.4883 15.5157 10.4883 14.0959C10.4883 12.676 9.33728 11.525 7.91745 11.525Z"
                                        fill=""
                                        stroke=""
                                        strokeWidth="1.5"
                                    />
                                </svg>
                                Filter
                            </button>

                            {filterOpen && (
                                <>
                                    <div className="fixed inset-0 z-10" onClick={() => setFilterOpen(false)}></div>

                                    <div className="absolute right-0 top-full z-40 w-102">

                                        <div className="space-y-6">
                                            <ComponentCard title="Filter">

                                                <div>
                                                    <DatePicker
                                                        id="date-picker-from"
                                                        label="Last login (from)"
                                                        placeholder="Select a date"
                                                        defaultDate={selectedDateFrom}
                                                        onChange={(date) => setSelectedDateFrom(date[0])}
                                                    />
                                                </div>

                                                <div>
                                                    <DatePicker
                                                        id="date-picker-to"
                                                        label="Last login (to)"
                                                        placeholder="Select a date"
                                                        defaultDate={selectedDateTo}
                                                        onChange={(date) => setSelectedDateTo(date[0])}
                                                    />
                                                </div>

                                                <div className="space-y-6">
                                                    <div>
                                                        <MultiSelect
                                                            label="Status"
                                                            placeholder="Select status"
                                                            options={multiOptions}
                                                            defaultSelected={selectedValues}
                                                            onChange={(values) => setSelectedValues(values)}
                                                        />
                                                    </div>
                                                </div>

                                            </ComponentCard>
                                        </div>

                                    </div>
                                </>
                            )}
                        </div>

                    </div>

                </div>
            </div>

            {/* Card Body */}
            <div className="p-4 border-t border-gray-100 dark:border-gray-800 sm:p-6">
                <div className="space-y-6">

                    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
                        <div className="mb-6 flex items-center justify-between">
                        </div>
                        <div className="max-w-full overflow-x-auto">
                            <Table>
                                {/* Table Header */}
                                <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                                    <TableRow>
                                        <TableCell
                                            isHeader
                                            className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                        >
                                            <div
                                                className="p-2.5 xl:p-5 cursor-pointer hover:text-primary flex items-center gap-1"
                                                onClick={() => requestSort('first_name')}
                                            >
                                                First Name
                                                {sortConfig?.key === 'first_name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                                            </div>
                                        </TableCell>
                                        <TableCell
                                            isHeader
                                            className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                        >
                                            <div
                                                className="p-2.5 xl:p-5 cursor-pointer hover:text-primary flex items-center gap-1"
                                                onClick={() => requestSort('last_name')}
                                            >
                                                Last Name
                                                {sortConfig?.key === 'last_name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                                            </div>
                                        </TableCell>
                                        <TableCell
                                            isHeader
                                            className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                        >
                                            <div
                                                className="p-2.5 xl:p-5 cursor-pointer hover:text-primary flex items-center gap-1"
                                                onClick={() => requestSort('username')}
                                            >
                                                Username
                                                {sortConfig?.key === 'username' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                                            </div>
                                        </TableCell>
                                        <TableCell
                                            isHeader
                                            className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                        >
                                            <div
                                                className="p-2.5 xl:p-5 cursor-pointer hover:text-primary flex items-center gap-1"
                                                onClick={() => requestSort('license_number')}
                                            >
                                                License Number
                                                {sortConfig?.key === 'license_number' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                                            </div>
                                        </TableCell>
                                        <TableCell
                                            isHeader
                                            className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                        >
                                            
                                            <div
                                                className="p-2.5 xl:p-5 cursor-pointer hover:text-primary flex items-center gap-1"
                                                onClick={() => requestSort('license_type')}
                                            >
                                                License Type
                                                {sortConfig?.key === 'license_type' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                                            </div>
                                        </TableCell>
                                        <TableCell
                                            isHeader
                                            className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                        >
                                            <div
                                                className="p-2.5 xl:p-5 cursor-pointer hover:text-primary flex items-center gap-1"
                                                onClick={() => requestSort('last_login')}
                                            >
                                                Last Login
                                                {sortConfig?.key === 'last_login' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                                            </div>
                                        </TableCell>
                                        <TableCell
                                            isHeader
                                            className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                        >
                                            <div
                                                className="p-2.5 xl:p-5 cursor-pointer hover:text-primary flex items-center gap-1"
                                                onClick={() => requestSort('status')}
                                            >
                                                Status
                                                {sortConfig?.key === 'status' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                                            </div>
                                        </TableCell>
                                        <TableCell
                                            isHeader
                                            className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                        >
                                            Action
                                        </TableCell>
                                    </TableRow>
                                </TableHeader>

                                {/* Table Body */}
                                <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                                    {sortedData.map((user, key) => (
                                        <TableRow key={user.id}>
                                            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                {user.first_name}
                                            </TableCell>
                                            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                {user.last_name}
                                            </TableCell>
                                            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                {user.username}
                                            </TableCell>
                                            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                {user.license_number}
                                            </TableCell>
                                            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                {user.license_type}
                                            </TableCell>
                                            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                {formatDate(user.last_login)}
                                            </TableCell>
                                            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                <Badge
                                                    size="sm"
                                                    color={
                                                        user.status === "Active"
                                                            ? "success"
                                                            : user.status === "Inactive"
                                                                ? "warning"
                                                                : "error"
                                                    }
                                                >
                                                    {user.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                <button
                                                    onClick={() => handleEditClick(user)}
                                                    className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
                                                >
                                                    <svg
                                                        className="fill-current"
                                                        width="18"
                                                        height="18"
                                                        viewBox="0 0 18 18"
                                                        fill="none"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            clipRule="evenodd"
                                                            d="M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206ZM12.9698 3.84272C13.2627 3.54982 13.7376 3.54982 14.0305 3.84272L14.6934 4.50563C14.9863 4.79852 14.9863 5.2734 14.6934 5.56629L14.044 6.21573L12.3204 4.49215L12.9698 3.84272ZM11.2597 5.55281L5.6359 11.1766C5.53309 11.2794 5.46238 11.4099 5.43238 11.5522L5.01758 13.5185L6.98394 13.1037C7.1262 13.0737 7.25666 13.003 7.35947 12.9002L12.9833 7.27639L11.2597 5.55281Z"
                                                            fill=""
                                                        />
                                                    </svg>
                                                    Edit
                                                </button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>

                            <div className="border-t border-gray-100 py-4 pr-4 pl-[18px] dark:border-gray-800">
                                <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between">
                                    <p className="border-b border-gray-100 pb-3 text-center text-sm font-medium text-gray-500 xl:border-b-0 xl:pb-0 xl:text-left dark:border-gray-800 dark:text-gray-400">
                                        Showing <span x-text="startEntry">{from}</span> to
                                        <span x-text="endEntry"> {to}</span> of
                                        <span x-text="totalEntries"> {totalRecords}</span> entries
                                    </p>

                                    <div className="flex items-center justify-end space-x-2 py-4 px-5">

                                        <button
                                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                            disabled={currentPage === 1}
                                            className="flex h-9 w-9 items-center justify-center rounded-md border border-stroke bg-white text-bodydark hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-50 dark:border-strokedark dark:bg-transparent"
                                        >
                                            <svg className="fill-current" width="18" height="18" viewBox="0 0 20 20">
                                                <path d="M12.175 15.825L6.35 10L12.175 4.175L13.575 5.575L9.175 10L13.575 14.425L12.175 15.825Z" />
                                            </svg>
                                        </button>


                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                            <button
                                                key={page}
                                                onClick={() => {
                                                    setCurrentPage(page);
                                                }}
                                                className={`flex h-9 w-9 items-center justify-center rounded-md border font-medium transition-all ${currentPage === page
                                                        ? 'border-primary bg-primary bg-opacity-5 text-primary' 
                                                        : 'border-stroke bg-white text-bodydark hover:border-primary hover:text-primary dark:border-strokedark dark:bg-transparent'
                                                    }`}
                                            >
                                                {page}
                                            </button>
                                        ))}


                                        <button
                                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                            disabled={currentPage === totalPages}
                                            className="flex h-9 w-9 items-center justify-center rounded-md border border-stroke bg-white text-bodydark hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-50 dark:border-strokedark dark:bg-transparent"
                                        >
                                            <svg className="fill-current" width="18" height="18" viewBox="0 0 20 20">
                                                <path d="M7.825 15.825L6.425 14.425L10.825 10L6.425 5.575L7.825 4.175L13.65 10L7.825 15.825Z" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>


                        </div>
                    </div>


                </div>
            </div>

            <EditModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                userData={selectedUser}
                onSave={handleSave}
            />

        </div>
    );
};

export default TableOne;
