// ModalForgotPassword.jsx
import { useEffect, useState } from "react";
import styles from "../styles/Modal.module.scss";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import supabase from "../../lib/supabaseClient"; // Importe o cliente Supabase
import { useRouter } from 'next/navigation'; // Importe o useRouter

export default function ModalForgotPassword({
    isOpen,
    onClose,
    email,
    handleEmailChange,
    clearEmail,
}) {
    const [loading, setLoading] = useState(false); // Estado para controlar o loading
    const [error, setError] = useState(null);
    const router = useRouter(); // Inicialize o router

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

    const handleForgotPasswordSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/`, // Redireciona para a home após o envio do email
            });

            if (error) {
                setError(error.message);
            } else {
                alert("Um link de recuperação de senha foi enviado para o seu e-mail!");
                router.push('/'); // Redireciona para a home
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
                    onSubmit={handleForgotPasswordSubmit} // Use a nova função
                >
                    <label className={styles.label}>Email</label>
                    <section className={styles.inputWrapper}>
                        <input
                            className={styles.input}
                            type="email"
                            value={email}
                            onChange={handleEmailChange}
                            required
                        />
                        {email && <IoClose className={styles.clearIcon} onClick={clearEmail} />}
                    </section>
                    <button className={styles.button} type="submit" disabled={loading}>
                        {loading ? "Enviando..." : "Enviar Link de Recuperação"}
                    </button>
                    {error && <p className={styles.error}>{error}</p>}
                </form>
            </section>
        </section>
    );
}