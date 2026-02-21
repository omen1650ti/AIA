

DOCUMENT_TEXT = """
# Comprehensive Insurance Providers and Plans Database

This document compiles detailed information on insurance providers, their associated plans, and riders. Each provider is listed with its name, ID, and additional details. Under each provider, plans are detailed including plan ID, name, type, target segment, features, tiers, base price, and resolved rider details (embedded from rider data linked by rider ID and plan ID). All data is structured for easy reference and ingestion into vector databases like Pinecone for Retrieval-Augmented Generation (RAG) purposes. Provider names and rider details have been resolved based on their respective IDs.

## Provider: Star Health
- Provider ID: 550e8400-e29b-41d4-a716-446655440000
- Additional Details: {}

### Plan: Senior Citizens Red Carpet
- Plan ID: 5cc0baf3-aad6-4708-8924-7c421d84cce3
- Base Price: 23000
- JSONB Data:
  - Plan ID (Internal): star_003
  - Plan Name: Senior Citizens Red Carpet
  - Plan Type: Individual
  - Target Segment: Senior citizens aged 60–75
  - Room Rent Type: Single Private Room
  - Existing Waiting Period (Years): 1
  - NCB Percent Per Year: 10
  - Max NCB Limit: 50
  - Max Child Age: null
  - Claim Settlement Ratio Percent: 99.06
  - Cashless Hospitals: 14000
  - Features:
    - Free Checkup: true
    - Free Checkup Frequency: Once per year
    - Maternity Cover: false
    - Ayush: true
    - Air Evacuation: false
    - Home Hospitalization: true
    - E Consultation: true
    - E Consultation Note: Unlimited teleconsultations; priority queue for senior members
    - External Copay Percent: 30
    - External Copay Note: 30% co-pay for pre-existing diseases; 10% for others at non-network hospitals
    - Baby Addition To Policy: false
    - Baby Addition Note: Not applicable for senior citizen plan
    - Newborn Baby Cover: false
    - Newborn Cover From Day: null
    - Newborn Cover Note: Not applicable
    - Daily Cash Allowance: true
    - Daily Cash Amount INR: 500
    - Daily Cash Max Days: 20
    - Daily Cash Note: ₹500/day for hospitalization beyond 48 hours
    - Animal Bite Vaccination: true
    - Animal Bite Note: Anti-rabies vaccination covered
  - Tiers:
    - Sum Insured: 100000, Base Premium Age 65: 5000
    - Sum Insured: 300000, Base Premium Age 65: 9500
    - Sum Insured: 500000, Base Premium Age 65: 14500
- Riders:
  - Rider ID: a2e802e0-9d71-40c2-84bc-dc6e3e944912
  - Rider JSON:
    - Plan ID: 8
    - Claim Settlement Ratio Percent: 92
    - Cashless Hospitals Count: 7000
    - Free Checkup Available: false
    - Home Hospitalization: false
    - E Consultation Available: true
    - E Consultation Limit Per Year: 4
    - External Copay Applicable: true
    - External Copay Percent: 40
    - Baby Addition Allowed: false
    - Baby Addition Underwriting Required: false
    - Newborn Cover Available: false
    - Newborn Covered From Day: 0
    - Daily Cash Available: false
    - Daily Cash Amount INR Per Day: 0
    - Daily Cash Max Days Per Year: 0
    - Animal Bite Vaccination Available: false

### Plan: Young Star
- Plan ID: 6152d7ef-7bff-4191-8b20-22174faffc8d
- Base Price: 24000
- JSONB Data:
  - Plan ID (Internal): star_001
  - Plan Name: Young Star
  - Plan Type: Individual / Family Floater
  - Target Segment: Young adults aged 18–40
  - Room Rent Type: Single Private Room
  - Existing Waiting Period (Years): 1
  - NCB Percent Per Year: 25
  - Max NCB Limit: 100
  - Max Child Age: 25
  - Claim Settlement Ratio Percent: 99.06
  - Cashless Hospitals: 14000
  - Features:
    - Free Checkup: true
    - Free Checkup Frequency: Once per year
    - Maternity Cover: true
    - Ayush: true
    - Air Evacuation: false
    - Home Hospitalization: true
    - E Consultation: true
    - E Consultation Note: Unlimited teleconsultations via Star Health app
    - External Copay Percent: 20
    - External Copay Note: 20% co-pay at non-network hospitals
    - Baby Addition To Policy: true
    - Baby Addition Note: Existing child can be added within 90 days of policy purchase
    - Newborn Baby Cover: true
    - Newborn Cover From Day: 1
    - Newborn Cover Note: Newborn covered from Day 1 up to sum insured
    - Daily Cash Allowance: true
    - Daily Cash Amount INR: 500
    - Daily Cash Max Days: 30
    - Daily Cash Note: ₹500/day for shared room upgrade
    - Animal Bite Vaccination: true
    - Animal Bite Note: Anti-rabies vaccination covered post animal bite
  - Tiers:
    - Sum Insured: 500000, Base Premium Age 30: 6500
    - Sum Insured: 1000000, Base Premium Age 30: 11000
    - Sum Insured: 2000000, Base Premium Age 30: 19000
- Riders:
  - Rider ID: 35475d15-5bf9-4736-a647-3ffe1996a159
  - Rider JSON:
    - Plan ID: 3
    - Claim Settlement Ratio Percent: 97
    - Cashless Hospitals Count: 11000
    - Free Checkup Available: true
    - Home Hospitalization: true
    - E Consultation Available: false
    - E Consultation Limit Per Year: 0
    - External Copay Applicable: true
    - External Copay Percent: 30
    - Baby Addition Allowed: true
    - Baby Addition Underwriting Required: true
    - Newborn Cover Available: true
    - Newborn Covered From Day: 91
    - Daily Cash Available: true
    - Daily Cash Amount INR Per Day: 500
    - Daily Cash Max Days Per Year: 15
    - Animal Bite Vaccination Available: true

### Plan: Comprehensive
- Plan ID: 77a3f57b-4814-4e57-8509-10c2edd0dc0a
- Base Price: 24569
- JSONB Data:
  - Plan ID (Internal): star_002
  - Plan Name: Comprehensive
  - Plan Type: Individual / Family Floater
  - Target Segment: Families looking for all-round coverage
  - Room Rent Type: Single Private Room
  - Existing Waiting Period (Years): 2
  - NCB Percent Per Year: 25
  - Max NCB Limit: 100
  - Max Child Age: 25
  - Claim Settlement Ratio Percent: 99.06
  - Cashless Hospitals: 14000
  - Features:
    - Free Checkup: true
    - Free Checkup Frequency: Once per year
    - Maternity Cover: true
    - Ayush: true
    - Air Evacuation: true
    - Home Hospitalization: true
    - E Consultation: true
    - E Consultation Note: Unlimited teleconsultations via Star Health app
    - External Copay Percent: 10
    - External Copay Note: 10% co-pay at non-network hospitals
    - Baby Addition To Policy: true
    - Baby Addition Note: Child can be added mid-term within 60 days of birth
    - Newborn Baby Cover: true
    - Newborn Cover From Day: 1
    - Newborn Cover Note: Newborn covered from Day 1; vaccination costs included up to ₹10,000
    - Daily Cash Allowance: true
    - Daily Cash Amount INR: 1000
    - Daily Cash Max Days: 30
    - Daily Cash Note: ₹1000/day hospital cash benefit
    - Animal Bite Vaccination: true
    - Animal Bite Note: Anti-rabies and anti-snake venom covered
  - Tiers:
    - Sum Insured: 500000, Base Premium Age 30: 9200
    - Sum Insured: 1000000, Base Premium Age 30: 15500
    - Sum Insured: 2000000, Base Premium Age 30: 26000
- Riders:
  - Rider ID: 5b7a9430-14da-4ed4-8afe-9e6b5d65c456
  - Rider JSON:
    - Plan ID: 6
    - Claim Settlement Ratio Percent: 94
    - Cashless Hospitals Count: 7500
    - Free Checkup Available: true
    - Home Hospitalization: false
    - E Consultation Available: false
    - E Consultation Limit Per Year: 0
    - External Copay Applicable: true
    - External Copay Percent: 25
    - Baby Addition Allowed: true
    - Baby Addition Underwriting Required: false
    - Newborn Cover Available: false
    - Newborn Covered From Day: 0
    - Daily Cash Available: false
    - Daily Cash Amount INR Per Day: 0
    - Daily Cash Max Days Per Year: 0
    - Animal Bite Vaccination Available: true

## Provider: HDFC Ergo
- Provider ID: 450e8400-e29b-41d4-a716-446655440000
- Additional Details: {}

### Plan: Optima Secure
- Plan ID: 086ab663-3813-4c46-a906-13b9fc5df952
- Base Price: 27000
- JSONB Data:
  - Plan ID (Internal): hdfc_001
  - Plan Name: Optima Secure
  - Plan Type: Individual / Family Floater
  - Target Segment: Comprehensive coverage with 2x SI from Day 1
  - Room Rent Type: No Limit
  - Existing Waiting Period (Years): 2
  - NCB Percent Per Year: 50
  - Max NCB Limit: 100
  - Max Child Age: 25
  - Claim Settlement Ratio Percent: 98
  - Cashless Hospitals: 12000
  - Features:
    - Free Checkup: true
    - Free Checkup Frequency: Once every 2 years; annual after 4 claim-free years
    - Maternity Cover: true
    - Ayush: true
    - Air Evacuation: true
    - Home Hospitalization: true
    - E Consultation: true
    - E Consultation Note: Unlimited teleconsultations via HDFC ERGO Health app
    - External Copay Percent: 10
    - External Copay Note: 10% co-pay at non-empanelled hospitals; waived for emergencies
    - Baby Addition To Policy: true
    - Baby Addition Note: Child can be added mid-term within 90 days of birth
    - Newborn Baby Cover: true
    - Newborn Cover From Day: 91
    - Newborn Cover Note: Newborn covered from Day 91; maternity and newborn linked benefit
    - Daily Cash Allowance: true
    - Daily Cash Amount INR: 800
    - Daily Cash Max Days: 20
    - Daily Cash Note: ₹800/day for stay beyond 48 hours; ICU stay doubles allowance
    - Animal Bite Vaccination: true
    - Animal Bite Note: Covers anti-rabies vaccination under OPD benefit
  - Tiers:
    - Sum Insured: 500000, Base Premium Age 30: 8500
    - Sum Insured: 1000000, Base Premium Age 30: 14000
    - Sum Insured: 2000000, Base Premium Age 30: 24000
- Riders:
  - Rider ID: 32467bd9-859a-4bf7-80e9-5e09eee8990a
  - Rider JSON:
    - Plan ID: 13
    - Claim Settlement Ratio Percent: 95
    - Cashless Hospitals Count: 10500
    - Free Checkup Available: true
    - Home Hospitalization: false
    - E Consultation Available: true
    - E Consultation Limit Per Year: 6
    - External Copay Applicable: true
    - External Copay Percent: 12
    - Baby Addition Allowed: true
    - Baby Addition Underwriting Required: true
    - Newborn Cover Available: true
    - Newborn Covered From Day: 21
    - Daily Cash Available: true
    - Daily Cash Amount INR Per Day: 850
    - Daily Cash Max Days Per Year: 24
    - Animal Bite Vaccination Available: false

### Plan: Optima Restore
- Plan ID: d7beff25-2055-4753-9ea6-8d66cb1da1af
- Base Price: 27400
- JSONB Data:
  - Plan ID (Internal): hdfc_002
  - Plan Name: Optima Restore
  - Plan Type: Individual / Family Floater
  - Target Segment: Mid-range buyers wanting automatic SI restoration
  - Room Rent Type: Single Private Room
  - Existing Waiting Period (Years): 2
  - NCB Percent Per Year: 50
  - Max NCB Limit: 100
  - Max Child Age: 25
  - Claim Settlement Ratio Percent: 98
  - Cashless Hospitals: 12000
  - Features:
    - Free Checkup: true
    - Free Checkup Frequency: Once per year
    - Maternity Cover: false
    - Ayush: true
    - Air Evacuation: false
    - Home Hospitalization: true
    - E Consultation: true
    - E Consultation Note: Up to 6 free e-consultations per year
    - External Copay Percent: 20
    - External Copay Note: 20% co-pay at non-network hospitals
    - Baby Addition To Policy: true
    - Baby Addition Note: Child addition allowed at renewal only
    - Newborn Baby Cover: false
    - Newborn Cover From Day: null
    - Newborn Cover Note: Newborn cover not included; upgrade to Optima Secure for this benefit
    - Daily Cash Allowance: true
    - Daily Cash Amount INR: 500
    - Daily Cash Max Days: 15
    - Daily Cash Note: ₹500/day for hospitalization beyond 48 hours; max 15 days/year
    - Animal Bite Vaccination: true
    - Animal Bite Note: Anti-rabies vaccination covered; subject to OPD sub-limit
  - Tiers:
    - Sum Insured: 300000, Base Premium Age 30: 5500
    - Sum Insured: 500000, Base Premium Age 30: 7800
    - Sum Insured: 1000000, Base Premium Age 30: 12000
- Riders:
  - Rider ID: a765a40f-7664-4946-9670-3535f438895d
  - Rider JSON:
    - Plan ID: 12
    - Claim Settlement Ratio Percent: 98
    - Cashless Hospitals Count: 13000
    - Free Checkup Available: true
    - Home Hospitalization: true
    - E Consultation Available: true
    - E Consultation Limit Per Year: 0
    - External Copay Applicable: false
    - External Copay Percent: 0
    - Baby Addition Allowed: true
    - Baby Addition Underwriting Required: false
    - Newborn Cover Available: true
    - Newborn Covered From Day: 1
    - Daily Cash Available: true
    - Daily Cash Amount INR Per Day: 1500
    - Daily Cash Max Days Per Year: 30
    - Animal Bite Vaccination Available: true

## Provider: Niva Bupa
- Provider ID: 650e8400-e29b-41d4-a716-446655440000
- Additional Details: {}

### Plan: ReAssure 2.0
- Plan ID: e7d1ac29-7f3c-406a-a481-bcb887fa91d1
- Base Price: 29400
- JSONB Data:
  - Plan ID (Internal): niva_001
  - Plan Name: ReAssure 2.0
  - Plan Type: Individual / Family Floater
  - Target Segment: Individuals seeking unlimited recharge benefit
  - Room Rent Type: No Limit
  - Existing Waiting Period (Years): 3
  - NCB Percent Per Year: 100
  - Max NCB Limit: 100
  - Max Child Age: 30
  - Claim Settlement Ratio Percent: 91.29
  - Cashless Hospitals: 10000
  - Features:
    - Free Checkup: true
    - Free Checkup Frequency: Once per year
    - Maternity Cover: false
    - Ayush: true
    - Air Evacuation: true
    - Home Hospitalization: true
    - E Consultation: true
    - E Consultation Note: Up to 10 free e-consultations per year via Niva Bupa app
    - External Copay Percent: 0
    - External Copay Note: No co-pay at any hospital; full reimbursement
    - Baby Addition To Policy: true
    - Baby Addition Note: Child can be added at renewal or within 60 days of birth
    - Newborn Baby Cover: true
    - Newborn Cover From Day: 1
    - Newborn Cover Note: Newborn covered from Day 1 under family floater; vaccination included
    - Daily Cash Allowance: true
    - Daily Cash Amount INR: 1000
    - Daily Cash Max Days: 30
    - Daily Cash Note: ₹1000/day for each continuous hospitalization
    - Animal Bite Vaccination: true
    - Animal Bite Note: Anti-rabies and anti-snake venom covered on OPD basis
  - Tiers:
    - Sum Insured: 500000, Base Premium Age 30: 7200
    - Sum Insured: 1000000, Base Premium Age 30: 12500
    - Sum Insured: 2000000, Base Premium Age 30: 21000
- Riders:
  - Rider ID: 9df28ef0-d03d-4050-be7a-097232c2af7a
  - Rider JSON:
    - Plan ID: 10
    - Claim Settlement Ratio Percent: 96
    - Cashless Hospitals Count: 9500
    - Free Checkup Available: true
    - Home Hospitalization: true
    - E Consultation Available: true
    - E Consultation Limit Per Year: 10
    - External Copay Applicable: false
    - External Copay Percent: 0
    - Baby Addition Allowed: true
    - Baby Addition Underwriting Required: true
    - Newborn Cover Available: true
    - Newborn Covered From Day: 14
    - Daily Cash Available: true
    - Daily Cash Amount INR Per Day: 900
    - Daily Cash Max Days Per Year: 22
    - Animal Bite Vaccination Available: true

### Plan: Health Premia
- Plan ID: 0024f450-c9c5-41b4-a4d6-79cf131e0ba2
- Base Price: 26400
- JSONB Data:
  - Plan ID (Internal): niva_002
  - Plan Name: Health Premia
  - Plan Type: Individual / Family Floater
  - Target Segment: Premium segment; global coverage seekers
  - Room Rent Type: No Limit
  - Existing Waiting Period (Years): 2
  - NCB Percent Per Year: 50
  - Max NCB Limit: 100
  - Max Child Age: 30
  - Claim Settlement Ratio Percent: 91.29
  - Cashless Hospitals: 10000
  - Features:
    - Free Checkup: true
    - Free Checkup Frequency: Twice per year
    - Maternity Cover: true
    - Ayush: true
    - Air Evacuation: true
    - Home Hospitalization: true
    - E Consultation: true
    - E Consultation Note: Unlimited e-consultations; international teleconsult included
    - External Copay Percent: 0
    - External Copay Note: No co-pay; global coverage included for select treatments
    - Baby Addition To Policy: true
    - Baby Addition Note: Child can be added mid-term anytime with documentation
    - Newborn Baby Cover: true
    - Newborn Cover From Day: 1
    - Newborn Cover Note: Newborn covered from Day 1; NICU charges covered up to SI
    - Daily Cash Allowance: true
    - Daily Cash Amount INR: 2000
    - Daily Cash Max Days: 60
    - Daily Cash Note: ₹2000/day hospital cash; doubles for ICU stay
    - Animal Bite Vaccination: true
    - Animal Bite Note: Full vaccination course covered including imported vaccines
  - Tiers:
    - Sum Insured: 1000000, Base Premium Age 30: 18000
    - Sum Insured: 2500000, Base Premium Age 30: 32000
    - Sum Insured: 5000000, Base Premium Age 30: 52000
- Riders:
  - Rider ID: 2d0accdd-1bbe-4790-b6a1-a284e5080ccd
  - Rider JSON:
    - Plan ID: 11
    - Claim Settlement Ratio Percent: 90
    - Cashless Hospitals Count: 6000
    - Free Checkup Available: false
    - Home Hospitalization: false
    - E Consultation Available: false
    - E Consultation Limit Per Year: 0
    - External Copay Applicable: true
    - External Copay Percent: 50
    - Baby Addition Allowed: false
    - Baby Addition Underwriting Required: false
    - Newborn Cover Available: false
    - Newborn Covered From Day: 0
    - Daily Cash Available: false
    - Daily Cash Amount INR Per Day: 0
    - Daily Cash Max Days Per Year: 0
    - Animal Bite Vaccination Available: false

### Plan: Aspire
- Plan ID: 5ca4ab96-9d92-4898-aa6f-14c5c2142584
- Base Price: 26470
- JSONB Data:
  - Plan ID (Internal): niva_003
  - Plan Name: Aspire
  - Plan Type: Individual / Family Floater
  - Target Segment: Budget-conscious first-time buyers
  - Room Rent Type: Shared Room
  - Existing Waiting Period (Years): 3
  - NCB Percent Per Year: 25
  - Max NCB Limit: 50
  - Max Child Age: 25
  - Claim Settlement Ratio Percent: 91.29
  - Cashless Hospitals: 10000
  - Features:
    - Free Checkup: true
    - Free Checkup Frequency: Once every 2 years
    - Maternity Cover: false
    - Ayush: false
    - Air Evacuation: false
    - Home Hospitalization: false
    - E Consultation: true
    - E Consultation Note: Up to 3 free e-consultations per year
    - External Copay Percent: 20
    - External Copay Note: 20% co-pay at non-network hospitals
    - Baby Addition To Policy: true
    - Baby Addition Note: Child addition only at renewal
    - Newborn Baby Cover: false
    - Newborn Cover From Day: null
    - Newborn Cover Note: Newborn cover not included; upgrade to ReAssure for this benefit
    - Daily Cash Allowance: false
    - Daily Cash Amount INR: null
    - Daily Cash Max Days: null
    - Daily Cash Note: Not available in this plan
    - Animal Bite Vaccination: true
    - Animal Bite Note: Anti-rabies vaccination covered under OPD benefit
  - Tiers:
    - Sum Insured: 300000, Base Premium Age 30: 4500
    - Sum Insured: 500000, Base Premium Age 30: 6200
    - Sum Insured: 750000, Base Premium Age 30: 8800
- Riders:
  - Rider ID: 628d615e-8ccd-4ab0-8cdb-421cc37e61e1
  - Rider JSON:
    - Plan ID: 9
    - Claim Settlement Ratio Percent: 97
    - Cashless Hospitals Count: 12000
    - Free Checkup Available: true
    - Home Hospitalization: true
    - E Consultation Available: false
    - E Consultation Limit Per Year: 0
    - External Copay Applicable: true
    - External Copay Percent: 5
    - Baby Addition Allowed: true
    - Baby Addition Underwriting Required: false
    - Newborn Cover Available: true
    - Newborn Covered From Day: 1
    - Daily Cash Available: true
    - Daily Cash Amount INR Per Day: 1200
    - Daily Cash Max Days Per Year: 25
    - Animal Bite Vaccination Available: true

## Provider: Care Health
- Provider ID: 850e8400-e29b-41d4-a716-446655440000
- Additional Details: {}

### Plan: Care Supreme
- Plan ID: f14e9ec0-8db0-4e1f-a181-ef1d0c4458d5
- Base Price: 26270
- JSONB Data:
  - Plan ID (Internal): care_001
  - Plan Name: Care Supreme
  - Plan Type: Individual / Family Floater
  - Target Segment: Budget-friendly comprehensive plan
  - Room Rent Type: Shared Room
  - Existing Waiting Period (Years): 4
  - NCB Percent Per Year: 50
  - Max NCB Limit: 100
  - Max Child Age: 24
  - Claim Settlement Ratio Percent: 90.32
  - Cashless Hospitals: 8000
  - Features:
    - Free Checkup: true
    - Free Checkup Frequency: Once per year
    - Maternity Cover: false
    - Ayush: true
    - Air Evacuation: true
    - Home Hospitalization: true
    - E Consultation: false
    - E Consultation Note: Not included; available as a paid add-on rider
    - External Copay Percent: 30
    - External Copay Note: 30% co-pay mandatory at non-empanelled hospitals
    - Baby Addition To Policy: true
    - Baby Addition Note: Child addition at renewal; mid-term on request with documentation
    - Newborn Baby Cover: true
    - Newborn Cover From Day: 1
    - Newborn Cover Note: Newborn covered from Day 1 under floater; vaccination excluded
    - Daily Cash Allowance: true
    - Daily Cash Amount INR: 500
    - Daily Cash Max Days: 15
    - Daily Cash Note: ₹500/day beyond 48 hours hospitalization; max 15 days
    - Animal Bite Vaccination: true
    - Animal Bite Note: Anti-rabies vaccination covered under in-patient or day-care
  - Tiers:
    - Sum Insured: 500000, Base Premium Age 30: 5500
    - Sum Insured: 1000000, Base Premium Age 30: 9800
    - Sum Insured: 2000000, Base Premium Age 30: 17000
- Riders:
  - Rider ID: b56ca69f-3fa7-4227-9bdc-0225a50a983f
  - Rider JSON:
    - Plan ID: 4
    - Claim Settlement Ratio Percent: 96
    - Cashless Hospitals Count: 10000
    - Free Checkup Available: true
    - Home Hospitalization: true
    - E Consultation Available: true
    - E Consultation Limit Per Year: 0
    - External Copay Applicable: false
    - External Copay Percent: 0
    - Baby Addition Allowed: true
    - Baby Addition Underwriting Required: true
    - Newborn Cover Available: true
    - Newborn Covered From Day: 1
    - Daily Cash Available: true
    - Daily Cash Amount INR Per Day: 1000
    - Daily Cash Max Days Per Year: 30
    - Animal Bite Vaccination Available: true
  - Rider ID: cdc2a64d-a608-4471-9008-1cbc488c06dc
  - Rider JSON:
    - Plan ID: 4
    - Claim Settlement Ratio Percent: 96
    - Cashless Hospitals Count: 10000
    - Free Checkup Available: true
    - Home Hospitalization: true
    - E Consultation Available: true
    - E Consultation Limit Per Year: 0
    - External Copay Applicable: false
    - External Copay Percent: 0
    - Baby Addition Allowed: true
    - Baby Addition Underwriting Required: true
    - Newborn Cover Available: true
    - Newborn Covered From Day: 1
    - Daily Cash Available: true
    - Daily Cash Amount INR Per Day: 1000
    - Daily Cash Max Days Per Year: 30
    - Animal Bite Vaccination Available: true

### Plan: Care Plus
- Plan ID: 3d149988-e910-470b-a2a6-086a276ae530
- Base Price: 27270
- JSONB Data:
  - Plan ID (Internal): care_002
  - Plan Name: Care Plus
  - Plan Type: Individual / Family Floater
  - Target Segment: Enhanced coverage with maternity and OPD
  - Room Rent Type: Single Private Room
  - Existing Waiting Period (Years): 2
  - NCB Percent Per Year: 50
  - Max NCB Limit: 100
  - Max Child Age: 24
  - Claim Settlement Ratio Percent: 90.32
  - Cashless Hospitals: 8000
  - Features:
    - Free Checkup: true
    - Free Checkup Frequency: Twice per year
    - Maternity Cover: true
    - Ayush: true
    - Air Evacuation: true
    - Home Hospitalization: true
    - E Consultation: true
    - E Consultation Note: Up to 12 e-consultations per year via Care app
    - External Copay Percent: 20
    - External Copay Note: 20% co-pay at non-network hospitals
    - Baby Addition To Policy: true
    - Baby Addition Note: Child can be added mid-term within 60 days of birth
    - Newborn Baby Cover: true
    - Newborn Cover From Day: 1
    - Newborn Cover Note: Newborn covered from Day 1; vaccination up to ₹5,000 included
    - Daily Cash Allowance: true
    - Daily Cash Amount INR: 1000
    - Daily Cash Max Days: 30
    - Daily Cash Note: ₹1000/day hospital cash; doubles for ICU stay
    - Animal Bite Vaccination: true
    - Animal Bite Note: Anti-rabies and anti-venom vaccination covered
  - Tiers:
    - Sum Insured: 500000, Base Premium Age 30: 8200
    - Sum Insured: 1000000, Base Premium Age 30: 14000
    - Sum Insured: 2000000, Base Premium Age 30: 23000
- Riders:
  - Rider ID: 10f475f8-2c6c-4206-8022-9bfe383d4c6f
  - Rider JSON:
    - Plan ID: 2
    - Claim Settlement Ratio Percent: 98
    - Cashless Hospitals Count: 8500
    - Free Checkup Available: true
    - Home Hospitalization: false
    - E Consultation Available: true
    - E Consultation Limit Per Year: 5
    - External Copay Applicable: true
    - External Copay Percent: 20
    - Baby Addition Allowed: true
    - Baby Addition Underwriting Required: false
    - Newborn Cover Available: false
    - Newborn Covered From Day: 0
    - Daily Cash Available: false
    - Daily Cash Amount INR Per Day: 0
    - Daily Cash Max Days Per Year: 0
    - Animal Bite Vaccination Available: false

## Provider: ICICI Lombard
- Provider ID: 750e8400-e29b-41d4-a716-446655440000
- Additional Details: {}

### Plan: Health AdvantEdge
- Plan ID: 35448310-64cd-471b-8b48-bb63a3a44676
- Base Price: 25470
- JSONB Data:
  - Plan ID (Internal): icici_001
  - Plan Name: Health AdvantEdge
  - Plan Type: Individual / Family Floater
  - Target Segment: Working professionals wanting tax + health combo
  - Room Rent Type: Single Private Room
  - Existing Waiting Period (Years): 2
  - NCB Percent Per Year: 20
  - Max NCB Limit: 50
  - Max Child Age: 25
  - Claim Settlement Ratio Percent: 85.12
  - Cashless Hospitals: 6500
  - Features:
    - Free Checkup: true
    - Free Checkup Frequency: Once per year after 2 consecutive claim-free years
    - Maternity Cover: false
    - Ayush: false
    - Air Evacuation: false
    - Home Hospitalization: false
    - E Consultation: true
    - E Consultation Note: Up to 5 free e-consultations per year via IL TakeCare app
    - External Copay Percent: 25
    - External Copay Note: 25% co-pay at non-network hospitals; cashless not available outside network
    - Baby Addition To Policy: true
    - Baby Addition Note: Child addition allowed only at renewal
    - Newborn Baby Cover: false
    - Newborn Cover From Day: null
    - Newborn Cover Note: Newborn cover not included; separate policy required
    - Daily Cash Allowance: false
    - Daily Cash Amount INR: null
    - Daily Cash Max Days: null
    - Daily Cash Note: Not available in this plan
    - Animal Bite Vaccination: false
    - Animal Bite Note: Not covered under standard plan
  - Tiers:
    - Sum Insured: 500000, Base Premium Age 30: 6000
    - Sum Insured: 1000000, Base Premium Age 30: 10500
    - Sum Insured: 2000000, Base Premium Age 30: 18500
- Riders:
  - Rider ID: 5aee28fb-5b09-4936-a2e1-75493b36e6c5
  - Rider JSON:
    - Plan ID: 7
    - Claim Settlement Ratio Percent: 93
    - Cashless Hospitals Count: 8000
    - Free Checkup Available: true
    - Home Hospitalization: true
    - E Consultation Available: true
    - E Consultation Limit Per Year: 2
    - External Copay Applicable: false
    - External Copay Percent: 0
    - Baby Addition Allowed: true
    - Baby Addition Underwriting Required: true
    - Newborn Cover Available: true
    - Newborn Covered From Day: 7
    - Daily Cash Available: true
    - Daily Cash Amount INR Per Day: 600
    - Daily Cash Max Days Per Year: 10
    - Animal Bite Vaccination Available: true

### Plan: Elevate
- Plan ID: 6af3d77b-fc89-45ad-831f-ff2afd4f8160
- Base Price: 22470
- JSONB Data:
  - Plan ID (Internal): icici_002
  - Plan Name: Elevate
  - Plan Type: Individual / Family Floater
  - Target Segment: Comprehensive coverage with OPD and wellness focus
  - Room Rent Type: No Limit
  - Existing Waiting Period (Years): 2
  - NCB Percent Per Year: 20
  - Max NCB Limit: 100
  - Max Child Age: 25
  - Claim Settlement Ratio Percent: 85.12
  - Cashless Hospitals: 6500
  - Features:
    - Free Checkup: true
    - Free Checkup Frequency: Once per year
    - Maternity Cover: true
    - Ayush: true
    - Air Evacuation: true
    - Home Hospitalization: true
    - E Consultation: true
    - E Consultation Note: Unlimited e-consultations via IL TakeCare app
    - External Copay Percent: 10
    - External Copay Note: 10% co-pay at non-network hospitals; waived in emergencies
    - Baby Addition To Policy: true
    - Baby Addition Note: Child can be added mid-term within 90 days of birth
    - Newborn Baby Cover: true
    - Newborn Cover From Day: 1
    - Newborn Cover Note: Newborn covered from Day 1; NICU charges covered
    - Daily Cash Allowance: true
    - Daily Cash Amount INR: 1000
    - Daily Cash Max Days: 30
    - Daily Cash Note: ₹1000/day hospital cash for stays beyond 48 hours
    - Animal Bite Vaccination: true
    - Animal Bite Note: Anti-rabies vaccination covered under OPD benefit
  - Tiers:
    - Sum Insured: 500000, Base Premium Age 30: 9000
    - Sum Insured: 1000000, Base Premium Age 30: 15500
    - Sum Insured: 2000000, Base Premium Age 30: 25000
- Riders:
  - Rider ID: 2760debb-3c9c-48e0-861e-fe581bbe3f0b
  - Rider JSON:
    - Plan ID: 5
    - Claim Settlement Ratio Percent: 95
    - Cashless Hospitals Count: 9000
    - Free Checkup Available: false
    - Home Hospitalization: true
    - E Consultation Available: true
    - E Consultation Limit Per Year: 3
    - External Copay Applicable: true
    - External Copay Percent: 15
    - Baby Addition Allowed: false
    - Baby Addition Underwriting Required: false
    - Newborn Cover Available: true
    - Newborn Covered From Day: 30
    - Daily Cash Available: true
    - Daily Cash Amount INR Per Day: 700
    - Daily Cash Max Days Per Year: 18
    - Animal Bite Vaccination Available: false

"""

from fastapi import APIRouter, Body
from typing import Dict, List, Optional, Any
from uuid import uuid4
import os

from pinecone import Pinecone
from openai import AzureOpenAI
from pydantic import BaseModel

from app.core.config import settings

router = APIRouter()

def chunk_text(
    text: str,
    chunk_size: int = 1200,
    chunk_overlap: int = 200
) -> List[str]:
    """
    Simple recursive character-based chunker with overlap.
    You can replace this with langchain.text_splitter for more advanced splitting.
    """
    chunks = []
    start = 0
    text_len = len(text)

    while start < text_len:
        end = start + chunk_size
        if end >= text_len:
            chunks.append(text[start:])
            break

        # Try to find a good break point (double newline, then single newline, then space)
        break_pos = text.rfind("\n\n", start, end)
        if break_pos == -1:
            break_pos = text.rfind("\n", start, end)
        if break_pos == -1:
            break_pos = text.rfind(" ", start, end)

        if break_pos == -1 or break_pos < start + 200:
            # No good break → hard cut
            chunks.append(text[start:end])
            start = end - chunk_overlap
        else:
            chunks.append(text[start:break_pos].strip())
            start = break_pos - chunk_overlap

    return [c.strip() for c in chunks if c.strip()]


def create_metadata_for_chunk(
    chunk: str,
    chunk_index: int,
    total_chunks: int,
    document_title: str = "Comprehensive Insurance Plans Database 2025",
    source: str = "internal_db_export",
    provider: Optional[str] = None,
    plan_name: Optional[str] = None
) -> Dict:
    """Create rich metadata to improve filtering & retrieval quality"""
    return {
        "chunk_index": chunk_index,
        "total_chunks": total_chunks,
        "document_title": document_title,
        "source": source,
        "provider": provider or "multiple",
        "plan_name": plan_name or "various",
        "contains_features": "features" in chunk.lower(),
        "contains_tiers": "tiers" in chunk.lower() or "sum insured" in chunk.lower(),
        "text_length": len(chunk),
    }


@router.post("/document")
async def store_insurance_data_to_pinecone(
) -> Dict[str, Any]:
    """
    Upsert insurance document chunks to Pinecone using Azure OpenAI embeddings
    """
    full_document_text = DOCUMENT_TEXT
    namespace = settings.PINECONE_NAMESPACE
    batch_size = 100

    # 1. Embedding client
    embedding_client = AzureOpenAI(
        api_key=settings.EMBEDDING_KEY,
        azure_endpoint=settings.EMBEDDING_ENDPOINT,
        api_version=settings.EMBEDDING_VERSION,
    )

    # 2. Pinecone client (synchronous – recommended for most cases)
    pc = Pinecone(api_key=settings.PINECONE_API_KEY)
    index = pc.Index(name=settings.PINECONE_INDEX_NAME)

    # 3. Chunking (your existing function – looks good)
    chunks = chunk_text(full_document_text)

    print(f"Created {len(chunks)} chunks")

    # 4. Prepare & upsert in batches
    vectors_to_upsert = []
    upserted_count = 0

    for i, chunk in enumerate(chunks):
        # Get embedding
        response = embedding_client.embeddings.create(
            model="text-embedding-ada-002",
            input=chunk
        )
        embedding = response.data[0].embedding

        vector_id = str(uuid4())

        metadata = create_metadata_for_chunk(
            chunk=chunk,
            chunk_index=i,
            total_chunks=len(chunks),
            document_title="Comprehensive Insurance Plans Database 2025",
            source="internal_db_export",
        )

        vectors_to_upsert.append({
            "id": vector_id,
            "values": embedding,
            "metadata": {
                **metadata,
                "text": chunk  # important for retrieval
            }
        })

        if len(vectors_to_upsert) >= batch_size:
            index.upsert(
                vectors=vectors_to_upsert,
                namespace=namespace
            )
            upserted_count += len(vectors_to_upsert)
            print(f"Upserted batch of {len(vectors_to_upsert)} vectors")
            vectors_to_upsert = []

    # Final batch
    if vectors_to_upsert:
        index.upsert(
            vectors=vectors_to_upsert,
            namespace=namespace
        )
        upserted_count += len(vectors_to_upsert)
        print(f"Upserted final batch of {len(vectors_to_upsert)} vectors")

    return {
        "status": "success",
        "total_chunks": str(len(chunks)),
        "upserted": str(upserted_count),
    }