import { PUBLIC_URL } from '@/config/url.config';
import { Clock, Mail, MapPin, Phone } from 'lucide-react';
import { AiFillFacebook, AiFillLinkedin, AiFillYoutube } from 'react-icons/ai';

export const FooterAboutLinks = [
  {
    title: 'Visit Us',
    desc: 'Vanadzor, Armenia',
    Icon: MapPin,
  },
  {
    title: 'Call Us',
    desc: '+374 95 898795',
    Icon: Phone,
  },
  {
    title: 'Working Hours',
    desc: 'Mon-Sat: 10:00 AM-7:00 PM',
    Icon: Clock,
  },
  {
    title: 'Email Us',
    desc: 'albert.aghajanyan.mw@gmail.com',
    Icon: Mail,
  },
];

export const FooterQuickLinks = [
  {
    title: 'About Us',
    href: PUBLIC_URL.aboutUs(),
  },
  {
    title: 'Contact Us',
    href: PUBLIC_URL.contactUs(),
  },
  {
    title: 'Terms & Conditions',
    href: PUBLIC_URL.termsAndCondition(),
  },
  {
    title: 'Privacy Policy',
    href: PUBLIC_URL.privacyPolicy(),
  },
  { title: 'FAQs', href: PUBLIC_URL.faqs() },
];

export const FooterSocialLinks = [
  { title: 'Youtube', Icon: AiFillYoutube },
  { title: 'LinkedIn', Icon: AiFillLinkedin },
  { title: 'Facebook', Icon: AiFillFacebook },
];
