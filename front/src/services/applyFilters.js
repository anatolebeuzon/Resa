import Fuse from "fuse.js";

function filterRoom(filters, room) {
  // "return true" means that this room will be removed from the list
  if (filters.type !== "") {
    if (filters.type === "Salle de visioconférence") {
      if (room.type !== "Salle de réunion" || !room.videoConference) {
        return false;
      }
    } else if (room.type !== filters.type) {
      return false;
    }
  }

  if (!room.available && !filters.displayUnavailableRooms) {
    return false;
  }

  if (filters.minCapacity > 5 && room.capacity < filters.minCapacity) {
    return false;
  }

  return true;
}

export default (roomList, filters) => {
  const rooms = roomList.filter(filterRoom.bind(null, filters));

  // Search
  if (filters.searchText) {
    const searchOptions = {
      shouldSort: true,
      threshold: 0.4,
      location: 0,
      distance: 100,
      maxPatternLength: 32,
      minMatchCharLength: 1,
      keys: ["name", "type", "donator", "building", "campus", "wing"],
    };
    return new Fuse(rooms, searchOptions).search(filters.searchText);
  }
  return rooms;
};
