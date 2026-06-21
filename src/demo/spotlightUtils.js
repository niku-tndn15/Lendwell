// Apply/clear the CSS spotlight effect on a demo target element

export const applySpotlight = (targetId) => {
  clearSpotlight()
  const el = document.querySelector(`[data-demo-id="${targetId}"]`)
  if (!el) {
    console.warn(`[Demo] Spotlight target not found: ${targetId}`)
    return
  }
  el.classList.add('demo-spotlight-active')
}

export const clearSpotlight = () => {
  document.querySelectorAll('.demo-spotlight-active').forEach((el) => {
    el.classList.remove('demo-spotlight-active')
  })
}

// Polls for the target element up to maxWaitMs, then spotlights it.
// Handles routes with skeleton loading states where the element is deferred.
export const waitAndSpotlight = (targetId, maxWaitMs = 2000, intervalMs = 120) => {
  clearSpotlight()
  let elapsed = 0
  const attempt = () => {
    const el = document.querySelector(`[data-demo-id="${targetId}"]`)
    if (el) {
      el.classList.add('demo-spotlight-active')
      return
    }
    elapsed += intervalMs
    if (elapsed < maxWaitMs) setTimeout(attempt, intervalMs)
    else console.warn(`[Demo] Spotlight target "${targetId}" not found after ${maxWaitMs}ms`)
  }
  attempt()
}

// Polls for the element then scrolls it into view.
export const waitAndScroll = (targetId, maxWaitMs = 2000, intervalMs = 120) => {
  let elapsed = 0
  const attempt = () => {
    const el = document.querySelector(`[data-demo-id="${targetId}"]`)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }
    elapsed += intervalMs
    if (elapsed < maxWaitMs) setTimeout(attempt, intervalMs)
  }
  attempt()
}
