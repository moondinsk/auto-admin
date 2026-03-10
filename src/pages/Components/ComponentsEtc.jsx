import React, { useState } from "react";
import { observer } from "mobx-react-lite";
import { IoIosArrowForward } from "react-icons/io";

import Button from "@/components/Button/Button";
import DragDropList from "@/components/DragDropList/DragDropList";
import CardSection from "@/components/Layout/CardSection";
import AlertModalContent from "@/components/Modal/AlertModalContent";
import { getProductsApi } from "@/api";
import { MODAL_PAYLOAD } from "@/constants/modal";
import { theme } from "@/styles/theme";
import { useStore } from "@/store";
import { Buttons, StyledComponents } from "./Components.styles";

const ComponentsEtc = observer(() => {
  const { modalStore } = useStore();

  const [dndRows, setDndRows] = useState([
    {
      id: "1",
      order: 1,
      name: "메뉴 1",
      type: "부모",
      children: [
        { id: "1-1", order: 1, name: "메뉴 1-1", type: "자식" },
        { id: "1-2", order: 2, name: "메뉴 1-2", type: "자식" },
      ],
    },
    {
      id: "2",
      order: 2,
      name: "메뉴 2",
      type: "부모",
      children: [
        { id: "2-1", order: 1, name: "메뉴 2-1", type: "자식" },
        { id: "2-2", order: 2, name: "메뉴 2-2", type: "자식" },
        { id: "2-3", order: 3, name: "메뉴 2-3", type: "자식" },
      ],
    },
  ]);

  const handleGetProductsExample = async () => {
    try {
      const data = await getProductsApi({
        page: 1,
        size: 10,
      });

      const products = Array.isArray(data) ? data : (data?.items ?? data?.list ?? []);

      modalStore.openByPayload(
        MODAL_PAYLOAD.ALERT_MODAL({
          component: AlertModalContent,
          message: `상품 조회 성공 (${products.length}건) - 콘솔에서 상세 결과를 확인하세요.`,
        }),
      );
    } catch (error) {
      modalStore.openByPayload(
        MODAL_PAYLOAD.ALERT_MODAL({
          component: AlertModalContent,
          message: error?.response?.data?.message || "상품 조회에 실패했습니다.",
        }),
      );
    }
  };

  return (
    <StyledComponents className="flex-box col">
      <CardSection title="Button 컴포넌트 예시">
        <Buttons className="flex-box">
          <Button bgColor={theme.colors.gray.black}>Filled</Button>

          <Button outlined color={theme.colors.primary.main} radius="half">
            Outlined
            <IoIosArrowForward size={14} />
          </Button>

          <Button disabled>Filled (Disabled)</Button>

          <Button outlined disabled radius={0}>
            Outlined (Disabled)
          </Button>

          <Button size="sm">수정</Button>

          <Button size="xsm" radius={3}>
            삭제
          </Button>

          <Button fullWidth>Full Width</Button>
        </Buttons>
      </CardSection>

      <CardSection title="드래그 앤 드롭이 가능한 리스트 예시">
        <DragDropList items={dndRows} onChange={setDndRows} />
      </CardSection>

      <CardSection title="Axios API 호출 예시 - getProductsApi">
        <div className="flex-box col" style={{ gap: 12 }}>
          <Button outlined onClick={handleGetProductsExample}>
            상품 목록 조회
          </Button>
          <div>조회 결과는 콘솔과 알림 모달에서 확인할 수 있습니다.</div>
        </div>
      </CardSection>
    </StyledComponents>
  );
});

export default ComponentsEtc;
