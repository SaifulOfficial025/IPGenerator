import React, { createContext, useContext } from 'react';

export const IPGenContext = createContext();

export const IPGenProvider = ({ children }) => {
  // API integration functions
  const generateEmail = async () => {
    try {
      const res = await fetch('/api/mail_generate_with_one_click/generate-mail/', {
        method: 'GET'
      });
      const data = await res.json();
      return data.email || '';
    } catch (err) {
      return '';
    }
  };

  const generatePhone = async () => {
    try {
      const res = await fetch('/api/phone_generate_with_one_click/generate-phone/', {
        method: 'POST'
      });
      const data = await res.json();
      return data.phone_number || '';
    } catch (err) {
      return '';
    }
  };

  const generateIP = async () => {
    try {
      const res = await fetch('/api/ip_generate_with_one_click/generate-ip/', {
        method: 'GET'
      });
      const data = await res.json();
      return data.ip_address || '';
    } catch (err) {
      return '';
    }
  };

  return (
    <IPGenContext.Provider value={{ generateEmail, generatePhone, generateIP }}>
      {children}
    </IPGenContext.Provider>
  );
};

export const useIPGen = () => useContext(IPGenContext);
