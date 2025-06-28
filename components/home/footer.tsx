import React from "react";
import Link from "next/link";
import { Button } from "../ui/button";
import { Github, Linkedin, Mail, Twitter, Heart, Sparkles } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative mt-24 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-300/5 dark:bg-blue-600/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-emerald-300/5 dark:bg-teal-600/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10">
        {/* Main Footer Content */}
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Brand Section */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center space-x-3 group">
                <div className="relative">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-emerald-600 dark:from-blue-600 dark:to-teal-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div className="absolute -inset-1 bg-gradient-to-br from-purple-600 to-emerald-600 dark:from-blue-600 dark:to-teal-600 rounded-xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-2xl gradient-text">
                    Sakibur
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                    Full-Stack Developer
                  </span>
                </div>
              </div>

              <p className="text-gray-600 dark:text-gray-300 max-w-md leading-relaxed">
                Passionate about creating exceptional digital experiences with
                modern technologies. Let's build something amazing together.
              </p>

              {/* Social Links */}
              <div className="flex items-center space-x-4">
                <Link href="https://github.com" className="group">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/10 to-emerald-500/10 dark:from-blue-500/10 dark:to-teal-500/10 border border-purple-200/50 dark:border-blue-800/50 flex items-center justify-center group-hover:scale-110 group-hover:border-purple-300 dark:group-hover:border-blue-600 transition-all duration-300">
                    <Github className="w-5 h-5 text-purple-600 dark:text-blue-400 group-hover:text-purple-700 dark:group-hover:text-blue-300 transition-colors" />
                  </div>
                </Link>

                <Link href="https://linkedin.com" className="group">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/10 to-emerald-500/10 dark:from-blue-500/10 dark:to-teal-500/10 border border-purple-200/50 dark:border-blue-800/50 flex items-center justify-center group-hover:scale-110 group-hover:border-purple-300 dark:group-hover:border-blue-600 transition-all duration-300">
                    <Linkedin className="w-5 h-5 text-purple-600 dark:text-blue-400 group-hover:text-purple-700 dark:group-hover:text-blue-300 transition-colors" />
                  </div>
                </Link>

                <Link href="https://twitter.com" className="group">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/10 to-emerald-500/10 dark:from-blue-500/10 dark:to-teal-500/10 border border-purple-200/50 dark:border-blue-800/50 flex items-center justify-center group-hover:scale-110 group-hover:border-purple-300 dark:group-hover:border-blue-600 transition-all duration-300">
                    <Twitter className="w-5 h-5 text-purple-600 dark:text-blue-400 group-hover:text-purple-700 dark:group-hover:text-blue-300 transition-colors" />
                  </div>
                </Link>

                <Link href="mailto:contact@example.com" className="group">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/10 to-emerald-500/10 dark:from-blue-500/10 dark:to-teal-500/10 border border-purple-200/50 dark:border-blue-800/50 flex items-center justify-center group-hover:scale-110 group-hover:border-purple-300 dark:group-hover:border-blue-600 transition-all duration-300">
                    <Mail className="w-5 h-5 text-purple-600 dark:text-blue-400 group-hover:text-purple-700 dark:group-hover:text-blue-300 transition-colors" />
                  </div>
                </Link>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold gradient-text">
                Quick Links
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/projects"
                    className="text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-blue-400 transition-colors duration-300"
                  >
                    Projects
                  </Link>
                </li>
                <li>
                  <Link
                    href="/#about"
                    className="text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-blue-400 transition-colors duration-300"
                  >
                    About Me
                  </Link>
                </li>
                <li>
                  <Link
                    href="/#contact"
                    className="text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-blue-400 transition-colors duration-300"
                  >
                    Contact
                  </Link>
                </li>
                <li>
                  <Link
                    href="/blog"
                    className="text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-blue-400 transition-colors duration-300"
                  >
                    Blog
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold gradient-text">
                Get In Touch
              </h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500/10 to-emerald-500/10 dark:from-blue-500/10 dark:to-teal-500/10 flex items-center justify-center">
                    <Mail className="w-4 h-4 text-purple-600 dark:text-blue-400" />
                  </div>
                  <span className="text-gray-600 dark:text-gray-300 text-sm">
                    contact@example.com
                  </span>
                </div>

                <Button variant="outline" size="sm" className="w-full group">
                  <Mail className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
                  Send Message
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-purple-200/20 dark:border-blue-800/20">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <span>
                  © {currentYear} Sakibur Rahman. All rights reserved.
                </span>
                <span className="hidden sm:inline">•</span>
                <span className="hidden sm:inline">Made with</span>
                <Heart className="w-4 h-4 text-red-500 animate-pulse" />
                <span className="hidden sm:inline">and Next.js</span>
              </div>

              <div className="flex items-center space-x-6 text-sm">
                <Link
                  href="/privacy"
                  className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-blue-400 transition-colors duration-300"
                >
                  Privacy Policy
                </Link>
                <Link
                  href="/terms"
                  className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-blue-400 transition-colors duration-300"
                >
                  Terms of Service
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
