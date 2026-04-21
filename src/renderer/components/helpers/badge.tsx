import {ReactNode} from "react";


export default function Badge({children, color = '#1f2937'}: { children: ReactNode, color?: string }) {
  return (
    <span style={{
      fontSize: 10, fontFamily: 'monospace', padding: '2px 6px',
      background: color, border: '1px solid #374151',
      borderRadius: 3, color: '#9ca3af', whiteSpace: 'nowrap',
    }}>
      {children}
    </span>
  )
}