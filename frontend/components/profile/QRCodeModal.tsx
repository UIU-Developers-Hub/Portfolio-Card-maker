'use client';

import { RiDownloadLine, RiShareLine } from 'react-icons/ri';
import { QRCodeCanvas } from 'qrcode.react';
import { toast } from 'react-hot-toast';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  profileUrl: string;
  username: string;
}

export default function QRCodeModal({ isOpen, onClose, profileUrl, username }: QRCodeModalProps) {
  if (!isOpen) return null;

  const handleDownloadQR = () => {
    const canvas = document.getElementById('profile-qr-code') as HTMLCanvasElement;
    if (canvas) {
      const pngUrl = canvas
        .toDataURL('image/png')
        .replace('image/png', 'image/octet-stream');
      const downloadLink = document.createElement('a');
      downloadLink.href = pngUrl;
      downloadLink.download = `${username}-profile-qr.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      toast.success('QR code downloaded successfully!');
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(profileUrl);
      toast.success('Profile link copied to clipboard!');
      onClose();
    } catch (err) {
      toast.error('Failed to copy link');
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl p-8 max-w-sm w-full mx-4 transform transition-all animate-scale-in shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-800">Profile QR Code</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="bg-gray-50 p-6 rounded-xl mb-6">
          <div className="flex justify-center">
            <QRCodeCanvas
              id="profile-qr-code"
              value={profileUrl}
              size={200}
              level="H"
              includeMargin
              className="rounded-lg"
            />
          </div>
          <p className="text-center text-sm text-gray-500 mt-4">
            Scan this QR code to view the profile
          </p>
        </div>
        <div className="flex flex-col gap-3">
          <button
            onClick={handleDownloadQR}
            className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 font-medium"
          >
            <RiDownloadLine className="w-5 h-5" />
            <span>Download QR Code</span>
          </button>
          <button
            onClick={handleCopyLink}
            className="w-full py-3 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2 font-medium"
          >
            <RiShareLine className="w-5 h-5" />
            <span>Copy Profile Link</span>
          </button>
        </div>
      </div>
    </div>
  );
}
