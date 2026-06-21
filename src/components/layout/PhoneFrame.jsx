// Pure CSS phone frame — 375×812px visible content area.
// No screen logic here; just the visual wrapper.
export default function PhoneFrame({ children }) {
  return (
    <div className="phone-frame-wrapper relative">
      {/* Physical frame */}
      <div
        className="relative bg-gray-900 rounded-[44px] shadow-2xl"
        style={{ width: 395, padding: '10px' }}
      >
        {/* Notch / dynamic island (decorative) */}
        <div className="absolute top-[10px] left-1/2 -translate-x-1/2 w-28 h-7 bg-gray-900 rounded-b-2xl z-10" />

        {/* Screen area */}
        <div
          className="bg-b-bg rounded-[36px] overflow-hidden flex flex-col"
          style={{ width: 375, height: 812 }}
        >
          {/* Mock status bar */}
          <div className="shrink-0 flex items-center justify-between px-6 pt-3 pb-1 bg-b-bg">
            <span className="text-xs font-semibold text-gray-600">9:41</span>
            <div className="flex items-center gap-1">
              {/* Signal bars */}
              <div className="flex items-end gap-0.5 h-3">
                <div className="w-1 h-1 bg-gray-600 rounded-sm" />
                <div className="w-1 h-1.5 bg-gray-600 rounded-sm" />
                <div className="w-1 h-2 bg-gray-600 rounded-sm" />
                <div className="w-1 h-3 bg-gray-600 rounded-sm" />
              </div>
              {/* WiFi */}
              <svg width="14" height="11" viewBox="0 0 14 11" fill="none" className="text-gray-600">
                <path d="M7 8.5a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm-3.5-2a5 5 0 0 1 7 0l-.71.71a4 4 0 0 0-5.58 0L3.5 6.5zm-2.12-2.12a8 8 0 0 1 11.24 0l-.71.71a7 7 0 0 0-9.82 0L1.38 4.38z" fill="currentColor" />
              </svg>
              {/* Battery */}
              <div className="flex items-center gap-0.5">
                <div className="w-5 h-2.5 border border-gray-600 rounded-sm relative">
                  <div className="absolute inset-0.5 bg-gray-600 rounded-sm w-3/4" />
                </div>
                <div className="w-0.5 h-1.5 bg-gray-600 rounded-r-sm" />
              </div>
            </div>
          </div>

          {/* Screen content — rendered by BorrowerLayout */}
          <div className="flex-1 overflow-hidden flex flex-col">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
