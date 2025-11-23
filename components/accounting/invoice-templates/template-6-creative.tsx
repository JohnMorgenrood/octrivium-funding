// Template 6: Creative Dark - Dark theme with accent colors
export const Template6Creative = ({ invoice, user, customer, items }: any) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
    }).format(amount);
  };

  return (
    <div className="bg-gray-900 text-white p-4 sm:p-6 md:p-8 max-w-4xl mx-auto print:p-8 print:max-w-full print:m-0">
      <style jsx>{`
        @media print {
          @page { size: A4; margin: 15mm; }
          body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
          .print\\:hidden { display: none !important; }
        }
      `}</style>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 sm:gap-0 mb-6 sm:mb-10 md:mb-12 print:flex-row print:mb-12">
        <div>
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-3">
            {invoice.documentType === 'QUOTE' ? 'Quote' : 'Invoice'}
          </h1>
          <p className="text-gray-400 text-base sm:text-lg md:text-xl">{invoice.invoiceNumber}</p>
        </div>
        <div>
          {user.companyLogo && (
            <img src={user.companyLogo} alt="Logo" className="h-16 sm:h-20 object-contain" style={{maxWidth: '200px'}} />
          )}
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-10 md:mb-12 print:grid-cols-2 print:gap-6 print:mb-12">
        <div className="bg-gray-800 p-4 sm:p-6 rounded-lg border border-cyan-500/30 print:p-6">
          <p className="text-cyan-400 text-xs uppercase tracking-wider mb-3">From</p>
          <p className="font-semibold text-base sm:text-lg mb-1">{user.companyName || `${user.firstName} ${user.lastName}`}</p>
          <p className="text-gray-400 text-xs sm:text-sm">{user.companyEmail}</p>
        </div>
        <div className="bg-gray-800 p-4 sm:p-6 rounded-lg border border-cyan-500/30 print:p-6">
          <p className="text-cyan-400 text-xs uppercase tracking-wider mb-3">To</p>
          <p className="font-semibold text-base sm:text-lg mb-1">{customer.name}</p>
          {customer.email && <p className="text-gray-400 text-xs sm:text-sm">{customer.email}</p>}
        </div>
      </div>

      {/* Dates */}
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 md:gap-8 mb-6 sm:mb-10 md:mb-12 print:flex-row print:gap-8 print:mb-12">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-cyan-500/20 rounded-full flex items-center justify-center">
            <span className="text-cyan-400">📅</span>
          </div>
          <div>
            <p className="text-gray-400 text-xs">Issued</p>
            <p className="font-medium text-xs sm:text-sm md:text-base">{new Date(invoice.issueDate).toLocaleDateString()}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
            <span className="text-blue-400">⏰</span>
          </div>
          <div>
            <p className="text-gray-400 text-xs">Due</p>
            <p className="font-medium text-xs sm:text-sm md:text-base">{new Date(invoice.dueDate).toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="overflow-x-auto mb-4 sm:mb-6 md:mb-8 print:overflow-visible print:mb-8">
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <table className="w-full min-w-[500px] print:min-w-0">
            <thead>
              <tr className="bg-gradient-to-r from-cyan-600 to-blue-600">
                <th className="text-left py-3 sm:py-4 px-4 sm:px-6 font-semibold text-xs sm:text-sm print:py-4 print:px-6">Item</th>
                <th className="text-center py-3 sm:py-4 px-4 sm:px-6 font-semibold text-xs sm:text-sm print:py-4 print:px-6">Qty</th>
                <th className="text-right py-3 sm:py-4 px-4 sm:px-6 font-semibold text-xs sm:text-sm print:py-4 print:px-6">Price</th>
                <th className="text-right py-3 sm:py-4 px-4 sm:px-6 font-semibold text-xs sm:text-sm print:py-4 print:px-6">Total</th>
            </tr>
          </thead>
            <tbody>
              {items.map((item: any, index: number) => (
                <tr key={index} className="border-b border-gray-700">
                  <td className="py-3 sm:py-4 px-4 sm:px-6 text-xs sm:text-sm md:text-base print:py-4 print:px-6">{item.description}</td>
                  <td className="text-center py-3 sm:py-4 px-4 sm:px-6 text-xs sm:text-sm md:text-base text-gray-300 print:py-4 print:px-6">{item.quantity}</td>
                  <td className="text-right py-3 sm:py-4 px-4 sm:px-6 text-xs sm:text-sm md:text-base text-gray-300 print:py-4 print:px-6">{formatCurrency(item.unitPrice)}</td>
                  <td className="text-right py-3 sm:py-4 px-4 sm:px-6 text-xs sm:text-sm md:text-base font-semibold text-cyan-400 print:py-4 print:px-6">{formatCurrency(item.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Totals */}
      <div className="flex justify-end">
        <div className="w-full sm:w-96 bg-gradient-to-br from-cyan-600 to-blue-600 p-4 sm:p-6 md:p-8 rounded-lg print:w-96 print:p-8">
          <div className="flex justify-between py-2 text-white/80 text-xs sm:text-sm md:text-base">
            <span>Subtotal</span>
            <span>{formatCurrency(invoice.subtotal)}</span>
          </div>
          {invoice.taxRate > 0 && (
            <div className="flex justify-between py-2 text-white/80 text-xs sm:text-sm md:text-base">
              <span>Tax ({invoice.taxRate}%)</span>
              <span>{formatCurrency(invoice.taxAmount)}</span>
            </div>
          )}
          <div className="flex justify-between py-3 sm:py-4 border-t-2 border-white/30 text-xl sm:text-2xl font-bold print:py-4">
            <span>Total</span>
            <span>{formatCurrency(invoice.total)}</span>
          </div>
        </div>
      </div>

      {invoice.notes && (
        <div className="mt-4 sm:mt-6 md:mt-8 bg-gray-800 p-4 sm:p-6 rounded-lg border-l-4 border-cyan-500 print:mt-8 print:p-6">
          <p className="text-gray-300 text-xs sm:text-sm md:text-base">{invoice.notes}</p>
        </div>
      )}
    </div>
  );
};


