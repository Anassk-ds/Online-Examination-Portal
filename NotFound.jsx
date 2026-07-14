import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div style={styles.container} className="page-fade-in">
      <div style={styles.card} className="card-animated">
        <div style={styles.errorCode}>404</div>
        <h1 style={styles.title}>Page Not Found</h1>
        <p style={styles.message}>
          The page you're looking for doesn't exist or may have been moved.
        </p>
        <Link to="/" style={styles.homeBtn} className="btn-animated">← Return to Home</Link>
      </div>
    </div>
  );
};

const styles = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#0f172a', fontFamily: 'sans-serif', padding: '20px' },
  card: { textAlign: 'center', backgroundColor: '#1e293b', padding: '50px 40px', borderRadius: '20px', border: '1px solid #334155', maxWidth: '420px' },
  errorCode: { fontSize: '72px', fontWeight: 'bold', color: '#3b82f6', lineHeight: 1 },
  title: { color: '#f8fafc', fontSize: '22px', margin: '16px 0 10px 0' },
  message: { color: '#94a3b8', fontSize: '14px', marginBottom: '30px', lineHeight: 1.6 },
  homeBtn: { display: 'inline-block', backgroundColor: '#3b82f6', color: '#ffffff', padding: '12px 24px', borderRadius: '8px', fontWeight: 'bold', textDecoration: 'none' }
};

export default NotFound;
