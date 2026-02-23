import React, { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import styled from "styled-components";

import Button from "@/components/Button/Button";
import CardSection from "@/components/Layout/CardSection";
import {
  createSearchParamsFromForm,
  parseSearchParamsToForm,
  SEARCH_PARAM_TYPE,
} from "@/utils/searchParams";
import { theme } from "@/styles/theme";

const initialForm = {
  keyword: "",
  status: "",
  tags: [],
};

const searchFields = [
  "keyword",
  { key: "status", type: SEARCH_PARAM_TYPE.BOOLEAN },
  { key: "tags", type: SEARCH_PARAM_TYPE.ARRAY },
];

function SearchTest() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearchForm = useMemo(
    () =>
      parseSearchParamsToForm({
        searchParams,
        initialForm,
        fields: searchFields,
      }),
    [searchParams],
  );

  const [form, setForm] = useState(initialSearchForm);

  const onChangeKeyword = (e) => {
    setForm((prev) => ({
      ...prev,
      keyword: e.target.value,
    }));
  };

  const onChangeStatus = (value) => {
    setForm((prev) => ({
      ...prev,
      status: value,
    }));
  };

  const onToggleTag = (tag) => {
    setForm((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag) ? prev.tags.filter((item) => item !== tag) : [...prev.tags, tag],
    }));
  };

  const handleSearch = () => {
    setSearchParams(
      createSearchParamsFromForm({
        form,
        fields: searchFields,
      }),
    );
  };

  const handleReset = () => {
    setForm(initialForm);
    setSearchParams(new URLSearchParams());
  };

  return (
    <Wrap className="flex-box col">
      <CardSection title="검색 테스트 페이지">
        <FormGrid>
          <Field>
            <Label>키워드</Label>
            <input
              type="text"
              name="keyword"
              value={form.keyword}
              onChange={onChangeKeyword}
              placeholder="검색어를 입력하세요"
            />
          </Field>

          <Field>
            <Label>상태</Label>
            <RadioRow className="flex-box ac">
              <RadioItem className="flex-box ac">
                <input
                  type="radio"
                  checked={form.status === ""}
                  onChange={() => onChangeStatus("")}
                />
                전체
              </RadioItem>
              <RadioItem className="flex-box ac">
                <input
                  type="radio"
                  checked={form.status === true}
                  onChange={() => onChangeStatus(true)}
                />
                활성
              </RadioItem>
              <RadioItem className="flex-box ac">
                <input
                  type="radio"
                  checked={form.status === false}
                  onChange={() => onChangeStatus(false)}
                />
                비활성
              </RadioItem>
            </RadioRow>
          </Field>

          <Field>
            <Label>태그</Label>
            <CheckRow className="flex-box ac">
              {["new", "sale", "best"].map((tag) => (
                <CheckItem className="flex-box ac" key={tag}>
                  <input
                    type="checkbox"
                    checked={form.tags.includes(tag)}
                    onChange={() => onToggleTag(tag)}
                  />
                  {tag}
                </CheckItem>
              ))}
            </CheckRow>
          </Field>

          <Actions className="flex-box">
            <Button outlined color={theme.colors.palette.gray800} onClick={handleReset}>
              초기화
            </Button>
            <Button onClick={handleSearch}>검색</Button>
          </Actions>
        </FormGrid>
      </CardSection>
    </Wrap>
  );
}

export default SearchTest;

const Wrap = styled.div`
  gap: 20px;
`;

const FormGrid = styled.div`
  display: grid;
  gap: 16px;
`;

const Field = styled.div`
  display: grid;
  gap: 8px;
`;

const Label = styled.label`
  color: ${theme.colors.gray.black};
  font-weight: 600;
`;

const RadioRow = styled.div`
  gap: 14px;
`;

const RadioItem = styled.label`
  gap: 6px;
`;

const CheckRow = styled.div`
  gap: 14px;
`;

const CheckItem = styled.label`
  gap: 6px;
`;

const Actions = styled.div`
  gap: 10px;
`;