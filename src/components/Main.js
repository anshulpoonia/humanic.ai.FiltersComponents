"use client";
import { useEffect, useState } from "react";
import Group from "./group";

const Main = ({ attributeName }) => {
  const [attributes, setAttributes] = useState([]);
  const [attributesValues, setAttributesValues] = useState({});
  const [events, setEvents] = useState([]);
  const [eventsValues, setEventsValues] = useState({});
  const [eventsPropertyValues, setEventsPropertyValues] = useState({});

  useEffect(() => {
    async function fetchAllData() {
      try {
        // Fetch attributes
        const attributesResponse = await fetch("/api/attributes");
        if (!attributesResponse.ok) {
          throw new Error("Failed to fetch attributes");
        }
        const attributesData = await attributesResponse.json();
        setAttributes(attributesData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    if (attributes.length === 0) {
      fetchAllData();
    }
  }, [attributes]);

  // State for storing filter groups
  const [rootGroup, setRootGroup] = useState({
    type: "group",
    condition: "and",
    children: [],
    filterType: "Attribute",
    attributeName: "",
    compaireOption: "",
    value: "",
    eventName: "",
    eventPerformed: "",
  });

  const handleChildChange = (child) => {
    setRootGroup(child);
  };

  // Fetch events
  const fetchAndSetEvents = async () => {
    try {
      const eventsResponse = await fetch("/api/events");
      if (!eventsResponse.ok) {
        throw new Error("Failed to fetch events");
      }
      const eventsData = await eventsResponse.json();
      setEvents(eventsData);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  // Fetch attribute values
  const fetchAttributeValues = async (attributeName) => {
    try {
      const attributesValuesResponse = await fetch(
        `/api/attributes/${attributeName}`
      );
      if (!attributesValuesResponse.ok) {
        throw new Error("Failed to fetch attributes values");
      }
      const attributesValuesData = await attributesValuesResponse.json();
      setAttributesValues({
        ...attributesValues,
        [attributeName]: attributesValuesData[attributeName],
      });
    } catch (error) {
      console.error("Error fetching attribute values:", error);
    }
  };

  // Fetch event values
  const fetchEventValues = async (eventName) => {
    try {
      const eventsValuesResponse = await fetch(`/api/events/${eventName}`);
      if (!eventsValuesResponse.ok) {
        throw new Error("Failed to fetch event values");
      }
      const eventsValuesData = await eventsValuesResponse.json();
      setEventsValues({
        ...eventsValues,
        [eventName]: eventsValuesData[eventName],
      });
    } catch (error) {
      console.error("Error fetching event values:", error);
    }
  };

  // Fetch eventPropertyvalues
  const fetchEventPropertyValues = async (eventName, propertyName) => {
    try {
      const eventsPropertyValuesResponse = await fetch(
        `/api/events/${eventName}/${propertyName}`
      );
      if (!eventsPropertyValuesResponse.ok) {
        throw new Error("Failed to fetch event values");
      }
      const eventsPropertyValuesData =
        await eventsPropertyValuesResponse.json();
      setEventsPropertyValues({
        ...eventsPropertyValues,
        [propertyName]: eventsPropertyValuesData[propertyName],
      });
    } catch (error) {
      console.error("Error fetching event values:", error);
    }
  };

  return (
    <form className="w-full gap-4 justify-between m-auto">
      <Group
        isGroupActive={true}
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
        group={rootGroup}
        index={0}
        handleChange={handleChildChange}
      />
    </form>
  );
};

export default Main;
