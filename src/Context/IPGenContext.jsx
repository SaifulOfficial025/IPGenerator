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
        }
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
        }
      });
      const data = await res.json();
      return data.phone_number || '';
    } catch (err) {
      return '';
    }
  };

  const generateIP = async () => {
    try {
      const res = await fetch('/api/ip_generate_with_one_click/generate-ip-and-get-url/', {
        method: 'GET'
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

  return (
    <IPGenContext.Provider value={{ generateEmail, generatePhone, generateIP }}>
      {children}
    </IPGenContext.Provider>
  );
};

export const useIPGen = () => useContext(IPGenContext);
