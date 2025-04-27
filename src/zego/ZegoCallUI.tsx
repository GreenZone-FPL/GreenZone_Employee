// components/ZegoCallUI.tsx
import React, {useEffect} from 'react';
import {
  ZegoCallInvitationDialog,
  ZegoUIKitPrebuiltCallFloatingMinimizedView,
} from '@zegocloud/zego-uikit-prebuilt-call-rn';

import ZegoUIKitPrebuiltCallService from '@zegocloud/zego-uikit-prebuilt-call-rn'
import * as ZIM from 'zego-zim-react-native';
import * as ZPNs from 'zego-zpns-react-native';


export default function ZegoCallUI() {
  useEffect(() => {
    // Gọi khởi tạo Zego SDK ở đây, chỉ khi render ZegoCallUI (ví dụ sau đăng nhập)
    ZegoUIKitPrebuiltCallService.useSystemCallingUI([ZIM, ZPNs]);
  }, []);

  return (
    <>
      <ZegoCallInvitationDialog />
      {/* <ZegoUIKitPrebuiltCallFloatingMinimizedView /> */}
    </>
  )
}
