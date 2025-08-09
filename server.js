const express = require("express");
const cors = require("cors");
const fs = require("fs");
require("dotenv").config(); 

const app = express();

const allowedOrigins = (process.env.FRONTEND_URL || '').split(',');

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.error(` Blocked by CORS: ${origin}`);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

app.use(express.json());


const doctors = [
  {
    id: 1,
    name: "Dr. Smith",
    specialty: "Cardiologist",
    experience: 12,
    rating: 4.5,
    ratingCount: 150,
    fees: 500,
    photo: "https://randomuser.me/api/portraits/men/1.jpg",
    clinicName: "Heart Care Clinic",
    availableToday: true,
    contactNumber: "1234567890",
    patientStories: 100,
    gender: "male",
    location: "JP Nagar, Bangalore",
  },
  {
    id: 2,
    name: "Dr. Sheelavanthi Natraj",
    specialty: "Dermatologist",
    experience: 8,
    rating: 4.2,
    ratingCount: 80,
    fees: 300,
    photo: "https://randomuser.me/api/portraits/women/2.jpg",
    clinicName: "Skin Health Clinic",
    availableToday: false,
    contactNumber: null,
    patientStories: 1500,
    gender: "female",
    location: "Delhi",
  },
  {
    id: 3,
    name: "Dr. Keshav Ram",
    specialty: "General Physician",
    experience: 8,
    rating: 4.2,
    ratingCount: 80,
    fees: 300,
    photo: "https://images.pexels.com/photos/1170979/pexels-photo-1170979.jpeg",
    clinicName: "Skin Health Clinic",
    availableToday: false,
    contactNumber: null,
    patientStories: 1500,
    gender: "male",
    location: "Bangalore",
  },
  {
    id: 4,
    name: "Dr. Ravindra Raj",
    specialty: "Dermatologist",
    experience: 10,
    rating: 3.9,
    ratingCount: 70,
    fees: 300,
    photo: "https://images.pexels.com/photos/8460123/pexels-photo-8460123.jpeg",
    clinicName: "Health Clinic",
    availableToday: false,
    contactNumber: null,
    patientStories: 500,
    gender: "male",
    location: "Mumbai",
  },
  {
    id: 5,
    name: "Dr. Vinitha Natraj",
    specialty: "Dermatologist",
    experience: 14,
    rating: 4.5,
    ratingCount: 85,
    fees: 400,
    photo: "https://images.pexels.com/photos/8460037/pexels-photo-8460037.jpeg",
    clinicName: "SIMS Health Clinic",
    availableToday: true,
    contactNumber: null,
    patientStories: 1210,
    gender: "female",
    location: "Mumbai",
  },
  {
    id: 6,
    name: "Dr. Raveena",
    specialty: "Pediatrician",
    experience: 21,
    rating: 4.4,
    ratingCount: 100,
    fees: 600,
    photo: "https://images.pexels.com/photos/3845653/pexels-photo-3845653.jpeg",
    clinicName: "Health Clinic",
    availableToday: true,
    contactNumber: null,
    patientStories: 100,
    gender: "female",
    location: "Delhi",
  },
];


app.get("/api/doctors", (req, res) => {
  
  let results = [];

  for (let i = 0; i < doctors.length; i++) {
    results.push(doctors[i]);
  }

  const location = req.query.location;
  const searchQuery = req.query.searchQuery;
  const gender = req.query.gender;
  const minPatientStories = req.query.minPatientStories;
  const minExperience = req.query.minExperience;
  const sortBy = req.query.sortBy;

 
  if (location) {
    let newResults = [];
    for (let i = 0; i < results.length; i++) {
      if (
        results[i].location.toLowerCase().includes(location.toLowerCase())
      ) {
        newResults.push(results[i]);
      }
    }
    results = newResults;
  }

  
  if (searchQuery) {
    let newResults = [];
    for (let i = 0; i < results.length; i++) {
      let query = searchQuery.toLowerCase();
      if (
        results[i].name.toLowerCase().includes(query) ||
        results[i].specialty.toLowerCase().includes(query)
      ) {
        newResults.push(results[i]);
      }
    }
    results = newResults;
  }


  if (gender && (gender === "male" || gender === "female")) {
    let newResults = [];
    for (let i = 0; i < results.length; i++) {
      if (results[i].gender === gender) {
        newResults.push(results[i]);
      }
    }
    results = newResults;
  }

 
  if (minPatientStories) {
    let minStoriesNum = Number(minPatientStories);
    if (minStoriesNum >= 0) {
      let newResults = [];
      for (let i = 0; i < results.length; i++) {
        if (results[i].patientStories >= minStoriesNum) {
          newResults.push(results[i]);
        }
      }
      results = newResults;
    }
  }

  
  if (minExperience) {
    let minExpNum = Number(minExperience);
    if (minExpNum >= 0) {
      let newResults = [];
      for (let i = 0; i < results.length; i++) {
        if (results[i].experience >= minExpNum) {
          newResults.push(results[i]);
        }
      }
      results = newResults;
    }
  }


  if (sortBy) {
    if (sortBy === "experience") {
      for (let i = 0; i < results.length; i++) {
        for (let j = i + 1; j < results.length; j++) {
          if (results[i].experience < results[j].experience) {
            let temp = results[i];
            results[i] = results[j];
            results[j] = temp;
          }
        }
      }
    } else if (sortBy === "rating") {
      for (let i = 0; i < results.length; i++) {
        for (let j = i + 1; j < results.length; j++) {
          if (results[i].rating < results[j].rating) {
            let temp = results[i];
            results[i] = results[j];
            results[j] = temp;
          }
        }
      }
    } else if (sortBy === "fees") {
      for (let i = 0; i < results.length; i++) {
        for (let j = i + 1; j < results.length; j++) {
          if (results[i].fees > results[j].fees) {
            let temp = results[i];
            results[i] = results[j];
            results[j] = temp;
          }
        }
      }
    }
  }

  
  res.json(results);
});


app.post("/api/appointments", (req, res) => {

  const doctorId = req.body.doctorId;
  const date = req.body.date;
  const time = req.body.time;

  
  if (!doctorId || !date || !time) {
    res.status(400).json({ error: "Doctor ID, date, and time are required" });
    return;
  }


  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    res.status(400).json({ error: "Invalid date format. Use YYYY-MM-DD" });
    return;
  }


  if (!/^\d{2}:\d{2}$/.test(time)) {
    res.status(400).json({ error: "Invalid time format. Use HH:MM" });
    return;
  }


  if (isNaN(Date.parse(date))) {
    res.status(400).json({ error: "Invalid date" });
    return;
  }

  
  let doctor = null;
  for (let i = 0; i < doctors.length; i++) {
    if (doctors[i].id === Number(doctorId)) {
      doctor = doctors[i];
      break;
    }
  }


  if (!doctor) {
    res.status(404).json({ error: "Doctor not found" });
    return;
  }

 
  let appointments = [];
  try {
    if (fs.existsSync("appointments.json")) {
      const data = fs.readFileSync("appointments.json", "utf8");
      appointments = JSON.parse(data);
    }
  } catch (error) {
    console.log("Error reading appointments file:", error);
    res.status(500).json({ error: "Server error" });
    return;
  }


  let appointmentsOnDate = 0;
  let sameTimeSlot = false;
  for (let i = 0; i < appointments.length; i++) {
    if (
      appointments[i].doctorId === Number(doctorId) &&
      appointments[i].date === date
    ) {
      appointmentsOnDate++;
      if (appointments[i].time === time) {
        sameTimeSlot = true;
      }
    }
  }

  
  if (sameTimeSlot) {
    res.status(409).json({ error: "Time slot already booked. Please choose another time." });
    return;
  }

 
  if (appointmentsOnDate >= 3) {
    res.status(409).json({ error: "Date is fully booked. Please choose another date." });
    return;
  }


  const appointment = {
    id: Date.now(),
    doctorId: Number(doctorId),
    doctorName: doctor.name,
    clinicName: doctor.clinicName,
    date: date,
    time: time,
    timestamp: new Date().toISOString(),
  };

 
  appointments.push(appointment);


  try {
    fs.writeFileSync("appointments.json", JSON.stringify(appointments, null, 2));
    res.json({ message: "Appointment booked successfully", appointment });
  } catch (error) {
    console.log("Error writing appointments file:", error);
    res.status(500).json({ error: "Server error" });
  }
});


const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log("Server is running on http://localhost:" + PORT);
});