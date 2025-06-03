import React from 'react';

class ChartErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Chart error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <p
          className="
            text-red-500 
            text-center 
            px-4 
            py-6 
            text-sm 
            sm:text-base 
            md:text-lg 
            max-w-md 
            mx-auto
          "
        >
          Chart rendering failed. Please check your data.
        </p>
      );
    }
    return this.props.children;
  }
}

export default ChartErrorBoundary;
