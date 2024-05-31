import React, { useState } from "react";
import renderFilterInputs from "../components/filter";
import { RiDeleteBin5Line } from "react-icons/ri";

const Group = ({
  group,
  index,
  handleChange,
  isGroupActive,
  attributes,
  fetchAttributeValues,
  attributesValues,
  events,
  fetchAndSetEvents,
  fetchEventValues,
  fetchEventPropertyValues,
  eventsPropertyValues,
  eventsValues,
  attributeName,
}) => {
  const [activeChildIndex, setActiveChildIndex] = useState(null);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [overIndex, setOverIndex] = useState(null);

  const handleClick = (e, childIndex) => {
    setActiveChildIndex(childIndex);
  };

  const handleGroupChange = (e) => {
    const newGroup = { ...group, [e.target.name]: e.target.value };
    handleChange(newGroup, index);
  };

  const handleChildChange = (child, childIndex) => {
    const newGroup = {
      ...group,
      children: [
        ...group.children.slice(0, childIndex),
        child,
        ...group.children.slice(childIndex + 1),
      ],
    };
    handleChange(newGroup, index);
  };

  const handleChildDelete = (e, childIndex) => {
    const updatedChildren = [...group.children];
    updatedChildren.splice(childIndex, 1);
    const newGroup = { ...group, children: updatedChildren };
    handleChange(newGroup, index);
  };

  const handleAddNewChild = (type) => {
    const newChild = {
      type: type,
      condition: "and",
      children: [],
      filterType: "Attribute",
      attributeName: "",
      compareOption: "",
      value: "",
      eventName: "",
      eventPerformed: "",
      eventDetailsAvailable: false,
      eventCount: "1",
      eventCutoffDuration: "within the last",
      eventDays: "1",
      eventDataChildFilters: [],
    };

    const newGroup = { ...group, children: [...group.children, newChild] };
    handleChange(newGroup, index);
  };

  const handleDragStart = (e, childIndex) => {
    setDraggedIndex(childIndex);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e, childIndex) => {
    e.preventDefault();
    setOverIndex(childIndex);
    setActiveChildIndex(childIndex);
  };

  const handleDrop = () => {
    if (
      draggedIndex !== null &&
      overIndex !== null &&
      draggedIndex !== overIndex
    ) {
      const updatedChildren = [...group.children];
      const [movedItem] = updatedChildren.splice(draggedIndex, 1);
      updatedChildren.splice(overIndex, 0, movedItem);

      const newGroup = { ...group, children: updatedChildren };
      handleChange(newGroup, index);
    }
    setDraggedIndex(null);
    setOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setOverIndex(null);
  };

  const renderFilterBars = () => {
    const ConditionOptions = [
      { value: "and", label: "All" },
      { value: "or", label: "At least one" },
    ];

    return (
      <div className="flex mt-2">
        <select
          id="condition"
          name="condition"
          value={group.condition}
          onChange={handleGroupChange}
          className="w-1/4 ml-4 px-3 py-2 border-2 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
        >
          {ConditionOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <p className="text-sm flex ml-2 py-2">
          of the following conditions match
        </p>
      </div>
    );
  };

  const renderChild = (child, childIndex) => {
    const isActive = activeChildIndex === childIndex && isGroupActive;
    const isDragged = childIndex === draggedIndex;
    const isOver = childIndex === overIndex;

    return (
      <div
        key={childIndex}
        className={`flex items-center gap-1 ml-5 ${
          isDragged ? "opacity-50" : ""
        } ${
          isOver && !isDragged ? "border-dashed border-2 border-gray-500" : ""
        }`}
        onClick={(e) => handleClick(e, childIndex)}
        draggable
        onDragStart={(e) => handleDragStart(e, childIndex)}
        onDragOver={(e) => handleDragOver(e, childIndex)}
        onDrop={handleDrop}
        onDragEnd={handleDragEnd}
      >
        {childIndex >= 1 && (
          <div className="relative -ml-2">
            <span className="absolute -mt-5 -ml-16 p-1 border text-sm font-medium bg-slate-50 border-gray-300 rounded-md focus:outline-none">
              {group.condition === "or" ? "Or" : "And"}
            </span>
          </div>
        )}
        {isActive && (
          <span
            className={`-ml-${index === 0 ? 4 : 4} border-2 cursor-move cursor`}
          >
            <svg
              className="w-[15px] h-[25px] bg-slate-300 border rounded-2xl"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 15 30"
            >
              <circle cx="3" cy="9" r="1.5" fill="black" />
              <circle cx="12" cy="9" r="1.5" fill="black" />

              <circle cx="3" cy="15" r="1.5" fill="black" />
              <circle cx="12" cy="15" r="1.5" fill="black" />

              <circle cx="3" cy="21" r="1.5" fill="black" />
              <circle cx="12" cy="21" r="1.5" fill="black" />
            </svg>
          </span>
        )}
        <div className="flex-grow">
          {child.type === "filter" ? (
            renderFilterInputs({
              attributes: attributes,
              attributeName: attributeName,
              attributesValues: attributesValues,
              fetchAttributeValues: fetchAttributeValues,
              events: events,
              fetchAndSetEvents: fetchAndSetEvents,
              eventsValues: eventsValues,
              fetchEventValues: fetchEventValues,
              fetchEventPropertyValues: fetchEventPropertyValues,
              eventsPropertyValues: eventsPropertyValues,
              filter: child,
              index: childIndex,
              handleChange: handleChildChange,
            })
          ) : (
            <Group
              group={child}
              attributes={attributes}
              attributeName={attributeName}
              attributesValues={attributesValues}
              fetchAttributeValues={fetchAttributeValues}
              events={events}
              fetchAndSetEvents={fetchAndSetEvents}
              eventsValues={eventsValues}
              fetchEventValues={fetchEventValues}
              fetchEventPropertyValues={fetchEventPropertyValues}
              eventsPropertyValues={eventsPropertyValues}
              index={childIndex}
              handleChange={handleChildChange}
              isGroupActive={isActive}
            />
          )}
        </div>
        <button
          type="button"
          onClick={(e) => handleChildDelete(e, childIndex)}
          className="px-2 py-1 mr-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-black hover:bg-gray-300 focus:outline-none"
        >
          <RiDeleteBin5Line />
        </button>
      </div>
    );
  };

  return (
    <form className={`w-full gap-4 justify-between -ml-${index >= 1 ? 7 : 0}`}>
      <div className="grid grid-cols-2 py-1">
        <div className="col-span-1">{renderFilterBars()}</div>
      </div>
      {group.children.map((child, childIndex) => (
        <div
          key={childIndex}
          className="border border-gray-200 rounded-md flex items-center gap-1 mt-1 mx-20"
        >
          <div className="flex-grow bg-slate-200 border rounded-md border-gray-300 -mr-12">
            {renderChild(child, childIndex)}
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={() => handleAddNewChild("filter")}
        className="py-2 ml-4 mr-2 px-4 mt-2 mb-1 border-2 border-gray-300 rounded-md shadow-sm text-sm font-medium text-black hover:bg-gray-300 focus:outline-none"
      >
        Add Condition
      </button>

      <button
        type="button"
        onClick={() => handleAddNewChild("group")}
        className="py-2 px-4 mt-2 mb-1 border-2 border-gray-300 rounded-md shadow-sm text-sm font-medium text-black hover:bg-gray-300 focus:outline-none"
      >
        Add Group
      </button>
    </form>
  );
};

export default Group;
