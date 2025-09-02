import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, Calendar, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import logo from "../../assets/logo.png"; 
const Footer = () => {
  return (
    <footer className="bg-[#179ac8] text-white py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Section */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <img 
                src={logo}
                alt="Eventor Logo" 
                className="w-24"
              />
              {/* <h3 className="text-2xl font-bold">Eventor</h3> */}
            </div>
            <p className="text-sm text-blue-100">
              Your premier event management platform. Create, manage, and experience unforgettable events with ease.
            </p>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="hover:text-blue-200 transition-colors duration-200 flex items-center">
                  <span>Home</span>
                </Link>
              </li>
              <li>
                <Link to="/events" className="hover:text-blue-200 transition-colors duration-200 flex items-center">
                  <span>Events</span>
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-blue-200 transition-colors duration-200 flex items-center">
                  <span>Contact Us</span>
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-blue-200 transition-colors duration-200 flex items-center">
                  <span>About Us</span>
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contact & Social Media */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Get in Touch</h3>
            <div className="space-y-3 mb-6">
              <p className="flex items-center space-x-2">
                <Mail className="h-5 w-5 text-blue-200" />
                <span className="text-sm">info@eventor.com</span>
              </p>
              <p className="flex items-center space-x-2">
                <Phone className="h-5 w-5 text-blue-200" />
                <span className="text-sm">+1 (555) 123-4567</span>
              </p>
              <p className="flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-blue-200" />
                <span className="text-sm">123 Event Street, City, State</span>
              </p>
            </div>
            
            <div className="flex space-x-4">
              <a href="#" className="hover:text-blue-200 transition-colors duration-200" aria-label="Facebook">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" className="hover:text-blue-200 transition-colors duration-200" aria-label="Twitter">
                <Twitter className="h-6 w-6" />
              </a>
              <a href="#" className="hover:text-blue-200 transition-colors duration-200" aria-label="Instagram">
                <Instagram className="h-6 w-6" />
              </a>
              <a href="#" className="hover:text-blue-200 transition-colors duration-200" aria-label="LinkedIn">
                <Linkedin className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="border-t border-blue-300 mt-8 pt-6 text-center">
          <p className="text-sm text-blue-100">
            &copy; {new Date().getFullYear()} Eventor. All Rights Reserved. | 
            <Link to="/privacy" className="hover:text-blue-200 ml-2 transition-colors duration-200">Privacy Policy</Link> | 
            <Link to="/terms" className="hover:text-blue-200 ml-2 transition-colors duration-200">Terms of Service</Link>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;