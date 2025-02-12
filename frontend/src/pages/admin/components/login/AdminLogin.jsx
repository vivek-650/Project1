// import React from 'react'

const AdminLogin = () => {
  const styles = {
    loginCard: {
      maxWidth: '400px',
      margin: '0 auto',
      padding: '2rem',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      borderRadius: '8px',
      backgroundColor: '#fff',
    },
    brand: {
      textAlign: 'center',
      marginBottom: '2rem',
    },
    brandLogo: {
      width: '50px',
      height: '50px',
      marginBottom: '1rem',
      backgroundColor: '#ccc',
      borderRadius: '50%',
    },
    formGroup: {
      marginBottom: '1rem',
    },
    input:{
      width: "60%",
      height: "20%",


    },
    error: {
      color: 'red',
      fontSize: '0.875rem',
      marginTop: '0.5rem',
    },
    rememberForgot: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '1rem',
    },
    loginBtn: {
      width: '100%',
      padding: '0.75rem',
      backgroundColor: '#007bff',
      color: '#fff',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
    },
    
    signupLink: {
      textAlign: 'center',
      marginTop: '2rem',
    },
  }
  return (
    <div style={styles.loginCard}>
        <div style={styles.brand}>
            <div style={styles.brandLogo}></div>
            <h1>Welcome back</h1>
            <p>Enter your credentials to access your account</p>
        </div>

        <form id="loginForm">
            <div style={styles.formGroup}>
                <label htmlFor="email">Email</label>
                <input 
                    type="email" 
                    id="email" 
                    placeholder="name@company.com"
                    autoComplete="email"
                    style={styles.input}
                />
                <div style={styles.error} id="emailError"></div>
            </div>

            <div style={styles.formGroup}>
                <label htmlFor="password">Password</label>
                <input 
                    type="password" 
                    id="password" 
                    placeholder="Enter your password"
                    autoComplete="current-password"
                />
                <div style={styles.error} id="passwordError"></div>
            </div>

            <div style={styles.rememberForgot}>
                <div>
                    <input type="checkbox" id="remember" />
                    <label htmlFor="remember">Remember me</label>
                </div>
                <a href="#" className="forgot-password">Forgot password?</a>
            </div>

            <button type="submit" style={styles.loginBtn} id="loginButton">
                Sign in
            </button>
        </form>

        <div style={styles.signupLink}>
            <p>Don&apos;t have an account? <a href="#">Sign up</a></p>
        </div>
    </div>
  )
}

export default AdminLogin