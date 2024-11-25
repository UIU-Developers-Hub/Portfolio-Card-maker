'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import Button from '@/components/ui/Button';
import { RiEdit2Line, RiShareLine, RiDownloadLine } from 'react-icons/ri';
import { QRCodeCanvas } from 'qrcode.react';
import { useAuth } from '@/contexts/AuthContext';

export default function DashboardPage() {
  const { user } = useAuth();
  const [showCopiedMessage, setShowCopiedMessage] = useState(false);
  const portfolioUrl = user?.username ? `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/${user.username}` : '';

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(portfolioUrl);
      setShowCopiedMessage(true);
      setTimeout(() => setShowCopiedMessage(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleDownloadQR = () => {
    const canvas = document.getElementById('portfolio-qr') as HTMLCanvasElement;
    if (canvas) {
      const url = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = user?.username ? `${user.username}-profile-qr-code.png` : 'profile-qr-code.png';
      link.href = url;
      link.click();
    }
  };

  return (
    <DashboardLayout>
      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-900">Welcome back, {user?.username}!</h1>
        <p className="mt-1 text-sm text-gray-600">
          Manage and share your professional portfolio
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* QR Code Section */}
        <div className="p-6 bg-white rounded-xl border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900">Portfolio QR Code</h2>
            <Button
              variant="outline"
              onClick={handleDownloadQR}
              className="text-sm"
            >
              <RiDownloadLine className="mr-2 h-4 w-4" />
              Download
            </Button>
          </div>
          <div className="flex justify-center p-4 bg-white rounded-lg">
            <QRCodeCanvas
              id="portfolio-qr"
              value={portfolioUrl}
              size={200}
              level="H"
              includeMargin
              className="rounded-lg"
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="p-6 bg-white rounded-xl border border-gray-200">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => window.location.href = '/dashboard/edit'}
            >
              <RiEdit2Line className="mr-2 h-5 w-5" />
              Edit Portfolio
            </Button>

            <div className="relative">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={handleCopyLink}
              >
                <RiShareLine className="mr-2 h-5 w-5" />
                Copy Portfolio Link
              </Button>
              {showCopiedMessage && (
                <div className="absolute right-0 -top-8 bg-gray-900 text-white text-sm px-2 py-1 rounded">
                  Copied!
                </div>
              )}
            </div>

            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-900 mb-1">Your Portfolio Link</p>
              <p className="text-sm text-gray-600 break-all">{portfolioUrl}</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
