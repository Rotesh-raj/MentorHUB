import mongoose from "mongoose";

const availabilitySchema = new mongoose.Schema(
  {
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    // Real calendar date
    date: {
      type: Date,
      required: true
    },

    // Stored internally in 24-hour format
    startTime: {
      type: String, // Example: "14:00"
      required: true
    },

    endTime: {
      type: String, // Example: "15:00"
      required: true
    },

    // Maximum students allowed in this slot
    maxStudents: {
      type: Number,
      default: 5,
      min: 1
    },

    // Students who booked this slot
    bookedStudents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ]

  },
  { timestamps: true }
);

/* ===================== VIRTUAL FIELDS ===================== */

// Convert 24h → 12h display
availabilitySchema.virtual("startTime12").get(function () {
  return convertTo12Hour(this.startTime);
});

availabilitySchema.virtual("endTime12").get(function () {
  return convertTo12Hour(this.endTime);
});

// Check if slot is full
availabilitySchema.virtual("isFull").get(function () {
  return this.bookedStudents.length >= this.maxStudents;
});

// Check if slot is booked (has any students)
availabilitySchema.virtual("isBooked").get(function () {
  return this.bookedStudents.length > 0;
});

// Check if slot is expired
availabilitySchema.virtual("isExpired").get(function () {
  const now = new Date();
  const slotDateTime = new Date(this.date);
  return slotDateTime < now;
});

/* ===================== HELPER FUNCTION ===================== */

function convertTo12Hour(time) {
  if (!time) return "";

  const [hour, minute] = time.split(":");
  const h = parseInt(hour);

  const suffix = h >= 12 ? "PM" : "AM";
  const newHour = ((h + 11) % 12) + 1;

  return `${newHour}:${minute} ${suffix}`;
}

/* ===================== INDEX (Performance) ===================== */

// Prevent duplicate slot for same teacher + date + time
availabilitySchema.index(
  { teacherId: 1, date: 1, startTime: 1 },
  { unique: true }
);

/* ===================== ENABLE VIRTUALS ===================== */

availabilitySchema.set("toJSON", { virtuals: true });
availabilitySchema.set("toObject", { virtuals: true });

export default mongoose.model("Availability", availabilitySchema);