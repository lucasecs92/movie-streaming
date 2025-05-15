"use client";

import styles from '../styles/LoadingOverlay.module.scss'; // We'll create this SCSS file next
import { AiOutlineLoading } from 'react-icons/ai'; 
import { useLoading } from '../contexts/LoadingContext';

export default function LoadingOverlay() {
  const { isLoading } = useLoading();

  if (!isLoading) return null;

  return (
    <div className={styles.overlay}>
      <AiOutlineLoading className={styles.spinner} />
    </div>
  );
}