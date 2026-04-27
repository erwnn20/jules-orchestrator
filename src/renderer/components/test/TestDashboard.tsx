import { SessionTests } from "@components/test/SessionTests";
import { SourceTests } from "@components/test/SourceTests";
import { useState } from 'react';


export function TestDashboard() {
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (msg: string) => {
    setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev]);
  };

  return (
    <div style={{
      padding: '24px',
      height: '100vh',
      boxSizing: 'border-box',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      color: '#333',
      backgroundColor: '#f5f7f9'
    }}>
      <header
        style={{ marginBottom: '24px', borderBottom: '1px solid #e1e4e8', paddingBottom: '12px' }}>
        <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 600 }}>API Testers</h1>
      </header>

      <div style={{ display: 'flex', gap: '32px', height: 'calc(100% - 80px)' }}>
        <div style={{
          flex: '0 0 350px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px'
        }}>
          <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 600 }}>Jules API</h2>
          <SourceTests addLog={addLog}/>
          <SessionTests addLog={addLog}/>
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '8px'
          }}>
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>Execution Logs</h2>
            <button
              onClick={() => setLogs([])}
              style={{
                padding: '4px 12px',
                fontSize: '12px',
                backgroundColor: '#fff',
                border: '1px solid #d1d5da',
                borderRadius: '6px',
                cursor: 'pointer',
                color: '#d73a49'
              }}
            >
              Clear Logs
            </button>
          </div>
          <div style={{
            flex: 1,
            border: '1px solid #e1e4e8',
            borderRadius: '8px',
            padding: '16px',
            backgroundColor: '#fff',
            overflow: 'auto',
            boxShadow: 'inset 0 1px 2px rgba(27,31,35,.075)'
          }}>
            {logs.length === 0 ? (
              <div style={{
                color: '#6a737d',
                fontStyle: 'italic',
                textAlign: 'center',
                marginTop: '20px'
              }}>
                No activity logged yet.
              </div>
            ) : (
              <pre style={{
                margin: 0,
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                fontFamily: 'SFMono-Regular, Consolas, "Liberation Mono", Menlo, monospace',
                fontSize: '13px',
                lineHeight: '1.6'
              }}>
                {logs.join('\n\n')}
              </pre>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
