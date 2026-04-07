import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can log the error to an error reporting service like Sentry or LogRocket
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    this.setState({ error, errorInfo });
  }

  handleReset = () => {
    // Provide a way for the user to recover without a full page reload
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.href = "/"; // Or a specific safe route
  };

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div style={styles.errorContainer}>
          <h2>Something went wrong.</h2>
          <p>The application encountered an unexpected error while processing data.</p>
          <button onClick={this.handleReset} style={styles.button}>
            Try Again / Reload
          </button>
          {process.env.NODE_ENV === 'development' && (
            <details style={styles.details}>
              {this.state.error && this.state.error.toString()}
              <br />
              {this.state.errorInfo?.componentStack}
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

const styles = {
  errorContainer: {
    padding: '40px',
    textAlign: 'center',
    backgroundColor: '#fff5f5',
    border: '1px solid #feb2b2',
    borderRadius: '8px',
    margin: '20px'
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#e53e3e',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginTop: '10px'
  },
  details: {
    whiteSpace: 'pre-wrap',
    textAlign: 'left',
    marginTop: '20px',
    fontSize: '12px',
    color: '#718096'
  }
};

export default ErrorBoundary;