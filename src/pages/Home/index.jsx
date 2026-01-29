import Button from "@/components/Button/Button";
import React from "react";
import { Link } from "react-router-dom";

const index = () => {
  return (
    <>
      <div>Home Page</div>
      <Button>확인</Button>
      <Button radius="half">구매하기</Button>
      <Button height={52} radius="half" fullWidth={true}>
        결제하기
      </Button>
      <Button radius="pill">칩 버튼</Button>
      <Button radius={6}>예외 버튼</Button>
    </>
  );
};

export default index;
