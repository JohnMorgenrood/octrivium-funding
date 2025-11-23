// Template 1: Classic Professional - Logo on right, clean lines
export const Template1Classic = ({ invoice, user, customer, items }: any) => {
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 sm:gap-0 mb-6 sm:mb-8 print:flex-row print:mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            {invoice.documentType === 'QUOTE' ? 'QUOTATION' : 'INVOICE'}
          </h1>
          <p className="text-sm sm:text-base text-gray-600">{invoice.invoiceNumber}</p>
        </div>
        <div className="text-left sm:text-right">
          {user.companyLogo && (
            <img src={user.companyLogo} alt="Logo" className="h-12 sm:h-16 mb-2 object-contain" style={{maxWidth: '200px'}} />
          )}
          <p className="font-semibold text-sm sm:text-base text-gray-900">{user.companyName || `${user.firstName} ${user.lastName}`}</p>
          {user.companyEmail && {user.companyEmail && <p className="text-xs sm:text-sm text-gray-600">{user.companyEmail}</p>}}
        </div>
      </div>

      {/* Details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8 mb-6 sm:mb-8 print:grid-cols-2 print:mb-8">
        <div>
          <h3 className="text-xs sm:text-sm font-semibold text-gray-500 uppercase mb-2">Bill To</h3>
          <p className="font-semibold text-sm sm:text-base text-gray-900">{customer.name}</p>
          {customer.company && <p className="text-xs sm:text-sm text-gray-600">{customer.company}</p>}
          {customer.email && <p className="text-xs sm:text-sm text-gray-600">{customer.email}</p>}
        </div>
        <div className="text-left sm:text-right">
          <div className="mb-2">
            <span className="text-xs sm:text-sm text-gray-500">Issue Date: </span>
            <span className="font-medium text-xs sm:text-sm">{new Date(invoice.issueDate).toLocaleDateString()}</span>
          </div>
          <div>
            <span className="text-xs sm:text-sm text-gray-500">Due Date: </span>
            <span className="font-medium text-xs sm:text-sm">{new Date(invoice.dueDate).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="overflow-x-auto mb-6 sm:mb-8 print:overflow-visible print:mb-8">
        <table className="w-full min-w-[500px] print:min-w-0">
          <thead>
            <tr className="border-b-2 border-gray-900">
              <th className="text-left py-2 sm:py-3 text-xs sm:text-sm font-semibold">Description</th>
              <th className="text-right py-2 sm:py-3 text-xs sm:text-sm font-semibold">Qty</th>
              <th className="text-right py-2 sm:py-3 text-xs sm:text-sm font-semibold">Rate</th>
              <th className="text-right py-2 sm:py-3 text-xs sm:text-sm font-semibold">Amount</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item: any, index: number) => (
              <tr key={index} className="border-b border-gray-200">
                <td className="py-2 sm:py-3 text-xs sm:text-sm">{item.description}</td>
                <td className="text-right py-2 sm:py-3 text-xs sm:text-sm">{item.quantity}</td>
                <td className="text-right py-2 sm:py-3 text-xs sm:text-sm">{formatCurrency(item.unitPrice)}</td>
                <td className="text-right py-2 sm:py-3 text-xs sm:text-sm">{formatCurrency(item.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="flex justify-end mb-6 sm:mb-8 print:mb-8">
        <div className="w-full sm:w-64">
          <div className="flex justify-between py-2">
            <span className="text-xs sm:text-sm text-gray-600">Subtotal</span>
            <span className="font-medium text-xs sm:text-sm">{formatCurrency(invoice.subtotal)}</span>
          </div>
          {invoice.taxRate > 0 && (
            <div className="flex justify-between py-2">
              <span className="text-xs sm:text-sm text-gray-600">Tax ({invoice.taxRate}%)</span>
              <span className="font-medium text-xs sm:text-sm">{formatCurrency(invoice.taxAmount)}</span>
            </div>
          )}
          <div className="flex justify-between py-2 sm:py-3 border-t-2 border-gray-900">
            <span className="font-bold text-base sm:text-lg">Total</span>
            <span className="font-bold text-base sm:text-lg">{formatCurrency(invoice.total)}</span>
          </div>
        </div>
      </div>

      {/* Notes */}
      {invoice.notes && (
        <div className="mb-4">
          <h3 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2">Notes</h3>
          <p className="text-xs sm:text-sm text-gray-600">{invoice.notes}</p>
        </div>
      )}

      {/* Terms */}
      {invoice.terms && (
        <div className="text-xs sm:text-sm text-gray-500 border-t pt-4 mt-4">
          <p>{invoice.terms}</p>
        </div>
      )}
    </div>
  );
};


