import React from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { DndItem, DndList, DndMainText, DndSubText } from "./DragDropList.styles";

const reorderItems = (items, sourceIndex, destinationIndex) => {
  const updated = [...items];
  const [moved] = updated.splice(sourceIndex, 1);
  updated.splice(destinationIndex, 0, moved);

  return updated.map((item, index) => ({
    ...item,
    order: index + 1,
  }));
};

const DragDropList = ({ items = [], onChange }) => {
  const handleDragEnd = (result) => {
    const { source, destination } = result;

    if (!destination || source.index === destination.index) {
      return;
    }

    const reordered = reorderItems(items, source.index, destination.index);
    onChange?.(reordered);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="drag-drop-list-ul" direction="vertical">
        {(dropProvided) => (
          <DndList ref={dropProvided.innerRef} {...dropProvided.droppableProps}>
            {items.map((item, index) => (
              <Draggable key={String(item.id)} draggableId={String(item.id)} index={index}>
                {(dragProvided) => (
                  <DndItem
                    ref={dragProvided.innerRef}
                    {...dragProvided.draggableProps}
                    {...dragProvided.dragHandleProps}
                    >
                    <DndMainText>
                      {item.order}. {item.name}
                    </DndMainText>
                    <DndSubText>{item.type}</DndSubText>
                  </DndItem>
                )}
              </Draggable>
            ))}
            {dropProvided.placeholder}
          </DndList>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default DragDropList;