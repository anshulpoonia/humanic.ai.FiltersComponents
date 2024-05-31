import React from "react";
import { RiDeleteBin5Line } from "react-icons/ri";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";

const FilterInputs = ({
  filter,
  index,
  handleChange,
  attributes,
  events,
  eventsValues,
  fetchAndSetEvents,
  attributesValues,
  fetchEventPropertyValues,
  eventsPropertyValues,
  fetchAttributeValues,
  fetchEventValues,
}) => {
  const handleAttributeNameChange = (selectedOption) => {
    const newValue = selectedOption ? selectedOption.value : "";
    fetchAttributeValues(newValue);
    handleChange({ ...filter, attributeName: newValue }, index);
  };

  const renderAttributeNameOptions = () => {
    if (!Array.isArray(attributes)) {
      console.error("Attributes is not an array or is undefined");
      return [];
    }

    return attributes.map((attribute) => ({
      value: attribute,
      label: attribute,
    }));
  };

  const renderAttributeValues = () => {
    if (!filter.attributeName) {
      return [];
    }
    const values = attributesValues[filter.attributeName] || [];
    return values.map((value) => ({
      value: value,
      label: value,
    }));
  };

  const handleEventNameChange = (selectedOption) => {
    const newValue = selectedOption ? selectedOption.value : "";
    fetchEventValues(newValue);
    handleChange(
      {
        ...filter,
        eventName: newValue,
        eventDataChildFilters: [],
        value: "",
        eventCount: null,
        eventDays: null,
        eventDetailsAvailable: false,
      },
      index
    );
  };

  const renderEventNameOptions = () => {
    return events.map((eventName) => ({
      value: eventName,
      label: eventName,
    }));
  };

  const renderEventProperties = () => {
    if (!filter.eventName) {
      return [];
    }
    const eventProperties = eventsValues[filter.eventName] || [];
    return eventProperties.map((property) => ({
      value: property,
      label: property,
    }));
  };

  const renderEventPropertyValue = (eventProperty) => {
    const values = eventsPropertyValues[eventProperty] || [];
    return values.map((value) => ({
      value: value,
      label: value,
    }));
  };

  const handleButtonClick = () => {
    const newFilter = {
      ...filter,
      eventDetailsAvailable: !filter.eventDetailsAvailable,
    };
    handleChange(newFilter, index);
  };

  const handleEventPropertyNameChange = (selectedOption, childIndex) => {
    const newValue = selectedOption ? selectedOption.value : "";
    const updatedEventDataChildFilters = [...filter.eventDataChildFilters];
    updatedEventDataChildFilters[childIndex].eventproperty = newValue;

    fetchEventPropertyValues(filter.eventName, newValue)
      .then((eventPropertyValues) => {
        handleChange(
          {
            ...filter,
            eventDataChildFilters: updatedEventDataChildFilters,
            eventPropertyValues: {
              ...filter.eventPropertyValues,
              [newValue]: eventPropertyValues,
            },
          },
          index
        );
      })
      .catch((error) => {
        console.error("Error fetching event property values:", error);
      });
  };

  const handleEventDataFilterChange = (childIndex, key, value) => {
    const newEventDataChildFilters = [...filter.eventDataChildFilters];
    newEventDataChildFilters[childIndex][key] = value;
    handleChange(
      { ...filter, eventDataChildFilters: newEventDataChildFilters },
      index
    );
  };

  const handleDeleteEventDataFilter = (childIndex) => {
    const newEventDataChildFilters = filter.eventDataChildFilters.filter(
      (_, i) => i !== childIndex
    );
    handleChange(
      { ...filter, eventDataChildFilters: newEventDataChildFilters },
      index
    );
  };

  const handleAddEventDataFilter = () => {
    const newDataChild = {
      eventproperty: "",
      compareOption: "",
      value: "",
    };
    const newFilter = {
      ...filter,
      eventDataChildFilters: [...filter.eventDataChildFilters, newDataChild],
    };
    handleChange(newFilter, index);
  };

  const handleFilterTypeChange = (e) => {
    const { name, value } = e.target;
    if (value === "Event") {
      fetchAndSetEvents();
    }
    handleFilterChange(e);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const newFilter = {
      ...filter,
      [name]: value,
      ...(name === "eventName"
        ? {
            eventDataChildFilters: [],
            value: "",
            eventCount: null,
            eventDays: null,
            eventDetailsAvailable: false,
          }
        : {}),
    };
    handleChange(newFilter, index);
  };

  const renderCompareOptions = () => {
    const compareOptions = ["is equal to", "not equal to", ">", "<"];
    return compareOptions.map((compareOption) => (
      <option key={compareOption} value={compareOption}>
        {compareOption}
      </option>
    ));
  };

  const renderFilterBars = () => {
    const ConditionOptions = [
      { value: "and", label: "All" },
      { value: "or", label: "At least one" },
    ];

    return filter.eventDataChildFilters.length > 0 ? (
      <div className="flex mt-2">
        <p className="ml-2 py-2 text-sm">with</p>
        <select
          id="condition"
          name="condition"
          value={filter.condition}
          onChange={handleFilterChange}
          className="w-1/6 ml-1 px-3 py-2 border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
        >
          {ConditionOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <p className="text-sm flex ml-2 py-2">
          of the following event attributes
        </p>
      </div>
    ) : null;
  };

  const filterTypes = ["Attribute", "Event"];

  if (filter.filterType === "Attribute") {
    return (
      <div
        key="attribute"
        className={`ml-${index === 0 ? 0 : 1} p-1 flex gap-4`}
      >
        <select
          name="filterType"
          value={filter.filterType}
          onChange={handleFilterTypeChange}
          className={`w-2/6 -ml-${
            index === 0 ? 2 : 3
          } px-3 py-2 border bg-gray-50 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm`}
        >
          {filterTypes.map((filterType) => (
            <option key={filterType} value={filterType}>
              {filterType}
            </option>
          ))}
        </select>

        <Select
          id="attribute-select"
          name="attributeName"
          value={renderAttributeNameOptions().find(
            (option) => option.value === filter.attributeName
          )}
          onChange={handleAttributeNameChange}
          options={renderAttributeNameOptions()}
          placeholder="Attribute Name"
          isClearable
          className="w-3/6 px-0 py-0 border bg-gray-50 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
          styles={{
            control: (provided) => ({
              ...provided,
              // padding: "0.5rem",
              borderColor: "bg-gray-50 border-gray-300",
              // borderRadius: "0.375rem",
              // boxShadow: "none",
            }),
          }}
        />

        <select
          name="compareOptions"
          value={filter.compareOptions}
          onChange={handleFilterChange}
          className="w-2/6 px-3 py-2 border bg-gray-50 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
        >
          <option value="">Comparison</option>
          {renderCompareOptions()}
        </select>

        {filter.attributeName === "email" ? (
          <input
            type="text"
            name="attributeNameValue"
            value={filter.attributeNameValue}
            onChange={handleFilterChange}
            className="w-2/6 px-3 mr-2 py-2 border bg-gray-50 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
            placeholder="Enter Email Address"
          />
        ) : (
          <CreatableSelect
            name="attributeNameValue"
            value={renderAttributeValues().find(
              (option) => option.value === filter.attributeNameValue
            )}
            onChange={(selectedOption) => {
              const newValue = selectedOption ? selectedOption.value : "";
              handleFilterChange({
                target: {
                  name: "attributeNameValue",
                  value: newValue,
                },
              });
            }}
            options={renderAttributeValues()}
            placeholder="Value"
            isClearable
            className="w-2/6 px-0 mr-2 py-0 border bg-gray-50 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
            styles={{
              control: (provided) => ({
                ...provided,
                // padding: "0.5rem",
                // borderColor: "bg-gray-50 border-gray-300",
                // borderRadius: "0.375rem",
                // boxShadow: "none",
              }),
            }}
          />
        )}
      </div>
    );
  } else if (filter.filterType === "Event") {
    return (
      <>
        <div
          key="event"
          className={`ml-${index === 0 ? 0 : 1} p-1 flex gap-4 relative`}
        >
          <select
            name="filterType"
            value={filter.filterType}
            onChange={handleFilterChange}
            className={`w-2/6 -ml-${
              index === 0 ? 2 : 3
            } px-3 py-2 border bg-gray-50 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm`}
          >
            {filterTypes.map((filterType) => (
              <option key={filterType} value={filterType}>
                {filterType}
              </option>
            ))}
          </select>
          <Select
            name="eventName"
            value={renderEventNameOptions().find(
              (option) => option.value === filter.eventName
            )}
            onChange={handleEventNameChange}
            options={renderEventNameOptions()}
            placeholder="Event Name"
            isClearable
            className="w-3/6 px-0 py-0 border bg-gray-50 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
            styles={{
              control: (provided) => ({
                ...provided,
                // padding: "0.5rem",
                // borderColor: "bg-gray-50 border-gray-300",
                // borderRadius: "0.375rem",
                // boxShadow: "none",
              }),
            }}
          />
          <select
            name="eventPerformed"
            value={filter.eventPerformed}
            onChange={handleFilterChange}
            className="w-2/6 px-3 mr-2 py-2 border bg-gray-50 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
          >
            <option value="true">has been performed</option>
            <option value="false">has been not performed</option>
          </select>

          <button
            type="button"
            onClick={handleButtonClick}
            className="px-2 py-1 mr-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-black hover:bg-gray-300 focus:outline-none"
          >
            Refine
          </button>
        </div>
        {filter.eventDetailsAvailable && (
          <>
            <div className="-ml-1 p-1">
              <label>
                at least
                <input
                  type="text"
                  className="mx-2 w-1/12 px-3 mr-2 py-1 border bg-gray-50 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
                  name="eventCount"
                  placeholder="count"
                  value={filter.eventCount || ""}
                  onChange={handleFilterChange}
                />
              </label>
              <label>
                {filter.eventCount <= 1 ? "time" : "times"}
                <select
                  name="eventCutoffDuration"
                  value={filter.eventCutoffDuration}
                  onChange={handleFilterChange}
                  className="w-3/12 px-3 ml-2 py-1 border bg-gray-50 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
                >
                  <option value="within the last">within the last</option>
                  <option value="ever">ever</option>
                </select>
              </label>
              {filter.eventCutoffDuration === "within the last" && (
                <>
                  <label>
                    <input
                      type="text"
                      className="mx-2 w-1/12 px-3 mr-2 py-1 border bg-gray-50 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
                      name="eventDays"
                      value={filter.eventDays || ""}
                      onChange={handleFilterChange}
                    />
                    {filter.eventDays > 1 ? "days" : "day"}
                  </label>
                </>
              )}

              {filter.eventDataChildFilters.length > 0 ? (
                <div className="mt-4 w-full ml-1 border-2 border-gray-300 rounded-md">
                  {renderFilterBars()}
                  {filter.eventDataChildFilters.map(
                    (childFilter, childIndex, i) => (
                      <div
                        key={i}
                        className="my-2 border-2 border-gray-300 rounded-md mx-10"
                      >
                        <div className="m-2 ml-4 flex">
                          {i >= 1 && (
                            <div className="relative -ml-4">
                              <span className="absolute -mt-2 -ml-10 p-1 border text-sm font-medium bg-slate-50 border-gray-300 rounded-md focus:outline-none">
                                {filter.condition === "or" ? "Or" : "And"}
                              </span>
                            </div>
                          )}
                          <Select
                            name={`eventDataChildFilters[${childIndex}].eventproperty`}
                            value={renderEventProperties().find(
                              (option) =>
                                option.value === childFilter.eventproperty
                            )}
                            onChange={(selectedOption) => {
                              handleEventPropertyNameChange(
                                selectedOption,
                                childIndex
                              );
                            }}
                            options={renderEventProperties()}
                            placeholder="Property"
                            isClearable
                            className={`w-3/12 px-0 -ml-${
                              i === 0 ? 2 : 0
                            } py-0 mx-2 border bg-gray-50 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm`}
                            styles={{
                              control: (provided) => ({
                                ...provided,
                                // padding: "0.5rem",
                                // borderColor: "bg-gray-50 border-gray-300",
                                // borderRadius: "0.375rem",
                                // boxShadow: "none",
                              }),
                            }}
                          />
                          <select
                            name="compareOptions"
                            value={childFilter.compareOptions}
                            onChange={(e) =>
                              handleEventDataFilterChange(
                                i,
                                "compareOptions",
                                e.target.value
                              )
                            }
                            className="w-2/6 px-3 py-1 border bg-gray-50 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
                          >
                            <option value="">Comparison</option>
                            {renderCompareOptions()}
                          </select>
                          <CreatableSelect
                            name={`eventDataChildFilters[${childIndex}].value`}
                            value={renderEventPropertyValue(
                              childFilter.eventproperty
                            ).find(
                              (option) => option.value === childFilter.value
                            )}
                            onChange={(selectedOption) => {
                              const newValue = selectedOption
                                ? selectedOption.value
                                : "";
                              handleEventDataFilterChange(
                                childIndex,
                                "value",
                                newValue
                              );
                            }}
                            options={renderEventPropertyValue(
                              childFilter.eventproperty
                            )}
                            placeholder="Value"
                            isClearable
                            className="w-2/6 px-0 mx-2 mr-2 py-0 border bg-gray-50 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
                            styles={{
                              control: (provided) => ({
                                ...provided,
                                // padding: "0.5rem",
                                // borderColor: "bg-gray-50 border-gray-300",
                                // borderRadius: "0.375rem",
                                // boxShadow: "none",
                              }),
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => handleDeleteEventDataFilter(i)}
                            className="px-2 py-1 mr-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-black hover:bg-gray-300 focus:outline-none"
                          >
                            <RiDeleteBin5Line />
                          </button>
                        </div>
                      </div>
                    )
                  )}
                </div>
              ) : null}
            </div>
            <div>
              <button
                type="button"
                className="font-normal text-sm underline"
                onClick={handleAddEventDataFilter}
              >
                Add event data filter
              </button>
            </div>
          </>
        )}
      </>
    );
  } else if (filter.filterType === "Extra") {
    return <div key="extra" className="p-1 ml-2 flex gap-4"></div>;
  }
};

export default FilterInputs;
