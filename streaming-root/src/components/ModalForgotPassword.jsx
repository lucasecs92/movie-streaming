import { useEffect, useState } from "react";
import styles from "../styles/Modal.module.scss";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import supabase from "../../lib/supabaseClient"; 

export default function ModalForgotPassword({
    isOpen,
    onClose,
    email: initialEmail, // Rename to avoid conflict if managing email internally
    handleEmailChange: parentHandleEmailChange, // Rename if managing email internally
    clearEmail: parentClearEmail, // Rename if managing email internally
}) {
    // It's often better for modals to manage their own form state
    const [modalEmail, setModalEmail] = useState(initialEmail || "");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    useEffect(() => {
        if (isOpen) {
            setModalEmail(initialEmail || ""); // Reset email when modal opens
            setError(null); // Clear previous errors
            setSuccessMessage(null); // Clear previous success messages
        }
    }, [isOpen, initialEmail]);


    useEffect(() => {
        const handleEsc = (event) => {
            if (event.key === "Escape") {
                onClose();
            }
        };

        if (isOpen) {
            window.addEventListener("keydown", handleEsc);
        } else {
            window.removeEventListener("keydown", handleEsc);
        }

        return () => {
            window.removeEventListener("keydown", handleEsc);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const handleModalEmailChange = (e) => {
        setModalEmail(e.target.value);
        if (parentHandleEmailChange) { // If parent wants to sync, call its handler
            parentHandleEmailChange(e);
        }
    };

    const clearModalEmail = () => {
        setModalEmail("");
        if (parentClearEmail) { // If parent wants to sync, call its handler
            parentClearEmail();
        }
    };

    const handleForgotPasswordSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccessMessage(null);

        if (!modalEmail) {
            setError("Por favor, insira seu endereço de e-mail.");
            setLoading(false);
            return;
        }

        try {
            const { error: supabaseError } = await supabase.auth.resetPasswordForEmail(modalEmail, {
                // redirectTo should point to the page where your `Home.jsx` (or equivalent)
                // is rendered, so the onAuthStateChange listener can pick up the PASSWORD_RECOVERY event.
                // Make sure this URL is added to your Supabase project's "Site URL" and "Redirect URLs"
                // under Authentication -> URL Configuration.
                redirectTo: `${window.location.origin}/`,
            });

            if (supabaseError) {
                setError(supabaseError.message);
            } else {
                setSuccessMessage("Um link de recuperação de senha foi enviado para o seu e-mail! Por favor, verifique sua caixa de entrada e clique no link para redefinir sua senha.");
                // Don't close immediately, let user see the message. Or close after a delay.
                // For now, we'll rely on the user closing it or an explicit close action.
                // onClose(); // Optionally close the modal after success
            }
        } catch (err) {
            setError("Ocorreu um erro ao solicitar a redefinição de senha.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className={styles.modalOverlay}>
            <section className={styles.modalHeading}>
                <h2>Recuperar Senha</h2>
                <p>
                    Digite o endereço de e-mail associado à sua conta.
                    Enviaremos um link para redefinir sua senha.
                </p>
            </section>
            <section className={styles.modalContent}>
                <span className={styles.closeButton}>
                    <IoIosCloseCircleOutline onClick={onClose} />
                </span>
                <form
                    className={styles.form}
                    onSubmit={handleForgotPasswordSubmit}
                >
                    <label className={styles.label}>Email</label>
                    <section className={styles.inputWrapper}>
                        <input
                            className={styles.input}
                            type="email"
                            value={modalEmail}
                            onChange={handleModalEmailChange}
                            required
                            placeholder="seuemail@exemplo.com"
                        />
                        {modalEmail && <IoClose className={styles.clearIcon} onClick={clearModalEmail} />}
                    </section>
                    <button className={styles.button} type="submit" disabled={loading}>
                        {loading ? "Enviando..." : "Enviar Link de Recuperação"}
                    </button>
                    {error && <p className={styles.error}>{error}</p>}
                    {successMessage && <p className={styles.success}>{successMessage}</p>}
                </form>
            </section>
        </section>
    );
}