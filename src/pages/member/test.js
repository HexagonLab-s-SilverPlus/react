import React, { useEffect, useState } from 'react';
import { apiSpringBoot } from '../../utils/axios';
import { useParams } from 'react-router-dom';

const Test = () => {
  const { UUID } = useParams();
  const [testData, setTestData] = useState();

  useEffect(() => {
    const TestCheck = async () => {
      console.log('전달할 UUID 값 : ', UUID);
      const response = await apiSpringBoot.get(`/member/approvalCount/${UUID}`);
      console.log(response.data);
      setTestData(response.data);
    };
    TestCheck();
  }, [UUID]);

  return (
    <>
      <div>테스트용</div>
      <div>결과 : {testData}</div>
    </>
  );
};

export default Test;
