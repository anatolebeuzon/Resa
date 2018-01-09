export default room => [
    {
      type: "roomType",
      value: room.type,
    },
    {
      type: "buildingAndCampus",
      building: room.building,
      campus: room.campus,
    },
    {
      type: "wingAndFloor",
      wing: room.wing,
      floor: room.floor,
    },
    {
      type: "capacity",
      value: room.capacity,
    },
    {
      type: "videoConference",
      value: room.videoConference,
    },
    {
      type: "video",
      value: room.video,
    },
    {
      type: "donator",
      value: room.donator,
    },
  ];
