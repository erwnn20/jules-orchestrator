import { ApiTestRoute } from "@components/test/ApiTestRoute";
import { TestsModule } from "@components/test/TestsModule";
import { Pagination } from "@jules/jules.interfaces";
import {
  ApprovePlanRequest,
  CreateSessionRequest,
  type SendMessageRequest
} from "@jules/sessions/session.interfaces";
import { AutomationMode } from "@jules/sessions/session.types";
import { JulesService } from "@services/jules.service";
import { useState } from 'react';


export function SessionTests({ addLog }: { addLog: (msg: string) => void }) {
  const [pagination, setPagination] = useState<Pagination | undefined>(undefined);
  const [sessionId, setSessionId] = useState('');
  const [createData, setCreateData] = useState<CreateSessionRequest>({
    prompt: '',
    sourceContext: {
      source: '',
      githubRepoContext: { startingBranch: 'main' }
    }
  });
  const [deleteId, setDeleteId] = useState('');
  const [messageData, setMessageData] = useState<{ id: string, data: SendMessageRequest }>({
    id: '', data: { prompt: '' }
  });
  const [planData, setPlanData] = useState<{ id: string; data?: ApprovePlanRequest }>({ id: '' });

  const inputStyle = {
    padding: '8px 12px',
    fontSize: '13px',
    border: '1px solid #d1d5da',
    borderRadius: '6px',
    outline: 'none',
    fontFamily: 'SFMono-Regular, Consolas, monospace'
  };

  const labelStyle = { fontSize: '12px', color: '#586069', fontWeight: 500, marginTop: '4px' };

  return (
    <TestsModule title='Sessions API'>
      <ApiTestRoute name="getSessions"
                    onTest={() => JulesService.getSessions(pagination)}
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

      <ApiTestRoute name="getSession"
                    onTest={() => JulesService.getSession(sessionId)}
                    addLog={addLog}>
        <label style={labelStyle}>Session ID</label>
        <input style={inputStyle} value={sessionId}
               placeholder="Session ID..."
               onChange={(e) => setSessionId(e.target.value)}/>
      </ApiTestRoute>

      <ApiTestRoute name="createSession" /*TODO !*/
                    onTest={() => {
                      console.log('createData', createData)
                      return JulesService.createSession(createData)
                    }}
                    addLog={addLog}>
        <label style={labelStyle}>Titre</label>
        <input style={inputStyle} value={createData.title}
               onChange={(e) => setCreateData({ ...createData, title: e.target.value })}
               placeholder="Creation du projet..."/>
        <label style={labelStyle}>Prompt</label>
        <textarea style={{ ...inputStyle, height: '100px' }} value={createData.prompt}
                  onChange={(e) => setCreateData({ ...createData, prompt: e.target.value })}
                  placeholder="Creer un projet..."/>
        <label style={labelStyle}>Source ID</label>
        <input style={inputStyle} value={createData.sourceContext.source}
               onChange={(e) => setCreateData({
                 ...createData,
                 sourceContext: {
                   source: e.target.value,
                   githubRepoContext: createData.sourceContext.githubRepoContext
                 }
               })}
               placeholder="github/jules-ai/jules-ui..."/>
        <label style={labelStyle}>Approve Plan</label>
        <input style={inputStyle} type='checkbox' checked={!!createData.requirePlanApproval}
               onChange={(e) => setCreateData({
                 ...createData, requirePlanApproval: !e.target.checked
               })}/>
        <label style={labelStyle}>Auto PR</label>
        <input style={inputStyle} type='checkbox'
               checked={createData.automationMode === AutomationMode.AUTO_CREATE_PR}
               onChange={(e) => setCreateData({
                 ...createData,
                 automationMode: e.target.checked
                   ? AutomationMode.AUTO_CREATE_PR
                   : AutomationMode.AUTOMATION_MODE_UNSPECIFIED
               })}/>
      </ApiTestRoute>

      <ApiTestRoute name="deleteSession"
                    onTest={() => JulesService.deleteSession(deleteId)}
                    addLog={addLog}>
        <label style={labelStyle}>Session ID</label>
        <input style={inputStyle} value={deleteId}
               placeholder="Session ID..."
               onChange={(e) => setDeleteId(e.target.value)}/>
      </ApiTestRoute>

      <ApiTestRoute name="sendMessageSession"
                    onTest={() => JulesService.sendMessageSession(messageData)}
                    addLog={addLog}>
        <label style={labelStyle}>Session ID</label>
        <input style={inputStyle} value={messageData.id}
               onChange={(e) => setMessageData({ ...messageData, id: e.target.value })}
               placeholder="Session ID..."/>
        <label style={labelStyle}>Message</label>
        <input style={inputStyle} value={messageData.data.prompt}
               onChange={(e) => setMessageData({
                 ...messageData,
                 data: { prompt: e.target.value }
               })}
               placeholder="Hello Jules..."/>
      </ApiTestRoute>

      <ApiTestRoute name="approvePlanSession"
                    onTest={() => JulesService.approvePlanSession(planData)}
                    addLog={addLog}>
        <label style={labelStyle}>Session ID</label>
        <input style={inputStyle} value={planData.id}
               onChange={(e) => setPlanData({ ...planData, id: e.target.value })}
               placeholder="Session ID..."/>
      </ApiTestRoute>
    </TestsModule>
  );
}
