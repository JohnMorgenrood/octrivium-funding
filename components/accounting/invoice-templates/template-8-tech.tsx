// Template 8: Tech Startup - Modern orange/teal theme with geometric shapes
export const Template8Tech = ({ invoice, user, customer, items }: any) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
    }).format(amount);
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 md:p-8 max-w-4xl mx-auto print:p-8 print:max-w-full print:m-0">
      <style jsx>{`
        @media print {
          @page { size: A4; margin: 15mm; }
          body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
          .print\\:hidden { display: none !important; }
        }
      `}</style>
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header with Geometric Background */}
        <div className="relative bg-gradient-to-r from-orange-500 to-teal-500 p-4 sm:p-6 md:p-8 text-white overflow-hidden print:p-8">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>
          
          <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start gap-4 sm:gap-0 print:flex-row">
            <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2">
                {invoice.documentType === 'QUOTE' ? 'Quote' : 'Invoice'}
              </h1>
              <p className="text-white/90 text-base sm:text-lg">{invoice.invoiceNumber}</p>
            </div>
            <div>
              {user.companyLogo && (
                <img src={user.companyLogo} alt="Logo" className="h-16 sm:h-20 object-contain" style={{maxWidth: '200px'}} />
              )}
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-6 md:p-8 print:p-8">
          {/* Info Boxes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4 sm:mb-6 md:mb-8 print:grid-cols-3 print:mb-8">
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-xl">
              <p className="text-xs text-orange-600 font-bold uppercase mb-2">From</p>
              <p className="font-semibold text-xs sm:text-sm md:text-base text-gray-900">{user.companyName || `${user.firstName} ${user.lastName}`}</p>
              <p className="text-xs sm:text-sm text-gray-600">{user.email}</p>
            </div>
            <div className="bg-gradient-to-br from-teal-50 to-teal-100 p-4 rounded-xl">
              <p className="text-xs text-teal-600 font-bold uppercase mb-2">To</p>
              <p className="font-semibold text-xs sm:text-sm md:text-base text-gray-900">{customer.name}</p>
              {customer.email && <p className="text-xs sm:text-sm text-gray-600">{customer.email}</p>}
            </div>
            <div className="bg-gradient-to-br from-gray-100 to-gray-200 p-4 rounded-xl">
              <p className="text-xs text-gray-600 font-bold uppercase mb-2">Dates</p>
              <p className="text-xs sm:text-sm font-medium">Issue: {new Date(invoice.issueDate).toLocaleDateString()}</p>
              <p className="text-xs sm:text-sm font-medium">Due: {new Date(invoice.dueDate).toLocaleDateString()}</p>
            </div>
          </div>

          {/* Items */}
          <div className="overflow-x-auto mb-4 sm:mb-6 md:mb-8 print:overflow-visible print:mb-8">
            <div className="rounded-xl overflow-hidden border-2 border-gray-200">
              <table className="w-full min-w-[500px] print:min-w-0">
                <thead>
                  <tr className="bg-gradient-to-r from-orange-500 to-teal-500 text-white">
                    <th className="text-left py-3 sm:py-4 px-4 sm:px-6 font-bold text-xs sm:text-sm print:py-4 print:px-6">Item</th>
                    <th className="text-center py-3 sm:py-4 px-4 sm:px-6 font-bold text-xs sm:text-sm print:py-4 print:px-6">Qty</th>
                    <th className="text-right py-3 sm:py-4 px-4 sm:px-6 font-bold text-xs sm:text-sm print:py-4 print:px-6">Price</th>
                    <th className="text-right py-3 sm:py-4 px-4 sm:px-6 font-bold text-xs sm:text-sm print:py-4 print:px-6">Total</th>
                </tr>
              </thead>
                <tbody>
                  {items.map((item: any, index: number) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                      <td className="py-3 sm:py-4 px-4 sm:px-6 font-medium text-xs sm:text-sm md:text-base print:py-4 print:px-6">{item.description}</td>
                      <td className="text-center py-3 sm:py-4 px-4 sm:px-6 text-xs sm:text-sm md:text-base text-gray-600 print:py-4 print:px-6">{item.quantity}</td>
                      <td className="text-right py-3 sm:py-4 px-4 sm:px-6 text-xs sm:text-sm md:text-base text-gray-600 print:py-4 print:px-6">{formatCurrency(item.unitPrice)}</td>
                      <td className="text-right py-3 sm:py-4 px-4 sm:px-6 text-xs sm:text-sm md:text-base font-bold text-teal-600 print:py-4 print:px-6">{formatCurrency(item.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Totals Card */}
          <div className="flex justify-end">
            <div className="w-full sm:w-96 bg-gradient-to-br from-orange-500 to-teal-500 p-1 rounded-xl print:w-96">
              <div className="bg-white p-4 sm:p-6 rounded-lg print:p-6">
                <div className="flex justify-between py-2 text-xs sm:text-sm md:text-base text-gray-700">
                  <span>Subtotal</span>
                  <span className="font-semibold">{formatCurrency(invoice.subtotal)}</span>
                </div>
                {invoice.taxRate > 0 && (
                  <div className="flex justify-between py-2 text-xs sm:text-sm md:text-base text-gray-700">
                    <span>Tax ({invoice.taxRate}%)</span>
                    <span className="font-semibold">{formatCurrency(invoice.taxAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between py-3 sm:py-4 border-t-2 border-gray-300 text-xl sm:text-2xl font-bold print:py-4">
                  <span className="bg-gradient-to-r from-orange-500 to-teal-500 bg-clip-text text-transparent">Total</span>
                  <span className="bg-gradient-to-r from-orange-500 to-teal-500 bg-clip-text text-transparent">{formatCurrency(invoice.total)}</span>
                </div>
              </div>
            </div>
          </div>

          {invoice.notes && (
            <div className="mt-4 sm:mt-6 md:mt-8 bg-gradient-to-r from-orange-50 to-teal-50 p-4 sm:p-6 rounded-xl border-l-4 border-orange-500 print:mt-8 print:p-6">
              <p className="text-xs sm:text-sm text-gray-700">{invoice.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
