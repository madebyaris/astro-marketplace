import React from 'react';
import { trackAffiliateClick } from '../lib/affiliate-tracker';

interface AffiliateButtonProps {
  productId: number;
  marketplace: string;
  targetUrl: string;
  label?: string;
  className?: string;
  variant?: 'primary' | 'secondary' | 'marketplace';
}

export default function AffiliateButton({
  productId,
  marketplace,
  targetUrl,
  label,
  className = '',
  variant = 'marketplace'
}: AffiliateButtonProps) {
  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    await trackAffiliateClick({
      productId,
      marketplace,
      targetUrl
    });
  };

  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-gradient-to-r from-emerald-500 to-blue-500 text-white hover:shadow-lg hover:shadow-emerald-500/25';
      case 'secondary':
        return 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50';
      case 'marketplace':
        return `bg-gradient-to-r ${getMarketplaceColors(marketplace)} text-white hover:shadow-lg`;
      default:
        return 'bg-gray-100 text-gray-700 hover:bg-gray-200';
    }
  };

  const getMarketplaceColors = (marketplace: string) => {
    switch (marketplace.toLowerCase()) {
      case 'tokopedia':
        return 'from-green-500 to-green-600';
      case 'shopee':
        return 'from-orange-500 to-red-500';
      case 'bukalapak':
        return 'from-pink-500 to-red-500';
      case 'lazada':
        return 'from-blue-500 to-purple-500';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const getMarketplaceIcon = (marketplace: string) => {
    // You can add specific icons for each marketplace here
    return (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
      </svg>
    );
  };

  return (
    <button
      onClick={handleClick}
      className={`
        inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium 
        transition-all duration-200 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2
        ${getVariantClasses()} ${className}
      `}
      title={`Buy on ${marketplace}`}
    >
      {getMarketplaceIcon(marketplace)}
      <span>{label || `Buy on ${marketplace}`}</span>
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
      </svg>
    </button>
  );
}

