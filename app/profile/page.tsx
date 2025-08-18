'use client'

import { useEffect, useState, FormEvent } from 'react'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import alerts from '../components/Alerts'
import users from '../controllers/Users'

const ProfilePage = () => {
  // const { data: session, status } = useSession()
  // const sessionUser: any = session?.user

  // if (status === 'unauthenticated') redirect('/login')

  const [loadingProfile, setLoadingProfile] = useState(true)
  const [savingProfile, setSavingProfile] = useState(false)
  const [savingPassword, setSavingPassword] = useState(false)

  const [row, setRow] = useState<any>({})
  const [username, setUsername] = useState('')
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  // useEffect(() => {
  //   const fetchProfile = async () => {
  //     if (!sessionUser?.id) return
  //     try {
  //       const response = await users.view(sessionUser.id)
  //       const data = response.data
  //       setRow(data)
  //       setUsername(data.username || '')
  //     } catch {
  //       alerts.error('Unable to load profile.')
  //     } finally {
  //       setLoadingProfile(false)
  //     }
  //   }
  //   fetchProfile()
  // }, [sessionUser?.id])

  const handleProfileSubmit = async (e: any) => {
    e.preventDefault()
    setSavingProfile(true)
    try {
      // const response = await users.update_profile(sessionUser.id, username);
      // if (response > 0) {
      //   alerts.success_update('Profile updated successfully.')
      // } else {
      //   alerts.failed_query();
      // }
    } catch (err: any) {
      alerts.error(err?.message || 'Failed to update profile.')
    } finally {
      setSavingProfile(false)
    }
  }

  const handlePasswordSubmit = async (e: any) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      alerts.error('New password and confirmation do not match.')
      return
    }
    setSavingPassword(true)
    try {
      // const response = await users.update_password(sessionUser.id, oldPassword, newPassword,)
      // if (response > 0) {
      //   alerts.success_update('Password changed successfully.')
      //   setOldPassword('')
      //   setNewPassword('')
      //   setConfirmPassword('')
      // }else if(response === -1){
      //   alerts.warning("User account not found.");
      // }else if(response === -2){
      //   alerts.warning("Incorrect old password");
      // }else{
      //   alerts.failed_query();
      // }

    } catch (err: any) {
      alerts.error(err?.message || 'Failed to change password.')
    } finally {
      setSavingPassword(false)
    }
  }

  return (
    <div className="page-wrapper">
      <div className="page-body">
        <div className="container-xl">
          <div className="row gy-4">
            <div className="col-lg-8">
              <div className="card shadow-sm">
                <div className="card-header">
                  <h5 className="m-0 fw-bold text-primary">Profile&nbsp;Details</h5>
                </div>
                <div className="card-body">
                  {loadingProfile ? (
                    <div className="d-flex justify-content-center py-5">
                      <div className="spinner-border text-primary" role="status" />
                    </div>
                  ) : (
                    <form onSubmit={handleProfileSubmit}>
                      <div className="row g-3">
                        <div className="col-12">
                          <label className="form-label fw-semibold">Full&nbsp;Name</label>
                          <input
                            className="form-control"
                            value={row.user_fullname || ''}
                            disabled
                          />
                        </div>

                        <div className="col-md-4">
                          <label className="form-label fw-semibold">
                            Employee&nbsp;Classification
                          </label>
                          <input
                            className="form-control"
                            value={row.employee_class_name || ''}
                            disabled
                          />
                        </div>

                        <div className="col-md-4">
                          <label className="form-label fw-semibold">User&nbsp;Category</label>
                          <input
                            className="form-control"
                            value={row.user_category || ''}
                            disabled
                          />
                        </div>

                        <div className="col-md-4">
                          <label className="form-label fw-semibold">Username</label>
                          <input
                            className="form-control"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                          />
                        </div>

                        <div className="col-12 text-end">
                          <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={savingProfile}
                          >
                            {savingProfile ? 'Saving…' : 'Save Changes'}
                          </button>
                        </div>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </div>

            {/* ── Change Password ─────────────────────────────── */}
            <div className="col-lg-4">
              <div className="card shadow-sm">
                <div className="card-header">
                  <h5 className="m-0 fw-bold text-warning">Change&nbsp;Password</h5>
                </div>
                <div className="card-body">
                  <form onSubmit={handlePasswordSubmit}>
                    <div className="mb-3">
                      <label className="form-label fw-semibold">Old&nbsp;Password</label>
                      <input
                        type="password"
                        className="form-control"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-semibold">New&nbsp;Password</label>
                      <input
                        type="password"
                        className="form-control"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-semibold">Confirm&nbsp;Password</label>
                      <input
                        type="password"
                        className="form-control"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                      />
                    </div>

                    <div className="text-end">
                      <button
                        type="submit"
                        className="btn btn-success"
                        disabled={savingPassword}
                      >
                        {savingPassword ? 'Updating…' : 'Change Password'}
                      </button>
                    </div>
                  </form>
                  <small className="text-muted d-block mt-2">
                    Please keep your password confidential.
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
