import React from 'react';

const About = () => {
  return (
    <div className="bg-black text-white min-h-screen px-6 py-16 space-y-24">

      <section className="max-w-6xl mx-auto mt-12">
        <h2 className="text-4xl font-bold text-center mb-10 animate-fade-in">Our Mission & Vision</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-gray-900 rounded-lg shadow-lg p-6 hover:shadow-blue-500/30 transition duration-300">
            <h3 className="text-2xl font-semibold text-blue-400 mb-4">Mission</h3>
            <p className="text-gray-300 leading-relaxed">
              At <span className="text-blue-400 font-medium">JobConnect</span>, our mission is to empower communities by connecting local job seekers with meaningful, temporary, and part-time opportunities.
            </p>
          </div>

          <div className="bg-gray-900 rounded-lg shadow-lg p-6 hover:shadow-blue-500/30 transition duration-300">
            <h3 className="text-2xl font-semibold text-blue-400 mb-4">Vision</h3>
            <p className="text-gray-300 leading-relaxed">
              We envision a future where anyone in Kiambu County can access employment as easily as sending a text regardless of background, skill level, or circumstance.
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto mt-16">
        <h2 className="text-4xl font-bold mb-8 text-center animate-fade-in">Our Location</h2>
        <p className="text-center text-gray-300 mb-6">
          We proudly operate in the heart of Kiambu County, committed to serving neighborhoods from Thika to Ruiru and everywhere in between.
        </p>
        <div className="rounded-lg overflow-hidden shadow-xl">
          <iframe
            title="Kiambu Street Map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d127669.77941420916!2d36.76396851848955!3d-1.1066894007977069!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f1506bd2acbdb%3A0x6f3073ae27c9e593!2sKiambu%20County!5e0!3m2!1sen!2ske!4v1659530334023!5m2!1sen!2ske"
            width="100%"
            height="400"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            className="w-full"
          ></iframe>
        </div>
      </section>

      <section className="max-w-6xl mx-auto mt-16">
        <h2 className="text-4xl font-bold mb-8 text-center animate-fade-in">Working Hours</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 text-center">
          {[
            { day: 'Monday', hours: '8:00 AM – 5:00 PM' },
            { day: 'Tuesday', hours: '8:00 AM – 5:00 PM' },
            { day: 'Wednesday', hours: '8:00 AM – 5:00 PM' },
            { day: 'Thursday', hours: '8:00 AM – 5:00 PM' },
            { day: 'Friday', hours: '8:00 AM – 5:00 PM' },
            { day: 'Saturday', hours: '9:00 AM – 1:00 PM' },
          ].map(({ day, hours }) => (
            <div key={day} className="bg-gray-800 p-6 rounded-lg hover:bg-gray-700 transition duration-300">
              <h3 className="text-xl font-semibold text-blue-400">{day}</h3>
              <p className="text-gray-300">{hours}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default About;
