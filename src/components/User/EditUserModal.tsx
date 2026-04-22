import React, { useEffect, useState } from 'react';
import axios from 'axios';

import Label from "../form/Label";
import Input from "../form/input/InputField";
import Alert from "../ui/alert/Alert";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "../../icons";
import ComponentCard from "../common/ComponentCard";
import { EnvelopeIcon, UserIcon } from "../../icons";
import { Phone } from 'lucide-react';
import Switch from "../form/switch/Switch";

import api from '../../api';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    userData: any;
    onSave: (updatedData: any) => void;
}

const EditUserModal = ({ isOpen, onClose, userData, onSave }: ModalProps) => {

    const [alert, setAlert] = useState<{ show: boolean; title: string; msg: string; type: 'error' | 'warning' }>({
        show: false,
        title: '',
        msg: '',
        type: 'warning',
    });
    const showAlert = (title: string, msg: string, type: 'error' | 'warning') => {
        setAlert({ show: true, title, msg, type });
    };

    const [showPassword, setShowPassword] = useState(false);

    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        username: '',
        password: '',
        email: '',
        phone: '',
        status: '',
        role: 'Admin',
    });

    const checkUsername = async (username: string): Promise<boolean> => {

        try {

            const response = await api.get('/api/check-username', {
                params: {
                    username: username
                }
            });

            return response.data.exists

        } catch (error) {
            showAlert('Error', 'Server error. Please contact IT admin.', 'error');
            return false;
        }
    };

    useEffect(() => {
        if (isOpen) {
            setAlert((prev) => ({ ...prev, show: false }));
        }
        if (userData) {
            setFormData({
                first_name: userData.first_name || '',
                last_name: userData.last_name || '',
                username: userData.username || '',
                password: userData.password || '',
                email: userData.email || '',
                phone: userData.phone || '',
                status: userData.status || '',
                role: userData.role || 'Admin',
            });
        } else {
            setFormData({
                first_name: '',
                last_name: '',
                username: '',
                password: '',
                email: '',
                phone: '',
                status: 'Active',
                role: 'Admin',
            });
        }
    }, [userData, isOpen]);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (userData) {
            if (!formData.first_name || !formData.last_name || !formData.username || !formData.email) {
                showAlert('Warning', 'Please enter all required fields.', 'warning');
                return;
            }
        } else { 
            if (formData.password && formData.password.length < 6) {
                showAlert('Warning', 'The password is at least 6 digit.', 'warning');
                return;
            }
            if (!formData.first_name || !formData.last_name || !formData.username || !formData.password || !formData.email) {
                showAlert('Warning', 'Please enter all required fields.', 'warning');
                return;
            }
            if (formData.username) {
                const isExist = await checkUsername(formData.username);
                if (isExist) {
                    showAlert('Warning', 'Username already exists.', 'warning');
                    return;
                }
            }
        }

        onSave(formData);
    };

    return (

        <div x-show="EditUserModal" className="fixed inset-0 flex items-center justify-center p-5 overflow-y-auto modal z-99999">

            <div className="modal-close-btn fixed inset-0 h-full w-full bg-gray-400/50 backdrop-blur-[32px]"></div>

            <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-6 dark:bg-gray-900 lg:p-11">

                <ComponentCard
                    title={
                        userData ? "Edit Admin - " + formData.username : "Add New Admin"
                    }>

                    <button onClick={onClose} className="transition-color absolute right-5 top-5 z-999 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600 dark:bg-gray-700 dark:bg-white/[0.05] dark:text-gray-400 dark:hover:bg-white/[0.07] dark:hover:text-gray-300 sm:h-11 sm:w-11">
                        <svg className="fill-current size-5 sm:size-6" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M6.04289 16.5418C5.65237 16.9323 5.65237 17.5655 6.04289 17.956C6.43342 18.3465 7.06658 18.3465 7.45711 17.956L11.9987 13.4144L16.5408 17.9565C16.9313 18.347 17.5645 18.347 17.955 17.9565C18.3455 17.566 18.3455 16.9328 17.955 16.5423L13.4129 12.0002L17.955 7.45808C18.3455 7.06756 18.3455 6.43439 17.955 6.04387C17.5645 5.65335 16.9313 5.65335 16.5408 6.04387L11.9987 10.586L7.45711 6.04439C7.06658 5.65386 6.43342 5.65386 6.04289 6.04439C5.65237 6.43491 5.65237 7.06808 6.04289 7.4586L10.5845 12.0002L6.04289 16.5418Z" fill=""></path>
                        </svg>
                    </button>

                    {/* --- TailAdmin Alert --- */}
                    {alert.show && (
                        <Alert
                            variant={alert.type}
                            title={alert.title}
                            message={alert.msg}
                        />
                    )}
                    {/* --- TailAdmin Alert --- */}

                    <form onSubmit={handleSubmit} className="flex flex-col">

                        <div className="-mx-2.5 flex flex-wrap gap-y-5">

                            <div className="w-full px-2.5 xl:w-1/2">
                                <Label>First Name<span className="text-error-500">*</span></Label>
                                <Input
                                    id="first_name"
                                    name="first_name"
                                    type="text"
                                    placeholder="Joseph"
                                    value={formData.first_name}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="w-full px-2.5 xl:w-1/2">
                                <Label>Last Name<span className="text-error-500">*</span></Label>
                                <Input
                                    id="last_name"
                                    name="last_name"
                                    type="text"
                                    placeholder="Ho"
                                    value={formData.last_name}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="w-full px-2.5">
                                <Label>Username<span className="text-error-500">*</span></Label>
                                <div className="relative">
                                    <Input
                                        id="username"
                                        name="username"
                                        placeholder="joseph"
                                        type="text"
                                        className="pl-[62px]"
                                        value={formData.username}
                                        onChange={handleChange}
                                        disabled={!!userData}
                                    />
                                    <span className="absolute left-0 top-1/2 -translate-y-1/2 border-r border-gray-200 px-3.5 py-3 text-gray-500 dark:border-gray-800 dark:text-gray-400">
                                        <UserIcon className="size-6" />
                                    </span>
                                </div>
                            </div>

                            <div className="w-full px-2.5">
                                <Label>Password<span className="text-error-500">*</span></Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder={userData ? "Password won't be updated if leave blank." : "******"}
                                        value={formData.password}
                                        onChange={handleChange}
                                    />
                                    <button
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                                    >
                                        {showPassword ? (
                                            <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                                        ) : (
                                            <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div className="w-full px-2.5">
                                <Label>Email<span className="text-error-500">*</span></Label>
                                <div className="relative">
                                    <Input
                                        id="email"
                                        name="email"
                                        placeholder="info@gmail.com"
                                        type="text"
                                        className="pl-[62px]"
                                        value={formData.email}
                                        onChange={handleChange}
                                    />
                                    <span className="absolute left-0 top-1/2 -translate-y-1/2 border-r border-gray-200 px-3.5 py-3 text-gray-500 dark:border-gray-800 dark:text-gray-400">
                                        <EnvelopeIcon className="size-6" />
                                    </span>
                                </div>
                            </div>

                            <div className="w-full px-2.5">
                                <Label>Phone</Label>
                                <div className="relative">
                                    <Input
                                        id="phone"
                                        name="phone"
                                        placeholder="0406363212"
                                        type="text"
                                        className="pl-[62px]"
                                        value={formData.phone}
                                        onChange={handleChange}
                                    />
                                    <span className="absolute left-0 top-1/2 -translate-y-1/2 border-r border-gray-200 px-3.5 py-3 text-gray-500 dark:border-gray-800 dark:text-gray-400">
                                        <Phone className="size-6" />
                                    </span>
                                </div>
                            </div>


                        </div>

                        <div className="flex flex-col items-center gap-6 px-2 mt-6 sm:flex-row sm:justify-between">
                            <div className="flex flex-col items-center gap-3 sm:flex-row">

                                <Switch
                                    key={`${formData.username}-${Date.now()}`}
                                    label={formData.status}
                                    defaultChecked={formData.status === 'Active'}
                                    onChange={(checked: boolean) => {
                                        setFormData((prev) => ({
                                            ...prev,
                                            status: checked ? 'Active' : 'Inactive',
                                        }));
                                    }}
                                />

                            </div>

                            <div className="flex items-center w-full gap-3 sm:w-auto">
                                <button type="button" onClick={onClose} className="flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] sm:w-auto">
                                    Cancel
                                </button>
                                <button type="submit" className="flex w-full justify-center rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600 sm:w-auto">
                                    Save
                                </button>
                            </div>
                            </div>

                    </form>

                 </ComponentCard>

             </div>

         </div>
    );
};

export default EditUserModal;