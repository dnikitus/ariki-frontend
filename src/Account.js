import React, { useState, useEffect } from 'react';
import './Account.css'; // Add your styling matching the theme

const STRAPI_URL = 'http://localhost:1337';

const Account = () => {
  const [token, setToken] = useState(localStorage.getItem('jwt') || null);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);

  // Auth form states
  const [isRegistering, setIsRegistering] = useState(false);
  const [authForm, setAuthForm] = useState({ username: '', email: '', password: '' });
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // Profile tabs: 'orders' | 'profile'
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [profileForm, setProfileForm] = useState({ username: '', email: '' });
  const [updateMsg, setUpdateMsg] = useState('');

  useEffect(() => {
    if (user) {
      setProfileForm({ username: user.username || '', email: user.email || '' });
    }
  }, [user]);

  // Handle Register & Sign In
  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);

    const endpoint = isRegistering 
      ? `${STRAPI_URL}/api/auth/local/register` 
      : `${STRAPI_URL}/api/auth/local`;

    const bodyData = isRegistering 
      ? authForm 
      : { identifier: authForm.email || authForm.username, password: authForm.password };

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error?.message || 'ავტორიზაციის შეცდომა');
      }

      // Save JWT session
      localStorage.setItem('jwt', data.jwt);
      localStorage.setItem('user', JSON.stringify(data.user));
      setToken(data.jwt);
      setUser(data.user);
    } catch (err) {
      setAuthError(err.message);
    } finally {
      setAuthLoading(false);
    }
  };

  // Sign Out
  const handleSignOut = () => {
    localStorage.removeItem('jwt');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  // Update Profile Details
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setUpdateMsg('');
    try {
      const res = await fetch(`${STRAPI_URL}/api/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ username: profileForm.username, email: profileForm.email }),
      });

      const updatedUser = await res.json();
      if (!res.ok) throw new Error('პროფილის განახლება ვერ მოხერხდა');

      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      setUpdateMsg('პროფილი წარმატებით განახლდა!');
    } catch (err) {
      setUpdateMsg(err.message);
    }
  };

  // ----------------------------------------------------------------
  // UNAUTHENTICATED VIEW (LOGIN / REGISTER)
  // ----------------------------------------------------------------
  if (!token) {
    return (
      <div className="account-container">
        <div className="auth-card">
          <h2>{isRegistering ? 'რეგისტრაცია' : 'ავტორიზაცია'}</h2>
          
          {authError && <div className="auth-error">{authError}</div>}

          <form onSubmit={handleAuthSubmit}>
            {isRegistering && (
              <input
                type="text"
                placeholder="მომხმარებლის სახელი"
                value={authForm.username}
                onChange={(e) => setAuthForm({ ...authForm, username: e.target.value })}
                required
              />
            )}
            <input
              type="email"
              placeholder="ელ-ფოსტა"
              value={authForm.email}
              onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
              required
            />
            <input
              type="password"
              placeholder="პაროლი"
              value={authForm.password}
              onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
              required
            />
            <button type="submit" disabled={authLoading}>
              {authLoading ? 'მუშავდება...' : isRegistering ? 'რეგისტრაცია' : 'შესვლა'}
            </button>
          </form>

          <p className="auth-toggle">
            {isRegistering ? 'უკვე გაქვთ ანგარიში?' : 'არ გაქვთ ანგარიში?'}
            <button type="button" onClick={() => setIsRegistering(!isRegistering)}>
              {isRegistering ? 'შესვლა' : 'რეგისტრაცია'}
            </button>
          </p>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------------------
  // AUTHENTICATED DASHBOARD (MATCHING YOUR DESIGN SCREENSHOT)
  // ----------------------------------------------------------------
  return (
    <div className="account-container">
      {/* 3 Action Buttons Bar */}
      <div className="account-tab-buttons">
        <button
          className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
          </svg>
          შეკვეთები
        </button>

        <button
          className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
          პროფილი
        </button>

        <button className="tab-btn logout-btn" onClick={handleSignOut}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
          გასვლა
        </button>
      </div>

      {/* Dynamic Tab Content Area */}
      <div className="account-content-body">
        {activeTab === 'orders' && (
          <div className="orders-section">
            {orders.length === 0 ? (
              <p className="empty-message">თქვენ არ გაქვთ შეკვეთები</p>
            ) : (
              <ul className="orders-list">
                {orders.map((item, index) => (
                  <li key={index}>{item.title}</li>
                ))}
              </ul>
            )}
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="profile-section">
            {updateMsg && <p className="update-msg">{updateMsg}</p>}
            <form onSubmit={handleUpdateProfile} className="profile-form">
              <label>სახელი</label>
              <input
                type="text"
                value={profileForm.username}
                onChange={(e) => setProfileForm({ ...profileForm, username: e.target.value })}
              />
              <label>ელ-ფოსტა</label>
              <input
                type="email"
                value={profileForm.email}
                onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
              />
              <button type="submit">შენახვა</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Account;