'use client'
import { useRouter } from "next/navigation"
import { useAuth } from "../context/AuthContext"
import alerts from "../components/Alerts"
import users from "../controllers/Users"
import { useState } from 'react';
import globals from "../controllers/Globals"

const Login = () => {

  const { login } = useAuth()
  const router = useRouter()
  const [form_data, setFormData] = useState<any>([]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const response = await users.login(form_data);
    if (response && response.user_id) {
      globals.setAuth(response);
      router.push("/")
    } else {
      alerts.warning_alert("Invalid username or password.");
    }

  }
  // Redirect to home if user is already logged in
   if(localStorage.getItem("esf_jc_user_token")){
      router.push("/")
    }

  const handleChange = (e: any) => {
    setFormData((prevData: any) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="container container-tight py-4">
      <div className="text-center mb-4">
        <a href="." className="navbar-brand navbar-brand-autodark"><img src="./static/logo.png" height="100" alt="" /></a>
      </div>
      <div className="card card-md">
        <div className="card-body">
          <h2 className="h2 text-center mb-4">Login to your account</h2>
          <form action="./" method="get" autoComplete="off" noValidate onSubmit={(e: any) => handleSubmit(e)}>
            <div className="mb-3">
              <label className="form-label">Username</label>
              <input type="text" name="username" className="form-control" placeholder="Enter your username" autoComplete="off" required value={form_data.username || ''} onChange={handleChange} />
            </div>
            <div className="mb-2">
              <div className="input-group input-group-flat">
                <input type="password" className="form-control" placeholder="Enter your password" autoComplete="off" name="password" required value={form_data.password || ''} onChange={handleChange} />
                <span className="input-group-text">
                  <a href="#" className="link-secondary" title="Show password" data-bs-toggle="tooltip">
                    <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" /><path d="M21 12c-2.4 4 -5.4 6 -9 6c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6" /></svg>
                  </a>
                </span>
              </div>
            </div>
            <div className="form-footer">
              <button type="submit" className="btn btn-success w-100">Sign in</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login