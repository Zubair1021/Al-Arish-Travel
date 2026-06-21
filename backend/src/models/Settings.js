import mongoose from "mongoose";

const SETTINGS_ID = "main";

const settingsSchema = new mongoose.Schema(
  {
    _id: { type: String, default: SETTINGS_ID },

    siteName: { type: String, default: "Al Arish Travel" },
    tagline: {
      type: String,
      default:
        "Trusted UK-based specialists helping pilgrims experience a stress-free and spiritual journey to the Holy Cities.",
    },

    email: { type: String, default: "info@alarishtravel.co.uk" },
    phone: { type: String, default: "+44 20 1234 5678" },
    address: { type: String, default: "123 High Street, London, UK" },
    businessHours: { type: String, default: "Mon-Sat, 9am-9pm GMT" },

    whatsappNumber: { type: String, default: "923000000000" },
    whatsappMessage: {
      type: String,
      default:
        "Assalamu Alaikum, I'd like to know more about Al Arish Travel Hajj & Umrah packages.",
    },

    socials: {
      facebook: { type: String, default: "" },
      instagram: { type: String, default: "" },
      twitter: { type: String, default: "" },
      youtube: { type: String, default: "" },
    },
  },
  { timestamps: true },
);

settingsSchema.statics.getSingleton = async function () {
  let doc = await this.findById(SETTINGS_ID);
  if (!doc) {
    doc = await this.create({ _id: SETTINGS_ID });
  }
  return doc;
};

settingsSchema.methods.toPublicJSON = function () {
  return {
    siteName: this.siteName,
    tagline: this.tagline,
    email: this.email,
    phone: this.phone,
    address: this.address,
    businessHours: this.businessHours,
    whatsappNumber: this.whatsappNumber,
    whatsappMessage: this.whatsappMessage,
    socials: {
      facebook: this.socials?.facebook || "",
      instagram: this.socials?.instagram || "",
      twitter: this.socials?.twitter || "",
      youtube: this.socials?.youtube || "",
    },
  };
};

export const Settings = mongoose.model("Settings", settingsSchema);
export { SETTINGS_ID };
