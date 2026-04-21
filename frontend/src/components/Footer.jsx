import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 mt-12 transition-colors duration-200">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <span className="text-xl font-black text-pink-600 dark:text-pink-400 tracking-tighter">TS FAN HUB</span>
            <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm max-w-sm text-center md:text-left">
              The ultimate destination for Taylor Swift fans. Explore albums, interact with songs, and connect with the community.
            </p>
          </div>
          <div className="flex space-x-6">
            <Link to="/" className="text-gray-500 hover:text-pink-600 dark:hover:text-pink-400 transition-colors">Home</Link>
            <Link to="/about" className="text-gray-500 hover:text-pink-600 dark:hover:text-pink-400 transition-colors">About</Link>
            <Link to="/albums" className="text-gray-500 hover:text-pink-600 dark:hover:text-pink-400 transition-colors">Albums</Link>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-200 dark:border-gray-800 pt-8 flex justify-center">
          <p className="text-gray-400 dark:text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Taylor Swift Fan Hub. Built for fans, by fans.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
