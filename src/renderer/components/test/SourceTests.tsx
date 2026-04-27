import { ApiTestRoute } from "@components/test/ApiTestRoute";
import { TestsModule } from "@components/test/TestsModule";
import { Pagination } from "@jules/jules.interfaces";
import { JulesService } from "@services/jules.service";
import React, { useState } from 'react';

export function SourceTests({ addLog }: { addLog: (msg: string) => void }) {
  const [pagination, setPagination] = useState<Pagination | undefined>(undefined);
  const [sourceId, setSourceId] = useState('');

  const inputStyle = {
    padding: '8px 12px',
    fontSize: '13px',
    border: '1px solid #d1d5da',
    borderRadius: '6px',
    outline: 'none',
    fontFamily: 'SFMono-Regular, Consolas, monospace'
  };

  return (
    <TestsModule title='Sources API'>
      <ApiTestRoute name="getSources"
                    onTest={() => JulesService.getSources(pagination)}
                    addLog={addLog}>
        <label style={{ fontSize: '12px', color: '#586069', fontWeight: 500 }}>Page Size</label>
        <input
          style={inputStyle}
          type='number'
          value={pagination?.pageSize}
          placeholder="25"
          onChange={(e) => setPagination({
            ...pagination, pageSize: Number(e.target.value)
          })}
        />
        <label style={{ fontSize: '12px', color: '#586069', fontWeight: 500 }}>Page Token</label>
        <input
          style={inputStyle}
          value={pagination?.pageToken}
          placeholder="JkjnjkdnjfdwJN..."
          onChange={(e) => setPagination({
            ...pagination, pageToken: e.target.value,
          })}
        />
      </ApiTestRoute>

      <ApiTestRoute name="getSource"
                    onTest={async () => JulesService.getSource(sourceId)}
                    addLog={addLog}>
        <label style={{ fontSize: '12px', color: '#586069', fontWeight: 500 }}>Source ID</label>
        <input
          style={inputStyle}
          value={sourceId}
          placeholder="e.g. src_123..."
          onChange={(e) => setSourceId(e.target.value)}
        />
      </ApiTestRoute>
    </TestsModule>
  );
}
