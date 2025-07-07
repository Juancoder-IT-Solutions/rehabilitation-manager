'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import alerts from '../components/Alerts';
import users from '../controllers/Users';
import globals from '../controllers/Globals';

const Login = () => {
  const router = useRouter();

  const [form_data, setFormData] = useState<any>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showAgreement, setShowAgreement] = useState(false);

  const handleSubmit = async (e: any) => {
  e.preventDefault();
  const response = await users.login(form_data);

  if (response && response.user_id) {
    alerts.success_add('Login successful!');
    router.push('/');
  } else {
    alerts.warning_alert('Invalid username or password.');
  }
};

  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('rm_user_token')) {
      router.push('/');
    }
  }, [router]);

  const handleChange = (e: any) => {
    setFormData((prevData: any) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="container container-tight py-4">
      <div className="text-center mb-4">
        <a href="/" className="navbar-brand navbar-brand-autodark">
          <img src="/static/logo.png" height="100" alt="Logo" />
        </a>
      </div>

      <div className="card card-md shadow">
        <div className="card-body">
          <h2 className="h2 text-center mb-4">Login to your account</h2>

          <form onSubmit={handleSubmit} autoComplete="off" noValidate>
            <div className="mb-3">
              <label className="form-label">Username</label>
              <input
                type="text"
                name="username"
                className="form-control"
                placeholder="Enter your username"
                required
                value={form_data.username || ''}
                onChange={handleChange}
              />
            </div>

            <div className="mb-2">
              <label className="form-label">Password</label>
              <div className="input-group input-group-flat">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-control"
                  name="password"
                  placeholder="Enter your password"
                  required
                  value={form_data.password || ''}
                  onChange={handleChange}
                />
                <span className="input-group-text">
                  <a
                    href="#"
                    className="link-secondary"
                    title={showPassword ? 'Hide password' : 'Show password'}
                    onClick={(e) => {
                      e.preventDefault();
                      setShowPassword((prev) => !prev);
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="icon icon-tabler"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                      stroke="currentColor"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
                      <path d="M21 12c-2.4 4 -5.4 6 -9 6c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6" />
                    </svg>
                  </a>
                </span>
              </div>
            </div>

            <div className="form-footer mt-3">
              <button type="submit" className="btn btn-success w-100">
                Sign in
              </button>
            </div>
          </form>

          <div className="text-center text-muted mt-4">
            Don’t have a rehab center account?{' '}
            <a href="#" onClick={() => setShowAgreement(true)}>
              Create One
            </a>
          </div>
        </div>
      </div>

      {/* AGREEMENT MODAL FOR REHAB CENTER ACCOUNT CREATION */}
      {showAgreement && (
        <div className="modal fade show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content shadow-lg border-0">
              <div className="modal-header">
                <h5 className="modal-title">Rehab Center Owner Agreement</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowAgreement(false)}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                <p>
                  By creating a Rehab Center account, you agree to the following:
                </p>
                <ul>
                  <li>You are the authorized representative of your rehabilitation center.</li>
                  <li>You will provide truthful, complete, and accurate information.</li>
                  <li>You are responsible for managing patient data in compliance with the Data Privacy Act of 2012.</li>
                  <li>You will not use the platform for illegal, abusive, or misleading practices.</li>
                  <li>You understand your account may be suspended if you violate terms of use.</li>
                </ul>
                <p>
                  Read the full terms and data policy <a href="/rehab-terms" target="_blank">here</a>.
                </p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowAgreement(false)}>
                  Cancel
                </button>
                <button className="btn btn-primary" onClick={() => router.push('/register-rehab-center')}>
                  I Agree & Continue
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
