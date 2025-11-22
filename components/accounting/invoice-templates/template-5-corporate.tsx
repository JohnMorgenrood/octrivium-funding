// Template 5: Corporate Professional - Green theme with structured layout
export const Template5Corporate = ({ invoice, user, customer, items }: any) => {
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
      {/* Top Bar */}
      <div className="bg-green-700 h-2 mb-4 sm:mb-6 md:mb-8 print:mb-8"></div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 sm:gap-0 mb-4 sm:mb-6 md:mb-8 pb-4 sm:pb-6 md:pb-8 border-b-2 border-green-700 print:flex-row print:mb-8 print:pb-8">
        <div className="flex-1">
          <div className="mb-4">
            {user.companyLogo ? (
              <img src={user.companyLogo} alt="Logo" className="h-12 sm:h-16 object-contain" style={{maxWidth: '200px'}} />
            ) : (
              <div className="h-12 w-12 sm:h-16 sm:w-16 bg-green-700 flex items-center justify-center text-white text-xl sm:text-2xl font-bold">
                {user.companyName?.charAt(0) || user.firstName?.charAt(0)}
              </div>
            )}
          </div>
          <p className="font-bold text-xs sm:text-sm md:text-base text-gray-900">{user.companyName || `${user.firstName} ${user.lastName}`}</p>
          <p className="text-xs sm:text-sm text-gray-600">{user.email}</p>
        </div>
        <div className="text-right">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-green-700 mb-2">
            {invoice.documentType === 'QUOTE' ? 'QUOTE' : 'INVOICE'}
          </h1>
          <div className="bg-green-700 text-white px-4 py-2 inline-block">
            {invoice.invoiceNumber}
          </div>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 md:gap-8 mb-4 sm:mb-6 md:mb-8 print:grid-cols-2 print:gap-8 print:mb-8">
        <div>
          <div className="bg-green-50 p-4 mb-4">
            <h3 className="text-xs font-bold text-green-800 uppercase mb-2">Invoice To</h3>
            <p className="font-semibold text-xs sm:text-sm md:text-base text-gray-900">{customer.name}</p>
            {customer.company && <p className="text-xs sm:text-sm md:text-base text-gray-700">{customer.company}</p>}
            {customer.email && <p className="text-xs sm:text-sm text-gray-600">{customer.email}</p>}
          </div>
        </div>
        <div>
          <div className="bg-gray-50 p-4">
            <table className="w-full text-xs sm:text-sm">
              <tbody>
                <tr>
                  <td className="py-2 text-gray-600 font-semibold">Issue Date:</td>
                  <td className="py-2 text-right">{new Date(invoice.issueDate).toLocaleDateString()}</td>
                </tr>
                <tr>
                  <td className="py-2 text-gray-600 font-semibold">Due Date:</td>
                  <td className="py-2 text-right">{new Date(invoice.dueDate).toLocaleDateString()}</td>
                </tr>
                <tr>
                  <td className="py-2 text-gray-600 font-semibold">Status:</td>
                  <td className="py-2 text-right">
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-semibold">
                      {invoice.status}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div className="overflow-x-auto mb-4 sm:mb-6 md:mb-8 print:overflow-visible print:mb-8">
        <table className="w-full min-w-[500px] print:min-w-0">
          <thead>
            <tr className="bg-green-700 text-white">
              <th className="text-left py-2 sm:py-3 px-4 font-semibold text-xs sm:text-sm print:py-3">Description</th>
              <th className="text-center py-2 sm:py-3 px-4 font-semibold text-xs sm:text-sm print:py-3">Qty</th>
              <th className="text-right py-2 sm:py-3 px-4 font-semibold text-xs sm:text-sm print:py-3">Unit Price</th>
              <th className="text-right py-2 sm:py-3 px-4 font-semibold text-xs sm:text-sm print:py-3">Amount</th>
          </tr>
        </thead>
          <tbody>
            {items.map((item: any, index: number) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                <td className="py-2 sm:py-3 px-4 text-xs sm:text-sm md:text-base print:py-3">{item.description}</td>
                <td className="text-center py-2 sm:py-3 px-4 text-xs sm:text-sm md:text-base print:py-3">{item.quantity}</td>
                <td className="text-right py-2 sm:py-3 px-4 text-xs sm:text-sm md:text-base print:py-3">{formatCurrency(item.unitPrice)}</td>
                <td className="text-right py-2 sm:py-3 px-4 text-xs sm:text-sm md:text-base font-semibold print:py-3">{formatCurrency(item.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      <div className="flex justify-end mb-4 sm:mb-6 md:mb-8 print:mb-8">
        <div className="w-full sm:w-96 print:w-96">
          <div className="bg-gray-50 p-4 sm:p-6 print:p-6">
            <div className="flex justify-between py-2 text-xs sm:text-sm md:text-base">
              <span className="text-gray-700">Subtotal</span>
              <span className="font-medium">{formatCurrency(invoice.subtotal)}</span>
            </div>
            {invoice.taxRate > 0 && (
              <div className="flex justify-between py-2 text-xs sm:text-sm md:text-base">
                <span className="text-gray-700">Tax ({invoice.taxRate}%)</span>
                <span className="font-medium">{formatCurrency(invoice.taxAmount)}</span>
              </div>
            )}
            <div className="border-t-2 border-green-700 mt-3 pt-3 flex justify-between text-base sm:text-lg md:text-xl">
              <span className="font-bold text-green-800">Total Due</span>
              <span className="font-bold text-green-800">{formatCurrency(invoice.total)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      {invoice.notes && (
        <div className="bg-green-50 p-4 border-l-4 border-green-700">
          <p className="text-xs sm:text-sm text-gray-700">{invoice.notes}</p>
        </div>
      )}

      {invoice.terms && (
        <div className="mt-4 text-xs text-gray-500">
          <p>{invoice.terms}</p>
        </div>
      )}
    </div>
  );
};
