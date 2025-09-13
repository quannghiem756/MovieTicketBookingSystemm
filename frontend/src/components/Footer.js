// components/Footer.js
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-6 mt-auto">
      <div className="container mx-auto px-4 text-center">
        <p>&copy; 2025 MovieTicketBooking. All rights reserved.</p>
        <div className="flex justify-center gap-4 mt-2">
          <a href="/about" className="text-blue-400 hover:text-blue-300 transition-colors">About Us</a>
          <a href="/contact" className="text-blue-400 hover:text-blue-300 transition-colors">Contact</a>
          <a href="/privacy" className="text-blue-400 hover:text-blue-300 transition-colors">Privacy Policy</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;