export const errorCardData =
  "The Page you are looking for doesn't exist or an other error occurred. Go back, or head over to www.activitytracking.com to choose a new direction.";

export const dashboardTilesData = [
  {
    title: 'Total Projects',
    data: '112'
  },
  {
    title: 'Pending Projects',
    data: '10'
  }, {
    title: 'Worked progress',
    data: '45',
  }, {
    title: 'Project Finished',
    data: '44'
  }]
export const doughnutChartData = {
  labels: ["Total Projects"],
  datasets: [
    {
      label: "Projects",
      data: [70],
      backgroundColor: ["#A155B9", "#16BFD6", '#165BAA', '#F765A3'],
      // borderColor: ["#e17cfd", "#4cd7f6"],
      cutout: 50,
    },
  ],
};

const columns = [
  { name: "NAME", uid: "name" },
  { name: "ROLE", uid: "role" },
  { name: "STATUS", uid: "status" },
  { name: "ACTIONS", uid: "actions" },
];
export const activityColumns = [
  { name: "NAME", uid: "name" },
  { name: "START TIME", uid: "starttime" },
  { name: "START TIME", uid: "endtime" },
  { name: "DELIVERABLE", uid: "deliverable" },
  { name: "STATUS", uid: "status" },
  { name: "ACTIONS", uid: "actions" },
];

const tableData = [
  {
    id: 1,
    name: "Tony Reichert",
    role: "CEO",
    team: "Management",
    status: "active",
    age: "29",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
    email: "tony.reichert@example.com",
  },
  {
    id: 2,
    name: "Zoey Lang",
    role: "Technical Lead",
    team: "Development",
    status: "paused",
    age: "25",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
    email: "zoey.lang@example.com",
  },
  {
    id: 3,
    name: "Jane Fisher",
    role: "Senior Developer",
    team: "Development",
    status: "active",
    age: "22",
    avatar: "https://i.pravatar.cc/150?u=a04258114e29026702d",
    email: "jane.fisher@example.com",
  },
  {
    id: 4,
    name: "William Howard",
    role: "Community Manager",
    team: "Marketing",
    status: "vacation",
    age: "28",
    avatar: "https://i.pravatar.cc/150?u=a048581f4e29026701d",
    email: "william.howard@example.com",
  },
  {
    id: 5,
    name: "Kristen Copper",
    role: "Sales Manager",
    team: "Sales",
    status: "active",
    age: "24",
    avatar: "https://i.pravatar.cc/150?u=a092581d4ef9026700d",
    email: "kristen.cooper@example.com",
  },
];
export const activityTableData = [
  {
    id: 1,
    name: "Tony Reichert",
    status: "active",
    starttime: '9:00 AM',
    endtime: '5:00 PM',
    deliverable: 'true',
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
    email: "tony.reichert@example.com",
    actions: 'Verify',
  },
  {
    id: 2,
    name: "Zoey Lang",
    status: "paused",
    starttime: '9:00 AM',
    endtime: '5:00 PM',
    deliverable: 'true',
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
    email: "zoey.lang@example.com",
    actions: 'Verify',
  },
  {
    id: 3,
    name: "Jane Fisher",
    status: "active",
    starttime: '9:00 AM',
    endtime: '5:00 PM',
    deliverable: 'true',
    avatar: "https://i.pravatar.cc/150?u=a04258114e29026702d",
    email: "jane.fisher@example.com",
    actions: 'Verify',
  },
  {
    id: 4,
    name: "William Howard",
    status: "vacation",
    starttime: '9:00 AM',
    endtime: '5:00 PM',
    deliverable: 'true',
    avatar: "https://i.pravatar.cc/150?u=a048581f4e29026701d",
    email: "william.howard@example.com",
    actions: 'Verify',
  },
  {
    id: 5,
    name: "Kristen Copper",
    status: "active",
    starttime: '9:00 AM',
    endtime: '5:00 PM',
    deliverable: 'true',
    avatar: "https://i.pravatar.cc/150?u=a092581d4ef9026700d",
    email: "kristen.cooper@example.com",
    actions: 'Verify',
  },
];
export const projectDetailProgressCards = [
  {
    heading: '90%',
    subheading: 'Your Project Progress',
    progress: 90
  },
  {
    heading: '10%',
    subheading: 'Pending',
    progress: 10
  },
  {
    heading: '22h 10min',
    subheading: 'Spent Hours',
    progress: 40
  },
  {
    heading: '2,000,000',
    subheading: 'Project Budget',
    progress: 55
  }
]
export const activityDetailProgressCards = [
  {
    heading: '90%',
    subheading: 'Your Activity Progress',
    progress: 60
  },
  {
    heading: '40%',
    subheading: 'Pending',
    progress: 40
  },
  {
    heading: '22h 10min',
    subheading: 'Spent Hours',
    progress: 40
  },
  {
    heading: '2,000,000',
    subheading: 'Activity Budget',
    progress: 25
  }
]
export const projectDetailCard = {
  "projectName": "Project 1",
  "projectManager": {
    "name": "Junior Garcia",
    "role": "Software Engineer",
    "avatar": "https://i.pravatar.cc/150?u=a042581f4e29026024d"
  },
  "description": "Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatem recusandae distinctio soluta quia sapiente pariatur molestiae laudantium ducimus deserunt impedit? Modi iure in unde, explicabo autem cumque voluptatibus sint consectetur.",
  "statusOptions": [
    { "key": "complete", "text": "Completed", "color": "text-green-600" },
    { "key": "incomplete", "text": "Incomplete", "color": "text-red-500" },
    { "key": "paused", "text": "Paused", "color": "text-yellow-500" }
  ]
}
export const activityDetailCard = {
  "projectName": "Activity 1",
  "projectManager": {
    "name": "Junior Garcia",
    "role": "Software Engineer",
    "avatar": "https://i.pravatar.cc/150?u=a042581f4e29026024d"
  },
  "description": "Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatem recusandae distinctio soluta quia sapiente pariatur molestiae laudantium ducimus deserunt impedit? Modi iure in unde, explicabo autem cumque voluptatibus sint consectetur.",
  "actualdate": "2021-09-10",
  "forecastdate": '2021-09-20',
  "targetdate": '2021-09-30',
  "statusOptions": [
    { "key": "complete", "text": "Completed", "color": "text-green-600" },
    { "key": "incomplete", "text": "Incomplete", "color": "text-red-500" },
    { "key": "paused", "text": "Paused", "color": "text-yellow-500" }
  ]
}
export { columns, tableData };
