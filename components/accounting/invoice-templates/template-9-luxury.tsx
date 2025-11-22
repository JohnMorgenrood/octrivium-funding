// Template 9: Luxury - Premium black and gold theme
export const Template9Luxury = ({ invoice, user, customer, items }: any) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
    }).format(amount);
  };

  return (
    <div className="bg-black p-4 sm:p-6 md:p-8 max-w-4xl mx-auto print:p-8 print:max-w-full print:m-0">
      <style jsx>{`
        @media print {
          @page { size: A4; margin: 15mm; }
          body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
          .print\\:hidden { display: none !important; }
        }
      `}</style>
      <div className="border-4 border-yellow-600 p-4 sm:p-6 md:p-8 print:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 sm:gap-0 mb-6 sm:mb-10 md:mb-12 pb-4 sm:pb-6 md:pb-8 border-b-2 border-yellow-600/50 print:flex-row print:mb-12 print:pb-8">
          <div>
            {user.companyLogo ? (
              <img src={user.companyLogo} alt="Logo" className="h-20 sm:h-24 mb-4 object-contain" style={{maxWidth: '250px', filter: 'brightness(0) invert(1)'}} />
            ) : (
              <div className="h-20 w-20 sm:h-24 sm:w-24 bg-gradient-to-br from-yellow-600 to-yellow-800 flex items-center justify-center text-2xl sm:text-3xl md:text-4xl font-bold text-black mb-4">
                {user.companyName?.charAt(0) || user.firstName?.charAt(0)}
              </div>
            )}
            <p className="text-yellow-600 font-semibold text-base sm:text-lg">{user.companyName || `${user.firstName} ${user.lastName}`}</p>
            <p className="text-gray-400 text-xs sm:text-sm">{user.email}</p>
          </div>
          <div className="text-right">
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-yellow-600 mb-3" style={{ fontFamily: 'serif' }}>
              {invoice.documentType === 'QUOTE' ? 'Quote' : 'Invoice'}
            </h1>
            <div className="bg-yellow-600 text-black px-6 py-2 inline-block font-bold">
              {invoice.invoiceNumber}
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-10 md:gap-12 mb-6 sm:mb-10 md:mb-12 print:grid-cols-2 print:gap-12 print:mb-12">
          <div>
            <div className="border-l-4 border-yellow-600 pl-4 mb-6">
              <p className="text-yellow-600 text-xs uppercase tracking-widest mb-2">Billed To</p>
              <p className="text-white font-semibold text-base sm:text-lg">{customer.name}</p>
              {customer.company && <p className="text-gray-300 text-xs sm:text-sm md:text-base">{customer.company}</p>}
              {customer.email && <p className="text-gray-400 text-xs sm:text-sm">{customer.email}</p>}
            </div>
          </div>
          <div className="text-right">
            <div className="space-y-3">
              <div>
                <span className="text-yellow-600 text-xs sm:text-sm uppercase tracking-wider">Issue Date: </span>
                <span className="text-white font-medium text-xs sm:text-sm md:text-base">{new Date(invoice.issueDate).toLocaleDateString()}</span>
              </div>
              <div>
                <span className="text-yellow-600 text-xs sm:text-sm uppercase tracking-wider">Due Date: </span>
                <span className="text-white font-medium text-xs sm:text-sm md:text-base">{new Date(invoice.dueDate).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Items */}
        <div className="overflow-x-auto mb-6 sm:mb-10 md:mb-12 print:overflow-visible print:mb-12">
          <table className="w-full min-w-[500px] print:min-w-0">
            <thead>
              <tr className="border-y-2 border-yellow-600 text-yellow-600">
                <th className="text-left py-3 sm:py-4 uppercase tracking-wider text-xs sm:text-sm print:py-4">Description</th>
                <th className="text-center py-3 sm:py-4 uppercase tracking-wider text-xs sm:text-sm print:py-4">Qty</th>
                <th className="text-right py-3 sm:py-4 uppercase tracking-wider text-xs sm:text-sm print:py-4">Rate</th>
                <th className="text-right py-3 sm:py-4 uppercase tracking-wider text-xs sm:text-sm print:py-4">Amount</th>
            </tr>
          </thead>
            <tbody>
              {items.map((item: any, index: number) => (
                <tr key={index} className="border-b border-gray-800 text-white">
                  <td className="py-3 sm:py-4 text-xs sm:text-sm md:text-base print:py-4">{item.description}</td>
                  <td className="text-center py-3 sm:py-4 text-xs sm:text-sm md:text-base text-gray-300 print:py-4">{item.quantity}</td>
                  <td className="text-right py-3 sm:py-4 text-xs sm:text-sm md:text-base text-gray-300 print:py-4">{formatCurrency(item.unitPrice)}</td>
                  <td className="text-right py-3 sm:py-4 text-xs sm:text-sm md:text-base font-semibold text-yellow-600 print:py-4">{formatCurrency(item.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="flex justify-end mb-4 sm:mb-6 md:mb-8 print:mb-8">
          <div className="w-full sm:w-96 border-2 border-yellow-600 p-4 sm:p-6 bg-yellow-600/5 print:w-96 print:p-6">
            <div className="flex justify-between py-2 sm:py-3 text-xs sm:text-sm md:text-base text-gray-300 print:py-3">
              <span>Subtotal</span>
              <span className="text-white font-medium">{formatCurrency(invoice.subtotal)}</span>
            </div>
            {invoice.taxRate > 0 && (
              <div className="flex justify-between py-2 sm:py-3 text-xs sm:text-sm md:text-base text-gray-300 print:py-3">
                <span>Tax ({invoice.taxRate}%)</span>
                <span className="text-white font-medium">{formatCurrency(invoice.taxAmount)}</span>
              </div>
            )}
            <div className="flex justify-between py-3 sm:py-4 border-t-4 border-yellow-600 text-xl sm:text-2xl font-bold print:py-4">
              <span className="text-yellow-600">TOTAL</span>
              <span className="text-yellow-600">{formatCurrency(invoice.total)}</span>
            </div>
          </div>
        </div>

        {/* Notes */}
        {invoice.notes && (
          <div className="border-t-2 border-yellow-600/50 pt-4 sm:pt-6 print:pt-6">
            <p className="text-gray-400 text-xs sm:text-sm italic">{invoice.notes}</p>
          </div>
        )}

        {invoice.terms && (
          <div className="mt-4 sm:mt-6 text-xs text-gray-500 print:mt-6">
            <p>{invoice.terms}</p>
          </div>
        )}
      </div>
    </div>
  );
};
