import toast from 'react-hot-toast';

// 1. Success Notification
export const showSuccess = (message) => {
  toast.success(message, {
    style: {
      border: '1px solid #10B981',
      padding: '16px',
      color: '#065F46',
      background: '#D1FAE5',
    },
    iconTheme: {
      primary: '#10B981',
      secondary: '#D1FAE5',
    },
  });
};

// 2. Error Notification
export const showError = (message) => {
  toast.error(message, {
    style: {
      border: '1px solid #EF4444',
      padding: '16px',
      color: '#7F1D1D',
      background: '#FEE2E2',
    },
    iconTheme: {
      primary: '#EF4444',
      secondary: '#FEE2E2',
    },
  });
};

// 3. Loading Notification (Great for API calls)
export const showLoading = (message) => {
  return toast.loading(message, {
    style: {
      border: '1px solid #3B82F6',
      padding: '16px',
      color: '#1E3A8A',
      background: '#EFF6FF',
    },
  });
};

// 4. Dismiss a specific toast (useful for loading)
export const dismissToast = (toastId) => {
  toast.dismiss(toastId);
};

// 5. Backward Compatibility (Wraps your old function)
export const openAlertBox = (title, message) => {
  if (title.toLowerCase().includes('error')) {
    showError(message);
  } else {
    showSuccess(message);
  }
};