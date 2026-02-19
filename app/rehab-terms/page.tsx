'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function RehabTermsPage() {
  const router = useRouter();

  return (
    <div className="container py-5" style={{ maxWidth: 900 }}>
      
      {/* LOGO */}
      <div className="text-center mb-4">
        <Link href="/login" className="navbar-brand">
          <img
            src="/static/logo.png"
            alt="BERM Logo"
            height={90}
            style={{ objectFit: 'contain' }}
          />
        </Link>
      </div>

      <div className="card shadow">
        <div className="card-body">

          <h1 className="mb-3 text-center">Terms of Use & Data Privacy Policy</h1>
          <p className="text-muted text-center">
            BERM: Block Chain Enhanced Rehabilitation App
          </p>

          <hr />

          <h4>1. Introduction</h4>
          <p>
            This page outlines the Terms of Use and Data Privacy Policy for all registered
            Rehabilitation Centers using the BERM platform. By creating an account and using
            this system, you agree to comply with the terms stated below.
          </p>

          <h4>2. Data Privacy</h4>
          <p>
            BERM complies with the Data Privacy Act of 2012 (RA 10173). We collect only
            necessary information required for system access, security, and compliance.
          </p>
          <ul>
            <li>Rehabilitation center information</li>
            <li>Authorized representative details</li>
            <li>Login credentials (encrypted)</li>
            <li>System activity logs for security</li>
          </ul>

          <h4>3. Data Usage</h4>
          <ul>
            <li>Account management</li>
            <li>System security and auditing</li>
            <li>Compliance and reporting</li>
            <li>Technical support</li>
          </ul>

          <h4>4. User Responsibilities</h4>
          <ul>
            <li>Provide accurate and truthful information</li>
            <li>Keep login credentials secure</li>
            <li>Protect patient data under RA 10173</li>
            <li>Use the platform only for legal purposes</li>
          </ul>

          <h4>5. Security</h4>
          <ul>
            <li>Encrypted credentials</li>
            <li>Role-based access control</li>
            <li>Audit logging</li>
            <li>Regular security reviews</li>
          </ul>

          <h4>6. Account Suspension</h4>
          <p>
            BERM reserves the right to suspend or terminate accounts that violate policies,
            misuse data, or engage in illegal activities.
          </p>

          <h4>7. Updates to Policy</h4>
          <p>
            These terms may be updated from time to time. Continued use of the platform
            means acceptance of any changes.
          </p>

          <div className="text-center mt-4">
            <Link href="/login" className="btn btn-secondary">
              Go Back
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
