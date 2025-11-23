// Template 7: Elegant Serif - Sophisticated design with serif fonts
export const Template7Elegant = ({ invoice, user, customer, items }: any) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
    }).format(amount);
  };

  return (
    <div className="bg-white p-4 sm:p-6 md:p-12 max-w-4xl mx-auto print:p-12 print:max-w-full print:m-0" style={{ fontFamily: 'Georgia, serif' }}>
      <style jsx>{`
        @media print {
          @page { size: A4; margin: 15mm; }
          body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
          .print\\:hidden { display: none !important; }
        }
      `}</style>
      {/* Decorative Top Line */}
      <div className="border-t-4 border-double border-gray-800 pt-4 sm:pt-6 md:pt-8 mb-4 sm:mb-6 md:mb-8 print:pt-8 print:mb-8"></div>

      {/* Header */}
      <div className="text-center mb-6 sm:mb-10 md:mb-12 print:mb-12">
        {user.companyLogo && (
          <img src={user.companyLogo} alt="Logo" className="h-20 sm:h-24 mx-auto mb-4 object-contain" style={{maxWidth: '250px'}} />
        )}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif mb-2 text-gray-900">
          {invoice.documentType === 'QUOTE' ? 'Quotation' : 'Invoice'}
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-gray-600">{invoice.invoiceNumber}</p>
      </div>

      {/* Details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mb-6 sm:mb-10 md:mb-12 text-center print:grid-cols-3 print:gap-8 print:mb-12">
        <div className="sm:border-r border-gray-300 sm:pr-6 pb-4 sm:pb-0 border-b sm:border-b-0 print:border-r print:border-b-0 print:pr-6">
          <p className="text-xs uppercase tracking-widest text-gray-500 mb-3">From</p>
          <p className="font-semibold text-xs sm:text-sm md:text-base text-gray-900">{user.companyName || `${user.firstName} ${user.lastName}`}</p>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">{user.companyEmail || user.email}</p>
        </div>
        <div className="sm:border-r border-gray-300 pb-4 sm:pb-0 border-b sm:border-b-0 md:border-r print:border-r print:border-b-0">
          <p className="text-xs uppercase tracking-widest text-gray-500 mb-3">To</p>
          <p className="font-semibold text-xs sm:text-sm md:text-base text-gray-900">{customer.name}</p>
          {customer.email && <p className="text-xs sm:text-sm text-gray-600 mt-1">{customer.email}</p>}
        </div>
        <div className="md:pl-6">
          <p className="text-xs uppercase tracking-widest text-gray-500 mb-3">Dates</p>
          <p className="text-xs sm:text-sm text-gray-700">Issued: {new Date(invoice.issueDate).toLocaleDateString()}</p>
          <p className="text-xs sm:text-sm text-gray-700 mt-1">Due: {new Date(invoice.dueDate).toLocaleDateString()}</p>
        </div>
      </div>

      {/* Items */}
      <div className="overflow-x-auto mb-6 sm:mb-10 md:mb-12 print:overflow-visible print:mb-12">
        <table className="w-full min-w-[500px] print:min-w-0">
          <thead>
            <tr className="border-y-2 border-gray-800">
              <th className="text-left py-3 sm:py-4 text-xs uppercase tracking-widest text-gray-700 print:py-4">Description</th>
              <th className="text-center py-3 sm:py-4 text-xs uppercase tracking-widest text-gray-700 print:py-4">Qty</th>
              <th className="text-right py-3 sm:py-4 text-xs uppercase tracking-widest text-gray-700 print:py-4">Rate</th>
              <th className="text-right py-3 sm:py-4 text-xs uppercase tracking-widest text-gray-700 print:py-4">Amount</th>
          </tr>
        </thead>
          <tbody>
            {items.map((item: any, index: number) => (
              <tr key={index} className="border-b border-gray-200">
                <td className="py-3 sm:py-4 text-xs sm:text-sm md:text-base text-gray-900 print:py-4">{item.description}</td>
                <td className="text-center py-3 sm:py-4 text-xs sm:text-sm md:text-base text-gray-700 print:py-4">{item.quantity}</td>
                <td className="text-right py-3 sm:py-4 text-xs sm:text-sm md:text-base text-gray-700 print:py-4">{formatCurrency(item.unitPrice)}</td>
                <td className="text-right py-3 sm:py-4 text-xs sm:text-sm md:text-base font-semibold text-gray-900 print:py-4">{formatCurrency(item.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="flex justify-end mb-6 sm:mb-10 md:mb-12 print:mb-12">
        <div className="w-full sm:w-96 border-t-2 border-b-2 border-gray-800 py-4 sm:py-6 print:w-96 print:py-6">
          <div className="flex justify-between py-2 text-xs sm:text-sm md:text-base text-gray-700">
            <span>Subtotal</span>
            <span>{formatCurrency(invoice.subtotal)}</span>
          </div>
          {invoice.taxRate > 0 && (
            <div className="flex justify-between py-2 text-xs sm:text-sm md:text-base text-gray-700">
              <span>Tax ({invoice.taxRate}%)</span>
              <span>{formatCurrency(invoice.taxAmount)}</span>
            </div>
          )}
          <div className="flex justify-between py-3 border-t border-gray-400 mt-3 text-lg sm:text-xl md:text-2xl font-serif">
            <span>Total</span>
            <span>{formatCurrency(invoice.total)}</span>
          </div>
        </div>
      </div>

      {/* Notes */}
      {invoice.notes && (
        <div className="text-center border-t border-gray-300 pt-4 sm:pt-6 md:pt-8 print:pt-8">
          <p className="text-xs sm:text-sm text-gray-600 italic max-w-2xl mx-auto">{invoice.notes}</p>
        </div>
      )}

      {/* Decorative Bottom Line */}
      <div className="border-b-4 border-double border-gray-800 mt-4 sm:mt-6 md:mt-8 print:mt-8"></div>
    </div>
  );
};

