// 채팅 전송 후 화면 페이지
import React from 'react';
import { useLocation } from 'react-router-dom';
import './ChatPage.css';

function ChatPage() {
    const location = useLocation();
    const userMessage = location.state?.userMessage || ''; // 이전 페이지에서 받은 사용자 메시지
    const aiResponse = `어깨 통증이 계속되면 몸이 더 힘들어지실 수 있으니, 
가능한 한 편하게 쉬시는 것도 중요해요. 
따뜻한 찜질을 하거나 어깨를 살짝 풀어주는 스트레칭도 도움이 될 수 있답니다. 
혹시라도 증상이 심해지면 병원에 가보시는 게 좋을 것 같아요. 
제가 더 필요한 정보나 방법이 있다면 언제든 알려드릴게요.`; // 고정된 AI 답변


    return (
        <div className="chat-container">
            <div className="chat-bubble user-message">
                <p>{userMessage}</p>
            </div>
            <div className="chat-bubble ai-response">
                <p>{aiResponse}</p>
            </div>
        </div>
    );
}

export default ChatPage;