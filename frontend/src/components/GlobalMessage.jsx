import { useMessage } from '../context/MessageContext';

const GlobalMessage = () => {
  const { message } = useMessage();

  if (!message.text) return null;

  return (
    <div
      className={`p-3 mb-4 rounded text-white ${
        message.type === 'error' ? 'bg-red-600' : 'bg-green-600'
      }`}
    >
      {message.text}
    </div>
  );
};

export default GlobalMessage;
