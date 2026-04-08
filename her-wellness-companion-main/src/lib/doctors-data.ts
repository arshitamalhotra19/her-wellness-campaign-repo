export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  experience: string;
  rating: number;
  location: string;
  availableDays: string[];
  availableTimes: string[];
  image: string;
  phone: string;
  bio: string;
}

export const doctors: Doctor[] = [
  {
    id: '1',
    name: 'Dr. Priya Sharma',
    specialty: 'Gynecologist & Oncologist',
    experience: '15 years',
    rating: 4.9,
    location: 'Apollo Hospital, Delhi',
    availableDays: ['Monday', 'Wednesday', 'Friday'],
    availableTimes: ['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM', '4:00 PM'],
    image: '👩‍⚕️',
    phone: '+91-9876543210',
    bio: 'Specialist in cervical cancer screening and treatment with extensive experience in minimally invasive gynecological surgery.',
  },
  {
    id: '2',
    name: 'Dr. Anjali Mehta',
    specialty: 'Reproductive Health Specialist',
    experience: '12 years',
    rating: 4.8,
    location: 'Fortis Hospital, Mumbai',
    availableDays: ['Tuesday', 'Thursday', 'Saturday'],
    availableTimes: ['10:00 AM', '11:00 AM', '12:00 PM', '3:00 PM', '4:00 PM'],
    image: '👩‍⚕️',
    phone: '+91-9876543211',
    bio: 'Expert in reproductive health, HPV management, and preventive cervical care.',
  },
  {
    id: '3',
    name: 'Dr. Kavitha Reddy',
    specialty: 'Gynecological Oncologist',
    experience: '20 years',
    rating: 4.9,
    location: 'AIIMS, Bangalore',
    availableDays: ['Monday', 'Tuesday', 'Thursday'],
    availableTimes: ['9:00 AM', '10:00 AM', '2:00 PM', '3:00 PM', '5:00 PM'],
    image: '👩‍⚕️',
    phone: '+91-9876543212',
    bio: 'Pioneer in cervical cancer research and treatment. Published researcher with over 50 papers on HPV prevention.',
  },
  {
    id: '4',
    name: 'Dr. Sneha Iyer',
    specialty: 'OB-GYN',
    experience: '8 years',
    rating: 4.7,
    location: 'Max Healthcare, Hyderabad',
    availableDays: ['Wednesday', 'Friday', 'Saturday'],
    availableTimes: ['10:00 AM', '11:00 AM', '12:00 PM', '2:00 PM', '4:00 PM'],
    image: '👩‍⚕️',
    phone: '+91-9876543213',
    bio: 'Compassionate OB-GYN focused on women\'s preventive health and cervical cancer awareness.',
  },
  {
    id: '5',
    name: 'Dr. Meera Patel',
    specialty: 'Preventive Medicine & Women\'s Health',
    experience: '10 years',
    rating: 4.8,
    location: 'Manipal Hospital, Chennai',
    availableDays: ['Monday', 'Wednesday', 'Friday'],
    availableTimes: ['9:00 AM', '11:00 AM', '1:00 PM', '3:00 PM'],
    image: '👩‍⚕️',
    phone: '+91-9876543214',
    bio: 'Dedicated to women\'s preventive healthcare with special focus on early cancer detection and lifestyle medicine.',
  },
];
