// ModalResetPasswordForm.jsx
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

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (password !== confirmPassword) {
            setError("As senhas não coincidem.");
            setLoading(false);
            return;
        }

        try {
            await onPasswordSubmit(password); // Chama a função passada pelo pai (page.jsx)
        } catch (err) {
            setError("Ocorreu um erro ao redefinir a senha.");
            console.error(err);
        } finally {
            setLoading(false);
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
                    onSubmit={handleResetPassword} // Use a nova função
                >
                    <label className={styles.label}>Nova Senha</label>
                    <section className={styles.passwordWrapper}>
                        <input
                            className={styles.input}
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
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