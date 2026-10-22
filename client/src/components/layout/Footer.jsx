import { Link } from "react-router-dom";
import { TrendingUp, Code2, MessageCircle, Briefcase } from "lucide-react";
import Container from "../ui/Container";
import { APP_NAME, DISCLAIMER, ROUTES } from "../../constants";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/5 bg-dark-950 mt-24">
      <Container className="py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to={ROUTES.HOME} className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold tracking-tight">{APP_NAME}</span>
            </Link>
            <p className="text-sm text-dark-100 leading-relaxed">
              Learn stock market. Risk-free, with AI-powered guidance.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold mb-3 text-sm">Product</h4>
            <ul className="space-y-2 text-sm text-dark-100">
              <li>
                <a href="#features" className="hover:text-white">
                  Features
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-white">
                  How it works
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-white">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-3 text-sm">Company</h4>
            <ul className="space-y-2 text-sm text-dark-100">
              <li>
                <a href="#" className="hover:text-white">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Contact
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Careers
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-3 text-sm">Legal</h4>
            <ul className="space-y-2 text-sm text-dark-100">
              <li>
                <a href="#" className="hover:text-white">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Disclaimer
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="border-t border-white/5 pt-6 mb-6">
          <p className="text-xs text-dark-100 text-center max-w-3xl mx-auto">
            ⚠️ <strong className="text-warning">Disclaimer:</strong>{" "}
            {DISCLAIMER} All trading on this platform uses virtual currency.
          </p>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-white/5">
          <p className="text-sm text-dark-100">
            © {year} {APP_NAME}. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a
              href="#"
              className="text-dark-100 hover:text-white transition-colors"
              aria-label="GitHub"
            >
              <Code2 className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="text-dark-100 hover:text-white transition-colors"
              aria-label="Twitter"
            >
              <MessageCircle className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="text-dark-100 hover:text-white transition-colors"
              aria-label="LinkedIn"
            >
              <Briefcase className="w-5 h-5" />
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
}