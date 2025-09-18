import React, { createContext, useContext } from 'react';

export const IPGenContext = createContext();

export const IPGenProvider = ({ children }) => {
  // Use environment variable for API base URL so we can point to different backends
  // in dev (proxy) and production (actual backend domain).
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';
  // API integration functions
  const generateEmail = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/mail-sender/generate-account/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        cache: 'no-store'
      });
      const data = await res.json();
      return data.address || '';
    } catch (err) {
      return '';
    }
  };

  const generatePhone = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/phone-solution/purchase-number/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        cache: 'no-store'
      });
      const data = await res.json();
      return data.phone_number || '';
    } catch (err) {
      return '';
    }
  };

  const generateIP = async () => {
    try {
      // add a cache-buster query param and explicitly disable cache
      const url = `${API_BASE_URL}/ip_generate_with_one_click/generate-ip-and-get-url/?_=${Date.now()}`;
      const res = await fetch(url, {
        method: 'GET',
        cache: 'no-store'
      });
      const data = await res.json();
      // return both the generated_ip and redirect_url so the caller can use both
      return {
        generated_ip: data.generated_ip || '',
        redirect_url: data.redirect_url || ''
      };
    } catch (err) {
      return { generated_ip: '', redirect_url: '' };
    }
  };

  const useOtp = async (phone_number) => {
    try {
      const res = await fetch(`${API_BASE_URL}/phone-solution/use-otp/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone_number })
      ,
        cache: 'no-store'
      });
      const data = await res.json();
      // API may return either { status, message } or { error: '...' }
      if (data.error) {
        return { status: 'error', message: data.error };
      }
      return { status: data.status || 'success', message: data.message || '' };
    } catch (err) {
      return { status: 'error', message: 'Network error' };
    }
  };

  return (
    <IPGenContext.Provider value={{ generateEmail, generatePhone, generateIP, useOtp }}>
      {children}
    </IPGenContext.Provider>
  );
};

export const useIPGen = () => useContext(IPGenContext);
