import React from "react";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { DndChildren, DndItem, DndItemMain, DndList, DndMainText, DndSubText } from "./DragDropList.styles";

/**
 * 드래그 타입 정의
 * 부모용 / 자식용을 구분하기 위해 사용
 */
const PARENT_TYPE = "PARENT";
const CHILD_TYPE = "CHILD";

/**
 * 부모 Droppable ID
 * 부모 리스트 전체를 감싸는 영역
 */
const PARENT_DROPPABLE_ID = "parents";

/**
 * 각 부모마다 자식 Droppable ID를 생성하는 함수
 * 예: children:1, children:2 ...
 */
const createChildDroppableId = (parentId) => `children:${String(parentId)}`;

/**
 * 같은 리스트 내부에서 순서를 변경하는 함수
 * (부모 reorder / 같은 부모 안의 자식 reorder)
 */
const reorder = (list, startIndex, endIndex) => {
  const copied = [...list]; // 원본 보호 (불변성 유지)
  const [moved] = copied.splice(startIndex, 1); // 이동할 항목 제거
  copied.splice(endIndex, 0, moved); // 새로운 위치에 삽입
  return copied;
};

/**
 * 부모와 자식의 order 값을 다시 정렬하는 함수
 * 드래그 후 항상 1부터 순차적으로 재정렬
 */
const normalizeOrders = (parents) => {
  return parents.map((parent, parentIndex) => ({
    ...parent,
    order: parentIndex + 1, // 부모 order 재정렬
    children: (Array.isArray(parent.children) ? parent.children : []).map((child, childIndex) => ({
      ...child,
      order: childIndex + 1, // 자식 order 재정렬
    })),
  }));
};

/**
 * Droppable ID에서 부모 ID를 추출하는 함수
 * children:3 → 3
 */
const getParentIdFromDroppable = (droppableId) => {
  if (!droppableId?.startsWith("children:")) {
    return null;
  }

  return droppableId.replace("children:", "");
};

/**
 * 자식을 다른 부모로 이동시키는 함수
 * - 같은 부모 안에서 이동
 * - 다른 부모로 이동
 * 모두 처리 가능
 */
const moveChild = ({ parents, sourceParentId, destinationParentId, sourceIndex, destinationIndex }) => {
  // 출발 부모 index 찾기
  const sourceParentIndex = parents.findIndex((parent) => String(parent.id) === String(sourceParentId));

  // 도착 부모 index 찾기
  const destinationParentIndex = parents.findIndex((parent) => String(parent.id) === String(destinationParentId));

  if (sourceParentIndex < 0 || destinationParentIndex < 0) {
    return parents;
  }

  // 불변성 유지를 위해 깊은 복사
  const nextParents = parents.map((parent) => ({
    ...parent,
    children: Array.isArray(parent.children) ? [...parent.children] : [],
  }));

  const sourceChildren = nextParents[sourceParentIndex].children;
  const destinationChildren = nextParents[destinationParentIndex].children;

  // 출발 위치에서 자식 제거
  const [movedChild] = sourceChildren.splice(sourceIndex, 1);

  if (!movedChild) {
    return parents;
  }

  // 도착 위치에 삽입
  destinationChildren.splice(destinationIndex, 0, movedChild);

  // order 재정렬 후 반환
  return normalizeOrders(nextParents);
};

const DragDropList = ({ items = [], onChange }) => {
  /**
   * 드래그가 끝났을 때 실행되는 함수
   */
  const handleDragEnd = (result) => {
    const { source, destination, type } = result;

    // 드롭 위치가 없으면 종료
    if (!destination) {
      return;
    }

    // 같은 위치로 드래그한 경우 종료
    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return;
    }

    /**
     * 1️⃣ 부모 이동 처리
     */
    if (type === PARENT_TYPE) {
      // 부모 영역 밖으로 이동은 허용하지 않음
      if (source.droppableId !== PARENT_DROPPABLE_ID || destination.droppableId !== PARENT_DROPPABLE_ID) {
        return;
      }

      const reorderedParents = reorder(items, source.index, destination.index);

      onChange?.(normalizeOrders(reorderedParents));
      return;
    }

    /**
     * 2️⃣ 자식 이동 처리
     */
    if (type !== CHILD_TYPE) {
      return;
    }

    const sourceParentId = getParentIdFromDroppable(source.droppableId);

    const destinationParentId = getParentIdFromDroppable(destination.droppableId);

    if (!sourceParentId || !destinationParentId) {
      return;
    }

    const movedChildren = moveChild({
      parents: items,
      sourceParentId,
      destinationParentId,
      sourceIndex: source.index,
      destinationIndex: destination.index,
    });

    // 부모 컴포넌트에 변경사항 전달
    onChange?.(movedChildren);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      {/* 부모 Droppable 영역 */}
      <Droppable droppableId={PARENT_DROPPABLE_ID} type={PARENT_TYPE}>
        {(parentDropProvided) => (
          <DndList ref={parentDropProvided.innerRef} {...parentDropProvided.droppableProps}>
            {items.map((parent, parentIndex) => {
              const children = Array.isArray(parent.children) ? parent.children : [];

              return (
                <Draggable
                  key={`parent-${String(parent.id)}`}
                  draggableId={`parent-${String(parent.id)}`}
                  index={parentIndex}>
                  {(parentDragProvided) => (
                    <DndItem ref={parentDragProvided.innerRef} {...parentDragProvided.draggableProps}>
                      {/* 부모 드래그 핸들 영역 */}
                      <DndItemMain {...parentDragProvided.dragHandleProps}>
                        <DndMainText>
                          {parent.order}. {parent.name}
                        </DndMainText>
                        <DndSubText>{parent.type}</DndSubText>
                      </DndItemMain>

                      {/* 자식 영역 */}
                      <DndChildren>
                        <Droppable droppableId={createChildDroppableId(parent.id)} type={CHILD_TYPE}>
                          {(childDropProvided) => (
                            <DndList ref={childDropProvided.innerRef} {...childDropProvided.droppableProps}>
                              {children.map((child, childIndex) => (
                                <Draggable
                                  key={`child-${String(child.id)}`}
                                  draggableId={`child-${String(child.id)}`}
                                  index={childIndex}>
                                  {(childDragProvided) => (
                                    <DndItem ref={childDragProvided.innerRef} {...childDragProvided.draggableProps}>
                                      <DndItemMain {...childDragProvided.dragHandleProps}>
                                        <DndMainText>
                                          {parent.order}-{child.order}. {child.name}
                                        </DndMainText>
                                        <DndSubText>{child.type}</DndSubText>
                                      </DndItemMain>
                                    </DndItem>
                                  )}
                                </Draggable>
                              ))}

                              {/* 드래그 중 공간 확보용 placeholder */}
                              {childDropProvided.placeholder}
                            </DndList>
                          )}
                        </Droppable>
                      </DndChildren>
                    </DndItem>
                  )}
                </Draggable>
              );
            })}

            {/* 부모 드래그 placeholder */}
            {parentDropProvided.placeholder}
          </DndList>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default DragDropList;
