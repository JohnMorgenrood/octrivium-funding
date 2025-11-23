// Template 3: Minimal Elegance - Clean, spacious design with logo top right
export const Template3Minimal = ({ invoice, user, customer, items }: any) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
    }).format(amount);
  };

  return (
    <div className="bg-white p-4 sm:p-6 md:p-12 max-w-4xl mx-auto print:p-12 print:max-w-full print:m-0">
      <style jsx>{`
        @media print {
          @page { size: A4; margin: 15mm; }
          body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
          .print\\:hidden { display: none !important; }
        }
      `}</style>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 sm:gap-0 mb-8 sm:mb-12 md:mb-16 print:flex-row print:mb-16">
        <div className="flex-1">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-light text-gray-900 mb-4">
            {invoice.documentType === 'QUOTE' ? 'Quote' : 'Invoice'}
          </h1>
          <div className="w-20 h-1 bg-gray-900 mb-4"></div>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-500">{invoice.invoiceNumber}</p>
        </div>
        <div className="text-right">
          {user.companyLogo && (
            <img src={user.companyLogo} alt="Logo" className="h-20 sm:h-24 mb-4 object-contain" style={{maxWidth: '250px'}} />
          )}
        </div>
      </div>

      {/* Details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-12 md:gap-16 mb-8 sm:mb-12 md:mb-16 print:grid-cols-2 print:gap-16 print:mb-16">
        <div>
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">From</h3>
          <p className="text-base sm:text-lg font-medium text-gray-900">{user.companyName || `${user.firstName} ${user.lastName}`}</p>
          <p className="text-sm sm:text-base text-gray-600">{user.companyEmail || user.email}</p>
        </div>
        <div>
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">To</h3>
          <p className="text-base sm:text-lg font-medium text-gray-900">{customer.name}</p>
          {customer.company && <p className="text-sm sm:text-base text-gray-600">{customer.company}</p>}
          {customer.email && <p className="text-sm sm:text-base text-gray-600">{customer.email}</p>}
        </div>
      </div>

      <div className="flex gap-8 sm:gap-12 md:gap-16 mb-8 sm:mb-12 md:mb-16 text-xs sm:text-sm print:gap-16 print:mb-16">
        <div>
          <p className="text-gray-400 uppercase tracking-wider mb-1">Issue Date</p>
          <p className="text-gray-900 font-medium">{new Date(invoice.issueDate).toLocaleDateString()}</p>
        </div>
        <div>
          <p className="text-gray-400 uppercase tracking-wider mb-1">Due Date</p>
          <p className="text-gray-900 font-medium">{new Date(invoice.dueDate).toLocaleDateString()}</p>
        </div>
      </div>

      {/* Items */}
      <div className="overflow-x-auto mb-8 sm:mb-12 md:mb-16 print:overflow-visible print:mb-16">
        <table className="w-full min-w-[500px] print:min-w-0">
          <thead>
            <tr className="border-b border-gray-300">
              <th className="text-left py-3 sm:py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider print:py-4">Description</th>
              <th className="text-right py-3 sm:py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider print:py-4">Quantity</th>
              <th className="text-right py-3 sm:py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider print:py-4">Rate</th>
              <th className="text-right py-3 sm:py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider print:py-4">Amount</th>
          </tr>
        </thead>
          <tbody>
            {items.map((item: any, index: number) => (
              <tr key={index} className="border-b border-gray-100">
                <td className="py-4 sm:py-5 text-xs sm:text-sm md:text-base text-gray-900 print:py-5">{item.description}</td>
                <td className="text-right py-4 sm:py-5 text-xs sm:text-sm md:text-base text-gray-600 print:py-5">{item.quantity}</td>
                <td className="text-right py-4 sm:py-5 text-xs sm:text-sm md:text-base text-gray-600 print:py-5">{formatCurrency(item.unitPrice)}</td>
                <td className="text-right py-4 sm:py-5 text-xs sm:text-sm md:text-base text-gray-900 font-medium print:py-5">{formatCurrency(item.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="flex justify-end mb-8 sm:mb-12 md:mb-16 print:mb-16">
        <div className="w-full sm:w-80 space-y-3 print:w-80">
          <div className="flex justify-between text-xs sm:text-sm md:text-base text-gray-600">
            <span>Subtotal</span>
            <span>{formatCurrency(invoice.subtotal)}</span>
          </div>
          {invoice.taxRate > 0 && (
            <div className="flex justify-between text-xs sm:text-sm md:text-base text-gray-600">
              <span>Tax ({invoice.taxRate}%)</span>
              <span>{formatCurrency(invoice.taxAmount)}</span>
            </div>
          )}
          <div className="border-t-2 border-gray-900 pt-3 flex justify-between text-lg sm:text-xl md:text-2xl font-light">
            <span>Total</span>
            <span>{formatCurrency(invoice.total)}</span>
          </div>
        </div>
      </div>

      {/* Notes */}
      {invoice.notes && (
        <div className="pt-4 sm:pt-6 md:pt-8 border-t border-gray-200 print:pt-8">
          <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">{invoice.notes}</p>
        </div>
      )}
    </div>
  );
};

