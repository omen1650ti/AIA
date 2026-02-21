import React, { useState, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { S } from "../InsurancePage/styles/theme";
import {
  CheckIcon,
  SparkleIcon,
  FilterIcon,
} from "../InsurancePage/components/Icons";
import PageHeader from "../InsurancePage/components/PageHeader";
import { useGetPolicyDetail } from "../../hooks/usePolicyDetails";
import BouncingLoader from "../../components/BouncingLoader";

// Hardcoded My Policies data from USER JSON
const MY_POLICIES = [
  {
    id: "29182736455001",
    plan_name: "Optima Secure",
    insurer: "HDFC ERGO General Insurance Company Limited",
    jsonb_data: {
      plan_name: "Optima Secure",
      plan_type: "Individual",
      claim_settlement_ratio_percent: 99,
      cashless_hospitals: 12000,
      existing_waiting_period_yrs: 3,
      ncb_percent_per_year: 25,
      features: {
        secure_benefit: true,
        plus_benefit: true,
        restore_benefit: true,
        protect_benefit: true,
        cashless_hospitals: 12000,
        claim_settlement_ratio_percent: 99
      },
      tiers: [
        { label: "Silver", price: 10620, sum_insured: 500000 },
        { label: "Gold", price: 12450, sum_insured: 1000000 },
        { label: "Platinum", price: 15600, sum_insured: 2000000 }
      ]
    },
    base_price: 10620,
    status: "Active",
    aiMatch: 95,
    highlight: "Instantly doubles base sum insured upon purchase",
    color: "#0ea5e9",
    isMyPolicyChat: true
  },
  {
    id: "62963426202600",
    plan_name: "ReAssure 3.0",
    insurer: "Niva Bupa Health Insurance Company Limited",
    jsonb_data: {
      plan_name: "ReAssure 3.0",
      plan_type: "Individual",
      claim_settlement_ratio_percent: 96,
      cashless_hospitals: 10000,
      existing_waiting_period_yrs: 3,
      ncb_percent_per_year: 25,
      features: {
        reassure_forever: true,
        booster_plus: true,
        lock_the_clock: true,
        live_healthy: true,
        cashless_hospitals: 10000,
        claim_settlement_ratio_percent: 96
      },
      tiers: [
        { label: "Base", price: 5973, sum_insured: 500000 },
        { label: "Comfort", price: 7200, sum_insured: 1000000 },
        { label: "Elite", price: 9500, sum_insured: 2000000 }
      ]
    },
    base_price: 5973,
    status: "Active",
    aiMatch: 89,
    highlight: "Pay premiums as per your entry age till a claim is paid",
    color: "#8b5cf6",
    isMyPolicyChat: true
  }
];

// Custom Icons for this page
const FirstAidIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#7c3aed"
    strokeWidth="2"
  >
    <rect x="3" y="8" width="18" height="12" rx="2" ry="2" />
    <path d="M8 8V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <line x1="12" y1="11" x2="12" y2="17" />
    <line x1="9" y1="14" x2="15" y2="14" />
  </svg>
);

const PiggyBankIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="white"
    strokeWidth="2"
    opacity="0.8"
  >
    <path d="M19 5c-1.5 0-2.8 1.4-3 2-3.5-1.5-11-.3-11 5 0 1.8 0 3 2 4.5V20h4v-2h3v2h4v-4c2-1.5 2-2.7 2-4.5 0-5.3-7.5-6.5-11-5" />
    <circle cx="7" cy="11" r="0.5" fill="white" />
  </svg>
);

const RobotIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#7c3aed"
    strokeWidth="2"
  >
    <rect x="5" y="8" width="14" height="10" rx="2" />
    <circle cx="9" cy="12" r="1.5" />
    <circle cx="15" cy="12" r="1.5" />
    <path d="M12 5V8" />
    <path d="M9 5h6" />
  </svg>
);

const policyDataaa = {
  details: "plan1",
  base_price: 24000,
  jsonb_data: {
    plan_id: "star_001",
    plan_name: "Young Star",
    plan_type: "Individual / Family Floater",
    target_segment: "Young adults aged 18–40",
    room_rent_type: "Single Private Room",
    existing_waiting_period_yrs: 1,
    ncb_percent_per_year: 25,
    max_ncb_limit: 100,
    max_child_age: 25,
    claim_settlement_ratio_percent: 99.06,
    cashless_hospitals: 14000,
    features: {
      free_checkup: true,
      free_checkup_frequency: "Once per year",
      maternity_cover: true,
      ayush: true,
      air_evacuation: false,
      home_hospitalization: true,
      e_consultation: true,
      e_consultation_note: "Unlimited teleconsultations via Star Health app",
      external_copay_percent: 20,
      external_copay_note: "20% co-pay at non-network hospitals",
      baby_addition_to_policy: true,
      baby_addition_note:
        "Existing child can be added within 90 days of policy purchase",
      newborn_baby_cover: true,
      newborn_cover_from_day: 1,
      newborn_cover_note: "Newborn covered from Day 1 up to sum insured",
      daily_cash_allowance: true,
      daily_cash_amount_inr: 500,
      daily_cash_max_days: 30,
      daily_cash_note: "₹500/day for shared room upgrade",
      animal_bite_vaccination: true,
      animal_bite_note: "Anti-rabies vaccination covered post animal bite",
    },
    tiers: [
      {
        sum_insured: 500000,
        base_premium_age_30: 6500,
      },
      {
        sum_insured: 1000000,
        base_premium_age_30: 11000,
      },
      {
        sum_insured: 2000000,
        base_premium_age_30: 19000,
      },
    ],
  },
  id: "3085e922-6fe2-4fa5-9a5b-6012f9945eac",
  insurance_provider_id: "550e8400-e29b-41d4-a716-446655440000",
  riders: [
    {
      rider_json: {
        plan_id: 3,
        claim_settlement_ratio_percent: 97,
        cashless_hospitals_count: 11000,
        free_checkup_available: true,
        home_hospitalization: true,
        e_consultation_available: false,
        e_consultation_limit_per_year: 0,
        external_copay_applicable: true,
        external_copay_percent: 30,
        baby_addition_allowed: true,
        baby_addition_underwriting_required: true,
        newborn_cover_available: true,
        newborn_covered_from_day: 91,
        daily_cash_available: true,
        daily_cash_amount_inr_per_day: 500,
        daily_cash_max_days_per_year: 15,
        animal_bite_vaccination_available: true,
      },
      id: "6c63d6d4-5ed2-4a52-b29f-be6518c666d3",
      plan_id: "3085e922-6fe2-4fa5-9a5b-6012f9945eac",
    },
  ],
};

const PolicyDetails = () => {
  const { policyId } = useParams();
  const navigate = useNavigate();
  const [billAmount, setBillAmount] = useState("2,50,000");
  const [isSimpleView, setIsSimpleView] = useState(true);
  const { data: apiPolicyData, isLoading, isError } = useGetPolicyDetail(policyId);

  // Check if it's a hardcoded policy
  const hardcodedPolicy = React.useMemo(() => MY_POLICIES.find(p => p.id === policyId), [policyId]);
  
  const policyData = hardcodedPolicy || apiPolicyData;

  // Use policyData?.jsonb_data for convenience
  const data = policyData?.jsonb_data;
  const riders = policyData?.riders?.[0]?.rider_json;

  // Tier selection state
  const [selectedTier, setSelectedTier] = useState(null);
  // Rider selection state
  const [selectedRiderKeys, setSelectedRiderKeys] = useState([]);

  // Map rider keys to display names, icons, and random prices (generated once per session)
  const riderMapping = useMemo(
    () => ({
      free_checkup_available: {
        label: "Free Checkup",
        icon: "🩺",
        price: Math.floor(Math.random() * 50) + 40,
      },
      home_hospitalization: {
        label: "Home Hospitalization",
        icon: "🏠",
        price: Math.floor(Math.random() * 70) + 60,
      },
      e_consultation_available: {
        label: "E-Consultation",
        icon: "📱",
        price: Math.floor(Math.random() * 30) + 20,
      },
      external_copay_applicable: {
        label: "External Co-pay",
        icon: "💰",
        price: Math.floor(Math.random() * 80) + 70,
      },
      baby_addition_allowed: {
        label: "Baby Addition",
        icon: "👶",
        price: Math.floor(Math.random() * 100) + 100,
      },
      newborn_cover_available: {
        label: "Newborn Cover",
        icon: "🍼",
        price: Math.floor(Math.random() * 90) + 90,
      },
      daily_cash_available: {
        label: "Daily Cash",
        icon: "💵",
        price: Math.floor(Math.random() * 40) + 40,
      },
      animal_bite_vaccination_available: {
        label: "Animal Bite Vaccination",
        icon: "🐕",
        price: Math.floor(Math.random() * 30) + 20,
      },
    }),
    [],
  );

  // Initialize selectedTier when data is loaded
  React.useEffect(() => {
    if (data?.tiers?.length > 0 && !selectedTier) {
      setSelectedTier(data.tiers[0]);
    }
  }, [data, selectedTier]);

  if (isLoading && !hardcodedPolicy) {
    return (
      <div className="flex justify-center items-center h-screen">
        <BouncingLoader />
      </div>
    );
  }

  // Ensure isError only triggers if not hardcoded
  if ((isError || !policyData) && !hardcodedPolicy) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-500">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-2">Oops!</h2>
          <p>We couldn't load the policy details. Please try again later.</p>
          <Link
            to="/insurance"
            className="text-purple-600 mt-4 inline-block hover:underline"
          >
            Back to Policies
          </Link>
        </div>
      </div>
    );
  }

  if (!selectedTier) {
    return (
      <div className="flex justify-center items-center h-screen">
        <BouncingLoader />
      </div>
    );
  }

  // Toggle rider selection
  const toggleRider = (key) => {
    setSelectedRiderKeys((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
    );
  };

  // Premium calculation based on logic: ((sum_insured/1000000 )* base_price )/12 + (riders * 10)
  // Updated Calculation logic
  const calculatePremium = (sumInsured, selectedKeys = []) => {
    const basePremium = Math.round(
      ((sumInsured / 1000000) * policyData.base_price) / 12,
    );

    // Sum up individual prices from the mapping
    const ridersPremium = selectedKeys.reduce((total, key) => {
      return total + (riderMapping[key]?.price || 0);
    }, 0);

    return basePremium + ridersPremium;
  };

  // Update how currentPremiumValue is called
  const currentPremiumValue = calculatePremium(
    selectedTier.sum_insured,
    selectedRiderKeys, // Pass the array of keys instead of length
  );
  // Helper to format currency
  const formatCurrency = (val) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val);

  return (
    <div
      style={{
        padding: "32px 32px 32px",
        background: S.bg,
        minHeight: "100%",
        fontFamily: S.font,
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", flexDirection: "column", gap: 24 }}>
        {/* Navigation Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <button
            onClick={() => navigate(`/policies?tab=${policyData?.isMyPolicyChat ? "mine" : "all"}`)}
            style={{
              padding: "8px",
              borderRadius: "50%",
              border: "1px solid #e2e8f0",
              background: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "all 0.2s",
              boxShadow: "0 2px 5px rgba(0,0,0,0.05)"
            }}
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 m-0">Policy Details</h1>
          </div>
        </div>

        {/* Left Column */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {/* Main Card */}
          <div style={mainCardStyle}>
            {/* Top Row: Provider Info & Price */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: 24,
              }}
            >
              <div style={{ display: "flex", gap: 16 }}>
                <div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      marginBottom: 4,
                    }}
                  >
                    <h2 style={{ fontSize: 24, fontWeight: 800, margin: 0, color: S.text }}>
                      {data.plan_name}
                    </h2>
                    <span style={tagStyle}>TOP MATCH</span>
                  </div>
                  <div
                    style={{
                      fontSize: 14,
                      color: S.textSub,
                      display: "flex",
                      flexDirection: "column",
                      gap: 4,
                    }}
                  >
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 12 }}
                    >
                      <span className="font-medium">{data.plan_type}</span>
                      <span className="text-amber-500 font-bold">4.9 (2.4k reviews)</span>
                    </div>
                    <div
                      style={{
                        fontSize: 12,
                        display: "flex",
                        gap: 12,
                        marginTop: 4,
                      }}
                    >
                      <span>
                        Waiting period: <b>{data.existing_waiting_period_yrs} years</b>
                      </span>
                      <span>
                        NCB: <b>{data.ncb_percent_per_year}% / year</b>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 24, fontWeight: 800, color: S.text }}>
                  {formatCurrency(currentPremiumValue)}
                  <span
                    style={{ fontSize: 14, fontWeight: 400, color: S.textSub }}
                  >
                    /mo
                  </span>
                </div>
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: "#10b981",
                    marginTop: 4,
                  }}
                >
                  Includes {data.ncb_percent_per_year}% No-Claim Bonus
                </div>
              </div>
            </div>

            {/* Tiers / Sum Insured Selection */}
            <div style={{ marginBottom: 32 }}>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 800,
                  color: S.textSub,
                  textTransform: "uppercase",
                  marginBottom: 12,
                  letterSpacing: "0.05em",
                }}
              >
                Choose Sum Insured
              </div>
              <div style={{ display: "flex", gap: 12 }}>
                {data.tiers.map((tier, idx) => (
                  <div
                    key={idx}
                    onClick={() => setSelectedTier(tier)}
                    style={{
                      flex: 1,
                      padding: "16px",
                      borderRadius: 16,
                      border: `2px solid ${
                        selectedTier.sum_insured === tier.sum_insured
                          ? S.purple
                          : S.border
                      }`,
                      background:
                        selectedTier.sum_insured === tier.sum_insured
                          ? "#f5f3ff"
                          : "white",
                      cursor: "pointer",
                      transition: "0.2s transform, 0.2s border-color",
                      textAlign: "center",
                    }}
                  >
                    <div
                      style={{
                        fontSize: 16,
                        fontWeight: 700,
                        color:
                          selectedTier.sum_insured === tier.sum_insured
                            ? S.purple
                            : S.text,
                      }}
                    >
                      {formatCurrency(tier.sum_insured)}
                    </div>
                    <div
                      style={{ fontSize: 11, color: S.textSub, marginTop: 4 }}
                    >
                      Premium:{" "}
                      {formatCurrency(
                        calculatePremium(tier.sum_insured, selectedRiderKeys),
                      )}
                      /mo
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Stats Row */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 12,
                marginBottom: 32,
              }}
            >
              <div style={statCardStyle}>
                <div
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    color: S.textSub,
                    textTransform: "uppercase",
                    marginBottom: 12,
                  }}
                >
                  AI Confidence Score
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div
                    style={{
                      flex: 1,
                      height: 6,
                      background: "#f0f0f0",
                      borderRadius: 3,
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: "98%",
                        height: "100%",
                        background: S.purpleGrad,
                      }}
                    />
                  </div>
                  <span
                    style={{ fontSize: 14, fontWeight: 700, color: S.purple }}
                  >
                    98%
                  </span>
                </div>
              </div>
              <div style={statCardStyle}>
                <div
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    color: S.textSub,
                    textTransform: "uppercase",
                    marginBottom: 4,
                  }}
                >
                  Settlement Ratio
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontSize: 16, fontWeight: 700 }}>
                    {data.claim_settlement_ratio_percent}%
                  </span>
                  <span style={{ fontSize: 12, color: "#10b981" }}>↗</span>
                </div>
              </div>
              <div style={statCardStyle}>
                <div
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    color: S.textSub,
                    textTransform: "uppercase",
                    marginBottom: 4,
                  }}
                >
                  Cashless Hospitals
                </div>
                <div style={{ fontSize: 16, fontWeight: 700 }}>
                  {data.cashless_hospitals.toLocaleString()}+
                </div>
              </div>
            </div>

            {/* Policy Simplifier */}
            <div style={simplifierBoxStyle}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 16,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <SparkleIcon />
                  <h3 style={{ fontSize: 14, fontWeight: 700, margin: 0 }}>
                    Policy Simplifier
                  </h3>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span
                    style={{
                      fontSize: 12,
                      color: isSimpleView ? S.textSub : S.purple,
                      fontWeight: 600,
                    }}
                  >
                    Legal View
                  </span>
                  <div
                    onClick={() => setIsSimpleView(!isSimpleView)}
                    style={{
                      width: 40,
                      height: 20,
                      borderRadius: 10,
                      background: isSimpleView ? S.purple : "#e5e7eb",
                      position: "relative",
                      cursor: "pointer",
                      transition: "0.2s",
                    }}
                  >
                    <div
                      style={{
                        width: 16,
                        height: 16,
                        borderRadius: "50%",
                        background: "white",
                        position: "absolute",
                        top: 2,
                        left: isSimpleView ? 22 : 2,
                        transition: "0.2s",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      fontSize: 12,
                      color: isSimpleView ? S.purple : S.textSub,
                      fontWeight: 600,
                    }}
                  >
                    Simple View
                  </span>
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 16,
                }}
              >
                <div style={coverageListStyle("#f0fdf4")}>
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: "#166534",
                      marginBottom: 8,
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    KEY FEATURES
                  </div>
                  <ul style={listStyle}>
                    {data.features.maternity_cover && (
                      <li>Maternity Coverage included</li>
                    )}
                    {data.features.ayush && <li>AYUSH treatments covered</li>}
                    {data.features.home_hospitalization && (
                      <li>Home Hospitalization supported</li>
                    )}
                    {data.features.e_consultation && (
                      <li>{data.features.e_consultation_note}</li>
                    )}
                    <li>
                      Waiting Period: {data.existing_waiting_period_yrs} year
                    </li>
                  </ul>
                </div>
                <div style={coverageListStyle("#fef2f2")}>
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: "#991b1b",
                      marginBottom: 8,
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                     IMPORTANT NOTES
                  </div>
                  <ul style={listStyle}>
                    {data.features.external_copay_percent > 0 && (
                      <li>{data.features.external_copay_note}</li>
                    )}
                    {!data.features.air_evacuation && (
                      <li>Air Evacuation not included</li>
                    )}
                    {data.features.daily_cash_allowance && (
                      <li>{data.features.daily_cash_note}</li>
                    )}
                  </ul>
                </div>
              </div>
            </div>

            {/* Riders Section */}
            <div style={{ marginTop: 32 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 16,
                }}
              >
                <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>
                  Available Riders
                </h3>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
                  gap: 12,
                }}
              >
                {Object.entries(riders || {})
                  .filter(
                    ([key, val]) =>
                      val === true &&
                      key !== "claim_settlement_ratio_percent" &&
                      key !== "cashless_hospitals_count" &&
                      riderMapping[key],
                  )
                  .map(([key, val], idx) => {
                    const isSelected = selectedRiderKeys.includes(key);
                    return (
                      <div
                        key={idx}
                        onClick={() => toggleRider(key)}
                        style={{
                          padding: "16px",
                          borderRadius: 16,
                          border: `2px solid ${
                            isSelected ? S.purple : S.border
                          }`,
                          background: isSelected ? "#f5f3ff" : "white",
                          display: "flex",
                          alignItems: "center",
                          gap: 12,
                          transition: "0.2s",
                          cursor: "pointer",
                          position: "relative",
                        }}
                      >
                        <span style={{ fontSize: 20 }}>
                          {riderMapping[key]?.icon}
                        </span>
                        <div
                          style={{
                            fontSize: 13,
                            fontWeight: 600,
                            color: isSelected ? S.purple : S.text,
                          }}
                        >
                          {riderMapping[key]?.label}
                        </div>
                        {isSelected && (
                          <div
                            style={{
                              position: "absolute",
                              top: -8,
                              right: -8,
                              background: S.purple,
                              color: "white",
                              width: 20,
                              height: 20,
                              borderRadius: "50%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: 10,
                              fontWeight: 800,
                              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                            }}
                          >
                            ✓
                          </div>
                        )}
                        <div
                          style={{
                            marginLeft: "auto",
                            fontSize: 10,
                            color: isSelected ? S.purple : S.textSub,
                            fontWeight: 700,
                          }}
                        >
                          {formatCurrency(riderMapping[key]?.price)}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Detailed Features Section */}
            <div style={{ marginTop: 32 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 16,
                }}
              >
                <FilterIcon />
                <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>
                  Plan Features
                </h3>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 16,
                }}
              >
                {Object.entries(data?.features || {})
                  .filter(
                    ([key, val]) => typeof val === "boolean" && val === true,
                  )
                  .map(([key, val], idx) => (
                    <div
                      key={idx}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 10,
                      }}
                    >
                      <div
                        style={{
                          width: 20,
                          height: 20,
                          borderRadius: "50%",
                          background: "#f0fdf4",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                          marginTop: 2,
                        }}
                      >
                        <CheckIcon color="#166534" />
                      </div>
                      <div style={{ fontSize: 14, color: S.text }}>
                        {key
                          .split("_")
                          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                          .join(" ")}
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Bottom Section */}
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
                marginTop: 40,
              }}
            >
              <button
                style={{
                  padding: "14px 44px",
                  background: S.purpleGrad,
                  color: "white",
                  borderRadius: 30,
                  border: "none",
                  fontWeight: 700,
                  fontSize: 15,
                  cursor: "pointer",
                  boxShadow: "0 4px 15px rgba(124, 58, 237, 0.3)",
                }}
              >
                Select Policy
              </button>
            </div>
          </div>
        </div>

        
      </div>
    </div>
  );
};

// Styles
const mainCardStyle = {
  background: "white",
  borderRadius: 24,
  padding: "32px",
  boxShadow: "0 10px 40px rgba(0,0,0,0.04)",
  border: `1px solid ${S.border}`,
};

const iconBoxStyle = {
  width: 60,
  height: 60,
  borderRadius: 16,
  background: "#eef2ff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  border: "1px solid #e0e7ff",
};

const tagStyle = {
  fontSize: 10,
  fontWeight: 800,
  padding: "3px 8px",
  background: "#ede9fe",
  color: S.purple,
  borderRadius: 6,
  letterSpacing: "0.02em",
};

const statCardStyle = {
  background: "#f9fafb",
  borderRadius: 16,
  padding: "16px",
  border: "1px solid #f1f5f9",
};

const simplifierBoxStyle = {
  padding: "24px",
  borderRadius: 20,
  border: "1px solid #f1f5f9",
  background: "linear-gradient(to bottom right, #ffffff, #fafafa)",
};

const coverageListStyle = (bg) => ({
  background: bg,
  padding: "16px",
  borderRadius: 16,
});

const listStyle = {
  margin: 0,
  paddingLeft: 16,
  fontSize: 12,
  color: S.text,
  listStyleType: "disc",
  display: "flex",
  flexDirection: "column",
  gap: 8,
};

const btnActionStyle = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  padding: "10px 20px",
  background: "white",
  border: `1px solid ${S.border}`,
  borderRadius: 30,
  fontSize: 14,
  fontWeight: 600,
  color: S.text,
  cursor: "pointer",
};

const aiSavingsCardStyle = {
  background: S.purpleGrad,
  borderRadius: 24,
  padding: "24px",
  boxShadow: "0 15px 35px rgba(124, 58, 237, 0.2)",
};

const whiteSidebarCardStyle = {
  background: "white",
  borderRadius: 24,
  padding: "24px",
  border: `1px solid ${S.border}`,
};

export default PolicyDetails;
