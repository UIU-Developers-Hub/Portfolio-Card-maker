import Image from "next/image";
import { BsPencilSquare, BsShare, BsQrCode, BsPerson } from "react-icons/bs";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center lg:pt-32">
          <h1 className="mx-auto max-w-4xl font-display text-5xl font-medium tracking-tight text-slate-900 sm:text-7xl">
            Your Professional Portfolio{" "}
            <span className="relative whitespace-nowrap text-blue-600">
              <span className="relative">Made Simple</span>
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg tracking-tight text-slate-700">
            Create, customize, and share your professional portfolio in minutes. Stand out with a modern digital presence.
          </p>
          <div className="mt-10 flex justify-center gap-x-6">
            <a
              href="/auth/register"
              className="rounded-full bg-blue-600 px-8 py-4 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-all duration-200 ease-in-out transform hover:scale-105"
            >
              Get Started Free
            </a>
            <a
              href="#features"
              className="rounded-full bg-slate-100 px-8 py-4 text-sm font-semibold text-slate-900 hover:bg-slate-200 transition-all duration-200 ease-in-out transform hover:scale-105"
            >
              Learn More
            </a>
          </div>
          <div className="mt-16">
            <Image
              src="/portfolio-preview.png"
              alt="Portfolio Preview"
              width={1200}
              height={600}
              className="rounded-xl shadow-2xl ring-1 ring-slate-200"
              priority
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Everything you need to showcase your talent
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Simple yet powerful features to make your portfolio stand out
            </p>
          </div>

          <div className="mt-20 grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
            {/* Feature 1 */}
            <div className="group relative transform transition-all duration-300 hover:scale-105">
              <div className="h-16 w-16 rounded-2xl bg-blue-50 p-3 mb-6">
                <BsPencilSquare className="h-full w-full text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Easy Customization</h3>
              <p className="mt-2 text-gray-600">
                Customize your portfolio with an intuitive interface. No coding required.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group relative transform transition-all duration-300 hover:scale-105">
              <div className="h-16 w-16 rounded-2xl bg-green-50 p-3 mb-6">
                <BsShare className="h-full w-full text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Easy Sharing</h3>
              <p className="mt-2 text-gray-600">
                Share your portfolio with a simple link or QR code.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group relative transform transition-all duration-300 hover:scale-105">
              <div className="h-16 w-16 rounded-2xl bg-purple-50 p-3 mb-6">
                <BsQrCode className="h-full w-full text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">QR Code</h3>
              <p className="mt-2 text-gray-600">
                Generate QR codes for easy sharing at events and meetings.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="group relative transform transition-all duration-300 hover:scale-105">
              <div className="h-16 w-16 rounded-2xl bg-orange-50 p-3 mb-6">
                <BsPerson className="h-full w-full text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Privacy Control</h3>
              <p className="mt-2 text-gray-600">
                Control what information is visible to different audiences.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Ready to create your portfolio?
          </h2>
          <p className="mt-4 text-lg text-blue-100">
            Join thousands of professionals who trust us with their online presence.
          </p>
          <div className="mt-8">
            <a
              href="/auth/register"
              className="inline-block rounded-full bg-white px-8 py-4 text-sm font-semibold text-blue-600 shadow-sm hover:bg-blue-50 transition-all duration-200 ease-in-out transform hover:scale-105"
            >
              Get Started Free
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <p className="text-sm">
              &copy; 2024 Portfolio Maker. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
