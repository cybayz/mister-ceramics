export const BUSINESS_INFO = {
  name: 'MISTER CERAMIC',
  tagline: 'Beyond Shine. Beyond Protection.',
  subtagline:
    'Precision detailing. Advanced protection. Exceptional finishes. Experience professional care for your car and bike.',
  address: 'Chegamanadu, Kottarakkara, Kollam, Kerala, India - 691506',
  phone: '+91 92072 09105',
  phoneRaw: '+919207209105',
  whatsappUrl: 'https://wa.me/919207209105',
  googleMapsUrl:
    'https://www.google.com/maps/place/mister+ceramic/data=!4m2!3m1!1s0x3b0675fb65d87319:0x41a9e67271dc0506',
  hours: 'Monday – Saturday: 9:00 AM – 7:00 PM | Sunday: By Appointment',
  email: 'care@misterceramic.com',
};

export const SERVICE_STATUSES = [
  'Booking Received',
  'Booking Confirmed',
  'Vehicle Received',
  'Initial Inspection',
  'Preparation and Cleaning',
  'Service in Progress',
  'Quality Inspection',
  'Ready for Delivery',
  'Delivered',
  'Cancelled',
] as const;

export type ServiceStatus = (typeof SERVICE_STATUSES)[number];

export const STATUS_COLORS: Record<ServiceStatus, { bg: string; text: string; border: string }> = {
  'Booking Received': { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30' },
  'Booking Confirmed': { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/30' },
  'Vehicle Received': { bg: 'bg-indigo-500/10', text: 'text-indigo-400', border: 'border-indigo-500/30' },
  'Initial Inspection': { bg: 'bg-cyan-500/10', text: 'text-cyan-400', border: 'border-cyan-500/30' },
  'Preparation and Cleaning': { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/30' },
  'Service in Progress': { bg: 'bg-yellow-500/15', text: 'text-yellow-400', border: 'border-yellow-500/40' },
  'Quality Inspection': { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30' },
  'Ready for Delivery': { bg: 'bg-green-500/15', text: 'text-green-400', border: 'border-green-500/40' },
  'Delivered': { bg: 'bg-zinc-500/20', text: 'text-zinc-300', border: 'border-zinc-500/30' },
  'Cancelled': { bg: 'bg-red-500/15', text: 'text-red-400', border: 'border-red-500/30' },
};

