'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import Button from '@/components/ui/Button';
import { QRCodeCanvas } from 'qrcode.react';
import { RiDownloadLine, RiShareLine } from 'react-icons/ri';
import { useAuth } from '@/contexts/AuthContext';
import toast from 'react-hot-toast';

export default function BusinessCardPage() {
  const { user } = useAuth();
  const [isFlipped, setIsFlipped] = useState(false);
  const portfolioUrl = user?.username ? `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/${user.username}` : '';

  const handleDownloadCard = () => {
    // TODO: Implement card download functionality
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(portfolioUrl);
      toast.success('Portfolio link copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy text: ', err);
      toast.error('Failed to copy link');
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-gray-900">My Business Card</h1>
          <p className="mt-1 text-sm text-gray-600">
            Your digital business card with QR code
          </p>
        </div>

        {/* Card Preview */}
        <div className="flex flex-col items-center">
          <div className="relative w-[400px] h-[225px] cursor-pointer perspective-1000">
            <div
              className={`relative w-full h-full transition-transform duration-700 transform-style-3d ${
                isFlipped ? 'rotate-y-180' : ''
              }`}
              onClick={() => setIsFlipped(!isFlipped)}
            >
              {/* Front Side */}
              <div className="absolute w-full h-full backface-hidden">
                <div className="w-full h-full p-6 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl text-white shadow-lg">
                  <div className="flex flex-col h-full justify-between">
                    <div>
                      <h2 className="text-2xl font-bold">{user?.fullName || 'Your Name'}</h2>
                      <p className="text-blue-100 mt-1">{user?.title || 'Your Title'}</p>
                    </div>
                    <div className="space-y-1 text-sm">
                      <p> {user?.email || 'your@email.com'}</p>
                      <p> {user?.phone || 'Your Phone'}</p>
                      <p> {user?.location || 'Your Location'}</p>
                      <p className="text-xs text-blue-100 mt-2">Click to see QR code →</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Back Side */}
              <div className="absolute w-full h-full backface-hidden rotate-y-180">
                <div className="w-full h-full p-6 bg-white rounded-xl shadow-lg border border-gray-200">
                  <div className="flex flex-col items-center h-full">
                    <div className="text-center mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">Scan to view portfolio</h3>
                      <p className="text-sm text-gray-500">or visit</p>
                      <p className="text-sm text-blue-600">{portfolioUrl}</p>
                    </div>
                    <div className="flex-1 flex items-center justify-center">
                      <QRCodeCanvas
                        value={portfolioUrl}
                        size={100}
                        level="H"
                        className="rounded"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Click to see contact info →</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card Actions */}
          <div className="mt-8 space-x-4">
            <Button
              variant="outline"
              className="inline-flex items-center"
              onClick={handleDownloadCard}
            >
              <RiDownloadLine className="mr-2 h-5 w-5" />
              Download Card
            </Button>
            <Button
              variant="outline"
              className="inline-flex items-center"
              onClick={handleCopyLink}
            >
              <RiShareLine className="mr-2 h-5 w-5" />
              Copy Link
            </Button>
          </div>

          {/* Instructions */}
          <div className="mt-8 text-center text-sm text-gray-600">
            <p>Click on the card to flip between front and back sides</p>
            <p className="mt-1">
              Your card information is automatically updated from your portfolio
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
