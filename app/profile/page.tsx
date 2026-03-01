'use client'

import { useEffect, useState, FormEvent } from 'react'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import alerts from '../components/Alerts'
import users from '../controllers/Users'

const ProfilePage = () => {
  const { data: session, status } = useSession()
  const sessionUser: any = session?.user

  const rehab_center_id = sessionUser?.rehab_center_id
  const user_id = sessionUser?.id

  if (status === 'unauthenticated') redirect('/login')

  const [loadingProfile, setLoadingProfile] = useState(true)
  const [savingProfile, setSavingProfile] = useState(false)
  const [savingPassword, setSavingPassword] = useState(false)

  const [row, setRow] = useState<any>({
    rehab_center_name: '',
    rehab_center_complete_address: '',
    rehab_center_city: '',
    hospital_code: '',
    user_category: '',
    username: '',
  })

  const [username, setUsername] = useState('')
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await users.view_rehab(user_id, rehab_center_id)
        setRow(data.data)
        setUsername(data.username || '')
      } catch {
        alerts.error('Unable to load profile.')
      } finally {
        setLoadingProfile(false)
      }
    }
    if (user_id && rehab_center_id) fetchProfile()
  }, [user_id, rehab_center_id])

  // Update profile
  const handleProfileSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSavingProfile(true)
    try {
      const formData: any = { user_id, username, user_category: row.user_category }

      if (row.user_category === 'R') {
        // Include rehab center info
        formData.rehab_center_id = rehab_center_id
        formData.rehab_center_name = row.rehab_center_name
        formData.rehab_center_complete_address = row.rehab_center_complete_address
        formData.rehab_center_city = row.rehab_center_city
        formData.hospital_code = row.hospital_code
      }

      const response = await users.update_profile(formData)
      if (response > 0) {
        alerts.success_update('Profile updated successfully.')
        setRow((prev: any) => ({ ...prev, username }))
      } else {
        alerts.failed_query()
      }
    } catch (err: any) {
      alerts.error(err?.message || 'Failed to update profile.')
    } finally {
      setSavingProfile(false)
    }
  }

  // Change password
  const handlePasswordSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      alerts.error('New password and confirmation do not match.')
      return
    }
    setSavingPassword(true)
    try {
      const response = await users.update_password(user_id, oldPassword, newPassword, rehab_center_id)
      if (response > 0) {
        alerts.success_update('Password changed successfully.')
        setOldPassword('')
        setNewPassword('')
        setConfirmPassword('')
      } else if (response === -1) {
        alerts.warning('User account not found.')
      } else if (response === -2) {
        alerts.warning('Incorrect old password')
      } else {
        alerts.failed_query()
      }
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

            {/* Profile Details */}
            <div className="col-lg-8">
              <div className="card shadow-sm">
                <div className="card-header">
                  <h5 className="m-0 fw-bold text-primary">Profile Details</h5>
                </div>
                <div className="card-body">
                  {loadingProfile ? (
                    <div className="d-flex justify-content-center py-5">
                      <div className="spinner-border text-primary" />
                    </div>
                  ) : (
                    <form onSubmit={handleProfileSubmit}>
                      <div className="row g-3">

                        {/* Rehab center info only for 'R' */}
                        {row?.user_category === 'R' && (
                          <>
                            <div className="col-12">
                              <label className="form-label fw-semibold">Rehab Center</label>
                              <input
                                className="form-control"
                                value={row.rehab_center_name}
                                onChange={(e) =>
                                  setRow((prev: any) => ({ ...prev, rehab_center_name: e.target.value }))
                                }
                              />
                            </div>

                            <div className="col-12">
                              <label className="form-label fw-semibold">Address</label>
                              <input
                                className="form-control"
                                value={row.rehab_center_complete_address}
                                onChange={(e) =>
                                  setRow((prev: any) => ({ ...prev, rehab_center_complete_address: e.target.value }))
                                }
                              />
                            </div>

                            <div className="col-md-4">
                              <label className="form-label fw-semibold">City</label>
                              <input
                                className="form-control"
                                value={row.rehab_center_city}
                                onChange={(e) =>
                                  setRow((prev: any) => ({ ...prev, rehab_center_city: e.target.value }))
                                }
                              />
                            </div>

                            <div className="col-md-4">
                              <label className="form-label fw-semibold">Hospital Code</label>
                              <input
                                className="form-control"
                                value={row.hospital_code}
                                onChange={(e) =>
                                  setRow((prev: any) => ({ ...prev, hospital_code: e.target.value }))
                                }
                              />
                            </div>
                          </>
                        )}

                        {/* Username editable for all */}
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
                            {savingProfile ? 'Saving…' : 'Save Changes'}
                          </button>
                        </div>

                      </div>
                    </form>
                  )}
                </div>
              </div>
            </div>

            {/* Change Password */}
            <div className="col-lg-4">
              <div className="card shadow-sm">
                <div className="card-header">
                  <h5 className="m-0 fw-bold text-warning">Change Password</h5>
                </div>
                <div className="card-body">
                  <form onSubmit={handlePasswordSubmit}>
                    <div className="mb-3">
                      <label className="form-label fw-semibold">Old Password</label>
                      <input
                        type="password"
                        className="form-control"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-semibold">New Password</label>
                      <input
                        type="password"
                        className="form-control"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-semibold">Confirm Password</label>
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
                        {savingPassword ? 'Updating…' : 'Change Password'}
                      </button>
                    </div>
                  </form>
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