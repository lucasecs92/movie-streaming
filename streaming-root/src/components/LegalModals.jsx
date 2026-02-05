"use client";

import PropTypes from "prop-types";
import ModalTexto from "./ModalTexto";
import { LEGAL_TEXTS } from "../constants/legalTexts";

export default function LegalModals({ type, isOpen, onClose }) {
    if (!type || !LEGAL_TEXTS[type]) return null;

    const { title, intro, content } = LEGAL_TEXTS[type];

    return (
        <ModalTexto isOpen={isOpen} onClose={onClose} title={title}>
            {/* Renderiza a introdução se existir */}
            {intro && (
                <p style={{ marginBottom: "1.5rem", fontWeight: "500" }}>{intro}</p>
            )}

            {content.map((section) => (
                <section key={section.id} style={{ marginBottom: "1.5rem" }}>
                    {section.subtitle && <h3 style={{ fontSize: "1.1rem" }}>{section.subtitle}</h3>}
                    <p>{section.text}</p>
                </section>
            ))}
        </ModalTexto>
    );
}

// validação de Props para remover os erros de 'missing in props validation'
LegalModals.propTypes = {
    type: PropTypes.oneOf(["terms", "privacy", null]), 
    isOpen: PropTypes.bool.isRequired,                
    onClose: PropTypes.func.isRequired,               
};