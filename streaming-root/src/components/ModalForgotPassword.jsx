"use client";

import { useEffect, useState } from "react";
import styles from "../styles/Modal.module.scss";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import supabase from "../../lib/supabaseClient";
import { useLoading } from '../contexts/LoadingContext'; // Import useLoading

export default function ModalForgotPassword({
    isOpen,
    onClose,
    email: initialEmail,
    handleEmailChange: parentHandleEmailChange,
    clearEmail: parentClearEmail,
}) {
    const [modalEmail, setModalEmail] = useState(initialEmail || "");
    const [localLoading, setLocalLoading] = useState(false); // Renamed for clarity
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const { setIsLoading, isLoading: isGlobalLoading } = useLoading(); // Get setIsLoading

    useEffect(() => {
        if (isOpen) {
            setModalEmail(initialEmail || "");
            setError(null);
            setSuccessMessage(null);
            setLocalLoading(false); // Reset local loading state
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
        if (parentHandleEmailChange) {
            parentHandleEmailChange(e);
        }
    };

    const clearModalEmail = () => {
        setModalEmail("");
        if (parentClearEmail) {
            parentClearEmail();
        }
    };

    const handleForgotPasswordSubmit = async (e) => {
        e.preventDefault();
        setLocalLoading(true); // For button text
        setIsLoading(true);    // For global overlay
        setError(null);
        setSuccessMessage(null);

        if (!modalEmail) {
            setError("Por favor, insira seu endereço de e-mail.");
            setLocalLoading(false);
            setIsLoading(false);
            return;
        }

        try {
            const { error: supabaseError } = await supabase.auth.resetPasswordForEmail(modalEmail, {
                redirectTo: `${window.location.origin}/`,
            });

            if (supabaseError) {
                setError(supabaseError.message);
            } else {
                setSuccessMessage("Um link de recuperação de senha foi enviado para o seu e-mail! Por favor, verifique sua caixa de entrada e clique no link para redefinir sua senha.");
            }
        } catch (err) {
            setError("Ocorreu um erro ao solicitar a redefinição de senha.");
            console.error(err);
        } finally {
            setLocalLoading(false);
            setIsLoading(false);
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
                            disabled={isGlobalLoading || localLoading}
                        />
                        {modalEmail && <IoClose className={styles.clearIcon} onClick={clearModalEmail} />}
                    </section>
                    <button className={styles.button} type="submit" disabled={isGlobalLoading || localLoading}>
                        {isGlobalLoading || localLoading ? "Enviando..." : "Enviar Link de Recuperação"}
                    </button>
                    {error && <p className={styles.error}>{error}</p>}
                    {successMessage && <p className={styles.success}>{successMessage}</p>}
                </form>
            </section>
        </section>
    );
}