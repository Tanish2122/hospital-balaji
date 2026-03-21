export interface TimeSlot {
  id: string;
  time: string;
  isAvailable: boolean;
}

export const generateTimeSlots = (startHour: number = 10, endHour: number = 17): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  for (let hour = startHour; hour < endHour; hour++) {
    // Top of the hour
    slots.push({
      id: `${hour}:00`,
      time: `${hour > 12 ? hour - 12 : hour}:00 ${hour >= 12 ? 'PM' : 'AM'}`,
      isAvailable: Math.random() > 0.3, // Mock availability
    });
    // Half past the hour
    slots.push({
      id: `${hour}:30`,
      time: `${hour > 12 ? hour - 12 : hour}:30 ${hour >= 12 ? 'PM' : 'AM'}`,
      isAvailable: Math.random() > 0.3, // Mock availability
    });
  }
  return slots;
};
