import { Component } from 'react'

/**
 * Isolates the WebGL hero. A shader compile failure, a lost context or a
 * driver quirk throws during render — without this the whole page would
 * unmount and the visitor would get a black screen. Instead the flow field
 * quietly disappears and the rest of the site carries on.
 */
export default class CanvasBoundary extends Component {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch(error) {
    if (import.meta.env.DEV) console.warn('Hero canvas disabled:', error)
  }

  render() {
    if (this.state.failed) return this.props.fallback ?? null
    return this.props.children
  }
}
