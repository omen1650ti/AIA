import React from 'react';
import { HeartIcon, CarIcon, HomeIcon, UsersIcon } from "../components/Icons";

export const CATEGORIES = [
  { icon: <HeartIcon />, label: "Health",    sub: "Comprehensive medical" },
  { icon: <CarIcon />,   label: "Auto",      sub: "Smart road coverage"   },
  { icon: <HomeIcon />,  label: "Home",      sub: "Property security"     },
  { icon: <UsersIcon />, label: "Term Life", sub: "Family protection"     },
];

export const TOP_PICKS = [
  {
    id: 1,
    initial:    "L",
    color:      "#7c3aed",
    name:       "SafeLife Platinum Plus",
    verified:   true,
    tag:        "Highly rated for families",
    price:      249,
    aiMatch:    98,
    featured:   true,
    features:   ["$0 Deductible", "Dental/Vision Included", "Global coverage"],
    cta:        "Enroll Now",
    ctaPrimary: true,
  },
  {
    id: 2,
    initial:    "N",
    color:      "#374151",
    name:       "Nova Shield Flex",
    verified:   true,
    tag:        "Popular for remote workers",
    price:      185,
    aiMatch:    null,
    featured:   false,
    features:   ["Telehealth 24/7", "Mental Health Support"],
    cta:        "View Details",
    ctaPrimary: false,
  },
  {
    id: 3,
    initial:    "G",
    color:      "#059669",
    name:       "Guardian Platinum",
    verified:   true,
    tag:        "Best hospital network",
    price:      124,
    aiMatch:    null,
    featured:   false,
    features:   ["2h Claim Processing", "Nationwide Network"],
    cta:        "View Details",
    ctaPrimary: false,
  },
];
