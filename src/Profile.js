import React, { useState, useEffect } from 'react';
import { useCart } from './CartContext';
import { API_URL } from './config';
import './index.css';

const Profile = () => {
  const { clearCart } = useCart();

  const [token, setToken] = useState(localStorage.getItem('jwt') || null);
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('user')) || null;
    } catch {
      return null;
    }
  });

  const [viewState, setViewState] = useState(token ? 'dashboard' : 'login');
  const [dashboardTab, setDashboardTab] = useState('profile');

  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [recoverEmail, setRecoverEmail] = useState('');
  const [registerForm, setRegisterForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const [editProfile, setEditProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    personalId: '',
    city: '',
    address: ''
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (successMsg) {
      const timer = setTimeout(() => {
        setSuccessMsg('');
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [successMsg]);

  useEffect(() => {
    if (user) {
      setEditProfile({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        personalId: user.personalId || '',
        city: user.city || '',
        address: user.address || ''
      });
    }
  }, [user]);

  const switchView = (newView) => {
    setErrorMsg('');
    setSuccessMsg('');
    setViewState(newView);
  };

  const saveAuthSession = (jwt, userData) => {
    localStorage.setItem('jwt', jwt);
    localStorage.setItem('user', JSON.stringify(userData));
    setToken(jwt);
    setUser(userData);
    clearCart();
    setViewState('dashboard');
    setErrorMsg('');
  };

  // 1. REGISTER
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    if (registerForm.password !== registerForm.confirmPassword) {
      setErrorMsg('პაროლები არ ემთხვევა ერთმანეთს');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/auth/local/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: registerForm.email,
          email: registerForm.email,
          password: registerForm.password,
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error?.message || 'რეგისტრაციის შეცდომა');

      // Update custom user profile fields using user ID
      const updateResponse = await fetch(`${API_URL}/api/users/${data.user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${data.jwt}`
        },
        body: JSON.stringify({
          firstName: registerForm.firstName,
          lastName: registerForm.lastName,
          phone: registerForm.phone
        })
      });

      const updatedUserData = await updateResponse.json();
      saveAuthSession(data.jwt, updateResponse.ok ? updatedUserData : data.user);
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 2. LOGIN
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const response = await fetch(`${API_URL}/api/auth/local`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: loginForm.email,
          password: loginForm.password
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error?.message || 'ავტორიზაციის შეცდომა');

      const meResponse = await fetch(`${API_URL}/api/users/me`, {
        headers: { Authorization: `Bearer ${data.jwt}` }
      });
      const fullUserData = meResponse.ok ? await meResponse.json() : data.user;

      saveAuthSession(data.jwt, fullUserData);
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 3. RECOVER PASSWORD
  const handleRecoverSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const response = await fetch(`${API_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: recoverEmail })
      });

      if (!response.ok) throw new Error('შეცდომა! გთხოვთ გადაამოწმოთ ელ-ფოსტა');

      setSuccessMsg('ინსტრუქცია გაიგზავნა თქვენს ელ-ფოსტაზე');
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 4. UPDATE USER PROFILE (Uses PUT /api/users/:id)
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    if (!user || !user.id) {
      setErrorMsg('მომხმარებლის მონაცემები ვერ მოიძებნა');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          firstName: editProfile.firstName,
          lastName: editProfile.lastName,
          email: editProfile.email,
          phone: editProfile.phone,
          personalId: editProfile.personalId,
          city: editProfile.city,
          address: editProfile.address
        })
      });

      const updatedUser = await response.json();
      if (!response.ok) throw new Error(updatedUser.error?.message || 'პროფილის განახლება ვერ მოხერხდა');

      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      setSuccessMsg('პროფილი წარმატებით განახლდა!');
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 5. CHANGE PASSWORD
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
      setErrorMsg('ახალი პაროლები არ ემთხვევა ერთმანეთს');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/auth/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          password: passwordForm.newPassword,
          passwordConfirmation: passwordForm.confirmNewPassword
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error?.message || 'პაროლის შეცვლა ვერ მოხერხდა');

      setPasswordForm({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
      setSuccessMsg('პაროლი წარმატებით შეიცვალა!');
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 6. SIGN OUT
  const handleSignOut = () => {
    localStorage.removeItem('jwt');
    localStorage.removeItem('user');
    clearCart();
    setToken(null);
    setUser(null);
    setViewState('login');
  };

  if (viewState === 'dashboard' && user) {
    return (
      <div className="auth-page-container">
        <div className="dashboard-btn-group">
          <button
            onClick={() => setDashboardTab('orders')}
            className={`dashboard-nav-btn ${dashboardTab === 'orders' ? 'active' : ''}`}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
            შეკვეთები
          </button>

          <button
            onClick={() => setDashboardTab('profile')}
            className={`dashboard-nav-btn ${dashboardTab === 'profile' ? 'active' : ''}`}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            პროფილი
          </button>

          <button onClick={handleSignOut} className="dashboard-nav-btn logout-btn">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            გასვლა
          </button>
        </div>

        <div className="dashboard-tab-content">
          {dashboardTab === 'orders' ? (
            <div className="empty-orders-view">
              <p>თქვენ არ გაქვთ შეკვეთები</p>
            </div>
          ) : (
            <div className="profile-edit-wrapper">
              {errorMsg && <div className="auth-error-banner">{errorMsg}</div>}
              {successMsg && <div className="auth-success-banner">{successMsg}</div>}

              <div className="profile-section">
                <h3 className="section-title">პროფილის რედაქტირება</h3>
                <form onSubmit={handleUpdateProfile} className="auth-form-block">
                  <input
                    type="text"
                    placeholder="სახელი"
                    value={editProfile.firstName}
                    onChange={(e) => setEditProfile({ ...editProfile, firstName: e.target.value })}
                    className="auth-input-field"
                  />
                  <input
                    type="text"
                    placeholder="გვარი"
                    value={editProfile.lastName}
                    onChange={(e) => setEditProfile({ ...editProfile, lastName: e.target.value })}
                    className="auth-input-field"
                  />
                  <input
                    type="email"
                    placeholder="ელ-ფოსტა"
                    value={editProfile.email}
                    onChange={(e) => setEditProfile({ ...editProfile, email: e.target.value })}
                    className="auth-input-field"
                  />
                  <input
                    type="tel"
                    placeholder="ტელეფონი"
                    value={editProfile.phone}
                    onChange={(e) => setEditProfile({ ...editProfile, phone: e.target.value })}
                    className="auth-input-field"
                  />
                  <input
                    type="text"
                    placeholder="პირადი ნომერი:"
                    value={editProfile.personalId}
                    onChange={(e) => setEditProfile({ ...editProfile, personalId: e.target.value })}
                    className="auth-input-field"
                  />
                  <input
                    type="text"
                    placeholder="ქალაქი:"
                    value={editProfile.city}
                    onChange={(e) => setEditProfile({ ...editProfile, city: e.target.value })}
                    className="auth-input-field"
                  />
                  <input
                    type="text"
                    placeholder="მისამართი:"
                    value={editProfile.address}
                    onChange={(e) => setEditProfile({ ...editProfile, address: e.target.value })}
                    className="auth-input-field"
                  />
                  <button type="submit" className="auth-action-btn" disabled={loading}>
                    {loading ? 'ინახება...' : 'შენახვა'}
                  </button>
                </form>
              </div>

              <div className="profile-section">
                <h3 className="section-title">პაროლის შეცვლა</h3>
                <form onSubmit={handleChangePassword} className="auth-form-block">
                  <input
                    type="password"
                    placeholder="ძველი პაროლი"
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                    className="auth-input-field"
                    required
                  />
                  <input
                    type="password"
                    placeholder="ახალი პაროლი"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    className="auth-input-field"
                    required
                  />
                  <input
                    type="password"
                    placeholder="პაროლი განმეორებით"
                    value={passwordForm.confirmNewPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmNewPassword: e.target.value })}
                    className="auth-input-field"
                    required
                  />
                  <button type="submit" className="auth-action-btn" disabled={loading}>
                    {loading ? 'ინახება...' : 'შენახვა'}
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (viewState === 'recover') {
    return (
      <div className="auth-page-container">
        <div className="auth-card-wrapper">
          {errorMsg && <div className="auth-error-banner">{errorMsg}</div>}
          {successMsg && <div className="auth-success-banner">{successMsg}</div>}

          <form onSubmit={handleRecoverSubmit} className="auth-form-block">
            <input 
              type="email" 
              placeholder="ელ-ფოსტა"
              value={recoverEmail}
              onChange={(e) => setRecoverEmail(e.target.value)}
              className="auth-input-field"
              required
            />
            <button type="submit" className="auth-action-btn" disabled={loading}>
              {loading ? 'იგზავნება...' : 'პაროლის აღდგენა'}
            </button>
          </form>

          <div className="auth-nav-links single-link">
            <span onClick={() => switchView('login')} className="auth-toggle-link">
              უკან დაბრუნება
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (viewState === 'register') {
    return (
      <div className="auth-page-container">
        <div className="auth-card-wrapper">
          {errorMsg && <div className="auth-error-banner">{errorMsg}</div>}

          <form onSubmit={handleRegisterSubmit} className="auth-form-block">
            <input 
              type="text" 
              placeholder="სახელი"
              value={registerForm.firstName}
              onChange={(e) => setRegisterForm({...registerForm, firstName: e.target.value})}
              className="auth-input-field"
              required
            />
            <input 
              type="text" 
              placeholder="გვარი"
              value={registerForm.lastName}
              onChange={(e) => setRegisterForm({...registerForm, lastName: e.target.value})}
              className="auth-input-field"
              required
            />
            <input 
              type="email" 
              placeholder="ელ-ფოსტა"
              value={registerForm.email}
              onChange={(e) => setRegisterForm({...registerForm, email: e.target.value})}
              className="auth-input-field"
              required
            />
            <input 
              type="tel" 
              placeholder="ტელეფონი"
              value={registerForm.phone}
              onChange={(e) => setRegisterForm({...registerForm, phone: e.target.value})}
              className="auth-input-field"
            />
            <input 
              type="password" 
              placeholder="პაროლი"
              value={registerForm.password}
              onChange={(e) => setRegisterForm({...registerForm, password: e.target.value})}
              className="auth-input-field"
              required
            />
            <input 
              type="password" 
              placeholder="პაროლი განმეორებით"
              value={registerForm.confirmPassword}
              onChange={(e) => setRegisterForm({...registerForm, confirmPassword: e.target.value})}
              className="auth-input-field"
              required
            />
            <button type="submit" className="auth-action-btn" disabled={loading}>
              {loading ? 'მუშავდება...' : 'რეგისტრაცია'}
            </button>
          </form>

          <div className="auth-nav-links single-link">
            <span onClick={() => switchView('login')} className="auth-toggle-link">
              უკან დაბრუნება
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page-container">
      <div className="auth-card-wrapper">
        {errorMsg && <div className="auth-error-banner">{errorMsg}</div>}

        <form onSubmit={handleLoginSubmit} className="auth-form-block">
          <input 
            type="email" 
            placeholder="ელ-ფოსტა"
            value={loginForm.email}
            onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
            className="auth-input-field"
            required
          />
          <input 
            type="password" 
            placeholder="პაროლი"
            value={loginForm.password}
            onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
            className="auth-input-field"
            required
          />
          <button type="submit" className="auth-action-btn" disabled={loading}>
            {loading ? 'შესვლა...' : 'შესვლა'}
          </button>
        </form>

        <div className="auth-nav-links">
          <span onClick={() => switchView('recover')} className="auth-toggle-link">
            დაგავიწყდა პაროლი?
          </span>
          <span onClick={() => switchView('register')} className="auth-toggle-link">
            არ ხარ დარეგისტრირებული?
          </span>
        </div>
      </div>
    </div>
  );
};

export default Profile;