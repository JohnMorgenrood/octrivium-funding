// Template 2: Modern Gradient - Blue gradient header with logo on right
export const Template2Modern = ({ invoice, user, customer, items }: any) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
    }).format(amount);
  };

  return (
    <div className="bg-white p-4 sm:p-6 md:p-8 max-w-4xl mx-auto print:p-8 print:max-w-full print:m-0">
      <style jsx>{`
        @media print {
          @page { size: A4; margin: 15mm; }
          body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
          .print\\:hidden { display: none !important; }
        }
      `}</style>
      {/* Gradient Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4 sm:p-6 md:p-8 print:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 sm:gap-0 print:flex-row">
          <div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2">
              {invoice.documentType === 'QUOTE' ? 'Quote' : 'Invoice'}
            </h1>
            <p className="text-blue-100 text-sm sm:text-base md:text-lg">{invoice.invoiceNumber}</p>
          </div>
          <div className="text-right">
            {user.companyLogo && (
              <img src={user.companyLogo} alt="Logo" className="h-16 sm:h-20 object-contain" style={{maxWidth: '200px'}} />
            )}
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-6 md:p-8 print:p-8">
        {/* Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4 sm:mb-6 md:mb-8 print:grid-cols-3 print:mb-8">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-xs text-blue-600 font-semibold uppercase mb-1">From</p>
            <p className="font-semibold text-xs sm:text-sm md:text-base text-gray-900">{user.companyName || `${user.firstName} ${user.lastName}`}</p>
            <p className="text-xs sm:text-sm text-gray-600">{user.email}</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-xs text-blue-600 font-semibold uppercase mb-1">To</p>
            <p className="font-semibold text-xs sm:text-sm md:text-base text-gray-900">{customer.name}</p>
            {customer.email && <p className="text-xs sm:text-sm text-gray-600">{customer.email}</p>}
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-xs text-blue-600 font-semibold uppercase mb-1">Dates</p>
            <p className="text-xs sm:text-sm">Issued: {new Date(invoice.issueDate).toLocaleDateString()}</p>
            <p className="text-xs sm:text-sm">Due: {new Date(invoice.dueDate).toLocaleDateString()}</p>
          </div>
        </div>

        {/* Items Table */}
        <div className="overflow-x-auto mb-4 sm:mb-6 md:mb-8 print:overflow-visible print:mb-8">
          <div className="bg-gray-50 rounded-lg p-4 sm:p-6 print:p-6">
            <table className="w-full min-w-[500px] print:min-w-0">
              <thead>
                <tr className="border-b border-gray-300">
                  <th className="text-left py-2 sm:py-3 text-xs sm:text-sm font-bold text-gray-700 print:py-3">Item</th>
                  <th className="text-center py-2 sm:py-3 text-xs sm:text-sm font-bold text-gray-700 print:py-3">Qty</th>
                  <th className="text-right py-2 sm:py-3 text-xs sm:text-sm font-bold text-gray-700 print:py-3">Price</th>
                  <th className="text-right py-2 sm:py-3 text-xs sm:text-sm font-bold text-gray-700 print:py-3">Total</th>
              </tr>
            </thead>
              <tbody>
                {items.map((item: any, index: number) => (
                  <tr key={index} className="border-b border-gray-200">
                    <td className="py-3 sm:py-4 text-xs sm:text-sm md:text-base print:py-4">{item.description}</td>
                    <td className="text-center py-3 sm:py-4 text-xs sm:text-sm md:text-base print:py-4">{item.quantity}</td>
                    <td className="text-right py-3 sm:py-4 text-xs sm:text-sm md:text-base print:py-4">{formatCurrency(item.unitPrice)}</td>
                    <td className="text-right py-3 sm:py-4 text-xs sm:text-sm md:text-base font-semibold print:py-4">{formatCurrency(item.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Totals */}
        <div className="flex justify-end">
          <div className="w-full sm:w-80 bg-gradient-to-br from-blue-600 to-blue-800 text-white p-4 sm:p-6 rounded-lg print:w-80 print:p-6">
            <div className="flex justify-between py-2 text-blue-100 text-xs sm:text-sm md:text-base">
              <span>Subtotal</span>
              <span>{formatCurrency(invoice.subtotal)}</span>
            </div>
            {invoice.taxRate > 0 && (
              <div className="flex justify-between py-2 text-blue-100 text-xs sm:text-sm md:text-base">
                <span>Tax ({invoice.taxRate}%)</span>
                <span>{formatCurrency(invoice.taxAmount)}</span>
              </div>
            )}
            <div className="flex justify-between py-2 sm:py-3 border-t-2 border-blue-400 text-lg sm:text-xl font-bold print:py-3">
              <span>Total Due</span>
              <span>{formatCurrency(invoice.total)}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        {invoice.notes && (
          <div className="mt-4 sm:mt-6 md:mt-8 p-4 bg-gray-50 rounded print:mt-8">
            <p className="text-xs sm:text-sm text-gray-600">{invoice.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
};
