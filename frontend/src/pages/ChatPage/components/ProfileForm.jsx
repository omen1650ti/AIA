import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  MapPin,
  Calculator,
  ShieldCheck,
  Briefcase,
  AlertTriangle,
  Stethoscope,
  Users,
  Baby,
  Wallet,
} from "lucide-react";
import { T } from "../styles/theme";

const ProfileForm = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    age: "",
    location: "",
    job: "",
    job_risk: "low",
    preexisting_disease: "",
    has_spouse: false,
    has_child: false,
    spouse_pregnant: false,
    spending_readiness: 5,
    risk_profile: "moderate",
    preferences: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const inputStyle = {
    width: "100%",
    padding: "10px 12px",
    borderRadius: T.radius.sm,
    border: `1px solid ${T.border}`,
    fontSize: 14,
    outline: "none",
    background: "#f9fafb",
    transition: "border-color 0.2s",
  };

  const labelStyle = {
    display: "flex",
    alignItems: "center",
    gap: 6,
    fontSize: 12,
    fontWeight: 600,
    color: T.textSecondary,
    marginBottom: 6,
  };

  const checkboxGroupStyle = {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "8px 0",
  };

  const checkboxLabelStyle = {
    display: "flex",
    alignItems: "center",
    gap: 6,
    fontSize: 13,
    color: T.textPrimary,
    cursor: "pointer",
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 20 }}
      style={{
        background: T.cardBg,
        borderRadius: T.radius.lg,
        padding: 24,
        boxShadow: T.shadow.card,
        border: `1px solid ${T.border}`,
        width: "100%",
        maxWidth: 450,
        margin: "0 auto",
        maxHeight: "80vh",
        overflowY: "auto",
        scrollbarWidth: "none",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 24,
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            background: T.purpleLight,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: T.purple,
          }}
        >
          <ShieldCheck size={22} />
        </div>
        <div>
          <h3
            style={{
              margin: 0,
              fontSize: 18,
              fontWeight: 700,
              color: T.textPrimary,
            }}
          >
            Personalize Your Plan
          </h3>
          <p style={{ margin: 0, fontSize: 13, color: T.textSecondary }}>
            Help us find your perfect insurance match
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: 20 }}
      >
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}
        >
          <div>
            <label style={labelStyle}>
              <User size={14} /> Age
            </label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              placeholder="e.g. 28"
              style={inputStyle}
              required
            />
          </div>
          <div>
            <label style={labelStyle}>
              <MapPin size={14} /> Location
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g. Mumbai"
              style={inputStyle}
              required
            />
          </div>
        </div>

        <div>
          <label style={labelStyle}>
            <Briefcase size={14} /> Profession / Job
          </label>
          <input
            type="text"
            name="job"
            value={formData.job}
            onChange={handleChange}
            placeholder="e.g. Software Engineer"
            style={inputStyle}
            required
          />
        </div>

        <div>
          <label style={labelStyle}>
            <AlertTriangle size={14} /> Job Risk Level
          </label>
          <select
            name="job_risk"
            value={formData.job_risk}
            onChange={handleChange}
            style={inputStyle}
          >
            <option value="low">Low (Desk job, remote)</option>
            <option value="medium">Medium (On-site, travel)</option>
            <option value="high">High (Industrial, hazardous)</option>
          </select>
        </div>

        <div>
          <label style={labelStyle}>
            <Stethoscope size={14} /> Pre-existing Diseases
          </label>
          <input
            type="text"
            name="preexisting_disease"
            value={formData.preexisting_disease}
            onChange={handleChange}
            placeholder="e.g. Diabetes, None"
            style={inputStyle}
          />
        </div>

        <div>
          <label style={labelStyle}>
            <Users size={14} /> Family Details
          </label>
          <div style={checkboxGroupStyle}>
            <label style={checkboxLabelStyle}>
              <input
                type="checkbox"
                name="has_spouse"
                checked={formData.has_spouse}
                onChange={handleChange}
              />
              Spouse
            </label>
            <label style={checkboxLabelStyle}>
              <input
                type="checkbox"
                name="has_child"
                checked={formData.has_child}
                onChange={handleChange}
              />
              Child
            </label>
          </div>
        </div>

        {formData.has_spouse && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
          >
            <label style={checkboxLabelStyle}>
              <Baby size={14} color={T.purple} />
              <input
                type="checkbox"
                name="spouse_pregnant"
                checked={formData.spouse_pregnant}
                onChange={handleChange}
              />
              Spouse is pregnant
            </label>
          </motion.div>
        )}

        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 6,
            }}
          >
            <label style={{ ...labelStyle, marginBottom: 0 }}>
              <Wallet size={14} /> Spending Readiness
            </label>
            <span style={{ fontSize: 13, fontWeight: 700, color: T.purple }}>
              {formData.spending_readiness} / 10
            </span>
          </div>
          <input
            type="range"
            min="1"
            max="10"
            name="spending_readiness"
            value={formData.spending_readiness}
            onChange={handleChange}
            style={{ width: "100%", accentColor: T.purple }}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: 10,
              color: T.textMuted,
            }}
          >
            <span>Economical</span>
            <span>Premium</span>
          </div>
        </div>

        <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
          <button
            type="button"
            onClick={onCancel}
            style={{
              flex: 1,
              padding: "12px",
              borderRadius: T.radius.md,
              border: `1px solid ${T.border}`,
              background: "white",
              color: T.textSecondary,
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            style={{
              flex: 2,
              padding: "12px",
              borderRadius: T.radius.md,
              border: "none",
              background: T.purpleGrad,
              color: "white",
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
              boxShadow: T.shadow.send,
            }}
          >
            Find My Policy
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default ProfileForm;
