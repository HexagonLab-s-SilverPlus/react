import React, {useState} from 'react';
import EMG from '../../components/emg/EMG'

function EMGList() {
    const [onCamera, setOnCamera] = useState(false);
    const handleOnCamera = () => {
        if(onCamera){
            setOnCamera(false)
        } else {
            setOnCamera(true)
        }
    }

    if (!setOnCamera) {
        // 데이터가 없을 경우 로딩 상태나 다른 처리를 할 수 있도록 추가
        return <div>Loading...</div>;
    };
    

    return(
        <div>
            {onCamera ? <div> 현재 True상태</div>: <div> 현재 false</div> }
            <EMG onCamera = {onCamera} sessId="b3f3c1b9-e34f-45e9-a8c6-8d1e2b3d2ab4" />
            <button onClick={handleOnCamera} style={{height: "100px", width:"100px"}}/>
        </div>
    );
};

export default EMGList;
