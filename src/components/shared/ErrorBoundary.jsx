import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    console.error('[LendWell] Render error:', error, info.componentStack)
  }

  render() {
    if (!this.state.hasError) return this.props.children

    return (
      <div className="h-screen bg-navy flex items-center justify-center">
        <div className="text-center max-w-sm px-6">
          <div className="w-16 h-16 rounded-2xl bg-coral/10 flex items-center justify-center mx-auto mb-5">
            <span className="text-3xl">⚠️</span>
          </div>
          <h1 className="text-text-pri font-semibold text-lg mb-2">Something went wrong</h1>
          <p className="text-text-sec text-sm leading-relaxed mb-6">
            An unexpected error occurred. Your session data has not been lost.
          </p>
          <button
            onClick={() => { this.setState({ hasError: false, error: null }); window.location.href = '/' }}
            className="px-6 py-2.5 bg-emerald text-navy rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            Return to Home
          </button>
          {import.meta.env.DEV && this.state.error && (
            <pre className="mt-6 text-left text-xs text-coral/70 bg-surface rounded-lg p-4 overflow-auto max-h-48">
              {this.state.error.toString()}
            </pre>
          )}
        </div>
      </div>
    )
  }
}
