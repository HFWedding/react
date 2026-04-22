import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import { EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import Checkbox from "../../components/form/input/Checkbox";
import Alert from "../../components/ui/alert/Alert";

import api from '../../api';

export default function SignInForm() {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isChecked, setIsChecked] = useState(false);
    const navigate = useNavigate();
    const [alert, setAlert] = useState<{ show: boolean; title: string; msg: string; type: 'warning' | 'error' }>({
        show: false,
        title: '',
        msg: '',
        type: 'warning',
    });
    const showAlert = (title: string, msg: string, type: 'warning' | 'error') => {
        setAlert({ show: true, title, msg, type });
    };


    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!username || !password) {
            showAlert('Warning', 'Please enter all required fields.', 'warning');
            return;
        }

        try {

            const response = await api.post('/api/login', {
                username,
                password
            });

            if (response.data.status === 'success') {
                localStorage.setItem('user', JSON.stringify(response.data.user));
                if (response.data.user.role === 'Admin') {
                    navigate('/admin', { state: { user: response.data.user } });
                }
                else if (response.data.user.role === 'Driver') {
                    navigate('/404');
                }
            }
        } catch (error) {
            showAlert('Error', 'Login failed.', 'error');
        }
    };


  return (
    <div className="flex flex-col flex-1">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Sign In
                      </h1>
                      {/* --- TailAdmin Alert --- */}
                      {alert.show && (
                          <Alert
                              variant={alert.type}
                              title={alert.title}
                              message={alert.msg}
                          />
                      )}
                      {/* --- TailAdmin Alert --- */}
          </div>
          <div>
            <form onSubmit={handleLogin}>
              <div className="space-y-6">
                <div>
                  <Label>
                    Username <span className="text-error-500">*</span>{" "}
                  </Label>
                    <Input
                        id="username"
                        name="username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter your username" />
                </div>
                <div>
                  <Label>
                    Password <span className="text-error-500">*</span>{" "}
                  </Label>
                  <div className="relative">
                    <Input
                        id="password"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    >
                      {showPassword ? (
                        <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      ) : (
                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      )}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Checkbox checked={isChecked} onChange={setIsChecked} />
                    <span className="block font-normal text-gray-700 text-theme-sm dark:text-gray-400">
                      Keep me logged in
                    </span>
                  </div>
                </div>
                <div>
                    <button type="submit" className="inline-flex items-center justify-center gap-2 rounded-lg transition w-full px-4 py-3 text-sm bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300 ">
                        Sign in
                    </button>
                </div>
              </div>
            </form>

          </div>
        </div>
      </div>
    </div>
  );
}
