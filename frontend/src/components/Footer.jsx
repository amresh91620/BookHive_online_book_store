import React from "react";
import { Link } from "react-router-dom";
import { BookOpenCheck, Github, Instagram, Mail } from "lucide-react";
import { Button } from "./ui";
import { BRAND, FOOTER } from "../config/site";

const Footer = () => {
  const socialIcons = {
    Instagram,
    Github,
    Email: Mail,
  };

  return (
    <footer className="bg-gradient-to-r from-slate-950 via-blue-950 to-slate-950 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-1 flex flex-col gap-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-white/10 p-2 rounded-lg border border-white/10">
                <BookOpenCheck className="text-white" size={22} />
              </div>
              <span className="text-white text-2xl font-semibold tracking-wide font-serif">
                {BRAND.wordmark.leading}
                <span className="text-blue-200">{BRAND.wordmark.accent}</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed max-w-xs">
              {FOOTER.description}
            </p>
          </div>

          {FOOTER.sections.map((section) => (
            <div key={section.title} className="flex flex-col gap-3">
              <h3 className="text-white font-semibold uppercase tracking-wider text-xs">
                {section.title}
              </h3>
              {section.links.map((link) => (
                <Button
                  key={link.label}
                  variant="ghost"
                  size="sm"
                  asChild
                  className="justify-start px-0 text-slate-300 hover:text-white"
                >
                  <Link to={link.to}>{link.label}</Link>
                </Button>
              ))}
            </div>
          ))}

          <div className="flex flex-col gap-3">
            <h3 className="text-white font-semibold uppercase tracking-wider text-xs">Connect</h3>
            <div className="flex gap-2">
              {FOOTER.social
                .filter((item) => Boolean(item.href))
                .map((item) => {
                  const Icon = socialIcons[item.label] || Mail;
                  return (
                    <Button
                      key={item.label}
                      variant="ghost"
                      size="icon"
                      asChild
                      className="text-slate-300 hover:text-white"
                    >
                      <a href={item.href} aria-label={item.label}>
                        <Icon size={20} />
                      </a>
                    </Button>
                  );
                })}
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-slate-800 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} {BRAND.name}. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
