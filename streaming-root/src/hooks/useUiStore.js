import { useState } from "react";

export function useUiStore() {
  const [modals, setModals] = useState({
    login: false,
    cadastro: false,
    forgotPassword: false,
    resetPassword: false,
    legal: null, // Pode ser 'terms' ou 'privacy'
  });

  const openModal = (name, value = true) => {
    setModals((prev) => ({ ...prev, [name]: value }));
  };

  const closeModal = (name) => {
    setModals((prev) => ({ 
        ...prev, 
        [name]: name === 'legal' ? null : false 
    }));
  };

  return { modals, openModal, closeModal };
}