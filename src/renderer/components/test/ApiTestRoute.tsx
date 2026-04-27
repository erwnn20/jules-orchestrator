import { ReactNode, useState } from 'react';

interface ApiTestRouteProps {
  name: string;
  onTest: () => Promise<any>;
  addLog: (msg: string) => void;
  children?: ReactNode;
}

export function ApiTestRoute({ name, onTest, addLog, children }: ApiTestRouteProps) {
  const [loading, setLoading] = useState(false);

  const handleRun = async () => {
    setLoading(true);
    try {
      addLog(`▶ Calling ${name}...`);
      const res = await onTest();
      addLog(`✅ [SUCCESS] ${name}:\n${JSON.stringify(res, null, 2)}`);
    } catch (err: any) {
      addLog(`❌ [ERROR] ${name}:\n${err.message || String(err)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      marginBottom: '16px',
      padding: '16px',
      backgroundColor: '#fff',
      border: '1px solid #e1e4e8',
      borderRadius: '8px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '15px', fontWeight: 600, color: '#24292e' }}>{name}</span>
        <button
          onClick={handleRun}
          disabled={loading}
          style={{
            padding: '6px 16px',
            fontSize: '13px',
            fontWeight: 500,
            backgroundColor: loading ? '#94d3a2' : '#2ea44f',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'background-color 0.2s'
          }}
          onMouseOver={(e) => !loading && (e.currentTarget.style.backgroundColor = '#2c974b')}
          onMouseOut={(e) => !loading && (e.currentTarget.style.backgroundColor = '#2ea44f')}
        >
          {loading ? 'Running...' : 'Run Test'}
        </button>
      </div>
      {children && (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          padding: '12px',
          backgroundColor: '#f6f8fa',
          borderRadius: '6px',
          border: '1px solid #ebf0f4'
        }}>
          {children}
        </div>
      )}
    </div>
  );
}
