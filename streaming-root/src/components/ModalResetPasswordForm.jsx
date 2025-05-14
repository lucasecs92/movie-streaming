import { useEffect, useState } from "react";
import styles from "../styles/Modal.module.scss";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { LuEye, LuEyeClosed } from "react-icons/lu";

export default function ModalResetPasswordForm({ isOpen, onClose, onPasswordSubmit }) {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const handleEsc = (event) => {
            if (event.key === "Escape") {
                onClose();
            }
        };

        if (isOpen) {
            // Reset form state when modal opens
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

    const handleResetPasswordSubmit = async (e) => { // Renamed to avoid conflict if onPasswordSubmit was also named this
        e.preventDefault();
        setLoading(true);
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
        if (password.length < 6) { // Example: Enforce minimum password length
            setError("A senha deve ter pelo menos 6 caracteres.");
            setLoading(false);
            return;
        }

        try {
            // The token is handled by Supabase client library,
            // which updates the user session upon redirection from the email link.
            // `onPasswordSubmit` in Home.jsx will call supabase.auth.updateUser()
            await onPasswordSubmit(password);
            // Success/error handling and modal closing should be managed by the `onPasswordSubmit` callback in Home.jsx
        } catch (err) {
            // This catch block might not be strictly necessary if onPasswordSubmit handles all errors
            // and Home.jsx shows alerts. However, it can be a local fallback.
            setError("Ocorreu um erro ao tentar redefinir a senha. Tente novamente.");
            console.error("Error in ModalResetPasswordForm submit:", err);
        } finally {
            setLoading(false); // Ensure loading is set to false
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