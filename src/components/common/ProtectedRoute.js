import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';
// AuthContext를 import 하여 인증 상태에 접근
import { AuthContext } from '../../AuthProvider';

// ProtectedRoute 컴포넌트 정의
const ProtectedRoute = ({ element, roles = [], }) => {
    // AuthContext에서 auth 상태를 가져옴
    const { accessToken, role } = useContext(AuthContext);

    // 인증되지 않은 사용자인 경우 (accessToken이 없을 때)
    if (!accessToken) {
        return <Navigate to="/memRouter/loginmember" replace />;
    }

    // 역할 기반 접근 제어
    if (roles.length > 0 && !roles.includes(role)) {
        return <Navigate to="/" />;
    }

    // 인증된 사용자인 경우, 자식 컴포넌트를 렌더링
    return element;
};

// PropTypes 설정
// ESLint가 PropTypes 검사를 설정하지 않아 경고가 뜨길래 아래 코드로 선언해서 해결함
ProtectedRoute.propTypes = {
    element: PropTypes.node.isRequired, // children은 React 노드로 설정하며 필수 값이다.
    roles: PropTypes.arrayOf(PropTypes.string), // roles는 문자열 배열이며, 선택적(Optional), 기본값은 빈 배열이다.
};

// ProtectedRoute 컴포넌트를 export 하여, 다른 컴포넌트에서 사용할 수 있게 함
export default ProtectedRoute;
