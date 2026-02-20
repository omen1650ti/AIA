import React, { useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { S } from "../InsurancePage/styles/theme";
import {
  CheckIcon,
  SparkleIcon,
  FilterIcon,
} from "../InsurancePage/components/Icons";
import PageHeader from "../InsurancePage/components/PageHeader";
import { useGetPolicyDetail } from "../../hooks/usePolicyDetails";
import BouncingLoader from "../../components/BouncingLoader";

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
  const [billAmount, setBillAmount] = useState("2,50,000");
  const [isSimpleView, setIsSimpleView] = useState(true);
  const { data: policyData, isLoading, isError } = useGetPolicyDetail("3085e922-6fe2-4fa5-9a5b-6012f9945eac");

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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <BouncingLoader />
      </div>
    );
  }

  if (isError || !policyData) {
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
      <PageHeader />

      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 32 }}
      >
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
                <div style={iconBoxStyle}>
                  <FirstAidIcon />
                </div>
                <div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      marginBottom: 4,
                    }}
                  >
                    <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>
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
                      <span>🛡️ {data.plan_type}</span>
                      <span>⭐ 4.9 (2.4k reviews)</span>
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
                        Waiting: <b>{data.existing_waiting_period_yrs} Yr</b>
                      </span>
                      <span>
                        NCB: <b>{data.ncb_percent_per_year}% / yr</b>
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
                      fontWeight: 800,
                      color: "#166534",
                      marginBottom: 8,
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <CheckIcon color="#166534" /> KEY FEATURES
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
                      fontWeight: 800,
                      color: "#991b1b",
                      marginBottom: 8,
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <span style={{ color: "#991b1b" }}>ⓧ</span> IMPORTANT NOTES
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
                <span style={{ fontSize: 18 }}>🎭</span>
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

            {/* Claim Simulator */}
            <div
              style={{
                marginTop: 32,
                paddingTop: 32,
                borderTop: `1px solid ${S.border}`,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 20,
                }}
              >
                <span style={{ fontSize: 16 }}>📋</span>
                <h3 style={{ fontSize: 14, fontWeight: 700, margin: 0 }}>
                  Instant Claim Simulator
                </h3>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1.5fr",
                  gap: 40,
                  alignItems: "center",
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      color: S.textSub,
                      textTransform: "uppercase",
                      marginBottom: 8,
                    }}
                  >
                    Simulated Bill Amount
                  </div>
                  <div style={{ position: "relative" }}>
                    <span
                      style={{
                        position: "absolute",
                        left: 12,
                        top: "50%",
                        transform: "translateY(-50%)",
                        fontWeight: 700,
                      }}
                    >
                      ₹
                    </span>
                    <input
                      type="text"
                      value={billAmount}
                      onChange={(e) => setBillAmount(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "12px 12px 12px 28px",
                        borderRadius: 12,
                        background: "#f3f4f6",
                        border: "none",
                        fontSize: 15,
                        fontWeight: 700,
                        outline: "none",
                      }}
                    />
                  </div>
                </div>
                <div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: 8,
                    }}
                  >
                    <span style={{ fontSize: 12, color: S.textSub }}>
                      Insurance Covers:
                    </span>
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 700,
                        color: "#10b981",
                      }}
                    >
                      ₹2,35,000 (94%)
                    </span>
                  </div>
                  <div
                    style={{
                      height: 10,
                      background: "#f3f4f6",
                      borderRadius: 5,
                      overflow: "hidden",
                      position: "relative",
                    }}
                  >
                    <div
                      style={{
                        width: "94%",
                        height: "100%",
                        background: "#10b981",
                      }}
                    />
                    <div
                      style={{
                        width: "6%",
                        height: "100%",
                        background: "#ef4444",
                        position: "absolute",
                        right: 0,
                        top: 0,
                      }}
                    />
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginTop: 8,
                    }}
                  >
                    <span style={{ fontSize: 12, color: S.textSub }}>
                      Your Pay:
                    </span>
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 700,
                        color: "#ef4444",
                      }}
                    >
                      ₹15,000 (Consumables)
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Section */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: 40,
              }}
            >
              <button
                style={{
                  background: "none",
                  border: "none",
                  color: S.purple,
                  fontWeight: 700,
                  fontSize: 14,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                View Detailed AI Logic ▾
              </button>
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

          {/* Another Policy Small Card */}
          <div style={{ ...mainCardStyle, padding: "20px 24px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                <div
                  style={{
                    ...iconBoxStyle,
                    width: 48,
                    height: 48,
                    background: "#f5f3ff",
                  }}
                >
                  <span style={{ fontSize: 20 }}>💜</span>
                </div>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>
                    Care Supreme Plus
                  </h3>
                  <div style={{ fontSize: 12, color: S.textSub, marginTop: 2 }}>
                    Care Health Insurance • 94% AI Confidence
                  </div>
                </div>
              </div>
              <div style={{ fontSize: 20, fontWeight: 800 }}>
                ₹1,280
                <span
                  style={{ fontSize: 13, fontWeight: 400, color: S.textSub }}
                >
                  /mo
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column / Sidebar */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {/* AI Savings Card */}
          <div style={aiSavingsCardStyle}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: 8,
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 800,
                    color: "rgba(255,255,255,0.8)",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  AI SAVINGS INSIGHT
                </div>
                <div
                  style={{
                    fontSize: 32,
                    fontWeight: 800,
                    color: "white",
                    margin: "8px 0",
                  }}
                >
                  ₹3,250
                </div>
              </div>
              <PiggyBankIcon />
            </div>
            <p
              style={{
                fontSize: 13,
                color: "rgba(255,255,255,0.8)",
                lineHeight: 1.5,
                marginBottom: 20,
              }}
            >
              Annual savings detected compared to your current ICICI Lombard
              policy.
            </p>
            <button
              style={{
                width: "100%",
                padding: "12px",
                background: "white",
                color: S.purple,
                borderRadius: 20,
                border: "none",
                fontWeight: 700,
                fontSize: 13,
                cursor: "pointer",
              }}
            >
              APPLY INTELLIGENCE
            </button>
          </div>

          {/* Future Cost Card */}
          <div style={whiteSidebarCardStyle}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <h3 style={{ fontSize: 14, fontWeight: 700, margin: 0 }}>
                Future Cost Projection
              </h3>
              <span style={{ cursor: "pointer" }}>ⓘ</span>
            </div>

            {/* Simple Bar Chart */}
            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                gap: 8,
                height: 120,
                marginBottom: 20,
              }}
            >
              {[
                { y: "2026", h: "40%" },
                { y: "2027", h: "55%" },
                { y: "2028", h: "70%" },
                { y: "2029", h: "85%" },
                { y: "2030", h: "100%" },
              ].map((item, i) => (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      height: item.h,
                      background: S.purple,
                      opacity: 0.2 + i * 0.2,
                      borderRadius: "4px 4px 0 0",
                    }}
                  />
                  <div
                    style={{
                      fontSize: 10,
                      fontWeight: 600,
                      color: S.textSub,
                      marginTop: 8,
                    }}
                  >
                    {item.y}
                  </div>
                </div>
              ))}
            </div>
            <p style={{ fontSize: 12, color: S.textSub, lineHeight: 1.6 }}>
              Premiums are expected to rise by{" "}
              <span style={{ color: S.purple, fontWeight: 700 }}>
                7.2% CAGR
              </span>
              . The selected policy has a "Premium Locking" feature for the
              first 3 years.
            </p>
          </div>

          {/* Doubt Card */}
          <div
            style={{
              ...whiteSidebarCardStyle,
              border: "1.5px dashed #c4b5fd",
              background: "#f9f8ff",
              textAlign: "center",
              padding: "32px 24px",
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                background: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
              }}
            >
              <RobotIcon />
            </div>
            <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 8 }}>
              Doubt about coverage?
            </h3>
            <p
              style={{
                fontSize: 13,
                color: S.textSub,
                lineHeight: 1.5,
                marginBottom: 20,
              }}
            >
              Our AI Advisor can analyze your previous medical records to
              confirm eligibility.
            </p>
            <button
              style={{
                width: "100%",
                padding: "12px",
                background: "white",
                color: S.purple,
                border: `1px solid ${S.purpleMid}`,
                borderRadius: 20,
                fontWeight: 700,
                fontSize: 13,
                cursor: "pointer",
              }}
            >
              Start AI Consult
            </button>
          </div>

          {/* Add-on Banner */}
          <div
            style={{
              background: S.purpleGrad,
              borderRadius: 20,
              padding: "24px",
              color: "white",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div style={{ position: "relative", zIndex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>
                Add-on: Critical Illness
              </div>
              <div style={{ fontSize: 12, opacity: 0.8 }}>
                Cover 32 major illnesses for ₹99/mo
              </div>
            </div>
            {/* Decorative background stripes */}
            <div
              style={{
                position: "absolute",
                right: -20,
                bottom: -10,
                opacity: 0.2,
                transform: "rotate(-15deg)",
              }}
            >
              <div
                style={{
                  width: 100,
                  height: 10,
                  background: "white",
                  marginBottom: 4,
                }}
              />
              <div
                style={{
                  width: 120,
                  height: 10,
                  background: "white",
                  marginBottom: 4,
                }}
              />
              <div style={{ width: 140, height: 10, background: "white" }} />
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
