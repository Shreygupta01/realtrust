import { useEffect, useState } from "react";
import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

function LandingPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [aboutExpanded, setAboutExpanded] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState("");
const handleSubscribe = async () => {
  if (!newsletterEmail) {
    alert("Please enter an email!");
    return;
  }

  try {
    const res = await fetch("http://localhost:5000/api/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: newsletterEmail }),
    });

    const data = await res.json();
    alert(data.message || "Subscribed!");
    setNewsletterEmail("");
  } catch (error) {
    console.error(error);
    alert("Failed to subscribe");
  }
};


  // Form state
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    mobileNumber: "",
    city: "",
  });

  useEffect(() => {
    fetch(API_BASE_URL + "/projects")
      .then((res) => res.json())
      .then((data) => {
        setProjects(data || []);
        setLoading(false);
      });
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(API_BASE_URL + "/contact", form);
      alert("Submitted Successfully!");
      // Clear form
      setForm({
        fullName: "",
        email: "",
        mobileNumber: "",
        city: "",
      });
    } catch (error) {
      console.error(error);
      alert("Failed to submit");
    }
  };

  return (
    <div className="bg-white text-black font-sans">

      {/* NAVBAR */}
      <header className="fixed top-0 left-0 w-full bg-white shadow z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-5 py-4">
          {/* Logo + Brand */}
          <div className="flex items-center gap-2">
            <img src="https://images.crunchbase.com/image/upload/c_pad,f_auto,q_auto:eco,dpr_1/bsbhuu7qiyz3pxurmesl?ik-sanitizeSvg=true" alt="RealTrust Logo" className="w-10 h-10 object-contain"/>
            <div className="text-2xl font-bold text-blue-700">RealTrust</div>
          </div>

          <nav className="hidden md:flex items-center gap-8 font-medium text-gray-700">
            <button onClick={() => scrollTo("home")} className="hover:text-blue-600 transition">Home</button>
            <button onClick={() => scrollTo("services")} className="hover:text-blue-600 transition">Services</button>
            <button onClick={() => scrollTo("about")} className="hover:text-blue-600 transition">About</button>
            <button onClick={() => scrollTo("projects")} className="hover:text-blue-600 transition">Projects</button>
          </nav>
        </div>
      </header>

      <div className="h-20" id="home"></div>

      {/* HERO SECTION */}
      <section
        className="relative w-full py-28 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://img.freepik.com/free-photo/businessman-showing-changes-report_1098-3504.jpg?semt=ais_hybrid&w=1400&q=80')",
        }}
        id="hero"
      >
        <div className="absolute inset-0 bg-white/30"></div>

        <div className="relative max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 px-5">
          <div className="flex flex-col justify-center">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight text-black">
              Consultation, <br /> Design & Marketing
            </h1>
          </div>

          <div className="bg-blue-900 text-white p-8 rounded-xl shadow-xl max-w-md mx-auto hover:shadow-2xl transition-shadow duration-300">
            <h2 className="text-xl font-semibold mb-4">Get a Free Consultation</h2>

            {/* FORM */}
            <form className="space-y-4" onSubmit={handleSubmit}>
              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                value={form.fullName}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded text-black"
              />

              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={form.email}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded text-black"
              />

              <input
                type="text"
                name="mobileNumber"
                placeholder="Mobile Number"
                value={form.mobileNumber}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded text-black"
              />

              <input
                type="text"
                name="city"
                placeholder="City"
                value={form.city}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded text-black"
              />

              <button
                type="submit"
                className="bg-orange-500 w-full py-3 rounded text-white font-semibold hover:bg-orange-600 transition"
              >
                Get Quick Quote
              </button>
            </form>
          </div>
        </div>
      </section>

{/* NOT YOUR AVERAGE REALTOR SECTION */}
<section className="w-full py-24 bg-white relative overflow-hidden">

  {/* 🔵 Background circle left */}
  <div className="absolute -top-20 -left-20 w-72 h-72 bg-blue-100 rounded-full opacity-40 blur-sm"></div>

  {/* 🔵 background faint circle bottom */}
  <div className="absolute -bottom-28 left-10 w-[500px] h-[500px] border-[1px] border-blue-200 rounded-full opacity-40"></div>

  {/* 🔵 small dots */}
  <div className="absolute top-32 left-1/3 w-24 h-24 grid grid-cols-6 gap-1 opacity-40">
    {[...Array(36)].map((_, i) => (
      <div key={i} className="w-1 h-1 bg-blue-200 rounded-full" />
    ))}
  </div>

  {/* 🔵 curve line */}
  <div className="absolute bottom-20 right-10 w-[350px] h-[350px] border-r-2 border-blue-200 rounded-full opacity-40"></div>

  <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 px-6 relative z-20">

    {/* LEFT SIDE */}
    <div className="flex flex-col justify-center">
      <h2 className="text-3xl md:text-4xl font-bold text-blue-600 mb-4">
        Not Your Average Realtor
      </h2>

      <p className="text-gray-600 leading-relaxed max-w-md">
        Real industry experts for seamless property solutions! Excellent
        strategy, design and effective consulting to get maximum value for
        your clients.
      </p>
    </div>

    {/* RIGHT SIDE CIRCLES */}
    <div className="relative flex justify-center items-center md:mt-0 mt-10">

      {/* Big Center Image */}
      <div className="w-52 h-52 md:w-64 md:h-64 rounded-full overflow-hidden shadow-lg border-4 border-white relative z-20">
        <img src="data:image/jpeg;base64,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" className="w-full h-full object-cover" />
      </div>

      {/* Top Small Circle */}
      <div className="w-32 h-32 rounded-full overflow-hidden shadow-xl border-4 border-white absolute -top-6 -right-6 md:-right-12 md:-top-8 z-10">
        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSgbSFFkJtj01URQrptasRN_9m2QDnM0tk0pg&s" className="w-full h-full object-cover" />
      </div>

      {/* Bottom Small Circle */}
      <div className="w-32 h-32 rounded-full overflow-hidden shadow-xl border-4 border-white absolute -bottom-6 -right-4 md:-bottom-10 md:-right-10 z-10">
        <img src="data:image/jpeg;base64,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" className="w-full h-full object-cover" />
      </div>

    </div>
  </div>
</section>

{/* WHY CHOOSE US */}
<section id="services" className="py-20 bg-white text-center">
  <h2 className="text-3xl font-bold text-blue-700 mb-5">Why Choose Us?</h2>

  <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 mt-10 px-6">
    {[
      {
        img: "https://static.vecteezy.com/system/resources/thumbnails/048/738/418/small/initial-m-letter-logo-design-marketing-and-investment-business-and-marketing-logo-premium-vector.jpg",
        title: "High ROI Strategy",
        desc: "Achieve maximum returns with our optimized planning.",
      },
      {
        img: "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg",
        title: "Premium Design",
        desc: "Modern, clean and impactful design solutions.",
      },
      {
        img: "https://images.pexels.com/photos/3184405/pexels-photo-3184405.jpeg",
        title: "Smart Marketing",
        desc: "Grow your business with advanced digital marketing.",
      },
    ].map((item, i) => (
      <div
        key={i}
        className="shadow-lg p-6 rounded-xl hover:scale-105 transition-transform duration-300"
      >
        <img src={item.img} className="mx-auto w-16 h-16 object-cover rounded-lg" />
        <h3 className="font-bold text-xl mt-4">{item.title}</h3>
        <p className="text-gray-500 text-sm mt-2">{item.desc}</p>
      </div>
    ))}
  </div>
</section>

{/* Middle Images Section with Background */}
<section className="relative py-20 bg-blue-50 overflow-hidden">
  {/* Background abstract shapes */}
  <div className="absolute top-0 left-0 w-80 h-80 bg-blue-100 rounded-full opacity-30 -translate-x-1/3 -translate-y-1/3"></div>
  <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-100 rounded-full opacity-30 translate-x-1/4 translate-y-1/4"></div>

  <div className="max-w-6xl mx-auto relative flex justify-center items-center gap-8">
    <div className="relative w-40 h-40">
      <img
        src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg"
        className="w-full h-full object-cover rounded-lg shadow-lg"
      />
      <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-orange-500"></div>
    </div>

    <div className="relative w-56 h-56">
      <img
        src="https://images.pexels.com/photos/3184439/pexels-photo-3184439.jpeg"
        className="w-full h-full object-cover rounded-lg shadow-lg"
      />
      <div className="absolute -top-2 -left-2 w-6 h-6 bg-blue-500"></div>
    </div>

    <div className="relative w-40 h-40">
      <img
        src="https://images.pexels.com/photos/3184405/pexels-photo-3184405.jpeg"
        className="w-full h-full object-cover rounded-lg shadow-lg"
      />
      <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-orange-500"></div>
    </div>
  </div>
</section>



      {/* ABOUT US */}
      <section id="about" className="py-20 bg-gray-50 text-center">
        <h2 className="text-3xl font-bold text-blue-700 mb-6">About Us</h2>

        <p className="max-w-4xl mx-auto text-gray-600 text-lg leading-relaxed">
          We provide consultation, design & marketing services to help your business grow.
        </p>

        <div className={`max-w-4xl mx-auto mt-4 text-gray-700 transition-all duration-500 ${aboutExpanded ? "max-h-screen" : "max-h-0 overflow-hidden"}`}>
          <p className="mt-4">
            Our expert team delivers modern design, business strategy and ROI-driven marketing solutions.
          </p>
          <p className="mt-2">
            We ensure a seamless experience from consultation to execution, making your business stand out.
          </p>
          <p className="mt-2">
            Innovation, creativity, and results-driven strategies are the backbone of our approach.
          </p>
        </div>

        <button
          onClick={() => setAboutExpanded(!aboutExpanded)}
          className="mt-6 px-6 py-3 border border-blue-700 text-blue-700 rounded-lg font-semibold hover:bg-blue-700 hover:text-white transition"
        >
          {aboutExpanded ? "Show Less" : "Learn More"}
        </button>
      </section>

      {/* PROJECTS */}
      <section id="projects" className="py-20 bg-white text-center">
        <h2 className="text-3xl font-bold text-blue-700">Our Projects</h2>
        {loading && <p className="mt-6 text-gray-500">Loading...</p>}
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 mt-12 px-6">
          {projects.map((p) => (
            <div key={p._id} className="border rounded-xl shadow-md overflow-hidden hover:shadow-2xl transition-shadow duration-300">
              <img src={p.imageUrl} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h3 className="font-bold text-lg">{p.name}</h3>
                <p className="text-gray-600 text-sm mt-2">{p.description}</p>
                <button className="mt-4 bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition">
                  See More
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

    {/* HAPPY CLIENTS */}
<section className="py-20 bg-gray-50 text-center">
  <h2 className="text-3xl font-bold text-blue-700">Happy Clients</h2>

  <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 mt-12 px-6">
    {[
      {
        img: "https://randomuser.me/api/portraits/men/32.jpg",
        name: "Arjun Mehta",
        rating: 5,
        review:
          "Outstanding service! They guided me throughout the entire process very smoothly.",
      },
      {
        img: "https://randomuser.me/api/portraits/women/44.jpg",
        name: "Sneha Kapoor",
        rating: 4,
        review:
          "Great experience! Their design and consultation boosted my business performance.",
      },
      {
        img: "https://randomuser.me/api/portraits/men/76.jpg",
        name: "Rahul Singh",
        rating: 5,
        review:
          "Highly professional team and very friendly approach. Totally worth it!",
      },
      {
        img: "https://randomuser.me/api/portraits/women/68.jpg",
        name: "Riya Sharma",
        rating: 5,
        review:
          "Amazing support and excellent marketing strategies. Helped me grow fast!",
      },
    ].map((client, i) => (
      <div
        key={i}
        className="rounded-xl p-6 shadow bg-white hover:scale-105 transition-transform duration-300"
      >
        <img
          src={client.img}
          className="w-20 h-20 rounded-full mx-auto object-cover"
          alt={client.name}
        />

        {/* Client Name */}
        <h3 className="font-bold text-lg mt-4">{client.name}</h3>

        {/* Star Rating */}
        <div className="flex justify-center mt-2 text-yellow-400 text-lg">
          {"★".repeat(client.rating)}
          {"☆".repeat(5 - client.rating)}
        </div>

        {/* Review */}
        <p className="text-gray-600 text-sm mt-3 leading-relaxed">
          {client.review}
        </p>
      </div>
    ))}
  </div>
</section>
<section
  className="relative h-[350px] flex items-center justify-center bg-cover bg-center"
  style={{
    backgroundImage:
      "url('https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1500&q=80')",
  }}
>
  {/* Light Shadow Overlay */}
  <div className="absolute inset-0 bg-black bg-opacity-30 backdrop-blur-[2px]"></div>

  {/* Text Container */}
  <div className="relative text-center text-white max-w-xl px-4">
    <h2 className="text-2xl md:text-3xl font-semibold leading-relaxed drop-shadow-lg">
      Learn more about our listing process, staging & design work.
    </h2>
  </div>
</section>

{/* ALWAYS VISIBLE CONTENT */}
<div className="overflow-hidden bg-gray-50 py-10">
  <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-3 gap-8">
    {/* Card 1 */}
    <div className="p-6 shadow-md bg-white rounded-2xl hover:shadow-xl transition">
      <h3 className="font-bold text-lg mb-2 text-blue-700">Listing Process</h3>
      <p className="text-gray-600 leading-relaxed">
        We guide you step-by-step — from evaluation to perfect presentation —
        ensuring your property gets the highest visibility and engagement.
      </p>
    </div>

    {/* Card 2 */}
    <div className="p-6 shadow-md bg-white rounded-2xl hover:shadow-xl transition">
      <h3 className="font-bold text-lg mb-2 text-blue-700">Staging</h3>
      <p className="text-gray-600 leading-relaxed">
        With modern design techniques, we transform spaces into warm,
        attractive, and buyer-friendly environments.
      </p>
    </div>

    {/* Card 3 */}
    <div className="p-6 shadow-md bg-white rounded-2xl hover:shadow-xl transition">
      <h3 className="font-bold text-lg mb-2 text-blue-700">Interior Design</h3>
      <p className="text-gray-600 leading-relaxed">
        Our interior design experts craft stylish, balanced setups that bring
        out the true beauty of your property.
      </p>
    </div>
  </div>
</div>

    
    
{/* NEWSLETTER */}
<section className="bg-blue-600 text-white py-10">
  <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 items-center px-6 gap-6">
    
    {/* Navigation links */}
    <div className="flex flex-wrap justify-center md:justify-start gap-6 text-sm font-medium">
      <button onClick={() => scrollTo('home')}>Home</button>
      <button onClick={() => scrollTo('services')}>Services</button>
      <button onClick={() => scrollTo('projects')}>Projects</button>
      <button onClick={() => scrollTo('about')}>About</button>
    </div>

    {/* Newsletter Subscription */}
    <div className="flex justify-center md:justify-end col-span-2 gap-3">
      
      <input
        type="email"
        placeholder="Enter Email Address..."
        value={newsletterEmail}
        onChange={(e) => setNewsletterEmail(e.target.value)}
        className="px-4 py-2 rounded-lg text-black w-60"
      />

      <button
        onClick={handleSubscribe}
        className="bg-white text-blue-700 font-semibold px-5 py-2 rounded-lg shadow hover:bg-gray-200 transition"
      >
        Subscribe
      </button>

    </div>

  </div>
</section>


      {/* FOOTER */}
      <footer className="bg-[#1a1c2d] text-white py-8">
        <div className="max-w-7xl mx-auto text-center space-y-3">
          <p className="text-sm text-gray-300">All Rights Reserved © 2025</p>
          <div className="flex items-center justify-center gap-3">
            <img src="https://images.crunchbase.com/image/upload/c_pad,f_auto,q_auto:eco,dpr_1/bsbhuu7qiyz3pxurmesl?ik-sanitizeSvg=true" alt="logo" className="w-8" />
            <span className="font-bold text-lg">RealTrust</span>
          </div>
          <div className="flex justify-center gap-4 mt-3">
            <div className="w-8 h-8 bg-white rounded-full"></div>
            <div className="w-8 h-8 bg-white rounded-full"></div>
            <div className="w-8 h-8 bg-white rounded-full"></div>
            <div className="w-8 h-8 bg-white rounded-full"></div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;



