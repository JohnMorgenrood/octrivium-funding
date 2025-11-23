// Template 10: Playful Modern - Colorful with rounded corners and fun design
export const Template10Playful = ({ invoice, user, customer, items }: any) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
    }).format(amount);
  };

  return (
    <div className="bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 p-4 sm:p-6 md:p-8 max-w-4xl mx-auto print:p-8 print:max-w-full print:m-0">
      <style jsx>{`
        @media print {
          @page { size: A4; margin: 15mm; }
          body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
          .print\\:hidden { display: none !important; }
        }
      `}</style>
      {/* Header Card */}
      <div className="bg-white rounded-3xl shadow-2xl p-4 sm:p-6 md:p-8 mb-6 print:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 sm:gap-0 mb-4 sm:mb-6 md:mb-8 print:flex-row print:mb-8">
          <div>
            <div className="inline-block bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-full transform -rotate-2 mb-4 print:px-8 print:py-3">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">
                {invoice.documentType === 'QUOTE' ? '📋 Quote' : '💰 Invoice'}
              </h1>
            </div>
            <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">{invoice.invoiceNumber}</p>
          </div>
          <div>
            {user.companyLogo && (
              <img src={user.companyLogo} alt="Logo" className="h-16 sm:h-20 object-contain" style={{maxWidth: '200px'}} />
            )}
          </div>
        </div>

        {/* Info Bubbles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6 md:mb-8 print:grid-cols-2 print:gap-6 print:mb-8">
          <div className="bg-gradient-to-r from-pink-100 to-purple-100 p-4 sm:p-6 rounded-2xl print:p-6">
            <div className="flex items-start gap-3">
              <span className="text-2xl sm:text-3xl">📤</span>
              <div>
                <p className="text-xs font-bold text-purple-600 uppercase mb-1">From</p>
                <p className="font-bold text-xs sm:text-sm md:text-base text-gray-900">{user.companyName || `${user.firstName} ${user.lastName}`}</p>
                <p className="text-xs sm:text-sm text-gray-600">{user.companyEmail || user.email}</p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-purple-100 to-blue-100 p-4 sm:p-6 rounded-2xl print:p-6">
            <div className="flex items-start gap-3">
              <span className="text-2xl sm:text-3xl">📥</span>
              <div>
                <p className="text-xs font-bold text-blue-600 uppercase mb-1">To</p>
                <p className="font-bold text-xs sm:text-sm md:text-base text-gray-900">{customer.name}</p>
                {customer.email && <p className="text-xs sm:text-sm text-gray-600">{customer.email}</p>}
              </div>
            </div>
          </div>
        </div>

        {/* Dates */}
        <div className="flex flex-col sm:flex-row gap-4 mb-4 sm:mb-6 md:mb-8 print:flex-row print:mb-8">
          <div className="flex-1 bg-green-50 p-4 rounded-xl border-2 border-green-200">
            <p className="text-xs text-green-600 font-bold mb-1">📅 Issued</p>
            <p className="font-semibold text-xs sm:text-sm md:text-base text-gray-900">{new Date(invoice.issueDate).toLocaleDateString()}</p>
          </div>
          <div className="flex-1 bg-orange-50 p-4 rounded-xl border-2 border-orange-200">
            <p className="text-xs text-orange-600 font-bold mb-1">⏰ Due</p>
            <p className="font-semibold text-xs sm:text-sm md:text-base text-gray-900">{new Date(invoice.dueDate).toLocaleDateString()}</p>
          </div>
        </div>

        {/* Items */}
        <div className="overflow-x-auto mb-4 sm:mb-6 print:overflow-visible print:mb-6">
          <div className="bg-gradient-to-r from-pink-50 to-blue-50 rounded-2xl p-4 sm:p-6 print:p-6">
            <table className="w-full min-w-[500px] print:min-w-0">
              <thead>
                <tr className="border-b-2 border-purple-300">
                  <th className="text-left py-2 sm:py-3 font-bold text-purple-700 text-xs sm:text-sm print:py-3">Item</th>
                  <th className="text-center py-2 sm:py-3 font-bold text-purple-700 text-xs sm:text-sm print:py-3">Qty</th>
                  <th className="text-right py-2 sm:py-3 font-bold text-purple-700 text-xs sm:text-sm print:py-3">Price</th>
                  <th className="text-right py-2 sm:py-3 font-bold text-purple-700 text-xs sm:text-sm print:py-3">Total</th>
              </tr>
            </thead>
              <tbody>
                {items.map((item: any, index: number) => (
                  <tr key={index} className="border-b border-purple-100">
                    <td className="py-3 sm:py-4 font-medium text-xs sm:text-sm md:text-base text-gray-900 print:py-4">{item.description}</td>
                    <td className="text-center py-3 sm:py-4 text-xs sm:text-sm md:text-base text-gray-600 print:py-4">{item.quantity}</td>
                    <td className="text-right py-3 sm:py-4 text-xs sm:text-sm md:text-base text-gray-600 print:py-4">{formatCurrency(item.unitPrice)}</td>
                    <td className="text-right py-3 sm:py-4 text-xs sm:text-sm md:text-base font-bold text-purple-600 print:py-4">{formatCurrency(item.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Total Card */}
        <div className="flex justify-end">
          <div className="w-full sm:w-96 print:w-96">
            <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 p-1 rounded-2xl">
              <div className="bg-white p-4 sm:p-6 rounded-xl print:p-6">
                <div className="flex justify-between py-2 text-xs sm:text-sm md:text-base text-gray-700">
                  <span className="font-medium">Subtotal</span>
                  <span className="font-semibold">{formatCurrency(invoice.subtotal)}</span>
                </div>
                {invoice.taxRate > 0 && (
                  <div className="flex justify-between py-2 text-xs sm:text-sm md:text-base text-gray-700">
                    <span className="font-medium">Tax ({invoice.taxRate}%)</span>
                    <span className="font-semibold">{formatCurrency(invoice.taxAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between py-3 sm:py-4 border-t-2 border-purple-200 items-center print:py-4">
                  <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-pink-600 to-blue-600 bg-clip-text text-transparent">
                    Total
                  </span>
                  <span className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-pink-600 to-blue-600 bg-clip-text text-transparent">
                    {formatCurrency(invoice.total)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {invoice.notes && (
          <div className="mt-4 sm:mt-6 md:mt-8 bg-yellow-50 p-4 sm:p-6 rounded-2xl border-2 border-yellow-200 print:mt-8 print:p-6">
            <p className="text-xs sm:text-sm text-gray-700 flex items-start gap-2">
              <span className="text-xl">💡</span>
              <span>{invoice.notes}</span>
            </p>
          </div>
        )}
      </div>

      {invoice.terms && (
        <div className="text-center text-xs text-gray-500 bg-white/50 backdrop-blur p-4 rounded-2xl">
          <p>{invoice.terms}</p>
        </div>
      )}
    </div>
  );
};

