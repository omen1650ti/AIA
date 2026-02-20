import React from 'react';
import { Shield, TrendingUp, FileText } from "lucide-react";

export const MOCK_RESPONSES = [
  {
    type:     "analytics",
    content:  "Based on your recent move to Seattle and the type of vehicle you drive, I've prioritized plans with 98%+ settlement ratios.",
    insight:  "Your current coverage is 15% above market rate for similar benefits.",
    insight2: "Guardian Platinum offers the best hospital network in your zip code.",
    comparison: [
      { name: "Guardian", price: "$124", tag: "ALPHA", claimTime: "2h Claim",  highlight: true  },
      { name: "Azure",    price: "$215", tag: "BETA",  claimTime: "24h Claim", highlight: false },
    ],
  },
  {
    type:    "policy",
    content: "I've analyzed your family profile. Since you mentioned having two children under 10, I recommend focusing on plans with low pediatrician co-pays. Would you like to compare the top 3 family health plans?",
    comparison: [
      { name: "SafeLife Platinum", coverage: "Yes (up to $2k)", status: "yes"   },
      { name: "Nova Shield Alex",  coverage: "Add-on only",     status: "addon" },
    ],
  },
  {
    type:    "text",
    content: "I can analyze your risks, compare health plans, explain deductibles in plain English, and help you find the best coverage for your budget. What would you like to explore today?",
  },
  {
    type:     "analytics",
    content:  "Great news! I found 4 plans in your area that perfectly match your profile.",
    insight:  "Switching to Shield Pro could save you approximately $340 per year.",
    insight2: "Nova Premium has the lowest deductible for your age group.",
    comparison: [
      { name: "Shield Pro",  price: "$98",  tag: "BEST", claimTime: "1h Claim", highlight: true  },
      { name: "Nova Prem.",  price: "$189", tag: "TOP",  claimTime: "6h Claim", highlight: false },
    ],
  },
  {
    type:    "policy",
    content: "Here's a breakdown of orthodontic coverage across your top matched plans.",
    comparison: [
      { name: "SafeLife Platinum", coverage: "Yes (up to $2k)", status: "yes"   },
      { name: "Guardian Plus",     coverage: "Yes (up to $1k)", status: "yes"   },
      { name: "Nova Shield",       coverage: "Add-on only",     status: "addon" },
    ],
  },
  {
    type:    "text",
    content: "Your deductible is the amount you pay out-of-pocket before your insurance kicks in. With a $1,000 deductible you pay the first $1,000 of covered costs each year — after that your insurer covers the rest up to your plan limits.",
  },
];

export const QUICK_STARTS = [
  { icon: <Shield    size={14} />, label: "Analyze my risk profile" },
  { icon: <TrendingUp size={14}/>, label: "Compare health plans"    },
  { icon: <FileText  size={14} />, label: "Explain my deductibles"  },
];
