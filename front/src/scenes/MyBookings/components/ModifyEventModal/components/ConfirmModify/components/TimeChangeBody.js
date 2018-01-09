import React from "react";
import EventList from "../../../../../../../components/EventList";
import NewTimePicker from "./components/NewTimePicker";

export default ({ event, handleDateInputChange, newAttributes }) => [
  <EventList
    selectedDate={event.startDate}
    roomName={event.room.name}
    events={event.room.events}
    highlightedEvent={event.id}
    key="eventList"
  />,
  <NewTimePicker
    handleDateInputChange={handleDateInputChange}
    newAttributes={newAttributes}
    key="timePicker"
  />,
];
