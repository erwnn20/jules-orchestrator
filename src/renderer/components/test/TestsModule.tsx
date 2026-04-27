import { ReactNode } from 'react';

export function TestsModule({ children, title }: {
  children: ReactNode
  title: string
}) {
  return (
    <div>
      <h3 style={{
        fontSize: '16px',
        fontWeight: 600,
        color: '#586069',
        marginBottom: '12px',
        marginTop: '0'
      }}>{title}</h3>

      {children}

    </div>
  );
}
