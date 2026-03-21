export interface Hospital {
  id: string;
  name: string;
  doctorPhone: string;
}

export const hospitals: Hospital[] = [
  {
    id: "h1",
    name: "Balaji Hospital",
    doctorPhone: "916377433387@c.us"
  },
  {
    id: "h2",
    name: "City Care Hospital",
    doctorPhone: "917276229049@c.us"
  }
];
