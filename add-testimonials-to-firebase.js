// Script to add sample testimonials to Firebase
// Run this script in your browser console on your Firebase project page
// or use it as a reference for adding testimonials through your admin panel

const sampleTestimonials = [
  {
    name: "Dr. Sarah Taylor",
    specialty: "Nephrologists",
    image: "assets/images/review-1.jpg",
    review: "Specializing in emergency medicine, Dr. Johnson is prepared of acute illnesses, injuries or conditions. Emergency physicians, or ER doctors, must incorporate knowledge and experience gained across a broad range of medical topics.",
    rating: 5,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Dr. Aiken Ward",
    specialty: "Endocrinologists", 
    image: "assets/images/review-2.jpg",
    review: "Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    rating: 5,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Dr. Eachann Jhon",
    specialty: "Cardiologists",
    image: "assets/images/review-3.jpg", 
    review: "Specializing in emergency medicine, Dr. Johnson is prepared of acute illnesses, injuries or conditions. Emergency physicians, or ER doctors, must incorporate knowledge and experience gained across a broad range of medical topics.",
    rating: 5,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Dr. Smith Jorge",
    specialty: "General Dentist",
    image: "assets/images/review-4.jpg",
    review: "Excellent dental care with modern equipment and a friendly staff. The treatment was painless and the results exceeded my expectations. Highly recommended for anyone looking for quality dental services.",
    rating: 5,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Dr. Aston Alison",
    specialty: "Orthodontist",
    image: "assets/images/review-5.jpg",
    review: "Professional orthodontic treatment with clear communication throughout the process. The team made sure I understood every step of my treatment plan and the results speak for themselves.",
    rating: 5,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

console.log("Sample testimonials data for Firebase:");
console.log(JSON.stringify(sampleTestimonials, null, 2));

// Instructions:
// 1. Go to your Firebase Console
// 2. Navigate to Firestore Database
// 3. Create a new collection called "testimonials"
// 4. Add documents with the above data structure
// 5. Make sure each document has isActive: true
