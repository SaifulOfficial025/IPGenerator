import React, { createContext, useContext } from 'react';

export const IPGenContext = createContext();

export const IPGenProvider = ({ children }) => {
  // API integration functions
  const generateEmail = async () => {
    try {
      const res = await fetch('/api/mail-sender/generate-account/', {
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
      const res = await fetch('/api/phone-solution/purchase-number/', {
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
      const url = `/api/ip_generate_with_one_click/generate-ip-and-get-url/?_=${Date.now()}`;
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
      const res = await fetch('/api/phone-solution/use-otp/', {
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
