import { useNavigate, useOutletContext } from "react-router-dom";
import PolicyCard from "./components/PolicyCard";
import HeroSection from "./components/HeroSection";
import { ChevronRightIcon } from "./components/Icons";

import { TOP_PICKS } from "./util/constants";
import PolicyCompare from "./components/PolicyCompare";
import { S } from "./styles/theme";
import { useGetPolicies } from "../../hooks/usePolicies";
import BouncingLoader from "../../components/BouncingLoader";

function InsurancePage() {
  const { policies, filters, updateFilter, setFilters } = useOutletContext();
  const { data: policiesData, isLoading } = useGetPolicies();
  const navigate = useNavigate()
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        background: S.bg,
      }}
    >
      <div className="flex-1 overflow-y-auto">
        <HeroSection />
        <div className="p-7 px-8 pb-10 w-full">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <h2 className="text-lg font-bold text-slate-900 m-0">
                  Top Picks for You
                </h2>
                <span className="text-[11px] font-semibold px-2.5 py-0.5 bg-violet-50 text-violet-600 rounded-full border border-violet-300">
                  {TOP_PICKS.length} MATCHES
                </span>
              </div>
              <button 
                onClick={() => navigate("/policies")}
                className="flex items-center gap-1 bg-none border-none cursor-pointer text-sm text-violet-600 font-semibold font-sans hover:text-violet-800 transition-colors"
              >
                View all  <ChevronRightIcon />
              </button>
            </div>

            <div className="flex flex-col gap-3">
              {isLoading ? (
                <BouncingLoader />
              ) : (
                policiesData
                  ?.slice(0, 3)
                  .map((policy) => (
                    <PolicyCard
                      key={policy.id}
                      policy={policy}
                      onClick={() => navigate(`/policy-details/${policy.id}`)}
                    />
                  ))
              )}
            </div>
          </div>

          <PolicyCompare policies={policiesData} />
        </div>
      </div>
    </div>
  );
}

export default InsurancePage;
