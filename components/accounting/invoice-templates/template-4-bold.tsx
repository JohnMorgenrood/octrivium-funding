// Template 4: Bold & Colorful - Purple theme with side logo
export const Template4Bold = ({ invoice, user, customer, items }: any) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
    }).format(amount);
  };

  return (
    <div className="bg-white max-w-4xl mx-auto flex flex-col sm:flex-row print:flex-row print:max-w-full print:m-0">
      <style jsx>{`
        @media print {
          @page { size: A4; margin: 15mm; }
          body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
          .print\\:hidden { display: none !important; }
        }
      `}</style>
      {/* Colored Sidebar */}
      <div className="w-full sm:w-48 bg-gradient-to-b from-purple-600 to-purple-900 text-white p-4 sm:p-6 flex flex-col sm:flex-col items-center justify-start print:w-48 print:p-6">
        {user.companyLogo ? (
          <img src={user.companyLogo} alt="Logo" className="h-16 sm:h-20 mb-4 object-contain print:h-20" style={{maxWidth: '200px'}} />
        ) : (
          <div className="h-16 w-16 sm:h-20 sm:w-20 bg-white rounded-full flex items-center justify-center text-purple-600 text-xl sm:text-2xl font-bold mb-4 print:h-20 print:w-20">
            {user.companyName?.charAt(0) || user.firstName?.charAt(0)}
          </div>
        )}
        <p className="text-center text-xs sm:text-sm font-semibold mb-1">{user.companyName || `${user.firstName} ${user.lastName}`}</p>
        <p className="text-center text-xs text-purple-200">{user.email}</p>
        
        <div className="mt-4 sm:mt-8 w-full print:mt-8">
          <div className="bg-purple-800/50 p-3 rounded mb-2">
            <p className="text-xs text-purple-200 mb-1">Issue Date</p>
            <p className="text-xs sm:text-sm font-medium">{new Date(invoice.issueDate).toLocaleDateString()}</p>
          </div>
          <div className="bg-purple-800/50 p-3 rounded">
            <p className="text-xs text-purple-200 mb-1">Due Date</p>
            <p className="text-xs sm:text-sm font-medium">{new Date(invoice.dueDate).toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 sm:p-6 md:p-8 print:p-8">
        <div className="mb-4 sm:mb-6 md:mb-8 print:mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-purple-900 mb-2">
            {invoice.documentType === 'QUOTE' ? 'QUOTATION' : 'INVOICE'}
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-purple-600">{invoice.invoiceNumber}</p>
        </div>

        {/* Customer Info */}
        <div className="bg-purple-50 p-4 sm:p-6 rounded-lg mb-4 sm:mb-6 md:mb-8 print:p-6 print:mb-8">
          <p className="text-xs text-purple-600 font-semibold uppercase mb-2">Billed To</p>
          <p className="text-base sm:text-lg font-semibold text-gray-900">{customer.name}</p>
          {customer.company && <p className="text-xs sm:text-sm md:text-base text-gray-600">{customer.company}</p>}
          {customer.email && <p className="text-xs sm:text-sm md:text-base text-gray-600">{customer.email}</p>}
        </div>

        {/* Items */}
        <div className="overflow-x-auto mb-4 sm:mb-6 md:mb-8 print:overflow-visible print:mb-8">
          <table className="w-full min-w-[500px] print:min-w-0">
            <thead>
              <tr className="bg-purple-900 text-white">
                <th className="text-left py-2 sm:py-3 px-4 rounded-tl-lg text-xs sm:text-sm print:py-3">Item</th>
                <th className="text-center py-2 sm:py-3 px-4 text-xs sm:text-sm print:py-3">Qty</th>
                <th className="text-right py-2 sm:py-3 px-4 text-xs sm:text-sm print:py-3">Price</th>
                <th className="text-right py-2 sm:py-3 px-4 rounded-tr-lg text-xs sm:text-sm print:py-3">Total</th>
            </tr>
          </thead>
            <tbody>
              {items.map((item: any, index: number) => (
                <tr key={index} className="border-b border-gray-200">
                  <td className="py-3 sm:py-4 px-4 text-xs sm:text-sm md:text-base print:py-4">{item.description}</td>
                  <td className="text-center py-3 sm:py-4 px-4 text-xs sm:text-sm md:text-base print:py-4">{item.quantity}</td>
                  <td className="text-right py-3 sm:py-4 px-4 text-xs sm:text-sm md:text-base print:py-4">{formatCurrency(item.unitPrice)}</td>
                  <td className="text-right py-3 sm:py-4 px-4 text-xs sm:text-sm md:text-base font-semibold print:py-4">{formatCurrency(item.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="flex justify-end">
          <div className="w-full sm:w-72 bg-purple-50 p-4 sm:p-6 rounded-lg print:w-72 print:p-6">
            <div className="flex justify-between py-2 text-xs sm:text-sm md:text-base text-gray-700">
              <span>Subtotal</span>
              <span className="font-medium">{formatCurrency(invoice.subtotal)}</span>
            </div>
            {invoice.taxRate > 0 && (
              <div className="flex justify-between py-2 text-xs sm:text-sm md:text-base text-gray-700">
                <span>Tax ({invoice.taxRate}%)</span>
                <span className="font-medium">{formatCurrency(invoice.taxAmount)}</span>
              </div>
            )}
            <div className="flex justify-between py-3 sm:py-4 border-t-2 border-purple-300 text-lg sm:text-xl font-bold text-purple-900 print:py-4">
              <span>Total</span>
              <span>{formatCurrency(invoice.total)}</span>
            </div>
          </div>
        </div>

        {invoice.notes && (
          <div className="mt-4 sm:mt-6 md:mt-8 text-xs sm:text-sm text-gray-600 border-l-4 border-purple-600 pl-4 print:mt-8">
            {invoice.notes}
          </div>
        )}
      </div>
    </div>
  );
};
