import { createContext, useState, useContext } from 'react';

const MessageContext = createContext();

export const MessageProvider = ({ children }) => {
  const [message, setMessage] = useState({ type: '', text: '' });

  const showMessage = (type, text) => {
    setMessage({ type, text });

    // Auto-clear after 3 seconds
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  return (
    <MessageContext.Provider value={{ message, showMessage }}>
      {children}
    </MessageContext.Provider>
  );
};

export const useMessage = () => useContext(MessageContext);
