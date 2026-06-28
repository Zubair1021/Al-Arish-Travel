import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import { motion } from "framer-motion";
import { submitQuote } from "../../api/submissions";
import Select from "../ui/Select";
import { usePackages } from "../../context/PackagesContext";
import { useToast } from "../../context/ToastContext";
import {
  ENQUIRY_FIELD_ORDER,
  hasFormErrors,
  validateEnquiryForm,
} from "../../utils/validateEnquiryForm";
import { ArrowRightIcon, ClockIcon, ShieldCheckIcon } from "./heroIcons";
import "../../styles/form-fields.css";

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  package: "",
};

function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92Z" />
    </svg>
  );
}

function PackageIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
      <path d="m3.3 7 8.7 5 8.7-5M12 22V12" />
    </svg>
  );
}

export default function HeroQuoteForm() {
  const { packages } = usePackages();
  const { push: pushToast } = useToast();
  const [form, setForm] = useState(emptyForm);
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const packageOptions = useMemo(
    () => [
      ...packages.map((pkg) => ({
        value: pkg.name,
        label: `${pkg.name} — from ${pkg.currency}${pkg.price.toLocaleString()} pp`,
      })),
      { value: "Custom enquiry", label: "Custom enquiry — tailored to your needs" },
    ],
    [packages],
  );

  useEffect(() => {
    if (!form.package && packages.length) {
      setForm((f) => ({ ...f, package: packages[0].name }));
    }
  }, [packages, form.package]);

  const update = (key: keyof typeof emptyForm) => (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) {
      setErrors((current) => ({ ...current, [key]: "" }));
    }
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (status === "submitting") return;

    const fieldErrors = validateEnquiryForm(form);
    if (hasFormErrors(fieldErrors)) {
      setErrors(fieldErrors);
      pushToast({
        title: "Please complete required fields",
        body: "Name, email and phone are required.",
        tone: "error",
        duration: 6000,
      });
      const first = ENQUIRY_FIELD_ORDER.find((key) => fieldErrors[key]);
      if (first) {
        document.getElementById(`hero-quote-${first}`)?.focus();
      }
      return;
    }

    const selectedPkg = packages.find((pkg) => pkg.name === form.package);

    setErrors({});
    setStatus("submitting");
    try {
      await submitQuote({
        name: form.name,
        email: form.email,
        phone: form.phone,
        message: "",
        packageSlug: selectedPkg?.id,
        packageName: form.package,
        packageDuration: selectedPkg?.duration,
        packagePrice: selectedPkg
          ? `${selectedPkg.currency}${selectedPkg.price.toLocaleString()} per person`
          : "",
      });
      setStatus("success");
      pushToast({
        title: "Quote request received",
        body: "Our UK team will reply within one working hour.",
        tone: "success",
      });
      setForm((f) => ({ ...f, name: "", email: "", phone: "" }));
      setTimeout(() => setStatus("idle"), 4000);
    } catch (error: unknown) {
      setStatus("idle");
      pushToast({
        title: "Could not send your request",
        body:
          error instanceof Error
            ? error.message
            : "Please try again or contact us on WhatsApp.",
        tone: "error",
        duration: 7000,
      });
    }
  };

  const buttonLabel =
    status === "submitting"
      ? "Sending…"
      : status === "success"
        ? "Thank you!"
        : "Get My Quote";

  return (
    <motion.div
      id="hero-quote"
      className="hero-quote"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ type: "spring", stiffness: 220, damping: 28 }}
    >
      <div className="hero-quote-panel">
        <span className="hero-quote-shine" aria-hidden="true" />

        <header className="hero-quote-head">
          <div className="hero-quote-head-main">
            <span className="hero-quote-chip">
              <ClockIcon />
              Reply within 1 hour
            </span>
            <strong className="hero-quote-title">Get Your Free Quote</strong>
            <p className="hero-quote-sub">
              Share your details and our UK team will prepare a personalised package.
            </p>
          </div>
          <ul className="hero-quote-perks" aria-label="Benefits">
            <li>
              <ShieldCheckIcon />
              ATOL Protected
            </li>
            <li>No obligation</li>
            <li>UK support</li>
          </ul>
        </header>

        <form className="hero-quote-form" onSubmit={submit} noValidate>
          <div className="hero-quote-row">
            <label className="hero-quote-field" htmlFor="hero-quote-name">
              <span className="hero-quote-label">Full name</span>
              <span className="hero-quote-input-wrap">
                <UserIcon />
                <input
                  id="hero-quote-name"
                  name="name"
                  value={form.name}
                  onChange={update("name")}
                  placeholder="Your full name"
                  autoComplete="name"
                  className={errors.name ? "has-error" : ""}
                  aria-invalid={errors.name ? "true" : undefined}
                  aria-describedby={errors.name ? "hero-quote-name-error" : undefined}
                />
              </span>
              {errors.name && (
                <p id="hero-quote-name-error" className="field-error" role="alert">
                  {errors.name}
                </p>
              )}
            </label>

            <label className="hero-quote-field" htmlFor="hero-quote-email">
              <span className="hero-quote-label">Email address</span>
              <span className="hero-quote-input-wrap">
                <MailIcon />
                <input
                  id="hero-quote-email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={update("email")}
                  placeholder="you@example.com"
                  autoComplete="email"
                  className={errors.email ? "has-error" : ""}
                  aria-invalid={errors.email ? "true" : undefined}
                  aria-describedby={errors.email ? "hero-quote-email-error" : undefined}
                />
              </span>
              {errors.email && (
                <p id="hero-quote-email-error" className="field-error" role="alert">
                  {errors.email}
                </p>
              )}
            </label>

            <label className="hero-quote-field" htmlFor="hero-quote-phone">
              <span className="hero-quote-label">Phone number</span>
              <span className="hero-quote-input-wrap">
                <PhoneIcon />
                <input
                  id="hero-quote-phone"
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={update("phone")}
                  placeholder="+44 7..."
                  autoComplete="tel"
                  className={errors.phone ? "has-error" : ""}
                  aria-invalid={errors.phone ? "true" : undefined}
                  aria-describedby={errors.phone ? "hero-quote-phone-error" : undefined}
                />
              </span>
              {errors.phone && (
                <p id="hero-quote-phone-error" className="field-error" role="alert">
                  {errors.phone}
                </p>
              )}
            </label>
          </div>

          <div className="hero-quote-row hero-quote-row-action">
            <div className="hero-quote-field hero-quote-field-select">
              <span className="hero-quote-label" id="hero-quote-package-label">
                <PackageIcon />
                Select package
              </span>
              <Select
                id="hero-quote-package"
                value={form.package}
                onChange={(v) => {
                  setForm((f) => ({ ...f, package: v }));
                }}
                options={packageOptions}
                theme="public"
                size="md"
                ariaLabel="Package"
                placeholder="Choose a package"
                className="hero-quote-select"
                dropdownClassName="hero-quote-select-pop"
                dropdownMinWidth={340}
              />
            </div>

            <button
              type="submit"
              className={`hero-quote-submit${status === "success" ? " is-success" : ""}`}
              disabled={status === "submitting"}
            >
              {status === "submitting" && (
                <span className="hero-quote-spinner" aria-hidden="true" />
              )}
              <span>{buttonLabel}</span>
              {status === "idle" && <ArrowRightIcon className="hero-quote-submit-icon" />}
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}
