import React from "react";
import { assets } from "../assets/frontend_assets/assets";

const Footer = () => {
  return (
    <div className="bg-white text-black py-12 px-4 border-t">

      <div className="max-w-7xl mx-auto">

        {/* Top Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8">

          {/* Logo + About */}
          <div className="md:col-span-2">

            {/* Logo */}
            <div className="flex items-center gap-3 mb-4">
              <img
                src={assets.logo}   
                alt="Forever Fashion"
                className="w-25 h-25 object-contain"
              />

              
            </div>

            <p className="text-gray-600 text-sm leading-relaxed mb-4">
              Forever Fashion brings you premium quality clothing with
              modern designs and unbeatable comfort.
            </p>

            {/* Contact Info */}
            <div className="space-y-2 text-sm text-gray-700">

              <p>📍 Lucknow, Uttar Pradesh, India</p>

              <p>
                📞 +91 98765 43210
              </p>

              <p>
                ✉️ support@foreverfashion.com
              </p>

            </div>

          </div>


          {/* Company */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>

            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-600 hover:text-black transition">
                  About Us
                </a>
              </li>

              <li>
                <a href="#" className="text-gray-600 hover:text-black transition">
                  Careers
                </a>
              </li>

              <li>
                <a href="#" className="text-gray-600 hover:text-black transition">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>


          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Customer Service</h3>

            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-600 hover:text-black transition">
                  Help Center
                </a>
              </li>

              <li>
                <a href="#" className="text-gray-600 hover:text-black transition">
                  Returns & Exchanges
                </a>
              </li>

              <li>
                <a href="#" className="text-gray-600 hover:text-black transition">
                  Shipping Information
                </a>
              </li>
            </ul>
          </div>


          {/* Legal */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>

            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-600 hover:text-black transition">
                  Privacy Policy
                </a>
              </li>

              <li>
                <a href="#" className="text-gray-600 hover:text-black transition">
                  Terms of Service
                </a>
              </li>

              <li>
                <a href="#" className="text-gray-600 hover:text-black transition">
                  Cookie Policy
                </a>
              </li>
            </ul>
          </div>

        </div>


        {/* Bottom Section */}
        <div className="border-t mt-10 pt-6 text-center text-gray-500 text-sm">

          © {new Date().getFullYear()} Forever Fashion. All rights reserved.

        </div>

      </div>
    </div>
  );
};

export default Footer;
