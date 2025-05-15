import { useEffect, useState } from "react";
import styles from "../styles/Modal.module.scss";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { LuEye, LuEyeClosed } from "react-icons/lu";
// No need to import useLoading here, as page.jsx's handleResetPassword (called via onPasswordSubmit) does it.
// However, if you want to disable inputs while the global loader is active (even if triggered by parent),
// you could import and use `useLoading`'s `isLoading` state for disabling.
// For simplicity now, we assume the overlay is enough.

export default function ModalResetPasswordForm({ isOpen, onClose, onPasswordSubmit }) {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false); // This is local loading for the button

    useEffect(() => {
        const handleEsc = (event) => {
            if (event.key === "Escape") {
                onClose();
            }
        };

        if (isOpen) {
            setPassword("");
            setConfirmPassword("");
            setShowPassword(false);
            setShowConfirmPassword(false);
            setError(null);
            setLoading(false);
            window.addEventListener("keydown", handleEsc);
        } else {
            window.removeEventListener("keydown", handleEsc);
        }

        return () => {
            window.removeEventListener("keydown", handleEsc);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const toggleShowConfirmPassword = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    const handleResetPasswordSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); // Set local button loading
        setError(null);

        if (!password) {
            setError("O campo Nova Senha é obrigatório.");
            setLoading(false);
            return;
        }
        if (password !== confirmPassword) {
            setError("As senhas não coincidem.");
            setLoading(false);
            return;
        }
        if (password.length < 6) {
            setError("A senha deve ter pelo menos 6 caracteres.");
            setLoading(false);
            return;
        }

        try {
            // onPasswordSubmit is page.jsx's handleResetPassword, which sets the global loader.
            await onPasswordSubmit(password);
            // Success/error handling and modal closing are managed by onPasswordSubmit in page.jsx
        } catch (err) {
            // This catch might be redundant if onPasswordSubmit handles all errors and alerts.
            // It's here as a fallback for errors propagated from onPasswordSubmit.
            setError("Ocorreu um erro ao tentar redefinir a senha. Tente novamente.");
            console.error("Error in ModalResetPasswordForm submit (propagated from onPasswordSubmit):", err);
        } finally {
            setLoading(false); // Reset local button loading
        }
    };

    return (
        <section className={styles.modalOverlay}>
            <section className={styles.modalHeading}>
                <h2>Redefinir Senha</h2>
            </section>
            <section className={styles.modalContent}>
                <span className={styles.closeButton}>
                    <IoIosCloseCircleOutline onClick={onClose} />
                </span>
                <form
                    className={styles.form}
                    onSubmit={handleResetPasswordSubmit}
                >
                    <label className={styles.label}>Nova Senha</label>
                    <section className={styles.passwordWrapper}>
                        <input
                            className={styles.input}
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            autoComplete="new-password"
                            disabled={loading} // Disabled by local loading
                        />
                        {showPassword ? (
                            <LuEyeClosed className={styles.eyeIcon} onClick={toggleShowPassword} />
                        ) : (
                            <LuEye className={styles.eyeIcon} onClick={toggleShowPassword} />
                        )}
                    </section>

                    <label className={styles.label}>Confirmar Nova Senha</label>
                    <section className={styles.passwordWrapper}>
                        <input
                            className={styles.input}
                            type={showConfirmPassword ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            autoComplete="new-password"
                            disabled={loading} // Disabled by local loading
                        />
                        {showConfirmPassword ? (
                            <LuEyeClosed className={styles.eyeIcon} onClick={toggleShowConfirmPassword} />
                        ) : (
                            <LuEye className={styles.eyeIcon} onClick={toggleShowConfirmPassword} />
                        )}
                    </section>
                    <button className={styles.button} type="submit" disabled={loading}>
                        {loading ? "Redefinindo..." : "Redefinir Senha"}
                    </button>
                    {error && <p className={styles.error}>{error}</p>}
                </form>
            </section>
        </section>
    );
}