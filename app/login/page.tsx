'use client';

import { useEffect, useState } from 'react';
import { redirect, useRouter } from 'next/navigation';
import alerts from '../components/Alerts';
import users from '../controllers/Users';
import { signIn, useSession } from 'next-auth/react';

const Login = () => {
  const router = useRouter();
  const { data: session, status } = useSession()

  if (status !== "unauthenticated") {
    redirect('/')
  }

  const [form_data, setFormData] = useState<any>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showAgreement, setShowAgreement] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const user = await users.login(form_data);
    const username = form_data.username
    const password = form_data.password
    if (user.user_id > 0) {
      const res = await signIn('credentials', {
        redirect: false,
        id: user.user_id,
        role: user.user_category,
        rehab_center_id: user.rehab_center_id,
        username,
        password
      })

      if (res?.error) {
        alerts.error('Invalid credentials! Please check your username and password.')
        return
      } else {
        redirect("/")
      }


    } else if (user === -1 || user === -2) {
      alerts.error('Invalid credentials! Please check your username and password.')
    } else {
      alerts.warning()
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
          <img src="./static/logo.png" height="100" alt="Logo" />
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
                <h2 className="mb-3">Data Privacy Agreement</h2>
                <p>
                  This Data Privacy Agreement (“Agreement”) is entered into by and between:
                </p>
                <p>
                  <strong>BERM: Block Chain Enhanced Rehabilitation App</strong>, hereinafter referred to as the
                  “Data Controller”,
                </p>
                <p>-and-</p>
                <p>
                  <strong>[Name of Drug Rehabilitation Center]</strong>, with office address at [Address],
                  represented herein by [Authorized Representative’s Name & Position], hereinafter referred to as
                  the “Data Subject”.
                </p>

                <h3>1. Purpose</h3>
                <p>
                  This Agreement governs the collection, processing, storage, and protection of personal and
                  institutional data of Drug Rehabilitation Centers and their authorized representatives for the
                  purpose of creating, maintaining, and securing official accounts within the BERM platform.
                </p>

                <h3>2. Scope of Personal Data Collected</h3>
                <ul>
                  <li>Name of the Drug Rehabilitation Center</li>
                  <li>Official Address and Contact Details</li>
                  <li>Name of Authorized Representative(s)</li>
                  <li>Position/Designation</li>
                  <li>Email Address</li>
                  <li>Mobile/Telephone Number</li>
                  <li>Account Credentials (username, encrypted password)</li>
                  <li>Other information required for secure access and compliance</li>
                </ul>

                <h3>3. Data Collection and Processing</h3>
                <ul>
                  <li>Collect only necessary data for the stated purposes;</li>
                  <li>Process data in compliance with the Data Privacy Act of 2012 (RA 10173);</li>
                  <li>Use data solely for account management, secure access, communication, and compliance;</li>
                  <li>Obtain consent prior to processing for purposes beyond those stated herein.</li>
                </ul>

                <h3>4. Data Sharing and Disclosure</h3>
                <p>
                  The Data Controller shall not share any data with third parties unless required by law,
                  necessary for technical support/security services, or with prior written consent.
                </p>

                <h3>5. Data Protection Measures</h3>
                <ul>
                  <li>End-to-end encryption of sensitive data</li>
                  <li>Secure authentication protocols</li>
                  <li>Regular system security audits</li>
                  <li>Role-based access control</li>
                  <li>Blockchain-based integrity verification</li>
                </ul>

                <h3>6. Data Retention and Disposal</h3>
                <p>
                  Data shall be retained only as long as necessary for stated purposes or as required by law,
                  after which it shall be securely deleted, anonymized, or destroyed.
                </p>

                <h3>7. Rights of the Data Subject</h3>
                <ul>
                  <li>Right to be informed about data processing</li>
                  <li>Right to access data</li>
                  <li>Right to request correction of inaccurate data</li>
                  <li>Right to withdraw consent, subject to obligations</li>
                  <li>Right to request deletion of data</li>
                  <li>Right to file a complaint with the NPC</li>
                </ul>

                <h3>8. Breach Notification</h3>
                <p>
                  In the event of a data breach, the Data Controller shall notify the Data Subject and the NPC
                  within the period prescribed by law, including details of the breach and corrective measures.
                </p>

                <h3>9. Effectivity and Termination</h3>
                <p>
                  This Agreement takes effect upon account creation and remains valid until the account is
                  deactivated or terminated, subject to applicable laws. By proceeding, you confirm that:
                </p>
                <ul>
                  <li>You are the authorized representative of your rehabilitation center.</li>
                  <li>You provide truthful and accurate information.</li>
                  <li>You will manage patient data in compliance with RA 10173.</li>
                  <li>You will not use the platform for illegal, abusive, or misleading practices.</li>
                  <li>Your account may be suspended if you violate terms of use.</li>
                </ul>

                <p>
                  Read the full terms and data policy{" "}
                  <a href="/rehab-terms" target="_blank" rel="noopener noreferrer">
                    here
                  </a>
                  .
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
