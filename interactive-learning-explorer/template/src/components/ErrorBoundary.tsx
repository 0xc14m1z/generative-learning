import { Component, type ReactNode } from 'react'

interface Props {
  fallback?: ReactNode
  label?: string
  children: ReactNode
}

interface State {
  error: Error | null
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error) {
    return { error }
  }

  componentDidCatch(error: Error) {
    console.error(`[ErrorBoundary${this.props.label ? `: ${this.props.label}` : ''}]`, error)
  }

  render() {
    if (this.state.error) {
      if (this.props.fallback) return this.props.fallback
      return (
        <div className="border border-border rounded-lg p-4 text-sm text-muted-foreground bg-muted/30">
          <span className="font-semibold">Rendering error</span>
          {this.props.label && <span className="text-xs ml-2 opacity-60">({this.props.label})</span>}
          {import.meta.env.DEV && (
            <pre className="mt-2 text-xs opacity-50 whitespace-pre-wrap">{this.state.error.message}</pre>
          )}
        </div>
      )
    }
    return this.props.children
  }
}
